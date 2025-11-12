"use client";

import React from "react";
import Link from "next/link";

type Role = {
  id: string;
  name: string;
  description: string;
  members: number;
};

export default function RolesTable({ rows }: { rows: Role[] }) {
  const [q, setQ] = React.useState("");
  const [sort, setSort] = React.useState<"name_asc" | "name_desc" | "members_desc" | "members_asc">(
    "name_asc"
  );

  const filtered = React.useMemo(() => {
    const x = q.trim().toLowerCase();
    const base = !x
      ? rows
      : rows.filter(
          (r) =>
            r.name.toLowerCase().includes(x) ||
            r.description.toLowerCase().includes(x)
        );

    const byName = (a: Role, b: Role) => a.name.localeCompare(b.name, "ru");
    const byMembers = (a: Role, b: Role) => a.members - b.members;

    switch (sort) {
      case "name_desc":
        return [...base].sort((a, b) => -byName(a, b));
      case "members_desc":
        return [...base].sort((a, b) => -byMembers(a, b));
      case "members_asc":
        return [...base].sort(byMembers);
      default:
        return [...base].sort(byName);
    }
  }, [rows, q, sort]);

  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-3 md:p-4 min-w-0">
      {/* Панель поиска/сортировки */}
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label htmlFor="roles-search" className="sr-only">
            Поиск ролей
          </label>
          <input
            id="roles-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Поиск: название или описание…"
            className="w-full sm:w-[280px] rounded-lg bg-white/5 border border-white/15 px-3 py-2 text-sm text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-white/20"
            role="searchbox"
          />
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="roles-sort" className="text-xs text-white/60">
            Сортировка
          </label>
          <select
            id="roles-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
            className="rounded-lg bg-white/5 border border-white/15 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-white/20"
          >
            <option value="name_asc">Имя A→Z</option>
            <option value="name_desc">Имя Z→A</option>
            <option value="members_desc">Участников ↓</option>
            <option value="members_asc">Участников ↑</option>
          </select>
        </div>
      </div>

      {/* Мобильные карточки */}
      <div className="grid gap-2 sm:hidden">
        {filtered.map((r) => (
          <Link
            key={r.id}
            href={`/demo/admin/users/roles/${r.id}`}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-3 hover:bg-white/[0.06] transition"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="font-medium truncate">{r.name}</div>
              <span className="text-xs text-white/60 shrink-0">
                {r.members}
              </span>
            </div>
            <div className="mt-1 text-xs text-white/70 break-words">{r.description}</div>
          </Link>
        ))}

        {filtered.length === 0 && (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center text-sm text-white/60">
            Ничего не найдено
          </div>
        )}
      </div>

      {/* Десктоп-таблица со скроллом внутри */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-[640px] w-full text-sm">
          <thead className="text-white/60 border-b border-white/10">
            <tr>
              <th className="text-left p-3 font-normal">Название</th>
              <th className="text-left p-3 font-normal">Описание</th>
              <th className="text-left p-3 font-normal">Участников</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr
                key={r.id}
                className={`border-b border-white/5 hover:bg-white/[0.03] transition-colors ${
                  i % 2 ? "bg-white/[0.02]" : ""
                }`}
              >
                <td className="p-3 whitespace-nowrap">
                  <Link
                    href={`/demo/admin/users/roles/${r.id}`}
                    className="text-white/90 underline underline-offset-2 hover:text-white"
                  >
                    {r.name}
                  </Link>
                </td>
                <td className="p-3 text-white/70 break-words">{r.description}</td>
                <td className="p-3 text-white/80">{r.members}</td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={3} className="p-4 text-center text-sm text-white/50 italic">
                  Ничего не найдено
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}