"use client";

import type { OrderRecord } from "../data/mockUserMyOrders";

export default function CancelOrderModal({ order, onClose }: { order: OrderRecord | null; onClose: () => void }) {
  if (!order) return null;
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-md space-y-4 rounded-3xl border border-rose-500/60 bg-[hsl(var(--panel))]/95 p-6 text-sm text-[hsl(var(--muted))] shadow-2xl">
        <h3 className="text-lg font-semibold text-rose-200">Отменить заказ {order.number}?</h3>
        <p>
          Отмена доступна до отгрузки. После подтверждения средства вернутся на карту в течение 3-5 дней. (Демонстрация — данные не сохраняются.)
        </p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-4 py-2 text-[hsl(var(--fg))] hover:bg-[hsl(var(--panel))]/80"
          >
            Вернуться
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-rose-500 bg-rose-500/90 px-4 py-2 text-white"
          >
            Подтвердить отмену
          </button>
        </div>
      </div>
    </div>
  );
}
