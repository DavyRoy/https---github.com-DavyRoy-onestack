"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, Filter, RotateCcw, Check, SlidersHorizontal } from "lucide-react";
import clsx from "clsx";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

export type ShopFilters = {
  price: { min: number; max: number };
  inStockOnly: boolean;
  brands: string[];
  tags: string[];
  sort: "popular" | "price_asc" | "price_desc" | "new" | "rating_desc";
};

export type FiltersPanelProps = {
  mode: "inline" | "sheet";
  value: ShopFilters;
  priceRange: { min: number; max: number };
  brands: string[];
  tags: string[];
  visible?: boolean;
  totalResults: number;
  onChange: (value: ShopFilters) => void;
  onApply?: () => void;
  onClose?: () => void;
  onReset: () => void;
};

/* ----------------------------- helpers ----------------------------- */
function useIsMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}

function clamp(n: number, lo: number, hi: number) {
  return Math.min(Math.max(n, lo), hi);
}

function normalizePrice(input: string, fallback: number) {
  // поддержка "12 345", "12,345", "12.345", "12 345,67" -> берём целую часть
  const cleaned = input.replace(/[^\d,.\s\u00A0]/g, "").replace(/[\s\u00A0]/g, "");
  const parts = cleaned.split(/[,.]/); // дробная часть игнорируем
  const num = Number(parts[0]);
  return Number.isFinite(num) ? num : fallback;
}

/** В sheet-режиме редактируем черновик локально, в inline — работаем напрямую */
function useDraft(value: ShopFilters, mode: "inline" | "sheet", visible: boolean | undefined) {
  const [draft, setDraft] = useState<ShopFilters>(value);
  useEffect(() => {
    if (mode === "sheet" && visible) setDraft(value);
  }, [mode, value, visible]);
  return mode === "inline" ? ([value, setDraft] as const) : ([draft, setDraft] as const);
}

const overlayCls =
  "fixed inset-0 z-[1100] flex items-end justify-center bg-black/60 backdrop-blur-sm px-4 py-6 sm:items-center";
const panelBase = "admin-surface flex w-full rounded-2xl shadow-2xl";

