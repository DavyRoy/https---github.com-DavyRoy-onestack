"use client";

export default function AuditStrip({ className = "" }: { className?: string }) {
  return (
    <div
      className={`
        text-xs text-white/60 break-words truncate
        ${className}
      `}
    >
      Обновлено: <span className="text-white/70">2025-01-10 12:00</span> •{" "}
      <span className="text-white/80">user@example.com</span>
    </div>
  );
}