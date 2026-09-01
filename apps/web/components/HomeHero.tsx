import { Tool } from "@/components/Tool";

export function HomeHero() {
  return (
    <div className="hero-dark">
      <div className="mx-auto max-w-4xl px-6 pt-16 pb-20 text-center sm:pb-24">
        <span className="glass-pill font-readout text-ink-muted inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] tracking-[0.2em] uppercase">
          <span className="bg-primary h-1.5 w-1.5 rounded-full" />
          Free online image converter
        </span>

        <h1 className="font-display text-ink mt-6 text-4xl leading-[1.1] font-bold tracking-tight sm:text-5xl">
          <span className="reveal-row">
            <span style={{ animationDelay: "0.05s" }}>Convert, compress, and</span>
          </span>
          <span className="reveal-row">
            <span className="font-accent" style={{ animationDelay: "0.18s" }}>
              download
            </span>{" "}
            <span style={{ animationDelay: "0.18s" }}>in one step.</span>
          </span>
        </h1>
        <p className="text-ink-muted mx-auto mt-6 max-w-lg text-lg">
          Pick a format, set a target size, drop in a JPG, PNG, WebP, AVIF, HEIC, GIF, BMP or
          TIFF file - your converted image downloads automatically.
        </p>

        <div className="glass-card on-light mt-10 rounded-3xl p-6 text-left sm:p-8">
          <Tool />
        </div>
      </div>
    </div>
  );
}
