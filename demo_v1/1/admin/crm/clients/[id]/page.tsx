// app/demo/admin/crm/clients/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";

// Данные — из общего CRM-индекса
import { ADMIN_CRM_CLIENTS } from "@/app/demo/(shared)/crm";

// Компоненты — из локальной папки админ-CRM
import ClientHeader from "@/app/demo/admin/crm/components/ClientHeader";
import ClientProfileForm from "@/app/demo/admin/crm/components/ClientProfileForm";
import ClientTagsCard from "@/app/demo/admin/crm/components/ClientTagsCard";
import ClientRelations from "@/app/demo/admin/crm/components/ClientRelations";
import { AuditStrip, DangerZone } from "@/app/demo/admin/crm/components/AuditStrip";

export default function AdminClientCardPage() {
  const params = useParams<{ id: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const c = ADMIN_CRM_CLIENTS.find((x) => x.id === id);
  if (!c) {
    return (
      <div className="rounded-xl border border-white/15 bg-white/[0.03] p-4 text-white/70">
        Клиент не найден
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <ClientHeader title={`${c.name}${c.company ? ` — ${c.company}` : ""}`} />

      <div className="grid md:grid-cols-3 gap-4">
        {/* Левая колонка */}
        <div className="md:col-span-2 grid gap-4">
          <ClientProfileForm
            initial={{
              name: c.name,
              email: c.email,
              phone: c.phone,
              company: c.company,
            }}
          />
          <AuditStrip />
        </div>

        {/* Правая колонка */}
        <div className="grid gap-4">
          <ClientTagsCard tags={c.tags} />
          <ClientRelations id={c.id} />
          <DangerZone />
        </div>
      </div>
    </div>
  );
}