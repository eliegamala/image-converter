"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const TOOLS = [
  { label: "All Converters", href: "/convert" },
  { label: "SVG to PNG", href: "/svg-to-png" },
  { label: "PNG to SVG", href: "/png-to-svg" },
  { label: "Image to Base64", href: "/image-to-base64" },
  { label: "Base64 to Image", href: "/base64-to-image" },
  { label: "SVG Optimizer", href: "/svg-optimizer" },
  { label: "Favicon Generator", href: "/favicon-generator" },
  { label: "Responsive Image Generator", href: "/responsive-image-generator" },
  { label: "Resize Image to 100KB", href: "/resize-image-to-100kb" },
];

/** A page with a folded corner and two opposing arrows - simplified for
 * header scale from the full brand mark (file + bidirectional convert). */
function Mark() {
  return (
    <svg width="22" height="22" viewBox="0 0 32 32" fill="none" aria-hidden="true" className="shrink-0">
      <path
        d="M9 4h10l6 6v18a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M19 4v6h6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path
        d="M10.5 14.5h9l-2.5-2.5M19.5 14.5l-2.5 2.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
      <path
        d="M21.5 20.5h-9l2.5-2.5M12.5 20.5l2.5 2.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      aria-hidden="true"
      className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <path d="M1.5 3.5l3.5 3 3.5-3" stroke="currentColor" strokeWidth="1.3" fill="none" />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d={open ? "M3.5 3.5l9 9M12.5 3.5l-9 9" : "M2.5 4.5h11M2.5 8h11M2.5 11.5h11"}
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

const pillBase = "glass-pill rounded-full";

export function Header() {
  const pathname = usePathname();
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  const isHome = pathname === "/";
  const isToolsActive = pathname === "/convert" || TOOLS.some((t) => t.href === pathname);

  useEffect(() => {
    if (!toolsOpen && !mobileOpen) return;

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (toolsOpen && toolsRef.current && !toolsRef.current.contains(target)) setToolsOpen(false);
      if (mobileOpen && mobileRef.current && !mobileRef.current.contains(target)) setMobileOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setToolsOpen(false);
        setMobileOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [toolsOpen, mobileOpen]);

  return (
    <div className="header-shell sticky top-0 z-50 px-4 py-3 sm:px-6">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3">
        {/* Logo */}
        <Link href="/" className={`${pillBase} group flex items-center gap-2 py-2 pr-4 pl-3`}>
          <span className="text-primary transition-transform duration-300 group-hover:-rotate-6">
            <Mark />
          </span>
          <span className="font-display text-ink flex items-baseline text-base leading-none font-bold">
            cloud
            <span className="text-primary">vertify</span>
          </span>
        </Link>

        {/* Nav pill - desktop only */}
        <nav
          aria-label="Primary"
          className={`${pillBase} hidden items-center gap-1 p-1.5 md:flex`}
        >
          <Link
            href="/#tool"
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              isHome ? "bg-primary text-primary-ink" : "text-ink-muted hover:text-ink"
            }`}
          >
            Convert
          </Link>

          <div ref={toolsRef} className="relative">
            <button
              type="button"
              onClick={() => setToolsOpen((value) => !value)}
              aria-expanded={toolsOpen}
              aria-haspopup="true"
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isToolsActive || toolsOpen ? "bg-primary text-primary-ink" : "text-ink-muted hover:text-ink"
              }`}
            >
              Tools
              <ChevronIcon open={toolsOpen} />
            </button>
            {toolsOpen && (
              <div
                role="menu"
                aria-label="Tools"
                className="border-border bg-surface absolute top-full right-0 z-20 mt-3 w-64 overflow-hidden rounded-2xl border shadow-xl"
              >
                <p className="font-readout text-ink-muted/70 border-border border-b px-3 py-2 text-[10px] tracking-[0.14em] uppercase">
                  Directory
                </p>
                <div className="p-2">
                  {TOOLS.map((tool, index) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      role="menuitem"
                      onClick={() => setToolsOpen(false)}
                      className="hover:bg-bg group flex items-baseline gap-3 rounded-lg px-3 py-2 transition-colors"
                    >
                      <span className="font-readout text-primary/60 w-5 shrink-0 text-[10px]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-ink-muted group-hover:text-ink text-sm transition-colors">
                        {tool.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* CTA - desktop only */}
        <Link
          href="/#tool"
          className="bg-primary text-primary-ink hidden shrink-0 rounded-full px-5 py-3 text-sm font-medium shadow-[0_8px_24px_-10px_rgba(79,57,246,0.55)] md:inline-flex"
        >
          Convert Now
        </Link>

        {/* Mobile menu trigger */}
        <div ref={mobileRef} className="relative md:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            aria-expanded={mobileOpen}
            aria-label="Menu"
            className={`${pillBase} text-ink flex h-11 w-11 items-center justify-center`}
          >
            <MenuIcon open={mobileOpen} />
          </button>
          {mobileOpen && (
            <div className="border-border bg-surface absolute top-full right-0 z-20 mt-3 w-64 overflow-hidden rounded-2xl border shadow-xl">
              <Link
                href="/#tool"
                onClick={() => setMobileOpen(false)}
                className="text-ink hover:bg-bg block px-4 py-3 text-sm font-medium transition-colors"
              >
                Convert
              </Link>
              <p className="font-readout text-ink-muted/70 border-border border-t border-b px-4 py-2 text-[10px] tracking-[0.14em] uppercase">
                Directory
              </p>
              <div className="max-h-64 overflow-y-auto p-2">
                {TOOLS.map((tool, index) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    onClick={() => setMobileOpen(false)}
                    className="hover:bg-bg flex items-baseline gap-3 rounded-lg px-3 py-2 transition-colors"
                  >
                    <span className="font-readout text-primary/60 w-5 shrink-0 text-[10px]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-ink-muted text-sm">{tool.label}</span>
                  </Link>
                ))}
              </div>
              <div className="border-border border-t p-2">
                <Link
                  href="/#tool"
                  onClick={() => setMobileOpen(false)}
                  className="bg-primary text-primary-ink block rounded-xl px-4 py-2.5 text-center text-sm font-medium"
                >
                  Convert Now
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
