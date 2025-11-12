import Link from "next/link";
import { ArrowLeft, Calendar, Package } from "lucide-react";
import type { OrderRecord } from "../data/mockUserMyOrders";
import StatusBadge from "./StatusBadge";
import PaymentBadge from "./PaymentBadge";

export default function OrderHeader({ order }: { order: OrderRecord }) {
  return (
    <header className="space-y-3 rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/80 p-6 shadow-sm">
      <Link href="/demo/user/my-orders" className="inline-flex items-center gap-2 text-sm text-[hsl(var(--muted))] hover:text-[hsl(var(--fg))]">
        <ArrowLeft className="h-4 w-4" aria-hidden /> Назад к списку
      </Link>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-[hsl(var(--fg))]">Заказ {order.number}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-[hsl(var(--muted))]">
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4" aria-hidden />
              {new Date(order.createdAt).toLocaleString("ru-RU", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </span>
            <span className="inline-flex items-center gap-2">
              <Package className="h-4 w-4" aria-hidden /> {order.items.length} позиций
            </span>
            <PaymentBadge status={order.paymentStatus} />
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>
    </header>
  );
}
