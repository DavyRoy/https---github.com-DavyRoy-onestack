"use client";

import Link from "next/link";
import { T } from "@/app/demo/manager/_parts/tokens";
import type { AgendaItem } from "@/app/demo/manager/dashboard/data/mockManagerDashboard";

const KIND_LABEL: Record<AgendaItem["kind"], string> = {
  lead: "Лид",
  order: "Заказ",
  booking: "Бронь",
  invoice: "Счёт",
};

const KIND_TONE: Record<AgendaItem["kind"], string> = {
  lead: "bg-sky-400/20 text-sky-200 border-sky-300/30",
  order: "bg-violet-400/20 text-violet-200 border-violet-300/30",
  booking: "bg-emerald-400/20 text-emerald-200 border-emerald-300/30",
  invoice: "bg-amber-400/20 text-amber-200 border-amber-300/30",
};

function KindBadge({ kind }: { kind: AgendaItem["kind"] }) {
  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 text-[11px] ${KIND_TONE[kind]}`}
      aria-hidden
    >
      {KIND_LABEL[kind]}
    </span>
  );
}

export default function TodayAgenda({ items }: { items: AgendaItem[] }) {
  const list = items ?? [];

  return (
    <section className={T.card + " grid gap-3"} aria-labelledby="agenda-title">
      <div className="flex items-center justify-between">
        <div id="agenda-title" className="text-base font-semibold">
          Повестка дня
        </div>
        {list.length > 0 && (
          <div className={T.mut + " text-xs"} aria-live="polite">
            {list.length} {list.length === 1 ? "задача" : "задачи"}
          </div>
        )}
      </div>

      {list.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-6 text-center">
          <div className="text-sm font-medium">На сегодня задач нет</div>
          <div className={"mt-1 text-xs " + T.mut}>
            Создайте лид, заказ или запись на приём.
          </div>
        </div>
      ) : (
        <div className="grid gap-2">
          {list.map((i) => (
            <Link
              key={i.id}
              href={i.href}
              className="
                rounded-xl border border-white/10 bg-white/[0.04] p-3
                hover:bg-white/[0.07] transition
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30
              "
              aria-label={`${KIND_LABEL[i.kind]} • ${i.title} — ${i.client}, ${i.time}${i.overdue ? ", просрочено" : ""}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <KindBadge kind={i.kind} />
                    {i.overdue && (
                      <span className="inline-flex items-center rounded border border-rose-400/40 bg-rose-500/15 px-2 py-0.5 text-[11px] text-rose-200">
                        Просрочено
                      </span>
                    )}
                  </div>

                  <div className="mt-1 text-sm font-medium truncate">
                    {i.title} • <span className="opacity-80">{i.client}</span>
                  </div>

                  <div className={"text-xs " + T.mut}>
                    {KIND_LABEL[i.kind]}
                  </div>
                </div>

                <div
                  className={
                    "tabular-nums text-sm shrink-0 " +
                    (i.overdue ? "text-rose-300" : "text-white/90")
                  }
                  title={i.time}
                >
                  {i.time}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}