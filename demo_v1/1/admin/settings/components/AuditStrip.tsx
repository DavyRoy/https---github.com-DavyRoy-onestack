"use client";

export default function AuditStrip({
  updatedBy = "demo@admin",
  updatedAt = "2025-10-06 12:00",
  className = "",
}: {
  updatedBy?: string;
  updatedAt?: string;
  className?: string;
}) {
  return (
    <div
      className={`
        flex flex-col sm:flex-row sm:items-center sm:justify-between
        text-[11px] sm:text-xs text-white/60
        mt-3 sm:mt-4
        border-t border-white/10 pt-2
        ${className}
      `}
    >
      <div>
        <span className="text-white/70">Последнее изменение:</span>{" "}
        <span className="text-white/90">{updatedAt}</span>
      </div>
      <div className="mt-1 sm:mt-0">
        <span className="text-white/70">Автор:</span>{" "}
        <span className="text-white/90">{updatedBy}</span>
      </div>
    </div>
  );
}