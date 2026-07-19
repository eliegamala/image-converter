import { Header } from "@/components/Header";
import { Tool } from "@/components/Tool";

export function HomeHero() {
  return (
    <div className="hero-dark">
      <Header />

      <div className="mx-auto max-w-4xl px-6 pt-4 pb-20 text-center sm:pb-24">
        <p className="font-readout text-ink-muted text-[11px] tracking-[0.3em] uppercase">
          Free online image converter
        </p>
        <h1 className="font-display text-ink mt-4 text-4xl leading-[1.05] font-extrabold uppercase tracking-tight sm:text-5xl">
          <span className="reveal-row">
            <span style={{ animationDelay: "0.05s" }}>Convert, compress, and</span>
          </span>
          <span className="reveal-row">
            <span className="font-accent normal-case" style={{ animationDelay: "0.18s" }}>
              download
            </span>{" "}
            <span style={{ animationDelay: "0.18s" }}>in one step.</span>
          </span>
        </h1>
        <p className="text-ink-muted mx-auto mt-6 max-w-lg text-lg">
          Pick a format, set a target size, drop in a JPG, PNG, WebP, AVIF, HEIC, GIF, BMP or
          TIFF file - your converted image downloads automatically.
        </p>

        <div className="on-light border-border bg-surface mt-10 rounded-2xl border p-6 text-left shadow-xl sm:p-8">
          <Tool />
        </div>
      </div>
    </div>
  );
}
