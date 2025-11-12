// app/demo/admin/booking/policies/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { ADMIN_POLICIES } from "@/app/demo/(shared)/booking";

function TypeBadge({ v }: { v: string }) {
  const map: Record<string, string> = {
    cancel: "Отмена",
    deposit: "Предоплата",
    leadtime: "Lead-time",
    buffer: "Буферы",
    overbooking: "Овербукинг",
    overbook: "Овербукинг", // на случай старого ключа
  };
  return (
    <span className="rounded px-2 py-0.5 text-xs bg-white/10">
      {map[v] ?? v}
    </span>
  );
}

function LevelBadge({ v }: { v: string }) {
  const map: Record<string, string> = {
    org: "Орг.",
    location: "Локация",
    category: "Категория",
    service: "Услуга",
    resource: "Ресурс",
  };
  return (
    <span className="rounded px-2 py-0.5 text-xs bg-white/10">
      {map[v] ?? v}
    </span>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`rounded px-2 py-0.5 text-xs ${
        active
          ? "bg-emerald-400/15 text-emerald-300"
          : "bg-white/10 text-white/70"
      }`}
    >
      {active ? "Активна" : "Отключена"}
    </span>
  );
}

export default function AdminPoliciesListPage() {
  const rows = React.useMemo(
    () =>
      [...ADMIN_POLICIES].sort(
        (a, b) =>
          Number(b.active) - Number(a.active) ||
          a.name.localeCompare(b.name, "ru")
      ),
    []
  );

  const empty = rows.length === 0;

  return (
    <div className="grid gap-6">
      {/* header */}
      <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Политики
        </h1>
        <Link
          href="/demo/admin/booking/policies/new"
          className="rounded-xl border border-white/15 px-3 py-2 bg-white/[0.06] hover:bg-white/[0.1] text-sm"
        >
          Новая политика
        </Link>
      </header>

      {/* mobile cards */}
      <section className="grid gap-2 md:hidden">
        {empty ? (
          <div className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 text-center text-sm text-white/60">
            Политик пока нет.
          </div>
        ) : (
          rows.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl border border-white/15 bg-white/[0.05] p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <Link
                    href={`/demo/admin/booking/policies/${p.id}`}
                    className="block truncate font-medium hover:underline"
                  >
                    {p.name}
                  </Link>
                  <div className="mt-1 flex flex-wrap gap-1.5 text-xs text-white/70">
                    <TypeBadge v={p.type as string} />
                    <LevelBadge v={(p as any).level ?? (p as any).scope} />
                    <StatusBadge active={!!p.active} />
                  </div>
                </div>
                <Link
                  href={`/demo/admin/booking/policies/${p.id}`}
                  className="shrink-0 rounded-lg border border-white/15 bg-white/10 px-2 py-1 text-sm hover:bg-white/15"
                >
                  Открыть
                </Link>
              </div>
              {p.updatedAt && (
                <div className="mt-1 text-[11px] text-white/50">
                  Обновлено: {new Date(p.updatedAt).toLocaleString("ru-RU")}
                </div>
              )}
            </div>
          ))
        )}
      </section>

      {/* desktop table */}
      <section className="hidden md:block rounded-2xl border border-white/15 bg-white/[0.05] overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-white/70 sticky top-0 bg-[#0b0e14]">
            <tr className="border-b border-white/10 text-left">
              <th className="p-3">Название</th>
              <th className="p-3">Тип</th>
              <th className="p-3">Уровень</th>
              <th className="p-3">Статус</th>
              <th className="p-3 text-right">Действия</th>
            </tr>
          </thead>
          <tbody>
            {empty ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-white/60">
                  Политик пока нет.
                </td>
              </tr>
            ) : (
              rows.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-white/5 hover:bg-white/[0.04]"
                >
                  <td className="p-3">
                    <Link
                      href={`/demo/admin/booking/policies/${p.id}`}
                      className="hover:underline"
                    >
                      {p.name}
                    </Link>
                    {p.updatedAt && (
                      <div className="mt-0.5 text-[11px] text-white/50">
                        Обновлено:{" "}
                        {new Date(p.updatedAt).toLocaleString("ru-RU")}
                      </div>
                    )}
                  </td>
                  <td className="p-3">
                    <TypeBadge v={p.type as string} />
                  </td>
                  <td className="p-3">
                    <LevelBadge v={(p as any).level ?? (p as any).scope} />
                  </td>
                  <td className="p-3">
                    <StatusBadge active={!!p.active} />
                  </td>
                  <td className="p-3 text-right">
                    <Link
                      href={`/demo/admin/booking/policies/${p.id}`}
                      className="rounded-lg border border-white/15 px-3 py-1.5 hover:bg-white/[0.06]"
                    >
                      Открыть
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}