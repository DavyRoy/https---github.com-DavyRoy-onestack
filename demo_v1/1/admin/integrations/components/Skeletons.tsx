"use client";

import { motion } from "framer-motion";

export function CardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="
        animate-pulse
        rounded-2xl border border-white/10
        bg-gradient-to-br from-white/[0.04] to-white/[0.02]
        h-28 sm:h-32
        relative overflow-hidden
      "
    >
      {/* эффект "бегущего света" */}
      <div
        className="
          absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent
          animate-[shimmer_1.8s_infinite]
        "
      ></div>
    </motion.div>
  );
}

export default function Skeletons() {
  return (
    <div
      className="
        grid gap-3 sm:grid-cols-2 md:grid-cols-3
        w-full max-w-full overflow-x-hidden
      "
    >
      {[...Array(3)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}