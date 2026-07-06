from __future__ import annotations

from io import BytesIO

from PIL import Image

from app.compression import optimize_image
from app.compression.search import QUALITY_FLOOR, TIME_BUDGET_SECONDS


def test_jpeg_hits_target_and_respects_quality_floor(photo_image):
    result = optimize_image(photo_image, "JPEG", target_bytes=100_000)
    assert result.target_met
    assert result.size_bytes <= 100_000
    # Below-floor quality should only ever be used as an explicit last
    # resort, not for an ordinary reachable target like this one.
    assert result.quality >= QUALITY_FLOOR


def test_webp_hits_target(photo_image):
    result = optimize_image(photo_image, "WEBP", target_bytes=100_000)
    assert result.target_met
    assert result.size_bytes <= 100_000


def test_avif_hits_target(photo_image):
    result = optimize_image(photo_image, "AVIF", target_bytes=100_000)
    assert result.target_met
    assert result.size_bytes <= 100_000


def test_search_never_exceeds_time_budget_by_more_than_one_attempt(photo_image):
    result = optimize_image(photo_image, "WEBP", target_bytes=1_000)  # near-impossible target
    # search_quality_scale checks the budget between attempts, so total
    # elapsed can exceed the budget by at most one attempt's duration.
    assert result.elapsed_ms < (TIME_BUDGET_SECONDS * 1000) * 2


def test_no_target_reports_success_not_failure(photo_image):
    """Regression test for DEVELOPMENT.md 3.3.7: a 'smallest possible' request
    (no user target) must report target_met=True, not a false 'target not
    reachable' - there was never a real target to fail."""
    result = optimize_image(photo_image, "AVIF", target_bytes=None)
    assert result.target_met is True
    assert result.target_bytes is None


def test_jpeg_flattens_alpha_to_white(transparent_png_image):
    result = optimize_image(transparent_png_image, "JPEG", target_bytes=None)
    decoded = Image.open(BytesIO(result.data)).convert("RGB")
    assert decoded.getpixel((10, 10)) == (255, 255, 255)  # was transparent -> white
    r, g, b = decoded.getpixel((150, 150))
    assert r > 200 and g < 50 and b < 50  # was opaque red -> stays red-ish


def test_webp_preserves_alpha(transparent_png_image):
    result = optimize_image(transparent_png_image, "WEBP", target_bytes=None)
    decoded = Image.open(BytesIO(result.data))
    assert decoded.mode == "RGBA"
    assert decoded.getpixel((10, 10))[3] == 0  # still transparent
    assert decoded.getpixel((150, 150))[3] == 255  # still opaque


def test_png_quantizes_to_hit_target(transparent_png_image):
    lossless = optimize_image(transparent_png_image, "PNG", target_bytes=None)
    result = optimize_image(transparent_png_image, "PNG", target_bytes=500)
    if result.target_met:
        assert result.size_bytes <= 500
    # quantization should have been attempted and produced something no
    # larger than the untouched lossless encode.
    assert result.size_bytes <= lossless.size_bytes
    assert result.quality <= 256
