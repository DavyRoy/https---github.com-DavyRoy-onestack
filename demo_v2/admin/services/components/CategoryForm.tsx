// app/demo/admin/services/components/CategoryForm.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AdminServiceCategory,
  SERVICE_CATEGORIES,
  ADMIN_SERVICES,
} from "@/app/demo/(shared)/data/services";

function slugify(input: string) {
  const map: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z", и: "i", й: "y",
    к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f",
    х: "h", ц: "c", ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
  };
  return input
    .trim()
    .toLowerCase()
    .replace(/[а-яё]/g, (ch) => map[ch] ?? ch)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")            // коллапс дефисов
    .replace(/^-+|-+$/g, "");
}

function descendantsOf(id: string): Set<string> {
  const byParent = new Map<string, AdminServiceCategory[]>();
  for (const c of SERVICE_CATEGORIES) {
    if (!c.parentId) continue;
    const arr = byParent.get(c.parentId) ?? [];
    arr.push(c);
    byParent.set(c.parentId, arr);
  }
  const result = new Set<string>();
  const stack = [id];
  while (stack.length) {
    const current = stack.pop()!;
    const children = byParent.get(current) ?? [];
    for (const child of children) {
      if (!result.has(child.id)) {
        result.add(child.id);
        stack.push(child.id);
      }
    }
  }
  return result;
}

