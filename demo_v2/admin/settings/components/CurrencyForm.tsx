"use client";

type CurrencyCode = "RUB" | "KRW" | "USD";

type CurrencyState = {
  base?: CurrencyCode;
  display?: CurrencyCode;
  allowed?: CurrencyCode[];
};

export default function CurrencyForm({
  value,
  onChange,
}: {
  value: CurrencyState;
  onChange: (v: CurrencyState) => void;
}) {
  const ALL: CurrencyCode[] = ["RUB", "KRW", "USD"];

  // Нормализуем начальное состояние
  const v: Required<CurrencyState> = {
    base: value?.base ?? "RUB",
    display: value?.display ?? "RUB",
    allowed: normalizeAllowed(value?.allowed ?? ["RUB", "KRW", "USD"]),
  };

  // базовый сеттер с авто-согласованием инвариантов
  const set = (next: CurrencyState) => {
    let n: Required<CurrencyState> = {
      base: next.base ?? v.base,
      display: next.display ?? v.display,
      allowed: normalizeAllowed(next.allowed ?? v.allowed),
    };

    // база всегда разрешена
    if (!n.allowed.includes(n.base)) n.allowed = addInOrder(n.allowed, n.base, ALL);

    // display должен быть разрешён; если нет — сдвигаем
    if (!n.allowed.includes(n.display)) {
      n.display = n.base ?? n.allowed[0];
      if (!n.allowed.includes(n.display)) n.allowed = addInOrder(n.allowed, n.display, ALL);
    }

    // хотя бы одна валюта
    if (n.allowed.length === 0) n.allowed = [n.base];

    onChange(n);
  };

  const setField = <K extends keyof CurrencyState>(key: K, val: CurrencyState[K]) => {
    set({ ...v, [key]: val });
  };

  const toggleAllowed = (code: CurrencyCode) => {
    let next = new Set(v.allowed);
    if (next.has(code)) {
      // не даём выключить последнюю валюту
      if (next.size === 1) return;
      next.delete(code);
    } else {
      next.add(code);
    }

    // если выключили текущий display — переключим на base или любую доступную
    let display = v.display;
    const allowedArr = orderByAll(Array.from(next), ALL);
    if (!allowedArr.includes(display)) {
      display = allowedArr.includes(v.base) ? v.base : allowedArr[0];
    }

    set({ ...v, allowed: allowedArr, display });
  };

  return (
    <section className="grid gap-4 w-full max-w-full min-w-0">
      <div className="text-lg font-medium">Базовая валюта и отображение</div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 min-w-0">
        {/* Базовая валюта */}
        <label className="grid gap-1 text-sm min-w-0" htmlFor="currency-base">
          <span className="text-white/80">Базовая валюта</span>
          <select
            id="currency-base"
            className="rounded-lg bg-white/5 px-3 py-2 border border-white/10 outline-none focus:ring-2 focus:ring-white/20"
            value={v.base}
            onChange={(e) => setField("base", e.target.value as CurrencyCode)}
            aria-describedby="currency-base-hint"
          >
            {ALL.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <span id="currency-base-hint" className="text-xs text-white/50">
            Используется для расчётов, курсов и агрегированной отчётности.
          </span>
        </label>

        {/* Валюта отображения */}
        <label className="grid gap-1 text-sm min-w-0" htmlFor="currency-display">
          <span className="text-white/80">Отображение по умолчанию</span>
          <select
            id="currency-display"
            className="rounded-lg bg-white/5 px-3 py-2 border border-white/10 outline-none focus:ring-2 focus:ring-white/20"
            value={v.display}
            onChange={(e) => setField("display", e.target.value as CurrencyCode)}
            aria-describedby="currency-display-hint"
          >
            {ALL.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <span id="currency-display-hint" className="text-xs text-white/50">
            В какой валюте показывать суммы пользователям интерфейса.
          </span>
        </label>

        {/* Разрешённые валюты */}
        <fieldset className="grid gap-1 text-sm min-w-0">
          <legend className="text-white/80">Разрешённые валюты</legend>

          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-2">
            <div className="grid grid-cols-2 gap-2">
              {ALL.map((c) => (
                <label key={c} className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-white/80"
                    checked={v.allowed.includes(c)}
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
        </fieldset>
      </div>

      {/* Подсказки о возможных несостыковках (на всякий случай) */}
      {v.display && !v.allowed.includes(v.display) && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
          Внимание: валюта отображения ({v.display}) не входит в список разрешённых. Она будет добавлена автоматически.
        </div>
      )}
      {v.base && !v.allowed.includes(v.base) && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
          Внимание: базовая валюта ({v.base}) должна быть разрешена. Она будет добавлена автоматически.
        </div>
      )}
    </section>
  );
}

/* helpers: детерминированный порядок и инварианты */
function orderByAll(list: CurrencyCode[], all: CurrencyCode[]) {
  const set = new Set(list);
  return all.filter((c) => set.has(c));
}
function addInOrder(list: CurrencyCode[], code: CurrencyCode, all: CurrencyCode[]) {
  const set = new Set(list);
  set.add(code);
  return orderByAll(Array.from(set), all);
}
function normalizeAllowed(list: CurrencyCode[]) {
  // убираем дубли, сохраняем предсказуемый порядок (RUB, KRW, USD)
  const ALL: CurrencyCode[] = ["RUB", "KRW", "USD"];
  const set = new Set(list);
  return ALL.filter((c) => set.has(c));
}