"use client";

import React from "react";

/**
 * Универсальный скелетон для загрузки.
 * Может отображать как строку, так и карточку.
 */
export default function Skeletons({
  variant = "card",
  count = 3,
}: {
  variant?: "card" | "table" | "row";
  count?: number;
}) {
  if (variant === "row") {
    return (
      <div className="animate-pulse space-y-2 w-full">
        {[...Array(count)].map((_, i) => (
          <div
            key={i}
            className="h-5 w-full rounded-md bg-white/[0.06] border border-white/[0.04]"
          />
        ))}
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className="animate-pulse w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <div className="h-5 w-1/4 bg-white/[0.08] rounded mb-3" />
        <div className="space-y-2">
          {[...Array(count)].map((_, i) => (
            <div
              key={i}
              className="h-6 w-full bg-white/[0.06] rounded-md border border-white/[0.04]"
            />
          ))}
        </div>
      </div>
    );
  }

  // карточки (по умолчанию)
  return (
    <div className="animate-pulse grid gap-3 sm:grid-cols-2 md:grid-cols-3 w-full">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="h-24 sm:h-28 rounded-2xl border border-white/10 bg-white/[0.04]"
        />
      ))}
    </div>
  );
}