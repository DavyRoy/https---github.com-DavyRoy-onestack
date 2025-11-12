"use client";

export default function OrdersBulkBar({
  ids,
  onAction,
}: {
  ids: string[];
  onAction: (action: string) => void;
}) {
  if (ids.length === 0) return null;

  return (
    <div
      className={[
        // прилипаем с учётом безопасной зоны на iOS
        "sticky bottom-3 sm:bottom-4",
        "z-20 mx-1 sm:mx-2",
        "rounded-2xl border border-white/20 bg-white/10 backdrop-blur",
        "shadow-[0_20px_60px_-28px_rgba(0,0,0,0.6)]",
        "p-2 sm:p-3",
      ].join(" ")}
      role="region"
      aria-label="Групповые действия по заказам"
    >
      <div
        className="
          grid gap-2
          sm:flex sm:items-center sm:justify-between
        "
      >
        {/* Счётчик выбранных — озвучиваем изменения для скринридеров */}
        <div className="text-sm">
          Выбрано:{" "}
          <b className="tabular-nums" aria-live="polite">
            {ids.length}
          </b>
        </div>

        {/* Кнопки: на мобиле — горизонтальный скролл без переноса, на десктопе — обычный флекс */}
        <div
          className="
            -mx-1 flex gap-2 overflow-x-auto px-1 scrollbar-none
            sm:m-0 sm:overflow-visible sm:flex-wrap
          "
          role="group"
          aria-label="Действия"
        >
          <button
            className="btn whitespace-nowrap min-h-[36px]"
            onClick={() => onAction("confirm")}
            aria-label="Подтвердить выбранные заказы"
          >
            Подтвердить
          </button>
          <button
            className="btn whitespace-nowrap min-h-[36px]"
            onClick={() => onAction("cancel")}
            aria-label="Отменить выбранные заказы"
          >
            Отменить
          </button>
          <button
            className="btn whitespace-nowrap min-h-[36px]"
            onClick={() => onAction("export")}
            aria-label="Экспортировать выбранные заказы"
          >
            Экспорт выбранных
          </button>
          <button
            className="btn whitespace-nowrap min-h-[36px]"
            onClick={() => onAction("assign")}
            aria-label="Назначить ответственного для выбранных заказов"
          >
            Назначить ответственного
          </button>
        </div>
      </div>
    </div>
  );
}