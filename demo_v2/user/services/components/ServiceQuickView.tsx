"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { X, Clock, MapPin, Star } from "lucide-react";
import type { Service } from "../data/mockUserServices";
import QuickSlotBar from "./QuickSlotBar";

export type ServiceQuickViewProps = {
  service: Service | null;
  open: boolean;
  onClose: () => void;
};

const overlayClasses = "fixed inset-0 z-[1300] flex items-center justify-center bg-black/70 px-4 py-8";

export default function ServiceQuickView({ service, open, onClose }: ServiceQuickViewProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || !service) return null;

  return createPortal(
    <div className={overlayClasses} role="dialog" aria-modal aria-label={`Быстрый просмотр ${service.title}`}>
      <div className="relative flex w-full max-w-3xl flex-col gap-6 overflow-hidden rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/90 p-6 shadow-2xl sm:flex-row sm:gap-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[hsl(var(--border))] text-[hsl(var(--fg))] hover:bg-[hsl(var(--panel))]/80"
          aria-label="Закрыть"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>

        <div className="flex-1 overflow-hidden rounded-2xl bg-black/40">
          <Image src={service.image} alt={service.title} width={540} height={540} className="h-full w-full object-cover" unoptimized />
        </div>

        <div className="flex w-full flex-1 flex-col gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[hsl(var(--muted))]">Услуга</p>
            <h2 className="mt-1 text-lg font-semibold text-[hsl(var(--fg))]">{service.title}</h2>
            <p className="text-sm text-[hsl(var(--muted))]">{service.summary}</p>
          </div>

          <div className="flex items-center gap-3 text-xs text-[hsl(var(--muted))]">
            <Clock className="h-4 w-4" aria-hidden /> {service.duration} мин
            <span className="inline-flex items-center gap-1">
              <Star className="h-4 w-4 text-amber-300" aria-hidden /> {service.rating.toFixed(1)} • {service.reviewsCount}
            </span>
          </div>

          <div className="space-y-2 text-sm text-[hsl(var(--muted))]">
            {service.locations.map((loc) => (
              <div key={loc.id} className="flex items-center gap-2">
                <MapPin className="h-4 w-4" aria-hidden /> {loc.label} • {loc.address}
              </div>
            ))}
          </div>

          <QuickSlotBar serviceId={service.id} slots={service.quickSlots} />

          <div className="mt-auto flex flex-col gap-2">
            <div className="text-lg font-semibold text-[hsl(var(--fg))]">
              {service.price.toLocaleString("ru-RU")} ₽
              {service.oldPrice ? (
                <span className="ml-2 text-xs text-[hsl(var(--muted))] line-through">
                  {service.oldPrice.toLocaleString("ru-RU")} ₽
                </span>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/demo/user/booking?service=${service.id}`}
                className="inline-flex items-center justify-center rounded-full border border-[hsl(var(--brand))] bg-[hsl(var(--brand))] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Записаться
              </Link>
              <Link
                href={`/demo/user/services/${service.slug}`}
                className="inline-flex items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-4 py-2 text-sm font-semibold text-[hsl(var(--fg))] transition hover:bg-[hsl(var(--panel))]/80"
              >
                Подробнее
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
