// app/demo/admin/booking/components/SlotTemplateModal.tsx
"use client";

import * as React from "react";

type Props = {
  open: boolean;
  /** День недели 0..6 (0 — Пн) и время интервала */
  initial?: { dayIdx: number; from: string; to: string };
  onClose: () => void;
  onSave: (x: { dayIdx: number; from: string; to: string }) => void;
};

const DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"] as const;

function clampDay(i: number): number {
  if (!Number.isFinite(i)) return 0;
  return Math.min(6, Math.max(0, Math.floor(i)));
}
function toMinutes(hhmm: string): number {
  const [h, m] = (hhmm || "00:00").split(":").map(Number);
  return (Number.isFinite(h) ? h : 0) * 60 + (Number.isFinite(m) ? m : 0);
}
function snap15(hhmm: string): string {
  const min = toMinutes(hhmm);
  const snapped = Math.round(min / 15) * 15;
  const h = String(Math.floor(snapped / 60)).padStart(2, "0");
  const m = String(snapped % 60).padStart(2, "0");
  return `${h}:${m}`;
}

export default function SlotTemplateModal({ open, initial, onClose, onSave }: Props) {
  const [dayIdx, setDayIdx] = React.useState<number>(clampDay(initial?.dayIdx ?? 0));
  const [from, setFrom] = React.useState<string>(initial?.from ?? "10:00");
  const [to, setTo] = React.useState<string>(initial?.to ?? "12:00");
  const [touched, setTouched] = React.useState(false);

  const dialogRef = React.useRef<HTMLDivElement>(null);
  const firstFieldRef = React.useRef<HTMLSelectElement>(null);

  // Синхронизация при открытии
  React.useEffect(() => {
    if (!open) return;
    setDayIdx(clampDay(initial?.dayIdx ?? 0));
    setFrom(initial?.from ?? "10:00");
    setTo(initial?.to ?? "12:00");
    setTouched(false);
  }, [open, initial]);

  // Фокус и блокировка скролла бэкграунда
  React.useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => firstFieldRef.current?.focus(), 20);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  const minutesFrom = toMinutes(from);
  const minutesTo = toMinutes(to);
  const invalidOrder = minutesTo <= minutesFrom;
  const tooShort = minutesTo - minutesFrom < 15; // не короче 15 минут
  const hasError = invalidOrder || tooShort;

  const errorMsg = React.useMemo(() => {
    if (invalidOrder) return "Время «По» должно быть позже «С».";
    if (tooShort) return "Длительность слота должна быть не менее 15 минут.";
    return "";
  }, [invalidOrder, tooShort]);

  // Хоткеи: Esc — закрыть, Enter — сохранить (если валидно)
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "Enter") {
        // Не триггерим, если фокус на кнопке / select открывает список
        const target = e.target as HTMLElement | null;
        const tag = (target?.tagName || "").toLowerCase();
        if (tag === "button") return;
        // Разрешим "Enter" сохранять
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
    onSave({ dayIdx: clampDay(dayIdx), from: snap15(from), to: snap15(to) });
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[1px] flex items-center justify-center p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose(); // клик по бэкдропу
      }}
      aria-hidden={!open}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="slot-template-title"
        aria-describedby="slot-template-desc"
        className="w-full max-w-md rounded-2xl border border-white/15 bg-[#0b0e14] p-4 md:p-5 shadow-xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Заголовок */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h2 id="slot-template-title" className="text-base md:text-lg font-semibold">
              Шаблон слота
            </h2>
            <p id="slot-template-desc" className="mt-0.5 text-xs text-white/60">
              Выберите день и интервал (шаг 15 минут).
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/15 bg-white/10 px-2 py-1 text-xs hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30"
            aria-label="Закрыть"
          >
            ✕
          </button>
        </div>

        {/* Форма */}
        <div className="mt-3 grid gap-3">
          <label className="text-sm">
            День недели
            <select
              ref={firstFieldRef}
              className="mt-1 w-full rounded bg-white/[0.06] border border-white/15 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30"
              value={dayIdx}
              onChange={(e) => setDayIdx(clampDay(Number(e.target.value)))}
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
                className="mt-1 w-full rounded bg-white/[0.06] border border-white/15 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </label>

            <label className="text-sm">
              По
              <input
                type="time"
                step={900}
                className="mt-1 w-full rounded bg-white/[0.06] border border-white/15 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </label>
          </div>

          {touched && hasError && (
            <div
              className="rounded-lg border border-rose-400/40 bg-rose-500/15 px-3 py-2 text-xs text-rose-200"
              role="alert"
            >
              {errorMsg}
            </div>
          )}
        </div>

        {/* Действия */}
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/15 px-3 py-2 hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            Отмена
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={hasError}
            className="rounded-xl border border-emerald-400/40 bg-emerald-500/20 px-3 py-2 hover:bg-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
            title={hasError ? "Исправьте время" : "Сохранить интервал"}
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}