from __future__ import annotations

from io import BytesIO
from typing import Optional

from PIL import Image

from .search import SearchResult, search_quality_scale

# libwebp's method scale is the OPPOSITE direction from AVIF's speed: 0 is
# fastest, 6 is slowest/most-exhaustive. Measured directly against this
# codebase's actual search content (see apps/api/benchmark.py and the
# isolated per-method timings in PR history): methods 3-6 cost 2-4x more
# than 0-2 for a *quality-95* encode while producing an equal or even
# slightly larger file (method 6 does not win on size at high quality) -
# there is no tradeoff being given up by preferring a low method there.
# Method only earns its cost at lower quality (the binary search's target-
# size path), where higher methods measured ~10-15% smaller at several
# times the cost - real, but not worth paying on every preview attempt.
PREVIEW_METHOD = 2
# One step up from preview for the single final delivery re-encode (see
# search.py's docstring on the fast-search/slow-final pattern) - still
# roughly half the cost of the old value of 6 at every quality level
# measured, most of which bought nothing at high quality and only a modest
# size reduction at low quality.
FINAL_METHOD = 4


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


def _encode(image: Image.Image, scale: float, quality: int, method: int) -> bytes:
    buf = BytesIO()
    _resize(image, scale).save(buf, format="WEBP", quality=quality, method=method)
    return buf.getvalue()


def optimize_webp(image: Image.Image, target_bytes: Optional[int]) -> SearchResult:
    base = _prepare(image)

    def preview_encode(scale: float, quality: int) -> bytes:
        return _encode(base, scale, quality, PREVIEW_METHOD)

    result = search_quality_scale(preview_encode, target_bytes)

    # One slow/exhaustive re-encode of the winning combination for delivery.
    final_data = _encode(base, result.scale, result.quality, FINAL_METHOD)
    result.data = final_data
    result.size_bytes = len(final_data)
    return result
