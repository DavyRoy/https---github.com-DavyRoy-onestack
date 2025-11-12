"use client";

import Link from "next/link";
import { T } from "@/app/demo/manager/_parts/tokens";
import type { ActivityItem } from "@/app/demo/manager/dashboard/data/mockManagerDashboard";

export default function RecentActivity({ list }: { list: ActivityItem[] }) {
  const hasItems = Array.isArray(list) && list.length > 0;

  return (
    <section className={T.card + " grid gap-3"} aria-labelledby="recent-activity-title">
      <div id="recent-activity-title" className="text-base font-semibold">
        Последняя активность
      </div>

      {!hasItems ? (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 text-center text-sm text-white/70">
          Пока событий нет
        </div>
      ) : (
        <div className="relative pl-4" role="list">
          {/* вертикальная линия таймлайна */}
          <div className="absolute left-1 top-0 bottom-0 w-px bg-white/15" aria-hidden />
          <div className="grid gap-3">
            {list.map((i) => (
              <Link
                key={i.id}
                href={i.href}
                role="listitem"
                className="
                  relative pl-4 rounded-lg
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30
                  hover:bg-white/[0.04] transition
                  -mx-2 px-2 py-1.5
                "
                aria-label={i.text}
              >
                {/* маркер точки */}
                <span
                  className="absolute -left-1 top-2 h-2 w-2 rounded-full bg-white"
                  aria-hidden
                />
                <div className="text-sm leading-snug break-words">
                  {i.text}
                </div>
                <div className={"text-xs " + T.mut + " mt-0.5"}>{i.time}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}