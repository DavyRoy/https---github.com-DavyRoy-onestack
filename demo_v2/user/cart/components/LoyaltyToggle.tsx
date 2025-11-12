"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Coins, ArrowUpRight } from "lucide-react";
import type { CartLoyalty } from "../data/mockUserCart";
import { cn, CARD_SOFT, BTN_GHOST, CHIP, BADGE_SUCCESS, TEXT_BALANCE } from "./_shared";

export type LoyaltyToggleProps = {
  loyalty: CartLoyalty;
  onChange: (partial: Partial<CartLoyalty>) => void;
};

export default function LoyaltyToggle({ loyalty, onChange }: LoyaltyToggleProps) {
  const [amount, setAmount] = useState(loyalty.applied);

  const handleToggle = (checked: boolean) => {
    onChange({ enabled: checked, applied: checked ? amount : 0 });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={cn(CARD_SOFT, "space-y-5 border-white/12 bg-white/8 px-5 py-6")}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/14 bg-white/8">
            <Coins className="h-6 w-6 text-amber-300" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white/90">Бонусы OneStack</h3>
            <p className={cn(TEXT_BALANCE, "text-xs text-white/60")}>
              {loyalty.available.toLocaleString("ru-RU")} ₽ доступно к списанию.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleToggle(!loyalty.enabled)}
          className={cn(
            BTN_GHOST,
            "relative flex items-center gap-3 rounded-2xl border-white/15 px-4 py-2 text-sm font-semibold text-white/80 hover:border-white/25"
          )}
          aria-pressed={loyalty.enabled}
        >
          <span
            className={cn(
              "inline-flex h-5 w-10 items-center rounded-full border border-white/20 bg-white/10 px-[3px] transition-all",
              loyalty.enabled && "border-emerald-400/40 bg-emerald-500/30"
            )}
          >
            <span
              className={cn(
                "h-4 w-4 rounded-full bg-white transition-transform",
                loyalty.enabled ? "translate-x-4 bg-emerald-200 shadow-[0_0_10px_rgba(16,185,129,0.6)]" : ""
              )}
            />
          </span>
          {loyalty.enabled ? "Отключить списание" : "Использовать бонусы"}
        </button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <label className="flex flex-col gap-2 text-sm text-white/70 sm:flex-1">
          Сколько списать
          <input
            type="number"
            min={0}
            max={loyalty.available}
            value={amount}
            onChange={(event) => {
              const numeric = Math.max(0, Math.min(Number(event.target.value) || 0, loyalty.available));
              setAmount(numeric);
              if (loyalty.enabled) onChange({ applied: numeric });
            }}
            className="h-12 rounded-2xl border border-white/14 bg-black/40 px-4 text-sm font-semibold text-white focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-40"
            disabled={!loyalty.enabled}
          />
        </label>

        <div className="flex flex-col gap-2 text-xs text-white/60 sm:text-right">
          <span className={cn(CHIP, "border-white/12 bg-white/6 text-white/60")}>
            Минимальный платёж картой 10 ₽
          </span>
          {loyalty.enabled ? (
            <span className={cn(BADGE_SUCCESS, "border-none bg-emerald-500/20 text-emerald-100")}>
              Будет списано {amount.toLocaleString("ru-RU")} ₽
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-white/50">
              <Sparkles className="h-3 w-3" />
              Подключите бонусы, чтобы ускорить оформление
            </span>
          )}
        </div>
      </div>

      <button
        type="button"
        className={cn(
          BTN_GHOST,
          "flex w-full items-center justify-center gap-2 rounded-2xl border-white/15 bg-white/6 px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-white/60 hover:text-white"
        )}
      >
        История бонусов <ArrowUpRight className="h-4 w-4" />
      </button>
    </motion.section>
  );
}
