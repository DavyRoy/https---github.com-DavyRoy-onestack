// app/demo/admin/services/categories/[id]/page.tsx
"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { ADMIN_SERVICES, SERVICE_CATEGORIES } from "@/app/demo/(shared)/data/services";
import CategoryForm from "@/app/demo/admin/services/components/CategoryForm";

/** базовый префикс (admin/manager/user) из пути */
function getBaseFromPath(pathname: string | null) {
  if (!pathname) return "/demo/admin";
  if (pathname.startsWith("/demo/manager")) return "/demo/manager";
  if (pathname.startsWith("/demo/user")) return "/demo/user";
  return "/demo/admin";
}

/** безопасно привести id из catch-all */
function coerceId(raw: unknown): string | null {
  if (typeof raw === "string" && raw.trim()) return raw;
  if (Array.isArray(raw) && raw[0]) return String(raw[0]);
  return null;
}

export default function AdminServiceCategoryDetailPage() {
  const params = useParams<{ id?: string | string[] }>();
  const pathname = usePathname();
  const base = getBaseFromPath(pathname);

  const id = coerceId(params?.id);
  const cat = id ? SERVICE_CATEGORIES.find((c) => c.id === id) : undefined;

  if (!id) {
    return (
      <div className="grid gap-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Некорректный идентификатор</h1>
          <Link
            href={`${base}/services/categories`}
            className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
          >
            К списку
          </Link>
        </header>

        <div className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 text-sm text-white/70">
          Проверьте ссылку или вернитесь к списку категорий.
        </div>
      </div>
    );
  }

  if (!cat) {
    return (
      <div className="grid gap-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Категория не найдена</h1>
          <Link
            href={`${base}/services/categories`}
            className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
          >
            К списку
          </Link>
        </header>

        <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4">
          <div className="text-sm text-white/70">
            Такой категории нет. Возможно, она была удалена или вы перешли по устаревшей ссылке.
          </div>
        </section>
      </div>
    );
  }

  const servicesInCat = ADMIN_SERVICES.filter((s) => s.categoryId === cat.id);
  const activeCount = servicesInCat.filter((s) => s.status === "active").length;

  return (
    <div className="grid gap-6">
      {/* Header */}
      <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <nav className="text-xs text-white/60 flex flex-wrap items-center gap-x-1 gap-y-0.5">
            <Link href={`${base}/services`} className="hover:underline">Услуги</Link>
            <span className="opacity-50">/</span>
            <Link href={`${base}/services/categories`} className="hover:underline">Категории</Link>
            <span className="opacity-50">/</span>
            <span className="text-white/80">{cat.name}</span>
          </nav>
          <h1 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight">{cat.name}</h1>
          <div className="mt-1 text-xs text-white/60">
            slug: <span className="font-mono">{cat.slug}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`${base}/services?category=${encodeURIComponent(cat.id)}`}
            prefetch={false}
            className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
            title="Открыть услуги этой категории"
          >
            Услуги в категории
          </Link>
          <Link
            href={`${base}/services/categories`}
            className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
          >
            К списку
          </Link>
        </div>
      </header>

      {/* Короткая сводка по категории */}
      <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5">
        <div className="text-sm font-medium">Сводка</div>
        <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="text-xs text-white/60">Всего услуг</div>
            <div className="mt-1 text-lg font-semibold">{servicesInCat.length}</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="text-xs text-white/60">Активных</div>
            <div className="mt-1 text-lg font-semibold">{activeCount}</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="text-xs text-white/60">Черновики</div>
            <div className="mt-1 text-lg font-semibold">
              {servicesInCat.filter((s) => s.status === "draft").length}
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="text-xs text-white/60">Архив</div>
            <div className="mt-1 text-lg font-semibold">
              {servicesInCat.filter((s) => s.status === "archived").length}
            </div>
          </div>
        </div>

        {/* Быстрые ссылки */}
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <Link
            href={`${base}/services/pricing?category=${encodeURIComponent(cat.id)}`}
            className="rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 hover:bg-white/15"
            prefetch={false}
          >
            Открыть в прайс-листе
          </Link>
          <Link
            href={`${base}/services?category=${encodeURIComponent(cat.id)}&status=active`}
            className="rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 hover:bg-white/15"
            prefetch={false}
          >
            Только активные
          </Link>
        </div>
      </section>

      {/* Форма свойств категории */}
      <CategoryForm category={cat} />
    </div>
  );
}