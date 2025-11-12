"use client";

import { useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Filter, RotateCcw, Sparkles } from "lucide-react";

import CategoryTiles from "./CategoryTiles";
import CategoryHero from "./CategoryHero";
import FiltersPanel from "./FiltersPanel";
import ProductsGrid from "./ProductsGrid";

import { CATEGORY_BY_ID } from "../data/mockUserShopCategories";
import { mockUserShop, type ShopData } from "../data/mockUserShop";
import { cn, CARD_SOFT, BTN_GHOST, CHIP } from "./_shared";

/* ----------------------------- Типы ----------------------------- */

export type ShopFilters = {
  price: { min: number; max: number };
  inStockOnly: boolean;
  brands: string[];
  tags: string[];
  sort: "popular" | "price_asc" | "price_desc" | "new" | "rating_desc";
};

/* --------------------------- Утилиты URL --------------------------- */

// Parse CSV param (?brands=a,b,c)
function parseCSV(v: string | null): string[] {
  if (!v) return [];
  return v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function uniqArr<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

function toCSV(values: string[]) {
  return uniqArr(values).join(",");
}

// считываем сортировку безопасно
function parseSort(v: string | null): ShopFilters["sort"] {
  const allowed: ShopFilters["sort"][] = ["popular", "price_asc", "price_desc", "new", "rating_desc"];
  return allowed.includes(v as any) ? (v as ShopFilters["sort"]) : "popular";
}

function clamp(n: number, lo: number, hi: number) {
  return Math.min(Math.max(n, lo), hi);
}

/* -------------------------- Фильтрация -------------------------- */

function applyFilters(data: ShopData, categoryId: string | null, filters: ShopFilters) {
  let list = data.products;

  if (categoryId) {
    list = list.filter((p) => p.categoryId === categoryId || p.categoryId.startsWith(categoryId));
  }

  if (filters.inStockOnly) list = list.filter((p) => p.inStock);
  if (filters.brands.length) list = list.filter((p) => filters.brands.includes(p.brand));
  if (filters.tags.length) list = list.filter((p) => p.tags.some((t) => filters.tags.includes(t)));

  list = list.filter((p) => p.price >= filters.price.min && p.price <= filters.price.max);

  switch (filters.sort) {
    case "price_asc":
      list = [...list].sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      list = [...list].sort((a, b) => b.price - a.price);
      break;
    case "new":
      list = [...list].sort((a, b) => Number(b.isNew) - Number(a.isNew));
      break;
    case "rating_desc":
      list = [...list].sort((a, b) => b.rating - a.rating);
      break;
    default:
      list = [...list].sort((a, b) => b.reviewsCount - a.reviewsCount);
      break;
  }

  return list;
}

/* ——— helpers для сводки активных фильтров (UI-только) ——— */

function activeFiltersCount(base: ShopFilters, f: ShopFilters) {
  let n = 0;
  if (f.price.min !== base.price.min || f.price.max !== base.price.max) n++;
  if (f.inStockOnly) n++;
  if (f.brands.length) n++;
  if (f.tags.length) n++;
  if (f.sort !== "popular") n++;
  return n;
}

function chipsFromFilters(base: ShopFilters, f: ShopFilters) {
  const chips: string[] = [];
  if (f.price.min !== base.price.min || f.price.max !== base.price.max) {
    chips.push(`Цена: ${f.price.min.toLocaleString("ru-RU")}–${f.price.max.toLocaleString("ru-RU")} ₽`);
  }
  if (f.inStockOnly) chips.push("В наличии");
  if (f.brands.length) chips.push(...uniqArr(f.brands));
  if (f.tags.length) chips.push(...uniqArr(f.tags).map((t) => `#${t}`));
  if (f.sort !== "popular") {
    const label =
      f.sort === "price_asc"
        ? "Сначала дешевле"
        : f.sort === "price_desc"
        ? "Сначала дороже"
        : f.sort === "new"
        ? "Новинки"
        : "Высокий рейтинг";
    chips.push(label);
  }
  return chips;
}

/* --------------------------- Компонент --------------------------- */

export default function ShopClient() {
  const reduced = useReducedMotion();
  const pathname = usePathname();
  const sp = useSearchParams();

  const data = mockUserShop;
  const categoryId = sp.get("category");

  // База фильтров от ассортимента
  const baseFilters: ShopFilters = useMemo(
    () => ({
      price: { min: data.priceRange.min, max: data.priceRange.max },
      inStockOnly: false,
      brands: [],
      tags: [],
      sort: "popular",
    }),
    [data.priceRange.min, data.priceRange.max]
  );

  /* --------- Чтение фильтров из URL (hydrate) --------- */

  const urlFilters: ShopFilters = useMemo(() => {
    const priceMin = clamp(Number(sp.get("price_min")) || data.priceRange.min, data.priceRange.min, data.priceRange.max);
    const priceMax = clamp(Number(sp.get("price_max")) || data.priceRange.max, data.priceRange.min, data.priceRange.max);
    const min = Math.min(priceMin, priceMax);
    const max = Math.max(priceMin, priceMax);

    const brands = parseCSV(sp.get("brands")).filter((b) => data.brands.includes(b));
    const tags = parseCSV(sp.get("tags")).filter((t) => data.tags.includes(t));

    const inStockOnly = sp.get("stock") === "1";
    const sort = parseSort(sp.get("sort"));

    return {
      price: { min, max },
      inStockOnly,
      brands,
      tags,
      sort,
    };
  }, [sp, data.priceRange.min, data.priceRange.max, data.brands, data.tags]);

  // локальное состояние фильтров (контролируемое)
  const [filters, setFilters] = useState<ShopFilters>(urlFilters);
  // синхронизация при навигации/смене URL (например, при клике по категории)
  useEffect(() => {
    setFilters((prev) => {
      // если категория сменилась — мягко сбрасываем price в базовый диапазон (остальное берём из URL)
      const merged: ShopFilters = { ...prev, ...urlFilters };
      return merged;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlFilters.price.min, urlFilters.price.max, urlFilters.inStockOnly, urlFilters.sort, urlFilters.brands.join("|"), urlFilters.tags.join("|"), categoryId]);

  // «черновик» без рывков UI на больших выборках
  const deferredFilters = useDeferredValue(filters);

  /* --------- Синк фильтров в URL (deep-linking) --------- */

  useEffect(() => {
    const s = new URLSearchParams(sp?.toString() ?? "");
    // категория остаётся как есть (её меняют снаружи)
    // price
    if (deferredFilters.price.min !== data.priceRange.min) s.set("price_min", String(deferredFilters.price.min));
    else s.delete("price_min");

    if (deferredFilters.price.max !== data.priceRange.max) s.set("price_max", String(deferredFilters.price.max));
    else s.delete("price_max");

    // stock
    if (deferredFilters.inStockOnly) s.set("stock", "1");
    else s.delete("stock");

    if (deferredFilters.brands.length) s.set("brands", toCSV(deferredFilters.brands));
    else s.delete("brands");

    if (deferredFilters.tags.length) s.set("tags", toCSV(deferredFilters.tags));
    else s.delete("tags");

    // sort
    if (deferredFilters.sort !== "popular") s.set("sort", deferredFilters.sort);
    else s.delete("sort");

    const next = `${pathname}?${s.toString()}`;
    const curr = `${pathname}?${sp?.toString()}`;
    if (next !== curr) {
      history.replaceState(null, "", next);
    }
  }, [deferredFilters, data.priceRange.min, data.priceRange.max, pathname, sp]);

  /* --------- Управление модальным фильтром --------- */

  const [sheetOpen, setSheetOpen] = useState(false);
  const openFilters = useCallback(() => setSheetOpen(true), []);
  const closeFilters = useCallback(() => setSheetOpen(false), []);
  const resetFilters = useCallback(() => {
    setFilters(baseFilters);
    // подчистим query
    const s = new URLSearchParams(sp?.toString() ?? "");
    ["price_min", "price_max", "stock", "brands", "tags", "sort"].forEach((k) => s.delete(k));
    history.replaceState(null, "", `${pathname}?${s.toString()}`);
  }, [baseFilters, pathname, sp]);

  // Хотркей: F — открыть фильтры (мобилка/тач не мешает)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (document.activeElement?.tagName || "").toLowerCase();
      if (["input", "textarea", "select"].includes(tag)) return;
      if ((e.key === "f" || e.key === "F") && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        openFilters();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openFilters]);

  /* --------- Подмножества брендов/тегов под выбранную категорию --------- */

  const categoryFilteredFacet = useMemo(() => {
    const byCat = categoryId
      ? mockUserShop.products.filter((p) => p.categoryId === categoryId || p.categoryId.startsWith(categoryId))
      : mockUserShop.products;

    const brands = uniqArr(byCat.map((p) => p.brand)).filter(Boolean);
    const tags = uniqArr(byCat.flatMap((p) => p.tags)).filter(Boolean);

    return {
      brands: brands.length ? brands : data.brands,
      tags: tags.length ? tags : data.tags,
    };
  }, [categoryId, data.brands, data.tags]);

  /* --------- Применение фильтров --------- */

  const filteredProducts = useMemo(
    () => applyFilters(data, categoryId, deferredFilters),
    [data, categoryId, deferredFilters]
  );

  const actCount = activeFiltersCount(baseFilters, deferredFilters);
  const chips = chipsFromFilters(baseFilters, deferredFilters);

  // Анимация для активных фильтров (motion-safe)
  const filterChipVariants = {
    hidden: { opacity: 0, scale: reduced ? 1 : 0.9, y: reduced ? 0 : 8 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: reduced ? 1 : 0.9, y: reduced ? 0 : -8 },
  };

  /* ------------------------ Без категории ------------------------ */

  if (!categoryId) {
    return (
      <div className="space-y-8">
        <CategoryTiles />

        {/* Активные фильтры (мобайл) */}
        <AnimatePresence>
          {actCount > 0 && (
            <motion.div
              initial={reduced ? undefined : { opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -16 }}
              className={cn(CARD_SOFT, "rounded-2xl border-white/14 bg-white/8 p-4 text-white/75 shadow-none lg:hidden")}
              aria-live="polite"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-white/70" />
                  <span className={cn(CHIP, "border-white/18 bg-white/12 text-[11px] text-white/70")}>
                    {actCount} активных фильтров
                  </span>
                </div>
                <motion.button
                  whileHover={reduced ? undefined : { scale: 1.05 }}
                  whileTap={reduced ? undefined : { scale: 0.95 }}
                  type="button"
                  onClick={resetFilters}
                  className={cn(
                    BTN_GHOST,
                    "rounded-2xl border-white/18 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/70 hover:border-white/28 hover:bg-white/14 hover:text-white"
                  )}
                >
                  <RotateCcw className="h-3 w-3" />
                  Сбросить
                </motion.button>
              </div>

              {chips.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  <AnimatePresence>
                    {chips.map((c) => (
                      <motion.span
                        key={c}
                        variants={filterChipVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        layout
                        className={cn(CHIP, "border-white/18 bg-white/10 text-xs text-white/60")}
                      >
                        {c}
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Подборки */}
        <div className="space-y-12">
          <ProductsGrid
            title="Популярное"
            products={applyFilters(data, null, { ...baseFilters, sort: "popular" })}
            onOpenFilters={openFilters}
            brands={categoryFilteredFacet.brands}
            tags={categoryFilteredFacet.tags}
            stickyToolbar
          />

          <ProductsGrid
            title="Новинки"
            products={applyFilters(data, null, { ...baseFilters, sort: "new" })}
            onOpenFilters={openFilters}
            brands={categoryFilteredFacet.brands}
            tags={categoryFilteredFacet.tags}
          />

          <ProductsGrid
            title="Лучшие по рейтингу"
            products={applyFilters(data, null, { ...baseFilters, sort: "rating_desc" })}
            onOpenFilters={openFilters}
            brands={categoryFilteredFacet.brands}
            tags={categoryFilteredFacet.tags}
          />
        </div>

        {/* Sheet-фильтры (мобайл) */}
        <FiltersPanel
          mode="sheet"
          visible={sheetOpen}
          value={filters}
          priceRange={data.priceRange}
          brands={categoryFilteredFacet.brands}
          tags={categoryFilteredFacet.tags}
          totalResults={filteredProducts.length}
          onChange={setFilters}
          onApply={closeFilters}
          onClose={closeFilters}
          onReset={resetFilters}
        />
      </div>
    );
  }

  /* ------------------------ Страница категории ------------------------ */

  const category = CATEGORY_BY_ID[categoryId];
  const title = category?.name || "Категория";

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
      {/* Фильтры: сайдбар (десктоп) */}
      <motion.div initial={reduced ? undefined : { opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: reduced ? 0.12 : 0.4 }} className="hidden lg:block">
        <FiltersPanel
          mode="inline"
          value={filters}
          priceRange={data.priceRange}
          brands={categoryFilteredFacet.brands}
          tags={categoryFilteredFacet.tags}
          totalResults={filteredProducts.length}
          onChange={setFilters}
          onReset={resetFilters}
        />
      </motion.div>

      <div className="space-y-8">
        <CategoryHero categoryId={categoryId} />

        {/* Активные фильтры (мобайл) */}
        <AnimatePresence>
          {activeFiltersCount(baseFilters, deferredFilters) > 0 && (
            <motion.div
              initial={reduced ? undefined : { opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -16 }}
              className={cn(CARD_SOFT, "rounded-2xl border-white/14 bg-white/8 p-4 text-white/75 shadow-none lg:hidden")}
              aria-live="polite"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-white/70" />
                  <span className={cn(CHIP, "border-white/18 bg-white/12 text-[11px] text-white/70")}>
                    {actCount} активных фильтров
                  </span>
                </div>
                <motion.button
                  whileHover={reduced ? undefined : { scale: 1.05 }}
                  whileTap={reduced ? undefined : { scale: 0.95 }}
                  type="button"
                  onClick={resetFilters}
                  className={cn(
                    BTN_GHOST,
                    "rounded-2xl border-white/18 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/70 hover:border-white/28 hover:bg-white/14 hover:text-white"
                  )}
                >
                  <RotateCcw className="h-3 w-3" />
                  Сбросить
                </motion.button>
              </div>

              {chips.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  <AnimatePresence>
                    {chips.map((c) => (
                      <motion.span
                        key={c}
                        variants={filterChipVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        layout
                        className={cn(CHIP, "border-white/18 bg-white/10 text-xs text-white/60")}
                      >
                        {c}
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Сетка товаров */}
        <motion.div initial={reduced ? undefined : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: reduced ? 0 : 0.2 }}>
          <ProductsGrid
            title={title}
            products={filteredProducts}
            onOpenFilters={openFilters}
            brands={categoryFilteredFacet.brands}
            tags={categoryFilteredFacet.tags}
            stickyToolbar
          />
        </motion.div>

        {/* Доп. рекомендации */}
        {filteredProducts.length > 0 && (
          <motion.div initial={reduced ? undefined : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduced ? 0 : 0.35 }} className="space-y-8">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-white/70" />
              <h3 className="text-lg font-semibold text-white">Рекомендуем посмотреть</h3>
            </div>

            <ProductsGrid
              title="Похожие товары"
              products={applyFilters(data, null, { ...baseFilters, sort: "popular" }).slice(0, 8)}
              onOpenFilters={openFilters}
              brands={categoryFilteredFacet.brands}
              tags={categoryFilteredFacet.tags}
            />
          </motion.div>
        )}

        {/* Sheet-фильтры (мобайл) */}
        <FiltersPanel
          mode="sheet"
          visible={sheetOpen}
          value={filters}
          priceRange={data.priceRange}
          brands={categoryFilteredFacet.brands}
          tags={categoryFilteredFacet.tags}
          totalResults={filteredProducts.length}
          onChange={setFilters}
          onApply={closeFilters}
          onClose={closeFilters}
          onReset={resetFilters}
        />
      </div>
    </div>
  );
}
