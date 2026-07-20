import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SvgOptimizerToolClient } from "@/components/SvgOptimizerToolClient";

export const metadata: Metadata = {
  title: "SVG Optimizer – Optimize & Minify SVG Online",
  description:
    "Optimize and minify SVG files online for free. This SVG optimizer removes metadata, comments, hidden elements and excess precision to reduce SVG file size - typically by 20-60% - entirely in your browser.",
  alternates: { canonical: "/svg-optimizer" },
  openGraph: {
    title: "SVG Optimizer – Optimize & Minify SVG Online",
    description:
      "Free online SVG optimizer and cleaner - minify and compress SVG files entirely in your browser, no upload required.",
  },
};

const BENEFITS = [
  {
    title: "Faster page loads",
    body: "Smaller SVGs download and parse faster, which adds up fast when a page ships dozens of icons.",
  },
  {
    title: "Lower bandwidth costs",
    body: "Less data transferred per page view - it matters once you multiply it across real traffic.",
  },
  {
    title: "Cleaner, readable code",
    body: "Optimized markup is easier to inline, hand-edit, or review in a diff without wading through editor cruft.",
  },
  {
    title: "Better Core Web Vitals",
    body: "Smaller assets help pages hit the performance budgets that factor into search ranking.",
  },
  {
    title: "No visual quality loss",
    body: "Optimization only removes bytes the browser never rendered - the artwork itself doesn't change.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Upload your SVG",
    body: "Drag and drop or choose a file. Nothing leaves your browser - there's no server involved.",
  },
  {
    step: "02",
    title: "Review the results",
    body: "Compare the original and optimized SVG side by side and check the size reduction and details.",
  },
  {
    step: "03",
    title: "Download or copy",
    body: "Grab the optimized file, or copy the minified markup straight into your codebase.",
  },
];

const COMPARISON_ROWS = [
  { aspect: "Comments & metadata", plain: "Often included from design tools", optimized: "Removed" },
  { aspect: "Editor namespaces & IDs", plain: "Long, editor-generated, often unused", optimized: "Cleaned up or removed" },
  { aspect: "Decimal precision", plain: "Sometimes 6+ decimal places", optimized: "Rounded to a sane precision" },
  { aspect: "File size", plain: "Larger", optimized: "Typically 20-60% smaller" },
  { aspect: "Visual output", plain: "Original artwork", optimized: "Identical" },
  { aspect: "Readability", plain: "Cluttered with editor cruft", optimized: "Clean, minified markup" },
];

const FAQS = [
  {
    question: "What is an SVG Optimizer?",
    answer:
      "An SVG optimizer is a tool that cleans up an SVG file's underlying XML markup - removing unnecessary code like metadata, comments, excessive decimal precision, and hidden elements - without changing how the image looks. Typical savings run about 20-60% off the original file size, entirely from stripping bytes the browser never needed to render the image.",
  },
  {
    question: "Does SVG optimization affect SEO?",
    answer:
      "Indirectly, yes - in a good way. Smaller SVG files mean faster page loads, which is a ranking factor, especially on image-heavy pages. Optimizing also won't strip any accessible text you've added, like <title> elements, so it doesn't remove SEO-relevant content from the image itself.",
  },
  {
    question: "How does SVG optimization work?",
    answer:
      "The optimizer parses your SVG into a tree structure, then runs it through a series of safe transformations: removing comments and metadata, deleting hidden or empty elements, cleaning up unused IDs, rounding numeric precision, merging redundant styles, and simplifying path data - then serializes the result back into compact markup. Running multiple passes catches optimizations that only become possible after an earlier pass runs.",
  },
  {
    question: "What are the downsides of SVG?",
    answer:
      "SVG isn't a great fit for photographic images - it's built for vector shapes, not pixel-by-pixel detail, so a photo saved as SVG is usually far larger than the same photo as a JPG or WebP. Complex SVGs with many paths or filters can also be slower to render than a raster image, and unoptimized SVGs exported from design tools often carry a lot of unnecessary bloat.",
  },
  {
    question: "Why is my SVG file distorted?",
    answer:
      "This is almost always a missing or incorrect viewBox attribute, or a width/height that doesn't match the artwork's actual aspect ratio. Optimizing an SVG won't distort it - the optimizer preserves the viewBox and coordinate system - but if the original file already had a mismatched viewBox, that same issue carries through to the optimized version.",
  },
  {
    question: "What is the difference between a plain SVG and an optimized SVG?",
    answer:
      "A plain SVG exported from a design tool typically includes metadata, comments, editor-specific namespaces, unused IDs and long decimal coordinates that add bytes without affecting what you see. An optimized SVG keeps the exact same visual output while stripping all of that - it's the same image, just leaner markup.",
  },
  {
    question: "Is SVG better than PNG?",
    answer:
      "For icons, logos and flat illustrations, yes - SVG scales to any size with no quality loss and is usually smaller than an equivalent PNG. For photos or anything with complex gradients and fine detail, PNG (or better, WebP or AVIF) is the better choice, since SVG has to describe every shape as vector data rather than compress pixel values.",
  },
  {
    question: "Can I optimize SVG files without losing quality?",
    answer:
      "Yes - that's the entire point of SVG optimization. It removes code the browser doesn't render, like metadata, comments and hidden elements, and simplifies precision in ways too small to see, but it doesn't touch the actual visible shapes, colors or layout. The optimized file looks identical to the original.",
  },
  {
    question: "Is SVG optimization safe?",
    answer:
      "Yes. This tool uses SVGO's default preset, which is designed specifically to be visually lossless - it only removes data that doesn't affect rendering. As with any automated tool, it's worth a quick visual check afterward, which is exactly what the before/after comparison above is for, especially for SVGs with unusual features like embedded scripts or complex filters.",
  },
  {
    question: "Is this SVG Optimizer free?",
    answer:
      "Yes - this is a completely free SVG optimizer. It works entirely in your browser and doesn't require an account, a file upload, or any software installation.",
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
    { "@type": "ListItem", position: 1, name: "ImageConvert", item: "/" },
    { "@type": "ListItem", position: 2, name: "Tools", item: "/convert" },
    { "@type": "ListItem", position: 3, name: "SVG Optimizer", item: "/svg-optimizer" },
  ],
};

