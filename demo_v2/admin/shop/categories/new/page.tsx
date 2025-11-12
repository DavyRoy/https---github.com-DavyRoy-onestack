// app/demo/admin/shop/categories/new/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useCatalog } from "@/app/demo/(shared)/hooks/useCatalog";
import { getIconById, DefaultIcon } from "@/app/lib/catalog/iconRegistry";

// Свободный строковый id иконки
type IconId = string;

function getBaseFromPath(pathname: string | null) {
  if (!pathname) return "/demo/admin";
  if (pathname.startsWith("/demo/manager")) return "/demo/manager";
  if (pathname.startsWith("/demo/user")) return "/demo/user";
  return "/demo/admin";
}

// Единый slugify (как в форме редактирования): транслитерация + коллапс дефисов
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
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function AdminCategoryNewPage() {
  const router = useRouter();
  const pathname = usePathname();
  const base = getBaseFromPath(pathname);

  const { categories, loading, error } = useCatalog({ source: "food" });

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [parent, setParent] = useState("");
  const [iconId, setIconId] = useState<IconId>("");
  const [dirty, setDirty] = useState(false);
  const [autoSlug, setAutoSlug] = useState(true); // пока пользователь сам не трогал slug — генерим из name

  // защита от случайного закрытия при несохранённых изменениях
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  // плоский список категорий для селекта (с визуальной иерархией)
  const flatOptions = useMemo(() => {
    const byParent: Record<string, typeof categories> = {};
    categories.forEach((c) => {
      const pid = c.parentId ?? "";
      (byParent[pid] ||= []).push(c);
    });
    Object.values(byParent).forEach((arr) =>
      arr.sort((a, b) => a.name.localeCompare(b.name, "ru"))
    );

    const result: Array<{ id: string; label: string }> = [];
    const walk = (pid: string, depth: number) => {
      (byParent[pid] || []).forEach((c) => {
        result.push({ id: c.id, label: `${"— ".repeat(depth)}${c.name}` });
        walk(c.id, depth + 1);
      });
    };
    walk("", 0);
    return result;
  }, [categories]);

  // Подсказки по иконкам — используем реально встречающиеся iconId из справочника
  const suggestedIconIds: string[] = useMemo(() => {
    const set = new Set<string>();
    for (const c of categories) {
      if (c.iconId) set.add(c.iconId);
    }
    // плюс несколько частых дефолтов на случай пустого справочника
    if (set.size === 0) ["folder", "box", "utensils", "apple", "milk", "bread", "fish", "coffee", "wheat", "pizza", "cookie", "leaf", "carrot"]
      .forEach((id) => set.add(id));
    return Array.from(set).slice(0, 48); // не раздуваем сетку
  }, [categories]);

  // проверки на дубликаты
  const slugExists = useMemo(() => {
    const s = slug.trim();
    if (!s) return false;
    return categories.some((c) => (c.slug || "").toLowerCase() === s.toLowerCase());
  }, [slug, categories]);

  const nameExists = useMemo(() => {
    const n = name.trim();
    if (!n) return false;
    return categories.some((c) => c.name.toLowerCase() === n.toLowerCase());
  }, [name, categories]);

  // простейшая валидация
  const nameTooLong = name.trim().length > 80;
  const slugTooLong = slug.trim().length > 80;

  const save = () => {
    let finalSlug = slug.trim();
    if (!name.trim()) {
      alert("Введите название категории");
      return;
    }
    if (!finalSlug) {
      finalSlug = slugify(name);
      setSlug(finalSlug);
      if (!finalSlug) {
        alert("Невозможно сгенерировать slug");
        return;
      }
    }
    if (nameTooLong) {
      alert("Название слишком длинное (макс. 80 символов).");
      return;
    }
    if (slugTooLong) {
      alert("Slug слишком длинный (макс. 80 символов).");
      return;
    }
    if (slugExists) {
      alert("Такой slug уже используется. Укажите другой.");
      return;
    }

    // демо-сохранение
    alert("Категория создана (демо)");
    setDirty(false);
    router.push(`${base}/shop/categories`);
  };

  // предпросмотр иконки
  const IconPreview = (props: { id?: string; className?: string }) => {
    const Comp = getIconById(props.id) ?? DefaultIcon;
    return <Comp className={props.className} />;
  };

  return (
    <>
      <section className="admin-section border-white/12 bg-white/8">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <span className="admin-chip mb-1 bg-white/12 text-white/75">Категории</span>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">
              Новая категория
            </h1>
            <p className="mt-1 text-sm text-white/70">Создание новой категории каталога</p>
          </div>
          <Link
            href={`${base}/shop/categories`}
            prefetch={false}
            className="rounded-xl border border-white/12 bg-white/10 px-4 py-2 text-sm text-white/80 transition hover:border-white/18 hover:bg-white/16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            Отмена
          </Link>
        </div>
      </section>

      {loading && (
        <section
          className="admin-section border-white/12 bg-white/8 grid gap-2"
          role="status"
          aria-busy="true"
          aria-live="polite"
        >
          <div className="h-4 w-40 rounded bg-white/10 animate-pulse" />
          <div className="h-9 w-full rounded bg-white/10 animate-pulse" />
          <div className="h-9 w-full rounded bg-white/10 animate-pulse" />
          <span className="sr-only">Загрузка справочника категорий…</span>
        </section>
      )}

      {error && (
        <section className="rounded-2xl border border-amber-400/40 bg-amber-500/15 p-4 text-sm text-amber-100">
          Не удалось загрузить справочник категорий: {error}
        </section>
      )}

      <section className="admin-section border-white/12 bg-white/8 grid gap-3">
        {/* Название */}
        <label className="grid gap-1">
          <span className="text-xs opacity-70">Название *</span>
          <input
            className="rounded-xl border border-white/12 bg-white/10 px-3 py-2 text-sm text-white/85 outline-none transition focus-visible:ring-2 focus-visible:ring-white/30"
            value={name}
            onChange={(e) => {
              const v = e.target.value;
              setName(v);
              if (autoSlug) setSlug(slugify(v));
              setDirty(true);
            }}
            placeholder="Напр. Овощи"
            maxLength={80}
            required
          />
          {nameExists && (
            <span className="text-[11px] text-amber-300">Категория с таким названием уже существует</span>
          )}
          {nameTooLong && (
            <span className="text-[11px] text-amber-300">Слишком длинное название (макс. 80)</span>
          )}
        </label>

        {/* Slug */}
        <label className="grid gap-1">
          <span className="text-xs opacity-70">Slug</span>
          <div className="flex items-center gap-2">
            <input
              className="flex-1 rounded-xl border border-white/12 bg-white/10 px-3 py-2 text-sm font-mono text-white/85 outline-none transition focus-visible:ring-2 focus-visible:ring-white/30"
              value={slug}
              onChange={(e) => {
                setSlug(slugify(e.target.value));
                setAutoSlug(false); // пользователь вручную изменил slug
                setDirty(true);
              }}
              placeholder="ovoshchi"
              maxLength={80}
              aria-describedby="slug-help"
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
          <div id="slug-help" className="text-[11px] text-white/60">
            Используется в URL и фильтрах. Пример: <code className="opacity-80">/shop/c/{slug || "slug"}</code>
          </div>
          {slugExists && <span className="text-[11px] text-red-300">Такой slug уже используется</span>}
          {slugTooLong && <span className="text-[11px] text-amber-300">Слишком длинный slug (макс. 80)</span>}
        </label>

        {/* Родитель */}
        <label className="grid gap-1">
          <span className="text-xs opacity-70">Родительская категория</span>
          <select
            className="rounded-xl border border-white/12 bg-white/10 px-3 py-2 text-sm text-white/85 outline-none transition focus-visible:ring-2 focus-visible:ring-white/30"
            value={parent}
            onChange={(e) => {
              setParent(e.target.value);
              setDirty(true);
            }}
            disabled={loading}
          >
            <option value="">— Без родителя —</option>
            {flatOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </label>

        {/* Иконка */}
        <fieldset className="grid gap-2">
          <legend className="text-xs opacity-70">Иконка категории</legend>

          {/* Ввод iconId с предпросмотром */}
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg border border-white/12 bg-white/10">
              <IconPreview id={iconId} className="h-4 w-4 opacity-80" />
            </div>
            <input
              className="flex-1 rounded-xl border border-white/12 bg-white/10 px-3 py-2 text-sm text-white/85 outline-none transition focus-visible:ring-2 focus-visible:ring-white/30"
              value={iconId}
              onChange={(e) => {
                setIconId(e.target.value.trim());
                setDirty(true);
              }}
              placeholder="напр. apple, milk, folder…"
              aria-describedby="icon-help"
            />
          </div>

          <div id="icon-help" className="text-[11px] text-white/60">
            Введите ключ иконки из реестра (см. используемые ниже) — предпросмотр справа.
          </div>

          {/* Подсказки: уже используемые в справочнике iconId */}
          <div className="grid grid-cols-3 gap-2 xs:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
            {suggestedIconIds.map((id) => {
              const active = iconId === id;
              const Icon = (getIconById(id) ?? DefaultIcon) as any;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setIconId(id);
                    setDirty(true);
                  }}
                  aria-pressed={active}
                  className={`flex items-center gap-2 rounded-xl border px-2 py-2 text-xs transition ${
                    active
                      ? "border-white/40 bg-white/12 text-white"
                      : "border-white/12 bg-white/8 text-white/80 hover:border-white/18 hover:bg-white/14"
                  }`}
                  title={id}
                >
                  <Icon className="h-4 w-4 opacity-80" />
                  <span className="truncate">{id}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Кнопка */}
        <div className="flex justify-end">
          <button
            onClick={save}
            disabled={!name.trim() || !!error || loading || nameTooLong || slugTooLong || slugExists}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/90 disabled:opacity-40"
            title={
              !name.trim()
                ? "Укажите название"
                : slugExists
                ? "Такой slug уже используется"
                : nameTooLong || slugTooLong
                ? "Исправьте длину полей"
                : undefined
            }
          >
            Создать
          </button>
        </div>
      </section>

      <div className="admin-section border-white/12 bg-white/8 text-white/70 text-xs leading-relaxed">
        Категории из справочника автоматически появятся в фильтрах, дереве и карточках товаров.
        Иконки помогают быстрее ориентироваться в больших каталогах.
      </div>
    </>
  );
}