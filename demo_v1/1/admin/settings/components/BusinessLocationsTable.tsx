"use client";

type Row = {
  id: string;
  name: string;
  city?: string;
  country?: string;
  tz?: string;
  phone?: string | null;
  active?: boolean;
};

export default function BusinessLocationsTable({
  rows,
  onEdit,
  onToggleActive,
  onCreate,
}: {
  rows: Row[];
  onEdit: (id: string) => void;
  onToggleActive: (id: string) => void;
  onCreate: () => void;
}) {
  return (
    <div className="grid gap-3 w-full max-w-full min-w-0">
      {/* Заголовок + action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="text-lg font-medium">Локации/филиалы</div>
        <button
          onClick={onCreate}
          className="w-full sm:w-auto rounded-lg border border-white/15 px-3 py-1.5 hover:bg-white/[0.08]"
        >
          Добавить
        </button>
      </div>

      {/* Мобайл-вид: карточки */}
      <ul className="grid gap-2 md:hidden">
        {rows.length === 0 && (
          <li className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center text-white/70">
            Нет локаций
          </li>
        )}

        {rows.map((r) => (
          <li
            key={r.id}
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="font-medium truncate">{r.name}</div>
                <div className="text-xs text-white/60">
                  {(r.city || "—")}{r.country ? `, ${r.country}` : ""}
                </div>
                <div className="mt-1 text-xs text-white/60">
                  TZ: {r.tz || "—"} • Тел: {r.phone || "—"}
                </div>
              </div>
              <span
                className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] ${
                  r.active
                    ? "border-emerald-500/40 text-emerald-300"
                    : "border-slate-400/30 text-slate-300/80"
                }`}
              >
                {r.active ? "Активна" : "Не активна"}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                onClick={() => onEdit(r.id)}
                className="col-span-2 rounded-lg border border-white/15 px-3 py-2 hover:bg-white/[0.08]"
              >
                Открыть
              </button>
              <button
                onClick={() => onToggleActive(r.id)}
                className="col-span-2 rounded-lg border border-white/15 px-3 py-2 hover:bg-white/[0.08]"
              >
                {r.active ? "Отключить" : "Включить"}
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Десктоп/планшет: таблица */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-white/10">
        <table className="min-w-[820px] w-full text-sm">
          <thead className="bg-white/[0.04] text-white/80">
            <tr>
              <th className="text-left p-2">Название</th>
              <th className="text-left p-2">Город/Страна</th>
              <th className="text-left p-2">TZ</th>
              <th className="text-left p-2">Телефон</th>
              <th className="text-left p-2">Активна</th>
              <th className="text-right p-2">Действия</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-white/10">
                <td className="p-2">{r.name}</td>
                <td className="p-2">
                  {r.city || "—"}
                  {r.country ? `, ${r.country}` : ""}
                </td>
                <td className="p-2">{r.tz || "—"}</td>
                <td className="p-2">{r.phone || "—"}</td>
                <td className="p-2">{r.active ? "Да" : "Нет"}</td>
                <td className="p-2 text-right space-x-2 whitespace-nowrap">
                  <button
                    onClick={() => onEdit(r.id)}
                    className="rounded border border-white/15 px-2 py-1 hover:bg-white/[0.08]"
                  >
                    Открыть
                  </button>
                  <button
                    onClick={() => onToggleActive(r.id)}
                    className="rounded border border-white/15 px-2 py-1 hover:bg-white/[0.08]"
                  >
                    {r.active ? "Отключить" : "Включить"}
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td className="p-3 text-center text-white/70" colSpan={6}>
                  Нет локаций
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}