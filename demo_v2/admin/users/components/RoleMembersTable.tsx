"use client";

import React from "react";
import { Mail, Copy } from "lucide-react";

type Member = {
  id: string;
  name: string;
  email: string;
};

export default function RoleMembersTable({ members }: { members: Member[] }) {
  const [q, setQ] = React.useState("");

  const filtered = React.useMemo(() => {
    const x = q.trim().toLowerCase();
    if (!x) return members;
    return members.filter(
      (m) =>
        m.name.toLowerCase().includes(x) ||
        m.email.toLowerCase().includes(x)
    );
  }, [q, members]);

  const copyEmail = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      alert("E-mail скопирован");
    } catch {
      // Фолбэк без гидрации/рандома
      prompt("Скопируйте e-mail вручную:", email);
    }
  };

  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5 min-w-0">
      {/* Заголовок + поиск */}
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-white/70">
          Участники{" "}
          <span className="ml-1 rounded-md border border-white/15 px-1.5 py-0.5 text-xs text-white/60">
            {filtered.length}/{members.length}
          </span>
        </div>

        <div className="w-full sm:w-auto">
          <label className="sr-only" htmlFor="members-search">Поиск участников</label>
          <input
            id="members-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Поиск: имя или e-mail"
            className="w-full sm:min-w-[220px] rounded-lg bg-white/5 border border-white/15 px-3 py-2 text-sm text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-white/20"
            role="searchbox"
          />
        </div>
      </div>

      {/* Пусто */}
      {filtered.length === 0 ? (
        <div className="text-sm text-white/50 italic py-6 text-center rounded-xl border border-white/10 bg-white/[0.03]">
          Совпадений не найдено
        </div>
      ) : (
        <>
          {/* Мобильный список (карточки) */}
          <ul className="sm:hidden grid gap-2">
            {filtered.map((m) => (
              <li
                key={m.id}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-3"
              >
                <div className="font-medium truncate">{m.name}</div>
                <div className="text-xs text-white/60 break-all">{m.email}</div>

                <div className="mt-2 flex items-center gap-2">
                  <a
                    href={`mailto:${m.email}`}
                    className="inline-flex items-center gap-1 rounded-md border border-white/20 px-2 py-1 text-xs hover:bg-white/10"
                    aria-label={`Написать ${m.email}`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Mail
                  </a>
                  <button
                    type="button"
                    onClick={() => copyEmail(m.email)}
                    className="inline-flex items-center gap-1 rounded-md border border-white/20 px-2 py-1 text-xs hover:bg-white/10"
                    aria-label={`Скопировать ${m.email}`}
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Десктоп-таблица со скроллом внутри */}
          <div className="hidden sm:block -mx-2 md:mx-0 overflow-x-auto">
            <table className="min-w-[520px] w-full text-sm px-2 md:px-0">
              <thead className="text-white/60">
                <tr className="border-b border-white/10">
                  <th className="text-left p-2 md:p-3">Имя</th>
                  <th className="text-left p-2 md:p-3">E-mail</th>
                  <th className="text-right p-2 md:p-3">Действия</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m, i) => (
                  <tr
                    key={m.id}
                    className={`border-b border-white/8 hover:bg-white/[0.03] ${
                      i % 2 ? "bg-white/[0.02]" : ""
                    }`}
                  >
                    <td className="p-2 md:p-3 align-middle">
                      <div className="font-medium truncate">{m.name}</div>
                    </td>
                    <td className="p-2 md:p-3 align-middle">
                      <div className="text-white/70 break-all">{m.email}</div>
                    </td>
                    <td className="p-2 md:p-3 align-middle text-right">
                      <div className="inline-flex flex-wrap gap-2 justify-end">
                        <a
                          href={`mailto:${m.email}`}
                          className="inline-flex items-center gap-1 rounded-md border border-white/20 px-2 py-1 text-xs hover:bg-white/10"
                          aria-label={`Написать ${m.email}`}
                        >
                          <Mail className="w-3.5 h-3.5" />
                          Mail
                        </a>
                        <button
                          type="button"
                          onClick={() => copyEmail(m.email)}
                          className="inline-flex items-center gap-1 rounded-md border border-white/20 px-2 py-1 text-xs hover:bg-white/10"
                          aria-label={`Скопировать ${m.email}`}
                        >
                          <Copy className="w-3.5 h-3.5" />
                          Copy
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}