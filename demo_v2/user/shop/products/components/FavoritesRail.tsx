"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion, useReducedMotion, type MotionProps, AnimatePresence } from "framer-motion";
import { Heart, X, ShoppingCart, Star, Eye, ChevronLeft, ChevronRight, Plus, Sparkles } from "lucide-react";
import type { ProductRow } from "../data/mockProducts";
import {
  cn,
  CARD,
  BTN_GHOST,
  BTN_PRIMARY,
  TAPPABLE,
  CHIP,
  PRODUCT_CARD,
  PRODUCT_IMAGE,
  PRODUCT_CONTENT,
  PRODUCT_PRICE,
  PRODUCT_OLD_PRICE,
  PRODUCT_DISCOUNT,
} from "./_shared";

export type FavoritesRailProps = {
  products: ProductRow[];
  onRemove: (id: string) => void;
  onAddToCart?: (product: ProductRow) => void;
  onQuickView?: (product: ProductRow) => void;
  maxVisible?: number;
  compact?: boolean;
  showActions?: boolean;
  className?: string;
};

function plural(n: number, forms: [string, string, string]) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1];
  return forms[2];
}

export default function FavoritesRail({
  products,
  onRemove,
  onAddToCart,
  onQuickView,
  maxVisible = 10,
  compact = false,
  showActions = true,
  className,
}: FavoritesRailProps) {
  const reduced = useReducedMotion();
  const liveRef = useRef<HTMLSpanElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);

  const [hasOverflow, setHasOverflow] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  const visibleProducts = useMemo(() => products.slice(0, maxVisible), [products, maxVisible]);

  const countLabel = useMemo(
    () => `${products.length} ${plural(products.length, ["товар", "товара", "товаров"])}`,
    [products.length]
  );

  /** -------------------- измерение переполнения -------------------- */
  const measureOverflow = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    const overflow = el.scrollWidth > el.clientWidth + 2;
    const left = el.scrollLeft > 0;
    const right = el.scrollLeft < el.scrollWidth - el.clientWidth - 1;
    setHasOverflow(overflow);
    setCanScrollLeft(left);
    setCanScrollRight(right);
  }, []);

  useEffect(() => {
    measureOverflow();
    const el = railRef.current;
    if (!el) return;

    const ro = new ResizeObserver(measureOverflow);
    ro.observe(el);

    const onScroll = () => {
      setIsScrolling(true);
      measureOverflow();
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => setIsScrolling(false), 150);
    };
    
    let scrollTimeout: NodeJS.Timeout;
    el.addEventListener("scroll", onScroll, { passive: true });

    const onWinResize = () => measureOverflow();
    window.addEventListener("resize", onWinResize);

    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onWinResize);
      clearTimeout(scrollTimeout);
    };
  }, [measureOverflow, visibleProducts.length]);

  // автопрокрутка к началу при изменении состава
  useEffect(() => {
    railRef.current?.scrollTo({ left: 0, behavior: reduced ? "auto" : "smooth" });
  }, [products.length, reduced]);

  const scrollBy = (direction: "left" | "right") => {
    const el = railRef.current;
    if (!el) return;
    const delta = Math.max(200, el.clientWidth * 0.6) * (direction === "left" ? -1 : 1);
    el.scrollBy({ left: delta, behavior: reduced ? "auto" : "smooth" });
  };

  const scrollToEdge = (edge: "start" | "end") => {
    const el = railRef.current;
    if (!el) return;
    el.scrollTo({ left: edge === "start" ? 0 : el.scrollWidth, behavior: reduced ? "auto" : "smooth" });
  };

  /** клавиатура: ←/→, Home/End */
  const onKeyRail = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.defaultPrevented) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollBy("left");
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollBy("right");
    } else if (e.key === "Home") {
      e.preventDefault();
      scrollToEdge("start");
    } else if (e.key === "End") {
      e.preventDefault();
      scrollToEdge("end");
    }
  };

  const handleRemove = useCallback(
    (product: ProductRow) => {
      onRemove(product.id);
      if (liveRef.current) {
        liveRef.current.textContent = `Удалено из избранного: ${product.title}`;
        setTimeout(() => {
          if (liveRef.current) liveRef.current.textContent = "";
        }, 2000);
      }
    },
    [onRemove]
  );

  const handleAddToCart = useCallback(
    (product: ProductRow) => {
      onAddToCart?.(product);
      if (liveRef.current) {
        liveRef.current.textContent = `Добавлено в корзину: ${product.title}`;
        setTimeout(() => {
          if (liveRef.current) liveRef.current.textContent = "";
        }, 2000);
      }
    },
    [onAddToCart]
  );

  const fade = (i = 0): MotionProps =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 8, scale: 0.96 },
          whileInView: { opacity: 1, y: 0, scale: 1 },
          viewport: { once: true, amount: 0.12 },
          transition: { delay: 0.02 + i * 0.015, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
        };

  const slide = (i = 0): MotionProps =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, x: 16 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -16, scale: 0.96 },
          transition: { delay: 0.01 + i * 0.01, duration: 0.25, ease: "easeOut" },
        };

  if (!products.length) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className={cn(
          CARD,
          "relative space-y-4 px-6 py-8 text-center",
          className
        )}
      >
        <div className="flex flex-col items-center gap-3 py-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 border border-white/10">
            <Heart className="h-6 w-6 text-white/40" />
          </div>
          <h3 className="text-lg font-semibold text-white/95">Избранное пусто</h3>
          <p className="text-white/60 max-w-sm">Добавляйте товары в избранное, чтобы вернуться к ним позже</p>
        </div>
      </motion.section>
    );
  }

  const renderProductImage = (product: ProductRow) => {
    if (typeof product.thumbnail === "string" && product.thumbnail) {
      return (
        <div className="relative h-full w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.thumbnail}
            alt={product.title}
            width={compact ? 120 : 160}
            height={compact ? 80 : 120}
            className={cn(
              "h-full w-full object-cover transition-all duration-500 group-hover:scale-105",
              compact ? "rounded-lg" : "rounded-xl"
            )}
            loading="lazy"
          />
          {/* Градиентный оверлей */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      );
    }
    if (typeof product.icon === "string" && product.icon) {
      return (
        <div
          className={cn(
            "flex items-center justify-center text-white/60 transition-all duration-300 group-hover:text-white/80 group-hover:scale-110",
            compact ? "text-2xl" : "text-3xl"
          )}
          aria-hidden
        >
          {product.icon}
        </div>
      );
    }
    return (
      <div className="flex h-full w-full items-center justify-center text-white/40 transition-colors duration-300 group-hover:text-white/60" aria-hidden>
        <Heart className={compact ? "h-6 w-6" : "h-8 w-8"} />
      </div>
    );
  };

  const renderRating = (rating: number) => (
    <div className="flex items-center gap-1" aria-label={`Рейтинг ${rating.toFixed(1)} из 5`}>
      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" aria-hidden />
      <span className="text-xs font-medium text-white/80">{rating.toFixed(1)}</span>
    </div>
  );

  const renderStockBadge = (stock: number) => {
    if (stock === 0) {
      return <div className={cn(CHIP, "bg-red-500/20 border-red-400/30 text-red-300 text-xs")}>Нет в наличии</div>;
    }
    if (stock < 10) {
      return (
        <div className={cn(CHIP, "bg-orange-500/20 border-orange-400/30 text-orange-300 text-xs")}>
          Мало ({stock})
        </div>
      );
    }
    return null;
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      aria-labelledby="favorites-title"
      className={cn(
        CARD,
        "relative space-y-4 overflow-hidden",
        compact ? "px-4 py-5" : "px-5 py-6 sm:px-6 sm:py-8",
        className
      )}
    >
      {/* Анимированный фон */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-60">
        <div className="absolute -top-24 -right-20 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.2),transparent_65%)] blur-[110px]" />
        <div className="absolute -bottom-24 -left-20 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.18),transparent_60%)] blur-[110px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_70%)]" />
      </div>

      {/* Заголовок и статистика */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className={cn(
              "flex items-center justify-center rounded-2xl",
              "bg-gradient-to-br from-rose-500/20 to-pink-500/20",
              "border border-rose-400/30 backdrop-blur-sm",
              compact ? "h-8 w-8" : "h-10 w-10"
            )}
          >
            <Sparkles className={cn("text-rose-300", compact ? "h-4 w-4" : "h-5 w-5")} aria-hidden />
          </motion.div>
          <div>
            <h3 id="favorites-title" className="text-lg font-semibold text-white/95 sm:text-xl">
              Избранное
            </h3>
            <p className="text-sm text-white/60" aria-label={`В избранном: ${countLabel}`}>
              {countLabel}
            </p>
          </div>
        </div>

        {products.length > maxVisible && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={cn(
              CHIP,
              "border-white/15 bg-white/10 text-white/70",
              "flex items-center gap-1"
            )}
          >
            <Plus className="h-3 w-3" />
            +{products.length - maxVisible}
          </motion.div>
        )}
      </div>

      {/* Контейнер с градиентными краями и стрелками */}
      <div className="relative">
        {/* Градиентные края */}
        {hasOverflow && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: canScrollLeft ? 1 : 0 }}
              aria-hidden
              className={cn(
                "pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r transition-opacity duration-500",
                "from-[#050911] via-[#050911]/90 to-transparent"
              )}
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: canScrollRight ? 1 : 0 }}
              aria-hidden
              className={cn(
                "pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l transition-opacity duration-500",
                "from-[#050911] via-[#050911]/90 to-transparent"
              )}
            />
          </>
        )}

        {/* Стрелки прокрутки */}
        {hasOverflow && (
          <>
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: canScrollLeft ? (isScrolling ? 0.8 : 1) : 0,
                scale: canScrollLeft ? 1 : 0.8
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => scrollBy("left")}
              className={cn(
                TAPPABLE,
                "absolute left-3 top-1/2 z-20 -translate-y-1/2",
                "flex h-10 w-10 items-center justify-center rounded-2xl",
                "border border-white/15 bg-white/10 backdrop-blur-xl",
                "text-white/80 transition-all duration-300",
                "hover:bg-white/20 hover:text-white hover:border-white/25 hover:shadow-2xl hover:shadow-black/30",
                "focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-black/60",
                !canScrollLeft && "pointer-events-none"
              )}
              aria-label="Прокрутить влево"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </motion.button>
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: canScrollRight ? (isScrolling ? 0.8 : 1) : 0,
                scale: canScrollRight ? 1 : 0.8
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => scrollBy("right")}
              className={cn(
                TAPPABLE,
                "absolute right-3 top-1/2 z-20 -translate-y-1/2",
                "flex h-10 w-10 items-center justify-center rounded-2xl",
                "border border-white/15 bg-white/10 backdrop-blur-xl",
                "text-white/80 transition-all duration-300",
                "hover:bg-white/20 hover:text-white hover:border-white/25 hover:shadow-2xl hover:shadow-black/30",
                "focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-black/60",
                !canScrollRight && "pointer-events-none"
              )}
              aria-label="Прокрутить вправо"
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </motion.button>
          </>
        )}

        {/* Лента товаров */}
        <div
          ref={railRef}
          tabIndex={0}
          onKeyDown={onKeyRail}
          className={cn(
            "flex gap-4 overflow-x-auto pb-4 no-scrollbar scroll-smooth snap-x snap-mandatory",
            hasOverflow && "mx-2 sm:mx-12",
            "outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-black/60 rounded-2xl",
            "transition-all duration-300"
          )}
          role="group"
          aria-roledescription="карусель"
          aria-describedby="favorites-hint"
          aria-label="Лента избранных товаров"
        >
          <AnimatePresence mode="popLayout">
            {visibleProducts.map((product, i) => {
              const href = product.slug ? `/demo/user/shop/${product.slug}` : "#";
              const discount = product.oldPrice && product.oldPrice > product.price 
                ? Math.round((1 - product.price / product.oldPrice) * 100)
                : null;

              return (
                <motion.div 
                  key={product.id} 
                  layout 
                  {...slide(i)} 
                  className={cn(
                    "snap-start shrink-0 transition-transform duration-300 hover:scale-[1.02]",
                    compact ? "w-36 sm:w-40" : "w-48 sm:w-56 lg:w-60"
                  )}
                >
                  <motion.article
                    {...fade(i)}
                    className={cn(
                      PRODUCT_CARD,
                      "group relative h-full overflow-hidden",
                      "transition-all duration-500 hover:border-white/25 hover:shadow-xl hover:shadow-black/30",
                      compact ? "min-w-[8rem] sm:min-w-[10rem]" : "min-w-[11rem] sm:min-w-[14rem] lg:min-w-[15rem]"
                    )}
                    role="group"
                    aria-label={product.title}
                  >
                    {/* Кнопка удаления */}
                    <motion.button
                      initial={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() => handleRemove(product)}
                      className={cn(
                        TAPPABLE,
                        "absolute right-3 top-3 z-10",
                        "flex h-8 w-8 items-center justify-center rounded-full",
                        "border border-white/15 bg-black/70 backdrop-blur-xl",
                        "text-white/80 transition-all duration-300",
                        "hover:bg-red-500/90 hover:text-white hover:border-red-400/60 hover:shadow-lg",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
                        "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
                      )}
                      aria-label={`Удалить «${product.title}» из избранного`}
                    >
                      <X className="h-3.5 w-3.5" aria-hidden />
                    </motion.button>

                    {/* Изображение товара */}
                    <Link
                      href={href}
                      className={cn(
                        PRODUCT_IMAGE, 
                        "relative block overflow-hidden flex-shrink-0",
                        compact ? "h-20 sm:h-24" : "h-28 sm:h-32 lg:h-36"
                      )}
                      title={product.title}
                      aria-label={`Перейти к товару: ${product.title}`}
                    >
                      {renderProductImage(product)}

                      {/* Бейдж скидки */}
                      {discount && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={cn(
                            PRODUCT_DISCOUNT, 
                            "absolute left-2 top-2 px-2 py-1 rounded-full font-bold shadow-lg",
                            "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                          )}
                        >
                          -{discount}%
                        </motion.div>
                      )}
                    </Link>

                    {/* Контент товара */}
                    <div className={cn(PRODUCT_CONTENT, "flex-1 flex flex-col", compact && "p-2 sm:p-3")}>
                      {/* Заголовок и рейтинг */}
                      <div className="mb-3 flex-1">
                        <Link
                          href={href}
                          className="focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-black/60 rounded-lg"
                          title={product.title}
                        >
                          <p
                            className={cn(
                              "mb-2 line-clamp-2 leading-tight font-semibold text-white/95 transition-colors duration-300 group-hover:text-white",
                              compact ? "text-xs sm:text-sm" : "text-sm sm:text-base"
                            )}
                          >
                            {product.title}
                          </p>
                        </Link>
                        <div className="flex items-center justify-between">
                          {renderRating(product.rating)}
                          {renderStockBadge(product.stock)}
                        </div>
                      </div>

                      {/* Цена */}
                      <div className="mb-4 flex items-center gap-2 flex-wrap">
                        <span className={cn(PRODUCT_PRICE, compact ? "text-base sm:text-lg" : "text-lg sm:text-xl")}>
                          {product.price.toLocaleString("ru-RU")} ₽
                        </span>
                        {product.oldPrice && product.oldPrice > product.price && (
                          <span className={cn(PRODUCT_OLD_PRICE, compact ? "text-xs" : "text-sm")}>
                            {product.oldPrice.toLocaleString("ru-RU")} ₽
                          </span>
                        )}
                      </div>

                      {/* Действия */}
                      {showActions && (
                        <div className="flex gap-2 mt-auto">
                          {onAddToCart && (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              type="button"
                              onClick={() => handleAddToCart(product)}
                              disabled={product.stock === 0}
                              className={cn(
                                BTN_PRIMARY,
                                "flex-1 text-sm py-2 rounded-xl",
                                "flex items-center justify-center gap-2",
                                compact && "py-1.5 text-xs",
                                product.stock === 0 && "pointer-events-none opacity-50 grayscale"
                              )}
                            >
                              <ShoppingCart className="h-3.5 w-3.5" aria-hidden />
                              {compact ? "" : "В корзину"}
                            </motion.button>
                          )}

                          {onQuickView && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              type="button"
                              onClick={() => onQuickView(product)}
                              className={cn(
                                BTN_GHOST, 
                                "rounded-xl px-3 py-2 border-white/15",
                                "flex items-center justify-center",
                                compact && "p-1.5"
                              )}
                              aria-label={`Быстрый просмотр: ${product.title}`}
                            >
                              <Eye className="h-3.5 w-3.5" aria-hidden />
                            </motion.button>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.article>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Индикаторы прокрутки для мобильных */}
      {hasOverflow && (
        <div className="flex justify-center gap-1.5 pt-2">
          {[0, 1, 2].map((dot) => (
            <div
              key={dot}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                dot === 0 ? "bg-white/60 w-6" : "bg-white/20 w-1.5"
              )}
            />
          ))}
        </div>
      )}

      {/* Подсказка и live-region */}
      <p id="favorites-hint" className="sr-only">
        Горизонтальная карусель избранных товаров. Используйте стрелки клавиатуры, Home/End, свайп или прокрутку с Shift.
      </p>
      <span ref={liveRef} className="sr-only" aria-live="polite" aria-atomic="true" />
    </motion.section>
  );
}
