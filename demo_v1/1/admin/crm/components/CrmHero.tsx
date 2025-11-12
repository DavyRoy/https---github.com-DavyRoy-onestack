// app/demo/admin/crm/components/CrmHero.tsx
"use client";

import Link from "next/link";

export default function CrmHero() {
  return (
    <header className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5">
      <h1 className="text-2xl font-semibold">CRM (админ)</h1>
      <p className="text-white/70 mt-1">База клиентов, источники, воронки и сегменты.</p>

      <div className="mt-3 flex flex-wrap gap-2 text-sm">
        <Link
          href="/demo/admin/crm/clients"
          className="px-3 py-1 rounded-lg border border-white/20 hover:bg-white/10"
        >
          Клиенты
        </Link>
        <Link
          href="/demo/admin/crm/pipelines"
          className="px-3 py-1 rounded-lg border border-white/20 hover:bg-white/10"
        >
          Источники и воронки
        </Link>
        <Link
          href="/demo/admin/crm/segments"
          className="px-3 py-1 rounded-lg border border-white/20 hover:bg-white/10"
        >
          Сегменты
        </Link>
      </div>
    </header>
  );
}