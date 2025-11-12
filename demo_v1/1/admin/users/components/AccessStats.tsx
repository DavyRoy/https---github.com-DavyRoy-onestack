"use client";

import Link from "next/link";

type Stats = {
  total: number;
  created30d: number;
  no2fa: number;
  invited: number;
};

export default function AccessStats({ stats }: { stats: Stats }) {
  const items = [
    { label: "Всего", value: stats.total, href: "/demo/admin/users/list" },
    { label: "Новые 30д", value: stats.created30d, href: "/demo/admin/users/list?created=30d" },
    { label: "Без 2FA", value: stats.no2fa, href: "/demo/admin/users/list?no2fa=true" },
    { label: "Приглашены", value: stats.invited, href: "/demo/admin/users/list?status=invited" },
  ];

  return (
    <section
      className="
        grid gap-3 w-full max-w-full
        sm:grid-cols-2 md:grid-cols-4
        min-w-0
      "
    >
      {items.map((it) => (
        <Link
          key={it.label}
          href={it.href}
          className="
            block rounded-2xl border border-white/15 bg-white/[0.05]
            p-4 hover:bg-white/[0.08] transition
            min-w-0
          "
        >
          <div className="text-xs text-white/60 truncate">{it.label}</div>
          <div className="mt-1 text-2xl font-semibold leading-tight">{it.value}</div>
        </Link>
      ))}
    </section>
  );
}