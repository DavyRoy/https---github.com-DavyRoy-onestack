"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import ChannelCard from "../../components/ChannelCard";
import { useChannelsStore } from "@/app/demo/(shared)/integrations/hooks/useIntegrationsStore";

export default function ChannelDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { ready, channels } = useChannelsStore();
  const ch = channels.find((c) => c.id === id);

  if (!ready) {
    return (
      <div className="rounded-2xl border border-white/15 bg-white/[0.04] p-4 text-white/70">
        Загрузка…
      </div>
    );
  }

  if (!ch) {
    return (
      <div
        className="
          w-full max-w-full min-w-0
          supports-[overflow:clip]:overflow-x-clip overflow-x-hidden
          rounded-2xl border border-white/15 bg-white/[0.04] p-4
        "
      >
        <div className="mb-2 text-white/70">Канал не найден: {id}</div>
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
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 min-w-0">
        <div className="min-w-0">
          <div className="text-sm text-white/60">
            <Link href="/demo/admin/integrations/channels" className="hover:underline">
              ← Каналы
            </Link>
          </div>
          <h1 className="text-xl md:text-2xl font-semibold mt-1">
            Канал: <span className="truncate inline-block align-bottom max-w-full">{ch.name}</span>
          </h1>
          <p className="text-sm text-white/60 mt-1">
            {ch.provider} • {ch.type.toUpperCase()}
          </p>
        </div>
      </header>

      {/* Карточка канала (уже адаптивная внутри) */}
      <div className="min-w-0">
        <ChannelCard id={id} />
      </div>
    </div>
  );
}