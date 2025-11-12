"use client";

import Link from "next/link";
import StatusBadge from "./StatusBadge";
import PaymentBadge from "./PaymentBadge";
import DeliveryBadge from "./DeliveryBadge";
import OrderCard from "./OrderCard";
import type { OrderRecord } from "../data/mockUserMyOrders";

export default function OrdersTable({
  orders,
  selected,
  onToggle,
  onToggleAll,
  onCancel,
}: {
  orders: OrderRecord[];
  selected: string[];
  onToggle: (id: string) => void;
  onToggleAll: (checked: boolean) => void;
  onCancel: (order: OrderRecord) => void;
}) {
  if (!orders.length) return null;

  return (
    <div className="space-y-4">
      <div className="hidden overflow-hidden rounded-2xl border border-[hsl(var(--border))]/70 bg-[hsl(var(--panel))]/60 shadow-sm md:block">
        <table className="min-w-full divide-y divide-[hsl(var(--border))]/60 text-sm">
          <thead className="bg-[hsl(var(--panel))]/80 text-xs uppercase tracking-[0.24em] text-[hsl(var(--muted))]">
            <tr>
              <th className="px-3 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selected.length > 0 && selected.length === orders.length}
                  onChange={(event) => onToggleAll(event.target.checked)}
                  className="h-4 w-4 rounded border-[hsl(var(--border))] text-[hsl(var(--brand))]"
                />
              </th>
              <th className="px-3 py-3 text-left">Номер</th>
              <th className="px-3 py-3 text-left">Дата</th>
              <th className="px-3 py-3 text-left">Позиции</th>
              <th className="px-3 py-3 text-left">Сумма</th>
              <th className="px-3 py-3 text-left">Оплата</th>
              <th className="px-3 py-3 text-left">Доставка</th>
              <th className="px-3 py-3 text-left">Статус</th>
              <th className="px-3 py-3 text-left">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[hsl(var(--border))]/60 bg-[hsl(var(--panel))]/60 text-sm text-[hsl(var(--muted))]">
            {orders.map((order) => (
              <tr key={order.id} className={selected.includes(order.id) ? "bg-[hsl(var(--brand))]/10" : ""}>
                <td className="px-3 py-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(order.id)}
                    onChange={() => onToggle(order.id)}
                    className="h-4 w-4 rounded border-[hsl(var(--border))] text-[hsl(var(--brand))]"
                  />
                </td>
                <td className="px-3 py-3 text-[hsl(var(--fg))] font-semibold">{order.number}</td>
                <td className="px-3 py-3">{new Date(order.createdAt).toLocaleDateString("ru-RU", { day: "2-digit", month: "short", year: "numeric" })}</td>
                <td className="px-3 py-3">{order.items.length} поз.</td>
                <td className="px-3 py-3 text-[hsl(var(--fg))] font-semibold">{order.total.toLocaleString("ru-RU")} ₽</td>
                <td className="px-3 py-3"><PaymentBadge status={order.paymentStatus} /></td>
                <td className="px-3 py-3"><DeliveryBadge method={order.deliveryMethod} status={order.deliveryStatus} /></td>
                <td className="px-3 py-3"><StatusBadge status={order.status} /></td>
                <td className="px-3 py-3">
                  <div className="flex flex-wrap gap-2">
                    {order.paymentStatus === "due" ? (
                      <Link
                        href={`/demo/user/payments/checkout?orderId=${order.id}`}
                        className="inline-flex items-center justify-center rounded-full border border-[hsl(var(--brand))] bg-[hsl(var(--brand))] px-3 py-1 text-xs font-semibold text-white"
                      >
                        Оплатить
                      </Link>
                    ) : null}
                    {order.status === "delivering" && order.trackingLink ? (
                      <a
                        href={order.trackingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-3 py-1 text-xs font-semibold text-[hsl(var(--fg))]"
                      >
                        Отследить
                      </a>
                    ) : null}
                    {order.status === "due" || order.status === "processing" ? (
                      <button
                        type="button"
                        onClick={() => onCancel(order)}
                        className="inline-flex items-center justify-center rounded-full border border-rose-500/70 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-200"
                      >
                        Отменить
                      </button>
                    ) : null}
                    <Link
                      href={`/demo/user/my-orders/${order.id}`}
                      className="inline-flex items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-3 py-1 text-xs font-semibold text-[hsl(var(--fg))]"
                    >
                      Подробнее
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 md:hidden">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} selected={selected.includes(order.id)} onSelect={onToggle} onCancel={onCancel} />
        ))}
      </div>
    </div>
  );
}
