"use client";
import { serif } from "@/lib/fonts";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Script from "next/script";
import { siteUrl } from "@/app/seo.config";
import { useI18n } from "@/i18n/I18nProvider";
import LanguageSwitcher from "./LanguageSwitcher";

/* ─── Font ───────────────────────────────────────────────────────────────── */

/* ─── Palette ─────────────────────────────────────────────────────────────── */
const BG    = "#07100e";
const TEAL  = "#2dd4bf";
const WHITE = "#f4faf8";

/* ─── Nav items ──────────────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { href: "/",       ru: "Домашняя",       en: "Home"     },
  { href: "/sites",  ru: "Сайты",          en: "Websites" },
  { href: "/webapp", ru: "Веб-приложения", en: "Web apps" },
  { href: "/mobile",   ru: "Мобильные",      en: "Mobile"   },
] as const;

const CONTACT_EMAIL = "info@onestack24.ru";
const CONTACT_PHONE = "+7 (910) 948 61 06";
const TELEGRAM_URL  = "https://t.me/onestack_assistant_bot";

/* ═══════════════════════════════════════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════════════════════════════════════ */
export default function NavBar() {
  const { messages: m, localizePath, locale } = useI18n();
  const lang = locale === "ru" ? "ru" : "en";

  const [open,     setOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const reduced  = useReducedMotion();
  const btnRef   = useRef<HTMLButtonElement>(null);

  /* scroll → show border on bar */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* close on route change */
  useEffect(() => { setOpen(false); }, [pathname]);

  /* lock scroll — iOS-safe: position fixed + restore scroll position */
  useEffect(() => {
    if (!open) return;
    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  /* Esc */
  useEffect(() => {
    if (!open) return;
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [open]);

  const isActive = (href: string) => {
    const local = localizePath(href);
    return pathname === href || pathname?.startsWith(href + "/") ||
           pathname === local || pathname?.startsWith(local + "/");
  };

  const navLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    name: NAV_ITEMS.map(i => i[lang]),
    url:  NAV_ITEMS.map(i => `${siteUrl}${localizePath(i.href)}`),
  }), [lang, localizePath]);

  return (
    <>
      {/* ── Fixed top bar ─────────────────────────────────────────── */}
      <header
        className="fixed top-0 left-0 right-0 z-[110] flex items-center justify-between px-6 sm:px-10 py-4 transition-all duration-300"
        style={{
          borderBottom: (scrolled && !open) ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
          background:   (scrolled && !open) ? `${BG}ee` : "transparent",
          backdropFilter: (scrolled && !open) ? "blur(14px)" : "none",
        }}
      >
        <a href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] rounded bg-black px-3 py-2 text-white text-sm">
          {m.nav.skipToContent}
        </a>

        {/* Logo */}
        <Link href={localizePath("/")} aria-label={m.nav.brandAria}
          className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 rounded z-[110] relative">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <rect width="28" height="28" rx="7" fill={TEAL} fillOpacity="0.08"/>
            <rect x=".5" y=".5" width="27" height="27" rx="6.5" stroke={TEAL} strokeOpacity="0.25"/>
            <path d="M14 4.5 L19 11.5 L14 10.5 L9 11.5 Z" fill={TEAL}/>
            <text x="14" y="22" textAnchor="middle" fontFamily="Georgia, serif"
              fontSize="10" fontWeight="700" letterSpacing="-0.5" fill={TEAL}>OS</text>
            <rect x="7" y="23.5" width="14" height="1.5" rx="0.75" fill={TEAL} fillOpacity="0.35"/>
          </svg>
          <span className="text-[15px] font-semibold tracking-tight" style={{ color: WHITE }}>
            OneStack
          </span>
        </Link>

        {/* Right controls */}
        <div className="flex items-center gap-4 z-[110] relative">
          {/* Lang switcher — hidden while menu is open */}
          <motion.div
            animate={{ opacity: open ? 0 : 1, pointerEvents: open ? "none" : "auto" }}
            transition={{ duration: 0.15 }}
          >
            <LanguageSwitcher compact />
          </motion.div>

          {/* Animated burger / close */}
          <button
            ref={btnRef}
            onClick={() => setOpen(v => !v)}
            className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded py-1"
            aria-expanded={open}
            aria-label={open ? (lang === "ru" ? "Закрыть меню" : "Close menu") : m.nav.menuLabel}
          >
            <div className="flex flex-col gap-[5px] w-5 shrink-0">
              <motion.span className="block h-[1.5px] rounded-full" style={{ background: WHITE }}
                animate={open ? { rotate: 45, y: 6.5 }  : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} />
              <motion.span className="block h-[1.5px] rounded-full" style={{ background: WHITE }}
                animate={open ? { scaleX: 0, opacity: 0 } : { scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.2 }} />
              <motion.span className="block h-[1.5px] rounded-full" style={{ background: WHITE }}
                animate={open ? { rotate: -45, y: -6.5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} />
            </div>
            <span className="hidden sm:block text-xs tracking-[0.12em] uppercase font-medium transition-colors"
              style={{ color: "rgba(255,255,255,0.45)" }}>
              {open ? (lang === "ru" ? "Закрыть" : "Close") : (lang === "ru" ? "Меню" : "Menu")}
            </span>
          </button>
        </div>
      </header>

      {/* ── Full-screen overlay ───────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="nav-overlay"
            className="fixed inset-0 z-[100] flex flex-col overflow-hidden"
            style={{ background: BG }}
            initial={reduced ? undefined : { clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)" }}
            animate={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
            exit={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)" }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
          >
            {/* Grain */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.025]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                backgroundSize: "180px 180px",
              }} aria-hidden="true" />

            {/* Top glow */}
            <div className="pointer-events-none absolute top-[-25%] right-[-8%] rounded-full blur-[200px] w-[550px] h-[550px]"
              style={{ background: TEAL, opacity: 0.07 }} aria-hidden="true" />

            {/* Main area */}
            <div className="flex-1 flex flex-col lg:flex-row px-6 sm:px-10 pt-24 pb-6 gap-0 overflow-y-auto min-h-0">

              {/* LEFT — nav links */}
              <nav aria-label={m.nav.menuLabel}
                className="flex-1 flex flex-col justify-center lg:pr-16">
                {NAV_ITEMS.map((item, i) => {
                  const active = isActive(item.href);
                  return (
                    <div key={item.href} className="overflow-hidden border-b"
                      style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                      <motion.div
                        initial={reduced ? undefined : { y: "110%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "110%" }}
                        transition={{ delay: 0.1 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <Link
                          href={localizePath(item.href)}
                          onClick={() => setOpen(false)}
                          className="group flex items-center gap-5 py-3 sm:py-4 focus:outline-none"
                          aria-current={active ? "page" : undefined}
                        >
                          {/* Index */}
                          <span className="text-[11px] font-mono tabular-nums w-7 shrink-0 transition-colors duration-200"
                            style={{ color: active ? TEAL : "rgba(255,255,255,0.18)" }}>
                            {String(i + 1).padStart(2, "0")}
                          </span>

                          {/* Label */}
                          <span
                            className={`${serif.className} font-normal leading-none tracking-[-0.02em] transition-colors duration-200 group-hover:opacity-100`}
                            style={{
                              fontSize: "clamp(2.2rem, 6.5vw, 6rem)",
                              color: active ? WHITE : "rgba(255,255,255,0.2)",
                            }}
                          >
                            {item[lang]}
                          </span>

                          {/* Hover arrow */}
                          <motion.span
                            className="ml-auto text-lg shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ color: TEAL }}
                            whileHover={{ x: 3, y: -3 }}
                          >
                            ↗
                          </motion.span>

                          {/* Active indicator */}
                          {active && (
                            <motion.div
                              layoutId="nav-active"
                              className="ml-2 w-2 h-2 rounded-full shrink-0"
                              style={{ background: TEAL }}
                              transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            />
                          )}
                        </Link>
                      </motion.div>
                    </div>
                  );
                })}
              </nav>

              {/* Vertical divider */}
              <motion.div className="hidden lg:block w-px self-stretch mx-14 my-4"
                style={{ background: "rgba(255,255,255,0.06)" }}
                initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
                transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              />

              {/* RIGHT — contacts */}
              <motion.aside
                className="hidden lg:flex flex-col justify-end gap-8 w-60 xl:w-68 py-4"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.38, duration: 0.45 }}
              >
                <div className="flex flex-col gap-2.5">
                  <p className="text-[10px] uppercase tracking-[0.16em] font-medium mb-1"
                    style={{ color: "rgba(255,255,255,0.22)" }}>
                    {lang === "ru" ? "Контакты" : "Contact"}
                  </p>
                  <a href={`mailto:${CONTACT_EMAIL}`}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: "rgba(255,255,255,0.4)" }}>
                    {CONTACT_EMAIL}
                  </a>
                  <a href={`tel:${CONTACT_PHONE.replace(/\D/g, "")}`}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: "rgba(255,255,255,0.4)" }}>
                    {CONTACT_PHONE}
                  </a>
                </div>

                <div className="flex flex-col gap-2.5">
                  <p className="text-[10px] uppercase tracking-[0.16em] font-medium mb-1"
                    style={{ color: "rgba(255,255,255,0.22)" }}>
                    {lang === "ru" ? "Соцсети" : "Social"}
                  </p>
                  <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer"
                    className="text-sm transition-colors hover:text-white inline-flex items-center gap-1.5"
                    style={{ color: "rgba(255,255,255,0.4)" }}>
                    Telegram <span style={{ color: TEAL }}>↗</span>
                  </a>
                </div>

              </motion.aside>
            </div>

            {/* Bottom strip */}
            <motion.div
              className="shrink-0 px-6 sm:px-10 py-4 border-t flex items-center justify-between gap-4"
              style={{ borderColor: "rgba(255,255,255,0.06)" }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.48, duration: 0.35 }}
            >
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.18)" }}>
                © {new Date().getFullYear()} OneStack
              </span>
              <span className="text-xs hidden sm:block tracking-wide"
                style={{ color: "rgba(255,255,255,0.12)" }}>
                {lang === "ru" ? "Веб-студия полного цикла" : "Full-cycle web studio"}
              </span>
              <span />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Script id="ld-site-nav" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(navLd) }} />
    </>
  );
}
