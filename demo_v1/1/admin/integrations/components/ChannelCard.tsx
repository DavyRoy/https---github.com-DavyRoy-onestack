"use client";

import React from "react";
import ProviderBadge from "./ProviderBadge";
import { useChannelsStore } from "@/app/demo/(shared)/integrations/hooks/useIntegrationsStore";

type Props = { id: string };

export default function ChannelCard({ id }: Props) {
  const { channels } = useChannelsStore();
  const ch = channels.find((x) => x.id === id);

  if (!ch) {
    return (
      <div className="rounded-2xl border border-white/15 bg-white/[0.04] p-4 text-white/70">
        Канал не найден.
      </div>
    );
  }

  // локальные поля формы «тестовое сообщение»
  const [to, setTo] = React.useState("");
  const [msg, setMsg] = React.useState("");

  const sendTest = () => {
    if (!to || !msg) {
      alert("Укажите получателя и текст сообщения.");
      return;
    }
    alert(`Тест отправлен (демо)\n\nКанал: ${ch.name}\nКому: ${to}\nСообщение: ${msg}`);
    setMsg("");
  };

  return (
    <div
      className="
        grid gap-4 w-full max-w-full min-w-0
        supports-[overflow:clip]:overflow-x-clip overflow-x-hidden
      "
    >
      {/* Карточка канала */}
      <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 min-w-0">
          <div className="min-w-0">
            <h2 className="text-lg md:text-xl font-semibold truncate">{ch.name}</h2>
            <div className="text-white/60 text-sm mt-0.5">
              {ch.provider} • {ch.type.toUpperCase()}
            </div>
          </div>
          <div className="shrink-0">
            <ProviderBadge status={ch.status} />
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 min-w-0">
          {/* Настройки */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 min-w-0">
            <div className="text-white/60 text-xs mb-2">Режим / Настройки</div>
            <div
              className="
                rounded-lg bg-black/20 p-2 text-xs text-white/80
                max-h-60 overflow-auto
              "
              role="region"
              aria-label="Настройки канала"
            >
              <pre className="whitespace-pre-wrap break-words">
                {JSON.stringify(ch.settings ?? {}, null, 2)}
              </pre>
            </div>
          </div>

          {/* Фичи */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 min-w-0">
            <div className="text-white/60 text-xs mb-2">Фичи</div>
            {ch.features?.length ? (
              <div className="flex flex-wrap gap-1">
                {ch.features.map((f) => (
                  <span
                    key={f}
                    className="px-2 py-0.5 text-[11px] rounded bg-white/10 text-white/85"
                  >
                    {f}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-xs text-white/50">—</div>
            )}
          </div>
        </div>

        {/* Тех.инфо */}
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-white/60">
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-2">
            Тип: <span className="text-white/85">{ch.type}</span>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-2">
            Провайдер: <span className="text-white/85">{ch.provider}</span>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-2">
            Отправлено 24ч: <span className="text-white/85">{ch.sent24h}</span>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-2">
            Ошибки 24ч: <span className="text-white/85">{ch.errors24h}</span>
          </div>
        </div>
      </section>

      {/* Тестовая отправка */}
      <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5">
        <div className="font-medium mb-2">Отправить тестовое сообщение (демо)</div>
        <div className="grid gap-2 sm:grid-cols-3">
          <label className="sm:col-span-1 flex flex-col gap-1 text-xs text-white/60">
            Получатель
            <input
              className="rounded-lg bg-white/10 border border-white/15 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-white/20"
              placeholder="email / телефон"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              aria-label="Получатель тестового сообщения"
            />
          </label>
          <label className="sm:col-span-2 flex flex-col gap-1 text-xs text-white/60 min-w-0">
            Сообщение
            <input
              className="rounded-lg bg-white/10 border border-white/15 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-white/20 min-w-0"
              placeholder="Текст сообщения"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              aria-label="Текст тестового сообщения"
            />
          </label>
        </div>
        <div className="mt-3">
          <button
            onClick={sendTest}
            className="
              rounded-lg bg-white/90 text-black px-4 py-2 text-sm hover:bg-white
              disabled:opacity-60 disabled:cursor-not-allowed
            "
            disabled={!to || !msg}
          >
            Отправить
          </button>
        </div>
      </section>
    </div>
  );
}