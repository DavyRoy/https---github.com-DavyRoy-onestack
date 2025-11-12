"use client";

import { Download, Bell } from "lucide-react";

export default function QuickActions() {
  const actions = [
    {
      label: "Экспорт журнала (демо)",
      icon: <Download className="w-4 h-4" />,
      onClick: () => alert("Экспорт журнала (демо)"),
    },
    {
      label: "Подписка на алерты (демо)",
      icon: <Bell className="w-4 h-4" />,
      onClick: () => alert("Подписка на алерты (демо)"),
    },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((btn) => (
        <button
          key={btn.label}
          onClick={btn.onClick}
          className="
            flex items-center gap-2
            rounded-lg border border-white/15
            px-3 py-1.5
            text-sm
            hover:bg-white/[0.08]
            active:scale-[0.98]
            transition
          "
        >
          {btn.icon}
          <span>{btn.label}</span>
        </button>
      ))}
    </div>
  );
}