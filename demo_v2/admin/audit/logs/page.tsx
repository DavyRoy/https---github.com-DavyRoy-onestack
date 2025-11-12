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

/** Преобразуем фильтр диапазона в миллисекунды (от «сейчас»). */
function rangeToMs(r: Query["range"]): number | null {
  switch (r) {
    case "1h":
      return 60 * 60 * 1000;
    case "24h":
      return 24 * 60 * 60 * 1000;
    case "7d":
      return 7 * 24 * 60 * 60 * 1000;
    case "30d":
      return 30 * 24 * 60 * 60 * 1000;
    case "all":
    default:
      return null; // без ограничения
  }
}

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

    // Стартовый набор
    let data = AUDIT_LOGS as typeof AUDIT_LOGS;

    // Диапазон по времени (если ts — ISO; игнорируем записи с некорректной датой)
    const span = rangeToMs(query.range);
    if (span) {
      const now = Date.now();
      const minTs = now - span;
      data = data.filter((r) => {
        const t = Date.parse(r.ts);
        return Number.isFinite(t) ? t >= minTs : true;
      });
    }

    // Поиск по тексту (упрощённо — сериализация строки)
    if (needle) {
      data = data.filter((r) => {
        // Лёгкая оптимизация: составим компактную строку без больших payload'ов (в демо их нет)
        const hay =
          (r.ts +
            " " +
            r.user +
            " " +
            r.role +
            " " +
            r.module +
            " " +
            r.action +
            " " +
            r.entityType +
            " " +
            r.entityId +
            " " +
            (r.result ?? "") +
            " " +
            r.ip +
            " " +
            r.ua).toLowerCase();
        return hay.includes(needle);
      });
    }

    // level / module / critical
    if (query.level) data = data.filter((r) => r.level === query.level);
    if (query.module) data = data.filter((r) => r.module === query.module);
    if (query.critical === "true") data = data.filter((r) => !!r.critical);

    // Сортировка по времени ISO — устойчиво к гидрации (строковое сравнение)
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
      <header
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 min-w-0"
        aria-labelledby="audit-logs-title"
      >
        <div className="min-w-0">
          <h1 id="audit-logs-title" className="text-xl md:text-2xl font-semibold">
            Журнал действий
          </h1>
          <p className="text-sm text-white/70 mt-1">
            Фильтруйте события по периоду, уровню, модулю и критичности.
          </p>
        </div>
        {/* Небольшая сводка по результатам фильтрации */}
        <div className="text-xs text-white/60">
          Найдено записей:{" "}
          <span className="text-white/80 font-medium">{rows.length.toLocaleString("ru-RU")}</span>
        </div>
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