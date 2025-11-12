"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import OrderHeader from "./OrderHeader";
import OrderItems from "./OrderItems";
import OrderSummary from "./OrderSummary";
import OrderTimeline from "./OrderTimeline";
import AddressBlock from "./AddressBlock";
import InvoiceLinks from "./InvoiceLinks";
import TrackParcel from "./TrackParcel";
import CancelOrderModal from "./CancelOrderModal";
import ReturnRequestModal from "./ReturnRequestModal";
import { orders } from "../data/mockUserMyOrders";
import type { OrderRecord } from "../data/mockUserMyOrders";

export default function OrderDetailPageClient() {
  const params = useParams();
  const router = useRouter();
  const order = useMemo(() => orders.find((item) => item.id === params?.id), [params]);
  const [cancelOrder, setCancelOrder] = useState<OrderRecord | null>(null);
  const [returnOrder, setReturnOrder] = useState<OrderRecord | null>(null);

  if (!order) {
    return (
      <div className="space-y-4 text-sm text-[hsl(var(--muted))]">
        <p>Заказ не найден.</p>
        <button
          type="button"
          onClick={() => router.push("/demo/user/my-orders")}
          className="inline-flex items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-4 py-2 text-sm text-[hsl(var(--fg))]"
        >
          Вернуться к списку
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-24 lg:pb-0">
      <OrderHeader order={order} />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <OrderItems items={order.items} />
          <TrackParcel order={order} />
          <OrderTimeline entries={order.timeline} />
        </div>

        <div className="space-y-4">
          <OrderSummary
            subtotal={order.subtotal}
            discount={order.discount}
            deliveryFee={order.deliveryFee}
            tax={order.tax}
            total={order.total}
          />
          <AddressBlock order={order} />
          <InvoiceLinks order={order} />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-sm">
        {(order.status === "due" || order.status === "processing") && (
          <button
            type="button"
            onClick={() => setCancelOrder(order)}
            className="inline-flex items-center justify-center rounded-full border border-rose-500/70 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-200"
          >
            Отменить заказ
          </button>
        )}
        {order.paymentStatus === "due" ? (
          <button
            type="button"
            onClick={() => router.push(`/demo/user/payments/checkout?orderId=${order.id}`)}
            className="inline-flex items-center justify-center rounded-full border border-[hsl(var(--brand))] bg-[hsl(var(--brand))] px-4 py-2 text-sm font-semibold text-white"
          >
            Оплатить
          </button>
        ) : null}
        {order.paymentStatus === "refunded" || order.status === "delivered" || order.status === "completed" ? (
          <button
            type="button"
            onClick={() => setReturnOrder(order)}
            className="inline-flex items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-4 py-2 text-sm font-semibold text-[hsl(var(--fg))]"
          >
            Оформить возврат
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => router.push(`/demo/user/shop?repeat=${order.id}`)}
          className="inline-flex items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-4 py-2 text-sm font-semibold text-[hsl(var(--fg))]"
        >
          Повторить заказ
        </button>
      </div>

      <CancelOrderModal order={cancelOrder} onClose={() => setCancelOrder(null)} />
      <ReturnRequestModal order={returnOrder} onClose={() => setReturnOrder(null)} />
    </div>
  );
}
