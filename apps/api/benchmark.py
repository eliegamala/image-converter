"""Local before/after benchmark for /api/recommend-format and /api/optimize.

Posts the same synthetic photo (matches tests/conftest.py's photo_image
fixture - smooth gradient + noise, so quality-based codecs have real work
to do) against a locally running server and reports wall-clock time per
endpoint/format. Not a load test (see locustfile.py for that) - this
measures single-request latency, which is what the reported "14-15s per
conversion" complaint is about.

Run with the API already up locally:
    uvicorn app.main:app --port 8000
    python benchmark.py
"""
from __future__ import annotations

import io
import statistics
import sys
import time

import httpx
import numpy as np
from PIL import Image

HOST = "http://127.0.0.1:8000"
RUNS = 3


def _sample_image_bytes() -> bytes:
    rng = np.random.default_rng(42)
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


def _time_it(fn, runs=RUNS):
    times = []
    result = None
    for _ in range(runs):
        start = time.perf_counter()
        result = fn()
        times.append(time.perf_counter() - start)
    return times, result


def bench_recommend(client: httpx.Client, image_bytes: bytes):
    def call():
        files = {"file": ("photo.png", image_bytes, "image/png")}
        resp = client.post(f"{HOST}/api/recommend-format", files=files, timeout=60)
        resp.raise_for_status()
        return resp.json()

    return _time_it(call)


def bench_optimize(client: httpx.Client, image_bytes: bytes, fmt: str, target_bytes=None):
    def call():
        files = {"file": ("photo.png", image_bytes, "image/png")}
        data = {"format": fmt}
        if target_bytes:
            data["target_bytes"] = str(target_bytes)
        resp = client.post(f"{HOST}/api/optimize", files=files, data=data, timeout=120)
        resp.raise_for_status()
        return {
            "output_bytes": len(resp.content),
            "quality": resp.headers.get("x-quality"),
            "scale": resp.headers.get("x-scale"),
            "target_met": resp.headers.get("x-target-met"),
            "server_elapsed_ms": resp.headers.get("x-elapsed-ms"),
        }

    return _time_it(call)


def report(label: str, times: list[float], extra: str = ""):
    print(
        f"{label:38s} min={min(times)*1000:8.1f}ms  "
        f"median={statistics.median(times)*1000:8.1f}ms  "
        f"max={max(times)*1000:8.1f}ms  {extra}"
    )


def main():
    image_bytes = _sample_image_bytes()
    print(f"Test image: {len(image_bytes):,} bytes (1600x1200 synthetic photo)\n")

    with httpx.Client() as client:
        try:
            client.get(f"{HOST}/api/health", timeout=5).raise_for_status()
        except Exception as exc:
            print(f"Server not reachable at {HOST}: {exc}", file=sys.stderr)
            sys.exit(1)

        times, rec_result = bench_recommend(client, image_bytes)
        report("recommend-format", times, extra=str(rec_result))

        for fmt in ("avif", "webp"):
            times, opt_result = bench_optimize(client, image_bytes, fmt)
            report(f"optimize -> {fmt} (best quality)", times, extra=str(opt_result))

        for fmt in ("avif", "webp"):
            times, opt_result = bench_optimize(client, image_bytes, fmt, target_bytes=50_000)
            report(f"optimize -> {fmt} (target 50KB)", times, extra=str(opt_result))


if __name__ == "__main__":
    main()
