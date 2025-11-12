"use client";

import React from "react";

type Alert = {
  id: string;
  severity: "warn" | "critical";
  title: string;
  hint: string;
};

export default function AlertsPanel({ items }: { items: Alert[] }) {
  // Цветовые схемы для разных уровней алертов
  const style = (s: Alert["severity"]) =>
    s === "critical"
      ? "border-rose-500/40 bg-rose-500/10 text-rose-300"
      : "border-amber-500/40 bg-amber-500/10 text-amber-300";

  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.03] p-4 md:p-5">
      <div className="text-sm text-white/70 mb-3 font-medium">Алерты</div>

      {items.length === 0 ? (
        <div className="text-sm text-white/50">Нет активных алертов</div>
      ) : (
        <div className="grid gap-3">
          {items.map((a) => (
            <div
              key={a.id}
              className={`rounded-xl border ${style(
                a.severity
              )} p-3 transition hover:bg-white/[0.06]`}
            >
              <div className="font-medium leading-tight">{a.title}</div>
              <div className="text-sm text-white/70 mt-0.5">{a.hint}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}