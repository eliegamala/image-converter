import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Footer } from "@/components/Footer";
import { Tool } from "@/components/Tool";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Resize Image to 100KB Online Free",
  description:
    "Resize or compress any photo to 100KB online, free. Upload a JPG, PNG or WebP image and this tool automatically finds the best quality and size to hit 100KB - ideal for passport photos, visa applications, government forms and job portals.",
  alternates: { canonical: "/resize-image-to-100kb" },
  openGraph: {
    title: "Resize Image to 100KB Online Free",
    description:
      "Free online tool to resize or compress a photo to 100KB - built for passport photos, visa forms, government portals and job applications.",
  },
};

const FORMAT_TABLE = [
  { format: "JPEG", size: "Smallest for photos", transparency: "No", bestFor: "Photos, passport & ID photos, scanned documents" },
  { format: "PNG", size: "Larger for photos, small for flat graphics", transparency: "Yes", bestFor: "Logos, screenshots, graphics with sharp edges" },
  { format: "WebP", size: "25-35% smaller than JPEG at similar quality", transparency: "Yes", bestFor: "Websites and forms that accept modern formats" },
  { format: "AVIF", size: "Smallest overall, ~50% below JPEG", transparency: "Yes", bestFor: "Maximum compression where the destination accepts it" },
];

const COMMON_USES = [
  { title: "Passport photos", body: "Most passport portals cap uploads at 100-300KB with strict dimension rules." },
  { title: "Visa applications", body: "Embassy and visa portals are often stricter than passport sites, sometimes as low as 50KB." },
  { title: "Government forms", body: "ID cards, tax portals and benefits applications commonly enforce a 100KB photo limit." },
  { title: "Examination portals", body: "Entrance exam registration systems reject oversized photos and signatures outright." },
  { title: "University admissions", body: "Application portals need a small, clear photo that uploads reliably under load." },
  { title: "Job applications", body: "Applicant tracking systems and portals often cap resume photos and attachments." },
  { title: "Website uploads", body: "Author photos, team headshots and avatars that need to stay lightweight for page speed." },
  { title: "Email attachments", body: "Keeping a photo under 100KB avoids attachment-size bounces on strict mail servers." },
  { title: "Profile pictures", body: "Social and internal-tool profile photos that just need to look sharp at a small size." },
];

