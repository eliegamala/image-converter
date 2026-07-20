"use client";

import dynamic from "next/dynamic";

// SVGO's browser build is a genuinely large dependency (a full XML parser
// and CSS engine) - code-split it into its own chunk so the page's content
// and layout can paint before it loads, instead of blocking hydration on it.
const SvgOptimizerTool = dynamic(
  () => import("@/components/SvgOptimizerTool").then((mod) => mod.SvgOptimizerTool),
  {
    ssr: false,
    loading: () => <p className="text-ink-muted text-sm">Loading the optimizer…</p>,
  }
);

export function SvgOptimizerToolClient() {
  return <SvgOptimizerTool />;
}
