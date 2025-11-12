// app/demo/admin/shop/products/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { PRODUCTS, type Product } from "@/app/demo/(shared)/data/catalog/products.food";
import ProductsFiltersBar from "./components/ProductsFiltersBar";
import ProductsTable from "./components/ProductsTable";
import BulkBar from "./components/BulkBar";
import EmptyState from "@/app/demo/(shared)/components/EmptyState";

type StockFilter = "all" | "in" | "low" | "out";
type IconFilter = "any" | "none";

function getBase(pathname: string | null) {
  if (!pathname) return "/demo/admin";
  if (pathname.startsWith("/demo/manager")) return "/demo/manager";
  if (pathname.startsWith("/demo/user")) return "/demo/user";
  return "/demo/admin";
}

/* utils */
const collator = new Intl.Collator("ru", { numeric: true, sensitivity: "base" });
const cmpStr = (a?: string, b?: string) => collator.compare(a ?? "", b ?? "");
const safeNum = (v: unknown, min = 0) => (Number.isFinite(v as number) ? Math.max(min, v as number) : min);
const normStatus = (s?: string) => (s ?? "active");

export default function AdminProductsPage() {
  const sp = useSearchParams();
  const pathname = usePathname();
  const base = getBase(pathname);

  const [selected, setSelected] = useState<string[]>([]);

  // URL-параметры
  const q = sp.get("q") || "";
  const status = sp.get("status") || "all";
  const cat = sp.get("category") || "all";
  const sort = sp.get("sort") || "updated_desc";
  const stock = (sp.get("stock") as StockFilter) || "all";

  // обратная совместимость c has_media
  const hasMedia = sp.get("has_media");
  const iconParam = sp.get("icon") as IconFilter | null;
  const icon: IconFilter = iconParam ?? (hasMedia === "true" ? "any" : hasMedia === "false" ? "none" : "any");

  // Основная выборка + фильтрация + сортировка
  const filtered: Product[] = useMemo(() => {
    let xs: Product[] = Array.from(PRODUCTS ?? []);

    // поиск
    if (q) {
      const qi = q.toLowerCase();
      xs = xs.filter((p) =>
        (p.name ?? "").toLowerCase().includes(qi) ||
        (p.sku ?? "").toLowerCase().includes(qi) ||
        (p.barcode ?? "").toLowerCase().includes(qi)
      );
    }

    // статус
    if (status !== "all") xs = xs.filter((p) => normStatus(p.status) === status);

    // категория
    if (cat === "none") xs = xs.filter((p) => !p.categoryId);
    else if (cat !== "all") xs = xs.filter((p) => p.categoryId === cat);

    // иконка
    if (icon === "none") xs = xs.filter((p) => !p.iconId);

    // остаток
    if (stock !== "all") {
      xs = xs.filter((p) => {
        const s = safeNum(p.stockTotal, 0);
        if (stock === "in") return s > 0;
        if (stock === "low") return s > 0 && s <= 5; // при желании вынести порог в конфиг
        if (stock === "out") return s <= 0;
        return true;
      });
    }

    // сортировка (стабильная, с дополнительными ключами)
    xs.sort((a, b) => {
      const ap = safeNum(a.price, 0);
      const bp = safeNum(b.price, 0);
      const as = safeNum(a.stockTotal, 0);
      const bs = safeNum(b.stockTotal, 0);

      switch (sort) {
        case "price_asc":
          return ap - bp || cmpStr(a.name, b.name) || cmpStr(a.sku, b.sku) || cmpStr(a.id, b.id);
        case "price_desc":
          return bp - ap || cmpStr(a.name, b.name) || cmpStr(a.sku, b.sku) || cmpStr(a.id, b.id);
        case "name_asc":
          return cmpStr(a.name, b.name) || cmpStr(a.sku, b.sku) || cmpStr(a.id, b.id);
        case "name_desc":
          return cmpStr(b.name, a.name) || cmpStr(b.sku, a.sku) || cmpStr(b.id, a.id);
        case "stock_desc":
          return bs - as || cmpStr(a.name, b.name) || cmpStr(a.id, b.id);
        default:
          // updated_desc
          return (b.updatedAt || "").localeCompare(a.updatedAt || "") || cmpStr(a.name, b.name) || cmpStr(a.id, b.id);
      }
    });

    return xs;
  }, [q, status, cat, icon, stock, sort]);

  // Сброс выделения:
  // 1) если строки исчезли из текущей выборки
  useEffect(() => {
    setSelected((prev) => prev.filter((id) => filtered.some((p) => p.id === id)));
  }, [filtered]);
  // 2) и при любых изменениях фильтров/сортировки — чтобы не выполнять массовые операции по старому контексту
  useEffect(() => {
    setSelected([]);
  }, [q, status, cat, icon, stock, sort]);

  // helpers для выделения
  const toggleSelect = (id: string, checked: boolean) =>
    setSelected((prev) => (checked ? Array.from(new Set([...prev, id])) : prev.filter((x) => x !== id)));

  const toggleAll = (ids: string[], checked: boolean) =>
    setSelected((prev) => (checked ? Array.from(new Set([...prev, ...ids])) : prev.filter((x) => !ids.includes(x))));

  const clearSelection = () => setSelected([]);

  return (
    <>
      <section className="admin-section border-white/12 bg-white/8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <span className="admin-chip mb-1 bg-white/12 text-white/75">Каталог</span>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">Товары</h1>
            <p className="mt-1 text-sm text-white/70">Поиск, фильтры и массовые операции</p>

            {/* мини-сводка по текущему запросу */}
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-white/65" aria-live="polite">
              <span className="rounded-lg border border-white/12 bg-white/8 px-2 py-1">
                Найдено: <b className="tabular-nums text-white/85">{filtered.length}</b>
              </span>
              {selected.length > 0 && (
                <span className="rounded-lg border border-white/12 bg-white/8 px-2 py-1">
                  Выбрано: <b className="tabular-nums text-white/85">{selected.length}</b>
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`${base}/shop/products/new`}
              prefetch={false}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              Создать
            </Link>
            <button
              className="rounded-xl border border-white/12 bg-white/10 px-4 py-2 text-sm text-white/80 transition hover:border-white/18 hover:bg-white/16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              onClick={() => alert("Импорт/Экспорт (демо)")}
            >
              Импорт/Экспорт
            </button>
          </div>
        </div>
      </section>

      {/* Полоса фильтров (работает через URL) */}
      <ProductsFiltersBar />

      {/* Таблица/пустое состояние */}
      {filtered.length === 0 ? (
        <EmptyState
          title="Ничего не найдено"
          hint="Попробуйте изменить фильтры, сбросить поиск или выбрать другой статус/категорию"
        />
      ) : (
        <ProductsTable rows={filtered} selectedIds={selected} onToggle={toggleSelect} onToggleAll={toggleAll} />
      )}

      {/* Плавающая панель массовых операций */}
      {selected.length > 0 && <BulkBar selectedIds={selected} onClear={clearSelection} />}
    </>
  );
}