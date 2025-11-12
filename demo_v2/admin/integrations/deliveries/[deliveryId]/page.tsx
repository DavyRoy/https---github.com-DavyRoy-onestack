"use client";

import { useParams } from "next/navigation";
import DeliveryDetails from "../../components/DeliveryDetails";

export default function DeliveryDetailPage() {
  const { deliveryId } = useParams<{ deliveryId?: string }>();

  if (!deliveryId) {
    return (
      <div
        className="
          rounded-2xl border border-white/15 bg-white/[0.04] p-4 text-white/70
        "
        aria-live="polite"
      >
        Некорректный параметр доставки.
      </div>
    );
  }

  return (
    <div
      className="
        grid gap-4 w-full max-w-full min-w-0
        supports-[overflow:clip]:overflow-x-clip overflow-x-hidden
      "
    >
      {/* Хедер */}
      <header
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 min-w-0"
        aria-labelledby="delivery-title"
      >
        <div className="min-w-0">
          <h1 id="delivery-title" className="text-xl md:text-2xl font-semibold break-words">
            Доставка
          </h1>
          <p className="text-sm text-white/60 break-all">ID: {deliveryId}</p>
        </div>
      </header>

      {/* Контент */}
      <section className="min-w-0">
        <DeliveryDetails deliveryId={deliveryId} />
      </section>
    </div>
  );
}