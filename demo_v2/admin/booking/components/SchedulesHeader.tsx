// app/demo/admin/booking/components/SchedulesHeader.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, CalendarDays, Plus } from "lucide-react";

export type SchedulesHeaderValue = {
  weekStart: string;         // ISO YYYY-MM-DD, понедельник
  serviceId?: string;
  resourceId?: string;
  locationId?: string;
  policyId?: string;
};

type Props = {
  value: SchedulesHeaderValue;
  onChange?: (next: SchedulesHeaderValue) => void;
  onCreateTemplate?: () => void;
  onCreateException?: () => void;
  onExport?: () => void;
};

/* ---------- helpers ---------- */

function addDaysISO(iso: string, days: number) {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function startOfWeekISO(iso?: string) {
  const base = iso ? new Date(`${iso}T00:00:00`) : new Date();
  const d = new Date(base);
  // Перевод к понедельнику (0=воскресенье → 6; 1=понедельник → 0)
  const day = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - day);
  return d.toISOString().slice(0, 10);
}

export default function SchedulesHeader({
  value,
  onChange,
  onCreateTemplate,
  onCreateException,
  onExport,
}: Props) {
  // безопасный эмиттер
  const emit = React.useCallback(
    (next: SchedulesHeaderValue) => {
      onChange?.(next);
    },
    [onChange]
  );

  // дефолтные значения
  const weekStart = value?.weekStart ? startOfWeekISO(value.weekStart) : startOfWeekISO();
  const safeValue: SchedulesHeaderValue = {
    weekStart,
    serviceId: value?.serviceId,
    resourceId: value?.resourceId,
    locationId: value?.locationId,
    policyId: value?.policyId,
  };

  // Навигация по неделям
  const go = (deltaDays: number) => emit({ ...safeValue, weekStart: addDaysISO(weekStart, deltaDays) });
  const goToday = () => emit({ ...safeValue, weekStart: startOfWeekISO() });

  const handleField =
    (field: keyof SchedulesHeaderValue) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      emit({ ...safeValue, [field]: e.target.value || undefined });
    };

  return (
    <section className="admin-section border-white/12 bg-white/8 p-3 md:p-4 grid gap-3">
      {/* Верхняя строка: заголовок + навигация по неделям */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <CalendarDays className="w-5 h-5 opacity-80 shrink-0" aria-hidden="true" />
          <h2 className="text-base md:text-lg font-semibold truncate">Расписания</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => go(-7)}
            className="rounded-lg border border-white/15 px-2 py-1 hover:bg-white/[0.06]"
            aria-label="Предыдущая неделя"
            title="Предыдущая неделя"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={goToday}
            className="rounded-lg border border-white/15 px-3 py-1 hover:bg-white/[0.06]"
            title="Перейти к текущей неделе"
          >
            Сегодня
          </button>
          <button
            type="button"
            onClick={() => go(7)}
            className="rounded-lg border border-white/15 px-2 py-1 hover:bg-white/[0.06]"
            aria-label="Следующая неделя"
            title="Следующая неделя"
          >
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Поля фильтров — аккуратная сетка, дружелюбная к мобильным */}
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        <label className="grid gap-1">
          <span className="text-xs text-white/60">Неделя с (Пн)</span>
          <input
            type="date"
            value={weekStart}
            onChange={(e) => emit({ ...safeValue, weekStart: startOfWeekISO(e.target.value) })}
            className="rounded-lg bg-transparent border border-white/15 px-2 py-2"
            aria-label="Начальная дата недели"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-xs text-white/60">Услуга</span>
          <input
            placeholder="service id (демо)"
            value={safeValue.serviceId ?? ""}
            onChange={handleField("serviceId")}
            className="rounded-lg bg-transparent border border-white/15 px-2 py-2"
            aria-label="Фильтр по услуге"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-xs text-white/60">Ресурс</span>
          <input
            placeholder="resource id (демо)"
            value={safeValue.resourceId ?? ""}
            onChange={handleField("resourceId")}
            className="rounded-lg bg-transparent border border-white/15 px-2 py-2"
            aria-label="Фильтр по ресурсу"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-xs text-white/60">Локация</span>
          <input
            placeholder="location id (демо)"
            value={safeValue.locationId ?? ""}
            onChange={handleField("locationId")}
            className="rounded-lg bg-transparent border border-white/15 px-2 py-2"
            aria-label="Фильтр по локации"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-xs text-white/60">Политика</span>
          <input
            placeholder="policy id (демо)"
            value={safeValue.policyId ?? ""}
            onChange={handleField("policyId")}
            className="rounded-lg bg-transparent border border-white/15 px-2 py-2"
            aria-label="Фильтр по политике"
          />
        </label>
      </div>

      {/* Действия */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onCreateTemplate}
          disabled={!onCreateTemplate}
          className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-500/20 px-3 py-2 hover:bg-emerald-500/30 disabled:opacity-50"
          title={onCreateTemplate ? "Создать шаблон" : "Действие недоступно"}
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          Создать шаблон
        </button>

        <button
          type="button"
          onClick={onCreateException}
          disabled={!onCreateException}
          className="rounded-xl border border-amber-400/40 bg-amber-500/20 px-3 py-2 hover:bg-amber-500/30 disabled:opacity-50"
          title={onCreateException ? "Добавить исключение" : "Действие недоступно"}
        >
          Добавить исключение
        </button>

        <button
          type="button"
          onClick={onExport}
          disabled={!onExport}
          className="rounded-xl border border-white/15 px-3 py-2 hover:bg-white/[0.06] disabled:opacity-50"
          title={onExport ? "Экспорт (CSV/ICS, демо)" : "Действие недоступно"}
        >
          Экспорт (CSV/ICS, демо)
        </button>

        <div className="ml-auto flex items-center gap-2 text-sm">
          <Link
            href="/demo/admin/calendar?view=week"
            className="rounded-lg border border-white/15 px-3 py-1.5 hover:bg-white/[0.06]"
          >
            Общий календарь
          </Link>
          <Link
            href="/demo/admin/booking/schedules/templates"
            className="rounded-lg border border-white/15 px-3 py-1.5 hover:bg-white/[0.06]"
          >
            Шаблоны
          </Link>
          <Link
            href="/demo/admin/booking/schedules/exceptions"
            className="rounded-lg border border-white/15 px-3 py-1.5 hover:bg-white/[0.06]"
          >
            Исключения
          </Link>
        </div>
      </div>
    </section>
  );
}