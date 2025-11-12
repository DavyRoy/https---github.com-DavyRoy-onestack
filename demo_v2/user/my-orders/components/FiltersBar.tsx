"use client";

import type { OrderStatus, PaymentStatus, DeliveryMethod, OrderType } from "../data/mockUserMyOrders";

export type OrdersFilters = {
  status: OrderStatus | "all";
  payment: PaymentStatus | "any";
  delivery: DeliveryMethod | "any";
  type: OrderType | "any";
  returnsOnly: boolean;
};

export default function FiltersBar({
  filters,
  onChange,
}: {
  filters: OrdersFilters;
  onChange: (filters: OrdersFilters) => void;
}) {
  return (
    <section className="flex flex-wrap items-center gap-3 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/80 px-4 py-3 text-sm text-[hsl(var(--muted))]">
      <label className="flex items-center gap-2">
        Статус
        <select
          value={filters.status}
          onChange={(event) => onChange({ ...filters, status: event.target.value as OrdersFilters["status"] })}
          className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/90 px-3 py-1 text-sm text-[hsl(var(--fg))]"
        >
          <option value="due">Ожидают оплаты</option>
          <option value="processing">В обработке</option>
          <option value="delivering">Доставка</option>
          <option value="delivered">Доставлено</option>
          <option value="completed">Завершено</option>
          <option value="cancelled">Отменено</option>
          <option value="all">Все</option>
        </select>
      </label>

      <label className="flex items-center gap-2">
        Оплата
        <select
          value={filters.payment}
          onChange={(event) => onChange({ ...filters, payment: event.target.value as OrdersFilters["payment"] })}
          className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/90 px-3 py-1 text-sm text-[hsl(var(--fg))]"
        >
          <option value="paid">Оплачено</option>
          <option value="due">К оплате</option>
          <option value="refunded">Возврат</option>
          <option value="any">Любые</option>
        </select>
      </label>

      <label className="flex items-center gap-2">
        Доставка
        <select
          value={filters.delivery}
          onChange={(event) => onChange({ ...filters, delivery: event.target.value as OrdersFilters["delivery"] })}
          className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/90 px-3 py-1 text-sm text-[hsl(var(--fg))]"
        >
          <option value="pickup">Самовывоз</option>
          <option value="courier">Курьер</option>
          <option value="post">Почта</option>
          <option value="any">Любые</option>
        </select>
      </label>

      <label className="flex items-center gap-2">
        Тип
        <select
          value={filters.type}
          onChange={(event) => onChange({ ...filters, type: event.target.value as OrdersFilters["type"] })}
          className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/90 px-3 py-1 text-sm text-[hsl(var(--fg))]"
        >
          <option value="products">Товары</option>
          <option value="services">Услуги</option>
          <option value="mixed">Смешанный</option>
          <option value="any">Любые</option>
        </select>
      </label>

      <label className="inline-flex items-center gap-2">
        <input
          type="checkbox"
          checked={filters.returnsOnly}
          onChange={(event) => onChange({ ...filters, returnsOnly: event.target.checked })}
          className="h-4 w-4 rounded border-[hsl(var(--border))] text-[hsl(var(--brand))]"
        />
        Только возвраты
      </label>
    </section>
  );
}
