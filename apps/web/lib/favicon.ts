export interface FaviconTarget {
  key: string;
  size: number;
  label: string;
  description: string;
}

/** Every raster file in the generated package, beyond favicon.ico itself
 * (which is built separately from the 16/32/48 frames - see lib/ico.ts). */
export const FAVICON_TARGETS: FaviconTarget[] = [
  { key: "favicon-16x16.png", size: 16, label: "16×16", description: "Classic browser tab icon" },
  { key: "favicon-32x32.png", size: 32, label: "32×32", description: "Browser tab & taskbar icon" },
  { key: "favicon-48x48.png", size: 48, label: "48×48", description: "Windows site icon" },
  { key: "apple-touch-icon.png", size: 180, label: "180×180", description: "iOS / iPadOS home screen icon" },
  { key: "android-chrome-192x192.png", size: 192, label: "192×192", description: "Android home screen & PWA icon" },
  { key: "android-chrome-512x512.png", size: 512, label: "512×512", description: "Android splash screen & PWA icon" },
  { key: "mstile-150x150.png", size: 150, label: "150×150", description: "Windows Start tile icon" },
];

export const ICO_SIZES = [16, 32, 48];

export interface RenderOptions {
  /** "transparent" or a CSS color string. */
  background: string;
  paddingPercent: number;
  cornerRadiusPercent: number;
}

function roundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.arcTo(x + w, y, x + w, y + radius, radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.arcTo(x + w, y + h, x + w - radius, y + h, radius);
  ctx.lineTo(x + radius, y + h);
  ctx.arcTo(x, y + h, x, y + h - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();
}

/** Renders one square icon at `size`, applying background fill, inset
 * padding (the source is contain-fit within the padded box) and an
 * optional rounded-corner clip - the same three settings applied
 * consistently across every generated size. */
export function renderIconCanvas(
  img: HTMLImageElement,
  size: number,
  opts: RenderOptions
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser.");

  if (opts.cornerRadiusPercent > 0) {
    roundedRectPath(ctx, 0, 0, size, size, (opts.cornerRadiusPercent / 100) * (size / 2));
    ctx.clip();
  }

  if (opts.background !== "transparent") {
    ctx.fillStyle = opts.background;
    ctx.fillRect(0, 0, size, size);
  }

  const padding = (opts.paddingPercent / 100) * size;
  const inner = Math.max(1, size - padding * 2);
  const scale = Math.min(inner / img.naturalWidth, inner / img.naturalHeight);
  const drawWidth = img.naturalWidth * scale;
  const drawHeight = img.naturalHeight * scale;
  ctx.drawImage(img, (size - drawWidth) / 2, (size - drawHeight) / 2, drawWidth, drawHeight);

  return canvas;
}

export function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("PNG encoding failed."))), "image/png");
  });
}

export function buildManifest(opts: { siteName: string; themeColor: string; backgroundColor: string }): string {
  const manifest = {
    name: opts.siteName,
    short_name: opts.siteName,
    icons: [
      { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    theme_color: opts.themeColor,
    background_color: opts.backgroundColor,
    display: "standalone",
  };
  return `${JSON.stringify(manifest, null, 2)}\n`;
}

export function buildBrowserConfig(themeColor: string): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
  <msapplication>
    <tile>
      <square150x150logo src="/mstile-150x150.png"/>
      <TileColor>${themeColor}</TileColor>
    </tile>
  </msapplication>
</browserconfig>
`;
}

export function buildHtmlTags(themeColor: string): string {
  return `<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="msapplication-TileColor" content="${themeColor}">
<meta name="msapplication-config" content="/browserconfig.xml">
<meta name="theme-color" content="${themeColor}">`;
}
