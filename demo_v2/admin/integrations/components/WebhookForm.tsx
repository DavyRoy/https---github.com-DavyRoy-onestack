"use client";

import ProviderBadge from "./ProviderBadge";
import { useWebhooksStore } from "@/app/demo/(shared)/integrations/hooks/useIntegrationsStore";
import Link from "next/link";
import React from "react";

export default function WebhookForm({ id }: { id: string }) {
  const { webhooks, update } = useWebhooksStore();
  const wh = webhooks.find((w) => w.id === id);

  // ---- Not found ----
  if (!wh) {
    return (
      <div className="rounded-2xl border border-white/15 bg-white/[0.04] p-4 text-white/70">
        Вебхук не найден.
      </div>
    );
  }

  // ---- Local state (sync with store) ----
  const [name, setName] = React.useState(wh.name);
  const [status, setStatus] = React.useState<typeof wh.status>(wh.status);
  const [url, setUrl] = React.useState(wh.url);
  const [showSecret, setShowSecret] = React.useState(false);

  React.useEffect(() => {
    setName(wh.name);
    setStatus(wh.status);
    setUrl(wh.url);
  }, [wh.id, wh.name, wh.status, wh.url]);

  // ---- Handlers ----
  const commitName = () => {
    const v = name.trim();
    if (v && v !== wh.name) update(id, { name: v });
  };

  const commitUrl = () => {
    const v = url.trim();
    if (!v || v === wh.url) return;
    try {
      // Базовая валидация URL
      const u = new URL(v);
      if (!/^https?:$/.test(u.protocol)) throw new Error("Only http/https");
      update(id, { url: v });
    } catch {
      alert("Неверный URL. Укажите корректный http(s) адрес.");
      setUrl(wh.url);
    }
  };

  const changeStatus = (next: typeof wh.status) => {
    if (next !== wh.status) {
      setStatus(next);
      update(id, { status: next });
    }
  };

  const copySecret = async () => {
    try {
      await navigator.clipboard.writeText(wh.secret ?? "");
      alert("Секрет скопирован в буфер (демо)");
    } catch {
      // Фолбэк
      const ta = document.createElement("textarea");
      ta.value = wh.secret ?? "";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      alert("Секрет скопирован (демо)");
    }
  };

  const sendTest = () => {
    alert(`Отправлен тестовый запрос (демо)\n\nWebhook: ${wh.name}\nURL: ${url}`);
  };

  // ---- UI ----
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
            <div className="text-lg font-semibold truncate" title={wh.name}>
              {wh.name}
            </div>
            <div className="text-white/60 text-sm mt-0.5 break-all font-mono">
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
              Verify: {wh.verify === "signature" ? "HMAC-SHA256 (signature)" : "none"}
            </div>

            <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_auto_auto] items-center">
              <div className="text-xs text-white/60">
                Secret:{" "}
                <code className="select-all">
                  {showSecret ? wh.secret : "••••••••••••••••••••••••"}
                </code>
              </div>

              <button
                type="button"
                onClick={() => setShowSecret((v) => !v)}
                className="rounded-lg border border-white/20 px-2 py-1 text-xs hover:bg-white/[0.08]"
              >
                {showSecret ? "Скрыть" : "Показать"}
              </button>

              <button
                type="button"
                onClick={copySecret}
                className="rounded-lg border border-white/20 px-2 py-1 text-xs hover:bg-white/[0.08]"
              >
                Копировать
              </button>
            </div>
          </div>
        </div>

        {/* Быстрые действия */}
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={sendTest}
            className="rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/[0.08]"
          >
            Тестовая доставка
          </button>
          <Link
            href={`/demo/admin/integrations/webhooks?webhookId=${encodeURIComponent(wh.id)}`}
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
          <div className="text-xs text-white/50">Изменения применяются при вводе/выборе</div>
        </div>

        <div className="grid gap-2 sm:grid-cols-3">
          {/* Название */}
          <label className="flex flex-col gap-1 text-xs text-white/60">
            Название
            <input
              className="
                w-full rounded-lg bg-white/10 border border-white/15
                px-3 py-2 text-sm outline-none
                focus:ring-2 focus:ring-white/20
              "
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={commitName}
              placeholder="Название вебхука"
              aria-label="Название вебхука"
            />
          </label>

          {/* URL */}
          <label className="flex flex-col gap-1 text-xs text-white/60 sm:col-span-2">
            URL
            <input
              className="
                w-full rounded-lg bg-white/10 border border-white/15
                px-3 py-2 text-sm outline-none font-mono
                focus:ring-2 focus:ring-white/20
              "
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onBlur={commitUrl}
              placeholder="https://example.com/webhooks/orders"
              aria-label="URL вебхука"
            />
          </label>
        </div>

        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {/* Статус */}
          <label className="flex flex-col gap-1 text-xs text-white/60">
            Статус
            <select
              className="
                w-full rounded-lg bg-white/10 border border-white/15
                px-3 py-2 text-sm outline-none
                focus:ring-2 focus:ring-white/20
              "
              value={status}
              onChange={(e) => changeStatus(e.target.value as typeof wh.status)}
              aria-label="Статус вебхука"
            >
              <option value="ok">OK</option>
              <option value="degraded">Degraded</option>
              <option value="down">Down</option>
              <option value="paused">Paused</option>
            </select>
          </label>
        </div>
      </section>
    </div>
  );
}