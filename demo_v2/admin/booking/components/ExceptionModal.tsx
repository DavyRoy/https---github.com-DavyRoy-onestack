"use client";

import * as React from "react";

type ExceptionType = "holiday" | "blackout" | "maintenance" | "personal";

export default function ExceptionModal({
  open,
  date,
  onClose,
  onSave,
}: {
  open: boolean;
  date?: string;
  onClose: () => void;
  onSave: (ex: { id: string; date: string; reason: string }) => void;
}) {
  const [type, setType] = React.useState<ExceptionType>("holiday");
  const [fullDay, setFullDay] = React.useState(true);
  const [start, setStart] = React.useState("10:00");
  const [end, setEnd] = React.useState("18:00");
  const [reason, setReason] = React.useState("Праздник");
  const [submitting, setSubmitting] = React.useState(false);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const dialogRef = React.useRef<HTMLDivElement>(null);

  /* ---------- helpers ---------- */
  const toMinutes = (t: string) => {
    if (!/^\d{2}:\d{2}$/.test(t)) return NaN;
    const [h, m] = t.split(":").map(Number);
    return (Number.isFinite(h) ? h : 0) * 60 + (Number.isFinite(m) ? m : 0);
  };

  const typeLabel = (v: ExceptionType) => {
    switch (v) {
      case "holiday":
        return "Праздник";
      case "blackout":
        return "Блэкаут";
      case "maintenance":
        return "Тех. работы";
      case "personal":
        return "Личное";
    }
  };

  const timeIsValid = fullDay || (start && end && toMinutes(start) < toMinutes(end));

  /* ---------- focus-on-open ---------- */
  React.useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 10);
    return () => clearTimeout(t);
  }, [open]);

  /* ---------- submit ---------- */
  const handleSubmit = React.useCallback(() => {
    if (!date) return;
    if (!reason.trim()) {
      inputRef.current?.focus();
      return;
    }
    if (!timeIsValid) return;

    setSubmitting(true);

    const parts = [
      `[${typeLabel(type)}]`,
      fullDay ? "весь день" : `с ${start} до ${end}`,
      reason.trim(),
    ].filter(Boolean);

    onSave({
      id: `ex-${Date.now()}`,
      date,
      reason: parts.join(" — "),
    });

    setSubmitting(false);
    onClose();
  }, [date, end, fullDay, onClose, onSave, reason, start, timeIsValid, type]);

  /* ---------- esc / cmd+enter ---------- */
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose, handleSubmit]);

  /* ---------- backdrop click ---------- */
  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!open) return null;

  /* ---------- ids for a11y ---------- */
  const titleId = "exception-title";
  const descId = "exception-desc";
  const typeId = "exception-type";
  const fullDayId = "exception-fullday";
  const startId = "exception-start";
  const endId = "exception-end";
  const reasonId = "exception-reason";

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[1px] flex items-center justify-center p-4"
      onMouseDown={handleBackdrop}
      aria-hidden={!open}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="w-full max-w-lg rounded-2xl border border-white/15 bg-[#0b0e14] p-4 md:p-5 shadow-xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Заголовок */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id={titleId} className="text-base md:text-lg font-semibold">
              Исключение / блэкаут
            </h2>
            <p id={descId} className="mt-0.5 text-xs text-white/60">
              Дата: <span className="text-white/80">{date || "—"}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/15 bg-white/10 px-2 py-1 text-xs hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30"
            title="Закрыть (Esc)"
          >
            Закрыть
          </button>
        </div>

        {/* Форма */}
        <div className="mt-3 grid gap-3">
          {/* Тип + Весь день */}
          <div className="grid gap-2 md:grid-cols-[1fr_auto] md:items-end">
            <label className="grid gap-1" htmlFor={typeId}>
              <span className="text-xs opacity-70">Тип</span>
              <select
                id={typeId}
                value={type}
                onChange={(e) => setType(e.target.value as ExceptionType)}
                className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none"
              >
                <option value="holiday">Праздник</option>
                <option value="blackout">Блэкаут</option>
                <option value="maintenance">Тех. работы</option>
                <option value="personal">Личное</option>
              </select>
            </label>

            <label className="inline-flex items-center gap-2 text-sm" htmlFor={fullDayId}>
              <input
                id={fullDayId}
                type="checkbox"
                checked={fullDay}
                onChange={(e) => setFullDay(e.target.checked)}
              />
              Весь день
            </label>
          </div>

          {/* Время (если не весь день) */}
          {!fullDay && (
            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-1" htmlFor={startId}>
                <span className="text-xs opacity-70">Начало</span>
                <input
                  id={startId}
                  type="time"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none"
                />
              </label>
              <label className="grid gap-1" htmlFor={endId}>
                <span className="text-xs opacity-70">Окончание</span>
                <input
                  id={endId}
                  type="time"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none"
                />
              </label>
              {!timeIsValid && (
                <div className="col-span-2 text-xs text-rose-300" role="alert">
                  Время окончания должно быть позже времени начала.
                </div>
              )}
            </div>
          )}

          {/* Причина */}
          <label className="grid gap-1" htmlFor={reasonId}>
            <span className="text-xs opacity-70">Причина</span>
            <input
              id={reasonId}
              ref={inputRef}
              className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Напр.: праздничный день, ремонт, корпоратив…"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              aria-invalid={!reason.trim() ? true : undefined}
            />
            <span className="text-[11px] text-white/50">
              Совет: нажмите <kbd className="rounded bg-white/10 px-1">Ctrl/⌘ + Enter</kbd>, чтобы сохранить.
            </span>
          </label>
        </div>

        {/* Действия */}
        <div className="mt-4 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/15 px-3 py-2 text-sm hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            Отмена
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !reason.trim() || !date || !timeIsValid}
            className="rounded-xl border border-red-400/40 bg-red-500/20 px-3 py-2 text-sm hover:bg-red-500/30 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-red-400/40"
          >
            {submitting ? "Сохранение…" : "Сохранить"}
          </button>
        </div>
      </div>
    </div>
  );
}