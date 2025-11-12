"use client";

import { useState } from "react";
import type { OrderRecord } from "../data/mockUserMyOrders";

export default function TrackParcel({ order }: { order: OrderRecord }) {
  const [drawOpen, setDrawOpen] = useState(false);
  if (order.deliveryMethod !== "courier" || !order.trackingCode) return null;
  return (
    <section className="space-y-3 rounded-3xl border border-[hsl(var(--border))]/70 bg-[hsl(var(--panel))]/70 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[hsl(var(--fg))]">Отслеживание посылки</h3>
        <button
          type="button"
          onClick={() => setDrawOpen((prev) => !prev)}
          className="rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-4 py-1 text-xs text-[hsl(var(--muted))]"
        >
          {drawOpen ? "Скрыть" : "Показать"}
        </button>
      </div>
      {drawOpen ? (
        <div className="space-y-2 text-sm text-[hsl(var(--muted))]">
          <p>Трек-код: {order.trackingCode}</p>
          <a
            href={order.trackingLink ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-4 py-2 text-sm font-semibold text-[hsl(var(--fg))] hover:bg-[hsl(var(--panel))]/80"
          >
            Открыть страницу отслеживания
          </a>
          <div className="rounded-xl border border-[hsl(var(--border))]/60 bg-[hsl(var(--panel))]/60 px-4 py-3 text-xs text-[hsl(var(--muted))]">
            Последнее обновление: {order.deliveryStatus}
          </div>
        </div>
      ) : null}
    </section>
  );
}
