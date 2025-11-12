// app/demo/admin/crm/segments/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { ADMIN_CRM_SEGMENTS } from "@/app/demo/admin/crm/data/mockAdminCrmSegments";
import { SegmentEditor, SegmentPreview } from "@/app/demo/admin/crm/components/SegmentEditor";
import { AuditStrip, DangerZone } from "@/app/demo/admin/crm/components/AuditStrip";

export default function AdminSegmentCardPage() {
  const params = useParams<{ id: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const segment = ADMIN_CRM_SEGMENTS.find((s) => s.id === id);

  if (!segment) {
    return (
      <div className="rounded-xl border border-white/15 bg-white/[0.03] p-4 text-white/70">
        Сегмент не найден.
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {/* Заголовок */}
      <header>
        <h1 className="text-2xl md:text-3xl font-semibold">{segment.name}</h1>
        <p className="text-white/60 text-sm mt-1">
          Редактирование сегмента и правил фильтрации (демо).
        </p>
      </header>

      {/* Контент */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Левая колонка */}
        <div className="md:col-span-2 grid gap-4">
          <SegmentEditor />
          <AuditStrip />
        </div>

        {/* Правая колонка */}
        <div className="grid gap-4">
          <SegmentPreview />
          <DangerZone />
        </div>
      </div>
    </div>
  );
}