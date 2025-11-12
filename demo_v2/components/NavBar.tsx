// src/app/components/NavBar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Script from "next/script";
import { createPortal } from "react-dom";

const NAV_LINKS = [
  { href: "/demo", label: "Домашняя" },
  { href: "/demo/user/dashboard", label: "Пользователь" },
  { href: "/demo/manager/dashboard", label: "Менеджер" },
  { href: "/demo/admin/dashboard", label: "Администратор" },
] as const;

const HEADER_HEIGHT = 56;
const ring =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--brand))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--panel))]";

function BodyPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useLayoutEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + "/");

  // закрываем при смене маршрута и возвращаем фокус
  useEffect(() => {
    if (!open) return;
    setOpen(false);
    btnRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // lock scroll
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Esc + простейший trap Tab
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
      if (e.key !== "Tab") return;
      const c = panelRef.current;
      if (!c) return;
      const focusables = c.querySelectorAll<HTMLElement>('a,button,[tabindex]:not([tabindex="-1"])');
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); (last as HTMLElement).focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); (first as HTMLElement).focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const navLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    name: NAV_LINKS.map(l => l.label),
    url: NAV_LINKS.map(l => `https://onestack24.ru${l.href}`),
  }), []);

  const closeAndFocus = () => { setOpen(false); btnRef.current?.focus(); };

  return (
    <>
      <header
        className="sticky top-4 z-50 mx-auto flex w-full max-w-7xl items-center justify-between rounded-full
                   border bg-[hsl(var(--panel))] text-[hsl(var(--fg))]
                   supports-[backdrop-filter]:backdrop-blur px-4 py-2 sm:px-6 shadow-md"
        style={{ borderColor: "hsl(var(--border))", height: `${HEADER_HEIGHT}px` }}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] rounded-md
                     bg-[hsl(var(--panel))] px-3 py-2 text-[hsl(var(--fg))] border"
          style={{ borderColor: "hsl(var(--border))" }}
        >
          Перейти к основному содержанию
        </a>

        <Link href="/" aria-label="На главную" className={`flex items-center gap-2 ${ring} rounded-md px-1`}>
          <CrownIcon className="h-6 w-6" />
          <span className="text-[15px] font-semibold leading-none">OneStack</span>
        </Link>

        <nav aria-label="Основная навигация" className="relative hidden items-center gap-6 lg:flex xl:gap-8 text-[15px] font-medium">
          {NAV_LINKS.map(i => {
            const active = isActive(i.href);
            return (
              <div key={i.href} className="relative">
                <Link
                  href={i.href}
                  className={`px-1 ${ring} rounded-md transition-colors
                             ${active ? "text-[hsl(var(--fg))]" : "text-[hsl(var(--muted))] hover:text-[hsl(var(--fg))]"}`}
                  aria-current={active ? "page" : undefined}
                >
                  {i.label}
                </Link>
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] rounded"
                    style={{ backgroundColor: "hsl(var(--brand))" }}
                    transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 450, damping: 35 }}
                  />
                )}
              </div>
            );
          })}
        </nav>

        <div className="hidden gap-2 lg:flex">
          <Link
            href="/"
            className={`rounded-full border px-4 h-9 inline-flex items-center ${ring}`}
            style={{ borderColor: "hsl(var(--border))" }}
          >
            <span className="text-[14px] font-semibold">Наш сайт</span>
          </Link>
        </div>

        <button
          ref={btnRef}
          type="button"
          onClick={() => setOpen(v => !v)}
          className={`lg:hidden grid place-items-center rounded-md h-10 w-10 ${ring}
                      hover:bg-[hsl(var(--panel))]/80 transition-colors`}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          data-open={open ? "true" : "false"}
        >
          {open ? <X className="w-6 h-6" aria-hidden /> : <Menu className="w-6 h-6" aria-hidden />}
        </button>

        <Script id="ld-site-nav" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(navLd) }} />
      </header>

      {/* Портал: оверлей/меню */}
      <BodyPortal>
        <AnimatePresence>
          {open && (
            <motion.button
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.2 }}
              className="fixed inset-0 z-[9999] bg-black/80 lg:hidden"
              aria-label="Закрыть меню"
              onClick={closeAndFocus}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {open && (
            <motion.nav
              ref={panelRef}
              id="mobile-menu"
              key="menu"
              role="menu"
              aria-label="Мобильное меню"
              initial={{ opacity: 0, y: reduced ? 0 : -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduced ? 0 : -6 }}
              transition={{ duration: reduced ? 0 : 0.22, ease: "easeOut" }}
              className="fixed inset-x-4 z-[10000] lg:hidden border rounded-2xl shadow-2xl overflow-hidden"
              style={{
                top: `calc(env(safe-area-inset-top) + ${HEADER_HEIGHT + 16}px)`,
                backgroundColor: "hsl(var(--panel))",
                borderColor: "hsl(var(--border))",
              }}
            >
              <ul className="py-2" role="list">
                {NAV_LINKS.map(i => {
                  const active = isActive(i.href);
                  return (
                    <li key={i.href}>
                      <Link
                        role="menuitem"
                        onClick={closeAndFocus}
                        href={i.href}
                        className={`flex items-center justify-between px-4 h-12 ${ring}
                                    ${active ? "text-[hsl(var(--fg))]" : "text-[hsl(var(--muted))] hover:text-[hsl(var(--fg))]"}`}
                        aria-current={active ? "page" : undefined}
                      >
                        <span className="text-[15px] font-medium">{i.label}</span>
                        {active && (
                          <span className="ml-3 inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "hsl(var(--brand))" }} aria-hidden />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="border-t" style={{ borderColor: "hsl(var(--border))" }} />

              <div className="p-2">
                <Link
                  role="menuitem"
                  onClick={closeAndFocus}
                  href="/"
                  className={`w-full inline-flex items-center justify-center rounded-xl h-10 text-[14px] font-semibold border ${ring}`}
                  style={{ borderColor: "hsl(var(--border))" }}
                >
                  Наш сайт
                </Link>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </BodyPortal>
    </>
  );
}

function CrownIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <path d="M1 8L11 20L24 4L37 20L47 8L43 30H5L1 8Z" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}