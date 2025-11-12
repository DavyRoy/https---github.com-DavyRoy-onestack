// app/demo/admin/booking/schedules/resources/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_RESOURCES } from "@/app/demo/(shared)/booking";

function getBaseFromPath(pathname: string | null) {
  if (!pathname) return "/demo/admin";
  if (pathname.startsWith("/demo/manager")) return "/demo/manager";
  if (pathname.startsWith("/demo/user")) return "/demo/user";
  return "/demo/admin";
}

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
  const pathname = usePathname();
  const base = getBaseFromPath(pathname);

  const rows = React.useMemo(() => {
    const xs = Array.isArray(ADMIN_RESOURCES) ? [...ADMIN_RESOURCES] : [];
    // Активные вверх, затем по имени
    xs.sort((a, b) => {
      const ra = a.active ? 0 : 1;
      const rb = b.active ? 0 : 1;
      return ra - rb || a.name.localeCompare(b.name, "ru");
    });
    return xs;
  }, []);

  const total = rows.length;

  return (
    <div className="grid gap-6">
      {/* header */}
      <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="text-xs text-white/60">Расписания</div>
          <h1 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight">Ресурсы</h1>
          <p className="mt-1 text-sm text-white/70">
            Сотрудники, кабинеты и оборудование. Всего:{" "}
            <span className="text-white/85">{total}</span>
          </p>
        </div>
        <Link
          href={`${base}/booking/schedules/resources/new`}
          className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
        >
          Добавить ресурс
        </Link>
      </header>

      {/* пустое состояние */}
      {total === 0 ? (
        <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-6 text-center">
          <div className="text-sm text-white/70">Ресурсов пока нет.</div>
          <Link
            href={`${base}/booking/schedules/resources/new`}
            className="mt-3 inline-flex rounded-xl border border-white/15 bg-white px-4 py-2 text-sm text-black hover:bg-white/90"
          >
            Добавить ресурс
          </Link>
        </section>
      ) : (
        <section className="rounded-2xl border border-white/15 bg-white/[0.05]">
          {/* mobile cards */}
          <div className="divide-y divide-white/10 md:hidden">
            {rows.map((r) => (
              <div key={r.id} className="p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`${base}/booking/schedules/resources/${r.id}`}
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
                      вместимость: {Number.isFinite(r.capacity) ? r.capacity : 1}
                    </div>
                  </div>
                  <Link
                    href={`${base}/booking/schedules/resources/${r.id}`}
                    aria-label={`Открыть ресурс ${r.name}`}
                    className="shrink-0 rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                  >
                    Открыть
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full text-sm">
              <caption className="sr-only">Список ресурсов</caption>
              <thead className="text-white/70">
                <tr className="border-b border-white/10 text-left">
                  <th scope="col" className="p-3">Название</th>
                  <th scope="col" className="p-3">Тип</th>
                  <th scope="col" className="p-3">Локация</th>
                  <th scope="col" className="p-3">Вместимость</th>
                  <th scope="col" className="p-3">Статус</th>
                  <th scope="col" className="p-3">Действия</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-3">
                      <Link
                        href={`${base}/booking/schedules/resources/${r.id}`}
                        className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded"
                      >
                        {r.name}
                      </Link>
                    </td>
                    <td className="p-3">{fmtType(r.type)}</td>
                    <td className="p-3">{r.locationId ?? <span className="opacity-60">—</span>}</td>
                    <td className="p-3">
                      <span className="rounded bg-white/10 px-2 py-0.5">
                        {Number.isFinite(r.capacity) ? r.capacity : 1}
                      </span>
                    </td>
                    <td className="p-3">
                      <StatusBadge active={r.active} />
                    </td>
                    <td className="p-3">
                      <Link
                        href={`${base}/booking/schedules/resources/${r.id}`}
                        className="rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                      >
                        Открыть
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}