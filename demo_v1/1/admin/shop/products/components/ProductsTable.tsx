// app/demo/admin/shop/products/components/ProductsTable.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import type { Product } from "@/app/demo/(shared)/data/catalog/products.food";
import { ProductIcon } from "@/app/demo/admin/shop/components/ProductIcon";

export default function ProductsTable({
  rows,
  selectedIds,
  onToggle,
  onToggleAll,
}: {
  rows: Product[];
  selectedIds: string[];
  onToggle: (id: string, checked: boolean) => void;
  onToggleAll: (ids: string[], checked: boolean) => void;
}) {
  const pageIds = useMemo(() => rows.map((r) => r.id), [rows]);
  const allSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));
  const someSelected = !allSelected && pageIds.some((id) => selectedIds.includes(id));

  const headerCbRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (headerCbRef.current) headerCbRef.current.indeterminate = someSelected;
  }, [someSelected]);

  const fmtPrice = (n: number) =>
    new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(n);

  const StatusBadge = ({ status }: { status: Product["status"] }) => (
    <span
      className={
        "rounded-lg px-2 py-0.5 text-xs " +
        (status === "active"
          ? "bg-emerald-400/15 text-emerald-300"
          : status === "draft"
          ? "bg-amber-400/15 text-amber-300"
          : "bg-white/10 text-white/70")
      }
    >
      {status}
    </span>
  );

  const StockCell = ({ v }: { v: number }) => {
    const cls = v <= 0 ? "text-red-300" : v <= 5 ? "text-amber-300" : "text-white";
    return <span className={`tabular-nums ${cls}`}>{v}</span>;
  };

  const Cover = ({ r }: { r: Product }) => (
    <div className="grid h-10 w-10 place-items-center rounded-md border border-white/10 bg-white/5 shrink-0">
      <ProductIcon iconId={r.iconId} className="w-4 h-4 text-white/85" />
    </div>
  );

  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] overflow-x-hidden"> {/* ← подстраховка */}
      {/* Desktop-таблица */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left sticky top-0 z-10 bg-black/60 backdrop-blur-md">
            <tr className="border-b border-white/10">
              <th className="p-3 w-10">
                <input
                  ref={headerCbRef}
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => onToggleAll(pageIds, e.target.checked)}
                  aria-label="Выбрать все на странице"
                />
              </th>
              <th className="p-3 w-16">Обложка</th>
              <th className="p-3">Название</th>
              <th className="p-3">SKU</th>
              <th className="p-3">Категория</th>
              <th className="p-3 text-right">Цена</th>
              <th className="p-3 text-right">Остаток</th>
              <th className="p-3">Статус</th>
              <th className="p-3 w-28">Действия</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const checked = selectedIds.includes(r.id);
              return (
                <tr key={r.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => onToggle(r.id, e.target.checked)}
                      aria-label={`Выбрать ${r.name}`}
                    />
                  </td>
                  <td className="p-3">
                    <Cover r={r} />
                  </td>
                  <td className="p-3">
                    <Link href={`/demo/admin/shop/products/${r.id}`} className="hover:underline">
                      {r.name}
                    </Link>
                    <div className="text-[11px] text-white/50">{r.updatedAt}</div>
                  </td>
                  <td className="p-3 font-mono text-xs">{r.sku}</td>
                  <td className="p-3">{r.categoryName || <span className="text-white/60">—</span>}</td>
                  <td className="p-3 text-right tabular-nums">{fmtPrice(r.price)}</td>
                  <td className="p-3 text-right">
                    <StockCell v={r.stockTotal} />
                  </td>
                  <td className="p-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/demo/admin/shop/products/${r.id}`}
                        className="rounded-lg border border-white/15 bg-white/10 px-2 py-1 text-xs hover:bg-white/15"
                      >
                        Открыть
                      </Link>
                      <button
                        className="rounded-lg border border-white/15 bg-white/10 px-2 py-1 text-xs hover:bg-white/15"
                        onClick={() => alert("Демо: быстрые действия")}
                        aria-label={`Быстрые действия для ${r.name}`}
                      >
                        ⋯
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={9} className="p-6 text-center text-sm text-white/70">
                  Товары не найдены. Измените фильтры или создайте новый.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Мобильный список */}
      <div className="md:hidden overflow-x-hidden"> {/* ← стопим любые «вылезания» внутри мобильного блока */}
        {rows.length === 0 && (
          <div className="p-6 text-center text-sm text-white/70">
            Товары не найдены. Измените фильтры или создайте новый.
          </div>
        )}
        <ul className="divide-y divide-white/10">
          {rows.map((r) => {
            const checked = selectedIds.includes(r.id);
            return (
              <li key={r.id} className="p-3">
                <div className="flex items-start gap-3 min-w-0"> {/* ← min-w-0 позволяет контенту сжиматься */}
                  <input
                    type="checkbox"
                    className="mt-1 shrink-0"
                    checked={checked}
                    onChange={(e) => onToggle(r.id, e.target.checked)}
                    aria-label={`Выбрать ${r.name}`}
                  />
                  <div className="shrink-0">
                    <Cover r={r} />
                  </div>
                  <div className="min-w-0 flex-1"> {/* ← критично для truncate/переносов */}
                    <div className="flex items-center justify-between gap-2">
                      <Link
                        href={`/demo/admin/shop/products/${r.id}`}
                        className="truncate font-medium hover:underline min-w-0"
                      >
                        {r.name}
                      </Link>
                      <span className="shrink-0">
                        <StatusBadge status={r.status} />
                      </span>
                    </div>
                    <div className="mt-0.5 text-xs text-white/60 min-w-0">
                      SKU:{" "}
                      <span className="font-mono break-all"> {/* ← ломаем длинные SKU */}
                        {r.sku}
                      </span>
                      <span className="whitespace-normal">
                        {r.categoryName ? ` • ${r.categoryName}` : " • —"}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-sm">
                      <span className="tabular-nums">{fmtPrice(r.price)}</span>
                      <span>
                        Остаток: <StockCell v={r.stockTotal} />
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Link
                        href={`/demo/admin/shop/products/${r.id}`}
                        className="rounded-lg border border-white/15 bg-white/10 px-2 py-1 text-xs hover:bg-white/15"
                      >
                        Открыть
                      </Link>
                      <button
                        className="rounded-lg border border-white/15 bg-white/10 px-2 py-1 text-xs hover:bg-white/15"
                        onClick={() => alert("Демо: быстрые действия")}
                      >
                        ⋯
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-[11px] text-white/50">Обновлено: {r.updatedAt}</div>
              </li>
            );
          })}
        </ul>

        {rows.length > 0 && (
          <div className="border-t border-white/10 p-3">
            <button
              className="w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm hover:bg-white/15"
              onClick={() => onToggleAll(pageIds, !(allSelected || someSelected))}
            >
              {(allSelected || someSelected) ? "Снять выделение" : "Выбрать всё на странице"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}