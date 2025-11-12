"use client";

import { useEffect, useMemo, useState } from "react";
import ReportsHeader from "../components/ReportsHeader";
import FiltersInline from "../components/FiltersInline";
import ExportMenu from "../components/ExportMenu";
import TrendLine from "../components/TrendLine";
import BarStack from "../components/BarStack";
import TableBasic from "../components/TableBasic";
import Skeletons from "../components/Skeletons";
import EmptyState from "../components/EmptyState";
import { FUNNEL_STAGES, LEADS_BY_SOURCE, FUNNEL_TREND, OWNERS_TABLE } from "../data/mockReportsCrm";

const T = {
  page: "grid gap-6",
  hero:
    "relative overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-b from-white/10 via-white/5 to-white/10 p-4 md:p-6 backdrop-blur-sm",
  card:
    "rounded-2xl border border-white/15 bg-white/[0.05] p-3 md:p-4 backdrop-blur-sm",
  h: "text-base font-semibold",
  dim: "text-white/70",
};

type Period = "today" | "7d" | "30d" | "quarter" | "year" | "custom";

export default function CrmReportPage() {
  const [mounted, setMounted] = useState(false);
  const [period, setPeriod] = useState<Period>("7d");
  const [compare, setCompare] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const p = localStorage.getItem("mgr_reports_crm_period") as Period | null;
      const c = localStorage.getItem("mgr_reports_crm_compare");
      if (p) setPeriod(p);
      if (c) setCompare(c === "1");
    } catch {}
  }, []);
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem("mgr_reports_crm_period", period);
      localStorage.setItem("mgr_reports_crm_compare", compare ? "1" : "0");
    } catch {}
  }, [mounted, period, compare]);

  const totalLeads = useMemo(
    () => FUNNEL_STAGES.reduce((s, x) => s + x.count, 0),
    []
  );

  const convOverall = useMemo(() => {
    const from = FUNNEL_STAGES.find((s) => s.id === "new")!.count;
    const to = FUNNEL_STAGES.find((s) => s.id === "order")!.count;
    return from ? Math.round((to / from) * 100) : 0;
  }, []);

  return (
    <div className={T.page}>
      <header className={T.hero}>
        <ReportsHeader
          title="Отчёты • CRM и конверсия"
          subtitle="Источники, воронка, скорость обработки"
          period={period}
          onPeriodChange={setPeriod}
          compare={compare}
          onCompareChange={setCompare}
          right={<ExportMenu />}
        />
      </header>

      <section className={T.card}>
        <div className="grid gap-3 md:grid-cols-4">
          <KPI title="Лидов" value={totalLeads} />
          <KPI title="Сделок" value={FUNNEL_STAGES.find((s) => s.id === "proposal")!.count} />
          <KPI title="Заказов" value={FUNNEL_STAGES.find((s) => s.id === "order")!.count} />
          <KPI title="Конверсия лид→заказ" value={convOverall} unit="%" />
        </div>
      </section>

      <section className={T.card}>
        {!mounted ? (
          <Skeletons kind="charts" />
        ) : (
          <div className="grid gap-4 md:grid-cols-[1fr_360px]">
            <BarStack
              title="Лиды по источникам"
              categories={LEADS_BY_SOURCE.labels}
              series={LEADS_BY_SOURCE.values}
              onBarClick={(src) =>
                window.location.assign(`/demo/manager/crm/leads?source=${encodeURIComponent(src)}`)
              }
            />
            {/* мини-«воронка»: просто столбики со спадом */}
            <div className="rounded-xl border border-white/15 bg-white/[0.05] p-3">
              <div className="text-sm font-medium">Мини-воронка</div>
              <div className="mt-3 grid gap-2">
                {FUNNEL_STAGES.map((s) => {
                  const max = FUNNEL_STAGES[0].count || 1;
                  return (
                    <button
                      key={s.id}
                      className="group text-left"
                      onClick={() =>
                        window.location.assign(`/demo/manager/crm/deals?stage=${encodeURIComponent(s.id)}`)
                      }
                    >
                      <div className="flex items-center justify-between text-xs text-white/70">
                        <div>{s.title}</div>
                        <div className="tabular-nums">{s.count}</div>
                      </div>
                      <div className="mt-1 h-2 rounded bg-white/10">
                        <div
                          className="h-full rounded bg-white/80 group-hover:bg-white"
                          style={{ width: `${Math.round((s.count / max) * 100)}%` }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </section>

      <section className={T.card}>
        <div className={T.h}>Скорость реакции (демо)</div>
        {!mounted ? (
          <Skeletons kind="charts" />
        ) : (
          <TrendLine
            data={FUNNEL_TREND}
            xKey="date"
            y1Key="medianMinutes"
            y2Key="avgMinutes"
            label1="Медиана до 1-го ответа (мин)"
            label2="Среднее (мин)"
            onPointClick={(d) =>
              window.location.assign(`/demo/manager/crm/leads?date=${encodeURIComponent(String((d as any).date))}`)
            }
          />
        )}
      </section>

      <section className={T.card}>
        <TableBasic
          title="Ответственные — эффективность"
          columns={["Сотрудник", "Лидов", "Сделок", "Заказов", "Конверсия", "Время отклика (медиана)"]}
          rows={OWNERS_TABLE.map((r) => [
            { content: r.name },
            { content: String(r.leads), align: "right" as const },
            { content: String(r.deals), align: "right" as const },
            { content: String(r.orders), align: "right" as const },
            { content: r.conv + " %", align: "right" as const },
            { content: r.medianRespMin + " мин", align: "right" as const },
          ])}
        />
      </section>
    </div>
  );
}

function KPI({ title, value, unit }: { title: string; value: number; unit?: string }) {
  return (
    <div className="rounded-xl border border-white/15 bg-white/[0.05] p-3">
      <div className="text-xs text-white/70">{title}</div>
      <div className="mt-1 text-xl font-semibold tabular-nums">
        {value.toLocaleString("ru-RU")} {unit}
      </div>
    </div>
  );
}