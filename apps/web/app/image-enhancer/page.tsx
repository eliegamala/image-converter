import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { EnhancerTool } from "@/components/EnhancerTool";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Free Image Enhancer – Improve Photo Quality Online",
  description:
    "Enhance image quality online for free. Sharpen details, reduce blur and upscale photos up to 4x using an AI model that runs entirely in your browser - no upload, no account, no cost.",
  alternates: { canonical: "/image-enhancer" },
  openGraph: {
    title: "Free Image Enhancer – Improve Photo Quality Online",
    description:
      "Improve image quality, sharpen details and upscale photos up to 4x for free - a real AI enhancement model that runs in your browser, not on a server.",
  },
};

const STEPS = [
  {
    step: "01",
    title: "Upload your photo",
    body: "Drop in a JPG, PNG or WebP image. It's processed on your device - nothing is uploaded anywhere.",
  },
  {
    step: "02",
    title: "Pick an enhancement",
    body: "Enhance Quality for a same-size sharpen, or Upscale 2× / 4× to enlarge dimensions.",
  },
  {
    step: "03",
    title: "Compare and download",
    body: "Drag the before/after slider to see the difference, then download the result as a PNG.",
  },
];

const USE_CASES = [
  "Sharpening a slightly soft phone photo before posting it online",
  "Upscaling a small product photo so it doesn't look pixelated on a website",
  "Enlarging an old, low-resolution image for a print or a presentation slide",
  "Cleaning up a screenshot or scanned image before sharing it",
  "Preparing a profile picture or thumbnail that needs to look sharp at a larger size",
];

const TIPS = [
  "Start from the highest-quality version of the image you have - enhancement works with the detail that's already there, it can't pull detail from a version that was compressed or resized down first.",
  "If a photo is only slightly soft, try Enhance Quality before jumping to an upscale - it often gives a cleaner result than upscaling and then shrinking back down.",
  "For very small or heavily compressed source images, 2× usually looks more natural than 4× - more aggressive upscaling has more room to introduce artifacts.",
  "Use the before/after slider at 100% zoom (open the downloaded file) to judge results - a small preview can hide both problems and improvements.",
  "If the result looks over-smoothed on a very detailed photo, the source likely didn't have enough real detail for the model to reconstruct - that's a limitation of the source image, not a setting to fix.",
];

const FAQS = [
  {
    question: "Is this image enhancer really free?",
    answer:
      "Yes. There's no free trial, watermark, or hidden paid tier - every enhancement runs using an open-source AI model loaded directly in your browser, so there's no per-image cost to pass on. You can use it as many times as you like without an account.",
  },
  {
    question: "Does this actually use AI, or is it just a sharpening filter?",
    answer:
      "It uses a real trained neural network - an ESRGAN-family super-resolution model - not a basic sharpen or contrast filter. It's the same class of model used by dedicated upscaling apps, running via TensorFlow.js instead of on a server.",
  },
  {
    question: "Are my photos uploaded to a server?",
    answer:
      "No. The AI model downloads to your browser once (under 1MB), and every enhancement after that runs locally on your device using your browser's own processing power. Your image never leaves your computer.",
  },
  {
    question: "What's the difference between Enhance, Upscale 2× and Upscale 4×?",
    answer:
      "Enhance Quality improves sharpness and clarity while keeping the original dimensions - it runs the AI model and resamples the result back down to the original size. Upscale 2× and 4× keep the AI model's output at its larger size, doubling or quadrupling both width and height.",
  },
  {
    question: "Can this fix a very blurry photo?",
    answer:
      "It can meaningfully improve mild softness, slight motion blur and low-detail images, but it can't reconstruct detail that was never captured in the first place. A severely out-of-focus or heavily motion-blurred photo will look somewhat better, not perfectly sharp - see our dedicated unblur guide for a deeper explanation of what's realistically possible.",
  },
  {
    question: "What image formats are supported?",
    answer: "JPG, PNG and WebP for upload. The enhanced result downloads as a PNG, which preserves the AI model's full output quality without introducing further compression artifacts.",
  },
  {
    question: "Is there a limit to how large an image I can upload?",
    answer:
      "Very large source images are automatically scaled down before processing to keep enhancement fast and to avoid running out of memory in your browser. For most photos (up to a few thousand pixels wide) this has no visible effect on the result.",
  },
  {
    question: "Why does the first enhancement take longer than the next one?",
    answer:
      "The first time you enhance an image on a given visit, your browser downloads the AI model (under 1MB). It's cached for the rest of your session, so subsequent enhancements start immediately.",
  },
  {
    question: "Do I need to create an account?",
    answer: "No account, no email, no sign-up. Upload an image and use the tool immediately.",
  },
  {
    question: "Can I use the enhanced image commercially?",
    answer:
      "Yes - the tool only processes the pixels of the image you provide; it doesn't add a watermark or license restriction of its own. You're responsible for having the rights to the original image, the same as with any editing tool.",
  },
];

const webApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "cloudvertify Image Enhancer",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any (web-based)",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "Free browser-based AI image enhancer. Sharpens detail, reduces blur, and upscales images up to 4x using an ESRGAN super-resolution model that runs entirely client-side.",
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
    { "@type": "ListItem", position: 2, name: "Image Enhancer", item: "/image-enhancer" },
  ],
};

export default function ImageEnhancerPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="hero-dark">
        <div className="mx-auto max-w-3xl px-6 pt-16 pb-16 text-center">
          <div className="mb-6 flex justify-center">
            <Breadcrumb items={[{ label: "cloudvertify", href: "/" }, { label: "Image Enhancer" }]} />
          </div>
          <h1 className="font-display text-ink text-4xl font-semibold sm:text-5xl">Free Image Enhancer</h1>
          <p className="text-ink/70 mt-4">
            Improve image quality online for free. This image enhancer sharpens detail, reduces blur and
            upscales photos up to 4x using a real AI super-resolution model that runs entirely in your
            browser - no upload, no account, no per-image cost.
          </p>

          <div id="tool" className="on-light border-border bg-surface mt-10 rounded-2xl border p-6 text-left shadow-xl sm:p-8">
            <EnhancerTool defaultMode="enhance" />
          </div>
        </div>
      </div>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center gap-4 px-6 py-16">
        <section className="mx-auto w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">What This Image Enhancer Does</h2>
          <p className="text-ink-muted leading-relaxed">
            Most people searching for a free image enhancer have one of a few specific problems: a photo
            that looks slightly soft or hazy, a picture that&apos;s too small for where they want to use
            it, or an old image that just doesn&apos;t hold up next to modern, high-resolution photos.
            This tool addresses all three with one underlying technology - an AI super-resolution model
            that reconstructs plausible detail at a higher resolution, then either keeps that larger size
            (upscaling) or resamples it back down to sharpen the original (enhancing).
          </p>
          <p className="text-ink-muted mt-4 leading-relaxed">
            Unlike a basic sharpen or contrast filter, which can only push around detail that&apos;s
            already in the image, this model has been trained on a large dataset of image pairs to learn
            what real-world detail typically looks like - textures, edges, and fine structure - and uses
            that learned prior to fill in a more convincing result than simple pixel math can produce.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">How the Enhancement Tool Works</h2>
          <p className="text-ink-muted leading-relaxed">
            When you upload an image, it&apos;s decoded directly in your browser and never leaves your
            device. Choosing <strong>Enhance Quality</strong>, <strong>Upscale 2×</strong> or{" "}
            <strong>Upscale 4×</strong> runs an ESRGAN-family neural network - loaded once as a small
            (under 1MB) file and cached for the rest of your visit - against the image using your
            browser&apos;s own graphics processing. Enhance Quality runs the model at 2x and resamples the
            output back to the original dimensions, which is what actually improves sharpness and clarity
            without changing the image&apos;s size. Upscale 2× and 4× keep the model&apos;s enlarged output
            at its full size instead.
          </p>
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
          <h2 className="font-display mb-4 text-xl">Image Enhancement, Sharpening and Blur Reduction</h2>
          <p className="text-ink-muted leading-relaxed">
            <strong>Image enhancement</strong> is a broad term for any process that improves how an image
            looks - correcting exposure, reducing noise, sharpening edges, or increasing resolution.
            <strong> Sharpening</strong> specifically targets edges and fine detail, making them appear
            more defined; a traditional sharpening filter (an unsharp mask) does this by exaggerating
            contrast along existing edges, which can look artificial if pushed too far.
          </p>
          <p className="text-ink-muted mt-4 leading-relaxed">
            <strong>Blur reduction</strong> is a harder problem. A traditional filter can only make
            existing edges look crisper - it can&apos;t recover detail that was genuinely lost when the
            photo was taken. An AI model like the one this tool uses takes a different approach: it was
            trained on millions of sharp/blurred image pairs, so it has learned plausible patterns for
            what fine detail tends to look like, and reconstructs a best estimate rather than just
            exaggerating what&apos;s already there. That&apos;s a meaningfully different (and usually
            better) result for genuinely soft or blurry photos, though it&apos;s still an estimate, not a
            perfect recovery - see the limitations below.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Image Upscaling: 2× vs 4×</h2>
          <p className="text-ink-muted leading-relaxed">
            <strong>Upscaling</strong> increases an image&apos;s pixel dimensions - a 500×500px image
            upscaled 2× becomes 1000×1000px, and 4× becomes 2000×2000px. Simple upscaling (the kind built
            into most image editors) just interpolates between existing pixels, which is why enlarged
            images usually look soft or blocky. The AI model here instead predicts new pixel detail based
            on patterns learned from real photos, so edges and textures stay more defined at the larger
            size.
          </p>
          <p className="text-ink-muted mt-4 leading-relaxed">
            <strong>2×</strong> is the safer choice for most images - it asks the model to invent less new
            detail per pixel, so results tend to look natural even on lower-quality sources.{" "}
            <strong>4×</strong> produces a much larger image and can look excellent on a good source photo,
            but on a small or heavily compressed original, there&apos;s more room for the model&apos;s
            guesses to look slightly synthetic up close. If you&apos;re not sure which to use, try 2× first
            and only reach for 4× if you specifically need the larger dimensions.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Understanding Image Resolution</h2>
          <p className="text-ink-muted leading-relaxed">
            Image resolution usually refers to an image&apos;s pixel dimensions - its width and height in
            pixels - which determines how large it can be displayed or printed before individual pixels
            become visible. A low-resolution image (say, 400×300px) will look blocky if stretched to fill
            a large screen or a printed page, because there simply aren&apos;t enough pixels to fill that
            space cleanly. Upscaling increases pixel dimensions, which can improve perceived resolution
            for display purposes - but it&apos;s worth being clear-eyed that it&apos;s adding
            AI-reconstructed pixels, not recovering detail the camera never captured. For a deeper look at
            resolution, pixels and when upscaling genuinely helps, see our{" "}
            <Link href="/increase-image-resolution" className="text-primary font-medium">
              guide to increasing image resolution
            </Link>
            .
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Before and After: What to Expect</h2>
          <p className="text-ink-muted leading-relaxed">
            The before/after slider above the tool shows the original and enhanced image at the same
            display size, so you can directly compare sharpness and detail rather than just seeing that
            the file got bigger. On a photo with mild softness, expect noticeably crisper edges and more
            defined texture in areas like hair, fabric, or foliage. On an upscale, expect the same visual
            sharpness at a larger size - the slider is a good way to confirm the result actually looks
            better before you commit to downloading it.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Benefits</h2>
          <ul className="text-ink-muted flex flex-col gap-2 text-sm leading-relaxed">
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              Genuinely free - no credits, watermarks, or paid tiers, since processing happens on your
              device instead of a metered server.
            </li>
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              Private by design - your photo is never uploaded, so there&apos;s nothing to worry about
              regarding storage or third-party access.
            </li>
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              Uses a real AI model, not a basic filter, for meaningfully better results on soft or
              low-detail images.
            </li>
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              No installation and no account - it works directly in your browser on desktop or mobile.
            </li>
          </ul>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Common Use Cases</h2>
          <ul className="text-ink-muted flex flex-col gap-2 text-sm leading-relaxed">
            {USE_CASES.map((useCase) => (
              <li key={useCase} className="flex gap-2">
                <span className="text-primary">·</span>
                {useCase}
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Supported Formats</h2>
          <p className="text-ink-muted leading-relaxed">
            Upload JPG, PNG or WebP images. The enhanced result always downloads as a PNG, which is
            lossless and won&apos;t introduce any additional compression artifacts on top of what the AI
            model produced. If you need the result in a different format afterward, cloudvertify&apos;s{" "}
            <Link href="/" className="text-primary font-medium">
              image converter
            </Link>{" "}
            can convert it to JPG, WebP or AVIF.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Realistic Limitations</h2>
          <p className="text-ink-muted leading-relaxed">
            It&apos;s worth being honest about what AI enhancement can and can&apos;t do. It cannot
            recover detail that was never captured - a face that&apos;s a handful of pixels wide in the
            original won&apos;t become a sharp, identifiable portrait, because that information simply
            isn&apos;t there to reconstruct. Severe motion blur or a badly out-of-focus shot will look
            somewhat improved, not perfectly sharp. And because the model is reconstructing plausible
            detail rather than recovering the exact original, very fine text or precise patterns can
            occasionally come out slightly different from the true source, especially at 4×. Enhancement
            works best as a real, meaningful improvement on mild-to-moderate quality issues, not as a way
            to reverse severe data loss.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Tips for Better Results</h2>
          <ul className="text-ink-muted flex flex-col gap-2 text-sm leading-relaxed">
            {TIPS.map((tip) => (
              <li key={tip} className="flex gap-2">
                <span className="text-primary">·</span>
                {tip}
              </li>
            ))}
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
              <Link href="/image-upscaler" className="conversion-pill px-4 py-1.5 text-sm">
                Image Upscaler
              </Link>
            </li>
            <li>
              <Link href="/unblur-images" className="conversion-pill px-4 py-1.5 text-sm">
                Unblur Images
              </Link>
            </li>
            <li>
              <Link href="/make-blurry-picture-clear" className="conversion-pill px-4 py-1.5 text-sm">
                Make Blurry Picture Clear
              </Link>
            </li>
            <li>
              <Link href="/increase-image-resolution" className="conversion-pill px-4 py-1.5 text-sm">
                Increase Image Resolution
              </Link>
            </li>
            <li>
              <Link href="/convert/jpg-to-webp" className="conversion-pill px-4 py-1.5 text-sm">
                Convert JPG to WebP
              </Link>
            </li>
            <li>
              <Link href="/convert/jpg-to-avif" className="conversion-pill px-4 py-1.5 text-sm">
                Convert JPG to AVIF
              </Link>
            </li>
            <li>
              <Link href="/svg-optimizer" className="conversion-pill px-4 py-1.5 text-sm">
                SVG Optimizer
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
          <h2 className="font-display mb-3 text-xl">Ready to improve your photo?</h2>
          <p className="text-ink-muted mb-6 leading-relaxed">
            Scroll back up, drop in an image, and see the difference for yourself - it&apos;s free and
            takes just a few seconds.
          </p>
          <Link
            href="#tool"
            className="bg-primary text-primary-ink inline-block rounded-full px-6 py-3 font-medium"
          >
            Use the Image Enhancer
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
