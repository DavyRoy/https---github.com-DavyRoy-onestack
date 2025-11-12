// src/app/demo/manager/calendar/page.tsx
"use client";

import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import CalendarHeader from "./components/CalendarHeader";
import CalendarGridWeek, { WeekEvent } from "./components/CalendarGridWeek";

const T = { page: "grid gap-6" };

/* ===================== utils ===================== */

// детерминированный PRNG от seed-строки
function seededRand(seed: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return (h >>> 0) / 0xffffffff;
  };
}

function startOfWeek(d: Date) {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7; // Пн=0
  x.setDate(x.getDate() - day);
  x.setHours(0, 0, 0, 0);
  return x;
}

function clampView(v?: string): "day" | "week" | "month" {
  return v === "day" || v === "month" ? v : "week";
}

/* ===== demo storage bridge (чтобы ссылки не вели в 404) ===== */

const LS_KEY = "mgr_new_bookings_v1";

type LSBooking = {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  serviceId: string;
  serviceTitle: string;
  staffId: string;
  staffName: string;
  source: "online" | "manager" | "phone";
  startAt: string; // ISO
  endAt: string;   // ISO
  createdAt: string;
  status: "new" | "pending" | "confirmed" | "completed" | "cancelled" | "noshow" | "rescheduled";
  note?: string;
  price?: number;
};

function lsLoad(): LSBooking[] {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(LS_KEY) : null;
    return raw ? (JSON.parse(raw) as LSBooking[]) : [];
  } catch {
    return [];
  }
}

function lsUpsert(rec: LSBooking) {
  try {
    const arr = lsLoad();
    const i = arr.findIndex((x) => x.id === rec.id);
    if (i >= 0) arr[i] = rec;
    else arr.unshift(rec);
    localStorage.setItem(LS_KEY, JSON.stringify(arr));
  } catch {
    /* no-op */
  }
}

// создаёт минимальную «запись из календаря» на 60 минут
function ensureCalendarBooking(id: string, dateISO: string, time: string) {
  const [hh, mm] = time.split(":").map((x) => parseInt(x, 10));
  const start = new Date(`${dateISO}T${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:00`);
  const end = new Date(start);
  end.setMinutes(end.getMinutes() + 60);

  const base: LSBooking = {
    id,
    clientId: "C-CLD",
    clientName: "Календарь (демо)",
    serviceId: "srv-hair-1",
    serviceTitle: "Услуга (демо)",
    staffId: "st-1",
    staffName: "Мария",
    source: "manager",
    startAt: start.toISOString(),
    endAt: end.toISOString(),
    createdAt: new Date().toISOString(),
    status: "new",
    note: "Создано из календаря (демо)",
  };

  // если уже есть — не перезаписываем время; иначе создаём
  const exist = lsLoad().some((x) => x.id === id);
  if (!exist) lsUpsert(base);
}

/* ===================== component ===================== */

