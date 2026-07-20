"use client";

import ImageTracer from "imagetracerjs";
import { useEffect, useRef, useState } from "react";
import { CompareSlider } from "@/components/CompareSlider";
import { Dropzone } from "@/components/Dropzone";
import { formatBytes } from "@/lib/format";

// Caps the raster fed into the tracer, not the output - vector paths scale
// losslessly regardless, so downscaling the source keeps tracing fast on
// large photos without visibly hurting the result.
const MAX_TRACE_DIMENSION = 1000;

const COLOR_COUNTS = [4, 8, 16, 32, 64] as const;

const DETAIL_LEVELS = [
  { label: "Simple", ltres: 2, qtres: 2 },
  { label: "Balanced", ltres: 1, qtres: 1 },
  { label: "Detailed", ltres: 0.3, qtres: 0.3 },
] as const;

const SMOOTHING_LEVELS = [
  { label: "None", blurradius: 0 },
  { label: "Light", blurradius: 3 },
  { label: "Strong", blurradius: 8 },
] as const;

const THRESHOLD_LEVELS = [
  { label: "Keep All", pathomit: 1 },
  { label: "Balanced", pathomit: 8 },
  { label: "Clean", pathomit: 25 },
] as const;

type Status = "idle" | "loading" | "ready" | "error";

