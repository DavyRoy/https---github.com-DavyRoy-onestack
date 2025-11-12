"use client";

import * as React from "react";

type Row = Record<string, any>;

export default function BarStack({
  data,
  labelKey = "label",
  valueKey = "value",
  onBarClick,
}: {
  data: Row[];
  labelKey?: string;
  valueKey?: string;
  onBarClick?: (row: Row) => void;
}) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 text-sm text-white/60">
        Нет данных для отображения.
      </section>
    );
  }

  const max = Math.max(...data.map((r) => Number(r[valueKey]) || 0), 1);

  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 min-w-0">
      <div className="text-sm text-white/70 mb-2 font-medium">Разрез</div>

      <div className="grid gap-2 min-w-0">
        {data.map((r, i) => {
          const v = Number(r[valueKey]) || 0;
          const pct = Math.round((v / max) * 100);
          const label = String(r[labelKey] ?? `Row ${i + 1}`);
          return (
            <div key={i} className="grid gap-1 min-w-0">
              <div className="flex justify-between items-center text-xs text-white/60 min-w-0">
                <span className="truncate">{label}</span>
                <span className="text-white/50 ml-2">{pct}%</span>
              </div>

              <div className="relative h-6 rounded-lg bg-white/[0.06] overflow-hidden">
                <button
                  type="button"
                  onClick={() => onBarClick?.(r)}
                  className="absolute left-0 top-0 h-full bg-white/80 transition-[width,background-color] duration-700 ease-out hover:bg-white"
                  style={{ width: `${pct}%` }}
                  aria-label={`Выбрать ${label}, значение ${pct}%`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}