"use client";

import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import { cn, CARD_SOFT, CHIP, TEXT_BALANCE } from "./_shared";

type NotesFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function NotesField({ value, onChange }: NotesFieldProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(CARD_SOFT, "space-y-4 border-white/12 bg-white/8 px-5 py-6")}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/14 bg-white/8 text-white/70">
          <MessageSquare className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-white/90">Комментарий к заказу</h3>
          <p className={cn(TEXT_BALANCE, "text-xs text-white/60")}>
            Например, «позвоните за 10 минут» или «не звоните, у меня дети».
          </p>
        </div>
      </div>

      <textarea
        id="cart-notes"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Напишите пожелания к доставке и услугам..."
        maxLength={240}
        className="min-h-[110px] w-full rounded-2xl border border-white/14 bg-black/40 px-4 py-3 text-sm text-white/80 placeholder:text-white/35 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
      />

      <div className="flex items-center justify-between text-xs text-white/60">
        <span className={cn(CHIP, "border-white/12 bg-white/6 text-white/60")}>Мы читаем каждый комментарий</span>
        <span>{value.length}/240</span>
      </div>
    </motion.section>
  );
}
