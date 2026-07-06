import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Tool } from "@/components/Tool";
import { CONVERSIONS, getConversionBySlug } from "@/content/conversions";

interface PageProps {
  params: Promise<{ pair: string }>;
}

export function generateStaticParams() {
  return CONVERSIONS.map((c) => ({ pair: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { pair } = await params;
  const conversion = getConversionBySlug(pair);
  if (!conversion) return {};

  return {
    title: conversion.title,
    description: conversion.intro,
    alternates: { canonical: `/convert/${conversion.slug}` },
    openGraph: {
      title: conversion.title,
      description: conversion.intro,
    },
  };
}

export default async function ConversionPage({ params }: PageProps) {
  const { pair } = await params;
  const conversion = getConversionBySlug(pair);
  if (!conversion) notFound();

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
      { "@type": "ListItem", position: 1, name: "ImageConvert", item: "/" },
      {
        "@type": "ListItem",
        position: 2,
        name: conversion.title,
        item: `/convert/${conversion.slug}`,
      },
    ],
  };

  const related = CONVERSIONS.filter(
    (c) => c.slug !== conversion.slug && (c.from === conversion.from || c.to === conversion.to)
  ).slice(0, 4);

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <header className="mb-10 flex items-center justify-between">
        <Link href="/" className="font-display text-lg">
          ImageConvert
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex flex-1 flex-col items-center gap-4">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-display text-3xl sm:text-4xl">{conversion.title}</h1>
          <p className="text-ink-muted mt-3">{conversion.intro}</p>
        </div>

        <Tool defaultFormat={conversion.to} lockFormat />

        <section className="mx-auto mt-12 w-full max-w-2xl">
          <h2 className="font-display mb-4 text-xl">Frequently asked questions</h2>
          <dl className="flex flex-col gap-4">
            {conversion.faqs.map((faq) => (
              <div key={faq.question}>
                <dt className="font-medium">{faq.question}</dt>
                <dd className="text-ink-muted mt-1 text-sm">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        {related.length > 0 && (
          <section className="mx-auto mt-8 w-full max-w-2xl">
            <h2 className="font-display mb-4 text-xl">Related conversions</h2>
            <ul className="flex flex-wrap gap-2">
              {related.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/convert/${c.slug}`}
                    className="rounded-full border border-border px-4 py-1.5 text-sm text-ink-muted hover:text-ink"
                  >
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
