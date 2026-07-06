# Build documentation — ImageConvert core

This documents exactly what was used to build the backend and frontend in
this repo, and the actual sequence of decisions and fixes made — including
the mistakes caught along the way. Nothing below is idealized after the
fact; it matches what really happened during the build.

---

## 1. Tools used to build it

I have a sandboxed Linux environment (Ubuntu, Python 3.12, Node 22) with a
bash shell and file read/write access. Everything was built and verified
inside that environment, not written blind:

| Tool | Used for |
|---|---|
| `bash` | Running Python one-offs to benchmark encode speed, installing packages, starting/stopping the actual `uvicorn` server, running `curl`/`requests` against it, validating JS/HTML |
| File write/edit | Writing new files, then precise in-place edits to fix specific bugs without rewriting whole files |
| File read | Reading skill guidance and re-reading files before editing them (state can go stale after an edit) |
| File delivery | Packaging and handing over the final files |

No code in this project was generated and handed over unrun. Every claim
in the README about what's "tested" corresponds to an actual command
executed in this environment during the build — see §3.

---

## 2. Technology stack

### Backend

| Component | Version | Role |
|---|---|---|
| Python | 3.12 | runtime |
| FastAPI | 0.139.0 | HTTP API framework |
| Uvicorn | 0.49.0 | ASGI server |
| Pillow (PIL) | 12.1.1 | image decode/encode — JPEG, PNG, WEBP |
| pillow-avif-plugin | 1.5.5 | registers AVIF encode/decode with Pillow (wraps `libavif`) |
| python-multipart | 0.0.32 | required by FastAPI/Starlette to parse the multipart file upload |

Pillow's wheels bundle `libjpeg`, `libwebp`, and `libpng` already compiled
in — no separate system packages were installed for those. `libavif` comes
in via `pillow-avif-plugin`'s own wheel.

**Encoder settings actually used, and why** (see §3 for the benchmarks that
justified each number):

- WebP: `method=4` during search, `method=6` for the one final encode.
- AVIF: `speed=10` during search, `speed=6` for the one final encode.
- JPEG: `optimize=True, progressive=True`, quality varied directly — cheap
  enough (tens of ms) that it never needed a fast/slow split.
- PNG: lossless (`compress_level=9, optimize=True`); size reduction comes
  from palette quantization (`Image.quantize`, `MEDIANCUT`), not a quality
  knob, since PNG has none.

### Frontend

Deliberately no framework — a single static HTML file:

- Vanilla HTML5 / CSS3 / ES6 JavaScript, no build step, no bundler.
- **Fonts** (Google Fonts CDN): Space Grotesk (display type), Inter (body
  copy), JetBrains Mono (all numeric readouts — file sizes, quality,
  percentages). The mono face for numbers specifically was a design
  choice, not a default: this product's entire value proposition is
  numbers (KB, %, quality), so they get a face that aligns digit widths.
- **Browser APIs used**: `fetch` + `FormData` (upload), `FileReader` +
  `Image()` (local preview and reading natural dimensions before the
  network round-trip), the Clipboard `paste` event (paste-to-upload),
  Pointer Events (unified mouse/touch dragging for the before/after
  slider), `matchMedia('prefers-color-scheme')` and
  `prefers-reduced-motion` (theme default and motion respect),
  `localStorage` (remembering the theme choice only — no image data ever
  touches browser storage).
- **No React/Vue/build tooling** — deliberate, since the brief asked for a
  single-page frontend and the interaction surface (drag/drop, one slider,
  some pills) doesn't need component state management.

---

## 3. Methodology

### 3.1 Design pass (frontend), before any code

Followed a structured design process rather than defaulting to a
templated SaaS look: named a concrete signature concept up front (an
"instrument readout" metaphor — the whole product is about measuring
bytes precisely, so the UI leans on monospace numerics and an
oscilloscope-style scan-line motif) before touching CSS, then explicitly
checked the plan against known generic-AI-design patterns (warm
cream+serif+terracotta; near-black+single acid accent; broadsheet
hairlines) to avoid landing on one of those by default rather than by
choice.

### 3.2 Algorithm design, grounded in a real precedent

The compression search algorithm is a direct code version of a process
already run **by hand**, earlier in the same working session: iterating
WebP quality and scale, measuring the real output size after every
attempt, and picking the best-fitting combination — across several real
photos with different characteristics (smooth gradients vs. dense
foliage vs. woven texture). The code generalizes that same loop instead
of inventing a new strategy.

### 3.3 Build → run → measure → fix (not build → ship)

Concretely, in order:

1. Wrote `compression.py` and `main.py`.
2. **Before** writing the frontend, ran the compression function directly
   against the real sample photos from earlier in the session and
   inspected the actual numbers.
