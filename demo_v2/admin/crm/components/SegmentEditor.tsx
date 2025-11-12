"use client";

import * as React from "react";

/* ================= Types ================= */

type FieldKey = "lastActivity" | "tag" | "ltv" | "orders" | "country";
type OpKey =
  | "gtDays"
  | "eq"
  | "gte"
  | "contains"
  | "startsWith"
  | "equals";
type Rule = { id: string; field: FieldKey; op: OpKey; value: string };
type Joiner = "AND" | "OR";

/* ================= Presets / helpers ================= */

const FIELD_LABEL: Record<FieldKey, string> = {
  lastActivity: "Последняя активность",
  tag: "Тег",
  ltv: "LTV (₽)",
  orders: "Кол-во заказов",
  country: "Страна",
};

const OP_LABEL: Record<OpKey, string> = {
  gtDays: "более N дней назад",
  eq: "равно",
  gte: "≥",
  contains: "содержит",
  startsWith: "начинается с",
  equals: "равно",
};

// какие операции показывать для каждого поля
const OPS_FOR_FIELD: Record<FieldKey, OpKey[]> = {
  lastActivity: ["gtDays"],
  tag: ["equals", "contains", "startsWith"],
  ltv: ["gte"],
  orders: ["gte"],
  country: ["eq", "startsWith"],
};

// значения по умолчанию для поля
const DEFAULT_VALUE: Record<FieldKey, string> = {
  lastActivity: "90",
  tag: "vip",
  ltv: "100000",
  orders: "3",
  country: "RU",
};

function makeRule(field: FieldKey): Rule {
  const ops = OPS_FOR_FIELD[field];
  return {
    id: `r-${Math.random().toString(36).slice(2, 9)}`,
    field,
    op: ops[0],
    value: DEFAULT_VALUE[field] ?? "",
  };
}

function humanizeRule(r: Rule): string {
  const f = FIELD_LABEL[r.field];
  const op = OP_LABEL[r.op];
  const v =
    r.field === "ltv"
      ? `₽ ${Number(r.value || 0).toLocaleString("ru-RU")}`
      : r.field === "orders"
      ? `${r.value}`
      : r.field === "lastActivity"
      ? `${r.value}д`
      : r.value;
  return `${f}: ${op} ${v}`;
}

/* ================= Segment Editor ================= */

