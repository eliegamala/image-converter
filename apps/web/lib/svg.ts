export interface SvgSize {
  width: number;
  height: number;
}

function parseLength(value: string | null): number | null {
  if (!value) return null;
  const n = parseFloat(value);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
}

/** Reads the intrinsic size off an SVG's root element - its explicit
 * width/height first, falling back to the viewBox - so the tool can prefill
 * sensible export dimensions instead of an arbitrary default. Returns null
 * for markup that doesn't parse as SVG or declares no size either way. */
export function parseSvgIntrinsicSize(markup: string): SvgSize | null {
  if (typeof DOMParser === "undefined") return null;

  const doc = new DOMParser().parseFromString(markup, "image/svg+xml");
  if (doc.querySelector("parsererror")) return null;

  const svg = doc.documentElement;
  if (!svg || svg.nodeName.toLowerCase() !== "svg") return null;

  const width = parseLength(svg.getAttribute("width"));
  const height = parseLength(svg.getAttribute("height"));
  if (width && height) return { width, height };

  const viewBox = svg.getAttribute("viewBox");
  if (viewBox) {
    const parts = viewBox.trim().split(/[\s,]+/).map(Number);
    if (parts.length === 4 && parts.every(Number.isFinite)) {
      const [, , vbWidth, vbHeight] = parts;
      if (vbWidth > 0 && vbHeight > 0) {
        return { width: Math.round(vbWidth), height: Math.round(vbHeight) };
      }
    }
  }

  return null;
}
