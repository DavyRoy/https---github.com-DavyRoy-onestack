"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Heart, ShoppingCart, Star, ArrowUpRight } from "lucide-react";
import type { ShopProduct } from "../data/mockUserShop";
import { cn, CARD_SOFT, BTN_PRIMARY, BTN_GHOST, CHIP, TEXT_BALANCE } from "./_shared";

type ProductCardProps = {
  p: ShopProduct;
};

const formatter = new Intl.NumberFormat("ru-RU");

export default function ProductCard({ p }: ProductCardProps) {
  const reduced = useReducedMotion();
  const [wishlist, setWishlist] = useState(false);

  const price = typeof p.price === "number" ? formatter.format(p.price) : "—";
  const oldPrice = typeof p.oldPrice === "number" ? formatter.format(p.oldPrice) : null;
  const discount =
    typeof p.oldPrice === "number" && typeof p.price === "number" && p.oldPrice > p.price
      ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)
      : null;

  const productHref = `/demo/user/shop/products/${p.slug ?? p.id}`;
  const liveId = `product-live-${p.id}`;

  const badgeToken = p.badge || (p.isNew ? "new" : undefined);
  const badgeLabel =
    badgeToken === "sale"
      ? "Скидка"
      : badgeToken === "new"
      ? "Новинка"
      : badgeToken === "popular"
      ? "Хит"
      : badgeToken === "limited"
      ? "Ограниченно"
      : undefined;

  return (
    <motion.article
      initial={reduced ? undefined : { opacity: 0, y: 18 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={reduced ? undefined : { y: -6, scale: 1.02 }}
      whileTap={reduced ? undefined : { scale: 0.98 }}
      className={cn(
        CARD_SOFT,
        "group relative flex h-full flex-col overflow-hidden border-white/14 bg-white/8 transition-all hover:border-white/22 hover:bg-white/12"
      )}
      aria-labelledby={`title-${p.id}`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-white/4 to-transparent" />
      </div>

      <div className="relative aspect-[4/3] overflow-hidden">
        <Link
          href={productHref}
          className="block h-full w-full"
          aria-label={`Подробнее: ${p.title}`}
          title={p.title}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.thumbnail}
            alt={p.title}
            loading="lazy"
            decoding="async"
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className={cn(
              "h-full w-full object-cover transition-transform",
              reduced ? "duration-0" : "duration-500 group-hover:scale-110"
            )}
          />
        </Link>

        <div className="pointer-events-none absolute left-3 top-3 z-20 flex flex-wrap gap-2">
          {badgeLabel ? (
            <span
              className={cn(CHIP, "border-white/18 bg-white/14 text-[11px] text-white/85 backdrop-blur-md")}
            >
              {badgeLabel}
            </span>
          ) : null}
          {discount !== null ? (
            <span className={cn(CHIP, "border-emerald-400/45 bg-emerald-500/20 text-emerald-50 text-[11px]")}>
              −{discount}%
            </span>
          ) : null}
        </div>

        <motion.button
          type="button"
          aria-label="Добавить в избранное"
          whileHover={reduced ? undefined : { scale: 1.1 }}
          whileTap={reduced ? undefined : { scale: 0.92 }}
          className={cn(
            BTN_GHOST,
            "absolute right-3 top-3 z-20 h-9 w-9 rounded-full border-white/25 bg-black/40 p-0 text-white transition-opacity focus-visible:ring-white/40",
            reduced ? "" : "opacity-0 group-hover:opacity-100"
          )}
          onClick={(event) => {
            event.preventDefault();
            setWishlist((prev) => !prev);
            window.dispatchEvent(new CustomEvent("shop:wishlist-toggle", { detail: { id: p.id } }));
            const live = document.getElementById(liveId);
            if (live) {
              live.textContent = wishlist ? "Удалено из избранного" : "Добавлено в избранное";
              setTimeout(() => {
                if (live) live.textContent = "";
              }, 800);
            }
          }}
        >
          <Heart className={cn("h-4 w-4", wishlist ? "fill-rose-400 text-rose-200" : "text-white")} aria-hidden />
        </motion.button>
      </div>

      <div className="relative z-10 flex flex-1 flex-col gap-4 px-5 pb-5 pt-6">
        <div className="space-y-2 text-center">
          {p.brand ? (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">{p.brand}</p>
          ) : null}
          <Link href={productHref} className="group/title block">
            <h3
              id={`title-${p.id}`}
              className="line-clamp-2 text-base font-semibold leading-tight text-white transition-colors group-hover/title:text-white/80"
            >
              {p.title}
            </h3>
            {p.subtitle ? (
              <p className={cn(TEXT_BALANCE, "mt-1 line-clamp-2 text-sm text-white/60")}>{p.subtitle}</p>
            ) : null}
          </Link>
        </div>

        {typeof p.rating === "number" ? (
          <div className="flex items-center justify-center gap-2 text-sm text-white/70">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" aria-hidden />
            <span className="font-semibold text-white">{p.rating.toFixed(1)}</span>
            <span aria-hidden>·</span>
            <span>{p.reviewsCount ?? 0} отзывов</span>
          </div>
        ) : null}

        {p.tags?.length ? (
          <div className="flex flex-wrap justify-center gap-1.5">
            {p.tags.slice(0, 2).map((tag) => (
              <span key={tag} className={cn(CHIP, "border-white/18 bg-white/10 text-[11px] text-white/60")}>
                #{tag}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-auto space-y-3" id={`price-${p.id}`}>
          <div className="flex flex-col items-center gap-1">
            {oldPrice ? (
              <span className="text-sm text-white/40 line-through" aria-label="Старая цена">
                {oldPrice} ₽
              </span>
            ) : null}
            <span className="text-xl font-semibold text-white">{price} ₽</span>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs font-medium">
            <span
              className={cn(
                "inline-flex h-2 w-2 rounded-full",
                p.inStock ? "bg-emerald-400" : "bg-rose-400",
                p.inStock && !reduced ? "animate-pulse" : ""
              )}
              aria-hidden
            />
            <span className={cn(p.inStock ? "text-emerald-200" : "text-rose-200")}>
              {p.inStock ? "В наличии" : "Нет в наличии"}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <motion.button
            type="button"
            whileHover={reduced ? undefined : { scale: 1.02 }}
            whileTap={reduced ? undefined : { scale: 0.96 }}
            className={cn(
              BTN_PRIMARY,
              "flex w-full items-center justify-center gap-2 rounded-2xl border-white/28 px-4 py-2 text-sm font-semibold shadow-none hover:shadow-lg"
            )}
            onClick={(event) => {
              event.preventDefault();
              window.dispatchEvent(new CustomEvent("shop:add-to-cart", { detail: { id: p.id } }));
              const live = document.getElementById(liveId);
              if (live) {
                live.textContent = "Товар добавлен в корзину";
                setTimeout(() => {
                  if (live) live.textContent = "";
                }, 800);
              }
            }}
          >
            <ShoppingCart className="h-4 w-4" aria-hidden />
            В корзину
          </motion.button>

          <Link
            href={productHref}
            className={cn(
              BTN_GHOST,
              "flex items-center justify-center gap-2 rounded-2xl border-white/18 bg-white/10 px-4 py-2 text-sm font-semibold text-white/75 hover:border-white/28 hover:bg-white/14 hover:text-white"
            )}
            aria-label={`Подробнее о товаре ${p.title}`}
          >
            Подробнее
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>

      <span id={liveId} className="sr-only" role="status" aria-live="polite" />
    </motion.article>
  );
}
