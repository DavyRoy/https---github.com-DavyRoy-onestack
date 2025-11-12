"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, Gift, X } from "lucide-react";
import type { AppliedCoupon } from "../data/mockUserCart";
import { cn, CARD_SOFT, BTN_PRIMARY, BTN_GHOST, CHIP, TAPPABLE, TEXT_BALANCE } from "./_shared";

export type CouponBoxProps = {
  coupons: AppliedCoupon[];
  onApply: (code: string) => void;
  onRemove: (code: string) => void;
};

export default function CouponBox({ coupons, onApply, onRemove }: CouponBoxProps) {
  const [code, setCode] = useState("");
  const hasCoupons = coupons.length > 0;

  const handleApply = () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    onApply(trimmed);
    setCode("");
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={cn(CARD_SOFT, "space-y-5 border-white/12 bg-white/8 p-5")}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/60">
            <Gift className="h-3.5 w-3.5" />
            Промокод
          </div>
          <p className={cn(TEXT_BALANCE, "mt-2 text-sm text-white/68")}>
            Добавьте код сертификата или скидку от партнёра. Все бонусы применяются моментально.
          </p>
        </div>
        {hasCoupons ? (
          <span className={cn(CHIP, "border-emerald-400/30 bg-emerald-500/15 text-emerald-200")}>
            {coupons.length} активн.
          </span>
        ) : (
          <span className={cn(CHIP, "border-white/12 bg-white/6 text-white/65")}>до 3 промокодов</span>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-white/50">
            <Sparkles className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={code}
            onChange={(event) => setCode(event.target.value.toUpperCase())}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleApply();
              }
            }}
            placeholder="WELCOME10"
            className="h-12 w-full rounded-2xl border border-white/14 bg-black/40 pl-10 pr-4 text-sm font-semibold uppercase tracking-[0.2em] text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
          />
        </div>
        <button
          type="button"
          onClick={handleApply}
          className={cn(
            BTN_PRIMARY,
            TAPPABLE,
            "flex h-12 w-full items-center justify-center gap-2 rounded-2xl border-white/20 px-5 text-sm font-semibold sm:w-auto"
          )}
        >
          Применить
        </button>
      </div>

      <motion.div layout className="flex flex-wrap gap-2">
        <AnimatePresence initial={false}>
          {coupons.map((coupon) => (
            <motion.span
              key={coupon.code}
              layout
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/20 px-4 py-2 text-xs font-semibold text-emerald-100 shadow-[0_18px_40px_-32px_rgba(16,185,129,0.65)]"
            >
              {coupon.code}
              <button
                type="button"
                onClick={() => onRemove(coupon.code)}
                className={cn(BTN_GHOST, "h-6 w-6 rounded-full border-none bg-white/10 text-white/70 hover:bg-white/20")}
                aria-label={`Удалить купон ${coupon.code}`}
              >
                <X className="h-3 w-3" />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.section>
  );
}
