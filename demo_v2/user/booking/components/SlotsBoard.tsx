"use client";

import { addDays, isSameDay, isBefore } from "date-fns";
import { ru } from "date-fns/locale";
import { format } from "date-fns";
import type { ServiceSlot } from "../../services/data/mockUserServices";

export type SlotsBoardProps = {
  slots: ServiceSlot[];
  anchor: Date;
  selected: string | null;
  onSelect: (slotId: string) => void;
};

export default function SlotsBoard({ slots, anchor, selected, onSelect }: SlotsBoardProps) {
  const days = Array.from({ length: 7 }, (_, index) => addDays(anchor, index));
  const now = new Date();

  const slotsByDay = days.map((day) => {
    const daySlots = slots
      .filter((slot) => isSameDay(new Date(slot.start), day))
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    return { day, slots: daySlots };
  });

  return (
    <div className="grid gap-3 rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/70 p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {slotsByDay.map(({ day, slots: daySlots }) => (
          <div key={day.toDateString()} className="space-y-2">
            <h4 className="text-sm font-semibold text-[hsl(var(--fg))]">
              {format(day, "EEEE, d MMM", { locale: ru })}
            </h4>
            <div className="flex flex-wrap gap-2">
              {daySlots.length === 0 ? (
                <span className="text-xs text-[hsl(var(--muted))]">Нет свободных слотов</span>
              ) : (
                daySlots.map((slot) => {
                  const slotDate = new Date(slot.start);
                  const disabled = isBefore(slotDate, now);
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={disabled}
                      onClick={() => onSelect(slot.id)}
                      className={`rounded-full border px-3 py-1.5 text-sm transition ${
                        disabled
                          ? "cursor-not-allowed border-[hsl(var(--border))]/60 bg-[hsl(var(--panel))]/50 text-[hsl(var(--muted))] opacity-60"
                          : selected === slot.id
                          ? "border-[hsl(var(--brand))] bg-[hsl(var(--brand))] text-white"
                          : "border-[hsl(var(--border))] bg-[hsl(var(--panel))] text-[hsl(var(--fg))] hover:bg-[hsl(var(--panel))]/80"
                      }`}
                    >
                      {format(slotDate, "HH:mm")}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
