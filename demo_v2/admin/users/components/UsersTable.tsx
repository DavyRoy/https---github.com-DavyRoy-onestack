"use client";

import Link from "next/link";
import React from "react";

type UserRow = {
  id: string;
  name: string;
  email: string;
  roles: string[];
  status: "active" | "invited" | "blocked" | string;
  twoFA?: boolean;
  lastSeen?: string | null;
};

export default function UsersTable({ rows }: { rows: UserRow[] }) {
  const safe = Array.isArray(rows) ? rows : [];

  const statusBadge = (s: UserRow["status"]) => {
    if (s === "active") return "border-emerald-400/40 text-emerald-300";
    if (s === "invited") return "border-amber-400/40 text-amber-300";
    if (s === "blocked") return "border-rose-400/40 text-rose-300";
    return "border-white/20 text-white/70";
    // другие статусы пойдут в нейтральный
  };

  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] overflow-hidden min-w-0">
      {/* Мобильные карточки */}
      <div className="grid gap-2 p-3 sm:hidden">
        {safe.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center text-sm text-white/60">
            Пользователи не найдены.
          </div>
        ) : (
          safe.map((u) => (
            <Link
              key={u.id}
              href={`/demo/admin/users/list/${u.id}`}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-3 hover:bg-white/[0.06] transition block"
            >
              <div className="font-medium truncate">{u.name}</div>
              <div className="text-xs text-white/60 break-words">{u.email}</div>

              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                <span className={`px-2 py-0.5 rounded-md border ${statusBadge(u.status)}`}>
                  {u.status}
                </span>
                <span className="px-2 py-0.5 rounded-md border border-white/15 text-white/70">
                  {u.twoFA ? "2FA: да" : "2FA: нет"}
                </span>
                <span className="px-2 py-0.5 rounded-md border border-white/15 text-white/60">
                  {u.roles?.length ? u.roles.join(", ") : "ролей нет"}
                </span>
              </div>

              <div className="mt-1 text-xs text-white/50">
                Последний вход: {u.lastSeen ?? "—"}
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Десктоп-таблица с локальным скроллом */}
      <div className="overflow-x-auto w-full hidden sm:block">
        <table className="min-w-[720px] w-full text-sm">
          <caption className="sr-only">Таблица пользователей: имя, email, роли, статус, 2FA, последний вход</caption>
          <thead className="text-white/60 bg-white/[0.02]">
            <tr className="border-b border-white/10">
              <th scope="col" className="text-left p-3 whitespace-nowrap">Имя / Email</th>
              <th scope="col" className="text-left p-3 whitespace-nowrap">Роли</th>
              <th scope="col" className="text-left p-3 whitespace-nowrap">Статус</th>
              <th scope="col" className="text-left p-3 whitespace-nowrap">2FA</th>
              <th scope="col" className="text-left p-3 whitespace-nowrap">Последний вход</th>
            </tr>
          </thead>
          <tbody>
            {safe.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-sm text-white/60">
                  Пользователи не найдены.
                </td>
              </tr>
            ) : (
              safe.map((u) => (
                <tr
                  key={u.id}
                  className="border-t border-white/10 hover:bg-white/[0.04] transition"
                >
                  <td className="p-3 align-top">
                    <Link
                      href={`/demo/admin/users/list/${u.id}`}
                      className="block text-white hover:underline truncate max-w-[240px]"
                      title={u.name}
                    >
                      {u.name}
                    </Link>
                    <div
                      className="text-white/60 text-xs sm:text-sm truncate max-w-[280px]"
                      title={u.email}
                    >
                      {u.email}
                    </div>
                  </td>

                  <td className="p-3 align-top text-white/80">
                    <div className="max-w-[320px] break-words">
                      {u.roles?.length ? u.roles.join(", ") : "—"}
                    </div>
                  </td>

                  <td className="p-3 align-top">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-md border ${statusBadge(u.status)}`}
                    >
                      {u.status}
                    </span>
                  </td>

                  <td className="p-3 align-top">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-md border ${
                        u.twoFA
                          ? "border-emerald-400/30 text-emerald-300"
                          : "border-white/20 text-white/60"
                      }`}
                      aria-label={u.twoFA ? "Двухфакторная аутентификация включена" : "Двухфакторная аутентификация не включена"}
                    >
                      {u.twoFA ? "вкл." : "нет"}
                    </span>
                  </td>

                  <td className="p-3 align-top text-white/60 whitespace-nowrap">
                    {u.lastSeen ?? "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}