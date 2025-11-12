"use client";

import * as React from "react";
import Link from "next/link";

type Slice = { method: "card" | "invoice" | "cash" | "bank"; share: number };

type Props = {
  data: Slice[];
};

export default function DonutByMethod({ data }: Props) {
  // Отфильтруем некорректные значения и нормализуем к сумме 1
  const cleaned = React.useMemo(
    () => (Array.isArray(data) ? data.filter((s) => s && s.share > 0) : []),
    [data]
  );
  const sum = cleaned.reduce((a, b) => a + b.share, 0);
  const normalized = sum > 0 ? cleaned.map((s) => ({ ...s, share: s.share / sum })) : [];

  const colors: Record<Slice["method"], string> = {
    card: "#60a5fa",    // голубой
    invoice: "#facc15", // жёлтый
    cash: "#34d399",    // зелёный
    bank: "#f97316",    // оранжевый
  };

  const labels: Record<Slice["method"], string> = {
    card: "Банковская карта",
    invoice: "Счёт / инвойс",
    cash: "Наличные",
    bank: "Банк. перевод",
  };

  // Небольшая заглушка
  if (normalized.length === 0) {
    return (
      <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5">
        <div className="text-sm text-white/70 mb-3 font-medium">Методы оплаты (доли)</div>
        <div className="text-sm text-white/60">Нет данных для отображения.</div>
      </section>
    );
  }

  // Геометрия пончика
  const R = 45;
  const CX = 60;
  const CY = 60;

  let acc = 0; // накопитель угла (в долях 0..1)

  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5">
      <div className="text-sm text-white/70 mb-3 font-medium">Методы оплаты (доли)</div>

      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        {/* SVG-пончик */}
        <svg
          viewBox="0 0 120 120"
          className="w-32 h-32 shrink-0"
          role="img"
          aria-label="Диаграмма распределения платежей по методам"
        >
          {normalized.map((s, i) => {
            const start = acc * 2 * Math.PI;
            acc += s.share;
            const end = acc * 2 * Math.PI;

            // дуга сектора
            const x1 = CX + R * Math.cos(start);
            const y1 = CY + R * Math.sin(start);
            const x2 = CX + R * Math.cos(end);
            const y2 = CY + R * Math.sin(end);
            const largeArc = end - start > Math.PI ? 1 : 0;
            const d = `M ${CX} ${CY} L ${x1} ${y1} A ${R} ${R} 0 ${largeArc} 1 ${x2} ${y2} Z`;

            const pct = Math.round(s.share * 100);

            return (
              <g key={`${s.method}-${i}`}>
                <path
                  d={d}
                  fill={colors[s.method]}
                  fillOpacity={0.85}
                  className="transition-opacity hover:opacity-100 focus:opacity-100 cursor-default"
                >
                  <title>{`${labels[s.method]} — ${pct}%`}</title>
                </path>
              </g>
            );
          })}
          {/* «дырка» пончика */}
          <circle cx={CX} cy={CY} r="25" className="fill-[#0b0b12]" />
        </svg>

        {/* Легенда */}
        <div className="grid gap-1.5 text-sm text-white/80">
          {normalized.map((s) => {
            const pct = Math.round(s.share * 100);
            return (
              <Link
                key={s.method}
                href={`/demo/manager/payments?method=${s.method}`}
                className="flex items-center gap-2 hover:underline focus:underline rounded focus:outline-none focus:ring-2 focus:ring-white/20 px-1 -mx-1"
                title={`Фильтровать платежи по: ${labels[s.method]}`}
              >
                <span
                  aria-hidden
                  className="inline-block w-3 h-3 rounded-sm"
                  style={{ backgroundColor: colors[s.method] }}
                />
                <span className="truncate">{labels[s.method]}</span>
                <span className="text-white/60">{pct}%</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}