3. Caught bug #1 this way: a naive linear quality scan returned a
   full-resolution image at quality 17 for a 100 KB target — technically
   "under the limit," but visually a bad result (blocking artifacts) that
   didn't match the earlier, better-judged manual result for the same
   photo. Fixed by adding a soft quality floor (40) that prefers
   downscaling over ugly compression, with a fallback pass that only
   drops below the floor if nothing above it can fit.
4. Ran a first timing test across 3 images × 2 targets — it **timed out**.
   Root-caused with direct benchmarking:
   - `libwebp method=6` at full resolution: ~722 ms/encode.
   - AVIF `speed=2`: **11.7 seconds** for one encode on a downscaled image.
   A linear-scan search doing dozens of these per request was never going
   to be viable synchronously.
5. Fixed with three changes together: binary search over the quality
   ladder (≈5 attempts instead of ≈20 per scale step), a fast preview
   encoder setting during search with one slow/exhaustive re-encode only
   for the winning result, and a hard attempt cap + wall-clock budget as
   a circuit breaker.
6. Re-benchmarked: typical requests dropped to 0.5–5 s. One deliberately
   adversarial case (a visually busy market photo, AVIF output, a 90 KB
   target) still took **16.4 s** and failed to hit the target — the
   circuit breaker cut the search short. Tightened the time budget
   (15 s → 8 s) and bumped AVIF's preview speed (`8` → `10`); the same
   case then completed in **5.1 s** and hit the target.
7. Noticed a semantics bug while reading the output of the "smallest
   possible file" goal: it reported `target_met: false` with a "target
   not reachable" message, which is the wrong framing for a goal that
   never had a real user-specified target in the first place. Fixed to
   report success with an accurate message for that specific case.

### 3.4 Testing the actual HTTP surface, not just the Python function

Ran the real server (`uvicorn main:app`) in the background and hit it
with real HTTP requests — first with `curl` (including a genuine
cross-origin `OPTIONS` preflight, the exact request a browser sends
before a cross-origin `POST`), then with Python's `requests` library
for cleaner output. Verified:

- `/api/health`, `/api/optimize` respond correctly end-to-end.
- CORS headers (`access-control-allow-origin`, preflight `Access-Control-*`
  response headers) are actually present on real responses, not just
  configured in code and assumed to work.
- Alpha-channel handling: built a synthetic transparent PNG, ran it
  through the API to WebP (alpha should survive) and to JPEG (alpha
  should flatten to white), then decoded the returned bytes and checked
  actual pixel values at a previously-transparent coordinate to confirm
  the flatten was correct — not just that the request returned `200`.

### 3.5 Frontend validation without a browser

The sandbox this was built in has network access restricted to a fixed
allowlist of domains (package registries, GitHub, etc.) — it does **not**
include CDNs used to download browser binaries. `playwright install
chromium` was attempted and failed for exactly this reason (blocked host).
That's disclosed here rather than glossed over. Without a real renderer
available, validation used narrower but concrete checks instead of
skipping verification entirely:

- `node --check` on the extracted `<script>` contents, to catch JS syntax
  errors.
- A small Python `html.parser` pass to confirm every tag opened is closed
  and nothing is mismatched.
- Manual review specifically against the frontend-design checklist
  (keyboard focus, motion-reduction, CSS specificity) rather than a
  generic read-through — which is how the remaining two bugs were caught:
  - The before/after slider used `object-fit: contain` on one image and a
    manual pixel-clip on the other inside a fixed 4:3 box. For a portrait
    photo (most of the sample images), that misaligns the two images
    instead of overlaying them. Fixed by computing the real image's
    aspect ratio on load and setting the comparison box to match it
    exactly, so both images fill it identically.
  - Several interactive elements had a blanket `outline: none` with
    nothing to replace it, and the drag-and-drop zone (a `<div>`) had no
    keyboard path at all. Fixed with an explicit `:focus-visible` ring
    and `tabindex`/`role="button"`/`Enter`+`Space` handling on the
    dropzone.

### 3.6 Environment hygiene

- `requirements.txt` was checked against a **fresh virtualenv** build
  (`python3 -m venv`, then `pip install -r requirements.txt` into it),
  not just left matching whatever happened to already be installed in the
  ambient dev environment from earlier, unrelated installs in the same
  session.
- The `Dockerfile` was written to standard conventions but is **explicitly
  flagged as untested** in the README — there's no Docker daemon in this
  sandbox, and pulling the base image would need registry access outside
  the network allowlist anyway. It wasn't run, so it isn't claimed as
  verified.

---

## 4. What this methodology does and doesn't cover

Applied consistently: nothing was shipped on the strength of "this should
work" when it could instead be run and measured. Every numeric claim in
this document (encode times, attempt counts, the 16.4 s → 5.1 s fix) came
from an actual command's output during the build, not an estimate.

Not covered by this pass: load testing under concurrent requests, testing
on real mobile hardware (only reduced-motion/keyboard/responsive CSS rules
were reviewed, not a physical device), and the Dockerfile, as noted above.
