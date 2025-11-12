"use client";

import React from "react";

export default function AuditStrip({
  updatedAt = "2025-10-06T12:00:00Z",
  user = "admin@example.com",
}: {
  updatedAt?: string;
  user?: string;
}) {
  const d = new Date(updatedAt);
  const formatted = d.toLocaleString("ru-RU", {
    dateStyle: "short",
    timeStyle: "short",
  });

  return (
    <div className="text-xs text-white/60 flex flex-wrap items-center gap-1 mt-1">
      <span>Последнее изменение:</span>
      <span className="text-white/80 font-medium">{formatted}</span>
      <span className="text-white/50">•</span>
      <span className="text-white/80">{user}</span>
    </div>
  );
}