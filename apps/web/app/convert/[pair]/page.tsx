import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Footer } from "@/components/Footer";
import { Tool } from "@/components/Tool";
import { CONVERSIONS, getConversionBySlug } from "@/content/conversions";

interface PageProps {
  params: Promise<{ pair: string }>;
}

// These three have dedicated, more heavily SEO-optimized page files
// (app/convert/png-to-webp, png-to-jpg, png-to-avif) - Next.js resolves a
// static route over this dynamic one automatically, so excluding them here
// just avoids this catch-all also trying to pre-render the same paths.
const DEDICATED_PAGE_SLUGS = new Set(["png-to-webp", "png-to-jpg", "png-to-avif"]);

export function generateStaticParams() {
  return CONVERSIONS.filter((c) => !DEDICATED_PAGE_SLUGS.has(c.slug)).map((c) => ({ pair: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { pair } = await params;
  const conversion = getConversionBySlug(pair);
  if (!conversion) return {};

  return {
    title: conversion.seoTitle,
    description: conversion.metaDescription,
    alternates: { canonical: `/convert/${conversion.slug}` },
    openGraph: {
      title: conversion.seoTitle,
      description: conversion.metaDescription,
    },
  };
}

export default async function ConversionPage({ params }: PageProps) {
  const { pair } = await params;
  const conversion = getConversionBySlug(pair);
  if (!conversion) notFound();

  const webApplicationJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `cloudvertify ${conversion.fromLabel} to ${conversion.toLabel} Converter`,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any (web-based)",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: conversion.metaDescription,
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: conversion.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "cloudvertify", item: "/" },
      { "@type": "ListItem", position: 2, name: "Tools", item: "/convert" },
      {
        "@type": "ListItem",
        position: 3,
        name: conversion.title,
        item: `/convert/${conversion.slug}`,
      },
    ],
  };

  const related = CONVERSIONS.filter(
    (c) => c.slug !== conversion.slug && (c.from === conversion.from || c.to === conversion.to)
  ).slice(0, 4);

  const STEPS = [
    { step: "01", title: `Upload your ${conversion.fromLabel}`, body: "Drag it in or click Upload Your Image." },
    {
      step: "02",
      title: `${conversion.toLabel} is already selected`,
      body: `This page defaults Convert To to ${conversion.toLabel} - change it if you want a different format instead.`,
    },
    {
      step: "03",
      title: "Optionally set a target size",
      body: "Leave it on Best Quality, or pick a KB target (20/50/100/200KB or custom) if you need a specific file size.",
    },
    { step: "04", title: "Click Convert", body: "The file downloads automatically as soon as it's ready." },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationJsonLd) }}
      />
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
                { label: conversion.title },
              ]}
            />
          </div>
          <h1 className="font-display text-ink text-4xl font-semibold sm:text-5xl">
            {conversion.h1}
          </h1>
          <p className="text-ink/70 mt-4">{conversion.intro}</p>

          <div className="on-light border-border bg-surface mt-10 rounded-2xl border p-6 text-left shadow-xl sm:p-8">
            <Tool
              defaultFormat={conversion.to}
              defaultSourceFormat={conversion.from}
            />
          </div>
        </div>
      </div>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center gap-4 px-6 py-16">
        <section className="mx-auto w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">
            How to Convert {conversion.fromLabel} to {conversion.toLabel}
          </h2>
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

        {conversion.comparisonTitle && conversion.comparisonParagraphs && (
          <section className="mx-auto mt-12 w-full max-w-2xl">
            <h2 className="font-display mb-4 text-xl">{conversion.comparisonTitle}</h2>
            {conversion.comparisonParagraphs.map((p) => (
              <p key={p.label} className="text-ink-muted mt-4 leading-relaxed first:mt-0">
                <strong>{p.label}</strong> {p.text}
              </p>
            ))}
          </section>
        )}

        {conversion.useCases && conversion.useCases.length > 0 && (
          <section className="mx-auto mt-12 w-full max-w-2xl">
            <h2 className="font-display mb-4 text-xl">Common Use Cases</h2>
            <ul className="text-ink-muted flex flex-col gap-2 text-sm leading-relaxed">
              {conversion.useCases.map((useCase) => (
                <li key={useCase} className="flex gap-2">
                  <span className="text-primary">·</span>
                  {useCase}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Frequently Asked Questions</h2>
          <FaqAccordion items={conversion.faqs} />
        </section>

        {related.length > 0 && (
          <section className="mx-auto mt-8 w-full max-w-2xl">
            <h2 className="font-display mb-4 text-xl">Related Conversions</h2>
            <ul className="flex flex-wrap gap-2">
              {related.map((c) => (
                <li key={c.slug}>
                  <Link href={`/convert/${c.slug}`} className="conversion-pill px-4 py-1.5 text-sm">
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
