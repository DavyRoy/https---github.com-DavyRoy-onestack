"use client";

import React from "react";

type DayLabel = { day: string; date: string };

export default function HeatmapGrid({
  labelsX,
  labelsY,
  values,
  onCellClick,
}: {
  labelsX: string[]; // часы
  labelsY: DayLabel[]; // дни
  values: number[]; // длина = labelsX.length * labelsY.length
  onCellClick?: (d: { x: string; y: string; date: string; value: number }) => void;
}) {
  const cols = labelsX.length;
  const rows = labelsY.length;
  const max = Math.max(...values, 1);

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[720px]">
        <div
          className="grid"
          style={{ gridTemplateColumns: `100px repeat(${cols}, minmax(40px,1fr))` }}
          role="table"
          aria-label="Тепловая карта загрузки по дням и часам"
        >
          {/* Header row */}
          <div role="columnheader" />
          {labelsX.map((h) => (
            <div
              key={h}
              role="columnheader"
              className="px-2 py-1 text-center text-xs text-white/70"
            >
              {h}
            </div>
          ))}

          {/* Body */}
          {labelsY.map((d, r) => (
            <FragmentRow
              key={d.date}
              dayLabel={`${d.day} ${d.date}`}
              cols={cols}
              startIndex={r * cols}
              values={values}
              max={max}
              labelsX={labelsX}
              date={d.date}
              onCellClick={onCellClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function FragmentRow({
  dayLabel,
  cols,
  startIndex,
  values,
  max,
  labelsX,
  date,
  onCellClick,
}: {
  dayLabel: string;
  cols: number;
  startIndex: number;
  values: number[];
  max: number;
  labelsX: string[];
  date: string;
  onCellClick?: (d: { x: string; y: string; date: string; value: number }) => void;
}) {
  return (
    <>
      <div className="px-2 py-1 text-xs text-white/70" role="rowheader">
        {dayLabel}
      </div>
      {Array.from({ length: cols }).map((_, c) => {
        const idx = startIndex + c;
        const v = values[idx] ?? 0;
        // Прозрачность от 0.12 до 1.0 (чтобы пустые клетки были видны)
        const alpha = Math.max(0.12, Math.min(1, 0.12 + 0.88 * (v / max)));
        const label = `${labelsX[c]} • ${v}`;

        return (
          <button
            key={c}
            className="m-1 h-8 rounded focus:outline-none focus:ring-2 focus:ring-white/40"
            style={{ background: `rgba(255,255,255,${alpha})` }}
            title={label}
            aria-label={`${dayLabel}, ${labelsX[c]} — значение ${v}`}
            onClick={() =>
              onCellClick?.({ x: labelsX[c], y: dayLabel, date, value: v })
            }
          />
        );
      })}
    </>
  );
}