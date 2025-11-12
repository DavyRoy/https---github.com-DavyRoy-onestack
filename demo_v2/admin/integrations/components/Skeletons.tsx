"use client";

import { motion, useReducedMotion } from "framer-motion";
import React from "react";

/* Отдельная карточка-заглушка */
export function CardSkeleton() {
  const reduceMotion = useReducedMotion();

  const animProps = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, scale: 0.96 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.3, ease: "easeOut" },
      };

  return (
    <motion.div
      {...animProps}
      role="status"
      aria-label="Загрузка данных"
      className="
        relative overflow-hidden
        rounded-2xl border border-white/10
        bg-gradient-to-br from-white/[0.04] to-white/[0.02]
        h-24 sm:h-28 md:h-32
        animate-pulse
      "
    >
      {/* эффект "бегущего света" */}
      {!reduceMotion && (
        <div
          aria-hidden="true"
          className="
            absolute inset-0 bg-gradient-to-r 
            from-transparent via-white/[0.06] to-transparent
            animate-[shimmer_1.8s_infinite_linear]
          "
        />
      )}
    </motion.div>
  );
}

/* Грид из skeleton-карточек */
export default function Skeletons() {
  return (
    <div
      className="
        grid gap-3 
        sm:grid-cols-2 md:grid-cols-3
        w-full max-w-full min-w-0
        supports-[overflow:clip]:overflow-x-clip overflow-x-hidden
      "
      aria-busy="true"
      aria-live="polite"
    >
      {[...Array(3)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}