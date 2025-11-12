// app/demo/admin/services/components/CategoryTree.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, FolderPlus } from "lucide-react";
import { AdminServiceCategory } from "@/app/demo/(shared)/data/services";

type Props = {
  categories?: AdminServiceCategory[];
  counts?: Map<string, number>;
  baseHref?: string;
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

export default function CategoryTree({
  categories = [],
  counts,
  baseHref = "/demo/admin",
  allowCreate = true,
}: Props) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const tree = useMemo(
    () => buildTree(Array.isArray(categories) ? categories : []),
    [categories]
  );

  const needle = q.trim().toLowerCase();

  const visible = (node: Node): boolean => {
    if (!needle) return true;
    return (
      node.name.toLowerCase().includes(needle) ||
      node.slug.toLowerCase().includes(needle) ||
      node.children.some(visible)
    );
  };

  // Подсветка совпадений
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
    // При активном поиске открываем все ветки по умолчанию
    const forcedOpen = !!needle;
    const isOpen = forcedOpen || (open[node.id] ?? depth < 1);
    const count = counts?.get(node.id) ?? 0;

    const childrenId = `svc-cat-children-${node.id}`;

    return (
      <li className="select-none">
        <div
          className={cls(
            "group flex items-center gap-2 rounded-lg px-2 py-1.5 transition",
            "hover:bg-white/12 focus-within:ring-2 focus-within:ring-white/30",
          )}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
        >
          {hasChildren ? (
            <button
              type="button"
              onClick={() => setOpen((s) => ({ ...s, [node.id]: !isOpen }))}
              className="grid h-6 w-6 place-items-center rounded border border-white/10 bg-white/5 transition hover:bg-white/12"
              aria-label={isOpen ? "Свернуть" : "Развернуть"}
              aria-expanded={isOpen}
              aria-controls={childrenId}
            >
              {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          ) : (
            <span className="inline-block w-6" />
          )}

          <span className="grid h-6 w-6 place-items-center rounded border border-white/10 bg-white/10 text-[10px] text-white/70">
            {(node.slug?.[0] || node.name?.[0] || "C").toUpperCase()}
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Link
                href={`${baseHref}/services/categories/${node.id}`}
                className="truncate text-white/85 transition hover:text-white hover:underline"
                title="Открыть карточку категории"
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

          <Link
            href={`${baseHref}/services/pricing?category=${encodeURIComponent(node.id)}`}
            prefetch={false}
            className="rounded border border-white/12 bg-white/10 px-2 py-0.5 text-xs text-white/80 transition hover:border-white/18 hover:bg-white/16"
            aria-label="Перейти к услугам категории"
            title="Перейти к услугам категории"
          >
            {count}
          </Link>

          {allowCreate && (
            <button
              onClick={() => alert("Демо: создать подкатегорию")}
              className="ml-1 hidden rounded border border-white/10 p-1 text-white/70 transition hover:border-white/16 hover:bg-white/12 group-hover:inline-block"
              title="Добавить подкатегорию"
            >
              <FolderPlus className="h-4 w-4" />
            </button>
          )}
        </div>

        {hasChildren && isOpen && (
          <ol id={childrenId} className="mt-1">
            {node.children.map((child) => (
              <Row key={child.id} node={child} depth={depth + 1} />
            ))}
          </ol>
        )}
      </li>
    );
  };

  if (!tree.length) {
    return (
      <section className="admin-section border-white/12 bg-white/8">
        <div className="mb-2 text-sm font-medium text-white/85">Дерево категорий</div>
        <div className="text-sm text-white/70">Категорий пока нет.</div>
      </section>
    );
  }

  return (
    <section className="admin-section border-white/12 bg-white/8" aria-labelledby="svc-category-tree-title">
      <div className="flex items-center justify-between gap-2">
        <h2 id="svc-category-tree-title" className="text-sm font-medium text-white/85">
          Дерево категорий
        </h2>
        <div className="text-xs text-white/60">Всего: {categories.length}</div>
      </div>

      <div className="mt-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Поиск по названию/slug"
          className="w-full rounded-xl border border-white/12 bg-white/10 px-3 py-2 text-sm text-white/85 outline-none placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-white/30"
          aria-label="Поиск по категориям"
        />
      </div>

      <div className="mt-3 max-h-[60vh] overflow-auto rounded-xl border border-white/10 bg-white/5">
        <ol className="p-2">
          {tree.map((node) => (
            <Row key={node.id} node={node} depth={0} />
          ))}
        </ol>
      </div>

      <div className="mt-3 text-xs text-white/60">
        На мобильных дерево скроллится по вертикали; счётчики ведут к прайсу с выбранной категорией.
      </div>
    </section>
  );
}