'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Menu, X, Play, Home, Crown } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Script from "next/script";

/* ===================== DATA ===================== */
const NAV_LINKS = [
  { href: "/", label: "Главная", icon: Home },
  { href: "/demo", label: "Демо", icon: Play },
] as const;

const DEMO_LINKS = [
  { href: "/demo/medicine", label: "Медицина" },
  { href: "/demo/social", label: "Социальные услуги" },
  { href: "/demo/logistics", label: "Доставка + Склад" },
  { href: "/demo/autoservice", label: "Автосервис" },
  { href: "/demo/transport", label: "Общественный транспорт" },
  { href: "/demo/services", label: "Сфера услуг" },
] as const;

/* ===================== COMPONENT ===================== */
export default function DemoNavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const reduced = useReducedMotion();
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const demoBtnRef = useRef<HTMLButtonElement | null>(null);

  /* ===== Accessibility + Events ===== */
  useEffect(() => {
    if (!open) return;
    setOpen(false);
    setDemoOpen(false);
    btnRef.current?.focus();
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  /* ===== Helpers ===== */
  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + "/");
  const isDemoActive = DEMO_LINKS.some((link) => isActive(link.href));

  /* ===== JSON-LD ===== */
  const navLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "SiteNavigationElement",
      name: [...NAV_LINKS.map((l) => l.label), ...DEMO_LINKS.map((l) => l.label)],
      url: [
        ...NAV_LINKS.map((l) => `https://onestack24.ru${l.href}`),
        ...DEMO_LINKS.map((l) => `https://onestack24.ru${l.href}`),
      ],
    }),
    []
  );

  /* ===== RENDER ===== */
  return (
    <>
      {/* Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] rounded-md bg-black px-3 py-2 text-white text-sm focus:ring-2 focus:ring-white"
      >
        Перейти к основному содержанию
      </a>

      {/* NAVBAR */}
      <header className="fixed top-4 left-0 right-0 z-50 flex justify-center">
        <div className="flex w-[95%] max-w-7xl items-center justify-between rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-4 sm:px-6 py-2.5 sm:py-3 shadow-[0_0_25px_rgba(255,255,255,0.05)]">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-white hover:opacity-90 transition"
          >
            <Crown className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
            <span className="font-semibold text-base sm:text-lg tracking-tight">
              OneStack
            </span>
            <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded-full">
              Demo
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Основная навигация"
            className="hidden lg:flex items-center gap-4 xl:gap-6 text-sm font-medium"
          >
            {NAV_LINKS.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    active
                      ? "text-white bg-white/10"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}

            {/* Demo Dropdown */}
            <div className="relative">
              <button
                ref={demoBtnRef}
                onClick={() => setDemoOpen(!demoOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                  isDemoActive || demoOpen
                    ? "text-white bg-white/10"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
                aria-expanded={demoOpen}
              >
                Отрасли
                <motion.svg
                  animate={{ rotate: demoOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </motion.svg>
              </button>

              <AnimatePresence>
                {demoOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-56 rounded-xl border border-white/10 bg-black/95 backdrop-blur-xl shadow-xl z-50 overflow-hidden"
                  >
                    <div className="p-1">
                      {DEMO_LINKS.map((link) => {
                        const active = isActive(link.href);
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setDemoOpen(false)}
                            className={`block px-4 py-2 rounded-lg text-sm transition-all ${
                              active
                                ? "bg-white/10 text-white"
                                : "text-white/80 hover:text-white hover:bg-white/5"
                            }`}
                          >
                            {link.label}
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            ref={btnRef}
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition"
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.2 }}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {open && (
          <motion.nav
            key="menu"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: reduced ? 0 : 0.3, ease: "easeOut" }}
            className="fixed top-0 right-0 h-full w-80 bg-black/95 backdrop-blur-xl border-l border-white/10 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <div className="flex items-center gap-2 text-white">
                <Crown className="h-5 w-5" />
                <span className="text-lg font-semibold">OneStack</span>
                <span className="text-xs bg-white/10 text-white/70 px-2 py-1 rounded-full">
                  Demo
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 text-white hover:bg-white/10 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Links */}
            <div className="flex-1 p-4 overflow-y-auto">
              {NAV_LINKS.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all mb-2 ${
                      active
                        ? "bg-white/10 text-white border border-white/10"
                        : "text-white/80 hover:text-white hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}

              <div className="border-t border-white/10 my-4" />

              <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3 px-3">
                Демо-отрасли
              </h3>
              {DEMO_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`block px-4 py-2.5 rounded-lg text-sm transition mb-1 ${
                      active
                        ? "bg-white/10 text-white border border-white/10"
                        : "text-white/70 hover:text-white hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* SEO Structured Data */}
      <Script
        id="ld-demo-nav"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(navLd) }}
      />
    </>
  );
}