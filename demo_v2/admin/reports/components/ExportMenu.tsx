"use client";

import * as React from "react";
import { Download, FileSpreadsheet, FileText, FileDown } from "lucide-react";

export default function ExportMenu() {
  const handleClick = (format: string) => {
    alert(`Экспорт ${format.toUpperCase()} (демо)`);
  };

  const formats = [
    { label: "CSV", icon: FileText },
    { label: "XLSX", icon: FileSpreadsheet },
    { label: "PDF", icon: FileDown },
  ];

  return (
    <div className="flex flex-wrap gap-2 w-full sm:w-auto">
      {formats.map(({ label, icon: Icon }) => (
        <button
          key={label}
          onClick={() => handleClick(label)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") handleClick(label);
          }}
          type="button"
          aria-label={`Экспорт в ${label}`}
          className="
            flex items-center justify-center gap-2
            flex-1 sm:flex-none
            rounded-lg border border-white/20
            px-3 py-2 text-sm font-medium
            text-white/90
            bg-white/[0.05] hover:bg-white/[0.1]
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30
            transition active:scale-[0.97]
            text-center select-none
          "
        >
          <Icon className="w-4 h-4 opacity-80" aria-hidden="true" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}