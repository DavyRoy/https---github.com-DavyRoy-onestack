"use client";

import React from "react";

type ActivityItem = {
  id: string;
  ts: string;   // ISO/или человекочитаемая строка — не форматируем во избежание mismatch
  text: string;
};

export default function UserActivityCard({ userId }: { userId: string }) {
  // демо-данные (в реальном проекте — запрос по userId)
  const items: ActivityItem[] = [
    { id: "a1", ts: "2025-01-10 10:10", text: "Вход в систему" },
    { id: "a2", ts: "2025-01-08 12:40", text: "Изменение профиля" },
    // Можно добавить больше пунктов для теста пагинации
  ];

  const [expanded, setExpanded] = React.useState(false);
  const VISIBLE = 5;
  const hasMore = items.length > VISIBLE;
  const shown = expanded ? items : items.slice(0, VISIBLE);

  const toggle = () => setExpanded((v) => !v);

  return (
    <section
      className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5 min-w-0"
      aria-labelledby="activity-title"
    >
      <div className="flex items-center justify-between gap-2 mb-3 min-w-0">
        <div className="text-sm text-white/70" id="activity-title">
          Активность
        </div>
        {/* Мета: просто отображаем userId компактно, если длинный */}
        <div className="text-[11px] text-white/40 truncate max-w-[50%]" title={userId}>
          ID: {userId}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-sm text-white/50 italic text-center py-4">
          Активность не найдена
        </div>
      ) : (
        <>
          <ul className="text-sm divide-y divide-white/10 min-w-0">
            {shown.map((i) => (
              <li
                key={i.id}
                className="py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 min-w-0"
              >
                <span className="text-white/60 text-xs sm:text-sm whitespace-nowrap">
                  {i.ts}
                </span>
                <span className="text-white/90 break-words">{i.text}</span>
              </li>
            ))}
          </ul>

          {hasMore && (
            <div className="mt-3 flex justify-center">
              <button
                type="button"
                onClick={toggle}
                className="rounded-lg border border-white/20 px-3 py-1.5 text-xs text-white/80 hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-white/30"
                aria-expanded={expanded}
                aria-controls="activity-list-more"
              >
                {expanded ? "Показать меньше" : `Показать ещё (${items.length - VISIBLE})`}
              </button>
            </div>
          )}
          {/* Контейнер для a11y (ID упомянут в aria-controls); визуально не обязателен */}
          <div id="activity-list-more" className="sr-only">
            {expanded ? "Расширенный список активности открыт" : "Расширенный список активности скрыт"}
          </div>
        </>
      )}
    </section>
  );
}