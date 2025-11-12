"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, Folder, Plus } from "lucide-react";
import { Category } from "@/app/lib/catalog/types";
import { getIconById } from "@/app/lib/catalog/iconRegistry";

type Props = {
  baseHref: string;                            // /demo/admin | /demo/manager | /demo/user
  categories: Category[];
  counts: Map<string, number>;                 // categoryId -> products count
  loading?: boolean;
  error?: string;
};

type Node = Category & { children: Node[] };

function buildTree(categories: Category[]): Node[] {
  const byId = new Map<string, Node>();
  categories.forEach(c => byId.set(c.id, { ...c, children: [] }));

  const roots: Node[] = [];
  for (const node of byId.values()) {
    if (node.parentId && byId.has(node.parentId)) {
      byId.get(node.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }
  // стабильная сортировка по position/name
  const sort = (xs: Node[]) => xs.sort((a, b) => (a.position ?? 0) - (b.position ?? 0) || a.name.localeCompare(b.name, "ru"));
  const dfs = (xs: Node[]) => { sort(xs); xs.forEach(n => dfs(n.children)); };
  dfs(roots);
  return roots;
}

function cls(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export default function CategoryTree({ baseHref, categories, counts, loading, error }: Props) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const tree = useMemo(() => buildTree(categories), [categories]);

  const visible = (node: Node): boolean => {
    if (!q) return true;
    const needle = q.toLowerCase();
    return (
      node.name.toLowerCase().includes(needle) ||
      node.slug.toLowerCase().includes(needle) ||
      node.children.some(visible)
    );
  };

  const Row = ({ node, depth }: { node: Node; depth: number }) => {
    const hasChildren = node.children.length > 0;
    const isOpen = open[node.id] ?? (depth < 1); // корни открыты по умолчанию
    const count = counts.get(node.id) ?? 0;
    const Icon = getIconById(node.iconId) ?? Folder;

    if (!visible(node)) return null;

    return (
      <li className="select-none">
        <div
          className={cls(
            "group flex items-center gap-2 rounded-lg px-2 py-1.5",
            "hover:bg-white/10 focus-within:ring-2 focus-within:ring-white/30"
          )}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
        >
          {/* toggler */}
          {hasChildren ? (
            <button
              type="button"
              onClick={() => setOpen((s) => ({ ...s, [node.id]: !isOpen }))}
              className="grid h-6 w-6 place-items-center rounded hover:bg-white/10"
              aria-label={isOpen ? "Свернуть" : "Развернуть"}
            >
              {isOpen ? <ChevronDown className="w-4 h-4"/> : <ChevronRight className="w-4 h-4" />}
            </button>
          ) : (
            <span className="inline-block w-6" />
          )}

          {/* icon */}
          <span className="grid h-6 w-6 place-items-center rounded bg-white/10">
            <Icon className="w-4 h-4 opacity-80" />
          </span>

          {/* name + actions */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Link
                href={`${baseHref}/shop/products?category=${encodeURIComponent(node.id)}`}
                prefetch={false}
                className="truncate hover:underline"
                title="Открыть товары этой категории"
              >
                {node.name}
              </Link>
              {node.isActive === false && (
                <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-white/70">
                  off
                </span>
              )}
            </div>
            <div className="text-[11px] text-white/50">
              {node.slug} • ID: {node.id}
            </div>
          </div>

          {/* count */}
          <Link
            href={`${baseHref}/shop/products?category=${encodeURIComponent(node.id)}`}
            prefetch={false}
            className="rounded px-2 py-0.5 text-xs bg-white/10 hover:bg-white/15"
            aria-label="Перейти к товарам"
            title="Перейти к товарам"
          >
            {count}
          </Link>

          {/* add subcat — демонстрация */}
          <button
            onClick={() => alert("Демо: создать подкатегорию")}
            className="ml-1 hidden rounded p-1 hover:bg-white/10 group-hover:inline-block"
            title="Добавить подкатегорию"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* children */}
        {hasChildren && isOpen && (
          <ol className="mt-1">
            {node.children.map((c) => (
              <Row key={c.id} node={c} depth={depth + 1} />
            ))}
          </ol>
        )}
      </li>
    );
  };

  return (
    <section
      className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 backdrop-blur-sm"
      aria-labelledby="category-tree-title"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 id="category-tree-title" className="text-sm font-medium">
          Дерево категорий
        </h2>
        <div className="text-xs text-white/60">
          Всего: {categories.length} • Без категории: {counts.get("__none") ?? 0}
        </div>
      </div>

      {/* search */}
      <div className="mt-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Поиск по названию/slug"
          className="w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none"
          aria-label="Поиск по категориям"
        />
      </div>

      {/* content */}
      <div className="mt-2 rounded-xl border border-white/10 bg-white/5">
        {loading ? (
          <div className="p-4 grid gap-2">
            <div className="h-4 w-2/3 rounded bg-white/10 animate-pulse" />
            <div className="h-4 w-1/2 rounded bg-white/10 animate-pulse" />
            <div className="h-4 w-3/4 rounded bg-white/10 animate-pulse" />
          </div>
        ) : error ? (
          <div className="p-4 text-sm text-amber-200">{error}</div>
        ) : (
          <ol className="p-2">
            {tree.length === 0 ? (
              <li className="p-3 text-sm text-white/70">Категории не найдены</li>
            ) : (
              tree.map((n) => <Row key={n.id} node={n} depth={0} />)
            )}
          </ol>
        )}
      </div>

      <div className="mt-2 text-xs text-white/60">
        Адаптивность: на мобильных дерево скроллится по оси Y, строки компактнее. Счётчики кликабельны.
      </div>
    </section>
  );
}