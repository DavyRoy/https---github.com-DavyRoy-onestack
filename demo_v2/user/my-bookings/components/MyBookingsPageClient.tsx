"use client";

import { useMemo, useState } from "react";
import BookingsHeader, { type BookingsView } from "./BookingsHeader";
import FiltersBar, { type BookingFilters } from "./FiltersBar";
import BookingsList from "./BookingsList";
import BookingsCalendar from "./BookingsCalendar";
import BulkActionsBar from "./BulkActionsBar";
import RescheduleModal from "./RescheduleModal";
import CancelModal from "./CancelModal";
import EmptyState from "./EmptyState";
import BookingDrawer from "./BookingDrawer";
import { myBookings, bookingServices } from "../data/mockUserMyBookings";
import { calendarLocations, calendarStaff } from "../../calendar/data/mockUserCalendar";
import type { MyBooking } from "../data/mockUserMyBookings";

const staffOptions = calendarStaff.map((member) => ({ id: member.id, name: member.name }));
const locationOptions = calendarLocations.map((loc) => ({ id: loc.id, label: loc.label }));

const shiftDays = (date: Date, days: number) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

export default function MyBookingsPageClient() {
  const [view, setView] = useState<BookingsView>("list");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState("30");
  const [filters, setFilters] = useState<BookingFilters>({ status: "upcoming", location: null, staff: null, service: null, withDeposit: false });
  const [selected, setSelected] = useState<string[]>([]);
  const [reschedule, setReschedule] = useState<MyBooking | null>(null);
  const [cancel, setCancel] = useState<MyBooking | null>(null);
  const [drawerBooking, setDrawerBooking] = useState<MyBooking | null>(null);

  const filteredBookings = useMemo(() => {
    const now = new Date();
    const rangeDays = dateRange === "custom" ? null : Number(dateRange);
    return myBookings.filter((booking) => {
      const start = new Date(booking.start);
      if (rangeDays !== null) {
        const minDate = shiftDays(now, -rangeDays);
        const maxDate = shiftDays(now, rangeDays);
        if (start < minDate || start > maxDate) return false;
      }

      if (filters.status !== "all") {
        if (filters.status === "upcoming") {
          if (start < now) return false;
          if (booking.status === "cancelled" || booking.status === "completed") return false;
        } else if (booking.status !== filters.status) {
          return false;
        }
      }
      if (filters.location && booking.locationId !== filters.location) return false;
      if (filters.staff && booking.staffId !== filters.staff) return false;
      if (filters.service && booking.serviceId !== filters.service) return false;
      if (filters.withDeposit && booking.paymentStatus !== "deposit_due" && booking.paymentStatus !== "deposit_paid") return false;
      if (search) {
        const needle = search.toLowerCase();
        const haystack = [
          booking.serviceTitle,
          booking.staffName ?? "",
          booking.locationLabel,
          booking.id,
        ].join(" ").toLowerCase();
        if (!haystack.includes(needle)) return false;
      }
      return true;
    });
  }, [filters, search, dateRange]);

  const handleToggle = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleClearSelection = () => setSelected([]);

  return (
    <div className="flex flex-col gap-4 pb-24 lg:pb-0">
      <BookingsHeader
        view={view}
        onViewChange={setView}
        search={search}
        onSearchChange={setSearch}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      <FiltersBar
        filters={filters}
        onChange={(next) => {
          setFilters(next);
          setSelected([]);
        }}
        locations={locationOptions}
        staffOptions={staffOptions}
        services={bookingServices}
      />

      <BulkActionsBar
        selected={selected}
        bookings={filteredBookings}
        onClear={handleClearSelection}
        onCancel={(ids) => {
          setCancel(filteredBookings.find((booking) => booking.id === ids[0]) ?? null);
        }}
        onAddToCalendar={() => {
          // демо: показ всплывающего окна можно добавить позже
        }}
        onPayDeposits={() => {
          // демо действие
        }}
      />

      {filteredBookings.length === 0 ? (
        <EmptyState />
      ) : view === "list" ? (
        <BookingsList
          bookings={filteredBookings}
          selected={selected}
          onToggle={handleToggle}
          onReschedule={(booking) => setReschedule(booking)}
          onCancel={(booking) => setCancel(booking)}
        />
      ) : (
        <BookingsCalendar
          bookings={filteredBookings}
          onSelect={(booking) => setDrawerBooking(booking)}
        />
      )}

      <RescheduleModal booking={reschedule} onClose={() => setReschedule(null)} />
      <CancelModal booking={cancel} onClose={() => setCancel(null)} />
      <BookingDrawer
        booking={drawerBooking}
        onClose={() => setDrawerBooking(null)}
        onReschedule={(booking) => {
          setDrawerBooking(null);
          setReschedule(booking);
        }}
        onCancel={(booking) => {
          setDrawerBooking(null);
          setCancel(booking);
        }}
      />
    </div>
  );
}
