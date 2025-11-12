"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Minus,
  Check,
  AlertCircle,
  Star,
  ShoppingCart,
  EyeOff,
  Eye,
  Sparkles,
  Scale,
  Trash2,
  Download,
  Share2,
  Filter
} from "lucide-react";
import type { ProductRow } from "../data/mockProducts";
import {
  cn,
  TAPPABLE,
  CHIP,
  CHIP_SOLID,
  BTN_PRIMARY,
  BTN_SECONDARY,
  BTN_GHOST,
  FOCUS_RING,
  CARD,
  PRODUCT_DISCOUNT
} from "./_shared";

/* ---------------------- Types ---------------------- */
export type CompareDrawerProps = {
  open: boolean;
  products: ProductRow[];
  onClose: () => void;
  onAddToCart?: (product: ProductRow) => void;
  onRemoveFromCompare?: (productId: string) => void;
  onQuickView?: (product: ProductRow) => void;
  /** Лимит колонок */
  maxProducts?: number;
  /** Показывать кнопку экспорта */
  showExport?: boolean;
  /** Показывать кнопку поделиться */
  showShare?: boolean;
};

/* ---------------------- Component ---------------------- */
export default function CompareDrawer({
  open,
  products,
  onClose,
  onAddToCart,
  onRemoveFromCompare,
  onQuickView,
  maxProducts = 4,
  showExport = true,
  showShare = true,
}: CompareDrawerProps) {
  const [mounted, setMounted] = useState(false);
  const [diffOnly, setDiffOnly] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState<Set<string>>(new Set());
  const [activeView, setActiveView] = useState<"all" | "differences">("all");
  
  const panelRef = useRef<HTMLDivElement | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => setMounted(true), []);

  // reduced-motion
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  // body lock + esc + focus trap + return focus to trigger
  useEffect(() => {
    if (!open) return;
    openerRef.current = (document.activeElement as HTMLElement) ?? null;

    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if ((e.key === "d" || e.key === "D") && !e.metaKey && !e.ctrlKey && !e.altKey) {
        setDiffOnly((v) => !v);
      }
      if (e.key === "Tab") trapFocus(e);
    };

    document.addEventListener("keydown", onKey);
    setTimeout(() => panelRef.current?.focus(), 40);

    return () => {
      document.documentElement.style.overflow = prevOverflow || "";
      document.removeEventListener("keydown", onKey);
      openerRef.current?.focus?.();
    };
  }, [open, onClose]);

  const trapFocus = (e: KeyboardEvent) => {
    const root = panelRef.current;
    if (!root) return;
    const focusable = getFocusable(root);
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    } else if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    }
  };

  const onBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  // тени по краям при скролле
  const [shadowTop, setShadowTop] = useState(false);
  const [shadowBottom, setShadowBottom] = useState(false);
  const [shadowLeft, setShadowLeft] = useState(false);
  const [shadowRight, setShadowRight] = useState(false);

  const updateShadows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setShadowTop(el.scrollTop > 0);
    setShadowBottom(el.scrollTop + el.clientHeight < el.scrollHeight - 1);
    setShadowLeft(el.scrollLeft > 0);
    setShadowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!open || !el) return;
    updateShadows();
    el.addEventListener("scroll", updateShadows, { passive: true });
    const ro = new ResizeObserver(updateShadows);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateShadows);
      ro.disconnect();
    };
  }, [open, updateShadows]);

  // атрибуты и фильтрация
  const attributesAll = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) =>
      Object.keys(p.attributes ?? {}).forEach((k) => set.add(k))
    );
    return Array.from(set);
  }, [products]);

  const sameValueByAttr = useMemo(() => {
    const map: Record<string, boolean> = {};
    attributesAll.forEach((attr) => {
      const values = products.map((p) => String(p.attributes?.[attr] ?? "—"));
      map[attr] = values.every((v) => v === values[0]);
    });
    return map;
  }, [attributesAll, products]);

  const attributes = useMemo(() => {
    if (activeView === "differences") {
      return attributesAll.filter((a) => !sameValueByAttr[a]);
    }
    return attributesAll;
  }, [attributesAll, sameValueByAttr, activeView]);

  const filteredAttributes = useMemo(() => {
    if (selectedAttributes.size === 0) return attributes;
    return attributes.filter(attr => selectedAttributes.has(attr));
  }, [attributes, selectedAttributes]);

  // превью товара
  const renderPreview = (p: ProductRow) => {
    if (typeof p.thumbnail === "string" && p.thumbnail) {
      return (
        <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-white/12 bg-white/5 backdrop-blur-sm group-hover:bg-white/8 transition-all duration-300">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.thumbnail}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      );
    }
    if (typeof p.icon === "string" && p.icon) {
      return (
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/12 bg-white/10 text-3xl text-white/70 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/15">
          {p.icon}
        </div>
      );
    }
    return (
      <div className="h-20 w-20 rounded-2xl border border-white/12 bg-white/8 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/12" />
    );
  };

  // рейтинг
  const renderRating = (rating: number) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "h-3.5 w-3.5 transition-colors",
            star <= rating ? "fill-yellow-400 text-yellow-400" : "fill-white/20 text-white/20"
          )}
        />
      ))}
      <span className="text-sm font-medium text-white/80 ml-1">{rating.toFixed(1)}</span>
    </div>
  );

  // бейдж наличия
  const renderStockBadge = (stock: number) => {
    if (stock === 0) {
      return (
        <div className={cn(CHIP, "bg-red-500/20 border-red-400/30 text-red-300")}>
          <Minus className="h-3.5 w-3.5" />
          Нет в наличии
        </div>
      );
    }
    if (stock < 10) {
      return (
        <div className={cn(CHIP, "bg-orange-500/20 border-orange-400/30 text-orange-300")}>
          <AlertCircle className="h-3.5 w-3.5" />
          Мало ({stock})
        </div>
      );
    }
    return (
      <div className={cn(CHIP, "bg-green-500/20 border-green-400/30 text-green-300")}>
        <Check className="h-3.5 w-3.5" />
        В наличии
      </div>
    );
  };

  // Обработчики действий
  const handleExport = useCallback(() => {
    // Логика экспорта сравнения
    console.log("Export comparison data", products);
  }, [products]);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: 'Сравнение товаров',
        text: `Сравниваю ${products.length} товаров`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  }, [products]);

  const toggleAttribute = useCallback((attribute: string) => {
    setSelectedAttributes(prev => {
      const next = new Set(prev);
      if (next.has(attribute)) {
        next.delete(attribute);
      } else {
        next.add(attribute);
      }
      return next;
    });
  }, []);

  if (!mounted || !open) return null;

  // пустое состояние
  if (products.length < 2) {
    return createPortal(
      <div
        className={cn(
          "fixed inset-0 z-[1300] flex items-center justify-center p-4",
          "bg-black/70 backdrop-blur-2xl transition-opacity duration-500"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Сравнение товаров"
        onMouseDown={onBackdropClick}
      >
        <div
          ref={panelRef}
          tabIndex={-1}
          className={cn(
            CARD,
            "relative w-full max-w-md rounded-3xl p-8 outline-none border border-white/15 shadow-2xl"
          )}
          onMouseDown={(e) => e.stopPropagation()}
          style={{
            transform: reducedMotion ? undefined : "scale(0.95) translateY(8px)",
            animation: reducedMotion ? undefined : "cmp-scale-in 300ms ease-out forwards",
          }}
        >
          <Header onClose={onClose} />

          <div className="text-center py-8">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-xl mb-6 border border-white/10">
              <Scale className="h-10 w-10 text-white/60" />
            </div>
            <h2 className="text-2xl font-bold text-white/95 mb-3">
              Сравнение товаров
            </h2>
            <p className="text-white/60 text-base leading-relaxed mb-6">
              Выберите минимум два товара для сравнения характеристик и выбора лучшего варианта.
            </p>
          </div>

          <div className="flex gap-3">
            <button onClick={onClose} className={cn(BTN_PRIMARY, "flex-1")}>
              Понятно
            </button>
          </div>
        </div>

        <style jsx>{`
          @keyframes cmp-scale-in {
            to {
              transform: scale(1) translateY(0);
              opacity: 1;
            }
          }
        `}</style>
      </div>,
      document.body
    );
  }

  const hasMaxProducts = products.length > maxProducts;

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-[1300] flex items-end justify-center p-4 sm:items-center",
        "bg-black/70 backdrop-blur-2xl transition-all duration-500"
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby="compare-title"
      aria-describedby="compare-desc"
      onMouseDown={onBackdropClick}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        className={cn(
          CARD,
          "relative w-full max-w-[1600px] h-[95vh] sm:h-[90vh] rounded-3xl outline-none",
          "border border-white/15 shadow-2xl overflow-hidden backdrop-blur-2xl"
        )}
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          transform: reducedMotion ? undefined : "translateY(4%) scale(0.98)",
          animation: reducedMotion ? undefined : "cmp-slide-in 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
        }}
      >
        <Header
          onClose={onClose}
          productCount={products.length}
          maxProducts={maxProducts}
          onExport={showExport ? handleExport : undefined}
          onShare={showShare ? handleShare : undefined}
        />

        {/* шапка */}
        <div
          className={cn(
            "sticky top-0 z-20 border-b border-white/10 px-8 pb-6 pt-8 backdrop-blur-2xl",
            "bg-gradient-to-b from-[#070c1a] to-[#070c1a]/95",
            shadowTop && "shadow-[0_8px_32px_-8px_rgba(0,0,0,0.4)]"
          )}
        >
          <div className="flex items-start justify-between gap-6 mb-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-white/10">
                  <Scale className="h-6 w-6 text-white/80" />
                </div>
                <div>
                  <h2 id="compare-title" className="text-3xl font-bold text-white/95">
                    Сравнение товаров
                  </h2>
                  <p id="compare-desc" className="text-white/60 text-base mt-2">
                    Сравниваем {products.length}{" "}
                    {plural(products.length, ["товар", "товара", "товаров"])} •{" "}
                    {attributesAll.length} характеристик
                    {activeView === "differences" && attributesAll.length !== attributes.length
                      ? ` • показаны различия (${attributes.length})`
                      : ""}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Переключение режима просмотра */}
              <div className="flex rounded-2xl bg-white/10 p-1 backdrop-blur-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveView("all")}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                    activeView === "all"
                      ? "bg-white/20 text-white shadow-sm"
                      : "text-white/70 hover:text-white/90"
                  )}
                >
                  Все
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView("differences")}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                    activeView === "differences"
                      ? "bg-white/20 text-white shadow-sm"
                      : "text-white/70 hover:text-white/90"
                  )}
                >
                  Различия
                </button>
              </div>

              {hasMaxProducts && (
                <div
                  className={cn(
                    CHIP_SOLID,
                    "bg-orange-500/20 border-orange-400/30 text-orange-300"
                  )}
                >
                  <AlertCircle className="h-4 w-4" />
                  Макс. {maxProducts}
                </div>
              )}
            </div>
          </div>

          {/* Фильтр атрибутов */}
          {attributes.length > 8 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-white/60 font-medium flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Фильтр характеристик:
              </span>
              {attributes.slice(0, 8).map(attr => (
                <button
                  key={attr}
                  onClick={() => toggleAttribute(attr)}
                  className={cn(
                    CHIP,
                    selectedAttributes.has(attr)
                      ? "bg-white/20 border-white/25 text-white"
                      : "bg-white/10 border-white/15 text-white/80 hover:bg-white/15"
                  )}
                >
                  {attr}
                </button>
              ))}
              {attributes.length > 8 && (
                <span className="text-sm text-white/40">
                  +{attributes.length - 8}
                </span>
              )}
            </div>
          )}
        </div>

        {/* контент */}
        <div
          ref={scrollRef}
          className={cn(
            "flex-1 overflow-auto scroll-smooth",
            shadowBottom && "shadow-[inset_0_-16px_32px_-16px_rgba(0,0,0,0.5)]",
            shadowLeft && "shadow-[inset_16px_0_32px_-16px_rgba(0,0,0,0.4)]",
            shadowRight && "shadow-[inset_-16px_0_32px_-16px_rgba(0,0,0,0.4)]"
          )}
        >
          <div className="min-w-max pb-12">
            {/* Названия и основные данные */}
            <CompareRow label="Товар" sticky>
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onRemove={onRemoveFromCompare}
                  onAddToCart={onAddToCart}
                  onQuickView={onQuickView}
                  renderPreview={renderPreview}
                  renderRating={renderRating}
                  renderStockBadge={renderStockBadge}
                />
              ))}
            </CompareRow>

            {/* Основные характеристики */}
            <CompareRow label="Основное">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="border-b border-white/10 px-6 py-4 space-y-3"
                >
                  <div>
                    <div className="text-xs text-white/60 mb-1">Артикул</div>
                    <code className="text-white/80 font-mono bg-white/10 px-3 py-1.5 rounded-xl text-sm">
                      {p.sku}
                    </code>
                  </div>
                  <div>
                    <div className="text-xs text-white/60 mb-1">Категория</div>
                    <div className="text-white/90 text-sm font-medium">{p.category}</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/60 mb-1">Бренд</div>
                    <div className="text-white/90 text-sm font-medium">{p.brand}</div>
                  </div>
                </div>
              ))}
            </CompareRow>

            {/* Атрибуты */}
            {filteredAttributes.map((attr) => {
              const same = sameValueByAttr[attr];
              return (
                <CompareRow key={attr} label={attr}>
                  {products.map((p) => {
                    const v = p.attributes?.[attr] ?? "—";
                    return (
                      <AttributeCell
                        key={`${attr}-${p.id}`}
                        value={String(v)}
                        isDifferent={!same}
                      />
                    );
                  })}
                </CompareRow>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes cmp-slide-in {
          0% {
            transform: translateY(4%) scale(0.98);
            opacity: 0;
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>,
    document.body
  );
}

/* ---------------------- Subcomponents ---------------------- */

function Header({
  onClose,
  productCount,
  maxProducts,
  onExport,
  onShare,
}: {
  onClose: () => void;
  productCount?: number;
  maxProducts?: number;
  onExport?: () => void;
  onShare?: () => void;
}) {
  return (
    <div className="absolute right-6 top-6 z-30 flex items-center gap-3">
      {/* Действия */}
      <div className="flex items-center gap-2">
        {onShare && (
          <button
            onClick={onShare}
            className={cn(
              TAPPABLE,
              "inline-flex h-10 w-10 items-center justify-center rounded-xl",
              "border border-white/12 bg-white/10 backdrop-blur-xl",
              "text-white/80 transition-all duration-300",
              "hover:bg-white/16 hover:text-white hover:border-white/20"
            )}
            title="Поделиться сравнением"
          >
            <Share2 className="h-4 w-4" />
          </button>
        )}
        {onExport && (
          <button
            onClick={onExport}
            className={cn(
              TAPPABLE,
              "inline-flex h-10 w-10 items-center justify-center rounded-xl",
              "border border-white/12 bg-white/10 backdrop-blur-xl",
              "text-white/80 transition-all duration-300",
              "hover:bg-white/16 hover:text-white hover:border-white/20"
            )}
            title="Экспортировать сравнение"
          >
            <Download className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Счетчик */}
      {typeof productCount === "number" && typeof maxProducts === "number" && (
        <div className={cn(CHIP_SOLID, "bg-white/10 border-white/15 text-white/80")}>
          <Sparkles className="h-3.5 w-3.5" />
          {productCount}/{maxProducts}
        </div>
      )}

      {/* Кнопка закрытия */}
      <button
        onClick={onClose}
        aria-label="Закрыть сравнение"
        className={cn(
          TAPPABLE,
          "inline-flex h-10 w-10 items-center justify-center rounded-xl",
          "border border-white/12 bg-white/10 backdrop-blur-xl",
          "text-white/80 transition-all duration-300",
          "hover:bg-red-500/80 hover:text-white hover:border-red-400/50",
          FOCUS_RING
        )}
      >
        <X className="h-5 w-5" aria-hidden />
      </button>
    </div>
  );
}

function ProductCard({
  product,
  onRemove,
  onAddToCart,
  onQuickView,
  renderPreview,
  renderRating,
  renderStockBadge,
}: {
  product: ProductRow;
  onRemove?: (productId: string) => void;
  onAddToCart?: (product: ProductRow) => void;
  onQuickView?: (product: ProductRow) => void;
  renderPreview: (p: ProductRow) => React.ReactNode;
  renderRating: (rating: number) => React.ReactNode;
  renderStockBadge: (stock: number) => React.ReactNode;
}) {
  return (
    <div className="group relative border-b border-white/10 px-6 py-6 hover:bg-white/5 transition-all duration-500">
      {/* Действия с товаром */}
      <div className="absolute right-4 top-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {onRemove && (
          <button
            type="button"
            onClick={() => onRemove?.(product.id)}
            className={cn(
              TAPPABLE,
              "inline-flex h-8 w-8 items-center justify-center rounded-lg",
              "border border-white/12 bg-white/10 text-white/70",
              "hover:bg-red-500/80 hover:text-white hover:border-red-400/50"
            )}
            title="Убрать из сравнения"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
        {onQuickView && (
          <button
            type="button"
            onClick={() => onQuickView?.(product)}
            className={cn(
              TAPPABLE,
              "inline-flex h-8 w-8 items-center justify-center rounded-lg",
              "border border-white/12 bg-white/10 text-white/70",
              "hover:bg-white/16 hover:text-white hover:border-white/20"
            )}
            title="Быстрый просмотр"
          >
            <Eye className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex items-start gap-5">
        {renderPreview(product)}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Заголовок и описание */}
          <div>
            <p className="font-bold text-white/95 text-lg leading-tight mb-2 group-hover:text-white transition-colors line-clamp-2">
              {product.title}
            </p>
            <p className="text-white/60 text-sm mb-3">
              {product.brand} • {product.category}
            </p>
          </div>

          {/* Цена */}
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-white/95">
              {product.price.toLocaleString("ru-RU")} ₽
            </span>
            {product.oldPrice && product.oldPrice > product.price && (
              <>
                <span className="text-lg text-white/40 line-through">
                  {product.oldPrice.toLocaleString("ru-RU")} ₽
                </span>
                <div className={cn(PRODUCT_DISCOUNT, "text-xs font-bold")}>
                  -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                </div>
              </>
            )}
          </div>

          {/* Рейтинг и наличие */}
          <div className="flex items-center gap-4 flex-wrap">
            {renderRating(product.rating)}
            {renderStockBadge(product.stock)}
          </div>

          {/* Кнопка корзины */}
          {onAddToCart && (
            <button
              onClick={() => onAddToCart(product)}
              disabled={product.stock === 0}
              className={cn(
                BTN_SECONDARY,
                "w-full text-base py-3 transition-all duration-300",
                product.stock === 0 && "opacity-50 pointer-events-none",
                "hover:scale-105 hover:shadow-lg"
              )}
            >
              <ShoppingCart className="h-5 w-5" />
              {product.stock === 0 ? "Нет в наличии" : "В корзину"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function CompareRow({
  label,
  children,
  sticky = false,
}: {
  label: string;
  children: React.ReactNode;
  sticky?: boolean;
}) {
  return (
    <div className="grid grid-cols-[280px_repeat(auto-fit,minmax(300px,1fr))]">
      <div
        className={cn(
          "border-b border-white/10 px-6 py-4 backdrop-blur-xl",
          "bg-gradient-to-r from-[#070c1a] to-[#070c1a]/95",
          "text-sm font-semibold uppercase tracking-wide text-white/70",
          sticky &&
            "sticky left-0 z-10 shadow-[8px_0_24px_-8px_rgba(0,0,0,0.4)]"
        )}
      >
        {label}
      </div>
      {children}
    </div>
  );
}

function AttributeCell({ value, isDifferent }: { value: string; isDifferent: boolean }) {
  return (
    <div
      className={cn(
        "border-b border-white/10 px-6 py-4 text-base transition-all duration-300",
        isDifferent
          ? cn(
              "bg-gradient-to-r from-blue-500/10 to-purple-500/10",
              "font-semibold text-white/95 rounded-xl mx-2 my-1 border border-white/10"
            )
          : "text-white/70"
      )}
      title={value}
    >
      <div className="flex items-center justify-between">
        <span className={isDifferent ? "text-white" : "text-white/70"}>
          {value}
        </span>
        {isDifferent && (
          <span
            aria-hidden
            className="ml-3 inline-flex h-2 w-2 rounded-full bg-blue-400 animate-pulse"
          />
        )}
      </div>
    </div>
  );
}

/* ---------------------- Utils ---------------------- */

function plural(n: number, forms: [string, string, string]) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1];
  return forms[2];
}

function getFocusable(root: HTMLElement | null): HTMLElement[] {
  if (!root) return [];
  const selectors = [
    "a[href]",
    "area[href]",
    "button:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "input:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
  ];
  return Array.from(root.querySelectorAll<HTMLElement>(selectors.join(","))).filter(
    (el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden")
  );
}