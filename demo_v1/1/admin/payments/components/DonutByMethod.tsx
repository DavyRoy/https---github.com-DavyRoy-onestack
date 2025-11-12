"use client";

import React from "react";
import Link from "next/link";

type Slice = { method: "card" | "invoice" | "cash" | "bank"; share: number };

export default function DonutByMethod({ data }: { data: Slice[] }) {
  const total = data.reduce((a, b) => a + b.share, 0) || 1;
  let acc = 0;

  const colors: Record<Slice["method"], string> = {
    card: "#60a5fa",      // голубой
    invoice: "#facc15",   // жёлтый
    cash: "#34d399",      // зелёный
    bank: "#f97316",      // оранжевый
  };

  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5">
      <div className="text-sm text-white/70 mb-3 font-medium">
        Методы оплаты (доли)
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        {/* SVG круг */}
        <svg viewBox="0 0 120 120" className="w-32 h-32 shrink-0">
          {data.map((s, i) => {
            const start = (acc / total) * 2 * Math.PI;
            acc += s.share;
            const end = (acc / total) * 2 * Math.PI;
            const r = 45,
              cx = 60,
              cy = 60;
            const x1 = cx + r * Math.cos(start),
              y1 = cy + r * Math.sin(start);
            const x2 = cx + r * Math.cos(end),
              y2 = cy + r * Math.sin(end);
            const large = end - start > Math.PI ? 1 : 0;
            const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
            return (
              <path
                key={i}
                d={d}
                fill={colors[s.method]}
                fillOpacity={0.8}
                className="hover:opacity-100 cursor-pointer transition-opacity"
              />
            );
          })}
          <circle cx="60" cy="60" r="25" className="fill-[#0b0b12]" />
        </svg>

        {/* Легенда */}
        <div className="grid gap-1.5 text-sm text-white/80">
          {data.map((s) => (
            <Link
              key={s.method}
              href={`/demo/manager/payments?method=${s.method}`}
              className="flex items-center gap-2 hover:underline"
            >
              <span
                className="inline-block w-3 h-3 rounded-sm"
                style={{ backgroundColor: colors[s.method] }}
              />
              <span className="capitalize">{s.method}</span>
              <span className="text-white/60">
                {(s.share * 100).toFixed(0)}%
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}