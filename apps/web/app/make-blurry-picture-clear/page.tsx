import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "How to Make a Blurry Picture Clear – What Actually Helps",
  description:
    "Why photos come out blurry, what AI-based sharpening can realistically fix, and practical, honest tips for getting a clearer result.",
  alternates: { canonical: "/make-blurry-picture-clear" },
  openGraph: {
    title: "How to Make a Blurry Picture Clear – What Actually Helps",
    description:
      "A practical, honest guide to fixing a blurry photo - what causes blur, what AI enhancement can realistically improve, and what to try first.",
  },
};

const CAUSES = [
  { title: "Camera shake", body: "The most common cause on phones - the camera moved slightly during the shot, especially in low light where exposures take longer." },
  { title: "Wrong focus point", body: "The camera focused on something other than your subject - common with busy backgrounds or fast-moving subjects." },
  { title: "Low light", body: "Dim conditions force a slower shutter speed, which makes any small movement (yours or your subject's) show up as blur." },
  { title: "Saved or shared at low quality", body: "A photo that's been screenshotted, re-saved, or sent through a messaging app multiple times often loses sharpness to repeated compression, even if the original was fine." },
];

const FAQS = [
  {
    question: "What's the first thing to try with a blurry picture?",
    answer:
      "Check whether you have a better source to start from - a higher-resolution original rather than a screenshot or a copy that's been through a messaging app, or a different shot from the same moment that came out sharper. The starting quality matters more than any enhancement step that follows.",
  },
  {
    question: "Can AI enhancement fix a blurry picture?",
    answer:
      "It can meaningfully improve mild-to-moderate blur - a photo that's just a little soft, some motion blur, general low-detail softness - by reconstructing plausible detail rather than just increasing edge contrast the way a basic sharpen filter does. See our unblur images guide for the full technical explanation.",
  },
  {
    question: "Will a blurry photo become perfectly sharp?",
    answer:
      "It depends how blurry it is to start with. Mildly soft or slightly blurry photos can come out noticeably clearer with the right approach. Very blurry photos will look somewhat better at best, not perfectly sharp - no method, AI or otherwise, can invent detail the camera never captured.",
  },
  {
    question: "Does making a picture bigger help with blurriness?",
    answer:
      "Not on its own - upscaling increases pixel dimensions, it doesn't add sharpness by itself. Sharpening and upscaling are related but different operations; see our image upscaling guide for how they fit together.",
  },
  {
    question: "Is there a difference between a blurry photo and a low-resolution one?",
    answer:
      "Yes. A low-resolution photo simply has fewer pixels to begin with, which can look soft when displayed larger than its native size. A blurry photo has enough pixels but the detail within them was smeared or never properly focused. Each responds differently to enhancement - see our guide on image resolution for the distinction.",
  },
  {
    question: "Can I fix a blurry picture without any software?",
    answer:
      "For minor softness, sometimes reducing the display size (viewing it smaller) makes blur less noticeable, though that's a workaround rather than a fix. For an actual improvement to the file itself, some form of sharpening or AI-based enhancement is needed.",
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
    { "@type": "ListItem", position: 2, name: "Make Blurry Picture Clear", item: "/make-blurry-picture-clear" },
  ],
};

export default function MakeBlurryPictureClearPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="hero-dark">
        <div className="mx-auto max-w-3xl px-6 pt-16 pb-16 text-center">
          <div className="mb-6 flex justify-center">
            <Breadcrumb items={[{ label: "cloudvertify", href: "/" }, { label: "Make Blurry Picture Clear" }]} />
          </div>
          <h1 className="font-display text-ink text-4xl font-semibold sm:text-5xl">
            How to Make a Blurry Picture Clear
          </h1>
          <p className="text-ink/70 mt-4">
            A practical, honest look at what actually helps a blurry photo - why pictures come out
            blurry in the first place, what AI-based sharpening can realistically fix, and what to
            try before reaching for any tool.
          </p>
        </div>
      </div>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center gap-4 px-6 py-16">
        <section className="mx-auto w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Start With the Best Source You Have</h2>
          <p className="text-ink-muted leading-relaxed">
            Before reaching for any sharpening technique, the single biggest factor in how good a
            result you can get is the quality of your starting file. A screenshot of a photo, or a
            copy that&apos;s been sent through a messaging app (which typically re-compresses
            images), has already lost detail that no amount of enhancement afterward can restore.
            If you have the original photo file, or several shots of the same moment, start from
            whichever is sharpest and least compressed - it makes a real, measurable difference to
            the result.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Why Photos Come Out Blurry</h2>
          <p className="text-ink-muted leading-relaxed">
            It helps to know why a picture ended up blurry in the first place, because it sets
            realistic expectations for how much improvement is actually possible.
          </p>
          <div className="mt-4 flex flex-col gap-4">
            {CAUSES.map((cause) => (
              <div key={cause.title}>
                <h3 className="font-medium">{cause.title}</h3>
                <p className="text-ink-muted mt-1 text-sm leading-relaxed">{cause.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">What AI-Based Sharpening Actually Does</h2>
          <p className="text-ink-muted leading-relaxed">
            Modern AI-based sharpening uses a trained neural network rather than a basic contrast
            filter. It&apos;s trained on large numbers of sharp and blurry photo pairs, so it has
            learned what genuinely sharp detail tends to look like, and it uses that knowledge to
            reconstruct a clearer estimate of the original scene - a meaningfully different
            approach from simply increasing contrast at existing edges, which is what a basic
            sharpen filter does. See our full explanation of{" "}
            <Link href="/unblur-images" className="text-primary font-medium">
              how unblurring works
            </Link>{" "}
            for the technical detail.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">
            Sharpening, Enhancing, and Upscaling - What&apos;s the Difference?
          </h2>
          <p className="text-ink-muted leading-relaxed">
            These terms get used interchangeably but describe different things. Sharpening and
            same-size enhancement improve clarity while keeping a photo&apos;s original
            dimensions. Upscaling increases the pixel dimensions instead, which helps when an
            image needs to be larger (for printing, or to fill more space) but doesn&apos;t by
            itself fix blur - a blurry image made bigger is still blurry, just at a larger size.
            Our{" "}
            <Link href="/image-upscaler" className="text-primary font-medium">
              image upscaling guide
            </Link>{" "}
            covers the 2x vs 4x distinction in more detail.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Be Realistic About What&apos;s Possible</h2>
          <p className="text-ink-muted leading-relaxed">
            A photo that&apos;s only a little soft can genuinely come out looking sharp with the
            right approach. A photo that&apos;s severely out of focus or badly smeared by motion
            will look somewhat better at best, but it&apos;s not going to turn into a crisp,
            perfectly focused shot - that detail simply wasn&apos;t captured, and nothing can
            invent it from nothing. For most everyday &quot;this came out a bit blurry&quot;
            photos, a real, worthwhile improvement is achievable; for severely damaged or
            irreplaceable images, it&apos;s worth keeping expectations modest.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Quick Tips</h2>
          <ul className="text-ink-muted flex flex-col gap-2 text-sm leading-relaxed">
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              Use the original photo file, not a screenshot of it or a copy someone sent you over a
              messaging app - each re-save loses a bit of quality.
            </li>
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              If you took several shots of the same moment, start from the sharpest one - it gives
              any sharpening step a better foundation to work from.
            </li>
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              Judge results at full size rather than in a small preview, where quality differences
              are easy to miss.
            </li>
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              Understand which type of blur you&apos;re dealing with first - our{" "}
              <Link href="/unblur-images" className="text-primary font-medium">
                unblur images guide
              </Link>{" "}
              breaks down motion blur versus focus blur versus general softness.
            </li>
          </ul>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Frequently Asked Questions</h2>
          <FaqAccordion items={FAQS} />
        </section>

        <section className="mx-auto mt-8 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">More Reading</h2>
          <ul className="flex flex-wrap gap-2">
            <li>
              <Link href="/unblur-images" className="conversion-pill px-4 py-1.5 text-sm">
                Unblur Images
              </Link>
            </li>
            <li>
              <Link href="/image-enhancer" className="conversion-pill px-4 py-1.5 text-sm">
                Image Enhancer Guide
              </Link>
            </li>
            <li>
              <Link href="/image-upscaler" className="conversion-pill px-4 py-1.5 text-sm">
                Image Upscaler
              </Link>
            </li>
          </ul>
        </section>

        <section className="mx-auto mt-8 w-full max-w-2xl text-center">
          <h2 className="font-display mb-3 text-xl">Need to convert an image right now?</h2>
          <p className="text-ink-muted mb-6 leading-relaxed">
            cloudvertify&apos;s free image format converters are ready to use today - no account,
            nothing installed.
          </p>
          <Link href="/convert" className="bg-primary text-primary-ink inline-block rounded-full px-6 py-3 font-medium">
            View All Converters
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
