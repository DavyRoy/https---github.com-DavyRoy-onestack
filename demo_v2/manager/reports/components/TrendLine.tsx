"use client";

import { useMemo } from "react";

type Pt = Record<string, any>;

export default function TrendLine({
  data,
  xKey,
  y1Key,
  y2Key,
  label1,
  label2,
  onPointClick,
}: {
  data: Pt[];
  xKey: string;
  y1Key: string;
  y2Key: string;
  label1: string;
  label2: string;
  onPointClick?: (d: Pt) => void;
}) {
  // Нормализация в координаты SVG
  const W = 560;
  const H = 220;
  const P = 24;

  const safeData = Array.isArray(data) ? data : [];
  const n = safeData.length;

  const xs = useMemo(() => {
    if (n <= 1) return [P];
    return safeData.map((_, i) => P + (i * (W - 2 * P)) / (n - 1));
  }, [n]);

  const y1Vals = safeData.map((d) => Number(d?.[y1Key] ?? 0));
  const y2Vals = safeData.map((d) => Number(d?.[y2Key] ?? 0));
  const maxY = Math.max(...y1Vals, ...y2Vals, 1);

  const yScale = (v: number) => H - P - (v / maxY) * (H - 2 * P);

  const path = (vals: number[]) =>
    vals
      .map((v, i) => `${i === 0 ? "M" : "L"}${xs[i] ?? P},${yScale(v)}`)
      .join(" ");

  // Горизонтальные направляющие (0%, 25%, 50%, 75%, 100%)
  const gridY = [0, 0.25, 0.5, 0.75, 1].map((t) => H - P - t * (H - 2 * P));

  return (
    <section className="rounded-xl border border-white/15 bg-white/[0.05] p-3 md:p-4 backdrop-blur-sm">
      <div className="text-sm font-medium">Выручка и Заказы</div>

      {/* Контейнер рулит адаптивностью: SVG тянется на ширину, высота фикс */}
      <div className="mt-2 overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-[220px]"
          role="img"
          aria-label={`${label1} и ${label2} по периодам`}
        >
          {/* Ось X */}
          <line
            x1={P}
            x2={W - P}
            y1={H - P}
            y2={H - P}
            stroke="currentColor"
            className="opacity-20"
          />
          {/* Горизонтальные гриды */}
          {gridY.map((y, i) => (
            <line
              key={i}
              x1={P}
              x2={W - P}
              y1={y}
              y2={y}
              stroke="currentColor"
              className="opacity-10"
            />
          ))}

          {/* Подписи по X (редко, чтобы не захламлять; показываем 6 максим.) */}
          {safeData.map((d, i) => {
            const step = Math.ceil(n / 6) || 1;
            if (i % step !== 0 && i !== n - 1) return null;
            const x = xs[i] ?? P;
            return (
              <text
                key={`x-${i}`}
                x={x}
                y={H - P + 14}
                textAnchor="middle"
                className="fill-white/60 text-[10px]"
              >
                {String(d?.[xKey] ?? "")}
              </text>
            );
          })}

          {/* Линии серий */}
          {n > 0 && (
            <>
              <path
                d={path(y1Vals)}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="opacity-85"
              />
              <path
                d={path(y2Vals)}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="opacity-60"
                strokeDasharray="4 4"
              />
            </>
          )}

          {/* Точки взаимодействия (кликабельные/фокусируемые) */}
          {safeData.map((d, i) => {
            const x = xs[i] ?? P;
            const y = yScale(y1Vals[i] ?? 0);
            const label = `${label1}: ${y1Vals[i] ?? 0}, ${label2}: ${
              y2Vals[i] ?? 0
            } • ${String(d?.[xKey] ?? "")}`;

            return (
              <g key={`pt-${i}`}>
                {/* более щедрая зона клика */}
                <rect
                  x={(x || 0) - 8}
                  y={Math.min(y, yScale(maxY)) - 14}
                  width={16}
                  height={28}
                  fill="transparent"
                  className="cursor-pointer"
                  onClick={() => onPointClick?.(d)}
                />
                <circle
                  cx={x}
                  cy={y}
                  r={3}
                  className="fill-white/80"
                  role="button"
                  tabIndex={0}
                  aria-label={label}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onPointClick?.(d);
                    }
                  }}
                  onClick={() => onPointClick?.(d)}
                />
                {/* Тонкая вертикальная направляющая при точке */}
                <line
                  x1={x}
                  x2={x}
                  y1={P}
                  y2={H - P}
                  stroke="currentColor"
                  className="opacity-10"
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Легенда */}
      <div className="mt-2 flex items-center gap-3 text-xs text-white/70">
        <span className="inline-flex items-center gap-1">
          <span className="inline-block h-2 w-4 bg-white/80" /> {label1}
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block h-2 w-4 bg-white/60 border border-white/60" /> {label2}
        </span>
      </div>

      {/* Пустое состояние */}
      {n === 0 && (
        <div className="mt-3 text-xs text-white/60">
          Нет данных для отображения.
        </div>
      )}
    </section>
  );
}