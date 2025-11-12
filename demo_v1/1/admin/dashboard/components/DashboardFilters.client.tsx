// app/demo/admin/dashboard/components/DashboardFilters.client.tsx
// CLIENT COMPONENT: единые фильтры для всех ролей (можно переиспользовать).
// Если у тебя есть страницы Менеджера/Пользователя с такими же фильтрами — советую этот файл сделать общим:
// проверь наличие/создай: app/(shared)/dashboard/DashboardFilters.client.tsx и импортируй его в разных ролях.

"use client";

import { useMemo, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type {
  DashboardParams,
  DashboardPeriod,
  DashboardChannel,
  DashboardLocation,
  DashboardCurrency,
} from "../page";

const T = {
  input: "rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none",
  select: "rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none",
  chip:
    "rounded-xl px-3 py-1.5 text-sm border border-white/15 bg-white/10 hover:bg-white/15 data-[active=true]:bg-white data-[active=true]:text-black",
};

const PERIODS: Array<{ id: DashboardPeriod; label: string }> = [
  { id: "7d", label: "7д" },
  { id: "30d", label: "30д" },
  { id: "q", label: "Квартал" },
  { id: "y", label: "Год" },
];

const CHANNELS: Array<{ id: DashboardChannel; label: string }> = [
  { id: "all", label: "Все" },
  { id: "online", label: "Online" },
  { id: "manager", label: "Менеджер" },
];

const LOCATIONS: Array<{ id: DashboardLocation; label: string }> = [
  { id: "all", label: "Все локации" },
  { id: "center", label: "Центр" },
  { id: "south", label: "Юг" },
  { id: "north", label: "Север" },
];

const CURRENCIES: Array<{ id: DashboardCurrency; label: string }> = [
  { id: "RUB", label: "RUB ₽" },
  { id: "KRW", label: "KRW ₩" },
  { id: "USD", label: "USD $" },
];

export default function DashboardFilters({ initialParams }: { initialParams: DashboardParams }) {
  const router = useRouter();
  const sp = useSearchParams();
  const [pending, startTransition] = useTransition();

  const params = useMemo<DashboardParams>(() => {
    // Берём текущее из URL, иначе — initialParams с сервера
    return {
      period: (sp.get("period") ?? initialParams.period) as DashboardPeriod,
      channel: (sp.get("channel") ?? initialParams.channel) as DashboardChannel,
      location: (sp.get("location") ?? initialParams.location) as DashboardLocation,
      currency: (sp.get("currency") ?? initialParams.currency) as DashboardCurrency,
    };
  }, [sp, initialParams]);

  const setParam = (k: keyof DashboardParams, v: string) => {
    const next = new URLSearchParams(Array.from(sp.entries()));
    next.set(k, v);
    startTransition(() => {
      router.replace(`?${next.toString()}`, { scroll: false });
    });
  };

  return (
    <div className="grid gap-2 md:grid-cols-4">
      {/* Период — в виде чипов */}
      <label className="grid gap-1">
        <span className="text-xs opacity-70">Период</span>
        <div className="flex flex-wrap gap-2">
          {PERIODS.map((p) => (
            <button
              key={p.id}
              onClick={() => setParam("period", p.id)}
              className={T.chip}
              data-active={params.period === p.id}
              aria-pressed={params.period === p.id}
              disabled={pending}
            >
              {p.label}
            </button>
          ))}
        </div>
      </label>

      {/* Канал */}
      <label className="grid gap-1">
        <span className="text-xs opacity-70">Канал</span>
        <select
          value={params.channel}
          onChange={(e) => setParam("channel", e.target.value)}
          className={T.select}
          disabled={pending}
        >
          {CHANNELS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </label>

      {/* Локация */}
      <label className="grid gap-1">
        <span className="text-xs opacity-70">Локация</span>
        <select
          value={params.location}
          onChange={(e) => setParam("location", e.target.value)}
          className={T.select}
          disabled={pending}
        >
          {LOCATIONS.map((l) => (
            <option key={l.id} value={l.id}>
              {l.label}
            </option>
          ))}
        </select>
      </label>

      {/* Валюта */}
      <label className="grid gap-1">
        <span className="text-xs opacity-70">Валюта</span>
        <select
          value={params.currency}
          onChange={(e) => setParam("currency", e.target.value)}
          className={T.select}
          disabled={pending}
        >
          {CURRENCIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}