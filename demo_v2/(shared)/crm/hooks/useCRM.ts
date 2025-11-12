"use client";

import * as React from "react";
import {
  ADMIN_CRM_CLIENTS,
  ADMIN_CRM_META,
  ADMIN_CRM_SOURCES,
  ADMIN_CRM_PIPELINES,
  ADMIN_CRM_SEGMENTS,
  ADMIN_USERS,
} from "../index";
import type {
  AdminClient,
  AdminUser,
  LeadSource,
  Pipeline,
  Segment,
} from "../types";

/** Ключи localStorage для demo-оверрайдов */
const LS = {
  clients: "crm.clients",
  segments: "crm.segments",
  // оставим на будущее: источники/воронки тоже можно редактировать
  // sources: "crm.sources",
  // pipelines: "crm.pipelines",
} as const;

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function loadFromLS<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  return safeParse<T>(window.localStorage.getItem(key), fallback);
}

function saveToLS<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

/** Утилита генерации id (демо) */
function makeId(prefix: string) {
  return `${prefix}-${Date.now()}`;
}

/**
 * Хук CRM-данных (демо):
 * - читает базовые статичные массивы
 * - подмешивает локальные правки из localStorage
 * - предоставляет простые CRUD для клиентов и сегментов
 */
export function useCRM() {
  const [mounted, setMounted] = React.useState(false);

  // базовые данные (стабильные)
  const baseClients = React.useRef<AdminClient[]>(ADMIN_CRM_CLIENTS);
  const baseSegments = React.useRef<Segment[]>(ADMIN_CRM_SEGMENTS);

  // состояния с оверрайдом из LS
  const [clients, setClients] = React.useState<AdminClient[]>(
    () => (typeof window === "undefined" ? ADMIN_CRM_CLIENTS : loadFromLS(LS.clients, ADMIN_CRM_CLIENTS))
  );
  const [segments, setSegments] = React.useState<Segment[]>(
    () => (typeof window === "undefined" ? ADMIN_CRM_SEGMENTS : loadFromLS(LS.segments, ADMIN_CRM_SEGMENTS))
  );

  // неизменяемые в рамках демо (можно расширить позже CRUD’ом)
  const [sources] = React.useState<LeadSource[]>(ADMIN_CRM_SOURCES);
  const [pipelines] = React.useState<Pipeline[]>(ADMIN_CRM_PIPELINES);
  const [users] = React.useState<AdminUser[]>(ADMIN_USERS);
  const [meta] = React.useState(ADMIN_CRM_META);

  React.useEffect(() => setMounted(true), []);

  // persist
  React.useEffect(() => {
    if (!mounted) return;
    saveToLS(LS.clients, clients);
  }, [mounted, clients]);

  React.useEffect(() => {
    if (!mounted) return;
    saveToLS(LS.segments, segments);
  }, [mounted, segments]);

  /** Форс-перечитывание из LS (например, после импорта) */
  const refreshFromStorage = React.useCallback(() => {
    setClients(loadFromLS(LS.clients, ADMIN_CRM_CLIENTS));
    setSegments(loadFromLS(LS.segments, ADMIN_CRM_SEGMENTS));
  }, []);

  /** Сброс к дефолтным демо-данным */
  const resetDemoData = React.useCallback(() => {
    saveToLS(LS.clients, ADMIN_CRM_CLIENTS);
    saveToLS(LS.segments, ADMIN_CRM_SEGMENTS);
    setClients(ADMIN_CRM_CLIENTS);
    setSegments(ADMIN_CRM_SEGMENTS);
  }, []);

  /* ========== CRUD: Клиенты ========== */

  const addClient = React.useCallback((payload: Omit<AdminClient, "id"> & { id?: string }) => {
    const id = payload.id ?? makeId("c");
    const rec: AdminClient = {
      id,
      name: payload.name?.trim() || "Без имени",
      company: payload.company?.trim() || undefined,
      email: payload.email?.trim() || undefined,
      phone: payload.phone?.trim() || undefined,
      tags: Array.isArray(payload.tags) ? payload.tags.filter(Boolean) : [],
      city: payload.city?.trim() || undefined,
      country: payload.country?.trim() || undefined,
      lastActivityAt: payload.lastActivityAt,
      orders: Math.max(0, Number(payload.orders ?? 0)),
      ltv: Math.max(0, Number(payload.ltv ?? 0)),
      managerId: payload.managerId || undefined,
    };
    setClients((prev) => [rec, ...prev]);
    return id;
  }, []);

  const updateClient = React.useCallback((id: string, patch: Partial<AdminClient>) => {
    setClients((prev) => {
      const idx = prev.findIndex((c) => c.id === id);
      if (idx < 0) return prev;
      const next = [...prev];
      next[idx] = { ...prev[idx], ...patch };
      return next;
    });
  }, []);

  const deleteClient = React.useCallback((id: string) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
  }, []);

  /* ========== CRUD: Сегменты (лайтово) ========== */

  const addSegment = React.useCallback((s: Omit<Segment, "id" | "updatedAt"> & { id?: string }) => {
    const id = s.id ?? makeId("seg");
    const rec: Segment = {
      id,
      name: s.name.trim(),
      type: s.type,
      size: Math.max(0, Number(s.size ?? 0)),
      updatedAt: new Date().toISOString(),
      rulesBrief: s.rulesBrief,
      autoUpdate: Boolean(s.autoUpdate),
    };
    setSegments((prev) => [rec, ...prev]);
    return id;
  }, []);

  const updateSegment = React.useCallback((id: string, patch: Partial<Segment>) => {
    setSegments((prev) => {
      const idx = prev.findIndex((x) => x.id === id);
      if (idx < 0) return prev;
      const next = [...prev];
      next[idx] = { ...prev[idx], ...patch, updatedAt: new Date().toISOString() };
      return next;
    });
  }, []);

  const deleteSegment = React.useCallback((id: string) => {
    setSegments((prev) => prev.filter((s) => s.id !== id));
  }, []);

  return {
    // данные
    clients,
    segments,
    sources,
    pipelines,
    users,
    meta,

    // CRUD
    addClient,
    updateClient,
    deleteClient,

    addSegment,
    updateSegment,
    deleteSegment,

    // служебные
    refreshFromStorage,
    resetDemoData,
  };
}