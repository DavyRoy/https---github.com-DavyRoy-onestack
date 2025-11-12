// app/demo/admin/shop/categories/page.tsx
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
  const base = useMemo(() => getBaseFromPath(pathname), [pathname]);

  // Единый источник категорий/товаров (демо-датасет "food")
  const { categories = [], products = [], loading, error } = useCatalog({ source: "food" });

  // Подсчёт количества товаров на категорию (по прямому совпадению categoryId)
  // Ключ для «без категории» — __uncategorized (совместимо с CategoryTree)
  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of products) {
      const k = p.categoryId ?? "__uncategorized";
      map.set(k, (map.get(k) ?? 0) + 1);
    }
    return map;
  }, [products]);

  const totalCats = categories.length;
  const totalProducts = products.length;
  const uncategorized = counts.get("__uncategorized") ?? 0;

  return (
    <>
      <section
        className="admin-section border-white/12 bg-white/8"
        aria-busy={loading}
        aria-live="polite"
        aria-labelledby="cats-page-title"
        role="region"
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <span className="admin-chip mb-1 bg-white/12 text-white/75">Магазин</span>
            <h1 id="cats-page-title" className="text-2xl md:text-3xl font-semibold tracking-tight text-white">
              Категории
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-white/70">
              Дерево категорий (единый справочник) и быстрый переход к товарам.
            </p>

            {/* Мини-сводка */}
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-white/65">
              <span className="rounded-lg border border-white/12 bg-white/8 px-2 py-1">
                Категорий: <b className="tabular-nums text-white/85">{totalCats}</b>
              </span>
              <span className="rounded-lg border border-white/12 bg-white/8 px-2 py-1">
                Товаров всего: <b className="tabular-nums text-white/85">{totalProducts}</b>
              </span>
              <span className="rounded-lg border border-white/12 bg-white/8 px-2 py-1">
                Без категории: <b className="tabular-nums text-white/85">{uncategorized}</b>
              </span>
            </div>

            {/* Быстрые ссылки */}
            <div className="mt-2 flex gap-2" aria-label="Быстрые ссылки по каталогу">
              <Link
                href={`${base}/shop/products`}
                prefetch={false}
                className="rounded-lg border border-white/12 bg-white/10 px-2.5 py-1 text-xs text-white/80 transition hover:border-white/18 hover:bg-white/16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              >
                Все товары
              </Link>
              <Link
                href={`${base}/shop/products?category=none`}
                prefetch={false}
                className="rounded-lg border border-white/12 bg-white/10 px-2.5 py-1 text-xs text-white/80 transition hover:border-white/18 hover:bg-white/16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              >
                Без категории
              </Link>
            </div>

            {/* Ошибка загрузки (мягкая, т.к. CategoryTree умеет показывать демо) */}
            {error && (
              <div className="mt-3 rounded-lg border border-amber-400/25 bg-amber-400/10 p-2 text-xs text-amber-200">
                Не удалось загрузить категории из API. Показаны локальные демо-данные.
              </div>
            )}
          </div>

          <Link
            href={`${base}/shop/categories/new`}
            prefetch={false}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            Новая категория
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <CategoryTree
          baseHref={base}
          categories={categories}
          counts={counts}
          loading={loading}
          error={error ? "Не удалось загрузить категории (демо: показ локальных)" : undefined}
        />

        <div className="admin-section border-white/12 bg-white/8">
          <div className="text-sm font-medium text-white/85">Подсказка</div>
          <p className="mt-1 text-xs text-white/65 leading-relaxed">
            Нажмите на категорию — откроется список товаров с фильтром по ней.
            Счётчик у подкатегорий показывает количество товаров только в самой ветке (без рекурсии — демо).
          </p>
          <p className="mt-2 text-[11px] text-white/55">
            Горячие клавиши в списке товаров: <kbd className="rounded bg-white/10 px-1">Ctrl/Cmd+K</kbd> — фокус на поиск,
            <span className="mx-1 inline-block" aria-hidden>•</span>
            <kbd className="rounded bg-white/10 px-1">Enter</kbd> — применить.
          </p>
        </div>
      </section>
    </>
  );
}