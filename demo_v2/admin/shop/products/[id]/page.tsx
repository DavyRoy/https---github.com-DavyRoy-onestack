// app/demo/admin/shop/products/[id]/page.tsx
"use client";

import { useEffect, useMemo, useState, useCallback, useTransition } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { PRODUCTS, type Product } from "@/app/demo/(shared)/data/catalog/products.food";
import ProductHeader from "../components/ProductHeader";
import ProductTabs from "../components/ProductTabs";
import EmptyState from "@/app/demo/(shared)/components/EmptyState";

function coerceId(raw: unknown): string | null {
  // Берём первый элемент, декодируем, убираем пустые
  const v =
    typeof raw === "string" ? raw :
    Array.isArray(raw) && raw.length ? String(raw[0]) :
    null;
  if (!v) return null;
  try {
    const dec = decodeURIComponent(v.trim());
    return dec ? dec : null;
  } catch {
    return v.trim() || null;
  }
}

// единообразный base (как в остальных страницах)
function getBaseFromPath(pathname: string | null) {
  if (!pathname) return "/demo/admin";
  if (pathname.startsWith("/demo/manager")) return "/demo/manager";
  if (pathname.startsWith("/demo/user")) return "/demo/user";
  return "/demo/admin";
}

export default function AdminProductDetailPage() {
  const params = useParams<{ id?: string | string[] }>();
  const router = useRouter();
  const pathname = usePathname();
  const base = getBaseFromPath(pathname);
  const [isNavPending, startTransition] = useTransition();

  const id = coerceId(params?.id);
  const product = useMemo<Product | undefined>(
    () => (id ? PRODUCTS.find((p) => p.id === id) : undefined),
    [id]
  );

  const [dirty, setDirty] = useState(false);

  // Сбрасываем "грязь" при смене товара
  useEffect(() => setDirty(false), [id]);

  // Защита при несохранённых изменениях — закрытие вкладки/перезагрузка
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  // Мягкий guard на переход по внешним ссылкам со страницы (опционально)
  useEffect(() => {
    if (!dirty) return;
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const a = target.closest<HTMLAnchorElement>("a[href]");
      if (!a) return;
      // Разрешим Ctrl/Cmd-клик, среднюю кнопку, внешние домены и явные data-safe
      if (e.defaultPrevented) return;
      if ((e as any).metaKey || (e as any).ctrlKey || (e as any).shiftKey || (e as any).altKey) return;
      if ((e as MouseEvent).button === 1) return;
      if (a.hasAttribute("download") || a.getAttribute("target") === "_blank" || a.dataset.safe === "true") return;

      const href = a.getAttribute("href") || "";
      // Игнорируем якоря и "пустые" ссылки
      if (href.startsWith("#") || href === "" || href === "#") return;

      const ok = confirm("Есть несохранённые изменения. Выйти без сохранения?");
      if (!ok) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    // capture=true — перехват до роутера
    document.addEventListener("click", onDocClick, true);
    return () => document.removeEventListener("click", onDocClick, true);
  }, [dirty]);

  // Обновляем заголовок вкладки
  useEffect(() => {
    const prev = document.title;
    document.title = product ? `${product.name} · Товар` : id ? "Товар" : "Товар не найден";
    return () => {
      document.title = prev;
    };
  }, [product, id]);

  const handleSave = useCallback(() => {
    if (!dirty) return;
    alert("Сохранено (демо)");
    setDirty(false);
  }, [dirty]);

  if (!id) {
    return (
      <div className="grid gap-4 md:gap-6 overflow-x-hidden">
        <header className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Некорректный идентификатор</h1>
          <Link
            href={`${base}/shop/products`}
            prefetch={false}
            className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
          >
            К списку
          </Link>
        </header>
        <EmptyState title="ID не распознан" hint="Проверьте ссылку или вернитесь к списку товаров." />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="grid gap-4 md:gap-6 overflow-x-hidden">
        <header className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Товар не найден</h1>
          <Link
            href={`${base}/shop/products`}
            prefetch={false}
            className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
          >
            К списку
          </Link>
        </header>
        <EmptyState title="Мы не нашли такой товар" hint="Возможно, он был удалён или ID указан неверно." />
      </div>
    );
  }

  const goBackSafe = () => {
    if (dirty && !confirm("Есть несохранённые изменения. Выйти без сохранения?")) return;
    startTransition(() => router.push(`${base}/shop/products`));
    // Альтернатива:
    // if (document.referrer) router.back(); else router.push(`${base}/shop/products`);
  };

  return (
    <div className="grid gap-4 md:gap-6 overflow-x-hidden">
      {/* хлебные крошки: переносимые и без горизонтального скролла */}
      <nav className="text-xs text-white/70 flex flex-wrap items-center gap-x-1 gap-y-1" aria-label="Хлебные крошки">
        <Link href={`${base}/dashboard`} prefetch={false} className="hover:underline shrink-0">
          Админ
        </Link>
        <span className="opacity-50">/</span>
        <Link href={`${base}/shop`} prefetch={false} className="hover:underline shrink-0">
          Магазин
        </Link>
        <span className="opacity-50">/</span>
        <Link href={`${base}/shop/products`} prefetch={false} className="hover:underline shrink-0">
          Товары
        </Link>
        <span className="opacity-50">/</span>
        <span className="text-white/85 min-w-0 truncate" aria-current="page">
          {product.name}
        </span>
      </nav>

      {/* ARIA-индикатор состояния сохранения */}
      <div className="sr-only" role="status" aria-live="polite">
        {dirty ? "Есть несохранённые изменения" : "Все изменения сохранены"}
      </div>

      <ProductHeader product={product} dirty={dirty} onSave={handleSave} />

      {/* Вкладки редактирования; onDirty помечает форму «грязной» */}
      <ProductTabs product={product} onDirty={() => setDirty(true)} />

      {/* Нижняя панель действий: липкая на мобильных, обычная на md+ */}
      <div
        className="
          sticky bottom-0 z-30 -mx-3 px-3 pt-2 pb-[calc(env(safe-area-inset-bottom,0)+0.75rem)]
          bg-gradient-to-t from-black/70 to-transparent backdrop-blur
          md:static md:mx-0 md:px-0 md:pt-0 md:pb-0 md:bg-transparent md:backdrop-blur-0
        "
      >
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={goBackSafe}
            className="w-full sm:w-auto rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/80 transition hover:bg-white/15"
            aria-label="Вернуться к списку товаров"
          >
            ← К списку товаров
          </button>
          <button
            onClick={handleSave}
            disabled={!dirty}
            className="w-full sm:w-auto rounded-xl bg-white px-4 py-2 text-sm text-black disabled:opacity-50"
            title={dirty ? "Сохранить (Cmd/Ctrl+S)" : "Нет изменений"}
            aria-disabled={!dirty || undefined}
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}