'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Menu, X, Home, Play } from 'lucide-react';
import Script from 'next/script';

/* ===================== Data ===================== */
const NAV_LINKS = [
  { href: '/', label: 'Главная', icon: Home },
  { href: '/demo', label: 'Демо', icon: Play },
] as const;

const DEMO_LINKS = [
  { href: '/demo/medicine', label: 'Медицина' },
  { href: '/demo/social', label: 'Социальные услуги' },
  { href: '/demo/logistics', label: 'Доставка + Склад' },
  { href: '/demo/autoservice', label: 'Автосервис' },
  { href: '/demo/transport', label: 'Общественный транспорт' },
  { href: '/demo/services', label: 'Сфера услуг' },
] as const;

/* ===================== Component ===================== */
export default function DemoNavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const reduced = useReducedMotion();
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const demoBtnRef = useRef<HTMLButtonElement | null>(null);

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + '/');
  const isDemoActive = DEMO_LINKS.some((l) => isActive(l.href));

  /* Handle menu state */
  useEffect(() => {
    if (!open) return;
    setOpen(false);
    setDemoOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => (document.body.style.overflow = prev);
  }, [open]);

  /* Accessibility: Esc close */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  /* SEO structured data */
  const navLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'SiteNavigationElement',
      name: [...NAV_LINKS.map((l) => l.label), ...DEMO_LINKS.map((l) => l.label)],
      url: [...NAV_LINKS.map((l) => `https://onestack24.ru${l.href}`), ...DEMO_LINKS.map((l) => `https://onestack24.ru${l.href}`)],
    }),
    []
  );

  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-center">
      <div className="flex w-[95%] max-w-7xl items-center justify-between rounded-full border border-white/[0.08] bg-white/[0.05] px-4 sm:px-6 py-2.5 sm:py-3 backdrop-blur-md shadow-[0_0_25px_rgba(255,255,255,0.05)] transition-all duration-300">
        {/* Logo */}
        <Link
          href="/"
          aria-label="Главная OneStack"
          className="flex items-center gap-2 text-white hover:opacity-90 transition"
        >
          <CrownIcon className="w-6 h-6" />
          <span className="font-semibold text-lg tracking-tight">OneStack</span>
          <span className="text-xs px-2 py-1 rounded-full bg-white/[0.08] text-white/70">Demo</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-sm font-medium">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                  active
                    ? 'bg-white/[0.12] text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}

          {/* Dropdown */}
          <div className="relative">
            <button
              ref={demoBtnRef}
              onClick={() => setDemoOpen((v) => !v)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                demoOpen || isDemoActive
                  ? 'bg-white/[0.12] text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/[0.06]'
              }`}
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </motion.svg>
            </button>

            <AnimatePresence>
              {demoOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 mt-2 w-64 rounded-2xl border border-white/[0.1] bg-black/95 backdrop-blur-md shadow-xl overflow-hidden"
                >
                  <div className="p-2">
                    {DEMO_LINKS.map((item) => {
                      const active = isActive(item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setDemoOpen(false)}
                          className={`block px-4 py-3 rounded-xl text-sm transition ${
                            active
                              ? 'bg-white/[0.12] text-white'
                              : 'text-white/70 hover:text-white hover:bg-white/[0.06]'
                          }`}
                        >
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Mobile menu button */}
        <button
          ref={btnRef}
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden p-2 text-white rounded-lg hover:bg-white/[0.08] transition"
          aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile nav */}
      <AnimatePresence>
        {open && (
          <motion.nav
            key="mobile"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed top-0 right-0 bottom-0 w-80 bg-black/95 border-l border-white/[0.1] backdrop-blur-md shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/[0.1]">
              <div className="flex items-center gap-2 text-white">
                <CrownIcon className="h-6 w-6" />
                <span className="text-lg font-semibold">OneStack</span>
                <span className="text-xs px-2 py-1 rounded-full bg-white/[0.08] text-white/70">Demo</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 text-white rounded-lg hover:bg-white/[0.08]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-5 overflow-y-auto">
              {[...NAV_LINKS].map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base transition mb-2 ${
                      active
                        ? 'bg-white/[0.12] text-white'
                        : 'text-white/80 hover:text-white hover:bg-white/[0.06]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}

              <div className="mt-6 border-t border-white/[0.1] pt-4">
                <h3 className="text-xs uppercase tracking-wider text-white/60 mb-3 px-2">
                  Отрасли
                </h3>
                {DEMO_LINKS.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`block px-4 py-3 rounded-xl text-sm transition mb-1 ${
                        active
                          ? 'bg-white/[0.12] text-white'
                          : 'text-white/70 hover:text-white hover:bg-white/[0.06]'
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* SEO JSON-LD */}
      <script
        id="ld-demo-navbar"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(navLd) }}
      />
    </header>
  );
}

/* ===================== Logo Icon ===================== */
function CrownIcon({ className }: { className?: string }) {
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