"use client";

import { useState } from "react";

export default function PolicyNote({ cancellation, depositPolicy, reminders }: { cancellation: string; depositPolicy?: string; reminders: string }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <section className="space-y-3 rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/70 p-4 shadow-sm">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="flex w-full items-center justify-between text-sm font-semibold text-[hsl(var(--fg))]"
      >
        Правила и напоминания
        <span className="text-xs text-[hsl(var(--muted))]">{expanded ? "Скрыть" : "Показать"}</span>
      </button>
      {expanded ? (
        <div className="space-y-2 text-sm text-[hsl(var(--muted))]">
          <p>{cancellation}</p>
          {depositPolicy ? <p>{depositPolicy}</p> : null}
          <p>{reminders}</p>
        </div>
      ) : (
        <p className="text-xs text-[hsl(var(--muted))]">{cancellation}</p>
      )}
    </section>
  );
}
