"use client";

import React, { useEffect, useRef, useState } from "react";
import { Channel } from "@/app/demo/(shared)/integrations/data/mockAdminIntegrationsChannels";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    data: Omit<Channel, "id" | "lastCheckAt" | "sent24h" | "errors24h"> &
      Partial<Pick<Channel, "sent24h" | "errors24h">>
  ) => void;
  initial?: Partial<Channel>;
};

export default function ChannelModal({ open, onClose, onSubmit, initial }: Props) {
  const [name, setName] = useState("");
  const [provider, setProvider] = useState("");
  const [type, setType] = useState<Channel["type"]>("email");
  const [status, setStatus] = useState<Channel["status"]>("ok");

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const firstInputRef = useRef<HTMLInputElement | null>(null);

  // Инициализация полей + окружение при открытии
  useEffect(() => {
    if (!open) return;
    setName(initial?.name ?? "");
    setProvider(initial?.provider ?? "");
    setType(initial?.type ?? "email");
    setStatus(initial?.status ?? "ok");

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden"; // блокируем скролл фона
    const rafId = requestAnimationFrame(() => firstInputRef.current?.focus()); // автофокус

    return () => {
      document.body.style.overflow = prevOverflow;
      cancelAnimationFrame(rafId);
    };
  }, [open, initial]);

  // Закрытие по Esc
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Ловушка таб-фокуса внутри модалки
  useEffect(() => {
    if (!open) return;
    const root = dialogRef.current;
    if (!root) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusables = root.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    root.addEventListener("keydown", handleKeyDown);
    return () => root.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  if (!open) return null;

  const submit = () => {
    if (!name.trim() || !provider.trim()) {
      alert("Заполните название и провайдера");
      return;
    }
    onSubmit({ name, provider, type, status, features: [], settings: {} });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/50 w-full max-w-full"
      onClick={onClose}
      aria-hidden="false"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="channel-modal-title"
        className="
          w-[96%] max-w-lg rounded-2xl border border-white/15 bg-neutral-900
          p-4 md:p-5 shadow-xl min-w-0
        "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div id="channel-modal-title" className="text-lg font-semibold">
              Подключить канал
            </div>
            <p className="text-xs text-white/60 mt-0.5">
              Укажите основные параметры канала, затем сохраните (демо).
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Закрыть"
            className="rounded-lg border border-white/20 px-2 py-1 text-sm hover:bg-white/[0.08]"
          >
            ✕
          </button>
        </div>

        <form
          className="grid gap-3 mt-4"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <label className="flex flex-col gap-1 text-xs text-white/60">
            Название
            <input
              ref={firstInputRef}
              className="rounded-lg bg-white/10 border border-white/15 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-white/25"
              placeholder="Напр.: Transactional Email"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-required="true"
            />
          </label>

          <label className="flex flex-col gap-1 text-xs text-white/60">
            Провайдер
            <input
              className="rounded-lg bg-white/10 border border-white/15 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-white/25"
              placeholder="Напр.: SendGrid / Twilio / SMTP"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              aria-required="true"
            />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <label className="flex flex-col gap-1 text-xs text-white/60">
              Тип
              <select
                className="rounded-lg bg-white/10 border border-white/15 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-white/25"
                value={type}
                onChange={(e) => setType(e.target.value as Channel["type"])}
              >
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="messenger">Messenger</option>
              </select>
            </label>

            <label className="flex flex-col gap-1 text-xs text-white/60">
              Статус
              <select
                className="rounded-lg bg-white/10 border border-white/15 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-white/25"
                value={status}
                onChange={(e) => setStatus(e.target.value as Channel["status"])}
              >
                <option value="ok">OK</option>
                <option value="degraded">Degraded</option>
                <option value="down">Down</option>
              </select>
            </label>
          </div>

          <div className="mt-2 flex flex-col sm:flex-row gap-2 sm:justify-end">
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20"
              onClick={onClose}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-white hover:bg-white/90 text-neutral-900"
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}