import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Image Enhancer Guide – How AI Improves Photo Quality",
  description:
    "How AI image enhancement actually works: sharpening, blur reduction and upscaling explained clearly, including what it can and can't realistically fix.",
  alternates: { canonical: "/image-enhancer" },
  openGraph: {
    title: "Image Enhancer Guide – How AI Improves Photo Quality",
    description:
      "A clear explanation of how AI-based image enhancement, sharpening and upscaling work, and what to realistically expect from each.",
  },
};

const USE_CASES = [
  "Sharpening a slightly soft phone photo before posting it online",
  "Upscaling a small product photo so it doesn't look pixelated on a website",
  "Enlarging an old, low-resolution image for a print or a presentation slide",
  "Cleaning up a screenshot or scanned image before sharing it",
  "Preparing a profile picture or thumbnail that needs to look sharp at a larger size",
];

const TIPS = [
  "Start from the highest-quality version of an image you have - enhancement works with the detail that's already there, it can't pull detail from a version that was compressed or resized down first.",
  "If a photo is only slightly soft, a same-size sharpen/denoise pass generally gives a cleaner result than upscaling and then shrinking back down.",
  "For very small or heavily compressed source images, a smaller upscale factor (2x) usually looks more natural than a larger one (4x) - more aggressive upscaling has more room to introduce artifacts.",
  "Judge any enhancement result at full size, not in a small preview - a small thumbnail can hide both problems and improvements.",
  "If a result looks over-smoothed on a very detailed photo, the source likely didn't have enough real detail to reconstruct from - that's a limitation of the source image, not something a setting can fix.",
];

const FAQS = [
  {
    question: "Does AI image enhancement actually use AI, or is it just a sharpening filter?",
    answer:
      "Genuine AI-based enhancement uses a trained neural network - typically an ESRGAN-family super-resolution model - not a basic sharpen or contrast filter. It's trained on large sets of image pairs to learn what real-world detail typically looks like, which is meaningfully different from a filter that just exaggerates existing edges.",
  },
  {
    question: "What's the difference between enhancing and upscaling?",
    answer:
      "Enhancing improves sharpness and clarity while keeping an image's original dimensions - typically by running a super-resolution model and resampling the result back down to the original size. Upscaling keeps the model's larger output instead, doubling or quadrupling the width and height.",
  },
  {
    question: "Can AI enhancement fix a very blurry photo?",
    answer:
      "It can meaningfully improve mild softness, slight motion blur and low-detail images, but it can't reconstruct detail that was never captured in the first place. A severely out-of-focus or heavily motion-blurred photo will look somewhat better, not perfectly sharp - see our dedicated unblur guide for a deeper explanation of what's realistically possible.",
  },
  {
    question: "Is upscaling the same as increasing resolution?",
    answer:
      "In practice, yes when talking about pixel dimensions - upscaling is the process, increased resolution is the result. See our guide to increasing image resolution for the more precise technical breakdown of what resolution actually means.",
  },
  {
    question: "Why does 4x upscaling sometimes look worse than 2x?",
    answer:
      "A larger upscale factor asks a model to invent more new detail per pixel. On a small or heavily compressed source, that leaves more room for the model's guesses to look slightly synthetic up close - 2x is generally the safer, more natural-looking choice unless you specifically need the larger dimensions.",
  },
  {
    question: "Does enhancement work on any type of image?",
    answer:
      "It works best on photographic content, since that's what these models are typically trained on. Flat graphics, line art and screenshots with text can still be processed, but very fine text is where artifacts are most likely to show up.",
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
    { "@type": "ListItem", position: 2, name: "Image Enhancer", item: "/image-enhancer" },
  ],
};

