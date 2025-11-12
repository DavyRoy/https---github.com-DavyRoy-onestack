// app/demo/admin/shop/categories/components/CategoryProductsTable.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PRODUCTS } from "@/app/demo/(shared)/data/catalog/products.food";
import { ProductIcon } from "@/app/demo/admin/shop/components/ProductIcon";

type Sort =
  | "name_asc"
  | "name_desc"
  | "price_asc"
  | "price_desc"
  | "stock_desc"
  | "updated_desc";

/* ── utils ─────────────────────────────────────────────────────────────── */
function fmtPrice(n: number) {
  const safe = Number.isFinite(n) ? n : 0;
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(safe);
}
function fmtDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("ru-RU", { year: "numeric", month: "2-digit", day: "2-digit" });
}
function cls(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}
function getBaseFromPath(pathname: string | null) {
  if (!pathname) return "/demo/admin";
  if (pathname.startsWith("/demo/manager")) return "/demo/manager";
  if (pathname.startsWith("/demo/user")) return "/demo/user";
  return "/demo/admin";
}

/* ── subcomponents ─────────────────────────────────────────────────────── */
function StatusBadge({ v }: { v: (typeof PRODUCTS)[number]["status"] }) {
  const tone =
    v === "active"
      ? "bg-emerald-400/15 text-emerald-300"
      : v === "draft"
      ? "bg-amber-400/15 text-amber-300"
      : "bg-white/10 text-white/70";
  return <span className={cls("rounded-lg px-2 py-0.5 text-xs", tone)}>{v}</span>;
}

function Cover({ iconId }: { iconId?: string | null }) {
  return (
    <div
      className="grid h-8 w-8 place-items-center rounded border border-white/10 bg-white/5"
      aria-hidden
      title={iconId ? "Иконка товара" : "Иконка отсутствует"}
    >
      {/* показываем безопасный фоллбек ProductIcon, даже если iconId пустой */}
      <ProductIcon iconId={iconId ?? undefined} size={16} className="text-white/85" />
    </div>
  );
}

