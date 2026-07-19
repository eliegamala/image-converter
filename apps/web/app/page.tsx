import type { Metadata } from "next";
import Link from "next/link";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Footer } from "@/components/Footer";
import { HomeHero } from "@/components/HomeHero";
import { CONVERSIONS } from "@/content/conversions";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <p className="font-readout text-ink-muted text-[11px] tracking-[0.3em] uppercase">
        {children}
      </p>
      <div className="bg-primary mt-3 h-px w-12" />
    </div>
  );
}

export const metadata: Metadata = {
  title: "Image Converter – Convert, Compress & Optimize Images Online",
  description:
    "Convert JPG, PNG, WebP, AVIF and HEIC images online. Compress and optimize images without losing quality. Fast, free, secure and no registration required.",
  alternates: { canonical: "/" },
};

const CAPABILITIES = [
  {
    title: "Convert Image Format",
    body: "Switch between JPG, PNG, WebP and AVIF - and bring photos in from HEIC - in one click.",
  },
  {
    title: "Compress to a Target Size",
    body: "Tell it 100 KB, 200 KB, or 500 KB and it finds the highest quality that still fits.",
  },
  {
    title: "Smart Quality Optimization",
    body: "No target in mind? It defaults to the best quality achievable without asking you anything.",
  },
];

const WHY_US = [
  {
    title: "Intelligent Image Optimization",
    body: "Every image is analyzed individually to determine the best compression settings for maximum quality and minimum file size.",
  },
  {
    title: "High Quality Results",
    body: "Preserve sharpness, color, transparency and detail while significantly reducing image size.",
  },
  {
    title: "Lightning Fast",
    body: "Most image conversions complete within seconds.",
  },
  {
    title: "Secure File Processing",
    body: "Your uploaded files are processed securely and automatically deleted after conversion.",
  },
  {
    title: "Works Everywhere",
    body: "Compatible with Windows, macOS, Linux, Android and iPhone. No software installation required.",
  },
];

const SUPPORTED_FORMATS = [
  "JPG",
  "PNG",
  "WebP",
  "AVIF",
  "HEIC",
  "GIF",
  "BMP",
  "TIFF",
  "PDF",
];

const COMMON_USES = [
  "Converting JPG to WebP for faster websites",
  "Converting HEIC photos from iPhone to JPG",
  "Compressing images for email attachments",
  "Optimizing images for WordPress websites",
  "Reducing image sizes for Shopify stores",
  "Preparing images for Instagram, Facebook and LinkedIn",
  "Creating smaller images for mobile apps",
  "Improving website loading speed",
  "Reducing bandwidth usage",
  "Preparing images for presentations and documents",
];

const FORMAT_COMPARISON = [
  { format: "JPG", bestFor: "Photos", transparency: "No", compression: "High" },
  { format: "PNG", bestFor: "Graphics & Logos", transparency: "Yes", compression: "Medium" },
  { format: "WebP", bestFor: "Websites", transparency: "Yes", compression: "Excellent" },
  { format: "AVIF", bestFor: "Modern Web", transparency: "Yes", compression: "Outstanding" },
  { format: "HEIC", bestFor: "iPhone Photos", transparency: "Yes", compression: "Excellent" },
  { format: "GIF", bestFor: "Simple Graphics", transparency: "Limited", compression: "Low" },
  { format: "BMP", bestFor: "Legacy Software", transparency: "No", compression: "None" },
  { format: "TIFF", bestFor: "Print & Archival", transparency: "No", compression: "Low" },
  { format: "PDF", bestFor: "Documents", transparency: "No", compression: "High" },
];

