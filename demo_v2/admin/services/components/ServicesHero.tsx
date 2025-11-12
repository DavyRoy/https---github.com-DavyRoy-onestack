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
    "inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/10 px-3 py-1.5 text-sm text-white/80 transition hover:border-white/18 hover:bg-white/16";
  const linkActive =
    "ring-1 ring-white/30 !text-white bg-white/16";

  // Закрывать меню при смене маршрута
  useEffect(() => setOpen(false), [pathname]);

  // Клик вне/ESC
  useEffect(() => {
    if (!open) return;

    const onDocClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (menuRef.current?.contains(t)) return;
      if (btnRef.current?.contains(t)) return;
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

  // Фокус на первый пункт при открытии
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => firstItemRef.current?.focus(), 0);
    return () => clearTimeout(t);
  }, [open]);

  return (
    <header className="admin-section border-white/12 bg-white/8">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        {/* Левая часть */}
        <div className="min-w-0">
          <span className="admin-chip mb-2 bg-white/12 text-white/75">Каталог</span>
          <h1 className="flex items-center gap-2 text-2xl md:text-3xl font-semibold tracking-tight text-white">
            <Layers3 className="h-6 w-6 opacity-70" />
            Услуги
          </h1>
          <p className="mt-1 max-w-xl text-sm text-white/70">
            Управляйте витриной услуг, ценами, категориями и пакетами. Быстрые ссылки подстраиваются под роль.
          </p>
        </div>

        {/* Правая часть */}
        <nav aria-label="Навигация по разделу услуг" className="relative">
          {/* Desktop */}
          <div className="hidden sm:flex flex-wrap gap-2">
            <Link
              href="/demo/admin/services/pricing"
              className={cls(linkBase, isActive.pricing && linkActive)}
              aria-current={isActive.pricing ? "page" : undefined}
            >
              <PackageSearch className="h-4 w-4 opacity-70" />
              Прайс-лист
            </Link>
            <Link
              href="/demo/admin/services/categories"
              className={cls(linkBase, isActive.categories && linkActive)}
              aria-current={isActive.categories ? "page" : undefined}
            >
              <Tag className="h-4 w-4 opacity-70" />
              Категории
            </Link>
            <Link
              href="/demo/admin/services/bundles"
              className={cls(linkBase, isActive.bundles && linkActive)}
              aria-current={isActive.bundles ? "page" : undefined}
            >
              <Layers3 className="h-4 w-4 opacity-70" />
              Пакеты
            </Link>
          </div>

          {/* Mobile */}
          <div className="relative sm:hidden">
            <button
              ref={btnRef}
              onClick={() => setOpen((v) => !v)}
              className={linkBase}
              aria-haspopup="menu"
              aria-expanded={open}
              aria-controls="svc-menu"
            >
              <Menu className="h-4 w-4 opacity-70" />
              Меню
            </button>

            {open && (
              <div
                id="svc-menu"
                ref={menuRef}
                role="menu"
                aria-label="Меню раздела услуг"
                className="absolute right-0 mt-2 w-48 rounded-2xl border border-white/12 bg-[#060912]/95 p-2 text-sm shadow-2xl backdrop-blur-xl z-20"
              >
                <Link
                  href="/demo/admin/services/pricing"
                  role="menuitem"
                  className={cls(
                    "block rounded-lg px-3 py-1.5 text-white/80 transition hover:bg-white/12 focus:outline-none focus:ring-2 focus:ring-white/30",
                    isActive.pricing && "bg-white/12 !text-white"
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
                    "block rounded-lg px-3 py-1.5 text-white/80 transition hover:bg-white/12 focus:outline-none focus:ring-2 focus:ring-white/30",
                    isActive.categories && "bg-white/12 !text-white"
                  )}
                  onClick={() => setOpen(false)}
                >
                  Категории
                </Link>
                <Link
                  href="/demo/admin/services/bundles"
                  role="menuitem"
                  className={cls(
                    "block rounded-lg px-3 py-1.5 text-white/80 transition hover:bg-white/12 focus:outline-none focus:ring-2 focus:ring-white/30",
                    isActive.bundles && "bg-white/12 !text-white"
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