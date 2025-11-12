// app/demo/admin/booking/schedules/resources/[id]/page.tsx
"use client";

import * as React from "react";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { ADMIN_RESOURCES } from "@/app/demo/(shared)/booking";

function getBaseFromPath(pathname: string | null) {
  if (!pathname) return "/demo/admin";
  if (pathname.startsWith("/demo/manager")) return "/demo/manager";
  if (pathname.startsWith("/demo/user")) return "/demo/user";
  return "/demo/admin";
}

function fmtType(t: (typeof ADMIN_RESOURCES)[number]["type"]) {
  switch (t) {
    case "staff":
      return "Сотрудник";
    case "room":
      return "Кабинет";
    case "equipment":
      return "Оборудование";
    default:
      return String(t);
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

export default function AdminResourceCardPage() {
  const params = useParams<{ id: string }>();
  const pathname = usePathname();
  const base = getBaseFromPath(pathname);

  const res = ADMIN_RESOURCES.find((r) => r.id === params.id);

  if (!res) {
    return (
      <div className="grid gap-6">
        <header className="flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-semibold">Ресурс не найден</h1>
          <Link
            href={`${base}/booking/schedules/resources`}
            className="rounded-xl border border-white/15 px-3 py-2 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            К списку ресурсов
          </Link>
        </header>

        <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 text-sm text-white/70">
          Проверьте URL или вернитесь к списку.
        </section>
      </div>
    );
  }

  const capacity = Number.isFinite(res.capacity) ? res.capacity : 1;

  return (
    <div className="grid gap-6">
      {/* Header */}
      <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <nav className="text-xs text-white/60" aria-label="Хлебные крошки">
            <Link href={`${base}/booking/schedules`} className="hover:underline">
              Расписания
            </Link>
            <span className="mx-1 opacity-50">/</span>
            <Link href={`${base}/booking/schedules/resources`} className="hover:underline">
              Ресурсы
            </Link>
            <span className="mx-1 opacity-50">/</span>
            <span className="text-white/80">{res.name}</span>
          </nav>
          <h1 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight">
            {res.name}
          </h1>
          <div className="mt-1 text-xs text-white/70 flex items-center gap-2">
            <StatusBadge active={res.active} />
            <span>• {fmtType(res.type)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`${base}/booking/schedules`}
            className="rounded-xl border border-white/15 px-3 py-2 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            К расписаниям
          </Link>
          <Link
            href={`${base}/booking/schedules/resources`}
            className="rounded-xl border border-white/15 px-3 py-2 bg-white/[0.06] hover:bg-white/[0.1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            К списку ресурсов
          </Link>
        </div>
      </header>

      {/* Info card */}
      <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5">
        <div className="grid gap-4 sm:grid-cols-2 text-sm">
          <div className="flex items-center justify-between sm:block">
            <div className="text-white/60">Тип</div>
            <div className="mt-0.5 sm:mt-1 font-medium">{fmtType(res.type)}</div>
          </div>

          <div className="flex items-center justify-between sm:block">
            <div className="text-white/60">Локация</div>
            <div className="mt-0.5 sm:mt-1 font-medium">
              {res.locationId ?? <span className="opacity-60">—</span>}
            </div>
          </div>

          <div className="flex items-center justify-between sm:block">
            <div className="text-white/60">Вместимость</div>
            <div className="mt-0.5 sm:mt-1">
              <span className="rounded bg-white/10 px-2 py-0.5">{capacity}</span>
            </div>
          </div>

          <div className="flex items-center justify-between sm:block">
            <div className="text-white/60">Статус</div>
            <div className="mt-0.5 sm:mt-1">
              <StatusBadge active={res.active} />
            </div>
          </div>
        </div>

        <div className="mt-4 text-sm text-white/70">
          Связанные услуги:{" "}
          {Array.isArray(res.services) && res.services.length > 0 ? (
            <span className="inline-flex flex-wrap gap-1 align-middle">
              {res.services.map((sid) => (
                <span
                  key={sid}
                  className="inline-flex items-center rounded bg-white/10 px-2 py-0.5"
                  title={sid}
                >
                  {sid}
                </span>
              ))}
            </span>
          ) : (
            "—"
          )}
        </div>
      </section>
    </div>
  );
}