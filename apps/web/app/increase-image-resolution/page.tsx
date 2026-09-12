import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { EnhancerTool } from "@/components/EnhancerTool";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Increase Image Resolution Online for Free – 2x & 4x",
  description:
    "Increase image resolution for free by upscaling pixel dimensions 2x or 4x with an AI model, plus a clear explanation of what resolution actually means and when increasing it helps.",
  alternates: { canonical: "/increase-image-resolution" },
  openGraph: {
    title: "Increase Image Resolution Online for Free – 2x & 4x",
    description:
      "Understand what image resolution actually means, and increase it for free with an AI-powered upscaler that runs entirely in your browser.",
  },
};

const STEPS = [
  { step: "01", title: "Upload your image", body: "JPG, PNG or WebP - processed locally, never uploaded." },
  { step: "02", title: "Pick 2x or 4x", body: "Choose how much larger you need the pixel dimensions to be." },
  { step: "03", title: "Download the result", body: "Compare with the slider, then save the higher-resolution PNG." },
];

const RESOLUTION_TABLE = [
  { term: "Pixel dimensions", meaning: "The image's actual width x height in pixels, e.g. 1920x1080. This is what determines file detail and what upscaling changes." },
  { term: "DPI / PPI", meaning: "Dots/pixels per inch - a print-specific setting describing how densely those pixels are packed onto a physical page. It doesn't add or remove pixels on its own." },
  { term: "Megapixels", meaning: "Width x height in millions of pixels - a single number often used to describe camera sensors, e.g. 12MP." },
  { term: "\"Low-res\" / \"Hi-res\"", meaning: "Informal terms for whether an image has enough pixels for its intended use - a photo can be \"low-res\" for a billboard but \"hi-res\" for a phone screen." },
];

const FAQS = [
  {
    question: "What does image resolution actually mean?",
    answer:
      "Most commonly, it refers to an image's pixel dimensions - its width and height measured in pixels, like 1920x1080. More pixels generally means more captured detail and the ability to display or print larger before quality visibly drops. It's a separate concept from DPI, which describes pixel density for printing rather than the pixel count itself.",
  },
  {
    question: "What's the difference between resolution and DPI?",
    answer:
      "Resolution (pixel dimensions) is the actual amount of image data - width times height in pixels. DPI (dots per inch) only matters for printing - it describes how tightly those existing pixels are packed onto the page. Changing an image's DPI metadata without changing its pixel dimensions doesn't add any detail; you need more actual pixels for that, which is what upscaling provides.",
  },
  {
    question: "Does increasing resolution improve image quality?",
    answer:
      "It can improve how an image looks when displayed or printed larger, since there are more pixels to work with - but only if those new pixels contain believable detail, which is exactly what AI upscaling aims to do. Simply resaving an image at a higher pixel count without real upscaling (or just changing DPI metadata) does nothing for quality.",
  },
  {
    question: "When does upscaling actually help?",
    answer:
      "It helps when you need an image to display or print larger than its current pixel dimensions comfortably allow - a small product photo that needs to fill a bigger space, an old low-resolution photo you want to display larger, or a source image that's simply smaller than the resolution you need.",
  },
  {
    question: "When doesn't upscaling help?",
    answer:
      "If an image is already at or above the resolution you need, upscaling adds nothing. And if the source is extremely low-quality or heavily compressed, upscaling can enlarge it but can't manufacture detail that was never captured - very poor sources stay recognizably low-quality even after upscaling, just at a larger size.",
  },
  {
    question: "How much can I increase resolution by?",
    answer:
      "This tool offers 2x (double the width and height) and 4x (quadruple both). 2x is more reliable on most images; 4x gives a much bigger increase but shows more clearly on lower-quality sources. Beyond 4x, results generally become less convincing regardless of tool, since the model is extrapolating further from the original data.",
  },
  {
    question: "Is increasing resolution the same as upscaling?",
    answer:
      "In practice, yes, when talking about pixel dimensions - upscaling is the process, increased resolution is the result. Some people also use \"resolution\" loosely to mean overall image quality, which upscaling can improve, but the technically precise meaning is pixel count.",
  },
  {
    question: "Is this free, and is my image uploaded anywhere?",
    answer:
      "Yes, it's free with no account required, and no - your image is processed entirely in your browser using a downloaded AI model. It's never sent to a server.",
  },
];

const webApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "cloudvertify Resolution Increaser",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any (web-based)",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "Free browser-based tool to increase image resolution by upscaling pixel dimensions 2x or 4x using an AI super-resolution model, entirely client-side.",
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
    { "@type": "ListItem", position: 2, name: "Increase Image Resolution", item: "/increase-image-resolution" },
  ],
};

export default function IncreaseImageResolutionPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="hero-dark">
        <div className="mx-auto max-w-3xl px-6 pt-16 pb-16 text-center">
          <div className="mb-6 flex justify-center">
            <Breadcrumb items={[{ label: "cloudvertify", href: "/" }, { label: "Increase Image Resolution" }]} />
          </div>
          <h1 className="font-display text-ink text-4xl font-semibold sm:text-5xl">
            Increase Image Resolution
          </h1>
          <p className="text-ink/70 mt-4">
            Increase an image&apos;s pixel dimensions by 2x or 4x for free, using an AI model that
            reconstructs detail rather than just stretching pixels - plus a clear explanation of what
            resolution actually means.
          </p>

          <div id="tool" className="on-light border-border bg-surface mt-10 rounded-2xl border p-6 text-left shadow-xl sm:p-8">
            <EnhancerTool defaultMode="2x" />
          </div>
        </div>
      </div>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center gap-4 px-6 py-16">
        <section className="mx-auto w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">What &quot;Image Resolution&quot; Actually Means</h2>
          <p className="text-ink-muted leading-relaxed">
            &quot;Resolution&quot; gets used loosely to mean overall image quality, but its precise
            technical meaning is an image&apos;s <strong>pixel dimensions</strong> - the width and height
            measured in pixels, such as 1920×1080. This number determines how much real detail an image
            contains and how large it can be displayed or printed before individual pixels become visible.
            A higher pixel count generally means a sharper result at larger sizes; a lower one means
            you&apos;ll see blockiness or softness sooner as you scale up.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Resolution Terminology, Explained</h2>
          <div className="border-border mt-4 overflow-x-auto rounded-xl border text-left">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-border border-b">
                  <th className="p-3 font-medium">Term</th>
                  <th className="p-3 font-medium">What it means</th>
                </tr>
              </thead>
              <tbody>
                {RESOLUTION_TABLE.map((row) => (
                  <tr key={row.term} className="border-border border-b last:border-0">
                    <td className="font-readout p-3 whitespace-nowrap">{row.term}</td>
                    <td className="text-ink-muted p-3">{row.meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Pixels, Width and Height</h2>
          <p className="text-ink-muted leading-relaxed">
            Every digital image is a grid of pixels, and its resolution is simply the size of that grid -
            width in pixels by height in pixels. A 4000×3000 photo has 12 million individual pixels
            (12 megapixels) of real captured detail. When that image is displayed or printed smaller than
            its native size, extra pixels are discarded and it looks sharp. When it&apos;s stretched
            larger than its native size without upscaling, the existing pixels simply get bigger and
            softer - which is the core problem this tool&apos;s AI upscaling addresses, by generating new,
            plausible pixels instead of just enlarging the existing ones.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">How to Increase Resolution</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
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
          <h2 className="font-display mb-4 text-xl">2× vs 4× Resolution Increase</h2>
          <p className="text-ink-muted leading-relaxed">
            Doubling resolution (2×) takes a 1000×750px image to 2000×1500px - four times the total pixel
            count, since both dimensions double. Quadrupling (4×) takes the same image to 4000×3000px -
            sixteen times the total pixel count. That&apos;s a much bigger ask of the AI model, which is
            why 4× results are more convincing on already-decent source images and can look slightly
            softer or less precise on small, blurry, or heavily compressed originals. If you&apos;re
            increasing resolution for a specific target size (a print dimension, a display width), work
            out which multiplier actually gets you there rather than defaulting to the largest option.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">When Increasing Resolution Helps - and When It Doesn&apos;t</h2>
          <p className="text-ink-muted leading-relaxed">
            Increasing resolution genuinely helps when your source image has fewer pixels than you need
            for its intended use - displaying it larger, printing it, or fitting it into a design that
            calls for higher-resolution assets. In those cases, AI upscaling adds real, plausible detail
            that a basic resize can&apos;t.
          </p>
          <p className="text-ink-muted mt-4 leading-relaxed">
            It doesn&apos;t help if the image is already at or above the resolution you need - upscaling
            an already-large image further adds nothing useful. It also has diminishing returns on very
            low-quality sources: a small, blurry, or heavily compressed original can be enlarged, but the
            AI model can only extrapolate so far before its reconstruction stops looking convincing. And
            it&apos;s worth remembering that increasing resolution changes pixel dimensions, not the
            physical sharpness of a genuinely out-of-focus shot beyond what enhancement can reconstruct -
            see our{" "}
            <Link href="/unblur-images" className="text-primary font-medium">
              unblur images
            </Link>{" "}
            page for more on that distinction.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Before and After</h2>
          <p className="text-ink-muted leading-relaxed">
            The slider above the tool shows your original image next to the higher-resolution result at
            the same display size, so you can judge the actual detail improvement rather than just seeing
            a bigger file. Look closely at edges, text, and fine texture - that&apos;s where the difference
            between a basic resize and real AI-based resolution increase shows up most clearly.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Supported Formats and Limitations</h2>
          <p className="text-ink-muted leading-relaxed">
            Upload JPG, PNG or WebP; the result downloads as a lossless PNG. Very large source images are
            automatically scaled down before processing to keep things fast and to avoid running out of
            browser memory - for the vast majority of photos this has no visible impact. As with any
            upscaling approach, the result is a well-informed reconstruction, not literal recovery of
            detail your camera never captured - it holds up very well on typical photos, less so on
            extremely degraded sources.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Frequently Asked Questions</h2>
          <FaqAccordion items={FAQS} />
        </section>

        <section className="mx-auto mt-8 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Related Tools</h2>
          <ul className="flex flex-wrap gap-2">
            <li>
              <Link href="/image-upscaler" className="conversion-pill px-4 py-1.5 text-sm">
                Image Upscaler
              </Link>
            </li>
            <li>
              <Link href="/image-enhancer" className="conversion-pill px-4 py-1.5 text-sm">
                Image Enhancer
              </Link>
            </li>
            <li>
              <Link href="/unblur-images" className="conversion-pill px-4 py-1.5 text-sm">
                Unblur Images
              </Link>
            </li>
            <li>
              <Link href="/responsive-image-generator" className="conversion-pill px-4 py-1.5 text-sm">
                Responsive Image Generator
              </Link>
            </li>
            <li>
              <Link href="/convert/png-to-avif" className="conversion-pill px-4 py-1.5 text-sm">
                Convert PNG to AVIF
              </Link>
            </li>
            <li>
              <Link href="/convert" className="conversion-pill px-4 py-1.5 text-sm">
                View all converters
              </Link>
            </li>
          </ul>
        </section>

        <section className="mx-auto mt-8 w-full max-w-2xl text-center">
          <h2 className="font-display mb-3 text-xl">Ready to increase your image&apos;s resolution?</h2>
          <p className="text-ink-muted mb-6 leading-relaxed">
            Scroll up, choose 2× or 4×, and see the result for yourself - free, with no account needed.
          </p>
          <Link href="#tool" className="bg-primary text-primary-ink inline-block rounded-full px-6 py-3 font-medium">
            Increase Resolution Now
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
