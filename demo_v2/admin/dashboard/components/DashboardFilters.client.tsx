// app/demo/admin/dashboard/components/DashboardFilters.client.tsx
// CLIENT COMPONENT: единые фильтры для всех ролей (переиспользуемы).

"use client";

import { useCallback, useMemo, useState, useTransition, useId } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type {
  DashboardParams,
  DashboardPeriod,
  DashboardChannel,
  DashboardLocation,
  DashboardCurrency,
} from "../page";

const T = {
  input:
    "rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
  select:
    "rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
  chip:
    "rounded-xl px-3 py-1.5 text-sm border border-white/15 bg-white/10 hover:bg-white/15 data-[active=true]:bg-white data-[active=true]:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
  btnGhost:
    "rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
  btnWhite:
    "rounded-xl border border-white/15 bg-white px-3 py-2 text-xs font-medium text-black hover:bg-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
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

const ALLOWED = {
  period: new Set(PERIODS.map((x) => x.id)),
  channel: new Set(CHANNELS.map((x) => x.id)),
  location: new Set(LOCATIONS.map((x) => x.id)),
  currency: new Set(CURRENCIES.map((x) => x.id)),
} as const;

// только whitelisted ключи — чтобы не тащить мусорные параметры
const KEYS: Array<keyof DashboardParams> = ["period", "channel", "location", "currency"];

export default function DashboardFilters({ initialParams }: { initialParams: DashboardParams }) {
  const router = useRouter();
  const sp = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);
  const uid = useId();

  // Нормализация значения по whitelist; если в URL мусор — берём initialParams
  const coerce = useCallback(
    <K extends keyof DashboardParams>(
      key: K,
      allowed: Set<DashboardParams[K]>
    ): DashboardParams[K] => {
      const raw = sp.get(key as string);
      if (raw && (allowed as Set<string>).has(raw)) return raw as DashboardParams[K];
      return initialParams[key];
    },
    [sp, initialParams]
  );

  const params = useMemo<DashboardParams>(() => {
    return {
      period: coerce("period", ALLOWED.period),
      channel: coerce("channel", ALLOWED.channel),
      location: coerce("location", ALLOWED.location),
      currency: coerce("currency", ALLOWED.currency),
    };
  }, [coerce]);

  // Строим чистый URLSearchParams только из whitelisted ключей
  const buildParams = useCallback(
    (patch?: Partial<Record<keyof DashboardParams, string>>) => {
      const next = new URLSearchParams();
      next.set("period", (patch?.period ?? params.period) as string);
      next.set("channel", (patch?.channel ?? params.channel) as string);
      next.set("location", (patch?.location ?? params.location) as string);
      next.set("currency", (patch?.currency ?? params.currency) as string);
      return next;
    },
    [params]
  );

  // Обновление одного параметра (без лишних навигаций)
  const setParam = (k: keyof DashboardParams, v: string) => {
    if ((params as any)[k] === v) return; // значение не меняется — не дергаем роутер
    // игнорируем невалидные значения
    if (!ALLOWED[k as keyof typeof ALLOWED].has(v as any)) return;
    const next = buildParams({ [k]: v } as any);
    startTransition(() => {
      router.replace(`?${next.toString()}`, { scroll: false });
    });
  };

  // Сброс ко всем initialParams
  const resetAll = () => {
    const next = new URLSearchParams();
    next.set("period", initialParams.period);
    next.set("channel", initialParams.channel);
    next.set("location", initialParams.location);
    next.set("currency", initialParams.currency);
    startTransition(() => {
      router.replace(`?${next.toString()}`, { scroll: false });
    });
  };

  // Скопировать текущую ссылку с фильтрами (Web Share → Clipboard → prompt)
  const copyLink = async () => {
    const url = (() => {
      const p = buildParams();
      const base = typeof window !== "undefined" ? window.location.origin + window.location.pathname : "";
      return `${base}?${p.toString()}`;
    })();

    try {
      // 1) Web Share API
      // @ts-expect-error — navigator.share может быть не типизирован
      if (navigator?.share) {
        // @ts-expect-error
        await navigator.share({ url, title: "Фильтры дашборда" });
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
        return;
      }
    } catch {
      // noop — упадём на буфер обмена
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      return;
    } catch {
      // последний фоллбэк
      try {
        // eslint-disable-next-line no-alert
        window.prompt("Скопируйте ссылку:", url);
      } catch {}
    }
  };

  const ids = {
    channel: `df-channel-${uid}`,
    location: `df-location-${uid}`,
    currency: `df-currency-${uid}`,
  };

  return (
    <div
      className="grid gap-2 md:grid-cols-4"
      aria-live="polite"
      aria-busy={pending}
    >
      {/* Период — чипы */}
      <fieldset className="grid gap-1 min-w-0">
        <legend className="text-xs opacity-70">Период</legend>
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
      </fieldset>

      {/* Канал */}
      <label className="grid gap-1 min-w-0" htmlFor={ids.channel}>
        <span className="text-xs opacity-70">Канал</span>
        <select
          id={ids.channel}
          value={params.channel}
          onChange={(e) => setParam("channel", e.target.value)}
          className={T.select}
          disabled={pending}
          aria-label="Выбор канала"
        >
          {CHANNELS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </label>

      {/* Локация */}
      <label className="grid gap-1 min-w-0" htmlFor={ids.location}>
        <span className="text-xs opacity-70">Локация</span>
        <select
          id={ids.location}
          value={params.location}
          onChange={(e) => setParam("location", e.target.value)}
          className={T.select}
          disabled={pending}
          aria-label="Выбор локации"
        >
          {LOCATIONS.map((l) => (
            <option key={l.id} value={l.id}>
              {l.label}
            </option>
          ))}
        </select>
      </label>

      {/* Валюта */}
      <label className="grid gap-1 min-w-0" htmlFor={ids.currency}>
        <span className="text-xs opacity-70">Валюта</span>
        <select
          id={ids.currency}
          value={params.currency}
          onChange={(e) => setParam("currency", e.target.value)}
          className={T.select}
          disabled={pending}
          aria-label="Выбор валюты"
        >
          {CURRENCIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </label>

      {/* Действия (на узких экранах уйдут на вторую строку) */}
      <div className="md:col-span-4 flex flex-wrap items-center gap-2 pt-1">
        <button
          onClick={resetAll}
          className={T.btnGhost}
          disabled={pending}
          aria-label="Сбросить фильтры к значениям по умолчанию"
        >
          Сбросить
        </button>

        <button
          onClick={copyLink}
          className={T.btnWhite}
          disabled={pending}
          aria-live="polite"
          aria-label="Поделиться/скопировать ссылку с текущими фильтрами"
        >
          {copied ? "Ссылка скопирована" : "Поделиться ссылкой"}
        </button>

        {pending && <span className="text-xs text-white/70">Применение…</span>}
      </div>
    </div>
  );
}