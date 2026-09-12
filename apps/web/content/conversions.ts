import type { ImageFormat } from "@/lib/api";

/** HEIC is accepted as a conversion *source* only - nobody wants to save an
 * optimized web image back into HEIC, so it's not one of the tool's output
 * formats (see lib/api.ts's ImageFormat), only a landing-page source. */
export type SourceFormat = ImageFormat | "heic";

interface ComparisonParagraph {
  label: string;
  text: string;
}

export interface ConversionPair {
  slug: string;
  from: SourceFormat;
  to: ImageFormat;
  fromLabel: string;
  toLabel: string;
  title: string;
  /** Full page heading, e.g. "Convert JPG to WebP Online for Free" - falls
   * back to `title` for pairs that haven't been given the richer treatment. */
  h1: string;
  /** <title> tag content - falls back to `title` when unset. */
  seoTitle: string;
  /** Meta description - falls back to `intro` when unset, since intro
   * doubles as the on-page summary paragraph for pairs without a distinct one. */
  metaDescription: string;
  intro: string;
  faqs: { question: string; answer: string }[];
  comparisonTitle?: string;
  comparisonParagraphs?: ComparisonParagraph[];
  useCases?: string[];
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
  h1?: string;
  seoTitle?: string;
  metaDescription?: string;
  comparisonTitle?: string;
  comparisonParagraphs?: ComparisonParagraph[];
  useCases?: string[];
}

