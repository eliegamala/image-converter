/** imagetracerjs ships no types - this declares only the subset of its
 * options/API this project actually calls (see its options.md for the
 * full set: https://github.com/jankovicsandras/imagetracerjs). */
declare module "imagetracerjs" {
  interface ImageTracerOptions {
    ltres?: number;
    qtres?: number;
    pathomit?: number;
    numberofcolors?: number;
    colorsampling?: number;
    colorquantcycles?: number;
    blurradius?: number;
    blurdelta?: number;
    scale?: number;
    strokewidth?: number;
    linefilter?: boolean;
    roundcoords?: number;
    viewbox?: boolean;
    desc?: boolean;
  }

  interface ImageTracerStatic {
    imagedataToSVG(imageData: ImageData, options?: ImageTracerOptions): string;
  }

  const ImageTracer: ImageTracerStatic;
  export default ImageTracer;
}
