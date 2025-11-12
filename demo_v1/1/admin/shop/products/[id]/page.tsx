// app/demo/admin/shop/products/[id]/page.tsx
"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { PRODUCTS, type Product } from "@/app/demo/(shared)/data/catalog/products.food";
import ProductHeader from "../components/ProductHeader";
import ProductTabs from "../components/ProductTabs";
import Skeletons from "@/app/demo/user/shop/products/components/Skeletons";
import EmptyState from "@/app/demo/(shared)/components/EmptyState";

function coerceId(raw: unknown): string | null {
  if (typeof raw === "string" && raw.trim()) return raw;
  if (Array.isArray(raw) && raw[0]) return String(raw[0]);
  return null;
}

export default function AdminProductDetailPage() {
  const params = useParams<{ id?: string | string[] }>();
  const router = useRouter();

  const id = coerceId(params?.id);
  const product = useMemo<Product | undefined>(
    () => (id ? PRODUCTS.find((p) => p.id === id) : undefined),
    [id]
  );

  const [dirty, setDirty] = useState(false);

  // защита от закрытия вкладки/перезагрузки при несохранённых изменениях
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = ""; // нужно для некоторых браузеров
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  // хоткей Cmd/Ctrl+S = Save
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isSave = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s";
      if (isSave) {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [/* eslint-disable-line react-hooks/exhaustive-deps */]); // handleSave объявим стабильным

  const handleSave = useCallback(() => {
    if (!dirty) return;
    // демо: просто тост/alert. В реале — POST/PUT на API + оптимистичное обновление стора
    alert("Сохранено (демо)");
    setDirty(false);
  }, [dirty]);

  // 404 / неправильный id
  if (!id) {
    return (
      <div className="grid gap-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Некорректный идентификатор</h1>
          <Link
            href="/demo/admin/shop/products"
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
      <div className="grid gap-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Товар не найден</h1>
          <Link
            href="/demo/admin/shop/products"
            className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm hover:bg-white/15"
          >
            К списку
          </Link>
        </header>
        <EmptyState title="Мы не нашли такой товар" hint="Возможно, он был удалён или ID указан неверно." />
      </div>
    );
  }

  // обработчик «Назад», если есть несохранённые изменения
  const goBackSafe = () => {
    if (dirty && !confirm("Есть несохранённые изменения. Выйти без сохранения?")) return;
    router.push("/demo/admin/shop/products");
  };

  return (
    <div className="grid gap-6">
      {/* хлебные крошки */}
      <nav className="text-xs text-white/70">
        <Link href="/demo/admin/dashboard" className="hover:underline">Админ</Link>
        <span className="mx-1 opacity-50">/</span>
        <Link href="/demo/admin/shop" className="hover:underline">Магазин</Link>
        <span className="mx-1 opacity-50">/</span>
        <Link href="/demo/admin/shop/products" className="hover:underline">Товары</Link>
        <span className="mx-1 opacity-50">/</span>
        <span className="text-white/85">{product.name}</span>
      </nav>

      <ProductHeader product={product} dirty={dirty} onSave={handleSave} />

      {/* Вкладки редактирования; onDirty помечает форму «грязной» */}
      <ProductTabs product={product} onDirty={() => setDirty(true)} />

      <div className="flex items-center justify-between">
        <button
          onClick={goBackSafe}
          className="text-sm text-white/70 hover:underline"
        >
          ← К списку товаров
        </button>
        <button
          onClick={handleSave}
          disabled={!dirty}
          className="rounded-xl bg-white px-4 py-2 text-sm text-black disabled:opacity-50"
          title={dirty ? "Сохранить (Cmd/Ctrl+S)" : "Нет изменений"}
        >
          Сохранить
        </button>
      </div>
    </div>
  );
}