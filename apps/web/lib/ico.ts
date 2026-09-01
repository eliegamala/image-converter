export interface IcoImage {
  width: number;
  height: number;
  pngData: Uint8Array;
}

/** Builds a Windows ICO file embedding PNG-compressed frames - supported
 * since Windows Vista, and far simpler (and higher quality) than encoding
 * the legacy uncompressed BMP/DIB frame format.
 *
 * File layout: a 6-byte ICONDIR header, one 16-byte ICONDIRENTRY per frame,
 * then each frame's raw PNG bytes back to back. See the ICO format spec:
 * https://en.wikipedia.org/wiki/ICO_(file_format)
 */
export function buildIco(images: IcoImage[]): Blob {
  const HEADER_SIZE = 6;
  const ENTRY_SIZE = 16;
  const directorySize = HEADER_SIZE + ENTRY_SIZE * images.length;

  let totalSize = directorySize;
  for (const image of images) totalSize += image.pngData.byteLength;

  const buffer = new ArrayBuffer(totalSize);
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);

  view.setUint16(0, 0, true); // reserved, must be 0
  view.setUint16(2, 1, true); // image type: 1 = icon
  view.setUint16(4, images.length, true);

  let offset = directorySize;
  images.forEach((image, index) => {
    const entry = HEADER_SIZE + index * ENTRY_SIZE;
    // A dimension of 256 is encoded as 0 in this single byte field.
    view.setUint8(entry + 0, image.width >= 256 ? 0 : image.width);
    view.setUint8(entry + 1, image.height >= 256 ? 0 : image.height);
    view.setUint8(entry + 2, 0); // color palette size (0 = no palette)
    view.setUint8(entry + 3, 0); // reserved
    view.setUint16(entry + 4, 1, true); // color planes
    view.setUint16(entry + 6, 32, true); // bits per pixel
    view.setUint32(entry + 8, image.pngData.byteLength, true);
    view.setUint32(entry + 12, offset, true);

    bytes.set(image.pngData, offset);
    offset += image.pngData.byteLength;
  });

  return new Blob([buffer], { type: "image/x-icon" });
}
