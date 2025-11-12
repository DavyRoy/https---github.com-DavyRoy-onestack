// src/app/demo/manager/booking/components/BookingFiltersBar.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Funnel, Search, RotateCw } from "lucide-react";

const LS_KEY = "mgr_booking_filters_v1";

const T = {
  input:
    "w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/30 placeholder:text-white/40",
  chip:
    "inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.07] px-2 py-0.5 text-[11px] text-white/80",
  btn:
    "inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30",
};

type Filters = {
  q: string;
  status: string;
  range: "today" | "7d" | "30d";
  service: string;
  staff: string;
  source: string;
};

const DEFAULTS: Filters = {
  q: "",
  status: "",
  range: "7d",
  service: "",
  staff: "",
  source: "",
};

export default function BookingFiltersBar() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const mounted = useRef(false);

  // --- локальное состояние фильтров
  const [q, setQ] = useState<string>(params.get("q") || DEFAULTS.q);
  const [status, setStatus] = useState<string>(params.get("status") || DEFAULTS.status);
  const [range, setRange] = useState<Filters["range"]>((params.get("range") as any) || DEFAULTS.range);
  const [service, setService] = useState<string>(params.get("service") || DEFAULTS.service);
  const [staff, setStaff] = useState<string>(params.get("staff") || DEFAULTS.staff);
  const [source, setSource] = useState<string>(params.get("source") || DEFAULTS.source);

  // --- при монтировании: если URL пуст, пытаемся восстановить из localStorage
  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    const urlHasAny =
      (params.get("q") ?? "") ||
      (params.get("status") ?? "") ||
      (params.get("range") ?? "") ||
      (params.get("service") ?? "") ||
      (params.get("staff") ?? "") ||
      (params.get("source") ?? "");

    if (typeof window === "undefined" || urlHasAny) return;

    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const s: Partial<Filters> = JSON.parse(raw);
        setQ(s.q ?? DEFAULTS.q);
        setStatus(s.status ?? DEFAULTS.status);
        setRange((s.range as Filters["range"]) ?? DEFAULTS.range);
        setService(s.service ?? DEFAULTS.service);
        setStaff(s.staff ?? DEFAULTS.staff);
        setSource(s.source ?? DEFAULTS.source);
      }
    } catch {}
  }, [params]);

  // --- синхронизация в URL (debounce + replace, чтобы не плодить history)
  useEffect(() => {
    const t = setTimeout(() => {
      const sp = new URLSearchParams(params.toString());
      const next: Partial<Filters> = { q, status, range, service, staff, source };

      Object.entries(next).forEach(([k, v]) => {
        if (v === undefined || v === null || v === "" || (k === "range" && v === DEFAULTS.range)) {
          sp.delete(k);
        } else {
          sp.set(k, String(v));
        }
      });

      const query = sp.toString();
      router.replace(query ? `${pathname}?${query}` : pathname);

      // сохраняем в localStorage
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem(
            LS_KEY,
            JSON.stringify({ q, status, range, service, staff, source })
          );
        }
      } catch {}
    }, 200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, status, range, service, staff, source, pathname]);

  // --- сброс
  const reset = () => {
    setQ(DEFAULTS.q);
    setStatus(DEFAULTS.status);
    setRange(DEFAULTS.range);
    setService(DEFAULTS.service);
    setStaff(DEFAULTS.staff);
    setSource(DEFAULTS.source);
    router.replace(pathname);
  };

  // --- быстрые чипы
  const quickChips = useMemo(
    () => [
      { key: "today", label: "На сегодня", apply: () => setRange("today") },
      { key: "pending", label: "Без подтверждения", apply: () => setStatus("pending") },
      { key: "overdue", label: "Просроченные", apply: () => setRange("today") }, // демо: today как суррогат
    ],
    []
  );

  const anyActive =
    q !== DEFAULTS.q ||
    status !== DEFAULTS.status ||
    range !== DEFAULTS.range ||
    service !== DEFAULTS.service ||
    staff !== DEFAULTS.staff ||
    source !== DEFAULTS.source;

  return (
    <div className="grid gap-2 md:grid-cols-[1fr_auto]">
      <div className="grid gap-2">
        {/* Поиск */}
        <div className="relative">
          <label className="sr-only" htmlFor="booking-q">
            Поиск
          </label>
          <input
            id="booking-q"
            className={T.input + " pl-8"}
            placeholder="Поиск: клиент, телефон, e-mail, комментарий…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Поиск по записям"
          />
          <Search
            className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 opacity-60"
            width={16}
            height={16}
            aria-hidden
          />
        </div>

        {/* Сетка фильтров */}
        <div className="grid gap-2 md:grid-cols-5">
          <label className="sr-only" htmlFor="booking-status">
            Статус
          </label>
          <select
            id="booking-status"
            className={T.input}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            aria-label="Статус"
          >
            <option value="">Статус: все</option>
            <option value="new">Новая</option>
            <option value="pending">Ожидает подтв.</option>
            <option value="confirmed">Подтверждена</option>
            <option value="completed">Состоялась</option>
            <option value="cancelled">Отменена</option>
            <option value="noshow">Не явился</option>
            <option value="rescheduled">Перенесена</option>
          </select>

          <label className="sr-only" htmlFor="booking-range">
            Период
          </label>
          <select
            id="booking-range"
            className={T.input}
            value={range}
            onChange={(e) => setRange(e.target.value as Filters["range"])}
            aria-label="Период"
          >
            <option value="today">Сегодня</option>
            <option value="7d">7 дней</option>
            <option value="30d">30 дней</option>
          </select>

          <label className="sr-only" htmlFor="booking-service">
            Услуга
          </label>
          <input
            id="booking-service"
            className={T.input}
            placeholder="Услуга ID"
            value={service}
            onChange={(e) => setService(e.target.value)}
            aria-label="Услуга"
          />

          <label className="sr-only" htmlFor="booking-staff">
            Сотрудник
          </label>
          <input
            id="booking-staff"
            className={T.input}
            placeholder="Сотрудник ID"
            value={staff}
            onChange={(e) => setStaff(e.target.value)}
            aria-label="Сотрудник"
          />

          <label className="sr-only" htmlFor="booking-source">
            Источник
          </label>
          <select
            id="booking-source"
            className={T.input}
            value={source}
            onChange={(e) => setSource(e.target.value)}
            aria-label="Источник"
          >
            <option value="">Источник: все</option>
            <option value="online">online</option>
            <option value="manager">manager</option>
            <option value="phone">phone</option>
          </select>
        </div>

        {/* Нижняя строка с чипами/сбросом */}
        <div className="flex flex-wrap items-center gap-2">
          {anyActive && (
            <span className={T.chip}>
              <Funnel width={12} height={12} /> Фильтры активны
            </span>
          )}
          <button className={T.btn} onClick={reset} aria-label="Сбросить фильтры">
            <RotateCw width={14} height={14} /> Сбросить
          </button>
          <div className="flex flex-wrap gap-2">
            {quickChips.map((c) => (
              <button
                key={c.key}
                className={T.chip + " hover:bg-white/[0.12]"}
                onClick={c.apply}
                type="button"
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Правый бокс (подпись-сервисная инфа) */}
      <div className="flex items-end justify-end">
        <div className="text-xs text-white/60">
          Синхронизировано с URL и localStorage
        </div>
      </div>
    </div>
  );
}