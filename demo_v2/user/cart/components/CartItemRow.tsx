"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Heart, Trash2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import type { CartItem } from "../data/mockUserCart";
import {
  cn,
  CARD_SOFT,
  BTN_GHOST,
  BTN_SECONDARY,
  CHIP,
  CHIP_SOLID,
  BADGE_SUCCESS,
  BADGE_WARNING,
  BADGE_ERROR,
  TAPPABLE,
} from "./_shared";

export type CartItemRowProps = {
  item: CartItem;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  onFavorite: (id: string) => void;
};

const statusLabels: Record<CartItem["status"], string> = {
  in_stock: "В наличии",
  pending: "Ожидается",
  preorder: "Предзаказ",
};

export default function CartItemRow({ item, onQuantityChange, onRemove, onFavorite }: CartItemRowProps) {
  const total = item.unitPrice * item.quantity;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={cn(
        CARD_SOFT,
        "group relative flex flex-col gap-6 border-white/14 bg-white/[0.06] p-5 sm:flex-row sm:items-start sm:justify-between"
      )}
    >
      <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-white/4 via-white/2 to-transparent opacity-70" />

      <div className="flex gap-4">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-white/12 bg-white/5">
          <Image
            src={item.image}
            alt={item.title}
            width={96}
            height={96}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
          {item.badge ? (
            <span className={cn(BADGE_WARNING, "absolute left-3 top-3 border-none bg-amber-500/20 text-amber-200")}>
              {item.badge}
            </span>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                item.status === "in_stock" && BADGE_SUCCESS,
                item.status === "pending" && BADGE_WARNING,
                item.status === "preorder" && BADGE_ERROR,
                "border-none px-3 py-1.5 text-[11px] uppercase tracking-[0.18em]"
              )}
            >
              {statusLabels[item.status]}
            </span>
            {item.depositRatio ? (
              <span className={cn(CHIP, "border-white/15 bg-white/8 text-white/70")}>
                Предоплата {Math.round(item.depositRatio * 100)}%
              </span>
            ) : null}
            {item.type === "service" ? (
              <span className={cn(CHIP_SOLID, "border-blue-400/30 bg-blue-500/20 text-blue-200")}>
                <Sparkles className="h-3.5 w-3.5" />
                Услуга
              </span>
            ) : null}
          </div>
          <Link
            href={item.href}
            className="text-lg font-semibold text-white/95 transition-colors hover:text-white"
          >
            {item.title}
          </Link>
          {item.subtitle ? <p className="text-sm text-white/70">{item.subtitle}</p> : null}
          {item.variant ? <p className="text-xs text-white/50 tracking-wide uppercase">{item.variant}</p> : null}
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:items-end">
        <div className="flex items-center gap-3 rounded-full border border-white/12 bg-white/8 px-2 py-1">
          <button
            type="button"
            onClick={() => onQuantityChange(item.id, Math.max(1, item.quantity - 1))}
            className={cn(
              BTN_GHOST,
              TAPPABLE,
              "h-8 w-8 rounded-full border-none bg-transparent text-white/70 hover:bg-white/10 hover:text-white"
            )}
            aria-label="Уменьшить количество"
          >
            <Minus className="h-4 w-4" aria-hidden />
          </button>
          <span className="min-w-[2.5rem] text-center text-sm font-semibold text-white">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={() => onQuantityChange(item.id, item.quantity + 1)}
            className={cn(
              BTN_GHOST,
              TAPPABLE,
              "h-8 w-8 rounded-full border-none bg-transparent text-white/70 hover:bg-white/10 hover:text-white"
            )}
            aria-label="Увеличить количество"
          >
            <Plus className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <div className="text-right text-sm text-white/70">
          <p className="text-xs text-white/50">Цена за ед. {item.unitPrice.toLocaleString("ru-RU")} ₽</p>
          <p className="text-lg font-semibold text-white">
            {total.toLocaleString("ru-RU")} ₽
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onFavorite(item.id)}
            className={cn(
              BTN_SECONDARY,
              "rounded-full border-white/12 bg-white/10 px-4 py-2 text-xs font-semibold text-white/85 hover:border-white/20"
            )}
          >
            <Heart className="h-4 w-4" aria-hidden /> В избранное
          </button>
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className={cn(
              BTN_GHOST,
              "rounded-full border-white/12 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80 hover:bg-white/12"
            )}
          >
            <Trash2 className="h-4 w-4" aria-hidden /> Удалить
          </button>
        </div>
      </div>
    </motion.article>
  );
}
