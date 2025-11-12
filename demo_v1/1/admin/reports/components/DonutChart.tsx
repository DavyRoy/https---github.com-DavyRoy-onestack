"use client";

import React from "react";

type Slice = { label: string; value: number };
type Props = {
  data: Slice[];
  onSliceClick?: (s: Slice) => void;
};

export default function DonutChart({ data, onSliceClick }: Props) {
  const total = React.useMemo(
    () => (Array.isArray(data) ? data.reduce((a, b) => a + (b.value || 0), 0) : 0),
    [data]
  );
  // гарантируем, что рисуем только при валидных данных
  const safe = Array.isArray(data) ? data.filter((s) => s && isFinite(s.value)) : [];
  const W = 140;
  const H = 140;
  const CX = 70;
  const CY = 70;
  const R = 55;
  const R_INNER = 28;

  // накапливатель угла — детерминированный, без рандома
  let acc = 0;

  // путь сектора
  const arcPath = (startAngle: number, endAngle: number) => {
    const x1 = CX + R * Math.cos(startAngle);
    const y1 = CY + R * Math.sin(startAngle);
    const x2 = CX + R * Math.cos(endAngle);
    const y2 = CY + R * Math.sin(endAngle);
    const large = endAngle - startAngle > Math.PI ? 1 : 0;
    return `M ${CX} ${CY} L ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} Z`;
  };

  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4">
      <div className="text-sm text-white/70 mb-2">Доли</div>

      <div className="flex items-center gap-4">
        {/* suppressHydrationWarning — чтобы игнорить разницу, если какой-то плагин/браузер вставит <title> внутрь SVG */}
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-36 h-36 shrink-0"
          role="img"
          aria-label="Диаграмма долей"
          suppressHydrationWarning
        >
          {/* фон (по сути donut) */}
          <circle cx={CX} cy={CY} r={R} className="fill-white/[0.08]" />
          {/* сектора */}
          {safe.map((s) => {
            const start = (acc / Math.max(total, 1)) * 2 * Math.PI;
            acc += s.value;
            const end = (acc / Math.max(total, 1)) * 2 * Math.PI;
            const d = arcPath(start, end);
            return (
              <path
                key={s.label} // стабильный ключ
                d={d}
                className="fill-white/80 hover:fill-white cursor-pointer transition-colors"
                // никаких title/tooltip внутри SVG — это частая причина расхождений
                onClick={() => onSliceClick?.(s)}
              />
            );
          })}
          {/* «дырка» */}
          <circle cx={CX} cy={CY} r={R_INNER} className="fill-[#0b0b12]" />
        </svg>

        {/* легенда/подписи — вне svg, чтобы локализация не ломала гидрацию */}
        <ul className="text-sm min-w-0">
          {safe.map((s) => {
            const pct = total > 0 ? Math.round((s.value / total) * 100) : 0;
            return (
              <li key={`legend-${s.label}`} className="text-white/80 truncate">
                {s.label} — {pct}%
              </li>
            );
          })}
          {safe.length === 0 && (
            <li className="text-white/50">Нет данных</li>
          )}
        </ul>
      </div>
    </section>
  );
}