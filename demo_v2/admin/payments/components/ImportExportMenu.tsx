// app/demo/admin/payments/components/ImportExportMenu.tsx
"use client";

import * as React from "react";
import { Download, Upload, FileSpreadsheet } from "lucide-react";

export default function ImportExportMenu() {
  const handleClick = (action: string) => {
    alert(`${action} (демо)`);
  };

  return (
    <div
      className="flex flex-wrap items-center gap-2"
      role="group"
      aria-label="Импорт и экспорт данных"
    >
      {/* Экспорт CSV */}
      <button
        onClick={() => handleClick("Экспорт CSV")}
        className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/[0.05] px-3 py-2 text-sm text-white/90 hover:bg-white/[0.08] hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 transition"
        title="Выгрузить таблицу в формате CSV"
      >
        <Download className="w-4 h-4 opacity-80" aria-hidden="true" />
        CSV
      </button>

      {/* Экспорт XLSX */}
      <button
        onClick={() => handleClick("Экспорт XLSX")}
        className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/[0.05] px-3 py-2 text-sm text-white/90 hover:bg-white/[0.08] hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 transition"
        title="Выгрузить таблицу в формате Excel"
      >
        <FileSpreadsheet className="w-4 h-4 opacity-80" aria-hidden="true" />
        XLSX
      </button>

      {/* Импорт */}
      <button
        onClick={() => handleClick("Импорт")}
        className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/[0.05] px-3 py-2 text-sm text-white/90 hover:bg-white/[0.08] hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 transition"
        title="Импортировать данные из файла"
      >
        <Upload className="w-4 h-4 opacity-80" aria-hidden="true" />
        Импорт
      </button>
    </div>
  );
}