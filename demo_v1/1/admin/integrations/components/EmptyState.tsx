"use client";

import { motion } from "framer-motion";

export default function EmptyState({
  title = "Ничего не найдено",
  hint,
}: {
  title?: string;
  hint?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="
        rounded-2xl border border-white/15 bg-white/[0.04]
        p-8 sm:p-10 text-center
        flex flex-col items-center justify-center
        text-white/80 backdrop-blur-sm
      "
    >
      <div className="text-2xl sm:text-3xl font-semibold mb-2">{title}</div>

      {hint ? (
        <div className="text-sm sm:text-base text-white/60 max-w-md mx-auto">
          {hint}
        </div>
      ) : (
        <div className="text-sm text-white/50">Попробуйте изменить фильтры или настройки</div>
      )}

      <div className="mt-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-10 h-10 sm:w-12 sm:h-12 text-white/20"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 16.65z"
          />
        </svg>
      </div>
    </motion.div>
  );
}