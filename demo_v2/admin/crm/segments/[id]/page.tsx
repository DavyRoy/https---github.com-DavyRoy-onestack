// app/demo/admin/crm/segments/[id]/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ADMIN_CRM_SEGMENTS } from "@/app/demo/admin/crm/data/mockAdminCrmSegments";
import { SegmentEditor, SegmentPreview } from "@/app/demo/admin/crm/components/SegmentEditor";
import { AuditStrip, DangerZone } from "@/app/demo/admin/crm/components/AuditStrip";

/* ---------- badges / helpers ---------- */
function TypeBadge({ v }: { v?: string }) {
  const map: Record<string, string> = {
    tag: "Тег",
    static: "Статический",
    dynamic: "Динамический",
  };
  return (
    <span className="rounded px-2 py-0.5 text-xs bg-white/10">
      {v ? map[v] ?? v : "—"}
    </span>
  );
}
function StatusBadge({ active }: { active?: boolean }) {
  return (
    <span
      className={`rounded px-2 py-0.5 text-xs ${
        active ? "bg-emerald-400/15 text-emerald-300" : "bg-white/10 text-white/70"
      }`}
    >
      {active ? "Активен" : "Отключён"}
    </span>
  );
}
function MetaItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between sm:block">
      <div className="text-white/60">{label}</div>
      <div className="mt-0.5 sm:mt-1 text-sm">{children}</div>
    </div>
  );
}

export default function AdminSegmentCardPage() {
  const router = useRouter();
  const params = useParams<{ id: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const segment = ADMIN_CRM_SEGMENTS.find((s) => s.id === id);

  if (!segment) {
    return (
      <div className="grid gap-6">
        <header className="flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-semibold">Сегмент не найден</h1>
          <Link
            href="/demo/admin/crm/segments"
            className="rounded-xl border border-white/15 px-3 py-2 hover:bg-white/[0.06]"
          >
            К списку сегментов
          </Link>
        </header>
        <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 text-white/70">
          Проверьте URL или вернитесь к списку.
        </section>
      </div>
    );
  }

  const updatedAt = (segment as any).updatedAt
    ? new Date((segment as any).updatedAt)
    : null;

  return (
    <div className="grid gap-6">
      {/* Header */}
      <header className="rounded-2xl border border-white/15 bg-white/[0.05] px-4 py-3 md:px-5 md:py-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <nav className="text-xs text-white/60">
              <Link href="/demo/admin/crm" className="hover:underline">
                CRM
              </Link>
              <span className="mx-1 opacity-50">/</span>
              <Link href="/demo/admin/crm/segments" className="hover:underline">
                Сегменты
              </Link>
              <span className="mx-1 opacity-50">/</span>
              <span className="text-white/80 truncate inline-block max-w-[60vw] align-bottom">
                {segment.name}
              </span>
            </nav>
            <h1 className="mt-1 text-lg md:text-xl font-semibold truncate">{segment.name}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-white/70">
              <TypeBadge v={(segment as any).type} />
              <StatusBadge active={(segment as any).active ?? true} />
              {updatedAt && (
                <span className="rounded px-2 py-0.5 bg-white/10">
                  Обновлён: {updatedAt.toLocaleString("ru-RU")}
                </span>
              )}
            </div>
          </div>
          <div className="shrink-0 flex gap-2">
            <Link
              href="/demo/admin/crm/segments"
              className="rounded-xl border border-white/15 px-3 py-2 hover:bg-white/[0.06] text-sm"
            >
              К списку
            </Link>
            <button
              onClick={() => alert("Сохранено (демо)")}
              className="rounded-xl border border-emerald-400/40 bg-emerald-500/20 hover:bg-emerald-500/30 px-3 py-2 text-sm"
            >
              Сохранить
            </button>
          </div>
        </div>
      </header>

      {/* Meta card */}
      <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
          <MetaItem label="ID">
            <code className="text-white/90">{segment.id}</code>
          </MetaItem>
          <MetaItem label="Тип">
            <span className="inline-block"><TypeBadge v={(segment as any).type} /></span>
          </MetaItem>
          <MetaItem label="Размер">
            {(segment as any).size !== undefined ? (segment as any).size : "—"}
          </MetaItem>
          <MetaItem label="Статус">
            <span className="inline-block"><StatusBadge active={(segment as any).active ?? true} /></span>
          </MetaItem>
        </div>
        {(segment as any).description && (
          <div className="mt-3 text-sm text-white/70">
            {(segment as any).description}
          </div>
        )}
      </section>

      {/* Content */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Left column */}
        <div className="md:col-span-2 grid gap-4">
          <SegmentEditor />
          <AuditStrip />
        </div>

        {/* Right column */}
        <div className="grid gap-4">
          <SegmentPreview />
          <DangerZone />
          <button
            onClick={() => router.push("/demo/admin/crm/segments")}
            className="rounded-lg border border-white/15 px-3 py-2 text-sm hover:bg-white/[0.06]"
          >
            ← Назад к сегментам
          </button>
        </div>
      </div>
    </div>
  );
}