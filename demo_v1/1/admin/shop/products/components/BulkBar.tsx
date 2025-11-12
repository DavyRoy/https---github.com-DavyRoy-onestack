// app/demo/admin/shop/products/components/BulkBar.tsx
"use client";

import { useEffect, useMemo } from "react";

type BulkAction = {
  key: string;
  label: string;
  tone?: "default" | "primary" | "danger";
  /** Вызывается при клике; если вернёт false — панель не очищаем */
  onClick: (ids: string[]) => void | boolean | Promise<void | boolean>;
  /** Нужно ли показывать подтверждение (для опасных действий) */
  confirm?: { title?: string; message?: string; confirmText?: string };
  /** Отключить действие при отсутствии выбора (по умолчанию: true) */
  disableWhenEmpty?: boolean;
};

export default function BulkBar({
  selectedIds,
  onClear,
  onSelectAll,
  actions,
}: {
  selectedIds: string[];
  onClear: () => void;
  /** (опционально) выделить всё в текущем списке */
  onSelectAll?: () => void;
  /** (опционально) кастомные действия; если не переданы — используются дефолтные */
  actions?: BulkAction[];
}) {
  const count = selectedIds.length;

  // хоткеи: Esc — закрыть; Ctrl/Cmd+A — выбрать всё (если есть onSelectAll)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Esc закрыть(очистить)
      if (e.key === "Escape") {
        e.preventDefault();
        onClear();
      }
      // Ctrl/Cmd + A — выделить всё
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a" && onSelectAll) {
        e.preventDefault();
        onSelectAll();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClear, onSelectAll]);

  const plural = (n: number) => {
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return "товар";
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "товара";
    return "товаров";
  };

  const defaultActions: BulkAction[] = useMemo(
    () => [
      {
        key: "status",
        label: "Изменить статус",
        onClick: (ids) => alert(`Демо: массовое «Изменить статус»\nВыбрано: ${ids.length}`),
      },
      {
        key: "category",
        label: "Присвоить категорию",
        onClick: (ids) => alert(`Демо: массово «Присвоить категорию»\nВыбрано: ${ids.length}`),
      },
      {
        key: "export",
        label: "Экспорт",
        onClick: (ids) => alert(`Демо: «Экспорт» ${ids.length} позиций`),
      },
      {
        key: "archive",
        label: "Архивировать",
        tone: "danger",
        confirm: {
          title: "Архивировать товары?",
          message:
            "Действие обратимо, но товары пропадут из витрины. Вы уверены, что хотите продолжить?",
          confirmText: "Архивировать",
        },
        onClick: (ids) => alert(`Демо: «Архивировать» ${ids.length} позиций`),
      },
      {
        key: "clear",
        label: "Очистить",
        onClick: () => false, // не очищаем тут, ниже отдельная кнопка Очистить всё
      },
    ],
    []
  );

  const list = actions ?? defaultActions;

  async function runAction(a: BulkAction) {
    if (a.disableWhenEmpty !== false && count === 0) return;

    if (a.confirm && count > 0) {
      const title = a.confirm.title ?? "Подтвердите действие";
      const msg = a.confirm.message ?? "Вы уверены, что хотите продолжить?";
      const ok = confirm(`${title}\n\n${msg}`);
      if (!ok) return;
    }
    const result = await a.onClick(selectedIds);
    // если обработчик явно вернул false — не очищаем выбор
    if (result !== false && a.key !== "clear") onClear();
  }

  return (
    <div
      className="fixed inset-x-3 bottom-3 z-40"
      role="region"
      aria-label="Массовые операции"
    >
      <div
        className="rounded-2xl border border-white/15 bg-black/70 backdrop-blur-md px-3 py-2 md:px-4 md:py-3 shadow-xl"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.5rem)" }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm">
            Выбрано:{" "}
            <span className="font-medium tabular-nums" aria-live="polite">
              {count}
            </span>{" "}
            {plural(count)}
          </div>

          <div className="flex items-center gap-2 overflow-auto">
            {/* secondary */}
            {list
              .filter((a) => a.key !== "archive")
              .map((a) => (
                <button
                  key={a.key}
                  className="rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15 disabled:opacity-50"
                  onClick={() => runAction(a)}
                  disabled={a.disableWhenEmpty !== false && count === 0}
                >
                  {a.label}
                </button>
              ))}

            {/* primary/danger */}
            {list
              .filter((a) => a.key === "archive")
              .map((a) => (
                <button
                  key={a.key}
                  className={cls(
                    "rounded-xl px-3 py-1.5 text-sm hover:opacity-90 disabled:opacity-50",
                    a.tone === "danger"
                      ? "bg-red-500 text-white"
                      : "bg-white text-black"
                  )}
                  onClick={() => runAction(a)}
                  disabled={a.disableWhenEmpty !== false && count === 0}
                >
                  {a.label}
                </button>
              ))}

            {/* Очистить выбор — всегда доступна */}
            <button
              className="rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15"
              onClick={onClear}
              aria-label="Очистить выбор"
            >
              Очистить
            </button>
          </div>
        </div>

        {/* Подсказки */}
        <div className="mt-1 text-[11px] text-white/60">
          Esc — очистить выбор • {onSelectAll ? "Ctrl/Cmd+A — выделить всё" : ""}
        </div>
      </div>
    </div>
  );
}