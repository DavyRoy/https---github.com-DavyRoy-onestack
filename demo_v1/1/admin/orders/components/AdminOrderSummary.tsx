"use client";

import Link from "next/link";
import * as Lucide from "lucide-react";
import { useMemo, useState } from "react";
import { AdminOrder } from "@/app/demo/admin/orders/data/mockAdminOrders";
import { CatalogIcon, DefaultIcon } from "@/app/lib/catalog/iconRegistry";

/** ₽ формат */
function fmtPrice(n: number) {
  const v = Number.isFinite(n) ? n : 0;
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(v);
}

/** CSV-safe */
function csvEscape(s: string) {
  const str = String(s ?? "");
  const needsQuotes = /[",;\n\r]/.test(str);
  const body = str.replace(/"/g, '""');
  return needsQuotes ? `"${body}"` : body;
}

/** Сборка CSV по позициям (Excel-friendly) */
function toCSV(order: AdminOrder) {
  const head = ["#", "Наименование", "SKU", "Кол-во", "Цена", "Сумма"];
  const rows =
    order.items?.map((it: any, i) => {
      const qty = Number.isFinite(it.qty) ? it.qty : 0;
      const price = Number.isFinite(it.price) ? it.price : 0;
      const sum = qty * price;
      return [
        String(i + 1),
        csvEscape(it.title || ""),
        csvEscape(it.sku || ""),
        String(qty),
        String(price),
        String(sum),
      ].join(";");
    }) ?? [];

  // \r\n — чтобы Excel корректно распознал строки на Windows
  return [head.join(";"), ...rows].join("\r\n");
}

const UTF8_BOM = "\uFEFF";

export default function AdminOrderSummary({ order }: { order: AdminOrder }) {
  const [exporting, setExporting] = useState(false);

  const items = order.items ?? [];
  const hasItems = items.length > 0;

  // Базовые агрегаты
  const subtotal = useMemo(
    () => items.reduce((s, i: any) => s + (Number(i.price) || 0) * (Number(i.qty) || 0), 0),
    [items]
  );

  // Скидка/налог/итог — аккуратно
  const discountExplicit = (order as any).discountAmount as number | undefined;
  const promoCode = (order as any).promoCode as string | undefined;
  const amount = Number.isFinite(order.amount) ? order.amount : subtotal;

  let discount = Math.max(0, discountExplicit ?? 0);
  if (!discountExplicit && amount < subtotal) {
    discount = subtotal - amount;
  }
  const tax = Math.max(0, amount - (subtotal - discount));
  const total = Math.max(0, subtotal - discount + tax);

  const handleExport = () => {
    try {
      setExporting(true);
      const csv = toCSV(order);
      const blob = new Blob([UTF8_BOM + csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.setAttribute("download", `order-${order.id}.csv`);
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  return (
    <section
      className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5 backdrop-blur-sm"
      aria-labelledby="order-summary-title"
    >
      {/* Заголовок + действия */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <h2 id="order-summary-title" className="text-sm font-medium">
            Состав и итоги
          </h2>
          <div className="mt-0.5 text-xs text-white/60">
            {hasItems ? `${items.length} поз.` : "Пусто"}
            {promoCode ? (
              <>
                {" "}
                • Промокод:{" "}
                <span className="rounded bg-white/10 px-1.5 py-0.5 text-[11px] font-medium">
                  {promoCode}
                </span>
              </>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleExport}
            disabled={!hasItems || exporting}
            className="flex-1 sm:flex-none rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15 disabled:opacity-50"
            title="Экспорт CSV"
          >
            {exporting ? "Экспорт…" : "Экспорт CSV"}
          </button>

          {/* Документы (новая вкладка + мгновенная печать в режиме ?print=1) */}
          <Link
            href={`/demo/admin/orders/${order.id}/invoice`}
            prefetch={true}
            target="_blank"
            rel="noopener"
            className="flex-1 sm:flex-none rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm text-center hover:bg-white/15"
            title="Счёт"
          >
            Счёт
          </Link>
          <Link
            href={`/demo/admin/orders/${order.id}/invoice?print=1`}
            prefetch={true}
            target="_blank"
            rel="noopener"
            className="flex-1 sm:flex-none rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm text-center hover:bg-white/15"
            title="Печать счёта"
          >
            Печать счёта
          </Link>
          <Link
            href={`/demo/admin/orders/${order.id}/packing`}
            prefetch={false}
            target="_blank"
            rel="noopener"
            className="flex-1 sm:flex-none rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm text-center hover:bg-white/15"
            title="Накладная"
          >
            Накладная
          </Link>
          <Link
            href={`/demo/admin/orders/${order.id}/packing?print=1`}
            prefetch={true}
            target="_blank"
            rel="noopener"
            className="flex-1 sm:flex-none rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm text-center hover:bg-white/15"
            title="Печать накладной"
          >
            Печать накладной
          </Link>
        </div>
      </div>

      {/* ≥ md — таблица */}
      <div className="mt-3 overflow-x-auto rounded-xl border border-white/10 bg-white/5 hidden md:block">
        <table className="min-w-full text-sm">
          <thead className="bg-white/[0.03] text-left">
            <tr className="border-b border-white/10">
              <th className="p-2 w-10">#</th>
              <th className="p-2">Позиция</th>
              <th className="p-2 hidden md:table-cell">SKU</th>
              <th className="p-2 text-right">Кол-во</th>
              <th className="p-2 text-right">Цена</th>
              <th className="p-2 text-right">Сумма</th>
            </tr>
          </thead>
          <tbody>
            {hasItems ? (
              items.map((it: any, idx) => {
                const qty = Number.isFinite(it.qty) ? it.qty : 0;
                const price = Number.isFinite(it.price) ? it.price : 0;
                const sum = qty * price;
                const inactive = qty === 0 || price === 0;

                const iconId = it.iconId ?? it.categoryIconId ?? null;
                const hasIcon = Boolean(iconId);

                return (
                  <tr
                    key={idx}
                    className={`border-b border-white/5 hover:bg-white/5 ${inactive ? "opacity-70" : ""}`}
                  >
                    <td className="p-2 text-white/70 tabular-nums">{idx + 1}</td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <span className="grid h-7 w-7 place-items-center rounded bg-white/10 shrink-0">
                          {hasIcon ? (
                            <CatalogIcon id={iconId} size={16} className="opacity-85" />
                          ) : (
                            <DefaultIcon className="w-4 h-4 opacity-80" />
                          )}
                        </span>
                        <div className="min-w-0">
                          {it.url ? (
                            <Link href={it.url} className="hover:underline" title={it.title}>
                              {it.title}
                            </Link>
                          ) : (
                            <span title={it.title}>{it.title}</span>
                          )}
                          {it.variant && (
                            <div className="text-[11px] text-white/50">{it.variant}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td
                      className="p-2 hidden md:table-cell text-xs font-mono text-white/70"
                      aria-label={it.sku ? `SKU ${it.sku}` : "SKU отсутствует"}
                    >
                      {it.sku || "—"}
                    </td>
                    <td className="p-2 text-right tabular-nums">{qty}</td>
                    <td className="p-2 text-right tabular-nums">{fmtPrice(price)}</td>
                    <td className="p-2 text-right tabular-nums font-medium">{fmtPrice(sum)}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="p-6 text-center text-sm text-white/70">
                  В заказе нет товаров.
                </td>
              </tr>
            )}
          </tbody>

          {/* Итоги */}
          {hasItems && (
            <tfoot>
              <tr className="border-t border-white/10 bg-white/[0.03]">
                <td className="p-2 text-right" colSpan={5}>
                  Подитог:
                </td>
                <td className="p-2 text-right font-medium tabular-nums">{fmtPrice(subtotal)}</td>
              </tr>

              <tr className="border-t border-white/10 bg-white/[0.03]">
                <td className="p-2 text-right" colSpan={5}>
                  <span className="inline-flex items-center gap-1">
                    Скидка
                    {promoCode && (
                      <span className="ml-1 rounded bg-white/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wide">
                        {promoCode}
                      </span>
                    )}
                    :
                  </span>
                </td>
                <td className="p-2 text-right tabular-nums text-rose-300">−{fmtPrice(discount)}</td>
              </tr>

              <tr className="border-t border-white/10 bg-white/[0.03]">
                <td className="p-2 text-right" colSpan={5}>
                  Налог:
                </td>
                <td className="p-2 text-right tabular-nums">{fmtPrice(tax)}</td>
              </tr>

              <tr className="border-t border-white/10 bg-white/[0.05]">
                <td className="p-2 text-right font-medium" colSpan={5}>
                  Итого:
                </td>
                <td className="p-2 text-right text-lg font-semibold tabular-nums">{fmtPrice(total)}</td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* < md — карточки позиций */}
      <div className="md:hidden mt-3 rounded-xl border border-white/10 bg-white/5">
        {hasItems ? (
          <ul className="divide-y divide-white/10">
            {items.map((it: any, idx) => {
              const qty = Number.isFinite(it.qty) ? it.qty : 0;
              const price = Number.isFinite(it.price) ? it.price : 0;
              const sum = qty * price;
              const iconId = it.iconId ?? it.categoryIconId ?? null;
              const hasIcon = Boolean(iconId);

              return (
                <li key={idx} className="p-3">
                  <div className="flex items-start gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded bg-white/10 shrink-0">
                      {hasIcon ? (
                        <CatalogIcon id={iconId} size={18} className="opacity-85" />
                      ) : (
                        <DefaultIcon className="w-4 h-4 opacity-80" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="truncate font-medium">
                            {it.url ? (
                              <Link href={it.url} className="hover:underline" title={it.title}>
                                {it.title}
                              </Link>
                            ) : (
                              <span title={it.title}>{it.title}</span>
                            )}
                          </div>
                          {it.variant && (
                            <div className="text-[11px] text-white/50 truncate">{it.variant}</div>
                          )}
                          {it.sku && (
                            <div className="mt-0.5 text-[11px] font-mono text-white/50 truncate">
                              SKU: {it.sku}
                            </div>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-sm tabular-nums">{fmtPrice(sum)}</div>
                          <div className="text-[11px] text-white/60 tabular-nums">
                            {qty} × {fmtPrice(price)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="p-6 text-center text-sm text-white/70">В заказе нет товаров.</div>
        )}

        {/* Итоги (моб.) */}
        {hasItems && (
          <div className="p-3 space-y-1 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-white/70">Подитог</span>
              <span className="tabular-nums">{fmtPrice(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70">
                Скидка
                {promoCode && (
                  <span className="ml-1 rounded bg-white/10 px-1 py-0.5 text-[10px] uppercase">
                    {promoCode}
                  </span>
                )}
              </span>
              <span className="tabular-nums text-rose-300">−{fmtPrice(discount)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70">Налог</span>
              <span className="tabular-nums">{fmtPrice(tax)}</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-white/10">
              <span className="font-medium">Итого</span>
              <span className="tabular-nums text-lg font-semibold">{fmtPrice(total)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Низ — платёж и краткая сводка */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
        <div>
          Платёж:{" "}
          {order.paymentId ? (
            <Link
              href={`/demo/manager/payments/${order.paymentId}`}
              className="text-emerald-300 hover:underline"
            >
              #{order.paymentId}
            </Link>
          ) : (
            <span className="text-white/70">нет</span>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs text-white/60">
          <span className="inline-flex items-center gap-1">
            <Lucide.Package className="h-4 w-4 opacity-60" />
            {items.length} позиций
          </span>
          <span className="inline-flex items-center gap-1">
            <Lucide.Wallet className="h-4 w-4 opacity-60" />
            Подитог {fmtPrice(subtotal)}
          </span>
          {discount > 0 && (
            <span className="inline-flex items-center gap-1">
              <Lucide.BadgePercent className="h-4 w-4 opacity-60" />
              −{fmtPrice(discount)}
            </span>
          )}
          {tax > 0 && (
            <span className="inline-flex items-center gap-1">
              <Lucide.Receipt className="h-4 w-4 opacity-60" />
              Налог {fmtPrice(tax)}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}