"use client";
import React from "react";
import Link from "next/link";
import { DELIVERIES } from "@/app/demo/(shared)/integrations/data/mockAdminIntegrationsWebhooks";

type Status = "delivered" | "retry" | "failed";

const statusBadge = (s: Status) =>
  s === "delivered"
    ? "bg-emerald-500/20 text-emerald-300"
    : s === "retry"
    ? "bg-amber-500/20 text-amber-300"
    : "bg-rose-500/20 text-rose-300";

// ISO → компактно, без локали (безопасно для SSR)
const fmtIsoCompact = (iso?: string) =>
  iso ? iso.replace("T", " ").replace("Z", "") : "—";

export default function DeliveryDetails({ deliveryId }: { deliveryId: string }) {
  // Надёжный поиск записи без лишних ререндеров
  const d = React.useMemo(
    () => DELIVERIES.find((x) => x.id === deliveryId),
    [deliveryId]
  );

  if (!d) {
    return (
      <div className="rounded-2xl border border-white/15 bg-white/[0.05] p-6 text-white/70">
        Доставка не найдена.
      </div>
    );
  }

  const createdAt = fmtIsoCompact(d.createdAt);
  const status = (d.status || "failed") as Status;

  return (
    <section className="grid gap-4 w-full max-w-full overflow-x-hidden">
      {/* Заголовок */}
      <header
        className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5"
        aria-labelledby="delivery-title"
      >
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
            <h1 id="delivery-title" className="text-xl font-semibold mt-1 break-words">
              Доставка&nbsp;#{d.id}
            </h1>
            <p className="text-white/70 text-sm mt-1 break-words">
              {createdAt} • {d.event} • попытка {d.attempt}
            </p>
          </div>

          <span
            className={`self-start px-2 py-0.5 rounded-md text-[11px] uppercase ${statusBadge(
              status
            )}`}
            aria-label={`Статус доставки: ${status}`}
          >
            {status}
          </span>
        </div>
      </header>

      {/* Основные детали */}
      <div className="grid gap-3 sm:grid-cols-2">
        {/* Payload */}
        <section
          className="rounded-2xl border border-white/15 bg-white/[0.05] p-4"
          aria-labelledby="payload-title"
        >
          <div id="payload-title" className="text-sm text-white/70 mb-2">
            Payload (preview)
          </div>
          <div
            role="region"
            aria-label="Предпросмотр полезной нагрузки"
            className="max-h-72 overflow-auto rounded-lg bg-black/20 p-2"
          >
            <pre className="text-xs font-mono leading-relaxed whitespace-pre-wrap break-words">
              {d.payloadPreview}
            </pre>
          </div>
        </section>

        {/* Response */}
        <section
          className="rounded-2xl border border-white/15 bg-white/[0.05] p-4"
          aria-labelledby="response-title"
        >
          <div id="response-title" className="text-sm text-white/70 mb-2">
            Response
          </div>

          {/* Семантически: ключевые метрики как dl */}
          <dl className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-lg bg-white/[0.04] p-2">
              <dt className="text-white/60 text-xs">Код</dt>
              <dd className="mt-0.5 font-medium" aria-label={`Код ответа ${d.responseCode}`}>
                {d.responseCode}
              </dd>
            </div>
            <div className="rounded-lg bg-white/[0.04] p-2 text-right">
              <dt className="text-white/60 text-xs">Latency</dt>
              <dd className="mt-0.5 font-medium" aria-label={`Задержка ${d.latencyMs} миллисекунд`}>
                {d.latencyMs} ms
              </dd>
            </div>
          </dl>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() => alert("Повтор отправлен (демо)")}
              className="rounded-lg bg-white/10 hover:bg-white/20 px-4 py-2 text-sm"
              aria-label="Повторно отправить доставку (демо)"
            >
              Повторить
            </button>
            <Link
              href={`/demo/admin/integrations/webhooks/deliveries/${d.id}`}
              className="rounded-lg border border-white/15 px-4 py-2 text-sm hover:bg-white/[0.08]"
              aria-label="Обновить страницу доставки"
              title="Обновить"
            >
              Обновить
            </Link>
          </div>
        </section>
      </div>
    </section>
  );
}