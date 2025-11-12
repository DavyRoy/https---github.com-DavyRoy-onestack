"use client";

import Image from "next/image";
import clsx from "clsx";
import type { ServiceStaff } from "../../services/data/mockUserServices";

export default function StaffPicker({
  staff,
  selected,
  onSelect,
}: {
  staff: ServiceStaff[];
  selected: string | null;
  onSelect: (id: string | null) => void;
}) {
  if (!staff.length) return null;
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[hsl(var(--fg))]">Мастер</h3>
        <button
          type="button"
          onClick={() => onSelect(null)}
          className="text-xs text-[hsl(var(--muted))] underline-offset-4 hover:underline"
        >
          Не важно
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {staff.map((person) => (
          <button
            key={person.id}
            type="button"
            onClick={() => onSelect(person.id)}
            className={clsx(
              "flex items-center gap-3 rounded-2xl border px-3 py-2 text-left transition",
              selected === person.id
                ? "border-[hsl(var(--brand))] bg-[hsl(var(--brand))]/15"
                : "border-[hsl(var(--border))] bg-[hsl(var(--panel))]/70 hover:bg-[hsl(var(--panel))]/80"
            )}
          >
            <Image
              src={person.avatar}
              alt={person.name}
              width={48}
              height={48}
              className="h-12 w-12 rounded-full object-cover"
              unoptimized
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-[hsl(var(--fg))]">{person.name}</span>
              <span className="text-xs text-[hsl(var(--muted))]">{person.role} • {person.experience} • {person.rating.toFixed(1)} ★</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
