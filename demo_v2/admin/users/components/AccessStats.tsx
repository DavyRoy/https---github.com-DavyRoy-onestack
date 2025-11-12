"use client";

import Link from "next/link";
import React from "react";

type Stats = {
  total: number;
  created30d: number;
  no2fa: number;
  invited: number;
};

export default function AccessStats({ stats }: { stats: Stats }) {
  const items = React.useMemo(
    () => [
      { label: "Всего", value: stats.total, href: "/demo/admin/users/list" },
      {
        label: "Новые 30 дней",
        value: stats.created30d,
        href: "/demo/admin/users/list?created=30d",
      },
      {
        label: "Без 2FA",
        value: stats.no2fa,
        href: "/demo/admin/users/list?no2fa=true",
      },
      {
        label: "Приглашены",
        value: stats.invited,
        href: "/demo/admin/users/list?status=invited",
      },
    ],
    [stats]
  );

  return (
    <section
      aria-label="Статистика пользователей"
      className="
        grid gap-3 sm:grid-cols-2 md:grid-cols-4
        w-full max-w-full min-w-0
      "
    >
      {items.map((it) => (
        <Link
          key={it.label}
          href={it.href}
          className="
            group block rounded-2xl border border-white/15
            bg-white/[0.05] hover:bg-white/[0.08]
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30
            transition-all duration-150 p-4
            min-w-0
          "
        >
          <div
            className="
              text-xs text-white/60
              truncate
              tracking-wide
              group-hover:text-white/75
              transition-colors
            "
          >
            {it.label}
          </div>
          <div
            className="
              mt-1 text-2xl font-semibold leading-tight
              text-white break-words
            "
          >
            {it.value.toLocaleString("ru-RU")}
          </div>
        </Link>
      ))}
    </section>
  );
}