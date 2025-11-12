// app/demo/admin/shop/categories/components/CategoryForm.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Category } from "@/app/lib/catalog/types";
import { CATEGORIES } from "@/app/demo/(shared)/data/catalog/categories.food";
import { PRODUCTS } from "@/app/demo/(shared)/data/catalog/products.food";

/* ───────────────────────── utils ───────────────────────── */
function cls(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}
function getBaseFromPath(pathname: string | null) {
  if (!pathname) return "/demo/admin";
  if (pathname.startsWith("/demo/manager")) return "/demo/manager";
  if (pathname.startsWith("/demo/user")) return "/demo/user";
  return "/demo/admin";
}

/** Транслитерация + нормализация для slug  */
function slugify(input: string) {
  const map: Record<string, string> = {
    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    е: "e",
    ё: "e",
    ж: "zh",
    з: "z",
    и: "i",
    й: "y",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "h",
    ц: "c",
    ч: "ch",
    ш: "sh",
    щ: "sch",
    ъ: "",
    ы: "y",
    ь: "",
    э: "e",
    ю: "yu",
    я: "ya",
  };
  return input
    .trim()
    .toLowerCase()
    .replace(/[а-яё]/g, (ch) => map[ch] ?? ch)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-") // коллапс повторяющихся дефисов
    .replace(/^-+|-+$/g, "");
}

/** Множество всех потомков категории (для защиты от циклов при выборе родителя) */
function descendantsOf(rootId: string) {
  const children = new Map<string, string[]>();
  for (const c of CATEGORIES) {
    if (!c.parentId) continue;
    const arr = children.get(c.parentId) ?? [];
    arr.push(c.id);
    children.set(c.parentId, arr);
  }
  const seen = new Set<string>();
  const stack = [...(children.get(rootId) ?? [])];
  while (stack.length) {
    const id = stack.pop()!;
    if (seen.has(id)) continue;
    seen.add(id);
    const kids = children.get(id);
    if (kids && kids.length) stack.push(...kids);
  }
  return seen;
}

