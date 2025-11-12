"use client";

type AuditStripProps = {
  updatedBy?: string;
  updatedAt?: string;
  className?: string;
};

/**
 * Информационная полоска аудита под формами или карточками настроек.
 * Показывает дату и автора последнего изменения.
 */
export default function AuditStrip({
  updatedBy = "demo@admin",
  updatedAt = "2025-10-06 12:00",
  className = "",
}: AuditStripProps) {
  return (
    <div
      className={`
        flex flex-col sm:flex-row sm:items-center sm:justify-between
        text-[11px] sm:text-xs text-white/60
        mt-3 sm:mt-4 pt-2 border-t border-white/10
        ${className}
      `}
      aria-label="Информация об изменениях"
    >
      <div className="flex items-center gap-1.5">
        <span className="text-white/70">Последнее изменение:</span>
        <time
          className="text-white/90"
          dateTime={updatedAt}
          title={`Дата изменения — ${updatedAt}`}
        >
          {updatedAt}
        </time>
      </div>

      <div className="mt-1 sm:mt-0 flex items-center gap-1.5">
        <span className="text-white/70">Автор:</span>
        <span
          className="text-white/90 break-all"
          title={`Автор изменения — ${updatedBy}`}
        >
          {updatedBy}
        </span>
      </div>
    </div>
  );
}