"use client";

import type { OrderRecord } from "../data/mockUserMyOrders";

export default function BulkActionsBar({
  selected,
  orders,
  onClear,
  onCancel,
  onDownloadInvoices,
  onRepeat,
}: {
  selected: string[];
  orders: OrderRecord[];
  onClear: () => void;
  onCancel: (ids: string[]) => void;
  onDownloadInvoices: () => void;
  onRepeat: () => void;
}) {
  if (!selected.length) return null;
  const selectedOrders = orders.filter((order) => selected.includes(order.id));
  const cancellable = selectedOrders.every((order) => order.status === "due" || order.status === "processing");
  const payDue = selectedOrders.filter((order) => order.paymentStatus === "due");

  return (
    <div className="sticky top-20 z-30 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/95 p-3 shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-[hsl(var(--muted))]">
        <span>Выбрано заказов: {selected.length}</span>
        <div className="flex flex-wrap gap-2">
          {cancellable ? (
            <button
              type="button"
              onClick={() => onCancel(selected)}
              className="inline-flex items-center justify-center rounded-full border border-rose-500/70 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-200 hover:bg-rose-500/20"
            >
              Отменить выбранные
            </button>
          ) : null}
          {payDue.length ? (
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full border border-[hsl(var(--brand))] bg-[hsl(var(--brand))] px-4 py-2 text-sm font-semibold text-white"
            >
              Оплатить (демо)
            </button>
          ) : null}
          <button
            type="button"
            onClick={onDownloadInvoices}
            className="inline-flex items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-4 py-2 text-sm font-semibold text-[hsl(var(--fg))]"
          >
            Скачать счета
          </button>
          <button
            type="button"
            onClick={onRepeat}
            className="inline-flex items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-4 py-2 text-sm font-semibold text-[hsl(var(--fg))]"
          >
            Повторить
          </button>
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-4 py-2 text-sm font-semibold text-[hsl(var(--fg))]"
          >
            Очистить
          </button>
        </div>
      </div>
    </div>
  );
}
