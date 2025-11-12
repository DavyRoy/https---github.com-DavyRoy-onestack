"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Sparkles } from "lucide-react";
import { cn, CARD, BTN_GHOST, CHIP, TEXT_BALANCE } from "./_shared";

type CartHeaderProps = {
  count: number;
};

export default function CartHeader({ count }: CartHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        CARD,
        "relative overflow-hidden p-6 sm:p-8 lg:p-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6"
      )}
    >
      <div className="absolute inset-0 -z-10 opacity-80">
        <div className="absolute -top-24 -left-10 h-56 w-56 rounded-full bg-gradient-to-br from-blue-500/25 via-purple-600/15 to-transparent blur-[120px]" />
        <div className="absolute -bottom-16 right-0 h-48 w-48 rounded-full bg-gradient-to-tr from-cyan-400/25 via-slate-500/20 to-transparent blur-[110px]" />
      </div>

      <div className="flex flex-col gap-4">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/60">
          <ShoppingCart className="h-4 w-4" />
          Корзина
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl sm:text-4xl font-semibold text-white/95 tracking-tight">
            {count ? `В корзине ${count} позиций` : "Корзина пуста"}
          </h1>
          {count ? (
            <span className={cn(CHIP, "border-white/15 bg-white/10 text-white/80")}>
              <Sparkles className="h-4 w-4 text-blue-300" />
              Готово к оформлению
            </span>
          ) : null}
        </div>

        <p className={cn(TEXT_BALANCE, "text-sm text-white/68 max-w-2xl")}>
          Управляйте заказами, объединяйте услуги и товары в единую корзину и продолжайте оформление
          в несколько кликов — как на десктопе, так и на телефоне.
        </p>
      </div>

      <Link
        href="/demo/user/shop"
        className={cn(
          BTN_GHOST,
          "inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 px-5 py-3 text-sm font-semibold text-white/90 hover:border-white/25 hover:bg-white/12"
        )}
        prefetch={false}
      >
        Продолжить покупки
      </Link>
    </motion.header>
  );
}
