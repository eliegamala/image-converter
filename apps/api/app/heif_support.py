"""Registers HEIC/HEIF decode support with Pillow.

Import this (for its side effect) anywhere a HEIC file might need to be
opened via `Image.open` - both the main process (upload validation in
security.py) and each ProcessPoolExecutor worker (compression/__init__.py)
need it, since registration is per-process, not global.

HEIC is accepted as an *input* format only - nobody wants to save an
optimized web image back into HEIC, so it's not one of the output formats
in compression/__init__.py's SUPPORTED_FORMATS.
"""
from __future__ import annotations

import pillow_heif

pillow_heif.register_heif_opener()
