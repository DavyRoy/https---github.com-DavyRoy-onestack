// src/app/components/DemoHeader.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  Home,
  Menu,
  X,
  ExternalLink,
  User,
  Briefcase,
  Shield,
  Languages,
} from "lucide-react";
import clsx from "clsx";
import { createPortal } from "react-dom";
import NavBar from "./NavBar";

/* ----------------------------- UI helpers ----------------------------- */
const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-xl px-3.5 h-9 text-sm font-medium transition outline-none";
const btnGhost =
  "bg-transparent hover:bg-[hsl(var(--panel))]/80 border border-[hsl(var(--border))] text-[hsl(var(--fg))] focus:ring-2 focus:ring-[hsl(var(--brand))] focus:ring-offset-2 focus:ring-offset-[hsl(var(--panel))]";
const btnPrimary =
  "bg-[hsl(var(--brand))] text-white hover:opacity-90 active:opacity-80 focus:ring-2 focus:ring-[hsl(var(--brand))]/60 focus:ring-offset-2 focus:ring-offset-[hsl(var(--panel))]";
const linkQuiet =
  "text-sm text-[hsl(var(--fg))] hover:underline underline-offset-4 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand))] rounded-md";

/* ----------------------------- Body Portal ---------------------------- */
function BodyPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useLayoutEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}

