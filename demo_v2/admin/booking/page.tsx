// app/demo/admin/booking/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ADMIN_BOOKING_KPI,
  BOOKING_CATEGORIES,
  ADMIN_BOOKING_SERVICES,
} from "@/app/demo/(shared)/booking";

/* ---------- helpers ---------- */
function fmtDelta(d?: number) {
  if (typeof d !== "number" || Number.isNaN(d)) return null;
  const sign = d > 0 ? "+" : d < 0 ? "" : "";
  return `${sign}${d}%`;
}

function getBaseFromPath(pathname: string | null) {
  if (!pathname) return "/demo/admin";
  if (pathname.startsWith("/demo/manager")) return "/demo/manager";
  if (pathname.startsWith("/demo/user")) return "/demo/user";
  return "/demo/admin";
}

/* ---------- hero ---------- */
function BookingHero({ base }: { base: string }) {
  return (
    <header className="admin-section border-white/12 bg-white/8 p-4 md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Бронирование</h1>
          <p className="mt-1 text-sm text-white/70">
            KPI загрузки, отмен и no-show. Шаблоны расписаний, исключения и ресурсы.
          </p>
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <Link
            href={`${base}/calendar`}
            className="flex-1 rounded-xl border border-white/12 bg-white/10 px-3 py-1.5 text-sm text-white/85 transition hover:border-white/18 hover:bg-white/16 sm:flex-none"
          >
            Общий календарь
          </Link>
          <Link
            href={`${base}/booking/schedules`}
            className="flex-1 rounded-xl border border-white/12 bg-white/10 px-3 py-1.5 text-sm text-white/85 transition hover:border-white/18 hover:bg-white/16 sm:flex-none"
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
      <section className="admin-section border-white/12 bg-white/8">
        <div className="text-sm font-medium mb-2">KPI бронирований</div>
        <div className="text-sm text-white/70">Данные недоступны (демо).</div>
      </section>
    );
  }

  return (
    <section
      className="admin-section grid gap-3 border-white/12 bg-white/8 sm:grid-cols-2 md:grid-cols-4"
      aria-labelledby="booking-kpi-title"
    >
      <h2 id="booking-kpi-title" className="sr-only">
        KPI бронирований
      </h2>
      {safe.map((it) => {
        const deltaText = fmtDelta(it.delta);
        const trendTone =
          typeof it.delta === "number"
            ? it.delta > 0
              ? "bg-emerald-500/15 text-emerald-300"
              : it.delta < 0
              ? "bg-rose-500/15 text-rose-300"
              : "bg-white/10 text-white/70"
            : "bg-white/10 text-white/70";

        return (
          <Link
            key={it.label}
            href={it.href}
            className="rounded-2xl border border-white/12 bg-white/10 p-4 text-white/85 transition hover:border-white/18 hover:bg-white/14 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            aria-label={`${it.label}: ${Number(it.value).toLocaleString("ru-RU")}${
              deltaText ? `, изменение ${deltaText}` : ""
            }`}
          >
            <div className="text-xs text-white/60">{it.label}</div>
            <div className="mt-1 text-2xl font-semibold">
              {Number(it.value).toLocaleString("ru-RU")}
            </div>
            {typeof it.delta === "number" && (
              <div className={`mt-1 inline-flex rounded px-1.5 py-0.5 text-[11px] ${trendTone}`}>
                {deltaText}
              </div>
            )}
            <div className="mt-2 text-[11px] text-white/60">Открыть →</div>
          </Link>
        );
      })}
    </section>
  );
}

/* ---------- Быстрые действия ---------- */
function QuickActions({ base }: { base: string }) {
  const items = [
    { title: "Расписания", href: `${base}/booking/schedules`, desc: "Правила слотов и сетка" },
    { title: "Ресурсы", href: `${base}/booking/schedules/resources`, desc: "Персонал, комнаты, места" },
    { title: "Исключения", href: `${base}/booking/schedules/exceptions`, desc: "Праздники, ремонты, блоки" },
    { title: "Политики", href: `${base}/booking/policies`, desc: "Отмена, депозит, lead-time" },
  ] as const;

  return (
    <section className="admin-section border-white/12 bg-white/8" aria-labelledby="booking-quick-title">
      <div id="booking-quick-title" className="mb-3 text-sm font-medium text-white/85">
        Быстрые действия
      </div>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
        {items.map((it) => (
          <Link
            key={it.title}
            href={it.href}
            className="group rounded-xl border border-white/12 bg-white/10 p-3 text-white/85 transition hover:border-white/18 hover:bg-white/16"
            aria-label={`${it.title}: ${it.desc}`}
          >
            <div className="text-sm font-medium">{it.title}</div>
            <div className="mt-1 text-xs text-white/60">{it.desc}</div>
            <div className="mt-2 text-[11px] text-white/50 transition group-hover:text-white/70">
              Открыть →
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ---------- Категории ---------- */
function CategoryLinks({ base }: { base: string }) {
  const cats = Array.isArray(BOOKING_CATEGORIES) ? BOOKING_CATEGORIES : [];
  const svcs = Array.isArray(ADMIN_BOOKING_SERVICES) ? ADMIN_BOOKING_SERVICES : [];

  if (cats.length === 0) {
    return (
      <section className="admin-section border-white/12 bg-white/8">
        <div className="mb-2 text-sm font-medium text-white/85">Категории бронирования</div>
        <div className="text-sm text-white/70">Категории не найдены (демо).</div>
      </section>
    );
  }

  return (
    <section
      className="admin-section border-white/12 bg-white/8"
      aria-labelledby="booking-cats-title"
    >
      <div id="booking-cats-title" className="mb-2 text-sm font-medium text-white/85">
        Категории бронирования
      </div>
      <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
        {cats.map((c) => {
          const count = svcs.filter((s) => s.categoryId === c.id).length;
          return (
            <Link
              key={c.id}
              href={`${base}/booking/categories/${c.slug}`}
              className="flex items-center justify-between gap-2 rounded-xl border border-white/12 bg-white/10 px-3 py-2 text-sm text-white/85 transition hover:border-white/18 hover:bg-white/16"
              aria-label={`${c.name}: ${count} услуг`}
              title={c.name}
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
  const pathname = usePathname();
  const base = getBaseFromPath(pathname);

  const [loading, setLoading] = React.useState(true);
  const [kpi] = React.useState(ADMIN_BOOKING_KPI);

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 180);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <BookingHero base={base} />

      {loading ? (
        <section
          className="admin-section border-white/12 bg-white/8"
          aria-busy="true"
          aria-live="polite"
        >
          <div className="grid gap-2">
            <div className="h-5 w-1/3 rounded bg-white/10 animate-pulse" />
            <div className="h-24 rounded bg-white/10 animate-pulse" />
          </div>
        </section>
      ) : (
        <>
          <BookingStats items={kpi} />
          <QuickActions base={base} />
          <CategoryLinks base={base} />
        </>
      )}
    </>
  );
}