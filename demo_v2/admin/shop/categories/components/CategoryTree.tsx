// app/demo/admin/shop/categories/components/CategoryTree.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, Folder, Plus } from "lucide-react";
import { Category } from "@/app/lib/catalog/types";
import { getIconById } from "@/app/lib/catalog/iconRegistry";

type Props = {
  baseHref: string; // /demo/admin | /demo/manager | /demo/user
  categories: Category[];
  counts: Map<string, number>; // categoryId -> products count
  loading?: boolean;
  error?: string;
};

type Node = Category & { children: Node[] };

/* ── utils ─────────────────────────────────────────────────────────────── */
function buildTree(categories: Category[]): Node[] {
  const byId = new Map<string, Node>();
  categories.forEach((c) => byId.set(c.id, { ...c, children: [] }));

  const roots: Node[] = [];
  for (const node of byId.values()) {
    if (node.parentId && byId.has(node.parentId)) {
      byId.get(node.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }
  // стабильная сортировка по position/name
  const sort = (xs: Node[]) =>
    xs.sort(
      (a, b) =>
        (a.position ?? 0) - (b.position ?? 0) ||
        a.name.localeCompare(b.name, "ru"),
    );
  const dfs = (xs: Node[]) => {
    sort(xs);
    xs.forEach((n) => dfs(n.children));
  };
  dfs(roots);
  return roots;
}
function cls(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

/* ── component ─────────────────────────────────────────────────────────── */
export default function CategoryTree({
  baseHref,
  categories,
  counts,
  loading,
  error,
}: Props) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const base = useMemo(() => (baseHref || "/demo/admin").replace(/\/$/, ""), [baseHref]);
  const tree = useMemo(() => buildTree(categories), [categories]);
  const needle = q.trim().toLowerCase();

  const visible = (node: Node): boolean => {
    if (!needle) return true;
    return (
      node.name.toLowerCase().includes(needle) ||
      node.slug.toLowerCase().includes(needle) ||
      node.children.some(visible)
    );
  };

  // Подсветка совпадений (первое вхождение — достаточно для демо)
  const highlight = (text: string) => {
    if (!needle) return text;
    const i = text.toLowerCase().indexOf(needle);
    if (i < 0) return text;
    const a = text.slice(0, i);
    const b = text.slice(i, i + needle.length);
    const c = text.slice(i + needle.length);
    return (
      <>
        {a}
        <mark className="rounded bg-white/20 px-0.5">{b}</mark>
        {c}
      </>
    );
  };

  const Row = ({ node, depth }: { node: Node; depth: number }) => {
    if (!visible(node)) return null;

    const hasChildren = node.children.length > 0;
    // При активном поиске раскрываем ветки по умолчанию
    const forcedOpen = !!needle;
    const isOpen = forcedOpen || (open[node.id] ?? depth < 1);

    const count = counts.get(node.id) ?? 0;
    const Icon = getIconById(node.iconId) ?? Folder;

    // Свяжем тогглер и контейнер потомков
    const childrenId = `cat-children-${node.id}`;

    return (
      <li className="select-none">
        <div
          className={cls(
            "group flex items-center gap-2 rounded-lg px-2 py-1.5 transition",
            "hover:bg-white/12 focus-within:ring-2 focus-within:ring-white/30",
          )}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
        >
          {/* toggler */}
          {hasChildren ? (
            <button
              type="button"
              onClick={() =>
                setOpen((s) => ({ ...s, [node.id]: !isOpen }))
              }
              className="grid h-6 w-6 place-items-center rounded border border-white/10 bg-white/5 transition hover:bg-white/12"
              aria-label={isOpen ? "Свернуть" : "Развернуть"}
              aria-expanded={isOpen}
              aria-controls={childrenId}
            >
              {isOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          ) : (
            <span className="inline-block w-6" />
          )}

          {/* icon */}
          <span className="grid h-6 w-6 place-items-center rounded border border-white/10 bg-white/10">
            <Icon className="h-4 w-4 opacity-80" />
          </span>

          {/* name + actions */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Link
                href={`${base}/shop/products?category=${encodeURIComponent(
                  node.id,
                )}`}
                prefetch={false}
                className="truncate text-white/85 transition hover:text-white hover:underline"
                title="Открыть товары этой категории"
              >
                {highlight(node.name)}
              </Link>
              {node.isActive === false && (
                <span className="rounded bg-white/12 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-white/65">
                  off
                </span>
              )}
            </div>
            <div className="text-[11px] text-white/55">
              {highlight(node.slug)} • ID: {node.id}
            </div>
          </div>

          {/* count */}
          <Link
            href={`${base}/shop/products?category=${encodeURIComponent(
              node.id,
            )}`}
            prefetch={false}
            className="rounded border border-white/12 bg-white/10 px-2 py-0.5 text-xs text-white/80 transition hover:border-white/18 hover:bg-white/16"
            aria-label="Перейти к товарам"
            title="Перейти к товарам"
          >
            {count}
          </Link>

          {/* add subcat — демо */}
          <button
            onClick={() => alert("Демо: создать подкатегорию")}
            className="ml-1 hidden rounded border border-white/10 p-1 text-white/70 transition hover:border-white/16 hover:bg-white/12 group-hover:inline-block"
            title="Добавить подкатегорию"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* children */}
        {hasChildren && isOpen && (
          <ol id={childrenId} className="mt-1">
            {node.children.map((c) => (
              <Row key={c.id} node={c} depth={depth + 1} />
            ))}
          </ol>
        )}
      </li>
    );
  };

  const uncategorizedCount = counts.get("__uncategorized") ?? 0; // 🔧 синхронизировано с страницей

  return (
    <section
      className="admin-section border-white/12 bg-white/8"
      aria-labelledby="category-tree-title"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 id="category-tree-title" className="text-sm font-medium text-white/85">
          Дерево категорий
        </h2>
        <div className="text-xs text-white/60">
          Всего: {categories.length} • Без категории: {uncategorizedCount}
        </div>
      </div>

      {/* search */}
      <div className="mt-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Поиск по названию/slug"
          className="w-full rounded-xl border border-white/12 bg-white/10 px-3 py-2 text-sm text-white/85 outline-none placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-white/40"
          aria-label="Поиск по категориям"
        />
      </div>

      {/* content */}
      <div className="mt-3 rounded-xl border border-white/10 bg-white/5">
        {loading ? (
          <div className="grid gap-2 p-4" role="status" aria-busy="true" aria-live="polite">
            <div className="h-4 w-2/3 animate-pulse rounded bg-white/10" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-white/10" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-white/10" />
            <span className="sr-only">Загрузка…</span>
          </div>
        ) : error ? (
          <div className="p-4 text-sm text-amber-200">{error}</div>
        ) : (
          <ol className="p-2">
            {/* Специальная строка «Без категории» (если есть такие товары) */}
            {uncategorizedCount > 0 && (
              <li className="select-none">
                <div
                  className={cls(
                    "group flex items-center gap-2 rounded-lg px-2 py-1.5 transition",
                    "hover:bg-white/12 focus-within:ring-2 focus-within:ring-white/30",
                  )}
                >
                  <span className="inline-block w-6" />
                  <span className="grid h-6 w-6 place-items-center rounded border border-white/10 bg-white/10">
                    <Folder className="h-4 w-4 opacity-80" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`${base}/shop/products?category=none`}
                        prefetch={false}
                        className="truncate text-white/85 transition hover:text-white hover:underline"
                        title="Открыть товары без категории"
                      >
                        Без категории
                      </Link>
                    </div>
                    <div className="text-[11px] text-white/55">slug: — • ID: __uncategorized</div>
                  </div>
                  <Link
                    href={`${base}/shop/products?category=none`}
                    prefetch={false}
                    className="rounded border border-white/12 bg-white/10 px-2 py-0.5 text-xs text-white/80 transition hover:border-white/18 hover:bg-white/16"
                    aria-label="Перейти к товарам без категории"
                    title="Перейти к товарам без категории"
                  >
                    {uncategorizedCount}
                  </Link>
                </div>
              </li>
            )}

            {/* Само дерево */}
            {tree.length === 0 ? (
              <li className="p-3 text-sm text-white/70">Категории не найдены</li>
            ) : (
              tree.map((n) => <Row key={n.id} node={n} depth={0} />)
            )}
          </ol>
        )}
      </div>

      <div className="mt-3 text-xs text-white/60">
        Адаптивность: на мобильных дерево скроллится по оси Y, строки компактнее. Счётчики кликабельны.
      </div>
    </section>
  );
}