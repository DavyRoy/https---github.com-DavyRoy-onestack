"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import ChannelCard from "../../components/ChannelCard";
import { useChannelsStore } from "@/app/demo/(shared)/integrations/hooks/useIntegrationsStore";

export default function ChannelDetailPage() {
  const params = useParams<{ id: string }>();
  const channelId = params?.id ?? "";
  const { ready, channels } = useChannelsStore();

  // Показываем простой стейт загрузки, пока стор инициализируется
  if (!ready) {
    return (
      <div
        className="rounded-2xl border border-white/15 bg-white/[0.04] p-4 text-white/70"
        aria-busy="true"
      >
        Загрузка…
      </div>
    );
  }

  // Мемоизируем поиск, чтобы не пересчитывать на каждый ререндер
  const ch = React.useMemo(
    () => channels.find((c) => c.id === channelId),
    [channels, channelId]
  );

  if (!ch) {
    return (
      <div
        className="
          w-full max-w-full min-w-0
          supports-[overflow:clip]:overflow-x-clip overflow-x-hidden
          rounded-2xl border border-white/15 bg-white/[0.04] p-4
        "
        role="status"
        aria-live="polite"
      >
        <div className="mb-2 text-white/70">
          Канал не найден{channelId ? `: ${channelId}` : "."}
        </div>
        <Link href="/demo/admin/integrations/channels" className="underline">
          ← Назад к списку каналов
        </Link>
      </div>
    );
  }

  return (
    <div
      className="
        grid gap-4 w-full max-w-full min-w-0
        supports-[overflow:clip]:overflow-x-clip overflow-x-hidden
      "
    >
      {/* Хедер */}
      <header
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 min-w-0"
        aria-labelledby="channel-title"
      >
        <div className="min-w-0">
          <div className="text-sm text-white/60">
            <Link href="/demo/admin/integrations/channels" className="hover:underline">
              ← Каналы
            </Link>
          </div>
          <h1 id="channel-title" className="text-xl md:text-2xl font-semibold mt-1">
            Канал:{" "}
            <span className="truncate inline-block align-bottom max-w-full">
              {ch.name}
            </span>
          </h1>
          <p className="text-sm text-white/60 mt-1">
            {ch.provider} • {ch.type.toUpperCase()}
          </p>
        </div>
      </header>

      {/* Карточка канала (адаптивна внутри) */}
      <div className="min-w-0">
        <ChannelCard id={channelId} />
      </div>
    </div>
  );
}