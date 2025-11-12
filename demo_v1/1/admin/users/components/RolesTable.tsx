"use client";

import Link from "next/link";

type Role = {
  id: string;
  name: string;
  description: string;
  members: number;
};

export default function RolesTable({ rows }: { rows: Role[] }) {
  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-3 md:p-4 min-w-0">
      <div className="overflow-x-auto">
        <table className="min-w-[640px] w-full text-sm">
          <thead className="text-white/60 border-b border-white/10">
            <tr>
              <th className="text-left p-3 font-normal">Название</th>
              <th className="text-left p-3 font-normal">Описание</th>
              <th className="text-left p-3 font-normal">Участников</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.id}
                className="border-b border-white/5 hover:bg-white/[0.03] transition-colors"
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

            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="p-4 text-center text-sm text-white/50 italic"
                >
                  Нет доступных ролей
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}