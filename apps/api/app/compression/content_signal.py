"""Cheap content heuristic used to recommend AVIF vs. WebP based on how
much real detail an image has, rather than relying purely on the user's
picked target format.

A second use was tried here - seeding the binary search's first quality
guess from this same signal (plus a one-shot probe encode) to cut the
average number of search attempts. Measured against the plain floor-first
search across varied images and targets, it did not reliably help (roughly
break-even to slightly worse in aggregate across five probe-quality values
tested), so it was not shipped - see search.py's module docstring.
"""
from __future__ import annotations

import numpy as np
from PIL import Image

# A fixed *maximum dimension* (not a fixed square) matters here: squashing
# every image down to a small fixed size low-pass filters away exactly the
# high-frequency noise/texture that drives compression difficulty, while
# keeping low-frequency gradients that don't - the opposite of what this
# needs to measure. Capping the longer edge instead preserves texture at a
# representative scale while still being cheap.
_MAX_SAMPLE_DIM = 512


def estimate_complexity(image: Image.Image) -> float:
    """Rough 0..1 proxy for how much fine detail/noise an image has.

    Flat graphics and gradients score low; photographic/textured content
    scores high. Computed from mean absolute pixel-to-pixel difference (a
    cheap gradient-energy proxy) after capping the longer edge at 512px -
    not a full squash to a fixed small size.
    """
    w, h = image.size
    scale = min(1.0, _MAX_SAMPLE_DIM / max(w, h))
    sample = image
    if scale < 1.0:
        sample = image.resize(
            (max(1, round(w * scale)), max(1, round(h * scale))), Image.BILINEAR
        )
    arr = np.asarray(sample.convert("L"), dtype=np.int16)

    horizontal = np.abs(np.diff(arr, axis=1)).mean()
    vertical = np.abs(np.diff(arr, axis=0)).mean()
    mean_gradient = float((horizontal + vertical) / 2)

    # Measured range at this sampling scale (see tests/test_content_signal.py):
    # flat fills land at 0, mild texture around 1-2, busy/noisy photos
    # around 5+ - normalize against that measured range.
    return max(0.0, min(1.0, mean_gradient / 5.0))


def recommend_format(image: Image.Image) -> str:
    """AVIF for photographic content, WebP for flat/graphic content.

    Both formats handle transparency, so alpha presence doesn't change the
    recommendation - only how much real detail is in the image does.
    """
    complexity = estimate_complexity(image)
    return "avif" if complexity > 0.15 else "webp"
