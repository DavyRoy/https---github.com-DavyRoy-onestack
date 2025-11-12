"use client";

import Link from "next/link";
import React, { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  MoreHorizontal,
  Star,
  Heart,
  Eye,
  Compare,
  ChevronDown,
  Filter,
  Sparkles,
  Zap,
  Package,
  TrendingUp,
  ArrowUpDown,
} from "lucide-react";
import {
  cn,
  CARD,
  BTN_PRIMARY,
  TAPPABLE,
  CHIP,
  PRODUCT_PRICE,
  PRODUCT_OLD_PRICE,
  PRODUCT_DISCOUNT,
} from "./_shared";
import type { ProductRow } from "../data/mockProducts";

export type ProductsListProps = {
  products: ProductRow[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleAll: (checked: boolean) => void;
  onAddToCart: (product: ProductRow) => void;
  onAddToFavorites?: (product: ProductRow) => void;
  onQuickView?: (product: ProductRow) => void;
  onCompare?: (product: ProductRow) => void;
  favorites?: string[];
  compareList?: string[];
  variant?: "default" | "compact" | "detailed";
  sortable?: boolean;
  onSort?: (field: SortField, direction: SortDirection) => void;
  className?: string;
  loading?: boolean;
};

type SortField = "title" | "price" | "rating" | "stock" | "reviews";
type SortDirection = "asc" | "desc";

export default function ProductsList({
  products,
  selectedIds,
  onToggleSelect,
  onToggleAll,
  onAddToCart,
  onAddToFavorites,
  onQuickView,
  onCompare,
  favorites = [],
  compareList = [],
  variant = "default",
  sortable = false,
  onSort,
  className,
  loading = false,
}: ProductsListProps) {
  const [activeSort, setActiveSort] = useState<{ field: SortField; direction: SortDirection }>({
    field: "title",
    direction: "asc",
  });
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [isAnimating, setIsAnimating] = useState(false);

  const allSelected = useMemo(
    () => selectedIds.length > 0 && selectedIds.length === products.length,
    [products.length, selectedIds]
  );

  const handleSort = useCallback(
    async (field: SortField) => {
      if (isAnimating) return;
      
      setIsAnimating(true);
      const direction =
        activeSort.field === field && activeSort.direction === "asc" ? "desc" : "asc";
      setActiveSort({ field, direction });
      onSort?.(field, direction);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      setIsAnimating(false);
    },
    [activeSort, onSort, isAnimating]
  );

  const toggleRowExpansion = useCallback((productId: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  }, []);

  const renderThumb = (product: ProductRow) => {
    if (typeof product.thumbnail === "string" && product.thumbnail) {
      return (
        <div className="relative h-full w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.thumbnail}
            alt={product.title}
            width={variant === "compact" ? 48 : 64}
            height={variant === "compact" ? 48 : 64}
            className={cn(
              "h-full w-full object-cover transition-all duration-500 group-hover:scale-110",
              variant === "compact" ? "rounded-lg" : "rounded-xl"
            )}
            loading="lazy"
          />
          {/* Градиентный оверлей */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      );
    }

    const fallbackIcon =
      typeof (product as { icon?: unknown }).icon === "string"
        ? (product as { icon?: string }).icon
        : null;

    if (fallbackIcon) {
      return (
        <motion.div
          className={cn(
            "text-white/60 transition-all duration-300 group-hover:text-white/80 group-hover:scale-110",
            variant === "compact" ? "text-2xl" : "text-3xl"
          )}
          whileHover={{ scale: 1.1 }}
        >
          {fallbackIcon}
        </motion.div>
      );
    }

    return (
      <div className="text-white/40 transition-colors duration-300 group-hover:text-white/60">
        <Sparkles className={variant === "compact" ? "h-6 w-6" : "h-8 w-8"} />
      </div>
    );
  };

  const renderRating = (rating: number, reviewsCount: number) => {
    return (
      <motion.div 
        className="flex items-center gap-2"
        whileHover={{ scale: 1.05 }}
      >
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.div
              key={star}
              whileHover={{ scale: 1.2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <Star
                className={cn(
                  "h-3 w-3 transition-all duration-300",
                  star <= rating 
                    ? "fill-yellow-400 text-yellow-400 drop-shadow-lg" 
                    : "fill-white/20 text-white/20"
                )}
              />
            </motion.div>
          ))}
        </div>
        <span className="text-xs font-medium text-white/80">{rating.toFixed(1)}</span>
        <span className="text-xs text-white/50">({reviewsCount})</span>
      </motion.div>
    );
  };

  const renderStockBadge = (stock: number) => {
    if (stock === 0) {
      return (
        <motion.div 
          className={cn(CHIP, "bg-red-500/20 border-2 border-red-400/30 text-red-300 text-xs")}
          whileHover={{ scale: 1.05 }}
        >
          <Zap className="h-3 w-3 mr-1" />
          Нет в наличии
        </motion.div>
      );
    }
    if (stock < 10) {
      return (
        <motion.div 
          className={cn(CHIP, "bg-orange-500/20 border-2 border-orange-400/30 text-orange-300 text-xs")}
          whileHover={{ scale: 1.05 }}
        >
          <Package className="h-3 w-3 mr-1" />
          Мало ({stock})
        </motion.div>
      );
    }
    return (
      <motion.div 
        className={cn(CHIP, "bg-green-500/20 border-2 border-green-400/30 text-green-300 text-xs")}
        whileHover={{ scale: 1.05 }}
      >
        <Package className="h-3 w-3 mr-1" />
        В наличии ({stock})
      </motion.div>
    );
  };

  const isCompact = variant === "compact";
  const isDetailed = variant === "detailed";

  return (
    <motion.div 
      className={cn(CARD, "relative overflow-hidden p-0", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-60">
        <div className="absolute -top-24 -left-16 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.2),transparent_65%)] blur-[110px]" />
        <div className="absolute -bottom-24 -right-20 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.18),transparent_60%)] blur-[110px]" />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10 text-sm">
          <thead className="bg-white/10 text-white/60 backdrop-blur-xl">
            <tr>
              <th scope="col" className="w-12 px-4 py-4 text-left">
                <motion.input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => onToggleAll(e.target.checked)}
                  className={cn(
                    "rounded border-2 border-white/30 bg-white/8 text-blue-400 transition-all duration-300",
                    "focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-black/60",
                    "hover:border-white/40 hover:bg-white/12",
                    isCompact ? "h-3.5 w-3.5" : "h-4 w-4"
                  )}
                  aria-label="Выбрать все товары"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                />
              </th>

              <SortHeader
                field="title"
                activeSort={activeSort}
                onSort={handleSort}
                sortable={sortable}
                className={isCompact ? "min-w-[200px]" : "min-w-[300px]"}
              >
                Товар
              </SortHeader>

              <SortHeader
                field="stock"
                activeSort={activeSort}
                onSort={handleSort}
                sortable={sortable}
                className="w-32"
              >
                Наличие
              </SortHeader>

              <SortHeader
                field="price"
                activeSort={activeSort}
                onSort={handleSort}
                sortable={sortable}
                className="w-24"
              >
                Цена
              </SortHeader>

              {isDetailed && (
                <SortHeader
                  field="rating"
                  activeSort={activeSort}
                  onSort={handleSort}
                  sortable={sortable}
                  className="w-28"
                >
                  Рейтинг
                </SortHeader>
              )}

              <th scope="col" className="px-4 py-4 text-right w-32">
                Действия
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/8 bg-white/[0.04]">
            <AnimatePresence mode="popLayout">
              {products.map((product, index) => {
                const selected = selectedIds.includes(product.id);
                const isExpanded = expandedRows.has(product.id);

                return (
                  <React.Fragment key={product.id}>
                    <motion.tr
                      className={cn(
                        "align-top transition-all duration-500 group",
                        selected && "bg-blue-500/10 backdrop-blur-lg",
                        "hover:bg-white/10"
                      )}
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.98 }}
                      transition={{ duration: 0.3, delay: index * 0.02 }}
                      layout
                    >
                      <td className="px-4 py-4">
                        <motion.input
                          type="checkbox"
                          checked={selected}
                          onChange={() => onToggleSelect(product.id)}
                          className={cn(
                            "rounded border-2 border-white/30 bg-white/8 text-blue-400 transition-all duration-300",
                            "focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-black/60",
                            "hover:border-white/40 hover:bg-white/12",
                            isCompact ? "h-3.5 w-3.5" : "h-4 w-4"
                          )}
                          aria-label={`Выбрать ${product.title}`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        />
                      </td>

                      <td className="px-4 py-4">
                        <div className={cn("flex items-start gap-3", isCompact && "gap-2")}>
                          <motion.div
                            className={cn(
                              "relative grid place-items-center overflow-hidden border-2 border-white/12 bg-white/8 group-hover:bg-white/10 transition-all duration-500",
                              isCompact ? "h-12 w-12 rounded-xl" : "h-16 w-16 rounded-2xl"
                            )}
                            whileHover={{ scale: 1.05, rotate: 1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          >
                            {renderThumb(product)}

                            {/* Бейдж скидки */}
                            {product.oldPrice && product.oldPrice > product.price && (
                              <motion.div 
                                className={cn(
                                  PRODUCT_DISCOUNT, 
                                  "absolute -left-1 -top-1 px-2 py-1 rounded-full text-xs font-bold shadow-lg",
                                  "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                                )}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                              >
                                -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                              </motion.div>
                            )}
                          </motion.div>

                          <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                            <Link
                              href={`/demo/user/shop/${product.slug}`}
                              className={cn(
                                "font-semibold text-white/95 transition-all duration-300 hover:text-white",
                                "hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:rounded-lg",
                                isCompact ? "text-sm line-clamp-2" : "text-base"
                              )}
                              title={product.title}
                            >
                              {product.title}
                            </Link>

                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-xs text-white/60 font-mono">SKU: {product.sku}</p>
                              <p className="text-xs text-white/50">•</p>
                              <p className="text-xs text-white/60">{product.brand}</p>
                            </div>

                            {!isCompact && renderRating(product.rating, product.reviewsCount)}

                            {isDetailed && product.description && (
                              <motion.button
                                onClick={() => toggleRowExpansion(product.id)}
                                className="flex items-center gap-1 text-left text-xs text-blue-400 transition-colors duration-300 hover:text-blue-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/40 focus-visible:rounded-lg"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {isExpanded ? "Скрыть описание" : "Показать описание"}
                                <motion.div
                                  animate={{ rotate: isExpanded ? 180 : 0 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <ChevronDown className="h-3 w-3" />
                                </motion.div>
                              </motion.button>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">{renderStockBadge(product.stock)}</td>

                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1">
                          <span className={cn(PRODUCT_PRICE, isCompact ? "text-base" : "text-lg font-semibold")}>
                            {product.price.toLocaleString("ru-RU")} ₽
                          </span>
                          {product.oldPrice && product.oldPrice > product.price && (
                            <span className={cn(PRODUCT_OLD_PRICE, isCompact ? "text-xs" : "text-sm")}>
                              {product.oldPrice.toLocaleString("ru-RU")} ₽
                            </span>
                          )}
                        </div>
                      </td>

                      {isDetailed && <td className="px-4 py-4">{renderRating(product.rating, product.reviewsCount)}</td>}

                      <td className="px-4 py-4">
                        <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center sm:justify-end">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={() => onAddToCart(product)}
                            disabled={product.stock === 0}
                            className={cn(
                              BTN_PRIMARY,
                              "rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-300",
                              isCompact && "px-2 py-1.5",
                              product.stock === 0 && "opacity-50 pointer-events-none grayscale"
                            )}
                          >
                            <ShoppingCart className={cn("h-3.5 w-3.5", !isCompact && "mr-1")} />
                            {!isCompact && (product.stock === 0 ? "Нет в наличии" : "В корзину")}
                          </motion.button>

                          <ActionMenu
                            product={product}
                            favorites={favorites}
                            compareList={compareList}
                            onQuickView={onQuickView}
                            onAddToFavorites={onAddToFavorites}
                            onCompare={onCompare}
                          />
                        </div>
                      </td>
                    </motion.tr>

                    {/* Расширенная строка с описанием */}
                    {isDetailed && isExpanded && product.description && (
                      <motion.tr 
                        className="bg-white/5 backdrop-blur-lg transition-all duration-500"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                      >
                        <td colSpan={isDetailed ? 6 : 5} className="px-4 py-4">
                          <motion.div 
                            className="pl-19"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <div className={cn(CARD_SOFT, "border-white/15 bg-white/8 p-4")}>
                              <h4 className="text-sm font-semibold text-white/95 mb-3 flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-blue-400" />
                                Описание
                              </h4>
                              <p className="text-sm text-white/70 leading-relaxed">{product.description}</p>

                              {product.attributes && Object.keys(product.attributes).length > 0 && (
                                <motion.div 
                                  className="mt-4 pt-4 border-t border-white/10"
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.3 }}
                                >
                                  <h5 className="text-xs font-medium text-white/80 mb-3">Характеристики</h5>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                    {Object.entries(product.attributes).map(([key, value]) => (
                                      <motion.div 
                                        key={key} 
                                        className="flex justify-between items-center py-1.5 px-3 rounded-xl bg-white/5"
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ duration: 0.2 }}
                                      >
                                        <span className="text-white/60">{key}:</span>
                                        <span className="text-white/80 font-medium">{String(value)}</span>
                                      </motion.div>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          </motion.div>
                        </td>
                      </motion.tr>
                    )}
                  </React.Fragment>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {products.length === 0 && (
        <motion.div 
          className="flex flex-col items-center justify-center py-20 px-4 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="h-20 w-20 rounded-2xl bg-white/10 flex items-center justify-center mb-6"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Filter className="h-10 w-10 text-white/40" />
          </motion.div>
          <h3 className="text-xl font-semibold text-white/95 mb-3">Товары не найдены</h3>
          <p className="text-white/60 text-sm max-w-md leading-relaxed">
            Попробуйте изменить параметры поиска или фильтры, чтобы увидеть больше товаров
          </p>
        </motion.div>
      )}

      {/* Индикатор загрузки */}
      {loading && (
        <motion.div
          className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center rounded-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="h-2 w-48 bg-white/20 rounded-full overflow-hidden"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
              animate={{
                x: [-100, 100],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}

/* ---------- Вспомогательные компоненты ---------- */

function SortHeader({
  field,
  children,
  className,
  sortable,
  activeSort,
  onSort,
}: {
  field: SortField;
  children: React.ReactNode;
  className?: string;
  sortable: boolean;
  activeSort: { field: SortField; direction: SortDirection };
  onSort: (field: SortField) => void;
}) {
  const isActive = activeSort.field === field;
  const ariaSort: React.AriaAttributes["aria-sort"] = !isActive
    ? "none"
    : activeSort.direction === "asc"
    ? "ascending"
    : "descending";

  const getSortIcon = (field: SortField) => {
    switch (field) {
      case "price": return TrendingUp;
      case "rating": return Star;
      case "stock": return Package;
      case "reviews": return TrendingUp;
      default: return ArrowUpDown;
    }
  };

  const SortIcon = getSortIcon(field);

  return (
    <th className={cn("px-4 py-4 text-left", className)} aria-sort={ariaSort} scope="col">
      {sortable ? (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => onSort(field)}
          className={cn(
            "flex items-center gap-2 text-sm font-medium transition-all duration-300",
            "hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded-xl px-3 py-2 -mx-2",
            isActive ? "text-white bg-white/10" : "text-white/60 hover:bg-white/5"
          )}
          aria-label={`Сортировать по: ${typeof children === "string" ? children : ""}`}
        >
          <SortIcon className="h-3.5 w-3.5" />
          {children}
          <motion.div
            animate={{ rotate: isActive && activeSort.direction === "desc" ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="h-3 w-3" />
          </motion.div>
        </motion.button>
      ) : (
        <span className={cn("text-sm font-medium flex items-center gap-2", isActive ? "text-white" : "text-white/60")}>
          <SortIcon className="h-3.5 w-3.5" />
          {children}
        </span>
      )}
    </th>
  );
}

function ActionMenu({
  product,
  favorites,
  compareList,
  onQuickView,
  onAddToFavorites,
  onCompare,
}: {
  product: ProductRow;
  favorites: string[];
  compareList: string[];
  onQuickView?: (p: ProductRow) => void;
  onAddToFavorites?: (p: ProductRow) => void;
  onCompare?: (p: ProductRow) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const isFavorite = favorites.includes(product.id);
  const inCompare = compareList.includes(product.id);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const btnId = `menu-btn-${product.id}`;
  const menuId = `menu-${product.id}`;

  // закрытие по клику снаружи/ESC
  useEffect(() => {
    if (!isOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <motion.button
        id={btnId}
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className={cn(
          BTN_GHOST,
          "inline-flex h-9 w-9 items-center justify-center rounded-xl border-white/15 bg-white/10 text-white/70 transition-all duration-300",
          "hover:border-white/22 hover:bg-white/14 hover:text-white"
        )}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
        title="Другие действия"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <MoreHorizontal className="h-4 w-4" aria-hidden />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={menuId}
            role="menu"
            aria-labelledby={btnId}
            className="absolute right-0 top-full z-10 mt-2 w-48 overflow-hidden rounded-2xl border border-white/15 bg-black/70 backdrop-blur-xl shadow-[0_35px_70px_-45px_rgba(56,189,248,0.6)]"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="p-2 space-y-1">
              {onQuickView && (
                <motion.button
                  role="menuitem"
                  onClick={() => {
                    onQuickView(product);
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/70 transition-all duration-300 hover:bg-white/10 hover:text-white"
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Eye className="h-4 w-4" />
                  Быстрый просмотр
                </motion.button>
              )}

              {onAddToFavorites && (
                <motion.button
                  role="menuitem"
                  onClick={() => {
                    onAddToFavorites(product);
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/70 transition-all duration-300 hover:bg-white/10 hover:text-white"
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Heart className={cn("h-4 w-4 transition-all duration-300", isFavorite && "fill-red-400 text-red-400")} />
                  {isFavorite ? "В избранном" : "В избранное"}
                </motion.button>
              )}

              {onCompare && (
                <motion.button
                  role="menuitem"
                  onClick={() => {
                    onCompare(product);
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/70 transition-all duration-300 hover:bg-white/10 hover:text-white"
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Compare className={cn("h-4 w-4 transition-all duration-300", inCompare && "text-blue-400")} />
                  {inCompare ? "В сравнении" : "Сравнить"}
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
