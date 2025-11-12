"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useRef } from "react";
import { T } from "./tokens";
import { CalEvent, fmtDate, timeLabel } from "./types";
import StatusBadge from "./StatusBadge";

export default function EventPopover({
  ev,
  onClose,
}: {
  ev: CalEvent | null;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const firstFocusable = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null);
  const lastFocusable = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null);

  // закрытие по Esc + запираем скролл страницы
  useEffect(() => {
    if (!ev) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && dialogRef.current) {
        // focus trap
        const focusables = dialogRef.current.querySelectorAll<
          HTMLButtonElement | HTMLAnchorElement | HTMLInputElement | HTMLSelectElement
        >(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length) {
          firstFocusable.current = focusables[0] as any;
          lastFocusable.current = focusables[focusables.length - 1] as any;
          if (e.shiftKey && document.activeElement === firstFocusable.current) {
            e.preventDefault();
            (lastFocusable.current as HTMLElement)?.focus();
          } else if (!e.shiftKey && document.activeElement === lastFocusable.current) {
            e.preventDefault();
            (firstFocusable.current as HTMLElement)?.focus();
          }
        }
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    // автофокус на первой «главной» кнопке
    setTimeout(() => {
      const openPrimary = dialogRef.current?.querySelector<HTMLAnchorElement>('[data-primary="open"]');
      (openPrimary || dialogRef.current?.querySelector("button"))?.focus();
    }, 0);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [ev, onClose]);

  const headingId = useMemo(() => "event-popover-title", []);
  const descId = useMemo(() => "event-popover-desc", []);

  if (!ev) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-start justify-center"
      onClick={onClose}
      aria-label="Окно с информацией о событии"
    >
      {/* Фон */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />

      {/* Карточка */}
      <div
        ref={dialogRef}
        className={`${T.card} relative z-[91] mt-[12svh] w-[min(560px,92vw)] outline-none`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        aria-describedby={descId}
      >
        {/* Заголовок и статус */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 id={headingId} className="text-base font-semibold truncate">
              {ev.title}
            </h2>
            <p id={descId} className={"text-sm " + T.dim}>
              {fmtDate(new Date(ev.start))} • {timeLabel(new Date(ev.start))}–
              {timeLabel(new Date(ev.end))}
            </p>
          </div>
          <StatusBadge status={ev.status} />
        </div>

        {/* Кнопки действий */}
        <div className="mt-4 flex flex-wrap gap-2">
          {(ev.status === "new" || ev.status === "pending") && (
            <Link
              className={T.btn}
              href={`/demo/manager/booking/${ev.bookingId}?action=confirm`}
            >
              Подтвердить
            </Link>
          )}
          <Link
            className={T.btn}
            href={`/demo/manager/booking/reschedule/${ev.bookingId}`}
          >
            Перенести
          </Link>
          <Link
            className={T.btn}
            href={`/demo/manager/booking/${ev.bookingId}?action=cancel`}
          >
            Отменить
          </Link>
          <Link
            className={T.btnPrimary}
            href={`/demo/manager/booking/${ev.bookingId}`}
            data-primary="open"
          >
            Открыть
          </Link>
        </div>

        {/* Ссылки */}
        <div className={"mt-3 text-xs " + T.mut}>
          Ссылки:{" "}
          <Link className="underline hover:text-white" href={`/demo/manager/crm/clients/CL-123`}>
            Клиент
          </Link>{" "}
          •{" "}
          <Link className="underline hover:text-white" href={`/demo/manager/services/SRV-1`}>
            Услуга
          </Link>{" "}
          •{" "}
          <Link
            className="underline hover:text-white"
            href={`/demo/manager/services/schedule?service=SRV-1&staff=${ev.staffId || "st1"}`}
          >
            Расписание услуги
          </Link>
        </div>

        {/* Кнопка закрытия */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 rounded-md px-1 text-white/70 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/30"
          aria-label="Закрыть окно"
        >
          ✕
        </button>
      </div>
    </div>
  );
}