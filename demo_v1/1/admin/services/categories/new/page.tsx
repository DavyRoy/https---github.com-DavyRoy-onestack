// app/demo/admin/services/categories/new/page.tsx
"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { SERVICE_CATEGORIES } from "@/app/demo/(shared)/data/services";

/** Определяем базовый префикс интерфейса */
function getBaseFromPath(pathname: string | null) {
  if (!pathname) return "/demo/admin";
  if (pathname.startsWith("/demo/manager")) return "/demo/manager";
  if (pathname.startsWith("/demo/user")) return "/demo/user";
  return "/demo/admin";
}

/** Генерация slug на лету */
function makeSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[ё]/g, "e")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 60);
}

export default function AdminServiceCategoryNewPage() {
  const router = useRouter();
  const pathname = usePathname();
  const base = getBaseFromPath(pathname);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [parent, setParent] = useState("");
  const [error, setError] = useState("");

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slug || slug === makeSlug(name)) {
      setSlug(makeSlug(val));
    }
  };

  const save = () => {
    if (!name.trim()) {
      setError("Введите название категории");
      return;
    }
    if (!slug.trim()) {
      setError("Введите slug категории");
      return;
    }
    alert(`Категория "${name}" создана (демо).`);
    router.push(`${base}/services/categories`);
  };

  return (
    <div className="grid gap-6">
      {/* Заголовок */}
      <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <nav className="text-xs text-white/60">
            <Link href={`${base}/services`} className="hover:underline">Услуги</Link>
            <span className="mx-1">/</span>
            <Link href={`${base}/services/categories`} className="hover:underline">Категории</Link>
            <span className="mx-1">/</span>
            <span className="text-white/80">Новая категория</span>
          </nav>
          <h1 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight">
            Новая категория
          </h1>
          <p className="mt-1 text-sm text-white/70">
            Создание новой категории услуг (демо).
          </p>
        </div>
        <Link
          href={`${base}/services/categories`}
          className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
        >
          Отмена
        </Link>
      </header>

      {/* Форма */}
      <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 grid gap-4 md:max-w-lg">
        <label className="grid gap-1">
          <span className="text-xs opacity-70">Название категории *</span>
          <input
            className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none"
            placeholder="Например: Волосы, SPA, Маникюр"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
          />
        </label>

        <label className="grid gap-1">
          <span className="text-xs opacity-70">Slug (URL)</span>
          <input
            className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none font-mono"
            placeholder="auto-generated"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
          <span className="text-[11px] text-white/50">
            Используется в URL и API. Только латиница, цифры и дефисы.
          </span>
        </label>

        <label className="grid gap-1">
          <span className="text-xs opacity-70">Родительская категория</span>
          <select
            className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none"
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
          <span className="text-[11px] text-white/50">
            Можно выбрать для создания подкатегории.
          </span>
        </label>

        {error && <div className="text-sm text-rose-400">{error}</div>}

        <div className="flex justify-end gap-3 pt-2">
          <Link
            href={`${base}/services/categories`}
            className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
          >
            Отмена
          </Link>
          <button
            onClick={save}
            className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90"
          >
            Создать
          </button>
        </div>
      </section>

      {/* Подсказка */}
      <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 text-xs text-white/60 leading-relaxed">
        Категории используются для группировки услуг в интерфейсе клиентов и менеджеров.
        После создания категории вы сможете:
        <ul className="list-disc list-inside mt-1 space-y-1">
          <li>Добавить подкатегории;</li>
          <li>Привязать услуги к категории;</li>
          <li>Задать иконку или порядок отображения (в будущем).</li>
        </ul>
      </section>
    </div>
  );
}