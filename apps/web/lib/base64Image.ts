export type Base64InputKind = "Data URI" | "Raw Base64";

export interface ParsedBase64Input {
  inputKind: Base64InputKind;
  declaredMimeType: string | null;
  base64: string;
}

const DATA_URI_RE = /^data:([^;,]*);base64,([\s\S]*)$/i;

/** Splits pasted text into its declared MIME type (if any) and raw base64
 * payload, accepting either a full data URI or a bare base64 string. */
export function parseBase64Input(raw: string): ParsedBase64Input {
  const trimmed = raw.trim();
  const match = trimmed.match(DATA_URI_RE);
  if (match) {
    return {
      inputKind: "Data URI",
      declaredMimeType: match[1] ? match[1].trim() : null,
      base64: match[2].replace(/\s+/g, ""),
    };
  }
  return {
    inputKind: "Raw Base64",
    declaredMimeType: null,
    base64: trimmed.replace(/\s+/g, ""),
  };
}

/** Decodes base64 (standard or URL-safe alphabet) into raw bytes. */
export function base64ToBytes(base64: string) {
  let normalized = base64.replace(/-/g, "+").replace(/_/g, "/");
  const remainder = normalized.length % 4;
  if (remainder === 2) normalized += "==";
  else if (remainder === 3) normalized += "=";
  else if (remainder === 1) throw new Error("Invalid base64 length");

  const binary = atob(normalized);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

const SIGNATURES: { mime: string; check: (bytes: Uint8Array) => boolean }[] = [
  {
    mime: "image/png",
    check: (b) =>
      b.length >= 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47,
  },
  { mime: "image/jpeg", check: (b) => b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { mime: "image/gif", check: (b) => b.length >= 6 && b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 },
  {
    mime: "image/webp",
    check: (b) =>
      b.length >= 12 &&
      b[0] === 0x52 &&
      b[1] === 0x49 &&
      b[2] === 0x46 &&
      b[3] === 0x46 &&
      b[8] === 0x57 &&
      b[9] === 0x45 &&
      b[10] === 0x42 &&
      b[11] === 0x50,
  },
  {
    mime: "image/tiff",
    check: (b) =>
      b.length >= 4 &&
      ((b[0] === 0x49 && b[1] === 0x49 && b[2] === 0x2a && b[3] === 0x00) ||
        (b[0] === 0x4d && b[1] === 0x4d && b[2] === 0x00 && b[3] === 0x2a)),
  },
  // Checked after the more specific signatures above since "BM" is a weak,
  // two-byte match that could coincidentally prefix other binary data.
  { mime: "image/bmp", check: (b) => b.length >= 2 && b[0] === 0x42 && b[1] === 0x4d },
];

/** Identifies an image format from its magic bytes, falling back to a text
 * sniff for SVG since it has no binary signature. */
export function sniffImageMimeType(bytes: Uint8Array): string | null {
  for (const signature of SIGNATURES) {
    if (signature.check(bytes)) return signature.mime;
  }
  const head = new TextDecoder().decode(bytes.slice(0, 300));
  if (/<svg[\s>]/i.test(head) || (/<\?xml/i.test(head) && /<svg/i.test(head))) {
    return "image/svg+xml";
  }
  return null;
}

const EXTENSIONS: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/bmp": "bmp",
  "image/tiff": "tiff",
  "image/svg+xml": "svg",
};

export function extensionForMime(mime: string): string {
  return EXTENSIONS[mime] ?? "bin";
}
