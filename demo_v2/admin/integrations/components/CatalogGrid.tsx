// app/demo/admin/integrations/components/CatalogGrid.tsx
"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CATALOG } from "@/app/demo/(shared)/integrations/data/mockAdminIntegrationsCatalog";

type Status = "available" | "coming-soon";

export default function CatalogGrid() {
  const sp = useSearchParams();

  // Читаем параметры поиска (без локального стейта -> без рисков гидрации)
  const q = (sp.get("q") ?? "").trim().toLowerCase();
  const category = sp.get("category") || "";
  const status = (sp.get("status") as Status | null) ?? null;

  // Быстрая фильтрация с мемоизацией
  const items = React.useMemo(() => {
    const needle = q;
    return CATALOG.filter((it) => {
      const matchesText = needle
        ? (it.name + " " + it.description + " " + (it.tags?.join(" ") || ""))
            .toLowerCase()
            .includes(needle)
        : true;
      const matchesCat = category ? it.category === category : true;
      const matchesStatus = status ? it.status === status : true;
      return matchesText && matchesCat && matchesStatus;
    });
  }, [q, category, status]);

  // Бейдж статуса
  const statusBadge = (s: Status) =>
    s === "available"
      ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/30"
      : "bg-slate-500/20 text-slate-300 border-slate-400/30";

  if (items.length === 0) {
    return (
      <section
        className="
          rounded-2xl border border-white/15 bg-white/[0.05] p-6 text-center
        "
        aria-live="polite"
      >
        <div className="text-white/80 font-medium">Интеграции не найдены</div>
        <p className="text-white/60 text-sm mt-1">
          Попробуйте изменить запрос{category ? " или категорию" : ""}{status ? " или статус" : ""}.
        </p>
      </section>
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
      role="list"
      aria-label="Каталог интеграций"
    >
      {items.map((it) => (
        <Link
          key={it.id}
          href={it.link}
          role="listitem"
          className="
            rounded-2xl border border-white/15 bg-white/[0.05]
            p-4 hover:bg-white/[0.08] transition
            flex flex-col gap-2
            w-full min-w-0
            focus:outline-none focus:ring-2 focus:ring-white/30
          "
          aria-label={`${it.name}: открыть страницу интеграции`}
        >
          <div className="flex items-start justify-between gap-3 min-w-0">
            <h3 className="font-medium leading-snug break-words min-w-0">
              {it.name}
            </h3>
            <span
              className={`shrink-0 px-2 py-0.5 text-[11px] rounded-md border ${statusBadge(it.status)}`}
            >
              {it.status === "available" ? "Available" : "Coming soon"}
            </span>
          </div>

          <div className="text-[11px] uppercase tracking-wide text-white/60">
            {it.category}
          </div>

          <p className="text-sm text-white/80 leading-snug break-words">
            {it.description}
          </p>

          {Array.isArray(it.tags) && it.tags.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1.5">
              {it.tags.slice(0, 6).map((t) => (
                <span
                  key={t}
                  className="
                    text-[11px] px-2 py-0.5 rounded-md
                    border border-white/10 bg-white/[0.04] text-white/70
                  "
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </Link>
      ))}
    </div>
  );
}