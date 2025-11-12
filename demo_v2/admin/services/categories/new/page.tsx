// app/demo/admin/services/categories/new/page.tsx
"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { SERVICE_CATEGORIES } from "@/app/demo/(shared)/data/services";

/** Определяем базовый префикс интерфейса */
function getBaseFromPath(pathname: string | null) {
  if (!pathname) return "/demo/admin";
  if (pathname.startsWith("/demo/manager")) return "/demo/manager";
  if (pathname.startsWith("/demo/user")) return "/demo/user";
  return "/demo/admin";
}

/** Транслитерация и нормализация slug */
function slugify(input: string) {
  const map: Record<string, string> = {
    а:"a", б:"b", в:"v", г:"g", д:"d", е:"e", ё:"e", ж:"zh", з:"z", и:"i", й:"y",
    к:"k", л:"l", м:"m", н:"n", о:"o", п:"p", р:"r", с:"s", т:"t", у:"u", ф:"f",
    х:"h", ц:"c", ч:"ch", ш:"sh", щ:"sch", ъ:"", ы:"y", ь:"", э:"e", ю:"yu", я:"ya",
  };
  return input
    .trim()
    .toLowerCase()
    .replace(/[а-яё]/g, (ch) => map[ch] ?? ch)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export default function AdminServiceCategoryNewPage() {
  const router = useRouter();
  const pathname = usePathname();
  const base = getBaseFromPath(pathname);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [autoSlug, setAutoSlug] = useState(true);
  const [parent, setParent] = useState("");

  // Автогенерация slug при изменении названия
  const onNameChange = (val: string) => {
    setName(val);
    if (autoSlug) setSlug(slugify(val));
  };

  // Валидация
  const errors = useMemo(() => {
    const xs: string[] = [];
    const trimmedName = name.trim();
    const trimmedSlug = slug.trim();

    if (!trimmedName) xs.push("Введите название категории.");
    if (trimmedName.length > 80) xs.push("Название слишком длинное (макс. 80 символов).");

    if (!trimmedSlug) xs.push("Введите slug категории.");
    if (trimmedSlug.length > 80) xs.push("Slug слишком длинный (макс. 80 символов).");
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(trimmedSlug)) {
      xs.push("Slug может содержать только латиницу, цифры и дефисы (без пробелов и спецсимволов).");
    }

    const dup = SERVICE_CATEGORIES.find((c) => c.slug === trimmedSlug);
    if (dup) xs.push(`Такой slug уже используется: «${dup.name}».`);

    return xs;
  }, [name, slug]);

  const canSave = errors.length === 0 && name.trim() && slug.trim();

  const save = () => {
    if (!canSave) return;
    alert(`Категория «${name.trim()}» создана (демо).`);
    router.push(`${base}/services/categories`);
  };

  return (
    <div className="grid gap-6">
      {/* Заголовок */}
      <section className="admin-section border-white/12 bg-white/8">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <nav className="text-xs text-white/60">
              <Link href={`${base}/services`} className="hover:underline">Услуги</Link>
              <span className="mx-1 opacity-50">/</span>
              <Link href={`${base}/services/categories`} className="hover:underline">Категории</Link>
              <span className="mx-1 opacity-50">/</span>
              <span className="text-white/80">Новая категория</span>
            </nav>
            <h1 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight">Новая категория</h1>
            <p className="mt-1 text-sm text-white/70">Создание новой категории услуг (демо).</p>
          </div>

          <Link
            href={`${base}/services/categories`}
            className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/10 px-4 py-2 text-sm text-white/80 transition hover:border-white/18 hover:bg-white/16"
          >
            Отмена
          </Link>
        </div>
      </section>

      {/* Форма */}
      <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5 grid gap-4 md:max-w-xl">
        <label className="grid gap-1">
          <span className="text-xs opacity-70">Название категории *</span>
          <input
            className="rounded-xl border border-white/12 bg-white/10 px-3 py-2 text-sm text-white/85 outline-none focus:ring-2 focus:ring-white/30"
            placeholder="Например: Волосы, SPA, Маникюр"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            maxLength={80}
          />
          <span className="text-[11px] text-white/55">До 80 символов</span>
        </label>

        <div className="grid gap-2">
          <div className="flex items-center justify-between gap-2">
            <label className="grid flex-1 gap-1">
              <span className="text-xs opacity-70">Slug (URL)</span>
              <input
                className="rounded-xl border border-white/12 bg-white/10 px-3 py-2 text-sm font-mono text-white/85 outline-none focus:ring-2 focus:ring-white/30"
                placeholder="auto-generated"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value.toLowerCase());
                  setAutoSlug(false);
                }}
                maxLength={80}
              />
            </label>
            <button
              type="button"
              onClick={() => {
                setSlug(slugify(name));
                setAutoSlug(true);
              }}
              className="self-end rounded-lg border border-white/12 bg-white/10 px-3 py-2 text-xs text-white/80 transition hover:border-white/18 hover:bg-white/16"
              title="Сгенерировать из названия"
            >
              Авто
            </button>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/65">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={autoSlug}
                onChange={(e) => setAutoSlug(e.target.checked)}
              />
              Автоматически обновлять slug по названию
            </label>
          </div>
          <div className="text-[11px] text-white/60">
            Урл-сегмент: латиница/цифры/дефис. Пример:{" "}
            <code className="opacity-80">/services/c/{slug || "slug"}</code>
          </div>
        </div>

        <label className="grid gap-1">
          <span className="text-xs opacity-70">Родительская категория</span>
          <select
            className="rounded-xl border border-white/12 bg-white/10 px-3 py-2 text-sm text-white/85 outline-none focus:ring-2 focus:ring-white/30"
            value={parent}
            onChange={(e) => setParent(e.target.value)}
          >
            <option value="">— Без родителя —</option>
            {SERVICE_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <span className="text-[11px] text-white/55">Можно выбрать для создания подкатегории.</span>
        </label>

        {/* Ошибки */}
        {errors.length > 0 && (
          <ul className="list-disc space-y-1 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-xs text-red-200 pl-5">
            {errors.map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Link
            href={`${base}/services/categories`}
            className="rounded-xl border border-white/12 bg-white/10 px-4 py-2 text-sm text-white/80 transition hover:border-white/18 hover:bg-white/16"
          >
            Отмена
          </Link>
          <button
            onClick={save}
            disabled={!canSave}
            className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/90 disabled:opacity-40"
            title={!canSave ? "Исправьте ошибки выше" : "Создать категорию"}
          >
            Создать
          </button>
        </div>
      </section>

      {/* Подсказка */}
      <section className="admin-section border-white/12 bg-white/8 text-xs text-white/60 leading-relaxed">
        Категории используются для группировки услуг в интерфейсе клиентов и менеджеров. После создания категории вы сможете:
        <ul className="list-disc list-inside mt-1 space-y-1">
          <li>Добавить подкатегории;</li>
          <li>Привязать услуги к категории;</li>
          <li>Задать иконку или порядок отображения (в будущем).</li>
        </ul>
      </section>
    </div>
  );
}