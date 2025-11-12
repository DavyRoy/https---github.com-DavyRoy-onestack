"use client";

import Link from "next/link";

const card =
  "rounded-xl border border-white/15 bg-white/[0.05] p-3 hover:bg-white/[0.08] transition-colors";

export default function KpiRow({
  items,
}: {
  items: { title: string; value: number; unit?: string; delta?: number; href: string }[];
}) {
  const fmt = (n: number) => n.toLocaleString("ru-RU");

  return (
    <div className="grid gap-3 md:grid-cols-4">
      {items.map((k) => (
        <Link
          key={k.title}
          href={k.href}
          className={card}
          aria-label={`Показатель: ${k.title}`}
        >
          <div className="text-xs text-white/70">{k.title}</div>

          <div className="mt-1 flex items-baseline gap-2">
            <div className="text-xl font-semibold tabular-nums">
              {fmt(k.value)} {k.unit || ""}
            </div>

            {typeof k.delta === "number" && (
              <span
                className={`text-xs rounded-full px-2 py-0.5 ${
                  k.delta >= 0
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "bg-rose-500/20 text-rose-300"
                }`}
              >
                {k.delta >= 0 ? "+" : ""}
                {k.delta}%
              </span>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}