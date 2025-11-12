"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn, BTN_PRIMARY, CHIP } from "./_shared";

type StickyCheckoutProps = {
  amount: number;
  visible?: boolean;
};

export default function StickyCheckout({ amount, visible = true }: StickyCheckoutProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[env(safe-area-inset-bottom)] lg:hidden"
        >
          <div className="mx-auto w-full max-w-md rounded-3xl border border-white/12 bg-black/70 px-5 py-4 shadow-[0_30px_80px_-40px_rgba(14,116,144,0.9)] backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <span className={cn(CHIP, "border-none bg-white/10 text-white/70 text-xs uppercase tracking-[0.24em]")}>
                  К оплате
                </span>
                <span className="text-2xl font-semibold text-white">
                  {amount.toLocaleString("ru-RU")} ₽
                </span>
              </div>

              <Link
                href="/demo/user/checkout"
                className={cn(
                  BTN_PRIMARY,
                  "flex items-center gap-2 rounded-2xl border-white/20 px-5 py-2 text-sm font-semibold shadow-none hover:shadow-lg"
                )}
              >
                Оформить
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