export default function SvgOptimizerPage() {
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
        <Header />
        <div className="mx-auto max-w-3xl px-6 pt-2 pb-16 text-center">
          <div className="mb-6 flex justify-center">
            <Breadcrumb
              items={[
                { label: "ImageConvert", href: "/" },
                { label: "Tools", href: "/convert" },
                { label: "SVG Optimizer" },
              ]}
            />
          </div>
          <h1 className="font-display text-ink text-4xl font-semibold sm:text-5xl">
            SVG Optimizer
          </h1>
          <p className="text-ink/70 mt-4">
            Optimize and minify SVG files online for free. This SVG optimizer and cleaner
            removes metadata, comments, hidden elements and excess precision to reduce SVG file
            size - typically by 20-60% - entirely in your browser, nothing uploaded.
          </p>

          <div className="on-light border-border bg-surface mt-10 rounded-2xl border p-6 text-left shadow-xl sm:p-8">
            <SvgOptimizerToolClient />
          </div>
        </div>
      </div>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center gap-4 px-6 py-16">
        <section className="mx-auto w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">What is SVG Optimization?</h2>
          <p className="text-ink-muted leading-relaxed">
            SVG optimization is the process of cleaning up an SVG file&apos;s underlying XML
            markup without changing how it looks. Design tools like Illustrator, Figma and Sketch
            export SVGs full of extras your browser never needs - editor metadata, comments,
            hidden layers, unused IDs, and coordinates carried out to a dozen decimal places. An
            SVG optimizer strips all of that out, leaving a smaller, cleaner file that renders
            identically.
          </p>
          <p className="text-ink-muted mt-4 leading-relaxed">
            Some people call this compressing an SVG, minifying an SVG, or running it through an
            SVG cleaner - they&apos;re all describing the same process. This online SVG optimizer
            uses SVGO, the open-source optimizer that powers most build tools and image CDNs,
            running entirely in your browser rather than on a server.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Benefits of Optimizing SVG Files</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {BENEFITS.map((item) => (
              <div key={item.title} className="border-border bg-surface rounded-xl border p-5 text-left">
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-ink-muted mt-2 text-sm">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">How SVG Optimization Works</h2>
          <p className="text-ink-muted leading-relaxed">
            The optimizer parses your SVG into a tree structure, then runs a sequence of safe,
            targeted transformations over it: stripping comments, metadata and editor-specific
            namespaces; deleting hidden or empty elements; cleaning up unused IDs; rounding
            numeric values and simplifying path data to a sane precision; and merging redundant
            styles and groups. The cleaned-up tree is then serialized back into compact SVG
            markup. Running multiple passes catches optimizations that only become possible once
            an earlier pass has already run.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">How to Optimize an SVG</h2>
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
          <h2 className="font-display mb-4 text-xl">Best Practices for Using SVG on Websites</h2>
          <ul className="text-ink-muted flex flex-col gap-2 text-sm leading-relaxed">
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              Always include a viewBox so the SVG scales cleanly at any size, on any screen.
            </li>
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              Optimize before you ship, not after - run icons and illustrations through an
              optimizer as a normal step in your export workflow.
            </li>
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              Inline small, critical, above-the-fold SVGs directly in HTML; reference larger ones
              with an &lt;img&gt; tag or a sprite so browsers can cache them.
            </li>
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              Add a &lt;title&gt; element for accessibility if the SVG conveys meaning, or mark it
              aria-hidden=&quot;true&quot; if it&apos;s purely decorative.
            </li>
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              This optimizer preserves &lt;title&gt; elements by default, so an accessible SVG
              stays accessible after optimizing.
            </li>
          </ul>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">SVG vs Optimized SVG</h2>
          <div className="border-border overflow-x-auto rounded-xl border text-left">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-border border-b">
                  <th className="p-3 font-medium">Aspect</th>
                  <th className="p-3 font-medium">Plain SVG</th>
                  <th className="p-3 font-medium">Optimized SVG</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.aspect} className="border-border border-b last:border-0">
                    <td className="p-3 font-medium">{row.aspect}</td>
                    <td className="text-ink-muted p-3">{row.plain}</td>
                    <td className="text-ink-muted p-3">{row.optimized}</td>
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
