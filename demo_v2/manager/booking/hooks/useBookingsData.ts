// src/app/demo/manager/booking/hooks/useBookingsData.ts
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { mockBookings, type Booking } from "@/app/demo/manager/booking/data/mockBookings";

const LS_NEW = "mgr_new_bookings_v1";

function loadLocal(): Booking[] {
  try {
    const raw = localStorage.getItem(LS_NEW);
    return raw ? (JSON.parse(raw) as Booking[]) : [];
  } catch {
    return [];
  }
}
function saveLocal(upd: Booking) {
  try {
    const raw = localStorage.getItem(LS_NEW);
    const arr = raw ? (JSON.parse(raw) as Booking[]) : [];
    const idx = arr.findIndex((x) => x.id === upd.id);
    if (idx >= 0) {
      arr[idx] = upd;
      localStorage.setItem(LS_NEW, JSON.stringify(arr));
    }
  } catch {}
}

export type BookingFilters = {
  q?: string;
  status?: string;            // new|pending|confirmed|completed|cancelled|noshow|rescheduled
  date_from?: string;         // YYYY-MM-DD
  date_to?: string;           // YYYY-MM-DD
  service?: string;           // service id
  staff?: string;             // staff id
  source?: string;            // online|manager|phone
  sort?: "startAt_asc" | "startAt_desc" | "createdAt_desc";
};

export function useBookingsData(initialFilters?: BookingFilters) {
  // фильтры
  const [filters, setFilters] = useState<BookingFilters>(initialFilters ?? {});
  // «сырые» строки (моки + локальные правки)
  const [rows, setRows] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // пагинация
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);

  // склеиваем локальные и мок-заказы
  const mergeLocal = useCallback(() => {
    const loc = loadLocal();
    const map = new Map<string, Booking>();
    // локальные имеют приоритет
    [...loc, ...mockBookings].forEach((b) => map.set(b.id, b));
    const arr = Array.from(map.values()).sort(
      (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
    );
    setRows(arr);
    setLoading(false);
  }, []);

  useEffect(() => {
    mergeLocal();
  }, [mergeLocal]);

  // сбрасываем страницу при смене фильтров / размера страницы
  useEffect(() => {
    setPage(1);
  }, [filters, pageSize]);

  // действия
  const updateStatus = useCallback((id: string, nextStatus: Booking["status"]) => {
    setRows((prev) => {
      const copy = prev.map((r) => (r.id === id ? { ...r, status: nextStatus } : r));
      const upd = copy.find((x) => x.id === id);
      if (upd) saveLocal(upd);
      // событие для таймлайна
      const item = {
        id: Math.random().toString(36).slice(2, 8),
        ts: new Date().toISOString(),
        kind: "status",
        text: `Статус обновлён: ${nextStatus}`,
      } as const;
      window.dispatchEvent(new CustomEvent("mgr-booking-timeline", { detail: { bookingId: id, item } }));
      return copy;
    });
  }, []);

  const assignStaff = useCallback((id: string, staffId: string, staffName?: string) => {
    setRows((prev) => {
      const copy = prev.map((r) =>
        r.id === id ? { ...r, staffId, staffName: staffName ?? r.staffName } : r
      );
      const upd = copy.find((x) => x.id === id);
      if (upd) saveLocal(upd);
      const item = {
        id: Math.random().toString(36).slice(2, 8),
        ts: new Date().toISOString(),
        kind: "status",
        text: `Назначен сотрудник: ${staffName || staffId}`,
      } as const;
      window.dispatchEvent(new CustomEvent("mgr-booking-timeline", { detail: { bookingId: id, item } }));
      return copy;
    });
  }, []);

  // фильтрация + сортировка (на клиенте)
  const filtered = useMemo(() => {
    const f = filters;
    let out = rows;

    if (f.q) {
      const s = f.q.trim().toLowerCase();
      out = out.filter(
        (r) =>
          r.id.toLowerCase().includes(s) ||
          (r.clientName || "").toLowerCase().includes(s) ||
          (r.clientPhone || "").toLowerCase().includes(s) ||
          (r.clientEmail || "").toLowerCase().includes(s) ||
          (r.serviceTitle || r.serviceId).toLowerCase().includes(s)
      );
    }
    if (f.status) out = out.filter((r) => r.status === f.status);
    if (f.service) out = out.filter((r) => r.serviceId === f.service);
    if (f.staff) out = out.filter((r) => r.staffId === f.staff);
    if (f.source) out = out.filter((r) => r.source === f.source);

    if (f.date_from) out = out.filter((r) => r.startAt.slice(0, 10) >= f.date_from!);
    if (f.date_to) out = out.filter((r) => r.startAt.slice(0, 10) <= f.date_to!);

    switch (f.sort) {
      case "startAt_desc":
        out = [...out].sort((a, b) => +new Date(b.startAt) - +new Date(a.startAt));
        break;
      case "createdAt_desc":
        out = [...out].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
        break;
      case "startAt_asc":
      default:
        out = [...out].sort((a, b) => +new Date(a.startAt) - +new Date(b.startAt));
    }

    return out;
  }, [rows, filters]);

  // пагинация поверх отфильтрованного
  const total = filtered.length;
  const lastPage = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, lastPage);
  const start = (safePage - 1) * pageSize;
  const end = start + pageSize;
  const paged = filtered.slice(start, end);

  // если текущая страница «выпала» из диапазона — мягко поправим
  useEffect(() => {
    if (page > lastPage) setPage(lastPage);
  }, [page, lastPage]);

  return {
    loading,
    // данные текущей страницы
    data: paged,
    // фильтры
    filters,
    setFilters,
    // обновление
    refresh: mergeLocal,
    // действия для таблицы/меню
    updateStatus,
    assignStaff,
    // пагинация
    total,
    page: safePage,
    pageSize,
    setPage,
    setPageSize,
  };
}