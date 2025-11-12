"use client";

import * as React from "react";
import Link from "next/link";
import { AUDIT_LOGS } from "@/app/demo/(shared)/audit/logs";
import LogMeta from "../../components/LogMeta";
import LogDiff from "../../components/LogDiff";
import LinkedObjects from "../../components/LinkedObjects";

/**
 * Детальная страница аудита (просмотр конкретного события)
 * Поддерживает Next.js 15+ (params как Promise).
 */
export default function AdminAuditLogDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ✅ React.use() для раскрутки params (Next.js App Router 15+)
  const unwrapped = React.use(params);
  const id = unwrapped.id;

  // Извлекаем событие по ID
  const item = React.useMemo(() => AUDIT_LOGS.find((x) => x.id === id), [id]);

  // Если не найдено
  if (!item) {
    return (
      <div className="grid gap-4 w-full max-w-full min-w-0">
        <header className="flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-semibold">Событие не найдено</h1>
          <Link
            href="/demo/admin/audit/logs"
            className="rounded-lg border border-white/15 px-3 py-1.5 hover:bg-white/[0.08]"
          >
            ← Журнал
          </Link>
        </header>
        <p className="text-sm text-white/70">
          Проверьте корректность идентификатора события.
        </p>
      </div>
    );
  }

  // Форматирование времени (человеческий вид)
  const ts = React.useMemo(() => {
    try {
      return new Date(item.ts).toLocaleString("ru-RU", {
        dateStyle: "short",
        timeStyle: "medium",
      });
    } catch {
      return item.ts;
    }
  }, [item.ts]);

  return (
    <div
      className="
        grid gap-4 w-full max-w-full min-w-0
        supports-[overflow:clip]:overflow-x-clip overflow-x-hidden
      "
    >
      {/* Заголовок */}
      <header
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2"
        aria-labelledby="audit-log-title"
      >
        <div className="min-w-0">
          <h1
            id="audit-log-title"
            className="text-xl md:text-2xl font-semibold break-all"
          >
            Событие #{item.id}
          </h1>
          <p className="text-sm text-white/70 mt-1">
            {item.module} / {item.action} • {ts}
          </p>
        </div>
        <div className="flex w-full sm:w-auto">
          <Link
            href="/demo/admin/audit/logs"
            className="w-full sm:w-auto rounded-lg border border-white/15 px-3 py-1.5 hover:bg-white/[0.08] text-center"
          >
            ← Журнал
          </Link>
        </div>
      </header>

      {/* Метаданные */}
      <section className="min-w-0" aria-label="Метаданные события">
        <LogMeta value={item} />
      </section>

      {/* Связанные объекты */}
      {item.links?.length > 0 && (
        <section className="min-w-0" aria-label="Связанные объекты">
          <LinkedObjects value={item.links} />
        </section>
      )}

      {/* Diff / Payload */}
      <section
        className="-mx-3 md:mx-0"
        aria-label="Изменения и payload"
      >
        <div className="px-3 md:px-0 overflow-x-auto">
          <LogDiff
            before={item.before || {}}
            after={item.after || {}}
            payload={item.payload || {}}
          />
        </div>
      </section>

      {/* Footer (инфо о пользователе и уровне) */}
      <footer className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs text-white/60">
        <div className="flex flex-wrap justify-between gap-2">
          <div>
            <span className="text-white/50">Уровень:</span>{" "}
            <span
              className={`font-semibold ${
                item.level === "error"
                  ? "text-rose-300"
                  : item.level === "warn"
                  ? "text-amber-300"
                  : "text-emerald-300"
              }`}
            >
              {item.level}
            </span>
            {item.critical && <span className="ml-1">⚠ Critical</span>}
          </div>
          <div className="truncate">
            <span className="text-white/50">Пользователь:</span>{" "}
            {item.user} <span className="text-white/40">({item.role})</span>
          </div>
        </div>
      </footer>
    </div>
  );
}