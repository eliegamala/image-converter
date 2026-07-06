from __future__ import annotations

from io import BytesIO
from typing import Optional

import pillow_avif  # noqa: F401  registers AVIF encode/decode with Pillow
from PIL import Image

from .search import SearchResult, search_quality_scale

PREVIEW_SPEED = 10
FINAL_SPEED = 6


def _prepare(image: Image.Image) -> Image.Image:
    has_alpha = image.mode in ("RGBA", "LA") or (
        image.mode == "P" and "transparency" in image.info
    )
    return image.convert("RGBA") if has_alpha else image.convert("RGB")


def _resize(image: Image.Image, scale: float) -> Image.Image:
    if scale >= 1.0:
        return image
    size = (max(1, round(image.width * scale)), max(1, round(image.height * scale)))
    return image.resize(size, Image.LANCZOS)


def _encode(image: Image.Image, scale: float, quality: int, speed: int) -> bytes:
    buf = BytesIO()
    _resize(image, scale).save(buf, format="AVIF", quality=quality, speed=speed)
    return buf.getvalue()


def optimize_avif(image: Image.Image, target_bytes: Optional[int]) -> SearchResult:
    base = _prepare(image)

    def preview_encode(scale: float, quality: int) -> bytes:
        return _encode(base, scale, quality, PREVIEW_SPEED)

    result = search_quality_scale(preview_encode, target_bytes)

    final_data = _encode(base, result.scale, result.quality, FINAL_SPEED)
    result.data = final_data
    result.size_bytes = len(final_data)
    return result
