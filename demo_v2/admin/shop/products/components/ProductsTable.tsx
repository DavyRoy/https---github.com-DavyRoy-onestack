"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const base =
    pathname?.startsWith("/demo/manager")
      ? "/demo/manager"
      : pathname?.startsWith("/demo/user")
      ? "/demo/user"
      : "/demo/admin";

  const pageIds = useMemo(() => rows.map((r) => r.id), [rows]);
  const allSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));
  const someSelected = !allSelected && pageIds.some((id) => selectedIds.includes(id));

  const headerCbRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (headerCbRef.current) headerCbRef.current.indeterminate = someSelected;
  }, [someSelected]);

  const money = useMemo(
    () => new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }),
    []
  );
  const fmtPrice = (n: number) => money.format(Math.max(0, n));

  const fmtDate = (iso?: string) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return Number.isNaN(d.getTime())
      ? iso
      : d.toLocaleDateString("ru-RU", { year: "numeric", month: "2-digit", day: "2-digit" });
  };

  // ⇩⇩ NEW: безопасная ячейка остатка
  const StockCell = ({ v }: { v: number | null | undefined }) => {
    const num = Number.isFinite(v as number) ? (v as number) : null;
    if (num == null) {
      return <span className="text-white/70" aria-label="остаток: нет данных">—</span>;
    }
    const tone = num <= 0 ? "text-red-300" : num <= 5 ? "text-amber-300" : "text-white";
    const label = num <= 0 ? "нет на складе" : num <= 5 ? "мало на складе" : "в наличии";
    return (
      <span className={`tabular-nums ${tone}`} title={label} aria-label={`${num} — ${label}`}>
        {num}
      </span>
    );
  };

  const Cover = ({ r }: { r: Product }) => (
    <div
      className="grid h-10 w-10 place-items-center rounded-md border border-white/12 bg-white/10 shrink-0"
      aria-hidden
    >
      <ProductIcon iconId={r.iconId} className="w-4 h-4 text-white/85" />
    </div>
  );

  // id для связи секции и подписи
  const headingId = "products-table-title";

  return (
    <section
      className="rounded-2xl border border-white/12 bg-white/8 overflow-x-hidden"
      role="region"
      aria-labelledby={headingId}
    >
      <h2 id={headingId} className="sr-only">Таблица товаров</h2>

      {/* Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full text-sm">
          {/* SR caption — кратко о таблице */}
          <caption className="sr-only">
            Список товаров с возможностью множественного выбора, ценой, остатком и статусом
          </caption>

          <thead className="text-left sticky top-0 z-10 bg-black/40 backdrop-blur-md text-white/80">
            <tr className="border-b border-white/10">
              <th className="p-3 w-10" scope="col">
                <input
                  ref={headerCbRef}
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => onToggleAll(pageIds, e.target.checked)}
                  aria-label="Выбрать все товары на странице"
                  // ⇩⇩ stricter ARIA value
                  aria-checked={someSelected ? "mixed" : allSelected ? "true" : "false"}
                  className="h-5 w-5"
                />
              </th>
              <th className="p-3 w-16" scope="col">Обложка</th>
              <th className="p-3" scope="col">Название</th>
              <th className="p-3" scope="col">SKU</th>
              <th className="p-3" scope="col">Категория</th>
              <th className="p-3 text-right" scope="col">Цена</th>
              <th className="p-3 text-right" scope="col">Остаток</th>
              <th className="p-3" scope="col">Статус</th>
              <th className="p-3 w-28" scope="col">Действия</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const checked = selectedIds.includes(r.id);
              const hasPrice = Number.isFinite(r.price as number);
              return (
                <tr key={r.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => onToggle(r.id, e.target.checked)}
                      aria-label={`Выбрать «${r.name}»`}
                      className="h-5 w-5"
                    />
                  </td>
                  <td className="p-3"><Cover r={r} /></td>
                  <td className="p-3">
                    <Link href={`${base}/shop/products/${r.id}`} prefetch={false} className="hover:underline">
                      {r.name ?? "—"}
                    </Link>
                    <div className="text-[11px] text-white/50" title={r.updatedAt || ""}>
                      Обновлён: {fmtDate(r.updatedAt)}
                    </div>
                  </td>
                  <td className="p-3 font-mono text-xs break-all">{r.sku ?? "—"}</td>
                  <td className="p-3">{r.categoryName || <span className="text-white/60">—</span>}</td>
                  <td className="p-3 text-right tabular-nums whitespace-nowrap">
                    {hasPrice ? fmtPrice(r.price as number) : "—"}
                  </td>
                  <td className="p-3 text-right"><StockCell v={r.stockTotal as number | undefined} /></td>
                  <td className="p-3">
                    <span
                      className={
                        "rounded-lg px-2 py-0.5 text-xs " +
                        ((r.status ?? "active") === "active"
                          ? "bg-emerald-400/15 text-emerald-300"
                          : (r.status ?? "active") === "draft"
                          ? "bg-amber-400/15 text-amber-300"
                          : "bg-white/10 text-white/70")
                      }
                    >
                      {r.status ?? "active"}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`${base}/shop/products/${r.id}`}
                        prefetch={false}
                        className="rounded-lg border border-white/12 bg-white/10 px-2 py-1 text-xs text-white/80 transition hover:border-white/18 hover:bg-white/16"
                        aria-label={`Открыть «${r.name ?? "товар"}»`}
                      >
                        Открыть
                      </Link>
                      <button
                        className="rounded-lg border border-white/12 bg-white/10 px-2 py-1 text-xs text-white/80 transition hover:border-white/18 hover:bg-white/16"
                        onClick={() => alert("Демо: быстрые действия")}
                        aria-label={`Быстрые действия для «${r.name ?? "товара"}»`}
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

      {/* Mobile */}
      <div className="md:hidden overflow-x-hidden">
        {rows.length === 0 && (
          <div className="p-6 text-center text-sm text-white/70">
            Товары не найдены. Измените фильтры или создайте новый.
          </div>
        )}
        <ul className="divide-y divide-white/10">
          {rows.map((r) => {
            const checked = selectedIds.includes(r.id);
            const hasPrice = Number.isFinite(r.price as number);
            return (
              <li key={r.id} className="p-3">
                <div className="flex items-start gap-3 min-w-0">
                  <input
                    type="checkbox"
                    className="mt-1 shrink-0 h-5 w-5"
                    checked={checked}
                    onChange={(e) => onToggle(r.id, e.target.checked)}
                    aria-label={`Выбрать «${r.name ?? "товар"}»`}
                  />
                  <div className="shrink-0"><Cover r={r} /></div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <Link
                        href={`${base}/shop/products/${r.id}`}
                        prefetch={false}
                        className="truncate font-medium hover:underline min-w-0"
                      >
                        {r.name ?? "—"}
                      </Link>
                      <span className="shrink-0">
                        <span
                          className={
                            "rounded-lg px-2 py-0.5 text-xs " +
                            ((r.status ?? "active") === "active"
                              ? "bg-emerald-400/15 text-emerald-300"
                              : (r.status ?? "active") === "draft"
                              ? "bg-amber-400/15 text-amber-300"
                              : "bg-white/10 text-white/70")
                          }
                        >
                          {r.status ?? "active"}
                        </span>
                      </span>
                    </div>
                    <div className="mt-0.5 text-xs text-white/60 min-w-0">
                      SKU: <span className="font-mono break-all">{r.sku ?? "—"}</span>
                      <span className="whitespace-normal">
                        {r.categoryName ? ` • ${r.categoryName}` : " • —"}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-sm">
                      <span className="tabular-nums">{hasPrice ? fmtPrice(r.price as number) : "—"}</span>
                      <span>Остаток: <StockCell v={r.stockTotal as number | undefined} /></span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Link
                        href={`${base}/shop/products/${r.id}`}
                        prefetch={false}
                        className="rounded-lg border border-white/12 bg-white/10 px-2 py-1 text-xs text-white/80 transition hover:border-white/18 hover:bg-white/16"
                      >
                        Открыть
                      </Link>
                      <button
                        className="rounded-lg border border-white/15 bg-white/10 px-2 py-1 text-xs hover:bg-white/15"
                        onClick={() => alert("Демо: быстрые действия")}
                        aria-label={`Быстрые действия для «${r.name ?? "товара"}»`}
                      >
                        ⋯
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-[11px] text-white/50">Обновлён: {fmtDate(r.updatedAt)}</div>
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