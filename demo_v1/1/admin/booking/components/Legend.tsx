"use client";

import * as React from "react";

type LegendItem = {
  colorClass: string;   // utility класс заливки (напр. "bg-emerald-500/30")
  borderClass?: string; // опциональная рамка (напр. "border-emerald-400/40")
  label: string;
  title?: string;
};

export default function Legend({
  className = "",
  items = defaultItems,
}: {
  className?: string;
  items?: LegendItem[];
}) {
  const safe = Array.isArray(items) && items.length > 0 ? items : defaultItems;

  return (
    <section
      className={`mt-2 rounded-xl border border-white/10 bg-white/[0.03] p-2 ${className}`}
      aria-label="Условные обозначения"
    >
      <ul className="flex flex-wrap gap-2 md:gap-3 text-xs text-white/70">
        {safe.map((i) => (
          <li key={i.label}>
            <span
              className="inline-flex items-center gap-2 rounded-lg border px-2 py-1 bg-white/0"
              title={i.title || i.label}
            >
              <span
                aria-hidden="true"
                className={`inline-block h-3 w-3 rounded ${i.colorClass} ${i.borderClass ?? "border border-white/20"}`}
              />
              <span className="whitespace-nowrap">{i.label}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

const defaultItems: LegendItem[] = [
  {
    colorClass: "bg-emerald-500/30",
    borderClass: "border border-emerald-400/40",
    label: "Шаблоны слотов (доступно)",
  },
  {
    colorClass: "bg-red-500/30",
    borderClass: "border border-red-400/40",
    label: "Исключения/блэкауты",
  },
  {
    colorClass: "bg-white/20",
    borderClass: "border border-white/30",
    label: "Брони (read-only)",
  },
];