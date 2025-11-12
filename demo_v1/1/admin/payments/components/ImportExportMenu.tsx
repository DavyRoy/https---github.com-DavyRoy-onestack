"use client";

import React from "react";
import { Download, Upload, FileSpreadsheet } from "lucide-react"; // иконки shadcn/lucide

export default function ImportExportMenu() {
  const handleClick = (action: string) => alert(`${action} (демо)`);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={() => handleClick("Экспорт CSV")}
        className="flex items-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-sm text-white/90 hover:bg-white/[0.08] transition"
      >
        <Download className="w-4 h-4 opacity-80" />
        CSV
      </button>

      <button
        onClick={() => handleClick("Экспорт XLSX")}
        className="flex items-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-sm text-white/90 hover:bg-white/[0.08] transition"
      >
        <FileSpreadsheet className="w-4 h-4 opacity-80" />
        XLSX
      </button>

      <button
        onClick={() => handleClick("Импорт")}
        className="flex items-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-sm text-white/90 hover:bg-white/[0.08] transition"
      >
        <Upload className="w-4 h-4 opacity-80" />
        Импорт
      </button>
    </div>
  );
}