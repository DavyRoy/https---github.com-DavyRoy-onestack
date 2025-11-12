"use client";

import Link from "next/link";

export default function UsersTable({ rows }: { rows: any[] }) {
  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] overflow-hidden min-w-0">
      {/* Горизонтальный скролл только внутри таблицы */}
      <div className="overflow-x-auto w-full">
        <table className="min-w-[720px] w-full text-sm">
          <thead className="text-white/60 bg-white/[0.02]">
            <tr className="border-b border-white/10">
              <th className="text-left p-3 whitespace-nowrap">Имя / Email</th>
              <th className="text-left p-3 whitespace-nowrap">Роли</th>
              <th className="text-left p-3 whitespace-nowrap">Статус</th>
              <th className="text-left p-3 whitespace-nowrap">2FA</th>
              <th className="text-left p-3 whitespace-nowrap">Последний вход</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr
                key={u.id}
                className="border-t border-white/10 hover:bg-white/[0.04] transition"
              >
                <td className="p-3 align-top">
                  <Link
                    href={`/demo/admin/users/list/${u.id}`}
                    className="block text-white hover:underline truncate max-w-[160px] sm:max-w-none"
                  >
                    {u.name}
                  </Link>
                  <div className="text-white/60 text-xs sm:text-sm truncate max-w-[180px] sm:max-w-none">
                    {u.email}
                  </div>
                </td>

                <td className="p-3 align-top text-white/80">
                  {u.roles.join(", ") || "—"}
                </td>

                <td className="p-3 align-top">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-md border ${
                      u.status === "active"
                        ? "border-emerald-400/40 text-emerald-300"
                        : "border-white/20 text-white/60"
                    }`}
                  >
                    {u.status}
                  </span>
                </td>

                <td className="p-3 align-top text-center text-white/80">
                  {u.twoFA ? "✅" : "—"}
                </td>

                <td className="p-3 align-top text-white/60 whitespace-nowrap">
                  {u.lastSeen ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}