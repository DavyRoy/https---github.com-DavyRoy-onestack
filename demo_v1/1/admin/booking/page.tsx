// app/demo/admin/booking/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import {
  ADMIN_BOOKING_KPI,
  BOOKING_CATEGORIES,
  ADMIN_BOOKING_SERVICES,
} from "@/app/demo/(shared)/booking";

/* ---------- helpers ---------- */
function fmtDelta(d?: number) {
  if (typeof d !== "number") return null;
  const sign = d > 0 ? "+" : "";
  return `${sign}${d}%`;
}

/* ---------- hero ---------- */
function BookingHero() {
  return (
    <header className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Бронирование</h1>
          <p className="mt-1 text-sm text-white/70">
            KPI загрузки, отмен и no-show. Шаблоны расписаний, исключения и ресурсы.
          </p>
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <Link
            href="/demo/admin/calendar"
            className="flex-1 rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15 sm:flex-none"
          >
            Общий календарь
          </Link>
          <Link
            href="/demo/admin/booking/schedules"
            className="flex-1 rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15 sm:flex-none"
          >
            Расписания
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ---------- KPI ---------- */
function BookingStats({
  items,
}: {
  items: { label: string; value: number; delta?: number; href: string }[];
}) {
  const safe = Array.isArray(items) ? items : [];
  if (safe.length === 0) {
    return (
      <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4">
        <div className="text-sm font-medium mb-2">KPI бронирований</div>
        <div className="text-sm text-white/70">Данные недоступны (демо).</div>
      </section>
    );
  }

  return (
    <section className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
      {safe.map((it) => (
        <Link
          key={it.label}
          href={it.href}
          className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 hover:bg-white/[0.08] transition"
        >
          <div className="text-xs text-white/60">{it.label}</div>
          <div className="mt-1 text-2xl font-semibold">{Number(it.value).toLocaleString("ru-RU")}</div>
          {typeof it.delta === "number" && (
            <div
              className={`mt-1 inline-flex rounded px-1.5 py-0.5 text-[11px] ${
                it.delta > 0
                  ? "bg-emerald-500/15 text-emerald-300"
                  : it.delta < 0
                  ? "bg-rose-500/15 text-rose-300"
                  : "bg-white/10 text-white/70"
              }`}
            >
              {fmtDelta(it.delta)}
            </div>
          )}
          <div className="mt-2 text-[11px] text-white/60">Открыть →</div>
        </Link>
      ))}
    </section>
  );
}

/* ---------- Быстрые действия ---------- */
function QuickActions() {
  // выровнено под существующие маршруты в проекте
  const items = [
    { title: "Расписания", href: "/demo/admin/booking/schedules", desc: "Правила слотов и сетка" },
    { title: "Ресурсы", href: "/demo/admin/booking/schedules/resources", desc: "Персонал, комнаты, места" },
    { title: "Исключения", href: "/demo/admin/booking/schedules/exceptions", desc: "Праздники, ремонты, блоки" },
    { title: "Политики", href: "/demo/admin/booking/policies", desc: "Отмена, депозит, lead-time" },
  ] as const;

  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4">
      <div className="text-sm font-medium mb-3">Быстрые действия</div>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
        {items.map((it) => (
          <Link
            key={it.title}
            href={it.href}
            className="group rounded-xl border border-white/15 bg-white/[0.06] p-3 hover:bg-white/[0.1] transition"
          >
            <div className="text-sm font-medium">{it.title}</div>
            <div className="mt-1 text-xs text-white/60">{it.desc}</div>
            <div className="mt-2 text-[11px] text-white/50 group-hover:text-white/70">Открыть →</div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ---------- Категории ---------- */
function CategoryLinks() {
  const cats = Array.isArray(BOOKING_CATEGORIES) ? BOOKING_CATEGORIES : [];
  const svcs = Array.isArray(ADMIN_BOOKING_SERVICES) ? ADMIN_BOOKING_SERVICES : [];

  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4">
      <div className="text-sm font-medium mb-2">Категории бронирования</div>
      <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
        {cats.map((c) => {
          const count = svcs.filter((s) => s.categoryId === c.id).length;
          return (
            <Link
              key={c.id}
              href={`/demo/admin/booking/categories/${c.slug}`}
              className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 hover:bg-white/15 text-sm flex items-center justify-between gap-2"
            >
              <span className="truncate">{c.name}</span>
              <span className="text-xs text-white/60 shrink-0">{count}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/* ---------- Page ---------- */
export default function AdminBookingHubPage() {
  const [loading, setLoading] = React.useState(true);
  const [kpi] = React.useState(ADMIN_BOOKING_KPI);

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 180);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="grid gap-6">
      <BookingHero />

      {loading ? (
        <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4">
          <div className="grid gap-2">
            <div className="h-5 w-1/3 rounded bg-white/10 animate-pulse" />
            <div className="h-24 rounded bg-white/10 animate-pulse" />
          </div>
        </section>
      ) : (
        <>
          <BookingStats items={kpi} />
          <QuickActions />
          <CategoryLinks />
        </>
      )}
    </div>
  );
}