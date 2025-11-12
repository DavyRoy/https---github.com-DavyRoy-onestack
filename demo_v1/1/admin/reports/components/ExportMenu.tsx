"use client";

import React from "react";

export default function ExportMenu() {
  const handleClick = (format: string) => {
    alert(`Экспорт ${format.toUpperCase()} (демо)`);
  };

  return (
    <div className="flex flex-wrap gap-2 w-full sm:w-auto">
      {["CSV", "XLSX", "PDF"].map((fmt) => (
        <button
          key={fmt}
          onClick={() => handleClick(fmt)}
          className="
            flex-1 sm:flex-none
            rounded-lg border border-white/20
            px-3 py-2 text-sm font-medium
            text-white/90
            bg-white/[0.05] hover:bg-white/[0.1]
            transition
            text-center
            active:scale-[0.98]
          "
        >
          {fmt}
        </button>
      ))}
    </div>
  );
}