import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Footer } from "@/components/Footer";
import { SvgToPngTool } from "@/components/SvgToPngTool";

export const metadata: Metadata = {
  title: "SVG to PNG Converter",
  description:
    "Convert SVG to PNG online for free. Set a custom width, height and export scale (1x, 2x or 4x), choose a transparent or custom background, preview instantly, and download a high-quality PNG.",
  alternates: { canonical: "/svg-to-png" },
  openGraph: {
    title: "SVG to PNG Converter",
    description:
      "Free online SVG to PNG converter with custom size, export scale, transparent background and an instant preview.",
  },
};

const FAQS = [
  {
    question: "How do I convert SVG to PNG?",
    answer:
      "Upload your SVG file, set the width, height and scale you need, choose a transparent or custom background, then click Download PNG. The conversion runs instantly in your browser as you adjust the settings.",
  },
  {
    question: "Is this SVG to PNG converter free to use online?",
    answer:
      "Yes. This SVG converter is completely free, works entirely online, and doesn't require an account or any software installation.",
  },
  {
    question: "Can I make the PNG background transparent?",
    answer:
      "Yes. Choose Transparent to keep an alpha channel in the exported PNG, or pick Custom color to fill the background with any solid color instead.",
  },
  {
    question: "What size should I export my PNG at?",
    answer:
      "Set the exact width and height you need in pixels, then use the 2x or 4x scale option to export at a higher resolution for retina screens or print. The SVG is redrawn at the target size rather than stretched, so edges stay sharp.",
  },
  {
    question: "Does converting SVG to PNG reduce quality?",
    answer:
      "Not for the artwork itself - it's redrawn crisply at whatever resolution you choose. Keep in mind PNG is a raster format, so once exported the image becomes a fixed grid of pixels rather than the infinitely scalable original SVG.",
  },
  {
    question: "Is my uploaded SVG file stored anywhere?",
    answer:
      "No. This conversion happens directly in your browser - your SVG file and the resulting PNG never leave your device or touch our servers.",
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
    { "@type": "ListItem", position: 3, name: "SVG to PNG Converter", item: "/svg-to-png" },
  ],
};

export default function SvgToPngPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="hero-dark">
        <div className="mx-auto max-w-3xl px-6 pt-16 pb-16 text-center">
          <div className="mb-6 flex justify-center">
            <Breadcrumb
              items={[
                { label: "cloudvertify", href: "/" },
                { label: "Tools", href: "/convert" },
                { label: "SVG to PNG Converter" },
              ]}
            />
          </div>
          <h1 className="font-display text-ink text-4xl font-semibold sm:text-5xl">
            SVG to PNG Converter
          </h1>
          <p className="text-ink/70 mt-4">
            Convert SVG to PNG online, free and instantly. Set an exact width, height and export
            scale, pick a transparent or custom background, and download a crisp, high-quality
            PNG - entirely inside your browser.
          </p>

          <div className="on-light border-border bg-surface mt-10 rounded-2xl border p-6 text-left shadow-xl sm:p-8">
            <SvgToPngTool />
          </div>
        </div>
      </div>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center gap-4 px-6 py-16">
        <section className="mx-auto w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Frequently asked questions</h2>
          <FaqAccordion items={FAQS} />
        </section>

        <section className="mx-auto mt-8 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">More conversions</h2>
          <ul className="flex flex-wrap gap-2">
            <li>
              <Link href="/convert/png-to-webp" className="conversion-pill px-4 py-1.5 text-sm">
                Convert PNG to WebP
              </Link>
            </li>
            <li>
              <Link href="/convert/png-to-jpg" className="conversion-pill px-4 py-1.5 text-sm">
                Convert PNG to JPG
              </Link>
            </li>
            <li>
              <Link href="/png-to-svg" className="conversion-pill px-4 py-1.5 text-sm">
                Convert PNG to SVG
              </Link>
            </li>
            <li>
              <Link href="/image-to-base64" className="conversion-pill px-4 py-1.5 text-sm">
                Image to Base64 Converter
              </Link>
            </li>
            <li>
              <Link href="/base64-to-image" className="conversion-pill px-4 py-1.5 text-sm">
                Base64 to Image Converter
              </Link>
            </li>
            <li>
              <Link href="/svg-optimizer" className="conversion-pill px-4 py-1.5 text-sm">
                SVG Optimizer
              </Link>
            </li>
            <li>
              <Link href="/favicon-generator" className="conversion-pill px-4 py-1.5 text-sm">
                Favicon Generator
              </Link>
            </li>
            <li>
              <Link href="/responsive-image-generator" className="conversion-pill px-4 py-1.5 text-sm">
                Responsive Image Generator
              </Link>
            </li>
            <li>
              <Link href="/resize-image-to-100kb" className="conversion-pill px-4 py-1.5 text-sm">
                Resize Image to 100KB
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
