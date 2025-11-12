"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Download, FileJson } from "lucide-react";

export default function ImportExportMenu() {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  // Закрытие при клике вне меню
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Управление клавиатурой
  React.useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`px-3 py-2 text-sm rounded-lg border border-white/20 hover:bg-white/10 transition ${
          open ? "bg-white/[0.08]" : ""
        }`}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        Импорт / Экспорт
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-44 rounded-xl border border-white/15 bg-[#0b0e14]/95 backdrop-blur-md p-1 shadow-lg z-50"
            role="menu"
          >
            <MenuButton
              icon={<Upload size={14} />}
              label="Импорт CSV"
              onClick={() => alert("Импорт CSV (демо)")}
            />
            <MenuButton
              icon={<Download size={14} />}
              label="Экспорт CSV"
              onClick={() => alert("Экспорт CSV (демо)")}
            />
            <MenuButton
              icon={<FileJson size={14} />}
              label="Экспорт JSON"
              onClick={() => alert("Экспорт JSON (демо)")}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ——— вспомогательная кнопка меню ——— */
function MenuButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg hover:bg-white/[0.08] text-sm transition"
      role="menuitem"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}