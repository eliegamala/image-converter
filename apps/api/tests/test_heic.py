from __future__ import annotations

from io import BytesIO

from fastapi.testclient import TestClient
from PIL import Image

from app import heif_support  # noqa: F401  registers HEIC decode
from app.compression import optimize_image, run_optimize_worker
from app.main import app
from app.security import load_and_validate_image


def test_load_and_validate_image_decodes_real_heic(heic_bytes):
    image = load_and_validate_image(heic_bytes)
    assert image.width > 0 and image.height > 0


def test_heic_converts_to_each_output_format(heic_bytes):
    image = load_and_validate_image(heic_bytes)
    for fmt in ("JPEG", "PNG", "WEBP", "AVIF"):
        result = optimize_image(image, fmt, target_bytes=None)
        assert len(result.data) > 0


def test_heic_worker_decode_path(heic_bytes):
    """run_optimize_worker re-decodes from raw bytes in a fresh process in
    production - exercise that exact path, not just the in-process one."""
    result = run_optimize_worker(heic_bytes, "JPEG", None)
    decoded = Image.open(BytesIO(result.data))
    assert decoded.format == "JPEG"


def test_optimize_endpoint_accepts_heic_upload(heic_bytes):
    with TestClient(app) as client:
        response = client.post(
            "/api/optimize",
            files={"file": ("photo.heic", heic_bytes, "image/heic")},
            data={"format": "jpeg"},
        )
        assert response.status_code == 200
        assert response.headers["content-type"] == "image/jpeg"
