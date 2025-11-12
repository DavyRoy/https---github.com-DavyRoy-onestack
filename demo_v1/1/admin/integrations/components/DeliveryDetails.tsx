"use client";
import Link from "next/link";
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

export default function DeliveryDetails({ deliveryId }: { deliveryId: string }) {
  const d = DELIVERIES.find((x) => x.id === deliveryId);
  if (!d) {
    return (
      <div className="rounded-2xl border border-white/15 bg-white/[0.05] p-6 text-white/70">
        Доставка не найдена.
      </div>
    );
  }

  return (
    <section className="grid gap-4 w-full max-w-full overflow-x-hidden">
      {/* Заголовок */}
      <header className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <div className="min-w-0">
            <div className="text-sm text-white/60">
              <Link
                href={`/demo/admin/integrations/webhooks?webhookId=${encodeURIComponent(d.webhookId)}`}
                className="hover:underline"
              >
                ← К вебхуку {d.webhookId}
              </Link>
            </div>
            <h1 className="text-xl font-semibold mt-1">
              Доставка&nbsp;#{d.id}
            </h1>
            <div className="text-white/70 text-sm mt-1 break-words">
              {fmtIsoCompact(d.createdAt)} • {d.event} • попытка {d.attempt}
            </div>
          </div>
          <span
            className={`self-start px-2 py-0.5 rounded-md text-[11px] uppercase ${statusBadge(
              d.status as Status
            )}`}
          >
            {d.status}
          </span>
        </div>
      </header>

      {/* Основные метрики */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/15 bg-white/[0.05] p-4">
          <div className="text-sm text-white/70 mb-2">Payload (preview)</div>
          <pre className="text-xs font-mono leading-relaxed whitespace-pre-wrap break-words overflow-auto max-h-72">
            {d.payloadPreview}
          </pre>
        </div>

        <div className="rounded-2xl border border-white/15 bg-white/[0.05] p-4">
          <div className="text-sm text-white/70 mb-2">Response</div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-lg bg-white/[0.04] p-2">
              <div className="text-white/60 text-xs">Код</div>
              <div className="mt-0.5 font-medium">{d.responseCode}</div>
            </div>
            <div className="rounded-lg bg-white/[0.04] p-2 text-right">
              <div className="text-white/60 text-xs">Latency</div>
              <div className="mt-0.5 font-medium">{d.latencyMs} ms</div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() => alert("Повтор отправлен (демо)")}
              className="rounded-lg bg-white/10 hover:bg-white/20 px-4 py-2 text-sm"
            >
              Повторить
            </button>
            <Link
              href={`/demo/admin/integrations/webhooks/deliveries/${d.id}`}
              className="rounded-lg border border-white/15 px-4 py-2 text-sm hover:bg-white/[0.08]"
            >
              Обновить
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}