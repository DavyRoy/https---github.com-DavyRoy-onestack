"use client";

import { useState } from "react";
import type { OrderRecord } from "../data/mockUserMyOrders";

export default function ReturnRequestModal({ order, onClose }: { order: OrderRecord | null; onClose: () => void }) {
  const [reason, setReason] = useState("");
  if (!order) return null;
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-md space-y-4 rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/95 p-6 text-sm text-[hsl(var(--muted))] shadow-2xl">
        <h3 className="text-lg font-semibold text-[hsl(var(--fg))]">Запрос на возврат {order.number}</h3>
        <p>Выберите причину и менеджер свяжется с вами (демо режим).</p>
        <label className="flex flex-col text-xs text-[hsl(var(--muted))]">
          Причина возврата
          <select
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            className="mt-1 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/70 px-3 py-2 text-sm text-[hsl(var(--fg))]"
          >
            <option value="">Выберите</option>
            <option value="size">Не подошёл размер/формат</option>
            <option value="quality">Качество не соответствует ожиданиям</option>
            <option value="other">Другая причина</option>
          </select>
        </label>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-4 py-2 text-[hsl(var(--fg))] hover:bg-[hsl(var(--panel))]/80"
          >
            Отмена
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[hsl(var(--brand))] bg-[hsl(var(--brand))] px-4 py-2 text-white"
            disabled={!reason}
          >
            Отправить запрос
          </button>
        </div>
      </div>
    </div>
  );
}
