"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, FolderPlus } from "lucide-react";
import {
  AdminServiceCategory,
} from "@/app/demo/(shared)/data/services"; // фикс пути импорта

type Props = {
  /** Сырые категории (плоский список) */
  categories?: AdminServiceCategory[];
  /** Необязательные счётчики услуг по категории (categoryId -> count) */
  counts?: Map<string, number>;
  /** Базовый префикс ссылок (/demo/admin | /demo/manager | /demo/user). По умолчанию — admin. */
  baseHref?: string;
  /** Показать ссылку «Создать подкатегорию» (демо-кнопка) */
  allowCreate?: boolean;
};

type Node = AdminServiceCategory & { children: Node[] };

function cls(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function buildTree(cats: AdminServiceCategory[]): Node[] {
  const byId = new Map<string, Node>();
  cats.forEach((c) => byId.set(c.id, { ...c, children: [] }));

  const roots: Node[] = [];
  for (const node of byId.values()) {
    if (node.parentId && byId.has(node.parentId)) {
      byId.get(node.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  // стабильная сортировка: position -> name (RU)
  const sort = (xs: Node[]) =>
    xs.sort(
      (a, b) =>
        (a.position ?? 0) - (b.position ?? 0) ||
        a.name.localeCompare(b.name, "ru")
    );
  const dfs = (xs: Node[]) => {
    sort(xs);
    xs.forEach((n) => dfs(n.children));
  };
  dfs(roots);
  return roots;
}

export default function CategoryTree({
  categories = [],
  counts,
  baseHref = "/demo/admin",
  allowCreate = true,
}: Props) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const tree = useMemo(() => buildTree(Array.isArray(categories) ? categories : []), [categories]);

  const visible = (n: Node): boolean => {
    if (!q) return true;
    const needle = q.toLowerCase();
    return (
      n.name.toLowerCase().includes(needle) ||
      n.slug.toLowerCase().includes(needle) ||
      n.children.some(visible)
    );
  };

  const Row = ({ node, depth }: { node: Node; depth: number }) => {
    const hasChildren = node.children.length > 0;
    const isOpen = open[node.id] ?? (depth < 1); // корни по умолчанию открыты
    const count = counts?.get(node.id) ?? 0;

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
              {isOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          ) : (
            <span className="inline-block w-6" />
          )}

          {/* «заглушка» иконки категории */}
          <span className="grid h-6 w-6 place-items-center rounded bg-white/10 text-[10px] text-white/70">
            {node.slug.at(0)?.toUpperCase() ?? "C"}
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Link
                href={`${baseHref}/services/categories/${node.id}`}
                className="truncate hover:underline"
                title="Открыть карточку категории"
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

          {/* счётчик → ведёт к прайсу с фильтром по категории */}
          <Link
            href={`${baseHref}/services/pricing?category=${encodeURIComponent(node.id)}`}
            prefetch={false}
            className="rounded px-2 py-0.5 text-xs bg-white/10 hover:bg-white/15"
            aria-label="Перейти к услугам категории"
            title="Перейти к услугам категории"
          >
            {count}
          </Link>

          {/* демо-кнопка добавления подкатегории */}
          {allowCreate && (
            <button
              onClick={() => alert("Демо: создать подкатегорию")}
              className="ml-1 hidden rounded p-1 hover:bg-white/10 group-hover:inline-block"
              title="Добавить подкатегорию"
            >
              <FolderPlus className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* дети */}
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

  if (!tree.length) {
    return (
      <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4">
        <div className="text-sm font-medium mb-2">Дерево категорий</div>
        <div className="text-sm text-white/70">Категорий пока нет.</div>
      </section>
    );
  }

  return (
    <section
      className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 backdrop-blur-sm"
      aria-labelledby="svc-category-tree-title"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 id="svc-category-tree-title" className="text-sm font-medium">
          Дерево категорий
        </h2>
        <div className="text-xs text-white/60">
          Всего: {categories.length}
        </div>
      </div>

      {/* Поиск */}
      <div className="mt-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Поиск по названию/slug"
          className="w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none"
          aria-label="Поиск по категориям"
        />
      </div>

      {/* Контент */}
      <div className="mt-2 rounded-xl border border-white/10 bg-white/5 max-h-[60vh] overflow-auto">
        <ol className="p-2">
          {tree.map((n) => (
            <Row key={n.id} node={n} depth={0} />
          ))}
        </ol>
      </div>

      <div className="mt-2 text-xs text-white/60">
        Адаптивность: на мобильных — вертикальный скролл, компактные строки, кликабельные счётчики.
      </div>
    </section>
  );
}