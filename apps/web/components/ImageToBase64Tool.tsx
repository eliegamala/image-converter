"use client";

import { useRef, useState } from "react";
import { Dropzone } from "@/components/Dropzone";
import { formatBytes } from "@/lib/format";

type Status = "idle" | "loading" | "ready" | "error";
type CopiedField = "base64" | "datauri" | null;

const DATA_URI_PATTERN = /^data:([^;]*);base64,(.*)$/;

function triggerDownload(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function ImageToBase64Tool() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewUnsupported, setPreviewUnsupported] = useState(false);

  const [dataUri, setDataUri] = useState<string | null>(null);
  const [base64, setBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);

  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<CopiedField>(null);

  const previewUrlRef = useRef<string | null>(null);
  const copiedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleFile(newFile: File) {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    const url = URL.createObjectURL(newFile);
    previewUrlRef.current = url;

    setFile(newFile);
    setPreviewUrl(url);
    setPreviewUnsupported(false);
    setDataUri(null);
    setBase64(null);
    setMimeType(null);
    setErrorMessage(null);
    setCopied(null);
    setStatus("loading");

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      const match = result.match(DATA_URI_PATTERN);
      if (!match) {
        setStatus("error");
        setErrorMessage("Couldn't encode this file. Try a different image.");
        return;
      }
      setDataUri(result);
      setBase64(match[2]);
      setMimeType(newFile.type || match[1] || "application/octet-stream");
      setStatus("ready");
    };
    reader.onerror = () => {
      setStatus("error");
      setErrorMessage("Couldn't read this file. Try a different image.");
    };
    reader.readAsDataURL(newFile);
  }

  function reset() {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
    previewUrlRef.current = null;
    setFile(null);
    setPreviewUrl(null);
    setPreviewUnsupported(false);
    setDataUri(null);
    setBase64(null);
    setMimeType(null);
    setStatus("idle");
    setErrorMessage(null);
    setCopied(null);
  }

  async function copy(text: string, field: CopiedField) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(field);
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
      copiedTimerRef.current = setTimeout(() => setCopied(null), 1800);
    } catch {
      setErrorMessage("Couldn't copy to your clipboard - your browser may have blocked it.");
    }
  }

  function handleDownload() {
    if (!base64 || !file) return;
    const blob = new Blob([base64], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const base = file.name.replace(/\.[^.]+$/, "");
    triggerDownload(url, `${base}-base64.txt`);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 text-left">
      <div>
        <Dropzone
          onFile={handleFile}
          accept="image/*,.svg,.bmp,.tif,.tiff"
          label="Upload Your Image"
        />
        {file && (
          <p className="text-ink-muted mt-2 text-xs">
            Selected: {file.name} ({formatBytes(file.size)})
          </p>
        )}
      </div>

      <div role="status" aria-live="polite" className="sr-only">
        {status === "loading" && "Encoding image…"}
        {status === "ready" && "Base64 ready."}
        {status === "error" && errorMessage}
      </div>

      {status === "error" && errorMessage && (
        <p role="alert" className="text-danger text-sm">
          {errorMessage}
        </p>
      )}

      {status === "loading" && <p className="text-ink-muted text-sm">Encoding your image…</p>}

      {status === "ready" && base64 && dataUri && file && (
        <>
          <div className="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-start">
            {!previewUnsupported ? (
              // eslint-disable-next-line @next/next/no-img-element -- blob: URL, see CompareSlider.tsx
              <img
                src={previewUrl ?? undefined}
                alt="Uploaded preview"
                onError={() => setPreviewUnsupported(true)}
                className="border-border h-32 w-32 rounded-xl border object-contain sm:h-40 sm:w-40"
              />
            ) : (
              <div className="border-border bg-bg text-ink-muted flex h-32 w-32 items-center justify-center rounded-xl border p-3 text-center text-xs sm:h-40 sm:w-40">
                No preview available for this format
              </div>
            )}

            <dl className="font-readout grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-ink-muted text-xs">Original size</dt>
                <dd>{formatBytes(file.size)}</dd>
              </div>
              <div>
                <dt className="text-ink-muted text-xs">Base64 size</dt>
                <dd>{formatBytes(base64.length)}</dd>
              </div>
              <div>
                <dt className="text-ink-muted text-xs">MIME type</dt>
                <dd className="break-all">{mimeType}</dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 className="font-display text-sm font-bold">Base64 Output</h3>
            <textarea
              readOnly
              value={base64}
              spellCheck={false}
              aria-label="Base64 output"
              className="font-readout border-border bg-surface mt-2 h-48 w-full resize-y rounded-lg border p-3 text-xs break-all"
              onFocus={(event) => event.currentTarget.select()}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="bg-primary text-primary-ink rounded-full px-6 py-3 font-medium"
            >
              Download .txt
            </button>
            <button
              type="button"
              onClick={() => copy(base64, "base64")}
              className="border-border text-ink-muted hover:text-ink hover:border-primary rounded-full border px-4 py-1.5 text-xs font-medium transition-colors"
            >
              {copied === "base64" ? "Copied!" : "Copy Base64"}
            </button>
            <button
              type="button"
              onClick={() => copy(dataUri, "datauri")}
              className="border-border text-ink-muted hover:text-ink hover:border-primary rounded-full border px-4 py-1.5 text-xs font-medium transition-colors"
            >
              {copied === "datauri" ? "Copied!" : "Copy Data URI"}
            </button>
            <button
              type="button"
              onClick={reset}
              className="border-border text-ink-muted hover:text-ink hover:border-primary rounded-full border px-4 py-1.5 text-xs font-medium transition-colors"
            >
              Clear
            </button>
          </div>
        </>
      )}
    </div>
  );
}
