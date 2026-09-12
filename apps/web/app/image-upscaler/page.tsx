import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { EnhancerTool } from "@/components/EnhancerTool";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Free Image Upscaler – Enlarge Photos 2x & 4x Online",
  description:
    "Upscale images online for free. Enlarge photos to 2x or 4x their original size using an AI model that reconstructs detail instead of just stretching pixels - runs entirely in your browser.",
  alternates: { canonical: "/image-upscaler" },
  openGraph: {
    title: "Free Image Upscaler – Enlarge Photos 2x & 4x Online",
    description:
      "Enlarge an image to 2x or 4x its original dimensions for free, with an AI upscaler that reconstructs plausible detail instead of just stretching pixels.",
  },
};

const STEPS = [
  { step: "01", title: "Upload your image", body: "JPG, PNG or WebP - processed on your device, never uploaded." },
  { step: "02", title: "Choose 2× or 4×", body: "Pick how much larger you need the image to be." },
  { step: "03", title: "Compare and download", body: "Check the result against the original, then save it as a PNG." },
];

const USE_CASES = [
  { title: "Web and social media", body: "Enlarge a small product photo or thumbnail so it doesn't look pixelated when displayed larger than its original size." },
  { title: "Print", body: "Increase pixel dimensions before printing, since print output needs far more pixels than a screen to look sharp at the same physical size." },
  { title: "Presentations", body: "Blow up a small image or logo for a slide without it turning into a blurry, blocky mess." },
  { title: "Old or archived photos", body: "Enlarge scanned photos or old digital camera images that were captured at low resolution by today's standards." },
  { title: "Design and mockups", body: "Upscale a placeholder or reference image enough to work with in a design tool without visible pixelation." },
];

const COMPARISON_TABLE = [
  { aspect: "Output size", simple: "Same total detail, just stretched", ai: "New plausible detail added at the larger size" },
  { aspect: "Edges", simple: "Soft or blocky", ai: "Reconstructed to stay defined" },
  { aspect: "Best for", simple: "Very small, uniform enlargements", ai: "Noticeable enlargements where quality matters" },
  { aspect: "Speed", simple: "Instant", ai: "A few seconds - it's running a real model" },
];

const FAQS = [
  {
    question: "What does an image upscaler actually do?",
    answer:
      "It increases an image's pixel dimensions - width and height - beyond its original size. This tool does that using an AI super-resolution model, which predicts plausible new detail at the larger size rather than just stretching existing pixels the way a basic resize does.",
  },
  {
    question: "Should I upscale 2x or 4x?",
    answer:
      "2x is the safer default for most images - it asks the model to invent less new detail per pixel, so results look natural even on modest source photos. 4x produces a much larger image and looks excellent on good source material, but can look slightly synthetic up close on a small or heavily compressed original. If you're unsure, try 2x first.",
  },
  {
    question: "Will upscaling make my image look as good as if I'd taken it at that resolution originally?",
    answer:
      "Not exactly - the AI model reconstructs plausible detail based on patterns it learned from training photos, it doesn't recover the literal detail your camera would have captured at a higher resolution. On typical photos the difference is subtle, but it's not identical to a native high-resolution capture.",
  },
  {
    question: "Is this different from just resizing an image bigger in an editor?",
    answer:
      "Yes. Resizing in a typical editor uses interpolation - it fills in new pixels by averaging or blending nearby existing ones, which is fast but produces soft, sometimes blocky results at larger sizes. This tool runs an AI model trained specifically to reconstruct sharper, more plausible detail instead.",
  },
  {
    question: "How large an image can I upscale?",
    answer:
      "Very large source images are automatically scaled down before processing to keep things fast and avoid running out of browser memory. For typical photos - up to a few thousand pixels wide - this has no visible effect on the upscaled result.",
  },
  {
    question: "Does upscaling cost anything?",
    answer:
      "No - it's free, with no account, watermark, or usage limit. The AI model runs in your browser instead of on a paid server, so there's no per-image cost to charge for.",
  },
  {
    question: "Can I upscale a screenshot or a graphic, not just a photo?",
    answer:
      "Yes, though results are strongest on photographic content, since that's what the model was trained on. Flat graphics, text-heavy images and screenshots can still be upscaled, but very fine text may not stay perfectly crisp at 4x - test 2x first if the source is mostly text or line art.",
  },
  {
    question: "Is my image uploaded anywhere when I upscale it?",
    answer:
      "No. The AI model downloads to your browser once and every upscale runs locally after that - your image is never sent to a server.",
  },
];

const webApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "cloudvertify Image Upscaler",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any (web-based)",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "Free browser-based AI image upscaler. Enlarges images 2x or 4x using an ESRGAN super-resolution model that reconstructs detail instead of interpolating pixels, running entirely client-side.",
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
    { "@type": "ListItem", position: 2, name: "Image Upscaler", item: "/image-upscaler" },
  ],
};

export default function ImageUpscalerPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="hero-dark">
        <div className="mx-auto max-w-3xl px-6 pt-16 pb-16 text-center">
          <div className="mb-6 flex justify-center">
            <Breadcrumb items={[{ label: "cloudvertify", href: "/" }, { label: "Image Upscaler" }]} />
          </div>
          <h1 className="font-display text-ink text-4xl font-semibold sm:text-5xl">Free Image Upscaler</h1>
          <p className="text-ink/70 mt-4">
            Enlarge an image to 2x or 4x its original dimensions for free. This image upscaler uses an AI
            model to reconstruct plausible detail at the larger size, instead of just stretching pixels
            the way a basic resize does - and it runs entirely in your browser.
          </p>

          <div id="tool" className="on-light border-border bg-surface mt-10 rounded-2xl border p-6 text-left shadow-xl sm:p-8">
            <EnhancerTool defaultMode="2x" />
          </div>
        </div>
      </div>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center gap-4 px-6 py-16">
        <section className="mx-auto w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Enlarge Images Without the Usual Quality Loss</h2>
          <p className="text-ink-muted leading-relaxed">
            Stretching a small image bigger has always meant a tradeoff: the larger it gets, the softer
            and blockier it looks, because a basic resize only has the original pixels to work with - it
            can blend them together, but it can&apos;t invent anything new. This upscaler takes a
            different approach. It runs an AI super-resolution model that&apos;s been trained on millions
            of real photos to recognize what sharp edges, textures and fine detail typically look like,
            then uses that knowledge to reconstruct a larger version that holds up far better than simple
            stretching.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">How to Upscale an Image</h2>
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
          <h2 className="font-display mb-4 text-xl">2× vs 4×: Which Should You Choose?</h2>
          <p className="text-ink-muted leading-relaxed">
            <strong>2×</strong> doubles both width and height - a 500×400px image becomes 1000×800px. It
            asks the model to invent comparatively little new detail per pixel, so it&apos;s the more
            forgiving choice and tends to look natural even on modest source photos.
          </p>
          <p className="text-ink-muted mt-4 leading-relaxed">
            <strong>4×</strong> quadruples both dimensions - that same 500×400px image becomes
            2000×1600px. It&apos;s the better choice when you specifically need the larger size (printing,
            a large display, a hero image), but because there&apos;s more room for the model&apos;s
            reconstruction to show, results are most convincing on already-decent source photos. On a
            small, blurry or heavily compressed image, 4x can start to look slightly synthetic up close.
          </p>
          <div className="border-border mt-6 overflow-x-auto rounded-xl border text-left">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-border border-b">
                  <th className="p-3 font-medium"> </th>
                  <th className="p-3 font-medium">Basic resize</th>
                  <th className="p-3 font-medium">AI upscaling</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_TABLE.map((row) => (
                  <tr key={row.aspect} className="border-border border-b last:border-0">
                    <td className="p-3 font-medium">{row.aspect}</td>
                    <td className="text-ink-muted p-3">{row.simple}</td>
                    <td className="text-ink-muted p-3">{row.ai}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Increasing Dimensions While Maintaining Detail</h2>
          <p className="text-ink-muted leading-relaxed">
            The core challenge with any upscaler is that enlarging an image means creating pixels that
            didn&apos;t exist in the source. A basic resize solves this with interpolation - essentially
            averaging nearby pixels - which is fast but produces blur at any significant enlargement. This
            tool&apos;s AI model instead draws on patterns learned from a large dataset of real images:
            it recognizes that certain arrangements of pixels typically correspond to sharp edges,
            textures like hair or fabric, or fine structure, and reconstructs the enlarged version
            accordingly. The result is detail that looks plausible and sharp, even though - to be precise
            - it&apos;s a well-informed reconstruction rather than the literal information a
            higher-resolution camera would have captured.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Common Use Cases</h2>
          <div className="mt-4 flex flex-col gap-4">
            {USE_CASES.map((useCase) => (
              <div key={useCase.title}>
                <h3 className="font-medium">{useCase.title}</h3>
                <p className="text-ink-muted mt-1 text-sm leading-relaxed">{useCase.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Supported Formats</h2>
          <p className="text-ink-muted leading-relaxed">
            Upload JPG, PNG or WebP. The upscaled result downloads as a PNG, preserving full quality
            without adding further compression on top of the model&apos;s output. Need it in a different
            format afterward? Use cloudvertify&apos;s{" "}
            <Link href="/convert/jpg-to-webp" className="text-primary font-medium">
              JPG to WebP converter
            </Link>{" "}
            or{" "}
            <Link href="/convert/jpg-to-avif" className="text-primary font-medium">
              JPG to AVIF converter
            </Link>{" "}
            to compress it back down for the web.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Realistic Limitations</h2>
          <p className="text-ink-muted leading-relaxed">
            AI upscaling is genuinely better than a basic resize, but it&apos;s not magic. It can&apos;t
            recover detail that was never captured - a heavily pixelated or extremely low-resolution
            source has less real information to work from, and the model can only extrapolate so far
            before its guesses stop looking convincing. Very fine, precise detail (small text, intricate
            patterns) can occasionally come out slightly different from the true original, especially at
            4x. For most everyday photos, though, the improvement over simple stretching is substantial
            and immediately visible in the before/after comparison.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Tips for Better Upscaling Results</h2>
          <ul className="text-ink-muted flex flex-col gap-2 text-sm leading-relaxed">
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              Start from the best-quality version of the image you have - upscaling a screenshot of a
              photo will always look worse than upscaling the original file.
            </li>
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              Try 2x before 4x if you&apos;re not sure how much enlargement you actually need - it&apos;s faster and
              more forgiving on lower-quality sources.
            </li>
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              Judge the result at full size, not in a small preview - open the downloaded file and zoom in
              on the areas that matter most.
            </li>
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              If a photo is soft as well as small, consider running it through{" "}
              <Link href="/image-enhancer" className="text-primary font-medium">
                Enhance Quality
              </Link>{" "}
              first, since sharper input generally upscales more cleanly.
            </li>
          </ul>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Frequently Asked Questions</h2>
          <FaqAccordion items={FAQS} />
        </section>

        <section className="mx-auto mt-8 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Related Tools</h2>
          <ul className="flex flex-wrap gap-2">
            <li>
              <Link href="/image-enhancer" className="conversion-pill px-4 py-1.5 text-sm">
                Image Enhancer
              </Link>
            </li>
            <li>
              <Link href="/increase-image-resolution" className="conversion-pill px-4 py-1.5 text-sm">
                Increase Image Resolution
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
              <Link href="/convert/png-to-webp" className="conversion-pill px-4 py-1.5 text-sm">
                Convert PNG to WebP
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
          <h2 className="font-display mb-3 text-xl">Ready to enlarge your image?</h2>
          <p className="text-ink-muted mb-6 leading-relaxed">
            Scroll up, upload a photo, and see 2x or 4x upscaling in action - free, with no account
            needed.
          </p>
          <Link href="#tool" className="bg-primary text-primary-ink inline-block rounded-full px-6 py-3 font-medium">
            Use the Image Upscaler
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
