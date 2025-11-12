"use client";

type TaxRow = {
  id: string;
  name: string;
  rate: number;
  type: "vat" | "none" | "other";
  scope: string;
  active: boolean;
};

export default function TaxesTable({
  rows,
  onChange,
}: {
  rows: TaxRow[];
  onChange: (r: TaxRow[]) => void;
}) {
  const update = (id: string, patch: Partial<TaxRow>) =>
    onChange(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const remove = (id: string) => onChange(rows.filter((x) => x.id !== id));

  const add = () => {
    const id = `tax_${Date.now()}`;
    onChange([{ id, name: "Новая ставка", rate: 0, type: "vat", scope: "RU", active: true }, ...rows]);
  };

  return (
    <div className="grid gap-3 w-full max-w-full min-w-0">
      {/* Заголовок + действия */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="text-lg font-medium">Налоговые ставки</div>
        <div className="flex gap-2">
          <button
            onClick={add}
            className="rounded-lg border border-white/15 px-3 py-1.5 hover:bg-white/[0.08]"
          >
            Новая ставка
          </button>
        </div>
      </div>

      {/* Мобильный вид — карточки */}
      <div className="grid gap-3 md:hidden">
        {rows.length === 0 && (
          <div className="rounded-xl border border-white/10 p-3 text-center text-white/70">
            Нет ставок
          </div>
        )}

        {rows.map((r) => (
          <div key={r.id} className="rounded-2xl border border-white/15 bg-white/[0.05] p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="text-sm font-medium truncate">{r.name || "Без названия"}</div>
              <label className="inline-flex items-center gap-2 text-xs shrink-0">
                <input
                  type="checkbox"
                  checked={!!r.active}
                  onChange={(e) => update(r.id, { active: e.target.checked })}
                />
                Активна
              </label>
            </div>

            <div className="mt-3 grid gap-2">
              <label className="grid gap-1 text-xs">
                <span className="text-white/60">Название</span>
                <input
                  className="rounded-lg bg-white/5 px-3 py-2 border border-white/10"
                  value={r.name}
                  onChange={(e) => update(r.id, { name: e.target.value })}
                />
              </label>

              <div className="grid grid-cols-2 gap-2">
                <label className="grid gap-1 text-xs">
                  <span className="text-white/60">Ставка %</span>
                  <input
                    type="number"
                    className="rounded-lg bg-white/5 px-3 py-2 border border-white/10"
                    value={r.rate}
                    onChange={(e) => update(r.id, { rate: Number(e.target.value) })}
                  />
                </label>
              </div>

              <label className="grid gap-1 text-xs">
                <span className="text-white/60">Страны/Локации</span>
                <input
                  className="rounded-lg bg-white/5 px-3 py-2 border border-white/10"
                  value={r.scope}
                  onChange={(e) => update(r.id, { scope: e.target.value })}
                />
              </label>
            </div>

            <div className="mt-3 flex items-center justify-end">
              <button
                onClick={() => remove(r.id)}
                className="rounded-lg border border-rose-400/40 text-rose-200 px-3 py-1.5 hover:bg-rose-500/10 text-sm"
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Десктопный вид — таблица */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-white/10">
        <table className="min-w-[860px] w-full text-sm table-fixed">
          {/* prettier-ignore */}
          <colgroup><col className="w-[30%]"/><col className="w-[96px]"/><col className="w-[180px]"/><col className="w-[28%]"/><col className="w-[100px]"/><col className="w-[120px]"/></colgroup>
          <thead className="bg-white/[0.04] text-white/80">
            <tr>
              <th className="text-left p-2">Название</th>
              <th className="text-left p-2">Ставка %</th>
              <th className="text-left p-2">Тип</th>
              <th className="text-left p-2">Страны/Локации</th>
              <th className="text-left p-2">Активна</th>
              <th className="text-right p-2">Удалить</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-white/10">
                <td className="p-2">
                  <input
                    className="w-full bg-white/5 rounded px-2 py-1.5 border border-white/10"
                    value={r.name}
                    onChange={(e) => update(r.id, { name: e.target.value })}
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    className="w-full max-w-[84px] bg-white/5 rounded px-2 py-1.5 border border-white/10 text-right"
                    value={r.rate}
                    onChange={(e) => update(r.id, { rate: Number(e.target.value) })}
                  />
                </td>
                <td className="p-2">
                  <select
                    className="w-full bg-white/5 rounded px-2 py-1.5 border border-white/10"
                    value={r.type}
                    onChange={(e) => update(r.id, { type: e.target.value as TaxRow["type"] })}
                  >
                    <option value="vat">НДС</option>
                    <option value="none">Нет</option>
                    <option value="other">Другое</option>
                  </select>
                </td>
                <td className="p-2">
                  <input
                    className="w-full bg-white/5 rounded px-2 py-1.5 border border-white/10"
                    value={r.scope}
                    onChange={(e) => update(r.id, { scope: e.target.value })}
                  />
                </td>
                <td className="p-2">
                  <input
                    type="checkbox"
                    checked={!!r.active}
                    onChange={(e) => update(r.id, { active: e.target.checked })}
                  />
                </td>
                <td className="p-2 text-right">
                  <button
                    onClick={() => remove(r.id)}
                    className="rounded border border-red-400/40 text-red-300 px-2 py-1.5 hover:bg-red-500/10"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="p-3 text-center text-white/70">
                  Нет ставок
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}