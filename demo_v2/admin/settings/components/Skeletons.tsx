"use client";

import React from "react";

export default function Skeletons({ rows = 3 }: { rows?: number }) {
  return (
    <div
      className="
        grid gap-2 sm:gap-3 w-full max-w-full min-w-0
        relative overflow-hidden rounded-xl
      "
      role="status"
      aria-hidden="true"
    >
      {[...Array(rows)].map((_, i) => (
        <div
          key={i}
          className="h-6 sm:h-7 rounded-lg bg-white/[0.06] overflow-hidden relative"
        >
          {/* shimmer */}
          <div
            className="
              absolute inset-0 bg-gradient-to-r
              from-transparent via-white/[0.1] to-transparent
              animate-[shimmer_1.6s_infinite]
            "
          />
        </div>
      ))}

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        div[aria-hidden="true"] > div > div {
          background-size: 200% 100%;
        }
      `}</style>
    </div>
  );
}