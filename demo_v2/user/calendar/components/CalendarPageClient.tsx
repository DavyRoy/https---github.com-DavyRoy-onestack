"use client";

import { useMemo, useState } from "react";
import CalendarHeader, { type CalendarView } from "./CalendarHeader";
import FiltersBar, { type CalendarTypeFilters } from "./FiltersBar";
import CalendarLegend from "./CalendarLegend";
import CalendarGrid from "./CalendarGrid";
import EventPopover from "./EventPopover";
import EventDrawer from "./EventDrawer";
import MoveRescheduleModal from "./MoveRescheduleModal";
import CancelModal from "./CancelModal";
import EmptyState from "./EmptyState";
import {
  calendarEvents,
  calendarLegend,
  calendarLocations,
  calendarStaff,
  type CalendarEvent,
} from "../data/mockUserCalendar";

const startOfDay = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const addDays = (date: Date, days: number) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

export default function CalendarPageClient() {
  const [view, setView] = useState<CalendarView>("month");
  const [date, setDate] = useState<Date>(startOfDay(new Date()));
  const [filters, setFilters] = useState<CalendarTypeFilters>({ booking: true, payment: true, order: true, reminder: true });
  const [showPast, setShowPast] = useState(false);
  const [location, setLocation] = useState<string | null>(null);
  const [staff, setStaff] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [popoverEvent, setPopoverEvent] = useState<CalendarEvent | null>(null);
  const [moveEvent, setMoveEvent] = useState<CalendarEvent | null>(null);
  const [cancelEvent, setCancelEvent] = useState<CalendarEvent | null>(null);

  const filteredEvents = useMemo(() => {
    return calendarEvents.filter((event) => {
      if (!filters[event.type]) return false;
      if (!showPast && new Date(event.end) < new Date()) return false;
      if (location && event.locationId && event.locationId !== location) return false;
      if (staff && event.staffId && event.staffId !== staff) return false;
      return true;
    });
  }, [filters, showPast, location, staff]);

  const handleNavigate = (direction: "prev" | "next" | "today") => {
    if (direction === "today") {
      setDate(startOfDay(new Date()));
      return;
    }
    const delta = view === "month" ? 30 : view === "week" ? 7 : 1;
    setDate((prev) => addDays(prev, direction === "next" ? delta : -delta));
  };

  const handleEventSelect = (event: CalendarEvent) => {
    setPopoverEvent(event);
    setSelectedEvent(event);
  };

  const legend = calendarLegend;

  return (
    <div className="flex flex-col gap-4 pb-24 lg:pb-0">
      <CalendarHeader
        date={date}
        view={view}
        onNavigate={handleNavigate}
        onViewChange={(nextView) => setView(nextView)}
        onOpenFilters={() => null}
        location={location}
        staff={staff}
        locations={calendarLocations}
        staffOptions={calendarStaff}
        onLocationChange={(value) => setLocation(value)}
        onStaffChange={(value) => setStaff(value)}
      />

      <FiltersBar filters={filters} onChange={setFilters} showPast={showPast} onTogglePast={setShowPast} />
      <CalendarLegend legend={legend} />

      {filteredEvents.length ? (
        <CalendarGrid view={view} date={date} events={filteredEvents} legend={legend} onSelect={handleEventSelect} />
      ) : (
        <EmptyState />
      )}

      <div className="hidden lg:block">
        <EventPopover
          event={popoverEvent}
          onClose={() => setPopoverEvent(null)}
          onReschedule={(evt) => setMoveEvent(evt)}
          onCancel={(evt) => setCancelEvent(evt)}
        />
      </div>

      <EventDrawer
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onReschedule={(evt) => setMoveEvent(evt)}
        onCancel={(evt) => setCancelEvent(evt)}
      />

      <MoveRescheduleModal event={moveEvent} onClose={() => setMoveEvent(null)} />
      <CancelModal event={cancelEvent} onClose={() => setCancelEvent(null)} />
    </div>
  );
}