export default function ManagerCalendarPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Определяем мобильный режим (≤640px)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  const rawView = clampView(searchParams.get("view") ?? undefined);
  const view: "day" | "week" | "month" = isMobile ? "day" : rawView;

  const focusISO = searchParams.get("date") ?? new Date().toISOString().slice(0, 10);

  const focusDate = useMemo(() => {
    const d = new Date(`${focusISO}T00:00:00`);
    d.setHours(0, 0, 0, 0);
    return isNaN(d.getTime()) ? new Date() : d;
  }, [focusISO]);

  // При смене ширины экрана — синхронизируем view в URL
  useEffect(() => {
    const sp = new URLSearchParams(searchParams.toString());
    if (isMobile && sp.get("view") !== "day") {
      sp.set("view", "day");
      router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
    }
  }, [isMobile, pathname, router, searchParams]);

  // Детерминированные события на неделю от seed (focusISO)
  const initialEvents = useMemo<WeekEvent[]>(() => {
    const rand = seededRand(focusISO);
    const weekStart = startOfWeek(focusDate);
    const makeDate = (offset: number) => {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + offset);
      return d.toISOString().slice(0, 10);
    };
    const baseTimes = ["10:00", "12:00", "14:00", "16:00"];
    const statuses: WeekEvent["status"][] = ["new", "pending", "confirmed", "completed"];

    const n = 6 + Math.floor(rand() * 4); // 6..9 событий
    const list: WeekEvent[] = [];
    for (let i = 0; i < n; i++) {
      const day = Math.floor(rand() * 7);
      const time = baseTimes[Math.floor(rand() * baseTimes.length)];
      const status = statuses[Math.floor(rand() * statuses.length)];
      const id = `BKG-CLD-${focusISO.replaceAll("-", "")}-${i + 1}`;

      // создадим «живую» запись в localStorage, чтобы клик не вёл в 404
      ensureCalendarBooking(id, makeDate(day), time);

      list.push({
        id,
        dateISO: makeDate(day),
        time,
        title: "Запись (демо)",
        status,
        href: `/demo/manager/booking/${id}`,
      });
    }
    return list;
  }, [focusISO, focusDate]);

  const [data, setData] = useState<WeekEvent[]>(initialEvents);

  // если сменили неделю/дату — обновим список
  useEffect(() => {
    setData(initialEvents);
  }, [initialEvents]);

  // Навигация по дате через router.push с актуальными query
  const pushWithQuery = useCallback(
    (next: Record<string, string>) => {
      const sp = new URLSearchParams(searchParams.toString());
      Object.entries(next).forEach(([k, v]) => sp.set(k, v));
      // на мобиле всегда фиксируем view=day
      if (isMobile) sp.set("view", "day");
      router.push(`${pathname}?${sp.toString()}`, { scroll: false });
    },
    [isMobile, pathname, router, searchParams]
  );

  const goPrev = () => {
    const d = new Date(focusDate);
    if (view === "day") d.setDate(d.getDate() - 1);
    else if (view === "week") d.setDate(d.getDate() - 7);
    else d.setMonth(d.getMonth() - 1);
    pushWithQuery({ view, date: d.toISOString().slice(0, 10) });
  };
  const goToday = () => {
    pushWithQuery({ view, date: new Date().toISOString().slice(0, 10) });
  };
  const goNext = () => {
    const d = new Date(focusDate);
    if (view === "day") d.setDate(d.getDate() + 1);
    else if (view === "week") d.setDate(d.getDate() + 7);
    else d.setMonth(d.getMonth() + 1);
    pushWithQuery({ view, date: d.toISOString().slice(0, 10) });
  };

  const handleCreateAt = (p: { dateISO: string; timeFrom: string }) => {
    const id = `BKG-CLD-${p.dateISO.replaceAll("-", "")}-${String(data.length + 1).padStart(2, "0")}`;

    // создаём запись в LS, чтобы детальная страница открылась
    ensureCalendarBooking(id, p.dateISO, p.timeFrom);

    setData((xs) => [
      ...xs,
      {
        id,
        dateISO: p.dateISO,
        time: p.timeFrom,
        title: "Новая запись",
        status: "new",
        href: `/demo/manager/booking/${id}`,
      },
    ]);
  };

  const handleMove = (id: string, nextISO: string, nextTime: string) => {
    // обновим UI
    setData((xs) => xs.map((e) => (e.id === id ? { ...e, dateISO: nextISO, time: nextTime } : e)));

    // и локальную запись (если она есть)
    const [hh, mm] = nextTime.split(":").map((x) => parseInt(x, 10));
    const start = new Date(`${nextISO}T${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:00`);
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + 60);

    try {
      const arr = lsLoad();
      const i = arr.findIndex((x) => x.id === id);
      if (i >= 0) {
        arr[i] = { ...arr[i], startAt: start.toISOString(), endAt: end.toISOString(), status: "confirmed" };
        localStorage.setItem(LS_KEY, JSON.stringify(arr));
      }
    } catch {
      /* no-op */
    }
  };

  /* ===== Свайп-навигация для мобильных ===== */
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null || touchStartY.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    // горизонтальный свайп, чтобы не конфликтовать со скроллом страницы
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) goNext(); // свайп влево -> вперёд
      else goPrev();        // свайп вправо -> назад
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <div className={T.page} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <CalendarHeader view={view} focusDate={focusDate} onPrev={goPrev} onToday={goToday} onNext={goNext} />

      {/* В этой демо-версии рендерим Week Grid. 
          На мобилке он сам показывает компактную недельную ленту, 
          а заголовок — в режиме "день" для правильного UX. */}
      <CalendarGridWeek
        focusDate={focusDate}
        events={data}
        onCreateAt={handleCreateAt}
        onMoveEvent={handleMove}
      />
    </div>
  );
}