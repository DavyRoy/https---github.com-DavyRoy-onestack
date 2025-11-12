"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TrendingUp, CalendarX, UserX, AlertTriangle } from "lucide-react";

/** Определяем базовый префикс (admin/manager/user) по текущему пути */
function getBaseFromPath(pathname: string | null) {
  if (!pathname) return "/demo/admin";
  if (pathname.startsWith("/demo/manager")) return "/demo/manager";
  if (pathname.startsWith("/demo/user")) return "/demo/user";
  return "/demo/admin";
}

/** Безопасное округление и ограничение процента в диапазоне 0..100 */
function fmtPercent(n: unknown): string {
  const v = Math.max(0, Math.min(100, Number(n) || 0));
  return `${Math.round(v)}%`;
}

/** Безопасное целое число (для дней и т.п.) */
function fmtInt(n: unknown): string {
  const v = Math.max(0, Math.floor(Number(n) || 0));
  return v.toLocaleString("ru-RU");
}

export default function BookingStats({
  utilization,
  cancelRate,
  noShowRate,
  lowCoverageDays,
}: {
  utilization: number;
  cancelRate: number;
  noShowRate: number;
  lowCoverageDays: number;
}) {
  const pathname = usePathname();
  const base = getBaseFromPath(pathname);

  // отчёты по отменам / no-show логичнее вести в "manager", но если мы уже в Manager — остаёмся там
  const reportsBase = base === "/demo/manager" ? "/demo/manager" : "/demo/manager";

  const cards = [
    {
      label: "Средняя загрузка",
      value: fmtPercent(utilization),
      href: `${base}/booking/schedules?focus=coverage`,
      icon: <TrendingUp className="w-4 h-4" aria-hidden="true" />,
    },
    {
      label: "Отмены",
      value: fmtPercent(cancelRate),
      href: `${reportsBase}/reports/booking?focus=cancel`,
      icon: <CalendarX className="w-4 h-4" aria-hidden="true" />,
    },
    {
      label: "No-show",
      value: fmtPercent(noShowRate),
      href: `${reportsBase}/reports/booking?focus=noshow`,
      icon: <UserX className="w-4 h-4" aria-hidden="true" />,
    },
    {
      label: "Дней с низким покрытием",
      value: fmtInt(lowCoverageDays),
      href: `${base}/booking/schedules`,
      icon: <AlertTriangle className="w-4 h-4" aria-hidden="true" />,
    },
  ] as const;

  return (
    <section
      className="admin-section border-white/12 bg-white/8"
      aria-labelledby="booking-stats-title"
    >
      <h2 id="booking-stats-title" className="sr-only">
        KPI бронирований
      </h2>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="group rounded-2xl border border-white/12 bg-white/10 p-4 text-white/85 transition hover:border-white/18 hover:bg-white/16 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            aria-label={`${c.label}: ${c.value}. Открыть детали`}
          >
            <div className="flex items-center justify-between text-xs text-white/60">
              <span>{c.label}</span>
              <span className="opacity-70 transition group-hover:opacity-100">
                {c.icon}
              </span>
            </div>

            <div className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">
              {c.value}
            </div>

            <div className="mt-2 text-[11px] text-white/50 transition group-hover:text-white/70">
              Открыть →
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}