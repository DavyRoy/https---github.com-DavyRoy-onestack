"use client";
import Link from "next/link";
import { ADMIN_CRM_PIPELINES } from "@/app/demo/(shared)/crm/data/pipelines.demo";

export default function PipelinesTable() {
  const rows = ADMIN_CRM_PIPELINES;

  // Моб. карточки
  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.03]">
      <div className="md:hidden grid gap-2 p-3">
        {rows.map(p => (
          <Link
            key={p.id}
            href={`/demo/admin/crm/pipelines/${p.id}`}
            className="rounded-xl border border-white/10 bg-white/[0.04] p-3"
          >
            <div className="font-medium">{p.name}</div>
            <div className="mt-1 text-xs text-white/60">
              {p.target} • этапов: {p.stages.length} • {p.active ? "активна" : "выкл."}
            </div>
          </Link>
        ))}
        {rows.length === 0 && (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-center text-white/60">
            Воронки не найдены.
          </div>
        )}
      </div>

      {/* Десктоп-таблица */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full table-fixed text-sm">
          <thead className="text-white/60">
            <tr className="border-b border-white/10">
              <th className="text-left p-3 w-[46%]">Воронка</th>
              <th className="text-left p-3 w-[18%]">Назначение</th>
              <th className="text-left p-3 w-[18%]">Этапов</th>
              <th className="text-left p-3 w-[18%]">Статус</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(p => (
              <tr key={p.id} className="border-b border-white/10 hover:bg-white/[0.04]">
                <td className="p-3">
                  <Link href={`/demo/admin/crm/pipelines/${p.id}`} className="font-medium hover:underline truncate block">
                    {p.name}
                  </Link>
                </td>
                <td className="p-3">{p.target}</td>
                <td className="p-3">{p.stages.length}</td>
                <td className="p-3">{p.active ? "Активна" : "Отключена"}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-white/60">Воронки не найдены.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}