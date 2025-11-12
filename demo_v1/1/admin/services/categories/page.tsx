// app/demo/admin/services/categories/page.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SERVICE_CATEGORIES, ADMIN_SERVICES } from "@/app/demo/(shared)/data/services";
import CategoryTree from "@/app/demo/admin/services/components/CategoryTree";

/** Определяем базовый префикс интерфейса по пути */
function getBaseFromPath(pathname: string | null) {
  if (!pathname) return "/demo/admin";
  if (pathname.startsWith("/demo/manager")) return "/demo/manager";
  if (pathname.startsWith("/demo/user")) return "/demo/user";
  return "/demo/admin";
}

export default function AdminServiceCategoriesPage() {
  const pathname = usePathname();
  const base = getBaseFromPath(pathname);

  // Подсчёт: сколько услуг в каждой категории (+ "__none" для без категории)
  const counts = new Map<string, number>();
  counts.set("__none", 0);
  for (const s of ADMIN_SERVICES) {
    const key = s.categoryId ?? "__none";
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return (
    <div className="grid gap-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <nav className="text-xs text-white/60">
            <Link href={`${base}/services`} className="hover:underline">Услуги</Link>
            <span className="mx-1">/</span>
            <span className="text-white/80">Категории</span>
          </nav>
          <h1 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight">Категории услуг</h1>
          <p className="mt-1 text-sm text-white/70">Дерево категорий, переход к списку услуг по клику на счётчик</p>
        </div>
        <Link
          href={`${base}/services/categories/new`}
          className="rounded-xl bg-white px-4 py-2 text-sm text-black hover:bg-white/90"
        >
          Новая категория
        </Link>
      </header>

      {/* Дерево категорий (адаптив + поиск внутри самого компонента) */}
      <CategoryTree
        baseHref={base}
        categories={SERVICE_CATEGORIES as any}
        counts={counts}
        loading={false}
      />

      {/* Подсказка / быстрые ссылки */}
      <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4">
        <div className="text-sm font-medium">Подсказка</div>
        <p className="mt-1 text-xs text-white/70">
          Нажмите на количество справа, чтобы открыть услуги этой категории. На мобильных дерево прокручивается по вертикали.
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <Link
            href={`${base}/services`}
            className="rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 hover:bg-white/15"
          >
            Хаб услуг
          </Link>
          <Link
            href={`${base}/services/pricing`}
            className="rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 hover:bg-white/15"
          >
            Прайс-лист
          </Link>
        </div>
      </section>
    </div>
  );
}