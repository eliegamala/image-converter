"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Dropzone } from "@/components/Dropzone";
import { formatBytes } from "@/lib/format";
import {
  buildPictureHtml,
  fileNameFor,
  generateResponsiveSet,
  sanitizeBaseName,
  type VariantResult,
} from "@/lib/responsiveImage";

type Status = "idle" | "loading" | "ready" | "error";

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/avif", "image/svg+xml"];
const FORMAT_ORDER = { avif: 0, webp: 1, jpeg: 2 } as const;
const AVIF_QUALITY = 60;
const WEBP_QUALITY = 75;
const JPEG_QUALITY = 80;

function triggerDownload(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function PillButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
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

export function ResponsiveImageGeneratorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [imageEl, setImageEl] = useState<HTMLImageElement | null>(null);
  const [naturalSize, setNaturalSize] = useState<{ width: number; height: number } | null>(null);

  const [baseName, setBaseName] = useState("image");
  const [altText, setAltText] = useState("");
  const [sizesAttr, setSizesAttr] = useState("100vw");
  const [includeAvif, setIncludeAvif] = useState(true);
  const [includeJpeg, setIncludeJpeg] = useState(true);

  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [variants, setVariants] = useState<VariantResult[]>([]);
  const [avifUnavailable, setAvifUnavailable] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [zipping, setZipping] = useState(false);

  const sourceUrlRef = useRef<string | null>(null);
  const variantsRef = useRef<VariantResult[]>([]);
  const copiedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const generationIdRef = useRef(0);

  function handleFile(newFile: File) {
    const looksAccepted =
      ACCEPTED_TYPES.includes(newFile.type) || /\.(png|jpe?g|webp|avif|svg)$/i.test(newFile.name);
    if (!looksAccepted) {
      setStatus("error");
      setErrorMessage("Please upload a PNG, JPG, WebP, AVIF or SVG image.");
      return;
    }

    if (sourceUrlRef.current) URL.revokeObjectURL(sourceUrlRef.current);
    const url = URL.createObjectURL(newFile);
    sourceUrlRef.current = url;

    setFile(newFile);
    setBaseName(sanitizeBaseName(newFile.name));
    setImageEl(null);
    setNaturalSize(null);
    setStatus("loading");
    setErrorMessage(null);

    const img = new Image();
    img.onload = () => {
      setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
      setImageEl(img);
    };
    img.onerror = () => {
      setStatus("error");
      setErrorMessage("Couldn't read this image. Make sure the file isn't corrupted and try again.");
    };
    img.src = url;
  }

  // Re-generate the full breakpoint x format matrix whenever the source
  // image or a format toggle changes - but not on every keystroke in the
  // alt text / sizes / file name fields, since those only affect the
  // generated HTML text, not the images themselves.
  useEffect(() => {
    if (!imageEl) return undefined;
    const runId = ++generationIdRef.current;
    let cancelled = false;

    setStatus("loading");
    setErrorMessage(null);
    setProgress({ done: 0, total: 0 });

    (async () => {
      try {
        const result = await generateResponsiveSet(
          imageEl,
          {
            includeAvif,
            includeJpeg,
            avifQuality: AVIF_QUALITY,
            webpQuality: WEBP_QUALITY,
            jpegQuality: JPEG_QUALITY,
          },
          (done, total) => {
            if (cancelled || generationIdRef.current !== runId) return;
            setProgress({ done, total });
          }
        );
        if (cancelled || generationIdRef.current !== runId) return;

        variantsRef.current.forEach((v) => URL.revokeObjectURL(v.url));
        variantsRef.current = result.variants;

        setVariants(result.variants);
        setAvifUnavailable(result.avifUnavailable);
        setStatus("ready");
      } catch {
        if (!cancelled) {
          setStatus("error");
          setErrorMessage("Couldn't generate responsive images from this file. Try a different image.");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [imageEl, includeAvif, includeJpeg]);

  useEffect(() => {
    return () => {
      if (sourceUrlRef.current) URL.revokeObjectURL(sourceUrlRef.current);
      variantsRef.current.forEach((v) => URL.revokeObjectURL(v.url));
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
    };
  }, []);

  const hasAvif = variants.some((v) => v.format === "avif");
  const hasJpeg = variants.some((v) => v.format === "jpeg");

  const htmlText = useMemo(() => {
    if (variants.length === 0 || !naturalSize) return "";
    return buildPictureHtml({
      variants,
      baseName,
      hasAvif,
      hasJpeg,
      sizes: sizesAttr || "100vw",
      alt: altText,
      fallbackWidth: naturalSize.width,
      fallbackHeight: naturalSize.height,
    });
  }, [variants, baseName, hasAvif, hasJpeg, sizesAttr, altText, naturalSize]);

  const sortedVariants = useMemo(
    () =>
      [...variants].sort((a, b) => a.breakpoint - b.breakpoint || FORMAT_ORDER[a.format] - FORMAT_ORDER[b.format]),
    [variants]
  );

  function reset() {
    if (sourceUrlRef.current) URL.revokeObjectURL(sourceUrlRef.current);
    variantsRef.current.forEach((v) => URL.revokeObjectURL(v.url));
    sourceUrlRef.current = null;
    variantsRef.current = [];
    generationIdRef.current++;

    setFile(null);
    setImageEl(null);
    setNaturalSize(null);
    setBaseName("image");
    setAltText("");
    setSizesAttr("100vw");
    setIncludeAvif(true);
    setIncludeJpeg(true);
    setStatus("idle");
    setProgress(null);
    setErrorMessage(null);
    setVariants([]);
    setAvifUnavailable(false);
    setCopiedHtml(false);
  }

  async function copyHtml() {
    if (!htmlText) return;
    try {
      await navigator.clipboard.writeText(htmlText);
      setCopiedHtml(true);
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
      copiedTimerRef.current = setTimeout(() => setCopiedHtml(false), 1800);
    } catch {
      setErrorMessage("Couldn't copy to your clipboard - your browser may have blocked it.");
    }
  }

  async function downloadZip() {
    if (variants.length === 0) return;
    setZipping(true);
    try {
      const { default: JSZip } = await import("jszip");
      const zip = new JSZip();
      variants.forEach((v) => zip.file(fileNameFor(baseName, v), v.blob));
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      triggerDownload(url, `${baseName}-responsive-images.zip`);
      URL.revokeObjectURL(url);
    } catch {
      setErrorMessage("Couldn't build the ZIP package. Try again.");
    } finally {
      setZipping(false);
    }
  }

  const isGenerating = status === "loading" && !!imageEl;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 text-left">
      <div>
        <Dropzone
          onFile={handleFile}
          accept="image/png,image/jpeg,image/webp,image/avif,image/svg+xml,.png,.jpg,.jpeg,.webp,.avif,.svg"
          label="Upload Your Image"
        />
        {file && (
          <p className="text-ink-muted mt-2 text-xs">
            Selected: {file.name} ({formatBytes(file.size)})
            {naturalSize && ` · ${naturalSize.width}×${naturalSize.height}px`}
          </p>
        )}
        {!file && (
          <p className="text-ink-muted mt-2 text-xs">
            Tip: upload the largest version of your image you have - breakpoints wider than the
            source are skipped rather than upscaled.
          </p>
        )}
      </div>

      {file && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-ink-muted text-xs font-medium">File name</span>
              <input
                type="text"
                value={baseName}
                onChange={(event) => setBaseName(sanitizeBaseName(event.target.value) || "image")}
                className="font-readout border-border bg-surface mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-ink-muted text-xs font-medium">Alt text</span>
              <input
                type="text"
                value={altText}
                onChange={(event) => setAltText(event.target.value)}
                placeholder="Describe the image"
                className="border-border bg-surface mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-ink-muted text-xs font-medium">Sizes attribute</span>
            <input
              type="text"
              value={sizesAttr}
              onChange={(event) => setSizesAttr(event.target.value)}
              className="font-readout border-border bg-surface mt-1 w-full max-w-sm rounded-lg border px-3 py-2 text-sm"
            />
            <span className="text-ink-muted mt-1 block text-xs">
              Tells the browser how much of the viewport the image will occupy at each breakpoint.
            </span>
          </label>

          <div>
            <h3 className="font-display text-sm font-bold">Formats</h3>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <PillButton label="AVIF" active={includeAvif} onClick={() => setIncludeAvif((v) => !v)} />
              <span
                title="WebP is always generated as the universal modern baseline"
                className="border-focus bg-focus rounded-full border px-4 py-1.5 text-xs font-medium text-white"
              >
                WebP
              </span>
              <PillButton label="JPG fallback" active={includeJpeg} onClick={() => setIncludeJpeg((v) => !v)} />
            </div>
          </div>
        </>
      )}

      <div role="status" aria-live="polite" className="sr-only">
        {status === "loading" && "Generating responsive images…"}
        {status === "ready" && "Responsive image set ready."}
        {status === "error" && errorMessage}
      </div>

      {status === "error" && errorMessage && (
        <p role="alert" className="text-danger text-sm">
          {errorMessage}
        </p>
      )}

      {isGenerating && (
        <p className="text-ink-muted text-sm">
          Generating your responsive image set
          {progress && progress.total > 0 ? ` (${progress.done}/${progress.total})…` : "…"}
        </p>
      )}

      {status === "ready" && variants.length > 0 && (
        <>
          {avifUnavailable && (
            <p className="text-ink-muted text-sm">
              AVIF encoding isn&apos;t available in this browser, so this set was generated with
              WebP{hasJpeg ? " and JPG" : ""} only.
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={downloadZip}
              disabled={zipping}
              className="bg-primary text-primary-ink rounded-full px-6 py-3 font-medium transition-opacity disabled:opacity-40"
            >
              {zipping ? "Building ZIP…" : "Download All Images (.zip)"}
            </button>
            <button
              type="button"
              onClick={copyHtml}
              className="border-border text-ink-muted hover:text-ink hover:border-primary rounded-full border px-4 py-1.5 text-xs font-medium transition-colors"
            >
              {copiedHtml ? "Copied!" : "Copy HTML"}
            </button>
            <button
              type="button"
              onClick={reset}
              className="border-border text-ink-muted hover:text-ink hover:border-primary rounded-full border px-4 py-1.5 text-xs font-medium transition-colors"
            >
              Clear
            </button>
          </div>

          <div>
            <h3 className="font-display text-sm font-bold">Generated Images</h3>
            <div className="border-border mt-3 overflow-x-auto rounded-xl border">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-border border-b">
                    <th className="p-3 font-medium">Preview</th>
                    <th className="p-3 font-medium">Breakpoint</th>
                    <th className="p-3 font-medium">Format</th>
                    <th className="p-3 font-medium">Dimensions</th>
                    <th className="p-3 font-medium">File size</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedVariants.map((v) => (
                    <tr key={`${v.breakpoint}-${v.format}`} className="border-border border-b last:border-0">
                      <td className="p-2">
                        <div className="checkerboard flex h-10 w-10 items-center justify-center rounded-md">
                          {/* eslint-disable-next-line @next/next/no-img-element -- blob: URL, see CompareSlider.tsx */}
                          <img
                            src={v.url}
                            alt={`${v.width}w ${v.format} preview`}
                            className="h-full w-full object-contain"
                          />
                        </div>
                      </td>
                      <td className="font-readout p-3">{v.breakpoint}px</td>
                      <td className="font-readout p-3 uppercase">{v.format}</td>
                      <td className="font-readout text-ink-muted p-3">
                        {v.width}×{v.height}
                      </td>
                      <td className="font-readout text-ink-muted p-3">{formatBytes(v.blob.size)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="font-display text-sm font-bold">HTML</h3>
            <pre className="font-readout border-border bg-bg text-ink-muted mt-2 max-h-64 overflow-auto rounded-lg border p-3 text-[11px] leading-relaxed whitespace-pre-wrap break-all">
              {htmlText}
            </pre>
          </div>
        </>
      )}
    </div>
  );
}
