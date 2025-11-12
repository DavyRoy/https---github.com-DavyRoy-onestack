"use client";

type CurrencyState = {
  base?: "RUB" | "KRW" | "USD";
  display?: "RUB" | "KRW" | "USD";
  allowed?: Array<"RUB" | "KRW" | "USD">;
};

export default function CurrencyForm({
  value,
  onChange,
}: {
  value: CurrencyState;
  onChange: (v: CurrencyState) => void;
}) {
  const v: CurrencyState = {
    base: value?.base ?? "RUB",
    display: value?.display ?? "RUB",
    allowed: value?.allowed ?? ["RUB", "KRW", "USD"],
  };

  const setField = <K extends keyof CurrencyState>(key: K, val: CurrencyState[K]) =>
    onChange({ ...v, [key]: val });

  const toggleAllowed = (code: "RUB" | "KRW" | "USD") => {
    const next = new Set(v.allowed);
    next.has(code) ? next.delete(code) : next.add(code);
    setField("allowed", Array.from(next) as CurrencyState["allowed"]);
  };

  const allCodes: Array<"RUB" | "KRW" | "USD"> = ["RUB", "KRW", "USD"];

  return (
    <section className="grid gap-4 w-full max-w-full min-w-0">
      <div className="text-lg font-medium">Базовая валюта и отображение</div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 min-w-0">
        {/* Базовая валюта */}
        <label className="grid gap-1 text-sm min-w-0">
          <span className="text-white/80">Базовая валюта</span>
          <select
            className="rounded-lg bg-white/5 px-3 py-2 border border-white/10 outline-none focus:ring-2 focus:ring-white/20"
            value={v.base}
            onChange={(e) => setField("base", e.target.value as CurrencyState["base"])}
            aria-label="Базовая валюта"
          >
            {allCodes.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <span className="text-xs text-white/50">
            Используется для расчётов, курсов и агрегированной отчётности.
          </span>
        </label>

        {/* Валюта отображения */}
        <label className="grid gap-1 text-sm min-w-0">
          <span className="text-white/80">Отображение по умолчанию</span>
          <select
            className="rounded-lg bg-white/5 px-3 py-2 border border-white/10 outline-none focus:ring-2 focus:ring-white/20"
            value={v.display}
            onChange={(e) => setField("display", e.target.value as CurrencyState["display"])}
            aria-label="Валюта отображения по умолчанию"
          >
            {allCodes.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <span className="text-xs text-white/50">
            В какой валюте показывать суммы пользователям интерфейса.
          </span>
        </label>

        {/* Разрешённые валюты */}
        <div className="grid gap-1 text-sm min-w-0">
          <span className="text-white/80">Разрешённые валюты</span>

          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-2">
            <div className="grid grid-cols-2 gap-2">
              {allCodes.map((c) => (
                <label key={c} className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-white/80"
                    checked={(v.allowed ?? []).includes(c)}
                    onChange={() => toggleAllowed(c)}
                    aria-label={`Разрешить ${c}`}
                  />
                  <span className="text-white/80">{c}</span>
                </label>
              ))}
            </div>
            <div className="text-xs text-white/50 mt-2">
              Эти валюты доступны в товарах, ценах и фильтрах отчётов.
            </div>
          </div>
        </div>
      </div>

      {/* Подсказка о противоречиях */}
      {v.allowed && v.display && !v.allowed.includes(v.display) && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
          Внимание: валюта отображения ({v.display}) не входит в список разрешённых. Добавьте её выше или
          измените валюту отображения.
        </div>
      )}
    </section>
  );
}