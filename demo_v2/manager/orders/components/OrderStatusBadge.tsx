"use client";
import React from "react";
import clsx from "clsx";
import type { OrderStatus } from "@/app/demo/manager/orders/data/mockOrders";

/**
 * Карточка статуса заказа с контрастными цветами для светлой/тёмной темы.
 * Поддерживает семантические aria-метки и табличное выравнивание текста.
 */

const STATUS_MAP: Record<
  OrderStatus,
  { label: string; tone: string; border?: string }
> = {
  new: {
    label: "Новый",
    tone: "bg-white/10 text-white",
    border: "border-white/20",
  },
  confirmed: {
    label: "Подтв.",
    tone: "bg-amber-200/90 text-amber-900 dark:bg-amber-300/20 dark:text-amber-200",
  },
  paid: {
    label: "Оплачен",
    tone: "bg-emerald-200/90 text-emerald-900 dark:bg-emerald-300/20 dark:text-emerald-200",
  },
  completed: {
    label: "Выполнен",
    tone: "bg-white text-black dark:bg-white/20 dark:text-white",
  },
  cancelled: {
    label: "Отменён",
    tone: "bg-red-200/90 text-red-900 dark:bg-red-300/20 dark:text-red-200",
  },
  refunded: {
    label: "Возврат",
    tone: "bg-sky-200/90 text-sky-900 dark:bg-sky-300/20 dark:text-sky-200",
  },
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_MAP[status];
  if (!cfg) return null;

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium tabular-nums select-none",
        cfg.tone,
        cfg.border || "border-transparent"
      )}
      aria-label={`Статус заказа: ${cfg.label}`}
      title={cfg.label}
    >
      {cfg.label}
    </span>
  );
}