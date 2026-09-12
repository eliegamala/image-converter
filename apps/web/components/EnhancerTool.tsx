"use client";

import { sendGAEvent } from "@next/third-parties/google";
import { useEffect, useRef, useState } from "react";
import { CompareSlider } from "@/components/CompareSlider";
import { Dropzone } from "@/components/Dropzone";
import { disposeEnhancers, enhanceImage, type EnhanceMode, type EnhanceResult } from "@/lib/enhancer";
import { formatBytes } from "@/lib/format";

const MODES: { value: EnhanceMode; label: string; description: string }[] = [
  {
    value: "enhance",
    label: "Enhance Quality",
    description: "Sharpens detail and reduces mild blur - output stays the same size.",
  },
  { value: "2x", label: "Upscale 2×", description: "Doubles width and height." },
  { value: "4x", label: "Upscale 4×", description: "Quadruples width and height." },
];

const GA_TOOL_NAME: Record<EnhanceMode, string> = {
  enhance: "image_enhance",
  "2x": "image_upscale_2x",
  "4x": "image_upscale_4x",
};

type Status = "idle" | "loading" | "done" | "error";

interface EnhancerToolProps {
  defaultMode?: EnhanceMode;
  /** Lets a hero section hide its decorative artwork once a real file is
   * selected, instead of showing both at once - same contract as Tool.tsx. */
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

export function EnhancerTool({ defaultMode = "enhance", onFileChange }: EnhancerToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [naturalSize, setNaturalSize] = useState<{ width: number; height: number } | null>(null);
  const [mode, setMode] = useState<EnhanceMode>(defaultMode);

  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<EnhanceResult | null>(null);
  const [progress, setProgress] = useState(0);

  const previewUrlRef = useRef<string | null>(null);
  const resultUrlRef = useRef<string | null>(null);
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const maxProgressRef = useRef(0);

  function handleFile(newFile: File) {
    const looksLikeImage = /^image\/(jpeg|png|webp)$/.test(newFile.type) || /\.(jpe?g|png|webp)$/i.test(newFile.name);
    if (!looksLikeImage) {
      setStatus("error");
      setErrorMessage("Please upload a JPG, PNG or WebP image.");
      return;
    }

    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    resultUrlRef.current = null;

    const url = URL.createObjectURL(newFile);
    previewUrlRef.current = url;

    setFile(newFile);
    setPreviewUrl(url);
    setNaturalSize(null);
    setResult(null);
    setStatus("idle");
    setErrorMessage(null);
    onFileChange?.(true);

    const img = new Image();
    img.onload = () => setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
    img.src = url;
  }

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      void disposeEnhancers();
    };
  }, []);

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

  async function handleEnhance() {
    if (!file) return;
    sendGAEvent("event", "conversion_start", { tool_name: GA_TOOL_NAME[mode] });
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

    // The model itself only reports progress in discrete jumps between
    // patches (or not at all on small, unpatched images) - this time-based
    // ease keeps the bar moving continuously regardless, the same fix
    // applied to the main converter's progress bar (see Tool.tsx).
    const startedAt = Date.now();
    progressTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      bumpProgress(92 * (1 - Math.exp(-elapsed / 2500)));
    }, 200);

    try {
      const enhanced = await enhanceImage(file, mode);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
      setProgress(100);
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
      resultUrlRef.current = enhanced.url;
      setResult(enhanced);
      setStatus("done");
    } catch (err) {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
      setProgress(0);
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong while enhancing this image. Try again."
      );
      setStatus("error");
    }
  }

  function handleDownload() {
    if (!result || !file) return;
    const base = file.name.replace(/\.[^.]+$/, "");
    const suffix = mode === "enhance" ? "enhanced" : `upscaled-${mode}`;
    triggerDownload(result.url, `${base}-${suffix}.png`);
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 text-left">
      <div>
        <h3 className="font-display text-sm font-bold">Choose Enhancement</h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-3" role="group" aria-label="Enhancement mode">
          {MODES.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => setMode(m.value)}
              aria-pressed={mode === m.value}
              className={`rounded-xl border p-3 text-left transition-colors ${
                mode === m.value
                  ? "border-focus bg-focus text-white"
                  : "border-border text-ink-muted hover:border-primary hover:text-ink"
              }`}
            >
              <span className="block text-sm font-medium">{m.label}</span>
              <span
                className={`mt-1 block text-xs leading-snug ${mode === m.value ? "text-white/80" : "text-ink-muted"}`}
              >
                {m.description}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <Dropzone
          onFile={handleFile}
          accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
          label="Upload Your Image"
          selectedFile={file}
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleEnhance}
          disabled={!file || status === "loading"}
          className="bg-primary text-primary-ink rounded-full px-6 py-3 font-medium transition-opacity disabled:opacity-40"
        >
          {status === "loading" ? "Enhancing…" : "Enhance"}
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
            <span className="text-ink-muted font-medium">Enhancing…</span>
            <span className="font-readout text-ink-muted">{Math.round(progress)}%</span>
          </div>
          <div
            role="progressbar"
            aria-label="Enhancement progress"
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
          <p className="text-ink-muted text-xs">
            Running an AI model entirely in your browser - the first run on a page also downloads it
            (under 1MB), so it&apos;s quick after that.
          </p>
        </div>
      )}

      <div role="status" aria-live="polite" className="sr-only">
        {status === "loading" && "Enhancing image…"}
        {status === "done" && "Enhancement complete."}
        {status === "error" && errorMessage}
      </div>

      {status === "error" && errorMessage && (
        <p role="alert" className="text-danger text-sm">
          {errorMessage}
        </p>
      )}

      {result && previewUrl && naturalSize && (
        <div className="border-border bg-surface flex flex-col gap-6 rounded-xl border p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium">Your enhanced image is ready.</p>
            <button type="button" onClick={handleDownload} className="text-primary text-sm font-medium">
              Download PNG
            </button>
          </div>

          <CompareSlider
            beforeSrc={previewUrl}
            afterSrc={result.url}
            naturalWidth={naturalSize.width}
            naturalHeight={naturalSize.height}
            beforeLabel="Original"
            afterLabel="Enhanced"
          />

          <dl className="font-readout grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-4">
            <div>
              <dt className="text-ink-muted text-xs">Original</dt>
              <dd>
                {naturalSize.width}×{naturalSize.height}
              </dd>
            </div>
            <div>
              <dt className="text-ink-muted text-xs">Enhanced</dt>
              <dd>
                {result.width}×{result.height}
              </dd>
            </div>
            <div>
              <dt className="text-ink-muted text-xs">File size</dt>
              <dd>{formatBytes(result.blob.size)}</dd>
            </div>
            <div>
              <dt className="text-ink-muted text-xs">Time</dt>
              <dd>{(result.elapsedMs / 1000).toFixed(1)}s</dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}