/* ───────────────────────── component ───────────────────────── */
export default function CategoryForm({
  category,
  baseHref,
}: {
  category: Category;
  baseHref?: string;
}) {
  const pathname = usePathname();
  const base = (baseHref ?? getBaseFromPath(pathname)).replace(/\/$/, "");

  // локальное состояние формы
  const [name, setName] = useState(category.name);
  const [parent, setParent] = useState<string>(category.parentId ?? "");
  const [slug, setSlug] = useState(category.slug);
  const [dirty, setDirty] = useState(false);
  const [autoSlug, setAutoSlug] = useState(true);

  // если в пропс пришла другая категория — сбрасываем состояние
  useEffect(() => {
    setName(category.name);
    setParent(category.parentId ?? "");
    setSlug(category.slug);
    setAutoSlug(true);
    setDirty(false);
  }, [category.id, category.name, category.parentId, category.slug]);

  // автогенерация slug из name (если включена)
  useEffect(() => {
    if (autoSlug) setSlug(slugify(name));
  }, [name, autoSlug]);

  // запрет на выбор текущей категории и её потомков
  const forbiddenParents = useMemo(() => {
    const s = descendantsOf(category.id);
    s.add(category.id);
    return s;
  }, [category.id]);

  // ошибки валидации
  const errors = useMemo(() => {
    const xs: string[] = [];
    if (!name.trim()) xs.push("Укажите название категории.");
    if (name.trim().length > 80) xs.push("Название слишком длинное (макс. 80).");
    if (!slug.trim()) xs.push("Slug обязателен.");
    if (slug.length > 80) xs.push("Slug слишком длинный (макс. 80).");
    if (forbiddenParents.has(parent)) xs.push("Нельзя выбрать текущую категорию или её потомка как родителя.");
    const dup = CATEGORIES.find((c) => c.slug === slug && c.id !== category.id);
    if (dup) xs.push(`Такой slug уже используется: «${dup.name}».`);
    return xs;
  }, [name, slug, parent, forbiddenParents, category.id]);

  // сколько товаров в категории
  const productsCount = useMemo(
    () => PRODUCTS.filter((p) => p.categoryId === category.id).length,
    [category.id]
  );

  const reset = () => {
    setName(category.name);
    setParent(category.parentId ?? "");
    setSlug(category.slug);
    setAutoSlug(true);
    setDirty(false);
  };

  const save = () => {
    if (errors.length) return;
    // демо-сохранение
    alert(
      `Категория сохранена (демо):\n• name: ${name}\n• slug: ${slug}\n• parentId: ${parent || "—"}`
    );
    setDirty(false);
  };

  return (
    <section
      className="admin-section border-white/12 bg-white/8 md:p-5"
      aria-labelledby="cat-form-title"
    >
      {/* Шапка */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <nav
            className="text-xs text-white/70 flex flex-wrap items-center gap-x-1 gap-y-1"
            aria-label="Хлебные крошки"
          >
            <Link href={`${base}/shop`} prefetch={false} className="hover:underline">
              Магазин
            </Link>
            <span className="opacity-50">/</span>
            <Link href={`${base}/shop/categories`} prefetch={false} className="hover:underline">
              Категории
            </Link>
            <span className="opacity-50">/</span>
            <span className="text-white/85" aria-current="page">
              {category.name}
            </span>
          </nav>

          <h2 id="cat-form-title" className="mt-1 text-xl md:text-2xl font-semibold tracking-tight">
            Редактирование категории
          </h2>
          <div className="mt-1 text-xs text-white/60">
            Товаров в категории:{" "}
            <b className="tabular-nums text-white/80">{productsCount}</b>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`${base}/shop/products?category=${encodeURIComponent(category.id)}`}
            prefetch={false}
            className="rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15"
          >
            Открыть товары
          </Link>
          <button
            type="button"
            onClick={reset}
            disabled={!dirty}
            className={cls(
              "rounded-xl border px-3 py-1.5 text-sm transition",
              dirty
                ? "border-white/15 bg-white/10 hover:bg-white/15"
                : "border-white/10 bg-white/5 opacity-60 cursor-not-allowed"
            )}
            title="Сбросить изменения"
          >
            Сбросить
          </button>
        </div>
      </div>

      {/* Форма */}
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        {/* Название */}
        <label className="grid gap-1 md:col-span-1">
          <span className="text-xs opacity-70">Название</span>
          <input
            className="rounded-xl border border-white/12 bg-white/10 px-3 py-2 text-sm text-white/85 outline-none focus:ring-2 focus:ring-white/30"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setDirty(true);
            }}
            maxLength={80}
            placeholder="Напр., Молочная продукция"
            aria-required="true"
          />
        </label>

        {/* Родитель */}
        <label className="grid gap-1 md:col-span-1">
          <span className="text-xs opacity-70">Родитель</span>
          <select
            className="rounded-xl border border-white/12 bg-white/10 px-3 py-2 text-sm text-white/85 outline-none focus:ring-2 focus:ring-white/30"
            value={parent}
            onChange={(e) => {
              setParent(e.target.value);
              setDirty(true);
            }}
          >
            <option value="">— Корень —</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id} disabled={forbiddenParents.has(c.id)}>
                {c.name}
              </option>
            ))}
          </select>
          <div className="text-[11px] text-white/55">
            Нельзя выбрать текущую категорию и её потомков.
          </div>
        </label>

        {/* Slug */}
        <label className="grid gap-1 md:col-span-1">
          <span className="text-xs opacity-70">Slug</span>
          <div className="flex items-center gap-2">
            <input
              className="flex-1 rounded-xl border border-white/12 bg-white/10 px-3 py-2 text-sm text-white/85 outline-none focus:ring-2 focus:ring-white/30"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value.toLowerCase());
                setAutoSlug(false);
                setDirty(true);
              }}
              placeholder="moloko"
              maxLength={80}
            />
            <button
              type="button"
              onClick={() => {
                setSlug(slugify(name));
                setAutoSlug(true);
                setDirty(true);
              }}
              disabled={!name.trim()}
              className="rounded-lg border border-white/12 bg-white/10 px-2 py-1 text-xs text-white/80 transition hover:border-white/18 hover:bg-white/16 disabled:opacity-40"
              title="Сгенерировать из названия"
            >
              Авто
            </button>
          </div>
          <div className="text-[11px] text-white/55">
            Латиница, цифры и «-». Формируется из названия; можно править вручную.
          </div>
        </label>
      </div>

      {/* Ошибки */}
      {errors.length > 0 && (
        <div
          className="mt-3 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200"
          role="alert"
          aria-live="polite"
        >
          <ul className="list-disc pl-5 space-y-1">
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Действия */}
      <div className="mt-3 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={save}
          disabled={!dirty || errors.length > 0}
          className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/90 disabled:opacity-40"
          title={errors.length ? "Исправьте ошибки выше" : dirty ? "Сохранить изменения" : "Нет изменений"}
          aria-disabled={!dirty || errors.length > 0}
        >
          Сохранить
        </button>
      </div>
    </section>
  );
}