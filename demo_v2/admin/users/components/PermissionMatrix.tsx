"use client";

import React from "react";

export type Rule = "allow" | "deny" | "own" | "location";

type Props = {
  modules: string[];
  actions: string[];
  /**
   * matrix[module][action] -> Rule
   */
  matrix: Record<string, Record<string, Rule>>;
  className?: string;
  title?: string; // подпись таблицы для a11y
};

export default function PermissionMatrix({
  modules,
  actions,
  matrix,
  className = "",
  title = "Матрица разрешений",
}: Props) {
  // Безопасные снапшоты, чтобы не перерендеривать список по ссылкам родителя
  const safeModules = React.useMemo(() => [...(modules ?? [])], [modules]);
  const safeActions = React.useMemo(() => [...(actions ?? [])], [actions]);

  const getCell = React.useCallback(
    (m: string, a: string): Rule => (matrix?.[m]?.[a] ?? "deny") as Rule,
    [matrix]
  );

  const Badge = React.useMemo(
    () =>
      function Badge({ v }: { v: Rule }) {
        const cls =
          v === "allow"
            ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/30"
            : v === "deny"
            ? "bg-rose-500/15 text-rose-300 border-rose-400/30"
            : v === "own"
            ? "bg-amber-500/20 text-amber-300 border-amber-400/30"
            : "bg-sky-500/20 text-sky-300 border-sky-400/30";

        const label =
          v === "allow" ? "✓ allow" : v === "deny" ? "— deny" : v;

        return (
          <span
            className={`inline-block rounded-md border px-2 py-0.5 text-[11px] leading-none ${cls}`}
            aria-label={label}
            title={label}
          >
            {label}
          </span>
        );
      },
    []
  );

  if (!safeModules.length || !safeActions.length) {
    return (
      <section className={`rounded-2xl border border-white/15 bg-white/[0.05] p-4 ${className}`}>
        <div className="text-sm text-white/70 mb-2">{title}</div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white/60">
          Нет данных для отображения матрицы.
        </div>
      </section>
    );
  }

  return (
    <section
      className={`rounded-2xl border border-white/15 bg-white/[0.05] p-3 md:p-4 ${className}`}
      aria-label={title}
      role="region"
    >
      {/* Легенда */}
      <div className="mb-3 flex flex-wrap gap-2 text-[11px] text-white/60">
        <span className="opacity-70">Легенда:</span>
        <Badge v="allow" />
        <Badge v="deny" />
        <Badge v="own" />
        <Badge v="location" />
      </div>

      {/* Мобильные карточки */}
      <div className="grid gap-2 sm:hidden" role="list">
        {safeModules.map((m) => (
          <div
            key={m}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-3"
            role="listitem"
          >
            <div className="text-sm font-medium mb-2 break-words">{m}</div>
            <div className="grid grid-cols-2 gap-2">
              {safeActions.map((a) => {
                const v = getCell(m, a);
                return (
                  <div key={`${m}-${a}`} className="min-w-0">
                    <div className="text-[11px] text-white/50 mb-1 truncate">{a}</div>
                    <Badge v={v} />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Десктоп/планшет — таблица со скроллом внутри */}
      <div className="hidden sm:block -mx-2 md:mx-0 overflow-x-auto">
        <div className="min-w-[740px] px-2 md:px-0">
          <table className="w-full text-sm">
            <caption className="sr-only">{title}</caption>
            <thead className="text-white/60">
              <tr className="border-b border-white/10">
                <th className="text-left p-2 md:p-3 whitespace-nowrap">Модуль</th>
                {safeActions.map((a) => (
                  <th key={a} className="text-left p-2 md:p-3 whitespace-nowrap">
                    {a}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {safeModules.map((m) => (
                <tr key={m} className="border-b border-white/8 hover:bg-white/[0.03]">
                  <th
                    scope="row"
                    className="p-2 md:p-3 align-middle font-medium text-white/90"
                    title={m}
                  >
                    <div className="max-w-[260px] truncate">{m}</div>
                  </th>
                  {safeActions.map((a) => {
                    const v = getCell(m, a);
                    return (
                      <td key={`${m}-${a}`} className="p-2 md:p-3 align-middle">
                        <Badge v={v} />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}