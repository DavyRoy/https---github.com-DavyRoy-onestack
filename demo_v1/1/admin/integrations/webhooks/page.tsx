"use client";

import { useState } from "react";
import WebhooksTable from "../components/WebhooksTable";
import DeliveriesOverview from "../components/DeliveriesOverview";
import WebhookModal from "../components/WebhookModal";
import { useWebhooksStore } from "@/app/demo/(shared)/integrations/hooks/useIntegrationsStore";
import { Webhook } from "@/app/demo/(shared)/integrations/data/mockAdminIntegrationsWebhooks";

export default function WebhooksPage() {
  const { ready, webhooks, create, update, remove, togglePaused } = useWebhooksStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editRow, setEditRow] = useState<Webhook | null>(null);

  if (!ready) {
    return (
      <div className="rounded-2xl border border-white/15 bg-white/[0.04] p-4 text-white/70">
        Загрузка…
      </div>
    );
  }

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
          <h1 className="text-xl md:text-2xl font-semibold break-words">
            Вебхуки
          </h1>
          <p className="text-white/70 mt-1 text-sm break-words">
            Эндпоинты и лента доставок за период.
          </p>
        </div>
        <div className="flex w-full sm:w-auto">
          <button
            className="
              w-full sm:w-auto
              rounded-lg bg-white/10 hover:bg-white/20
              px-3 py-2 text-sm
            "
            onClick={() => {
              setEditRow(null);
              setModalOpen(true);
            }}
          >
            Добавить вебхук
          </button>
        </div>
      </header>

      {/* Таблица вебхуков — скролл только внутри */}
      <section className="-mx-3 md:mx-0">
        <div className="px-3 md:px-0 min-w-0">
          <WebhooksTable
            rows={webhooks}
            onEdit={(row) => {
              setEditRow(row);
              setModalOpen(true);
            }}
            onToggle={togglePaused}
            onDelete={remove}
          />
        </div>
      </section>

      {/* Лента доставок */}
      <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-3 md:p-4 min-w-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2 min-w-0">
          <div className="font-medium">Последние доставки</div>
          {/* На мобиле переносим строки и не ломаем ширину экрана */}
          <div className="text-xs text-white/50 whitespace-normal break-words md:whitespace-nowrap">
            Быстрые фильтры в URL-параметрах:&nbsp;
            <code className="break-all">status</code>,{" "}
            <code className="break-all">webhookId</code>
          </div>
        </div>
        {/* Скролл таблицы — только внутри блока, с безопасными отступами */}
        <div className="-mx-3 md:mx-0">
          <div className="px-3 md:px-0 min-w-0">
            <DeliveriesOverview />
          </div>
        </div>
      </section>

      {/* Модалка создания/редактирования */}
      <WebhookModal
        open={modalOpen}
        initial={editRow ?? undefined}
        onClose={() => setModalOpen(false)}
        onSubmit={(data) => {
          if (editRow) {
            update(editRow.id, data as Partial<Webhook>);
          } else {
            create(data);
          }
        }}
      />
    </div>
  );
}