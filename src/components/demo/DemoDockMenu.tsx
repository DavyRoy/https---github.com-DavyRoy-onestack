// src/components/demo/DemoDockMenu.tsx
'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home, Globe2, Play,
  Heart, Users, Truck, Wrench, Bus, Monitor,
  X, ChevronDown, ChevronUp, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

/* ============================================================================
   CONFIG
============================================================================ */
type DockItem = {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  external?: boolean;
  gradient?: string;   // tailwind gradient tokens (from-… to-…)
  badge?: string;      // small emoji/star, etc.
};

const INDUSTRIES: DockItem[] = [
  { id: 'user',    label: 'Пользователь',   href: '/demo/application/user',   icon: Heart,   gradient: 'from-rose-500 to-pink-500',       badge: '✨' },
  { id: 'manager',      label: 'Менеджер',  href: '/demo/application/manager',     icon: Users,   gradient: 'from-cyan-500 to-blue-500',       badge: '🌟' },
  { id: 'owner', label: 'Администратор', href: '/demo/application/owner',icon: Wrench,  gradient: 'from-emerald-500 to-green-500',    badge: '⚙️' },
];

const EXTRAS: DockItem[] = [
  { id: 'home', label: 'Главная', href: '/home',                 icon: Home,   gradient: 'from-slate-500 to-slate-400' },
  { id: 'site', label: 'Сайт',    href: '/webapp',              icon: Globe2, gradient: 'from-slate-500 to-slate-500' },
  { id: 'demo', label: 'Демо',    href: '/demo',             icon: Play,   gradient: 'from-slate-500 to-slate-500' },
];

const DESKTOP_ICON = 54;
const MOBILE_ICON  = 46;

// Пути, на которых должно показываться главное меню
const MAIN_MENU_PATHS = [
  '/',
];

// Пути, на которых должно скрываться главное меню (внутренние страницы)
const HIDDEN_MENU_PATHS = [
  '/demo/application/owner',
  '/demo/application/manager',
  '/demo/application/user'
  // добавьте другие внутренние пути по необходимости
];

/* ============================================================================
   HOOKS
============================================================================ */
function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}

function useSafeAreaBottom() {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const probe = document.createElement('div');
    probe.style.cssText = 'position:fixed;bottom:0;height:env(safe-area-inset-bottom,0px);visibility:hidden;';
    document.body.appendChild(probe);
    const h = probe.getBoundingClientRect().height;
    setVal(h || 0);
    document.body.removeChild(probe);
  }, []);
  return val;
}

function useScrollDir() {
  const [dir, setDir] = useState<'up'|'down'>('up');
  const last = useRef(0);
  useEffect(() => {
    const on = () => {
      const y = window.scrollY;
      const d = y > last.current ? 'down' : 'up';
      if (d !== dir && Math.abs(y - last.current) > 10) setDir(d);
      last.current = y;
    };
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, [dir]);
  return dir;
}

// Хук для определения, нужно ли показывать главное меню
function useShowMainMenu() {
  const pathname = usePathname();
  
  return useMemo(() => {
    // Если путь в списке скрытых - не показываем
    if (HIDDEN_MENU_PATHS.some(path => pathname.startsWith(path))) {
      return false;
    }
    
    // Если путь в списке главных - показываем
    if (MAIN_MENU_PATHS.some(path => pathname === path || pathname.startsWith(path + '/'))) {
      return true;
    }
    
    // Для всех остальных путей по умолчанию не показываем
    return false;
  }, [pathname]);
}

/* ============================================================================
   HELPERS
============================================================================ */
const isExactActive = (pathname: string, href: string) => pathname === href;
const isActive = (pathname: string, href: string) => href !== '/' ? pathname.startsWith(href) : pathname === '/';

const glass =
  'bg-black/55 backdrop-blur-2xl border border-white/15 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.7)] ' +
  'ring-1 ring-white/5';

/* ============================================================================
   TOOLTIP (desktop)
============================================================================ */
function Tooltip({ show, children }: { show: boolean; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.98 }}
      animate={show ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 6, scale: 0.98 }}
      transition={{ duration: 0.18 }}
      className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap
                 rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-sm text-white
                 shadow-2xl backdrop-blur-xl"
    >
      {children}
    </motion.div>
  );
}

