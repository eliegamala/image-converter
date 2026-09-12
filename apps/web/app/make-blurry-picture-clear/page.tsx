import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { EnhancerTool } from "@/components/EnhancerTool";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Make a Blurry Picture Clear Online – Free & Instant",
  description:
    "Make a blurry picture clear in a few clicks, for free. Upload your photo, click Enhance, and download a sharper version - no account, no software, no upload to a server.",
  alternates: { canonical: "/make-blurry-picture-clear" },
  openGraph: {
    title: "Make a Blurry Picture Clear Online – Free & Instant",
    description:
      "A simple, free way to make a blurry photo clearer - upload, enhance, compare, download. Runs in your browser, nothing installed.",
  },
};

const CAUSES = [
  { title: "Camera shake", body: "The most common cause on phones - the camera moved slightly during the shot, especially in low light where exposures take longer." },
  { title: "Wrong focus point", body: "The camera focused on something other than your subject - common with busy backgrounds or fast-moving subjects." },
  { title: "Low light", body: "Dim conditions force a slower shutter speed, which makes any small movement (yours or your subject's) show up as blur." },
  { title: "Saved or shared at low quality", body: "A photo that's been screenshotted, re-saved, or sent through a messaging app multiple times often loses sharpness to repeated compression, even if the original was fine." },
];

const STEPS = [
  { step: "01", title: "Upload the photo", body: "Drop in your blurry picture - JPG, PNG or WebP." },
  { step: "02", title: "Click Enhance", body: "The AI model sharpens the image right in your browser, in a few seconds." },
  { step: "03", title: "Download the result", body: "Drag the slider to compare, then save the clearer version." },
];

const FAQS = [
  {
    question: "How do I make a blurry picture clear?",
    answer:
      "Upload it to the tool above, leave \"Enhance Quality\" selected, and click Enhance. An AI model sharpens the image and reduces mild blur automatically - there are no settings to fiddle with. Compare the result with the slider, then download it.",
  },
  {
    question: "Is this actually free?",
    answer:
      "Yes, completely - no trial limit, no watermark, no account. It runs using an open-source AI model loaded in your browser, so there's no cost per photo to pass on to you.",
  },
  {
    question: "Do I need to install anything?",
    answer: "No. It works directly in your web browser on both desktop and mobile - nothing to download or install.",
  },
  {
    question: "Will my blurry photo be perfectly sharp afterward?",
    answer:
      "It depends how blurry it is to start with. Mildly soft or slightly blurry photos usually come out noticeably clearer. Very blurry photos will look somewhat better, but not perfectly sharp - no tool can invent detail that the camera never captured. See our full explanation of what's realistically possible on the unblur images page.",
  },
  {
    question: "Is my photo uploaded somewhere?",
    answer: "No - it's processed entirely on your own device. The photo you upload never gets sent to a server.",
  },
  {
    question: "Can I also make the picture bigger, not just clearer?",
    answer:
      "Yes - switch to Upscale 2× or Upscale 4× instead of Enhance Quality, and the same AI model will enlarge the image instead of keeping it the same size. See the image upscaler page for more on choosing between them.",
  },
  {
    question: "What file do I get back?",
    answer: "A PNG file, which keeps full quality without adding any extra compression on top of what the enhancement produced.",
  },
];

const webApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "cloudvertify Blurry Picture Fixer",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any (web-based)",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "Free browser-based tool to make a blurry picture clearer using an AI enhancement model - upload, enhance, compare, download.",
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
    { "@type": "ListItem", position: 2, name: "Make Blurry Picture Clear", item: "/make-blurry-picture-clear" },
  ],
};

export default function MakeBlurryPictureClearPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="hero-dark">
        <div className="mx-auto max-w-3xl px-6 pt-16 pb-16 text-center">
          <div className="mb-6 flex justify-center">
            <Breadcrumb items={[{ label: "cloudvertify", href: "/" }, { label: "Make Blurry Picture Clear" }]} />
          </div>
          <h1 className="font-display text-ink text-4xl font-semibold sm:text-5xl">
            Make a Blurry Picture Clear
          </h1>
          <p className="text-ink/70 mt-4">
            Got a blurry photo you want to fix? Upload it below, click Enhance, and get a clearer version
            in a few seconds - free, with no account and nothing installed.
          </p>

          <div id="tool" className="on-light border-border bg-surface mt-10 rounded-2xl border p-6 text-left shadow-xl sm:p-8">
            <EnhancerTool defaultMode="enhance" />
          </div>
        </div>
      </div>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center gap-4 px-6 py-16">
        <section className="mx-auto w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">The Simplest Way to Fix a Blurry Photo</h2>
          <p className="text-ink-muted leading-relaxed">
            If you&apos;ve got a photo that came out blurry - a photo of a moment you can&apos;t retake -
            the good news is you don&apos;t need photo editing software or any real skill to try improving
            it. This tool uses an AI model that sharpens detail and reduces mild blur automatically. There
            are no sliders to figure out and no settings to get wrong: upload the picture, click Enhance,
            and see the result.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">3 Steps to a Clearer Picture</h2>
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
          <h2 className="font-display mb-4 text-xl">Why Photos Come Out Blurry</h2>
          <p className="text-ink-muted leading-relaxed">
            It helps to know why a picture ended up blurry in the first place - not because it changes how
            you use this tool, but because it sets realistic expectations for how much improvement is
            possible.
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
          <h2 className="font-display mb-4 text-xl">What Happens When You Click Enhance</h2>
          <p className="text-ink-muted leading-relaxed">
            Behind the simple button is a real AI model - not a basic sharpen filter - that runs directly
            in your browser. It was trained on a large number of sharp and blurry photo pairs, so it has
            learned what genuinely sharp detail tends to look like, and it uses that knowledge to
            reconstruct a clearer version of your photo. Because this all happens on your own device, your
            picture is never uploaded anywhere - it&apos;s as private as opening the file in any other app
            on your computer or phone.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Sharpening, Enhancing, and Upscaling - What&apos;s the Difference?</h2>
          <p className="text-ink-muted leading-relaxed">
            This page uses <strong>Enhance Quality</strong> by default, which sharpens your photo and keeps
            it at the same size - the right choice if you just want it to look clearer. If you also need
            the picture to be bigger (for printing, or to fill a larger space), switch to{" "}
            <strong>Upscale 2×</strong> or <strong>Upscale 4×</strong> instead, which use the same AI model
            but keep its enlarged output. Our{" "}
            <Link href="/image-upscaler" className="text-primary font-medium">
              image upscaler guide
            </Link>{" "}
            covers choosing between 2x and 4x in more detail.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Be Realistic About What&apos;s Possible</h2>
          <p className="text-ink-muted leading-relaxed">
            A photo that&apos;s only a little soft usually comes back looking genuinely sharp. A photo
            that&apos;s severely out of focus or badly smeared by motion will look somewhat better, but
            it&apos;s not going to turn into a crisp, perfectly focused shot - that detail simply
            wasn&apos;t captured, and no tool can invent it from nothing. Try the tool on your photo and
            judge the before/after slider for yourself; for most everyday &quot;this came out a bit
            blurry&quot; photos, the improvement is real and worth it.
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
              If you took several shots of the same moment, enhance the sharpest one - it&apos;ll give the best
              starting point.
            </li>
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              Zoom into the downloaded result to check the improvement properly, rather than judging from a
              small preview.
            </li>
          </ul>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Frequently Asked Questions</h2>
          <FaqAccordion items={FAQS} />
        </section>

        <section className="mx-auto mt-8 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">More Ways to Improve Your Photos</h2>
          <ul className="flex flex-wrap gap-2">
            <li>
              <Link href="/unblur-images" className="conversion-pill px-4 py-1.5 text-sm">
                Unblur Images
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
              <Link href="/image-to-base64" className="conversion-pill px-4 py-1.5 text-sm">
                Image to Base64 Converter
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
          <h2 className="font-display mb-3 text-xl">Try it on your photo</h2>
          <p className="text-ink-muted mb-6 leading-relaxed">
            It only takes a few seconds, and there&apos;s nothing to lose - it&apos;s free and your photo stays on
            your device.
          </p>
          <Link href="#tool" className="bg-primary text-primary-ink inline-block rounded-full px-6 py-3 font-medium">
            Make My Picture Clear
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
