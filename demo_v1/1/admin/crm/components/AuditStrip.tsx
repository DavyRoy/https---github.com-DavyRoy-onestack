"use client";

export function AuditStrip() {
  return (
    <div className="text-xs text-white/60 mt-3">
      Обновлено демо-пользователем 2025-10-02 12:00
    </div>
  );
}

export function DangerZone() {
  return (
    <button
      onClick={() => alert("Демо-действие")}
      className="px-3 py-2 rounded-lg border border-rose-400/40 text-rose-300 hover:bg-rose-400/10"
    >
      Опасные действия (демо)
    </button>
  );
}