"use client";

import { useMemo } from "react";
import type { ServiceSlot } from "../data/mockUserServices";

const dayFormatter = new Intl.DateTimeFormat("ru-RU", { weekday: "long", day: "numeric", month: "long" });
const timeFormatter = new Intl.DateTimeFormat("ru-RU", { hour: "2-digit", minute: "2-digit" });

export default function SDPTimePicker({
  slots,
  selected,
  onSelect,
  selectedStaff,
  selectedLocation,
}: {
  slots: ServiceSlot[];
  selected: string | null;
  onSelect: (slotId: string) => void;
  selectedStaff: string | null;
  selectedLocation: string | null;
}) {
  const filteredSlots = useMemo(() => {
    return slots.filter((slot) => {
      if (selectedStaff && slot.staffId !== selectedStaff) return false;
      if (selectedLocation && slot.locationId !== selectedLocation) return false;
      return true;
    });
  }, [slots, selectedStaff, selectedLocation]);

  const groupedByDay = useMemo(() => {
    const map = new Map<string, ServiceSlot[]>();
    filteredSlots.forEach((slot) => {
      const date = new Date(slot.start);
      const key = date.toDateString();
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(slot);
    });
    return Array.from(map.entries())
      .map(([key, list]) => ({ key, date: new Date(list[0].start), slots: list }))
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 7);
  }, [filteredSlots]);

  if (!groupedByDay.length) {
    return (
      <p className="rounded-2xl border border-[hsl(var(--border))]/60 bg-[hsl(var(--panel))]/60 px-3 py-4 text-sm text-[hsl(var(--muted))]">
        Нет свободных слотов для текущих фильтров. Попробуйте выбрать другого мастера или дату.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {groupedByDay.map((group) => (
        <div key={group.key} className="space-y-2">
          <h4 className="text-sm font-semibold text-[hsl(var(--fg))]">{dayFormatter.format(group.date)}</h4>
          <div className="flex flex-wrap gap-2">
            {group.slots.slice(0, 6).map((slot) => (
              <button
                key={slot.id}
                type="button"
                onClick={() => onSelect(slot.id)}
                className={`rounded-full border px-3 py-1.5 text-sm transition ${
                  selected === slot.id
                    ? "border-[hsl(var(--brand))] bg-[hsl(var(--brand))] text-white"
                    : "border-[hsl(var(--border))] bg-[hsl(var(--panel))] text-[hsl(var(--fg))] hover:bg-[hsl(var(--panel))]/80"
                }`}
              >
                {timeFormatter.format(new Date(slot.start))}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
