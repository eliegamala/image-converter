import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Footer } from "@/components/Footer";
import { Tool } from "@/components/Tool";

export const metadata: Metadata = {
  title: "PNG to WebP Converter – Convert PNG to WebP Online Free",
  description:
    "Convert PNG to WebP online for free. Keep transparency intact while shrinking file size for faster-loading websites - runs in seconds, no account or software needed.",
  alternates: { canonical: "/convert/png-to-webp" },
  openGraph: {
    title: "PNG to WebP Converter – Convert PNG to WebP Online Free",
    description:
      "Free PNG to WebP converter that keeps transparency intact while cutting file size - ideal for shipping screenshots, icons and UI graphics on a real website.",
  },
};

const STEPS = [
  { step: "01", title: "Upload your PNG", body: "Drag it in or click Upload Your Image - the tool auto-detects the PNG." },
  { step: "02", title: "WebP is already selected", body: "This page defaults Convert To to WebP, so there's nothing to change unless you want a different format." },
  { step: "03", title: "Optionally set a target size", body: "Leave it on Best Quality, or pick a KB target (20/50/100/200KB or custom) if you need a specific file size." },
  { step: "04", title: "Click Convert", body: "The WebP file downloads automatically as soon as it's ready - no extra download step." },
];

const FAQS = [
  {
    question: "Is WebP smaller than PNG?",
    answer:
      "For most screenshots, icons, illustrations and other UI graphics, yes - WebP's compression handles flat colors, sharp edges and repeated patterns more efficiently than PNG's, often producing a file well under half the size at visually equivalent quality. The exact savings depend on the image; a busy, noisy image compresses less dramatically than a simple, flat-color graphic.",
  },
  {
    question: "Does converting PNG to WebP reduce quality?",
    answer:
      "WebP supports both lossless and lossy encoding. This tool uses WebP's lossy mode by default (the same mode responsible for its size advantage), so there's a genuine quality-for-size tradeoff, controlled by the quality/target size you choose. At high quality settings, the visual difference is typically minor to unnoticeable on screen, but it isn't a bit-for-bit lossless copy the way a PNG-to-PNG re-save would be.",
  },
  {
    question: "Does WebP support transparency?",
    answer:
      "Yes. WebP has a full alpha channel, just like PNG, so transparent and semi-transparent areas in your source PNG are preserved in the converted WebP - nothing gets flattened onto a background color.",
  },
  {
    question: "Is WebP better than PNG for websites?",
    answer:
      "For most web use cases - photos, screenshots, icons, illustrations - yes, because smaller image files mean faster page loads, which affects both user experience and search ranking factors like Core Web Vitals. PNG still makes sense when you need guaranteed lossless output (e.g. a master file you'll keep editing) or need to support very old software that doesn't read WebP.",
  },
  {
    question: "How do I convert PNG to WebP?",
    answer:
      "Upload your PNG using the tool above, leave the output format on WebP (it's already selected on this page), optionally set a target file size, and click Convert. The WebP file downloads automatically - no account, install, or extra steps required.",
  },
  {
    question: "Can I convert PNG to WebP for free?",
    answer:
      "Yes, this converter is completely free with no usage limit, watermark, or account requirement. Every conversion runs through the same optimization engine regardless of how often you use it.",
  },
  {
    question: "Does WebP load faster than PNG?",
    answer:
      "In practice, yes - a smaller file transfers faster over the network, which is the dominant factor in how quickly an image appears on a page. Decoding speed differences between WebP and PNG in the browser are typically negligible compared to the download-time savings from a smaller file.",
  },
  {
    question: "Should I use WebP instead of PNG?",
    answer:
      "For images you're publishing on a website, generally yes, given the file size savings with no meaningful downside for modern browsers. Keep PNG for source/master files you intend to keep editing losslessly, or for the rare case where you specifically need broad compatibility with very old tools that don't support WebP.",
  },
  {
    question: "Will my transparent PNG still look right as WebP?",
    answer:
      "Yes - transparent regions stay transparent, and edges around cut-out shapes (like an icon or a logo on a transparent background) are preserved cleanly since WebP's alpha channel works the same way PNG's does.",
  },
  {
    question: "What happens if I set a target file size?",
    answer:
      "The tool searches for the highest quality (and, if necessary, a slightly reduced image size) that still fits under your chosen KB target. If an extremely small target isn't achievable at a reasonable quality, the tool returns the smallest result it found and clearly reports that the target wasn't met, rather than silently degrading the image or claiming success.",
  },
  {
    question: "Is my PNG uploaded to a server?",
    answer:
      "The conversion is handled by cloudvertify's optimization engine and the file isn't stored afterward - it's processed for your conversion and then discarded.",
  },
];

const webApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "cloudvertify PNG to WebP Converter",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any (web-based)",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "Free online PNG to WebP converter. Converts PNG images to WebP with transparency preserved and configurable quality or target file size.",
};

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
    { "@type": "ListItem", position: 3, name: "Convert PNG to WebP", item: "/convert/png-to-webp" },
  ],
};

export default function PngToWebpPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="hero-dark">
        <div className="mx-auto max-w-3xl px-6 pt-16 pb-16 text-center">
          <div className="mb-6 flex justify-center">
            <Breadcrumb
              items={[
                { label: "cloudvertify", href: "/" },
                { label: "Tools", href: "/convert" },
                { label: "Convert PNG to WebP" },
              ]}
            />
          </div>
          <h1 className="font-display text-ink text-4xl font-semibold sm:text-5xl">
            Convert PNG to WebP Online for Free
          </h1>
          <p className="text-ink/70 mt-4">
            Convert a PNG image to WebP directly in your browser - no software, no account, no
            limit. This PNG to WebP converter keeps transparency fully intact while shrinking file
            size, which is why it&apos;s the conversion most people reach for when preparing
            screenshots, icons and UI graphics for a real website.
          </p>

          <div className="on-light border-border bg-surface mt-10 rounded-2xl border p-6 text-left shadow-xl sm:p-8">
            <Tool defaultFormat="webp" defaultSourceFormat="png" />
          </div>
        </div>
      </div>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center gap-4 px-6 py-16">
        <section className="mx-auto w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Why Convert PNG to WebP</h2>
          <p className="text-ink-muted leading-relaxed">
            PNG is a lossless format - it never discards image data, which makes it reliable but
            also means it compresses much less aggressively than modern formats. A screenshot,
            icon, or UI graphic saved as PNG is very often several times larger than it needs to
            be for how it&apos;s actually used: displayed on a screen, not archived pixel-for-pixel.
            WebP was designed specifically to compress this kind of content - flat colors, sharp
            edges, repeated patterns - far more efficiently, while still supporting the same full
            transparency PNG offers. Converting a PNG image to WebP typically means a noticeably
            smaller file with no visible difference in a browser.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">How to Convert PNG to WebP</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {STEPS.map((s) => (
              <div key={s.step}>
                <div className="font-readout text-primary text-sm">{s.step}</div>
                <h3 className="mt-2 font-medium">{s.title}</h3>
                <p className="text-ink-muted mt-2 text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">PNG vs WebP</h2>
          <p className="text-ink-muted leading-relaxed">
            <strong>Compression.</strong> PNG uses lossless compression only - it can shrink a file
            somewhat, but every original pixel is preserved exactly. WebP supports both lossless
            and lossy modes; this converter uses lossy WebP by default, which is what unlocks its
            much smaller file sizes.
          </p>
          <p className="text-ink-muted mt-4 leading-relaxed">
            <strong>File size.</strong> For typical web graphics - screenshots, icons,
            illustrations - WebP files often come in well under half the size of an equivalent
            PNG. The gap is smaller on already-simple images and larger on more detailed or
            photographic ones.
          </p>
          <p className="text-ink-muted mt-4 leading-relaxed">
            <strong>Transparency.</strong> Both formats support a full alpha channel. Converting a
            transparent PNG to WebP keeps every transparent and semi-transparent pixel exactly as
            it was - see{" "}
            <Link href="#faq" className="text-primary font-medium">
              the FAQ below
            </Link>{" "}
            for more on this.
          </p>
          <p className="text-ink-muted mt-4 leading-relaxed">
            <strong>Image quality.</strong> Because WebP&apos;s size savings mostly come from lossy
            compression, there&apos;s a genuine quality tradeoff, though at high quality it&apos;s
            usually not noticeable on screen. If you need a guaranteed-lossless copy instead,
            keeping the file as PNG - or converting to PNG from another format via our{" "}
            <Link href="/convert/jpg-to-png" className="text-primary font-medium">
              JPG to PNG converter
            </Link>{" "}
            - is the safer choice.
          </p>
          <p className="text-ink-muted mt-4 leading-relaxed">
            <strong>Browser and web usage.</strong> Every modern browser supports WebP natively,
            and it&apos;s been the recommended format for web images by major performance guides
            for several years now. PNG remains universally supported too, but at a real cost in
            page weight for content that doesn&apos;t need lossless precision.
          </p>
          <p className="text-ink-muted mt-4 leading-relaxed">
            <strong>When WebP makes sense:</strong> publishing images on a website or app where
            load time matters - which is most of the time. <strong>When PNG is preferable:</strong>{" "}
            source files you&apos;ll keep editing, situations demanding pixel-perfect lossless
            output, or compatibility with older tools that don&apos;t read WebP.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Reducing File Size Further</h2>
          <p className="text-ink-muted leading-relaxed">
            If a screenshot or graphic still needs to be smaller than WebP&apos;s default quality
            produces, this tool lets you target a specific file size - 20KB, 50KB, 100KB, 200KB, or
            a custom value - instead of just picking a quality percentage. It searches for the
            highest quality that still fits your target, and only reduces the image&apos;s
            dimensions as a last resort if quality alone can&apos;t get there. There&apos;s a real
            floor to how small any image can get without becoming visibly degraded, so an
            extremely aggressive target on a large or detailed source may not be fully reachable -
            the tool reports honestly when that happens rather than pretending otherwise.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Common Use Cases</h2>
          <ul className="text-ink-muted flex flex-col gap-2 text-sm leading-relaxed">
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              Shrinking screenshots before embedding them in documentation, a blog post, or a
              support article.
            </li>
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              Preparing app icons, UI elements and illustrations for a website without inflating
              page weight.
            </li>
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              Converting exported design assets (from Figma, Sketch, etc.) that default to PNG
              into a web-ready format.
            </li>
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              Reducing image weight across a site to improve load time and Core Web Vitals scores.
            </li>
          </ul>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">More Ways to Convert</h2>
          <p className="text-ink-muted leading-relaxed">
            If you&apos;re not sure WebP is the right target format,{" "}
            <Link href="/convert/png-to-jpg" className="text-primary font-medium">
              convert PNG to JPG
            </Link>{" "}
            instead when the image is a photo with no transparency and you want maximum
            compatibility, or{" "}
            <Link href="/convert/png-to-avif" className="text-primary font-medium">
              convert PNG to AVIF
            </Link>{" "}
            for even smaller files if your audience uses modern browsers. Already working with JPG
            source images instead of PNG? Use{" "}
            <Link href="/convert/jpg-to-webp" className="text-primary font-medium">
              our JPG to WebP converter
            </Link>{" "}
            to get the same WebP size benefits from a JPG starting point.
          </p>
        </section>

        <section id="faq" className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Frequently Asked Questions</h2>
          <FaqAccordion items={FAQS} />
        </section>

        <section className="mx-auto mt-8 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Related Conversions</h2>
          <ul className="flex flex-wrap gap-2">
            <li>
              <Link href="/convert/png-to-jpg" className="conversion-pill px-4 py-1.5 text-sm">
                Convert PNG to JPG
              </Link>
            </li>
            <li>
              <Link href="/convert/png-to-avif" className="conversion-pill px-4 py-1.5 text-sm">
                Convert PNG to AVIF
              </Link>
            </li>
            <li>
              <Link href="/convert/jpg-to-webp" className="conversion-pill px-4 py-1.5 text-sm">
                Convert JPG to WebP
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
