"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { useCatalog } from "@/app/demo/(shared)/hooks/useCatalog";
import CategoryTree from "./components/CategoryTree";

function getBaseFromPath(pathname: string | null) {
  if (!pathname) return "/demo/admin";
  if (pathname.startsWith("/demo/manager")) return "/demo/manager";
  if (pathname.startsWith("/demo/user")) return "/demo/user";
  return "/demo/admin";
}

export default function AdminCategoriesPage() {
  const pathname = usePathname();
  const base = getBaseFromPath(pathname);

  // Единый источник: грузим food-каталог (категории + продукты)
  const { categories, products, loading, error } = useCatalog({ source: "food" });

  // счётчики товаров по категориям (включая «без категории»)
  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of products) {
      const k = p.categoryId ?? "__none";
      map.set(k, (map.get(k) ?? 0) + 1);
    }
    return map;
  }, [products]);

  return (
    <div className="grid gap-6">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Категории</h1>
          <p className="mt-1 text-sm text-white/70">
            Дерево категорий (единый справочник) и быстрый переход к товарам
          </p>
        </div>
        <Link
          href={`${base}/shop/categories/new`}
          prefetch={false}
          className="rounded-xl bg-white px-4 py-2 text-sm text-black hover:bg-white/90"
        >
          Новая категория
        </Link>
      </header>

      <section className="grid gap-3 md:grid-cols-2">
        <CategoryTree
          baseHref={base}
          categories={categories}
          counts={counts}
          loading={loading}
          error={error ? "Не удалось загрузить категории (демо: показ локальных)" : undefined}
        />

        <div className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 backdrop-blur-sm">
          <div className="text-sm font-medium">Подсказка</div>
          <p className="text-xs text-white/70 mt-1 leading-relaxed">
            Нажмите на категорию — откроется список товаров с фильтром по ней.
            Для подкатегорий счётчик показывает товары только внутри самой ветки (без рекурсии — демо).
            <br />
          </p>
        </div>
      </section>
    </div>
  );
}