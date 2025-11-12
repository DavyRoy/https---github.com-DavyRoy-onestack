"use client";

import type { MyBooking } from "../data/mockUserMyBookings";
import BookingCard from "./BookingCard";

export type BookingsListProps = {
  bookings: MyBooking[];
  selected: string[];
  onToggle: (id: string) => void;
  onReschedule: (booking: MyBooking) => void;
  onCancel: (booking: MyBooking) => void;
};

export default function BookingsList({ bookings, selected, onToggle, onReschedule, onCancel }: BookingsListProps) {
  if (!bookings.length) return null;
  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <BookingCard
          key={booking.id}
          booking={booking}
          selected={selected.includes(booking.id)}
          onToggle={onToggle}
          onReschedule={onReschedule}
          onCancel={onCancel}
        />
      ))}
    </div>
  );
}
