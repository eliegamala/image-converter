import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Footer } from "@/components/Footer";
import { ResponsiveImageGeneratorTool } from "@/components/ResponsiveImageGeneratorTool";

export const metadata: Metadata = {
  title: "Responsive Image Generator – Generate srcset & Picture HTML Online",
  description:
    "Generate responsive images online for free. This responsive image generator resizes one image into every common breakpoint, converts it to AVIF and WebP with an optional JPG fallback, and writes the complete srcset and <picture> HTML - entirely in your browser.",
  alternates: { canonical: "/responsive-image-generator" },
  openGraph: {
    title: "Responsive Image Generator – Generate srcset & Picture HTML Online",
    description:
      "Free online responsive image generator and srcset generator - AVIF, WebP and JPG at every breakpoint, with production-ready picture element HTML.",
  },
};

const STEPS = [
  {
    step: "01",
    title: "Upload your image",
    body: "The largest version you have, in PNG, JPG, WebP, AVIF or SVG.",
  },
  {
    step: "02",
    title: "Choose your formats",
    body: "AVIF and WebP are generated automatically; toggle a JPG fallback on or off.",
  },
  {
    step: "03",
    title: "Copy or download",
    body: "Grab the generated <picture> HTML, or download every image as a ZIP.",
  },
];

const FORMAT_TABLE = [
  { format: "JPG", compression: "Good", transparency: "No", support: "Universal", bestFor: "The safety-net fallback" },
  { format: "WebP", compression: "Better - ~25-35% smaller than JPG", transparency: "Yes", support: "Excellent, all modern browsers", bestFor: "The default modern choice" },
  { format: "AVIF", compression: "Best - ~50% smaller than JPG", transparency: "Yes", support: "Very good, growing", bestFor: "Maximum compression where support allows" },
];

