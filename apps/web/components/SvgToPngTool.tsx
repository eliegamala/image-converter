"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Dropzone } from "@/components/Dropzone";
import { formatBytes } from "@/lib/format";
import { parseSvgIntrinsicSize } from "@/lib/svg";

const SCALES = [1, 2, 4] as const;
type Scale = (typeof SCALES)[number];
type Background = "transparent" | "custom";
type Status = "idle" | "ready" | "error";

const DEFAULT_SIZE = 512;
const MAX_DIMENSION = 4000;

function clampDimension(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_SIZE;
  return Math.min(MAX_DIMENSION, Math.max(1, Math.round(value)));
}

function triggerDownload(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function SvgToPngTool() {
  const [file, setFile] = useState<File | null>(null);
  const [svgUrl, setSvgUrl] = useState<string | null>(null);
  const [width, setWidth] = useState(DEFAULT_SIZE);
  const [height, setHeight] = useState(DEFAULT_SIZE);
  const [scale, setScale] = useState<Scale>(1);
  const [background, setBackground] = useState<Background>("transparent");
  const [bgColor, setBgColor] = useState("#ffffff");

  const [pngUrl, setPngUrl] = useState<string | null>(null);
  const [pngBytes, setPngBytes] = useState<number | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const svgUrlRef = useRef<string | null>(null);
  const pngUrlRef = useRef<string | null>(null);

  const handleFile = useCallback(async (newFile: File) => {
    const looksLikeSvg = newFile.type === "image/svg+xml" || /\.svg$/i.test(newFile.name);
    if (!looksLikeSvg) {
      setStatus("error");
      setErrorMessage("That doesn't look like an SVG file - please choose a .svg file.");
      return;
    }

    const text = await newFile.text();

    if (svgUrlRef.current) URL.revokeObjectURL(svgUrlRef.current);
    if (pngUrlRef.current) URL.revokeObjectURL(pngUrlRef.current);
    pngUrlRef.current = null;

    const url = URL.createObjectURL(new Blob([text], { type: "image/svg+xml" }));
    svgUrlRef.current = url;

    const intrinsic = parseSvgIntrinsicSize(text);
    setFile(newFile);
    setSvgUrl(url);
    setWidth(intrinsic ? clampDimension(intrinsic.width) : DEFAULT_SIZE);
    setHeight(intrinsic ? clampDimension(intrinsic.height) : DEFAULT_SIZE);
    setPngUrl(null);
    setPngBytes(null);
    setStatus("idle");
    setErrorMessage(null);
  }, []);

  // Re-rasterize onto a canvas whenever the source SVG or an export setting
  // changes - the preview and download are always in sync with the controls,
  // no separate "Convert" step needed.
  useEffect(() => {
    if (!svgUrl) return undefined;
    let cancelled = false;

    const timer = setTimeout(() => {
      const img = new Image();
      img.onload = () => {
        if (cancelled) return;
        const canvas = document.createElement("canvas");
        canvas.width = clampDimension(width) * scale;
        canvas.height = clampDimension(height) * scale;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        if (background === "custom") {
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          if (cancelled || !blob) return;
          if (pngUrlRef.current) URL.revokeObjectURL(pngUrlRef.current);
          const url = URL.createObjectURL(blob);
          pngUrlRef.current = url;
          setPngUrl(url);
          setPngBytes(blob.size);
          setStatus("ready");
        }, "image/png");
      };
      img.onerror = () => {
        if (cancelled) return;
        setStatus("error");
        setErrorMessage("Couldn't render this SVG. Make sure the file isn't corrupted and try again.");
      };
      img.src = svgUrl;
    }, 150);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [svgUrl, width, height, scale, background, bgColor]);

  useEffect(() => {
    return () => {
      if (svgUrlRef.current) URL.revokeObjectURL(svgUrlRef.current);
      if (pngUrlRef.current) URL.revokeObjectURL(pngUrlRef.current);
    };
  }, []);

  function reset() {
    if (svgUrlRef.current) URL.revokeObjectURL(svgUrlRef.current);
    if (pngUrlRef.current) URL.revokeObjectURL(pngUrlRef.current);
    svgUrlRef.current = null;
    pngUrlRef.current = null;
    setFile(null);
    setSvgUrl(null);
    setPngUrl(null);
    setPngBytes(null);
    setStatus("idle");
    setErrorMessage(null);
    setWidth(DEFAULT_SIZE);
    setHeight(DEFAULT_SIZE);
    setScale(1);
    setBackground("transparent");
  }

  function handleDownload() {
    if (!pngUrl) return;
    const base = file?.name.replace(/\.svg$/i, "") || "converted";
    triggerDownload(pngUrl, `${base}.png`);
  }

  const outputWidth = clampDimension(width) * scale;
  const outputHeight = clampDimension(height) * scale;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 text-left">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-ink-muted text-xs font-medium">Width (px)</span>
          <input
            type="number"
            min={1}
            max={MAX_DIMENSION}
            value={width}
            onChange={(event) => setWidth(clampDimension(Number(event.target.value)))}
            className="font-readout border-border bg-surface mt-1 w-full rounded-lg border px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="text-ink-muted text-xs font-medium">Height (px)</span>
          <input
            type="number"
            min={1}
            max={MAX_DIMENSION}
            value={height}
            onChange={(event) => setHeight(clampDimension(Number(event.target.value)))}
            className="font-readout border-border bg-surface mt-1 w-full rounded-lg border px-3 py-2 text-sm"
          />
        </label>
      </div>

      <div>
        <h3 className="font-display text-sm font-bold">Export Scale</h3>
        <p className="text-ink-muted mt-1 text-sm">
          Renders at a higher pixel density for crisp results on retina screens.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2" role="group" aria-label="Export scale">
          {SCALES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setScale(s)}
              aria-pressed={scale === s}
              className={`font-readout rounded-full border px-4 py-1.5 text-xs transition-colors ${
                scale === s
                  ? "border-focus bg-focus text-white"
                  : "border-border text-ink-muted hover:text-ink hover:border-primary"
              }`}
            >
              {s}×
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-display text-sm font-bold">Background</h3>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setBackground("transparent")}
            aria-pressed={background === "transparent"}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
              background === "transparent"
                ? "border-focus bg-focus text-white"
                : "border-border text-ink-muted hover:text-ink hover:border-primary"
            }`}
          >
            Transparent
          </button>
          <button
            type="button"
            onClick={() => setBackground("custom")}
            aria-pressed={background === "custom"}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
              background === "custom"
                ? "border-focus bg-focus text-white"
                : "border-border text-ink-muted hover:text-ink hover:border-primary"
            }`}
          >
            Custom color
          </button>
          {background === "custom" && (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="color"
                value={bgColor}
                onChange={(event) => setBgColor(event.target.value)}
                className="border-border h-8 w-10 rounded border p-0.5"
                aria-label="Background color"
              />
              <span className="font-readout text-ink-muted text-xs">{bgColor}</span>
            </label>
          )}
        </div>
      </div>

      <div>
        <Dropzone onFile={handleFile} accept="image/svg+xml,.svg" label="Upload Your SVG" />
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
          disabled={!pngUrl}
          className="bg-primary text-primary-ink rounded-full px-6 py-3 font-medium transition-opacity disabled:opacity-40"
        >
          Download PNG
        </button>
        {file && (
          <button type="button" onClick={reset} className="text-sm text-ink-muted hover:text-ink">
            Choose another SVG
          </button>
        )}
      </div>

      <div role="status" aria-live="polite" className="sr-only">
        {status === "ready" && "Preview updated."}
        {status === "error" && errorMessage}
      </div>

      {status === "error" && errorMessage && (
        <p role="alert" className="text-danger text-sm">
          {errorMessage}
        </p>
      )}

      {pngUrl && (
        <div className="border-border bg-surface flex flex-col gap-4 rounded-xl border p-4">
          <p className="font-readout text-ink-muted text-xs">
            {outputWidth}×{outputHeight}px
            {pngBytes !== null && <span> · {formatBytes(pngBytes)}</span>}
          </p>
          <div className="checkerboard border-border rounded-lg border p-4">
            {/* eslint-disable-next-line @next/next/no-img-element -- blob: URL, see CompareSlider.tsx */}
            <img src={pngUrl} alt="PNG preview" className="mx-auto max-h-96 w-auto object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
