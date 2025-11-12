// app/demo/admin/orders/[id]/packing/page.tsx
"use client";

import { useEffect, useMemo } from "react";
import { useParams, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { ADMIN_ORDERS } from "@/app/demo/admin/orders/data/mockAdminOrders";

/* -------------------- утилиты -------------------- */

function fmtPrice(n: number) {
  const v = Number.isFinite(n) ? n : 0;
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(v);
}

function getBaseFromPath(pathname: string | null) {
  if (!pathname) return "/demo/admin";
  if (pathname.startsWith("/demo/manager")) return "/demo/manager";
  if (pathname.startsWith("/demo/user")) return "/demo/user";
  return "/demo/admin";
}

/* -------------------- страница -------------------- */

export default function PackingPage() {
  const pathname = usePathname();
  const base = getBaseFromPath(pathname);

  const params = useParams<{ id?: string | string[] }>();
  const id = Array.isArray(params?.id) ? params?.id?.[0] : params?.id;

  const sp = useSearchParams();
  const order = useMemo(() => ADMIN_ORDERS.find((o) => o.id === id), [id]);

  // Мгновенная печать при ?print=1
  useEffect(() => {
    if (sp.get("print") === "1") {
      // Небольшая задержка, чтобы применились стили
      setTimeout(() => window.print(), 120);
    }
  }, [sp]);

  if (!order) {
    return (
      <div className="p-6">
        <header className="mb-4 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-semibold">Упаковочный лист</h1>
          <Link
            href={`${base}/orders`}
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
  const amount = Number.isFinite(order.amount) ? order.amount : 0;

  return (
    <div className="p-4 md:p-6 print:p-0">
      {/* Минимальные стили печати */}
      <style>{`
        @page { size: A4; margin: 10mm; }
        @media print {
          :root { color-scheme: light; }
          html, body { background: #fff !important; }
          .no-print { display: none !important; }
          .paper { background: #fff !important; color: #000 !important; box-shadow: none !important; border: none !important; }
          .paper * { color: #000 !important; }
          .paper .rounded-xl, .paper .rounded-2xl, .paper .rounded-lg { border-radius: 0 !important; }
          .paper [class*="bg-white"] { background: #fff !important; }
          .paper [class*="border-white"] { border-color: #000 !important; }
          .packing-table th, .packing-table td { border: 1px solid #000 !important; }
          .packing-table { font-size: 11pt !important; border-collapse: collapse; width: 100%; }
          thead { display: table-header-group; }
          tfoot { display: table-footer-group; }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; page-break-after: auto; }
        }
      `}</style>

      {/* Панель действий (только экран) */}
      <div className="no-print mb-4 flex flex-wrap items-center justify-between gap-2">
        <Link
          href={`${base}/orders/${order.id}`}
          className="text-sm text-white/70 hover:underline"
        >
          ← К карточке заказа
        </Link>
        <button
          onClick={() => window.print()}
          className="rounded-xl bg-white px-3 py-1.5 text-sm text-black hover:bg-white/90"
          title="Печать упаковочного листа"
        >
          Печать
        </button>
      </div>

      {/* Лист */}
      <div className="paper rounded-2xl border border-white/15 bg-white/5 p-4 md:p-6">
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
          <table className="packing-table min-w-full text-sm">
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
                items.map((it: any, idx: number) => {
                  const qty = Number.isFinite(it.qty) ? it.qty : 0;
                  return (
                    <tr key={`${order.id}-${idx}`} className="border-b border-white/5">
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
                      <td className="p-2 text-right tabular-nums">{qty}</td>
                      <td className="p-2">
                        {/* чек-бокс для отметки (печать-дружественно выглядит как пустая клетка) */}
                        <div className="h-6 w-6 rounded border border-white/20 bg-white/0 print:border-black/40" />
                      </td>
                    </tr>
                  );
                })
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
              Сумма заказа: <span className="text-white">{fmtPrice(amount)}</span>
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="text-sm font-medium">Подписи</div>
            <div className="mt-2 grid gap-2">
              <div className="grid grid-cols-[140px_1fr] items-center gap-2 text-sm">
                <div className="text-white/70">Собрал(а)</div>
                <div className="h-8 rounded bg-white/5 border border-dashed border-white/20 print:border-black/40" />
              </div>
              <div className="grid grid-cols-[140px_1fr] items-center gap-2 text-sm">
                <div className="text-white/70">Проверил(а)</div>
                <div className="h-8 rounded bg-white/5 border border-dashed border-white/20 print:border-black/40" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Подвал (только экран) */}
      <div className="no-print mt-3 text-xs text-white/60">
        Для печати используйте кнопку сверху или Ctrl/Cmd+P. Для мгновенной печати добавьте к URL{" "}
        <code className="bg-white/10 px-1 rounded">?print=1</code>.
      </div>
    </div>
  );
}