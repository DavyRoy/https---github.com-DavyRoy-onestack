"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import WebhookForm from "../../components/WebhookForm";
import DeliveriesOverview from "../../components/DeliveriesOverview";
import { useWebhooksStore } from "@/app/demo/(shared)/integrations/hooks/useIntegrationsStore";

export default function WebhookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const sp = useSearchParams();
  const { ready, webhooks } = useWebhooksStore();
  const wh = webhooks.find((w) => w.id === id);

  if (!ready) {
    return (
      <div className="rounded-2xl border border-white/15 bg-white/[0.04] p-4 text-white/70">
        Загрузка…
      </div>
    );
  }

  const onlyThisActive = sp.get("webhookId") === id;

  return (
    <div
      className="
        grid gap-6 w-full max-w-full min-w-0
        supports-[overflow:clip]:overflow-x-clip overflow-x-hidden
      "
    >
      {/* Хедер */}
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 min-w-0">
        <div className="min-w-0">
          <div className="text-sm text-white/60">
            <Link href="/demo/admin/integrations/webhooks" className="hover:underline">
              ← Вебхуки
            </Link>
          </div>
          <h1 className="text-xl md:text-2xl font-semibold mt-1">
            Вебхук: {wh?.name ?? id}
          </h1>
          <p className="text-white/70 text-sm mt-1 break-words">
            {wh?.url ?? "—"}
          </p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <Link
            href={`/demo/admin/integrations/webhooks/${id}?webhookId=${id}`}
            className="w-full sm:w-auto rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/[0.08]"
          >
            Показать только этот
          </Link>
          {onlyThisActive && (
            <Link
              href={`/demo/admin/integrations/webhooks/${id}`}
              className="w-full sm:w-auto rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/[0.08]"
            >
              Сбросить фильтр
            </Link>
          )}
        </div>
      </header>

      {/* Карточка и быстрые настройки вебхука */}
      <div className="min-w-0">
        <WebhookForm id={id} />
      </div>

      {/* Доставки этого вебхука */}
      <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="font-medium">Доставки этого вебхука</div>
          <div className="text-xs text-white/50">
            Фильтр применяется через URL-параметр <code>webhookId</code>.
          </div>
        </div>
        {/* Скролл таблицы — только внутри блока */}
        <div className="-mx-3 md:mx-0">
          <div className="px-3 md:px-0">
            <DeliveriesOverview />
          </div>
        </div>
      </section>
    </div>
  );
}