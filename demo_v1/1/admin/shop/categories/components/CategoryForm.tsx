// app/demo/admin/shop/categories/components/CategoryForm.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Category } from "@/lib/catalog/types";
import { CATEGORIES } from "@/app/demo/(shared)/data/catalog/categories.food";
import { PRODUCTS } from "@/app/demo/(shared)/data/catalog/products.food";

function cls(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

// База из пути (админ/менеджер/пользователь)
function getBaseFromPath(pathname: string | null) {
  if (!pathname) return "/demo/admin";
  if (pathname.startsWith("/demo/manager")) return "/demo/manager";
  if (pathname.startsWith("/demo/user")) return "/demo/user";
  return "/demo/admin";
}

// простая функция для русских/латинских названий → slug
function slugify(input: string) {
  const map: Record<string, string> = {
    а:"a", б:"b", в:"v", г:"g", д:"d", е:"e", ё:"e", ж:"zh", з:"z", и:"i", й:"y",
    к:"k", л:"l", м:"m", н:"n", о:"o", п:"p", р:"r", с:"s", т:"t", у:"u", ф:"f",
    х:"h", ц:"c", ч:"ch", ш:"sh", щ:"sch", ъ:"", ы:"y", ь:"", э:"e", ю:"yu", я:"ya",
  };
  return input
    .trim()
    .toLowerCase()
    .replace(/[а-яё]/g, ch => map[ch] ?? ch)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// построить множество потомков (чтобы запретить их как parentId)
function descendantsOf(id: string): Set<string> {
  const set = new Set<string>();
  const byParent = new Map<string, Category[]>();
  for (const c of CATEGORIES) {
    if (!c.parentId) continue;
    const arr = byParent.get(c.parentId) ?? [];
    arr.push(c);
    byParent.set(c.parentId, arr);
  }
  const stack = [id];
  while (stack.length) {
    const cur = stack.pop()!;
    const kids = byParent.get(cur) ?? [];
    for (const k of kids) {
      if (!set.has(k.id)) {
        set.add(k.id);
        stack.push(k.id);
      }
    }
  }
  return set;
}

export default function CategoryForm({
  category,
  baseHref,
}: {
  category: Category;
  /** Можно пробросить baseHref вручную; если не задан — вычислим по URL */
  baseHref?: string;
}) {
  const pathname = usePathname();
  const base = (baseHref ?? getBaseFromPath(pathname)).replace(/\/$/, "");

  const [name, setName] = useState(category.name);
  const [parent, setParent] = useState(category.parentId ?? "");
  const [slug, setSlug] = useState(category.slug);
  const [dirty, setDirty] = useState(false);
  const [autoSlug, setAutoSlug] = useState(true); // пока пользователь не трогал slug руками

  // если пользователь меняет название и slug ещё "авто", — обновляем slug
  useEffect(() => {
    if (autoSlug) setSlug(slugify(name));
  }, [name, autoSlug]);

  // список запрещённых parents: сама категория + все её потомки
  const forbiddenParents = useMemo(() => {
    const s = descendantsOf(category.id);
    s.add(category.id);
    return s;
  }, [category.id]);

  // валидaция
  const errors = useMemo(() => {
    const xs: string[] = [];
    if (!name.trim()) xs.push("Укажите название категории.");
    if (name.trim().length > 80) xs.push("Название слишком длинное (макс. 80).");
    if (!slug.trim()) xs.push("Slug обязателен.");
    if (slug.length > 80) xs.push("Slug слишком длинный (макс. 80).");
    if (forbiddenParents.has(parent)) xs.push("Нельзя выбрать текущую категорию или её потомка как родителя.");
    // мягкая проверка на дубликат slug (исключаем текущую)
    const dup = CATEGORIES.find(c => c.slug === slug && c.id !== category.id);
    if (dup) xs.push(`Такой slug уже используется: «${dup.name}».`);
    return xs;
  }, [name, slug, parent, forbiddenParents, category.id]);

  // сколько товаров привязано к этой категории (для подсказки/ссылки)
  const productsCount = useMemo(
    () => PRODUCTS.filter(p => p.categoryId === category.id).length,
    [category.id]
  );

  const save = () => {
    if (errors.length) return;
    alert("Категория сохранена (демо)");
    setDirty(false);
  };

  return (
    <section
      className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5 backdrop-blur-sm"
      aria-labelledby="cat-form-title"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm font-medium" id="cat-form-title">
          Свойства категории
        </div>
        <div
          className={cls(
            "text-[11px] rounded-lg px-2 py-0.5",
            dirty ? "bg-amber-400/15 text-amber-300" : "bg-white/10 text-white/60"
          )}
          title={dirty ? "Есть несохранённые изменения" : "Нет несохранённых изменений"}
        >
          {dirty ? "Изменено" : "Сохранено"}
        </div>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-3">
        {/* Название */}
        <label className="grid gap-1">
          <span className="text-xs opacity-70">Название</span>
          <input
            className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/30"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setDirty(true);
            }}
            maxLength={80}
            placeholder="Например, Молочные продукты"
          />
        </label>

        {/* Родитель */}
        <label className="grid gap-1">
          <span className="text-xs opacity-70">Родитель</span>
          <select
            className={cls(
              "rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/30",
              "bg-white/10",
              "border-white/15"
            )}
            value={parent}
            onChange={(e) => {
              setParent(e.target.value);
              setDirty(true);
            }}
          >
            <option value="">— Корневая —</option>
            {CATEGORIES.filter((c) => !forbiddenParents.has(c.id)).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {parent && forbiddenParents.has(parent) && (
            <div className="text-[11px] text-red-300">Этот выбор недопустим</div>
          )}
        </label>

        {/* Slug */}
        <label className="grid gap-1">
          <span className="text-xs opacity-70">Slug</span>
          <div className="flex items-center gap-2">
            <input
              className="flex-1 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/30"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value.toLowerCase());
                setAutoSlug(false); // пользователь вручную поправил slug
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
              className="rounded-lg border border-white/15 bg-white/10 px-2 py-1 text-xs hover:bg-white/15"
              title="Сгенерировать из названия"
            >
              Авто
            </button>
          </div>
          <div className="text-[11px] text-white/60">
            Урл-сегмент: латиница/цифры/дефис. Пример:{" "}
            <code className="opacity-80">/shop/c/{slug || "slug"}</code>
          </div>
        </label>
      </div>

      {/* Информация по товарам */}
      <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3 text-xs">
        <div className="text-white/70">
          Товаров в категории: <span className="font-medium text-white">{productsCount}</span>
        </div>
        <div className="mt-1">
          <Link
            href={`${base}/shop/products?category=${encodeURIComponent(category.id)}`}
            className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/10 px-2 py-1 hover:bg-white/15"
            prefetch={false}
          >
            Открыть товары этой категории →
          </Link>
        </div>
      </div>

      {/* Ошибки */}
      {errors.length > 0 && (
        <ul className="mt-3 list-disc space-y-1 rounded-xl border border-red-400/20 bg-red-400/5 p-3 text-xs text-red-300 pl-5">
          {errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}

      {/* Кнопки */}
      <div className="mt-3 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => {
            // откатить к исходным данным
            setName(category.name);
            setParent(category.parentId ?? "");
            setSlug(category.slug);
            setAutoSlug(true);
            setDirty(false);
          }}
          className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm hover:bg-white/15"
        >
          Сбросить
        </button>
        <button
          onClick={save}
          disabled={!dirty || errors.length > 0}
          className="rounded-xl bg-white px-4 py-2 text-sm text-black disabled:opacity-50"
          title={errors.length ? "Исправьте ошибки выше" : dirty ? "Сохранить изменения" : "Нет изменений"}
        >
          Сохранить
        </button>
      </div>
    </section>
  );
}