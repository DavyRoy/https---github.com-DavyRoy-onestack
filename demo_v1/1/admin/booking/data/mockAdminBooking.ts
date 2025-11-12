// src/app/demo/admin/booking/data/mockAdminBooking.ts
// Моки и helper’ы для админского блока бронирования

// ---------- Типы
export type AdminKpi = { label: string; value: number; delta?: number; href: string };

export type AdminResource = {
  id: string;
  name: string;
  type: "staff" | "room" | "equipment";
  locationId?: string;
  capacity: number;         // параллельных слотов
  services: string[];       // ids услуг
  active: boolean;
};

export type SlotTemplate = {
  id: string;
  name: string;
  days: number[];           // 1..7 (пн..вс)
  start: string;            // "HH:mm"
  end: string;              // "HH:mm"
  locationId?: string;
  serviceIds: string[];
  resourceIds: string[];
  priority: number;         // 0..100
  active: boolean;
  dateFrom?: string;        // YYYY-MM-DD
  dateTo?: string;
  parallel?: number;        // сколько параллельных слотов создавать
};

export type ExceptionItem = {
  id: string;
  type: "holiday" | "blackout" | "maintenance" | "personal";
  date: string;             // YYYY-MM-DD
  start?: string;           // "HH:mm"
  end?: string;             // "HH:mm"
  locationId?: string;
  resourceIds?: string[];
  reason?: string;
  active: boolean;
};

export type Reservation = {
  id: string;
  serviceId: string;
  resourceId: string;
  start: string;            // ISO
  end: string;              // ISO
  status: "new" | "pending" | "confirmed" | "completed" | "cancelled" | "noshow";
  client: string;
  href: string;
};

export type AdminPolicy = {
  id: string;
  name: string;
  type: "cancel" | "deposit" | "leadtime" | "buffer" | "overbooking";
  params: Record<string, any>; // произвольные параметры политики
  level: "org" | "location" | "category" | "service" | "resource";
  appliesTo?: {
    locations?: string[];
    categories?: string[];
    services?: string[];
    resources?: string[];
  };
  active: boolean;
  updatedAt?: string;
};

// ---------- KPI
export const ADMIN_BOOKING_KPI: AdminKpi[] = [
  { label: "Средняя загрузка", value: 68, delta: +4.2, href: "/demo/admin/booking/schedules?focus=coverage" },
  { label: "Отмены", value: 7, delta: -1.1, href: "/demo/manager/reports/booking?focus=cancel" },
  { label: "No-show", value: 3, delta: +0.4, href: "/demo/manager/reports/booking?focus=noshow" },
  { label: "Дней с нехваткой слотов", value: 5, delta: +2, href: "/demo/admin/booking/schedules?week=today" },
];

// ---------- Ресурсы
export const ADMIN_RESOURCES: AdminResource[] = [
  { id: "stf-anna", name: "Анна Л.", type: "staff", locationId: "loc-center", capacity: 1, services: ["srv-massage", "srv-facial"], active: true },
  { id: "stf-ivan", name: "Иван П.", type: "staff", locationId: "loc-center", capacity: 2, services: ["srv-nails", "srv-massage"], active: true },
  { id: "room-1", name: "Кабинет №1", type: "room", locationId: "loc-center", capacity: 1, services: ["srv-massage"], active: true },
];

// ---------- Шаблоны слотов (повторяющиеся правила)
export const ADMIN_SLOT_TEMPLATES: SlotTemplate[] = [
  { id: "tpl-1", name: "Будни Анна", days: [1,2,3,4,5], start: "10:00", end: "18:00", locationId: "loc-center", serviceIds: ["srv-massage","srv-facial"], resourceIds: ["stf-anna"], priority: 50, active: true, parallel: 1 },
  { id: "tpl-2", name: "Будни Иван (2 паралл.)", days: [1,2,3,4,5], start: "12:00", end: "20:00", locationId: "loc-center", serviceIds: ["srv-nails","srv-massage"], resourceIds: ["stf-ivan"], priority: 50, active: true, parallel: 2 },
  { id: "tpl-3", name: "Кабинет 1", days: [1,2,3,4,5,6], start: "11:00", end: "19:00", locationId: "loc-center", serviceIds: ["srv-massage"], resourceIds: ["room-1"], priority: 40, active: true, parallel: 1 },
];

// ✅ Алиас, который требуют страницы
export const ADMIN_TEMPLATES = ADMIN_SLOT_TEMPLATES;

// ---------- Исключения / блэкауты
export const ADMIN_EXCEPTIONS: ExceptionItem[] = [
  { id: "ex-ny", type: "holiday", date: "2025-01-01", active: true, reason: "Новый год" },
  { id: "ex-room", type: "maintenance", date: "2025-10-18", start: "12:00", end: "16:00", resourceIds: ["room-1"], active: true, reason: "Профилактика" },
];

