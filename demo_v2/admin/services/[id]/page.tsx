// app/demo/admin/services/[id]/page.tsx
"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname, useParams } from "next/navigation";
import ServiceHeader from "@/app/demo/admin/services/components/ServiceHeader";
import ServiceTabs from "@/app/demo/admin/services/components/ServiceTabs";

// Общий источник данных (для всех ролей)
import {
  ADMIN_SERVICES,
  SERVICE_CATEGORIES,
} from "@/app/demo/(shared)/data/services";

/* -------------------- утилиты -------------------- */

/** безопасно вытащить строковый id */
function coerceId(raw: unknown): string | null {
  if (typeof raw === "string" && raw.trim()) return raw;
  if (Array.isArray(raw) && raw[0]) return String(raw[0]);
  return null;
}

/** базовый префикс (admin/manager/user) из пути */
function getBaseFromPath(pathname: string | null) {
  if (!pathname) return "/demo/admin";
  if (pathname.startsWith("/demo/manager")) return "/demo/manager";
  if (pathname.startsWith("/demo/user")) return "/demo/user";
  return "/demo/admin";
}

/* -------------------- страница -------------------- */

export default function AdminServiceDetailPage() {
  const pathname = usePathname();
  const base = getBaseFromPath(pathname);

  const params = useParams<{ id?: string | string[] }>();
  const id = coerceId(params?.id);

  const service = useMemo(
    () => (id ? ADMIN_SERVICES.find((s) => s.id === id) : undefined),
    [id]
  );

  if (!id || !service) {
    return (
      <div className="grid gap-6">
        <header className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <nav className="text-xs text-white/60">
              <Link href={`${base}/services`} className="hover:underline break-words">
                Услуги
              </Link>
              <span className="mx-1">/</span>
              <span className="text-white/80">Не найдено</span>
            </nav>
            <h1 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight">
              Услуга не найдена
            </h1>
          </div>
          <Link
            href={`${base}/services`}
            className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
          >
            К хабу услуг
          </Link>
        </header>

        <section
          className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 text-sm text-white/70"
          aria-live="polite"
        >
          Проверьте ссылку или вернитесь к списку услуг.
        </section>
      </div>
    );
  }

  const category =
    SERVICE_CATEGORIES.find((c) => c.id === service.categoryId) || null;

  return (
    <div className="grid gap-6 overflow-x-hidden">
      {/* Крошки */}
      <nav className="text-xs text-white/60">
        <Link href={`${base}/services`} className="hover:underline break-words">
          Услуги
        </Link>
        <span className="mx-1">/</span>
        <span className="text-white/80 break-all">{service.name}</span>
      </nav>

      {/* Заголовок */}
      <ServiceHeader service={service} category={category} />

      {/* Вкладки */}
      <ServiceTabs service={service} categories={SERVICE_CATEGORIES} />

      {/* Низ страницы: переходы */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link
          href={`${base}/services`}
          className="text-sm text-white/70 hover:underline"
        >
          ← К хабу услуг
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`${base}/services/pricing`}
            className="text-sm rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 hover:bg-white/15"
          >
            Открыть прайс-лист
          </Link>
          <Link
            href={`${base}/services?category=${encodeURIComponent(service.categoryId || "")}`}
            className="text-sm rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 hover:bg-white/15"
            title={service.categoryId ? "Смотреть услуги в категории" : "Категория не указана"}
          >
            Смотреть в категории
          </Link>
        </div>
      </div>
    </div>
  );
}