"use client";
import Link from "next/link";
import OrderAmount from "./OrderAmount";
import OrderStatusBadge from "./OrderStatusBadge";
import OrderActionsMenu from "./OrderActionsMenu";
import type { Order } from "@/app/demo/manager/orders/data/mockOrders";

export default function OrdersTableRow({
  row,
  checked,
  onToggle,
  onAction,
}: {
  row: Order;
  checked: boolean;
  onToggle: (id: string) => void;
  onAction: (id: string, action: string) => void;
}) {
  const go = `/demo/manager/orders/${row.id}`;

  const fmtDateTime = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString("ru-RU");
  };

  return (
    <tr className="border-b border-white/10 hover:bg-white/[0.04]">
      {/* Checkbox */}
      <td className="px-3 py-2 align-top">
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="accent-white h-4 w-4"
            checked={checked}
            onChange={() => onToggle(row.id)}
            aria-label={`Выбрать заказ ${row.id}`}
          />
        </label>
      </td>

      {/* № / Дата */}
      <td className="px-3 py-2 align-top">
        <Link
          href={go}
          prefetch={false}
          className="hover:underline font-medium tabular-nums"
          title={`Открыть заказ ${row.id}`}
        >
          {row.id}
        </Link>
        <div
          className="text-[11px] text-white/60 tabular-nums"
          title={row.createdAt}
        >
          {fmtDateTime(row.createdAt)}
        </div>
      </td>

      {/* Клиент */}
      <td className="px-3 py-2 align-top min-w-[220px]">
        <Link
          href={`/demo/manager/crm/clients/${row.customer.id}`}
          prefetch={false}
          className="hover:underline"
          title={`Открыть клиента ${row.customer.name}`}
        >
          {row.customer.name}
        </Link>
        <div className="text-[11px] text-white/60 truncate">
          {row.customer.email || row.customer.phone || "—"}
        </div>
      </td>

      {/* Сумма */}
      <td className="px-3 py-2 align-top whitespace-nowrap">
        <OrderAmount value={row.amount} />
      </td>

      {/* Статус */}
      <td className="px-3 py-2 align-top whitespace-nowrap">
        <OrderStatusBadge status={row.status} />
      </td>

      {/* Канал */}
      <td className="px-3 py-2 align-top text-xs text-white/70 whitespace-nowrap">
        {row.channel}
      </td>

      {/* Действия */}
      <td className="px-3 py-2 align-top">
        <OrderActionsMenu
          status={row.status}
          onOpen={() => onAction(row.id, "open")}
          onConfirm={() => onAction(row.id, "confirm")}
          onMarkPaid={() => onAction(row.id, "paid")}
          onComplete={() => onAction(row.id, "complete")}
          onCancel={() => onAction(row.id, "cancel")}
          onInvoice={() => onAction(row.id, "invoice")}
          onContact={() => onAction(row.id, "contact")}
        />
      </td>
    </tr>
  );
}