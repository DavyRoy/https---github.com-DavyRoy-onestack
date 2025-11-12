"use client";
import React from "react";
import { createPortal } from "react-dom";

export default function SaveBar({
  dirty,
  onSave,
  onCancel,
}: {
  dirty: boolean;
  onSave: () => void;
  onCancel: () => void;
}) {
  // Закрытие по Esc
  React.useEffect(() => {
    if (!dirty) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dirty, onCancel]);

  if (!dirty || typeof document === "undefined") return null;

  const content = (
    <div
      className="
        fixed inset-x-0 bottom-0 z-50
        px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-3
      "
      role="region"
      aria-label="Панель сохранения"
    >
      <div
        className="
          mx-auto w-full max-w-5xl min-w-0
          rounded-2xl border border-emerald-400/30 bg-emerald-500/10
          backdrop-blur supports-[backdrop-filter]:backdrop-blur
          shadow-[0_10px_30px_-10px_rgba(0,0,0,.6)]
        "
      >
        <div
          className="
            p-3
            flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3
          "
        >
          <div
            className="text-sm text-emerald-100/90"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            Есть несохранённые изменения
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onCancel}
              className="
                w-full sm:w-auto
                rounded-lg border border-white/15
                px-3 py-2 text-sm
                hover:bg-white/[0.08]
                focus:outline-none focus:ring-2 focus:ring-white/30
                transition
              "
            >
              Отмена (Esc)
            </button>
            <button
              type="button"
              onClick={onSave}
              className="
                w-full sm:w-auto
                rounded-lg
                bg-emerald-500/90 hover:bg-emerald-500
                px-3 py-2 text-sm
                text-black
                focus:outline-none focus:ring-2 focus:ring-emerald-300/60
                transition
              "
            >
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Портал, чтобы исключить влияние локальных stacking/overflow контекстов
  return createPortal(content, document.body);
}