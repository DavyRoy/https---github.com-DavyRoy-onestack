"use client";

import React from "react";

type Member = {
  id: string;
  name: string;
  email: string;
};

export default function RoleMembersTable({ members }: { members: Member[] }) {
  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5">
      <div className="text-sm text-white/70 mb-3">Участники</div>

      {members.length === 0 ? (
        <div className="text-sm text-white/50 italic py-4 text-center">
          Нет участников в этой роли
        </div>
      ) : (
        <ul className="text-sm divide-y divide-white/10">
          {members.map((m) => (
            <li
              key={m.id}
              className="py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5"
            >
              <span className="font-medium truncate">{m.name}</span>
              <span className="text-white/60 text-xs sm:text-sm break-all">
                {m.email}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}