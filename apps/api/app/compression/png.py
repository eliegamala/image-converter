from __future__ import annotations

import time
from io import BytesIO
from typing import Optional

from PIL import Image

from .search import SearchResult

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


def _encode_quantized(image: Image.Image, colors: int) -> bytes:
    # MEDIANCUT doesn't support RGBA - FASTOCTREE is Pillow's own fallback
    # for alpha-carrying images (see PIL.Image.quantize).
    method = Image.FASTOCTREE if image.mode == "RGBA" else Image.MEDIANCUT
    quantized = image.quantize(colors=colors, method=method)
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

    best_data = lossless_data
    best_colors = 256
    for colors in PALETTE_SIZES:
        if attempts >= MAX_ATTEMPTS or (time.monotonic() - start) >= TIME_BUDGET_SECONDS:
            break
        data = _encode_quantized(base, colors)
        attempts += 1
        best_data, best_colors = data, colors
        if len(data) <= target_bytes:
            break

    elapsed_ms = (time.monotonic() - start) * 1000
    return SearchResult(
        data=best_data,
        scale=1.0,
        quality=best_colors,
        size_bytes=len(best_data),
        attempts=attempts,
        elapsed_ms=elapsed_ms,
        target_met=len(best_data) <= target_bytes,
        target_bytes=target_bytes,
    )
