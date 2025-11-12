// app/demo/admin/booking/components/SlotTemplateModal.tsx
"use client";

import * as React from "react";

type Props = {
  open: boolean;
  initial?: { dayIdx: number; from: string; to: string };
  onClose: () => void;
  onSave: (x: { dayIdx: number; from: string; to: string }) => void;
};

const DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function toMinutes(hhmm: string) {
  const [h, m] = (hhmm || "00:00").split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

export default function SlotTemplateModal({ open, initial, onClose, onSave }: Props) {
  const [dayIdx, setDayIdx] = React.useState<number>(initial?.dayIdx ?? 0);
  const [from, setFrom] = React.useState<string>(initial?.from ?? "10:00");
  const [to, setTo] = React.useState<string>(initial?.to ?? "12:00");
  const [touched, setTouched] = React.useState(false);

  // Синхронизация при открытии
  React.useEffect(() => {
    if (!open) return;
    setDayIdx(initial?.dayIdx ?? 0);
    setFrom(initial?.from ?? "10:00");
    setTo(initial?.to ?? "12:00");
    setTouched(false);
  }, [open, initial]);

  const minutesFrom = toMinutes(from);
  const minutesTo = toMinutes(to);
  const invalidOrder = minutesTo <= minutesFrom;
  const tooShort = minutesTo - minutesFrom < 15; // не короче 15 минут
  const hasError = invalidOrder || tooShort;

  const errorMsg = invalidOrder
    ? "Время «По» должно быть позже «С»."
    : tooShort
    ? "Длительность слота должна быть не менее 15 минут."
    : "";

  // Хоткеи: Esc — закрыть, Enter — сохранить (если валидно)
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, dayIdx, from, to, hasError]);

  function handleSave() {
    setTouched(true);
    if (hasError) return;
    onSave({ dayIdx, from, to });
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      onMouseDown={(e) => {
        // Закрытие по клику на фон, но не на контент
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="slot-template-title"
        className="w-full max-w-md rounded-2xl border border-white/15 bg-[#0b0e14] p-4"
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <div id="slot-template-title" className="text-lg font-semibold">
              Шаблон слота
            </div>
            <div className="mt-0.5 text-xs text-white/60">
              Выберите день и интервал (шаг 15 мин)
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-white/15 px-2 py-1 text-sm hover:bg-white/[0.06]"
            aria-label="Закрыть"
          >
            ✕
          </button>
        </div>

        <div className="mt-3 grid gap-3">
          <label className="text-sm">
            День недели
            <select
              className="mt-1 w-full rounded bg-white/[0.06] border border-white/15 px-3 py-2 outline-none"
              value={dayIdx}
              onChange={(e) => setDayIdx(Number(e.target.value))}
            >
              {DAYS.map((d, i) => (
                <option key={d} value={i}>
                  {d}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm">
              С
              <input
                type="time"
                step={900} // 15 минут
                className="mt-1 w-full rounded bg-white/[0.06] border border-white/15 px-3 py-2 outline-none"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </label>

            <label className="text-sm">
              По
              <input
                type="time"
                step={900}
                className="mt-1 w-full rounded bg-white/[0.06] border border-white/15 px-3 py-2 outline-none"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </label>
          </div>

          {touched && hasError && (
            <div className="rounded-lg border border-rose-400/40 bg-rose-500/15 px-3 py-2 text-xs text-rose-200">
              {errorMsg}
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-xl border border-white/15 px-3 py-2 hover:bg-white/[0.06]"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            disabled={hasError}
            className="rounded-xl border border-emerald-400/40 bg-emerald-500/20 px-3 py-2 hover:bg-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}