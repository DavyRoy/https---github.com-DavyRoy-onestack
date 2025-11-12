"use client";

import { ListFilter, Filter } from "lucide-react";
import { T } from "./tokens";

export default function CalendarFiltersBar({
  q, setQ,
  status, setStatus,
  source, setSource,
  staff, setStaff,
  reset,
}: {
  q: string; setQ: (v: string) => void;
  status: string; setStatus: (v: string) => void;
  source: string; setSource: (v: string) => void;
  staff: string; setStaff: (v: string) => void;
  reset: () => void;
}) {
  return (
    <section className={`${T.card} px-3 sm:px-4`}>
      <div
        className="
          flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 sm:gap-3
        "
      >
        {/* Поле поиска */}
        <div className="relative flex-1 min-w-[180px] sm:min-w-[240px]">
          <input
            className={`${T.input} pl-8 h-[42px] sm:h-[38px]`}
            placeholder="Поиск (клиент, комментарий)…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Поиск по клиенту или комментарию"
          />
          <ListFilter
            width={18}
            height={18}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 opacity-70 pointer-events-none"
          />
        </div>

        {/* Статус */}
        <select
          className={`${T.input} h-[42px] sm:h-[38px] w-full sm:w-auto`}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          aria-label="Фильтр по статусу"
        >
          <option value="">Статус: все</option>
          <option value="new">Новый</option>
          <option value="pending">Ожидает</option>
          <option value="confirmed">Подтв.</option>
          <option value="completed">Состоялся</option>
          <option value="cancelled">Отменён</option>
          <option value="noshow">Не явился</option>
          <option value="rescheduled">Перенесён</option>
        </select>

        {/* Источник */}
        <select
          className={`${T.input} h-[42px] sm:h-[38px] w-full sm:w-auto`}
          value={source}
          onChange={(e) => setSource(e.target.value)}
          aria-label="Фильтр по источнику"
        >
          <option value="">Источник: все</option>
          <option value="online">Online</option>
          <option value="manager">Manager</option>
          <option value="phone">Phone</option>
        </select>

        {/* Сотрудник */}
        <select
          className={`${T.input} h-[42px] sm:h-[38px] w-full sm:w-auto`}
          value={staff}
          onChange={(e) => setStaff(e.target.value)}
          aria-label="Фильтр по сотруднику"
        >
          <option value="">Сотрудник: все</option>
          <option value="st-1">Мария</option>
          <option value="st-2">Ирина</option>
          <option value="st-3">Сергей</option>
        </select>

        {/* Кнопка сброса */}
        <button
          type="button"
          className={`${T.btn} w-full sm:w-auto justify-center min-h-[42px] sm:min-h-[38px] active:scale-[0.98] transition`}
          onClick={reset}
          aria-label="Сбросить фильтры"
        >
          <Filter width={16} height={16} /> Сбросить
        </button>
      </div>

      {/* Мобильная подсказка */}
      <div className="mt-2 text-xs text-white/60 sm:hidden text-center">
        Используйте прокрутку, чтобы увидеть все фильтры
      </div>
    </section>
  );
}