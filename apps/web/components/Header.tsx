"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const TOOLS = [
  { label: "All Converters", href: "/convert" },
  { label: "SVG to PNG", href: "/svg-to-png" },
  { label: "PNG to SVG", href: "/png-to-svg" },
  { label: "Image to Base64", href: "/image-to-base64" },
  { label: "Base64 to Image", href: "/base64-to-image" },
  { label: "SVG Optimizer", href: "/svg-optimizer" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
      <Link href="/" className="font-display text-lg font-extrabold tracking-tight uppercase">
        ImageConvert
      </Link>
      <nav aria-label="Primary" className="flex items-center gap-6">
        <Link
          href="/#tool"
          className="text-ink-muted hover:text-ink text-sm font-medium transition-colors"
        >
          Convert
        </Link>

        <div ref={containerRef} className="relative">
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-haspopup="true"
            className="text-ink-muted hover:text-ink flex items-center gap-1.5 text-sm font-medium transition-colors"
          >
            Tools
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              aria-hidden="true"
              className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            >
              <path d="M1.5 3.5l3.5 3 3.5-3" stroke="currentColor" strokeWidth="1.3" fill="none" />
            </svg>
          </button>
          {open && (
            <div
              role="menu"
              aria-label="Tools"
              className="border-border bg-surface absolute top-full right-0 z-20 mt-3 w-52 rounded-xl border p-2 shadow-xl"
            >
              {TOOLS.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="text-ink-muted hover:text-ink hover:bg-bg block rounded-lg px-3 py-2 text-sm transition-colors"
                >
                  {tool.label}
                </Link>
              ))}
            </div>
          )}
        </div>

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
