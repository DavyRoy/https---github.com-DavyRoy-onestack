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
      className="
        grid gap-3 sm:grid-cols-2 lg:grid-cols-4
        w-full max-w-full min-w-0
      "
      aria-label="Статистика аудита"
    >
      {stats.map((k) => (
        <Link
          key={k.href}
          href={k.href}
          className="
            group rounded-2xl border border-white/15
            bg-white/[0.05] hover:bg-white/[0.08]
            transition-colors duration-200 p-4
            flex flex-col justify-between
            focus:outline-none focus:ring-2 focus:ring-emerald-500/60
          "
        >
          <div className="text-xs text-white/60">{k.label}</div>
          <div
            className="
              text-lg sm:text-xl font-semibold mt-1
              text-white group-hover:text-white
              break-words
            "
          >
            {k.value}
          </div>
          {k.hint && (
            <div className="text-xs text-white/60 mt-1 whitespace-nowrap">
              {k.hint}
            </div>
          )}
        </Link>
      ))}
    </section>
  );
}