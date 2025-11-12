"use client";

import Link from "next/link";

type Linked = { type: string; id: string; href: string };

export default function LinkedObjects({ value }: { value: Linked[] }) {
  if (!value || value.length === 0) return null;

  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5">
      <div className="text-sm font-medium mb-2">Связанные объекты</div>

      <div className="flex flex-wrap gap-2">
        {value.map((l) => (
          <Link
            key={`${l.type}:${l.id}`}
            href={l.href}
            className="
              text-xs rounded-lg border border-white/15 px-2 py-1
              hover:bg-white/[0.08] hover:border-white/25 transition
              truncate max-w-[180px]
            "
            title={`${l.type} #${l.id}`}
          >
            <span className="text-white/70">{l.type}</span>
            <span className="text-white/90"> #{l.id}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}