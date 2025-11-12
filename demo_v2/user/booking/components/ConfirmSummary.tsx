"use client";

import Image from "next/image";
import type { Service } from "../../services/data/mockUserServices";

export type ConfirmSummaryProps = {
  service: Service;
  slot: { start: string; staffName?: string; locationLabel?: string } | null;
  addons: Array<{ id: string; title: string; price: number; duration: number }>;
  total: number;
  deposit?: number;
};

export default function ConfirmSummary({ service, slot, addons, total, deposit }: ConfirmSummaryProps) {
  const slotDate = slot ? new Date(slot.start) : null;
  return (
    <section className="space-y-4 rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/80 p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <Image src={service.image} alt={service.title} width={80} height={80} className="h-20 w-20 rounded-2xl object-cover" unoptimized />
        <div>
          <h2 className="text-lg font-semibold text-[hsl(var(--fg))]">{service.title}</h2>
          <p className="text-sm text-[hsl(var(--muted))]">{service.summary}</p>
        </div>
      </div>

      {slotDate ? (
        <div className="space-y-1 text-sm text-[hsl(var(--muted))]">
          <p>
            Дата: {slotDate.toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" })}
          </p>
          <p>Время: {slotDate.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}</p>
          {slot?.locationLabel ? <p>Локация: {slot.locationLabel}</p> : null}
          {slot?.staffName ? <p>Мастер: {slot.staffName}</p> : <p>Мастер будет назначен</p>}
        </div>
      ) : (
        <p className="text-sm text-[hsl(var(--muted))]">Выберите дату и мастерa на предыдущем шаге.</p>
      )}

      {addons.length ? (
        <div className="space-y-2 text-sm text-[hsl(var(--muted))]">
          <p className="font-semibold text-[hsl(var(--fg))]">Дополнительные услуги</p>
          <ul className="space-y-1">
            {addons.map((addon) => (
              <li key={addon.id} className="flex items-center justify-between">
                <span>{addon.title}</span>
                <span>+{addon.price.toLocaleString("ru-RU")} ₽</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="space-y-1 text-sm text-[hsl(var(--muted))]">
        <p>Итого: <span className="text-lg font-semibold text-[hsl(var(--fg))]">{total.toLocaleString("ru-RU")} ₽</span></p>
        {deposit ? (
          <p>Депозит к оплате сейчас: {deposit.toLocaleString("ru-RU")} ₽</p>
        ) : (
          <p>Оплата после оказания услуги. Депозита нет.</p>
        )}
      </div>
    </section>
  );
}
