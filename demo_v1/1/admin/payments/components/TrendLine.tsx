"use client";

import React from "react";

type Point = { date: string; authorized: number; captured: number; paid: number; failed: number };
type Metric = "authorized" | "captured" | "paid" | "failed";

type Props = {
  data: Point[];
  metric?: Metric;                // начальная метрика
  onPointClick?: (p: Point) => void;
};

export default function TrendLine({ data, metric = "paid", onPointClick }: Props) {
  const [currentMetric, setCurrentMetric] = React.useState<Metric>(metric);

  React.useEffect(() => {
    // если родитель изменит проп metric — синхронизируем
    setCurrentMetric(metric);
  }, [metric]);

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4">
        <div className="text-sm text-white/70 mb-2">Тренд</div>
        <div className="text-sm text-white/60">Нет данных для отображения.</div>
      </section>
    );
  }

  // базовые размеры (вьюбокс), а реальная ширина управляется CSS
  const width = 560;
  const height = 200;
  const padX = 28;
  const padY = 24;

  const values = data.map(d => d[currentMetric]);
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = Math.max(1, max - Math.min(min, max - 1)); // защита от деления на 0

  const stepX = (width - padX * 2) / Math.max(1, data.length - 1);
  const scaleY = (v: number) =>
    height - padY - ((v - Math.min(min, max - 1)) / range) * (height - padY * 2);

  // путь линии
  const pathD = data
    .map((d, i) => {
      const x = padX + i * stepX;
      const y = scaleY(d[currentMetric]);
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");

  // путь для заливки (замыкаем на низ)
  const areaD = `${pathD} L ${padX + (data.length - 1) * stepX},${height - padY} L ${padX},${
    height - padY
  } Z`;

  const buttons: Metric[] = ["authorized", "captured", "paid", "failed"];

  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-white/70">
          Тренд: <span className="text-white/90">{labelOf(currentMetric)}</span>
        </div>
        <div className="flex gap-1">
          {buttons.map((m) => (
            <button
              key={m}
              onClick={() => setCurrentMetric(m)}
              className={`px-2 py-1 rounded-md text-xs border transition ${
                m === currentMetric
                  ? "bg-white text-black border-white"
                  : "border-white/20 text-white/70 hover:bg-white/[0.06]"
              }`}
            >
              {labelOf(m)}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full min-w-[480px] h-[220px]"
          role="img"
          aria-label={`График метрики ${labelOf(currentMetric)}`}
        >
          {/* defs: градиент заливки */}
          <defs>
            <linearGradient id="trendFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* сетка (по X каждые 2 точки, по Y — 3 линии) */}
          <g opacity="0.25">
            {/* Y горизонтальные */}
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

            {/* X вертикальные */}
            {data.map((_, i) => {
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

          {/* подписи по Y: min / max */}
          <text
            x={padX - 6}
            y={scaleY(max)}
            textAnchor="end"
            dominantBaseline="central"
            fontSize="10"
            fill="currentColor"
            opacity="0.7"
          >
            {fmt(values.length > 1 ? max : Math.round(max))}
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

          {/* заливка под кривой */}
          <path d={areaD} fill="url(#trendFill)" />

          {/* сама линия */}
          <path d={pathD} fill="none" stroke="currentColor" strokeWidth="2" />

          {/* точки */}
          {data.map((d, i) => {
            const x = padX + i * stepX;
            const y = scaleY(d[currentMetric]);
            return (
              <g key={d.date} onClick={() => onPointClick?.(d)} className="cursor-pointer">
                <circle cx={x} cy={y} r={3.5} className="fill-white/85" />
                <circle cx={x} cy={y} r={7} className="fill-white/0 hover:fill-white/10 transition" />
                {/* подпись даты каждые 3 точки (чтобы не захламлять) */}
                {i % 3 === 0 && (
                  <text
                    x={x}
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
    </section>
  );
}

function labelOf(m: "authorized" | "captured" | "paid" | "failed") {
  switch (m) {
    case "authorized":
      return "authorized";
    case "captured":
      return "captured";
    case "paid":
      return "paid";
    case "failed":
      return "failed";
  }
}

function shortDate(iso: string) {
  // ожидаем YYYY-MM-DD
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return iso;
  return `${m[3]}.${m[2]}`;
}

function fmt(n: number) {
  return Math.round(n).toLocaleString("ru-RU");
}