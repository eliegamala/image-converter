from __future__ import annotations

import asyncio
import time
from concurrent.futures import ProcessPoolExecutor
from contextlib import asynccontextmanager
from typing import Optional

from fastapi import FastAPI, File, Form, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from .compression import SUPPORTED_FORMATS, run_optimize_worker, run_recommend_format_worker
from .config import ALLOWED_ORIGINS, PROCESS_POOL_WORKERS, RATE_LIMIT
from .models import HealthResponse, RecommendFormatResponse
from .security import ImageTooLargeError, InvalidImageError, load_and_validate_image

limiter = Limiter(key_func=get_remote_address)

_executor: Optional[ProcessPoolExecutor] = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global _executor
    # CPU-bound Pillow/libavif encoding must not run inline on the asyncio
    # event loop - it would serialize every concurrent request behind it.
    _executor = ProcessPoolExecutor(max_workers=PROCESS_POOL_WORKERS)
    try:
        yield
    finally:
        _executor.shutdown(wait=True)
        _executor = None


app = FastAPI(title="ImageConvert API", lifespan=lifespan)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=[
        "X-Original-Bytes",
        "X-Output-Bytes",
        "X-Quality",
        "X-Scale",
        "X-Format",
        "X-Target-Met",
        "X-Attempts",
        "X-Elapsed-Ms",
    ],
)

_MEDIA_TYPES = {
    "JPEG": "image/jpeg",
    "PNG": "image/png",
    "WEBP": "image/webp",
    "AVIF": "image/avif",
    "GIF": "image/gif",
    "BMP": "image/bmp",
    "TIFF": "image/tiff",
    "PDF": "application/pdf",
}


@app.get("/api/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(status="ok")


@app.post("/api/recommend-format", response_model=RecommendFormatResponse)
@limiter.limit(RATE_LIMIT)
async def recommend_format_endpoint(
    request: Request,
    file: UploadFile = File(...),
) -> RecommendFormatResponse:
    data = await file.read()

    try:
        load_and_validate_image(data)
    except ImageTooLargeError as exc:
        raise HTTPException(413, str(exc)) from exc
    except InvalidImageError as exc:
        raise HTTPException(400, str(exc)) from exc

    loop = asyncio.get_running_loop()
    recommended = await loop.run_in_executor(_executor, run_recommend_format_worker, data)
    return RecommendFormatResponse(recommended_format=recommended)


@app.post("/api/optimize")
@limiter.limit(RATE_LIMIT)
async def optimize(
    request: Request,
    file: UploadFile = File(...),
    format: str = Form(...),
    target_bytes: Optional[int] = Form(None),
) -> Response:
    fmt = format.strip().upper()
    if fmt not in SUPPORTED_FORMATS:
        raise HTTPException(
            400,
            f"Unsupported target format '{format}'. Supported: "
            f"{', '.join(sorted(SUPPORTED_FORMATS))}.",
        )

    if target_bytes is not None and target_bytes <= 0:
        raise HTTPException(400, "target_bytes must be a positive integer.")

    data = await file.read()

    try:
        load_and_validate_image(data)  # cheap validation before the worker dispatch
    except ImageTooLargeError as exc:
        raise HTTPException(413, str(exc)) from exc
    except InvalidImageError as exc:
        raise HTTPException(400, str(exc)) from exc

    loop = asyncio.get_running_loop()
    start = time.monotonic()
    result = await loop.run_in_executor(_executor, run_optimize_worker, data, fmt, target_bytes)
    total_elapsed_ms = (time.monotonic() - start) * 1000

    return Response(
        content=result.data,
        media_type=_MEDIA_TYPES[fmt],
        headers={
            "X-Original-Bytes": str(len(data)),
            "X-Output-Bytes": str(result.size_bytes),
            "X-Quality": str(result.quality),
            "X-Scale": f"{result.scale:.3f}",
            "X-Format": fmt,
            "X-Target-Met": "true" if result.target_met else "false",
            "X-Attempts": str(result.attempts),
            "X-Elapsed-Ms": f"{total_elapsed_ms:.1f}",
        },
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
