"use client";

import clsx from "clsx";
import type { ServiceLocation } from "../../services/data/mockUserServices";

export default function LocationPicker({
  locations,
  selected,
  onSelect,
}: {
  locations: ServiceLocation[];
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  if (locations.length <= 1) return null;
  return (
    <section className="space-y-2">
      <h3 className="text-sm font-semibold text-[hsl(var(--fg))]">Локация</h3>
      <div className="flex flex-wrap gap-2">
        {locations.map((location) => (
          <button
            key={location.id}
            type="button"
            onClick={() => onSelect(location.id)}
            className={clsx(
              "rounded-full border px-3 py-1.5 text-sm transition",
              selected === location.id
                ? "border-[hsl(var(--brand))] bg-[hsl(var(--brand))]/15 text-[hsl(var(--fg))]"
                : "border-[hsl(var(--border))] bg-[hsl(var(--panel))]/70 text-[hsl(var(--muted))] hover:bg-[hsl(var(--panel))]/80"
            )}
          >
            {location.label}
          </button>
        ))}
      </div>
    </section>
  );
}
