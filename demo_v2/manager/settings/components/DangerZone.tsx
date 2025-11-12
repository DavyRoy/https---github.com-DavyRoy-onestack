"use client";

import { toast } from "sonner";

export default function DangerZone() {
  return (
    <div className="rounded-xl border border-red-300/30 bg-red-300/10 p-3">
      <div className="text-sm font-medium">Опасная зона</div>
      <div className="mt-1 text-xs opacity-80">Действия нельзя отменить (демо)</div>
      <div className="mt-2">
        <button
          onClick={() => toast("Завершены все активные сессии (демо)")}
          className="rounded-lg bg-red-500 px-3 py-1.5 text-sm text-white hover:bg-red-600"
        >
          Выйти из всех устройств
        </button>
      </div>
    </div>
  );
}