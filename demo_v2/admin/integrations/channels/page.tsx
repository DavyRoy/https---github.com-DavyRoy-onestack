"use client";

import { useCallback, useState } from "react";
import ChannelsTable from "../components/ChannelsTable";
import ChannelModal from "../components/ChannelModal";
import { useChannelsStore } from "@/app/demo/(shared)/integrations/hooks/useIntegrationsStore";
import type { Channel } from "@/app/demo/(shared)/integrations/data/mockAdminIntegrationsChannels";

export default function ChannelsPage() {
  const { ready, channels, create, update, remove, toggleStatus } = useChannelsStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editRow, setEditRow] = useState<Channel | null>(null);

  const openCreate = useCallback(() => {
    setEditRow(null);
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((row: Channel) => {
    setEditRow(row);
    setModalOpen(true);
  }, []);

  const handleToggle = useCallback(
    (id: string) => toggleStatus(id),
    [toggleStatus]
  );

  const handleDelete = useCallback(
    (id: string) => remove(id),
    [remove]
  );

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    // очищаем выбранную строку, чтобы при следующем «Подключить» поля были пустыми
    setEditRow(null);
  }, []);

  const handleSubmit = useCallback(
    (data: Omit<Channel, "id" | "lastCheckAt" | "sent24h" | "errors24h"> & Partial<Pick<Channel, "sent24h" | "errors24h">>) => {
      if (editRow) {
        update(editRow.id, data as Partial<Channel>);
      } else {
        create(data);
      }
    },
    [create, update, editRow]
  );

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
            type="button"
            className="
              w-full sm:w-auto rounded-lg
              bg-white/90 text-black px-3 py-2 text-sm
              hover:bg-white transition
            "
            onClick={openCreate}
          >
            Подключить канал
          </button>
        </div>
      </header>

      {/* Таблица (сама отвечает за горизонтальный скролл) */}
      <div className="min-w-0">
        <ChannelsTable
          rows={channels}
          onEdit={openEdit}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      </div>

      {/* Модалка создания/редактирования */}
      <ChannelModal
        open={modalOpen}
        initial={editRow ?? undefined}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
      />
    </div>
  );
}