export default function ImageEnhancerPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="hero-dark">
        <div className="mx-auto max-w-3xl px-6 pt-16 pb-16 text-center">
          <div className="mb-6 flex justify-center">
            <Breadcrumb items={[{ label: "cloudvertify", href: "/" }, { label: "Image Enhancer" }]} />
          </div>
          <h1 className="font-display text-ink text-4xl font-semibold sm:text-5xl">
            How Image Enhancement Works
          </h1>
          <p className="text-ink/70 mt-4">
            A clear, practical explanation of how AI-based image enhancement improves photo
            quality - sharpening, blur reduction and upscaling - and what it can and
            can&apos;t realistically fix. Looking for cloudvertify&apos;s working tools instead?
            Try our{" "}
            <Link href="/convert" className="text-primary font-medium">
              free image converters
            </Link>
            .
          </p>
        </div>
      </div>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center gap-4 px-6 py-16">
        <section className="mx-auto w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">What Image Enhancement Actually Does</h2>
          <p className="text-ink-muted leading-relaxed">
            Most people looking into image enhancement have one of a few specific problems: a
            photo that looks slightly soft or hazy, a picture that&apos;s too small for where they
            want to use it, or an old image that just doesn&apos;t hold up next to modern,
            high-resolution photos. Modern AI-based enhancement addresses all three with one
            underlying technique - a super-resolution model that reconstructs plausible detail at
            a higher resolution, then either keeps that larger size (upscaling) or resamples it
            back down to sharpen the original (enhancing).
          </p>
          <p className="text-ink-muted mt-4 leading-relaxed">
            Unlike a basic sharpen or contrast filter, which can only push around detail
            that&apos;s already in the image, these models are trained on large datasets of image
            pairs to learn what real-world detail typically looks like - textures, edges, and fine
            structure - and use that learned prior to fill in a more convincing result than simple
            pixel math can produce.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">How AI Enhancement Works, Conceptually</h2>
          <p className="text-ink-muted leading-relaxed">
            An AI enhancement model is a neural network - commonly from the ESRGAN family of
            super-resolution architectures - trained on millions of paired low-quality and
            high-quality images. During training, it learns to predict the higher-quality version
            given only the lower-quality one. Once trained, that same learned mapping can be
            applied to a new photo: the model processes it and produces an output with
            reconstructed detail that wasn&apos;t explicitly present in the source pixels, but is
            statistically plausible given what the model learned about how real images look.
          </p>
          <p className="text-ink-muted mt-4 leading-relaxed">
            For same-size enhancement, the model typically runs at a higher internal resolution
            (e.g. 2x) and the result is resampled back down to the original size - a technique that
            reliably improves perceived sharpness because averaging down from cleaner, more
            defined detail produces a crisper result than sharpening the original pixels directly.
            For upscaling, the model&apos;s enlarged output is kept as the final result instead.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Image Enhancement, Sharpening and Blur Reduction</h2>
          <p className="text-ink-muted leading-relaxed">
            <strong>Image enhancement</strong> is a broad term for any process that improves how an
            image looks - correcting exposure, reducing noise, sharpening edges, or increasing
            resolution.
            <strong> Sharpening</strong> specifically targets edges and fine detail, making them
            appear more defined; a traditional sharpening filter (an unsharp mask) does this by
            exaggerating contrast along existing edges, which can look artificial if pushed too
            far.
          </p>
          <p className="text-ink-muted mt-4 leading-relaxed">
            <strong>Blur reduction</strong> is a harder problem. A traditional filter can only make
            existing edges look crisper - it can&apos;t recover detail that was genuinely lost when
            the photo was taken. An AI model takes a different approach: trained on millions of
            sharp/blurred image pairs, it learns plausible patterns for what fine detail tends to
            look like, and reconstructs a best estimate rather than just exaggerating what&apos;s
            already there. That&apos;s a meaningfully different (and usually better) result for
            genuinely soft or blurry photos, though it&apos;s still an estimate, not a perfect
            recovery - see the limitations below.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Image Upscaling: 2× vs 4×</h2>
          <p className="text-ink-muted leading-relaxed">
            <strong>Upscaling</strong> increases an image&apos;s pixel dimensions - a 500×500px
            image upscaled 2× becomes 1000×1000px, and 4× becomes 2000×2000px. Simple upscaling
            (the kind built into most image editors) just interpolates between existing pixels,
            which is why enlarged images usually look soft or blocky. An AI upscaling model instead
            predicts new pixel detail based on patterns learned from real photos, so edges and
            textures stay more defined at the larger size.
          </p>
          <p className="text-ink-muted mt-4 leading-relaxed">
            <strong>2×</strong> is the safer choice for most images - it asks the model to invent
            less new detail per pixel, so results tend to look natural even on lower-quality
            sources. <strong>4×</strong> produces a much larger image and can look excellent on a
            good source photo, but on a small or heavily compressed original, there&apos;s more
            room for the model&apos;s guesses to look slightly synthetic up close.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Understanding Image Resolution</h2>
          <p className="text-ink-muted leading-relaxed">
            Image resolution usually refers to an image&apos;s pixel dimensions - its width and
            height in pixels - which determines how large it can be displayed or printed before
            individual pixels become visible. A low-resolution image (say, 400×300px) will look
            blocky if stretched to fill a large screen or a printed page, because there simply
            aren&apos;t enough pixels to fill that space cleanly. Upscaling increases pixel
            dimensions, which can improve perceived resolution for display purposes - but it&apos;s
            worth being clear-eyed that it&apos;s adding AI-reconstructed pixels, not recovering
            detail a camera never captured. For a deeper look at resolution, pixels and when
            upscaling genuinely helps, see our{" "}
            <Link href="/increase-image-resolution" className="text-primary font-medium">
              guide to increasing image resolution
            </Link>
            .
          </p>
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
          <h2 className="font-display mb-4 text-xl">Realistic Limitations</h2>
          <p className="text-ink-muted leading-relaxed">
            It&apos;s worth being honest about what AI enhancement can and can&apos;t do. It cannot
            recover detail that was never captured - a face that&apos;s a handful of pixels wide in
            the original won&apos;t become a sharp, identifiable portrait, because that information
            simply isn&apos;t there to reconstruct. Severe motion blur or a badly out-of-focus shot
            will look somewhat improved, not perfectly sharp. And because the model is
            reconstructing plausible detail rather than recovering the exact original, very fine
            text or precise patterns can occasionally come out slightly different from the true
            source, especially at higher upscale factors. Enhancement works best as a real,
            meaningful improvement on mild-to-moderate quality issues, not as a way to reverse
            severe data loss.
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
          <h2 className="font-display mb-4 text-xl">Related Reading</h2>
          <ul className="flex flex-wrap gap-2">
            <li>
              <Link href="/image-upscaler" className="conversion-pill px-4 py-1.5 text-sm">
                Image Upscaling Explained
              </Link>
            </li>
            <li>
              <Link href="/unblur-images" className="conversion-pill px-4 py-1.5 text-sm">
                Unblurring Images
              </Link>
            </li>
            <li>
              <Link href="/make-blurry-picture-clear" className="conversion-pill px-4 py-1.5 text-sm">
                Fixing a Blurry Picture
              </Link>
            </li>
            <li>
              <Link href="/increase-image-resolution" className="conversion-pill px-4 py-1.5 text-sm">
                Increasing Image Resolution
              </Link>
            </li>
          </ul>
        </section>

        <section className="mx-auto mt-8 w-full max-w-2xl text-center">
          <h2 className="font-display mb-3 text-xl">Need to convert an image right now?</h2>
          <p className="text-ink-muted mb-6 leading-relaxed">
            cloudvertify&apos;s image format converters are free, work entirely in your browser,
            and are ready to use today.
          </p>
          <Link
            href="/convert"
            className="bg-primary text-primary-ink inline-block rounded-full px-6 py-3 font-medium"
          >
            View All Converters
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
