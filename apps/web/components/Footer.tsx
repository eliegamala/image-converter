import Link from "next/link";
import { CONVERSIONS } from "@/content/conversions";

const POPULAR = CONVERSIONS.slice(0, 5);

const TOOLS_LINKS = [
  { label: "SVG to PNG Converter", href: "/svg-to-png" },
  { label: "PNG to SVG Converter", href: "/png-to-svg" },
  { label: "Image to Base64 Converter", href: "/image-to-base64" },
  { label: "Base64 to Image Converter", href: "/base64-to-image" },
  { label: "SVG Optimizer", href: "/svg-optimizer" },
  { label: "Favicon Generator", href: "/favicon-generator" },
  { label: "Responsive Image Generator", href: "/responsive-image-generator" },
  { label: "Resize Image to 100KB", href: "/resize-image-to-100kb" },
];

const COMPANY_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="on-dark mt-24 w-full">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <span className="font-display text-lg font-bold">
            cloud<span className="text-primary">vertify</span>
          </span>
          <p className="text-ink-muted mt-3 max-w-xs text-sm leading-relaxed">
            Convert, compress and optimize images online for free. Nothing you upload is stored.
          </p>
        </div>

        <div>
          <h3 className="text-ink-muted text-xs font-medium tracking-[0.2em] uppercase">
            Popular converters
          </h3>
          <ul className="mt-4 flex flex-col gap-2">
            {POPULAR.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/convert/${c.slug}`}
                  className="text-ink-muted hover:text-ink text-sm transition-colors"
                >
                  {c.fromLabel} to {c.toLabel}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/convert" className="text-primary text-sm font-medium">
                View all →
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-ink-muted text-xs font-medium tracking-[0.2em] uppercase">Tools</h3>
          <ul className="mt-4 flex flex-col gap-2">
            {TOOLS_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-ink-muted hover:text-ink text-sm transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-ink-muted text-xs font-medium tracking-[0.2em] uppercase">
            Company
          </h3>
          <ul className="mt-4 flex flex-col gap-2">
            {COMPANY_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-ink-muted hover:text-ink text-sm transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-border border-t">
        <p className="text-ink-muted mx-auto max-w-6xl px-6 py-6 text-xs">
          © {new Date().getFullYear()} cloudvertify. No account required. No images stored.
        </p>
      </div>
    </footer>
  );
}
