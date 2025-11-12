// app/demo/admin/shop/categories/components/CategoryBreadcrumbs.tsx
"use client";

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

/** Хлебные крошки для страницы категории (общий справочник) */
export default function CategoryBreadcrumbs({
  current,
  baseHref,
}: {
  current: Category;
  /** опционально можно пробросить baseHref вручную */
  baseHref?: string;
}) {
  const pathname = usePathname();
  const base = baseHref ?? getBaseFromPath(pathname);

  // восстановим цепочку родителей из общего справочника
  const buildTrail = (cat: Category) => {
    const trail: Category[] = [];
    let cur: Category | undefined = cat;
    while (cur) {
      trail.unshift(cur);
      cur = cur.parentId ? CATEGORIES.find((x) => x.id === cur.parentId) : undefined;
    }
    return trail;
  };

  // страховка: если вдруг current не входит в справочник, покажем минимальные крошки
  const trail = current ? buildTrail(current) : [];

  return (
    <nav
      aria-label="Хлебные крошки"
      className="text-xs text-white/60 flex flex-wrap items-center gap-x-1 gap-y-0.5"
    >
      <Link
        href={`${base}/shop`}
        className="hover:underline hover:text-white/80 transition-colors"
      >
        Магазин
      </Link>
      <span className="opacity-50">/</span>

      <Link
        href={`${base}/shop/categories`}
        className="hover:underline hover:text-white/80 transition-colors"
      >
        Категории
      </Link>

      {trail.map((cat, i) => (
        <span key={cat.id} className="flex items-center gap-1">
          <span className="opacity-50">/</span>
          {i < trail.length - 1 ? (
            <Link
              href={`${base}/shop/categories/${cat.id}`}
              className="hover:underline hover:text-white/80 transition-colors"
            >
              {cat.name}
            </Link>
          ) : (
            <span className="text-white/80">{cat.name}</span>
          )}
        </span>
      ))}
    </nav>
  );
}