/* ----------------------------- component ---------------------------- */
export default function FiltersPanel({
  mode,
  value,
  priceRange,
  brands,
  tags,
  visible = true,
  totalResults,
  onChange,
  onApply,
  onClose,
  onReset,
}: FiltersPanelProps) {
  const isMounted = useIsMounted();
  const reduced = useReducedMotion();
  const [draft, setDraft] = useDraft(value, mode, visible);
  const filters = draft;

  /* a11y: фокус-трап, Escape, возврат к триггеру */
  const panelRef = useRef<HTMLDivElement | null>(null);
  const openerElRef = useRef<HTMLElement | null>(null);
  const liveId = "filters-live";
  const resultsId = "filters-results";

  const getFocusable = useCallback(() => {
    const root = panelRef.current;
    if (!root) return [] as HTMLElement[];
    return Array.from(
      root.querySelectorAll<HTMLElement>(
        'a[href],button:not([disabled]),select,textarea,input:not([disabled]),[tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden"));
  }, []);

  useEffect(() => {
    if (mode !== "sheet" || !visible) return;
    openerElRef.current = (document.activeElement as HTMLElement) ?? null;

    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose?.();
        setTimeout(() => openerElRef.current?.focus(), 0);
      }
      if (e.key === "Enter") {
        // не применяем, если фокус на кнопке, ссылке или select (их onClick/ onChange и так сработают)
        const tag = (document.activeElement?.tagName || "").toLowerCase();
        if (tag === "select" || tag === "button" || tag === "a") return;
        onChange(filters);
        onApply?.();
        onClose?.();
        setTimeout(() => openerElRef.current?.focus(), 0);
      }
      if (e.key === "Tab") {
        // focus trap
        const f = getFocusable();
        if (f.length === 0) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    // автофокус на панели
    setTimeout(() => panelRef.current?.focus(), 0);

    return () => {
      document.documentElement.style.overflow = prevOverflow || "";
      document.removeEventListener("keydown", onKey);
    };
  }, [mode, visible, onClose, onApply, onChange, filters, getFocusable]);

  /* счётчик активных фильтров (сгруппированный) */
  const activeCount = useMemo(() => {
    const f = filters;
    let n = 0;
    if (f.price.min !== value.price.min || f.price.max !== value.price.max) n++;
    if (f.inStockOnly) n++;
    if (f.brands.length) n++;
    if (f.tags.length) n++;
    if (f.sort !== "popular") n++;
    return n;
  }, [filters, value.price.min, value.price.max]);

  // грязность (для кнопки «Применить»)
  const isDirty = useMemo(() => {
    const a = filters;
    const b = value;
    return (
      a.price.min !== b.price.min ||
      a.price.max !== b.price.max ||
      a.inStockOnly !== b.inStockOnly ||
      a.sort !== b.sort ||
      a.brands.join("|") !== b.brands.join("|") ||
      a.tags.join("|") !== b.tags.join("|")
    );
  }, [filters, value]);

  /* быстрые чипы для очистки */
  const chips = useMemo(() => {
    const out: Array<{ key: string; label: string; onClear: () => void }> = [];
    if (filters.price.min !== value.price.min || filters.price.max !== value.price.max) {
      out.push({
        key: "price",
        label: `Цена: ${filters.price.min.toLocaleString("ru-RU")}–${filters.price.max.toLocaleString("ru-RU")} ₽`,
        onClear: () => setFilter({ price: { min: value.price.min, max: value.price.max } }),
      });
    }
    if (filters.inStockOnly)
      out.push({ key: "stock", label: "В наличии", onClear: () => setFilter({ inStockOnly: false }) });
    filters.brands.forEach((b) =>
      out.push({
        key: `brand:${b}`,
        label: b,
        onClear: () => toggleArrayValue("brands", b),
      })
    );
    filters.tags.forEach((t) =>
      out.push({
        key: `tag:${t}`,
        label: `#${t}`,
        onClear: () => toggleArrayValue("tags", t),
      })
    );
    if (filters.sort !== "popular")
      out.push({
        key: `sort:${filters.sort}`,
        label: labelForSort(filters.sort),
        onClear: () => setFilter({ sort: "popular" }),
      });
    return out;
  }, [filters, value.price.min, value.price.max]);

  function setFilter(partial: Partial<ShopFilters>) {
    const next = { ...filters, ...partial } as ShopFilters;
    if (mode === "inline") {
      onChange(next);
    } else {
      setDraft(next);
    }
    const live = document.getElementById(liveId);
    if (live) {
      live.textContent = `Фильтры обновлены. Активных: ${activeCount}`;
      setTimeout(() => {
        live.textContent = "";
      }, 400);
    }
  }

  function toggleArrayValue(key: "brands" | "tags", v: string) {
    const exists = filters[key].includes(v);
    const next = exists ? filters[key].filter((i) => i !== v) : [...filters[key], v];
    setFilter({ [key]: next } as Partial<ShopFilters>);
  }

  function labelForSort(s: ShopFilters["sort"]) {
    switch (s) {
      case "popular":
        return "Популярность";
      case "price_asc":
        return "Сначала дешевле";
      case "price_desc":
        return "Сначала дороже";
      case "new":
        return "Новинки";
      case "rating_desc":
        return "Высокий рейтинг";
    }
  }

  /* price handlers с авто-починкой min/max */
  const onPriceMin = (raw: string) => {
    const val = normalizePrice(raw, priceRange.min);
    const min = clamp(val, priceRange.min, priceRange.max);
    const max = Math.max(min, filters.price.max);
    setFilter({ price: { min, max } });
  };

  const onPriceMax = (raw: string) => {
    const val = normalizePrice(raw, priceRange.max);
    const max = clamp(val, priceRange.min, priceRange.max);
    const min = Math.min(filters.price.min, max);
    setFilter({ price: { min, max } });
  };

  /* ----------------------------- UI ----------------------------- */

  const headerId = "filters-title";

  const header = (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx(
        "flex items-center justify-between gap-4",
        mode === "sheet"
          ? "sticky top-0 z-10 -mx-4 -mt-4 border-b border-white/10 bg-[hsl(var(--panel))]/95 px-4 pt-4 pb-3 backdrop-blur"
          : ""
      )}
    >
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/20 bg-white/10">
          <Filter className="h-5 w-5 text-white" aria-hidden="true" />
        </div>
        <div>
          <p className="admin-text-muted text-xs uppercase tracking-widest">Фильтры</p>
          <div className="flex items-center gap-2">
            <h2 id={headerId} className="text-lg font-semibold text-white">
              Уточните подборку
            </h2>
            {activeCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="admin-chip bg-white/10 text-white/80"
                aria-label={`Активных фильтров: ${activeCount}`}
              >
                {activeCount}
              </motion.span>
            )}
          </div>
        </div>
      </div>

      {mode === "sheet" && (
        <motion.button
          whileHover={reduced ? undefined : { scale: 1.05 }}
          whileTap={reduced ? undefined : { scale: 0.95 }}
          type="button"
          onClick={() => {
            onClose?.();
            setTimeout(() => openerElRef.current?.focus(), 0);
          }}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-all hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          aria-label="Закрыть фильтры"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </motion.button>
      )}
    </motion.div>
  );

  const body = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
      className={clsx(mode === "sheet" ? "space-y-6 overflow-y-auto pr-1" : "space-y-6")}
      aria-describedby={resultsId}
    >
      {/* Active Filters Chips */}
      {chips.length > 0 && (
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <h3 className="text-sm font-semibold text-white">Активные фильтры</h3>
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {chips.map((c) => (
                <motion.button
                  key={c.key}
                  initial={reduced ? undefined : { opacity: 0, scale: 0.8 }}
                  animate={reduced ? undefined : { opacity: 1, scale: 1 }}
                  exit={reduced ? undefined : { opacity: 0, scale: 0.8 }}
                  whileHover={reduced ? undefined : { scale: 1.05 }}
                  whileTap={reduced ? undefined : { scale: 0.95 }}
                  type="button"
                  onClick={c.onClear}
                  className="admin-chip border-white/20 bg-white/5 text-white/70 transition-all hover:border-white/30 hover:bg-white/10"
                  aria-label={`Очистить: ${c.label}`}
                  title={`Очистить фильтр: ${c.label}`}
                >
                  {c.label}
                  <X className="h-3 w-3" aria-hidden="true" />
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </motion.section>
      )}

      {/* Цена */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        aria-labelledby="price-filter"
        className="space-y-4"
      >
        <h3 id="price-filter" className="text-sm font-semibold text-white">
          Цена, ₽
        </h3>
        <div className="flex items-center gap-3">
          <label className="flex flex-1 flex-col gap-2 text-sm text-white/70">
            От
            <input
              aria-describedby="price-help"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder={priceRange.min.toLocaleString("ru-RU")}
              value={String(filters.price.min ?? "")}
              onChange={(e) => onPriceMin(e.target.value)}
              min={priceRange.min}
              max={priceRange.max}
              className="admin-surface-bleed px-3 py-2 text-sm text-white placeholder-white/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            />
          </label>
          <span className="mt-6 text-white/50" aria-hidden="true">
            —
          </span>
          <label className="flex flex-1 flex-col gap-2 text-sm text-white/70">
            До
            <input
              aria-describedby="price-help"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder={priceRange.max.toLocaleString("ru-RU")}
              value={String(filters.price.max ?? "")}
              onChange={(e) => onPriceMax(e.target.value)}
              min={priceRange.min}
              max={priceRange.max}
              className="admin-surface-bleed px-3 py-2 text-sm text-white placeholder-white/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            />
          </label>
        </div>
        <p id="price-help" className="admin-text-soft text-xs">
          Диапазон {priceRange.min.toLocaleString("ru-RU")}–{priceRange.max.toLocaleString("ru-RU")} ₽
        </p>
      </motion.section>

      {/* Наличие */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        aria-labelledby="stock-filter"
        className="space-y-3"
      >
        <h3 id="stock-filter" className="text-sm font-semibold text-white">
          Наличие
        </h3>
        <label className="group inline-flex cursor-pointer items-center gap-3 text-sm text-white">
          <div className="relative">
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) => setFilter({ inStockOnly: e.target.checked })}
              className="sr-only"
            />
            <div
              className={clsx(
                "h-5 w-5 rounded border-2 transition-all",
                filters.inStockOnly ? "border-white bg-white" : "border-white/30 bg-white/5 group-hover:border-white/50"
              )}
              aria-hidden="true"
            >
              {filters.inStockOnly && <Check className="mx-auto h-3 w-3 text-gray-900" aria-hidden="true" />}
            </div>
          </div>
          Только в наличии
        </label>
      </motion.section>

      {/* Бренды */}
      {brands.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          aria-labelledby="brand-filter"
          className="space-y-3"
        >
          <h3 id="brand-filter" className="text-sm font-semibold text-white">
            Бренды
          </h3>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Фильтр по брендам">
            {brands.map((brand) => {
              const active = filters.brands.includes(brand);
              return (
                <motion.button
                  key={brand}
                  whileHover={reduced ? undefined : { scale: 1.05 }}
                  whileTap={reduced ? undefined : { scale: 0.95 }}
                  type="button"
                  onClick={() => toggleArrayValue("brands", brand)}
                  className={clsx(
                    "admin-chip border transition-all",
                    active
                      ? "border-white bg-white/20 text-white"
                      : "border-white/20 bg-white/5 text-white/70 hover:border-white/30 hover:bg-white/10"
                  )}
                  aria-pressed={active}
                >
                  {brand}
                  {active && <Check className="ml-1 h-3 w-3" aria-hidden="true" />}
                </motion.button>
              );
            })}
          </div>
        </motion.section>
      )}

      {/* Теги */}
      {tags.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          aria-labelledby="tags-filter"
          className="space-y-3"
        >
          <h3 id="tags-filter" className="text-sm font-semibold text-white">
            Теги
          </h3>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Фильтр по тегам">
            {tags.map((tag) => {
              const active = filters.tags.includes(tag);
              return (
                <motion.button
                  key={tag}
                  whileHover={reduced ? undefined : { scale: 1.05 }}
                  whileTap={reduced ? undefined : { scale: 0.95 }}
                  type="button"
                  onClick={() => toggleArrayValue("tags", tag)}
                  className={clsx(
                    "admin-chip border transition-all",
                    active
                      ? "border-white bg白/20 text-white".replace("白", "white") // защита от автосабст. символов
                      : "border-white/20 bg-white/5 text-white/70 hover:border-white/30 hover:bg-white/10"
                  )}
                  aria-pressed={active}
                >
                  #{tag}
                  {active && <Check className="ml-1 h-3 w-3" aria-hidden="true" />}
                </motion.button>
              );
            })}
          </div>
        </motion.section>
      )}

      {/* Сортировка */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        aria-labelledby="sort-filter"
        className="space-y-3"
      >
        <h3 id="sort-filter" className="text-sm font-semibold text-white">
          Сортировать по
        </h3>
        <select
          aria-describedby="sort-help"
          value={filters.sort}
          onChange={(e) => setFilter({ sort: e.target.value as ShopFilters["sort"] })}
          className="admin-surface-bleed w-full px-3 py-2 text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          <option value="popular">Популярность</option>
          <option value="price_asc">Сначала дешевле</option>
          <option value="price_desc">Сначала дороже</option>
          <option value="new">Новинки</option>
          <option value="rating_desc">Высокий рейтинг</option>
        </select>
        <p id="sort-help" className="sr-only">
          Изменение сортировки обновит выдачу.
        </p>
      </motion.section>
    </motion.div>
  );

  const canReset = activeCount > 0;

  const footer = (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className={clsx(
        "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
        mode === "sheet"
          ? "border-t border-white/10 -mx-4 bg-[hsl(var(--panel))]/95 px-4 pt-4 pb-2 backdrop-blur"
          : ""
      )}
    >
      <p id={resultsId} className="admin-text-soft text-sm" aria-live="polite">
        Найдено: <span className="font-semibold text-white">{totalResults}</span> товаров
      </p>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <motion.button
          whileHover={reduced ? undefined : { scale: canReset ? 1.05 : 1 }}
          whileTap={reduced ? undefined : { scale: canReset ? 0.95 : 1 }}
          type="button"
          disabled={!canReset}
          onClick={() => {
            if (mode === "sheet") setDraft(value);
            onReset();
          }}
          className={clsx(
            "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all",
            canReset ? "admin-surface-bleed text-white/70 hover:bg-white/10 hover:text-white" : "cursor-not-allowed border-white/20 text-white/30"
          )}
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Сбросить
        </motion.button>

        {mode === "sheet" && (
          <motion.button
            whileHover={reduced ? undefined : { scale: isDirty ? 1.05 : 1 }}
            whileTap={reduced ? undefined : { scale: isDirty ? 0.95 : 1 }}
            type="button"
            disabled={!isDirty}
            onClick={() => {
              onChange(filters);
              onApply?.();
              onClose?.();
              setTimeout(() => openerElRef.current?.focus(), 0);
            }}
            className={clsx(
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all",
              isDirty ? "bg-white text-gray-900 shadow-lg hover:bg-white/90" : "cursor-not-allowed bg-white/20 text-white/30"
            )}
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            Применить
          </motion.button>
        )}
      </div>
    </motion.div>
  );

  const content = (
    <motion.div
      ref={panelRef}
      tabIndex={-1}
      initial={
        mode === "sheet"
          ? { opacity: 0, scale: reduced ? 1 : 0.96, y: reduced ? 0 : 16 }
          : { opacity: 1 }
      }
      animate={
        mode === "sheet"
          ? { opacity: 1, scale: 1, y: 0, transition: { duration: reduced ? 0 : 0.2 } }
          : { opacity: 1 }
      }
      exit={mode === "sheet" ? { opacity: 0, scale: reduced ? 1 : 0.96, y: reduced ? 0 : 16 } : { opacity: 1 }}
      className={clsx(
        panelBase,
        mode === "inline" ? "p-6" : "grid w-full max-w-md grid-rows-[auto_1fr_auto] gap-6 overflow-hidden p-4 sm:p-6"
      )}
      role={mode === "sheet" ? "dialog" : undefined}
      aria-modal={mode === "sheet" ? true : undefined}
      aria-labelledby={mode === "sheet" ? headerId : undefined}
      onClick={(e) => e.stopPropagation()}
    >
      {header}
      {body}
      {footer}
    </motion.div>
  );

  if (mode === "inline") {
    return <div className="hidden lg:block">{content}</div>;
  }

  if (!visible || !isMounted) return null;

  return createPortal(
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={overlayCls}
          role="dialog"
          aria-modal="true"
          aria-label="Фильтры"
          onClick={() => {
            onClose?.();
            setTimeout(() => openerElRef.current?.focus(), 0);
          }}
        >
          {content}
          {/* live-region для SR */}
          <span id={liveId} className="sr-only" aria-live="polite" />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}