from __future__ import annotations

from PIL import Image

from app.compression.content_signal import estimate_complexity, recommend_format


def test_flat_image_scores_low_complexity():
    flat = Image.new("RGB", (400, 400), (120, 130, 140))
    assert estimate_complexity(flat) < 0.1


def test_noisy_photo_scores_high_complexity(photo_image):
    assert estimate_complexity(photo_image) > 0.3


def test_recommend_format_flat_vs_photo(photo_image):
    flat = Image.new("RGB", (400, 400), (200, 50, 50))
    assert recommend_format(flat) == "webp"
    assert recommend_format(photo_image) == "avif"
