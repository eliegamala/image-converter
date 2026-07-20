"use client";

import { useEffect, useRef, useState } from "react";
import {
  base64ToBytes,
  extensionForMime,
  parseBase64Input,
  sniffImageMimeType,
  type Base64InputKind,
} from "@/lib/base64Image";
import { formatBytes } from "@/lib/format";

type Status = "idle" | "loading" | "ready" | "error";

const PLACEHOLDER = "Paste a Base64 string or a data URI, e.g. data:image/png;base64,iVBORw0KGgo...";

function triggerDownload(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function loadImageElement(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Couldn't load image"));
    img.src = url;
  });
}

async function toFormatBlob(
  url: string,
  targetMime: "image/png" | "image/jpeg" | "image/webp"
): Promise<Blob> {
  const img = await loadImageElement(url);
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser.");
  if (targetMime === "image/jpeg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.drawImage(img, 0, 0);
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Encoding failed"))), targetMime, 0.92);
  });
}

const FORMAT_BUTTONS: { label: string; mime: "image/png" | "image/jpeg" | "image/webp" }[] = [
  { label: "Download as PNG", mime: "image/png" },
  { label: "Download as JPG", mime: "image/jpeg" },
  { label: "Download as WebP", mime: "image/webp" },
];

export function Base64ToImageTool() {
  const [inputText, setInputText] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewUnsupported, setPreviewUnsupported] = useState(false);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [inputKind, setInputKind] = useState<Base64InputKind | null>(null);
  const [byteLength, setByteLength] = useState<number | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [copied, setCopied] = useState(false);

  const previewUrlRef = useRef<string | null>(null);
  const decodedBytesRef = useRef<ReturnType<typeof base64ToBytes> | null>(null);
  const copiedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!inputText.trim()) {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
      decodedBytesRef.current = null;
      setStatus("idle");
      setErrorMessage(null);
      setPreviewUrl(null);
      setPreviewUnsupported(false);
      setMimeType(null);
      setInputKind(null);
      setByteLength(null);
      setDimensions(null);
      return undefined;
    }

    setStatus("loading");
    const timer = setTimeout(() => {
      try {
        const parsed = parseBase64Input(inputText);
        if (!parsed.base64) throw new Error("empty");

        const bytes = base64ToBytes(parsed.base64);
        const detectedMime = parsed.declaredMimeType || sniffImageMimeType(bytes);
        if (!detectedMime || !detectedMime.startsWith("image/")) {
          throw new Error("This doesn't look like a valid Base64-encoded image.");
        }

        if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
        const blob = new Blob([bytes], { type: detectedMime });
        const url = URL.createObjectURL(blob);
        previewUrlRef.current = url;
        decodedBytesRef.current = bytes;

        setMimeType(detectedMime);
        setInputKind(parsed.inputKind);
        setByteLength(bytes.length);
        setPreviewUrl(url);
        setPreviewUnsupported(false);
        setDimensions(null);
        setErrorMessage(null);

        const img = new Image();
        img.onload = () => {
          setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
          setStatus("ready");
        };
        img.onerror = () => {
          setPreviewUnsupported(true);
          setStatus("ready");
        };
        img.src = url;
      } catch {
        decodedBytesRef.current = null;
        setStatus("error");
        setErrorMessage("This doesn't look like a valid Base64-encoded image. Check the string and try again.");
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [inputText]);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
    };
  }, []);

  function clear() {
    setInputText("");
  }

  function downloadOriginal() {
    if (!decodedBytesRef.current || !mimeType) return;
    const bytes = decodedBytesRef.current;
    const blob = new Blob([bytes], { type: mimeType });
    const url = URL.createObjectURL(blob);
    triggerDownload(url, `decoded-image.${extensionForMime(mimeType)}`);
    URL.revokeObjectURL(url);
  }

  async function downloadAs(targetMime: "image/png" | "image/jpeg" | "image/webp") {
    if (!previewUrl) return;
    try {
      const blob = await toFormatBlob(previewUrl, targetMime);
      const url = URL.createObjectURL(blob);
      triggerDownload(url, `decoded-image.${extensionForMime(targetMime)}`);
      URL.revokeObjectURL(url);
    } catch {
      setErrorMessage("Couldn't convert this image to that format.");
    }
  }

  async function copyImage() {
    if (!previewUrl) return;
    try {
      const blob = await toFormatBlob(previewUrl, "image/png");
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
      setCopied(true);
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
      copiedTimerRef.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      setErrorMessage(
        "Couldn't copy the image - your browser may not support copying images to the clipboard."
      );
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 text-left">
      <div>
        <h3 className="font-display text-sm font-bold">Base64 Input</h3>
        <textarea
          value={inputText}
          onChange={(event) => setInputText(event.target.value)}
          placeholder={PLACEHOLDER}
          spellCheck={false}
          aria-label="Base64 or data URI input"
          className="font-readout border-border bg-surface mt-2 h-40 w-full resize-y rounded-lg border p-3 text-xs break-all"
        />
        <div className="mt-2 flex items-center justify-between gap-2">
          <p className="text-ink-muted text-xs">
            Accepts a raw Base64 string or a full data URI - the format is detected automatically.
          </p>
          {inputText && (
            <button
              type="button"
              onClick={clear}
              className="text-ink-muted hover:text-ink shrink-0 text-xs font-medium"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div role="status" aria-live="polite" className="sr-only">
        {status === "loading" && "Decoding…"}
        {status === "ready" && "Image decoded."}
        {status === "error" && errorMessage}
      </div>

      {status === "error" && errorMessage && (
        <p role="alert" className="text-danger text-sm">
          {errorMessage}
        </p>
      )}

      {status === "loading" && <p className="text-ink-muted text-sm">Decoding…</p>}

      {status === "ready" && mimeType && byteLength !== null && inputKind && (
        <>
          <div className="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-start">
            {!previewUnsupported && previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- blob: URL, see CompareSlider.tsx
              <img
                src={previewUrl}
                alt="Decoded preview"
                className="border-border h-32 w-32 rounded-xl border object-contain sm:h-40 sm:w-40"
              />
            ) : (
              <div className="border-border bg-bg text-ink-muted flex h-32 w-32 items-center justify-center rounded-xl border p-3 text-center text-xs sm:h-40 sm:w-40">
                No preview available for this format
              </div>
            )}

            <dl className="font-readout grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-4">
              <div>
                <dt className="text-ink-muted text-xs">MIME type</dt>
                <dd className="break-all">{mimeType}</dd>
              </div>
              <div>
                <dt className="text-ink-muted text-xs">Dimensions</dt>
                <dd>{dimensions ? `${dimensions.width}×${dimensions.height}px` : "Unavailable"}</dd>
              </div>
              <div>
                <dt className="text-ink-muted text-xs">File size</dt>
                <dd>{formatBytes(byteLength)}</dd>
              </div>
              <div>
                <dt className="text-ink-muted text-xs">Input type</dt>
                <dd>{inputKind}</dd>
              </div>
            </dl>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={downloadOriginal}
              className="bg-primary text-primary-ink rounded-full px-6 py-3 font-medium"
            >
              Download Original (.{extensionForMime(mimeType)})
            </button>
            {!previewUnsupported &&
              FORMAT_BUTTONS.map((f) => (
                <button
                  key={f.mime}
                  type="button"
                  onClick={() => downloadAs(f.mime)}
                  className="border-border text-ink-muted hover:text-ink hover:border-primary rounded-full border px-4 py-1.5 text-xs font-medium transition-colors"
                >
                  {f.label}
                </button>
              ))}
            {!previewUnsupported && (
              <button
                type="button"
                onClick={copyImage}
                className="border-border text-ink-muted hover:text-ink hover:border-primary rounded-full border px-4 py-1.5 text-xs font-medium transition-colors"
              >
                {copied ? "Copied!" : "Copy Image"}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
