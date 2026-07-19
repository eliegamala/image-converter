from __future__ import annotations

from io import BytesIO

import numpy as np
import pytest
from PIL import Image


@pytest.fixture
def photo_image() -> Image.Image:
    """A synthetic, photo-like image (smooth gradient + noise) - not a flat
    graphic - so quality-based codecs have real work to do."""
    rng = np.random.default_rng(42)
    w, h = 1600, 1200
    x = np.linspace(0, 1, w)
    y = np.linspace(0, 1, h)
    xx, yy = np.meshgrid(x, y)
    base = np.sin(xx * 10) * np.cos(yy * 8) * 127 + 128
    noise = rng.normal(0, 15, (h, w))
    arr = np.clip(base + noise, 0, 255).astype("uint8")
    rgb = np.stack([arr, np.roll(arr, 50, axis=0), np.roll(arr, 100, axis=1)], axis=-1)
    return Image.fromarray(rgb, "RGB")


@pytest.fixture
def transparent_png_image() -> Image.Image:
    """A 400x400 RGBA image: transparent background, opaque red square in
    the middle - used to verify alpha handling per format."""
    img = Image.new("RGBA", (400, 400), (0, 0, 0, 0))
    px = img.load()
    for i in range(100, 300):
        for j in range(100, 300):
            px[i, j] = (255, 0, 0, 255)
    return img


def image_to_bytes(image: Image.Image, fmt: str = "PNG") -> bytes:
    buf = BytesIO()
    image.save(buf, format=fmt)
    return buf.getvalue()


@pytest.fixture
def heic_bytes(photo_image) -> bytes:
    """A real HEIC-encoded file (not just a renamed JPEG) to prove decode
    support actually works, not just that the extension is accepted."""
    import pillow_heif

    heif_file = pillow_heif.from_pillow(photo_image)
    buf = BytesIO()
    heif_file.save(buf, format="HEIF")
    return buf.getvalue()
