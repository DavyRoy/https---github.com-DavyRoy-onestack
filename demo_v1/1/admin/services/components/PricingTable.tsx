"use client";

import { useMemo, useState } from "react";

export type PricingRow = {
  id: string;
  name: string;
  basePrice: number;
  promoPrice: number | null;
  promoFrom: string; // YYYY-MM-DD
  promoTo: string;   // YYYY-MM-DD
};

type RowState = PricingRow & {
  /** служебные флаги валидации */
  _errBase?: boolean;
  _errPromoPrice?: boolean;
  _errDates?: boolean;
};

function toCSV(rows: PricingRow[]) {
  const head = ["ID", "Название", "Базовая", "Акционная", "С даты", "По дату"];
  const esc = (s: any) => {
    const str = String(s ?? "");
    return /[",;\n\r]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };
  const body = rows.map(r =>
    [r.id, r.name, r.basePrice ?? 0, r.promoPrice ?? "", r.promoFrom ?? "", r.promoTo ?? ""]
      .map(esc)
      .join(";")
  );
  return [head.join(";"), ...body].join("\r\n");
}

function validateRow(r: PricingRow): RowState {
  const baseOk = Number.isFinite(r.basePrice) && r.basePrice >= 0;
  const promoOk =
    r.promoPrice == null ||
    (Number.isFinite(r.promoPrice) && r.promoPrice >= 0 && r.promoPrice < (r.basePrice || 0));
  const datesOk =
    (!r.promoFrom && !r.promoTo) ||
    (!!r.promoFrom && !!r.promoTo && r.promoFrom <= r.promoTo);

  return {
    ...r,
    _errBase: !baseOk,
    _errPromoPrice: !promoOk,
    _errDates: !datesOk,
  };
}

export default function PricingTable({ rows = [] as PricingRow[] }: { rows?: PricingRow[] }) {
  const initial = useMemo<PricingRow[]>(() => (Array.isArray(rows) ? rows : []), [rows]);
  const [data, setData] = useState<RowState[]>(initial.map(validateRow));

  const update = (i: number, patch: Partial<PricingRow>) => {
    setData(prev => {
      const next = prev.slice();
      next[i] = validateRow({ ...next[i], ...patch });
      return next;
    });
  };

  const massPlus10 = () =>
    setData(d =>
      d.map(r => validateRow({ ...r, basePrice: Math.max(0, Math.round((r.basePrice || 0) * 1.1)) }))
    );

  const clearPromo = () =>
    setData(d => d.map(r => validateRow({ ...r, promoPrice: null, promoFrom: "", promoTo: "" })));

  const exportCsv = () => {
    const csv = toCSV(data);
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.setAttribute("download", "pricing.csv");
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const hasErrors = data.some(r => r._errBase || r._errPromoPrice || r._errDates);

  const save = () => {
    if (hasErrors) {
      alert("Исправьте ошибки в таблице перед сохранением.");
      return;
    }
    alert("Изменения сохранены (демо)");
  };

  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05]">
      {/* панель действий (липкая) */}
      <div className="sticky top-0 z-10 border-b border-white/10 bg-white/5 backdrop-blur p-3 md:p-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={massPlus10}
            className="rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15"
            title="+10% ко всем базовым ценам"
          >
            +10% ко всем
          </button>
          <button
            onClick={clearPromo}
            className="rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15"
            title="Убрать все промо-цены и периоды"
          >
            Снять акции
          </button>

          <div className="ml-auto flex items-center gap-2">
            {hasErrors && (
              <span className="rounded-lg bg-amber-400/15 px-2 py-1 text-xs text-amber-300">
                Есть ошибки — проверьте поля
              </span>
            )}
            <button
              onClick={exportCsv}
              className="rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15"
              title="Экспорт CSV"
            >
              Экспорт
            </button>
            <button
              onClick={save}
              className="rounded-lg bg-white px-3 py-1.5 text-sm text-black hover:bg-white/90 disabled:opacity-50"
              disabled={hasErrors}
              title={hasErrors ? "Исправьте ошибки" : "Сохранить изменения"}
            >
              Сохранить
            </button>
          </div>
        </div>
      </div>

      {/* desktop-таблица */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="p-3 text-left">Услуга</th>
              <th className="p-3 text-right">Базовая цена</th>
              <th className="p-3 text-right">Акционная</th>
              <th className="p-3 text-left">С даты</th>
              <th className="p-3 text-left">По дату</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-white/70">
                  Ничего не найдено.
                </td>
              </tr>
            )}
            {data.map((r, i) => {
              const errAny = r._errBase || r._errPromoPrice || r._errDates;
              return (
                <tr
                  key={r.id}
                  className={`border-b border-white/5 hover:bg-white/5 ${errAny ? "bg-rose-400/5" : ""}`}
                >
                  <td className="p-3">{r.name}</td>

                  <td className="p-3 text-right">
                    <input
                      type="number"
                      min={0}
                      value={Number.isFinite(r.basePrice) ? r.basePrice : 0}
                      onChange={(e) => update(i, { basePrice: Number(e.target.value) })}
                      className={`w-32 rounded border px-2 py-1 text-right outline-none ${
                        r._errBase ? "border-rose-400 bg-rose-400/10" : "border-white/15 bg-white/10"
                      }`}
                      aria-invalid={r._errBase}
                      title={r._errBase ? "Цена должна быть неотрицательной" : "Базовая цена"}
                    />
                  </td>

                  <td className="p-3 text-right">
                    <input
                      type="number"
                      min={0}
                      value={r.promoPrice ?? ""}
                      onChange={(e) =>
                        update(i, { promoPrice: e.target.value === "" ? null : Number(e.target.value) })
                      }
                      className={`w-32 rounded border px-2 py-1 text-right outline-none ${
                        r._errPromoPrice ? "border-rose-400 bg-rose-400/10" : "border-white/15 bg-white/10"
                      }`}
                      placeholder="—"
                      aria-invalid={r._errPromoPrice}
                      title={
                        r._errPromoPrice
                          ? "Акционная цена должна быть меньше базовой и неотрицательной"
                          : "Акционная цена (опц.)"
                      }
                    />
                  </td>

                  <td className="p-3">
                    <input
                      type="date"
                      value={r.promoFrom || ""}
                      onChange={(e) => update(i, { promoFrom: e.target.value })}
                      className={`rounded border px-2 py-1 outline-none ${
                        r._errDates ? "border-rose-400 bg-rose-400/10" : "border-white/15 bg-white/10"
                      }`}
                      aria-invalid={r._errDates}
                      title={r._errDates ? "Дата начала должна быть ≤ даты окончания" : "Дата начала акции"}
                    />
                  </td>

                  <td className="p-3">
                    <input
                      type="date"
                      value={r.promoTo || ""}
                      onChange={(e) => update(i, { promoTo: e.target.value })}
                      className={`rounded border px-2 py-1 outline-none ${
                        r._errDates ? "border-rose-400 bg-rose-400/10" : "border-white/15 bg-white/10"
                      }`}
                      aria-invalid={r._errDates}
                      title={r._errDates ? "Дата окончания должна быть ≥ даты начала" : "Дата окончания акции"}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* mobile-карточки */}
      <div className="md:hidden divide-y divide-white/10">
        {data.length === 0 ? (
          <div className="p-6 text-center text-sm text-white/70">Ничего не найдено.</div>
        ) : (
          data.map((r, i) => {
            const errAny = r._errBase || r._errPromoPrice || r._errDates;
            return (
              <div key={r.id} className={`p-3 ${errAny ? "bg-rose-400/5" : ""}`}>
                <div className="text-sm font-medium">{r.name}</div>

                <div className="mt-2 grid grid-cols-2 gap-2">
                  <label className="grid gap-1">
                    <span className="text-[11px] opacity-70">Базовая (₽)</span>
                    <input
                      type="number"
                      min={0}
                      value={Number.isFinite(r.basePrice) ? r.basePrice : 0}
                      onChange={(e) => update(i, { basePrice: Number(e.target.value) })}
                      className={`rounded border px-2 py-1 text-sm outline-none ${
                        r._errBase ? "border-rose-400 bg-rose-400/10" : "border-white/15 bg-white/10"
                      }`}
                    />
                  </label>

                  <label className="grid gap-1">
                    <span className="text-[11px] opacity-70">Акционная (₽)</span>
                    <input
                      type="number"
                      min={0}
                      value={r.promoPrice ?? ""}
                      onChange={(e) =>
                        update(i, { promoPrice: e.target.value === "" ? null : Number(e.target.value) })
                      }
                      className={`rounded border px-2 py-1 text-sm outline-none ${
                        r._errPromoPrice ? "border-rose-400 bg-rose-400/10" : "border-white/15 bg-white/10"
                      }`}
                      placeholder="—"
                    />
                  </label>

                  <label className="grid gap-1">
                    <span className="text-[11px] opacity-70">С даты</span>
                    <input
                      type="date"
                      value={r.promoFrom || ""}
                      onChange={(e) => update(i, { promoFrom: e.target.value })}
                      className={`rounded border px-2 py-1 text-sm outline-none ${
                        r._errDates ? "border-rose-400 bg-rose-400/10" : "border-white/15 bg-white/10"
                      }`}
                    />
                  </label>

                  <label className="grid gap-1">
                    <span className="text-[11px] opacity-70">По дату</span>
                    <input
                      type="date"
                      value={r.promoTo || ""}
                      onChange={(e) => update(i, { promoTo: e.target.value })}
                      className={`rounded border px-2 py-1 text-sm outline-none ${
                        r._errDates ? "border-rose-400 bg-rose-400/10" : "border-white/15 bg-white/10"
                      }`}
                    />
                  </label>
                </div>

                {errAny && (
                  <div className="mt-2 rounded-lg border border-rose-400/30 bg-rose-400/10 p-2 text-xs text-rose-200">
                    Проверьте: базовая цена ≥ 0, акционная — меньше базовой, период — корректный.
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}