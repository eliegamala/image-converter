import type UpscalerCtor from "upscaler";

type UpscalerInstance = InstanceType<typeof UpscalerCtor>;

export type EnhanceMode = "enhance" | "2x" | "4x";

export interface EnhanceResult {
  blob: Blob;
  url: string;
  width: number;
  height: number;
  elapsedMs: number;
}

// Keeps processing time and tensor memory bounded on very large photos -
// the model itself has no hard limit, but a phone photo can be 4000px+ on
// its long edge, and running that through a CNN in the browser (especially
// on a WebGL-less/software-rendering fallback) would be minutes, not
// seconds. Capping the input, not the output, is what keeps "Upscale 4x"
// fast regardless of what someone uploads.
const MAX_INPUT_DIMENSION = 1200;

// Real ESRGAN super-resolution models (MIT-licensed, via UpscalerJS) run
// entirely client-side - no server upload, no per-image API cost. The x2
// weights are reused for "Enhance" (upscale then resample back down) since
// that's what actually improves perceived sharpness/clarity without
// changing output dimensions; see the /image-enhancer page copy for the
// honest explanation of what this can and can't recover.
type Scale = 2 | 4;

let cachedUpscalers: Partial<Record<Scale, Promise<UpscalerInstance>>> = {};

async function getUpscaler(scale: Scale): Promise<UpscalerInstance> {
  const existing = cachedUpscalers[scale];
  if (existing) return existing;

  const promise = (async () => {
    const [{ default: Upscaler }, modelMod] = await Promise.all([
      import("upscaler"),
      scale === 2 ? import("@upscalerjs/esrgan-slim/2x") : import("@upscalerjs/esrgan-slim/4x"),
    ]);
    const model = {
      ...modelMod.default,
      path: `/models/esrgan-slim/x${scale}/model.json`,
    };
    return new Upscaler({ model });
  })();

  cachedUpscalers[scale] = promise;
  return promise;
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Couldn't load this image. Make sure the file isn't corrupted."));
    img.src = url;
  });
}

function drawToCanvas(source: CanvasImageSource, width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser.");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source, 0, 0, width, height);
  return canvas;
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Encoding the result failed."))), "image/png");
  });
}

export async function enhanceImage(file: File, mode: EnhanceMode): Promise<EnhanceResult> {
  const start = performance.now();
  const objectUrl = URL.createObjectURL(file);
  let sourceImg: HTMLImageElement;
  try {
    sourceImg = await loadImage(objectUrl);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }

  const scaleDown = Math.min(1, MAX_INPUT_DIMENSION / Math.max(sourceImg.naturalWidth, sourceImg.naturalHeight));
  const baseWidth = Math.max(1, Math.round(sourceImg.naturalWidth * scaleDown));
  const baseHeight = Math.max(1, Math.round(sourceImg.naturalHeight * scaleDown));
  const baseCanvas = drawToCanvas(sourceImg, baseWidth, baseHeight);

  // "Enhance" always runs the x2 model (cheaper than x4) then resamples
  // back to the original size - "Upscale 2x/4x" run the matching model and
  // keep its native output size.
  const modelScale: Scale = mode === "4x" ? 4 : 2;
  const upscaler = await getUpscaler(modelScale);

  // Patch-based processing keeps memory bounded on the largest inputs this
  // tool allows (capped above, but a 1200x1200 source through a 4x model
  // still produces a 4800x4800 intermediate tensor without tiling).
  const needsPatching = Math.max(baseWidth, baseHeight) > 400;
  const upscaledDataUrl = await upscaler.upscale(
    baseCanvas,
    needsPatching ? { patchSize: 200, padding: 4 } : {}
  );

  const upscaledImg = await loadImage(upscaledDataUrl);

  const finalCanvas =
    mode === "enhance"
      ? drawToCanvas(upscaledImg, baseWidth, baseHeight)
      : drawToCanvas(upscaledImg, upscaledImg.naturalWidth, upscaledImg.naturalHeight);

  const blob = await canvasToBlob(finalCanvas);

  return {
    blob,
    url: URL.createObjectURL(blob),
    width: finalCanvas.width,
    height: finalCanvas.height,
    elapsedMs: performance.now() - start,
  };
}

/** Frees the cached TF.js models and their GPU/CPU memory - call when the
 * enhancer tool unmounts, since the models otherwise stay resident for the
 * lifetime of the page. */
export async function disposeEnhancers(): Promise<void> {
  const pending = Object.values(cachedUpscalers).filter((p): p is Promise<UpscalerInstance> => !!p);
  cachedUpscalers = {};
  for (const p of pending) {
    try {
      const upscaler = await p;
      await upscaler.dispose();
    } catch {
      // already failed to load - nothing to dispose
    }
  }
}
