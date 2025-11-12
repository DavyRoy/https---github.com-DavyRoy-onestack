"use client";

import Link from "next/link";
import { T } from "@/app/demo/manager/_parts/tokens";
import type { RiskItem } from "@/app/demo/manager/dashboard/data/mockManagerDashboard";

type CTA =
  | { label: string; href: string; onClick?: never }
  | { label: string; href?: never; onClick: () => void };

type Item = Omit<RiskItem, "cta"> & { cta?: CTA };

function toneByCount(n: number) {
  if (n >= 20) return "bg-rose-500/20 text-rose-200 border-rose-400/30";
  if (n >= 6) return "bg-amber-500/20 text-amber-200 border-amber-400/30";
  if (n > 0) return "bg-white/12 text-white/80 border-white/20";
  return "bg-emerald-500/15 text-emerald-200 border-emerald-400/30";
}

export default function RiskAlerts({ items }: { items: Item[] }) {
  const hasItems = Array.isArray(items) && items.length > 0;

  return (
    <section className={T.card + " grid gap-3"} aria-labelledby="risk-title">
      <div id="risk-title" className="text-base font-semibold">
        Риски и просрочки
      </div>

      {!hasItems ? (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 text-center text-sm text-white/70">
          Рисков не обнаружено
        </div>
      ) : (
        <div
          className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3"
          role="list"
          aria-label="Список рисков"
        >
          {items.map((r) => {
            const badgeTone = toneByCount(r.count);
            const count = r.count.toLocaleString("ru-RU");
            const titleId = `risk-${r.id}-title`;
            const hintId = r.hint ? `risk-${r.id}-hint` : undefined;

            return (
              <article
                key={r.id}
                role="listitem"
                aria-labelledby={titleId}
                aria-describedby={hintId}
                className="rounded-xl border border-white/10 bg-white/[0.04] p-3 grid gap-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div id={titleId} className="text-sm font-medium break-words">
                    {r.title}
                  </div>
                  <span
                    className={`inline-flex items-center rounded border px-2 py-0.5 text-xs tabular-nums ${badgeTone}`}
                    title="Количество элементов в рисковой группе"
                  >
                    {count}
                  </span>
                </div>

                {r.hint && (
                  <div id={hintId} className={"text-xs " + T.mut}>
                    {r.hint}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={r.href}
                    className={T.btn + " text-xs"}
                    aria-label={`Открыть список: ${r.title}`}
                    prefetch={false}
                  >
                    Открыть
                  </Link>

                  {r.cta &&
                    (("href" in r.cta && r.cta.href) ? (
                      <Link
                        href={r.cta.href}
                        className={T.btn + " text-xs"}
                        prefetch={false}
                      >
                        {r.cta.label}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={("onClick" in r.cta && r.cta.onClick) ? r.cta.onClick : undefined}
                        className={T.btn + " text-xs"}
                      >
                        {r.cta.label}
                      </button>
                    ))}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}