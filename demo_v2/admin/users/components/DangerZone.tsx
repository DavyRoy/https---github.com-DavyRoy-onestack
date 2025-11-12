"use client";

import React from "react";

type Props = {
  className?: string;
  onArchive?: () => void;
};

export default function DangerZone({ className = "", onArchive }: Props) {
  const handleArchive = () => {
    if (onArchive) {
      onArchive();
      return;
    }
    alert("Архивирование (демо): действие не выполняется в этой сборке.");
  };

  return (
    <section
      className={`
        rounded-xl border border-rose-500/30 bg-rose-500/[0.06]
        p-4 md:p-5
        ${className}
      `}
      aria-labelledby="danger-zone-title"
      role="region"
    >
      <h2
        id="danger-zone-title"
        className="text-sm font-semibold text-rose-300 mb-2"
      >
        ⚠ Опасная зона
      </h2>

      <p className="text-xs text-white/70 mb-3 leading-relaxed max-w-prose">
        Эти действия потенциально необратимы. В демо-режиме они не выполняются.
      </p>

      <div className="flex flex-col sm:flex-row gap-2">
        <button
          type="button"
          onClick={handleArchive}
          className="
            w-full sm:w-auto rounded-lg border border-rose-500/40
            px-3 py-2 text-sm font-medium text-rose-300
            hover:bg-rose-500/10
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/40
            active:scale-[0.98]
            transition
          "
        >
          Архивировать (демо)
        </button>
      </div>
    </section>
  );
}