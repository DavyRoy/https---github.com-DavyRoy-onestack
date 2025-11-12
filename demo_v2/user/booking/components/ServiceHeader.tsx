"use client";

import Link from "next/link";
import { Clock, CreditCard, Tag } from "lucide-react";
import type { Service } from "../../services/data/mockUserServices";

export default function ServiceHeader({ service }: { service: Service }) {
  return (
    <header className="flex flex-col gap-4 rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/80 p-6 shadow-sm md:flex-row md:items-center md:justify-between">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.24em] text-[hsl(var(--muted))]">
          {service.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-[hsl(var(--border))]/70 px-2 py-1 text-[hsl(var(--muted))]">
              {tag === "new" ? "Новинка" : tag === "popular" ? "Популярно" : "Со скидкой"}
            </span>
          ))}
        </div>
        <h1 className="text-2xl font-semibold text-[hsl(var(--fg))]">{service.title}</h1>
        <p className="text-sm text-[hsl(var(--muted))]">{service.summary}</p>
        <div className="flex flex-wrap items-center gap-3 text-sm text-[hsl(var(--muted))]">
          <span className="inline-flex items-center gap-2">
            <Clock className="h-4 w-4" aria-hidden /> {service.duration} мин
          </span>
          <span className="inline-flex items-center gap-2">
            <Tag className="h-4 w-4" aria-hidden /> {service.price.toLocaleString("ru-RU")} ₽
            {service.oldPrice ? (
              <span className="text-xs text-[hsl(var(--muted))] line-through">
                {service.oldPrice.toLocaleString("ru-RU")} ₽
              </span>
            ) : null}
          </span>
          {service.deposit ? (
            <span className="inline-flex items-center gap-2">
              <CreditCard className="h-4 w-4" aria-hidden /> Депозит {service.deposit.toLocaleString("ru-RU")} ₽
            </span>
          ) : null}
        </div>
      </div>
      <Link
        href="/demo/user/services"
        className="inline-flex items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-4 py-2 text-sm font-semibold text-[hsl(var(--fg))] transition hover:bg-[hsl(var(--panel))]/80"
      >
        Сменить услугу
      </Link>
    </header>
  );
}
