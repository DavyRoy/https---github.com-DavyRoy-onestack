"use client";

import { ROLES } from "@/app/demo/(shared)/users/roles/roles";

export default function UserRolesCard({ user }: { user: any }) {
  const all = ROLES;

  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5 min-w-0">
      <div className="text-sm text-white/70 mb-3">Роли</div>

      {/* Текущие роли */}
      {user.roles?.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {user.roles.map((r: string) => (
            <span
              key={r}
              className="text-xs px-2 py-1 rounded-full border border-white/20 bg-white/[0.03] text-white/80"
            >
              {r}
            </span>
          ))}
        </div>
      ) : (
        <div className="text-sm text-white/50 italic">Нет назначенных ролей</div>
      )}

      {/* Добавление новой роли */}
      <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <select className="w-full sm:w-auto bg-transparent border border-white/20 rounded-lg px-3 py-2 text-sm text-white/90">
          {all.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>

        <button className="w-full sm:w-auto rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/[0.08] transition">
          Добавить
        </button>
      </div>
    </section>
  );
}