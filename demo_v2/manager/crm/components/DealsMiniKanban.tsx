"use client";

import { memo, useMemo } from "react";
import Link from "next/link";
import { T } from "@/app/demo/manager/_parts/tokens";
import type { Deal, DealStage } from "@/app/demo/manager/crm/data/mockDeals";

const STAGES: ReadonlyArray<{ id: DealStage; title: string }> = [
  { id: "new",         title: "Новый" },
  { id: "in_progress", title: "В работе" },
  { id: "proposal",    title: "Коммерческое" },
  { id: "won",         title: "Успех" },
];

const stageTone: Record<DealStage, string> = {
  new: "ring-sky-400/25 bg-sky-400/10",
  in_progress: "ring-amber-400/25 bg-amber-400/10",
  proposal: "ring-violet-400/25 bg-violet-400/10",
  won: "ring-emerald-400/25 bg-emerald-400/10",
  lost: "ring-rose-400/25 bg-rose-400/10", // не показываем колонку, но оставим стиль
};

const fmt = (n: number) => n.toLocaleString("ru-RU");

export default memo(function DealsMiniKanban({ deals }: { deals: Deal[] }) {
  const safeDeals = Array.isArray(deals) ? deals : [];

  // Группируем сделки по этапам и делаем топ-3 для мини-вью
  const grouped = useMemo(() => {
    const base: Record<DealStage, Deal[]> = {
      new: [], in_progress: [], proposal: [], won: [], lost: [],
    };
    for (const d of safeDeals) base[d.stage]?.push(d);

    const top3 = Object.fromEntries(
      Object.entries(base).map(([k, v]) => [k, v.slice(0, 3)])
    ) as Record<DealStage, Deal[]>;

    const restCount = Object.fromEntries(
      Object.entries(base).map(([k, v]) => [k, Math.max(0, v.length - 3)])
    ) as Record<DealStage, number>;

    return { base, top3, restCount };
  }, [safeDeals]);

  return (
    <div
      className="
        grid gap-2
        md:grid-cols-4
        md:overflow-visible
        overflow-x-auto pb-1
        snap-x snap-mandatory
        [-webkit-overflow-scrolling:touch]
      "
      aria-label="Мини-канбан по сделкам"
    >
      {STAGES.map((st) => {
        const rows = grouped.top3[st.id] || [];
        const total = grouped.base[st.id]?.length ?? 0;
        const rest = grouped.restCount[st.id] ?? 0;

        return (
          <section
            key={st.id}
            className="
              rounded-2xl border border-white/10 bg-white/[0.04] p-2
              min-w-[260px] snap-start
            "
            aria-label={`Колонка «${st.title}»`}
          >
            <header className="flex items-baseline justify-between">
              <div className="text-xs text-white/80">{st.title}</div>
              <div className={"text-[11px] " + T.mut}>{total}</div>
            </header>

            <div className="mt-2 grid gap-2">
              {rows.length === 0 ? (
                <div className={"text-xs " + T.dim}>Нет карточек</div>
              ) : (
                rows.map((d) => (
                  <Link
                    key={d.id}
                    href={`/demo/manager/crm/deals/${d.id}`}
                    prefetch={false}
                    className={[
                      "rounded-xl border border-white/10 p-2 transition",
                      "hover:-translate-y-0.5 hover:bg-white/[0.1]",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
                      "will-change-transform",
                      "ring-1 ring-inset",
                      stageTone[d.stage] || "ring-white/10 bg-white/[0.06]",
                    ].join(" ")}
                    aria-label={`${d.title}, ${d.client}, на сумму ${fmt(d.amount)} рублей`}
                  >
                    <div className="truncate text-sm font-medium">{d.title}</div>
                    <div className={"truncate text-xs " + T.dim}>{d.client}</div>
                    <div className="mt-0.5 text-xs tabular-nums">{fmt(d.amount)} ₽</div>
                  </Link>
                ))
              )}

              {/* Переход к полному канбану / остаток */}
              {rest > 0 && (
                <Link
                  href={`/demo/manager/crm/deals?stage=${st.id}`}
                  prefetch={false}
                  className="inline-flex items-center gap-1 rounded-lg border border-white/12 bg-white/6 px-2 py-1 text-[11px] text-white/85 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                  aria-label={`Показать ещё ${rest} карточек в «${st.title}»`}
                >
                  Показать ещё +{rest}
                </Link>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
});