// app/demo/admin/crm/pipelines/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import PipelineEditor from "@/app/demo/admin/crm/components/PipelineEditor";

export default function AdminPipelineCardPage() {
  const params = useParams<{ id: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  if (!id) {
    return (
      <div className="rounded-xl border border-white/15 bg-white/[0.03] p-4 text-white/70">
        Некорректный идентификатор воронки.
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <header>
        <h1 className="text-2xl font-semibold">Воронка</h1>
        <p className="text-white/60 text-sm mt-1">
          Редактор этапов и правил продаж (демо).
        </p>
      </header>

      <PipelineEditor id={id} />
    </div>
  );
}