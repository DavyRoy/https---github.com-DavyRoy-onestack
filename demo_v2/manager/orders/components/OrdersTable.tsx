"use client";
import { useState } from "react";
import Link from "next/link";
import OrdersTableRow from "./OrdersTableRow";
import OrdersBulkBar from "./OrdersBulkBar";
import OrderActionsMenu from "./OrderActionsMenu";
import type { Order } from "@/app/demo/manager/orders/data/mockOrders";
import { toast } from "sonner";

export default function OrdersTable({
  rows,
  onChangeRows,
}: {
  rows: Order[];
  onChangeRows: (next: Order[]) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const allChecked = rows.length > 0 && selected.length === rows.length;

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const toggleAll = () =>
    setSelected((s) => (s.length === rows.length ? [] : rows.map((r) => r.id)));

  const onRowAction = (id: string, action: string) => {
    if (action === "confirm") {
      onChangeRows(rows.map((r) => (r.id === id ? { ...r, status: "confirmed" } : r)));
      toast.success(`Заказ ${id}: подтверждён`);
    }
    if (action === "paid") {
      onChangeRows(rows.map((r) => (r.id === id ? { ...r, status: "paid" } : r)));
      toast.success(`Заказ ${id}: отмечен как оплаченный`);
    }
    if (action === "complete") {
      onChangeRows(rows.map((r) => (r.id === id ? { ...r, status: "completed" } : r)));
      toast.success(`Заказ ${id}: завершён`);
    }
    if (action === "cancel") {
      onChangeRows(rows.map((r) => (r.id === id ? { ...r, status: "cancelled" } : r)));
      toast.success(`Заказ ${id}: отменён`);
    }
    if (action === "invoice") {
      toast.message("Счёт сформирован (демо)");
    }
    if (action === "contact") {
      toast.message("Демо", { description: "Открыт диалог связи с клиентом." });
    }
  };

  const toCsv = (sel: Order[]) => {
    const header = ["id", "createdAt", "customer", "amount", "status", "channel"];
    const lines = sel.map((r) => [
      r.id,
      new Date(r.createdAt).toISOString(),
      (r.customer.name || "").replaceAll('"', '""'),
      String(r.amount),
      r.status,
      r.channel,
    ]);
    const csv = [header, ...lines]
      .map((arr) =>
        arr
          .map((v) => {
            const s = String(v ?? "");
            return /[",;\n]/.test(s) ? `"${s}"` : s;
          })
          .join(",")
      )
      .join("\n");
    return csv;
  };

  const download = (filename: string, content: string, type = "text/csv;charset=utf-8") => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const bulk = (action: string) => {
    if (selected.length === 0) return;
    if (action === "confirm") {
      onChangeRows(
        rows.map((r) => (selected.includes(r.id) ? { ...r, status: "confirmed" } : r))
      );
      toast.success(`Подтверждено: ${selected.length}`);
    }
    if (action === "cancel") {
      onChangeRows(
        rows.map((r) => (selected.includes(r.id) ? { ...r, status: "cancelled" } : r))
      );
      toast.success(`Отменено: ${selected.length}`);
    }
    if (action === "export") {
      const chosen = rows.filter((r) => selected.includes(r.id));
      const csv = toCsv(chosen);
      download(`orders-${Date.now()}.csv`, csv);
      toast.message("CSV экспортирован", { description: `${chosen.length} записей` });
    }
    if (action === "assign") {
      toast.message("Назначение ответственного (демо)");
    }
    setSelected([]);
  };

  return (
    <div className="relative">
      {/* 💻 Таблица — только >= md */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-[840px] w-full border-separate border-spacing-0">
          <thead>
            <tr className="text-left text-xs text-white/70">
              <th className="px-3 py-2">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="accent-white h-4 w-4"
                    checked={allChecked}
                    onChange={toggleAll}
                    aria-label="Выбрать все"
                  />
                  <span className="sr-only">Выбрать все</span>
                </label>
              </th>
              <th className="px-3 py-2">№ / Дата</th>
              <th className="px-3 py-2">Клиент</th>
              <th className="px-3 py-2">Сумма</th>
              <th className="px-3 py-2">Статус</th>
              <th className="px-3 py-2">Канал</th>
              <th className="px-3 py-2">Действия</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <OrdersTableRow
                key={r.id}
                row={r}
                checked={selected.includes(r.id)}
                onToggle={toggle}
                onAction={onRowAction}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* 📱 Мобильные карточки — < md */}
      <div className="md:hidden grid gap-2">
        <div className="flex items-center gap-2 px-1">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              className="accent-white h-4 w-4"
              checked={allChecked}
              onChange={toggleAll}
              aria-label="Выбрать все"
            />
            <span className="text-xs text-white/70">Выбрать все</span>
          </label>
        </div>

        {rows.map((r) => {
          const isChecked = selected.includes(r.id);
          return (
            <article
              key={r.id}
              className="rounded-2xl border border-white/12 bg-white/6 p-3"
              aria-labelledby={`order-${r.id}-title`}
            >
              <div className="flex items-start justify-between gap-2">
                <label className="inline-flex items-center gap-2 mt-0.5">
                  <input
                    type="checkbox"
                    className="accent-white h-4 w-4"
                    checked={isChecked}
                    onChange={() => toggle(r.id)}
                    aria-label={`Выбрать заказ ${r.id}`}
                  />
                </label>

                <div className="min-w-0 flex-1">
                  <Link
                    id={`order-${r.id}-title`}
                    href={`/demo/manager/orders/${r.id}`}
                    className="block font-medium hover:underline truncate"
                    prefetch={false}
                  >
                    {r.id}
                  </Link>
                  <div className="text-xs text-white/70">{fmtDate(r.createdAt)}</div>
                </div>

                <OrderActionsMenu
                  status={r.status}
                  onOpen={() => (window.location.href = `/demo/manager/orders/${r.id}`)}
                  onConfirm={() => onRowAction(r.id, "confirm")}
                  onMarkPaid={() => onRowAction(r.id, "paid")}
                  onComplete={() => onRowAction(r.id, "complete")}
                  onCancel={() => onRowAction(r.id, "cancel")}
                  onInvoice={() => onRowAction(r.id, "invoice")}
                  onContact={() => onRowAction(r.id, "contact")}
                />
              </div>

              <div className="mt-2 grid gap-1 text-xs">
                <div className="truncate">
                  <span className="text-white/70">Клиент: </span>
                  {r.customer.name}
                </div>
                <div className="flex items-center justify-between">
                  <div className="truncate">
                    <span className="text-white/70">Канал: </span>
                    {r.channel}
                  </div>
                  <span className={badgeTone(r.status)}>{statusLabel(r.status)}</span>
                </div>
                <div className="mt-1 text-sm font-semibold tabular-nums">
                  {r.amount.toLocaleString("ru-RU")} ₽
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Bulk-бар (липкий) */}
      <OrdersBulkBar ids={selected} onAction={bulk} />
    </div>
  );
}

/* ===== Утилиты отображения ===== */
function fmtDate(d: string) {
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString("ru-RU");
}

function statusLabel(s: Order["status"]) {
  switch (s) {
    case "new":
      return "Новый";
    case "confirmed":
      return "Подтверждён";
    case "paid":
      return "Оплачен";
    case "completed":
      return "Выполнен";
    case "cancelled":
      return "Отменён";
    case "refunded":
      return "Возвращён";
    default:
      return "—";
  }
}

function badgeTone(s: Order["status"]) {
  switch (s) {
    case "new":
      return "rounded-full border px-2 py-0.5 text-[11px] border-sky-300/30 bg-sky-300/10 text-sky-200";
    case "confirmed":
      return "rounded-full border px-2 py-0.5 text-[11px] border-indigo-300/30 bg-indigo-300/10 text-indigo-200";
    case "paid":
      return "rounded-full border px-2 py-0.5 text-[11px] border-emerald-300/30 bg-emerald-300/10 text-emerald-200";
    case "completed":
      return "rounded-full border px-2 py-0.5 text-[11px] border-teal-300/30 bg-teal-300/10 text-teal-200";
    case "cancelled":
      return "rounded-full border px-2 py-0.5 text-[11px] border-rose-300/30 bg-rose-300/10 text-rose-200";
    case "refunded":
      return "rounded-full border px-2 py-0.5 text-[11px] border-amber-300/30 bg-amber-300/10 text-amber-200";
    default:
      return "rounded-full border px-2 py-0.5 text-[11px] border-white/20 bg-white/10 text-white/80";
  }
}