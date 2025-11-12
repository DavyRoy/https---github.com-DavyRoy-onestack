"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CATALOG } from "@/app/demo/(shared)/integrations/data/mockAdminIntegrationsCatalog";

export default function CatalogGrid() {
  const sp = useSearchParams();
  const q = (sp.get("q") ?? "").toLowerCase();
  const category = sp.get("category");
  const status = sp.get("status") as "available" | "coming-soon" | null;

  const items = CATALOG.filter(
    (it) =>
      (q ? (it.name + it.description).toLowerCase().includes(q) : true) &&
      (category ? it.category === category : true) &&
      (status ? it.status === status : true)
  );

  if (!items.length) {
    return (
      <div className="rounded-2xl border border-white/15 bg-white/[0.05] p-6 text-center text-white/70">
        Интеграции не найдены. Измените фильтры.
      </div>
    );
  }

  return (
    <div
      className="
        grid gap-3
        sm:grid-cols-2 md:grid-cols-3
        w-full max-w-full min-w-0
        supports-[overflow:clip]:overflow-x-clip overflow-x-hidden
      "
    >
      {items.map((it) => (
        <Link
          key={it.id}
          href={it.link}
          className="
            rounded-2xl border border-white/15 bg-white/[0.05]
            p-4 hover:bg-white/[0.08] transition
            flex flex-col gap-2
            w-full min-w-0
          "
        >
          <div className="flex items-start justify-between gap-3 min-w-0">
            <div className="font-medium leading-snug break-words min-w-0">
              {it.name}
            </div>
            <span
              className={`
                shrink-0 px-2 py-0.5 text-[11px] rounded
                ${it.status === "available" ? "bg-emerald-500/70" : "bg-slate-500/70"}
              `}
            >
              {it.status === "available" ? "Available" : "Coming soon"}
            </span>
          </div>

          <div className="text-xs text-white/60 uppercase">
            {it.category}
          </div>

          <p className="text-sm text-white/80 leading-snug break-words">
            {it.description}
          </p>
        </Link>
      ))}
    </div>
  );
}