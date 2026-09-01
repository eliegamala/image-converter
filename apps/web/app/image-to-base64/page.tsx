import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Footer } from "@/components/Footer";
import { ImageToBase64Tool } from "@/components/ImageToBase64Tool";

export const metadata: Metadata = {
  title: "Image to Base64 Converter",
  description:
    "Convert an image to Base64 online for free - a base64 image encoder that works entirely in your browser. Upload JPG, PNG, WebP, AVIF, GIF, SVG, BMP or TIFF, then copy the Base64 string, the data URI, or download it as a .txt file.",
  alternates: { canonical: "/image-to-base64" },
  openGraph: {
    title: "Image to Base64 Converter",
    description:
      "Free online image to base64 converter - JPG to base64, PNG to base64, and more, entirely in your browser.",
  },
};

const FAQS = [
  {
    question: "How do I convert an image to Base64?",
    answer:
      "Upload or drag and drop your image - JPG, PNG, WebP, AVIF, GIF, SVG, BMP or TIFF - and the Base64 string appears instantly. Copy the Base64, copy the full data URI, or download it as a .txt file.",
  },
  {
    question: "Is this base64 image encoder free and does it run online?",
    answer:
      "Yes. It's completely free, works entirely in your browser, and doesn't require an account or any software installation.",
  },
  {
    question: "Does my image get uploaded to a server?",
    answer:
      "No. The encoding happens entirely on your device using your browser's built-in file reader - your image is never uploaded or sent anywhere.",
  },
  {
    question: "What's the difference between the Base64 string and the data URI?",
    answer:
      "The Base64 string is just the encoded image data. The data URI wraps that string with a scheme prefix (like data:image/png;base64,...) that browsers and CSS understand directly in a src or url() property.",
  },
  {
    question: "Can I convert a PNG to Base64, or a JPG to Base64?",
    answer:
      "Yes - this tool works with PNG to Base64, JPG to Base64, and every other format listed above. The output format is always the same: a Base64-encoded text string ready to paste anywhere.",
  },
  {
    question: "Why would I convert an image to Base64?",
    answer:
      "Base64-encoded images can be embedded directly in HTML, CSS or JSON without a separate file request - useful for small icons, inline email images, or storing images inside a database or config file.",
  },
  {
    question: "Does converting to Base64 make the file bigger?",
    answer:
      "Yes, by design - Base64 encoding trades file size for portability, typically adding about 33% to the original size, since binary data is represented using only text-safe characters.",
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
    { "@type": "ListItem", position: 3, name: "Image to Base64 Converter", item: "/image-to-base64" },
  ],
};

export default function ImageToBase64Page() {
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
                { label: "Image to Base64 Converter" },
              ]}
            />
          </div>
          <h1 className="font-display text-ink text-4xl font-semibold sm:text-5xl">
            Image to Base64 Converter
          </h1>
          <p className="text-ink/70 mt-4">
            Convert an image to Base64 online, free and instantly. Upload JPG, PNG, WebP, AVIF,
            GIF, SVG, BMP or TIFF, preview it, then copy the Base64 string, copy the data URI, or
            download it as a .txt file - entirely inside your browser, nothing uploaded.
          </p>

          <div className="on-light border-border bg-surface mt-10 rounded-2xl border p-6 text-left shadow-xl sm:p-8">
            <ImageToBase64Tool />
          </div>
        </div>
      </div>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center gap-4 px-6 py-16">
        <section className="mx-auto w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Frequently asked questions</h2>
          <FaqAccordion items={FAQS} />
        </section>

        <section className="mx-auto mt-8 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">More tools</h2>
          <ul className="flex flex-wrap gap-2">
            <li>
              <Link href="/svg-to-png" className="conversion-pill px-4 py-1.5 text-sm">
                Convert SVG to PNG
              </Link>
            </li>
            <li>
              <Link href="/png-to-svg" className="conversion-pill px-4 py-1.5 text-sm">
                Convert PNG to SVG
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
