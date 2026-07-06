"""Load test for /api/optimize - validates the ProcessPoolExecutor fix
actually prevents concurrent requests from serializing behind each other
(the gap DEVELOPMENT.md explicitly flagged as never tested).

Run with: locust -f locustfile.py --host http://127.0.0.1:8000
"""
from __future__ import annotations

import io
from functools import lru_cache

import numpy as np
from locust import HttpUser, between, task
from PIL import Image


@lru_cache(maxsize=1)
def _sample_image_bytes() -> bytes:
    rng = np.random.default_rng(7)
    w, h = 1600, 1200
    x = np.linspace(0, 1, w)
    y = np.linspace(0, 1, h)
    xx, yy = np.meshgrid(x, y)
    base = np.sin(xx * 10) * np.cos(yy * 8) * 127 + 128
    noise = rng.normal(0, 15, (h, w))
    arr = np.clip(base + noise, 0, 255).astype("uint8")
    rgb = np.stack([arr, np.roll(arr, 50, axis=0), np.roll(arr, 100, axis=1)], axis=-1)
    buf = io.BytesIO()
    Image.fromarray(rgb, "RGB").save(buf, format="PNG")
    return buf.getvalue()


class OptimizeUser(HttpUser):
    wait_time = between(0.1, 0.5)

    @task
    def optimize_webp(self):
        files = {"file": ("photo.png", _sample_image_bytes(), "image/png")}
        data = {"format": "webp", "target_bytes": "150000"}
        self.client.post("/api/optimize", files=files, data=data)

    @task
    def health(self):
        self.client.get("/api/health")
