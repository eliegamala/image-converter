"use client";

import { sendGAEvent } from "@next/third-parties/google";
import { useCallback, useEffect, useRef, useState } from "react";
import { CompareSlider } from "@/components/CompareSlider";
import { Dropzone } from "@/components/Dropzone";
import {
  optimizeImage,
  OptimizeError,
  recommendFormat,
  type ImageFormat,
  type OptimizeResult,
} from "@/lib/api";
import { formatBytes, formatCompressionRatio, formatPercentSaved } from "@/lib/format";

const OUTPUT_FORMATS: { value: ImageFormat; label: string }[] = [
  { value: "webp", label: "WebP" },
  { value: "avif", label: "AVIF" },
  { value: "jpeg", label: "JPG" },
  { value: "png", label: "PNG" },
  { value: "gif", label: "GIF" },
  { value: "bmp", label: "BMP" },
  { value: "tiff", label: "TIFF" },
  { value: "pdf", label: "PDF" },
];

// "From" is informational only (the backend auto-detects the real source
// format from file bytes) - it sets user expectations and narrows the file
// picker's accept hint, but nothing here gates what can actually be uploaded.
const SOURCE_FORMATS: { value: string; label: string }[] = [
  { value: "auto", label: "Auto-detect" },
  { value: "jpeg", label: "JPG" },
  { value: "png", label: "PNG" },
  { value: "webp", label: "WebP" },
  { value: "avif", label: "AVIF" },
  { value: "heic", label: "HEIC" },
  { value: "gif", label: "GIF" },
  { value: "bmp", label: "BMP" },
  { value: "tiff", label: "TIFF" },
];

const EXTENSIONS: Record<ImageFormat, string> = {
  jpeg: "jpg",
  png: "png",
  webp: "webp",
  avif: "avif",
  gif: "gif",
  bmp: "bmp",
  tiff: "tiff",
  pdf: "pdf",
};

// Most browsers can't render these as <img> at all (no TIFF/PDF decode in
// the <img> pipeline, unlike HEIC where only some browsers can't) - skip
// trying to preview the result for these rather than show a broken image.
const NO_PREVIEW_FORMATS = new Set<ImageFormat>(["tiff", "pdf"]);

// PNG/GIF are lossless with no quality knob - the backend repurposes the
// quality field to mean "palette colors used" for these two only (see
// apps/api/app/compression/{png,gif}.py). Matched against result.format
// (the backend's uppercase x-format header), not the lowercase ImageFormat
// values used elsewhere in this file.
const PALETTE_BASED_FORMATS = new Set(["PNG", "GIF"]);

// Both are lossless - no quality setting can shrink real photographic
// detail the way a lossy encode can, so a photo converted to either will
// often come out larger than a compressed (JPEG/HEIC/WebP/AVIF) original.
const LOSSLESS_FORMATS = new Set(["PNG", "GIF", "BMP", "TIFF"]);

const SIZE_PRESETS_KB = [20, 50, 100, 200];

type Status = "idle" | "loading" | "done" | "error";

interface ToolProps {
  defaultFormat?: ImageFormat;
  defaultSourceFormat?: string;
  /** Landing pages promise a specific conversion - don't let the
   * auto-recommendation override that choice, just show it as a hint. */
  lockFormat?: boolean;
  /** Pre-selects a target size (e.g. landing pages promising "to 100KB")
   * instead of the default "Best Quality" auto mode. */
  defaultTargetKB?: number | null;
  /** Lets a hero section hide its decorative artwork once a real file is
   * selected, instead of showing both at once. */
  onFileChange?: (hasFile: boolean) => void;
}

