from __future__ import annotations

import time
from io import BytesIO
from typing import Optional

from PIL import Image

from .search import SCALE_STEPS, SearchResult

# PNG is lossless - there is no quality knob. Size reduction comes from
# palette quantization instead (see DEVELOPMENT.md 2). `quality` on the
# returned SearchResult is repurposed to mean "palette colors used"
# (256 = full color, no quantization applied).
PALETTE_SIZES = (256, 192, 128, 96, 64, 48, 32, 16)
TIME_BUDGET_SECONDS = 8.0
MAX_ATTEMPTS = 20


def _encode_lossless(image: Image.Image) -> bytes:
    buf = BytesIO()
    image.save(buf, format="PNG", optimize=True, compress_level=9)
    return buf.getvalue()


def _resize(image: Image.Image, scale: float) -> Image.Image:
    if scale >= 1.0:
        return image
    size = (max(1, round(image.width * scale)), max(1, round(image.height * scale)))
    return image.resize(size, Image.LANCZOS)


def _encode_quantized(image: Image.Image, colors: int) -> bytes:
    # Measured directly (see gif.py, which already made this switch): for
    # both RGB and RGBA, FASTOCTREE is several times faster than MEDIANCUT
    # *and* produces a smaller file for photographic content on this
    # codebase's search content - not a quality/speed tradeoff, MEDIANCUT
    # was strictly worse on both axes and was blowing the time budget
    # partway through the palette sweep as a result.
    quantized = image.quantize(colors=colors, method=Image.FASTOCTREE)
    buf = BytesIO()
    quantized.save(buf, format="PNG", optimize=True, compress_level=9)
    return buf.getvalue()


def optimize_png(image: Image.Image, target_bytes: Optional[int]) -> SearchResult:
    start = time.monotonic()
    attempts = 0

    has_alpha = image.mode in ("RGBA", "LA") or (
        image.mode == "P" and "transparency" in image.info
    )
    base = image.convert("RGBA") if has_alpha else image.convert("RGB")

    lossless_data = _encode_lossless(base)
    attempts += 1

    if target_bytes is None or len(lossless_data) <= target_bytes:
        return SearchResult(
            data=lossless_data,
            scale=1.0,
            quality=256,
            size_bytes=len(lossless_data),
            attempts=attempts,
            elapsed_ms=(time.monotonic() - start) * 1000,
            target_met=True,
            target_bytes=target_bytes,
        )

    def budget_left() -> bool:
        return attempts < MAX_ATTEMPTS and (time.monotonic() - start) < TIME_BUDGET_SECONDS

    best_data = lossless_data
    best_colors = 256
    best_scale = 1.0
    met = False

    # Full palette sweep at full resolution first - the quality-preserving
    # attempt, and the common case (most targets are reachable this way).
    for colors in PALETTE_SIZES:
        if not budget_left():
            break
        data = _encode_quantized(base, colors)
        attempts += 1
        best_data, best_colors = data, colors
        if len(data) <= target_bytes:
            met = True
            break

    # Only the smallest palette (16 colors) still didn't fit even at full
    # resolution - fall back to shrinking dimensions too, one cheap attempt
    # per scale step, same downscale fallback JPEG/WebP/AVIF/BMP/TIFF
    # already have via search.py. Palette reduction alone has a floor (16
    # colors still keeps every source pixel), which a large enough image
    # can exceed no matter how few colors are used.
    if not met:
        for scale in SCALE_STEPS[1:]:
            if not budget_left():
                break
            data = _encode_quantized(_resize(base, scale), PALETTE_SIZES[-1])
            attempts += 1
            best_data, best_colors, best_scale = data, PALETTE_SIZES[-1], scale
            if len(data) <= target_bytes:
                break

    elapsed_ms = (time.monotonic() - start) * 1000
    return SearchResult(
        data=best_data,
        scale=best_scale,
        quality=best_colors,
        size_bytes=len(best_data),
        attempts=attempts,
        elapsed_ms=elapsed_ms,
        target_met=len(best_data) <= target_bytes,
        target_bytes=target_bytes,
    )
