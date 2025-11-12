// src/app/demo/manager/booking/components/BulkBar.tsx
"use client";

import { toast } from "sonner";

export default function BulkBar({
  count,
  onClear,
  onApply,
}: {
  count: number;
  onClear: () => void;
  onApply: (action: "confirm" | "cancel" | "assign" | "export") => void;
}) {
  if (count === 0) return null;

  return (
    <div
      role="region"
      aria-label="Массовые действия по выбранным записям"
      className={[
        "sticky bottom-2 md:bottom-3 z-20",
        "mx-1 sm:mx-auto w-[calc(100%-0.5rem)] sm:w-full max-w-6xl",
        "rounded-2xl border border-white/15 bg-white/10 backdrop-blur",
        "p-2 shadow-[0_12px_40px_-18px_rgba(0,0,0,0.75)]",
        "pb-[max(env(safe-area-inset-bottom),0.5rem)]", // безопасная зона на iOS
      ].join(" ")}
    >
      <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm">
          Выбрано: <b className="tabular-nums">{count}</b>
        </div>

        {/* Лента действий — на мобиле скролл по оси X */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 whitespace-nowrap"
            onClick={() => onApply("confirm")}
          >
            Подтвердить
          </button>
          <button
            className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 whitespace-nowrap"
            onClick={() => onApply("cancel")}
          >
            Отменить
          </button>
          <button
            className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 whitespace-nowrap"
            onClick={() => onApply("assign")}
          >
            Назначить сотр.
          </button>
          <button
            className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 whitespace-nowrap"
            onClick={() => {
              onApply("export");
              toast.success("CSV сформирован (демо)");
            }}
          >
            Экспорт
          </button>
          <button
            className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 whitespace-nowrap"
            onClick={onClear}
          >
            Снять выбор
          </button>
        </div>
      </div>
    </div>
  );
}