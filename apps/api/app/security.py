from __future__ import annotations

from io import BytesIO

from PIL import Image

from .config import MAX_IMAGE_PIXELS, MAX_UPLOAD_BYTES


class InvalidImageError(ValueError):
    pass


class ImageTooLargeError(ValueError):
    pass


def validate_upload_size(data: bytes) -> None:
    if len(data) > MAX_UPLOAD_BYTES:
        raise ImageTooLargeError(
            f"Upload exceeds the {MAX_UPLOAD_BYTES // (1024 * 1024)}MB limit."
        )


def load_and_validate_image(data: bytes) -> Image.Image:
    """Decode + sanity-check an upload before it reaches the compression search.

    Runs in the request handler (not the worker process) so bad uploads are
    rejected cheaply, before ever touching the process pool.
    """
    validate_upload_size(data)

    try:
        probe = Image.open(BytesIO(data))
        probe.verify()
    except Exception as exc:
        raise InvalidImageError("File is not a valid, readable image.") from exc

    # verify() invalidates the file object, so reopen for real use.
    image = Image.open(BytesIO(data))
    image.load()

    if image.width * image.height > MAX_IMAGE_PIXELS:
        raise ImageTooLargeError(
            f"Image dimensions ({image.width}x{image.height}) exceed the "
            f"{MAX_IMAGE_PIXELS:,}-pixel processing limit."
        )

    return image
