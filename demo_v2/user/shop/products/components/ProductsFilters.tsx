"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Filter, SlidersHorizontal, Check, ChevronDown, ChevronUp,
  RotateCcw, Sparkles, Tag, DollarSign, Package, Grid3X3
} from "lucide-react";
import type { ShopCategory } from "../../data/mockUserShopCategories";
import { shopCategories } from "../../data/mockUserShopCategories";
import { attributeGroups, type ProductAttributeDefinition } from "../data/mockAttributes";
import {
  cn,
  BTN_PRIMARY,
  BTN_GHOST,
  CHIP,
  TAPPABLE,
  CARD,
  CARD_SOFT,
  DASHBOARD_CARD
} from "./_shared";

export type ProductsFiltersValue = {
  categories: string[];
  brands: string[];
  tags: string[];
  inStock: boolean;
  price: { min: number; max: number };
  attributes: Record<string, string | boolean>;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export type ProductsFiltersProps = {
  mode: "inline" | "sheet" | "floating";
  value: ProductsFiltersValue;
  priceRange: { min: number; max: number };
  brands: string[];
  tags?: string[];
  onChange: (value: ProductsFiltersValue) => void;
  onApply?: () => void;
  onClose?: () => void;
  onReset: () => void;
  visible?: boolean;
  productCount?: number;
  className?: string;
  loading?: boolean;
};

/* ========================= helpers ========================= */

function useDraft(value: ProductsFiltersValue, mode: "inline" | "sheet" | "floating", visible?: boolean) {
  const [draft, setDraft] = useState(value);
  useEffect(() => {
    if ((mode === "sheet" || mode === "floating") && visible) setDraft(value);
  }, [mode, value, visible]);
  return mode === "inline" ? ([value, setDraft] as const) : ([draft, setDraft] as const);
}

const overlayClasses = cn(
  "fixed inset-0 z-[1200] flex items-end justify-center p-4 sm:items-center",
  "bg-black/60 backdrop-blur-xl transition-all duration-300"
);

const renderCategoryTree = (
  categories: ShopCategory[],
  selected: string[],
  toggle: (id: string) => void,
  level = 0
) => (
  <ul
    role="list"
    className={cn(
      "space-y-2",
      level > 0 && "pl-4 border-l border-white/10 ml-3"
    )}
  >
    {categories.map((category) => {
      const active = selected.includes(category.id);
      const hasChildren = category.children?.length > 0;

      return (
        <motion.li 
          key={category.id}
          layout
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => toggle(category.id)}
            className={cn(
              "flex w-full items-center justify-between rounded-2xl border-2 px-4 py-3 text-left text-sm transition-all duration-300",
              TAPPABLE,
              active
                ? cn(
                    "border-blue-400/40 bg-blue-500/15 text-white",
                    "shadow-2xl shadow-blue-500/20 backdrop-blur-lg"
                  )
                : cn(
                    "border-white/10 bg-white/6 text-white/70",
                    "hover:border-white/20 hover:bg-white/10 hover:text-white/90"
                  )
            )}
            aria-pressed={active}
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <motion.div
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-lg border-2 transition-all duration-300",
                  active
                    ? "border-blue-400 bg-blue-500 shadow-inner shadow-blue-400/30"
                    : "border-white/20 bg-white/10 group-hover:border-white/30"
                )}
                animate={{ scale: active ? 1.1 : 1 }}
              >
                {active && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <Check className="h-3 w-3 text-white" />
                  </motion.div>
                )}
              </motion.div>
              <span className="truncate font-medium">{category.name}</span>
            </div>
            {hasChildren && (
              <motion.span
                className={cn(
                  "ml-2 shrink-0 text-xs transition-colors duration-300",
                  active ? "text-blue-300" : "text-white/40"
                )}
                animate={{ rotate: active ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="h-3 w-3" />
              </motion.span>
            )}
          </motion.button>
          {hasChildren && (
            <motion.div
              className={cn(
                "mt-2 transition-all duration-500",
                active ? "opacity-100" : "opacity-60"
              )}
              initial={false}
              animate={{ 
                height: active ? "auto" : 0,
                opacity: active ? 1 : 0
              }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              {renderCategoryTree(category.children, selected, toggle, level + 1)}
            </motion.div>
          )}
        </motion.li>
      );
    })}
  </ul>
);

