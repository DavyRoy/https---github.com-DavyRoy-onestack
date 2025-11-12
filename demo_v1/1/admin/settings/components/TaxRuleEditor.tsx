"use client";

type Rule = {
  level: "org" | "location" | "category" | "service" | "item";
  match: string;
  rateRef: string;
  priority: number;
};

export default function TaxRuleEditor({
  value,
  onChange,
}: {
  value: Rule[];
  onChange: (v: Rule[]) => void;
}) {
  const rows = value || [];

  const update = (i: number, patch: Partial<Rule>) =>
    onChange(rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));

  const remove = (i: number) => onChange(rows.filter((_, idx) => idx !== i));

  const add = () =>
    onChange([
      ...rows,
      { level: "org", match: "services", rateRef: "vat20", priority: 10 },
    ]);

  return (
    <div className="grid gap-3 w-full max-w-full min-w-0">
      {/* Хедер */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="text-lg font-medium">Правила применения</div>
        <div className="flex gap-2">
          <button
            onClick={add}
            className="rounded-lg border border-white/15 px-3 py-1.5 hover:bg-white/[0.08]"
          >
            Добавить правило
          </button>
        </div>
      </div>

      {/* Список правил */}
      <div className="grid gap-2">
        {rows.map((r, i) => (
          <div
            key={i}
            className="
              rounded-2xl border border-white/15 bg-white/[0.05]
              p-3 md:p-4
            "
          >
            {/* Мобильная шапка карточки */}
            <div className="flex items-start justify-between gap-2 md:hidden">
              <div className="text-sm text-white/70">
                Правило #{i + 1} • приоритет {r.priority ?? 0}
              </div>
              <button
                onClick={() => remove(i)}
                className="rounded-lg border border-rose-400/40 text-rose-200 px-2 py-1 text-xs hover:bg-rose-500/10"
                aria-label={`Удалить правило ${i + 1}`}
              >
                Удалить
              </button>
            </div>

            {/* Поля: на мобиле столбцом, на десктопе — в линию */}
            <div className="mt-2 grid gap-2 md:mt-0 md:grid-cols-5 md:items-center">
              <label className="grid gap-1 text-xs">
                <span className="text-white/60">Уровень</span>
                <select
                  className="bg-white/5 rounded px-2 py-2 border border-white/10"
                  value={r.level}
                  onChange={(e) =>
                    update(i, { level: e.target.value as Rule["level"] })
                  }
                  aria-label="Уровень правила"
                >
                  <option value="org">Организация</option>
                  <option value="location">Локация</option>
                  <option value="category">Категория</option>
                  <option value="service">Услуга</option>
                  <option value="item">Позиция</option>
                </select>
              </label>

              <label className="grid gap-1 text-xs">
                <span className="text-white/60">Совпадение (slug/id)</span>
                <input
                  className="bg-white/5 rounded px-2 py-2 border border-white/10"
                  placeholder="Напр. services / loc_main"
                  value={r.match || ""}
                  onChange={(e) => update(i, { match: e.target.value })}
                />
              </label>

              <label className="grid gap-1 text-xs">
                <span className="text-white/60">Ставка (id)</span>
                <input
                  className="bg-white/5 rounded px-2 py-2 border border-white/10"
                  placeholder="vat20 / none / …"
                  value={r.rateRef || ""}
                  onChange={(e) => update(i, { rateRef: e.target.value })}
                />
              </label>

              <label className="grid gap-1 text-xs">
                <span className="text-white/60">Приоритет</span>
                <input
                  type="number"
                  className="bg-white/5 rounded px-2 py-2 border border-white/10"
                  placeholder="0"
                  value={r.priority ?? 0}
                  onChange={(e) => update(i, { priority: Number(e.target.value) })}
                />
              </label>

              {/* Кнопка удаления — справа на десктопе */}
              <div className="hidden md:flex justify-end">
                <button
                  onClick={() => remove(i)}
                  className="rounded-lg border border-rose-400/40 text-rose-200 px-3 py-2 hover:bg-rose-500/10 text-sm"
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        ))}

        {rows.length === 0 && (
          <div className="text-sm text-white/70">Правил пока нет.</div>
        )}
      </div>
    </div>
  );
}