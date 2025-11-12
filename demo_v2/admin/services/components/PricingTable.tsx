// app/demo/admin/services/components/PricingTable.tsx
"use client";

import { useMemo, useState } from "react";

export type PricingRow = {
  id: string;
  name: string;
  basePrice: number;
  promoPrice: number | null;
  promoFrom: string;
  promoTo: string;
};

type RowState = PricingRow & {
  _errBase?: boolean;
  _errPromoPrice?: boolean;
  _errDates?: boolean;
};

// small helper like clsx
function cls(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function toCSV(rows: PricingRow[]) {
  const head = ["ID", "Название", "Базовая", "Акционная", "С даты", "По дату"];
  const esc = (value: unknown) => {
    const str = String(value ?? "");
    return /[",;\n\r]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };
  const body = rows.map((r) =>
    [r.id, r.name, r.basePrice ?? 0, r.promoPrice ?? "", r.promoFrom ?? "", r.promoTo ?? ""]
      .map(esc)
      .join(";")
  );
  // \r\n и BOM — чтобы Excel на Windows открыл корректно
  return [head.join(";"), ...body].join("\r\n");
}

function validateRow(r: PricingRow): RowState {
  const baseOk = Number.isFinite(r.basePrice) && r.basePrice >= 0;
  const promoOk =
    r.promoPrice == null ||
    (Number.isFinite(r.promoPrice) &&
      r.promoPrice >= 0 &&
      r.promoPrice < (r.basePrice || 0));
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

  const update = (index: number, patch: Partial<PricingRow>) => {
    setData((prev) => {
      const next = prev.slice();
      next[index] = validateRow({ ...(next[index] as PricingRow), ...patch });
      return next;
    });
  };

  const massPlus10 = () =>
    setData((prev) =>
      prev.map((row) =>
        validateRow({
          ...(row as PricingRow),
          basePrice: Math.max(0, Math.round((row.basePrice || 0) * 1.1)),
        })
      )
    );

  const clearPromo = () =>
    setData((prev) =>
      prev.map((row) =>
        validateRow({ ...(row as PricingRow), promoPrice: null, promoFrom: "", promoTo: "" })
      )
    );

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

  const hasErrors = data.some((row) => row._errBase || row._errPromoPrice || row._errDates);

  const save = () => {
    if (hasErrors) {
      alert("Исправьте ошибки в таблице перед сохранением.");
      return;
    }
    alert("Изменения сохранены (демо)");
  };

  return (
    <section className="rounded-2xl border border-white/12 bg-white/8">
      <div className="sticky top-0 z-10 border-b border-white/12 bg-[#060912]/90 px-3 py-3 md:px-4 md:py-4 backdrop-blur">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={massPlus10}
            className="rounded-lg border border-white/12 bg-white/10 px-3 py-1.5 text-sm text-white/85 transition hover:border-white/18 hover:bg-white/16"
            title="+10% ко всем базовым ценам"
          >
            +10% ко всем
          </button>
          <button
            onClick={clearPromo}
            className="rounded-lg border border-white/12 bg-white/10 px-3 py-1.5 text-sm text-white/85 transition hover:border-white/18 hover:bg-white/16"
            title="Убрать все промо-цены"
          >
            Снять акции
          </button>

          <div className="ml-auto flex items-center gap-2">
            {hasErrors && (
              <span className="rounded-lg bg-amber-400/15 px-2 py-1 text-xs text-amber-200">
                Есть ошибки — проверьте поля
              </span>
            )}
            <button
              onClick={exportCsv}
              className="rounded-lg border border-white/12 bg-white/10 px-3 py-1.5 text-sm text-white/85 transition hover:border-white/18 hover:bg-white/16"
              title="Экспорт CSV"
            >
              Экспорт
            </button>
            <button
              onClick={save}
              className="rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-black transition hover:bg-white/90 disabled:opacity-40"
              disabled={hasErrors}
              title={hasErrors ? "Исправьте ошибки" : "Сохранить изменения"}
            >
              Сохранить
            </button>
          </div>
        </div>
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-white/12 text-left">
              <th className="p-3">Услуга</th>
              <th className="p-3 text-right">Базовая цена</th>
              <th className="p-3 text-right">Акционная</th>
              <th className="p-3">С даты</th>
              <th className="p-3">По дату</th>
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
            {data.map((row, index) => {
              const errAny = row._errBase || row._errPromoPrice || row._errDates;
              return (
                <tr
                  key={row.id}
                  className={cls(
                    "border-b border-white/8 transition hover:bg-white/8",
                    errAny && "bg-rose-400/5"
                  )}
                >
                  <td className="p-3">{row.name}</td>
                  <td className="p-3 text-right">
                    <input
                      type="number"
                      min={0}
                      value={Number.isFinite(row.basePrice) ? row.basePrice : 0}
                      onChange={(e) => update(index, { basePrice: Number(e.target.value) })}
                      className={cls(
                        "w-32 rounded border px-2 py-1 text-right outline-none transition",
                        row._errBase ? "border-rose-400 bg-rose-400/10" : "border-white/12 bg-white/10"
                      )}
                      aria-label="Базовая цена"
                    />
                  </td>
                  <td className="p-3 text-right">
                    <input
                      type="number"
                      min={0}
                      value={row.promoPrice ?? ""}
                      onChange={(e) =>
                        update(index, {
                          promoPrice: e.target.value === "" ? null : Number(e.target.value),
                        })
                      }
                      className={cls(
                        "w-32 rounded border px-2 py-1 text-right outline-none transition",
                        row._errPromoPrice ? "border-rose-400 bg-rose-400/10" : "border-white/12 bg-white/10"
                      )}
                      placeholder="—"
                      aria-label="Акционная цена"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="date"
                      value={row.promoFrom || ""}
                      onChange={(e) => update(index, { promoFrom: e.target.value })}
                      className={cls(
                        "rounded border px-2 py-1 outline-none transition",
                        row._errDates ? "border-rose-400 bg-rose-400/10" : "border-white/12 bg-white/10"
                      )}
                      aria-label="Дата начала акции"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="date"
                      value={row.promoTo || ""}
                      onChange={(e) => update(index, { promoTo: e.target.value })}
                      className={cls(
                        "rounded border px-2 py-1 outline-none transition",
                        row._errDates ? "border-rose-400 bg-rose-400/10" : "border-white/12 bg-white/10"
                      )}
                      aria-label="Дата окончания акции"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-white/10 md:hidden">
        {data.length === 0 ? (
          <div className="p-6 text-center text-sm text-white/70">Ничего не найдено.</div>
        ) : (
          data.map((row, index) => {
            const errAny = row._errBase || row._errPromoPrice || row._errDates;
            return (
              <div key={row.id} className={cls("p-3", errAny && "bg-rose-400/5")}>
                <div className="text-sm font-medium text-white">{row.name}</div>

                <div className="mt-2 grid grid-cols-2 gap-2">
                  <label className="grid gap-1">
                    <span className="text-[11px] opacity-70">Базовая (₽)</span>
                    <input
                      type="number"
                      min={0}
                      value={Number.isFinite(row.basePrice) ? row.basePrice : 0}
                      onChange={(e) => update(index, { basePrice: Number(e.target.value) })}
                      className={cls(
                        "rounded border px-2 py-1 text-sm outline-none transition",
                        row._errBase ? "border-rose-400 bg-rose-400/10" : "border-white/12 bg-white/10"
                      )}
                      aria-label="Базовая цена"
                    />
                  </label>

                  <label className="grid gap-1">
                    <span className="text-[11px] opacity-70">Акционная (₽)</span>
                    <input
                      type="number"
                      min={0}
                      value={row.promoPrice ?? ""}
                      onChange={(e) =>
                        update(index, {
                          promoPrice: e.target.value === "" ? null : Number(e.target.value),
                        })
                      }
                      className={cls(
                        "rounded border px-2 py-1 text-sm outline-none transition",
                        row._errPromoPrice ? "border-rose-400 bg-rose-400/10" : "border-white/12 bg-white/10"
                      )}
                      placeholder="—"
                      aria-label="Акционная цена"
                    />
                  </label>

                  <label className="grid gap-1">
                    <span className="text-[11px] opacity-70">С даты</span>
                    <input
                      type="date"
                      value={row.promoFrom || ""}
                      onChange={(e) => update(index, { promoFrom: e.target.value })}
                      className={cls(
                        "rounded border px-2 py-1 text-sm outline-none transition",
                        row._errDates ? "border-rose-400 bg-rose-400/10" : "border-white/12 bg-white/10"
                      )}
                      aria-label="Дата начала акции"
                    />
                  </label>

                  <label className="grid gap-1">
                    <span className="text-[11px] opacity-70">По дату</span>
                    <input
                      type="date"
                      value={row.promoTo || ""}
                      onChange={(e) => update(index, { promoTo: e.target.value })}
                      className={cls(
                        "rounded border px-2 py-1 text-sm outline-none transition",
                        row._errDates ? "border-rose-400 bg-rose-400/10" : "border-white/12 bg-white/10"
                      )}
                      aria-label="Дата окончания акции"
                    />
                  </label>
                </div>

                {errAny && (
                  <div className="mt-2 rounded-lg border border-rose-400/30 bg-rose-400/10 p-2 text-xs text-rose-200">
                    Проверьте: базовая цена неотрицательная, акционная ниже базовой, период корректный.
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