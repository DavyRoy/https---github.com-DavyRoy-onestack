"use client";

import React from "react";

type Props = {
  user?: string;
  updatedAt?: string;
  className?: string;
};

export default function AuditStrip({
  user = "user@example.com",
  updatedAt = "2025-01-10T12:00:00Z",
  className = "",
}: Props) {
  // форматируем дату в локали пользователя
  const formatted = new Date(updatedAt).toLocaleString("ru-RU", {
    dateStyle: "short",
    timeStyle: "short",
  });

  return (
    <div
      aria-label="Информация об обновлении"
      className={`
        text-xs text-white/60 flex flex-wrap items-center gap-1
        truncate leading-snug ${className}
      `}
    >
      <span>Обновлено:</span>
      <span className="text-white/70">{formatted}</span>
      <span className="text-white/50">•</span>
      <span className="text-white/80 break-all">{user}</span>
    </div>
  );
}