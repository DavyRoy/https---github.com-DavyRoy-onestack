"use client";

import { useEffect, useMemo, useState } from "react";
import { CHANNELS as MOCK_CHANNELS, type Channel } from "@/app/demo/(shared)/integrations/data/mockAdminIntegrationsChannels";
import { WEBHOOKS as MOCK_WEBHOOKS, type Webhook } from "@/app/demo/(shared)/integrations/data/mockAdminIntegrationsWebhooks";

const LS_CHANNELS = "demo.integrations.channels";
const LS_WEBHOOKS = "demo.integrations.webhooks";

/** Безопасная загрузка из localStorage на клиенте */
function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** Безопасное сохранение в localStorage на клиенте */
function save<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // игнорируем в демо
  }
}

/** Дет-safe генератор id: UUID если доступен, иначе предсказуемый fallback */
function genId(prefix: string) {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
    }
  } catch {}
  // fallback без Math.random в SSR — используется только в действиях на клиенте
  const ts = Date.now().toString(36);
  return `${prefix}_${ts.slice(-8)}`;
}

/* -------------------- Channels Store -------------------- */

export function useChannelsStore() {
  const [ready, setReady] = useState(false);
  const [channels, setChannels] = useState<Channel[]>([]);

  useEffect(() => {
    setChannels(load<Channel[]>(LS_CHANNELS, MOCK_CHANNELS));
    setReady(true);
  }, []);

  const actions = useMemo(() => {
    return {
      create: (
        payload: Omit<Channel, "id" | "lastCheckAt" | "sent24h" | "errors24h"> &
          Partial<Pick<Channel, "sent24h" | "errors24h">>
      ) => {
        const base = payload.name.trim().toLowerCase().replace(/\s+/g, "_");
        const id = genId(base || payload.provider || "channel");
        const nowIso = new Date().toISOString();

        const next: Channel = {
          id,
          name: payload.name,
          type: payload.type,
          provider: payload.provider,
          status: payload.status,
          lastCheckAt: nowIso,
          sent24h: payload.sent24h ?? 0,
          errors24h: payload.errors24h ?? 0,
          features: payload.features ?? [],
          settings: payload.settings ?? {},
        };

        setChannels((prev) => {
          const v = [next, ...prev];
          save(LS_CHANNELS, v);
          return v;
        });
        return next;
      },

      update: (id: string, patch: Partial<Channel>) => {
        setChannels((prev) => {
          const v = prev.map((it) => (it.id === id ? { ...it, ...patch } : it));
          save(LS_CHANNELS, v);
          return v;
        });
      },

      remove: (id: string) => {
        setChannels((prev) => {
          const v = prev.filter((it) => it.id !== id);
          save(LS_CHANNELS, v);
          return v;
        });
      },

      toggleStatus: (id: string) => {
        setChannels((prev) => {
          const v = prev.map((it) =>
            it.id === id
              ? {
                  ...it,
                  status:
                    it.status === "down"
                      ? "ok"
                      : it.status === "ok"
                      ? "degraded"
                      : "ok",
                }
              : it
          );
          save(LS_CHANNELS, v);
          return v;
        });
      },
    };
  }, []);

  return { ready, channels, ...actions };
}

/* -------------------- Webhooks Store -------------------- */

export function useWebhooksStore() {
  const [ready, setReady] = useState(false);
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);

  useEffect(() => {
    setWebhooks(load<Webhook[]>(LS_WEBHOOKS, MOCK_WEBHOOKS));
    setReady(true);
  }, []);

  const actions = useMemo(() => {
    return {
      create: (payload: Omit<Webhook, "id" | "lastDeliveryAt">) => {
        const base = payload.name.trim().toLowerCase().replace(/\s+/g, "_");
        const id = genId(base || "webhook");

        const next: Webhook = { ...payload, id };

        setWebhooks((prev) => {
          const v = [next, ...prev];
          save(LS_WEBHOOKS, v);
          return v;
        });
        return next;
      },

      update: (id: string, patch: Partial<Webhook>) => {
        setWebhooks((prev) => {
          const v = prev.map((it) => (it.id === id ? { ...it, ...patch } : it));
          save(LS_WEBHOOKS, v);
          return v;
        });
      },

      remove: (id: string) => {
        setWebhooks((prev) => {
          const v = prev.filter((it) => it.id !== id);
          save(LS_WEBHOOKS, v);
          return v;
        });
      },

      togglePaused: (id: string) => {
        setWebhooks((prev) => {
          const v = prev.map((it) =>
            it.id === id
              ? { ...it, status: it.status === "paused" ? "ok" : "paused" }
              : it
          );
          save(LS_WEBHOOKS, v);
          return v;
        });
      },
    };
  }, []);

  return { ready, webhooks, ...actions };
}