function triggerDownload(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function Tool({
  defaultFormat = "webp",
  defaultSourceFormat = "auto",
  lockFormat = false,
  defaultTargetKB = null,
  onFileChange,
}: ToolProps) {
  const [sourceFormat, setSourceFormat] = useState(defaultSourceFormat);
  const [format, setFormat] = useState<ImageFormat>(defaultFormat);
  const [recommendedFormat, setRecommendedFormat] = useState<ImageFormat | null>(null);
  const [targetKB, setTargetKB] = useState<number | null>(defaultTargetKB);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [naturalSize, setNaturalSize] = useState<{ width: number; height: number } | null>(null);
  const [previewUnsupported, setPreviewUnsupported] = useState(false);

  const [result, setResult] = useState<OptimizeResult | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const previewUrlRef = useRef<string | null>(null);
  const resultUrlRef = useRef<string | null>(null);
  const userTouchedFormatRef = useRef(false);
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const maxProgressRef = useRef(0);

  const handleFile = useCallback(
    (newFile: File) => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);

      const url = URL.createObjectURL(newFile);
      previewUrlRef.current = url;
      resultUrlRef.current = null;

      setFile(newFile);
      setPreviewUrl(url);
      setResult(null);
      setStatus("idle");
      setErrorMessage(null);
      setRecommendedFormat(null);
      setNaturalSize(null);
      setPreviewUnsupported(false);
      onFileChange?.(true);

      const img = new Image();
      img.onload = () => setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
      // HEIC/TIFF and a few others can't be decoded in an <img> by most
      // browsers - fall back to showing the result alone once it's ready,
      // instead of silently showing nothing.
      img.onerror = () => setPreviewUnsupported(true);
      img.src = url;

      recommendFormat(newFile).then((rec) => {
        if (!rec) return;
        setRecommendedFormat(rec);
        if (!lockFormat && !userTouchedFormatRef.current) setFormat(rec);
      });
    },
    [lockFormat, onFileChange]
  );

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const item = Array.from(event.clipboardData?.items ?? []).find((i) =>
        i.type.startsWith("image/")
      );
      const pastedFile = item?.getAsFile();
      if (pastedFile) handleFile(pastedFile);
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [handleFile]);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, []);

  function selectFormat(value: ImageFormat) {
    userTouchedFormatRef.current = true;
    setFormat(value);
  }

  function reset() {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    previewUrlRef.current = null;
    resultUrlRef.current = null;
    setFile(null);
    setPreviewUrl(null);
    setNaturalSize(null);
    setResult(null);
    setStatus("idle");
    setErrorMessage(null);
    setProgress(0);
    onFileChange?.(false);
  }

  async function handleOptimize() {
    if (!file) return;
    sendGAEvent("event", "convert_click", {
      format,
      has_target_size: targetKB !== null,
    });
    setStatus("loading");
    setErrorMessage(null);
    setProgress(0);
    maxProgressRef.current = 0;

    const bumpProgress = (value: number) => {
      if (value > maxProgressRef.current) {
        maxProgressRef.current = value;
        setProgress(value);
      }
    };

    // Real upload progress only fires reliably for larger files - a small
    // image (the common case) is sent as a single packet with no
    // intermediate progress events at all, which would otherwise leave the
    // bar frozen at 0% for the whole request. This time-based ease toward
    // 92% runs unconditionally from the moment the request starts so the
    // bar always keeps moving; real upload progress (when it does fire)
    // can only push it forward, never backward, via bumpProgress's max.
    const startedAt = Date.now();
    progressTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      bumpProgress(92 * (1 - Math.exp(-elapsed / 2500)));
    }, 200);

    try {
      const targetBytes = targetKB ? targetKB * 1024 : undefined;
      const optimized = await optimizeImage(file, format, targetBytes, (fraction) => {
        bumpProgress(fraction * 40);
      });
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
      setProgress(100);
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
      resultUrlRef.current = optimized.url;
      setResult(optimized);
      setStatus("done");
      triggerDownload(optimized.url, `optimized.${EXTENSIONS[format]}`);
    } catch (err) {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
      setProgress(0);
      const message = err instanceof OptimizeError ? err.message : "Something went wrong. Try again.";
      setErrorMessage(message);
      setStatus("error");
    }
  }

  const resultHasNoPreview = NO_PREVIEW_FORMATS.has(format);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 text-left">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-ink-muted text-xs font-medium">Convert From</span>
          <select
            value={sourceFormat}
            onChange={(event) => setSourceFormat(event.target.value)}
            className="border-border bg-surface mt-1 w-full rounded-lg border px-3 py-2 text-sm"
          >
            {SOURCE_FORMATS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-ink-muted text-xs font-medium">Convert To</span>
          <select
            value={format}
            onChange={(event) => selectFormat(event.target.value as ImageFormat)}
            className="border-border bg-surface mt-1 w-full rounded-lg border px-3 py-2 text-sm"
          >
            {OUTPUT_FORMATS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <h3 className="font-display text-sm font-bold">Choose Output Format</h3>
        <div className="mt-2 flex flex-wrap items-center gap-2" role="group" aria-label="Output format">
          {OUTPUT_FORMATS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => selectFormat(f.value)}
              aria-pressed={format === f.value}
              className={`font-readout rounded-full border px-4 py-1.5 text-xs transition-colors ${
                format === f.value
                  ? "border-focus bg-focus text-white"
                  : "border-border text-ink-muted hover:text-ink hover:border-primary"
              }`}
            >
              {f.label}
              {recommendedFormat === f.value && (
                <span className="ml-1.5 opacity-70">· recommended</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-display text-sm font-bold">Reduce Image Size In KB</h3>
        <p className="text-ink-muted mt-1 text-sm">
          Compress an image to 20KB, 50KB, 100KB, 200KB, or any other size.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setTargetKB(null)}
            aria-pressed={targetKB === null}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
              targetKB === null
                ? "border-focus bg-focus text-white"
                : "border-border text-ink-muted hover:text-ink hover:border-primary"
            }`}
          >
            Best Quality
          </button>
          {SIZE_PRESETS_KB.map((kb) => (
            <button
              key={kb}
              type="button"
              onClick={() => setTargetKB(kb)}
              aria-pressed={targetKB === kb}
              className={`font-readout rounded-full border px-4 py-1.5 text-xs transition-colors ${
                targetKB === kb
                  ? "border-focus bg-focus text-white"
                  : "border-border text-ink-muted hover:text-ink hover:border-primary"
              }`}
            >
              {kb} KB
            </button>
          ))}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="number"
              min={1}
              value={targetKB ?? ""}
              onChange={(event) =>
                setTargetKB(event.target.value ? Number(event.target.value) : null)
              }
              placeholder="Custom"
              className="font-readout border-border bg-surface w-24 rounded border px-2 py-1"
              aria-label="Custom target size in kilobytes"
            />
            KB
          </label>
        </div>
        <ul className="text-ink-muted mt-3 flex flex-col gap-1 text-xs leading-relaxed">
          <li>
            <span className="text-ink font-medium">Efficient Size Reduction:</span> resize images
            to 100KB with preserved clarity, eliminating oversized files.
          </li>
          <li>
            <span className="text-ink font-medium">Effortless Photo Resizing:</span> our
            user-friendly interface lets you resize images in KB with just a few clicks - no
            technical expertise required.
          </li>
        </ul>
      </div>

      <div>
        <Dropzone onFile={handleFile} selectedFile={file} />
        {previewUnsupported && !result && (
          <p className="text-ink-muted mt-2 text-xs">
            Your browser can&apos;t preview this file format directly, but it will still convert
            correctly - click Convert below.
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleOptimize}
          disabled={!file || status === "loading"}
          className="bg-primary text-primary-ink rounded-full px-6 py-3 font-medium transition-opacity disabled:opacity-40"
        >
          {status === "loading" ? "Converting…" : "Convert"}
        </button>
        {file && status !== "loading" && (
          <button type="button" onClick={reset} className="text-sm text-ink-muted hover:text-ink">
            Choose another image
          </button>
        )}
      </div>

      {status === "loading" && (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-ink-muted font-medium">Converting…</span>
            <span className="font-readout text-ink-muted">{Math.round(progress)}%</span>
          </div>
          <div
            role="progressbar"
            aria-label="Conversion progress"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            className="bg-border h-2 w-full overflow-hidden rounded-full"
          >
            <div
              className="bg-primary h-full rounded-full transition-[width] duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div role="status" aria-live="polite" className="sr-only">
        {status === "loading" && "Converting image…"}
        {status === "done" && "Conversion complete. Your download has started."}
        {status === "error" && errorMessage}
      </div>

      {status === "error" && errorMessage && (
        <p role="alert" className="text-danger text-sm">
          {errorMessage}
        </p>
      )}

      {result && (
        <div className="border-border bg-surface flex flex-col gap-6 rounded-xl border p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium">Your download has started.</p>
            <a
              href={result.url}
              download={`optimized.${EXTENSIONS[format]}`}
              className="text-primary text-sm font-medium"
            >
              Download again
            </a>
          </div>

          {result.outputBytes > result.originalBytes && (
            <div className="border-signal-before/40 bg-signal-before/10 flex items-start gap-2.5 rounded-lg border px-3 py-2.5 text-sm">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                className="text-signal-before mt-0.5 shrink-0"
              >
                <path
                  d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="text-ink-muted">
                This {result.format} file is larger than your original.{" "}
                {LOSSLESS_FORMATS.has(result.format) ? (
                  <>
                    {result.format} is a lossless format, so converting a photo to it often
                    produces a bigger file than a compressed original - that&apos;s expected, not
                    an error.
                  </>
                ) : (
                  <>The source was likely already compressed more than this setting allows.</>
                )}{" "}
                {recommendedFormat && recommendedFormat !== format && (
                  <>
                    For a smaller file, try{" "}
                    <button
                      type="button"
                      onClick={() => selectFormat(recommendedFormat)}
                      className="text-primary font-medium underline"
                    >
                      {OUTPUT_FORMATS.find((f) => f.value === recommendedFormat)?.label}
                    </button>{" "}
                    instead.
                  </>
                )}
              </p>
            </div>
          )}

          {!resultHasNoPreview && naturalSize && !previewUnsupported && (
            <CompareSlider
              beforeSrc={previewUrl!}
              afterSrc={result.url}
              naturalWidth={naturalSize.width}
              naturalHeight={naturalSize.height}
            />
          )}

          {/* Source couldn't preview (e.g. HEIC input) but the result format
              can (e.g. JPG output) - show the result alone rather than a
              full before/after slider with no "before" to show. */}
          {!resultHasNoPreview && previewUnsupported && (
            // eslint-disable-next-line @next/next/no-img-element -- blob: URL, see CompareSlider.tsx
            <img
              src={result.url}
              alt="Converted result"
              className="border-border w-full rounded-xl border object-contain"
            />
          )}

          {resultHasNoPreview && (
            <p className="text-ink-muted text-sm">
              A preview isn&apos;t available for this file format in your browser, but the
              download above is the real, converted file.
            </p>
          )}

          <dl className="font-readout grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-4">
            <div>
              <dt className="text-ink-muted text-xs">Original</dt>
              <dd>{formatBytes(result.originalBytes)}</dd>
            </div>
            <div>
              <dt className="text-ink-muted text-xs">New Size</dt>
              <dd>{formatBytes(result.outputBytes)}</dd>
            </div>
            <div>
              <dt className="text-ink-muted text-xs">Saved</dt>
              <dd>{formatPercentSaved(result.originalBytes, result.outputBytes)}</dd>
            </div>
            <div>
              <dt className="text-ink-muted text-xs">Ratio</dt>
              <dd>{formatCompressionRatio(result.originalBytes, result.outputBytes)}</dd>
            </div>
            <div>
              <dt className="text-ink-muted text-xs">Format</dt>
              <dd>{result.format}</dd>
            </div>
            {naturalSize && (
              <div>
                <dt className="text-ink-muted text-xs">Dimensions</dt>
                <dd>
                  {Math.round(naturalSize.width * result.scale)}×
                  {Math.round(naturalSize.height * result.scale)}
                </dd>
              </div>
            )}
            <div>
              {/* PNG/GIF have no quality knob - the backend repurposes this
                  field to mean "palette colors used" for them instead (see
                  apps/api/app/compression/png.py), which reads as a bug
                  ("Quality: 256"?) if labeled the same as JPEG/WebP/AVIF. */}
              <dt className="text-ink-muted text-xs">
                {PALETTE_BASED_FORMATS.has(result.format) ? "Colors" : "Quality"}
              </dt>
              <dd>
                {PALETTE_BASED_FORMATS.has(result.format)
                  ? result.quality >= 256
                    ? "Full color"
                    : `${result.quality} colors`
                  : result.quality}
              </dd>
            </div>
            <div>
              <dt className="text-ink-muted text-xs">Time</dt>
              <dd>{result.elapsedMs.toFixed(0)}ms</dd>
            </div>
            <div>
              <dt className="text-ink-muted text-xs">Target met</dt>
              <dd>{result.targetMet ? "Yes" : "No"}</dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}
