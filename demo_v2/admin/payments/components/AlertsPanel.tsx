// app/demo/admin/payments/components/AlertsPanel.tsx
"use client";

import * as React from "react";

type Alert = {
  id: string;
  severity: "warn" | "critical";
  title: string;
  hint: string;
};

export default function AlertsPanel({ items }: { items: Alert[] }) {
  /** Цветовые схемы для разных уровней */
  const style = (s: Alert["severity"]) =>
    s === "critical"
      ? "border-rose-500/40 bg-rose-500/10 text-rose-300"
      : "border-amber-500/40 bg-amber-500/10 text-amber-300";

  /** Иконки для статусов */
  const icon = (s: Alert["severity"]) =>
    s === "critical" ? "⚠️" : "🟡";

  return (
    <section
      className="rounded-2xl border border-white/15 bg-white/[0.03] p-4 md:p-5"
      aria-labelledby="alerts-heading"
    >
      <div
        id="alerts-heading"
        className="text-sm text-white/70 mb-3 font-medium flex items-center gap-2"
      >
        🔔 Алерты
      </div>

      {items.length === 0 ? (
        <div className="text-sm text-white/50 italic">
          Нет активных алертов.
        </div>
      ) : (
        <ul className="grid gap-3">
          {items.map((a) => (
            <li
              key={a.id}
              className={`rounded-xl border ${style(
                a.severity
              )} p-3 transition hover:bg-white/[0.08]`}
              aria-label={`${a.severity === "critical" ? "Критический" : "Предупреждение"}: ${a.title}`}
            >
              <div className="flex items-start gap-2">
                <span className="text-lg leading-none pt-0.5">{icon(a.severity)}</span>
                <div className="min-w-0">
                  <div className="font-medium leading-tight truncate">{a.title}</div>
                  <div className="text-sm text-white/70 mt-0.5 break-words">
                    {a.hint}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}