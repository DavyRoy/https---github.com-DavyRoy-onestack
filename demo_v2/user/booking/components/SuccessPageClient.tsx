"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import CalendarExport from "./CalendarExport";
import { services } from "../../services/data/mockUserServices";

const tips = [
  "Придите на 10 минут раньше, чтобы спокойно подготовиться.",
  "Не принимайте плотную пищу за час до процедуры.",
  "Возьмите бонус-карту OneStack для начисления баллов.",
];

export default function SuccessPageClient() {
  const params = useSearchParams();
  const service = useMemo(() => {
    const id = params.get("service");
    if (!id) return services[0];
    return services.find((item) => item.id === id || item.slug === id) ?? services[0];
  }, [params]);

  const slotStart = params.get("slot");
  const slotDate = slotStart ? new Date(slotStart) : null;

  return (
    <div className="flex flex-col gap-6 pb-24 lg:pb-0">
      <section className="space-y-3 rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/80 p-6 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-[hsl(var(--fg))]">Запись подтверждена</h1>
        <p className="text-sm text-[hsl(var(--muted))]">
          Мы отправили подтверждение на email и SMS. Можете добавить встречу в календарь.
        </p>
      </section>

      <section className="space-y-2 rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/70 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[hsl(var(--fg))]">Детали записи</h2>
        <p className="text-sm text-[hsl(var(--muted))]">{service.title}</p>
        {slotDate ? (
          <p className="text-sm text-[hsl(var(--muted))]">
            {slotDate.toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" })} • {slotDate.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
          </p>
        ) : null}
        <p className="text-sm text-[hsl(var(--muted))]">Стоимость: {service.price.toLocaleString("ru-RU")} ₽ • Длительность {service.duration} мин</p>
      </section>

      <CalendarExport
        icsHref="/demo/api/booking/ics-demo.ics"
        googleHref="https://calendar.google.com"
        appleHref="https://www.icloud.com/calendar/"
      />

      <section className="space-y-3 rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/70 p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-[hsl(var(--fg))]">Подготовка</h3>
        <ul className="space-y-2 text-sm text-[hsl(var(--muted))]">
          {tips.map((tip) => (
            <li key={tip} className="flex gap-2">
              <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-[hsl(var(--brand))]" aria-hidden />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/demo/user/my-bookings"
          className="inline-flex items-center justify-center rounded-full border border-[hsl(var(--brand))] bg-[hsl(var(--brand))] px-4 py-2 text-sm font-semibold text-white"
        >
          Мои записи
        </Link>
        <Link
          href="/demo/user/payments/checkout"
          className="inline-flex items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-4 py-2 text-sm font-semibold text-[hsl(var(--fg))]"
        >
          Перейти к оплате
        </Link>
        <Link
          href="/demo/user/shop"
          className="inline-flex items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-4 py-2 text-sm font-semibold text-[hsl(var(--fg))]"
        >
          В магазин
        </Link>
      </div>
    </div>
  );
}
