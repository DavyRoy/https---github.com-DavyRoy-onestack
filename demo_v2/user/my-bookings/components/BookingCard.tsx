"use client";

import Link from "next/link";
import { MapPin, User, CreditCard, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import type { MyBooking } from "../data/mockUserMyBookings";

const statusStyles: Record<MyBooking["status"], string> = {
  confirmed: "bg-blue-500/10 text-blue-200 border-blue-500/50",
  pending: "bg-gray-500/10 text-gray-200 border-gray-500/50",
  completed: "bg-emerald-500/10 text-emerald-200 border-emerald-500/50",
  cancelled: "bg-rose-500/10 text-rose-200 border-rose-500/50",
};

const paymentText: Record<MyBooking["paymentStatus"], string> = {
  not_required: "Оплата после визита",
  deposit_due: "Депозит к оплате",
  deposit_paid: "Депозит оплачен",
};

export default function BookingCard({
  booking,
  selected,
  onToggle,
  onReschedule,
  onCancel,
}: {
  booking: MyBooking;
  selected: boolean;
  onToggle: (id: string) => void;
  onReschedule: (booking: MyBooking) => void;
  onCancel: (booking: MyBooking) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const start = new Date(booking.start);
  const end = new Date(booking.end);

  return (
    <article className="relative flex flex-col gap-4 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/70 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onToggle(booking.id)}
            className="h-4 w-4 rounded border-[hsl(var(--border))] text-[hsl(var(--brand))]"
          />
          <div>
            <p className="text-sm font-semibold text-[hsl(var(--fg))]">{booking.serviceTitle}</p>
            <p className="text-xs text-[hsl(var(--muted))]">
              {start.toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" })} •
              {start.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })} –
              {end.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })} ({booking.duration} мин)
            </p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[booking.status]}`}>
          {booking.status === "confirmed"
            ? "Подтверждено"
            : booking.status === "pending"
            ? "Ожидает"
            : booking.status === "completed"
            ? "Завершено"
            : "Отменено"}
        </span>
      </div>

      <div className="grid gap-2 text-xs text-[hsl(var(--muted))] sm:grid-cols-2">
        <div className="inline-flex items-center gap-2">
          <MapPin className="h-4 w-4" aria-hidden /> {booking.locationLabel}
        </div>
        <div className="inline-flex items-center gap-2">
          <User className="h-4 w-4" aria-hidden /> {booking.staffName ?? "Мастер назначается"}
        </div>
        <div className="inline-flex items-center gap-2">
          <CreditCard className="h-4 w-4" aria-hidden /> {paymentText[booking.paymentStatus]}
          {booking.depositAmount ? <span>• {booking.depositAmount.toLocaleString("ru-RU")} ₽</span> : null}
        </div>
      </div>

      {booking.addons?.length ? (
        <div className="rounded-xl border border-[hsl(var(--border))]/60 bg-[hsl(var(--panel))]/60 px-3 py-2 text-xs text-[hsl(var(--muted))]">
          Допы: {booking.addons.map((addon) => addon.title).join(", ")}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2 text-sm">
        <button
          type="button"
          onClick={() => onReschedule(booking)}
          className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-4 py-2 text-sm font-semibold text-[hsl(var(--fg))] transition hover:bg-[hsl(var(--panel))]/80"
        >
          Перенести
        </button>
        {booking.status !== "cancelled" ? (
          <button
            type="button"
            onClick={() => onCancel(booking)}
            className="inline-flex items-center gap-2 rounded-full border border-rose-500/70 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/20"
          >
            Отменить
          </button>
        ) : null}
        {booking.paymentStatus === "deposit_due" ? (
          <Link
            href={`/demo/user/payments/checkout?bookingId=${booking.id}`}
            className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--brand))] bg-[hsl(var(--brand))] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Оплатить депозит
          </Link>
        ) : null}
        <Link
          href={`/demo/user/my-bookings/${booking.id}`}
          className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-4 py-2 text-sm font-semibold text-[hsl(var(--fg))] transition hover:bg-[hsl(var(--panel))]/80"
        >
          Подробнее
        </Link>
        <div className="relative inline-flex">
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-3 py-2 text-sm text-[hsl(var(--muted))]"
          >
            <MoreHorizontal className="h-4 w-4" aria-hidden />
          </button>
          {menuOpen ? (
            <div className="absolute right-0 top-10 z-10 w-48 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/95 p-3 text-xs text-[hsl(var(--muted))] shadow-xl">
              <Link
                href={`/demo/api/calendar/export/${booking.id}.ics`}
                className="block rounded-xl px-3 py-2 hover:bg-[hsl(var(--panel))]/80"
                onClick={() => setMenuOpen(false)}
              >
                Добавить в календарь
              </Link>
              {booking.status === "completed" ? (
                <button
                  type="button"
                  className="block w-full rounded-xl px-3 py-2 text-left hover:bg-[hsl(var(--panel))]/80"
                  onClick={() => setMenuOpen(false)}
                >
                  Оставить отзыв (демо)
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
