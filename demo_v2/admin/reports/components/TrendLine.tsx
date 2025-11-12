"use client";

import React from "react";

type Point = Record<string, number> & { date: string };
type KeyOfPoint = keyof Point;

export default function TrendLine({
  data,
  y1,
  y2,
  onPointClick,
  title = "Тренд",
  height = 200,
  width = 640,
}: {
  data: Point[];
  y1: KeyOfPoint;
  y2?: KeyOfPoint;
  onPointClick?: (p: Point) => void;
  title?: string;
  height?: number;
  width?: number;
}) {
  // Защита от невалидных входных данных
  const safe = Array.isArray(data) ? data.filter(Boolean) : [];
  const padX = 28;
  const padY = 22;

  // Подготовка значений
  const values1 = safe.map((d) => num(d[y1]));
  const values2 = y2 ? safe.map((d) => num(d[y2])) : [];
  const max = Math.max(1, ...values1, ...(values2.length ? values2 : [0]));
  const min = Math.min(0, ...values1, ...(values2.length ? values2 : [0]));
  const span = Math.max(1, max - Math.min(min, max - 1));

  const stepX = safe.length > 1 ? (width - padX * 2) / (safe.length - 1) : 0;
  const scaleY = (v: number) =>
    height - padY - ((v - Math.min(min, max - 1)) / span) * (height - padY * 2);

  // Построение путей
  const pathFor = (key: KeyOfPoint) =>
    safe
      .map((d, i) => {
        const x = padX + i * stepX;
        const y = scaleY(num(d[key]));
        return `${i === 0 ? "M" : "L"}${x},${y}`;
      })
      .join(" ");

  // Заливка под основной линией
  const areaForY1 =
    safe.length > 1
      ? `${pathFor(y1)} L ${padX + (safe.length - 1) * stepX},${height - padY} L ${padX},${
          height - padY
        } Z`
      : "";

  // Пустое состояние
  if (!safe.length) {
    return (
      <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4">
        <div className="text-sm text-white/70 mb-1">{title}</div>
        <div className="text-sm text-white/60">Нет данных для отображения.</div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 min-w-0">
      <div className="text-sm text-white/70 mb-2">{title}</div>

      {/* Локальный скролл только внутри SVG-обёртки */}
      <div className="-mx-2 md:mx-0">
        <div className="overflow-x-auto px-2 md:px-0">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="block w-[640px] h-[220px] max-w-none"
            role="img"
            aria-label={`График ${String(y1)}${y2 ? " vs " + String(y2) : ""}`}
          >
            <defs>
              <linearGradient id="trendFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            {/* Сетка */}
            <g opacity="0.25">
              {/* Y (3 линии) */}
              {[0, 0.5, 1].map((t, i) => {
                const y = padY + (1 - t) * (height - padY * 2);
                return (
                  <line
                    key={`gy-${i}`}
                    x1={padX}
                    x2={width - padX}
                    y1={y}
                    y2={y}
                    stroke="currentColor"
                    strokeOpacity="0.15"
                  />
                );
              })}
              {/* X (каждые 2 точки) */}
              {safe.map((_, i) => {
                if (i % 2 !== 0) return null;
                const x = padX + i * stepX;
                return (
                  <line
                    key={`gx-${i}`}
                    x1={x}
                    x2={x}
                    y1={padY}
                    y2={height - padY}
                    stroke="currentColor"
                    strokeOpacity="0.08"
                  />
                );
              })}
            </g>

            {/* Подписи оси Y: min / max */}
            <text
              x={padX - 6}
              y={scaleY(max)}
              textAnchor="end"
              dominantBaseline="central"
              fontSize="10"
              fill="currentColor"
              opacity="0.7"
            >
              {fmt(max)}
            </text>
            <text
              x={padX - 6}
              y={scaleY(Math.min(min, max - 1))}
              textAnchor="end"
              dominantBaseline="central"
              fontSize="10"
              fill="currentColor"
              opacity="0.7"
            >
              {fmt(Math.min(min, max))}
            </text>

            {/* Заливка и линия y1 */}
            {areaForY1 && <path d={areaForY1} fill="url(#trendFill)" />}
            <path d={pathFor(y1)} fill="none" stroke="currentColor" strokeWidth="2" />

            {/* Вторая линия (полупрозрачная) */}
            {y2 && (
              <path
                d={pathFor(y2)}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                opacity="0.55"
              />
            )}

            {/* Точки y1 */}
            {safe.map((d, i) => {
              const cx = padX + i * stepX;
              const cy = scaleY(num(d[y1]));
              return (
                <g
                  key={d.date}
                  onClick={() => onPointClick?.(d)}
                  className="cursor-pointer"
                >
                  <circle cx={cx} cy={cy} r={3.5} className="fill-white/90" />
                  {/* Ховер-хало — кликабельная область побольше */}
                  <circle cx={cx} cy={cy} r={9} className="fill-white/0 hover:fill-white/10 transition" />
                  {/* Дата под осью X каждые 3 точки */}
                  {i % 3 === 0 && (
                    <text
                      x={cx}
                      y={height - padY + 12}
                      textAnchor="middle"
                      fontSize="9"
                      fill="currentColor"
                      opacity="0.6"
                    >
                      {shortDate(d.date)}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </section>
  );
}

function num(v: unknown) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}
function fmt(n: number) {
  return Math.round(n).toLocaleString("ru-RU");
}
function shortDate(iso: string) {
  // ожидается YYYY-MM-DD
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[3]}.${m[2]}` : iso;
}