/* ========================= component ========================= */

export default function ProductsFilters({
  mode,
  value,
  priceRange,
  brands,
  tags = [],
  onChange,
  onApply,
  onClose,
  onReset,
  visible = false,
  productCount,
  className,
  loading = false,
}: ProductsFiltersProps) {
  const [draft, setDraft] = useDraft(value, mode, visible);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["categories", "brands", "price", "stock"])
  );
  const filters = draft;

  /* a11y: возврат фокуса и ловушка */
  const panelRef = useRef<HTMLDivElement | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (mode === "inline" || !visible) return;
    openerRef.current = (document.activeElement as HTMLElement) ?? null;

    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose?.();
        setTimeout(() => openerRef.current?.focus(), 0);
      }
      if (e.key === "Tab") {
        const nodes = getFocusable(panelRef.current);
        if (!nodes.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    };

    document.addEventListener("keydown", onKey);
    setTimeout(() => panelRef.current?.focus(), 50);

    return () => {
      document.documentElement.style.overflow = prevOverflow || "";
      document.removeEventListener("keydown", onKey);
      openerRef.current?.focus?.();
    };
  }, [mode, visible, onClose]);

  /* вычисления */
  const clamp = (n: number, lo: number, hi: number) => Math.min(Math.max(n, lo), hi);

  const toggleArray = useCallback(
    (key: "categories" | "brands" | "tags", id: string) => {
      const set = new Set(filters[key]);
      if (set.has(id)) {
        set.delete(id);
      } else {
        set.add(id);
      }

      const next = { ...filters, [key]: Array.from(set) } as ProductsFiltersValue;
      if (mode === "inline") {
        onChange(next);
      } else {
        setDraft(next);
      }
    },
    [filters, mode, onChange, setDraft]
  );

  const update = useCallback(
    (partial: Partial<ProductsFiltersValue>) => {
      const next = { ...filters, ...partial } as ProductsFiltersValue;
      if (mode === "inline") {
        onChange(next);
      } else {
        setDraft(next);
      }
    },
    [filters, mode, onChange, setDraft]
  );

  const toggleSection = useCallback((section: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  }, []);

  // Группы атрибутов под выбранные категории (или все)
  const characteristics = useMemo(() => {
    if (!filters.categories.length) return attributeGroups;
    return attributeGroups.filter((g) => filters.categories.includes(g.categoryId));
  }, [filters.categories]);

  // Карта id атрибутов -> человекочитаемые названия (для чипов)
  const attrLabelMap = useMemo(() => {
    const m = new Map<string, string>();
    attributeGroups.forEach((g) => g.attributes.forEach((a) => m.set(a.id, a.label)));
    return m;
  }, []);

  // Счётчик активных фильтров
  const activeCount = useMemo(() => {
    let n = 0;
    if (filters.categories.length) n++;
    if (filters.brands.length) n++;
    if (filters.tags.length) n++;
    if (filters.inStock) n++;
    if (filters.price.min !== priceRange.min || filters.price.max !== priceRange.max) n++;
    const attrsActive = Object.values(filters.attributes).some((v) => {
      if (typeof v === "boolean") return v;
      return String(v ?? "").trim() !== "" && String(v) !== ",";
    });
    if (attrsActive) n++;
    return n;
  }, [filters, priceRange.min, priceRange.max]);

  // Быстрые чипы для сброса
  const chips = useMemo(() => {
    const out: Array<{ key: string; label: string; onClear: () => void }> = [];
    if (filters.categories.length)
      out.push({
        key: "cats",
        label: `Категории: ${filters.categories.length}`,
        onClear: () => update({ categories: [] }),
      });
    if (filters.brands.length)
      out.push({
        key: "brands",
        label: `Бренды: ${filters.brands.length}`,
        onClear: () => update({ brands: [] }),
      });
    if (filters.tags.length)
      out.push({
        key: "tags",
        label: `Теги: ${filters.tags.length}`,
        onClear: () => update({ tags: [] }),
      });
    if (filters.inStock)
      out.push({ key: "stock", label: "В наличии", onClear: () => update({ inStock: false }) });
    if (filters.price.min !== priceRange.min || filters.price.max !== priceRange.max)
      out.push({
        key: "price",
        label: `Цена: ${filters.price.min.toLocaleString("ru-RU")}–${filters.price.max.toLocaleString("ru-RU")} ₽`,
        onClear: () => update({ price: { min: priceRange.min, max: priceRange.max } }),
      });
    Object.entries(filters.attributes).forEach(([k, v]) => {
      const val = typeof v === "boolean" ? (v ? "Да" : "") : String(v);
      if (!val || val === ",") return;
      out.push({
        key: `attr:${k}`,
        label: attrLabelMap.get(k) ?? k,
        onClear: () =>
          update({
            attributes: { ...filters.attributes, [k]: typeof v === "boolean" ? false : "" },
          }),
      });
    });
    return out;
  }, [filters, priceRange.min, priceRange.max, update, attrLabelMap]);

  /* ---------- атрибуты с kind + options {value,label} ---------- */
  function renderAttributeControl(attr: ProductAttributeDefinition) {
    const current = filters.attributes[attr.id];

    switch (attr.kind) {
      case "boolean": {
        const checked = Boolean(current);
        return (
          <motion.label 
            key={attr.id} 
            layout
            className="inline-flex items-center gap-3 text-sm text-white cursor-pointer group"
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-lg border-2 transition-all duration-300",
                checked
                  ? "border-blue-400 bg-blue-500 shadow-inner shadow-blue-400/30"
                  : "border-white/20 bg-white/10 group-hover:border-white/30"
              )}
              animate={{ scale: checked ? 1.1 : 1 }}
            >
              {checked && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <Check className="h-3 w-3 text-white" />
                </motion.div>
              )}
            </motion.div>
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) =>
                update({ attributes: { ...filters.attributes, [attr.id]: e.target.checked } })
              }
              className="sr-only"
            />
            <span className={cn(
              "transition-colors duration-300",
              checked ? "text-white font-medium" : "text-white/70"
            )}>
              {attr.trueLabel ?? attr.label}
            </span>
          </motion.label>
        );
      }

      case "select": {
        const val = typeof current === "string" ? current : "";
        return (
          <motion.label 
            key={attr.id} 
            layout
            className="flex flex-col gap-2 text-sm"
          >
            <span className="font-medium text-white/80">{attr.label}</span>
            <motion.select
              value={val}
              onChange={(e) =>
                update({ attributes: { ...filters.attributes, [attr.id]: e.target.value } })
              }
              className={cn(
                "rounded-2xl border-2 border-white/12 bg-white/8 px-4 py-3 text-white",
                "transition-all duration-300 backdrop-blur-lg",
                "hover:border-white/20 hover:bg-white/12",
                "focus:border-blue-400/40 focus:bg-white/12 focus:ring-2 focus:ring-blue-500/30"
              )}
              whileFocus={{ scale: 1.02 }}
            >
              <option value="">Не выбрано</option>
              {(attr.options ?? []).map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </motion.select>
          </motion.label>
        );
      }

      case "multiselect": {
        const csv = typeof current === "string" ? current : "";
        const set = new Set(csv ? csv.split(",") : []);
        const toggle = (v: string) => {
          if (set.has(v)) {
            set.delete(v);
          } else {
            set.add(v);
          }
          update({ attributes: { ...filters.attributes, [attr.id]: Array.from(set).join(",") } });
        };
        return (
          <motion.div 
            key={attr.id} 
            layout
            className="flex flex-col gap-3"
          >
            <span className="text-sm font-medium text-white/80">{attr.label}</span>
            <div className="flex flex-wrap gap-2">
              {(attr.options ?? []).map((opt) => {
                const active = set.has(opt.value);
                return (
                  <motion.button
                    key={opt.value}
                    layout
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => toggle(opt.value)}
                    className={cn(
                      "rounded-xl border-2 px-3 py-2 text-sm font-medium transition-all duration-300",
                      TAPPABLE,
                      active
                        ? cn(
                            "border-blue-400/40 bg-blue-500/20 text-blue-200",
                            "shadow-lg shadow-blue-500/20 backdrop-blur-lg"
                          )
                        : cn(
                            "border-white/12 bg-white/8 text-white/70",
                            "hover:border-white/20 hover:bg-white/12 hover:text-white/90"
                          )
                    )}
                    aria-pressed={active}
                  >
                    {opt.label}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        );
      }

      case "number": {
        const numStr = typeof current === "string" ? current : "";
        return (
          <motion.label 
            key={attr.id} 
            layout
            className="flex flex-col gap-2 text-sm"
          >
            <span className="font-medium text-white/80">{attr.label}</span>
            <motion.input
              type="number"
              min={attr.min ?? undefined}
              max={attr.max ?? undefined}
              step={attr.step ?? 1}
              value={numStr}
              onChange={(e) =>
                update({ attributes: { ...filters.attributes, [attr.id]: e.target.value } })
              }
              className={cn(
                "rounded-2xl border-2 border-white/12 bg-white/8 px-4 py-3 text-white",
                "transition-all duration-300 backdrop-blur-lg",
                "hover:border-white/20 hover:bg-white/12",
                "focus:border-blue-400/40 focus:bg-white/12 focus:ring-2 focus:ring-blue-500/30"
              )}
              placeholder={attr.unit ? `в ${attr.unit}` : undefined}
              whileFocus={{ scale: 1.02 }}
            />
          </motion.label>
        );
      }

      case "range": {
        const defMin = attr.min as number;
        const defMax = attr.max as number;

        const raw = (typeof current === "string" && current.includes(","))
          ? current
          : `${defMin},${defMax}`;

        const [curMinRaw, curMaxRaw] = raw.split(",");
        const curMinNum = Number(curMinRaw);
        const curMaxNum = Number(curMaxRaw);

        const safeMin = clamp(Number.isFinite(curMinNum) ? curMinNum : defMin, defMin, defMax);
        const safeMax = clamp(Number.isFinite(curMaxNum) ? curMaxNum : defMax, defMin, defMax);

        const setPair = (lo: number, hi: number) =>
          update({ attributes: { ...filters.attributes, [attr.id]: `${lo},${hi}` } });

        return (
          <motion.div 
            key={attr.id} 
            layout
            className="flex flex-col gap-3"
          >
            <span className="text-sm font-medium text-white/80">
              {attr.label}
              <span className="ml-2 text-white/55 text-xs">
                ({safeMin}–{safeMax}
                {attr.unit ? ` ${attr.unit}` : ""})
              </span>
            </span>
            <div className="flex items-center gap-3">
              <motion.input
                type="number"
                min={defMin}
                max={safeMax}
                step={attr.step ?? 1}
                value={safeMin}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  const nextMin = clamp(Number.isFinite(v) ? v : defMin, defMin, defMax);
                  const nextMax = Math.max(nextMin, safeMax);
                  setPair(nextMin, nextMax);
                }}
                className={cn(
                  "flex-1 rounded-2xl border-2 border-white/12 bg-white/8 px-4 py-3 text-white",
                  "transition-all duration-300 backdrop-blur-lg",
                  "hover:border-white/20 hover:bg-white/12",
                  "focus:border-blue-400/40 focus:bg-white/12 focus:ring-2 focus:ring-blue-500/30"
                )}
                whileFocus={{ scale: 1.02 }}
              />
              <span className="text-white/40">—</span>
              <motion.input
                type="number"
                min={safeMin}
                max={defMax}
                step={attr.step ?? 1}
                value={safeMax}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  const nextMax = clamp(Number.isFinite(v) ? v : defMax, defMin, defMax);
                  const nextMin = Math.min(safeMin, nextMax);
                  setPair(nextMin, nextMax);
                }}
                className={cn(
                  "flex-1 rounded-2xl border-2 border-white/12 bg-white/8 px-4 py-3 text-white",
                  "transition-all duration-300 backdrop-blur-lg",
                  "hover:border-white/20 hover:bg-white/12",
                  "focus:border-blue-400/40 focus:bg-white/12 focus:ring-2 focus:ring-blue-500/30"
                )}
                whileFocus={{ scale: 1.02 }}
              />
            </div>
          </motion.div>
        );
      }

      case "text":
      default: {
        const val = typeof current === "string" ? current : "";
        return (
          <motion.label 
            key={attr.id} 
            layout
            className="flex flex-col gap-2 text-sm"
          >
            <span className="font-medium text-white/80">{attr.label}</span>
            <motion.input
              type="text"
              value={val}
              onChange={(e) => update({ attributes: { ...filters.attributes, [attr.id]: e.target.value } })}
              className={cn(
                "rounded-2xl border-2 border-white/12 bg-white/8 px-4 py-3 text-white",
                "transition-all duration-300 backdrop-blur-lg",
                "hover:border-white/20 hover:bg-white/12",
                "focus:border-blue-400/40 focus:bg-white/12 focus:ring-2 focus:ring-blue-500/30"
              )}
              placeholder={attr.placeholder}
              whileFocus={{ scale: 1.02 }}
            />
          </motion.label>
        );
      }
    }
  }

  const renderSection = (title: string, sectionKey: string, icon: React.ReactNode, content: React.ReactNode) => {
    const isExpanded = expandedSections.has(sectionKey);
    const contentId = `sec-${sectionKey}`;

    return (
      <motion.section 
        layout
        className="space-y-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.button
          layout
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => toggleSection(sectionKey)}
          className={cn(
            "flex w-full items-center justify-between text-left p-3 rounded-2xl",
            "transition-all duration-300 hover:bg-white/5"
          )}
          aria-expanded={isExpanded}
          aria-controls={contentId}
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-300",
              "bg-white/10 border border-white/12 text-white/70"
            )}>
              {icon}
            </div>
            <h4 className="text-sm font-semibold text-white/90">{title}</h4>
          </div>
          <motion.div
            className={cn(
              "flex h-6 w-6 items-center justify-center rounded-lg transition-all duration-300",
              "border border-white/12 bg-white/8 text-white/60",
              "hover:border-white/18 hover:bg-white/12 hover:text-white"
            )}
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="h-3 w-3" />
          </motion.div>
        </motion.button>

        <motion.div
          id={contentId}
          layout
          initial={false}
          animate={{ 
            height: isExpanded ? "auto" : 0,
            opacity: isExpanded ? 1 : 0
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="pb-2 pl-11">
            {content}
          </div>
        </motion.div>
      </motion.section>
    );
  };

  /* ========================= layout ========================= */

  const header = (
    <motion.div 
      className="flex items-center justify-between"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-3">
        <motion.div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-2xl",
            "bg-gradient-to-br from-blue-500/20 to-purple-500/20",
            "border border-blue-400/30 text-blue-300 backdrop-blur-lg shadow-2xl"
          )}
          whileHover={{ scale: 1.05, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Filter className="h-6 w-6" />
        </motion.div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-white/55">Фильтры</p>
          <h3 className="text-lg font-semibold text-white/95 flex items-center gap-2">
            Уточните поиск
            {activeCount > 0 && (
              <motion.span 
                className="rounded-full border border-white/12 bg-white/10 px-2.5 py-1 text-xs font-medium text-white/70"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                {activeCount}
              </motion.span>
            )}
          </h3>
          {productCount !== undefined && (
            <motion.p 
              className="text-sm text-white/60 mt-1" 
              aria-live="polite"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Найдено {productCount.toLocaleString('ru-RU')} товаров
            </motion.p>
          )}
        </div>
      </div>
      {mode !== "inline" && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={() => {
            onClose?.();
            setTimeout(() => openerRef.current?.focus(), 0);
          }}
          className={cn(
            TAPPABLE,
            "inline-flex h-10 w-10 items-center justify-center rounded-xl",
            "border border-white/12 bg-white/10 text-white/70",
            "hover:bg-white/16 hover:text-white hover:border-white/18",
            "focus:outline-none focus:ring-2 focus:ring-white/30"
          )}
          aria-label="Закрыть фильтры"
          title="Закрыть"
        >
          <X className="h-5 w-5" />
        </motion.button>
      )}
    </motion.div>
  );

  const chipsBar = chips.length > 0 ? (
    <motion.div 
      className="flex flex-wrap gap-2"
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {chips.map((c) => (
        <motion.button
          key={c.key}
          layout
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={c.onClear}
          className={cn(
            CHIP,
            "items-center gap-2 rounded-full border-white/16 bg-white/10 px-3 py-1.5 text-xs text-white/80",
            "hover:bg-white/16 hover:text-white transition-all duration-300",
            TAPPABLE
          )}
          aria-label={`Очистить: ${c.label}`}
          title={`Очистить фильтр: ${c.label}`}
        >
          {c.label}
          <X className="h-3 w-3" />
        </motion.button>
      ))}
    </motion.div>
  ) : null;

  const body = (
    <motion.div 
      className="space-y-6"
      layout
    >
      {chipsBar}

      {/* Категории */}
      {renderSection("Категории", "categories", <Grid3X3 className="h-4 w-4" />,
        renderCategoryTree(shopCategories, filters.categories, (id) => toggleArray("categories", id))
      )}

      {/* Бренды */}
      {renderSection("Бренды", "brands", <Tag className="h-4 w-4" />,
        <div className="flex flex-wrap gap-2">
          {brands.map((brand) => {
            const active = filters.brands.includes(brand);
            return (
              <motion.button
                key={brand}
                layout
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => toggleArray("brands", brand)}
                className={cn(
                  "rounded-xl border-2 px-3 py-2 text-sm font-medium transition-all duration-300",
                  TAPPABLE,
                  active
                    ? cn(
                        "border-blue-400/40 bg-blue-500/20 text-blue-200",
                        "shadow-lg shadow-blue-500/20 backdrop-blur-lg"
                      )
                    : cn(
                        "border-white/12 bg-white/8 text-white/70",
                        "hover:border-white/20 hover:bg-white/12 hover:text-white/90"
                      )
                )}
                aria-pressed={active}
              >
                {brand}
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Теги */}
      {tags.length > 0 && renderSection("Теги", "tags", <Tag className="h-4 w-4" />,
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => {
            const active = filters.tags.includes(tag);
            return (
              <motion.button
                key={tag}
                layout
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => toggleArray("tags", tag)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-300",
                  TAPPABLE,
                  active
                    ? "border-blue-400/40 bg-blue-500/20 text-blue-200"
                    : "border-white/12 bg-white/8 text-white/60 hover:bg-white/12 hover:text-white/80"
                )}
                aria-pressed={active}
              >
                {tag}
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Наличие */}
      {renderSection("Наличие", "stock", <Package className="h-4 w-4" />,
        <motion.label 
          className="inline-flex items-center gap-3 text-sm text-white cursor-pointer group"
          whileHover={{ scale: 1.02 }}
        >
          <motion.div
            className={cn(
              "flex h-5 w-5 items-center justify-center rounded-lg border-2 transition-all duration-300",
              filters.inStock
                ? "border-green-400 bg-green-500 shadow-inner shadow-green-400/30"
                : "border-white/20 bg-white/10 group-hover:border-white/30"
            )}
            animate={{ scale: filters.inStock ? 1.1 : 1 }}
          >
            {filters.inStock && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <Check className="h-3 w-3 text-white" />
              </motion.div>
            )}
          </motion.div>
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={(e) => update({ inStock: e.target.checked })}
            className="sr-only"
          />
          <span className={cn(
            "transition-colors duration-300",
            filters.inStock ? "text-white font-medium" : "text-white/70"
          )}>
            Только товары в наличии
          </span>
        </motion.label>
      )}

      {/* Цена */}
      {renderSection("Цена", "price", <DollarSign className="h-4 w-4" />,
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <label className="flex flex-1 flex-col gap-2 text-sm">
              <span className="font-medium text-white/80">от</span>
              <motion.input
                type="number"
                min={priceRange.min}
                max={filters.price.max}
                value={filters.price.min}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  const min = clamp(Number.isFinite(v) ? v : priceRange.min, priceRange.min, priceRange.max);
                  const max = Math.max(min, filters.price.max);
                  update({ price: { min, max } });
                }}
                className={cn(
                  "rounded-2xl border-2 border-white/12 bg-white/8 px-4 py-3 text-white",
                  "transition-all duration-300 backdrop-blur-lg",
                  "hover:border-white/20 hover:bg-white/12",
                  "focus:border-blue-400/40 focus:bg-white/12 focus:ring-2 focus:ring-blue-500/30"
                )}
                whileFocus={{ scale: 1.02 }}
              />
            </label>
            <label className="flex flex-1 flex-col gap-2 text-sm">
              <span className="font-medium text-white/80">до</span>
              <motion.input
                type="number"
                min={filters.price.min}
                max={priceRange.max}
                value={filters.price.max}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  const max = clamp(Number.isFinite(v) ? v : priceRange.max, priceRange.min, priceRange.max);
                  const min = Math.min(filters.price.min, max);
                  update({ price: { min, max } });
                }}
                className={cn(
                  "rounded-2xl border-2 border-white/12 bg-white/8 px-4 py-3 text-white",
                  "transition-all duration-300 backdrop-blur-lg",
                  "hover:border-white/20 hover:bg-white/12",
                  "focus:border-blue-400/40 focus:bg-white/12 focus:ring-2 focus:ring-blue-500/30"
                )}
                whileFocus={{ scale: 1.02 }}
              />
            </label>
          </div>
          <div className="flex justify-between text-xs text-white/60">
            <span>{priceRange.min.toLocaleString('ru-RU')} ₽</span>
            <span>{priceRange.max.toLocaleString('ru-RU')} ₽</span>
          </div>
        </div>
      )}

      {/* Характеристики */}
      {characteristics.map((group) => (
        <motion.section 
          key={group.categoryId} 
          className="space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h4 className="text-sm font-semibold text-white/90">Характеристики</h4>
          <div className="grid grid-cols-1 gap-4">
            {group.attributes.map((attribute) => renderAttributeControl(attribute))}
          </div>
        </motion.section>
      ))}
    </motion.div>
  );

  const footer = (
    <motion.div 
      className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="button"
        onClick={() => {
          setDraft(value);
          onReset();
        }}
        className={cn(
          BTN_GHOST,
          "rounded-xl border-white/14 bg-white/10 px-4 py-2.5 text-sm text-white/70",
          "hover:bg-white/16 hover:text-white transition-all duration-300",
          "flex items-center gap-2"
        )}
      >
        <RotateCcw className="h-4 w-4" />
        Сбросить всё
      </motion.button>
      {mode !== "inline" ? (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => {
            onChange(filters);
            onApply?.();
          onClose?.();
          setTimeout(() => openerRef.current?.focus(), 0);
        }}
        className={cn(
          BTN_PRIMARY,
          "flex items-center gap-2 rounded-2xl px-6 py-2.5 text-sm font-semibold transition-all duration-300",
          "shadow-[0_25px_60px_-35px_rgba(56,189,248,0.7)]"
        )}
      >
        <Sparkles className="h-4 w-4" />
        Применить фильтры
      </motion.button>
      ) : null}
    </motion.div>
  );

  const content = (
    <motion.div
      ref={panelRef}
      tabIndex={-1}
      className={cn(
        CARD,
        "flex w-full transition-all duration-500",
        mode === "sheet"
          ? "max-h-[90vh] max-w-md grid grid-rows-[auto_1fr_auto] overflow-hidden px-6 py-5 gap-6"
          : mode === "floating"
          ? "max-h-[80vh] max-w-2xl grid grid-rows-[auto_1fr_auto] overflow-hidden px-7 py-6 gap-6"
          : "rounded-3xl px-6 py-6",
        className
      )}
      role={mode !== "inline" ? "dialog" : undefined}
      aria-modal={mode !== "inline" ? true : undefined}
      aria-label="Фильтры товаров"
      onClick={(e) => e.stopPropagation()}
      initial={mode !== "inline" ? { 
        scale: 0.8, 
        opacity: 0,
        y: mode === "sheet" ? 100 : 0
      } : false}
      animate={mode !== "inline" ? { 
        scale: 1, 
        opacity: 1,
        y: 0
      } : false}
      exit={mode !== "inline" ? { 
        scale: 0.8, 
        opacity: 0,
        y: mode === "sheet" ? 100 : 0
      } : false}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {header}
      <div className={cn(
        mode !== "inline" ? "overflow-y-auto pr-2" : "",
        "min-w-0 scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-white/20 scrollbar-thumb-rounded-full"
      )}>
        {body}
      </div>
      <div className={cn(
        mode !== "inline" ? "sticky bottom-0 pt-4 bg-gradient-to-t from-white/10 to-transparent backdrop-blur-lg" : ""
      )}>
        {footer}
      </div>
    </motion.div>
  );

  if (mode === "inline") {
    return <div className={cn("hidden lg:block", className)}>{content}</div>;
  }

  if (!visible) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        className={overlayClasses}
        onClick={() => {
          onClose?.();
          setTimeout(() => openerRef.current?.focus(), 0);
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div onClick={(e) => e.stopPropagation()}>{content}</div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

/* focusables */
function getFocusable(root: HTMLElement | null): HTMLElement[] {
  if (!root) return [];
  const selectors = [
    "a[href]",
    "button:not([disabled])",
    "textarea:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
  ];
  return Array.from(root.querySelectorAll<HTMLElement>(selectors.join(","))).filter(
    (el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden")
  );
}
