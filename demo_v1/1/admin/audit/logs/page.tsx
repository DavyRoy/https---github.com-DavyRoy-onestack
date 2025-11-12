"use client";

import { useMemo, useState } from "react";
import LogsFiltersBar from "../components/LogsFiltersBar";
import LogsTable from "../components/LogsTable";
import { AUDIT_LOGS } from "@/app/demo/(shared)/audit/logs";

type Query = {
  q: string;
  range: "1h" | "24h" | "7d" | "30d" | "all" | string;
  level: "" | "info" | "warn" | "error";
  module: string;
  critical: "" | "true";
  sort: "ts_desc" | "ts_asc";
};

export default function AdminAuditLogsPage() {
  const [query, setQuery] = useState<Query>({
    q: "",
    range: "24h",
    level: "",
    module: "",
    critical: "",
    sort: "ts_desc",
  });

  const rows = useMemo(() => {
    const needle = (query.q || "").toLowerCase();

    // фильтрация по тексту
    let data = AUDIT_LOGS.filter((r) =>
      needle ? JSON.stringify(r).toLowerCase().includes(needle) : true
    );

    // level / module / critical
    if (query.level) data = data.filter((r) => r.level === query.level);
    if (query.module) data = data.filter((r) => r.module === query.module);
    if (query.critical === "true") data = data.filter((r) => !!r.critical);

    // сортировка по времени ISO — устойчиво к гидрации (строковое сравнение)
    const sorted =
      query.sort === "ts_asc"
        ? [...data].sort((a, b) => a.ts.localeCompare(b.ts))
        : [...data].sort((a, b) => b.ts.localeCompare(a.ts));

    return sorted;
  }, [query]);

  return (
    <div
      className="
        grid gap-4 w-full max-w-full min-w-0
        supports-[overflow:clip]:overflow-x-clip overflow-x-hidden
      "
    >
      {/* Заголовок */}
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 min-w-0">
        <h1 className="text-xl md:text-2xl font-semibold">Журнал действий</h1>
      </header>

      {/* Панель фильтров */}
      <section className="min-w-0">
        <LogsFiltersBar value={query} onChange={setQuery} />
      </section>

      {/* Таблица: безопасный горизонтальный скролл на мобилке */}
      <section aria-label="Список событий аудита" className="-mx-3 md:mx-0">
        <div className="px-3 md:px-0 min-w-0">
          <LogsTable rows={rows} />
        </div>
      </section>
    </div>
  );
}