"use client";

import { useMemo } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
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
  const router = useRouter();
  const params = useParams<{ id?: string | string[] }>();

  const id = coerceId(params?.id);

  // Единый источник данных (food-каталог)
  const { categories, products, loading, error } = useCatalog({ source: "food" });

  const cat = useMemo(
    () => (id ? categories.find((c) => c.id === id) : undefined),
    [id, categories]
  );

  const productsInCat = useMemo(
    () => (id ? products.filter((p) => p.categoryId === id) : []),
    [id, products]
  );

  if (!id) {
    return (
      <div className="grid gap-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Некорректный идентификатор</h1>
          <Link
            href={`${base}/shop/categories`}
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

  if (loading) {
    return (
      <div className="grid gap-6">
        <header className="flex items-center justify-between">
          <div className="h-7 w-40 rounded bg-white/10 animate-pulse" />
          <div className="h-8 w-28 rounded bg-white/10 animate-pulse" />
        </header>
        <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 grid gap-2">
          <div className="h-4 w-1/2 rounded bg-white/10 animate-pulse" />
          <div className="h-4 w-1/3 rounded bg-white/10 animate-pulse" />
          <div className="h-24 w-full rounded bg-white/10 animate-pulse" />
        </section>
      </div>
    );
  }

  if (error || !cat) {
    return (
      <div className="grid gap-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            {error ? "Ошибка загрузки категории" : "Категория не найдена"}
          </h1>
          <Link
            href={`${base}/shop/categories`}
            className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
          >
            К списку
          </Link>
        </header>
        {error && (
          <div className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 text-sm text-amber-200">
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <CategoryBreadcrumbs current={cat} baseHref={`${base}/shop/categories`} />
          <h1 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight">{cat.name}</h1>
          {cat.slug && (
            <div className="mt-1 text-xs text-white/60">
              slug: <span className="font-mono">{cat.slug}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`${base}/shop/products?category=${encodeURIComponent(cat.id)}`}
            className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
            prefetch={false}
          >
            Товары в категории ({productsInCat.length})
          </Link>
          <Link
            href={`${base}/shop/categories`}
            className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
          >
            К списку
          </Link>
        </div>
      </header>

      {/* Форма свойств категории (демо-редактирование) */}
      <CategoryForm category={cat} />

      {/* Таблица товаров, привязанных к категории */}
      <CategoryProductsTable
        categoryId={cat.id}
        rows={productsInCat}
        baseHref={base}
      />
    </div>
  );
}