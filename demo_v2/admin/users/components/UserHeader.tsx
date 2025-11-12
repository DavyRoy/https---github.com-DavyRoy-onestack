"use client";

import React from "react";
import { Circle } from "lucide-react";

type User = {
  name: string;
  email: string;
  status: string;
};

export default function UserHeader({ user }: { user: User }) {
  const statusMap: Record<
    string,
    { label: string; color: string; iconColor: string }
  > = {
    active: {
      label: "Активен",
      color: "border-emerald-500/40 text-emerald-400 bg-emerald-500/5",
      iconColor: "text-emerald-400",
    },
    invited: {
      label: "Приглашён",
      color: "border-amber-400/40 text-amber-300 bg-amber-400/5",
      iconColor: "text-amber-300",
    },
    suspended: {
      label: "Заблокирован",
      color: "border-rose-400/40 text-rose-300 bg-rose-400/5",
      iconColor: "text-rose-300",
    },
    default: {
      label: "Неизвестно",
      color: "border-white/20 text-white/70 bg-white/5",
      iconColor: "text-white/70",
    },
  };

  const st = statusMap[user.status] ?? statusMap.default;

  return (
    <header
      className="
        rounded-2xl border border-white/15 bg-white/[0.05]
        p-4 md:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3
        transition-colors
      "
    >
      {/* Информация о пользователе */}
      <div className="min-w-0 flex-1">
        <div className="text-xl font-semibold truncate" title={user.name}>
          {user.name}
        </div>
        <div
          className="text-white/70 text-sm truncate"
          title={user.email}
          aria-label={`Email пользователя: ${user.email}`}
        >
          {user.email}
        </div>
      </div>

      {/* Статус */}
      <div
        className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border font-medium shrink-0 ${st.color}`}
        role="status"
        aria-label={`Статус пользователя: ${st.label}`}
      >
        <Circle className={`w-3 h-3 ${st.iconColor}`} aria-hidden="true" />
        <span className="capitalize">{st.label}</span>
      </div>
    </header>
  );
}