"use client";

import { useRef, useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

function AccordionRow({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: FaqItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  return (
    <div className="border-border border-b">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="group flex w-full items-baseline gap-4 py-6 text-left sm:gap-6"
      >
        <span className="font-readout text-ink-muted w-8 shrink-0 text-xs">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="font-display flex-1 text-lg font-bold transition-opacity group-hover:opacity-70 sm:text-xl">
          {item.question}
        </span>
        <span
          aria-hidden="true"
          className={`text-ink-muted relative h-4 w-4 shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-45" : ""
          }`}
        >
          <span className="absolute top-1/2 left-0 h-[1.5px] w-4 -translate-y-1/2 bg-current" />
          <span className="absolute top-0 left-1/2 h-4 w-[1.5px] -translate-x-1/2 bg-current" />
        </span>
      </button>
      <div
        style={{ maxHeight: isOpen ? (panelRef.current?.scrollHeight ?? 400) : 0 }}
        className="overflow-hidden transition-[max-height] duration-300 ease-out"
      >
        <p ref={panelRef} className="text-ink-muted pt-0 pb-6 pl-12 text-sm leading-relaxed sm:pl-14">
          {item.answer}
        </p>
      </div>
    </div>
  );
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="border-border mt-8 border-t">
      {items.map((item, index) => (
        <AccordionRow
          key={item.question}
          item={item}
          index={index}
          isOpen={openIndex === index}
          onToggle={() => setOpenIndex((current) => (current === index ? null : index))}
        />
      ))}
    </div>
  );
}
