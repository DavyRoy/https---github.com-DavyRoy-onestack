"use client";

import * as React from "react";

type Cell = { dow: number; hour: number; value: number };

export default function HeatmapGrid({ data }: { data: Cell[] }) {
  // Часы 09..20
  const hours = React.useMemo(() => Array.from({ length: 12 }, (_, i) => 9 + i), []);
  // Дни недели 1..7 (Пн..Вс)
  const dows = [1, 2, 3, 4, 5, 6, 7];
  const dowTitle = (d: number) => ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"][d - 1];

  // Индекс для O(1) поиска значения
  const index = React.useMemo(() => {
    const m = new Map<string, number>();
    (Array.isArray(data) ? data : []).forEach((x) => {
      const k = `${x.dow}|${x.hour}`;
      // клампим 0..1 и игнорируем NaN
      const v = Math.max(0, Math.min(1, Number.isFinite(x.value) ? x.value : 0));
      m.set(k, v);
    });
    return m;
  }, [data]);

  const getVal = (d: number, h: number) => index.get(`${d}|${h}`) ?? 0;

  // Палитра: 0 → тихо, 1 → максимум (белая непрозрачность)
  const bgFor = (v: number) => {
    const alpha = Math.round(6 + v * 80); // 6..86
    return `rgba(255,255,255,${alpha / 100})`;
  };

  // Пустое состояние
  const hasAny = React.useMemo(() => {
    for (const v of index.values()) if (v > 0) return true;
    return false;
  }, [index]);

  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-3 md:p-4">
      <div className="text-sm text-white/70 mb-2">Загрузка (часы × дни)</div>

      <div className="overflow-x-auto">
        <div className="min-w-[560px]">
          <div
            className="grid"
            style={{ gridTemplateColumns: `56px repeat(${hours.length}, minmax(32px, 1fr))` }}
            role="table"
            aria-label="Тепловая карта загрузки по дням и часам"
          >
            {/* Левая верхняя пустая ячейка */}
            <div className="h-8" role="columnheader" />

            {/* Шапка часов */}
            {hours.map((h) => (
              <div
                key={`h-${h}`}
                className="h-8 text-center text-[11px] sm:text-xs text-white/70 border-b border-white/10 sticky top-0 bg-[#0b0b12] z-10"
                role="columnheader"
                aria-label={`${h}:00`}
              >
                {h}:00
              </div>
            ))}

            {/* Строки по дням */}
            {dows.map((d) => (
              <React.Fragment key={`row-${d}`}>
                {/* Лейбл дня */}
                <div
                  className="text-[11px] sm:text-xs text-white/70 py-1 pr-2 sticky left-0 bg-[#0b0b12] z-10 border-r border-white/10 flex items-center"
                  role="rowheader"
                  aria-label={dowTitle(d)}
                >
                  {dowTitle(d)}
                </div>

                {/* Клетки */}
                {hours.map((h) => {
                  const v = getVal(d, h);
                  const title = `${dowTitle(d)} ${h}:00 — ${(v * 100).toFixed(0)}%`;
                  return (
                    <div
                      key={`cell-${d}-${h}`}
                      className="h-6 sm:h-7 rounded-[3px] border border-white/[0.06]"
                      style={{ backgroundColor: bgFor(v) }}
                      title={title}
                      role="cell"
                      aria-label={title}
                    />
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Легенда */}
      <div className="mt-3 flex items-center gap-2 text-xs text-white/60">
        <span>Нагрузка:</span>
        <span className="inline-flex h-3 w-12 rounded-sm" style={{ backgroundColor: bgFor(0.05) }} />
        <span className="opacity-70">низкая</span>
        <span className="inline-flex h-3 w-12 rounded-sm" style={{ backgroundColor: bgFor(0.5) }} />
        <span className="opacity-70">средняя</span>
        <span className="inline-flex h-3 w-12 rounded-sm" style={{ backgroundColor: bgFor(0.95) }} />
        <span className="opacity-70">высокая</span>
        {!hasAny && <span className="ml-2 opacity-60">(данных нет)</span>}
      </div>
    </section>
  );
}