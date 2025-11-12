"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { Webhook } from "@/app/demo/(shared)/integrations/data/mockAdminIntegrationsWebhooks";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Webhook, "id" | "lastDeliveryAt">) => void;
  initial?: Partial<Webhook>;
};

export default function WebhookModal({ open, onClose, onSubmit, initial }: Props) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [eventsText, setEventsText] = useState("order.created,payment.paid");
  const [secret, setSecret] = useState("whsec_****…****");
  const [verify, setVerify] = useState<Webhook["verify"]>("signature");
  const [status, setStatus] = useState<Webhook["status"]>("ok");

  const panelRef = useRef<HTMLDivElement | null>(null);
  const titleId = "webhook-modal-title";

  // Восстанавливаем значения при открытии
  useEffect(() => {
    if (!open) return;
    setName(initial?.name ?? "");
    setUrl(initial?.url ?? "");
    setEventsText((initial?.events ?? ["order.created", "payment.paid"]).join(","));
    setSecret(initial?.secret ?? "whsec_****…****");
    setVerify(initial?.verify ?? "signature");
    setStatus(initial?.status ?? "ok");
    // фокус внутрь
    setTimeout(() => panelRef.current?.querySelector<HTMLInputElement>("input")?.focus(), 0);
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

  const events = useMemo(
    () =>
      eventsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    [eventsText]
  );

  const isValidUrl = useMemo(() => {
    try {
      // Разрешаем относительные? Нет — только абсолютные http/https
      const u = new URL(url);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  }, [url]);

  const canSave = name.trim().length > 0 && isValidUrl && events.length > 0;

  const submit = () => {
    if (!canSave) return;
    onSubmit({ name: name.trim(), url: url.trim(), events, secret, verify, status });
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="
        fixed inset-0 z-50 grid place-items-center bg-black/55
        px-3 py-4
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onMouseDown={(e) => {
        // клик по фону — закрыть
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        className="
          w-full max-w-xl max-h-[90vh] overflow-y-auto
          rounded-2xl border border-white/15 bg-neutral-900
          p-4 md:p-5
        "
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div id={titleId} className="text-lg font-semibold">
              Добавить вебхук
            </div>
            <p className="text-xs text-white/60 mt-0.5">
              Укажите URL, события и параметры подписи.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/15 px-2 py-1 text-sm hover:bg-white/[0.08]"
            aria-label="Закрыть"
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
          {/* Название */}
          <label className="grid gap-1">
            <span className="text-xs text-white/60">Название</span>
            <input
              className="rounded-lg bg-white/10 border border-white/15 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20"
              placeholder="Напр.: Orders ERP"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          {/* URL */}
          <label className="grid gap-1">
            <span className="text-xs text-white/60">URL</span>
            <input
              className={`rounded-lg bg-white/10 border px-3 py-2 text-sm outline-none focus:ring-2 ${
                url
                  ? isValidUrl
                    ? "border-white/15 focus:ring-emerald-400/20"
                    : "border-rose-400/40 focus:ring-rose-400/20"
                  : "border-white/15 focus:ring-white/20"
              }`}
              placeholder="https://example.com/webhooks/orders"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              inputMode="url"
            />
            {!isValidUrl && url && (
              <span className="text-xs text-rose-300">Введите корректный http(s) URL</span>
            )}
          </label>

          {/* События */}
          <label className="grid gap-1">
            <span className="text-xs text-white/60">События (через запятую)</span>
            <input
              className="rounded-lg bg-white/10 border border-white/15 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20"
              placeholder="order.created, payment.paid"
              value={eventsText}
              onChange={(e) => setEventsText(e.target.value)}
            />
            <div className="text-[11px] text-white/50">
              Пример: <code>order.created, payment.paid, booking.cancelled</code>
            </div>
          </label>

          {/* Verify / Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <label className="grid gap-1">
              <span className="text-xs text-white/60">Проверка подписи</span>
              <select
                className="rounded-lg bg-white/10 border border-white/15 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20"
                value={verify}
                onChange={(e) => setVerify(e.target.value as Webhook["verify"])}
              >
                <option value="signature">Verify: Signature (HMAC)</option>
                <option value="none">Verify: None</option>
              </select>
            </label>

            <label className="grid gap-1">
              <span className="text-xs text-white/60">Статус</span>
              <select
                className="rounded-lg bg-white/10 border border-white/15 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20"
                value={status}
                onChange={(e) => setStatus(e.target.value as Webhook["status"])}
              >
                <option value="ok">OK</option>
                <option value="degraded">Degraded</option>
                <option value="down">Down</option>
                <option value="paused">Paused</option>
              </select>
            </label>
          </div>

          {/* Secret */}
          <label className="grid gap-1">
            <span className="text-xs text-white/60">Secret (masked)</span>
            <input
              className="rounded-lg bg-white/10 border border-white/15 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20"
              placeholder="whsec_****…****"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
            />
            <div className="text-[11px] text-white/50">
              Храните секрет безопасно. В журнале показывается в маске.
            </div>
          </label>

          {/* Кнопки */}
          <div className="mt-2 flex flex-col sm:flex-row gap-2 sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-sm"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={!canSave}
              className="
                px-4 py-2 rounded-lg text-sm
                bg-white text-neutral-900 hover:bg-white/90
                disabled:bg-white/40 disabled:text-neutral-700
              "
              title={!canSave ? "Заполните корректно поля" : ""}
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}