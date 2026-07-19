import type { ImageFormat } from "@/lib/api";

/** HEIC is accepted as a conversion *source* only - nobody wants to save an
 * optimized web image back into HEIC, so it's not one of the tool's output
 * formats (see lib/api.ts's ImageFormat), only a landing-page source. */
export type SourceFormat = ImageFormat | "heic";

export interface ConversionPair {
  slug: string;
  from: SourceFormat;
  to: ImageFormat;
  fromLabel: string;
  toLabel: string;
  title: string;
  intro: string;
  faqs: { question: string; answer: string }[];
}

interface FormatMeta {
  label: string;
  /** URL-slug segment - "jpg" rather than "jpeg" to match how people
   * actually search ("jpg to webp"), not the backend's format param. */
  slug: string;
}

const FORMAT_META: Record<SourceFormat, FormatMeta> = {
  jpeg: { label: "JPG", slug: "jpg" },
  png: { label: "PNG", slug: "png" },
  webp: { label: "WebP", slug: "webp" },
  avif: { label: "AVIF", slug: "avif" },
  heic: { label: "HEIC", slug: "heic" },
  gif: { label: "GIF", slug: "gif" },
  bmp: { label: "BMP", slug: "bmp" },
  tiff: { label: "TIFF", slug: "tiff" },
  pdf: { label: "PDF", slug: "pdf" },
};

interface RawPair {
  from: SourceFormat;
  to: ImageFormat;
  intro: string;
  faqs: { question: string; answer: string }[];
}

