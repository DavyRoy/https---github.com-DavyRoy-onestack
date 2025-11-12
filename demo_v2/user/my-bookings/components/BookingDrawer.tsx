"use client";

import Link from "next/link";
import { MapPin, User, CreditCard } from "lucide-react";
import type { MyBooking } from "../data/mockUserMyBookings";

const paymentText: Record<MyBooking["paymentStatus"], string> = {
  not_required: "Оплата после визита",
  deposit_due: "Депозит к оплате",
  deposit_paid: "Депозит оплачен",
};

export default function BookingDrawer({
  booking,
  onClose,
  onReschedule,
  onCancel,
}: {
  booking: MyBooking | null;
  onClose: () => void;
  onReschedule: (booking: MyBooking) => void;
  onCancel: (booking: MyBooking) => void;
}) {
  if (!booking) return null;
  const start = new Date(booking.start);
  const end = new Date(booking.end);

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl border-t border-[hsl(var(--border))] bg-[hsl(var(--panel))]/95 p-5 shadow-2xl lg:hidden">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-[hsl(var(--fg))]">{booking.serviceTitle}</h3>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/80 px-3 py-1 text-xs text-[hsl(var(--muted))]"
        >
          Закрыть
        </button>
      </div>
      <p className="mt-2 text-sm text-[hsl(var(--muted))]">
        {start.toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" })} •
        {start.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })} –
        {end.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
      </p>
      <div className="mt-4 space-y-2 text-sm text-[hsl(var(--muted))]">
        <span className="inline-flex items-center gap-2">
          <MapPin className="h-4 w-4" aria-hidden /> {booking.locationLabel}
        </span>
        <span className="inline-flex items-center gap-2">
          <User className="h-4 w-4" aria-hidden /> {booking.staffName ?? "Мастер назначается"}
        </span>
        <span className="inline-flex items-center gap-2">
          <CreditCard className="h-4 w-4" aria-hidden /> {paymentText[booking.paymentStatus]}
        </span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        <button
          type="button"
          onClick={() => onReschedule(booking)}
          className="inline-flex items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-4 py-2 text-sm font-semibold text-[hsl(var(--fg))]"
        >
          Перенести
        </button>
        {booking.status !== "cancelled" ? (
          <button
            type="button"
            onClick={() => onCancel(booking)}
            className="inline-flex items-center justify-center rounded-full border border-rose-500/70 bg-rose-500/20 px-4 py-2 text-sm font-semibold text-white"
          >
            Отменить
          </button>
        ) : null}
        <Link
          href={`/demo/user/my-bookings/${booking.id}`}
          onClick={onClose}
          className="inline-flex items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-4 py-2 text-sm font-semibold text-[hsl(var(--fg))]"
        >
          Подробнее
        </Link>
      </div>
    </div>
  );
}
