"use client";

import Link from "next/link";
import { Calendar, MapPin, User, ArrowLeft } from "lucide-react";
import type { MyBooking } from "../data/mockUserMyBookings";

const statusText: Record<MyBooking["status"], string> = {
  confirmed: "Подтверждено",
  pending: "Ожидает",
  completed: "Завершено",
  cancelled: "Отменено",
};

const statusStyle: Record<MyBooking["status"], string> = {
  confirmed: "bg-blue-500/10 text-blue-200 border-blue-500/50",
  pending: "bg-gray-500/10 text-gray-200 border-gray-500/50",
  completed: "bg-emerald-500/10 text-emerald-200 border-emerald-500/50",
  cancelled: "bg-rose-500/10 text-rose-200 border-rose-500/50",
};

export default function BookingDetailHeader({ booking }: { booking: MyBooking }) {
  const start = new Date(booking.start);
  const end = new Date(booking.end);
  return (
    <header className="space-y-4 rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/80 p-6 shadow-sm">
      <div className="flex items-center gap-3 text-sm text-[hsl(var(--muted))]">
        <Link href="/demo/user/my-bookings" className="inline-flex items-center gap-2 text-[hsl(var(--muted))] hover:text-[hsl(var(--fg))]">
          <ArrowLeft className="h-4 w-4" aria-hidden /> Назад к списку
        </Link>
      </div>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[hsl(var(--fg))]">{booking.serviceTitle}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-[hsl(var(--muted))]">
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4" aria-hidden />
              {start.toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" })} •
              {start.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })} –
              {end.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4" aria-hidden /> {booking.locationLabel}
            </span>
            <span className="inline-flex items-center gap-2">
              <User className="h-4 w-4" aria-hidden /> {booking.staffName ?? "Мастер назначается"}
            </span>
          </div>
        </div>
        <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold ${statusStyle[booking.status]}`}>
          {statusText[booking.status]}
        </span>
      </div>
    </header>
  );
}
