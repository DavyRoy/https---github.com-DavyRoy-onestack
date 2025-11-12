import type { PaymentStatus } from "../data/mockUserMyOrders";

const styles: Record<PaymentStatus, string> = {
  paid: "bg-emerald-500/15 text-emerald-200 border-emerald-500/40",
  due: "bg-amber-500/15 text-amber-200 border-amber-500/40",
  refunded: "bg-sky-500/15 text-sky-200 border-sky-500/40",
};

const labels: Record<PaymentStatus, string> = {
  paid: "Оплачено",
  due: "К оплате",
  refunded: "Возврат",
};

export default function PaymentBadge({ status }: { status: PaymentStatus }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-semibold ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
