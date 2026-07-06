"use client";

import { useCallback, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

interface CompareSliderProps {
  beforeSrc: string;
  afterSrc: string;
  naturalWidth: number;
  naturalHeight: number;
  beforeLabel?: string;
  afterLabel?: string;
}

export function CompareSlider({
  beforeSrc,
  afterSrc,
  naturalWidth,
  naturalHeight,
  beforeLabel = "Original",
  afterLabel = "Optimized",
}: CompareSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const percent = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, percent)));
  }, []);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    (event.currentTarget as Element).setPointerCapture(event.pointerId);
    updateFromClientX(event.clientX);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.buttons !== 1) return;
    updateFromClientX(event.clientX);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setPosition((p) => Math.max(0, p - 2));
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      setPosition((p) => Math.min(100, p + 2));
    }
  };

  // Computed from the real image's natural dimensions so the box matches
  // portrait/landscape/square images exactly instead of a fixed 4:3 box
  // (the misalignment bug found in DEVELOPMENT.md 3.5).
  const aspectRatio = naturalWidth && naturalHeight ? naturalWidth / naturalHeight : 4 / 3;

  return (
    <div
      ref={containerRef}
      className="relative w-full touch-none select-none overflow-hidden rounded-xl border border-border bg-black/5"
      style={{ aspectRatio }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
    >
      {/* eslint-disable @next/next/no-img-element -- these are client-side
          blob: object URLs (uploaded/converted in-browser), which next/image
          cannot optimize since they have no remote loader or fixed origin */}
      <img
        src={afterSrc}
        alt={afterLabel}
        className="pointer-events-none absolute inset-0 h-full w-full object-contain"
        draggable={false}
      />
      <img
        src={beforeSrc}
        alt={beforeLabel}
        className="pointer-events-none absolute inset-0 h-full w-full object-contain"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        draggable={false}
      />
      <div
        role="slider"
        aria-label="Comparison slider position"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="absolute inset-y-0 w-0.5 cursor-ew-resize bg-focus"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-1/2 left-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-focus shadow-lg" />
      </div>
      <span className="font-readout absolute top-2 left-2 rounded bg-black/60 px-2 py-1 text-xs text-white">
        {beforeLabel}
      </span>
      <span className="font-readout absolute top-2 right-2 rounded bg-black/60 px-2 py-1 text-xs text-white">
        {afterLabel}
      </span>
    </div>
  );
}