const FAQS = [
  {
    question: "What image formats can I convert?",
    answer:
      "You can convert JPG, PNG, WebP and AVIF images, and bring photos in from HEIC, directly in your browser.",
  },
  {
    question: "Does converting an image reduce quality?",
    answer:
      "Not necessarily. The optimization engine automatically selects the highest possible quality while reducing file size whenever possible.",
  },
  {
    question: "Is this image converter free?",
    answer: "Yes. Converting, compressing and optimizing images is free, with no account required.",
  },
  {
    question: "Are my uploaded images private?",
    answer:
      "Yes. Images are processed securely and are not stored after conversion - the server discards them once the response is sent.",
  },
  {
    question: "Can I convert images on my phone?",
    answer:
      "Yes. It works on desktop computers, tablets and mobile devices without installing any software.",
  },
  {
    question: "Can I compress images under a specific file size?",
    answer:
      "Yes. You can optimize images for target file sizes such as 100 KB, 200 KB, 500 KB, or any custom limit, while preserving the highest possible quality.",
  },
  {
    question: "Which image format is best for websites?",
    answer:
      "For most websites, WebP offers an excellent balance of quality and file size. AVIF can produce even smaller files for many images, while PNG remains useful when transparency or maximum lossless quality is required.",
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

const ROMAN = ["I", "II", "III", "IV", "V"];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Load the image",
    body: "Drag and drop, paste, or click to choose a JPG, PNG, WebP, AVIF or HEIC file.",
  },
  {
    step: "02",
    title: "Set the goal",
    body: "Pick an output format and, if it matters, a target file size in KB.",
  },
  {
    step: "03",
    title: "Pull the print",
    body: "Download a result balanced for the best quality your target allows.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div id="tool">
        <HomeHero />
      </div>

      <main className="flex flex-1 flex-col items-center">
        <section className="mx-auto mt-20 max-w-2xl px-6 text-center">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            The Smarter Way to Optimize Images
          </h2>
          <p className="text-ink-muted mt-4 leading-relaxed">
            Whether you&apos;re converting an image format, reducing file size, or preparing
            images for the web, the optimization engine automatically finds the best balance
            between image quality and file size.
          </p>
          <p className="text-ink-muted mt-4 leading-relaxed">
            Unlike traditional image converters that use a single compression setting, every image
            is analyzed individually to deliver the highest possible quality while meeting your
            target file size.
          </p>
        </section>

        <section className="on-dark mt-24 w-full py-20">
          <div className="mx-auto w-full max-w-4xl px-6">
            <Eyebrow>What happens in here</Eyebrow>
            <div className="border-border mt-10 border-t">
              {CAPABILITIES.map((cap, index) => (
                <Link
                  key={cap.title}
                  href="#tool"
                  className="flip-row border-border block border-b"
                >
                  <span className="flip-bg" aria-hidden="true" />
                  <span className="flip-content flex flex-col gap-2 px-1 py-8 sm:flex-row sm:items-baseline sm:gap-8 sm:py-10">
                    <span className="font-readout text-primary w-10 shrink-0 text-sm">
                      {ROMAN[index]}
                    </span>
                    <span className="font-display flex-1 text-2xl font-extrabold uppercase tracking-tight sm:text-3xl">
                      {cap.title}
                    </span>
                    <span className="text-ink-muted max-w-xs text-sm sm:text-right">
                      {cap.body}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto mt-24 w-full max-w-4xl px-6 text-center">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Popular Image Converters</h2>
          <p className="text-ink-muted mt-2">Convert between today&apos;s most popular image formats.</p>
          <ul className="mt-6 flex flex-wrap justify-center gap-2">
            {CONVERSIONS.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/convert/${c.slug}`}
                  className="conversion-pill dashed-pill px-4 py-1.5 text-sm"
                >
                  {c.fromLabel} to {c.toLabel}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/convert" className="text-primary mt-6 inline-block text-sm font-medium">
            View All Image Converters →
          </Link>
        </section>

        <section className="on-dark mt-24 w-full py-20">
          <div className="mx-auto w-full max-w-4xl px-6">
            <Eyebrow>From upload to download</Eyebrow>
            <div className="mt-10 grid gap-8 sm:grid-cols-3">
              {HOW_IT_WORKS.map((s) => (
                <div key={s.step}>
                  <div className="font-readout text-primary text-sm">{s.step}</div>
                  <h3 className="font-display mt-3 text-lg font-bold">{s.title}</h3>
                  <p className="text-ink-muted mt-2 text-sm leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="on-dark mt-24 w-full py-20">
          <div className="mx-auto w-full max-w-4xl px-6">
            <Eyebrow>Why choose our image converter</Eyebrow>
            <div className="border-border mt-10 border-t">
              {WHY_US.map((item, index) => (
                <div key={item.title} className="flip-row border-border block border-b">
                  <span className="flip-bg" aria-hidden="true" />
                  <span className="flip-content flex flex-col gap-2 px-1 py-8 sm:flex-row sm:items-baseline sm:gap-8 sm:py-10">
                    <span className="font-readout text-primary w-10 shrink-0 text-sm">
                      {ROMAN[index]}
                    </span>
                    <span className="font-display flex-1 text-2xl font-extrabold uppercase tracking-tight sm:text-3xl">
                      {item.title}
                    </span>
                    <span className="text-ink-muted max-w-xs text-sm sm:text-right">
                      {item.body}
                    </span>
                  </span>
                </div>
              ))}
            </div>
            <p className="text-ink-muted mt-8 text-sm">
              Convert and optimize images online for free, without creating an account.
            </p>
          </div>
        </section>

        <section className="mx-auto mt-24 w-full max-w-4xl px-6 text-center">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Supported Image Formats</h2>
          <p className="text-ink-muted mt-2">Convert between the web&apos;s most popular image formats.</p>
          <ul className="font-readout mt-6 flex flex-wrap justify-center gap-2">
            {SUPPORTED_FORMATS.map((f) => (
              <li key={f} className="dashed-pill px-4 py-1.5 text-sm">
                {f}
              </li>
            ))}
          </ul>
          <p className="text-ink-muted mt-4 text-sm">
            HEIC photos can be uploaded and converted to any of the other formats above. Every
            format is optimized for the highest possible image quality.
          </p>

          <h3 className="font-display mt-16 text-xl font-bold">Image Format Comparison</h3>
          <div className="border-border mt-6 overflow-x-auto rounded-xl border text-left">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-border border-b">
                  <th className="p-3 font-medium">Format</th>
                  <th className="p-3 font-medium">Best For</th>
                  <th className="p-3 font-medium">Transparency</th>
                  <th className="p-3 font-medium">Compression</th>
                </tr>
              </thead>
              <tbody>
                {FORMAT_COMPARISON.map((row) => (
                  <tr key={row.format} className="border-border border-b last:border-0">
                    <td className="font-readout p-3">{row.format}</td>
                    <td className="text-ink-muted p-3">{row.bestFor}</td>
                    <td className="text-ink-muted p-3">{row.transparency}</td>
                    <td className="text-ink-muted p-3">{row.compression}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="on-dark mt-24 w-full py-20">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <Eyebrow>Where people use it</Eyebrow>
            <h2 className="font-display mt-6 text-2xl font-bold sm:text-3xl">Common Uses</h2>
            <ul className="text-ink-muted mx-auto mt-6 grid max-w-xl gap-2 text-left text-sm sm:grid-cols-2">
              {COMMON_USES.map((use) => (
                <li key={use} className="flex gap-2">
                  <span className="text-primary">·</span>
                  {use}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-auto mt-24 w-full max-w-2xl px-6">
          <h2 className="font-display text-center text-2xl font-bold sm:text-3xl">
            Frequently Asked Questions
          </h2>
          <FaqAccordion items={FAQS} />
        </section>

        <section className="on-dark mt-24 w-full py-24">
          <div className="mx-auto max-w-2xl px-6 text-center">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              Ready to Optimize Your Images?
            </h2>
            <p className="text-ink-muted mt-3">
              Convert, compress and optimize your images in seconds with intelligent compression
              that automatically delivers the highest possible quality.
            </p>
            <a
              href="#tool"
              className="bg-primary text-primary-ink mt-6 inline-block rounded-full px-6 py-3 font-medium"
            >
              Upload Your Image
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
