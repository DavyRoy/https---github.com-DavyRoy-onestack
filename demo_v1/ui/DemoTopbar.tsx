"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Bell,
  Search as SearchIcon,
  UserCircle2,
  KeyRound,
  ShieldCheck,
  UserPlus,
  Activity,
  RotateCcw,
  LogOut,
  Settings,
  Menu,
  X,
  LayoutDashboard,
  Users2,
  LineChart,
  LockKeyhole,
  ShoppingBag,
} from "lucide-react";

type Role = "user" | "admin";

type NoticeKind = "key" | "role" | "auth" | "order";
type Notice = {
  id: string;
  kind: NoticeKind;
  title: string;
  text: string;
  ts: string;
  unread?: boolean;
  href?: string;
};

const seedNotices: Notice[] = [
  { id: "n1", kind: "key",  title: "Создан API-ключ",        text: "dashboard · доступ только на чтение", ts: "12:04", unread: true, href: "/demo/admin/security" },
  { id: "n2", kind: "key",  title: "Ротация API-ключа",      text: "ORD-2001 · новый секрет применён",    ts: "11:58", unread: true, href: "/demo/admin/security" },
  { id: "n3", kind: "role", title: "Роль manager обновлена", text: "добавлено право reports.export",       ts: "вчера",  href: "/demo/admin/roles" },
  { id: "n4", kind: "auth", title: "Новый пользователь",     text: "olga@example.com · менеджер",          ts: "вчера",  href: "/demo/admin/users" },
];

/* ────────────────────────────── mobile nav ─────────────────────────────── */
type NavItem = { href: string; label: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>> };
const ADMIN_NAV: readonly NavItem[] = [
  { href: "/demo/admin", icon: LayoutDashboard, label: "Дашборд" },
  { href: "/demo/admin/users", icon: Users2, label: "Пользователи" },
  { href: "/demo/admin/analytics", icon: LineChart, label: "Аналитика" },
  { href: "/demo/admin/roles", icon: LockKeyhole, label: "Роли и права" },
  { href: "/demo/admin/operations", icon: LineChart, label: "Операции" },
  { href: "/demo/admin/events", icon: LineChart, label: "События" },
  { href: "/demo/admin/security", icon: ShieldCheck, label: "Безопасность" },
  { href: "/demo/admin/settings", icon: Settings, label: "Настройки" },
] as const;

const USER_NAV: readonly NavItem[] = [
  { href: "/demo/user", icon: LayoutDashboard, label: "Главная" },
  { href: "/demo/user/orders", icon: ShoppingBag, label: "Заказы" },
  { href: "/demo/user/profile", icon: UserCircle2, label: "Профиль" },
  { href: "/demo/user/settings", icon: Settings, label: "Настройки" },
] as const;

function isActive(pathname: string, href: string) {
  const norm = (s: string) => (s.endsWith("/") && s.length > 1 ? s.slice(0, -1) : s);
  const p = norm(pathname);
  const h = norm(href);
  const isRoot = h === "/demo/admin" || h === "/demo/user";
  return isRoot ? p === h : p === h || p.startsWith(h + "/");
}

