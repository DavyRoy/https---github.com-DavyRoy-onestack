"use client";

import { motion, useReducedMotion } from "framer-motion";
import React from "react";

export default function DangerZone({
  title,
  actionText,
  onConfirm,
  description = "Это действие необратимо — убедитесь, что вы уверены.",
  disabled = false,
  confirmLabel, // например: "Я понимаю последствия"
}: {
  title: string;
  actionText: string;
  onConfirm: () => void;
  description?: string;
  disabled?: boolean;
  confirmLabel?: string;
}) {
  const shouldReduce = useReducedMotion();
  const [checked, setChecked] = React.useState(false);

  const canRun = !disabled && (!confirmLabel || checked);

  const handleClick = () => {
    if (!canRun) return;
    onConfirm();
  };

  return (
    <section
      className="
        rounded-2xl border border-red-500/40
        bg-gradient-to-b from-red-900/20 to-red-800/10
        p-4 sm:p-5 text-white/90
        flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3
        transition-colors duration-300
        w-full max-w-full min-w-0
      "
      aria-labelledby="danger-title"
      aria-describedby="danger-desc"
    >
      {/* Текстовая часть */}
      <div className="flex-1 min-w-0">
        <div id="danger-title" className="text-sm font-medium text-red-300 break-words">
          {title}
        </div>
        {description && (
          <p id="danger-desc" className="text-xs text-white/60 mt-0.5 break-words">
            {description}
          </p>
        )}

        {/* Чекбокс-подтверждение (опционально) */}
        {confirmLabel && (
          <label className="mt-2 inline-flex items-center gap-2 text-xs text-white/80 select-none">
            <input
              type="checkbox"
              className="h-4 w-4 accent-red-400"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              aria-label={confirmLabel}
            />
            <span className="break-words">{confirmLabel}</span>
          </label>
        )}
      </div>

      {/* Кнопка действия */}
      <motion.button
        whileHover={shouldReduce ? undefined : { scale: canRun ? 1.03 : 1 }}
        whileTap={shouldReduce ? undefined : { scale: canRun ? 0.97 : 1 }}
        onClick={handleClick}
        disabled={!canRun}
        className={`
          w-full sm:w-auto
          rounded-lg border px-4 py-2 text-sm font-medium
          focus:outline-none focus:ring-2
          transition-colors
          ${canRun
            ? "border-red-500/50 text-red-100 bg-red-500/10 hover:bg-red-500/20 focus:ring-red-500/40"
            : "border-white/10 text-white/40 bg-white/[0.06] cursor-not-allowed"}
        `}
        aria-disabled={!canRun}
      >
        {actionText}
      </motion.button>
    </section>
  );
}