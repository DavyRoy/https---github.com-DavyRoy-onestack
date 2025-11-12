// app/demo/admin/shop/products/components/ProductHeader.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useId, useCallback } from "react";
import { usePathname } from "next/navigation";
import type { Product } from "@/app/demo/(shared)/data/catalog/products.food";

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
  const base = useMemo(() => {
    if (pathname?.startsWith("/demo/manager")) return "/demo/manager";
    if (pathname?.startsWith("/demo/user")) return "/demo/user";
    return "/demo/admin";
  }, [pathname]);

  // хоткей: Ctrl/Cmd+S -> сохранить
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (dirty) onSave();
      }
    };
    window.addEventListener("keydown", onKey, { passive: false });
    return () => window.removeEventListener("keydown", onKey);
  }, [dirty, onSave]);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const firstItemRef = useRef<HTMLButtonElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const menuId = useId();

  // закрытие меню по клику вне
  useEffect(() => {
    if (!menuOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [menuOpen]);

  // автофокус в меню
  useEffect(() => {
    if (menuOpen) {
      const t = setTimeout(() => firstItemRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [menuOpen]);

  const statusTone = (s: Product["status"]) =>
    s === "active"
      ? "bg-emerald-400/15 text-emerald-300"
      : s === "draft"
      ? "bg-amber-400/15 text-amber-300"
      : "bg-white/10 text-white/70";

  const fmtMoney = useCallback((num?: number) => {
    if (!Number.isFinite(num as number)) return "—";
    try {
      return new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
        maximumFractionDigits: 0,
        currencyDisplay: "narrowSymbol",
      }).format(num as number);
    } catch {
      return `${new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(
        num as number
      )} ₽`;
    }
  }, []);

  const fmtDate = (iso?: string) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return Number.isNaN(d.getTime())
      ? iso
      : d.toLocaleDateString("ru-RU", { year: "numeric", month: "2-digit", day: "2-digit" });
  };

  const stockValue = () => {
    const s =
      typeof (product as any).stockTotal === "number"
        ? (product as any).stockTotal
        : typeof (product as any).stock === "number"
        ? (product as any).stock
        : null;
    return s == null ? "—" : Number(s).toLocaleString("ru-RU");
  };

  const chips = useMemo(
    () => [
      { label: "Цена", value: fmtMoney(product.price as number) },
      { label: "Остаток", value: stockValue() },
      { label: "Обновлён", value: fmtDate(product.updatedAt) },
    ],
    [fmtMoney, product]
  );

  const canCopySku = !!product.sku;
  const canCopyId = !!product.id;

  const copy = async (text?: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      // можно воткнуть тост — в демо просто no-op
      // eslint-disable-next-line no-console
      console.info("Скопировано:", text);
    } catch {
      window.prompt("Скопируйте вручную:", text);
    }
  };

  // навигация в меню стрелками
  const onMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const items = menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]');
    if (!items || items.length === 0) return;
    const current = document.activeElement as HTMLButtonElement | null;
    const idx = Array.from(items).indexOf(current as HTMLButtonElement);

    const focusAt = (i: number) => items[i]?.focus();

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        focusAt(idx >= 0 ? (idx + 1) % items.length : 0);
        break;
      case "ArrowUp":
        e.preventDefault();
        focusAt(idx >= 0 ? (idx - 1 + items.length) % items.length : items.length - 1);
        break;
      case "Home":
        e.preventDefault();
        focusAt(0);
        break;
      case "End":
        e.preventDefault();
        focusAt(items.length - 1);
        break;
      case "Escape":
        setMenuOpen(false);
        menuButtonRef.current?.focus();
        break;
    }
  };

  return (
    <header className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5 backdrop-blur-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        {/* Левая часть */}
        <div className="min-w-0">
          <nav
            className="text-xs text-white/60 flex flex-wrap items-center gap-x-1 gap-y-1"
            aria-label="Хлебные крошки"
          >
            <Link href={`${base}/shop`} className="hover:underline" prefetch={false}>
              Магазин
            </Link>
            <span className="mx-1">/</span>
            <Link href={`${base}/shop/products`} className="hover:underline" prefetch={false}>
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
                className={cls(
                  "font-mono underline decoration-dotted hover:decoration-solid",
                  !canCopySku && "opacity-50 cursor-not-allowed"
                )}
                title={canCopySku ? "Скопировать SKU" : "SKU отсутствует"}
                disabled={!canCopySku}
              >
                {product.sku || "—"}
              </button>
            </span>
            <span className="opacity-40">•</span>
            <span>
              ID:{" "}
              <button
                type="button"
                onClick={() => copy(product.id)}
                className={cls(
                  "font-mono underline decoration-dotted hover:decoration-solid",
                  !canCopyId && "opacity-50 cursor-not-allowed"
                )}
                title={canCopyId ? "Скопировать ID" : "ID отсутствует"}
                disabled={!canCopyId}
              >
                {product.id || "—"}
              </button>
            </span>
            <span className="opacity-40">•</span>
            <span
              className={`inline-block rounded px-1.5 py-0.5 text-[11px] align-middle ${statusTone(
                product.status
              )}`}
            >
              <span className="sr-only">Статус: </span>
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
          <div className="mt-2 flex flex-wrap items-center gap-2" aria-live="polite">
            {chips.map((c) => (
              <div
                key={c.label}
                className="rounded-xl border border-white/15 bg-white/10 px-2.5 py-1 text-xs"
              >
                <span className="text-white/60">{c.label}: </span>
                <span className="font-medium tabular-nums">{c.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Правая часть: действия */}
        <div className="flex w-full sm:w-auto flex-col sm:flex-row gap-2 sm:items-center sm:flex-wrap sm:justify-end">
          <Link
            href={`${base}/shop/products/${product.id}?view=public`}
            prefetch={false}
            className="w-full sm:w-auto rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15"
            title="Открыть на витрине (демо-ссылка)"
          >
            Просмотр
          </Link>

          <button
            type="button"
            onClick={() => alert("Экспорт (демо)")}
            className="w-full sm:w-auto rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15"
          >
            Экспорт
          </button>

          <div className="relative w-full sm:w-auto" ref={menuRef}>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-haspopup="true"
              aria-expanded={menuOpen}
              aria-controls={menuId}
              className="w-full sm:w-auto rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15"
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setMenuOpen(true);
                }
              }}
            >
              Действия
            </button>
            {menuOpen && (
              <div
                id={menuId}
                role="menu"
                className="absolute right-0 mt-2 min-w-48 max-w-[90vw] break-words rounded-xl border border-white/15 bg-black/70 backdrop-blur-md p-1 shadow-xl"
                onKeyDown={onMenuKeyDown}
              >
                <button
                  ref={firstItemRef}
                  type="button"
                  role="menuitem"
                  className="w-full rounded-lg px-3 py-2 text-sm text-left hover:bg-white/10"
                  onClick={() => {
                    alert("Дубликат создан (демо)");
                    setMenuOpen(false);
                    menuButtonRef.current?.focus();
                  }}
                >
                  Создать дубликат
                </button>
                {product.status !== "archived" ? (
                  <button
                    type="button"
                    role="menuitem"
                    className="w-full rounded-lg px-3 py-2 text-sm text-left hover:bg-white/10"
                    onClick={() => {
                      const ok = confirm("Архивировать товар? Его не будет видно в витрине.");
                      if (ok) alert("Архивирован (демо)");
                      setMenuOpen(false);
                      menuButtonRef.current?.focus();
                    }}
                  >
                    Архивировать
                  </button>
                ) : (
                  <button
                    type="button"
                    role="menuitem"
                    className="w-full rounded-lg px-3 py-2 text-sm text-left hover:bg-white/10"
                    onClick={() => {
                      alert("Разархивирован (демо)");
                      setMenuOpen(false);
                      menuButtonRef.current?.focus();
                    }}
                  >
                    Разархивировать
                  </button>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onSave}
            disabled={!dirty}
            className="w-full sm:w-auto rounded-xl bg-white px-4 py-2 text-sm text-black disabled:opacity-50"
            aria-disabled={!dirty}
            title={dirty ? "Сохранить (Ctrl/Cmd+S)" : "Нет несохранённых изменений"}
          >
            Сохранить
          </button>
        </div>
      </div>
    </header>
  );
}

function cls(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}