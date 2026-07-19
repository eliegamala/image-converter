import Link from "next/link";

const NAV_LINKS = [
  { label: "Convert", href: "/#tool" },
  { label: "All Converters", href: "/convert" },
];

export function Header() {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
      <Link href="/" className="font-display text-lg font-extrabold tracking-tight uppercase">
        ImageConvert
      </Link>
      <nav aria-label="Primary" className="flex items-center gap-6">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-ink-muted hover:text-ink text-sm font-medium transition-colors"
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/#tool"
          className="bg-primary text-primary-ink rounded-full px-4 py-2 text-sm font-medium"
        >
          Convert Now
        </Link>
      </nav>
    </header>
  );
}
