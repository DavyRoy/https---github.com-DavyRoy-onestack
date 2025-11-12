"use client";
import React from "react";

export default function SaveBar({
  dirty,
  onSave,
  onCancel,
}: {
  dirty: boolean;
  onSave: () => void;
  onCancel: () => void;
}) {
  if (!dirty) return null;

  return (
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
          <div className="text-sm text-emerald-100/90">
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
              Отмена
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
}