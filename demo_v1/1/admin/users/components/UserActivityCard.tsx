"use client";

import React from "react";

type ActivityItem = {
  id: string;
  ts: string;
  text: string;
};

export default function UserActivityCard({ userId }: { userId: string }) {
  // демо-данные (в реальном проекте — запрос по userId)
  const items: ActivityItem[] = [
    { id: "a1", ts: "2025-01-10 10:10", text: "Вход в систему" },
    { id: "a2", ts: "2025-01-08 12:40", text: "Изменение профиля" },
  ];

  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5 min-w-0">
      <div className="text-sm text-white/70 mb-3">Активность</div>

      {items.length === 0 ? (
        <div className="text-sm text-white/50 italic text-center py-4">
          Активность не найдена
        </div>
      ) : (
        <ul className="text-sm divide-y divide-white/10">
          {items.map((i) => (
            <li
              key={i.id}
              className="py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1"
            >
              <span className="text-white/60 text-xs sm:text-sm whitespace-nowrap">
                {i.ts}
              </span>
              <span className="text-white/90">{i.text}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}