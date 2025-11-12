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

function StatusBadge({ active }: { active?: boolean }) {
  const cls = active
    ? "border-emerald-500/40 text-emerald-300"
    : "border-slate-400/30 text-slate-300/85";
  return (
    <span
      className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] uppercase ${cls}`}
      aria-label={active ? "Локация активна" : "Локация не активна"}
    >
      {active ? "Активна" : "Не активна"}
    </span>
  );
}

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
  const fmtPlace = (r: Row) =>
    r.country ? `${r.city || "—"}, ${r.country}` : r.city || "—";

  return (
    <div className="grid gap-3 w-full max-w-full min-w-0">
      {/* Заголовок + action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="text-lg font-medium">Локации/филиалы</div>
        <button
          type="button"
          onClick={onCreate}
          className="w-full sm:w-auto rounded-lg border border-white/15 px-3 py-1.5 hover:bg-white/[0.08] transition"
          aria-label="Добавить локацию"
        >
          Добавить
        </button>
      </div>

      {/* Пустой стейт (общий) */}
      {rows.length === 0 && (
        <>
          <ul className="grid gap-2 md:hidden">
            <li className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center text-white/70">
              Нет локаций
            </li>
          </ul>
          <div className="hidden md:block rounded-xl border border-white/10 p-6 text-center text-white/70">
            Нет локаций
          </div>
        </>
      )}

      {/* Мобайл-вид: карточки */}
      {rows.length > 0 && (
        <ul className="grid gap-2 md:hidden">
          {rows.map((r) => (
            <li
              key={r.id}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-medium truncate" title={r.name}>
                    {r.name}
                  </div>
                  <div className="text-xs text-white/60 break-words">
                    {fmtPlace(r)}
                  </div>
                  <div className="mt-1 text-xs text-white/60">
                    TZ: {r.tz || "—"} • Тел: {r.phone || "—"}
                  </div>
                </div>
                <StatusBadge active={r.active} />
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(r.id)}
                  className="col-span-2 rounded-lg border border-white/15 px-3 py-2 hover:bg-white/[0.08] transition"
                  aria-label={`Открыть локацию ${r.name}`}
                >
                  Открыть
                </button>
                <button
                  type="button"
                  onClick={() => onToggleActive(r.id)}
                  className="col-span-2 rounded-lg border border-white/15 px-3 py-2 hover:bg-white/[0.08] transition"
                  aria-label={`${r.active ? "Отключить" : "Включить"} локацию ${r.name}`}
                >
                  {r.active ? "Отключить" : "Включить"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Десктоп/планшет: таблица */}
      {rows.length > 0 && (
        <div className="hidden md:block overflow-x-auto rounded-xl border border-white/10">
          <table className="min-w-[820px] w-full text-sm">
            <caption className="sr-only">Список локаций и статусы активности</caption>
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
                <tr key={r.id} className="border-t border-white/10 hover:bg-white/[0.03]">
                  <td className="p-2 max-w-[260px] truncate" title={r.name}>
                    {r.name}
                  </td>
                  <td className="p-2 max-w-[260px] truncate" title={fmtPlace(r)}>
                    {fmtPlace(r)}
                  </td>
                  <td className="p-2">{r.tz || "—"}</td>
                  <td className="p-2 break-words">{r.phone || "—"}</td>
                  <td className="p-2">
                    <StatusBadge active={r.active} />
                  </td>
                  <td className="p-2 text-right space-x-2 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onEdit(r.id)}
                      className="rounded border border-white/15 px-2 py-1 hover:bg-white/[0.08] transition"
                      aria-label={`Открыть локацию ${r.name}`}
                    >
                      Открыть
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleActive(r.id)}
                      className="rounded border border-white/15 px-2 py-1 hover:bg-white/[0.08] transition"
                      aria-label={`${r.active ? "Отключить" : "Включить"} локацию ${r.name}`}
                    >
                      {r.active ? "Отключить" : "Включить"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}