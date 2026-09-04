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

/**
 * Uses XMLHttpRequest rather than fetch specifically for `upload.onprogress`
 * - fetch has no cross-browser way to observe request-body upload progress,
 * which is what lets the UI show a real (not simulated) percentage while
 * the file is sent.
 */
export function optimizeImage(
  file: File,
  format: ImageFormat,
  targetBytes?: number,
  onUploadProgress?: (fraction: number) => void
): Promise<OptimizeResult> {
  const body = new FormData();
  body.append("file", file);
  body.append("format", format);
  if (targetBytes) {
    body.append("target_bytes", String(Math.round(targetBytes)));
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_URL}/api/optimize`);
    xhr.responseType = "blob";

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onUploadProgress?.(event.loaded / event.total);
    };

    xhr.onload = async () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const blob = xhr.response as Blob;
        resolve({
          blob,
          url: URL.createObjectURL(blob),
          originalBytes: Number(xhr.getResponseHeader("x-original-bytes") ?? 0),
          outputBytes: Number(xhr.getResponseHeader("x-output-bytes") ?? blob.size),
          quality: Number(xhr.getResponseHeader("x-quality") ?? 0),
          scale: Number(xhr.getResponseHeader("x-scale") ?? 1),
          format: xhr.getResponseHeader("x-format") ?? format.toUpperCase(),
          targetMet: xhr.getResponseHeader("x-target-met") === "true",
          attempts: Number(xhr.getResponseHeader("x-attempts") ?? 0),
          elapsedMs: Number(xhr.getResponseHeader("x-elapsed-ms") ?? 0),
        });
        return;
      }

      let detail = xhr.statusText;
      try {
        const data = JSON.parse(await (xhr.response as Blob).text());
        detail = data.detail ?? detail;
      } catch {
        // response wasn't JSON - keep statusText
      }
      reject(new OptimizeError(detail, xhr.status));
    };

    xhr.onerror = () => {
      reject(new OptimizeError("Network error. Check your connection and try again.", 0));
    };

    xhr.send(body);
  });
}
