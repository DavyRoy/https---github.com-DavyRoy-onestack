"use client";

import Link from "next/link";
import { memo, useMemo, useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { AlertTriangle, Flame } from "lucide-react";
import { T } from "@/app/demo/manager/_parts/tokens";
import type { Deal, DealStage } from "../data/mockDeals";

type Stage = { id: DealStage; title: string };

function fmt(n: number) {
  return n.toLocaleString("ru-RU");
}

const stageTone = (id: DealStage) => {
  switch (id) {
    case "new":
      return "ring-sky-400/25 bg-sky-400/10";
    case "in_progress":
      return "ring-amber-400/25 bg-amber-400/10";
    case "proposal":
      return "ring-violet-400/25 bg-violet-400/10";
    case "won":
      return "ring-emerald-400/25 bg-emerald-400/10";
    case "lost":
      return "ring-rose-400/25 bg-rose-400/10";
    default:
      return "ring-white/15 bg-white/8";
  }
};

export default memo(function DealsKanban({
  data,
  stages,
  onMove,
}: {
  data: Deal[];
  stages: Stage[];
  onMove?: (id: string, to: DealStage) => void; // демо
}) {
  // DnD state
  const [dragId, setDragId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Группировка и суммы — мемоизируем
  const byStage = useMemo(() => {
    const map = Object.fromEntries(stages.map((s) => [s.id, [] as Deal[]])) as Record<
      DealStage,
      Deal[]
    >;
    for (const d of data) {
      (map[d.stage] ||= []).push(d);
    }
    return map;
  }, [data, stages]);

  const sums = useMemo(() => {
    const res = {} as Record<DealStage, number>;
    for (const s of stages) {
      res[s.id] = (byStage[s.id] || []).reduce((n, d) => n + (d.amount || 0), 0);
    }
    return res;
  }, [byStage, stages]);

  // Поддержка dragover для тача (mobile): предотвращаем отмену drop
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const prevent = (e: Event) => e.preventDefault();
    el.addEventListener("dragover", prevent);
    return () => el.removeEventListener("dragover", prevent);
  }, []);

  return (
    <div
      ref={scrollRef}
      className="
        grid gap-3 md:grid-cols-5
        md:overflow-visible
        overflow-x-auto pb-1
        snap-x snap-mandatory
        [-webkit-overflow-scrolling:touch]
      "
      // на мобилке — горизонтальная прокрутка колонок; на десктопе — обычная сетка
      aria-label="Канбан по сделкам"
    >
      {stages.map((s) => {
        const rows = byStage[s.id] || [];
        return (
          <section
            key={s.id}
            className={[
              T.card,
              "grid gap-2 min-w-[268px] snap-start", // ширина колонки на мобилке
            ].join(" ")}
            aria-label={`Колонка «${s.title}»`}
            // DnD drop target
            onDragOver={(e) => {
              e.preventDefault();
              (e.currentTarget as HTMLElement).dataset.drop = "1";
            }}
            onDragLeave={(e) => {
              delete (e.currentTarget as HTMLElement).dataset.drop;
            }}
            onDrop={(e) => {
              e.preventDefault();
              delete (e.currentTarget as HTMLElement).dataset.drop;
              const id = e.dataTransfer.getData("text/plain");
              if (id && s.id) {
                onMove?.(id, s.id);
                toast.success(`Сделка перенесена в «${s.title}» (демо)`);
              }
            }}
            data-drop="0"
            // визуальный отклик при наведении карточки для дропа
            style={{
              outline:
                (typeof window !== "undefined" &&
                  (document?.activeElement as HTMLElement)?.dataset?.dragging === "1" &&
                  (document?.querySelector(`[data-drop="1"]`) ? "2px dashed rgba(255,255,255,0.2)" : "none")) || "none",
              outlineOffset: 0,
            }}
          >
            {/* Шапка колонки — липкая внутри секции */}
            <div className="sticky top-0 z-10 -m-3 -mb-1 rounded-t-2xl p-3 backdrop-blur supports-[backdrop-filter]:bg-white/[0.03]">
              <div className="flex items-baseline justify-between">
                <div className="text-sm font-semibold">{s.title}</div>
                <div className={"text-xs " + T.dim}>
                  {rows.length} • <span className="tabular-nums">{fmt(sums[s.id] || 0)}</span> ₽
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              {rows.map((d) => (
                <DealCard
                  key={d.id}
                  d={d}
                  stages={stages}
                  current={s}
                  onMove={onMove}
                  setDragId={setDragId}
                />
              ))}
            </div>

            {rows.length === 0 && (
              <div
                className={
                  "rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs " + T.dim
                }
              >
                <AlertTriangle width={12} height={12} className="mr-1 inline" />
                Нет сделок в этом этапе
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
});

/* ---------- Карточка сделки с DnD и клавиатурным переносом ---------- */

function DealCard({
  d,
  stages,
  current,
  onMove,
  setDragId,
}: {
  d: Deal;
  stages: Stage[];
  current: Stage;
  onMove?: (id: string, to: DealStage) => void;
  setDragId: (id: string | null) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <article
      ref={cardRef}
      className="
        group rounded-xl border border-white/10 bg-white/[0.05] p-3
        transition will-change-transform hover:-translate-y-0.5 hover:bg-white/[0.08]
        focus-within:ring-2 focus-within:ring-white/30
      "
      aria-labelledby={`deal-${d.id}-title`}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", d.id);
        setDragId(d.id);
        (e.currentTarget as HTMLElement).dataset.dragging = "1";
        // немного прозрачности в полёте
        e.dataTransfer.effectAllowed = "move";
      }}
      onDragEnd={(e) => {
        setDragId(null);
        delete (e.currentTarget as HTMLElement).dataset.dragging;
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <Link
          id={`deal-${d.id}-title`}
          href={`/demo/manager/crm/deals/${d.id}`}
          className="truncate font-medium underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded"
        >
          {d.title}
        </Link>

        {d.hot && (
          <span
            className={[
              "inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px]",
              "ring-1 ring-inset text-orange-100 bg-orange-400/15 ring-orange-400/30",
            ].join(" ")}
            title="Приоритетная сделка"
          >
            <Flame width={12} height={12} aria-hidden className="text-orange-300" />
            hot
          </span>
        )}
      </div>

      <div className={"mt-0.5 text-xs " + T.dim}>{d.client}</div>

      <div className="mt-1 flex items-center justify-between text-sm">
        <div className="tabular-nums">{fmt(d.amount)} ₽</div>
        <div className="text-xs opacity-80">до {d.due}</div>
      </div>

      {/* Быстрый перенос: кнопки на все остальные стадии */}
      <div className="mt-2 flex flex-wrap gap-1">
        {stages
          .filter((x) => x.id !== current.id)
          .map((x) => (
            <button
              key={x.id}
              className={[
                "rounded-lg px-2 py-1 text-xs",
                "border ring-1 ring-inset",
                "hover:opacity-90 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
                "border-white/10",
                stageTone(x.id),
              ].join(" ")}
              onClick={() => {
                onMove?.(d.id, x.id);
                toast.success(`Сделка перенесена в «${x.title}» (демо)`);
              }}
              aria-label={`Перенести «${d.title}» в «${x.title}»`}
              type="button"
            >
              → {x.title}
            </button>
          ))}
      </div>

      {/* Клавиатура: Alt+←/→ для переноса между соседними колонками */}
      <kbd className={"mt-2 block text-[10px] " + T.dim}>
        Alt + ←/→ — перенести между соседними этапами
      </kbd>

      <KeyMoveHandler d={d} stages={stages} current={current} onMove={onMove} />
    </article>
  );
}

/* Обработчик клавиш на карточке */
function KeyMoveHandler({
  d,
  stages,
  current,
  onMove,
}: {
  d: Deal;
  stages: Stage[];
  current: Stage;
  onMove?: (id: string, to: DealStage) => void;
}) {
  const idx = stages.findIndex((s) => s.id === current.id);
  const prev = stages[idx - 1]?.id;
  const next = stages[idx + 1]?.id;

  return (
    <div
      tabIndex={0}
      className="sr-only"
      onKeyDown={(e) => {
        if (e.altKey && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
          e.preventDefault();
          const target = e.key === "ArrowLeft" ? prev : next;
          if (target) {
            onMove?.(d.id, target);
            toast.success(
              `Сделка «${d.title}» перенесена ${
                e.key === "ArrowLeft" ? "влево" : "вправо"
              } (демо)`
            );
          }
        }
      }}
      aria-hidden
    />
  );
}