const FAQS = [
  {
    question: "Do I need to manually resize every image?",
    answer:
      "No - upload one high-quality image and the tool generates all the required sizes automatically, from 320px up to 1920px, skipping any breakpoint larger than your source so nothing gets upscaled.",
  },
  {
    question: "Will image compression reduce quality?",
    answer:
      "The tool finds a sensible balance between quality and file size for each format - AVIF and WebP achieve much smaller files than JPG at a visual quality that's very close to the original, using quality settings tuned for each format rather than one setting applied everywhere. At normal viewing sizes, the difference is rarely visible.",
  },
  {
    question: "Are my images uploaded to a server?",
    answer:
      "No - all processing happens locally in your browser, using the Canvas API and a WebAssembly encoder for AVIF. Your image is never uploaded anywhere, which is both faster and more private.",
  },
  {
    question: "What is the difference between srcset and <picture>?",
    answer:
      "srcset is used for serving different resolutions of the same image - the browser picks the best size for the visitor's screen. <picture> is used when serving different image formats, like AVIF vs WebP vs JPG, or different crops for art direction, wrapping multiple <source> elements that the browser evaluates in order.",
  },
  {
    question: "What are image breakpoints?",
    answer:
      "Breakpoints are the specific screen widths a responsive image is generated for - this tool uses 320, 480, 640, 768, 1024, 1280, 1440 and 1920 pixels, covering everything from small phones to large desktop monitors, so the browser always has a well-matched size to choose from.",
  },
  {
    question: "Which image format is best for websites?",
    answer:
      "For most websites, WebP is the safest modern default - excellent compression with support in every current browser. AVIF compresses even further where it's supported. Keep a JPG (or PNG, for graphics that need transparency in older contexts) as a fallback for anything that doesn't support either.",
  },
  {
    question: "Should I use AVIF or WebP?",
    answer:
      "Use both - that's exactly what this tool's generated <picture> markup does. Browsers that support AVIF get the smallest possible file; everything else falls back to WebP. You get AVIF's extra savings without dropping support for anyone.",
  },
  {
    question: "How many image sizes should I generate?",
    answer:
      "Enough to cover your smallest and largest real layouts without huge gaps between them. The eight breakpoints this tool generates - 320 to 1920px - work well for most sites; if your image never displays larger than around 800px, the smaller sizes in that set are the ones that actually get used.",
  },
  {
    question: "Does this improve Core Web Vitals?",
    answer:
      "Yes, primarily Largest Contentful Paint (LCP) - serving a correctly-sized, well-compressed image instead of one oversized file for every visitor is one of the most reliable ways to speed up how quickly your main content appears. Including width and height attributes, which the generated HTML does, also helps prevent Cumulative Layout Shift (CLS).",
  },
  {
    question: "Can I use these images in WordPress, Next.js, React, or HTML?",
    answer:
      "Yes - the generated files are plain PNG, WebP, AVIF and JPG images, and the generated markup is plain HTML, so they work anywhere: paste the <picture> tag directly into an HTML page or WordPress template, adapt it to JSX for React, or use it in a Next.js page outside of the built-in next/image component, which handles resizing differently.",
  },
  {
    question: "What does the sizes attribute do?",
    answer:
      "It tells the browser how wide the image will actually be displayed at different viewport widths - for example, (max-width: 768px) 100vw, 50vw. The browser combines that with the visitor's screen size and pixel density to pick the best candidate from srcset before it downloads anything, so getting it right matters for performance.",
  },
  {
    question: "Why is responsive imaging important for mobile devices?",
    answer:
      "Mobile devices often have smaller screens, slower connections, and metered data - sending them the same multi-megabyte image meant for a 4K desktop wastes their bandwidth and slows down every page. Responsive images make sure a phone downloads a phone-sized file.",
  },
  {
    question: "Is this Responsive Image Generator free?",
    answer:
      "Yes - this is a completely free responsive image generator. It works entirely in your browser and doesn't require an account or any software installation.",
  },
  {
    question: "Are my uploaded images private?",
    answer:
      "Yes. Every resize and format conversion happens directly in your browser - your image is never uploaded to a server, so it stays entirely on your device.",
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
    { "@type": "ListItem", position: 3, name: "Responsive Image Generator", item: "/responsive-image-generator" },
  ],
};

