"use client";

import { optimize } from "svgo/browser";
import { useEffect, useRef, useState } from "react";
import { CompareSlider } from "@/components/CompareSlider";
import { Dropzone } from "@/components/Dropzone";
import { formatBytes, formatPercentSaved } from "@/lib/format";
import { parseSvgIntrinsicSize } from "@/lib/svg";

type Status = "idle" | "loading" | "ready" | "error";

function triggerDownload(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function countOccurrences(text: string, pattern: RegExp): number {
  return (text.match(pattern) || []).length;
}

export function SvgOptimizerTool() {
  const [file, setFile] = useState<File | null>(null);
  const [originalText, setOriginalText] = useState<string | null>(null);
  const [optimizedText, setOptimizedText] = useState<string | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [optimizedUrl, setOptimizedUrl] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const originalUrlRef = useRef<string | null>(null);
  const optimizedUrlRef = useRef<string | null>(null);
  const copiedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleFile(newFile: File) {
    const looksLikeSvg = newFile.type === "image/svg+xml" || /\.svg$/i.test(newFile.name);
    if (!looksLikeSvg) {
      setStatus("error");
      setErrorMessage("That doesn't look like an SVG file - please choose a .svg file.");
      return;
    }

    setStatus("loading");
    setErrorMessage(null);

    newFile.text().then((text) => {
      // Deferred so the "Optimizing…" state has a chance to paint before the
      // (synchronous, potentially non-trivial) optimization pass runs.
      setTimeout(() => {
        try {
          const result = optimize(text, { multipass: true });

          if (originalUrlRef.current) URL.revokeObjectURL(originalUrlRef.current);
          if (optimizedUrlRef.current) URL.revokeObjectURL(optimizedUrlRef.current);

          const originalBlobUrl = URL.createObjectURL(new Blob([text], { type: "image/svg+xml" }));
          const optimizedBlobUrl = URL.createObjectURL(
            new Blob([result.data], { type: "image/svg+xml" })
          );
          originalUrlRef.current = originalBlobUrl;
          optimizedUrlRef.current = optimizedBlobUrl;

          setFile(newFile);
          setOriginalText(text);
          setOptimizedText(result.data);
          setOriginalUrl(originalBlobUrl);
          setOptimizedUrl(optimizedBlobUrl);
          setDimensions(parseSvgIntrinsicSize(text));
          setStatus("ready");
        } catch {
          setStatus("error");
          setErrorMessage("Couldn't optimize this SVG. Make sure the file isn't corrupted and try again.");
        }
      }, 50);
    });
  }

  useEffect(() => {
    return () => {
      if (originalUrlRef.current) URL.revokeObjectURL(originalUrlRef.current);
      if (optimizedUrlRef.current) URL.revokeObjectURL(optimizedUrlRef.current);
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
    };
  }, []);

  function reset() {
    if (originalUrlRef.current) URL.revokeObjectURL(originalUrlRef.current);
    if (optimizedUrlRef.current) URL.revokeObjectURL(optimizedUrlRef.current);
    originalUrlRef.current = null;
    optimizedUrlRef.current = null;
    setFile(null);
    setOriginalText(null);
    setOptimizedText(null);
    setOriginalUrl(null);
    setOptimizedUrl(null);
    setDimensions(null);
    setStatus("idle");
    setErrorMessage(null);
    setCopied(false);
  }

  function downloadOptimized() {
    if (!optimizedUrl || !file) return;
    const base = file.name.replace(/\.svg$/i, "");
    triggerDownload(optimizedUrl, `${base}-optimized.svg`);
  }

  async function copyOptimized() {
    if (!optimizedText) return;
    try {
      await navigator.clipboard.writeText(optimizedText);
      setCopied(true);
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
      copiedTimerRef.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      setErrorMessage("Couldn't copy to your clipboard - your browser may have blocked it.");
    }
  }

  const originalBytes = file?.size ?? 0;
  const optimizedBytes = optimizedText ? new Blob([optimizedText]).size : 0;
  const bytesSaved = Math.max(0, originalBytes - optimizedBytes);
  const percentSaved = originalBytes > 0 ? formatPercentSaved(originalBytes, optimizedBytes) : "0%";

  const details: string[] = [];
  if (originalText && optimizedText) {
    if (bytesSaved > 0) {
      details.push(`Reduced file size by ${percentSaved}`);
    }
    if (/<!--/.test(originalText) && !/<!--/.test(optimizedText)) {
      details.push("Removed comments");
    }
    if (/<metadata[\s>]/i.test(originalText) && !/<metadata[\s>]/i.test(optimizedText)) {
      details.push("Removed metadata");
    }
    if (/^\s*<\?xml/i.test(originalText) && !/^\s*<\?xml/i.test(optimizedText)) {
      details.push("Removed the XML declaration");
    }
    const idsBefore = countOccurrences(originalText, /\bid="/g);
    const idsAfter = countOccurrences(optimizedText, /\bid="/g);
    if (idsBefore > idsAfter) {
      details.push(`Cleaned up unused IDs (${idsBefore} → ${idsAfter})`);
    }
    if (optimizedText.length < originalText.length) {
      details.push("Trimmed whitespace and simplified path data");
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 text-left">
      <div>
        <Dropzone onFile={handleFile} accept="image/svg+xml,.svg" label="Upload Your SVG" />
        {file && (
          <p className="text-ink-muted mt-2 text-xs">
            Selected: {file.name} ({formatBytes(file.size)})
          </p>
        )}
      </div>

      <div role="status" aria-live="polite" className="sr-only">
        {status === "loading" && "Optimizing…"}
        {status === "ready" && "Optimization complete."}
        {status === "error" && errorMessage}
      </div>

      {status === "error" && errorMessage && (
        <p role="alert" className="text-danger text-sm">
          {errorMessage}
        </p>
      )}

      {status === "loading" && <p className="text-ink-muted text-sm">Optimizing your SVG…</p>}

      {status === "ready" && originalUrl && optimizedUrl && optimizedText && (
        <>
          <dl className="font-readout grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-5">
            <div>
              <dt className="text-ink-muted text-xs">Original size</dt>
              <dd>{formatBytes(originalBytes)}</dd>
            </div>
            <div>
              <dt className="text-ink-muted text-xs">Optimized size</dt>
              <dd>{formatBytes(optimizedBytes)}</dd>
            </div>
            <div>
              <dt className="text-ink-muted text-xs">Bytes saved</dt>
              <dd>{formatBytes(bytesSaved)}</dd>
            </div>
            <div>
              <dt className="text-ink-muted text-xs">Reduction</dt>
              <dd>{percentSaved}</dd>
            </div>
            <div>
              <dt className="text-ink-muted text-xs">Dimensions</dt>
              <dd>{dimensions ? `${dimensions.width}×${dimensions.height}px` : "Unavailable"}</dd>
            </div>
          </dl>

          {details.length > 0 && (
            <ul className="text-ink-muted flex flex-col gap-1 text-sm">
              {details.map((detail) => (
                <li key={detail} className="flex gap-2">
                  <span className="text-primary">·</span>
                  {detail}
                </li>
              ))}
            </ul>
          )}

          <div className="border-border bg-surface rounded-xl border p-4">
            <p className="text-sm font-medium">Drag the slider to compare.</p>
            <div className="mt-4">
              <CompareSlider
                beforeSrc={originalUrl}
                afterSrc={optimizedUrl}
                naturalWidth={dimensions?.width ?? 0}
                naturalHeight={dimensions?.height ?? 0}
                beforeLabel="Original"
                afterLabel="Optimized"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={downloadOptimized}
              className="bg-primary text-primary-ink rounded-full px-6 py-3 font-medium"
            >
              Download Optimized SVG
            </button>
            <button
              type="button"
              onClick={copyOptimized}
              className="border-border text-ink-muted hover:text-ink hover:border-primary rounded-full border px-4 py-1.5 text-xs font-medium transition-colors"
            >
              {copied ? "Copied!" : "Copy Optimized SVG"}
            </button>
            <button
              type="button"
              onClick={reset}
              className="border-border text-ink-muted hover:text-ink hover:border-primary rounded-full border px-4 py-1.5 text-xs font-medium transition-colors"
            >
              Clear
            </button>
          </div>

          <details>
            <summary className="text-ink-muted cursor-pointer text-xs font-medium">
              View optimized source ({formatBytes(optimizedBytes)})
            </summary>
            <pre className="font-readout border-border bg-bg text-ink-muted mt-2 max-h-64 overflow-auto rounded-lg border p-3 text-[11px] leading-relaxed whitespace-pre-wrap break-all">
              {optimizedText}
            </pre>
          </details>
        </>
      )}
    </div>
  );
}
