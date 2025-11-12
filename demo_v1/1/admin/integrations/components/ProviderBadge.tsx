"use client";

import { motion } from "framer-motion";

export default function ProviderBadge({
  status,
}: {
  status: "ok" | "degraded" | "down" | "paused";
}) {
  const map = {
    ok: {
      bg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      label: "OK",
    },
    degraded: {
      bg: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      label: "Degraded",
    },
    down: {
      bg: "bg-rose-500/20 text-rose-300 border-rose-500/30",
      label: "Down",
    },
    paused: {
      bg: "bg-slate-500/20 text-slate-300 border-slate-500/30",
      label: "Paused",
    },
  };

  const current = map[status];

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`
        inline-flex items-center gap-1
        px-2 py-0.5 rounded-full border
        text-[11px] sm:text-xs font-medium
        ${current.bg}
        transition-all duration-200 ease-out
      `}
    >
      {/* индикатор статуса */}
      <span
        className={`
          inline-block w-1.5 h-1.5 rounded-full
          ${status === "ok"
            ? "bg-emerald-400 animate-pulse"
            : status === "degraded"
            ? "bg-amber-400"
            : status === "down"
            ? "bg-rose-400"
            : "bg-slate-400"}
        `}
      ></span>

      {current.label}
    </motion.span>
  );
}