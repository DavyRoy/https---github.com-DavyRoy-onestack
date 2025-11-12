"use client";

import React from "react";

type LogsQuery = {
  q?: string;
  range?: "1h" | "24h" | "7d" | "30d";
  level?: "" | "info" | "warn" | "error";
  module?: string;
  critical?: "" | "true";
  sort?: "ts_desc" | "ts_asc";
};

const MODULES = [
  "users",
  "orders",
  "shop",
  "services",
  "booking",
  "calendar",
  "crm",
  "payments",
  "reports",
  "integrations",
  "settings",
  "rbac",
] as const;

export default function LogsFiltersBar({
  value,
  onChange,
}: {
  value: LogsQuery;
  onChange: (v: LogsQuery) => void;
}) {
  const v = value ?? {};

  const set = React.useCallback(
    <K extends keyof LogsQuery>(k: K, val: LogsQuery[K]) => {
      onChange({ ...v, [k]: val });
    },
    [onChange, v]
  );

  // локальное состояние для поиска + дебаунс
  const [qInput, setQInput] = React.useState<string>(v.q ?? "");
  // синхронизация при внешнем обновлении value.q
  React.useEffect(() => {
    setQInput(v.q ?? "");
  }, [v.q]);

  React.useEffect(() => {
    const t = setTimeout(() => set("q", qInput.trim() || ""), 300);
    return () => clearTimeout(t);
  }, [qInput, set]);

  const clearSearch = () => setQInput("");

  return (
    <section
      className="
        rounded-2xl border border-white/15 bg-white/[0.05]
        p-3 md:p-4
        grid gap-2
        [grid-template-columns:repeat(1,minmax(0,1fr))]
        sm:[grid-template-columns:repeat(2,minmax(0,1fr))]
        lg:[grid-template-columns:repeat(6,minmax(0,1fr))]
      "
      role="region"
      aria-label="Фильтры журнала аудита"
    >
      {/* Поиск — занимает больше места на больших экранах */}
      <div className="relative lg:col-span-2">
        <input
          aria-label="Поиск по журналу"
          placeholder="Поиск…"
          className="w-full rounded-lg bg-white/5 px-3 py-2 pr-8 border border-white/10"
          value={qInput}
          onChange={(e) => setQInput(e.target.value)}
        />
        {qInput && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs border border-white/10 bg-white/10 hover:bg-white/15"
            aria-label="Очистить поиск"
            title="Очистить"
          >
            ✕
          </button>
        )}
      </div>

      {/* Диапазон */}
      <label className="sr-only" htmlFor="logs-range">
        Диапазон
      </label>
      <select
        id="logs-range"
        aria-label="Диапазон"
        className="rounded-lg bg-white/5 px-3 py-2 border border-white/10"
        value={v.range || "24h"}
        onChange={(e) => set("range", e.target.value as LogsQuery["range"])}
      >
        <option value="1h">1ч</option>
        <option value="24h">24ч</option>
        <option value="7d">7д</option>
        <option value="30d">30д</option>
      </select>

      {/* Уровень */}
      <label className="sr-only" htmlFor="logs-level">
        Уровень
      </label>
      <select
        id="logs-level"
        aria-label="Уровень"
        className="rounded-lg bg-white/5 px-3 py-2 border border-white/10"
        value={v.level || ""}
        onChange={(e) => set("level", e.target.value as LogsQuery["level"])}
      >
        <option value="">Уровень</option>
        <option value="info">info</option>
        <option value="warn">warn</option>
        <option value="error">error</option>
      </select>

      {/* Модуль */}
      <label className="sr-only" htmlFor="logs-module">
        Модуль
      </label>
      <select
        id="logs-module"
        aria-label="Модуль"
        className="rounded-lg bg-white/5 px-3 py-2 border border-white/10"
        value={v.module || ""}
        onChange={(e) => set("module", e.target.value)}
      >
        <option value="">Модуль</option>
        {MODULES.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      {/* Критичность + сортировка — в одной строке, но с переносами на узких экранах */}
      <div className="flex flex-wrap items-center gap-2">
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={v.critical === "true"}
            onChange={(e) => set("critical", e.target.checked ? "true" : "")}
            aria-label="Только критичные"
          />
          critical
        </label>

        <label className="sr-only" htmlFor="logs-sort">
          Сортировка
        </label>
        <select
          id="logs-sort"
          aria-label="Сортировка"
          className="rounded-lg bg-white/5 px-2 py-2 border border-white/10"
          value={v.sort || "ts_desc"}
          onChange={(e) => set("sort", e.target.value as LogsQuery["sort"])}
        >
          <option value="ts_desc">Новые → старые</option>
          <option value="ts_asc">Старые → новые</option>
        </select>
      </div>
    </section>
  );
}