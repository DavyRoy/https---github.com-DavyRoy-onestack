"use client";

import Link from "next/link";

type StatItem = {
  label: string;
  value: string;
  href: string;
  hint?: string;
};

export default function AuditStats({ stats }: { stats: StatItem[] }) {
  return (
    <section
      aria-label="Статистика аудита"
      className="
        admin-section grid gap-3
        border-white/12 bg-white/8
        sm:grid-cols-2 lg:grid-cols-4
      "
    >
      {stats.map((stat) => (
        <Link
          key={stat.href}
          href={stat.href}
          className="
            group flex flex-col justify-between
            rounded-2xl border border-white/12 bg-white/10 p-4
            text-white/85 transition-colors duration-200
            hover:border-white/18 hover:bg-white/16
            focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30
          "
        >
          <div className="text-xs text-white/60">{stat.label}</div>

          <div
            className="
              text-lg sm:text-xl font-semibold mt-1
              text-white group-hover:text-white break-words
            "
          >
            {stat.value}
          </div>

          {stat.hint && (
            <div className="text-xs text-white/60 mt-1 whitespace-nowrap">
              {stat.hint}
            </div>
          )}
        </Link>
      ))}
    </section>
  );
}