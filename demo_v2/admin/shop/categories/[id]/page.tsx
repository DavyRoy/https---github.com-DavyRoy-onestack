// app/demo/admin/shop/categories/[id]/page.tsx
"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useCatalog } from "@/app/demo/(shared)/hooks/useCatalog";
import CategoryBreadcrumbs from "../components/CategoryBreadcrumbs";
import CategoryForm from "../components/CategoryForm";
import CategoryProductsTable from "../components/CategoryProductsTable";

function getBaseFromPath(pathname: string | null) {
  if (!pathname) return "/demo/admin";
  if (pathname.startsWith("/demo/manager")) return "/demo/manager";
  if (pathname.startsWith("/demo/user")) return "/demo/user";
  return "/demo/admin";
}

function coerceId(raw: unknown): string | null {
  if (typeof raw === "string" && raw.trim()) return raw;
  if (Array.isArray(raw) && raw[0]) return String(raw[0]);
  return null;
}

export default function AdminCategoryDetailPage() {
  const pathname = usePathname();
  const base = getBaseFromPath(pathname);
  const params = useParams<{ id?: string | string[] }>();

  const id = coerceId(params?.id);
  const { categories, products, loading, error } = useCatalog({ source: "food" });

  const category = useMemo(
    () => (id ? categories.find((c) => c.id === id) : undefined),
    [categories, id]
  );

  const productsInCategory = useMemo(
    () => (id ? products.filter((p) => p.categoryId === id) : []),
    [products, id]
  );

  if (!id) {
    return (
      <>
        <section
          className="admin-section border-white/12 bg-white/8 flex items-center justify-between"
          role="region"
          aria-label="Некорректный идентификатор категории"
        >
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">
            Некорректный идентификатор
          </h1>
          <Link
            href={`${base}/shop/categories`}
            prefetch={false}
            className="rounded-xl border border-white/12 bg-white/10 px-4 py-2 text-sm text-white/80 transition hover:border-white/18 hover:bg-white/16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            К списку
          </Link>
        </section>
        <section className="admin-section border-white/12 bg-white/8 text-sm text-white/70">
          Проверьте ссылку или вернитесь к списку категорий.
        </section>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <section
          className="admin-section border-white/12 bg-white/8 flex items-center justify-between"
          role="status"
          aria-busy="true"
          aria-live="polite"
        >
          <div className="h-7 w-40 rounded bg-white/10 animate-pulse" />
          <div className="h-8 w-28 rounded bg-white/10 animate-pulse" />
          <span className="sr-only">Загрузка категории…</span>
        </section>
        <section
          className="admin-section border-white/12 bg-white/8 grid gap-2"
          role="status"
          aria-busy="true"
          aria-live="polite"
        >
          <div className="h-4 w-1/2 rounded bg-white/10 animate-pulse" />
          <div className="h-4 w-1/3 rounded bg-white/10 animate-pulse" />
          <div className="h-24 w-full rounded bg-white/10 animate-pulse" />
          <span className="sr-only">Загрузка формы категории…</span>
        </section>
      </>
    );
  }

  if (error || !category) {
    return (
      <>
        <section
          className="admin-section border-white/12 bg-white/8 flex items-center justify-between"
          role="region"
          aria-label="Ошибка загрузки категории"
        >
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">
            {error ? "Ошибка загрузки категории" : "Категория не найдена"}
          </h1>
          <Link
            href={`${base}/shop/categories`}
            prefetch={false}
            className="rounded-xl border border-white/12 bg-white/10 px-4 py-2 text-sm text-white/80 transition hover:border-white/18 hover:bg-white/16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            К списку
          </Link>
        </section>
        {error && (
          <section className="rounded-2xl border border-amber-400/40 bg-amber-500/15 p-4 text-sm text-amber-100">
            {error}
          </section>
        )}
      </>
    );
  }

  return (
    <>
      <section className="admin-section border-white/12 bg-white/8" role="region" aria-label="Карточка категории">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            {/* Важно: baseHref должен быть базовым префиксом (/demo/admin|manager|user), а не /shop/categories */}
            <CategoryBreadcrumbs current={category} baseHref={base} />
            <h1 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight text-white">
              {category.name}
            </h1>
            {category.slug && (
              <div className="mt-1 text-xs text-white/60">
                slug: <span className="font-mono text-white/80">{category.slug}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`${base}/shop/products?category=${encodeURIComponent(category.id)}`}
              prefetch={false}
              className="rounded-xl border border-white/12 bg-white/10 px-4 py-2 text-sm text-white/80 transition hover:border-white/18 hover:bg-white/16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            >
              Товары ({productsInCategory.length})
            </Link>
            <Link
              href={`${base}/shop/categories`}
              prefetch={false}
              className="rounded-xl border border-white/12 bg-white/10 px-4 py-2 text-sm text-white/80 transition hover:border-white/18 hover:bg-white/16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            >
              К списку
            </Link>
          </div>
        </div>
      </section>

      <CategoryForm category={category} baseHref={base} />

      {/* Таблица товаров категории (использует свой собственный источник данных) */}
      <CategoryProductsTable categoryId={category.id} />
    </>
  );
}