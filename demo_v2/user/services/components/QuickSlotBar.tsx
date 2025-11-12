"use client";

import Link from "next/link";
import type { ServiceSlot } from "../data/mockUserServices";

export type QuickSlotBarProps = {
  serviceId: string;
  slots: ServiceSlot[];
};

const formatLabel = (start: string) => {
  const date = new Date(start);
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const isTomorrow = date.toDateString() === tomorrow.toDateString();
  const formatter = new Intl.DateTimeFormat("ru-RU", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  const time = date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
  if (sameDay) return `Сегодня ${time}`;
  if (isTomorrow) return `Завтра ${time}`;
  return `${formatter.format(date)} ${time}`;
};

export default function QuickSlotBar({ serviceId, slots }: QuickSlotBarProps) {
  if (!slots.length) return null;
  return (
    <div className="flex gap-2 overflow-x-auto text-xs text-[hsl(var(--muted))]">
      {slots.map((slot) => (
        <Link
          key={slot.id}
          href={`/demo/user/booking?service=${serviceId}&slot=${encodeURIComponent(slot.start)}`}
          className="inline-flex shrink-0 items-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/80 px-3 py-1.5 text-[hsl(var(--fg))] transition hover:bg-[hsl(var(--panel))]/70"
        >
          {formatLabel(slot.start)}
        </Link>
      ))}
    </div>
  );
}
