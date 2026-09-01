export const BREAKPOINTS = [320, 480, 640, 768, 1024, 1280, 1440, 1920];

export type ImageFormat = "avif" | "webp" | "jpeg";

export interface VariantResult {
  breakpoint: number;
  format: ImageFormat;
  width: number;
  height: number;
  blob: Blob;
  url: string;
}

export interface GenerateOptions {
  includeAvif: boolean;
  includeJpeg: boolean;
  avifQuality: number;
  webpQuality: number;
  jpegQuality: number;
}

export interface GenerateResult {
  variants: VariantResult[];
  avifUnavailable: boolean;
}

export function extensionForFormat(format: ImageFormat): string {
  return format === "jpeg" ? "jpg" : format;
}

export function sanitizeBaseName(fileName: string): string {
  const withoutExt = fileName.replace(/\.[^.]+$/, "");
  const slug = withoutExt
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "image";
}

export function fileNameFor(baseName: string, variant: Pick<VariantResult, "width" | "format">): string {
  return `${baseName}-${variant.width}w.${extensionForFormat(variant.format)}`;
}

function drawScaled(img: HTMLImageElement, targetWidth: number) {
  const aspect = img.naturalHeight / img.naturalWidth;
  const width = targetWidth;
  const height = Math.max(1, Math.round(targetWidth * aspect));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser.");
  ctx.drawImage(img, 0, 0, width, height);
  return { canvas, width, height };
}

function withWhiteBackground(source: HTMLCanvasElement): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = source.width;
  canvas.height = source.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser.");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(source, 0, 0);
  return canvas;
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Encoding failed."))), type, quality);
  });
}

// The AVIF WASM encoder (from the Squoosh project) self-caches its
// initialized instance on the imported module, so this only needs to run
// once per page load - re-running init() would re-fetch and re-instantiate
// the ~3.4MB codec for no reason.
let avifInitPromise: Promise<unknown> | null = null;

async function encodeAvif(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser.");
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const avifEncode = await import("@jsquash/avif/encode");
  if (!avifInitPromise) {
    avifInitPromise = avifEncode.init({ locateFile: (path: string) => `/wasm/${path}` });
  }
  await avifInitPromise;

  const buffer = await avifEncode.default(imageData, { quality });
  return new Blob([buffer], { type: "image/avif" });
}

/** Renders every applicable breakpoint × format combination for one source
 * image. Breakpoints wider than the source are skipped rather than
 * upscaled. Runs sequentially (not in parallel) so progress can be reported
 * and the main thread gets a chance to repaint between encodes. */
export async function generateResponsiveSet(
  img: HTMLImageElement,
  options: GenerateOptions,
  onProgress?: (done: number, total: number) => void
): Promise<GenerateResult> {
  const applicable = BREAKPOINTS.filter((bp) => bp <= img.naturalWidth);
  const breakpoints = applicable.length > 0 ? applicable : [img.naturalWidth];

  const formats: ImageFormat[] = [];
  if (options.includeAvif) formats.push("avif");
  formats.push("webp");
  if (options.includeJpeg) formats.push("jpeg");

  const total = breakpoints.length * formats.length;
  let done = 0;
  const variants: VariantResult[] = [];
  let avifUnavailable = false;

  for (const breakpoint of breakpoints) {
    const { canvas, width, height } = drawScaled(img, breakpoint);

    for (const format of formats) {
      if (format === "avif" && avifUnavailable) {
        done++;
        onProgress?.(done, total);
        continue;
      }

      try {
        let blob: Blob;
        if (format === "avif") {
          blob = await encodeAvif(canvas, options.avifQuality);
        } else if (format === "webp") {
          blob = await canvasToBlob(canvas, "image/webp", options.webpQuality / 100);
        } else {
          blob = await canvasToBlob(withWhiteBackground(canvas), "image/jpeg", options.jpegQuality / 100);
        }
        variants.push({ breakpoint, format, width, height, blob, url: URL.createObjectURL(blob) });
      } catch (err) {
        if (format === "avif") {
          avifUnavailable = true;
        } else {
          throw err;
        }
      }

      done++;
      onProgress?.(done, total);
      // Yield so React can flush the progress update to the screen instead
      // of the whole batch running as one uninterrupted synchronous burst.
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }

  return { variants, avifUnavailable };
}

function escapeHtmlAttribute(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function buildSrcset(variants: VariantResult[], format: ImageFormat, baseName: string): string {
  return variants
    .filter((v) => v.format === format)
    .sort((a, b) => a.width - b.width)
    .map((v) => `${fileNameFor(baseName, v)} ${v.width}w`)
    .join(",\n  ");
}

export interface PictureHtmlOptions {
  variants: VariantResult[];
  baseName: string;
  hasAvif: boolean;
  hasJpeg: boolean;
  sizes: string;
  alt: string;
  fallbackWidth: number;
  fallbackHeight: number;
}

export function buildPictureHtml(opts: PictureHtmlOptions): string {
  const lines: string[] = ["<picture>"];

  if (opts.hasAvif) {
    const srcset = buildSrcset(opts.variants, "avif", opts.baseName);
    if (srcset) lines.push(`  <source\n    type="image/avif"\n    sizes="${opts.sizes}"\n    srcset="${srcset}">`);
  }

  const webpSrcset = buildSrcset(opts.variants, "webp", opts.baseName);
  if (webpSrcset) {
    lines.push(`  <source\n    type="image/webp"\n    sizes="${opts.sizes}"\n    srcset="${webpSrcset}">`);
  }

  const fallbackFormat: ImageFormat = opts.hasJpeg ? "jpeg" : "webp";
  const fallbackVariants = opts.variants
    .filter((v) => v.format === fallbackFormat)
    .sort((a, b) => a.width - b.width);
  const fallbackSrcset = buildSrcset(opts.variants, fallbackFormat, opts.baseName);
  const middle = fallbackVariants[Math.floor((fallbackVariants.length - 1) / 2)];
  const fallbackSrc = middle ? fileNameFor(opts.baseName, middle) : "";

  lines.push(
    `  <img\n    src="${fallbackSrc}"\n    srcset="${fallbackSrcset}"\n    sizes="${opts.sizes}"\n    width="${opts.fallbackWidth}"\n    height="${opts.fallbackHeight}"\n    alt="${escapeHtmlAttribute(opts.alt)}"\n    loading="lazy">`
  );
  lines.push("</picture>");
  return lines.join("\n");
}