const RAW_PAIRS: RawPair[] = [
  {
    from: "png",
    to: "webp",
    intro:
      "Screenshots and UI graphics saved as PNG are usually far larger than they need to be. Converting to WebP keeps sharp edges and transparency intact while typically cutting file size by half or more - ideal for shipping images on a real website instead of a design file.",
    faqs: [
      {
        question: "Will my PNG's transparency survive the conversion?",
        answer:
          "Yes. WebP supports a full alpha channel, so transparent areas in your PNG stay transparent in the output.",
      },
      {
        question: "Is WebP actually smaller than PNG for the same image?",
        answer:
          "For most screenshots, illustrations, and UI graphics, yes - WebP's compression handles flat colors and sharp edges more efficiently than PNG's, often at a fraction of the size.",
      },
    ],
  },
  {
    from: "png",
    to: "jpeg",
    intro:
      "If your PNG is really a photo with no transparency, it's carrying lossless-compression overhead it doesn't need. Converting to JPG drops the alpha channel and applies photo-appropriate compression, which is usually much smaller for photographic content.",
    faqs: [
      {
        question: "What happens to transparent areas?",
        answer:
          "JPG has no transparency support, so any transparent or semi-transparent pixels are flattened onto a white background before encoding.",
      },
      {
        question: "Will this lose quality?",
        answer:
          "JPG is a lossy format, so there's some quality trade-off - but you control it directly, either by picking a target file size or letting the tool default to the highest quality that still meets it.",
      },
    ],
  },
  {
    from: "png",
    to: "avif",
    intro:
      "AVIF is the most space-efficient format available today, and it still supports full transparency - so PNG graphics that need to stay crisp and small (icons, illustrations, product shots with cut-out backgrounds) benefit the most from this conversion.",
    faqs: [
      {
        question: "Does AVIF support transparency like PNG does?",
        answer: "Yes, AVIF supports a full alpha channel, so transparent PNGs convert cleanly.",
      },
      {
        question: "Is AVIF supported everywhere?",
        answer:
          "All modern browsers support AVIF. For older software or strict compatibility needs, convert to JPG or WebP instead.",
      },
    ],
  },
  {
    from: "jpeg",
    to: "webp",
    intro:
      "WebP is the modern default for photos on the web: at the same visual quality, it's routinely 25-35% smaller than JPG. If you're shipping photos to a website and care about load time, this is the conversion to make.",
    faqs: [
      {
        question: "Will WebP look worse than my original JPG?",
        answer:
          "Not at equivalent settings - WebP typically matches JPG's visual quality at a smaller file size, rather than trading quality for size.",
      },
      {
        question: "Can I target an exact file size?",
        answer:
          "Yes - set a target size in KB and the tool searches for the highest quality that still fits under it.",
      },
    ],
  },
  {
    from: "jpeg",
    to: "png",
    intro:
      "Converting JPG to PNG gives you a lossless copy - useful when you need to hand an image into an editing pipeline or tool that expects PNG and you want to stop further generational JPG quality loss from repeated re-saves.",
    faqs: [
      {
        question: "Will converting to PNG recover detail lost by JPG compression?",
        answer:
          "No - PNG is lossless from this point forward, but it can't restore detail JPG compression already discarded. It just stops further loss.",
      },
      {
        question: "Why would a PNG of a photo be so much bigger than the JPG?",
        answer:
          "PNG compresses losslessly, which is much less efficient for photographic detail and noise than JPG's lossy compression - expect a noticeably larger file.",
      },
    ],
  },
  {
    from: "jpeg",
    to: "avif",
    intro:
      "For the smallest possible photo delivery on the web, AVIF is currently the best option, often beating JPG by 50% or more at comparable quality. This is the conversion to reach for when every kilobyte of page weight matters.",
    faqs: [
      {
        question: "How much smaller is AVIF than JPG, really?",
        answer:
          "It varies by image, but 40-60% smaller at similar visual quality is a common result for photographic content.",
      },
      {
        question: "Is AVIF encoding slow?",
        answer:
          "It can be slower than JPG or WebP to encode, which is why this tool uses a fast search pass and only does one slow, exhaustive final encode for the winning result.",
      },
    ],
  },
  {
    from: "webp",
    to: "jpeg",
    intro:
      "Not every tool, printer, or older piece of software accepts WebP. Converting to JPG trades a little efficiency for near-universal compatibility - the right move when you need the file to just work everywhere.",
    faqs: [
      {
        question: "Why would I convert away from the smaller WebP format?",
        answer:
          "Compatibility. Some legacy software, print workflows, and email clients still don't handle WebP reliably - JPG is the safe fallback.",
      },
      {
        question: "Does WebP's transparency survive as JPG?",
        answer: "No - JPG has no alpha channel, so any transparency is flattened onto white first.",
      },
    ],
  },
  {
    from: "webp",
    to: "png",
    intro:
      "If you need a lossless, universally-editable copy of a WebP image - for a design tool, an archival copy, or software that doesn't read WebP at all - converting to PNG preserves transparency exactly while maximizing compatibility.",
    faqs: [
      {
        question: "Does this lose quality if my WebP was lossy?",
        answer:
          "The conversion itself is lossless, but it can't recover detail the original lossy WebP encode already discarded - it just won't lose any more from here.",
      },
      {
        question: "Is the PNG output much bigger?",
        answer:
          "Often yes for photographic content, since PNG's lossless compression is less space-efficient than WebP's for that kind of detail.",
      },
    ],
  },
  {
    from: "webp",
    to: "avif",
    intro:
      "Already using WebP but want to squeeze further? AVIF frequently beats WebP on file size at the same visual quality, particularly for photographic images, making this a worthwhile upgrade for performance-sensitive sites.",
    faqs: [
      {
        question: "Is it worth converting WebP to AVIF?",
        answer:
          "For photographic images where every kilobyte counts, usually yes. For flat graphics and icons, the gap over WebP is smaller.",
      },
      {
        question: "Do I need to drop WebP support if I switch to AVIF?",
        answer:
          "No - most sites serve AVIF to browsers that support it and fall back to WebP or JPG for the rest.",
      },
    ],
  },
  {
    from: "avif",
    to: "jpeg",
    intro:
      "AVIF isn't accepted by every image editor, CMS, or older browser yet. Converting to JPG gives you a version that opens anywhere, at the cost of some of AVIF's size advantage.",
    faqs: [
      {
        question: "Why would I have an AVIF file that needs converting?",
        answer:
          "It's increasingly common for photos and downloads to arrive as AVIF by default - converting to JPG is the fix when a tool or workflow doesn't accept it.",
      },
      {
        question: "Will the JPG be bigger than the AVIF?",
        answer:
          "Typically yes, since AVIF is the more space-efficient of the two formats at equivalent quality.",
      },
    ],
  },
  {
    from: "avif",
    to: "png",
    intro:
      "Need to edit or archive an AVIF image in a tool that only understands PNG? This conversion gives you a lossless, fully compatible copy with transparency preserved.",
    faqs: [
      {
        question: "Does AVIF's transparency carry over to PNG?",
        answer: "Yes - both formats support a full alpha channel, so transparent regions are preserved exactly.",
      },
      {
        question: "Why is the PNG file so much larger?",
        answer:
          "PNG's lossless compression is less efficient than AVIF's for photographic detail, so an increase in file size is expected.",
      },
    ],
  },
  {
    from: "avif",
    to: "webp",
    intro:
      "WebP has broader support than AVIF across older browsers, image libraries, and CMS platforms while still offering strong compression - a practical middle ground if AVIF is causing compatibility headaches.",
    faqs: [
      {
        question: "Is WebP a good fallback for AVIF?",
        answer:
          "Yes - it's the standard next choice: still modern and efficient, but supported far more broadly than AVIF.",
      },
      {
        question: "Will I lose much by moving from AVIF to WebP?",
        answer:
          "Some size efficiency, typically, but the difference is usually modest compared to going all the way back to JPG or PNG.",
      },
    ],
  },
  {
    from: "heic",
    to: "jpeg",
    intro:
      "HEIC is the default photo format on iPhone, but most websites, Windows apps, and older software can't open it. Converting to JPG gives you a copy that opens everywhere - on any device, in any photo app, in any upload form.",
    faqs: [
      {
        question: "Why do my iPhone photos save as HEIC instead of JPG?",
        answer:
          "Apple uses HEIC by default since it stores photos at a smaller file size than JPG at similar quality. The tradeoff is that a lot of non-Apple software doesn't support it.",
      },
      {
        question: "Will converting to JPG make my photo blurrier or lower quality?",
        answer:
          "Only as much as any JPG encode does. You control the tradeoff directly - target a specific file size, or let the tool default to the highest quality that still meets it.",
      },
    ],
  },
  {
    from: "heic",
    to: "png",
    intro:
      "Need a lossless, universally-compatible copy of an iPhone photo - for editing, archiving, or a tool that doesn't read HEIC at all? Converting to PNG preserves every pixel and any transparency exactly.",
    faqs: [
      {
        question: "Does this work with Live Photos or just the still image?",
        answer: "It converts the still HEIC image itself, not any motion data bundled alongside a Live Photo.",
      },
      {
        question: "Why is the PNG so much bigger than the original HEIC?",
        answer:
          "PNG is lossless, which is far less space-efficient than HEIC's compression for photographic detail - a significant size increase is expected.",
      },
    ],
  },
];

export const CONVERSIONS: ConversionPair[] = RAW_PAIRS.map((pair) => {
  const fromMeta = FORMAT_META[pair.from];
  const toMeta = FORMAT_META[pair.to];
  return {
    slug: `${fromMeta.slug}-to-${toMeta.slug}`,
    from: pair.from,
    to: pair.to,
    fromLabel: fromMeta.label,
    toLabel: toMeta.label,
    title: `Convert ${fromMeta.label} to ${toMeta.label}`,
    intro: pair.intro,
    faqs: pair.faqs,
  };
});

export function getConversionBySlug(slug: string): ConversionPair | undefined {
  return CONVERSIONS.find((c) => c.slug === slug);
}
