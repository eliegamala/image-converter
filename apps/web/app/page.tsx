import type { Metadata } from "next";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Tool } from "@/components/Tool";
import { CONVERSIONS } from "@/content/conversions";

export const metadata: Metadata = {
  title: "Compress and convert images to JPEG, PNG, WebP, or AVIF",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-8">
      <header className="mb-10 flex items-center justify-between">
        <span className="font-display text-lg">ImageConvert</span>
        <ThemeToggle />
      </header>

      <main className="flex flex-1 flex-col items-center gap-4">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-display text-3xl sm:text-4xl">Precision image optimization</h1>
          <p className="text-ink-muted mt-3">
            Convert to JPEG, PNG, WebP, or AVIF. Hit an exact target size, or let quality lead.
            Nothing you upload is ever stored.
          </p>
        </div>
        <Tool />

        <section className="mx-auto mt-16 w-full max-w-3xl">
          <h2 className="font-display mb-4 text-center text-lg">Popular conversions</h2>
          <ul className="flex flex-wrap justify-center gap-2">
            {CONVERSIONS.map((c) => (
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
      </main>
    </div>
  );
}
