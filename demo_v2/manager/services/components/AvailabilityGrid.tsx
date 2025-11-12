"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Slot } from "@/app/demo/manager/services/data/mockAvailability";

const hours = [
  "10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30",
  "14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30",
  "18:00","18:30","19:00"
];

function nextHalf(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const t = h * 60 + m + 30;
  const H = Math.floor(t / 60), M = t % 60;
  return `${String(H).padStart(2, "0")}:${String(M).padStart(2, "0")}`;
}

function prevHalf(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const t = Math.max(0, h * 60 + m - 30);
  const H = Math.floor(t / 60), M = t % 60;
  return `${String(H).padStart(2, "0")}:${String(M).padStart(2, "0")}`;
}

export default function AvailabilityGrid({
  week,
  slots,
  onCreateRange,
  onEditSlot,
}: {
  week: string[];   // 7 дат
  slots: Slot[];
  onCreateRange: (date: string, from: string, to: string) => void;
  onEditSlot: (slot: Slot) => void;
}) {
  // drag-select (универсально для мыши/тача/пены)
  const [drag, setDrag] = useState<{ date: string; from: string; to: string; pid?: number } | null>(null);
  const isDragging = !!drag;
  const liveRef = useRef<HTMLDivElement>(null);

  const cellKey = (date: string, time: string) => `${date}_${time}`;

  // быстрый индекс слотов по (date, from)
  const index = useMemo(() => {
    const map = new Map<string, Slot[]>();
    for (const s of slots) {
      const k = cellKey(s.date, s.from);
      const arr = map.get(k) || [];
      arr.push(s);
      map.set(k, arr);
    }
    return map;
  }, [slots]);

  // глобально завершаем drag, если отпустили вне таблицы
  useEffect(() => {
    const up = () => {
      if (drag) {
        onCreateRange(drag.date, drag.from, drag.to);
        setDrag(null);
      }
    };
    const cancel = () => setDrag(null);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", cancel);
    return () => {
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", cancel);
    };
  }, [drag, onCreateRange]);

  const beginDrag = (date: string, time: string, pid?: number) => {
    setDrag({ date, from: time, to: nextHalf(time), pid });
  };
  const extendDrag = (date: string, time: string) => {
    setDrag((d) => (d && d.date === date ? { ...d, to: nextHalf(time) } : d));
  };

  // клава: Enter — быстрый слот, Shift+стрелки — тянуть
  const handleKey = (date: string, time: string, e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onCreateRange(date, time, nextHalf(time));
      return;
    }
    if (e.shiftKey && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault();
      setDrag((d) => {
        // если не начинали — начать с текущей ячейки
        if (!d) return { date, from: time, to: nextHalf(time) };
        if (d.date !== date) return d;
        // растягиваем
        if (e.key === "ArrowDown") return { ...d, to: nextHalf(d.to) };
        // сужаем, не заходим ниже from
        const nextTo = prevHalf(d.to);
        return nextTo > d.from ? { ...d, to: nextTo } : d;
      });
    }
  };

  return (
    <div
      className="overflow-x-auto rounded-2xl border border-white/15 select-none"
      onPointerLeave={() => isDragging && setDrag(null)}
      role="region"
      aria-label="Сетка доступности по неделе"
    >
      <table className="w-full text-sm" role="grid" aria-readonly>
        <thead className="bg-white/5 text-white/70" role="rowgroup">
          <tr role="row">
            <th className="px-3 py-2 text-left" role="columnheader">Время</th>
            {week.map((d) => (
              <th key={d} className="px-3 py-2 text-left" role="columnheader">
                {d}
              </th>
            ))}
          </tr>
        </thead>
        <tbody role="rowgroup">
          {hours.map((h) => (
            <tr key={h} className="border-t border-white/10" role="row">
              <td className="px-3 py-1.5 text-white/70" role="gridcell" aria-readonly>
                {h}
              </td>
              {week.map((date) => {
                const k = cellKey(date, h);
                const arr = index.get(k) || [];
                const isInDrag = isDragging && drag!.date === date && h >= drag!.from && h < drag!.to;

                return (
                  <td key={date} className="px-1 py-1 align-top" role="gridcell" aria-selected={isInDrag || undefined}>
                    <div
                      className={`min-h-[24px] rounded-lg px-1 py-1 ${isInDrag ? "bg-emerald-400/20 border border-emerald-400/40" : ""}`}
                    >
                      {/* ячейка для создания/фокуса */}
                      <button
                        type="button"
                        className="sr-only"
                        aria-label={`Создать слот: ${date}, ${h}`}
                        onKeyDown={(e) => handleKey(date, h, e)}
                      />
                      {/* существующие слоты */}
                      <div className="flex flex-col gap-1">
                        {arr.map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => onEditSlot(s)}
                            onPointerDown={(e) => {
                              (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
                              beginDrag(date, h, e.pointerId);
                            }}
                            onPointerEnter={() => extendDrag(date, h)}
                            className={`w-full rounded-md px-2 py-1 text-xs text-left transition ${
                              s.status === "available"
                                ? "bg-emerald-400/20 border border-emerald-400/30 hover:bg-emerald-400/30"
                                : s.status === "busy"
                                ? "bg-red-400/20 border border-red-400/30"
                                : "bg-yellow-300/20 border border-yellow-300/30"
                            }`}
                            title={`${s.from}–${s.to}`}
                            aria-label={`Слот ${s.status === "available" ? "доступен" : s.status === "busy" ? "занят" : "перерыв"}: ${s.from}–${s.to}`}
                          >
                            {s.from}–{s.to}
                          </button>
                        ))}
                        {/* пустая область ячейки для drag-select */}
                        <div
                          className="h-5"
                          onPointerDown={(e) => {
                            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
                            beginDrag(date, h, e.pointerId);
                          }}
                          onPointerEnter={() => extendDrag(date, h)}
                          title={`Создать слот ${date} • ${h}`}
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* live-озвучка диапазона и текстовый хвост */}
      <div ref={liveRef} className="px-3 py-2 text-xs text-white/70" aria-live="polite">
        {isDragging ? (
          <>Диапазон: {drag!.date} • {drag!.from}–{drag!.to}</>
        ) : (
          <>Подсказка: выделяйте ячейки касанием/мышью или нажмите Enter на времени, чтобы создать 30-мин. слот.</>
        )}
      </div>
    </div>
  );
}