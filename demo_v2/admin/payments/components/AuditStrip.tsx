// app/demo/admin/payments/components/AuditStrip.tsx
"use client";

import * as React from "react";

type Props = {
  updatedAt?: string;
  user?: string;
};

export default function AuditStrip({
  updatedAt = "2025-10-06T12:00:00Z",
  user = "admin@example.com",
}: Props) {
  const d = new Date(updatedAt);
  const formatted = d.toLocaleString("ru-RU", {
    dateStyle: "short",
    timeStyle: "short",
  });

  return (
    <div
      className="text-xs text-white/60 flex flex-wrap items-center gap-1 mt-1"
      role="note"
      aria-label={`Последнее изменение ${formatted} пользователем ${user}`}
    >
      <span className="text-white/60">🕓 Последнее изменение:</span>
      <span className="text-white/90 font-medium">{formatted}</span>
      <span className="opacity-60">•</span>
      <span className="text-white/80 break-all">{user}</span>
    </div>
  );
}