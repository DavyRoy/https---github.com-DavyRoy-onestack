// app/demo/admin/shop/categories/new/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useCatalog } from "@/app/demo/(shared)/hooks/useCatalog";
import { ICONS, ICON_IDS } from "@/app/lib/catalog/iconRegistry"; // реестр иконок

type IconId = typeof ICON_IDS[number];

function getBaseFromPath(pathname: string | null) {
  if (!pathname) return "/demo/admin";
  if (pathname.startsWith("/demo/manager")) return "/demo/manager";
  if (pathname.startsWith("/demo/user")) return "/demo/user";
  return "/demo/admin";
}

function slugify(s: string) {
  return s
    .trim()
    .toLowerCase()
    .replace(/[ё]/g, "e")
    .replace(/[^a-z0-9\u0430-\u044f\-_\s]/g, "") // латиница+кириллица+дефис+подчёркивание+пробел
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function AdminCategoryNewPage() {
  const router = useRouter();
  const pathname = usePathname();
  const base = getBaseFromPath(pathname);

  // Подтягиваем единый каталог (food)
  const { categories, loading, error } = useCatalog({ source: "food" });

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [parent, setParent] = useState("");
  const [iconId, setIconId] = useState<IconId | "">(ICON_IDS[0]);
  const [dirty, setDirty] = useState(false);

  // защита от случайного ухода
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  // древовидный список для селекта (плоский с отступами)
  const flatOptions = useMemo(() => {
    const byParent: Record<string, typeof categories> = {};
    categories.forEach((c) => {
      const pid = c.parentId ?? "";
      (byParent[pid] ||= []).push(c);
    });
    Object.values(byParent).forEach((arr) => arr.sort((a, b) => a.name.localeCompare(b.name, "ru")));

    const res: Array<{ id: string; label: string }> = [];
    const walk = (pid: string, depth: number) => {
      (byParent[pid] || []).forEach((c) => {
        res.push({ id: c.id, label: `${"— ".repeat(depth)}${c.name}` });
        walk(c.id, depth + 1);
      });
    };
    walk("", 0);
    return res;
  }, [categories]);

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

  const save = () => {
    if (!name.trim()) {
      alert("Введите название категории");
      return;
    }
    if (!slug.trim()) {
      const auto = slugify(name);
      setSlug(auto);
      if (!auto) {
        alert("Невозможно сгенерировать slug");
        return;
      }
    }
    if (slugExists) {
      alert("Такой slug уже используется. Укажите другой.");
      return;
    }

    // Демо: просто уведомляем и уходим к списку
    alert("Категория создана (демо)");
    setDirty(false);
    router.push(`${base}/shop/categories`);
  };

  return (
    <div className="grid gap-6">
      {/* Header */}
      <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Новая категория</h1>
          <p className="mt-1 text-sm text-white/70">Создание новой категории каталога</p>
        </div>
        <Link
          href={`${base}/shop/categories`}
          className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
        >
          Отмена
        </Link>
      </header>

      {/* Состояния загрузки/ошибки каталога */}
      {loading && (
        <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 grid gap-2">
          <div className="h-4 w-40 rounded bg-white/10 animate-pulse" />
          <div className="h-9 w-full rounded bg-white/10 animate-pulse" />
          <div className="h-9 w-full rounded bg-white/10 animate-pulse" />
        </section>
      )}
      {error && (
        <section className="rounded-2xl border border-white/15 bg-amber-500/10 p-4 text-amber-200 text-sm">
          Не удалось загрузить справочник категорий: {error}
        </section>
      )}

      {/* Форма */}
      <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 grid gap-3">
        {/* Название */}
        <label className="grid gap-1">
          <span className="text-xs opacity-70">Название *</span>
          <input
            className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!slug) setSlug(slugify(e.target.value));
              setDirty(true);
            }}
            placeholder="Напр. Овощи"
            required
          />
          {nameExists && (
            <span className="text-[11px] text-amber-300">Категория с таким названием уже существует</span>
          )}
        </label>

        {/* Slug */}
        <label className="grid gap-1">
          <span className="text-xs opacity-70">Slug</span>
          <input
            className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none font-mono"
            value={slug}
            onChange={(e) => {
              setSlug(slugify(e.target.value));
              setDirty(true);
            }}
            placeholder="ovoshchi"
          />
          <div className="text-[11px] text-white/60">Используется в URL и фильтрах</div>
          {slugExists && (
            <span className="text-[11px] text-red-300">Такой slug уже используется</span>
          )}
        </label>

        {/* Родитель */}
        <label className="grid gap-1">
          <span className="text-xs opacity-70">Родительская категория</span>
          <select
            className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm outline-none"
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
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {ICON_IDS.map((id) => {
              const Icon = ICONS[id];
              const active = iconId === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setIconId(id);
                    setDirty(true);
                  }}
                  className={
                    "flex items-center gap-2 rounded-xl border px-2 py-2 text-xs " +
                    (active
                      ? "border-white/40 bg-white/10"
                      : "border-white/15 bg-white/5 hover:bg-white/10")
                  }
                  title={id}
                >
                  <Icon className="w-4 h-4 opacity-80" />
                  <span className="truncate">{id}</span>
                </button>
              );
            })}
          </div>
          <div className="text-[11px] text-white/60">
            Иконки берутся из общего реестра (`iconRegistry`) и используются в списках/дереве.
          </div>
        </fieldset>

        <div className="flex justify-end">
          <button
            onClick={save}
            disabled={!name.trim() || !!error || loading}
            className="rounded-xl bg-white px-4 py-2 text-sm text-black disabled:opacity-50 hover:bg-white/90"
          >
            Создать
          </button>
        </div>
      </section>

      {/* Подсказка */}
      <div className="rounded-2xl border border-white/15 bg-white/[0.04] p-4">
        <div className="text-sm font-medium">Подсказка</div>
        <p className="text-xs text-white/70 mt-1">
          Категории из общего справочника сразу видны в фильтрах и страницах товаров. Иконка облегчает навигацию в дереве и в каталоге.
        </p>
      </div>
    </div>
  );
}