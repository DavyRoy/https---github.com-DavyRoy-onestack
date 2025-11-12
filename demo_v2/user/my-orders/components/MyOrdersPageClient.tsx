"use client";

import { useMemo, useState } from "react";
import OrdersHeader from "./OrdersHeader";
import FiltersBar, { type OrdersFilters } from "./FiltersBar";
import OrdersTable from "./OrdersTable";
import BulkActionsBar from "./BulkActionsBar";
import EmptyState from "./EmptyState";
import CancelOrderModal from "./CancelOrderModal";
import ReturnRequestModal from "./ReturnRequestModal";
import { orders } from "../data/mockUserMyOrders";
import type { OrderRecord } from "../data/mockUserMyOrders";

const shiftDays = (date: Date, days: number) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

export default function MyOrdersPageClient() {
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState("30");
  const [filters, setFilters] = useState<OrdersFilters>({ status: "all", payment: "any", delivery: "any", type: "any", returnsOnly: false });
  const [selected, setSelected] = useState<string[]>([]);
  const [cancelOrder, setCancelOrder] = useState<OrderRecord | null>(null);
  const [returnOrder, setReturnOrder] = useState<OrderRecord | null>(null);

  const filteredOrders = useMemo(() => {
    const now = new Date();
    const rangeDays = dateRange === "custom" ? null : Number(dateRange);
    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      if (rangeDays !== null) {
        const min = shiftDays(now, -rangeDays);
        const max = shiftDays(now, rangeDays);
        if (orderDate < min || orderDate > max) return false;
      }
      if (filters.status !== "all" && order.status !== filters.status) return false;
      if (filters.payment !== "any" && order.paymentStatus !== filters.payment) return false;
      if (filters.delivery !== "any" && order.deliveryMethod !== filters.delivery) return false;
      if (filters.type !== "any" && order.type !== filters.type) return false;
      if (filters.returnsOnly && order.paymentStatus !== "refunded") return false;
      if (search) {
        const needle = search.toLowerCase();
        const haystack = [
          order.number,
          order.trackingCode ?? "",
          ...order.items.map((item) => item.title),
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(needle)) return false;
      }
      return true;
    });
  }, [dateRange, filters, search]);

  const toggleSelection = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const toggleAll = (checked: boolean) => {
    if (checked) setSelected(filteredOrders.map((order) => order.id));
    else setSelected([]);
  };

  return (
    <div className="flex flex-col gap-4 pb-24 lg:pb-0">
      <OrdersHeader search={search} onSearchChange={setSearch} dateRange={dateRange} onDateRangeChange={setDateRange} />

      <FiltersBar
        filters={filters}
        onChange={(next) => {
          setFilters(next);
          setSelected([]);
        }}
      />

      <BulkActionsBar
        selected={selected}
        orders={filteredOrders}
        onClear={() => setSelected([])}
        onCancel={(ids) => setCancelOrder(filteredOrders.find((order) => order.id === ids[0]) ?? null)}
        onDownloadInvoices={() => null}
        onRepeat={() => null}
      />

      {filteredOrders.length ? (
        <OrdersTable
          orders={filteredOrders}
          selected={selected}
          onToggle={toggleSelection}
          onToggleAll={toggleAll}
          onCancel={(order) => setCancelOrder(order)}
        />
      ) : (
        <EmptyState />
      )}

      <CancelOrderModal order={cancelOrder} onClose={() => setCancelOrder(null)} />
      <ReturnRequestModal order={returnOrder} onClose={() => setReturnOrder(null)} />
    </div>
  );
}
