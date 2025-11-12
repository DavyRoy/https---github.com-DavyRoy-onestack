// app/demo/admin/booking/schedules/resources/new/page.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ResourceForm from "@/app/demo/admin/booking/components/ResourceForm";

export default function AdminResourceNewPage() {
  const router = useRouter();

  return (
    <div className="grid gap-6">
      {/* Header */}
      <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="text-xs text-white/60">Расписания • Ресурсы</div>
          <h1 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight">
            Новый ресурс
          </h1>
          <p className="mt-1 text-sm text-white/70 max-w-lg">
            Создайте новый ресурс (сотрудника, кабинет или оборудование) для
            последующего использования в шаблонах расписаний.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/demo/admin/booking/schedules/resources"
            className="rounded-xl border border-white/15 px-3 py-2 hover:bg-white/[0.06]"
          >
            К списку ресурсов
          </Link>
          <Link
            href="/demo/admin/booking/schedules"
            className="rounded-xl border border-white/15 px-3 py-2 hover:bg-white/[0.06]"
          >
            К расписаниям
          </Link>
        </div>
      </header>

      {/* Form */}
      <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5">
        <ResourceForm
          onSaved={(id) =>
            router.push(`/demo/admin/booking/schedules/resources/${id}`)
          }
        />
      </section>
    </div>
  );
}