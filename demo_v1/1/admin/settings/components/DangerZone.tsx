"use client";

import { motion } from "framer-motion";

export default function DangerZone({
  title,
  actionText,
  onConfirm,
}: {
  title: string;
  actionText: string;
  onConfirm: () => void;
}) {
  return (
    <section
      className="
        rounded-2xl border border-red-500/40 bg-gradient-to-b from-red-900/20 to-red-800/10
        p-4 sm:p-5 text-white/90
        flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3
        transition-all duration-300
      "
    >
      {/* Текстовая часть */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-red-300">{title}</div>
        <p className="text-xs text-white/60 mt-0.5">
          Это действие необратимо — убедитесь, что вы уверены.
        </p>
      </div>

      {/* Кнопка действия */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onConfirm}
        className="
          w-full sm:w-auto
          rounded-lg border border-red-500/50
          text-red-100 font-medium
          px-4 py-2 text-sm
          bg-red-500/10 hover:bg-red-500/20
          focus:outline-none focus:ring-2 focus:ring-red-500/40
          transition-colors
        "
      >
        {actionText}
      </motion.button>
    </section>
  );
}