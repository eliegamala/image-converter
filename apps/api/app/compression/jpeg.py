from __future__ import annotations

from io import BytesIO
from typing import Optional

from PIL import Image

from .search import SearchResult, search_quality_scale


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


def _resize(image: Image.Image, scale: float) -> Image.Image:
    if scale >= 1.0:
        return image
    size = (max(1, round(image.width * scale)), max(1, round(image.height * scale)))
    return image.resize(size, Image.LANCZOS)


def optimize_jpeg(image: Image.Image, target_bytes: Optional[int]) -> SearchResult:
    base = _flatten_alpha_to_white(image)

    # JPEG encode is cheap (tens of ms) - no fast/final split needed, per
    # DEVELOPMENT.md 2 ("Encoder settings actually used").
    def encode(scale: float, quality: int) -> bytes:
        buf = BytesIO()
        _resize(base, scale).save(
            buf, format="JPEG", quality=quality, optimize=True, progressive=True
        )
        return buf.getvalue()

    return search_quality_scale(encode, target_bytes)
