import type { Metadata } from "next";
import Link from "next/link";
import { Base64ToImageTool } from "@/components/Base64ToImageTool";
import { Breadcrumb } from "@/components/Breadcrumb";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Base64 to Image Converter",
  description:
    "Convert Base64 to an image online for free - a Base64 decoder that works entirely in your browser. Paste a Base64 string or data URI to preview it instantly, then download as PNG, JPG, WebP or the original format.",
  alternates: { canonical: "/base64-to-image" },
  openGraph: {
    title: "Base64 to Image Converter",
    description:
      "Free online Base64 to image converter and decoder - base64 to PNG, JPG or WebP, entirely in your browser.",
  },
};

const STEPS = [
  {
    step: "01",
    title: "Paste your Base64",
    body: "Paste a raw Base64 string or a full data URI - the kind that starts with data:image/png;base64,... - into the box above.",
  },
  {
    step: "02",
    title: "Check the preview",
    body: "The image decodes instantly. Review the live preview along with the detected MIME type, dimensions and file size.",
  },
  {
    step: "03",
    title: "Download or copy",
    body: "Download the original file, convert it to PNG, JPG or WebP, or copy the image straight to your clipboard.",
  },
];

const FAQS = [
  {
    question: "How do I convert Base64 to an image?",
    answer:
      "Paste a Base64 string or a full data URI into the box above. The tool decodes it instantly and shows a live preview, along with the detected format, dimensions and file size.",
  },
  {
    question: "What's the difference between a raw Base64 string and a data URI?",
    answer:
      "A raw Base64 string is just the encoded bytes. A data URI wraps that string with a prefix like data:image/png;base64, that tells a browser what kind of file it is. This decoder accepts either one and detects which you've pasted automatically.",
  },
  {
    question: "Can I convert Base64 to PNG, JPG or WebP?",
    answer:
      "Yes. Once your Base64 is decoded, use Download as PNG, Download as JPG or Download as WebP to convert it to that format, or Download Original to keep the exact file you started with.",
  },
  {
    question: "Is this Base64 decoder free and does it work online?",
    answer:
      "Yes. It's completely free, works entirely in your browser, and doesn't require an account or any software installation.",
  },
  {
    question: "Is my Base64 data uploaded anywhere?",
    answer: "No. Decoding happens entirely on your device - nothing you paste is sent to a server.",
  },
  {
    question: "Why does my Base64 string fail to decode?",
    answer:
      "Usually because it's incomplete, has extra characters mixed in, or isn't actually image data. Make sure you've copied the whole string, including the data:...;base64, prefix if it has one.",
  },
  {
    question: "What image formats does this online Base64 to image converter support?",
    answer:
      "It detects and decodes PNG, JPG, WebP, GIF, SVG, BMP and TIFF automatically from the Base64 data itself - no format needs to be specified.",
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
    { "@type": "ListItem", position: 3, name: "Base64 to Image Converter", item: "/base64-to-image" },
  ],
};

export default function Base64ToImagePage() {
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
                { label: "Base64 to Image Converter" },
              ]}
            />
          </div>
          <h1 className="font-display text-ink text-4xl font-semibold sm:text-5xl">
            Base64 to Image Converter
          </h1>
          <p className="text-ink/70 mt-4">
            Convert Base64 to an image online, free and instantly. Paste a Base64 string or a
            data URI, preview it live, and download it as PNG, JPG, WebP or its original format -
            entirely inside your browser, nothing uploaded.
          </p>

          <div className="on-light border-border bg-surface mt-10 rounded-2xl border p-6 text-left shadow-xl sm:p-8">
            <Base64ToImageTool />
          </div>
        </div>
      </div>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center gap-4 px-6 py-16">
        <section className="mx-auto w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">What is Base64 image decoding?</h2>
          <p className="text-ink-muted leading-relaxed">
            Base64 is a way of representing binary data - like an image - as plain text, using
            only letters, numbers and a few symbols. It&apos;s commonly used to embed images directly
            inside HTML, CSS, JSON or email templates without linking to a separate file.
          </p>
          <p className="text-ink-muted mt-4 leading-relaxed">
            This tool reverses that process. Paste a Base64 string or a full data URI and it
            decodes the text back into a real image file, right in your browser - no server, no
            upload, and no account needed.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">How to convert Base64 to an image</h2>
          <div className="grid gap-6 sm:grid-cols-3">
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
          <h2 className="font-display mb-4 text-xl">Frequently asked questions</h2>
          <FaqAccordion items={FAQS} />
        </section>

        <section className="mx-auto mt-8 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">More tools</h2>
          <ul className="flex flex-wrap gap-2">
            <li>
              <Link href="/image-to-base64" className="conversion-pill px-4 py-1.5 text-sm">
                Image to Base64 Converter
              </Link>
            </li>
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
              <Link href="/" className="conversion-pill px-4 py-1.5 text-sm">
                Image Converter
              </Link>
            </li>
            <li>
              <Link href="/" className="conversion-pill px-4 py-1.5 text-sm">
                Image Compressor
              </Link>
            </li>
            <li>
              <Link href="/resize-image-to-100kb" className="conversion-pill px-4 py-1.5 text-sm">
                Resize Image to 100KB
              </Link>
            </li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
}
