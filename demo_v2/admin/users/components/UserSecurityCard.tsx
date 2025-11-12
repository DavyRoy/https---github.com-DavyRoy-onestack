"use client";

import React from "react";

type User = { twoFA?: boolean };

export default function UserSecurityCard({
  user,
  onToggle2FA,
  onResetPassword,
}: {
  user: User;
  onToggle2FA?: (nextEnabled: boolean) => void;
  onResetPassword?: () => void;
}) {
  const [enabled, setEnabled] = React.useState(!!user.twoFA);

  // синхронизация, если родитель поменяет проп
  React.useEffect(() => {
    setEnabled(!!user.twoFA);
  }, [user.twoFA]);

  const handleToggle = () => {
    const next = !enabled;
    setEnabled(next);
    if (onToggle2FA) onToggle2FA(next);
    else alert(`Демо: 2FA ${next ? "включена" : "отключена"}.`);
  };

  const handleReset = () => {
    if (onResetPassword) onResetPassword();
    else alert("Демо: отправлена ссылка для сброса пароля.");
  };

  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5 min-w-0">
      <div className="text-sm text-white/70 mb-3">Безопасность</div>

      <div className="flex items-center gap-2 text-sm text-white/90">
        <span className="opacity-80">2FA:</span>
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs
            ${
              enabled
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                : "border-rose-500/40 bg-rose-500/10 text-rose-300"
            }`}
          aria-live="polite"
        >
          {enabled ? "включена" : "не включена"}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mt-4">
        <button
          type="button"
          onClick={handleToggle}
          className="w-full sm:w-auto rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/[0.08] transition"
          aria-pressed={enabled}
          aria-label={enabled ? "Отключить 2FA" : "Включить 2FA"}
        >
          {enabled ? "Отключить 2FA (демо)" : "Включить 2FA (демо)"}
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="w-full sm:w-auto rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/[0.08] transition"
          aria-label="Сброс пароля"
        >
          Сброс пароля (демо)
        </button>
      </div>

      <p className="mt-3 text-xs text-white/50">
        Примечание: в демо-режиме действия не выполняются и служат для иллюстрации UI.
      </p>
    </section>
  );
}