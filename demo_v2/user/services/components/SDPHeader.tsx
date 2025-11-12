"use client";

import { Clock, MapPin, Star } from "lucide-react";
import type { Service } from "../data/mockUserServices";
import { serviceCategories } from "../data/mockUserServicesCategories";

function getCategoryLabel(categoryId: string) {
  for (const category of serviceCategories) {
    if (category.id === categoryId) return category.name;
    const child = category.children?.find((child) => child.id === categoryId);
    if (child) return `${category.name} • ${child.name}`;
  }
  return "Услуги";
}

export default function SDPHeader({ service }: { service: Service }) {
  return (
    <header className="space-y-4 rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/80 p-6 shadow-sm">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.24em] text-[hsl(var(--muted))]">{getCategoryLabel(service.categoryId)}</p>
        <h1 className="text-2xl font-semibold text-[hsl(var(--fg))]">{service.title}</h1>
        <p className="text-sm text-[hsl(var(--muted))]">{service.summary}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm text-[hsl(var(--muted))]">
        <span className="inline-flex items-center gap-1">
          <Clock className="h-4 w-4" aria-hidden /> {service.duration} мин
        </span>
        <span className="inline-flex items-center gap-1">
          <Star className="h-4 w-4 text-amber-300" aria-hidden /> {service.rating.toFixed(1)} • {service.reviewsCount}
        </span>
        {service.locations.map((loc) => (
          <span key={loc.id} className="inline-flex items-center gap-1 whitespace-nowrap">
            <MapPin className="h-4 w-4" aria-hidden /> {loc.label}
          </span>
        ))}
      </div>
    </header>
  );
}
