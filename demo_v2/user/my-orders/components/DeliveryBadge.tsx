import type { DeliveryMethod } from "../data/mockUserMyOrders";

const labels: Record<DeliveryMethod, string> = {
  pickup: "Самовывоз",
  courier: "Курьер",
  post: "Почта",
};

export default function DeliveryBadge({ method, status }: { method: DeliveryMethod; status?: string }) {
  return (
    <span className="inline-flex flex-col rounded-xl border border-[hsl(var(--border))]/60 bg-[hsl(var(--panel))]/80 px-3 py-1 text-[0.7rem] text-[hsl(var(--muted))]">
      <span className="font-semibold text-[hsl(var(--fg))]">{labels[method]}</span>
      {status ? <span>{status}</span> : null}
    </span>
  );
}