// ---------- Политики (демо)
export const ADMIN_POLICIES: AdminPolicy[] = [
  {
    id: "pol-cancel-24h",
    name: "Отмена до 24ч",
    type: "cancel",
    params: { freeUntilHours: 24, penaltyPercent: 50 },
    level: "service",
    appliesTo: { services: ["srv-massage", "srv-facial"] },
    active: true,
    updatedAt: "2025-10-01T10:00:00Z",
  },
  {
    id: "pol-deposit-20",
    name: "Депозит 20%",
    type: "deposit",
    params: { percent: 20, refundable: true },
    level: "location",
    appliesTo: { locations: ["loc-center"] },
    active: true,
    updatedAt: "2025-10-02T15:30:00Z",
  },
  {
    id: "pol-leadtime",
    name: "Lead-time 2ч / max 30д",
    type: "leadtime",
    params: { minHoursBefore: 2, maxDaysAhead: 30 },
    level: "org",
    active: true,
  },
];

// ---------- Фактические брони (read-only в админке)
const iso = (d: Date) => d.toISOString().slice(0, 16) + ":00.000Z";
const withTime = (base: Date, h: number, m = 0) => {
  const x = new Date(base);
  x.setHours(h, m, 0, 0);
  return x;
};

const today = new Date();
const mon = new Date(today);
mon.setDate(mon.getDate() - ((today.getDay() + 6) % 7)); // ISO Monday

export const ADMIN_RESERVATIONS: Reservation[] = [
  {
    id: "BKG-1001",
    serviceId: "srv-massage",
    resourceId: "stf-anna",
    start: iso(withTime(mon, 11, 0)),
    end:   iso(withTime(mon, 12, 0)),
    status: "confirmed",
    client: "Салон «Омега»",
    href: "/demo/manager/booking/BKG-1001",
  },
  {
    id: "BKG-1002",
    serviceId: "srv-nails",
    resourceId: "stf-ivan",
    start: iso(withTime(mon, 14, 0)),
    end:   iso(withTime(mon, 14, 30)),
    status: "pending",
    client: "Дарья К.",
    href: "/demo/manager/booking/BKG-1002",
  },
  {
    id: "BKG-1003",
    serviceId: "srv-massage",
    resourceId: "room-1",
    start: iso(withTime(mon, 16, 0)),
    end:   iso(withTime(mon, 17, 0)),
    status: "confirmed",
    client: "ИП Селезнёв",
    href: "/demo/manager/booking/BKG-1003",
  },
];

// ---------- localStorage helpers (мягкие: если SSR — тихо возвращают дефолты)
const safeGet = (key: string) => {
  if (typeof window === "undefined") return null;
  try { return window.localStorage.getItem(key); } catch { return null; }
};
const safeSet = (key: string, value: string) => {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(key, value); } catch {}
};

const LS_KEYS = {
  templates: "admin_booking_templates",
  exceptions: "admin_booking_exceptions",
  resources: "admin_booking_resources",
  policies: "admin_booking_policies",
};

export const loadTemplates = (): SlotTemplate[] => {
  const raw = safeGet(LS_KEYS.templates);
  if (!raw) return ADMIN_SLOT_TEMPLATES;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : ADMIN_SLOT_TEMPLATES;
  } catch { return ADMIN_SLOT_TEMPLATES; }
};
export const saveTemplates = (items: SlotTemplate[]) => {
  safeSet(LS_KEYS.templates, JSON.stringify(items));
};

export const loadExceptions = (): ExceptionItem[] => {
  const raw = safeGet(LS_KEYS.exceptions);
  if (!raw) return ADMIN_EXCEPTIONS;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : ADMIN_EXCEPTIONS;
  } catch { return ADMIN_EXCEPTIONS; }
};
export const saveExceptions = (items: ExceptionItem[]) => {
  safeSet(LS_KEYS.exceptions, JSON.stringify(items));
};

export const loadResources = (): AdminResource[] => {
  const raw = safeGet(LS_KEYS.resources);
  if (!raw) return ADMIN_RESOURCES;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : ADMIN_RESOURCES;
  } catch { return ADMIN_RESOURCES; }
};
export const saveResources = (items: AdminResource[]) => {
  safeSet(LS_KEYS.resources, JSON.stringify(items));
};

export const loadPolicies = (): AdminPolicy[] => {
  const raw = safeGet(LS_KEYS.policies);
  if (!raw) return ADMIN_POLICIES;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : ADMIN_POLICIES;
  } catch { return ADMIN_POLICIES; }
};
export const savePolicies = (items: AdminPolicy[]) => {
  safeSet(LS_KEYS.policies, JSON.stringify(items));
};

// Заглушка расчёта конфликтов и capacity
export type CapacityIssue = { resourceId: string; date: string; start: string; end: string; required: number; capacity: number };
export const computeCapacityConflicts = (): CapacityIssue[] => [];