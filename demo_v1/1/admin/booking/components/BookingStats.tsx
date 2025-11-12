"use client";

import Link from "next/link";
import { TrendingUp, CalendarX, UserX, AlertTriangle } from "lucide-react";

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
  const cards = [
    {
      label: "Средняя загрузка",
      value: `${utilization}%`,
      href: "/demo/admin/booking/schedules?focus=coverage",
      icon: <TrendingUp className="w-4 h-4" />,
    },
    {
      label: "Отмены",
      value: `${cancelRate}%`,
      href: "/demo/manager/reports/booking?focus=cancel",
      icon: <CalendarX className="w-4 h-4" />,
    },
    {
      label: "No-show",
      value: `${noShowRate}%`,
      href: "/demo/manager/reports/booking?focus=noshow",
      icon: <UserX className="w-4 h-4" />,
    },
    {
      label: "Дней с низким покрытием",
      value: `${lowCoverageDays}`,
      href: "/demo/admin/booking/schedules",
      icon: <AlertTriangle className="w-4 h-4" />,
    },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <Link
          key={c.label}
          href={c.href}
          className="group rounded-2xl border border-white/15 bg-white/[0.05] p-4 transition hover:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          <div className="flex items-center justify-between text-xs text-white/60">
            <span>{c.label}</span>
            <span className="opacity-70 group-hover:opacity-100 transition">
              {c.icon}
            </span>
          </div>

          <div className="mt-1 text-2xl font-semibold tracking-tight">
            {c.value}
          </div>

          <div className="mt-2 text-[11px] text-white/50 group-hover:text-white/70 transition">
            Открыть →
          </div>
        </Link>
      ))}
    </section>
  );
}