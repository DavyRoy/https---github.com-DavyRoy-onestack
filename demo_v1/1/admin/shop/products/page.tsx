// app/demo/admin/shop/products/page.tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PRODUCTS, type Product } from "@/app/demo/(shared)/data/catalog/products.food";
import ProductsFiltersBar from "./components/ProductsFiltersBar";
import ProductsTable from "./components/ProductsTable";
import BulkBar from "./components/BulkBar";
import EmptyState from "@/app/demo/(shared)/components/EmptyState";

type StockFilter = "all" | "in" | "low" | "out";
type IconFilter = "any" | "none";

export default function AdminProductsPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  const q = sp.get("q") || "";
  const status = sp.get("status") || "all";
  const cat = sp.get("category") || "all";
  const sort = sp.get("sort") || "updated_desc";

  const hasMedia = sp.get("has_media");
  const iconParam = sp.get("icon") as IconFilter | null;
  const icon: IconFilter =
    iconParam ?? (hasMedia === "true" ? "any" : hasMedia === "false" ? "none" : "any");

  const stock = (sp.get("stock") as StockFilter) || "all";

  const filtered: Product[] = useMemo(() => {
    let xs: Product[] = Array.from(PRODUCTS ?? []);

    if (q) {
      const qi = q.toLowerCase();
      xs = xs.filter(
        (p) =>
          (p.name || "").toLowerCase().includes(qi) ||
          (p.sku || "").toLowerCase().includes(qi) ||
          (p.barcode || "").toLowerCase().includes(qi)
      );
    }

    if (status !== "all") xs = xs.filter((p) => p.status === status);

    if (cat === "none") xs = xs.filter((p) => !p.categoryId);
    else if (cat !== "all") xs = xs.filter((p) => p.categoryId === cat);

    if (icon === "none") xs = xs.filter((p) => !p.iconId);

    if (stock !== "all") {
      xs = xs.filter((p) => {
        const s = Number.isFinite(p.stockTotal) ? p.stockTotal : 0;
        if (stock === "in") return s > 0;
        if (stock === "low") return s > 0 && s <= 5;
        if (stock === "out") return s <= 0;
        return true;
      });
    }

    xs.sort((a, b) => {
      switch (sort) {
        case "price_asc":
          return a.price - b.price;
        case "price_desc":
          return b.price - a.price;
        case "name_asc":
          return a.name.localeCompare(b.name, "ru");
        case "name_desc":
          return b.name.localeCompare(a.name, "ru");
        case "stock_desc":
          return (b.stockTotal ?? 0) - (a.stockTotal ?? 0);
        default:
          return (b.updatedAt || "").localeCompare(a.updatedAt || "");
      }
    });

    return xs;
  }, [q, status, cat, icon, stock, sort]);

  const toggleSelect = (id: string, checked: boolean) =>
    setSelected((prev) => (checked ? Array.from(new Set([...prev, id])) : prev.filter((x) => x !== id)));

  const toggleAll = (ids: string[], checked: boolean) =>
    setSelected((prev) => (checked ? Array.from(new Set([...prev, ...ids])) : prev.filter((x) => !ids.includes(x))));

  const clearSelection = () => setSelected([]);

  return (
    <div className="grid gap-6 overflow-x-hidden"> {/* ← стопим горизонтальный скролл на уровне страницы */}
      <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Товары</h1>
          <p className="mt-1 text-sm text-white/70">Поиск, фильтры и массовые операции</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/demo/admin/shop/products/new"
            className="rounded-xl bg-white px-4 py-2 text-sm text-black hover:bg-white/90"
          >
            Создать
          </Link>
          <button
            className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
            onClick={() => alert("Импорт/Экспорт (демо)")}
          >
            Импорт/Экспорт
          </button>
        </div>
      </header>

      <ProductsFiltersBar />

      {filtered.length === 0 ? (
        <EmptyState
          title="Ничего не найдено"
          hint="Попробуйте изменить фильтры, сбросить поиск или выбрать другой статус/категорию"
        />
      ) : (
        <ProductsTable rows={filtered} selectedIds={selected} onToggle={toggleSelect} onToggleAll={toggleAll} />
      )}

      {selected.length > 0 && <BulkBar selectedIds={selected} onClear={clearSelection} />}
    </div>
  );
}