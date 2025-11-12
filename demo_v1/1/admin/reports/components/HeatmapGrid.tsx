"use client";

import React from "react";

type Cell = { dow: number; hour: number; value: number };

export default function HeatmapGrid({
  data,
}: {
  data: Cell[];
}) {
  // Часы 09..20
  const hours = React.useMemo(() => Array.from({ length: 12 }, (_, i) => 9 + i), []);
  // Дни недели 1..7 (Пн..Вс)
  const dows = [1, 2, 3, 4, 5, 6, 7];
  const dowTitle = (d: number) => ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"][d - 1];

  const getVal = (d: number, h: number) =>
    data.find((x) => x.dow === d && x.hour === h)?.value ?? 0;

  // Палитра: 0 → тихо, 1 → максимум. Чуть больше контраста на верхнем конце.
  const bgFor = (v: number) => {
    // 0..1 → 6%..86% непрозр.
    const alpha = Math.round(6 + v * 80); // 6..86
    return `rgba(255,255,255,${alpha / 100})`;
  };

  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-3 md:p-4">
      <div className="text-sm text-white/70 mb-2">Загрузка (часы × дни)</div>

      {/* Горизонтальный скролл только для сетки */}
      <div className="overflow-x-auto">
        {/* 
          Ставим минимальную ширину сетки, чтобы на узких экранах
          включался горизонтальный скролл, а не ломалась вёрстка.
        */}
        <div className="min-w-[560px]">
          {/* Шапка часов + сетка; делаем «липкую» шапку для удобства при горизонтальном скролле */}
          <div
            className="grid"
            style={{
              // Узкая первая колонка под лейблы дней + равные колонки для часов
              gridTemplateColumns: `56px repeat(${hours.length}, minmax(32px, 1fr))`,
            }}
          >
            {/* Пустая ячейка в левом верхнем углу */}
            <div className="h-8" />

            {/* Часы (шапка) */}
            {hours.map((h) => (
              <div
                key={`h-${h}`}
                className="
                  h-8 text-center text-[11px] sm:text-xs text-white/70
                  border-b border-white/10
                  sticky top-0 bg-[#0b0b12] z-10
                "
              >
                {h}:00
              </div>
            ))}

            {/* Строки по дням */}
            {dows.map((d) => (
              <React.Fragment key={`row-${d}`}>
                {/* Лейбл дня слева (тоже «липкий» при горизонтальном скролле) */}
                <div
                  className="
                    text-[11px] sm:text-xs text-white/70
                    py-1 pr-2
                    sticky left-0 bg-[#0b0b12] z-10
                    border-r border-white/10
                    flex items-center
                  "
                >
                  {dowTitle(d)}
                </div>

                {/* Клетки-значения */}
                {hours.map((h) => {
                  const v = getVal(d, h);
                  return (
                    <div
                      key={`cell-${d}-${h}`}
                      className="h-6 sm:h-7 rounded-[3px] border border-white/[0.06]"
                      style={{ backgroundColor: bgFor(v) }}
                      title={`${dowTitle(d)} ${h}:00 — ${(v * 100).toFixed(0)}%`}
                    />
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Легенда (компактная, не ломает мобильную вёрстку) */}
      <div className="mt-3 flex items-center gap-2 text-xs text-white/60">
        <span>Нагрузка:</span>
        <span className="inline-flex h-3 w-12 rounded-sm" style={{ backgroundColor: bgFor(0.05) }} />
        <span className="opacity-70">низкая</span>
        <span className="inline-flex h-3 w-12 rounded-sm" style={{ backgroundColor: bgFor(0.5) }} />
        <span className="opacity-70">средняя</span>
        <span className="inline-flex h-3 w-12 rounded-sm" style={{ backgroundColor: bgFor(0.95) }} />
        <span className="opacity-70">высокая</span>
      </div>
    </section>
  );
}