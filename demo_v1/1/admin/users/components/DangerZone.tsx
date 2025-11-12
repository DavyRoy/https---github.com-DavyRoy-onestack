"use client";

import React from "react";

export default function DangerZone({ className = "" }: { className?: string }) {
  const onArchive = () => {
    // Демо-действие — без реального запроса
    // Никаких дат/рандома, чтобы избежать hydration mismatch
    alert("Архивирование (демо): действие не выполняется в этой сборке.");
  };

  return (
    <section
      className={`
        rounded-xl border border-rose-500/30 bg-rose-500/[0.06] p-3
        ${className}
      `}
      aria-labelledby="danger-zone-title"
    >
      <h2 id="danger-zone-title" className="text-sm text-rose-300 mb-2">
        Опасная зона
      </h2>

      <p className="text-xs text-white/60 mb-3">
        Действия ниже потенциально необратимы. В демо-режиме они не выполняются.
      </p>

      <div className="flex flex-col sm:flex-row gap-2">
        <button
          type="button"
          onClick={onArchive}
          className="
            w-full sm:w-auto rounded-lg border border-rose-500/40
            px-3 py-2 text-sm text-rose-300 hover:bg-rose-500/10
            focus:outline-none focus:ring-2 focus:ring-rose-400/40
          "
        >
          Архивировать (демо)
        </button>
      </div>
    </section>
  );
}