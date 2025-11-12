// app/demo/admin/shop/categories/components/CategoryProductsTable.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import * as Lucide from "lucide-react";
import { PRODUCTS } from "@/app/demo/(shared)/data/catalog/products.food";

type Sort =
  | "name_asc"
  | "name_desc"
  | "price_asc"
  | "price_desc"
  | "stock_desc"
  | "updated_desc";

function fmtPrice(n: number) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(n);
}

function StatusBadge({ v }: { v: (typeof PRODUCTS)[number]["status"] }) {
  const cls =
    v === "active"
      ? "bg-emerald-400/15 text-emerald-300"
      : v === "draft"
      ? "bg-amber-400/15 text-amber-300"
      : "bg-white/10 text-white/70";
  return <span className={`rounded-lg px-2 py-0.5 text-xs ${cls}`}>{v}</span>;
}

function Cover({
  iconName,
  media,
}: {
  iconName?: string | null;
  media?: string[] | null;
}) {
  // приоритет: media -> iconName -> заглушка (но по нашей модели медиа не используем)
  if (media?.[0]) {
    return (
      <div className="grid h-8 w-8 place-items-center overflow-hidden rounded border border-white/10 bg-white/5">
        <span className="text-[10px] text-white/70">img</span>
      </div>
    );
  }
  if (iconName) {
    const Icon = (Lucide as any)[iconName] ?? Lucide.Box;
    return (
      <div className="grid h-8 w-8 place-items-center rounded border border-white/10 bg-white/5">
        <Icon width={16} height={16} className="text-white/80" />
      </div>
    );
  }
  return (
    <div className="grid h-8 w-8 place-items-center rounded border border-dashed border-white/15 text-[10px] text-white/60">
      —
    </div>
  );
}

export default function CategoryProductsTable({ categoryId }: { categoryId: string }) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>("updated_desc");

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

    xs.sort((a, b) => {
      switch (sort) {
        case "name_asc":
          return a.name.localeCompare(b.name, "ru");
        case "name_desc":
          return b.name.localeCompare(a.name, "ru");
        case "price_asc":
          return a.price - b.price;
        case "price_desc":
          return b.price - a.price;
        case "stock_desc":
          return (b.stockTotal ?? 0) - (a.stockTotal ?? 0);
        default:
          return (b.updatedAt || "").localeCompare(a.updatedAt || "");
      }
    });

    return xs;
  }, [categoryId, q, sort]);

  const totals = useMemo(() => {
    const qty = rows.reduce((s, r) => s + (r.stockTotal ?? 0), 0);
    const sum = rows.reduce(
      (s, r) => s + (r.price ?? 0) * (r.stockTotal ?? 0),
      0
    );
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
          <div className="mt-0.5 text-xs text-white/60">
            Найдено: <span className="text-white/80">{rows.length}</span> • Остаток:{" "}
            <span className="text-white/80">{totals.qty}</span> шт • На складе:{" "}
            <span className="text-white/80">{fmtPrice(totals.sum)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="hidden sm:flex items-center gap-2 text-xs">
            <span className="opacity-70">Сортировка</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="rounded-lg border border-white/15 bg-white/10 px-2 py-1 text-xs outline-none"
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
            href={`/demo/admin/shop/products?category=${encodeURIComponent(categoryId)}`}
            prefetch={false}
            className="rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15"
          >
            Открыть в общем списке
          </Link>
          <button
            onClick={() => alert("Массовые действия (демо)")}
            className="rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15"
          >
            ⋯
          </button>
        </div>
      </div>

      {/* Поиск по категории */}
      <div className="px-4 md:px-5 pb-3">
        <input
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
          <thead>
            <tr className="border-b border-white/10 text-left">
              <th className="p-3 w-16">Обл.</th>
              <th className="p-3">Название</th>
              <th className="p-3">SKU</th>
              <th className="p-3">Статус</th>
              <th className="p-3 text-right">Цена</th>
              <th className="p-3 text-right">Остаток</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="p-3">
                  <Cover iconName={r.iconName} media={r.media} />
                </td>
                <td className="p-3">
                  <Link
                    href={`/demo/admin/shop/products/${r.id}`}
                    className="hover:underline"
                  >
                    {r.name}
                  </Link>
                  <div className="text-[11px] text-white/50">обновлено: {r.updatedAt}</div>
                </td>
                <td className="p-3 font-mono text-xs">{r.sku}</td>
                <td className="p-3">
                  <StatusBadge v={r.status} />
                </td>
                <td className="p-3 text-right tabular-nums">{fmtPrice(r.price)}</td>
                <td className="p-3 text-right tabular-nums">{r.stockTotal}</td>
              </tr>
            ))}
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
          rows.map((r) => (
            <div key={r.id} className="p-3">
              <div className="flex items-start gap-3">
                <Cover iconName={r.iconName} media={r.media} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <Link
                      href={`/demo/admin/shop/products/${r.id}`}
                      className="truncate font-medium hover:underline"
                    >
                      {r.name}
                    </Link>
                    <StatusBadge v={r.status} />
                  </div>
                  <div className="mt-0.5 text-xs text-white/60">
                    SKU: <span className="font-mono">{r.sku}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-sm">
                    <span className="tabular-nums">{fmtPrice(r.price)}</span>
                    <span className="tabular-nums">Ост.: {r.stockTotal}</span>
                  </div>
                  <div className="mt-1 text-[11px] text-white/50">
                    обновлено: {r.updatedAt}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}