from __future__ import annotations

from fastapi.testclient import TestClient

from app.main import app
from tests.conftest import image_to_bytes


def test_health():
    with TestClient(app) as client:
        response = client.get("/api/health")
        assert response.status_code == 200
        assert response.json() == {"status": "ok"}


def test_optimize_jpeg_end_to_end(photo_image):
    with TestClient(app) as client:
        response = client.post(
            "/api/optimize",
            files={"file": ("photo.png", image_to_bytes(photo_image), "image/png")},
            data={"format": "jpeg", "target_bytes": "100000"},
        )
        assert response.status_code == 200
        assert response.headers["content-type"] == "image/jpeg"
        assert int(response.headers["x-output-bytes"]) <= 100_000
        assert response.headers["x-target-met"] == "true"


def test_optimize_rejects_unsupported_format(photo_image):
    with TestClient(app) as client:
        response = client.post(
            "/api/optimize",
            files={"file": ("photo.png", image_to_bytes(photo_image), "image/png")},
            data={"format": "svg"},  # not supported: vector format, needs vectorization
        )
        assert response.status_code == 400


def test_optimize_rejects_non_image_upload():
    with TestClient(app) as client:
        response = client.post(
            "/api/optimize",
            files={"file": ("not-an-image.txt", b"hello world", "text/plain")},
            data={"format": "webp"},
        )
        assert response.status_code == 400


def test_cors_preflight_allows_configured_origin():
    with TestClient(app) as client:
        response = client.options(
            "/api/optimize",
            headers={
                "Origin": "http://localhost:3000",
                "Access-Control-Request-Method": "POST",
            },
        )
        assert response.status_code in (200, 204)
        assert response.headers["access-control-allow-origin"] == "http://localhost:3000"


def test_alpha_flatten_end_to_end(transparent_png_image):
    with TestClient(app) as client:
        response = client.post(
            "/api/optimize",
            files={"file": ("t.png", image_to_bytes(transparent_png_image), "image/png")},
            data={"format": "jpeg"},
        )
        assert response.status_code == 200
        from io import BytesIO

        from PIL import Image

        decoded = Image.open(BytesIO(response.content)).convert("RGB")
        assert decoded.getpixel((10, 10)) == (255, 255, 255)
