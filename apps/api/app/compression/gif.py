from __future__ import annotations

import time
from io import BytesIO
from typing import Optional

from PIL import Image

from .search import SearchResult

# GIF is always palette-based (256 colors max even at "full quality"), so
# unlike JPEG/WebP/AVIF there's no continuous quality knob - size reduction
# beyond the default encode comes from shrinking the palette further, the
# same lever png.py uses. `quality` on the returned SearchResult means
# "palette colors used" here too.
PALETTE_SIZES = (256, 192, 128, 96, 64, 48, 32, 16)
TIME_BUDGET_SECONDS = 8.0
MAX_ATTEMPTS = 20


def _flatten_alpha_to_white(image: Image.Image) -> Image.Image:
    has_alpha = image.mode in ("RGBA", "LA") or (
        image.mode == "P" and "transparency" in image.info
    )
    if not has_alpha:
        return image.convert("RGB")
    rgba = image.convert("RGBA")
    background = Image.new("RGB", rgba.size, (255, 255, 255))
    background.paste(rgba, mask=rgba.split()[3])
    return background


def _encode_default(image: Image.Image) -> bytes:
    buf = BytesIO()
    image.save(buf, format="GIF")
    return buf.getvalue()


def _encode_quantized(image: Image.Image, colors: int) -> bytes:
    # Measured directly: FASTOCTREE is ~19x faster than MEDIANCUT for this
    # (1568ms vs 81ms at colors=64 on a 1600x1200 photo) *and* produced a
    # smaller file (748KB vs 1053KB) - MEDIANCUT was blowing the search's
    # time budget after only 5-6 palette attempts.
    quantized = image.quantize(colors=colors, method=Image.FASTOCTREE)
    buf = BytesIO()
    quantized.save(buf, format="GIF")
    return buf.getvalue()


def optimize_gif(image: Image.Image, target_bytes: Optional[int]) -> SearchResult:
    start = time.monotonic()
    attempts = 0

    # GIF has no real alpha channel (only a single fully-transparent palette
    # index) - flatten to white for predictable results, same as JPEG/PDF/BMP/TIFF.
    base = _flatten_alpha_to_white(image)

    default_data = _encode_default(base)
    attempts += 1

    if target_bytes is None or len(default_data) <= target_bytes:
        return SearchResult(
            data=default_data,
            scale=1.0,
            quality=256,
            size_bytes=len(default_data),
            attempts=attempts,
            elapsed_ms=(time.monotonic() - start) * 1000,
            target_met=True,
            target_bytes=target_bytes,
        )

    best_data = default_data
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