export function SegmentEditor() {
  const [joiner, setJoiner] = React.useState<Joiner>("AND");
  const [rules, setRules] = React.useState<Rule[]>([
    makeRule("lastActivity"),
    makeRule("orders"),
  ]);

  function addRule() {
    setRules((xs) => [...xs, makeRule("tag")]);
  }
  function removeRule(id: string) {
    setRules((xs) => xs.filter((r) => r.id !== id));
  }
  function updateRule(id: string, patch: Partial<Rule>) {
    setRules((xs) =>
      xs.map((r) => {
        if (r.id !== id) return r;
        // если сменили поле — выставим первую валидную операцию и дефолт-значение
        if (patch.field && patch.field !== r.field) {
          const nextField = patch.field;
          const ops = OPS_FOR_FIELD[nextField];
          return {
            ...r,
            field: nextField,
            op: ops[0],
            value: DEFAULT_VALUE[nextField],
          } as Rule;
        }
        // если сменили операцию — просто патчим
        return { ...r, ...patch };
      })
    );
  }

  const queryPreview = React.useMemo(() => {
    if (!rules.length) return "—";
    return rules.map(humanizeRule).join(` ${joiner} `);
  }, [rules, joiner]);

  function apply() {
    // демо: просто покажем собранное условие
    alert(`Применён сегмент:\n${queryPreview}`);
  }

  function reset() {
    setJoiner("AND");
    setRules([makeRule("lastActivity"), makeRule("orders")]);
  }

  return (
    <section className="rounded-2xl border border-white/15 p-4 bg-white/[0.03] grid gap-3">
      <div className="text-sm text-white/70">Конструктор условий</div>

      {/* Строка правил */}
      <div className="grid gap-2">
        {rules.map((r) => {
          const ops = OPS_FOR_FIELD[r.field];
          return (
            <div key={r.id} className="grid gap-2 md:grid-cols-[1fr,1fr,1fr,auto]">
              {/* Поле */}
              <select
                className="bg-transparent border border-white/20 rounded px-2 py-1 text-sm"
                value={r.field}
                onChange={(e) => updateRule(r.id, { field: e.target.value as FieldKey })}
                aria-label="Поле"
              >
                {(Object.keys(FIELD_LABEL) as FieldKey[]).map((fk) => (
                  <option key={fk} value={fk}>
                    {FIELD_LABEL[fk]}
                  </option>
                ))}
              </select>

              {/* Операция */}
              <select
                className="bg-transparent border border-white/20 rounded px-2 py-1 text-sm"
                value={r.op}
                onChange={(e) => updateRule(r.id, { op: e.target.value as OpKey })}
                aria-label="Оператор"
              >
                {ops.map((op) => (
                  <option key={op} value={op}>
                    {OP_LABEL[op]}
                  </option>
                ))}
              </select>

              {/* Значение */}
              <input
                className="bg-transparent border border-white/20 rounded px-2 py-1 text-sm"
                placeholder="Значение"
                value={r.value}
                onChange={(e) => updateRule(r.id, { value: e.target.value })}
                aria-label="Значение"
                inputMode={r.field === "ltv" || r.field === "orders" || r.field === "lastActivity" ? "numeric" : "text"}
              />

              {/* Удалить */}
              <button
                type="button"
                onClick={() => removeRule(r.id)}
                className="rounded border border-white/20 px-3 py-1.5 text-sm hover:bg-white/10"
                aria-label="Удалить правило"
                title="Удалить правило"
              >
                ✕
              </button>
            </div>
          );
        })}

        {/* Добавить правило */}
        <div>
          <button
            type="button"
            onClick={addRule}
            className="rounded-lg border border-white/20 px-3 py-1.5 text-sm hover:bg-white/10"
          >
            + Добавить условие
          </button>
        </div>
      </div>

      {/* Соединитель AND / OR */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-white/60 w-24">Соединитель</span>
        <div className="inline-flex rounded-lg border border-white/20 overflow-hidden">
          {(["AND", "OR"] as Joiner[]).map((j) => (
            <button
              key={j}
              type="button"
              onClick={() => setJoiner(j)}
              className={`px-3 py-1.5 text-sm ${
                joiner === j ? "bg-white/15" : "hover:bg-white/10"
              }`}
              aria-pressed={joiner === j}
            >
              {j}
            </button>
          ))}
        </div>
      </div>

      {/* Превью «запроса» */}
      <div className="rounded-lg border border-white/12 bg-white/5 px-3 py-2 text-xs text-white/80">
        <span className="opacity-70 mr-1">Запрос:</span>
        <span className="font-mono">{queryPreview}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <button
          className="rounded border border-emerald-400/40 bg-emerald-500/20 hover:bg-emerald-500/30 px-3 py-2 text-sm"
          onClick={apply}
        >
          Применить
        </button>
        <button
          className="rounded border border-white/20 hover:bg-white/10 px-3 py-2 text-sm"
          onClick={reset}
        >
          Сбросить
        </button>
      </div>
    </section>
  );
}

/* ================= Segment Preview ================= */

export function SegmentPreview() {
  // имитация «совпавших» клиентов по текущему сегменту
  const demoMatches = React.useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: `c-${i + 1}`,
        name: `Клиент ${i + 1}`,
        hint: i % 2 ? "vip • ltv>100k" : "churn>90d",
      })),
    []
  );

  return (
    <section className="rounded-2xl border border-white/15 p-4 bg-white/[0.03]">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-sm text-white/70">Предпросмотр совпадений (демо)</div>
        <div className="text-xs text-white/60">Найдено: {demoMatches.length}</div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {demoMatches.map((c) => (
          <div
            key={c.id}
            className="rounded border border-white/10 px-3 py-2 text-sm hover:bg-white/[0.06] transition"
          >
            <div className="font-medium">{c.name}</div>
            <div className="text-xs text-white/60">{c.hint}</div>
          </div>
        ))}
      </div>
    </section>
  );
}