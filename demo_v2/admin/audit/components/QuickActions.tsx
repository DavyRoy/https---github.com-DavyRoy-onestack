"use client";

import { useState } from "react";
import { Download, Bell } from "lucide-react";

type Action = {
  label: string;
  icon: JSX.Element;
  onClick: () => void;
  title?: string;
};

export default function QuickActions() {
  const [busy, setBusy] = useState<string | null>(null);

  const actions: Action[] = [
    {
      label: "Экспорт журнала (демо)",
      icon: <Download className="w-4 h-4" aria-hidden="true" />,
      onClick: () => alert("Экспорт журнала (демо)"),
      title: "Скачать выгрузку событий за период (демо)",
    },
    {
      label: "Подписка на алерты (демо)",
      icon: <Bell className="w-4 h-4" aria-hidden="true" />,
      onClick: () => alert("Подписка на алерты (демо)"),
      title: "Получать уведомления об инцидентах (демо)",
    },
  ];

  const handleClick = async (a: Action) => {
    if (busy) return;
    try {
      setBusy(a.label);
      await Promise.resolve(a.onClick());
    } finally {
      setBusy(null);
    }
  };

  return (
    <section
      className="admin-section border-white/12 bg-white/8"
      aria-labelledby="quick-actions-title"
    >
      <h2 id="quick-actions-title" className="sr-only">
        Быстрые действия аудита
      </h2>

      <div className="flex flex-wrap gap-2">
        {actions.map((btn) => (
          <button
            key={btn.label}
            type="button"
            onClick={() => handleClick(btn)}
            disabled={busy === btn.label}
            title={btn.title ?? btn.label}
            aria-busy={busy === btn.label}
            className={`
              inline-flex items-center gap-2 rounded-xl border border-white/12
              bg-white/10 px-3 py-1.5 text-sm text-white/85 transition
              hover:border-white/18 hover:bg-white/16 active:scale-[0.98]
              focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30
              disabled:opacity-60 disabled:cursor-not-allowed
            `}
          >
            {btn.icon}
            <span>{btn.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}