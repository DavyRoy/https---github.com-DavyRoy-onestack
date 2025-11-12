"use client";

import React from "react";

type Props = {
  title?: string;
  hint?: string;
};

export default function EmptyState({
  title = "Нет данных",
  hint = "Попробуйте изменить фильтры или диапазон",
}: Props) {
  return (
    <div
      className="
        flex flex-col items-center justify-center
        rounded-2xl border border-white/15 bg-white/[0.03]
        px-4 py-10 sm:px-8 sm:py-12
        text-center
        w-full
      "
    >
      <div className="text-lg sm:text-xl font-semibold text-white mb-2 break-words">
        {title}
      </div>
      <div className="text-sm sm:text-base text-white/60 leading-relaxed max-w-[280px] sm:max-w-none break-words">
        {hint}
      </div>
    </div>
  );
}