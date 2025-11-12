"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { DELIVERIES } from "@/app/demo/(shared)/integrations/data/mockAdminIntegrationsWebhooks";

type Status = "delivered" | "retry" | "failed";

const statusBadge = (s: Status) =>
  s === "delivered"
    ? "bg-emerald-500/20 text-emerald-300"
    : s === "retry"
    ? "bg-amber-500/20 text-amber-300"
    : "bg-rose-500/20 text-rose-300";

const fmtIsoCompact = (iso?: string) =>
  iso ? iso.replace("T", " ").replace("Z", "") : "—";

export default function DeliveriesOverview() {
  const sp = useSearchParams();
  const status = sp.get("status") as Status | null;
  const webhookId = sp.get("webhookId");

  const rows = DELIVERIES.filter(
    (d) => (status ? d.status === status : true) && (webhookId ? d.webhookId === webhookId : true)
  );

  if (!rows.length) {
    return (
      <div className="rounded-2xl border border-white/15 bg-white/[0.05] p-6 text-white/70">
        Доставки не найдены.
      </div>
    );
  }

  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-3 md:p-4 w-full max-w-full overflow-x-hidden">
      {/* Мобильный вид — карточки */}
      <div className="grid gap-3 md:hidden">
        {rows.map((d) => (
          <div key={d.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-xs text-white/60">Webhook</div>
                <div className="font-medium break-words">{d.webhookId}</div>
              </div>
              <span className={`px-2 py-0.5 rounded-md text-[11px] uppercase ${statusBadge(d.status)}`}>
                {d.status}
              </span>
            </div>

            <div className="mt-2 grid gap-1">
              <div className="text-xs text-white/60">Событие</div>
              <div className="text-sm font-mono break-words">{d.event}</div>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg bg-white/[0.04] p-2">
                <div className="text-white/60">Время</div>
                <div className="text-white/80 mt-0.5">{fmtIsoCompact(d.createdAt)}</div>
              </div>
              <div className="rounded-lg bg-white/[0.04] p-2 text-right">
                <div className="text-white/60">Latency / Код</div>
                <div className="text-white/80 mt-0.5">
                  {d.latencyMs} ms • {d.responseCode}
                </div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href={`/demo/admin/integrations/webhooks/deliveries/${d.id}`}
                className="text-xs rounded bg-white/10 px-3 py-1.5 hover:bg-white/20"
              >
                Детали
              </Link>
              <Link
                href={`/demo/admin/integrations/webhooks?webhookId=${encodeURIComponent(d.webhookId)}`}
                className="text-xs rounded border border-white/15 px-3 py-1.5 hover:bg-white/[0.08]"
              >
                К вебхуку
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Десктопный вид — таблица */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-[880px] w-full text-sm">
          <thead className="text-white/70">
            <tr className="bg-white/[0.04]">
              <th className="text-left p-3">Время</th>
              <th className="text-left p-3">Webhook</th>
              <th className="text-left p-3">Событие</th>
              <th className="text-left p-3">Статус</th>
              <th className="text-right p-3">Latency</th>
              <th className="text-right p-3">Код</th>
              <th className="text-right p-3">Открыть</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((d) => (
              <tr key={d.id} className="border-t border-white/10 hover:bg-white/[0.03]">
                <td className="p-3 text-xs text-white/70 whitespace-nowrap">{fmtIsoCompact(d.createdAt)}</td>
                <td className="p-3 max-w-[260px]">
                  <Link
                    href={`/demo/admin/integrations/webhooks?webhookId=${encodeURIComponent(d.webhookId)}`}
                    className="hover:underline block truncate"
                    title={d.webhookId}
                  >
                    {d.webhookId}
                  </Link>
                </td>
                <td className="p-3 text-xs font-mono max-w-[360px] truncate" title={d.event}>
                  {d.event}
                </td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-md text-[11px] uppercase ${statusBadge(d.status)}`}>
                    {d.status}
                  </span>
                </td>
                <td className="p-3 text-right whitespace-nowrap">{d.latencyMs} ms</td>
                <td className="p-3 text-right">{d.responseCode}</td>
                <td className="p-3 text-right">
                  <Link
                    href={`/demo/admin/integrations/webhooks/deliveries/${d.id}`}
                    className="text-white/80 hover:underline"
                  >
                    Детали
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}