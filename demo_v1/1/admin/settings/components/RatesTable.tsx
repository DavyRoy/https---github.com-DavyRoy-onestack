"use client";

import React from "react";

type RateRow = {
  id: string;
  from: string;
  to: string;
  rate: number;
  source: string;
  updated?: string;
};

export default function RatesTable({
  rows,
  onChange,
}: {
  rows: RateRow[];
  onChange: (r: RateRow[]) => void;
}) {
  const add = () => {
    // Генерим id детерминированно относительно клиента (в момент клика, не при SSR)
    const id = `rate_${Date.now().toString(36)}`;
    onChange([
      { id, from: "USD", to: "RUB", rate: 90, source: "manual", updated: "—" },
      ...rows,
    ]);
  };

  const update = (id: string, patch: Partial<RateRow>) =>
    onChange(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const remove = (id: string) => onChange(rows.filter((x) => x.id !== id));

  return (
    <div className="grid gap-3 w-full max-w-full min-w-0">
      {/* Шапка */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 min-w-0">
        <div className="text-lg font-medium">Курсы валют</div>
        <div className="flex w-full sm:w-auto">
          <button
            onClick={add}
            className="w-full sm:w-auto rounded-lg border border-white/15 px-3 py-2 text-sm hover:bg-white/[0.08] transition"
          >
            Добавить
          </button>
        </div>
      </div>

      {/* Таблица со скроллом внутри */}
      <div className="rounded-2xl border border-white/15 bg-white/[0.04] overflow-x-auto supports-[overflow:clip]:overflow-x-clip">
        <table className="min-w-[760px] w-full text-sm">
          <thead className="bg-white/[0.04] text-white/80">
            <tr>
              <th className="p-2 text-left">От</th>
              <th className="p-2 text-left">К</th>
              <th className="p-2 text-left">Курс</th>
              <th className="p-2 text-left">Источник</th>
              <th className="p-2 text-left">Обновлено</th>
              <th className="p-2 text-right">Действия</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-white/10">
                <td className="p-2 align-middle">
                  <input
                    aria-label="Валюта из"
                    className="w-24 md:w-28 rounded bg-white/5 px-2 py-1 border border-white/10 outline-none focus:ring-2 focus:ring-white/20 uppercase"
                    value={r.from}
                    onChange={(e) => update(r.id, { from: e.target.value })}
                  />
                </td>
                <td className="p-2 align-middle">
                  <input
                    aria-label="Валюта в"
                    className="w-24 md:w-28 rounded bg-white/5 px-2 py-1 border border-white/10 outline-none focus:ring-2 focus:ring-white/20 uppercase"
                    value={r.to}
                    onChange={(e) => update(r.id, { to: e.target.value })}
                  />
                </td>
                <td className="p-2 align-middle">
                  <input
                    aria-label="Курс"
                    type="number"
                    step="0.0001"
                    inputMode="decimal"
                    className="w-28 md:w-32 rounded bg-white/5 px-2 py-1 border border-white/10 outline-none focus:ring-2 focus:ring-white/20"
                    value={r.rate}
                    onChange={(e) =>
                      update(r.id, { rate: Number(e.target.value) })
                    }
                  />
                </td>
                <td className="p-2 align-middle">
                  <select
                    aria-label="Источник"
                    className="rounded bg-white/5 px-2 py-1 border border-white/10 outline-none focus:ring-2 focus:ring-white/20"
                    value={r.source}
                    onChange={(e) => update(r.id, { source: e.target.value })}
                  >
                    <option value="manual">manual</option>
                    <option value="demo">demo</option>
                  </select>
                </td>
                <td className="p-2 align-middle text-white/70">
                  {r.updated || "—"}
                </td>
                <td className="p-2 align-middle text-right">
                  <button
                    onClick={() => {
                      if (confirm("Удалить курс?")) remove(r.id);
                    }}
                    className="rounded border border-rose-400/40 text-rose-200 px-2 py-1 hover:bg-rose-500/10 transition"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-white/70">
                  Нет курсов
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Подсказка по формату */}
      <div className="text-xs text-white/50">
        Поддерживаются коды ISO 4217 (например, <code>USD</code>, <code>RUB</code>,{" "}
        <code>KRW</code>).
      </div>
    </div>
  );
}