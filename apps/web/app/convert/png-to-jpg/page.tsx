import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Footer } from "@/components/Footer";
import { Tool } from "@/components/Tool";

export const metadata: Metadata = {
  title: "PNG to JPG Converter – Convert PNG to JPG Online Free",
  description:
    "Convert PNG to JPG online for free, with optional target sizes like 50KB or 200KB. Understand the tradeoffs - transparency, quality and file size - before you convert.",
  alternates: { canonical: "/convert/png-to-jpg" },
  openGraph: {
    title: "PNG to JPG Converter – Convert PNG to JPG Online Free",
    description:
      "Free PNG to JPG converter with target file size options (20KB-200KB or custom). Learn what changes - transparency, compression, quality - before converting.",
  },
};

const STEPS = [
  { step: "01", title: "Upload your PNG", body: "Drag it in or click Upload Your Image." },
  { step: "02", title: "JPG is already selected", body: "This page defaults Convert To to JPG - change it if you want a different format instead." },
  { step: "03", title: "Pick a size, or Best Quality", body: "Choose 20KB, 50KB, 100KB, 200KB, a custom KB value, or leave it on Best Quality." },
  { step: "04", title: "Click Convert", body: "The JPG downloads automatically the moment it's ready." },
];

const KEEP_PNG_FOR = [
  "Logos, especially ones with flat colors and hard edges",
  "Graphics and icons with sharp, high-contrast boundaries",
  "Screenshots containing text - JPG compression artifacts show up most around sharp text edges",
  "Any image that needs a transparent background",
];

const FAQS = [
  {
    question: "Are JPG files smaller than PNG files?",
    answer:
      "For photographs, almost always yes, often substantially so - JPG's lossy compression is built specifically for photographic detail and noise, which PNG's lossless compression handles far less efficiently. For flat graphics, logos and screenshots with large areas of solid color, the gap is smaller and PNG can occasionally even come out competitive.",
  },
  {
    question: "Why convert PNG to JPG?",
    answer:
      "The most common reason is file size: a PNG holding a photo carries lossless-compression overhead it doesn't need, and JPG's photo-appropriate compression usually shrinks it considerably. JPG is also the most universally supported image format, which matters for older software, print workflows, and platforms with strict upload requirements.",
  },
  {
    question: "Does converting PNG to JPG reduce quality?",
    answer:
      "Yes, by design - JPG uses lossy compression, so some image data is discarded during conversion. Choosing a high quality setting keeps the visual difference relatively small on most photos, but it isn't accurate to call the loss universally invisible; on close inspection, especially around sharp edges or text, compression artifacts can be visible. You control this tradeoff directly through quality or target file size.",
  },
  {
    question: "Can I convert PNG to JPG without losing quality?",
    answer:
      "Not in the strict sense - JPG is a lossy format, so any PNG-to-JPG conversion discards some data. What you can control is how much: a high quality setting (or a generous target file size) keeps the loss minimal and often hard to notice on screen, while a small target size trades more visible quality for a smaller file.",
  },
  {
    question: "When should I keep PNG instead of JPG?",
    answer: "Keep PNG for logos, icons and graphics with sharp edges, screenshots containing text, and any image that needs a transparent background - JPG handles all of these worse than PNG, independent of file size.",
  },
  {
    question: "Does JPG support transparency?",
    answer:
      "No. JPG has no alpha channel at all, so any transparent or semi-transparent areas in your PNG are flattened onto a solid background (white, by default) during conversion. If you need to keep transparency, use our PNG to WebP or PNG to AVIF converters instead, which both support a full alpha channel.",
  },
  {
    question: "Is JPG better for photographs?",
    answer:
      "Generally yes - photographs are exactly the kind of content JPG's lossy compression was designed for (continuous tones, natural noise, no hard edges to preserve), so JPG usually gives you a much smaller file than PNG at a quality level that looks essentially the same on screen.",
  },
  {
    question: "How can I reduce a PNG to 200KB?",
    answer:
      "Upload the PNG above, choose JPG as the output, select the 200KB preset (or type 200 into the custom field), and click Convert. The tool searches for the highest JPG quality that still fits under 200KB, only reducing the image's dimensions if quality reduction alone can't get there. It reports whether the target was actually met, rather than assuming it always will be.",
  },
  {
    question: "How can I reduce a PNG to 50KB?",
    answer:
      "The same process as above, using the 50KB preset instead. A tighter target like 50KB asks for more compression, so on a large or highly detailed source image you may see a more noticeable quality tradeoff, or a small reduction in dimensions if the quality floor is reached before the size target - both are shown in the result so you can judge if it's acceptable.",
  },
  {
    question: "Is PNG or JPG better for websites?",
    answer:
      "It depends on the content, not a blanket rule: JPG for photographs (smaller files, minimal visible difference), PNG for logos, icons, and anything needing transparency (JPG's compression artifacts and lack of alpha channel make it a poor fit for those). Many sites correctly use both formats side by side for exactly this reason.",
  },
  {
    question: "Does converting a JPG back to PNG restore lost quality?",
    answer:
      "No. Converting a JPG to PNG produces a lossless copy from that point forward, but it can't recover detail that JPG compression already discarded - the PNG will simply be a larger file containing the same, already-reduced information as the JPG.",
  },
  {
    question: "Is my PNG uploaded to a server?",
    answer: "The file is processed by cloudvertify's conversion engine for the duration of the conversion and isn't kept afterward.",
  },
];

const webApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "cloudvertify PNG to JPG Converter",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any (web-based)",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "Free online PNG to JPG converter with optional target file sizes (20KB-200KB or custom). Converts PNG images to JPG with configurable quality.",
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
    { "@type": "ListItem", position: 2, name: "Tools", item: "/convert" },
    { "@type": "ListItem", position: 3, name: "Convert PNG to JPG", item: "/convert/png-to-jpg" },
  ],
};

export default function PngToJpgPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="hero-dark">
        <div className="mx-auto max-w-3xl px-6 pt-16 pb-16 text-center">
          <div className="mb-6 flex justify-center">
            <Breadcrumb
              items={[
                { label: "cloudvertify", href: "/" },
                { label: "Tools", href: "/convert" },
                { label: "Convert PNG to JPG" },
              ]}
            />
          </div>
          <h1 className="font-display text-ink text-4xl font-semibold sm:text-5xl">
            Convert PNG to JPG Online for Free
          </h1>
          <p className="text-ink/70 mt-4">
            Convert a PNG image to JPG directly in your browser - free, with no account and no
            software to install. This PNG to JPG converter can also target an exact file size
            (20KB, 50KB, 100KB, 200KB or custom), which makes it useful for upload forms and
            platforms with strict size limits, not just general compression.
          </p>

          <div className="on-light border-border bg-surface mt-10 rounded-2xl border p-6 text-left shadow-xl sm:p-8">
            <Tool defaultFormat="jpeg" defaultSourceFormat="png" />
          </div>
        </div>
      </div>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center gap-4 px-6 py-16">
        <section className="mx-auto w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Why Convert PNG to JPG</h2>
          <p className="text-ink-muted leading-relaxed">
            JPG generally produces smaller files than PNG because it uses lossy compression -
            it discards image data that&apos;s least noticeable to the eye in exchange for a much
            more compact file, while PNG&apos;s lossless compression preserves every pixel exactly
            and pays for that with a larger file. For photographs and other continuous-tone
            images, this tradeoff is usually a good one: JPG can shrink a photo dramatically while
            keeping it looking essentially the same on screen, which is exactly why it&apos;s
            often the better choice when smaller file size matters more than preserving every
            individual pixel.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">How to Convert PNG to JPG</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
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
          <h2 className="font-display mb-4 text-xl">PNG vs JPG</h2>
          <p className="text-ink-muted leading-relaxed">
            <strong>Lossy vs. lossless.</strong> PNG never discards data - decompressing a PNG
            gives back exactly the pixels it started with. JPG is lossy: it throws away detail
            that compresses poorly relative to how visible it is, which is what lets it reach much
            smaller file sizes at the cost of being an approximation rather than an exact copy.
          </p>
          <p className="text-ink-muted mt-4 leading-relaxed">
            <strong>Typical file size differences.</strong> For photographs, JPG is usually
            dramatically smaller - often a fraction of the equivalent PNG&apos;s size at
            visually comparable quality. For flat graphics with large solid-color areas, the gap
            narrows, and PNG&apos;s lossless compression can occasionally be similar in size or
            even smaller.
          </p>
          <p className="text-ink-muted mt-4 leading-relaxed">
            <strong>Photographs</strong> are where JPG clearly wins - continuous tones and natural
            noise compress well under JPG&apos;s lossy algorithm with minimal visible cost.{" "}
            <strong>Logos, text and screenshots</strong> are the opposite case: JPG&apos;s
            compression tends to introduce visible artifacts (a slight blur or &quot;ringing&quot;)
            around the sharp, high-contrast edges these images are full of, while PNG renders them
            exactly.
          </p>
          <p className="text-ink-muted mt-4 leading-relaxed">
            <strong>Transparency</strong> is the other major difference: PNG supports a full alpha
            channel, JPG doesn&apos;t support any transparency at all.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">What Happens to Transparency</h2>
          <p className="text-ink-muted leading-relaxed">
            Converting a PNG to JPG can remove transparency, because JPG doesn&apos;t support
            transparent backgrounds the way PNG does. Any transparent or semi-transparent pixels
            in your source image are flattened onto a solid background - white, by default -
            before the JPG is encoded. If your PNG relies on transparency (a logo or icon meant to
            sit on top of other content, for example), converting it to JPG will bake in a visible
            background rather than preserving the cut-out. In that case,{" "}
            <Link href="/convert/png-to-webp" className="text-primary font-medium">
              converting to WebP
            </Link>{" "}
            or{" "}
            <Link href="/convert/png-to-avif" className="text-primary font-medium">
              AVIF
            </Link>{" "}
            instead keeps the alpha channel intact.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">When to Keep PNG Instead</h2>
          <p className="text-ink-muted leading-relaxed">
            PNG is generally preferable for content where JPG&apos;s lossy compression and lack of
            transparency work against it:
          </p>
          <ul className="text-ink-muted mt-4 flex flex-col gap-2 text-sm leading-relaxed">
            {KEEP_PNG_FOR.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-primary">·</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="text-ink-muted mt-4 leading-relaxed">
            A high JPG quality setting keeps the visual difference on these types of images
            relatively small, but the conversion is still lossy - it&apos;s a matter of degree, not
            a guarantee that quality loss won&apos;t be noticeable, especially if you zoom in or
            the image contains fine text.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Reducing a PNG to a Specific File Size (KB)</h2>
          <p className="text-ink-muted leading-relaxed">
            Beyond general compression, this tool supports targeting an exact file size - 20KB,
            50KB, 100KB, 200KB, or any custom value you enter. This is especially useful for forms
            and platforms that enforce a strict upload size limit rather than just wanting a
            smaller file in general.
          </p>
          <p className="text-ink-muted mt-4 leading-relaxed">
            Here&apos;s what actually happens when you set a target: the tool searches for the
            highest JPG quality that still produces a file at or under your target size. If even
            the lowest reasonable quality setting doesn&apos;t reach the target at the
            image&apos;s original dimensions, it then reduces the image&apos;s dimensions as well,
            since a smaller image needs less data to encode. This means hitting a very small
            target on a large source image can affect both visual quality and pixel dimensions,
            not quality alone.
          </p>
          <p className="text-ink-muted mt-4 leading-relaxed">
            It&apos;s worth being direct about the limits here: not every image can hit an
            arbitrarily small target size while maintaining a specific quality level - there&apos;s
            a genuine floor to how much detail can be discarded before an image stops looking
            like a reasonable photo. When a target truly can&apos;t be met, the tool returns the
            smallest result it found and reports that the target wasn&apos;t met, rather than
            claiming success. In practice, targets like 200KB are very achievable for most photos;
            50KB is tighter and more likely to involve a visible quality tradeoff or a resize,
            particularly on larger or more detailed source images.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Common Use Cases</h2>
          <ul className="text-ink-muted flex flex-col gap-2 text-sm leading-relaxed">
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              Shrinking a PNG photo before uploading it somewhere with a file size limit.
            </li>
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              Converting screenshots or exported photos into the more universally-accepted JPG
              format for forms, print services, or older software.
            </li>
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              Hitting a specific KB target for a profile picture, ID photo upload, or similar form
              with strict size requirements.
            </li>
            <li className="flex gap-2">
              <span className="text-primary">·</span>
              Reducing storage or bandwidth use for large batches of photographic PNGs.
            </li>
          </ul>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">More Ways to Convert</h2>
          <p className="text-ink-muted leading-relaxed">
            If your PNG needs to keep its transparency,{" "}
            <Link href="/convert/png-to-webp" className="text-primary font-medium">
              convert PNG to WebP
            </Link>{" "}
            instead - it supports a full alpha channel and still compresses well. For the smallest
            possible file size on modern browsers,{" "}
            <Link href="/convert/png-to-avif" className="text-primary font-medium">
              convert PNG to AVIF
            </Link>{" "}
            typically beats both. And if you&apos;re starting from a JPG rather than a PNG, our{" "}
            <Link href="/convert/jpg-to-webp" className="text-primary font-medium">
              JPG to WebP converter
            </Link>{" "}
            applies the same target-size approach in the other direction.
          </p>
        </section>

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Frequently Asked Questions</h2>
          <FaqAccordion items={FAQS} />
        </section>

        <section className="mx-auto mt-8 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Related Conversions</h2>
          <ul className="flex flex-wrap gap-2">
            <li>
              <Link href="/convert/png-to-webp" className="conversion-pill px-4 py-1.5 text-sm">
                Convert PNG to WebP
              </Link>
            </li>
            <li>
              <Link href="/convert/png-to-avif" className="conversion-pill px-4 py-1.5 text-sm">
                Convert PNG to AVIF
              </Link>
            </li>
            <li>
              <Link href="/convert/jpg-to-webp" className="conversion-pill px-4 py-1.5 text-sm">
                Convert JPG to WebP
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
