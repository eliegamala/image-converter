from __future__ import annotations

from io import BytesIO
from typing import Optional

from PIL import Image

from .search import SearchResult, search_downscale_only


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


def optimize_tiff(image: Image.Image, target_bytes: Optional[int]) -> SearchResult:
    # Measured directly across compression modes on a real photo: LZW was
    # actually *larger* than uncompressed for noisy/photographic content
    # (doesn't suit high-entropy data), while deflate/zip reliably shrank
    # it a bit. Either way there's no quality knob - deflate is the best
    # lossless default, and downscaling is what actually moves the needle
    # toward a target size.
    base = _flatten_alpha_to_white(image)

    def encode(scale: float) -> bytes:
        buf = BytesIO()
        _resize(base, scale).save(buf, format="TIFF", compression="tiff_deflate")
        return buf.getvalue()

    return search_downscale_only(encode, target_bytes)
