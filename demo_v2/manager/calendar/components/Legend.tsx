"use client";

import { T } from "./tokens";

export default function Legend() {
  const Item = ({ label, color }: { label: string; color: string }) => (
    <div role="listitem" className="flex items-center gap-2">
      <span
        className={`inline-block h-2.5 w-2.5 rounded-full ${color}`}
        aria-hidden="true"
      />
      <span className="text-xs text-white/80">{label}</span>
    </div>
  );

  return (
    <section
      className={`${T.soft} text-sm`}
      aria-label="Легенда статусов записей"
      role="list"
    >
      <div
        className="
          grid grid-cols-2 sm:flex sm:flex-wrap sm:items-center
          gap-x-6 gap-y-3 sm:gap-4
        "
      >
        <Item label="Новая" color="bg-blue-400" />
        <Item label="Ожидает" color="bg-yellow-400" />
        <Item label="Подтверждена" color="bg-emerald-400" />
        <Item label="Состоялась" color="bg-emerald-500" />
        <Item label="Отменена" color="bg-red-400" />
        <Item label="Перенесена" color="bg-purple-400" />
      </div>
    </section>
  );
}