// app/demo/admin/crm/clients/[id]/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

// Данные — единый демо-источник
import { ADMIN_CRM_CLIENTS } from "@/app/demo/(shared)/crm/data/clients.demo";

// Компоненты CRM (админ)
import ClientHeader from "@/app/demo/admin/crm/components/ClientHeader";
import ClientProfileForm from "@/app/demo/admin/crm/components/ClientProfileForm";
import ClientTagsCard from "@/app/demo/admin/crm/components/ClientTagsCard";
import ClientRelations from "@/app/demo/admin/crm/components/ClientRelations";
import { AuditStrip, DangerZone } from "@/app/demo/admin/crm/components/AuditStrip";

export default function AdminClientCardPage() {
  const router = useRouter();
  const params = useParams<{ id: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const c = ADMIN_CRM_CLIENTS.find((x) => x.id === id);

  if (!c) {
    return (
      <div className="grid gap-4">
        <div className="rounded-2xl border border-white/15 bg-white/[0.03] p-4">
          <div className="text-sm text-white/80">Клиент не найден.</div>
          <div className="mt-3 flex gap-2">
            <Link
              href="/demo/admin/crm/clients"
              className="rounded-lg border border-white/15 px-3 py-2 text-sm hover:bg-white/[0.06]"
            >
              К списку клиентов
            </Link>
            <button
              onClick={() => router.back()}
              className="rounded-lg border border-white/15 px-3 py-2 text-sm hover:bg-white/[0.06]"
            >
              Назад
            </button>
          </div>
        </div>
      </div>
    );
  }

  const subtitle =
    [
      c.email && `📧 ${c.email}`,
      c.phone && `📞 ${c.phone}`,
      c.city && `📍 ${c.city}`,
    ]
      .filter(Boolean)
      .join(" • ") || undefined;

  const rightSlot = (
    <div className="flex flex-wrap gap-2">
      {c.email && (
        <a
          href={`mailto:${c.email}`}
          className="rounded-lg border border-white/15 px-3 py-1.5 text-xs hover:bg-white/[0.06]"
        >
          Написать e-mail
        </a>
      )}
      {c.phone && (
        <a
          href={`tel:${c.phone}`}
          className="rounded-lg border border-white/15 px-3 py-1.5 text-xs hover:bg-white/[0.06]"
        >
          Позвонить
        </a>
      )}
      <Link
        href={`/demo/manager/booking/new?client=${encodeURIComponent(c.id)}`}
        className="rounded-lg border border-white/15 px-3 py-1.5 text-xs hover:bg-white/[0.06]"
      >
        Новая бронь
      </Link>
    </div>
  );

  return (
    <div className="grid gap-6">
      <ClientHeader
        title={`${c.name}${c.company ? ` — ${c.company}` : ""}`}
        subtitle={subtitle}
        rightSlot={rightSlot}
        backHref="/demo/admin/crm/clients"
      />

      {/* Сводка по клиенту */}
      <section className="rounded-2xl border border-white/15 bg-white/[0.03] p-3 md:p-4">
        <div className="grid gap-3 sm:grid-cols-3 text-sm">
          <div className="rounded-xl border border-white/10 p-3">
            <div className="text-white/60">Заказов</div>
            <div className="mt-1 text-lg font-semibold">{c.orders}</div>
          </div>
          <div className="rounded-xl border border-white/10 p-3">
            <div className="text-white/60">LTV</div>
            <div className="mt-1 text-lg font-semibold">₽ {c.ltv.toLocaleString("ru-RU")}</div>
          </div>
          <div className="rounded-xl border border-white/10 p-3">
            <div className="text-white/60">Последняя активность</div>
            <div className="mt-1 text-lg font-semibold">
              {c.lastActivityAt
                ? new Date(c.lastActivityAt).toLocaleDateString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })
                : "—"}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
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
          <ClientTagsCard
            tags={c.tags}
            // демо-редактирование
            onChange={(next) => alert("Демо: теги обновлены → " + next.join(", "))}
          />
          <ClientRelations id={c.id} />
          <div className="rounded-2xl border border-white/15 bg-white/[0.03] p-4">
            <div className="text-sm text-white/70 mb-2">Ответственный менеджер</div>
            <div className="text-sm">
              {c.managerId ? c.managerId.toUpperCase() : <span className="opacity-70">не назначен</span>}
            </div>
          </div>
          <DangerZone />
        </div>
      </div>
    </div>
  );
}