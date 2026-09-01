"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Dropzone } from "@/components/Dropzone";
import {
  buildBrowserConfig,
  buildHtmlTags,
  buildManifest,
  canvasToPngBlob,
  FAVICON_TARGETS,
  ICO_SIZES,
  renderIconCanvas,
} from "@/lib/favicon";
import { formatBytes } from "@/lib/format";
import { buildIco } from "@/lib/ico";

type Status = "idle" | "loading" | "ready" | "error";
type Background = "transparent" | "custom";

interface GeneratedIcon {
  key: string;
  size: number;
  label: string;
  description: string;
  url: string;
  bytes: number;
  blob: Blob;
}

const PADDING_PRESETS = [
  { label: "None", value: 0 },
  { label: "Small", value: 8 },
  { label: "Medium", value: 16 },
  { label: "Large", value: 24 },
];

const CORNER_PRESETS = [
  { label: "Square", value: 0 },
  { label: "Rounded", value: 20 },
  { label: "Circle", value: 50 },
];

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];

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

export function FaviconGeneratorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [imageEl, setImageEl] = useState<HTMLImageElement | null>(null);
  const [naturalSize, setNaturalSize] = useState<{ width: number; height: number } | null>(null);

  const [siteName, setSiteName] = useState("My Website");
  const [background, setBackground] = useState<Background>("transparent");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [paddingPercent, setPaddingPercent] = useState(8);
  const [cornerRadiusPercent, setCornerRadiusPercent] = useState(0);
  const [themeColor, setThemeColor] = useState("#111111");

  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [icons, setIcons] = useState<GeneratedIcon[]>([]);
  const [icoUrl, setIcoUrl] = useState<string | null>(null);
  const [icoBlob, setIcoBlob] = useState<Blob | null>(null);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [zipping, setZipping] = useState(false);

  const sourceUrlRef = useRef<string | null>(null);
  const iconUrlsRef = useRef<string[]>([]);
  const icoUrlRef = useRef<string | null>(null);
  const copiedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleFile(newFile: File) {
    const looksAccepted =
      ACCEPTED_TYPES.includes(newFile.type) || /\.(png|jpe?g|webp|svg)$/i.test(newFile.name);
    if (!looksAccepted) {
      setStatus("error");
      setErrorMessage("Please upload a PNG, JPG, WebP or SVG image.");
      return;
    }

    if (sourceUrlRef.current) URL.revokeObjectURL(sourceUrlRef.current);
    const url = URL.createObjectURL(newFile);
    sourceUrlRef.current = url;

    setFile(newFile);
    setSourceUrl(url);
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

  // Re-render every icon whenever the source image or a customization
  // setting changes - the preview grid always reflects the current controls.
  useEffect(() => {
    if (!imageEl) return undefined;
    let cancelled = false;
    setStatus("loading");

    const timer = setTimeout(async () => {
      try {
        const opts = {
          background: background === "transparent" ? "transparent" : bgColor,
          paddingPercent,
          cornerRadiusPercent,
        };

        const rendered = await Promise.all(
          FAVICON_TARGETS.map(async (target) => {
            const canvas = renderIconCanvas(imageEl, target.size, opts);
            const blob = await canvasToPngBlob(canvas);
            return { ...target, blob };
          })
        );

        const icoFrames = await Promise.all(
          ICO_SIZES.map(async (size) => {
            const canvas = renderIconCanvas(imageEl, size, opts);
            const blob = await canvasToPngBlob(canvas);
            const buffer = await blob.arrayBuffer();
            return { width: size, height: size, pngData: new Uint8Array(buffer) };
          })
        );
        const newIcoBlob = buildIco(icoFrames);

        if (cancelled) return;

        iconUrlsRef.current.forEach((existingUrl) => URL.revokeObjectURL(existingUrl));
        if (icoUrlRef.current) URL.revokeObjectURL(icoUrlRef.current);

        const newIcons: GeneratedIcon[] = rendered.map((r) => ({
          key: r.key,
          size: r.size,
          label: r.label,
          description: r.description,
          url: URL.createObjectURL(r.blob),
          bytes: r.blob.size,
          blob: r.blob,
        }));
        const newIcoUrl = URL.createObjectURL(newIcoBlob);

        iconUrlsRef.current = newIcons.map((icon) => icon.url);
        icoUrlRef.current = newIcoUrl;

        setIcons(newIcons);
        setIcoUrl(newIcoUrl);
        setIcoBlob(newIcoBlob);
        setStatus("ready");
      } catch {
        if (!cancelled) {
          setStatus("error");
          setErrorMessage("Couldn't generate icons from this image. Try a different file.");
        }
      }
    }, 200);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [imageEl, background, bgColor, paddingPercent, cornerRadiusPercent]);

  useEffect(() => {
    return () => {
      if (sourceUrlRef.current) URL.revokeObjectURL(sourceUrlRef.current);
      iconUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      if (icoUrlRef.current) URL.revokeObjectURL(icoUrlRef.current);
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
    };
  }, []);

  const manifestBackground = background === "transparent" ? "#ffffff" : bgColor;
  const manifestText = useMemo(
    () => buildManifest({ siteName: siteName || "My Website", themeColor, backgroundColor: manifestBackground }),
    [siteName, themeColor, manifestBackground]
  );
  const browserConfigText = useMemo(() => buildBrowserConfig(themeColor), [themeColor]);
  const htmlTagsText = useMemo(() => buildHtmlTags(themeColor), [themeColor]);

  function reset() {
    if (sourceUrlRef.current) URL.revokeObjectURL(sourceUrlRef.current);
    iconUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    if (icoUrlRef.current) URL.revokeObjectURL(icoUrlRef.current);
    sourceUrlRef.current = null;
    iconUrlsRef.current = [];
    icoUrlRef.current = null;

    setFile(null);
    setSourceUrl(null);
    setImageEl(null);
    setNaturalSize(null);
    setIcons([]);
    setIcoUrl(null);
    setIcoBlob(null);
    setStatus("idle");
    setErrorMessage(null);
    setCopiedHtml(false);
    setSiteName("My Website");
    setBackground("transparent");
    setBgColor("#ffffff");
    setPaddingPercent(8);
    setCornerRadiusPercent(0);
    setThemeColor("#111111");
  }

  async function copyHtml() {
    try {
      await navigator.clipboard.writeText(htmlTagsText);
      setCopiedHtml(true);
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
      copiedTimerRef.current = setTimeout(() => setCopiedHtml(false), 1800);
    } catch {
      setErrorMessage("Couldn't copy to your clipboard - your browser may have blocked it.");
    }
  }

  async function downloadZip() {
    if (!icoBlob || icons.length === 0) return;
    setZipping(true);
    try {
      const { default: JSZip } = await import("jszip");
      const zip = new JSZip();
      zip.file("favicon.ico", icoBlob);
      icons.forEach((icon) => zip.file(icon.key, icon.blob));
      zip.file("site.webmanifest", manifestText);
      zip.file("browserconfig.xml", browserConfigText);
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      triggerDownload(url, "favicon-package.zip");
      URL.revokeObjectURL(url);
    } catch {
      setErrorMessage("Couldn't build the ZIP package. Try again.");
    } finally {
      setZipping(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 text-left">
      <label className="block">
        <span className="text-ink-muted text-xs font-medium">Site Name</span>
        <input
          type="text"
          value={siteName}
          onChange={(event) => setSiteName(event.target.value)}
          placeholder="My Website"
          className="border-border bg-surface mt-1 w-full max-w-xs rounded-lg border px-3 py-2 text-sm"
        />
      </label>

      <div>
        <h3 className="font-display text-sm font-bold">Background</h3>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <PillButton
            label="Transparent"
            active={background === "transparent"}
            onClick={() => setBackground("transparent")}
          />
          <PillButton label="Custom color" active={background === "custom"} onClick={() => setBackground("custom")} />
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
        <h3 className="font-display text-sm font-bold">Padding</h3>
        <div className="mt-3 flex flex-wrap items-center gap-2" role="group" aria-label="Padding">
          {PADDING_PRESETS.map((preset) => (
            <PillButton
              key={preset.label}
              label={preset.label}
              active={paddingPercent === preset.value}
              onClick={() => setPaddingPercent(preset.value)}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-display text-sm font-bold">Rounded Corners</h3>
        <div className="mt-3 flex flex-wrap items-center gap-2" role="group" aria-label="Rounded corners">
          {CORNER_PRESETS.map((preset) => (
            <PillButton
              key={preset.label}
              label={preset.label}
              active={cornerRadiusPercent === preset.value}
              onClick={() => setCornerRadiusPercent(preset.value)}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-display text-sm font-bold">Theme Color</h3>
        <p className="text-ink-muted mt-1 text-sm">Used for the manifest, browser UI and Windows tile.</p>
        <label className="mt-3 flex items-center gap-2 text-sm">
          <input
            type="color"
            value={themeColor}
            onChange={(event) => setThemeColor(event.target.value)}
            className="border-border h-8 w-10 rounded border p-0.5"
            aria-label="Theme color"
          />
          <span className="font-readout text-ink-muted text-xs">{themeColor}</span>
        </label>
      </div>

      <div>
        <Dropzone
          onFile={handleFile}
          accept="image/png,image/jpeg,image/webp,image/svg+xml,.png,.jpg,.jpeg,.webp,.svg"
          label="Upload Your Logo"
        />
        {file && (
          <p className="text-ink-muted mt-2 text-xs">
            Selected: {file.name} ({formatBytes(file.size)})
            {naturalSize && ` · ${naturalSize.width}×${naturalSize.height}px`}
          </p>
        )}
        {!file && (
          <p className="text-ink-muted mt-2 text-xs">
            Tip: a square image at least 512×512px (PNG or SVG) gives the sharpest results.
          </p>
        )}
      </div>

      <div role="status" aria-live="polite" className="sr-only">
        {status === "loading" && "Generating icons…"}
        {status === "ready" && "Favicon package ready."}
        {status === "error" && errorMessage}
      </div>

      {status === "error" && errorMessage && (
        <p role="alert" className="text-danger text-sm">
          {errorMessage}
        </p>
      )}

      {status === "loading" && <p className="text-ink-muted text-sm">Generating your favicon package…</p>}

      {status === "ready" && icoUrl && sourceUrl && (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={downloadZip}
              disabled={zipping}
              className="bg-primary text-primary-ink rounded-full px-6 py-3 font-medium transition-opacity disabled:opacity-40"
            >
              {zipping ? "Building ZIP…" : "Download Favicon Package (.zip)"}
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
            <h3 className="font-display text-sm font-bold">Generated Icons</h3>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="border-border bg-surface rounded-xl border p-3 text-center">
                <div className="checkerboard mx-auto flex h-16 w-16 items-center justify-center rounded-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element -- blob: URL, see CompareSlider.tsx */}
                  <img src={icoUrl} alt="favicon.ico preview" className="h-full w-full object-contain" />
                </div>
                <p className="mt-2 text-xs font-medium">favicon.ico</p>
                <p className="text-ink-muted text-[11px]">16/32/48 combined</p>
              </div>
              {icons.map((icon) => (
                <div key={icon.key} className="border-border bg-surface rounded-xl border p-3 text-center">
                  <div className="checkerboard mx-auto flex h-16 w-16 items-center justify-center rounded-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element -- blob: URL, see CompareSlider.tsx */}
                    <img src={icon.url} alt={`${icon.key} preview`} className="h-full w-full object-contain" />
                  </div>
                  <p className="mt-2 text-xs font-medium">{icon.label}</p>
                  <p className="text-ink-muted text-[11px]">{icon.description}</p>
                  <p className="font-readout text-ink-muted mt-1 text-[11px]">{formatBytes(icon.bytes)}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display text-sm font-bold">HTML Tags</h3>
            <pre className="font-readout border-border bg-bg text-ink-muted mt-2 max-h-48 overflow-auto rounded-lg border p-3 text-[11px] leading-relaxed whitespace-pre-wrap break-all">
              {htmlTagsText}
            </pre>
          </div>

          <details>
            <summary className="text-ink-muted cursor-pointer text-xs font-medium">View site.webmanifest</summary>
            <pre className="font-readout border-border bg-bg text-ink-muted mt-2 max-h-48 overflow-auto rounded-lg border p-3 text-[11px] leading-relaxed whitespace-pre-wrap break-all">
              {manifestText}
            </pre>
          </details>

          <details>
            <summary className="text-ink-muted cursor-pointer text-xs font-medium">View browserconfig.xml</summary>
            <pre className="font-readout border-border bg-bg text-ink-muted mt-2 max-h-48 overflow-auto rounded-lg border p-3 text-[11px] leading-relaxed whitespace-pre-wrap break-all">
              {browserConfigText}
            </pre>
          </details>
        </>
      )}
    </div>
  );
}
