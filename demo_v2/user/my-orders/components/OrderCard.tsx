"use client";

import Link from "next/link";
import { MapPin, CreditCard as CardIcon, Package } from "lucide-react";
import StatusBadge from "./StatusBadge";
import PaymentBadge from "./PaymentBadge";
import DeliveryBadge from "./DeliveryBadge";
import type { OrderRecord } from "../data/mockUserMyOrders";

export default function OrderCard({ order, onSelect, selected, onCancel }: {
  order: OrderRecord;
  onSelect: (id: string) => void;
  selected: boolean;
  onCancel: (order: OrderRecord) => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[hsl(var(--border))]/70 bg-[hsl(var(--panel))]/70 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onSelect(order.id)}
            className="h-4 w-4 rounded border-[hsl(var(--border))] text-[hsl(var(--brand))]"
          />
          <div>
            <p className="text-sm font-semibold text-[hsl(var(--fg))]">Заказ {order.number}</p>
            <p className="text-xs text-[hsl(var(--muted))]">{new Date(order.createdAt).toLocaleString("ru-RU", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="space-y-2 text-xs text-[hsl(var(--muted))]">
        <span className="inline-flex items-center gap-2">
          <Package className="h-4 w-4" aria-hidden /> {order.items.length} поз.
        </span>
        <span className="inline-flex items-center gap-2">
          <CardIcon className="h-4 w-4" aria-hidden /> <PaymentBadge status={order.paymentStatus} />
        </span>
        <span className="inline-flex items-center gap-2">
          <MapPin className="h-4 w-4" aria-hidden />
          <DeliveryBadge method={order.deliveryMethod} status={order.deliveryStatus} />
        </span>
      </div>

      <p className="text-sm font-semibold text-[hsl(var(--fg))]">{order.total.toLocaleString("ru-RU")} ₽</p>

      <div className="flex flex-wrap gap-2 text-sm">
        {order.paymentStatus === "due" ? (
          <Link
            href={`/demo/user/payments/checkout?orderId=${order.id}`}
            className="inline-flex items-center justify-center rounded-full border border-[hsl(var(--brand))] bg-[hsl(var(--brand))] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Оплатить
          </Link>
        ) : null}
        {order.status === "delivering" && order.trackingLink ? (
          <a
            href={order.trackingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-4 py-2 text-sm font-semibold text-[hsl(var(--fg))]"
          >
            Отследить
          </a>
        ) : null}
        {order.status === "due" || order.status === "processing" ? (
          <button
            type="button"
            onClick={() => onCancel(order)}
            className="inline-flex items-center justify-center rounded-full border border-rose-500/70 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/20"
          >
            Отменить
          </button>
        ) : null}
        <Link
          href={`/demo/user/my-orders/${order.id}`}
          className="inline-flex items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-4 py-2 text-sm font-semibold text-[hsl(var(--fg))]"
        >
          Подробнее
        </Link>
      </div>
    </div>
  );
}