const FAQS = [
  {
    question: "How do I reduce an image below 100KB?",
    answer:
      "Upload it above and leave the target size on 100 KB - the tool automatically searches for the format, quality and dimensions that get as close to 100KB as possible without going over, then downloads the result for you.",
  },
  {
    question: "How can I resize an image without losing quality?",
    answer:
      "The key is to let compression do most of the work before you touch the pixel dimensions - a well-compressed image at full size often looks better than a smaller image compressed the same amount. This tool follows that order automatically: it searches quality settings first, and only reduces dimensions if quality reduction alone can't reach your target cleanly.",
  },
  {
    question: "How do I reduce image size in KB?",
    answer:
      "Set a target size in kilobytes - 20, 50, 100, 200, or any custom number - and the tool finds the best quality and dimensions to land at or under that number, rather than you guessing at a quality percentage and checking the result yourself.",
  },
  {
    question: "Why does my image become blurry after resizing?",
    answer:
      "Usually because it was scaled down too aggressively for the compression level requested, or because it was enlarged past its original resolution (upscaling can't add detail that was never captured). This tool avoids the first problem by only reducing dimensions as a last resort, and it never upscales past your original size.",
  },
  {
    question: "How do I make an image larger without pixelation?",
    answer:
      "There's a hard limit here: no tool can add detail that isn't in the original file, so enlarging a small image significantly will always look softer than a photo actually taken at that size. If you need a specific minimum resolution, start from the highest-resolution original you have rather than trying to enlarge a small one.",
  },
  {
    question: "Can I resize photos on my phone?",
    answer:
      "Yes - this tool runs in any modern mobile browser. Open this page on your phone, upload or take a photo, and download the resized result the same way you would on a computer.",
  },
  {
    question: "Can I resize JPG and PNG files?",
    answer:
      "Yes, along with WebP, AVIF, GIF, BMP, TIFF and HEIC (the format iPhones save photos in by default). Upload any of these and choose your output format and target size.",
  },
  {
    question: "Does resizing affect image quality?",
    answer:
      "Reducing file size always involves some trade-off, but it doesn't have to be visible. This tool searches for the highest quality that still meets your target size, rather than applying a fixed compression level - most results at 100KB look effectively identical to the original at normal viewing sizes.",
  },
  {
    question: "What image format is best for keeping file sizes small?",
    answer:
      "For photos, JPEG remains the most universally accepted small format, with WebP and AVIF doing meaningfully better where the destination supports them. For graphics with flat colors or transparency, PNG or WebP. See the format comparison table above for specifics.",
  },
  {
    question: "Why do government websites require images under 100KB?",
    answer:
      "Mostly server-side practicality: storing and processing millions of applicant photos at a predictable, small size keeps storage costs and upload times manageable, and many of these systems auto-crop or print the photo into a generated document, which works more reliably with a consistent file size.",
  },
  {
    question: "Is this tool free?",
    answer: "Yes. Resizing and compressing images to 100KB is free, with no account required and no limit on how many images you process.",
  },
  {
    question: "Are my images uploaded anywhere?",
    answer:
      "Your image is sent securely to the optimization engine to process it, then discarded immediately afterward - it's processed, not stored, shared, or used for anything else, and it's removed as soon as the resized file is returned to you.",
  },
  {
    question: "What's the difference between resizing and compressing an image?",
    answer:
      "Resizing changes the actual pixel dimensions (width and height) of an image. Compressing re-encodes the same dimensions more efficiently, often by adjusting quality. Both reduce file size, but they affect the image differently - see the \"Resize vs Compress\" section above for when to use each.",
  },
  {
    question: "How do I resize an image to a specific size in KB, not just pixels?",
    answer:
      "Use the target size control rather than a dimension field - type a number in kilobytes (like 100) and the tool works backward from that target, adjusting quality and, if needed, dimensions, until the output lands at or under it.",
  },
  {
    question: "What's the maximum file size this tool accepts?",
    answer:
      "Uploads up to 25MB are supported, which comfortably covers full-resolution phone and camera photos. If you're working with something larger, resize it once with your device's photo app first, then run it through this tool for the final target size.",
  },
  {
    question: "Will my photo still look good when printed after resizing to 100KB?",
    answer:
      "For ID and passport-style photos, yes - those are typically printed small (around 35x45mm), and this tool preserves the resolution needed for that. For large prints, keep a full-resolution original on hand separately; a file optimized down to 100KB is meant for on-screen uploads, not poster-sized printing.",
  },
  {
    question: "Can I resize a scanned document the same way?",
    answer:
      "Yes, as long as it's an image file (JPG or PNG) rather than a PDF. Scanned signatures and documents that need to fit under a strict KB limit for an application portal work the same way as a photo.",
  },
  {
    question: "Do I need to install any software?",
    answer: "No. This tool works in your web browser - there's nothing to download or install, and it works the same way on Windows, macOS, Linux, Android and iPhone.",
  },
  {
    question: "What happens if my image can't be reduced to 100KB without heavy quality loss?",
    answer:
      "The tool always returns the closest result it can find, and shows you whether the target was actually met along with the quality and dimensions it settled on. If the result looks too soft, try starting from a higher-resolution original - a very small or already heavily-compressed source gives the search engine less room to work with.",
  },
  {
    question: "Can I use this for passport and visa photo requirements?",
    answer:
      "Yes - this is one of the most common uses for this tool. Just confirm the exact size and dimension limits on the specific portal you're using first, since requirements vary by country and agency, then set the matching target size here.",
  },
  {
    question: "Does the tool crop my image, or only resize and compress it?",
    answer:
      "It resizes and compresses without cropping - the full image is scaled down proportionally, so nothing is cut off. If your destination form needs a specific crop (like a square headshot), crop the photo first, then run it through this tool for the final size.",
  },
  {
    question: "Is there a limit to how many images I can resize?",
    answer: "No - process as many images as you need, one at a time, with no daily limit and no account required.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "cloudvertify", item: "/" },
    { "@type": "ListItem", position: 2, name: "Tools", item: "/convert" },
    { "@type": "ListItem", position: 3, name: "Resize Image to 100KB", item: "/resize-image-to-100kb" },
  ],
};

const webPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Resize Image to 100KB Online Free",
  description:
    "Resize or compress any photo to 100KB online, free. Automatically finds the best quality and size for passport photos, visa applications, government forms and job portals.",
  url: `${SITE_URL}/resize-image-to-100kb`,
  isPartOf: { "@type": "WebSite", name: "cloudvertify", url: SITE_URL },
};

const softwareApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Resize Image to 100KB",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any (web-based)",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "Resizes and compresses an uploaded image to a target file size, such as 100KB, by automatically searching quality and dimension settings.",
};

export default function ResizeImageTo100kbPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationJsonLd) }}
      />

      <div className="hero-dark">
        <div className="mx-auto max-w-3xl px-6 pt-16 pb-16 text-center">
          <div className="mb-6 flex justify-center">
            <Breadcrumb
              items={[
                { label: "cloudvertify", href: "/" },
                { label: "Tools", href: "/convert" },
                { label: "Resize Image to 100KB" },
              ]}
            />
          </div>
          <h1 className="font-display text-ink text-4xl font-semibold sm:text-5xl">
            Resize Image to 100KB
          </h1>
          <p className="text-ink/70 mt-4">
            Resize or compress any photo to 100KB online, free and instantly. Upload an image and
            this tool automatically finds the best format, quality and dimensions to hit 100KB
            while keeping it as sharp as possible - built for passport photos, visa applications,
            government forms and job portals.
          </p>

          <div className="on-light border-border bg-surface mt-10 rounded-2xl border p-6 text-left shadow-xl sm:p-8">
            <Tool defaultTargetKB={100} />
          </div>
        </div>
      </div>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center gap-4 px-6 py-16">
        <section className="mx-auto w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">What Does It Mean to Resize an Image to 100KB?</h2>
          <p className="text-ink-muted leading-relaxed">
            Resizing an image to 100KB means reducing its file size until it&apos;s no larger
            than roughly 100 kilobytes - about a tenth of a megabyte - while keeping the picture
            clear enough for its purpose. In practice this happens through some combination of
            two techniques: compressing, which re-encodes the pixel data more efficiently, and
            resizing, which reduces the actual pixel dimensions so there&apos;s simply less data
            to store.
          </p>
          <p className="text-ink-muted mt-4 leading-relaxed">
            100KB is a specific, common target because it&apos;s the exact ceiling set by a huge
            number of official upload forms - passport and visa applications, government ID
            portals, university admissions systems, and job application sites often cap photo
            uploads somewhere between 20KB and 300KB, with 100KB being one of the most common
            limits. This tool is built to hit that number precisely, not just make the file
            smaller in general.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Why Websites Require Images Under 100KB</h2>
          <p className="text-ink-muted leading-relaxed">
            A 100KB limit isn&apos;t arbitrary - it exists for practical reasons on the
            receiving end:
          </p>
          <ul className="text-ink-muted mt-4 flex flex-col gap-2 text-sm leading-relaxed">
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              <span>
                <span className="text-ink font-medium">Storage at scale.</span> A portal
                processing hundreds of thousands of applications a year can&apos;t afford to
                store multi-megabyte photos for every one of them.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              <span>
                <span className="text-ink font-medium">Faster uploads for everyone.</span> A hard
                size cap keeps upload times short and predictable, even on a slow connection.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              <span>
                <span className="text-ink font-medium">Consistent processing.</span> Many systems
                auto-crop or print the photo into a generated document, like an ID card - a
                predictable file size makes that pipeline reliable.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              <span>
                <span className="text-ink font-medium">Bandwidth and cost control.</span>{" "}
                Multiply a few hundred KB by millions of users, and the difference in server and
                bandwidth cost becomes real money.
              </span>
            </li>
          </ul>
          <p className="text-ink-muted mt-4 leading-relaxed">
            Whatever the specific reason, the practical result is the same: if your photo is 2MB
            and the form caps uploads at 100KB, the upload gets rejected until you bring it under
            that number.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">When You Should Resize Instead of Compress</h2>
          <p className="text-ink-muted leading-relaxed">
            Compression and resizing solve overlapping problems, and which one matters more
            depends on how big your starting file is. If your image is a few hundred KB to a
            couple of megabytes, compressing alone - re-encoding at a lower quality, or switching
            to a more efficient format - is often enough to hit 100KB without touching the pixel
            dimensions at all.
          </p>
          <p className="text-ink-muted mt-4 leading-relaxed">
            If your image is much larger - a modern phone photo can easily be 4-8MB - compression
            alone usually can&apos;t close that gap without quality dropping too far to be
            usable. At that point, reducing the actual pixel dimensions does far more for file
            size than squeezing quality lower, and does it without introducing visible
            compression artifacts.
          </p>
          <p className="text-ink-muted mt-4 leading-relaxed">
            This tool doesn&apos;t make you choose. Given a target size, it searches for the best
            combination of quality and scale automatically, biasing toward keeping quality high
            and only reducing dimensions when compression alone can&apos;t reach the target
            cleanly.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">How Our Resize Image to 100KB Tool Works</h2>
          <p className="text-ink-muted leading-relaxed">
            This is the same optimization engine used across the rest of the site, not a
            separate, simplified tool. When you upload an image and set a 100KB target:
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {[
              { step: "01", title: "Format is recommended", body: "The image is analyzed to suggest a starting format - JPEG for photos, PNG or WebP when transparency is involved." },
              { step: "02", title: "Quality is searched first", body: "The engine tests a range of quality settings for that format, checking how close each one lands to 100KB." },
              { step: "03", title: "Dimensions adjust if needed", body: "If quality reduction alone can't reach the target cleanly, dimensions are reduced in controlled steps and re-tested." },
              { step: "04", title: "The best result wins", body: "Whichever combination lands closest to 100KB - at or under it - with the highest visual quality is the one you get." },
            ].map((s) => (
              <div key={s.step}>
                <div className="font-readout text-primary text-sm">{s.step}</div>
                <h3 className="mt-2 font-medium">{s.title}</h3>
                <p className="text-ink-muted mt-2 text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
          <p className="text-ink-muted mt-6 leading-relaxed">
            Your image is sent securely to run that search, then discarded immediately
            afterward - it&apos;s processed, never stored, shared, or used for anything else.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Best Image Formats for Small File Sizes</h2>
          <p className="text-ink-muted leading-relaxed">
            Not every format compresses the same way. For a photo you need under 100KB, the
            format you choose matters almost as much as the quality setting:
          </p>
          <div className="border-border mt-6 overflow-x-auto rounded-xl border text-left">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-border border-b">
                  <th className="p-3 font-medium">Format</th>
                  <th className="p-3 font-medium">Typical size</th>
                  <th className="p-3 font-medium">Transparency</th>
                  <th className="p-3 font-medium">Best for</th>
                </tr>
              </thead>
              <tbody>
                {FORMAT_TABLE.map((row) => (
                  <tr key={row.format} className="border-border border-b last:border-0">
                    <td className="font-readout p-3">{row.format}</td>
                    <td className="text-ink-muted p-3">{row.size}</td>
                    <td className="text-ink-muted p-3">{row.transparency}</td>
                    <td className="text-ink-muted p-3">{row.bestFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-ink-muted mt-4 leading-relaxed">
            For most 100KB targets - passport photos, ID uploads, application portals - JPEG is
            still the safest choice, since it&apos;s accepted everywhere. WebP or AVIF will get
            you a smaller file at the same visual quality if the destination explicitly allows
            them; check the form&apos;s requirements before switching away from JPEG or PNG.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">How to Keep Image Quality High</h2>
          <ul className="text-ink-muted flex flex-col gap-2 text-sm leading-relaxed">
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              Start from the highest-resolution original you have - you can always scale down,
              but you can never recover detail that was never captured.
            </li>
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              Let compression do the work before dimensions do - a smaller quality percentage at
              full size usually looks better than a smaller image at high quality.
            </li>
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              Avoid re-compressing an already-compressed JPEG repeatedly - each save discards a
              little more detail permanently.
            </li>
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              Choose a format suited to the content - a flat-color logo saved as JPEG picks up
              artifacts that PNG or WebP wouldn&apos;t introduce.
            </li>
          </ul>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Common Reasons Images Become Pixelated</h2>
          <ul className="text-ink-muted flex flex-col gap-2 text-sm leading-relaxed">
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              <span>
                <span className="text-ink font-medium">Upscaling.</span> Enlarging an image past
                its original resolution stretches existing pixels rather than adding new detail.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              <span>
                <span className="text-ink font-medium">Over-compression.</span> Pushing quality
                too low for the amount of detail in the image produces visible blocky artifacts.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              <span>
                <span className="text-ink font-medium">Repeated re-saving.</span> Every JPEG
                re-save compounds a small amount of loss on top of the last one.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              <span>
                <span className="text-ink font-medium">Wrong format for the content.</span>{" "}
                Sharp text or line art saved as JPEG picks up fuzzy edges that a lossless format
                wouldn&apos;t.
              </span>
            </li>
          </ul>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">
            Best Practices for Government Forms, Passport Applications, Job Applications,
            University Portals, and Online Forms
          </h2>
          <ul className="text-ink-muted flex flex-col gap-2 text-sm leading-relaxed">
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              Check the exact size and dimension requirements first - portals vary widely, and
              some enforce both a KB limit and a specific pixel size or aspect ratio.
            </li>
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              Use a plain, well-lit, front-facing photo for ID and passport uploads - heavy
              compression is more noticeable on cluttered or poorly-lit originals.
            </li>
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              Save as JPEG unless the portal explicitly says otherwise - it&apos;s the one format
              virtually every government and application system accepts without question.
            </li>
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              Keep a full-resolution original of your document or photo somewhere safe before
              resizing, in case a different portal later asks for a different size.
            </li>
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              If a form rejects your file for being &quot;too small,&quot; check its minimum
              dimensions too - some portals reject files that are both under a KB limit and under
              a minimum pixel size.
            </li>
          </ul>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Resize vs Compress: What&apos;s the Difference?</h2>
          <p className="text-ink-muted leading-relaxed">
            <span className="text-ink font-medium">Resizing</span> changes an image&apos;s pixel
            dimensions - a 4000×3000 photo becomes, say, 1200×900. Fewer pixels means less data
            to store, but it also permanently reduces how large the image can be displayed or
            printed without looking soft.
          </p>
          <p className="text-ink-muted mt-4 leading-relaxed">
            <span className="text-ink font-medium">Compressing</span> keeps the same dimensions
            but re-encodes the pixel data more efficiently, usually by adjusting a quality
            setting. The image displays at the same size; fine detail and color precision are
            what get traded for a smaller file.
          </p>
          <p className="text-ink-muted mt-4 leading-relaxed">
            In practice, hitting an exact target like 100KB usually benefits from both: compress
            first, and only resize if compression alone can&apos;t get there without looking
            noticeably worse. That&apos;s exactly the order this tool follows automatically.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Step-by-Step: Resize an Image to Exactly 100KB</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {[
              { step: "01", title: "Upload your photo", body: "Drag and drop it into the tool above, or click to choose a file from your device." },
              { step: "02", title: "Set 100 KB as the target", body: "Click the 100 KB preset (it's selected by default on this page) - or type a different number if you need one." },
              { step: "03", title: "Download the result", body: "The download starts automatically. Check the size, dimensions and quality shown before you submit it anywhere." },
            ].map((s) => (
              <div key={s.step}>
                <div className="font-readout text-primary text-sm">{s.step}</div>
                <h3 className="mt-2 font-medium">{s.title}</h3>
                <p className="text-ink-muted mt-2 text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Common Uses</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {COMMON_USES.map((use) => (
              <div key={use.title} className="border-border bg-surface rounded-xl border p-5 text-left">
                <h3 className="font-medium">{use.title}</h3>
                <p className="text-ink-muted mt-2 text-sm">{use.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Frequently asked questions</h2>
          <FaqAccordion items={FAQS} />
        </section>

        <section className="mx-auto mt-8 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Related Tools</h2>
          <p className="text-ink-muted mb-4 text-sm leading-relaxed">
            Need to{" "}
            <Link href="/#tool" className="text-primary font-medium">
              resize an image
            </Link>{" "}
            to a different target, or{" "}
            <Link href="/#tool" className="text-primary font-medium">
              compress an image to 100KB
            </Link>{" "}
            in a different format? The same engine powers every conversion on this site.
          </p>
          <ul className="flex flex-wrap gap-2">
            <li>
              <Link href="/" className="conversion-pill px-4 py-1.5 text-sm">
                Image Converter &amp; Compressor
              </Link>
            </li>
            <li>
              <Link href="/convert/png-to-webp" className="conversion-pill px-4 py-1.5 text-sm">
                WebP Converter
              </Link>
            </li>
            <li>
              <Link href="/responsive-image-generator" className="conversion-pill px-4 py-1.5 text-sm">
                Responsive Image Generator
              </Link>
            </li>
            <li>
              <Link href="/svg-optimizer" className="conversion-pill px-4 py-1.5 text-sm">
                SVG Optimizer
              </Link>
            </li>
            <li>
              <Link href="/convert" className="conversion-pill px-4 py-1.5 text-sm">
                View all converters
              </Link>
            </li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
}
