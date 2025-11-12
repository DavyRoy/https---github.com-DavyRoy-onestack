// вспомогательные фильтры/сортировки/страницы для CRM (демо)

import type { AdminClient, Segment } from "./types";

/* ================= базовые утилиты ================= */

export type SortDir = "asc" | "desc";
export type ClientSortKey = "name" | "orders" | "ltv" | "lastActivityAt";

export type ClientFilter = {
  q?: string;                 // текстовый поиск по name/company/email/phone/tags
  tags?: string[];            // пересечение с тегами клиента
  managerId?: string;         // ответственный
  country?: string;
  city?: string;
  hasEmail?: boolean;
  hasPhone?: boolean;
  minOrders?: number;
  ltvFrom?: number;
  ltvTo?: number;
  activeAfter?: string;       // ISO: lastActivityAt >=
  activeBefore?: string;      // ISO: lastActivityAt <=
  segmentIds?: string[];      // список сегментов, требуется принадлежность хотя бы к одному
};

export type Page = { page: number; pageSize: number };

/* — текстовый матч с нормализацией — */
const norm = (s?: string) => (s || "").toLowerCase();
function textMatch(client: AdminClient, q: string) {
  const hay = [
    client.name,
    client.company,
    client.email,
    client.phone,
    ...(client.tags || []),
  ]
    .filter(Boolean)
    .map(norm)
    .join(" ");
  return hay.includes(norm(q));
}

/* — безопасные сравнения — */
const ts = (iso?: string) => (iso ? new Date(iso).getTime() : 0);

/* ================= фильтры ================= */

export function filterClients(
  clients: AdminClient[],
  f: ClientFilter = {},
  opts?: {
    /** карта принадлежности к сегментам: segId -> Set(clientId) */
    segmentMap?: Map<string, Set<string>>;
  }
): AdminClient[] {
  const q = f.q?.trim();

  return clients.filter((c) => {
    if (q && !textMatch(c, q)) return false;
    if (f.tags?.length) {
      const set = new Set(c.tags || []);
      const inter = f.tags.some((t) => set.has(t));
      if (!inter) return false;
    }
    if (f.managerId && c.managerId !== f.managerId) return false;
    if (f.country && (c.country || "") !== f.country) return false;
    if (f.city && (c.city || "") !== f.city) return false;

    if (f.hasEmail === true && !c.email) return false;
    if (f.hasEmail === false && c.email) return false;
    if (f.hasPhone === true && !c.phone) return false;
    if (f.hasPhone === false && c.phone) return false;

    if (typeof f.minOrders === "number" && c.orders < f.minOrders) return false;

    if (typeof f.ltvFrom === "number" && c.ltv < f.ltvFrom) return false;
    if (typeof f.ltvTo === "number" && c.ltv > f.ltvTo) return false;

    if (f.activeAfter && ts(c.lastActivityAt) < ts(f.activeAfter)) return false;
    if (f.activeBefore && ts(c.lastActivityAt) > ts(f.activeBefore)) return false;

    // сегменты: принадлежность хотя бы к одному из сегментов
    if (f.segmentIds?.length) {
      const map = opts?.segmentMap;
      if (!map) return false; // если не дали карту — фильтрация по сегментам невозможна
      const ok = f.segmentIds.some((sid) => map.get(sid)?.has(c.id));
      if (!ok) return false;
    }

    return true;
  });
}

/* ================= сортировка ================= */

export function sortClients(
  clients: AdminClient[],
  by: ClientSortKey = "name",
  dir: SortDir = "asc"
): AdminClient[] {
  const m = dir === "asc" ? 1 : -1;

  const val = (c: AdminClient) => {
    switch (by) {
      case "name":
        return (c.name || "").toLowerCase();
      case "orders":
        return c.orders || 0;
      case "ltv":
        return c.ltv || 0;
      case "lastActivityAt":
        return ts(c.lastActivityAt);
      default:
        return 0;
    }
  };

  return [...clients].sort((a, b) => {
    const va = val(a);
    const vb = val(b);
    if (va < vb) return -1 * m;
    if (va > vb) return 1 * m;
    return 0;
  });
}

/* ================= пагинация ================= */

export function paginate<T>(items: T[], { page, pageSize }: Page) {
  const p = Math.max(1, page || 1);
  const s = Math.max(1, pageSize || 20);
  const start = (p - 1) * s;
  return {
    total: items.length,
    page: p,
    pageSize: s,
    items: items.slice(start, start + s),
  };
}

/* ================= агрегации ================= */

export function countByManager(clients: AdminClient[]) {
  const map = new Map<string, number>();
  clients.forEach((c) => {
    const k = c.managerId || "_none_";
    map.set(k, (map.get(k) || 0) + 1);
  });
  return map; // managerId -> count
}

export function topTags(clients: AdminClient[], limit = 10) {
  const map = new Map<string, number>();
  clients.forEach((c) => {
    (c.tags || []).forEach((t) => map.set(t, (map.get(t) || 0) + 1));
  });
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tag, count]) => ({ tag, count }));
}

/* ================= помощник сегментов ================= */

/**
 * Строит карту: segmentId -> Set(clientId)
 * — tag-сегменты: rulesBrief вида "#vip" → клиенты с тегом "vip"
 * — dynamic (лайтово): понимаем строки вида "no activity > 90d" и "created < 30d" (условно)
 * — static: size отображаемый, принадлежность неизвестна → оставляем пустым (демо)
 */
export function buildSegmentMap(segments: Segment[], clients: AdminClient[]) {
  const map = new Map<string, Set<string>>();

  const now = Date.now();

  const parseDays = (s: string) => {
    const m = s.match(/(\d+)\s*d/i);
    return m ? parseInt(m[1], 10) : 0;
    // упрощение: только дни, без недель/месяцев
  };

  segments.forEach((seg) => {
    const set = new Set<string>();

    if (seg.type === "tag" && seg.rulesBrief?.startsWith("#")) {
      const tag = seg.rulesBrief.slice(1).trim().toLowerCase();
      clients.forEach((c) => {
        if ((c.tags || []).map((t) => t.toLowerCase()).includes(tag)) set.add(c.id);
      });
    } else if (seg.type === "dynamic" && seg.rulesBrief) {
      const rb = seg.rulesBrief.toLowerCase();

      // no activity > Nd
      if (rb.includes("no activity")) {
        const days = parseDays(rb);
        const threshold = now - days * 86400000;
        clients.forEach((c) => {
          const last = c.lastActivityAt ? new Date(c.lastActivityAt).getTime() : 0;
          if (last > 0 && last < threshold) set.add(c.id);
        });
      }

      // created < Nd — у нас нет createdAt в демо; прикинем по «первые активности»
      // оставим на будущее
    }

    map.set(seg.id, set);
  });

  return map;
}