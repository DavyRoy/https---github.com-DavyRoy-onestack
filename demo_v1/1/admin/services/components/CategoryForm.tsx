"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminServiceCategory, SERVICE_CATEGORIES } from "@/app/demo/(shared)/data/services";

/* ---------- utils ---------- */

function cls(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

// Транслит RU→latin + нормализация
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

// Построить множество потомков — чтобы запретить выбирать их как parentId
function descendantsOf(id: string): Set<string> {
  const byParent = new Map<string, AdminServiceCategory[]>();
  for (const c of SERVICE_CATEGORIES) {
    if (!c.parentId) continue;
    const arr = byParent.get(c.parentId) ?? [];
    arr.push(c);
    byParent.set(c.parentId, arr);
  }
  const out = new Set<string>();
  const stack = [id];
  while (stack.length) {
    const cur = stack.pop()!;
    const kids = byParent.get(cur) ?? [];
    for (const k of kids) {
      if (!out.has(k.id)) {
        out.add(k.id);
        stack.push(k.id);
      }
    }
  }
  return out;
}

/* ---------- component ---------- */

export default function CategoryForm({ category }: { category: AdminServiceCategory }) {
  const [name, setName]   = useState(category.name);
  const [parent, setParent] = useState(category.parentId || "");
  const [slug, setSlug]   = useState(category.slug);
  const [dirty, setDirty] = useState(false);
  const [autoSlug, setAutoSlug] = useState(true); // пока пользователь не правил slug руками

  // Автогенерация slug при изменении name (если включен авто-режим)
  useEffect(() => {
    if (autoSlug) setSlug(slugify(name));
  }, [name, autoSlug]);

  const forbiddenParents = useMemo(() => {
    const s = descendantsOf(category.id);
    s.add(category.id); // сам себя как родителя — нельзя
    return s;
  }, [category.id]);

  const errors = useMemo(() => {
    const xs: string[] = [];
    if (!name.trim()) xs.push("Укажите название категории.");
    if (name.trim().length > 80) xs.push("Название слишком длинное (макс. 80).");

    if (!slug.trim()) xs.push("Slug обязателен.");
    if (slug.length > 80) xs.push("Slug слишком длинный (макс. 80).");
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      xs.push("Slug может содержать только латиницу, цифры и дефисы; без пробелов и подряд идущих дефисов.");
    }

    if (forbiddenParents.has(parent)) {
      xs.push("Нельзя выбрать текущую категорию или её потомка как родителя.");
    }

    // Мягкая проверка уникальности slug среди остальных
    const dup = SERVICE_CATEGORIES.find(c => c.slug === slug && c.id !== category.id);
    if (dup) xs.push(`Такой slug уже используется: «${dup.name}».`);

    return xs;
  }, [name, slug, parent, forbiddenParents, category.id]);

  const canSave = dirty && errors.length === 0;

  const onSave = () => {
    if (!canSave) return;
    // здесь мог бы быть реальный запрос на сохранение
    alert("Сохранено (демо)");
    setDirty(false);
    setAutoSlug(true);
  };

  return (
    <section
      className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5 backdrop-blur-sm"
      aria-labelledby="svc-cat-form-title"
    >
      {/* Заголовок + индикатор состояния */}
      <div className="flex items-center justify-between gap-2">
        <h2 id="svc-cat-form-title" className="text-sm font-medium">
          Свойства категории
        </h2>
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

      {/* Поля */}
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
            placeholder="Например: Массажи"
            maxLength={80}
          />
          <span className="text-[11px] text-white/50">До 80 символов</span>
        </label>

        {/* Родитель */}
        <label className="grid gap-1">
          <span className="text-xs opacity-70">Родитель</span>
          <select
            className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/30"
            value={parent}
            onChange={(e) => {
              setParent(e.target.value);
              setDirty(true);
            }}
          >
            <option value="">— Корневая —</option>
            {SERVICE_CATEGORIES
              .filter(c => c.id !== category.id && !forbiddenParents.has(c.id))
              .map(c => (
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
              className="flex-1 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/30"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value.toLowerCase());
                setAutoSlug(false); // пользователь правит вручную
                setDirty(true);
              }}
              placeholder="hair"
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
            Урл-сегмент (латиница/цифры/дефис). Пример:{" "}
            <code className="opacity-80">/services/c/{slug || "slug"}</code>
          </div>
        </label>
      </div>

      {/* Ошибки */}
      {errors.length > 0 && (
        <ul className="mt-3 list-disc space-y-1 rounded-xl border border-rose-400/20 bg-rose-400/5 p-3 text-xs text-rose-300 pl-5">
          {errors.map(e => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}

      {/* Кнопки */}
      <div className="mt-3 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => {
            setName(category.name);
            setParent(category.parentId || "");
            setSlug(category.slug);
            setAutoSlug(true);
            setDirty(false);
          }}
          className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm hover:bg-white/15"
          title="Сбросить изменения"
        >
          Сбросить
        </button>
        <button
          onClick={onSave}
          disabled={!canSave}
          className="rounded-xl bg-white px-4 py-2 text-sm text-black disabled:opacity-50"
          title={errors.length ? "Исправьте ошибки выше" : dirty ? "Сохранить изменения" : "Нет изменений"}
        >
          Сохранить
        </button>
      </div>

      {/* Примечание про адаптивность */}
      <div className="mt-2 text-xs text-white/60">
        На мобильных редактор формирует вертикальные поля, подсказки остаются кликабельными; инпуты увеличены для тач-ввода.
      </div>
    </section>
  );
}