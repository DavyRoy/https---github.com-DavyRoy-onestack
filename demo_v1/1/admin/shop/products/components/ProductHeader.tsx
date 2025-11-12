// app/demo/admin/shop/products/components/ProductHeader.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { PRODUCTS, type Product } from "@/app/demo/(shared)/data/catalog/products.food";

export default function ProductHeader({
  product,
  dirty,
  onSave,
}: {
  product: Product;
  dirty: boolean;
  onSave: () => void;
}) {
  const pathname = usePathname();
  const base =
    pathname?.startsWith("/demo/manager")
      ? "/demo/manager"
      : pathname?.startsWith("/demo/user")
      ? "/demo/user"
      : "/demo/admin";

  // хоткей: Ctrl/Cmd+S -> сохранить
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isSave = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s";
      if (isSave) {
        e.preventDefault();
        if (dirty) onSave();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dirty, onSave]);

  const [menuOpen, setMenuOpen] = useState(false);

  const statusTone = (s: Product["status"]) =>
    s === "active"
      ? "bg-emerald-400/15 text-emerald-300"
      : s === "draft"
      ? "bg-amber-400/15 text-amber-300"
      : "bg-white/10 text-white/70";

  const fmtDate = (iso?: string) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return Number.isNaN(d.getTime())
      ? iso
      : d.toLocaleDateString("ru-RU", { year: "numeric", month: "2-digit", day: "2-digit" });
  };

  const chips = useMemo(
    () => [
      { label: "Цена", value: isFinite(product.price) ? `${product.price.toLocaleString("ru-RU")} ₽` : "—" },
      {
        label: "Остаток",
        value:
          typeof (product as any).stock === "number"
            ? (product as any).stock.toLocaleString("ru-RU")
            : typeof (product as any).stockTotal === "number"
            ? (product as any).stockTotal.toLocaleString("ru-RU")
            : "—",
      },
      { label: "Обновлён", value: fmtDate(product.updatedAt) },
    ],
    [product]
  );

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Скопировано");
    } catch {
      // fallback
      const ok = window.prompt("Скопируйте вручную:", text);
      if (ok) void 0;
    }
  };

  return (
    <header className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5 backdrop-blur-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        {/* Левая часть: хлебные крошки, заголовок, статусы/метаданные */}
        <div className="min-w-0">
          <nav className="text-xs text-white/60" aria-label="Хлебные крошки">
            <Link href={`${base}/shop`} className="hover:underline">
              Магазин
            </Link>
            <span className="mx-1">/</span>
            <Link href={`${base}/shop/products`} className="hover:underline">
              Товары
            </Link>
            <span className="mx-1">/</span>
            <span className="text-white/80" aria-current="page">
              {product.name}
            </span>
          </nav>

          <h1 className="mt-1 text-xl md:text-2xl font-semibold tracking-tight truncate">
            {product.name}
          </h1>

          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-white/70">
            <span>
              SKU:{" "}
              <button
                type="button"
                onClick={() => copy(product.sku)}
                className="font-mono underline decoration-dotted hover:decoration-solid"
                title="Скопировать SKU"
              >
                {product.sku}
              </button>
            </span>
            <span className="opacity-40">•</span>
            <span>
              ID:{" "}
              <button
                type="button"
                onClick={() => copy(product.id)}
                className="font-mono underline decoration-dotted hover:decoration-solid"
                title="Скопировать ID"
              >
                {product.id}
              </button>
            </span>
            <span className="opacity-40">•</span>
            <span className={`inline-block rounded px-1.5 py-0.5 text-[11px] align-middle ${statusTone(product.status)}`}>
              {product.status}
            </span>
            {product.categoryName && (
              <>
                <span className="opacity-40">•</span>
                <span className="truncate">Категория: {product.categoryName}</span>
              </>
            )}
          </div>

          {/* Чипы */}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {chips.map((c) => (
              <div
                key={c.label}
                className="rounded-xl border border-white/15 bg-white/10 px-2.5 py-1 text-xs"
              >
                <span className="text-white/60">{c.label}: </span>
                <span className="font-medium">{c.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Правая часть: действия */}
        <div className="flex items-center gap-2">
          <Link
            href={`${base}/shop/products/${product.id}?view=public`}
            className="rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15"
            title="Открыть на витрине (демо-ссылка)"
          >
            Просмотр
          </Link>

          <button
            onClick={() => alert("Экспорт (демо)")}
            className="rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15"
          >
            Экспорт
          </button>

          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              className="rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15"
            >
              Действия
            </button>
            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 min-w-48 rounded-xl border border-white/15 bg-black/70 backdrop-blur-md p-1 shadow-xl"
              >
                <button
                  role="menuitem"
                  className="w-full rounded-lg px-3 py-2 text-sm text-left hover:bg-white/10"
                  onClick={() => {
                    alert("Дубликат создан (демо)");
                    setMenuOpen(false);
                  }}
                >
                  Создать дубликат
                </button>
                {product.status !== "archived" ? (
                  <button
                    role="menuitem"
                    className="w-full rounded-lg px-3 py-2 text-sm text-left hover:bg-white/10"
                    onClick={() => {
                      const ok = confirm("Архивировать товар? Его не будет видно в витрине.");
                      if (ok) alert("Архивирован (демо)");
                      setMenuOpen(false);
                    }}
                  >
                    Архивировать
                  </button>
                ) : (
                  <button
                    role="menuitem"
                    className="w-full rounded-lg px-3 py-2 text-sm text-left hover:bg-white/10"
                    onClick={() => {
                      alert("Разархивирован (демо)");
                      setMenuOpen(false);
                    }}
                  >
                    Разархивировать
                  </button>
                )}
              </div>
            )}
          </div>

          <button
            onClick={onSave}
            disabled={!dirty}
            className="rounded-xl bg-white px-4 py-2 text-sm text-black disabled:opacity-50"
            title={dirty ? "Сохранить (Ctrl/Cmd+S)" : "Нет несохранённых изменений"}
          >
            Сохранить
          </button>
        </div>
      </div>
    </header>
  );
}