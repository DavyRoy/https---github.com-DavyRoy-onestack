"use client";

import * as React from "react";

/**
 * Лента аудита (подпись о последнем обновлении)
 * Автоматически форматирует дату и поддерживает кастомизацию
 */
export function AuditStrip({
  updatedBy = "демо-пользователем",
  updatedAt = "2025-10-02T12:00:00Z",
}: {
  updatedBy?: string;
  updatedAt?: string | Date;
}) {
  const dt = new Date(updatedAt);
  const human = dt.toLocaleString("ru-RU", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className="text-xs text-white/60 mt-3"
      aria-label={`Обновлено ${updatedBy} ${human}`}
    >
      Обновлено {updatedBy} {human}
    </div>
  );
}

/**
 * Зона опасных действий (демо)
 * В проде сюда можно подключить модальное подтверждение.
 */
export function DangerZone({
  onConfirm,
  label = "Опасные действия",
}: {
  onConfirm?: () => void;
  label?: string;
}) {
  const handleClick = React.useCallback(() => {
    if (onConfirm) return onConfirm();
    alert("⚠️ Демо-действие. В реальной CRM здесь появится подтверждение.");
  }, [onConfirm]);

  return (
    <button
      onClick={handleClick}
      className="px-3 py-2 rounded-lg border border-rose-400/40 text-rose-300 hover:bg-rose-400/10 transition-colors"
    >
      {label}
    </button>
  );
}