export default function ResponsiveImageGeneratorPage() {
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
                { label: "Responsive Image Generator" },
              ]}
            />
          </div>
          <h1 className="font-display text-ink text-4xl font-semibold sm:text-5xl">
            Responsive Image Generator
          </h1>
          <p className="text-ink/70 mt-4">
            Generate responsive images in seconds. This free responsive image generator and
            srcset generator resizes one image into every common breakpoint, converts it to AVIF
            and WebP with an optional JPG fallback, and writes the complete &lt;picture&gt; HTML -
            entirely in your browser.
          </p>

          <div className="on-light border-border bg-surface mt-10 rounded-2xl border p-6 text-left shadow-xl sm:p-8">
            <ResponsiveImageGeneratorTool />
          </div>
        </div>
      </div>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center gap-4 px-6 py-16">
        <section className="mx-auto w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">What is a Responsive Image Generator?</h2>
          <p className="text-ink-muted leading-relaxed">
            This responsive image tool - also called a picture element generator or srcset
            generator - creates multiple optimized versions of one image and generates the
            responsive image HTML needed for modern, performant websites. Instead of shipping one
            large image to every visitor regardless of their screen size, the browser picks the
            smallest file that still looks sharp on their device.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">How Responsive Images Work</h2>
          <p className="text-ink-muted leading-relaxed">
            Responsive images rely on three things working together: a set of image breakpoints
            (common screen widths, from 320px for small phones up to 1920px for large desktops),
            optimized versions of the image generated at each of those widths in modern formats,
            and HTML - the srcset, sizes and &lt;picture&gt; markup - that describes the available
            options so the browser can choose. This tool handles all three: it resizes your image
            to each breakpoint, encodes it in AVIF, WebP and optionally JPG, and writes out the
            exact HTML to drop into your page.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Why Responsive Images Improve Website Performance</h2>
          <ul className="text-ink-muted flex flex-col gap-2 text-sm leading-relaxed">
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              A visitor on a small phone downloads a 320px image, not the same multi-megabyte file
              a 4K desktop gets.
            </li>
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              Modern formats like AVIF and WebP are dramatically smaller than JPG or PNG at
              equivalent visual quality.
            </li>
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              Faster image loads mean faster Largest Contentful Paint (LCP), a real Core Web
              Vitals metric.
            </li>
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              Less bandwidth for visitors on mobile data, and lower hosting or CDN transfer costs
              for you.
            </li>
          </ul>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">How to Generate Responsive Images</h2>
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
          <h2 className="font-display mb-4 text-xl">Best Practices for Responsive Images</h2>
          <ul className="text-ink-muted flex flex-col gap-2 text-sm leading-relaxed">
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              Always include a JPG or WebP fallback for browsers or tools that don&apos;t support
              AVIF.
            </li>
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              Set the sizes attribute to match your actual CSS layout, not just a flat 100vw - it
              directly affects which image the browser downloads.
            </li>
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              Include width and height on your &lt;img&gt; to prevent layout shift while it loads.
            </li>
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              Don&apos;t generate breakpoints larger than your source image - upscaling only
              wastes bytes without adding real detail (this tool skips them automatically).
            </li>
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              Use loading=&quot;lazy&quot; for images below the fold, so the browser doesn&apos;t
              fetch them until they&apos;re needed.
            </li>
          </ul>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">srcset vs &lt;picture&gt;</h2>
          <p className="text-ink-muted leading-relaxed">
            srcset is for serving different resolutions of the same image and format - the
            browser picks the best-sized file for the visitor&apos;s screen and pixel density
            from a list you provide, paired with a sizes attribute that tells it how the image
            will actually be laid out.
          </p>
          <p className="text-ink-muted mt-4 leading-relaxed">
            &lt;picture&gt; goes a step further: it lets you offer entirely different image
            formats - AVIF, then WebP, then a JPG fallback - or even different crops for art
            direction, like a tighter crop on mobile and a wider one on desktop. Inside each
            &lt;source&gt;, you still use srcset for resolution switching; &lt;picture&gt; is what
            adds format and art-direction switching on top.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">JPG vs WebP vs AVIF</h2>
          <div className="border-border mt-6 overflow-x-auto rounded-xl border text-left">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-border border-b">
                  <th className="p-3 font-medium">Format</th>
                  <th className="p-3 font-medium">Compression</th>
                  <th className="p-3 font-medium">Transparency</th>
                  <th className="p-3 font-medium">Browser support</th>
                  <th className="p-3 font-medium">Best for</th>
                </tr>
              </thead>
              <tbody>
                {FORMAT_TABLE.map((row) => (
                  <tr key={row.format} className="border-border border-b last:border-0">
                    <td className="font-readout p-3">{row.format}</td>
                    <td className="text-ink-muted p-3">{row.compression}</td>
                    <td className="text-ink-muted p-3">{row.transparency}</td>
                    <td className="text-ink-muted p-3">{row.support}</td>
                    <td className="text-ink-muted p-3">{row.bestFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
              <Link href="/favicon-generator" className="conversion-pill px-4 py-1.5 text-sm">
                Favicon Generator
              </Link>
            </li>
            <li>
              <Link href="/svg-optimizer" className="conversion-pill px-4 py-1.5 text-sm">
                SVG Optimizer
              </Link>
            </li>
            <li>
              <Link href="/svg-to-png" className="conversion-pill px-4 py-1.5 text-sm">
                Convert SVG to PNG
              </Link>
            </li>
            <li>
              <Link href="/image-to-base64" className="conversion-pill px-4 py-1.5 text-sm">
                Image to Base64 Converter
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
