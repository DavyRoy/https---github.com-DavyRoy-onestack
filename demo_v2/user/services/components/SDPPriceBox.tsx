"use client";

import Link from "next/link";

export default function SDPPriceBox({
  serviceId,
  price,
  oldPrice,
  duration,
  deposit,
  onBook,
}: {
  serviceId: string;
  price: number;
  oldPrice?: number;
  duration: number;
  deposit?: number;
  onBook: () => void;
}) {
  return (
    <aside className="space-y-4 rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/80 p-6 shadow-lg">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-[hsl(var(--muted))]">Стоимость</p>
        <p className="mt-2 text-2xl font-semibold text-[hsl(var(--fg))]">{price.toLocaleString("ru-RU")} ₽</p>
        {oldPrice ? (
          <p className="text-sm text-[hsl(var(--muted))] line-through">{oldPrice.toLocaleString("ru-RU")} ₽</p>
        ) : null}
        <p className="mt-2 text-sm text-[hsl(var(--muted))]">Длительность {duration} минут</p>
        {deposit ? (
          <p className="text-sm text-[hsl(var(--muted))]">Предоплата {deposit.toLocaleString("ru-RU")} ₽ при бронировании</p>
        ) : null}
      </div>

      <button
        type="button"
        onClick={onBook}
        className="inline-flex w-full items-center justify-center rounded-full border border-[hsl(var(--brand))] bg-[hsl(var(--brand))] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
      >
        Выбрать дату
      </button>

      <Link
        href={`/demo/user/booking?service=${serviceId}`}
        className="inline-flex w-full items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-4 py-3 text-sm font-semibold text-[hsl(var(--fg))] transition hover:bg-[hsl(var(--panel))]/80"
      >
        Записаться позднее
      </Link>
    </aside>
  );
}
