export type ImageFormat = "jpeg" | "png" | "webp" | "avif" | "gif" | "bmp" | "tiff" | "pdf";

export interface OptimizeResult {
  blob: Blob;
  url: string;
  originalBytes: number;
  outputBytes: number;
  quality: number;
  scale: number;
  format: string;
  targetMet: boolean;
  attempts: number;
  elapsedMs: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export class OptimizeError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function recommendFormat(file: File): Promise<ImageFormat | null> {
  const body = new FormData();
  body.append("file", file);

  try {
    const response = await fetch(`${API_URL}/api/recommend-format`, {
      method: "POST",
      body,
    });
    if (!response.ok) return null;
    const data = await response.json();
    return (data.recommended_format as ImageFormat) ?? null;
  } catch {
    return null;
  }
}

export async function optimizeImage(
  file: File,
  format: ImageFormat,
  targetBytes?: number
): Promise<OptimizeResult> {
  const body = new FormData();
  body.append("file", file);
  body.append("format", format);
  if (targetBytes) {
    body.append("target_bytes", String(Math.round(targetBytes)));
  }

  const response = await fetch(`${API_URL}/api/optimize`, {
    method: "POST",
    body,
  });

  if (!response.ok) {
    let detail = response.statusText;
    try {
      const data = await response.json();
      detail = data.detail ?? detail;
    } catch {
      // response wasn't JSON - keep statusText
    }
    throw new OptimizeError(detail, response.status);
  }

  const blob = await response.blob();
  return {
    blob,
    url: URL.createObjectURL(blob),
    originalBytes: Number(response.headers.get("x-original-bytes") ?? 0),
    outputBytes: Number(response.headers.get("x-output-bytes") ?? blob.size),
    quality: Number(response.headers.get("x-quality") ?? 0),
    scale: Number(response.headers.get("x-scale") ?? 1),
    format: response.headers.get("x-format") ?? format.toUpperCase(),
    targetMet: response.headers.get("x-target-met") === "true",
    attempts: Number(response.headers.get("x-attempts") ?? 0),
    elapsedMs: Number(response.headers.get("x-elapsed-ms") ?? 0),
  };
}
