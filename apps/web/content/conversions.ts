import type { ImageFormat } from "@/lib/api";

export interface ConversionPair {
  slug: string;
  from: ImageFormat;
  to: ImageFormat;
  fromLabel: string;
  toLabel: string;
  title: string;
  intro: string;
  faqs: { question: string; answer: string }[];
}

const LABELS: Record<ImageFormat, string> = {
  jpeg: "JPEG",
  png: "PNG",
  webp: "WebP",
  avif: "AVIF",
};

interface RawPair {
  from: ImageFormat;
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
      "If your PNG is really a photo with no transparency, it's carrying lossless-compression overhead it doesn't need. Converting to JPEG drops the alpha channel and applies photo-appropriate compression, which is usually much smaller for photographic content.",
    faqs: [
      {
        question: "What happens to transparent areas?",
        answer:
          "JPEG has no transparency support, so any transparent or semi-transparent pixels are flattened onto a white background before encoding.",
      },
      {
        question: "Will this lose quality?",
        answer:
          "JPEG is a lossy format, so there's some quality trade-off - but you control it directly, either by picking a target file size or letting the tool default to the highest quality that still meets it.",
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
          "All modern browsers support AVIF. For older software or strict compatibility needs, convert to JPEG or WebP instead.",
      },
    ],
  },
  {
    from: "jpeg",
    to: "webp",
    intro:
      "WebP is the modern default for photos on the web: at the same visual quality, it's routinely 25-35% smaller than JPEG. If you're shipping photos to a website and care about load time, this is the conversion to make.",
    faqs: [
      {
        question: "Will WebP look worse than my original JPEG?",
        answer:
          "Not at equivalent settings - WebP typically matches JPEG's visual quality at a smaller file size, rather than trading quality for size.",
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
      "Converting JPEG to PNG gives you a lossless copy - useful when you need to hand an image into an editing pipeline or tool that expects PNG and you want to stop further generational JPEG quality loss from repeated re-saves.",
    faqs: [
      {
        question: "Will converting to PNG recover detail lost by JPEG compression?",
        answer:
          "No - PNG is lossless from this point forward, but it can't restore detail JPEG compression already discarded. It just stops further loss.",
      },
      {
        question: "Why would a PNG of a photo be so much bigger than the JPEG?",
        answer:
          "PNG compresses losslessly, which is much less efficient for photographic detail and noise than JPEG's lossy compression - expect a noticeably larger file.",
      },
    ],
  },
  {
    from: "jpeg",
    to: "avif",
    intro:
      "For the smallest possible photo delivery on the web, AVIF is currently the best option, often beating JPEG by 50% or more at comparable quality. This is the conversion to reach for when every kilobyte of page weight matters.",
    faqs: [
      {
        question: "How much smaller is AVIF than JPEG, really?",
        answer:
          "It varies by image, but 40-60% smaller at similar visual quality is a common result for photographic content.",
      },
      {
        question: "Is AVIF encoding slow?",
        answer:
          "It can be slower than JPEG or WebP to encode, which is why this tool uses a fast search pass and only does one slow, exhaustive final encode for the winning result.",
      },
    ],
  },
  {
    from: "webp",
    to: "jpeg",
    intro:
      "Not every tool, printer, or older piece of software accepts WebP. Converting to JPEG trades a little efficiency for near-universal compatibility - the right move when you need the file to just work everywhere.",
    faqs: [
      {
        question: "Why would I convert away from the smaller WebP format?",
        answer:
          "Compatibility. Some legacy software, print workflows, and email clients still don't handle WebP reliably - JPEG is the safe fallback.",
      },
      {
        question: "Does WebP's transparency survive as JPEG?",
        answer: "No - JPEG has no alpha channel, so any transparency is flattened onto white first.",
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
          "No - most sites serve AVIF to browsers that support it and fall back to WebP or JPEG for the rest.",
      },
    ],
  },
  {
    from: "avif",
    to: "jpeg",
    intro:
      "AVIF isn't accepted by every image editor, CMS, or older browser yet. Converting to JPEG gives you a version that opens anywhere, at the cost of some of AVIF's size advantage.",
    faqs: [
      {
        question: "Why would I have an AVIF file that needs converting?",
        answer:
          "It's increasingly common for photos and downloads to arrive as AVIF by default - converting to JPEG is the fix when a tool or workflow doesn't accept it.",
      },
      {
        question: "Will the JPEG be bigger than the AVIF?",
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
          "Some size efficiency, typically, but the difference is usually modest compared to going all the way back to JPEG or PNG.",
      },
    ],
  },
];

export const CONVERSIONS: ConversionPair[] = RAW_PAIRS.map((pair) => {
  const fromLabel = LABELS[pair.from];
  const toLabel = LABELS[pair.to];
  return {
    slug: `${pair.from}-to-${pair.to}`,
    from: pair.from,
    to: pair.to,
    fromLabel,
    toLabel,
    title: `Convert ${fromLabel} to ${toLabel}`,
    intro: pair.intro,
    faqs: pair.faqs,
  };
});

export function getConversionBySlug(slug: string): ConversionPair | undefined {
  return CONVERSIONS.find((c) => c.slug === slug);
}
