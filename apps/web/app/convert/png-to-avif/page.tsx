import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Footer } from "@/components/Footer";
import { Tool } from "@/components/Tool";

export const metadata: Metadata = {
  title: "PNG to AVIF Converter – Convert PNG to AVIF Online Free",
  description:
    "Convert PNG to AVIF online for free. AVIF keeps full transparency while compressing far more efficiently than PNG - ideal for icons, illustrations and product shots on modern sites.",
  alternates: { canonical: "/convert/png-to-avif" },
  openGraph: {
    title: "PNG to AVIF Converter – Convert PNG to AVIF Online Free",
    description:
      "Free PNG to AVIF converter that preserves transparency while delivering the smallest file sizes of any current image format for modern browsers.",
  },
};

const STEPS = [
  { step: "01", title: "Upload your PNG", body: "Drag it in or click Upload Your Image." },
  { step: "02", title: "AVIF is already selected", body: "This page defaults Convert To to AVIF - switch it if you want a different format instead." },
  { step: "03", title: "Optionally set a target size", body: "Leave it on Best Quality, or choose a KB target if you need a specific file size." },
  { step: "04", title: "Click Convert", body: "The AVIF file downloads automatically once it's ready." },
];

const FAQS = [
  {
    question: "Is AVIF smaller than PNG?",
    answer:
      "Yes, typically by a large margin. AVIF uses modern, highly efficient compression (derived from the AV1 video codec) that outperforms PNG's lossless approach substantially, especially on photographic or detailed content - and it still beats PNG on flatter graphics, just by a smaller margin.",
  },
  {
    question: "Is AVIF better than PNG?",
    answer:
      "For delivering images on the web, AVIF is generally the better choice on file size while matching or exceeding PNG's visual quality at reasonable settings, and it still supports transparency. PNG remains preferable when you specifically need guaranteed lossless output or need to support very old software, since AVIF is a newer format with a shorter compatibility history.",
  },
  {
    question: "Does AVIF support transparency?",
    answer:
      "Yes - AVIF has a full alpha channel, the same as PNG. Converting a transparent PNG (an icon, a cut-out product photo, an illustration) to AVIF preserves the transparency exactly.",
  },
  {
    question: "Does converting PNG to AVIF reduce quality?",
    answer:
      "This tool's AVIF encoding is lossy by default, so there is a genuine quality-for-size tradeoff, the same as with JPG or WebP. At the quality levels this tool targets by default, the visual difference from the source PNG is typically minimal, but it isn't a byte-for-byte lossless copy - if you need guaranteed lossless output, keep the file as PNG.",
  },
  {
    question: "Why use AVIF for websites?",
    answer:
      "Smaller image files mean faster page loads, which directly affects user experience and performance metrics like Core Web Vitals. AVIF currently offers the best compression efficiency of the widely-deployed image formats while still supporting transparency and modern color, making it a strong default for image-heavy pages on a modern audience.",
  },
  {
    question: "How do I convert PNG to AVIF?",
    answer:
      "Upload your PNG above, leave the output format on AVIF (already selected on this page), optionally set a target file size, and click Convert - the AVIF file downloads automatically as soon as it's ready.",
  },
  {
    question: "Is AVIF good for photographs?",
    answer:
      "Yes - AVIF handles photographic detail and noise very efficiently, often producing noticeably smaller files than JPG or WebP at comparable visual quality, which is why it's increasingly used as the primary format for photo-heavy websites.",
  },
  {
    question: "Is AVIF supported by modern browsers?",
    answer:
      "Yes - all current major browsers (Chrome, Firefox, Safari, Edge) support AVIF. Very old browser versions and some legacy software don't, which is the main reason to keep a JPG or WebP fallback available if your audience includes users on outdated software.",
  },
  {
    question: "How does AVIF compare to WebP for PNG conversions?",
    answer:
      "Both support transparency and compress far better than PNG. AVIF usually edges out WebP on file size at equivalent quality, particularly for detailed or photographic content, while WebP has broader compatibility with slightly older browsers and tools. If AVIF support is a concern for your audience, WebP is the natural middle-ground alternative.",
  },
  {
    question: "Will AVIF encoding take longer than JPG or WebP?",
    answer:
      "It can, since AVIF's compression algorithm is more computationally intensive than JPG's or WebP's. This tool balances that by using a fast search pass to find the right settings and only performing one slower, high-quality final encode for the result you actually download.",
  },
  {
    question: "Is my PNG uploaded to a server?",
    answer: "It's processed by cloudvertify's conversion engine for the conversion itself and isn't retained afterward.",
  },
];

const webApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "cloudvertify PNG to AVIF Converter",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any (web-based)",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "Free online PNG to AVIF converter. Converts PNG images to the AVIF format with transparency preserved and configurable quality or target file size.",
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
    { "@type": "ListItem", position: 3, name: "Convert PNG to AVIF", item: "/convert/png-to-avif" },
  ],
};

export default function PngToAvifPage() {
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
                { label: "Convert PNG to AVIF" },
              ]}
            />
          </div>
          <h1 className="font-display text-ink text-4xl font-semibold sm:text-5xl">
            Convert PNG to AVIF Online for Free
          </h1>
          <p className="text-ink/70 mt-4">
            Convert a PNG image to AVIF directly in your browser - free, with no account and no
            software to install. AVIF is currently the most space-efficient image format in
            common use, and it still supports full transparency, so PNG graphics that need to
            stay crisp and small benefit the most from this conversion.
          </p>

          <div className="on-light border-border bg-surface mt-10 rounded-2xl border p-6 text-left shadow-xl sm:p-8">
            <Tool defaultFormat="avif" defaultSourceFormat="png" />
          </div>
        </div>
      </div>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center gap-4 px-6 py-16">
        <section className="mx-auto w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Why Convert PNG to AVIF</h2>
          <p className="text-ink-muted leading-relaxed">
            AVIF is a relatively new image format built on the same underlying compression
            technology as the AV1 video codec, and it&apos;s designed to squeeze out more efficiency
            than older image formats at a given visual quality. For PNG images specifically - which
            are lossless and therefore often much larger than they need to be for on-screen use -
            converting to AVIF usually means a dramatically smaller file. Icons, illustrations, and
            product shots with cut-out backgrounds are the biggest beneficiaries, since they need
            both small file size and the transparency AVIF fully supports.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">How to Convert PNG to AVIF</h2>
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
          <h2 className="font-display mb-4 text-xl">PNG vs AVIF</h2>
          <p className="text-ink-muted leading-relaxed">
            <strong>Compression efficiency.</strong> PNG&apos;s lossless compression preserves every
            pixel exactly but leaves real file-size savings on the table for content that doesn&apos;t
            need pixel-perfect precision. AVIF&apos;s compression is dramatically more efficient,
            typically producing a much smaller file at a quality level that&apos;s still very close to
            the original.
          </p>
          <p className="text-ink-muted mt-4 leading-relaxed">
            <strong>Quality.</strong> AVIF supports both lossless and lossy modes; this tool uses
            lossy AVIF by default, which is what delivers its size advantage. At sensible quality
            settings the difference from the source PNG is minor, but - as with any lossy format -
            it is a tradeoff, not a free upgrade.
          </p>
          <p className="text-ink-muted mt-4 leading-relaxed">
            <strong>Transparency.</strong> Both PNG and AVIF support a full alpha channel, so
            transparent PNGs convert cleanly with no flattening or background added.
          </p>
          <p className="text-ink-muted mt-4 leading-relaxed">
            <strong>Browser support and use cases.</strong> All current major browsers support
            AVIF. It&apos;s best suited to modern web delivery where you control (or can detect and
            fall back from) the format shown to visitors; for guaranteed universal compatibility
            with very old software, PNG or JPG remain safer choices.
          </p>
          <p className="text-ink-muted mt-4 leading-relaxed">
            <strong>When AVIF is appropriate:</strong> publishing images for a modern web audience
            where file size and load time matter - icons, illustrations, product photography,
            hero images. <strong>When it isn&apos;t:</strong> workflows requiring guaranteed
            lossless precision, or audiences you know rely on older browsers or tools without AVIF
            support.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Modern Web Delivery with AVIF</h2>
          <p className="text-ink-muted leading-relaxed">
            Most sites that adopt AVIF don&apos;t replace every other format outright - they serve
            AVIF to browsers that support it and fall back to WebP or JPG for the rest, using the
            HTML{" "}
            <code className="font-readout text-ink bg-bg rounded px-1.5 py-0.5 text-xs">
              &lt;picture&gt;
            </code>{" "}
            element or equivalent server-side content negotiation. If you need to generate that
            kind of multi-format, multi-size image set automatically, cloudvertify&apos;s{" "}
            <Link href="/responsive-image-generator" className="text-primary font-medium">
              Responsive Image Generator
            </Link>{" "}
            builds exactly that from a single source image.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Reducing File Size Further</h2>
          <p className="text-ink-muted leading-relaxed">
            Beyond AVIF&apos;s default compression, this tool also supports targeting a specific
            file size - 20KB, 50KB, 100KB, 200KB, or a custom value - the same way it does for JPG
            and WebP. It searches for the highest quality that still fits your target and only
            reduces the image&apos;s dimensions if quality reduction alone isn&apos;t enough. As
            with any format, there&apos;s a real limit to how small an image can get before quality
            visibly suffers, and the tool reports honestly if a target can&apos;t be met rather
            than silently producing an over-compressed result.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Common Use Cases</h2>
          <ul className="text-ink-muted flex flex-col gap-2 text-sm leading-relaxed">
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              Compressing icons and illustrations with transparent backgrounds for a modern
              website.
            </li>
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              Reducing product photography file size while keeping cut-out backgrounds
              transparent.
            </li>
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              Cutting page weight on image-heavy sites where every kilobyte affects load time.
            </li>
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              Preparing the smallest possible source assets for a responsive{" "}
              <code className="font-readout text-ink bg-bg rounded px-1.5 py-0.5 text-xs">
                &lt;picture&gt;
              </code>{" "}
              element image set.
            </li>
          </ul>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">More Ways to Convert</h2>
          <p className="text-ink-muted leading-relaxed">
            Need broader compatibility than AVIF currently offers?{" "}
            <Link href="/convert/png-to-webp" className="text-primary font-medium">
              Convert PNG to WebP
            </Link>{" "}
            instead for a format with wider support that still compresses well and keeps
            transparency. Already have JPG source images you want in AVIF?{" "}
            <Link href="/convert/jpg-to-avif" className="text-primary font-medium">
              Convert JPG to AVIF
            </Link>{" "}
            applies the same encoding to photographic sources. And if you&apos;re moving an
            existing WebP library to AVIF for the extra compression,{" "}
            <Link href="/convert/webp-to-avif" className="text-primary font-medium">
              convert WebP to AVIF
            </Link>{" "}
            handles that directly.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Frequently Asked Questions</h2>
          <FaqAccordion items={FAQS} />
        </section>

        <section className="mx-auto mt-8 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Related Conversions</h2>
          <ul className="flex flex-wrap gap-2">
            <li>
              <Link href="/convert/png-to-webp" className="conversion-pill px-4 py-1.5 text-sm">
                Convert PNG to WebP
              </Link>
            </li>
            <li>
              <Link href="/convert/jpg-to-avif" className="conversion-pill px-4 py-1.5 text-sm">
                Convert JPG to AVIF
              </Link>
            </li>
            <li>
              <Link href="/convert/webp-to-avif" className="conversion-pill px-4 py-1.5 text-sm">
                Convert WebP to AVIF
              </Link>
            </li>
            <li>
              <Link href="/responsive-image-generator" className="conversion-pill px-4 py-1.5 text-sm">
                Responsive Image Generator
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
