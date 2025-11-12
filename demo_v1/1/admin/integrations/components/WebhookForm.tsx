"use client";

import ProviderBadge from "./ProviderBadge";
import { useWebhooksStore } from "@/app/demo/(shared)/integrations/hooks/useIntegrationsStore";
import Link from "next/link";
import React from "react";

export default function WebhookForm({ id }: { id: string }) {
  const { webhooks, update } = useWebhooksStore();
  const wh = webhooks.find((w) => w.id === id);

  if (!wh) {
    return (
      <div className="rounded-2xl border border-white/15 bg-white/[0.04] p-4 text-white/70">
        Вебхук не найден.
      </div>
    );
  }

  const onNameBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const v = e.target.value.trim();
    if (v && v !== wh.name) update(id, { name: v });
  };

  const onStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value as typeof wh.status;
    if (v !== wh.status) update(id, { status: v });
  };

  return (
    <div
      className="
        grid gap-4 w-full max-w-full min-w-0
        supports-[overflow:clip]:overflow-x-clip overflow-x-hidden
      "
    >
      {/* Карточка заголовка */}
      <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 min-w-0">
          <div className="min-w-0">
            <div className="text-lg font-semibold truncate">{wh.name}</div>
            <div className="text-white/60 text-sm mt-0.5 break-words">
              {wh.url}
            </div>
          </div>
          <div className="shrink-0">
            <ProviderBadge status={wh.status} />
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {/* События */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div className="text-xs text-white/60 mb-1">События</div>
            <div className="flex flex-wrap gap-1">
              {wh.events.map((e) => (
                <span
                  key={e}
                  className="px-2 py-0.5 text-[11px] rounded bg-white/10 whitespace-nowrap"
                  title={e}
                >
                  {e}
                </span>
              ))}
            </div>
          </div>

          {/* Подпись/секрет */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div className="text-xs text-white/60 mb-1">Подпись</div>
            <div className="text-sm">
              Verify:{" "}
              {wh.verify === "signature" ? "HMAC-SHA256 (signature)" : "none"}
            </div>
            <div className="text-xs text-white/60 mt-1">
              Secret: <code className="select-all">{wh.secret}</code>
            </div>
          </div>
        </div>

        {/* Быстрые действия */}
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => alert("Отправлен тестовый запрос (демо)")}
            className="rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/[0.08]"
          >
            Тестовая доставка
          </button>
          <Link
            href={`/demo/admin/integrations/webhooks?webhookId=${encodeURIComponent(
              wh.id
            )}`}
            className="rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/[0.08]"
          >
            История доставок
          </Link>
        </div>
      </section>

      {/* Быстрое редактирование */}
      <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
          <div className="font-medium">Быстрое редактирование (демо)</div>
          <div className="text-xs text-white/50">
            Изменения применяются при вводе/выборе
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <input
            className="
              w-full rounded-lg bg-white/10 border border-white/15
              px-3 py-2 text-sm outline-none
              focus:ring-2 focus:ring-white/20
            "
            defaultValue={wh.name}
            onBlur={onNameBlur}
            placeholder="Название вебхука"
          />

          <select
            className="
              w-full rounded-lg bg-white/10 border border-white/15
              px-3 py-2 text-sm outline-none
              focus:ring-2 focus:ring-white/20
            "
            defaultValue={wh.status}
            onChange={onStatusChange}
            aria-label="Статус вебхука"
          >
            <option value="ok">OK</option>
            <option value="degraded">Degraded</option>
            <option value="down">Down</option>
            <option value="paused">Paused</option>
          </select>
        </div>
      </section>
    </div>
  );
}