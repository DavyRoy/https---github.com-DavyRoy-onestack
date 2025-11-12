"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { CartGroup } from "../data/mockUserCart";
import CartItemRow from "./CartItemRow";
import { cn, CHIP, TEXT_BALANCE } from "./_shared";

export type CartItemsProps = {
  groups: CartGroup[];
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  onFavorite: (id: string) => void;
};

export default function CartItems({ groups, onQuantityChange, onRemove, onFavorite }: CartItemsProps) {
  if (!groups.some((group) => group.items.length)) return null;

  return (
    <section className="space-y-8">
      {groups.map((group) => {
        if (!group.items.length) return null;
        const groupTotal = group.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

        return (
          <motion.div
            key={group.id}
            layout
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="space-y-5"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-white/90">{group.label}</h2>
                <span className={cn(CHIP, "border-white/12 bg-white/7 text-white/70 text-xs uppercase tracking-[0.18em]")}>
                  {group.items.length} поз.
                </span>
              </div>
              <p className={cn(TEXT_BALANCE, "text-sm text-white/60")}>
                Сумма в блоке:{" "}
                <span className="font-semibold text-white">
                  {groupTotal.toLocaleString("ru-RU")} ₽
                </span>
              </p>
            </div>

            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {group.items.map((item) => (
                  <CartItemRow
                    key={item.id}
                    item={item}
                    onQuantityChange={onQuantityChange}
                    onRemove={onRemove}
                    onFavorite={onFavorite}
                  />
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        );
      })}
    </section>
  );
}
