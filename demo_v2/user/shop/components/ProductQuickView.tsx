"use client";

import { createPortal } from "react-dom";
import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { X, ShoppingCart, Star, Heart, Share2, ChevronLeft, ChevronRight, Check } from "lucide-react";
import type { ShopProduct } from "../data/mockUserShop";
import clsx from "clsx";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

export type ProductQuickViewProps = {
  product: ShopProduct | null;
  open: boolean;
  onClose: () => void;
  onAddToCart: (product: ShopProduct) => void;
};

export default function ProductQuickView({
  product,
  open,
  onClose,
  onAddToCart,
}: ProductQuickViewProps) {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  // Галерея
  const imgs = product ? (product.images?.length ? product.images : [product.thumbnail]) : [];
  const [idx, setIdx] = useState(0);
  useEffect(() => setIdx(0), [product?.id]);

  useEffect(() => setMounted(true), []);

  // блокируем фон, фокус-трап, хоткеи
  useEffect(() => {
    if (!open) return;

    lastFocusedRef.current = document.activeElement as HTMLElement;
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") trapFocus(e);
      if (e.key === "ArrowRight") setIdx((i) => Math.min(i + 1, Math.max(0, imgs.length - 1)));
      if (e.key === "ArrowLeft") setIdx((i) => Math.max(i - 1, 0));
    };

    document.addEventListener("keydown", onKey);

    // автофокус
    setTimeout(() => {
      const first = getFocusable(dialogRef.current)[0];
      first?.focus();
    }, 0);

    return () => {
      document.documentElement.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      lastFocusedRef.current?.focus?.();
    };
  }, [open, onClose, imgs.length]);

  const trapFocus = (e: KeyboardEvent) => {
    const list = getFocusable(dialogRef.current);
    if (!list.length) return;
    const first = list[0];
    const last = list[list.length - 1];
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

  const nextImage = () => setIdx((i) => Math.min(i + 1, Math.max(0, imgs.length - 1)));
  const prevImage = () => setIdx((i) => Math.max(i - 1, 0));

  // свайпы (тач)
  const touchRef = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.changedTouches[0];
    touchRef.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchRef.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchRef.current.x;
    const dy = t.clientY - touchRef.current.y;
    // горизонтальный жест
    if (Math.abs(dx) > 40 && Math.abs(dy) < 60) {
      if (dx < 0) nextImage();
      else prevImage();
    }
    touchRef.current = null;
  };

  if (!mounted || !open || !product) return null;

  const titleId = "quickview-title";
  const descId = "quickview-description";
  const nf = new Intl.NumberFormat("ru-RU");
  const hasDiscount = typeof product.oldPrice === "number" && product.oldPrice > product.price;
  const discountPct = hasDiscount ? Math.round(((product.oldPrice! - product.price) / product.oldPrice!) * 100) : null;

  // бейдж по приоритету: скидка → новинка
  const topBadge =
    hasDiscount
      ? { label: `-${discountPct}%`, cls: "border-green-400/40 bg-green-400/15 text-green-300" }
      : product.isNew
      ? { label: "Новинка", cls: "border-blue-400/40 bg-blue-400/15 text-blue-300" }
      : null;

  // share + избранное
  const handleShare = async () => {
    const url = `${location.origin}/demo/user/shop/product/${product.slug}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: product.title, url });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      }
      // noop toast можно повесить на глобальный обработчик
      window.dispatchEvent(new CustomEvent("shop:toast", { detail: { type: "info", text: "Ссылка скопирована" } }));
    } catch {
      // игнорируем отмену
    }
  };
  const handleWishlist = () => {
    window.dispatchEvent(new CustomEvent("shop:wishlist-toggle", { detail: { id: product.id } }));
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 py-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descId}
          onMouseDown={onBackdropClick}
        >
          <motion.div
            ref={dialogRef}
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 20 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 20 }}
            transition={reduced ? { duration: 0.12 } : { type: "spring", damping: 25, stiffness: 300 }}
            className="admin-glass relative grid w-full max-w-6xl grid-cols-1 gap-6 rounded-3xl p-6 shadow-2xl sm:grid-cols-2 sm:gap-8 lg:gap-12"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <motion.button
              whileHover={reduced ? undefined : { scale: 1.08 }}
              whileTap={reduced ? undefined : { scale: 0.95 }}
              type="button"
              onClick={onClose}
              aria-label="Закрыть"
              className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 backdrop-blur transition-all hover:bg-black/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <X className="h-4 w-4 text-white" aria-hidden="true" />
            </motion.button>

            {/* Media Section */}
            <div className="flex flex-col gap-4">
              {/* Main Image */}
              <div
                className="relative overflow-hidden rounded-2xl bg-black/20"
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
              >
                {topBadge && (
                  <motion.span
                    initial={reduced ? undefined : { scale: 0, opacity: 0 }}
                    animate={reduced ? undefined : { scale: 1, opacity: 1 }}
                    className={clsx(
                      "admin-chip absolute left-3 top-3 z-10 text-xs font-medium backdrop-blur",
                      topBadge.cls
                    )}
                  >
                    {topBadge.label}
                  </motion.span>
                )}

                {/* Navigation Arrows */}
                {imgs.length > 1 && (
                  <>
                    <motion.button
                      whileHover={reduced ? undefined : { scale: 1.08 }}
                      whileTap={reduced ? undefined : { scale: 0.95 }}
                      onClick={prevImage}
                      disabled={idx === 0}
                      className={clsx(
                        "absolute left-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 backdrop-blur transition-all",
                        "hover:bg-black/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
                        idx === 0 && "cursor-not-allowed opacity-40"
                      )}
                      aria-label="Предыдущее изображение"
                    >
                      <ChevronLeft className="h-4 w-4 text-white" aria-hidden="true" />
                    </motion.button>
                    <motion.button
                      whileHover={reduced ? undefined : { scale: 1.08 }}
                      whileTap={reduced ? undefined : { scale: 0.95 }}
                      onClick={nextImage}
                      disabled={idx === imgs.length - 1}
                      className={clsx(
                        "absolute right-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 backdrop-blur transition-all",
                        "hover:bg-black/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
                        idx === imgs.length - 1 && "cursor-not-allowed opacity-40"
                      )}
                      aria-label="Следующее изображение"
                    >
                      <ChevronRight className="h-4 w-4 text-white" aria-hidden="true" />
                    </motion.button>
                  </>
                )}

                <Image
                  src={imgs[idx]}
                  alt={product.title}
                  width={720}
                  height={540}
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 720px"
                  className="aspect-[4/3] h-auto w-full object-cover"
                  unoptimized
                  priority
                />

                {/* Image Counter */}
                {imgs.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2">
                    <span className="admin-chip border-white/20 bg-black/40 text-white text-xs backdrop-blur">
                      <span aria-live="polite">
                        {idx + 1} / {imgs.length}
                      </span>
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {imgs.length > 1 && (
                <div className="grid grid-cols-5 gap-2" role="tablist" aria-label="Превью изображений">
                  {imgs.map((src, i) => {
                    const isCurrent = i === idx;
                    return (
                      <motion.button
                        key={src + i}
                        whileHover={reduced ? undefined : { scale: 1.05 }}
                        whileTap={reduced ? undefined : { scale: 0.95 }}
                        type="button"
                        onClick={() => setIdx(i)}
                        aria-label={`Показать изображение ${i + 1} из ${imgs.length}`}
                        aria-current={isCurrent ? "true" : undefined}
                        role="tab"
                        className={clsx(
                          "overflow-hidden rounded-xl border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
                          isCurrent ? "border-white shadow-lg" : "border-white/20 hover:border-white/40"
                        )}
                      >
                        <Image
                          src={src}
                          alt=""
                          width={120}
                          height={90}
                          className="aspect-[4/3] h-auto w-full object-cover"
                          unoptimized
                        />
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="flex w-full flex-col gap-6">
              {/* Header */}
              <div className="space-y-3">
                {product.brand && (
                  <p className="admin-text-soft text-xs uppercase tracking-wider">{product.brand}</p>
                )}
                <h2 id={titleId} className="text-2xl font-semibold leading-tight text-white">
                  {product.title}
                </h2>
                {product.subtitle && (
                  <p className="text-lg leading-relaxed text-white/70">{product.subtitle}</p>
                )}
              </div>

              {/* Rating + Stock */}
              <div className="flex flex-wrap items-center gap-4">
                <div
                  className="flex items-center gap-2 text-white/70"
                  aria-label={`Рейтинг ${product.rating.toFixed(1)} из 5 по ${product.reviewsCount} отзывам`}
                >
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                  <span className="font-semibold text-white">{product.rating.toFixed(1)}</span>
                  <span aria-hidden="true">·</span>
                  <span>{product.reviewsCount} отзывов</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={clsx(
                      "h-2 w-2 rounded-full",
                      product.inStock ? "bg-green-400" : "bg-red-400",
                      product.inStock && !reduced && "animate-pulse"
                    )}
                    aria-hidden="true"
                  />
                  <span
                    className={clsx(
                      "text-sm font-medium",
                      product.inStock ? "text-green-300" : "text-red-300"
                    )}
                  >
                    {product.inStock ? "В наличии" : "Нет в наличии"}
                  </span>
                </div>
              </div>

              {/* Description */}
              <motion.p
                id={descId}
                className="admin-text-soft leading-relaxed"
                initial={reduced ? undefined : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: reduced ? 0 : 0.1 }}
              >
                {product.description}
              </motion.p>

              {/* Highlights */}
              {product.highlights?.length > 0 && (
                <motion.ul
                  className="space-y-2"
                  aria-label="Особенности"
                  initial={reduced ? undefined : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: reduced ? 0 : 0.2 }}
                >
                  {product.highlights.slice(0, 4).map((item, index) => (
                    <motion.li
                      key={item}
                      initial={reduced ? undefined : { opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: reduced ? 0 : 0.3 + index * 0.1 }}
                      className="flex items-center gap-3 text-white/70"
                    >
                      <Check className="h-4 w-4 flex-shrink-0 text-green-400" aria-hidden="true" />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              )}

              {/* Tags */}
              {product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.tags.slice(0, 4).map((tag, index) => (
                    <motion.span
                      key={tag}
                      initial={reduced ? undefined : { opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: reduced ? 0 : 0.4 + index * 0.1 }}
                      className="admin-chip border-white/20 bg-white/5 text-xs text-white/60"
                    >
                      #{tag}
                    </motion.span>
                  ))}
                </div>
              )}

              {/* Price */}
              <motion.div
                className="flex flex-wrap items-center gap-4"
                initial={reduced ? undefined : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: reduced ? 0 : 0.5 }}
              >
                <span className="text-3xl font-bold text-white">{nf.format(product.price)} ₽</span>
                {hasDiscount && (
                  <div className="flex items-center gap-2">
                    <span className="text-xl text-white/40 line-through">
                      {nf.format(product.oldPrice!)} ₽
                    </span>
                  </div>
                )}
              </motion.div>

              {/* Actions */}
              <motion.div
                className="flex flex-col gap-3 sm:flex-row sm:items-center"
                initial={reduced ? undefined : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: reduced ? 0 : 0.6 }}
              >
                <motion.button
                  whileHover={reduced ? undefined : { scale: product.inStock ? 1.05 : 1 }}
                  whileTap={reduced ? undefined : { scale: product.inStock ? 0.95 : 1 }}
                  type="button"
                  onClick={() => onAddToCart(product)}
                  disabled={!product.inStock}
                  aria-disabled={!product.inStock}
                  className={clsx(
                    "inline-flex items-center justify-center gap-3 rounded-xl px-6 py-3 text-base font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
                    product.inStock
                      ? "bg-white text-gray-900 shadow-lg hover:bg-white/90 hover:shadow-xl"
                      : "cursor-not-allowed bg-white/20 text-white/30"
                  )}
                  aria-label={product.inStock ? "Добавить в корзину" : "Нет в наличии"}
                >
                  <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                  {product.inStock ? "Добавить в корзину" : "Нет в наличии"}
                </motion.button>

                <div className="flex gap-2">
                  <motion.button
                    whileHover={reduced ? undefined : { scale: 1.05 }}
                    whileTap={reduced ? undefined : { scale: 0.95 }}
                    className="grid h-12 w-12 place-items-center rounded-xl border border-white/20 bg-white/5 backdrop-blur transition-all hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                    aria-label="Добавить в избранное"
                    onClick={handleWishlist}
                  >
                    <Heart className="h-5 w-5 text-white" aria-hidden="true" />
                  </motion.button>
                  <motion.button
                    whileHover={reduced ? undefined : { scale: 1.05 }}
                    whileTap={reduced ? undefined : { scale: 0.95 }}
                    className="grid h-12 w-12 place-items-center rounded-xl border border-white/20 bg-white/5 backdrop-blur transition-all hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                    aria-label="Поделиться"
                    onClick={handleShare}
                  >
                    <Share2 className="h-5 w-5 text-white" aria-hidden="true" />
                  </motion.button>
                </div>
              </motion.div>

              {/* Quick Links */}
              <motion.div
                className="flex gap-4 text-sm"
                initial={reduced ? undefined : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: reduced ? 0 : 0.7 }}
              >
                <a
                  href={`/demo/user/shop/product/${product.slug}`}
                  className="admin-text-soft underline transition-colors hover:text-white"
                >
                  Открыть страницу товара
                </a>
                <span className="admin-text-soft">·</span>
                <button
                  className="admin-text-soft transition-colors hover:text-white"
                  onClick={() =>
                    window.dispatchEvent(new CustomEvent("shop:compare-open", { detail: { id: product.id } }))
                  }
                >
                  Сравнить с другими
                </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

/* ------------------ Focusable Elements ------------------ */
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