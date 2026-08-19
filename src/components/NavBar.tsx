"use client";
import { serif, serifItalic } from "@/lib/fonts";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useMountTransition } from "@/lib/useEnterTransition";
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
  const { mounted: overlayMounted, shown: overlayShown } = useMountTransition(open, 550);

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

        {/* Logo — italic wordmark, no icon badge */}
        <Link href={localizePath("/")} aria-label={m.nav.brandAria}
          className="group flex items-center focus:outline-none focus-visible:ring-2 rounded z-[110] relative">
          <motion.span
            className={`${serifItalic.className} text-[19px] sm:text-[21px] font-normal tracking-tight`}
            style={{ color: WHITE }}
            initial={reduced ? { opacity: 1, x: 0 } : { opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
            whileHover={reduced ? undefined : { color: TEAL, transition: { duration: 0.25 } }}
          >
            OneStack
          </motion.span>
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
      {overlayMounted && (
          <div
            className="fixed inset-0 z-[100] flex flex-col overflow-hidden transition-[clip-path] duration-[550ms] ease-[cubic-bezier(0.76,0,0.24,1)]"
            style={{
              background: BG,
              clipPath: reduced || overlayShown
                ? "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
                : "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
            }}
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
                      <div
                        className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                        style={{
                          transform: reduced || overlayShown ? "translateY(0)" : "translateY(90px)",
                          transitionDelay: `${100 + i * 60}ms`,
                        }}
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
                      </div>
                    </div>
                  );
                })}
              </nav>

              {/* Vertical divider */}
              <div
                className="hidden lg:block w-px self-stretch mx-14 my-4 origin-top transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  transform: overlayShown ? "scaleY(1)" : "scaleY(0)",
                  transitionDelay: "300ms",
                }}
              />

              {/* RIGHT — contacts */}
              <aside
                className="hidden lg:flex flex-col justify-end gap-8 w-60 xl:w-68 py-4 transition-[opacity,transform] duration-[450ms]"
                style={{
                  opacity: reduced || overlayShown ? 1 : 0,
                  transform: reduced || overlayShown ? "translateX(0)" : "translateX(16px)",
                  transitionDelay: "380ms",
                }}
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

              </aside>
            </div>

            {/* Bottom strip */}
            <div
              className="shrink-0 px-6 sm:px-10 py-4 border-t flex items-center justify-between gap-4 transition-opacity duration-[350ms]"
              style={{
                borderColor: "rgba(255,255,255,0.06)",
                opacity: reduced || overlayShown ? 1 : 0,
                transitionDelay: "480ms",
              }}
            >
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.18)" }}>
                © {new Date().getFullYear()} OneStack
              </span>
              <span className="text-xs hidden sm:block tracking-wide"
                style={{ color: "rgba(255,255,255,0.12)" }}>
                {lang === "ru" ? "Веб-студия полного цикла" : "Full-cycle web studio"}
              </span>
              <span />
            </div>
          </div>
      )}

      <script id="ld-site-nav" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(navLd) }} />
    </>
  );
}
