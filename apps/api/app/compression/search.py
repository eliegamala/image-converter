"""Binary-search compression core shared by the JPEG/WebP/AVIF encoders.

This is a direct port of the algorithm validated by hand and then in code in
the original build (see DEVELOPMENT.md 3.2-3.3): binary search over quality
per scale step instead of a linear scan, a soft quality floor that prefers
downscaling over visible artifacting, and a hard attempt/time budget that
acts as a circuit breaker so one adversarial image can't hang a request.

A content-signal-seeded starting guess was tried here and measured against
this floor-first baseline across varied images/targets (see PR history) -
it did not reliably reduce attempts (roughly break-even to slightly worse
in aggregate), so it was not shipped. The floor-first search below is what
was actually measured to work.
"""
from __future__ import annotations

import time
from dataclasses import dataclass
from typing import Callable, Optional

QUALITY_FLOOR = 40
QUALITY_MIN = 1
QUALITY_MAX = 95
SCALE_STEPS = (1.0, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3)
TIME_BUDGET_SECONDS = 8.0
MAX_ATTEMPTS = 40

Encoder = Callable[[float, int], bytes]


@dataclass
class _Attempt:
    scale: float
    quality: int
    size_bytes: int


@dataclass
class SearchResult:
    data: bytes
    scale: float
    quality: int
    size_bytes: int
    attempts: int
    elapsed_ms: float
    target_met: bool
    target_bytes: Optional[int]


def search_quality_scale(encode: Encoder, target_bytes: Optional[int]) -> SearchResult:
    """Find the (scale, quality) that best fits target_bytes.

    `encode(scale, quality)` must use fast/preview encoder settings; the
    caller re-encodes the winning combination with slow/exhaustive settings
    afterwards (see webp.py / avif.py) since that only has to happen once.
    """
    start = time.monotonic()
    attempts = 0

    def budget_left() -> bool:
        return attempts < MAX_ATTEMPTS and (time.monotonic() - start) < TIME_BUDGET_SECONDS

    def try_encode(scale: float, quality: int) -> bytes:
        nonlocal attempts
        attempts += 1
        return encode(scale, quality)

    if target_bytes is None:
        # No user-specified target: this is a "smallest possible at best
        # quality" request, not a search - report success, not a false
        # "target not reachable" (the semantics bug fixed in DEVELOPMENT.md 3.3.7).
        data = try_encode(1.0, QUALITY_MAX)
        return SearchResult(
            data=data,
            scale=1.0,
            quality=QUALITY_MAX,
            size_bytes=len(data),
            attempts=attempts,
            elapsed_ms=(time.monotonic() - start) * 1000,
            target_met=True,
            target_bytes=None,
        )

    best: Optional[_Attempt] = None
    best_data: Optional[bytes] = None
    fallback: Optional[_Attempt] = None
    fallback_data: Optional[bytes] = None

    for scale in SCALE_STEPS:
        if not budget_left():
            break

        floor_data = try_encode(scale, QUALITY_FLOOR)
        if len(floor_data) > target_bytes:
            # Even the quality floor doesn't fit at this scale. Prefer
            # downscaling further over dropping below the floor - remember
            # this as a last-resort fallback and try a smaller scale.
            if fallback is None or len(floor_data) < fallback.size_bytes:
                fallback = _Attempt(scale, QUALITY_FLOOR, len(floor_data))
                fallback_data = floor_data
            continue

        # Floor fits at this (the least-downscaled remaining) scale - binary
        # search upward for the best quality that still fits.
        lo, hi = QUALITY_FLOOR, QUALITY_MAX
        best = _Attempt(scale, lo, len(floor_data))
        best_data = floor_data
        while lo < hi and budget_left():
            mid = (lo + hi + 1) // 2
            data = try_encode(scale, mid)
            if len(data) <= target_bytes:
                best = _Attempt(scale, mid, len(data))
                best_data = data
                lo = mid
            else:
                hi = mid - 1
        break  # least-downscaled fitting scale found; stop here

    elapsed_ms = (time.monotonic() - start) * 1000

    if best is not None and best_data is not None:
        return SearchResult(
            data=best_data,
            scale=best.scale,
            quality=best.quality,
            size_bytes=best.size_bytes,
            attempts=attempts,
            elapsed_ms=elapsed_ms,
            target_met=True,
            target_bytes=target_bytes,
        )

    if fallback is not None and fallback_data is not None:
        # Nothing at/above the floor fit at any scale tried. Fall back to a
        # below-floor binary search at the smallest scale attempted.
        lo, hi = QUALITY_MIN, QUALITY_FLOOR - 1
        scale = fallback.scale
        best_sub = fallback
        best_sub_data = fallback_data
        while lo < hi and budget_left():
            mid = (lo + hi + 1) // 2
            data = try_encode(scale, mid)
            if len(data) <= target_bytes:
                best_sub = _Attempt(scale, mid, len(data))
                best_sub_data = data
                lo = mid
            else:
                hi = mid - 1
        elapsed_ms = (time.monotonic() - start) * 1000
        return SearchResult(
            data=best_sub_data,
            scale=best_sub.scale,
            quality=best_sub.quality,
            size_bytes=best_sub.size_bytes,
            attempts=attempts,
            elapsed_ms=elapsed_ms,
            target_met=best_sub.size_bytes <= target_bytes,
            target_bytes=target_bytes,
        )

    # Circuit breaker tripped before any scale step even completed once -
    # return the smallest/lowest-quality encode tried as an absolute last resort.
    data = try_encode(SCALE_STEPS[-1], QUALITY_MIN)
    return SearchResult(
        data=data,
        scale=SCALE_STEPS[-1],
        quality=QUALITY_MIN,
        size_bytes=len(data),
        attempts=attempts,
        elapsed_ms=(time.monotonic() - start) * 1000,
        target_met=len(data) <= target_bytes,
        target_bytes=target_bytes,
    )
