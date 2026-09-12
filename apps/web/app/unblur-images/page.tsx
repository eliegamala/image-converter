import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { EnhancerTool } from "@/components/EnhancerTool";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Unblur Images Online for Free – AI Photo Sharpener",
  description:
    "Unblur images online for free. Reduce soft focus, mild motion blur and low-detail softness using an AI model that runs in your browser - plus an honest look at what can and can't be fixed.",
  alternates: { canonical: "/unblur-images" },
  openGraph: {
    title: "Unblur Images Online for Free – AI Photo Sharpener",
    description:
      "Make a blurry image clearer for free with an AI model that reconstructs detail instead of just sharpening edges - and a clear-eyed look at what it can't recover.",
  },
};

const BLUR_TYPES = [
  {
    title: "Soft or slightly blurry images",
    body: "The most common case - a photo that's just a little soft overall, often from a slightly missed focus point or a lower-quality camera sensor. This is where AI enhancement helps the most, since there's still real underlying detail to work with.",
  },
  {
    title: "Slight motion blur",
    body: "A subject or the camera moved a small amount during the exposure, smearing edges in one direction. Mild motion blur can be partially reduced - heavy motion blur, where a subject is smeared well beyond recognition, is much harder to meaningfully fix.",
  },
  {
    title: "Out-of-focus images",
    body: "The camera focused on the wrong point, leaving the intended subject soft while something else (or nothing) is sharp. Out-of-focus blur affects the whole subject fairly evenly, and enhancement can noticeably improve perceived sharpness, though it can't restore focus that was never achieved.",
  },
  {
    title: "Low-detail or heavily compressed images",
    body: "Not blur in the traditional sense, but a photo saved at low quality or resolution loses fine detail in a similar way. An AI model can reconstruct plausible texture and edges here, often with very noticeable improvement.",
  },
];

const STEPS = [
  { step: "01", title: "Upload the blurry photo", body: "JPG, PNG or WebP - stays on your device the whole time." },
  { step: "02", title: "Select Enhance Quality", body: "This mode sharpens the image without changing its dimensions." },
  { step: "03", title: "Compare and save", body: "Use the before/after slider, then download the clearer version." },
];

const FAQS = [
  {
    question: "Can AI actually unblur a photo?",
    answer:
      "It can meaningfully improve mild-to-moderate blur - soft focus, slight motion blur, general low-detail softness - by using a model trained to recognize what sharp detail typically looks like and reconstructing a more defined version. It's a real, visible improvement in most cases, not a marketing exaggeration, but it's reconstruction based on learned patterns, not literal recovery of lost information.",
  },
  {
    question: "Why can't severe blur be completely fixed?",
    answer:
      "When a photo is severely blurred, the actual detail - the true edges and textures - was never recorded in the pixel data to begin with; it was averaged away during the blur itself. No tool, AI or otherwise, can recover information that simply isn't there. What AI enhancement does instead is generate a plausible, sharper-looking estimate, which helps but isn't the same as true recovery.",
  },
  {
    question: "What's the difference between sharpening and unblurring?",
    answer:
      "A traditional sharpening filter (unsharp mask) increases contrast along existing edges to make them look more defined - it works with whatever is already in the image. Unblurring with an AI model is closer to informed reconstruction: it uses patterns learned from many real photos to estimate detail that a simple contrast trick can't produce, which is why it tends to handle genuine blur better.",
  },
  {
    question: "Does this work on motion-blurred photos?",
    answer:
      "It helps with mild motion blur - a small amount of smearing from slight camera shake or subject movement. Heavy motion blur, where a moving subject is smeared well beyond its original shape, has lost too much positional information for any enhancement to meaningfully reconstruct.",
  },
  {
    question: "Will unblurring change the size of my image?",
    answer:
      "No, if you use Enhance Quality mode - it sharpens the image and returns it at its original dimensions. If you also want a larger image, use Upscale 2x or 4x on the image enhancer, which apply the same underlying model but keep its enlarged output instead of resampling back down.",
  },
  {
    question: "Is unblurring images free?",
    answer:
      "Yes - it runs entirely in your browser using an open-source AI model, so there's no per-image cost, no watermark, and no account required.",
  },
  {
    question: "Is my photo uploaded to a server to be unblurred?",
    answer: "No. The model downloads to your browser once and processing happens locally - your photo never leaves your device.",
  },
  {
    question: "Why does a slightly blurry photo enhance better than a very blurry one?",
    answer:
      "The AI model works by reconstructing detail based on patterns in what's already there. A slightly blurry photo still has most of its real structure intact, giving the model a strong starting point. A severely blurred photo has lost much more of that structure, leaving the model with far less to work from - which is exactly why results are more dramatic on mild blur than severe blur.",
  },
];

const webApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "cloudvertify Unblur Tool",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any (web-based)",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "Free browser-based tool to reduce blur in photos using an AI super-resolution model. Improves soft focus, mild motion blur and low-detail images entirely client-side.",
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
    { "@type": "ListItem", position: 2, name: "Unblur Images", item: "/unblur-images" },
  ],
};

export default function UnblurImagesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="hero-dark">
        <div className="mx-auto max-w-3xl px-6 pt-16 pb-16 text-center">
          <div className="mb-6 flex justify-center">
            <Breadcrumb items={[{ label: "cloudvertify", href: "/" }, { label: "Unblur Images" }]} />
          </div>
          <h1 className="font-display text-ink text-4xl font-semibold sm:text-5xl">Unblur Images Online</h1>
          <p className="text-ink/70 mt-4">
            Make a blurry photo clearer for free. This tool uses an AI model to reduce soft focus, mild
            motion blur and low-detail softness - entirely in your browser, with no upload and no account.
          </p>

          <div id="tool" className="on-light border-border bg-surface mt-10 rounded-2xl border p-6 text-left shadow-xl sm:p-8">
            <EnhancerTool defaultMode="enhance" />
          </div>
        </div>
      </div>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center gap-4 px-6 py-16">
        <section className="mx-auto w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">What Causes a Blurry Image?</h2>
          <p className="text-ink-muted leading-relaxed">
            &quot;Blurry&quot; covers a few genuinely different problems, and it&apos;s worth knowing which
            one you&apos;re dealing with, because it affects how much can realistically be improved. Blur
            generally comes from one of: the camera focusing on the wrong point (out-of-focus blur),
            something moving during the exposure (motion blur), a lower-quality sensor or lens producing
            general softness, or heavy compression discarding fine detail. Each responds a little
            differently to enhancement.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Types of Blur This Tool Can Help With</h2>
          <div className="mt-4 flex flex-col gap-5">
            {BLUR_TYPES.map((type) => (
              <div key={type.title}>
                <h3 className="font-medium">{type.title}</h3>
                <p className="text-ink-muted mt-1 text-sm leading-relaxed">{type.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">How to Unblur an Image</h2>
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
          <h2 className="font-display mb-4 text-xl">How Unblurring Actually Works</h2>
          <p className="text-ink-muted leading-relaxed">
            This tool runs an ESRGAN-family AI model - the same kind of neural network used for image
            super-resolution - directly in your browser. It was trained on large sets of sharp and soft
            image pairs, learning what real, sharp detail tends to look like. When you enhance a photo, it
            processes the image at a higher internal resolution, reconstructing edges and texture based on
            that learned knowledge, then resamples the result back down to your original dimensions. That
            final resampling step is what actually delivers the clearer, sharper output.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Sharpening vs. Real Detail Recovery</h2>
          <p className="text-ink-muted leading-relaxed">
            It&apos;s worth being precise about the difference between two things that get lumped together
            as &quot;fixing blur.&quot; A basic sharpening filter increases local contrast along edges that
            already exist in the image - it makes what&apos;s there look more defined, but it can&apos;t
            add detail that isn&apos;t present, and pushed too far it produces a harsh, artificial look
            with visible halos around edges.
          </p>
          <p className="text-ink-muted mt-4 leading-relaxed">
            AI-based enhancement is closer to informed reconstruction: rather than exaggerating existing
            edges, it generates new plausible detail based on patterns learned from real photos. That
            tends to produce a more natural-looking result on genuinely blurry images, but it&apos;s
            important to understand it as reconstruction, not literal recovery - the model is making an
            educated estimate of what the sharp version probably looked like, not extracting information
            that was somehow hidden in the blur.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Motion Blur vs. Focus Blur</h2>
          <p className="text-ink-muted leading-relaxed">
            <strong>Motion blur</strong> smears an image in the direction of movement - a fast-moving
            subject, or the camera shaking during a long exposure. Mild motion blur (a slight smear from a
            bit of camera shake) responds reasonably well to enhancement. Severe motion blur, where a
            subject is stretched well beyond its true shape, has effectively lost its original edges
            across a wide area - there&apos;s very little for the model to reconstruct from.
          </p>
          <p className="text-ink-muted mt-4 leading-relaxed">
            <strong>Focus blur</strong> happens when the lens simply isn&apos;t focused on the right
            distance - the whole subject is uniformly soft rather than smeared in one direction. This
            tends to enhance more predictably than motion blur, since the loss of detail is more even and
            the model has a consistent pattern to work with across the frame.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">What Enhancement Can Realistically Recover</h2>
          <p className="text-ink-muted leading-relaxed">
            Being honest about limitations matters more than overselling results. This tool can noticeably
            improve mild softness, slight motion blur, out-of-focus shots, and general low-detail images -
            in many cases the before/after difference is substantial and immediately visible. What it
            can&apos;t do is recover detail that was never captured: a face reduced to a handful of pixels
            won&apos;t become a sharp, identifiable portrait, and severe blur will look somewhat better,
            not perfectly sharp. If a photo is your only copy of an important, badly blurred moment, treat
            enhancement as a genuine improvement - not a full restoration.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Tips for Better Results</h2>
          <ul className="text-ink-muted flex flex-col gap-2 text-sm leading-relaxed">
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              Use the original photo file if you have it, rather than a screenshot or a copy that&apos;s
              already been compressed or resized down.
            </li>
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              If you have several shots of the same moment, pick the sharpest one to enhance - enhancement
              improves a photo, it doesn&apos;t replace choosing a better source.
            </li>
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              Check the result at full size using the before/after slider, not in a small thumbnail, to
              judge the improvement accurately.
            </li>
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              If your photo is both blurry and small, enhancement alone (same size output) is usually the
              better first step - reach for{" "}
              <Link href="/image-upscaler" className="text-primary font-medium">
                upscaling
              </Link>{" "}
              afterward if you specifically need a larger image too.
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
              <Link href="/make-blurry-picture-clear" className="conversion-pill px-4 py-1.5 text-sm">
                Make Blurry Picture Clear
              </Link>
            </li>
            <li>
              <Link href="/image-enhancer" className="conversion-pill px-4 py-1.5 text-sm">
                Image Enhancer
              </Link>
            </li>
            <li>
              <Link href="/image-upscaler" className="conversion-pill px-4 py-1.5 text-sm">
                Image Upscaler
              </Link>
            </li>
            <li>
              <Link href="/resize-image-to-100kb" className="conversion-pill px-4 py-1.5 text-sm">
                Resize Image to 100KB
              </Link>
            </li>
            <li>
              <Link href="/convert/heic-to-jpg" className="conversion-pill px-4 py-1.5 text-sm">
                Convert HEIC to JPG
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
          <h2 className="font-display mb-3 text-xl">Ready to clear up a blurry photo?</h2>
          <p className="text-ink-muted mb-6 leading-relaxed">
            Scroll up, upload the image, and see the improvement for yourself - free, private, no account.
          </p>
          <Link href="#tool" className="bg-primary text-primary-ink inline-block rounded-full px-6 py-3 font-medium">
            Unblur an Image
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
