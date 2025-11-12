// app/demo/admin/booking/schedules/resources/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { ADMIN_RESOURCES } from "@/app/demo/(shared)/booking";

function fmtType(t: (typeof ADMIN_RESOURCES)[number]["type"]) {
  switch (t) {
    case "staff": return "Сотрудник";
    case "room": return "Кабинет";
    case "equipment": return "Оборудование";
    default: return String(t);
  }
}

function StatusBadge({ active }: { active: boolean }) {
  const cls = active
    ? "bg-emerald-400/15 text-emerald-300"
    : "bg-white/10 text-white/70";
  return (
    <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs ${cls}`}>
      {active ? "Активен" : "Отключен"}
    </span>
  );
}

export default function AdminResourcesListPage() {
  const rows = React.useMemo(() => ADMIN_RESOURCES, []);

  return (
    <div className="grid gap-6">
      {/* header */}
      <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="text-xs text-white/60">Расписания</div>
          <h1 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight">Ресурсы</h1>
          <p className="mt-1 text-sm text-white/70">
            Сотрудники, кабинеты и оборудование. Всего:{" "}
            <span className="text-white/85">{rows.length}</span>
          </p>
        </div>
        <Link
          href="/demo/admin/booking/schedules/resources/new"
          className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
        >
          Добавить ресурс
        </Link>
      </header>

      {/* список: мобильные карточки + десктоп-таблица */}
      <section className="rounded-2xl border border-white/15 bg-white/[0.05]">
        {/* mobile cards */}
        <div className="divide-y divide-white/10 md:hidden">
          {rows.length === 0 ? (
            <div className="p-6 text-center text-white/70 text-sm">Ресурсов нет.</div>
          ) : (
            rows.map((r) => (
              <div key={r.id} className="p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/demo/admin/booking/schedules/resources/${r.id}`}
                        className="truncate font-medium hover:underline"
                      >
                        {r.name}
                      </Link>
                      <StatusBadge active={r.active} />
                    </div>
                    <div className="mt-0.5 text-xs text-white/60">
                      {fmtType(r.type)}
                      {r.locationId ? ` • ${r.locationId}` : ""}
                      {" • "}
                      вместимость: {r.capacity}
                    </div>
                  </div>
                  <Link
                    href={`/demo/admin/booking/schedules/resources/${r.id}`}
                    className="shrink-0 rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15"
                  >
                    Открыть
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-white/70">
              <tr className="border-b border-white/10 text-left">
                <th className="p-3">Название</th>
                <th className="p-3">Тип</th>
                <th className="p-3">Локация</th>
                <th className="p-3">Вместимость</th>
                <th className="p-3">Статус</th>
                <th className="p-3">Действия</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-white/70">
                    Ресурсов нет.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-3">
                      <Link
                        href={`/demo/admin/booking/schedules/resources/${r.id}`}
                        className="hover:underline"
                      >
                        {r.name}
                      </Link>
                    </td>
                    <td className="p-3">{fmtType(r.type)}</td>
                    <td className="p-3">{r.locationId ?? <span className="opacity-60">—</span>}</td>
                    <td className="p-3">
                      <span className="rounded bg-white/10 px-2 py-0.5">{r.capacity}</span>
                    </td>
                    <td className="p-3">
                      <StatusBadge active={r.active} />
                    </td>
                    <td className="p-3">
                      <Link
                        href={`/demo/admin/booking/schedules/resources/${r.id}`}
                        className="rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 hover:bg-white/15"
                      >
                        Открыть
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}