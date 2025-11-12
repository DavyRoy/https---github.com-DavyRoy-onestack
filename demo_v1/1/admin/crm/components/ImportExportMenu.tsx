"use client";

import * as React from "react";

export default function ImportExportMenu() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="px-3 py-2 text-sm rounded-lg border border-white/20 hover:bg-white/10"
        aria-expanded={open}
      >
        Импорт/Экспорт
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-xl border border-white/15 bg-[#0b0e14] p-1 shadow-lg">
          <button
            onClick={() => alert("Импорт CSV (демо)")}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/[0.06] text-sm"
          >
            Импорт CSV
          </button>
          <button
            onClick={() => alert("Экспорт CSV (демо)")}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/[0.06] text-sm"
          >
            Экспорт CSV
          </button>
          <button
            onClick={() => alert("Экспорт JSON (демо)")}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/[0.06] text-sm"
          >
            Экспорт JSON
          </button>
        </div>
      )}
    </div>
  );
}