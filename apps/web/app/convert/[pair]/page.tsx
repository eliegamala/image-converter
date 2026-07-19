import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
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

  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="hero-dark">
        <Header />
        <div className="mx-auto max-w-3xl px-6 pt-2 pb-16 text-center">
          <div className="mb-6 flex justify-center">
            <Breadcrumb
              items={[
                { label: "ImageConvert", href: "/" },
                { label: "Tools", href: "/convert" },
                { label: conversion.title },
              ]}
            />
          </div>
          <h1 className="font-display text-ink text-4xl font-semibold sm:text-5xl">
            {conversion.title}
          </h1>
          <p className="text-ink/70 mt-4">{conversion.intro}</p>

          <div className="on-light border-border bg-surface mt-10 rounded-2xl border p-6 text-left shadow-xl sm:p-8">
            <Tool
              defaultFormat={conversion.to}
              defaultSourceFormat={conversion.from}
              lockFormat
            />
          </div>
        </div>
      </div>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center gap-4 px-6 py-16">
        <section className="mx-auto w-full max-w-2xl">
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
                  <Link href={`/convert/${c.slug}`} className="conversion-pill dashed-pill px-4 py-1.5 text-sm">
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
