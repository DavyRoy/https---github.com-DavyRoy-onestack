// app/demo/admin/booking/policies/new/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PoliciesForm from "@/app/demo/admin/booking/components/PoliciesForm";

export default function AdminPolicyNewPage() {
  const router = useRouter();

  return (
    <div className="grid gap-6">
      {/* Header */}
      <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="text-xs text-white/60">Политики</div>
          <h1 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight">Новая политика</h1>
          <p className="mt-1 text-sm text-white/70">
            Создайте правило отмены, предоплаты, lead-time, буферов или овербукинга.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/demo/admin/booking/policies"
            className="rounded-xl border border-white/15 px-3 py-2 hover:bg-white/[0.06] text-sm"
          >
            К списку
          </Link>
        </div>
      </header>

      {/* Form */}
      <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4">
        <PoliciesForm
          onSaved={(id) => router.push(`/demo/admin/booking/policies/${id}`)}
        />
        <div className="mt-3 text-xs text-white/50">
          Подсказка: поле <b>Уровень применения</b> определяет, где действует политика (на всю
          организацию, локацию, категорию, конкретную услугу или ресурс).
        </div>
      </section>
    </div>
  );
}