import os


def _split_csv(value: str) -> list[str]:
    return [v.strip() for v in value.split(",") if v.strip()]


ALLOWED_ORIGINS = _split_csv(os.environ.get("ALLOWED_ORIGINS", "http://localhost:3000"))
MAX_UPLOAD_BYTES = int(os.environ.get("MAX_UPLOAD_BYTES", 25 * 1024 * 1024))
MAX_IMAGE_PIXELS = int(os.environ.get("MAX_IMAGE_PIXELS", 40_000_000))
RATE_LIMIT = os.environ.get("RATE_LIMIT", "20/minute")
PROCESS_POOL_WORKERS = int(os.environ.get("PROCESS_POOL_WORKERS", "0")) or None
