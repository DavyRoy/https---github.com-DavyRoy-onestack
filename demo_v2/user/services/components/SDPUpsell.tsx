"use client";

import Link from "next/link";
import Image from "next/image";
import type { Service } from "../data/mockUserServices";

export default function SDPUpsell({ services }: { services: Service[] }) {
  if (!services.length) return null;
  return (
    <section className="space-y-3 rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/70 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-[hsl(var(--fg))]">Дополнительные услуги</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {services.map((service) => (
          <Link
            key={service.id}
            href={`/demo/user/services/${service.slug}`}
            className="flex items-center gap-3 rounded-2xl border border-[hsl(var(--border))]/60 bg-[hsl(var(--panel))]/60 p-3 transition hover:border-[hsl(var(--brand))]/50"
          >
            <Image src={service.image} alt={service.title} width={64} height={64} className="h-16 w-16 rounded-xl object-cover" unoptimized />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-[hsl(var(--fg))]">{service.title}</span>
              <span className="text-xs text-[hsl(var(--muted))]">{service.price.toLocaleString("ru-RU")} ₽ • {service.duration} мин</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
