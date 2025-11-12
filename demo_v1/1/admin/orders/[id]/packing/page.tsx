"use client";

import { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ADMIN_ORDERS } from "@/app/demo/admin/orders/data/mockAdminOrders";

/** ₽ формат для справки */
function fmtPrice(n: number) {
  const v = Number.isFinite(n) ? n : 0;
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(v);
}

export default function PackingPage() {
  const { id } = useParams<{ id: string }>();
  const sp = useSearchParams();
  const order = ADMIN_ORDERS.find((o) => o.id === id);

  useEffect(() => {
    if (sp.get("print") === "1") {
      setTimeout(() => window.print(), 50);
    }
  }, [sp]);

  if (!order) {
    return (
      <div className="p-6">
        <header className="mb-4 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-semibold">Упаковочный лист</h1>
          <Link
            href="/demo/admin/orders"
            className="rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15"
          >
            К заказам
          </Link>
        </header>
        <div className="rounded-2xl border border-white/15 bg-white/[0.05] p-4">
          Заказ не найден.
        </div>
      </div>
    );
  }

  const items = order.items ?? [];

  return (
    <div className="p-4 md:p-6 print:p-0">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: #fff; }
        }
      `}</style>

      <div className="no-print mb-4 flex items-center justify-between gap-2">
        <Link href={`/demo/admin/orders/${order.id}`} className="text-sm text-white/70 hover:underline">
          ← К заказу
        </Link>
        <button onClick={() => window.print()} className="rounded-xl bg-white px-3 py-1.5 text-sm text-black">
          Печать
        </button>
      </div>

      <div className="rounded-2xl border border-white/15 bg-white/5 p-4 md:p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-2xl font-semibold">Упаковочный лист</div>
            <div className="mt-1 text-sm text-white/70">
              Заказ № {order.id} от {order.createdAt} • канал: {order.channel}
            </div>
          </div>
          <div className="text-sm text-white/70">
            Клиент: <span className="text-white">{order.client}</span>
            {order.phone ? <> • {order.phone}</> : null}
            {order.email ? <> • {order.email}</> : null}
          </div>
        </div>

        {/* Таблица для комплектовщика */}
        <div className="mt-3 overflow-x-auto rounded-xl border border-white/10 bg-white/5">
          <table className="min-w-full text-sm">
            <thead className="bg-white/[0.03]">
              <tr className="border-b border-white/10 text-left">
                <th className="p-2 w-10">#</th>
                <th className="p-2">Наименование</th>
                <th className="p-2">SKU</th>
                <th className="p-2 text-right">Кол-во</th>
                <th className="p-2">Проверка</th>
              </tr>
            </thead>
            <tbody>
              {items.length ? (
                items.map((it: any, idx) => (
                  <tr key={idx} className="border-b border-white/5">
                    <td className="p-2 tabular-nums text-white/70">{idx + 1}</td>
                    <td className="p-2">
                      <div className="min-w-0">
                        {it.title}
                        {it.variant && (
                          <div className="text-[11px] text-white/50">{it.variant}</div>
                        )}
                      </div>
                    </td>
                    <td className="p-2 text-xs font-mono text-white/70">{it.sku || "—"}</td>
                    <td className="p-2 text-right tabular-nums">{it.qty}</td>
                    <td className="p-2">
                      <div className="h-6 w-6 rounded border border-white/20 bg-white/0 print:border-black/40" />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-sm text-white/70">
                    Пусто
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Итоги/подписи */}
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
            <div className="text-white/70">
              Итого позиций: <span className="text-white">{items.length}</span>
            </div>
            <div className="text-white/70">
              Сумма заказа: <span className="text-white">{fmtPrice(order.amount)}</span>
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="text-sm font-medium">Подписи</div>
            <div className="mt-2 grid gap-2">
              <div className="grid grid-cols-[140px_1fr] items-center gap-2 text-sm">
                <div className="text-white/70">Собрал(а)</div>
                <div className="h-8 rounded bg-white/5 border border-dashed border-white/20" />
              </div>
              <div className="grid grid-cols-[140px_1fr] items-center gap-2 text-sm">
                <div className="text-white/70">Проверил(а)</div>
                <div className="h-8 rounded bg-white/5 border border-dashed border-white/20" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="no-print mt-3 text-xs text-white/60">
        Для печати используйте кнопку сверху или Ctrl/Cmd+P. Для мгновенной печати добавьте к URL{" "}
        <code className="bg-white/10 px-1 rounded">?print=1</code>.
      </div>
    </div>
  );
}