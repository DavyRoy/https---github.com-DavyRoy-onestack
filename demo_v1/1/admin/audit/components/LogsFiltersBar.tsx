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

export default function LogsFiltersBar({
  value,
  onChange,
}: {
  value: LogsQuery;
  onChange: (v: LogsQuery) => void;
}) {
  const v = value || {};
  const set = (k: keyof LogsQuery, val: any) => onChange({ ...v, [k]: val });

  // локальное состояние для поиска + дебаунс
  const [qInput, setQInput] = React.useState(v.q ?? "");
  React.useEffect(() => setQInput(v.q ?? ""), [v.q]);
  React.useEffect(() => {
    const t = setTimeout(() => set("q", qInput), 300);
    return () => clearTimeout(t);
  }, [qInput]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className="
        rounded-2xl border border-white/15 bg-white/[0.05]
        p-3 md:p-4
        grid gap-2
        [grid-template-columns:repeat(1,minmax(0,1fr))]
        sm:[grid-template-columns:repeat(2,minmax(0,1fr))]
        lg:[grid-template-columns:repeat(6,minmax(0,1fr))]
      "
    >
      {/* Поиск — занимает больше места на больших экранах */}
      <input
        aria-label="Поиск по журналу"
        placeholder="Поиск…"
        className="
          rounded-lg bg-white/5 px-3 py-2 border border-white/10
          lg:col-span-2
        "
        value={qInput}
        onChange={(e) => setQInput(e.target.value)}
      />

      {/* Диапазон */}
      <select
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
      <select
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
      <select
        aria-label="Модуль"
        className="rounded-lg bg-white/5 px-3 py-2 border border-white/10"
        value={v.module || ""}
        onChange={(e) => set("module", e.target.value)}
      >
        <option value="">Модуль</option>
        {[
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
        ].map((m) => (
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
          />
          critical
        </label>

        <select
          aria-label="Сортировка"
          className="rounded-lg bg-white/5 px-2 py-2 border border-white/10"
          value={v.sort || "ts_desc"}
          onChange={(e) => set("sort", e.target.value as LogsQuery["sort"])}
        >
          <option value="ts_desc">Новые → старые</option>
          <option value="ts_asc">Старые → новые</option>
        </select>
      </div>
    </div>
  );
}