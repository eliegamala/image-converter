import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Footer } from "@/components/Footer";
import { PngToSvgTool } from "@/components/PngToSvgTool";

export const metadata: Metadata = {
  title: "PNG to SVG Converter",
  description:
    "Convert PNG to SVG online for free with real image vectorization - true vector paths, not a raster image embedded in SVG. Adjust color count, detail, smoothing and threshold, preview live, and download.",
  alternates: { canonical: "/png-to-svg" },
  openGraph: {
    title: "PNG to SVG Converter",
    description:
      "Free online PNG to SVG converter that vectorizes images into real, editable vector paths - not a wrapped raster.",
  },
};

const FAQS = [
  {
    question: "How do I convert PNG to SVG?",
    answer:
      "Upload your PNG, adjust the color count, detail, smoothing and threshold if you like, then click Download SVG. The image is vectorized directly in your browser and updates live as you change the settings.",
  },
  {
    question: "Is this png to svg converter free to use online?",
    answer:
      "Yes. This SVG converter is completely free, runs entirely online, and doesn't require an account or any software installation.",
  },
  {
    question: "Does this actually vectorize the image, or just wrap the PNG in an SVG tag?",
    answer:
      "It genuinely vectorizes it. The PNG's colors are traced into real SVG paths and curves - open the output in a vector editor and every shape is a separate, editable path, not a base64-encoded raster stuffed inside an <image> tag.",
  },
  {
    question: "What do the color count, detail, smoothing and threshold controls do?",
    answer:
      "Color count sets how many distinct colors the output uses. Detail controls how closely paths follow the original edges. Smoothing softens noisy pixels before tracing. Threshold filters out small, stray shapes so the result stays clean.",
  },
  {
    question: "What kind of images vectorize best?",
    answer:
      "Logos, icons, flat illustrations and simple graphics with clean edges and few colors trace the most cleanly. Photos and gradients can still be vectorized, but expect more paths and a much larger, more complex SVG.",
  },
  {
    question: "Is my uploaded PNG file stored anywhere?",
    answer:
      "No. Vectorization happens directly in your browser - your PNG and the resulting SVG never leave your device or touch our servers.",
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
    { "@type": "ListItem", position: 3, name: "PNG to SVG Converter", item: "/png-to-svg" },
  ],
};

export default function PngToSvgPage() {
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
                { label: "PNG to SVG Converter" },
              ]}
            />
          </div>
          <h1 className="font-display text-ink text-4xl font-semibold sm:text-5xl">
            PNG to SVG Converter
          </h1>
          <p className="text-ink/70 mt-4">
            Convert PNG to SVG online, free and instantly, using real image vectorization. Tune
            the color count, detail, smoothing and threshold, preview the result live against
            your original, and download a true vector SVG with editable paths - entirely inside
            your browser.
          </p>

          <div className="on-light border-border bg-surface mt-10 rounded-2xl border p-6 text-left shadow-xl sm:p-8">
            <PngToSvgTool />
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
              <Link href="/svg-to-png" className="conversion-pill px-4 py-1.5 text-sm">
                Convert SVG to PNG
              </Link>
            </li>
            <li>
              <Link href="/convert/png-to-webp" className="conversion-pill px-4 py-1.5 text-sm">
                Convert PNG to WebP
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
