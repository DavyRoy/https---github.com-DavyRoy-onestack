"use client";
import { useParams } from "next/navigation";
import DeliveryDetails from "../../components/DeliveryDetails";

export default function DeliveryDetailPage() {
  const { deliveryId } = useParams<{ deliveryId: string }>();

  return (
    <div
      className="
        grid gap-4 w-full max-w-full min-w-0
        supports-[overflow:clip]:overflow-x-clip overflow-x-hidden
      "
    >
      {/* Хедер */}
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 min-w-0">
        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-semibold break-words">
            Доставка
          </h1>
          <p className="text-sm text-white/60 break-all">
            ID: {deliveryId}
          </p>
        </div>
      </header>

      {/* Контент */}
      <section className="min-w-0">
        <DeliveryDetails deliveryId={deliveryId} />
      </section>
    </div>
  );
}