/* ── main ──────────────────────────────────────────────────────────────── */
export default function CategoryProductsTable({ categoryId }: { categoryId: string }) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>("updated_desc");
  const pathname = usePathname();
  const base = getBaseFromPath(pathname);

  const rows = useMemo(() => {
    let xs = PRODUCTS.filter((p) => p.categoryId === categoryId);

    if (q.trim()) {
      const needle = q.toLowerCase();
      xs = xs.filter(
        (p) =>
          (p.name || "").toLowerCase().includes(needle) ||
          (p.sku || "").toLowerCase().includes(needle) ||
          (p.barcode || "").toLowerCase().includes(needle)
      );
    }

    // стабильная сортировка с подстраховкой чисел/строк
    xs = [...xs].sort((a, b) => {
      const an = (a.name ?? "") as string;
      const bn = (b.name ?? "") as string;
      const ap = Number.isFinite(a.price as number) ? (a.price as number) : 0;
      const bp = Number.isFinite(b.price as number) ? (b.price as number) : 0;
      const as = Number.isFinite(a.stockTotal as number) ? (a.stockTotal as number) : 0;
      const bs = Number.isFinite(b.stockTotal as number) ? (b.stockTotal as number) : 0;

      switch (sort) {
        case "name_asc":
          return an.localeCompare(bn, "ru", { numeric: true, sensitivity: "base" });
        case "name_desc":
          return bn.localeCompare(an, "ru", { numeric: true, sensitivity: "base" });
        case "price_asc":
          return ap - bp;
        case "price_desc":
          return bp - ap;
        case "stock_desc":
          return bs - as;
        default:
          // updated_desc
          return (b.updatedAt || "").localeCompare(a.updatedAt || "");
      }
    });

    return xs;
  }, [categoryId, q, sort]);

  const totals = useMemo(() => {
    const qty = rows.reduce((s, r) => s + (Number.isFinite(r.stockTotal as number) ? (r.stockTotal as number) : 0), 0);
    const sum = rows.reduce((s, r) => {
      const price = Number.isFinite(r.price as number) ? (r.price as number) : 0;
      const qty = Number.isFinite(r.stockTotal as number) ? (r.stockTotal as number) : 0;
      return s + price * qty;
    }, 0);
    return { qty, sum };
  }, [rows]);

  return (
    <section
      className="rounded-2xl border border-white/15 bg-white/[0.05]"
      aria-labelledby="cat-products-title"
    >
      <div className="p-4 md:p-5 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <div id="cat-products-title" className="text-sm font-medium">
            Товары в категории
          </div>
          <div className="mt-0.5 text-xs text-white/60" aria-live="polite">
            Найдено: <span className="text-white/80">{rows.length}</span> • Остаток:{" "}
            <span className="text-white/80 tabular-nums">{totals.qty}</span> шт • На складе:{" "}
            <span className="text-white/80 tabular-nums">{fmtPrice(totals.sum)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="hidden sm:flex items-center gap-2 text-xs" htmlFor="cat-sort">
            <span className="opacity-70">Сортировка</span>
            <select
              id="cat-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="rounded-lg border border-white/15 bg-white/10 px-2 py-1 text-xs outline-none"
              aria-label="Сортировка списка товаров"
            >
              <option value="updated_desc">Недавно изменённые</option>
              <option value="name_asc">Название A→Я</option>
              <option value="name_desc">Название Я→A</option>
              <option value="price_asc">Цена ↑</option>
              <option value="price_desc">Цена ↓</option>
              <option value="stock_desc">Остаток ↓</option>
            </select>
          </label>
          <Link
            href={`${base}/shop/products?category=${encodeURIComponent(categoryId)}`}
            prefetch={false}
            className="rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15"
          >
            Открыть в общем списке
          </Link>
          <button
            onClick={() => alert("Массовые действия (демо)")}
            className="rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15"
            aria-label="Массовые действия"
          >
            ⋯
          </button>
        </div>
      </div>

      {/* Поиск по категории */}
      <div className="px-4 md:px-5 pb-3">
        <label className="sr-only" htmlFor="cat-search">Поиск внутри категории</label>
        <input
          id="cat-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Поиск по названию, SKU, штрихкоду…"
          className="w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none placeholder:text-white/40"
          aria-label="Поиск внутри категории"
        />
      </div>

      {/* Таблица (desktop) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left">
            <tr className="border-b border-white/10">
              <th className="p-3 w-16">Обл.</th>
              <th className="p-3">Название</th>
              <th className="p-3">SKU</th>
              <th className="p-3">Статус</th>
              <th className="p-3 text-right">Цена</th>
              <th className="p-3 text-right">Остаток</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const price = Number.isFinite(r.price as number) ? (r.price as number) : 0;
              const stock = Number.isFinite(r.stockTotal as number) ? (r.stockTotal as number) : 0;
              return (
                <tr key={r.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-3">
                    <Cover iconId={r.iconId} />
                  </td>
                  <td className="p-3">
                    <Link
                      href={`${base}/shop/products/${r.id}`}
                      prefetch={false}
                      className="hover:underline"
                    >
                      {r.name || "—"}
                    </Link>
                    <div className="text-[11px] text-white/50">обновлено: {fmtDate(r.updatedAt)}</div>
                  </td>
                  <td className="p-3 font-mono text-xs break-all">{r.sku || "—"}</td>
                  <td className="p-3">
                    <StatusBadge v={r.status} />
                  </td>
                  <td className="p-3 text-right tabular-nums whitespace-nowrap">{fmtPrice(price)}</td>
                  <td className="p-3 text-right tabular-nums">{stock}</td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-sm text-white/70">
                  В этой категории пока нет товаров.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Мобильный список */}
      <div className="md:hidden divide-y divide-white/10">
        {rows.length === 0 ? (
          <div className="p-6 text-center text-sm text-white/70">
            В этой категории пока нет товаров.
          </div>
        ) : (
          rows.map((r) => {
            const price = Number.isFinite(r.price as number) ? (r.price as number) : 0;
            const stock = Number.isFinite(r.stockTotal as number) ? (r.stockTotal as number) : 0;
            return (
              <div key={r.id} className="p-3">
                <div className="flex items-start gap-3">
                  <Cover iconId={r.iconId} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <Link
                        href={`${base}/shop/products/${r.id}`}
                        prefetch={false}
                        className="truncate font-medium hover:underline"
                      >
                        {r.name || "—"}
                      </Link>
                      <StatusBadge v={r.status} />
                    </div>
                    <div className="mt-0.5 text-xs text-white/60">
                      SKU: <span className="font-mono break-all">{r.sku || "—"}</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-sm">
                      <span className="tabular-nums">{fmtPrice(price)}</span>
                      <span className="tabular-nums">Ост.: {stock}</span>
                    </div>
                    <div className="mt-1 text-[11px] text-white/50">обновлено: {fmtDate(r.updatedAt)}</div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}