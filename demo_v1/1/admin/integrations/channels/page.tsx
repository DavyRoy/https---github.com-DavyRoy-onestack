"use client";
import { useState } from "react";
import ChannelsTable from "../components/ChannelsTable";
import ChannelModal from "../components/ChannelModal";
import { useChannelsStore } from "@/app/demo/(shared)/integrations/hooks/useIntegrationsStore";
import { Channel } from "../data/mockAdminIntegrationsChannels";

export default function ChannelsPage() {
  const { ready, channels, create, update, remove, toggleStatus } = useChannelsStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editRow, setEditRow] = useState<Channel | null>(null);

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
        grid gap-4 w-full max-w-full min-w-0
        supports-[overflow:clip]:overflow-x-clip overflow-x-hidden
      "
    >
      {/* Хедер */}
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 min-w-0">
        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-semibold">Каналы</h1>
          <p className="text-sm text-white/60 mt-1">
            Email / SMS / мессенджеры. Управление подключениями и статусами.
          </p>
        </div>
        <div className="flex w-full sm:w-auto">
          <button
            className="
              w-full sm:w-auto rounded-lg
              bg-white/90 text-black px-3 py-2 text-sm
              hover:bg-white transition
            "
            onClick={() => {
              setEditRow(null);
              setModalOpen(true);
            }}
          >
            Подключить канал
          </button>
        </div>
      </header>

      {/* Таблица (сама отвечает за горизонтальный скролл) */}
      <div className="min-w-0">
        <ChannelsTable
          rows={channels}
          onEdit={(row) => {
            setEditRow(row);
            setModalOpen(true);
          }}
          onToggle={toggleStatus}
          onDelete={remove}
        />
      </div>

      {/* Модалка создания/редактирования */}
      <ChannelModal
        open={modalOpen}
        initial={editRow ?? undefined}
        onClose={() => setModalOpen(false)}
        onSubmit={(data) => {
          if (editRow) {
            update(editRow.id, data as Partial<Channel>);
          } else {
            create(data);
          }
        }}
      />
    </div>
  );
}