const RAW_PAIRS: RawPair[] = [
  // png-to-webp, png-to-jpg and png-to-avif have dedicated page files
  // (app/convert/png-to-{webp,jpg,avif}) with their own full content, and
  // are excluded from this route's generateStaticParams - these entries
  // stay minimal since they're only used here for cross-referencing
  // (sitemap, "Related conversions" lists elsewhere), never rendered
  // through this template.
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
    h1: "Convert JPG to WebP Online for Free",
    seoTitle: "JPG to WebP Converter – Convert JPG to WebP Online Free",
    metaDescription:
      "Convert JPG to WebP online for free. Get smaller photo files at the same visual quality - runs in your browser in seconds, no account needed.",
    intro:
      "WebP is the modern default for photos on the web: at the same visual quality, it's routinely 25-35% smaller than JPG. If you're shipping photos to a website and care about load time, this is the conversion to make.",
    comparisonTitle: "JPG vs WebP",
    comparisonParagraphs: [
      {
        label: "Compression.",
        text: "Both are lossy formats, but WebP's compression algorithm is newer and generally more efficient at the same visual quality - it typically needs fewer bytes to represent the same photographic detail than JPG does.",
      },
      {
        label: "File size.",
        text: "For photos, WebP files are commonly 25-35% smaller than an equivalent-quality JPG, though the exact figure varies by image content.",
      },
      {
        label: "Quality at matching size.",
        text: "At the same file size, WebP tends to show fewer visible compression artifacts (blockiness, blurring around edges) than JPG, since its compression is better suited to modern content.",
      },
      {
        label: "Browser support.",
        text: "Every current major browser supports WebP natively, and it's been a recommended web image format for several years - compatibility is rarely a concern today.",
      },
    ],
    useCases: [
      "Shrinking an existing photo gallery or blog's images to speed up page load",
      "Preparing product photography for an ecommerce site without sacrificing visible quality",
      "Reducing page weight to improve Core Web Vitals and search performance scores",
      "Converting camera or phone photos before publishing them online",
    ],
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
      {
        question: "How much smaller is WebP than JPG, really?",
        answer:
          "It depends on the image, but a 25-35% reduction at matching visual quality is a common result for photographic content - busier, more detailed photos tend to compress less dramatically than simpler ones.",
      },
      {
        question: "Do I need to change my website's code to use WebP?",
        answer:
          "You just need to reference the .webp file instead of the .jpg wherever the image is used - a plain <img> tag with a WebP source works in every modern browser without any special markup.",
      },
      {
        question: "Is WebP supported by all browsers?",
        answer:
          "All current major browsers (Chrome, Firefox, Safari, Edge) support WebP. Only very old browser versions, now a small share of traffic for most sites, lack support.",
      },
      {
        question: "Will converting back to JPG restore my original quality?",
        answer:
          "No - once JPG or WebP compression has discarded detail, converting to a different format afterward can't bring it back. If you need to preserve the option of a fully lossless copy, keep the original file too.",
      },
      {
        question: "Should I keep the original JPG after converting?",
        answer:
          "It's good practice to keep your original as a backup, especially if you might need to re-convert at different settings later or use the image somewhere WebP isn't accepted.",
      },
      {
        question: "Is this WebP converter free to use?",
        answer: "Yes, with no account, watermark, or usage limit.",
      },
    ],
  },
  {
    from: "jpeg",
    to: "png",
    h1: "Convert JPG to PNG Online for Free",
    seoTitle: "JPG to PNG Converter – Convert JPG to PNG Online Free",
    metaDescription:
      "Convert JPG to PNG online for free - get a lossless copy that stops further compression loss, ideal for editing pipelines and tools that expect PNG.",
    intro:
      "Converting JPG to PNG gives you a lossless copy - useful when you need to hand an image into an editing pipeline or tool that expects PNG and you want to stop further generational JPG quality loss from repeated re-saves.",
    comparisonTitle: "JPG vs PNG",
    comparisonParagraphs: [
      {
        label: "Lossy vs. lossless.",
        text: "JPG discards some image data to reach a smaller file size. PNG is lossless - converting a JPG to PNG doesn't lose any more information from that point forward, but it also can't recover whatever the JPG had already discarded.",
      },
      {
        label: "File size.",
        text: "Expect the PNG to be noticeably larger than the source JPG - lossless compression is far less efficient for photographic detail and noise than JPG's lossy compression.",
      },
      {
        label: "Editing.",
        text: "PNG is a safer intermediate format if you plan to keep editing and re-saving the image, since it won't compound quality loss with every save the way repeatedly re-saving as JPG can.",
      },
      {
        label: "Transparency.",
        text: "A JPG source has no transparency to begin with, but the resulting PNG will support a full alpha channel if you add transparency (e.g. by cutting out a background) in an editor afterward.",
      },
    ],
    useCases: [
      "Preparing an image for a design tool or workflow that expects PNG input",
      "Stopping further generational quality loss before more editing and re-saving",
      "Creating a base file you'll add transparency to (e.g. removing a background)",
      "Archiving a photo in a lossless format going forward",
    ],
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
      {
        question: "Does converting JPG to PNG improve image quality?",
        answer:
          "No - it can't add back anything the original JPG compression removed. It only prevents any additional loss from further saves, which is different from improving quality.",
      },
      {
        question: "Can I add transparency to the PNG after converting?",
        answer:
          "Yes - once it's a PNG, you can use an image editor to remove a background or add transparent areas, and they'll be preserved properly, unlike if you'd tried to do that with a JPG.",
      },
      {
        question: "Will repeated JPG saves keep degrading my photo?",
        answer:
          "Yes - every time a JPG is re-encoded (opened, edited, and saved again as JPG), it typically loses a little more detail. Converting to PNG before further edits avoids adding to that loss.",
      },
      {
        question: "Is PNG better than JPG for editing?",
        answer:
          "For a working file you'll open and save multiple times, yes - PNG's lossless nature means each save doesn't degrade the image further, which matters more the more editing passes you expect.",
      },
      {
        question: "When should I NOT convert JPG to PNG?",
        answer:
          "If you're just distributing or displaying the final image (a website, an email, a social post), converting to PNG mainly adds file size without a real benefit - PNG's advantage is specifically for further lossless editing or a workflow that requires it.",
      },
      {
        question: "Is this JPG to PNG converter free?",
        answer: "Yes, with no account or usage limit.",
      },
    ],
  },
  {
    from: "jpeg",
    to: "avif",
    h1: "Convert JPG to AVIF Online for Free",
    seoTitle: "JPG to AVIF Converter – Convert JPG to AVIF Online Free",
    metaDescription:
      "Convert JPG to AVIF online for free - the most space-efficient photo format available today, often 40-60% smaller than JPG at similar quality.",
    intro:
      "For the smallest possible photo delivery on the web, AVIF is currently the best option, often beating JPG by 50% or more at comparable quality. This is the conversion to reach for when every kilobyte of page weight matters.",
    comparisonTitle: "JPG vs AVIF",
    comparisonParagraphs: [
      {
        label: "Compression efficiency.",
        text: "AVIF's compression, derived from the AV1 video codec, is substantially more advanced than JPG's decades-old approach, typically producing a much smaller file at comparable visual quality.",
      },
      {
        label: "Quality at the same size.",
        text: "Where JPG shows blockiness or ringing artifacts as compression increases, AVIF tends to hold up better at aggressive compression levels, preserving more natural detail.",
      },
      {
        label: "Browser support.",
        text: "All current major browsers support AVIF, but it's newer than JPG, so very old browsers or some legacy tools may not read it - worth keeping in mind for niche audiences.",
      },
      {
        label: "Encoding speed.",
        text: "AVIF is more computationally expensive to encode than JPG, which is why this tool uses a fast search pass and only performs one slower, high-quality final encode for the version you actually download.",
      },
    ],
    useCases: [
      "Reducing photo page weight beyond what JPG or even WebP already achieve",
      "Preparing hero images and above-the-fold photography for fast page loads",
      "Shrinking product photography for ecommerce at scale",
      "Optimizing images for sites where performance scores directly affect rankings or conversions",
    ],
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
      {
        question: "Do all browsers support AVIF?",
        answer:
          "All current major browsers do. A small share of very old browser versions don't, which matters mainly if you know your audience skews toward outdated software.",
      },
      {
        question: "Should I keep a JPG version as a fallback?",
        answer:
          "For a website, many setups serve AVIF to browsers that support it and fall back to JPG or WebP automatically for the rest, so you don't have to choose one or the other.",
      },
      {
        question: "Is AVIF good for screenshots with text?",
        answer:
          "It handles sharp edges and text reasonably well, though - like any lossy format - very fine text can show minor artifacts at aggressive compression. For pixel-perfect text, a lossless format like PNG is safer.",
      },
      {
        question: "Will I notice a quality difference compared to my JPG?",
        answer:
          "At the quality levels this tool targets by default, the difference is typically minimal to unnoticeable on screen, while the file size drops substantially.",
      },
      {
        question: "Is converting to AVIF worth it for a small site?",
        answer:
          "Even a small site benefits from faster-loading images, though the impact is naturally more noticeable on image-heavy pages or slower connections than on a handful of small icons.",
      },
      {
        question: "Is this JPG to AVIF converter free?",
        answer: "Yes, with no account, watermark, or usage limit.",
      },
    ],
  },
  {
    from: "webp",
    to: "jpeg",
    h1: "Convert WebP to JPG Online for Free",
    seoTitle: "WebP to JPG Converter – Convert WebP to JPG Online Free",
    metaDescription:
      "Convert WebP to JPG online for free - the safe choice when a tool, printer, or older platform doesn't accept WebP files.",
    intro:
      "Not every tool, printer, or older piece of software accepts WebP. Converting to JPG trades a little efficiency for near-universal compatibility - the right move when you need the file to just work everywhere.",
    comparisonTitle: "WebP vs JPG",
    comparisonParagraphs: [
      {
        label: "Compatibility.",
        text: "JPG is the most universally supported photo format in existence - decades of software, printers, and platforms handle it without question. WebP is well supported today but younger, and some legacy tools still don't read it.",
      },
      {
        label: "File size.",
        text: "Expect the JPG to be somewhat larger than the WebP it came from, since WebP's compression is generally more efficient at the same quality.",
      },
      {
        label: "Transparency.",
        text: "If your WebP has transparency, it won't survive the conversion - JPG has no alpha channel, so transparent areas are flattened onto a solid background.",
      },
      {
        label: "When to use each.",
        text: "Keep WebP for web delivery where compatibility isn't in question. Convert to JPG when you specifically need broad compatibility - print services, older software, or a platform that rejects WebP uploads.",
      },
    ],
    useCases: [
      "Uploading to a print service or lab that doesn't accept WebP files",
      "Opening an image in older photo editing software",
      "Meeting a platform's or form's requirement for JPG specifically",
      "Emailing an image to someone whose device or app can't open WebP",
    ],
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
      {
        question: "Will the JPG be bigger than my WebP?",
        answer:
          "Typically yes, since WebP is generally the more space-efficient of the two formats at equivalent quality.",
      },
      {
        question: "Can I convert the JPG back to WebP later?",
        answer:
          "Yes, using our JPG to WebP converter - though bear in mind you'd be re-encoding an already-compressed JPG, so it won't be identical to the original WebP.",
      },
      {
        question: "Do social media platforms accept WebP directly?",
        answer:
          "Most major platforms handle WebP uploads fine today, but requirements vary and change over time - if you hit an upload error, converting to JPG is a reliable fix.",
      },
      {
        question: "Is there a quality loss converting WebP to JPG?",
        answer:
          "If your WebP was already lossy, re-encoding as JPG adds another lossy step, which can introduce a small additional quality reduction. If the WebP was lossless, the JPG conversion is the first lossy step.",
      },
      {
        question: "Is this WebP to JPG converter free?",
        answer: "Yes, with no account or usage limit.",
      },
    ],
  },
  {
    from: "webp",
    to: "png",
    h1: "Convert WebP to PNG Online for Free",
    seoTitle: "WebP to PNG Converter – Convert WebP to PNG Online Free",
    metaDescription:
      "Convert WebP to PNG online for free - a lossless, universally compatible copy with transparency preserved exactly.",
    intro:
      "If you need a lossless, universally-editable copy of a WebP image - for a design tool, an archival copy, or software that doesn't read WebP at all - converting to PNG preserves transparency exactly while maximizing compatibility.",
    comparisonTitle: "WebP vs PNG",
    comparisonParagraphs: [
      {
        label: "Compatibility.",
        text: "PNG is supported by essentially every image tool and platform in existence, including much older software that may not read WebP.",
      },
      {
        label: "File size.",
        text: "The PNG will typically be larger than the source WebP, especially for photographic content, since PNG's lossless compression is less space-efficient than WebP's.",
      },
      {
        label: "Transparency.",
        text: "Both formats support a full alpha channel, so transparent regions in your WebP carry over to the PNG exactly.",
      },
      {
        label: "Quality.",
        text: "The conversion itself is lossless, but if the source WebP was encoded with lossy compression, whatever detail it already discarded stays discarded - PNG just avoids losing any more from here.",
      },
    ],
    useCases: [
      "Opening a WebP image in software that doesn't support the format at all",
      "Creating a lossless archival copy of a WebP graphic",
      "Preparing a base file for further lossless editing",
      "Meeting a CMS or platform requirement for PNG uploads specifically",
    ],
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
      {
        question: "Will I get my transparency back if it was already lost?",
        answer:
          "No - if the WebP itself never had transparency (or it was flattened at some earlier step), converting to PNG can't reintroduce it. PNG preserves whatever alpha channel already exists in the source.",
      },
      {
        question: "Can I convert the PNG back to WebP afterward?",
        answer: "Yes, using our PNG to WebP converter - useful if you needed a PNG temporarily for one tool but want the smaller WebP for actual use.",
      },
      {
        question: "Do all image editors support WebP directly?",
        answer:
          "Most modern editors do, but some older or more specialized tools still expect PNG or JPG - converting to PNG is a reliable way to guarantee compatibility.",
      },
      {
        question: "Is PNG a good format for archiving images?",
        answer:
          "Yes - being lossless and universally supported makes PNG a safe long-term format for a master copy, at the cost of larger file sizes than a compressed format like WebP or AVIF.",
      },
      {
        question: "Is this WebP to PNG converter free?",
        answer: "Yes, with no account or usage limit.",
      },
    ],
  },
  {
    from: "webp",
    to: "avif",
    h1: "Convert WebP to AVIF Online for Free",
    seoTitle: "WebP to AVIF Converter – Convert WebP to AVIF Online Free",
    metaDescription:
      "Convert WebP to AVIF online for free - squeeze further file size savings out of images you've already optimized to WebP.",
    intro:
      "Already using WebP but want to squeeze further? AVIF frequently beats WebP on file size at the same visual quality, particularly for photographic images, making this a worthwhile upgrade for performance-sensitive sites.",
    comparisonTitle: "WebP vs AVIF",
    comparisonParagraphs: [
      {
        label: "Compression.",
        text: "Both are modern, efficient formats, but AVIF's newer compression technology generally edges out WebP's, particularly on photographic and detailed images.",
      },
      {
        label: "Transparency.",
        text: "Both fully support an alpha channel, so transparent WebP images convert to AVIF with transparency intact.",
      },
      {
        label: "Browser support.",
        text: "WebP has a slightly longer track record and marginally broader support in older browsers and tools; AVIF is supported by all current major browsers but is the newer of the two.",
      },
      {
        label: "When the upgrade is worth it.",
        text: "For photographic content on a performance-sensitive site, the extra savings from AVIF are usually worthwhile. For simple flat graphics and icons, the gap between the two formats is much smaller.",
      },
    ],
    useCases: [
      "Squeezing additional file-size savings out of an already-WebP image library",
      "Preparing photographic assets for maximum compression on a modern site",
      "Testing AVIF adoption on a site while keeping WebP as a fallback for older browsers",
      "Reducing bandwidth costs on image-heavy, high-traffic pages",
    ],
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
      {
        question: "Does AVIF support transparency like WebP does?",
        answer: "Yes - both formats have a full alpha channel, so transparent WebP images convert cleanly.",
      },
      {
        question: "Will AVIF encoding take longer than WebP?",
        answer:
          "Yes, generally - AVIF's compression is more computationally intensive. This tool handles that with a fast search pass followed by one slower, high-quality final encode.",
      },
      {
        question: "Should every image on my site be converted to AVIF?",
        answer:
          "Not necessarily - the benefit is largest for photographic content. Simple graphics and icons may see little improvement over WebP, so it's reasonable to prioritize your largest, most detailed images first.",
      },
      {
        question: "What happens if a visitor's browser doesn't support AVIF?",
        answer:
          "If you're using a fallback setup (like an HTML <picture> element with WebP or JPG alternatives), their browser simply loads the fallback format instead - nothing breaks.",
      },
      {
        question: "Is this WebP to AVIF converter free?",
        answer: "Yes, with no account or usage limit.",
      },
    ],
  },
  {
    from: "avif",
    to: "jpeg",
    h1: "Convert AVIF to JPG Online for Free",
    seoTitle: "AVIF to JPG Converter – Convert AVIF to JPG Online Free",
    metaDescription:
      "Convert AVIF to JPG online for free - opens the file in software, platforms, or devices that don't yet support AVIF.",
    intro:
      "AVIF isn't accepted by every image editor, CMS, or older browser yet. Converting to JPG gives you a version that opens anywhere, at the cost of some of AVIF's size advantage.",
    comparisonTitle: "AVIF vs JPG",
    comparisonParagraphs: [
      {
        label: "Compatibility.",
        text: "JPG is readable by essentially any software or device ever made; AVIF, while widely supported by modern browsers, is newer and occasionally rejected by older tools, platforms, or upload forms.",
      },
      {
        label: "File size.",
        text: "Expect the JPG to be larger than the AVIF it came from - AVIF is generally the more space-efficient format at equivalent visual quality.",
      },
      {
        label: "Quality.",
        text: "Converting between two lossy formats means the JPG inherits whatever detail the AVIF encode already settled on, plus whatever the JPG encode itself discards - some additional quality loss is expected.",
      },
      {
        label: "When to convert down.",
        text: "Do this specifically when a tool, platform, or workflow doesn't accept AVIF and you need a version that works there, not as a general-purpose choice.",
      },
    ],
    useCases: [
      "Opening a photo that downloaded or exported as AVIF in software that doesn't support it",
      "Uploading to a platform or form that rejects AVIF files",
      "Sharing an image with someone whose device or app can't display AVIF",
      "Preparing a file for a print service that only accepts JPG",
    ],
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
      {
        question: "Why did my photo download as an AVIF file?",
        answer:
          "Some cameras, apps, and websites now save or serve images as AVIF by default because of its strong compression - if your software doesn't recognize the extension, converting to JPG is the quickest fix.",
      },
      {
        question: "Does converting AVIF to JPG lose additional quality?",
        answer:
          "Since both are lossy formats, yes, some additional quality loss is possible - the JPG encode discards its own data on top of whatever the AVIF encode already settled on.",
      },
      {
        question: "How can I tell if a file is actually AVIF?",
        answer:
          "Check the file extension (.avif) or, if it's unclear, try opening it in a modern browser like Chrome or Firefox, both of which display AVIF files directly.",
      },
      {
        question: "Is JPG still a relevant format?",
        answer:
          "Yes - despite being the oldest of the common web image formats, JPG's universal compatibility means it's still the safest choice whenever you're not sure what a destination tool or platform supports.",
      },
      {
        question: "Is this AVIF to JPG converter free?",
        answer: "Yes, with no account or usage limit.",
      },
    ],
  },
  {
    from: "avif",
    to: "png",
    h1: "Convert AVIF to PNG Online for Free",
    seoTitle: "AVIF to PNG Converter – Convert AVIF to PNG Online Free",
    metaDescription:
      "Convert AVIF to PNG online for free - a lossless, fully compatible copy with transparency preserved for editing or archiving.",
    intro:
      "Need to edit or archive an AVIF image in a tool that only understands PNG? This conversion gives you a lossless, fully compatible copy with transparency preserved.",
    comparisonTitle: "AVIF vs PNG",
    comparisonParagraphs: [
      {
        label: "Compatibility.",
        text: "PNG is supported everywhere, including tools and platforms that don't yet handle AVIF, which is still a relatively new format by comparison.",
      },
      {
        label: "File size.",
        text: "Expect a substantial increase in file size - PNG's lossless compression is considerably less space-efficient than AVIF's for photographic detail.",
      },
      {
        label: "Transparency.",
        text: "Both formats support a full alpha channel, so transparent regions in the AVIF carry over exactly.",
      },
      {
        label: "Quality.",
        text: "The conversion to PNG is itself lossless, but it can't recover any detail the original AVIF encode already discarded if it was created with lossy settings.",
      },
    ],
    useCases: [
      "Editing an AVIF image in software that only accepts PNG",
      "Creating a lossless archival copy of an AVIF graphic",
      "Meeting a platform's requirement for PNG specifically",
      "Preserving transparency losslessly for further design work",
    ],
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
      {
        question: "Will converting to PNG improve the image's quality?",
        answer:
          "No - it preserves whatever the AVIF already contained without losing any more, but it can't add back detail that was discarded if the original AVIF was encoded with lossy settings.",
      },
      {
        question: "Why would I need to convert AVIF to PNG instead of JPG?",
        answer:
          "Choose PNG when you need a lossless result or need to preserve transparency; choose JPG when file size and universal compatibility matter more than lossless precision or an alpha channel.",
      },
      {
        question: "Can I edit the PNG afterward without further quality loss?",
        answer:
          "Yes - as long as you keep saving in PNG (or another lossless format), further edits won't degrade the image the way repeated JPG re-saves would.",
      },
      {
        question: "Is this AVIF to PNG converter free?",
        answer: "Yes, with no account or usage limit.",
      },
    ],
  },
  {
    from: "avif",
    to: "webp",
    h1: "Convert AVIF to WebP Online for Free",
    seoTitle: "AVIF to WebP Converter – Convert AVIF to WebP Online Free",
    metaDescription:
      "Convert AVIF to WebP online for free - broader compatibility than AVIF while keeping strong compression and transparency.",
    intro:
      "WebP has broader support than AVIF across older browsers, image libraries, and CMS platforms while still offering strong compression - a practical middle ground if AVIF is causing compatibility headaches.",
    comparisonTitle: "AVIF vs WebP",
    comparisonParagraphs: [
      {
        label: "Compatibility.",
        text: "WebP has been around longer and is recognized by a slightly wider range of tools, CMS platforms, and older browser versions than AVIF.",
      },
      {
        label: "File size.",
        text: "Expect some increase in file size compared to the AVIF original, though typically more modest than converting all the way to PNG or JPG.",
      },
      {
        label: "Transparency.",
        text: "Both formats fully support an alpha channel, so transparent AVIF images convert to WebP cleanly.",
      },
      {
        label: "When to choose WebP over AVIF.",
        text: "When a specific tool, plugin, or platform in your workflow doesn't yet handle AVIF, but you still want better compression than JPG or PNG.",
      },
    ],
    useCases: [
      "Working around a CMS plugin or image library that doesn't support AVIF yet",
      "Providing a WebP fallback for browsers or tools that don't read AVIF",
      "Standardizing a media library on WebP for consistent tool support",
      "Reducing compatibility risk while keeping most of AVIF's size benefit",
    ],
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
      {
        question: "Why would a tool not support AVIF yet?",
        answer:
          "AVIF is newer than WebP, so some CMS platforms, plugins, and older image-processing libraries haven't added support yet, or only added it recently - WebP's longer track record means broader compatibility today.",
      },
      {
        question: "Does WebP support transparency as well as AVIF?",
        answer: "Yes - both have a full alpha channel, so transparent images convert without any loss of transparency.",
      },
      {
        question: "Should I convert my whole image library from AVIF to WebP?",
        answer:
          "Only if you're hitting real compatibility problems with AVIF - if everything is working, there's no need to give up AVIF's extra compression across the board.",
      },
      {
        question: "Is this AVIF to WebP converter free?",
        answer: "Yes, with no account or usage limit.",
      },
    ],
  },
  {
    from: "heic",
    to: "jpeg",
    h1: "Convert HEIC to JPG Online for Free",
    seoTitle: "HEIC to JPG Converter – Convert HEIC to JPG Online Free",
    metaDescription:
      "Convert HEIC to JPG online for free. Turn iPhone photos into a format that opens on any device, in any app, without iTunes or extra software.",
    intro:
      "HEIC is the default photo format on iPhone, but most websites, Windows apps, and older software can't open it. Converting to JPG gives you a copy that opens everywhere - on any device, in any photo app, in any upload form.",
    comparisonTitle: "HEIC vs JPG",
    comparisonParagraphs: [
      {
        label: "Compatibility.",
        text: "JPG opens in essentially any software, on any platform. HEIC is Apple's default, well supported on Apple devices, but inconsistently supported on Windows, Android, and many websites and upload forms.",
      },
      {
        label: "File size.",
        text: "HEIC generally compresses photos more efficiently than JPG at similar quality, which is part of why Apple uses it by default - expect the JPG to be somewhat larger.",
      },
      {
        label: "Quality.",
        text: "Converting to JPG involves re-encoding, so there's a quality tradeoff, controlled by the quality or target size you choose - the same as any JPG conversion.",
      },
      {
        label: "When to convert.",
        text: "Whenever you need to share, upload, or open an iPhone photo somewhere that doesn't reliably handle HEIC - which is most non-Apple software and many web forms.",
      },
    ],
    useCases: [
      "Uploading iPhone photos to a website, form, or app that rejects HEIC",
      "Opening iPhone photos on a Windows PC or Android device without extra software",
      "Sharing photos with someone whose device or app can't display HEIC",
      "Preparing iPhone photos for a print service that requires JPG",
    ],
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
      {
        question: "Why can't I open HEIC files on my Windows PC?",
        answer:
          "Windows doesn't support HEIC out of the box in most versions - you'd normally need to install a codec extension, or simply convert the file to JPG, which is usually the quicker fix.",
      },
      {
        question: "Do I need iTunes or special Apple software to convert HEIC to JPG?",
        answer: "No - this tool converts HEIC to JPG directly in your browser, on any device, without needing any Apple software.",
      },
      {
        question: "Can I convert multiple HEIC photos at once?",
        answer:
          "This tool converts one image at a time through the browser interface. For very large batches, converting them one by one here still avoids installing any desktop software.",
      },
      {
        question: "Does this work with Live Photos?",
        answer: "It converts the still HEIC image itself, not any motion data bundled alongside a Live Photo.",
      },
      {
        question: "Is HEIC better quality than JPG?",
        answer:
          "At the same file size, HEIC generally holds up better than JPG - it's a more modern, efficient compression format. That said, whether the difference is meaningful to you depends on how you're viewing or using the image.",
      },
      {
        question: "Is this HEIC to JPG converter free?",
        answer: "Yes, with no account, software install, or usage limit.",
      },
    ],
  },
  {
    from: "heic",
    to: "png",
    h1: "Convert HEIC to PNG Online for Free",
    seoTitle: "HEIC to PNG Converter – Convert HEIC to PNG Online Free",
    metaDescription:
      "Convert HEIC to PNG online for free - a lossless, universally-compatible copy of your iPhone photo for editing or archiving.",
    intro:
      "Need a lossless, universally-compatible copy of an iPhone photo - for editing, archiving, or a tool that doesn't read HEIC at all? Converting to PNG preserves every pixel and any transparency exactly.",
    comparisonTitle: "HEIC vs PNG",
    comparisonParagraphs: [
      {
        label: "Compatibility.",
        text: "PNG is supported by virtually every image tool ever made, while HEIC support outside Apple's own ecosystem is inconsistent.",
      },
      {
        label: "Compression.",
        text: "HEIC uses efficient lossy compression, similar in spirit to modern video codecs; PNG is lossless, which is far less space-efficient for photographic content, so expect a significantly larger file.",
      },
      {
        label: "Quality.",
        text: "The conversion to PNG is lossless from this point on, but can't recover detail the original HEIC encode already discarded if it used lossy compression, which iPhone photos typically do.",
      },
      {
        label: "Why choose PNG over JPG here.",
        text: "Pick PNG when you specifically need a lossless working copy or must preserve transparency; pick JPG (see our HEIC to JPG converter) when smaller file size and universal compatibility matter more.",
      },
    ],
    useCases: [
      "Archiving an iPhone photo losslessly for long-term storage",
      "Preparing an iPhone photo for an editing tool that expects PNG",
      "Opening an iPhone photo on a device or in software with no HEIC support",
      "Preserving transparency from a HEIC image that includes an alpha channel",
    ],
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
      {
        question: "Does HEIC support transparency?",
        answer:
          "HEIC can technically store an alpha channel, though it's rarely used in typical iPhone photos, which are usually plain photographic captures with no transparency to preserve.",
      },
      {
        question: "Why convert to PNG instead of JPG?",
        answer:
          "Choose PNG specifically when you need a lossless copy for further editing, or need to guarantee no additional quality loss beyond what the original HEIC already contains - JPG is the better choice when smaller file size matters more.",
      },
      {
        question: "Will converting to PNG improve my photo's quality?",
        answer:
          "No - it preserves exactly what the HEIC contains without losing anything further, but it can't add back detail already discarded by the original HEIC compression.",
      },
      {
        question: "Can Windows open HEIC files natively?",
        answer:
          "Not in most default configurations - you typically need an extra codec, or you can simply convert to PNG or JPG here, which is often the more reliable option.",
      },
      {
        question: "Is this HEIC to PNG converter free?",
        answer: "Yes, with no account, software install, or usage limit.",
      },
    ],
  },
];

export const CONVERSIONS: ConversionPair[] = RAW_PAIRS.map((pair) => {
  const fromMeta = FORMAT_META[pair.from];
  const toMeta = FORMAT_META[pair.to];
  const title = `Convert ${fromMeta.label} to ${toMeta.label}`;
  return {
    slug: `${fromMeta.slug}-to-${toMeta.slug}`,
    from: pair.from,
    to: pair.to,
    fromLabel: fromMeta.label,
    toLabel: toMeta.label,
    title,
    h1: pair.h1 ?? title,
    seoTitle: pair.seoTitle ?? title,
    metaDescription: pair.metaDescription ?? pair.intro,
    intro: pair.intro,
    faqs: pair.faqs,
    comparisonTitle: pair.comparisonTitle,
    comparisonParagraphs: pair.comparisonParagraphs,
    useCases: pair.useCases,
  };
});

export function getConversionBySlug(slug: string): ConversionPair | undefined {
  return CONVERSIONS.find((c) => c.slug === slug);
}