/* ------------------------------ Center CTA ---------------------------- */
function CenterContent() {
  const pathname = usePathname();
  const isHome = pathname === "/demo" || pathname === "/demo/";
  if (isHome) return null;

  const links = [
    { href: "/demo/user", label: "Пользователь", Icon: User },
    { href: "/demo/manager", label: "Менеджер", Icon: Briefcase },
    { href: "/demo/admin", label: "Администратор", Icon: Shield },
  ];

  return (
    <nav
      className="hidden items-center gap-2 md:flex"
      aria-label="Быстрый запуск ролей"
    >
      {links.map(({ href, label, Icon }) => {
        const active = pathname?.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={clsx(
              btnBase,
              active ? btnPrimary : btnGhost,
              "relative"
            )}
            aria-current={active ? "page" : undefined}
          >
            <Icon width={16} height={16} aria-hidden />
            {label}
            {/* Активный индикатор в стиле Linear */}
            {active && (
              <span
                aria-hidden
                className="absolute -bottom-[9px] left-1/2 h-[2px] w-1/2 -translate-x-1/2 rounded-full bg-[hsl(var(--brand))]"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

/* ----------------------------- Mobile Drawer -------------------------- */
function MobileMenu({
  open,
  onClose,
  openerRef,
}: {
  open: boolean;
  onClose: () => void;
  openerRef: React.RefObject<HTMLButtonElement>;
}) {
  // блокируем скролл body при открытом меню
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // закрытие по Esc + возврат фокуса к кнопке
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        openerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose, openerRef]);

  // trap tab внутри панели
  const panelRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const container = panelRef.current;
      if (!container) return;
      const focusables = container.querySelectorAll<HTMLElement>(
        'a,button,[tabindex]:not([tabindex="-1"])'
      );
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        (last as HTMLElement).focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        (first as HTMLElement).focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  if (!open) return null;

  return (
    <BodyPortal>
      <div
        className="fixed inset-0 z-[10000] md:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Мобильное меню"
      >
        {/* Backdrop */}
        <button
          aria-label="Закрыть меню"
          className="absolute inset-0 bg-black/80"
          onClick={() => {
            onClose();
            openerRef.current?.focus();
          }}
        />
        {/* Panel */}
        <aside
          ref={panelRef}
          className="absolute inset-y-0 right-0 w-80 max-w-[85%] bg-[hsl(var(--panel))] border-l border-[hsl(var(--border))] p-4 shadow-2xl translate-x-0 will-change-transform"
        >
          <div className="flex items-center justify-between">
            <div className="font-semibold">Меню</div>
            <button
              className={clsx(btnBase, btnGhost, "h-9 w-9 px-0")}
              aria-label="Закрыть"
              onClick={() => {
                onClose();
                openerRef.current?.focus();
              }}
            >
              <X width={18} height={18} aria-hidden />
            </button>
          </div>

          <nav className="mt-4 grid gap-2" aria-label="Навигация секций">
            <Link
              href="/demo#intro"
              className={clsx(btnBase, btnGhost)}
              onClick={onClose}
            >
              Приветствие
            </Link>
            <Link
              href="/demo#capabilities"
              className={clsx(btnBase, btnGhost)}
              onClick={onClose}
            >
              Модули
            </Link>
            <Link
              href="/demo#tour"
              className={clsx(btnBase, btnGhost)}
              onClick={onClose}
            >
              Сценарии
            </Link>
            <Link
              href="/demo#faq"
              className={clsx(btnBase, btnGhost)}
              onClick={onClose}
            >
              FAQ
            </Link>
          </nav>

          <div className="mt-6 grid gap-2">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className={clsx(btnBase, btnPrimary)}
              onClick={onClose}
            >
              <ExternalLink width={16} height={16} aria-hidden />
              На сайт
            </Link>
            <Link
              href="/demo"
              className={clsx(btnBase, btnGhost)}
              onClick={onClose}
            >
              <Home width={16} height={16} aria-hidden />
              Главная демо
            </Link>
          </div>
        </aside>
      </div>
    </BodyPortal>
  );
}

/* -------------------------------- Header ------------------------------ */
export default function DemoHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/demo" || pathname === "/demo/";
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  // На страницах конкретных ролей используем специализированный топбар
  if (
    pathname?.startsWith("/demo/user") ||
    pathname?.startsWith("/demo/manager") ||
    pathname?.startsWith("/demo/admin")
  ) {
    return null;
  }

  // Главная демо — используем ваш NavBar (герой-лендинг)
  if (isHome) {
    return (
      <div className="relative z-50 px-4 pt-6 sm:px-6 md:px-8">
        <NavBar />
      </div>
    );
  }

  // Внутренние страницы демо — компактный sticky header
  return (
    <header className="sticky top-0 z-40 border-b border-[hsl(var(--border))] bg-[hsl(var(--panel))] supports-[backdrop-filter]:backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / back to demo */}
        <div className="flex items-center gap-3">
          <Link
            href="/demo"
            className="font-semibold hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand))] rounded-md px-1"
          >
            OneStack • Demo CRM
          </Link>
        </div>

        <CenterContent />

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 md:flex">
          <Link href="/" className={clsx(btnBase, btnGhost)}>
            <ExternalLink width={16} height={16} aria-hidden />
            На сайт
          </Link>
          <Link href="/demo" className={clsx(btnBase, btnPrimary)}>
            <Home width={16} height={16} aria-hidden />
            Главная демо
          </Link>
          {/* Заглушка выбора языка (готово к подключению i18n) */}
          <button className={clsx(btnBase, btnGhost)} aria-label="Язык">
            <Languages width={16} height={16} aria-hidden />
          </button>
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/"
            className={clsx(btnBase, btnGhost, "h-9 w-9 px-0")}
            aria-label="На сайт"
          >
            <ExternalLink width={18} height={18} aria-hidden />
          </Link>
          <Link
            href="/demo"
            className={clsx(btnBase, btnGhost, "h-9 w-9 px-0")}
            aria-label="Главная демо"
          >
            <Home width={18} height={18} aria-hidden />
          </Link>
          <button
            ref={menuBtnRef}
            type="button"
            className={clsx(btnBase, btnPrimary, "h-9 w-9 px-0")}
            aria-label="Меню"
            aria-haspopup="dialog"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <Menu width={18} height={18} aria-hidden />
          </button>
        </div>
      </div>

      <MobileMenu
        open={open}
        onClose={() => setOpen(false)}
        openerRef={menuBtnRef}
      />
    </header>
  );
}