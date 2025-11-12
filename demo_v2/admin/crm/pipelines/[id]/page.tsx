// app/demo/admin/crm/pipelines/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import PipelineEditor from "@/app/demo/admin/crm/components/PipelineEditor";
import { ADMIN_CRM_PIPELINES } from "@/app/demo/(shared)/crm/data/pipelines.demo";

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

  const p = ADMIN_CRM_PIPELINES.find((x) => x.id === id);

  if (!p) {
    return (
      <div className="grid gap-4">
        <div className="rounded-xl border border-white/15 bg-white/[0.03] p-4">
          <div className="text-white/80">Воронка не найдена</div>
          <div className="mt-3">
            <Link
              href="/demo/admin/crm/pipelines"
              className="rounded-lg border border-white/15 px-3 py-2 text-sm hover:bg-white/[0.06]"
            >
              К списку воронок
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {/* Header */}
      <header className="rounded-2xl border border-white/15 bg-white/[0.05] px-4 py-3 md:px-5 md:py-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <nav className="text-xs text-white/60">
              <Link href="/demo/admin/crm" className="hover:underline">
                CRM
              </Link>
              <span className="mx-1 opacity-50">/</span>
              <Link href="/demo/admin/crm/pipelines" className="hover:underline">
                Источники и воронки
              </Link>
              <span className="mx-1 opacity-50">/</span>
              <span className="text-white/80 truncate inline-block max-w-[60vw] align-bottom">
                {p.name}
              </span>
            </nav>
            <h1 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight truncate">
              {p.name}
            </h1>
            <p className="mt-1 text-sm text-white/70">
              Назначение: <span className="text-white/85">{p.target}</span>
              {p.active === false ? (
                <span className="ml-2 rounded px-2 py-0.5 text-xs bg-white/10 text-white/70">
                  Отключена
                </span>
              ) : (
                <span className="ml-2 rounded px-2 py-0.5 text-xs bg-emerald-400/15 text-emerald-300">
                  Активна
                </span>
              )}
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/demo/admin/crm/pipelines"
              className="rounded-lg border border-white/15 px-3 py-2 text-sm hover:bg-white/[0.06]"
            >
              К списку
            </Link>
            <button
              onClick={() => alert("Демо: экспорт настроек воронки")}
              className="rounded-lg border border-white/15 px-3 py-2 text-sm hover:bg-white/[0.06]"
            >
              Экспорт
            </button>
          </div>
        </div>
      </header>

      {/* Editor */}
      <PipelineEditor id={id} />
    </div>
  );
}