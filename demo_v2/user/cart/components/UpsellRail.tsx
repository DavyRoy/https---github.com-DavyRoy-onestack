"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, ShoppingCart } from "lucide-react";
import type { CartUpsell } from "../data/mockUserCart";
import { cn, CARD_SOFT, BTN_PRIMARY, BTN_GHOST, CHIP, TAPPABLE, TEXT_BALANCE } from "./_shared";

export type UpsellRailProps = {
  items: CartUpsell[];
  onAdd: (item: CartUpsell) => void;
};

export default function UpsellRail({ items, onAdd }: UpsellRailProps) {
  if (!items.length) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={cn(CARD_SOFT, "space-y-5 border-white/12 bg-white/8 px-5 py-6")}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/60">
            <ShoppingCart className="h-4 w-4" />
            С этим берут
          </div>
          <p className={cn(TEXT_BALANCE, "mt-2 text-sm text-white/68")}>
            Добавьте дополнительные услуги и аксессуары — они сразу попадут в оформление.
          </p>
        </div>
        <span className={cn(CHIP, "border-white/12 bg-white/6 text-white/65")}>
          {items.length} рекомендаций
        </span>
      </div>

      <motion.div
        layout
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {items.map((item, index) => (
          <UpsellCard key={item.id} item={item} index={index} onAdd={() => onAdd(item)} />
        ))}
      </motion.div>
    </motion.section>
  );
}

type UpsellCardProps = {
  item: CartUpsell;
  index: number;
  onAdd: () => void;
};

function UpsellCard({ item, index, onAdd }: UpsellCardProps) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/12 bg-black/45 shadow-[0_30px_60px_-50px_rgba(59,130,246,0.6)]"
    >
      <Link href={item.href} className="relative block h-36 overflow-hidden">
        <Image
          src={item.image}
          alt={item.title}
          width={320}
          height={180}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70">
          <ArrowUpRight className="h-3 w-3" />
          Демо
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 px-4 py-4">
        <div className="space-y-1">
          <h4 className="text-base font-semibold text-white/90">{item.title}</h4>
          <p className="text-xs text-white/60">{item.price.toLocaleString("ru-RU")} ₽</p>
        </div>

        <p className={cn(TEXT_BALANCE, "text-xs text-white/50")}>
          Идеально сочетается с основным заказом и доступно для быстрой установки.
        </p>

        <button
          type="button"
          onClick={onAdd}
          className={cn(
            BTN_PRIMARY,
            TAPPABLE,
            "mt-auto flex w-full items-center justify-center gap-2 rounded-2xl border-white/20 px-4 py-2 text-xs font-semibold shadow-none hover:shadow-lg"
          )}
        >
          Добавить
          <ShoppingCart className="h-4 w-4" />
        </button>
      </div>
    </motion.article>
  );
}
