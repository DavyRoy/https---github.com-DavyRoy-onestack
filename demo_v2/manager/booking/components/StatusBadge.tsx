// src/app/demo/manager/booking/components/StatusBadge.tsx
"use client";

import { bookingStatuses, BookingStatus } from "../data/mockBookings";

export default function StatusBadge({ status }: { status: BookingStatus }) {
  const meta = bookingStatuses[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${meta.color} text-white`}>
      <span className="h-1.5 w-1.5 rounded-full bg-white/90" />
      {meta.label}
    </span>
  );
}