function cls(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export default function CategoryForm({ category }: { category: AdminServiceCategory }) {
  const [name, setName] = useState(category.name);
  const [parent, setParent] = useState(category.parentId ?? "");
  const [slug, setSlug] = useState(category.slug);
  const [dirty, setDirty] = useState(false);
  const [autoSlug, setAutoSlug] = useState(true);

  // синхронизация при смене пропса category
  useEffect(() => {
    setName(category.name);
    setParent(category.parentId ?? "");
    setSlug(category.slug);
    setAutoSlug(true);
    setDirty(false);
  }, [category.id, category.name, category.parentId, category.slug]);

  useEffect(() => {
    if (autoSlug) setSlug(slugify(name));
  }, [name, autoSlug]);

  const forbiddenParents = useMemo(() => {
    const s = descendantsOf(category.id);
    s.add(category.id);
    return s;
  }, [category.id]);

  const errors = useMemo(() => {
    const xs: string[] = [];
    const nameTrim = name.trim();
    const slugTrim = slug.trim();

    if (!nameTrim) xs.push("Укажите название категории.");
    if (nameTrim.length > 80) xs.push("Название слишком длинное (макс. 80).");
    if (!slugTrim) xs.push("Slug обязателен.");
    if (slugTrim.length > 80) xs.push("Slug слишком длинный (макс. 80).");
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slugTrim)) {
      xs.push("Slug может содержать только латиницу, цифры и дефисы.");
    }
    if (forbiddenParents.has(parent)) {
      xs.push("Нельзя выбрать текущую категорию или её потомка как родителя.");
    }
    const dup = SERVICE_CATEGORIES.find(
      (c) => (c.slug || "").toLowerCase() === slugTrim.toLowerCase() && c.id !== category.id
    );
    if (dup) xs.push(`Такой slug уже используется: «${dup.name}».`);
    return xs;
  }, [name, slug, parent, forbiddenParents, category.id]);

  const servicesCount = useMemo(
    () => ADMIN_SERVICES.filter((p) => p.categoryId === category.id).length,
    [category.id]
  );

  const canSave = dirty && errors.length === 0;

  const onReset = () => {
    setName(category.name);
    setParent(category.parentId ?? "");
    setSlug(category.slug);
    setAutoSlug(true);
    setDirty(false);
  };

  const onSave = () => {
    if (!canSave) return;
    alert("Категория сохранена (демо)");
    setDirty(false);
  };

  return (
    <section className="admin-section border-white/12 bg-white/8 md:p-5" aria-labelledby="svc-cat-form-title">
      <div className="flex items-center justify-between gap-2">
        <h2 id="svc-cat-form-title" className="text-sm font-medium text-white/85">
          Свойства категории
        </h2>
        <span
          className={cls(
            "rounded-lg px-2 py-0.5 text-[11px]",
            dirty ? "bg-amber-400/15 text-amber-300" : "bg-white/10 text-white/60"
          )}
        >
          {dirty ? "Изменено" : "Сохранено"}
        </span>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-3">
        {/* Название */}
        <label className="grid gap-1">
          <span className="text-xs opacity-70">Название</span>
          <input
            className="rounded-xl border border-white/12 bg-white/10 px-3 py-2 text-sm text-white/85 outline-none focus:ring-2 focus:ring-white/30"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setDirty(true);
            }}
            placeholder="Например: Массажи"
            maxLength={80}
            aria-invalid={errors.some((e) => e.includes("Название"))}
          />
          <span className="text-[11px] text-white/55">До 80 символов</span>
        </label>

        {/* Родитель */}
        <label className="grid gap-1">
          <span className="text-xs opacity-70">Родитель</span>
          <select
            className="rounded-xl border border-white/12 bg-white/10 px-3 py-2 text-sm text-white/85 outline-none focus:ring-2 focus:ring-white/30"
            value={parent}
            onChange={(e) => {
              setParent(e.target.value);
              setDirty(true);
            }}
            aria-invalid={parent ? forbiddenParents.has(parent) : false}
            title={parent && forbiddenParents.has(parent) ? "Недопустимый выбор родителя" : undefined}
          >
            <option value="">— Корневая —</option>
            {SERVICE_CATEGORIES
              .filter((c) => c.id !== category.id && !forbiddenParents.has(c.id))
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
          </select>
          {parent && forbiddenParents.has(parent) && (
            <div className="text-[11px] text-rose-300">Недопустимый выбор родителя</div>
          )}
        </label>

        {/* Slug */}
        <label className="grid gap-1">
          <span className="text-xs opacity-70">Slug</span>
          <div className="flex items-center gap-2">
            <input
              className="flex-1 rounded-xl border border-white/12 bg-white/10 px-3 py-2 text-sm text-white/85 outline-none focus:ring-2 focus:ring-white/30"
              value={slug}
              onChange={(e) => {
                // приводим к нижнему регистру, но позволяем ручной ввод, без принудительного slugify
                setSlug(e.target.value.toLowerCase());
                setAutoSlug(false);
                setDirty(true);
              }}
              placeholder="hair"
              maxLength={80}
              pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
              aria-invalid={errors.some((e) => e.toLowerCase().includes("slug"))}
              title="Только латиница, цифры и дефисы"
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
          <div className="text-[11px] text-white/60">
            Урл-сегмент: латиница/цифры/дефис. Пример:{" "}
            <code className="opacity-80">/services/c/{slug || "slug"}</code>
          </div>
        </label>
      </div>

      <div className="mt-3 rounded-xl border border-white/12 bg-white/10 p-3 text-xs text-white/65">
        <div>
          Услуг в категории: <span className="font-semibold text-white">{servicesCount}</span>
        </div>
        <div className="mt-1">
          <a
            href={`/demo/admin/services?q=&category=${encodeURIComponent(category.id)}`}
            className="inline-flex items-center gap-1 rounded-lg border border-white/12 bg-white/10 px-2 py-1 text-white/80 transition hover:border-white/18 hover:bg-white/16"
          >
            Открыть список услуг →
          </a>
        </div>
      </div>

      {errors.length > 0 && (
        <ul className="mt-3 list-disc space-y-1 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-xs text-red-200 pl-5">
          {errors.map((err) => (
            <li key={err}>{err}</li>
          ))}
        </ul>
      )}

      <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
        <button
          type="button"
          onClick={onReset}
          className="rounded-xl border border-white/12 bg-white/10 px-3 py-2 text-sm text-white/80 transition hover:border-white/18 hover:bg-white/16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
        >
          Сбросить
        </button>
        <button
          onClick={onSave}
          disabled={!canSave}
          className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/90 disabled:opacity-40"
        >
          Сохранить
        </button>
      </div>
    </section>
  );
}