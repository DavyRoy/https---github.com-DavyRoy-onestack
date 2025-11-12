"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { T } from "./tokens";

export default function NewEventInline({
  open,
  preset,
  onClose,
  onCreate,
}: {
  open: boolean;
  preset: { dateISO: string; timeFrom: string; timeTo?: string; staffId?: string } | null;
  onClose: () => void;
  onCreate: (payload: {
    client: string;
    service: string;
    staffId?: string;
    dateISO: string;
    time: string;
    comment?: string;
  }) => void;
}) {
  const [client, setClient] = useState("");
  const [service, setService] = useState("");
  const [comment, setComment] = useState("");

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const firstFieldRef = useRef<HTMLInputElement | null>(null);
  const activeBeforeOpen = useRef<HTMLElement | null>(null);

  // очистка при закрытии или смене пресета
  useEffect(() => {
    if (!open) {
      setClient("");
      setService("");
      setComment("");
    }
  }, [open]);
  useEffect(() => {
    // при выборе нового слота — тоже сбрасываем
    if (open && preset) {
      setClient("");
      setService("");
      setComment("");
    }
  }, [preset, open]);

  const canSubmit = client.trim().length > 0 && service.trim().length > 0;

  const submit = useCallback(() => {
    if (!open || !preset || !canSubmit) return;
    onCreate({
      client: client.trim(),
      service: service.trim(),
      staffId: preset.staffId,
      dateISO: preset.dateISO,
      time: preset.timeFrom,
      comment: comment.trim() || undefined,
    });
  }, [open, preset, canSubmit, onCreate, client, service, comment]);

  // Esc для закрытия
  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  // Лок прокрутки фона + возврат фокуса к источнику
  useEffect(() => {
    if (open) {
      activeBeforeOpen.current = document.activeElement as HTMLElement | null;
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      // автофокус
      setTimeout(() => firstFieldRef.current?.focus(), 0);
      return () => {
        document.body.style.overflow = prevOverflow;
        activeBeforeOpen.current?.focus?.();
      };
    }
  }, [open]);

  // Фокус-ловушка внутри диалога (Tab / Shift+Tab)
  useEffect(() => {
    if (!open) return;
    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const root = dialogRef.current;
      if (!root) return;
      const focusables = root.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const isShift = e.shiftKey;

      if (document.activeElement === first && isShift) {
        e.preventDefault();
        (last as HTMLElement).focus();
      } else if (document.activeElement === last && !isShift) {
        e.preventDefault();
        (first as HTMLElement).focus();
      }
    };
    document.addEventListener("keydown", trap);
    return () => document.removeEventListener("keydown", trap);
  }, [open]);

  if (!open || !preset) return null;

  const described = `new-event-desc`;

  return (
    <div className="fixed inset-0 z-[90]" onClick={onClose} aria-hidden={!open}>
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

      <div
        ref={dialogRef}
        className={`${T.card} fixed left-1/2 top-[10svh] z-[91] w-[min(560px,92vw)] -translate-x-1/2`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-event-title"
        aria-describedby={described}
        onClick={(e) => e.stopPropagation()}
      >
        <div id="new-event-title" className="text-base font-semibold">
          Новая запись (демо)
        </div>
        <div id={described} className={"mt-1 text-sm " + T.dim}>
          {preset.dateISO} • {preset.timeFrom}
          {preset.timeTo ? `–${preset.timeTo}` : ""}{" "}
          {preset.staffId ? `• Сотр.: ${preset.staffId}` : ""}
        </div>

        <form
          className="mt-3 grid gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <input
            ref={firstFieldRef}
            className={T.input}
            placeholder="Клиент (Иван Иванов)"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            aria-label="Имя клиента"
          />
          <input
            className={T.input}
            placeholder="Услуга (Стрижка)"
            value={service}
            onChange={(e) => setService(e.target.value)}
            aria-label="Услуга"
          />
          <textarea
            className={T.input + " h-24"}
            placeholder="Комментарий (не обязательно)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            aria-label="Комментарий"
          />
          <div className="mt-3 flex justify-end gap-2">
            <button type="button" className={T.btn} onClick={onClose}>
              Отмена
            </button>
            <button
              type="submit"
              className={T.btnPrimary}
              disabled={!canSubmit}
              aria-disabled={!canSubmit}
            >
              Создать
            </button>
          </div>
        </form>

        <div className={"mt-2 text-xs " + T.mut}>
          Или откройте мастер:{" "}
          <Link
            className="underline"
            href={`/demo/manager/booking/new?date=${preset.dateISO}&time=${preset.timeFrom}${
              preset.staffId ? `&staff=${preset.staffId}` : ""
            }`}
          >
            /booking/new
          </Link>
        </div>

        {/* Закрыть (моб.) */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-white/70 hover:text-white text-sm"
          aria-label="Закрыть окно"
        >
          ✕
        </button>
      </div>
    </div>
  );
}