import type { OrderStatus } from "../data/mockUserMyOrders";

const styles: Record<OrderStatus, string> = {
  due: "bg-amber-500/15 text-amber-200 border-amber-500/40",
  processing: "bg-blue-500/15 text-blue-200 border-blue-500/40",
  delivering: "bg-purple-500/15 text-purple-200 border-purple-500/40",
  delivered: "bg-emerald-500/15 text-emerald-200 border-emerald-500/40",
  completed: "bg-emerald-500/15 text-emerald-200 border-emerald-500/40",
  cancelled: "bg-rose-500/15 text-rose-200 border-rose-500/40",
};

const labels: Record<OrderStatus, string> = {
  due: "Ожидает оплаты",
  processing: "В обработке",
  delivering: "Доставка",
  delivered: "Доставлен",
  completed: "Завершён",
  cancelled: "Отменён",
};

export default function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