/* ============================================================================
   DESKTOP DOCK (Glass + Neon)
============================================================================ */
function DesktopDock() {
  const mounted = useMounted();
  const pathname = usePathname();
  const dir = useScrollDir();
  const showMainMenu = useShowMainMenu();
  const items = useMemo(() => [...EXTRAS, ...INDUSTRIES], []);

  const [hovered, setHovered] = useState<string | null>(null);
  const reduced = useReducedMotion();

  // Если не нужно показывать меню, возвращаем null
  if (!showMainMenu) {
    return null;
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 16 }}
      transition={{ duration: 0.28 }}
      className={`fixed z-50 hidden md:flex items-end gap-2 bottom-6 left-1/2 -translate-x-1/2 ${glass} 
                  rounded-2xl px-4 py-3 select-none
                  ${dir === 'down' ? 'opacity-80 translate-y-1' : 'opacity-100 translate-y-0'}`}
      role="navigation"
      aria-label="Главное меню"
      onMouseLeave={() => setHovered(null)}
    >
      {/* subtle glass highlight */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-white/5 to-transparent" />
      <div className="pointer-events-none absolute -top-1 left-1/2 h-1 w-24 -translate-x-1/2 rounded-full bg-white/10" />
      <div className="flex items-end gap-2 relative">
        {items.map(({ id, label, href, external, icon: Icon, gradient, badge }) => {
          const active = isActive(pathname, href) || isExactActive(pathname, href);
          const isHover = hovered === id;

          return (
            <Link
              key={id}
              href={href}
              target={external ? '_blank' : undefined}
              className="group relative grid place-items-center"
              onMouseEnter={() => setHovered(id)}
              onFocus={() => setHovered(id)}
              onBlur={() => setHovered(null)}
              aria-label={label}
            >
              {/* Tooltip */}
              <Tooltip show={!!isHover}>
                <div className="flex items-center gap-1.5">
                  {badge ? <span className="text-xs">{badge}</span> : null}
                  <span className="font-medium">{label}</span>
                  {external && <span className="text-xs opacity-70">↗</span>}
                </div>
              </Tooltip>

              {/* Icon holder */}
              <motion.div
                initial={false}
                animate={{
                  y: isHover ? -4 : 0,
                  scale: isHover ? 1.1 : 1,
                }}
                transition={{ type: reduced ? 'tween' : 'spring', stiffness: 340, damping: 20, mass: 0.8 }}
                className={`relative grid place-items-center rounded-2xl border-2 overflow-hidden
                            ${active
                              ? 'border-white/40 bg-white/15 shadow-lg shadow-white/20'
                              : 'border-white/10 bg-white/10 hover:border-white/20 hover:bg-white/12'
                            }`}
                style={{ width: DESKTOP_ICON, height: DESKTOP_ICON }}
              >
                {/* gradient aura */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
                {/* neon ring */}
                <div className={`absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10`} />
                {/* icon */}
                <Icon className={`relative h-5 w-5 ${active ? 'text-white' : 'text-white/85'} group-hover:scale-[1.06] transition-transform`} />
              </motion.div>

              {/* active dot */}
              <div className="h-1 w-1 rounded-full bg-white/90 mt-2 opacity-90" style={{ visibility: active ? 'visible' : 'hidden' }} />
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}

/* ============================================================================
   MOBILE DOCK — Glass bottom bar + Expandable Industries Sheet
============================================================================ */
function MobileDock() {
  const mounted = useMounted();
  const pathname = usePathname();
  const dir = useScrollDir();
  const reduced = useReducedMotion();
  const safe = useSafeAreaBottom();
  const showMainMenu = useShowMainMenu();

  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen(v => !v), []);

  // Close sheet on route change (best UX)
  useEffect(() => { setOpen(false); }, [pathname]);

  // Если не нужно показывать меню, возвращаем null
  if (!showMainMenu) {
    return null;
  }

  return (
    <>
      {/* Primary bottom bar */}
      <motion.nav
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
        transition={{ duration: 0.28 }}
        className={`fixed md:hidden left-1/2 -translate-x-1/2 z-50 ${glass} rounded-2xl
                    w-[min(94%,420px)] px-4 py-3 flex items-center justify-between
                    ${dir === 'down' ? 'bottom-2 opacity-90' : 'bottom-6 opacity-100'}`}
        style={{ paddingBottom: `calc(0.75rem + ${Math.max(0, safe - 2)}px)` }}
        aria-label="Мобильное меню"
      >
        {/* Home */}
        <MobileItem
          label="Главная"
          icon={Home}
          href="/"
          active={isActive(pathname, '/')}
        />
        {/* Demo */}
        <MobileItem
          label="Демо"
          icon={Play}
          href="/demo"
          active={isActive(pathname, '/demo')}
        />
        {/* Industries toggle */}
        <button
          aria-label={open ? 'Скрыть отрасли' : 'Показать отрасли'}
          onClick={toggle}
          className={`group flex flex-col items-center transition-transform active:scale-95`}
        >
          <div className={`grid place-items-center rounded-xl border bg-white/10 border-white/10 
                           group-active:scale-95 transition-all`}
               style={{ width: MOBILE_ICON, height: MOBILE_ICON }}>
            <Sparkles className={`h-5 w-5 ${open ? 'text-white' : 'text-white/80'} transition`} />
          </div>
          <span className={`mt-1 text-[11px] ${open ? 'text-white' : 'text-white/75'}`}>Отрасли</span>
        </button>
        {/* Site */}
        <MobileItem
          label="Сайт"
          icon={Globe2}
          href="https://onestack24.ru"
          external
        />
      </motion.nav>

      {/* Industries glass sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* dim backdrop */}
            <button
              aria-label="Закрыть панель отраслей"
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-black/60"
            />
            {/* sheet */}
            <motion.div
              role="dialog"
              aria-modal="true"
              initial={{ y: 40, opacity: 0.9 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0.9 }}
              transition={{ duration: reduced ? 0.15 : 0.24, ease: 'easeOut' }}
              className={`absolute left-1/2 -translate-x-1/2 bottom-[88px] w-[min(94%,420px)]
                          ${glass} rounded-2xl px-4 pt-3 pb-4`}
              style={{ bottom: `calc(88px + ${safe}px)` }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-white/90">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-sm font-semibold">Все отрасли</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setOpen(false)}
                    className="rounded-lg bg-white/10 px-2 py-1 text-white/80 text-xs hover:bg-white/15"
                  >
                    Закрыть
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    className="grid place-items-center rounded-lg bg-white/10 p-1.5 hover:bg-white/15"
                    aria-label="Свернуть"
                  >
                    <X className="h-3.5 w-3.5 text-white/90" />
                  </button>
                </div>
              </div>

              {/* industries grid */}
              <div className="grid grid-cols-3 gap-3">
                {INDUSTRIES.map(({ id, label, href, icon: Icon, gradient, badge }) => {
                  const active = isActive(pathname, href);
                  return (
                    <Link
                      key={id}
                      href={href}
                      className="group flex flex-col items-center active:scale-95 transition"
                    >
                      <div
                        className={`relative grid place-items-center rounded-xl border-2
                                    ${active
                                      ? 'bg-white/15 border-white/40 shadow'
                                      : 'bg-white/10 border-white/15 group-hover:bg-white/12 group-hover:border-white/25'
                                    }`}
                        style={{ width: MOBILE_ICON, height: MOBILE_ICON }}
                      >
                        <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
                        <Icon className={`relative h-5 w-5 ${active ? 'text-white' : 'text-white/85'}`} />
                        {badge && <span className="absolute -top-1 -right-1 text-xs">{badge}</span>}
                      </div>
                      <span className={`mt-1 text-[11px] text-center leading-tight ${active ? 'text-white' : 'text-white/75'}`}>
                        {label}
                      </span>
                      {active && <span className="mt-1 h-1 w-1 rounded-full bg-white/90" />}
                    </Link>
                  );
                })}
              </div>

              {/* subtle handle */}
              <div className="pointer-events-none mt-4 h-1 w-16 rounded-full bg-white/10 mx-auto" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer to avoid overlap with content */}
      <div aria-hidden="true" className="md:hidden" style={{ height: `calc(88px + ${safe}px)` }} />
    </>
  );
}

function MobileItem({
  label, icon: Icon, href, external, active,
}: { label: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; href: string; external?: boolean; active?: boolean; }) {
  return (
    <Link
      href={href}
      target={external ? '_blank' : undefined}
      className="group flex flex-col items-center active:scale-95 transition"
      aria-label={label}
    >
      <div
        className={`grid place-items-center rounded-xl border transition-all
                    ${active ? 'bg-white/15 border-white/35 shadow' : 'bg-white/10 border-white/10 group-hover:bg-white/12 group-hover:border-white/20'}`}
        style={{ width: MOBILE_ICON, height: MOBILE_ICON }}
      >
        <Icon className={`h-5 w-5 ${active ? 'text-white' : 'text-white/80'} group-hover:text-white transition-colors`} />
      </div>
      <span className={`mt-1 text-[11px] ${active ? 'text-white' : 'text-white/75'} group-hover:text-white`}>{label}</span>
    </Link>
  );
}

/* ============================================================================
   EXPORT
============================================================================ */
export default function DemoDockMenu() {
  const showMainMenu = useShowMainMenu();

  // Если меню не должно показываться, возвращаем null
  if (!showMainMenu) {
    return null;
  }

  return (
    <>
      <DesktopDock />
      <MobileDock />

      {/* Local styles for tiny glow & accessibility helpers */}
      <style jsx global>{`
        /* subtle neon pulse on hover (desktop) */
        @media (hover:hover) {
          nav a.group:hover .neon {
            filter: drop-shadow(0 0 8px rgba(255,255,255,0.2));
          }
        }
        /* High contrast preference */
        @media (prefers-contrast: more) {
          .${glass.replaceAll(' ', '.')} {
            background-color: rgba(0,0,0,0.65);
            border-color: rgba(255,255,255,0.25);
          }
        }
        /* Reduced motion support is handled via framer-motion's hook */
      `}</style>
    </>
  );
}