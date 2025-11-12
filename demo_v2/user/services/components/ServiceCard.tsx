"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, Star, Eye } from "lucide-react";
import type { Service } from "../data/mockUserServices";
import QuickSlotBar from "./QuickSlotBar";

export type ServiceCardProps = {
  service: Service;
  onQuickView: (service: Service) => void;
};

export default function ServiceCard({ service, onQuickView }: ServiceCardProps) {
  const badge = service.tags.includes("new")
    ? "Новинка"
    : service.tags.includes("discount")
    ? "Скидка"
    : service.tags.includes("popular")
    ? "Популярно"
    : null;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/80 shadow-sm transition hover:border-[hsl(var(--brand))]/50">
      <div className="relative">
        <Image src={service.image} alt={service.title} width={640} height={360} className="h-48 w-full object-cover" unoptimized />
        {badge ? (
          <span className="absolute left-3 top-3 inline-flex items-center rounded-full border border-[hsl(var(--border))]/80 bg-[hsl(var(--panel))]/90 px-3 py-1 text-xs font-semibold text-[hsl(var(--fg))]">
            {badge}
          </span>
        ) : null}
        <button
          type="button"
          onClick={() => onQuickView(service)}
          className="pointer-events-none absolute inset-x-3 bottom-3 inline-flex items-center justify-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/90 px-3 py-1.5 text-xs font-semibold text-[hsl(var(--fg))] opacity-0 transition group-hover:pointer-events-auto group-hover:opacity-100"
        >
          <Eye className="h-4 w-4" aria-hidden /> Быстрый просмотр
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <Link href={`/demo/user/services/${service.slug}`} className="text-sm font-semibold text-[hsl(var(--fg))] hover:underline">
              {service.title}
            </Link>
            <p className="text-xs text-[hsl(var(--muted))]">{service.summary}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-[hsl(var(--fg))]">{service.price.toLocaleString("ru-RU")} ₽</p>
            {service.oldPrice ? (
              <p className="text-xs text-[hsl(var(--muted))] line-through">{service.oldPrice.toLocaleString("ru-RU")} ₽</p>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-[hsl(var(--muted))]">
          <Clock className="h-4 w-4" aria-hidden /> {service.duration} мин
          <span className="inline-flex items-center gap-1">
            <Star className="h-4 w-4 text-amber-300" aria-hidden /> {service.rating.toFixed(1)} • {service.reviewsCount}
          </span>
        </div>

        <QuickSlotBar serviceId={service.id} slots={service.quickSlots} />

        <div className="mt-auto flex flex-wrap gap-2">
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
    </article>
  );
}
