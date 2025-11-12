// app/demo/admin/services/categories/page.tsx
"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import CategoryTree from "../components/CategoryTree";
import {
  SERVICE_CATEGORIES,
  ADMIN_SERVICES,
} from "@/app/demo/(shared)/data/services";

/* -------------------- утилиты -------------------- */
function getBaseFromPath(pathname: string | null) {
  if (!pathname) return "/demo/admin";
  if (pathname.startsWith("/demo/manager")) return "/demo/manager";
  if (pathname.startsWith("/demo/user")) return "/demo/user";
  return "/demo/admin";
}

/* -------------------- страница -------------------- */
export default function AdminServiceCategoriesPage() {
  const pathname = usePathname();
  const base = getBaseFromPath(pathname);

  // Категории витрины (как есть из моков)
  const categories = SERVICE_CATEGORIES;

  // Подсчёт услуг по категориям + отдельно «без категории»
  const { countsByCategory, uncategorizedCount, totalServices } = useMemo(() => {
    const byCat = new Map<string, number>();
    let uncategorized = 0;

    for (const s of ADMIN_SERVICES) {
      const key = s.categoryId;
      if (!key) {
        uncategorized += 1;
        continue;
      }
      byCat.set(key, (byCat.get(key) ?? 0) + 1);
    }

    return {
      countsByCategory: byCat,
      uncategorizedCount: uncategorized,
      totalServices: ADMIN_SERVICES.length,
    };
  }, []);

  return (
    <>
      {/* Хедер */}
      <section className="admin-section border-white/12 bg-white/8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <span className="admin-chip mb-1 bg-white/12 text-white/75">Каталог</span>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">
              Категории услуг
            </h1>
            <p className="mt-1 text-sm text-white/70">
              Дерево категорий, счётчики услуг и быстрые переходы к спискам.
            </p>
          </div>

          <Link
            href={`${base}/services/categories/new`}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            aria-label="Создать новую категорию"
          >
            Новая категория
          </Link>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 md:gap-5">
        {/* Дерево категорий со счётчиками */}
        <CategoryTree
          baseHref={base}
          categories={categories}
          counts={countsByCategory}
          allowCreate
        />

        {/* Правая информационная панель */}
        <section className="admin-section border-white/12 bg-white/8">
          <div className="text-sm font-medium text-white/85">Подсказка</div>
          <p className="mt-1 text-xs text-white/65 leading-relaxed">
            Нажмите на категорию, чтобы открыть карточку и перейти к прайсу этой ветки.
            Slug категории используется в фильтрах и URL при создании услуг.
          </p>

          <div className="mt-3 grid gap-2">
            <div className="rounded-xl border border-white/12 bg-white/10 p-3 text-xs text-white/65">
              Всего услуг:{" "}
              <span className="font-semibold text-white">{totalServices}</span>
              {" • "}
              Без категории:{" "}
              <span className="font-semibold text-white">{uncategorizedCount}</span>
            </div>

            {uncategorizedCount > 0 && (
              <Link
                href={`${base}/services?q=&category=none`}
                className="inline-flex w-max items-center gap-2 rounded-xl border border-white/12 bg-white/10 px-3 py-2 text-xs text-white/80 transition hover:border-white/18 hover:bg-white/16"
                aria-label="Открыть услуги без категории"
              >
                Открыть услуги без категории →
              </Link>
            )}
          </div>
        </section>
      </div>
    </>
  );
}