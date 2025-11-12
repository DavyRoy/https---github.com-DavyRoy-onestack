"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, Sparkles } from "lucide-react";
import { cn, CARD, BTN_PRIMARY, CHIP, TEXT_BALANCE } from "./_shared";

export default function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={cn(
        CARD,
        "relative flex flex-col items-center justify-center gap-6 overflow-hidden px-8 py-16 text-center"
      )}
    >
      <div className="absolute inset-0 -z-10 opacity-80">
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(59,130,246,0.22),transparent_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(168,85,247,0.18),transparent_60%)]" />
      </div>

      <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/15 bg-white/8 text-white/80">
        <ShoppingBag className="h-10 w-10" />
      </div>

      <div className="space-y-4 max-w-md">
        <h2 className="text-3xl font-semibold tracking-tight text-white/95">Корзина пока пуста</h2>
        <p className={cn(TEXT_BALANCE, "text-sm text-white/65")}>
          Добавьте товары, услуги или подписки, чтобы показать клиентам как работает checkout в OneStack.
          Все сценарии адаптированы для десктопа и мобильных устройств.
        </p>
      </div>

      <div className="flex flex-col items-center gap-3">
        <Link
          href="/demo/user/shop"
          className={cn(
            BTN_PRIMARY,
            "flex items-center gap-2 rounded-2xl border-white/20 px-6 py-3 text-sm font-semibold shadow-[0_30px_60px_-40px_rgba(59,130,246,0.7)]"
          )}
        >
          Перейти в каталог
          <Sparkles className="h-4 w-4" />
        </Link>
        <span className={cn(CHIP, "border-white/12 bg-white/6 text-white/60")}>
          Продемонстрируйте оплату в 3 шага
        </span>
      </div>
    </motion.div>
  );
}
