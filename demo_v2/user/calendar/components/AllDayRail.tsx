"use client";

import type { CalendarEvent } from "../data/mockUserCalendar";
import EventChip from "./EventChip";
import type { CalendarLegendMap } from "../data/mockUserCalendar";

export default function AllDayRail({
  events,
  legend,
  onSelect,
}: {
  events: CalendarEvent[];
  legend: CalendarLegendMap;
  onSelect: (event: CalendarEvent) => void;
}) {
  if (!events.length) return null;
  return (
    <div className="mb-3 space-y-2 rounded-2xl border border-[hsl(var(--border))]/70 bg-[hsl(var(--panel))]/70 p-3">
      <p className="text-xs font-semibold text-[hsl(var(--muted))]">Весь день</p>
      <div className="flex flex-wrap gap-2">
        {events.map((event) => (
          <EventChip key={event.id} event={event} legend={legend} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}