/* ───────────────────────────────── component ───────────────────────────── */
export function DemoTopbar({ role }: { role: Role }) {
  const pathname = usePathname();
  const [openNotices, setOpenNotices] = useState(false);
  const [openUser, setOpenUser] = useState(false);
  const [openMobileNav, setOpenMobileNav] = useState(false);

  const [items, setItems] = useState<Notice[]>(seedNotices);
  const unreadCount = items.filter(i => i.unread).length;

  const bellBtnRef = useRef<HTMLButtonElement | null>(null);
  const userBtnRef = useRef<HTMLButtonElement | null>(null);
  const noticesRef = useRef<HTMLDivElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileNavRef = useRef<HTMLDivElement | null>(null);
  const lastFocusRef = useRef<HTMLElement | null>(null);

  const noticesTitleId = useId();
  const userMenuTitleId = useId();
  const mobileNavTitleId = useId();
  const reduceMotion = useReducedMotion();

  const nav = role === "admin" ? ADMIN_NAV : USER_NAV;

  /* ─── a11y & events ───────────────────────────────────────────────────── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (openNotices || openUser || openMobileNav) {
          setOpenNotices(false); setOpenUser(false); setOpenMobileNav(false);
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openNotices, openUser, openMobileNav]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (openNotices && noticesRef.current && !noticesRef.current.contains(t) && !bellBtnRef.current?.contains(t)) {
        setOpenNotices(false);
      }
      if (openUser && userMenuRef.current && !userMenuRef.current.contains(t) && !userBtnRef.current?.contains(t)) {
        setOpenUser(false);
      }
      if (openMobileNav && mobileNavRef.current && !mobileNavRef.current.contains(t)) {
        setOpenMobileNav(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [openNotices, openUser, openMobileNav]);

  useEffect(() => {
    const any = openNotices || openUser || openMobileNav;
    if (!any) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [openNotices, openUser, openMobileNav]);

  useEffect(() => {
    const anyOpen = openNotices || openUser || openMobileNav;
    if (anyOpen) lastFocusRef.current = document.activeElement as HTMLElement;
    if (openNotices) {
      setTimeout(() => noticesRef.current?.querySelector<HTMLButtonElement>('button[data-notice]')?.focus({ preventScroll: true }), 0);
    }
    if (openUser) {
      setTimeout(() => userMenuRef.current?.querySelector<HTMLElement>('[data-user-menu-item]')?.focus({ preventScroll: true }), 0);
    }
    if (openMobileNav) {
      setTimeout(() => mobileNavRef.current?.querySelector<HTMLElement>('a[data-nav-item]')?.focus({ preventScroll: true }), 0);
    }
    if (!anyOpen && lastFocusRef.current) {
      lastFocusRef.current.focus({ preventScroll: true });
    }
  }, [openNotices, openUser, openMobileNav]);

  useEffect(() => {
    setOpenNotices(false); setOpenUser(false); setOpenMobileNav(false);
  }, [pathname]);

  /* ─── действия ────────────────────────────────────────────────────────── */
  const markAllRead = () => setItems(arr => arr.map(n => ({ ...n, unread: false })));
  const openOne = (n: Notice) => {
    setItems(arr => arr.map(x => x.id === n.id ? { ...x, unread: false } : x));
    if (n.href) window.location.href = n.href;
  };
  const iconFor = (k: NoticeKind) =>
    k === "key"  ? <KeyRound className="h-4 w-4" /> :
    k === "role" ? <ShieldCheck className="h-4 w-4" /> :
    k === "auth" ? <UserPlus className="h-4 w-4" /> :
                   <Activity className="h-4 w-4" />;

  /* ─── анимации ─────────────────────────────────────────────────────────── */
  const overlayAnim = {
    initial: { opacity: 0 },
    animate: { opacity: 0.9 },
    exit: { opacity: 0 },
    transition: { duration: reduceMotion ? 0 : 0.2 },
  } as const;

  const slideRightAnim = {
    initial: { opacity: 0, x: reduceMotion ? 0 : 24 },
    animate: { opacity: 1, x: 0 },
    exit:    { opacity: 0, x: reduceMotion ? 0 : 24 },
    transition: { duration: reduceMotion ? 0 : 0.2, ease: "easeOut" },
  } as const;

  const popAnim = {
    initial: { opacity: 0, y: reduceMotion ? 0 : -8 },
    animate: { opacity: 1, y: 0 },
    exit:    { opacity: 0, y: reduceMotion ? 0 : -8 },
    transition: { duration: reduceMotion ? 0 : 0.16 },
  } as const;

  const slideLeftAnim = {
    initial: { opacity: 0, x: reduceMotion ? 0 : -24 },
    animate: { opacity: 1, x: 0 },
    exit:    { opacity: 0, x: reduceMotion ? 0 : -24 },
    transition: { duration: reduceMotion ? 0 : 0.22, ease: "easeOut" },
  } as const;

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-white/10 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-2 px-4 md:px-6 py-3">
          {/* burger: mobile only */}
          <button
            onClick={() => { setOpenMobileNav(true); setOpenNotices(false); setOpenUser(false); }}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 lg:hidden"
            aria-haspopup="dialog"
            aria-expanded={openMobileNav}
            aria-controls="mobile-nav"
            aria-label="Открыть меню"
          >
            <Menu className="h-4 w-4" />
          </button>

          {/* Бренд для мобильных (когда сайдбар скрыт) */}
          <div className="lg:hidden">
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="font-semibold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent hover:underline rounded"
                title="На сайт OneStack"
              >
                OneStack
              </Link>
              <Link
                href="/demo"
                className="text-white/60 hover:underline rounded"
                title="Открыть демо"
              >
                Demo
              </Link>
            </div>
          </div>

          {/* Метка роли — на ≥lg */}
          <div className="ml-2 hidden lg:block text-sm uppercase tracking-[0.18em] text-white/60">
            ДЕМО · {role === "admin" ? "АДМИНИСТРАТОР" : "ПОЛЬЗОВАТЕЛЬ"}
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Search (visual) */}
            <div className="relative hidden sm:block">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <input
                placeholder="Поиск…"
                aria-label="Поиск по демо"
                className="w-56 rounded-full border border-white/10 bg-white/[0.03] pl-9 pr-3 py-2 text-sm outline-none placeholder:text-white/40"
              />
            </div>

            {/* bell */}
            <button
              ref={bellBtnRef}
              onClick={() => { setOpenNotices(v => !v); setOpenUser(false); setOpenMobileNav(false); }}
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              aria-haspopup="dialog"
              aria-expanded={openNotices}
              aria-controls="notice-panel"
              aria-label={unreadCount > 0 ? `Оповещения, непрочитанных: ${unreadCount}` : "Оповещения"}
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 min-w-[16px] rounded-full bg-white text-black text-[10px] leading-4 px-1 font-semibold" aria-hidden="true">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* live region for SR */}
            <span className="sr-only" aria-live="polite" aria-atomic="true">
              {unreadCount > 0 ? `Непрочитанных уведомлений: ${unreadCount}` : "Все уведомления прочитаны"}
            </span>

            {/* user menu */}
            <button
              ref={userBtnRef}
              onClick={() => { setOpenUser(v => !v); setOpenNotices(false); setOpenMobileNav(false); }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-2 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              aria-haspopup="menu"
              aria-expanded={openUser}
              aria-controls="user-menu"
              aria-label="Меню пользователя"
            >
              <UserCircle2 className="h-5 w-5" />
              <span className="text-sm hidden sm:block">{role === "admin" ? "admin@demo" : "user@demo"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* overlay */}
      <AnimatePresence>
        {(openNotices || openUser || openMobileNav) && (
          <motion.button
            type="button"
            className="fixed inset-0 z-40 bg-black"
            {...overlayAnim}
            aria-hidden="true"
            onClick={() => { setOpenNotices(false); setOpenUser(false); setOpenMobileNav(false); }}
          />
        )}
      </AnimatePresence>

      {/* notices panel */}
      <AnimatePresence>
        {openNotices && (
          <motion.aside
            id="notice-panel"
            ref={noticesRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={noticesTitleId}
            className="fixed z-50 top-16 right-6 w-[420px] max-w-[92vw] rounded-2xl border border-white/10 bg-[#0b0b0b] text-white shadow-[0_40px_120px_rgba(0,0,0,0.6)]"
            {...slideRightAnim}
          >
            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
              <div id={noticesTitleId} className="text-sm font-semibold">Оповещения</div>
              <button
                onClick={markAllRead}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-xs hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Прочитано
              </button>
            </div>

            <ul className="max-h-[70vh] overflow-y-auto divide-y divide-white/10">
              {items.map((n) => (
                <li key={n.id} className={n.unread ? "bg-white/[0.06]" : ""}>
                  <button
                    data-notice
                    onClick={() => openOne(n)}
                    className="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-white/[0.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-none"
                  >
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.12] shrink-0">
                      {iconFor(n.kind)}
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">{n.title}</span>
                        {n.unread && (
                          <span className="rounded-full border border-white/15 bg-white/[0.14] px-1.5 py-0.5 text-[10px] leading-4">
                            новое
                          </span>
                        )}
                      </span>
                      <span className="block text-xs text-white/70 truncate">{n.text}</span>
                      <span className="block text-[11px] text-white/50 mt-0.5">{n.ts}</span>
                    </span>
                  </button>
                </li>
              ))}
              {items.length === 0 && (
                <li className="px-4 py-6 text-sm text-white/60">Нет оповещений</li>
              )}
            </ul>

            <div className="px-4 py-3 border-t border-white/10 text-xs text-white/70 flex items-center justify-between">
              <Link href="/demo/admin/events" onClick={() => setOpenNotices(false)} className="hover:text-white">
                Открыть журнал событий →
              </Link>
              <button
                onClick={() => setOpenNotices(false)}
                className="rounded-full border border-white/15 px-3 py-1.5 text-white/85 hover:bg-white/10 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                Закрыть
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* user menu */}
      <AnimatePresence>
        {openUser && (
          <motion.div
            id="user-menu"
            ref={userMenuRef}
            role="menu"
            aria-labelledby={userMenuTitleId}
            className="fixed z-50 top-14 right-4 w-[220px] rounded-2xl border border-white/10 bg-[#0b0b0b] text-white shadow-[0_40px_120px_rgba(0,0,0,0.6)]"
            {...popAnim}
          >
            <div id={userMenuTitleId} className="px-4 py-3 border-b border-white/10 text-sm font-semibold">
              {role === "admin" ? "admin@demo" : "user@demo"}
            </div>
            <div className="p-2 text-sm">
              <Link
                href={role === "admin" ? "/demo/admin/settings" : "/demo/user/settings"}
                data-user-menu-item
                onClick={() => setOpenUser(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-white/[0.06] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                <Settings className="h-4 w-4" /> Настройки
              </Link>
              <button
                data-user-menu-item
                onClick={() => setOpenUser(false)}
                className="mt-1 w-full flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-white/[0.06] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                <LogOut className="h-4 w-4" /> Выйти (демо)
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* mobile drawer nav */}
      <AnimatePresence>
        {openMobileNav && (
          <motion.aside
            id="mobile-nav"
            ref={mobileNavRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={mobileNavTitleId}
            className="fixed z-50 top-0 left-0 h-[100dvh] w-[86vw] max-w-[360px] rounded-r-2xl border-r border-white/10 bg-[#0b0b0b] text-white shadow-[0_40px_120px_rgba(0,0,0,0.6)] lg:hidden"
            {...slideLeftAnim}
          >
            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
              <div id={mobileNavTitleId} className="text-sm font-semibold">
                Меню · {role === "admin" ? "Администратор" : "Пользователь"}
              </div>
              <button
                onClick={() => setOpenMobileNav(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                aria-label="Закрыть меню"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-4 pt-3">
              {/* Бренд вверху дровера */}
              <div className="flex items-center gap-2">
                <Link href="/" onClick={() => setOpenMobileNav(false)} className="font-semibold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent hover:underline rounded">
                  OneStack
                </Link>
                <Link href="/demo" onClick={() => setOpenMobileNav(false)} className="text-white/60 hover:underline rounded">
                  Demo
                </Link>
              </div>
            </div>

            <nav className="p-2 space-y-1 overflow-y-auto">
              {nav.map((item) => {
                const Icon = item.icon;
                const active = isActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    data-nav-item
                    onClick={() => setOpenMobileNav(false)}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm border transition
                      ${active ? "bg-white text-black border-white" : "border-white/10 hover:bg-white/[0.07] text-white/85"}`}
                  >
                    <Icon className={`h-4 w-4 ${active ? "text-black" : "text-white/80"}`} />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Нижний переключатель роли скрыт для компактности демо */}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

export default DemoTopbar;
