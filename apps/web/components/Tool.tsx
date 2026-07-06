"use client";

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
import { formatBytes, formatPercentSaved } from "@/lib/format";

const FORMATS: { value: ImageFormat; label: string }[] = [
  { value: "webp", label: "WebP" },
  { value: "avif", label: "AVIF" },
  { value: "jpeg", label: "JPEG" },
  { value: "png", label: "PNG" },
];

type Status = "idle" | "loading" | "done" | "error";

interface ToolProps {
  defaultFormat?: ImageFormat;
  /** Landing pages promise a specific conversion - don't let the
   * auto-recommendation override that choice, just show it as a hint. */
  lockFormat?: boolean;
}

export function Tool({ defaultFormat = "webp", lockFormat = false }: ToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [naturalSize, setNaturalSize] = useState<{ width: number; height: number } | null>(null);
  const [format, setFormat] = useState<ImageFormat>(defaultFormat);
  const [recommendedFormat, setRecommendedFormat] = useState<ImageFormat | null>(null);
  const [targetMode, setTargetMode] = useState<"auto" | "size">("auto");
  const [targetKB, setTargetKB] = useState(200);
  const [result, setResult] = useState<OptimizeResult | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const previewUrlRef = useRef<string | null>(null);
  const resultUrlRef = useRef<string | null>(null);
  const userTouchedFormatRef = useRef(false);

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

      const img = new Image();
      img.onload = () => setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
      img.src = url;

      recommendFormat(newFile).then((rec) => {
        if (!rec) return;
        setRecommendedFormat(rec);
        if (!lockFormat && !userTouchedFormatRef.current) setFormat(rec);
      });
    },
    [lockFormat]
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
    };
  }, []);

  function selectFormat(value: ImageFormat) {
    userTouchedFormatRef.current = true;
    setFormat(value);
  }

  function reset() {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    previewUrlRef.current = null;
    resultUrlRef.current = null;
    setFile(null);
    setPreviewUrl(null);
    setNaturalSize(null);
    setResult(null);
    setStatus("idle");
    setErrorMessage(null);
  }

  async function handleOptimize() {
    if (!file) return;
    setStatus("loading");
    setErrorMessage(null);
    try {
      const targetBytes = targetMode === "size" ? targetKB * 1024 : undefined;
      const optimized = await optimizeImage(file, format, targetBytes);
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
      resultUrlRef.current = optimized.url;
      setResult(optimized);
      setStatus("done");
    } catch (err) {
      const message = err instanceof OptimizeError ? err.message : "Something went wrong. Try again.";
      setErrorMessage(message);
      setStatus("error");
    }
  }

  if (!file || !previewUrl) {
    return (
      <div className="mx-auto w-full max-w-2xl">
        <Dropzone onFile={handleFile} />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      {naturalSize && (
        <CompareSlider
          beforeSrc={previewUrl}
          afterSrc={result?.url ?? previewUrl}
          naturalWidth={naturalSize.width}
          naturalHeight={naturalSize.height}
        />
      )}

      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Output format">
        {FORMATS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => selectFormat(f.value)}
            aria-pressed={format === f.value}
            className={`font-readout rounded-full border px-4 py-1.5 text-xs transition-colors ${
              format === f.value
                ? "border-focus bg-focus text-white"
                : "border-border text-ink-muted hover:text-ink"
            }`}
          >
            {f.label}
            {recommendedFormat === f.value && (
              <span className="ml-1.5 opacity-70">· recommended</span>
            )}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="target-mode"
            checked={targetMode === "auto"}
            onChange={() => setTargetMode("auto")}
          />
          Best quality (no size target)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="target-mode"
            checked={targetMode === "size"}
            onChange={() => setTargetMode("size")}
          />
          Target size
        </label>
        {targetMode === "size" && (
          <label className="flex items-center gap-2 text-sm">
            <input
              type="number"
              min={1}
              value={targetKB}
              onChange={(event) => setTargetKB(Number(event.target.value) || 1)}
              className="font-readout w-20 rounded border border-border bg-surface px-2 py-1"
              aria-label="Target size in kilobytes"
            />
            KB
          </label>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleOptimize}
          disabled={status === "loading"}
          className="rounded-lg bg-focus px-5 py-2.5 font-medium text-white transition-opacity disabled:opacity-50"
        >
          {status === "loading" ? "Optimizing…" : "Optimize"}
        </button>
        <button type="button" onClick={reset} className="text-sm text-ink-muted hover:text-ink">
          Choose another image
        </button>
      </div>

      <div role="status" aria-live="polite" className="sr-only">
        {status === "loading" && "Optimizing image…"}
        {status === "done" && "Optimization complete."}
        {status === "error" && errorMessage}
      </div>

      {status === "error" && errorMessage && (
        <p role="alert" className="text-danger text-sm">
          {errorMessage}
        </p>
      )}

      {result && (
        <dl className="font-readout grid grid-cols-2 gap-x-6 gap-y-2 rounded-xl border border-border bg-surface p-4 text-sm sm:grid-cols-4">
          <div>
            <dt className="text-ink-muted text-xs">Original</dt>
            <dd>{formatBytes(result.originalBytes)}</dd>
          </div>
          <div>
            <dt className="text-ink-muted text-xs">Output</dt>
            <dd>{formatBytes(result.outputBytes)}</dd>
          </div>
          <div>
            <dt className="text-ink-muted text-xs">Saved</dt>
            <dd>{formatPercentSaved(result.originalBytes, result.outputBytes)}</dd>
          </div>
          <div>
            <dt className="text-ink-muted text-xs">Format</dt>
            <dd>{result.format}</dd>
          </div>
          <div>
            <dt className="text-ink-muted text-xs">Quality</dt>
            <dd>{result.quality}</dd>
          </div>
          <div>
            <dt className="text-ink-muted text-xs">Scale</dt>
            <dd>{(result.scale * 100).toFixed(0)}%</dd>
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
      )}

      {result && (
        <a
          href={result.url}
          download={`optimized.${format}`}
          className="rounded-lg border border-border px-5 py-2.5 text-center font-medium hover:bg-black/5"
        >
          Download
        </a>
      )}
    </div>
  );
}
