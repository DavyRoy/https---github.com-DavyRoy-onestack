"use client";

import * as React from "react";

type Slice = { label: string; value: number };
type Props = {
  data: Slice[];
  onSliceClick?: (s: Slice) => void;
  ariaLabel?: string;
};

export default function DonutChart({ data, onSliceClick, ariaLabel = "Диаграмма долей" }: Props) {
  // фильтруем и нормализуем данные
  const safe = React.useMemo(
    () =>
      (Array.isArray(data) ? data : [])
        .filter((s): s is Slice => !!s && typeof s.value === "number" && isFinite(s.value))
        .map((s) => ({ ...s, value: Math.max(0, s.value) })), // отрицательные -> 0
    [data]
  );

  const total = React.useMemo(
    () => safe.reduce((a, b) => a + (b.value || 0), 0),
    [safe]
  );

  // размеры
  const W = 160;
  const H = 160;
  const CX = W / 2;
  const CY = H / 2;
  const R = 62;
  const R_INNER = 30;

  // детерминированные цвета (HSL по хэшу метки)
  const colorOf = (label: string, i: number) => {
    const h = hashStr(label) % 360;
    const hue = (h + i * 17) % 360; // чуть сдвигаем, если метки совпадут по хэшу
    return `hsl(${hue} 85% 62%)`;
  };

  // путь сектора
  const arcPath = (startAngle: number, endAngle: number) => {
    const x1 = CX + R * Math.cos(startAngle);
    const y1 = CY + R * Math.sin(startAngle);
    const x2 = CX + R * Math.cos(endAngle);
    const y2 = CY + R * Math.sin(endAngle);
    const large = endAngle - startAngle > Math.PI ? 1 : 0;
    return `M ${CX} ${CY} L ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} Z`;
  };

  // обработчик для клавиатуры
  const act = (s: Slice) => onSliceClick?.(s);
  const onKey: React.KeyboardEventHandler<SVGPathElement> = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      (e.currentTarget as any)._slice && onSliceClick?.((e.currentTarget as any)._slice);
      e.preventDefault();
    }
  };

  // аккумулируем углы
  let acc = 0;

  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4">
      <div className="text-sm text-white/70 mb-2">Доли</div>

      <div className="flex items-center gap-4 flex-wrap">
        {/* svg */}
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-40 h-40 shrink-0"
          role="img"
          aria-label={ariaLabel}
          suppressHydrationWarning
        >
          {/* фон-кольцо */}
          <circle cx={CX} cy={CY} r={R} className="fill-white/[0.08]" />

          {/* сектора */}
          {total > 0 &&
            safe.map((s, i) => {
              const start = (acc / total) * 2 * Math.PI;
              acc += s.value;
              const end = (acc / total) * 2 * Math.PI;
              const d = arcPath(start, end);
              const color = colorOf(s.label, i);
              const clickable = !!onSliceClick;

              return (
                <path
                  key={s.label}
                  d={d}
                  fill={color}
                  fillOpacity={0.9}
                  style={{ cursor: clickable ? "pointer" : "default" }}
                  tabIndex={clickable ? 0 : -1}
                  role={clickable ? "button" : undefined}
                  aria-label={`${s.label}: ${Math.round((s.value / total) * 100)}%`}
                  onClick={() => act(s)}
                  onKeyDown={onKey}
                  // сохраняем ссылку для обработчика клавиатуры
                  ref={(el) => {
                    if (el) (el as any)._slice = s;
                  }}
                  className="outline-none focus:opacity-100 hover:opacity-100 opacity-95 transition-opacity"
                />
              );
            })}

          {/* «дырка» + центр */}
          <circle cx={CX} cy={CY} r={R_INNER} className="fill-[#0b0b12]" />
          <text
            x={CX}
            y={CY - 2}
            textAnchor="middle"
            className="fill-white"
            fontSize="12"
            aria-hidden="true"
          >
            {total > 0 ? `${Math.round(total).toLocaleString("ru-RU")}` : "—"}
          </text>
          <text
            x={CX}
            y={CY + 12}
            textAnchor="middle"
            className="fill-white/60"
            fontSize="9"
            aria-hidden="true"
          >
            total
          </text>
        </svg>

        {/* легенда */}
        <ul className="text-sm min-w-0 grid gap-1">
          {total > 0 ? (
            safe.map((s, i) => {
              const pct = Math.round((s.value / total) * 100);
              return (
                <li key={`legend-${s.label}`} className="flex items-center gap-2 min-w-0">
                  <span
                    aria-hidden
                    className="inline-block w-3 h-3 rounded-sm shrink-0"
                    style={{ backgroundColor: colorOf(s.label, i) }}
                  />
                  <span className="truncate text-white/85">{s.label}</span>
                  <span className="text-white/60 shrink-0">{pct}%</span>
                </li>
              );
            })
          ) : (
            <li className="text-white/50">Нет данных</li>
          )}
        </ul>
      </div>
    </section>
  );
}

/* ——— utils ——— */
function hashStr(s: string) {
  // детерминированный маленький хэш (djb2)
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i);
  return Math.abs(h);
}