function triggerDownload(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function PillButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "border-focus bg-focus text-white"
          : "border-border text-ink-muted hover:text-ink hover:border-primary"
      }`}
    >
      {label}
    </button>
  );
}

export function PngToSvgTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pngUrl, setPngUrl] = useState<string | null>(null);
  const [naturalSize, setNaturalSize] = useState<{ width: number; height: number } | null>(null);

  const [colorCount, setColorCount] = useState<number>(16);
  const [detailIndex, setDetailIndex] = useState(1);
  const [smoothingIndex, setSmoothingIndex] = useState(0);
  const [thresholdIndex, setThresholdIndex] = useState(1);

  const [svgMarkup, setSvgMarkup] = useState<string | null>(null);
  const [svgUrl, setSvgUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const pngUrlRef = useRef<string | null>(null);
  const svgUrlRef = useRef<string | null>(null);

  function handleFile(newFile: File) {
    const looksLikePng = newFile.type === "image/png" || /\.png$/i.test(newFile.name);
    if (!looksLikePng) {
      setStatus("error");
      setErrorMessage("That doesn't look like a PNG file - please choose a .png file.");
      return;
    }

    if (pngUrlRef.current) URL.revokeObjectURL(pngUrlRef.current);
    if (svgUrlRef.current) URL.revokeObjectURL(svgUrlRef.current);
    svgUrlRef.current = null;

    const url = URL.createObjectURL(newFile);
    pngUrlRef.current = url;

    setFile(newFile);
    setPngUrl(url);
    setNaturalSize(null);
    setSvgMarkup(null);
    setSvgUrl(null);
    setStatus("idle");
    setErrorMessage(null);

    const img = new Image();
    img.onload = () => setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
    img.src = url;
  }

  // Re-trace whenever the source image or a vectorization setting changes.
  useEffect(() => {
    if (!pngUrl) return undefined;
    let cancelled = false;
    setStatus("loading");

    const timer = setTimeout(() => {
      const img = new Image();
      img.onload = () => {
        if (cancelled) return;
        try {
          const scaleFactor = Math.min(
            1,
            MAX_TRACE_DIMENSION / Math.max(img.naturalWidth, img.naturalHeight)
          );
          const traceWidth = Math.max(1, Math.round(img.naturalWidth * scaleFactor));
          const traceHeight = Math.max(1, Math.round(img.naturalHeight * scaleFactor));

          const canvas = document.createElement("canvas");
          canvas.width = traceWidth;
          canvas.height = traceHeight;
          const ctx = canvas.getContext("2d");
          if (!ctx) throw new Error("Canvas is not supported in this browser.");
          ctx.drawImage(img, 0, 0, traceWidth, traceHeight);
          const imageData = ctx.getImageData(0, 0, traceWidth, traceHeight);

          const detail = DETAIL_LEVELS[detailIndex];
          const smoothing = SMOOTHING_LEVELS[smoothingIndex];
          const threshold = THRESHOLD_LEVELS[thresholdIndex];

          const svg = ImageTracer.imagedataToSVG(imageData, {
            numberofcolors: colorCount,
            colorsampling: 1,
            colorquantcycles: 8,
            ltres: detail.ltres,
            qtres: detail.qtres,
            blurradius: smoothing.blurradius,
            blurdelta: 20,
            pathomit: threshold.pathomit,
          });

          if (cancelled) return;
          if (svgUrlRef.current) URL.revokeObjectURL(svgUrlRef.current);
          const blobUrl = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
          svgUrlRef.current = blobUrl;

          setSvgMarkup(svg);
          setSvgUrl(blobUrl);
          setStatus("ready");
        } catch {
          if (!cancelled) {
            setStatus("error");
            setErrorMessage("Couldn't vectorize this image. Try a different file or settings.");
          }
        }
      };
      img.onerror = () => {
        if (!cancelled) {
          setStatus("error");
          setErrorMessage("Couldn't read this PNG. Make sure the file isn't corrupted and try again.");
        }
      };
      img.src = pngUrl;
    }, 200);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [pngUrl, colorCount, detailIndex, smoothingIndex, thresholdIndex]);

  useEffect(() => {
    return () => {
      if (pngUrlRef.current) URL.revokeObjectURL(pngUrlRef.current);
      if (svgUrlRef.current) URL.revokeObjectURL(svgUrlRef.current);
    };
  }, []);

  function reset() {
    if (pngUrlRef.current) URL.revokeObjectURL(pngUrlRef.current);
    if (svgUrlRef.current) URL.revokeObjectURL(svgUrlRef.current);
    pngUrlRef.current = null;
    svgUrlRef.current = null;
    setFile(null);
    setPngUrl(null);
    setNaturalSize(null);
    setSvgMarkup(null);
    setSvgUrl(null);
    setStatus("idle");
    setErrorMessage(null);
    setColorCount(16);
    setDetailIndex(1);
    setSmoothingIndex(0);
    setThresholdIndex(1);
  }

  function handleDownload() {
    if (!svgUrl) return;
    const base = file?.name.replace(/\.png$/i, "") || "converted";
    triggerDownload(svgUrl, `${base}.svg`);
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 text-left">
      <div>
        <h3 className="font-display text-sm font-bold">Color Count</h3>
        <p className="text-ink-muted mt-1 text-sm">
          Fewer colors trace faster and produce simpler, smaller paths.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2" role="group" aria-label="Color count">
          {COLOR_COUNTS.map((count) => (
            <PillButton
              key={count}
              label={String(count)}
              active={colorCount === count}
              onClick={() => setColorCount(count)}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-display text-sm font-bold">Detail Level</h3>
        <p className="text-ink-muted mt-1 text-sm">
          How closely the vector paths follow the original edges.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2" role="group" aria-label="Detail level">
          {DETAIL_LEVELS.map((level, index) => (
            <PillButton
              key={level.label}
              label={level.label}
              active={detailIndex === index}
              onClick={() => setDetailIndex(index)}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-display text-sm font-bold">Smoothing</h3>
        <p className="text-ink-muted mt-1 text-sm">Blurs the source slightly before tracing to soften noisy edges.</p>
        <div className="mt-3 flex flex-wrap items-center gap-2" role="group" aria-label="Smoothing">
          {SMOOTHING_LEVELS.map((level, index) => (
            <PillButton
              key={level.label}
              label={level.label}
              active={smoothingIndex === index}
              onClick={() => setSmoothingIndex(index)}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-display text-sm font-bold">Threshold</h3>
        <p className="text-ink-muted mt-1 text-sm">Filters out small, noisy shapes from the traced result.</p>
        <div className="mt-3 flex flex-wrap items-center gap-2" role="group" aria-label="Threshold">
          {THRESHOLD_LEVELS.map((level, index) => (
            <PillButton
              key={level.label}
              label={level.label}
              active={thresholdIndex === index}
              onClick={() => setThresholdIndex(index)}
            />
          ))}
        </div>
      </div>

      <div>
        <Dropzone onFile={handleFile} accept="image/png,.png" label="Upload Your PNG" />
        {file && (
          <p className="text-ink-muted mt-2 text-xs">
            Selected: {file.name} ({formatBytes(file.size)})
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleDownload}
          disabled={!svgUrl}
          className="bg-primary text-primary-ink rounded-full px-6 py-3 font-medium transition-opacity disabled:opacity-40"
        >
          Download SVG
        </button>
        {file && (
          <button type="button" onClick={reset} className="text-sm text-ink-muted hover:text-ink">
            Choose another PNG
          </button>
        )}
      </div>

      <div role="status" aria-live="polite" className="sr-only">
        {status === "loading" && "Vectorizing image…"}
        {status === "ready" && "Preview updated."}
        {status === "error" && errorMessage}
      </div>

      {status === "error" && errorMessage && (
        <p role="alert" className="text-danger text-sm">
          {errorMessage}
        </p>
      )}

      {status === "loading" && !svgUrl && (
        <p className="text-ink-muted text-sm">Vectorizing your image…</p>
      )}

      {svgUrl && naturalSize && pngUrl && (
        <div className="border-border bg-surface flex flex-col gap-4 rounded-xl border p-4">
          <p className="text-sm font-medium">
            {status === "loading" ? "Updating preview…" : "Drag the slider to compare."}
          </p>
          <CompareSlider
            beforeSrc={pngUrl}
            afterSrc={svgUrl}
            naturalWidth={naturalSize.width}
            naturalHeight={naturalSize.height}
            beforeLabel="PNG"
            afterLabel="SVG"
          />

          {svgMarkup && (
            <details>
              <summary className="text-ink-muted cursor-pointer text-xs font-medium">
                View SVG source ({formatBytes(svgMarkup.length)})
              </summary>
              <pre className="font-readout border-border bg-bg text-ink-muted mt-2 max-h-48 overflow-auto rounded-lg border p-3 text-[11px] leading-relaxed whitespace-pre-wrap break-all">
                {svgMarkup}
              </pre>
            </details>
          )}
        </div>
      )}
    </div>
  );
}
