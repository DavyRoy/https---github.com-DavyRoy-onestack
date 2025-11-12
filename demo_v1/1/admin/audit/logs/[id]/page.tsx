"use client";

import * as React from "react";
import Link from "next/link";
import { AUDIT_LOGS } from "@/app/demo/(shared)/audit/logs";
import LogMeta from "../../components/LogMeta";
import LogDiff from "../../components/LogDiff";
import LinkedObjects from "../../components/LinkedObjects";

export default function AdminAuditLogDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ✅ Разворачиваем промис (Next.js 15+)
  const unwrapped = React.use(params);
  const id = unwrapped.id;

  const item = React.useMemo(
    () => AUDIT_LOGS.find((x) => x.id === id),
    [id]
  );

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
        <p className="text-sm text-white/70">Проверьте корректность идентификатора.</p>
      </div>
    );
  }

  return (
    <div
      className="
        grid gap-4 w-full max-w-full min-w-0
        supports-[overflow:clip]:overflow-x-clip overflow-x-hidden
      "
    >
      {/* Заголовок */}
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <h1 className="text-xl md:text-2xl font-semibold">Событие #{item.id}</h1>
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
      <section className="min-w-0">
        <LogMeta value={item} />
      </section>

      {/* Связанные объекты */}
      <section className="min-w-0">
        <LinkedObjects value={item.links || []} />
      </section>

      {/* Diff / Payload */}
      <section className="-mx-3 md:mx-0" aria-label="Изменения и payload">
        <div className="px-3 md:px-0 overflow-x-auto">
          <LogDiff
            before={item.before || {}}
            after={item.after || {}}
            payload={item.payload || {}}
          />
        </div>
      </section>
    </div>
  );
}