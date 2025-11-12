"use client";

import * as React from "react";

type Props = {
  title?: string;
  hint?: string;
  icon?: React.ReactNode;
};

export default function EmptyState({
  title = "Нет данных",
  hint = "Попробуйте изменить фильтры или диапазон",
  icon,
}: Props) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="
        flex flex-col items-center justify-center text-center
        rounded-2xl border border-white/15 bg-white/[0.03]
        px-4 py-10 sm:px-8 sm:py-12
        w-full animate-fade-in
      "
    >
      {/* Иконка (если передана) */}
      {icon && <div className="mb-4 opacity-70">{icon}</div>}

      <h2 className="text-lg sm:text-xl font-semibold text-white mb-2 break-words">
        {title}
      </h2>

      <p className="text-sm sm:text-base text-white/60 leading-relaxed max-w-[280px] sm:max-w-none break-words">
        {hint}
      </p>
    </div>
  );
}

/* Tailwind animation (если не подключена в globals.css):
@keyframes fade-in {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.3s ease-out forwards;
}
*/