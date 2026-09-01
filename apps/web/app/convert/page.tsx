import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Footer } from "@/components/Footer";
import { CONVERSIONS } from "@/content/conversions";

export const metadata: Metadata = {
  title: "All Image Converters",
  description:
    "Every image conversion supported by cloudvertify - JPG, PNG, WebP, AVIF and HEIC, converted between each other with automatic quality optimization.",
  alternates: { canonical: "/convert" },
};

export default function AllConvertersPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="hero-dark">
        <div className="mx-auto max-w-3xl px-6 pt-16 pb-16 text-center">
          <div className="mb-6 flex justify-center">
            <Breadcrumb items={[{ label: "cloudvertify", href: "/" }, { label: "Tools" }]} />
          </div>
          <h1 className="font-display text-ink text-4xl font-semibold sm:text-5xl">
            All Image Converters
          </h1>
          <p className="text-ink/70 mt-4">
            Every conversion pair supported by cloudvertify. Each one runs the same intelligent
            optimization engine - automatic quality search, optional target file size, and no
            image ever stored.
          </p>
        </div>
      </div>

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center px-6 py-16 text-center">
        <ul className="grid w-full max-w-2xl gap-2 sm:grid-cols-2">
          {CONVERSIONS.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/convert/${c.slug}`}
                className="conversion-pill border-border bg-surface block rounded-lg border px-4 py-3 text-left text-sm"
              >
                {c.fromLabel} to {c.toLabel}
              </Link>
            </li>
          ))}
        </ul>

        <h2 className="font-display mt-16 text-xl font-bold">Other Tools</h2>
        <p className="text-ink-muted mt-2">Beyond format-to-format conversion.</p>
        <ul className="mt-6 grid w-full max-w-2xl gap-2 sm:grid-cols-2">
          <li>
            <Link
              href="/svg-to-png"
              className="conversion-pill border-border bg-surface block rounded-lg border px-4 py-3 text-left text-sm"
            >
              SVG to PNG Converter - custom size, scale &amp; background
            </Link>
          </li>
          <li>
            <Link
              href="/png-to-svg"
              className="conversion-pill border-border bg-surface block rounded-lg border px-4 py-3 text-left text-sm"
            >
              PNG to SVG Converter - real vectorization
            </Link>
          </li>
          <li>
            <Link
              href="/image-to-base64"
              className="conversion-pill border-border bg-surface block rounded-lg border px-4 py-3 text-left text-sm"
            >
              Image to Base64 Converter - copy, data URI &amp; download
            </Link>
          </li>
          <li>
            <Link
              href="/base64-to-image"
              className="conversion-pill border-border bg-surface block rounded-lg border px-4 py-3 text-left text-sm"
            >
              Base64 to Image Converter - decode &amp; convert
            </Link>
          </li>
          <li>
            <Link
              href="/svg-optimizer"
              className="conversion-pill border-border bg-surface block rounded-lg border px-4 py-3 text-left text-sm"
            >
              SVG Optimizer - minify &amp; clean up SVG markup
            </Link>
          </li>
          <li>
            <Link
              href="/favicon-generator"
              className="conversion-pill border-border bg-surface block rounded-lg border px-4 py-3 text-left text-sm"
            >
              Favicon Generator - full favicon.ico &amp; PWA icon package
            </Link>
          </li>
          <li>
            <Link
              href="/responsive-image-generator"
              className="conversion-pill border-border bg-surface block rounded-lg border px-4 py-3 text-left text-sm"
            >
              Responsive Image Generator - srcset &amp; picture HTML
            </Link>
          </li>
          <li>
            <Link
              href="/resize-image-to-100kb"
              className="conversion-pill border-border bg-surface block rounded-lg border px-4 py-3 text-left text-sm"
            >
              Resize Image to 100KB - passport photos &amp; government forms
            </Link>
          </li>
        </ul>
      </main>
      <Footer />
    </div>
  );
}
