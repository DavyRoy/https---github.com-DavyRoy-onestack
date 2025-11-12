"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Layers3, Tag, PackageSearch, Menu } from "lucide-react";

function cls(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export default function ServicesHero() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const firstItemRef = useRef<HTMLAnchorElement | null>(null);

  // Подсветка активного пункта
  const isActive = useMemo(() => {
    const p = pathname || "";
    return {
      pricing: p.startsWith("/demo/admin/services/pricing"),
      categories: p.startsWith("/demo/admin/services/categories"),
      bundles: p.startsWith("/demo/admin/services/bundles"),
    };
  }, [pathname]);

  const linkBase =
    "inline-flex items-center gap-1 rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm transition hover:bg-white/15";
  const linkActive =
    "ring-1 ring-white/30 bg-white/15 text-white";

  // Автозакрытие при смене маршрута
  useEffect(() => setOpen(false), [pathname]);

  // Закрытие по клику вне и по Escape
  useEffect(() => {
    if (!open) return;

    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (menuRef.current?.contains(target)) return;
      if (btnRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Перевод фокуса на первый пункт при открытии
  useEffect(() => {
    if (open) {
      // небольшой тик, чтобы DOM успел смонтироваться
      const t = setTimeout(() => firstItemRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [open]);

  return (
    <header className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 md:p-5 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        {/* Левая часть — заголовок */}
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight flex items-center gap-2">
            <Layers3 className="w-6 h-6 opacity-70" />
            Услуги
          </h1>
          <p className="mt-1 text-sm text-white/70">
            Управление каталогом, ценами, категориями и пакетами
          </p>
        </div>

        {/* Правая часть — навигация */}
        <nav aria-label="Навигация по разделу услуг" className="relative">
          {/* Desktop кнопки */}
          <div className="hidden sm:flex flex-wrap gap-2">
            <Link
              href="/demo/admin/services/pricing"
              className={cls(linkBase, isActive.pricing && linkActive)}
            >
              <PackageSearch className="w-4 h-4 opacity-70" />
              Прайс-лист
            </Link>

            <Link
              href="/demo/admin/services/categories"
              className={cls(linkBase, isActive.categories && linkActive)}
            >
              <Tag className="w-4 h-4 opacity-70" />
              Категории
            </Link>

            <Link
              href="/demo/admin/services/bundles"
              className={cls(linkBase, isActive.bundles && linkActive)}
            >
              <Layers3 className="w-4 h-4 opacity-70" />
              Пакеты
            </Link>
          </div>

          {/* Mobile dropdown */}
          <div className="sm:hidden relative">
            <button
              ref={btnRef}
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15"
              aria-haspopup="menu"
              aria-expanded={open}
              aria-controls="svc-hero-menu"
              id="svc-hero-menu-btn"
            >
              <Menu className="w-4 h-4 opacity-70" />
              Меню
            </button>

            {open && (
              <div
                id="svc-hero-menu"
                ref={menuRef}
                role="menu"
                aria-labelledby="svc-hero-menu-btn"
                className="absolute right-0 mt-2 w-44 rounded-xl border border-white/10 bg-black/80 backdrop-blur-sm shadow-lg p-2 text-sm z-10"
              >
                <Link
                  href="/demo/admin/services/pricing"
                  role="menuitem"
                  className={cls(
                    "block px-2 py-1.5 rounded hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30",
                    isActive.pricing && "bg-white/10"
                  )}
                  onClick={() => setOpen(false)}
                  ref={firstItemRef}
                >
                  Прайс-лист
                </Link>
                <Link
                  href="/demo/admin/services/categories"
                  role="menuitem"
                  className={cls(
                    "block px-2 py-1.5 rounded hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30",
                    isActive.categories && "bg-white/10"
                  )}
                  onClick={() => setOpen(false)}
                >
                  Категории
                </Link>
                <Link
                  href="/demo/admin/services/bundles"
                  role="menuitem"
                  className={cls(
                    "block px-2 py-1.5 rounded hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30",
                    isActive.bundles && "bg-white/10"
                  )}
                  onClick={() => setOpen(false)}
                >
                  Пакеты
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}