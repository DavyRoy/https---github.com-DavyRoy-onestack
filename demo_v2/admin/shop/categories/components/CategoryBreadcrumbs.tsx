// app/demo/admin/shop/categories/components/CategoryBreadcrumbs.tsx
"use client";

import React, { useMemo, memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Category } from "@/app/lib/catalog/types";
import { CATEGORIES } from "@/app/demo/(shared)/data/catalog/categories.food";

function getBaseFromPath(pathname: string | null) {
  if (!pathname) return "/demo/admin";
  if (pathname.startsWith("/demo/manager")) return "/demo/manager";
  if (pathname.startsWith("/demo/user")) return "/demo/user";
  return "/demo/admin";
}

function CategoryBreadcrumbs({
  current,
  baseHref,
}: {
  current: Category | null | undefined;
  baseHref?: string;
}) {
  const pathname = usePathname();
  const base = useMemo(
    () => (baseHref ?? getBaseFromPath(pathname)).replace(/\/$/, ""),
    [baseHref, pathname]
  );

  // Индекс категорий для O(1) поиска родителя
  const byId = useMemo(() => {
    const m = new Map<string, Category>();
    for (const c of CATEGORIES) m.set(c.id, c);
    return m;
  }, []);

  // Безопасно строим цепочку родителей + защита от циклов
  const trail = useMemo(() => {
    if (!current) return [] as Category[];
    const chain: Category[] = [];
    const seen = new Set<string>();
    let cur: Category | undefined = current;

    while (cur && !seen.has(cur.id)) {
      chain.unshift(cur);
      seen.add(cur.id);
      cur = cur.parentId ? byId.get(cur.parentId) : undefined;
    }
    return chain;
  }, [current, byId]);

  return (
    <nav
      aria-label="Хлебные крошки"
      className="text-xs text-white/60 flex flex-wrap items-center gap-x-1 gap-y-0.5"
    >
      <Link
        href={`${base}/shop`}
        prefetch={false}
        className="hover:underline hover:text-white/80 transition-colors"
      >
        Магазин
      </Link>
      <span className="opacity-50">/</span>

      <Link
        href={`${base}/shop/categories`}
        prefetch={false}
        className="hover:underline hover:text-white/80 transition-colors"
      >
        Категории
      </Link>

      {trail.map((cat, i) => {
        const isLast = i === trail.length - 1;
        const href = `${base}/shop/categories/${encodeURIComponent(cat.id)}`;
        const name = cat.name ?? "Без названия";
        return (
          <span key={cat.id} className="flex items-center gap-1 min-w-0">
            <span className="opacity-50">/</span>
            {isLast ? (
              <span
                className="text-white/80 truncate"
                title={name}
                aria-current="page"
              >
                {name}
              </span>
            ) : (
              <Link
                href={href}
                prefetch={false}
                className="hover:underline hover:text-white/80 transition-colors truncate"
                title={name}
              >
                {name}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}

export default memo(CategoryBreadcrumbs);