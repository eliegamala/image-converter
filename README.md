# ImageConvert

Precision image optimization: convert to JPEG, PNG, WebP, or AVIF, hit an
exact target file size, or let quality lead. See [vision.md](vision.md) for
the product brief and [DEVELOPMENT.md](DEVELOPMENT.md) for the original
prototype's build log that this implementation is grounded in.

## Structure

```
apps/web   Next.js 15 (App Router) frontend - the tool + SEO landing pages
apps/api   FastAPI backend - the compression engine
```

## Local development

### Backend (`apps/api`)

```bash
cd apps/api
python -m venv .venv
.venv/Scripts/activate        # .venv/bin/activate on macOS/Linux
pip install -r requirements-dev.txt
uvicorn app.main:app --reload --port 8000
```

Runs at `http://localhost:8000`. Health check: `GET /api/health`.

Tests:

```bash
pytest                                              # unit + API tests
locust -f locustfile.py --host http://localhost:8000  # load test (see below)
```

### Frontend (`apps/web`)

```bash
cd apps/web
npm install
cp .env.local.example .env.local   # if not already present
npm run dev
```

Runs at `http://localhost:3000` and expects the API at
`NEXT_PUBLIC_API_URL` (defaults to `http://localhost:8000`).

Tests:

```bash
npm run lint
npm run build
npx playwright install chromium   # once
npx playwright test               # e2e - needs both dev servers running
```

## Environment variables

| Var | Where | Purpose |
|---|---|---|
| `ALLOWED_ORIGINS` | API | Comma-separated list of origins allowed by CORS. Must include the deployed frontend's URL in production. |
| `MAX_UPLOAD_BYTES` | API | Upload size cap (default 25MB). |
| `MAX_IMAGE_PIXELS` | API | Decompression-bomb guard (default 40MP). |
| `RATE_LIMIT` | API | Per-IP rate limit on `/api/optimize` and `/api/recommend-format` (default `20/minute`). |
| `PROCESS_POOL_WORKERS` | API | Worker process count for the compression pool (default: CPU count). |
| `NEXT_PUBLIC_API_URL` | Web | Base URL of the FastAPI backend. |
| `NEXT_PUBLIC_SITE_URL` | Web | Canonical site URL, used for metadata, sitemap, and OG tags. |

## Deployment

Split deployment, matching the architecture decision in this build: the
frontend goes to an edge/static host, the backend to a host that can run a
persistent Python process (the compression work is CPU-bound and needs a
real process, not an edge function).

### Frontend -> Vercel (or any Node/Next-compatible host)

This is a monorepo, so when importing the repo, set the project's **Root
Directory to `apps/web`**. Then set the environment variables above
(`NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SITE_URL`) for the production
environment before the first deploy. No other config is required - Next.js
is auto-detected.

### Backend -> Render / Fly.io / any Docker-capable host

`apps/api/Dockerfile` is present and builds a standard
`uvicorn app.main:app` service on port 8000. Point the host at the `apps/api`
directory as the build root. Set `ALLOWED_ORIGINS` to the frontend's
production URL once it's known (CORS will reject the deployed frontend
otherwise).

**Known limitation:** this Dockerfile has not been built or run anywhere in
this build process - there is no Docker daemon in this development
environment. It follows standard conventions (matches the Python version
and dependencies already validated by the test suite, see
`requirements.txt`), but treat it as unverified until it's actually built
once, the same disclosure `DEVELOPMENT.md` made about the original
prototype's Dockerfile.

### After both are live

1. Set the API's `ALLOWED_ORIGINS` to the frontend's real URL.
2. Set the frontend's `NEXT_PUBLIC_API_URL` to the API's real URL and
   redeploy.
3. Re-run the CORS preflight check from `apps/api/tests/test_api.py`
   (`test_cors_preflight_allows_configured_origin`) against the live API
   with the real origin to confirm it's actually wired up correctly, not
   just configured.
