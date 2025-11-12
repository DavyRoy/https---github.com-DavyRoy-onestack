// src/app/components/NavBar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Script from "next/script";

const NAV_LINKS = [
  { href: "/home", label: "Домашняя" },
  { href: "/sites", label: "Сайты" },
  { href: "/webapp", label: "Веб-приложение" },
  { href: "/mobile", label: "Мобильное приложение" },
] as const;

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const btnRef = useRef<HTMLButtonElement | null>(null);

  // Закрывать меню при смене маршрута
  useEffect(() => {
    if (!open) return;
    setOpen(false);
    // вернуть фокус на кнопку
    btnRef.current?.focus();
  }, [pathname]);

  // Блокируем скролл body при открытом меню
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Закрытие по Esc
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + "/");

  // JSON-LD: SiteNavigationElement (помогает поисковикам понять структуру навигации)
  const navLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "SiteNavigationElement",
      name: NAV_LINKS.map((l) => l.label),
      url: NAV_LINKS.map((l) => `https://onestack24.ru${l.href}`),
    }),
    []
  );

  return (
    <header className="sticky top-4 z-50 mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/10 bg-white/5 px-4 sm:px-6 py-2.5 sm:py-3 backdrop-blur-lg shadow-md">
      {/* Skip link для a11y */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] rounded-md bg-black px-3 py-2 text-white"
      >
        Перейти к основному содержанию
      </a>

      {/* Лого */}
      <Link
        href="/"
        aria-label="На главную"
        className="flex items-center gap-2 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded"
      >
        <CrownIcon className="h-6 w-6" />
        <span className="text-lg font-semibold">OneStack</span>
      </Link>

      {/* Десктоп навигация */}
      <nav
        aria-label="Основная навигация"
        className="relative hidden lg:flex items-center gap-6 xl:gap-8 text-[16px] font-medium"
      >
        {NAV_LINKS.map((i) => {
          const active = isActive(i.href);
          return (
            <div key={i.href} className="relative">
              <Link
                href={i.href}
                className={`transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded px-1 ${
                  active ? "text-white" : "text-white/80 hover:text-white"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {i.label}
              </Link>
              {/* Подчёркивание активного пункта — shared layoutId */}
              {active && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 right-0 h-[2px] rounded bg-white"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}
            </div>
          );
        })}
      </nav>

      {/* Кнопки (ПК) */}
      <div className="hidden lg:flex gap-2">
        <Link
          href="/demo"
          className="rounded-full border border-white/60 px-5 py-2 text-base text-white hover:border-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          Демо версия
        </Link>
      </div>

      {/* Мобильная кнопка */}
      <button
        ref={btnRef}
        onClick={() => setOpen((v) => !v)}
        className="lg:hidden p-2 rounded-md text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 transition"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Закрыть меню" : "Открыть меню"}
      >
        {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Оверлей */}
      <AnimatePresence>
        {open && (
          <motion.button
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            aria-label="Закрыть меню"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Мобильное меню */}
      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            key="menu"
            role="menu"
            aria-label="Мобильное меню"
            initial={{ opacity: 0, y: reduced ? 0 : -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduced ? 0 : -8 }}
            transition={{ duration: reduced ? 0 : 0.25 }}
            className="absolute top-full left-0 w-full flex flex-col gap-4 bg-black/95 border-t border-white/10 px-6 py-4 text-white lg:hidden shadow-md z-50"
          >
            {NAV_LINKS.map((i) => (
              <Link
                key={i.href}
                role="menuitem"
                onClick={() => setOpen(false)}
                href={i.href}
                className={`transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded ${
                  isActive(i.href) ? "text-white" : "text-white/85 hover:text-white"
                }`}
                aria-current={isActive(i.href) ? "page" : undefined}
              >
                {i.label}
              </Link>
            ))}

            <div className="border-t border-white/10 pt-3 mt-2" />

            <Link
              role="menuitem"
              onClick={() => setOpen(false)}
              href="/demo"
              className="text-white/85 hover:text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded"
            >
              Демо версия
            </Link>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* SEO: SiteNavigationElement */}
      <Script
        id="ld-site-nav"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(navLd) }}
      />
    </header>
  );
}

function CrownIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M1 8L11 20L24 4L37 20L47 8L43 30H5L1 8Z"
        stroke="currentColor"
        strokeWidth="3"
      />
    </svg>
  );
}