from __future__ import annotations

from io import BytesIO
from typing import Optional

from PIL import Image

from .. import heif_support  # noqa: F401  registers HEIC decode with Pillow in worker processes
from .avif import optimize_avif
from .bmp import optimize_bmp
from .content_signal import recommend_format
from .gif import optimize_gif
from .jpeg import optimize_jpeg
from .pdf import optimize_pdf
from .png import optimize_png
from .search import SearchResult
from .tiff import optimize_tiff
from .webp import optimize_webp

SUPPORTED_FORMATS = {"JPEG", "PNG", "WEBP", "AVIF", "GIF", "BMP", "TIFF", "PDF"}

_OPTIMIZERS = {
    "JPEG": optimize_jpeg,
    "PNG": optimize_png,
    "WEBP": optimize_webp,
    "AVIF": optimize_avif,
    "GIF": optimize_gif,
    "BMP": optimize_bmp,
    "TIFF": optimize_tiff,
    "PDF": optimize_pdf,
}


def optimize_image(image: Image.Image, fmt: str, target_bytes: Optional[int]) -> SearchResult:
    return _OPTIMIZERS[fmt](image, target_bytes)


def run_optimize_worker(data: bytes, fmt: str, target_bytes: Optional[int]) -> SearchResult:
    """Entry point run inside the ProcessPoolExecutor worker.

    Re-decodes from raw bytes rather than accepting a PIL Image object, so
    the only thing crossing the process boundary is a plain bytes/str/int
    tuple - keeps this safe under Windows' spawn start method regardless of
    PIL Image picklability.
    """
    image = Image.open(BytesIO(data))
    image.load()
    return optimize_image(image, fmt, target_bytes)


def run_recommend_format_worker(data: bytes) -> str:
    """Entry point run inside the ProcessPoolExecutor worker for format
    recommendation - same bytes-in, decode-in-worker pattern as above."""
    image = Image.open(BytesIO(data))
    image.load()
    return recommend_format(image)
