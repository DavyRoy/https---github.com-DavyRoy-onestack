"use client";

import * as React from "react";

export type LegendItem = {
  /** utility-класс заливки, напр. "bg-emerald-500/30" */
  colorClass: string;
  /** опциональная рамка, напр. "border-emerald-400/40" */
  borderClass?: string;
  /** подпись элемента */
  label: string;
  /** подсказка по hover (fallback к label) */
  title?: string;
};

const DEFAULT_ITEMS: LegendItem[] = [
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

function cls(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function LegendBase({
  className = "",
  items = DEFAULT_ITEMS,
}: {
  className?: string;
  items?: LegendItem[];
}) {
  const safe = Array.isArray(items) && items.length > 0 ? items : DEFAULT_ITEMS;

  return (
    <section
      className={cls(
        "mt-2 rounded-xl border border-white/10 bg-white/[0.03] p-2",
        className
      )}
      aria-label="Условные обозначения"
    >
      <ul className="flex flex-wrap gap-2 md:gap-3 text-xs text-white/70" role="list">
        {safe.map((i) => (
          <li key={`${i.label}-${i.colorClass}`} role="listitem">
            <span
              className="inline-flex items-center gap-2 rounded-lg border px-2 py-1 bg-white/0"
              title={i.title || i.label}
            >
              <span
                aria-hidden="true"
                className={cls(
                  "inline-block h-3 w-3 rounded",
                  i.colorClass,
                  i.borderClass ?? "border border-white/20"
                )}
              />
              <span className="whitespace-nowrap">{i.label}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default React.memo(LegendBase);