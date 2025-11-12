"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BookingDetailHeader from "./BookingDetailHeader";
import BookingTimeline from "./BookingTimeline";
import BookingInfo from "./BookingInfo";
import AddToCalendar from "./AddToCalendar";
import RescheduleModal from "./RescheduleModal";
import CancelModal from "./CancelModal";
import { myBookings } from "../data/mockUserMyBookings";
import type { MyBooking } from "../data/mockUserMyBookings";
import { services } from "../../services/data/mockUserServices";

export default function BookingDetailPageClient() {
  const params = useParams();
  const router = useRouter();
  const booking = useMemo(() => myBookings.find((item) => item.id === params?.id), [params]);
  const [reschedule, setReschedule] = useState<MyBooking | null>(null);
  const [cancel, setCancel] = useState<MyBooking | null>(null);

  if (!booking) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-[hsl(var(--muted))]">Запись не найдена.</p>
        <button
          type="button"
          onClick={() => router.push("/demo/user/my-bookings")}
          className="inline-flex items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-4 py-2 text-sm text-[hsl(var(--fg))]"
        >
          Вернуться к списку
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-24 lg:pb-0">
      <BookingDetailHeader booking={booking} />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <BookingTimeline booking={booking} />
          <BookingInfo
            price={services.find((service) => service.id === booking.serviceId)?.price ?? 0}
            deposit={booking.depositAmount}
            paymentStatus={booking.paymentStatus}
            addons={booking.addons}
          />
        </div>

        <AddToCalendar bookingId={booking.id} />
      </div>

      <div className="flex flex-wrap gap-2 text-sm">
        <button
          type="button"
          onClick={() => setReschedule(booking)}
          className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-4 py-2 text-sm font-semibold text-[hsl(var(--fg))] transition hover:bg-[hsl(var(--panel))]/80"
        >
          Перенести
        </button>
        {booking.status !== "cancelled" ? (
          <button
            type="button"
            onClick={() => setCancel(booking)}
            className="inline-flex items-center gap-2 rounded-full border border-rose-500/70 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/20"
          >
            Отменить
          </button>
        ) : null}
        {booking.paymentStatus === "deposit_due" ? (
          <button
            type="button"
            onClick={() => router.push(`/demo/user/payments/checkout?bookingId=${booking.id}`)}
            className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--brand))] bg-[hsl(var(--brand))] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Оплатить депозит
          </button>
        ) : null}
      </div>

      <RescheduleModal booking={reschedule} onClose={() => setReschedule(null)} />
      <CancelModal booking={cancel} onClose={() => setCancel(null)} />
    </div>
  );
}
