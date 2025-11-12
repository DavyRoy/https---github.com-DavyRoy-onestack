"use client";

import React from "react";

type RateRow = {
  id: string;
  from: string;   // ISO 4217, 3 буквы
  to: string;     // ISO 4217, 3 буквы
  rate: number;   // > 0
  source: "manual" | "demo";
  updated?: string; // безопасная строка, без динамических дат
};

type Props = {
  rows: RateRow[];
  onChange: (r: RateRow[]) => void;
};

export default function RatesTable({ rows, onChange }: Props) {
  // helpers
  const add = () => {
    // генерим id только по клику (не в рендере), чтобы не было SSR-расхождений
    const id = typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `rate_${Date.now().toString(36)}`;

    onChange([
      { id, from: "USD", to: "RUB", rate: 90, source: "manual", updated: "—" },
      ...rows,
    ]);
  };

  const patch = (id: string, p: Partial<RateRow>) =>
    onChange(rows.map((r) => (r.id === id ? { ...r, ...p } : r)));

  const remove = (id: string) => onChange(rows.filter((x) => x.id !== id));

  const normalizeCode = (s: string) => s.trim().toUpperCase().slice(0, 3);
  const parseRate = (v: string) => {
    const n = Number(v.replace(",", "."));
    return Number.isFinite(n) && n >= 0 ? n : 0;
  };

  const codeIsBad = (c: string) => !/^[A-Z]{3}$/.test(c);

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
            {rows.map((r) => {
              const fromBad = codeIsBad(r.from);
              const toBad = codeIsBad(r.to);
              const rateBad = !Number.isFinite(r.rate) || r.rate <= 0;

              return (
                <tr key={r.id} className="border-t border-white/10 align-top">
                  {/* FROM */}
                  <td className="p-2 align-middle">
                    <input
                      aria-label="Валюта из (ISO 4217)"
                      className={`w-24 md:w-28 rounded px-2 py-1 outline-none focus:ring-2 uppercase
                        bg-white/5 border ${fromBad ? "border-rose-400/50 focus:ring-rose-400/30" : "border-white/10 focus:ring-white/20"}`}
                      value={r.from}
                      onChange={(e) => patch(r.id, { from: e.target.value.toUpperCase() })}
                      onBlur={(e) => patch(r.id, { from: normalizeCode(e.target.value) })}
                      placeholder="USD"
                      inputMode="text"
                      maxLength={3}
                    />
                    {fromBad && (
                      <div className="mt-1 text-[11px] text-rose-300">3 буквы, напр. USD</div>
                    )}
                  </td>

                  {/* TO */}
                  <td className="p-2 align-middle">
                    <input
                      aria-label="Валюта в (ISO 4217)"
                      className={`w-24 md:w-28 rounded px-2 py-1 outline-none focus:ring-2 uppercase
                        bg-white/5 border ${toBad ? "border-rose-400/50 focus:ring-rose-400/30" : "border-white/10 focus:ring-white/20"}`}
                      value={r.to}
                      onChange={(e) => patch(r.id, { to: e.target.value.toUpperCase() })}
                      onBlur={(e) => patch(r.id, { to: normalizeCode(e.target.value) })}
                      placeholder="RUB"
                      inputMode="text"
                      maxLength={3}
                    />
                    {toBad && (
                      <div className="mt-1 text-[11px] text-rose-300">3 буквы, напр. RUB</div>
                    )}
                  </td>

                  {/* RATE */}
                  <td className="p-2 align-middle">
                    <input
                      aria-label="Курс (> 0)"
                      type="number"
                      step="0.0001"
                      min={0}
                      inputMode="decimal"
                      className={`w-28 md:w-32 rounded px-2 py-1 outline-none focus:ring-2
                        bg-white/5 border ${rateBad ? "border-rose-400/50 focus:ring-rose-400/30" : "border-white/10 focus:ring-white/20"}`}
                      value={Number.isFinite(r.rate) ? r.rate : 0}
                      onChange={(e) => patch(r.id, { rate: parseRate(e.target.value) })}
                      onBlur={(e) => {
                        const n = parseRate(e.target.value);
                        patch(r.id, { rate: n > 0 ? n : 0 });
                      }}
                    />
                    {rateBad && (
                      <div className="mt-1 text-[11px] text-rose-300">Должно быть &gt; 0</div>
                    )}
                  </td>

                  {/* SOURCE */}
                  <td className="p-2 align-middle">
                    <select
                      aria-label="Источник"
                      className="rounded bg-white/5 px-2 py-1 border border-white/10 outline-none focus:ring-2 focus:ring-white/20"
                      value={r.source}
                      onChange={(e) => patch(r.id, { source: e.target.value as RateRow["source"] })}
                    >
                      <option value="manual">manual</option>
                      <option value="demo">demo</option>
                    </select>
                  </td>

                  {/* UPDATED */}
                  <td className="p-2 align-middle text-white/70">
                    {r.updated || "—"}
                  </td>

                  {/* ACTIONS */}
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
              );
            })}

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

      {/* Подсказки */}
      <div className="text-xs text-white/50 space-y-1">
        <div>
          Поддерживаются коды ISO 4217 (например, <code>USD</code>, <code>RUB</code>, <code>KRW</code>).
        </div>
        <div>Курс должен быть положительным числом; запятая в десятичной части будет автоматически приведена к точке.</div>
      </div>
    </div>
  );
}