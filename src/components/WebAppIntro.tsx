// src/components/WebAppIntro.tsx
"use client";
import { serif } from "@/lib/fonts";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import Link from "next/link";
import { useRef, useMemo, useId, useEffect, useCallback, useState } from "react";
import { siteUrl } from "@/app/seo.config";
import { useI18n } from "@/i18n/I18nProvider";
import { useEnterTransition } from "@/lib/useEnterTransition";

/* ─── Font ──────────────────────────────────────────────────────────────── */

/* ─── Palette ────────────────────────────────────────────────────────────── */
const BG    = "#07100e";
const TEAL  = "#2dd4bf";
const WHITE = "#f4faf8";

/* ─── Copy ───────────────────────────────────────────────────────────────── */
const COPY_RU = {
  tag:   "Разработка веб-приложений",
  word0: "Веб-приложения,",
  word1: "которые",
  word2: "масштабируются",
  word3: "и растут",
  sub:   "Личные кабинеты, CRM/ERP и SaaS-платформы с фиксированной ценой. Правильная архитектура с первого дня и поддержка после запуска.",
  cta1:  "Обсудить проект",
  cta2:  "Рассчитать стоимость",
  scroll: "ПРОКРУТИТЕ",
  what:  "На этой странице",
  stats: [
    { v: "60+",      l: "веб-приложений" },
    { v: "4–8",      l: "нед. на MVP" },
    { v: "≤ 200 мс", l: "ответ API (P95)" },
  ],
  sections: [
    { num: "01", name: "Типы систем",      href: "#kinds"      },
    { num: "02", name: "Готовые модули",   href: "#modules"    },
    { num: "03", name: "Преимущества",     href: "#benefits"   },
    { num: "04", name: "Калькулятор",      href: "#calculator" },
  ],
} as const;

const COPY_EN = {
  tag:   "Web application development",
  word0: "Web apps",
  word1: "that",
  word2: "scale",
  word3: "and grow",
  sub:   "Client portals, CRM/ERP and SaaS platforms at a fixed price. Right architecture from day one and post-launch support.",
  cta1:  "Discuss the project",
  cta2:  "Calculate the cost",
  scroll: "SCROLL",
  what:  "On this page",
  stats: [
    { v: "60+",      l: "web apps built" },
    { v: "4–8",      l: "wks to MVP" },
    { v: "≤ 200 ms", l: "API response P95" },
  ],
  sections: [
    { num: "01", name: "System types",   href: "#kinds"      },
    { num: "02", name: "Ready modules",  href: "#modules"    },
    { num: "03", name: "Why us",         href: "#benefits"   },
    { num: "04", name: "Calculator",     href: "#calculator" },
  ],
} as const;

/* ─── Pre-computed ring dot positions ──────────────────────────────────────── */
const RING_DOTS = [0, 60, 120, 180, 240, 300].map((deg) => {
  const r = (deg * Math.PI) / 180;
  return { cx: +(450 + 430 * Math.cos(r)).toFixed(2), cy: +(450 + 430 * Math.sin(r)).toFixed(2) };
});

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

/* ═══════════════════════════════════════════════════════════════════════════
   WEBAPP INTRO
═══════════════════════════════════════════════════════════════════════════ */
export default function WebAppIntro() {
  const { locale } = useI18n();
  const isEn = locale === "en";
  const COPY = isEn ? COPY_EN : COPY_RU;
  const reduced    = useReducedMotion();
  const [hoverSec, setHoverSec] = useState<number | null>(null);
  const titleId    = useId();
  const sectionRef = useRef<HTMLElement>(null);
  const headlineIn = useEnterTransition();

  /* parallax */
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const bgY      = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  /* cursor glow */
  const mx = useMotionValue(-600);
  const my = useMotionValue(-600);
  const gx = useSpring(mx, { stiffness: 70, damping: 20, mass: 0.6 });
  const gy = useSpring(my, { stiffness: 70, damping: 20, mass: 0.6 });
  const onMove = useCallback((e: MouseEvent) => {
    const r = sectionRef.current?.getBoundingClientRect();
    if (r) { mx.set(e.clientX - r.left); my.set(e.clientY - r.top); }
  }, [mx, my]);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reduced) return;
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, [onMove, reduced]);

  const PAGE_URL = `${siteUrl}/webapp`;

  /* JSON-LD */
  const jsonLdSvc = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Разработка веб-приложений | OneStack",
    serviceType: "Web Application Development",
    description: "Проектируем и разрабатываем веб-приложения: личные кабинеты, CRM/ERP, аналитические дашборды, SaaS-платформы. Масштабируемая архитектура, AI-интеграции, безопасные API.",
    provider: {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "OneStack",
      url: siteUrl,
      email: "info@onestack24.ru",
      telephone: "+7-910-948-61-06",
      foundingDate: "2020",
      address: { "@type": "PostalAddress", addressCountry: "RU" },
      sameAs: ["https://t.me/onestack_assistant"],
    },
    areaServed: ["RU", "KZ", "BY", "AM"],
    url: PAGE_URL,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Типы веб-приложений",
      itemListElement: COPY.sections.map(s => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.name },
      })),
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "RUB",
      lowPrice: 350000,
      highPrice: 8000000,
      priceValidUntil: "2026-12-31",
    },
  }), [PAGE_URL]);

  const jsonLdBreadcrumb = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Веб-приложения", item: PAGE_URL },
    ],
  }), [PAGE_URL]);

  return (
    <>
      <script id="ld-webapp-svc" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSvc) }} />
      <script id="ld-webapp-bc" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />

      <section
        ref={sectionRef}
        id="intro"
        aria-labelledby={titleId}
        className="relative flex min-h-[100svh] flex-col overflow-hidden"
        style={{ background: BG }}
        itemScope itemType="https://schema.org/Service"
      >
        <meta itemProp="name" content="Разработка веб-приложений | OneStack" />

        {/* ── Decorative rotating ring ── */}
        <motion.div
          className="pointer-events-none absolute top-[5%] right-[-15%] w-[700px] h-[700px] xl:w-[900px] xl:h-[900px]"
          style={reduced ? undefined : { y: bgY }}
          animate={reduced ? undefined : { rotate: 360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          aria-hidden="true"
        >
          <svg viewBox="0 0 900 900" fill="none" className="w-full h-full">
            <circle cx="450" cy="450" r="430" stroke={TEAL} strokeWidth="0.5" opacity="0.12" strokeDasharray="6 14"/>
            <circle cx="450" cy="450" r="300" stroke={TEAL} strokeWidth="0.5" opacity="0.07"/>
            <circle cx="450" cy="450" r="160" stroke={TEAL} strokeWidth="0.5" opacity="0.05" strokeDasharray="3 8"/>
            <line x1="450" y1="20" x2="450" y2="880" stroke={TEAL} strokeWidth="0.3" opacity="0.04"/>
            <line x1="20"  y1="450" x2="880" y2="450" stroke={TEAL} strokeWidth="0.3" opacity="0.04"/>
            {RING_DOTS.map((d, i) => (
              <circle key={i} cx={d.cx} cy={d.cy} r="3" fill={TEAL} opacity="0.25"/>
            ))}
          </svg>
        </motion.div>

        {/* Grain */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.028]"
          style={{ backgroundImage: GRAIN, backgroundSize: "180px 180px" }}
          aria-hidden="true"
        />

        {/* Cursor glow */}
        {!reduced && (
          <motion.div
            className="pointer-events-none absolute rounded-full hidden lg:block"
            style={{
              left: gx, top: gy, translateX: "-50%", translateY: "-50%",
              width: 600, height: 600,
              background: `radial-gradient(circle, ${TEAL}16 0%, transparent 65%)`,
            }}
            aria-hidden="true"
          />
        )}

        {/* Ambient glow top-right */}
        <motion.div
          className="pointer-events-none absolute -top-32 -right-32 rounded-full blur-[180px]"
          style={{ width: 600, height: 600, background: TEAL, opacity: 0.09 }}
          animate={reduced ? undefined : { scale: [1, 1.12, 1], opacity: [0.09, 0.13, 0.09] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        />
        {/* Ambient glow bottom-left */}
        <div
          className="pointer-events-none absolute -bottom-20 -left-20 rounded-full blur-[160px]"
          style={{ width: 500, height: 500, background: TEAL, opacity: 0.05 }}
          aria-hidden="true"
        />

        {/* ── Content ── */}
        <motion.div
          style={reduced ? undefined : { y: contentY }}
          className="relative z-10 flex flex-1 flex-col justify-between mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-14 pt-28 sm:pt-32 pb-0"
        >
          {/* ── Top tag ── */}
          <motion.div
            className="flex items-center gap-3 mb-10 sm:mb-14"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              style={{ height: 2, width: 20, background: "#2dd4bf", borderRadius: 2, flexShrink: 0 }}
              initial={{ width: 0 }}
              animate={{ width: 20 }}
              transition={{ delay: 0.4, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
            <span className="text-[11px] tracking-[0.22em] uppercase font-medium" style={{ color: TEAL }}>
              {COPY.tag}
            </span>
          </motion.div>

          {/* ── Headline block ── */}
          <div className="flex-1 flex flex-col justify-center">
            <h1 id={titleId} className="mb-10 sm:mb-14" itemProp="name">

              {/* LINE 0 — OUTLINE / STROKE */}
              <span
                className={`${serif.className} block font-normal leading-[1.05] tracking-[-0.04em] transition-[opacity,transform] duration-[750ms] ease-[cubic-bezier(0.22,1,0.36,1)]`}
                style={{
                  fontSize: "clamp(2rem, 8.5vw, 8.5rem)",
                  color: TEAL,
                  opacity: reduced || headlineIn ? 1 : 0,
                  transform: reduced || headlineIn ? "translateY(0)" : "translateY(24px)",
                  transitionDelay: "150ms",
                }}
              >
                {COPY.word0}
              </span>

              {/* LINE 1 — full white */}
              <span
                className={`${serif.className} block font-normal leading-[1.05] tracking-[-0.04em] transition-[opacity,transform] duration-[750ms] ease-[cubic-bezier(0.22,1,0.36,1)]`}
                style={{
                  fontSize: "clamp(2rem, 8.5vw, 8.5rem)",
                  color: WHITE,
                  opacity: reduced || headlineIn ? 1 : 0,
                  transform: reduced || headlineIn ? "translateY(0)" : "translateY(24px)",
                  transitionDelay: "240ms",
                }}
              >
                {COPY.word1}
              </span>

              {/* LINE 2 — dimmer */}
              <span
                className={`${serif.className} block font-normal leading-[1.05] tracking-[-0.04em] transition-[opacity,transform] duration-[750ms] ease-[cubic-bezier(0.22,1,0.36,1)]`}
                style={{
                  fontSize: "clamp(2rem, 8.5vw, 8.5rem)",
                  color: "rgba(244,250,248,0.55)",
                  opacity: reduced || headlineIn ? 1 : 0,
                  transform: reduced || headlineIn ? "translateY(0)" : "translateY(24px)",
                  transitionDelay: "330ms",
                }}
              >
                {COPY.word2}
              </span>

              {/* LINE 3 — dimmest */}
              <span
                className={`${serif.className} block font-normal leading-[1.05] tracking-[-0.04em] transition-[opacity,transform] duration-[750ms] ease-[cubic-bezier(0.22,1,0.36,1)]`}
                style={{
                  fontSize: "clamp(2rem, 8.5vw, 8.5rem)",
                  color: "rgba(244,250,248,0.25)",
                  opacity: reduced || headlineIn ? 1 : 0,
                  transform: reduced || headlineIn ? "translateY(0)" : "translateY(24px)",
                  transitionDelay: "420ms",
                }}
              >
                {COPY.word3}
              </span>
            </h1>

            {/* ── Bottom row: description + CTA | sections nav ── */}
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-end pb-10 border-t pt-8"
              style={{ borderColor: "rgba(255,255,255,0.06)" }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* LEFT: description + stats + CTAs */}
              <div className="flex flex-col gap-6">
                <p
                  className="text-sm sm:text-base leading-relaxed max-w-sm"
                  style={{ color: "rgba(244,250,248,0.45)" }}
                  itemProp="description"
                >
                  {COPY.sub}
                </p>

                <div className="flex gap-6">
                  {COPY.stats.map((s) => (
                    <div key={s.l} className="flex flex-col">
                      <span className="text-xl font-bold" style={{ color: TEAL }}>{s.v}</span>
                      <span className="text-[11px] mt-0.5" style={{ color: "rgba(244,250,248,0.35)" }}>{s.l}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href="#contact"
                    className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full px-7 py-3 text-sm font-semibold transition-transform duration-300 hover:scale-[1.03] focus:outline-none"
                    style={{ background: TEAL, color: BG }}
                  >
                    <motion.span
                      className="pointer-events-none absolute inset-0"
                      style={{ background: "linear-gradient(105deg,transparent 38%,rgba(255,255,255,0.28) 50%,transparent 62%)" }}
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.45 }}
                      aria-hidden="true"
                    />
                    <span className="relative z-10">{COPY.cta1}</span>
                    <motion.svg
                      width="13" height="13" viewBox="0 0 13 13" fill="none"
                      className="relative z-10"
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <path d="M1.5 6.5h10M7.5 2.5l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </motion.svg>
                  </Link>
                  <Link
                    href="#calculator"
                    className="inline-flex items-center gap-2 rounded-full border px-7 py-3 text-sm font-medium transition-all duration-300 hover:bg-white/5 focus:outline-none"
                    style={{ borderColor: "rgba(244,250,248,0.14)", color: "rgba(244,250,248,0.6)" }}
                  >
                    {COPY.cta2}
                  </Link>
                </div>
              </div>

              {/* RIGHT: page sections nav */}
              <div className="flex flex-col gap-0">
                <p className="text-[10px] uppercase tracking-[0.2em] mb-4"
                  style={{ color: "rgba(244,250,248,0.2)" }}>
                  {COPY.what}
                </p>
                {COPY.sections.map((sec, i) => (
                  <a key={i} href={sec.href}
                    className="group flex items-center gap-4 py-3 border-b focus:outline-none"
                    style={{ borderColor: "rgba(255,255,255,0.05)" }}
                    onMouseEnter={() => setHoverSec(i)}
                    onMouseLeave={() => setHoverSec(null)}>
                    <span className="text-[11px] font-mono tabular-nums w-6 shrink-0 transition-colors duration-200"
                      style={{ color: hoverSec === i ? TEAL : "rgba(255,255,255,0.2)" }}>
                      {sec.num}
                    </span>
                    <span className="flex-1 text-sm transition-colors duration-200"
                      style={{ color: hoverSec === i ? WHITE : "rgba(244,250,248,0.4)" }}>
                      {sec.name}
                    </span>
                    <motion.span
                      className="text-sm shrink-0 transition-opacity duration-200"
                      style={{ color: TEAL, opacity: hoverSec === i ? 1 : 0 }}
                      animate={hoverSec === i ? { y: [0, 3, 0] } : { y: 0 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                    >
                      ↓
                    </motion.span>
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        {!reduced && (
          <div className="relative z-10 flex justify-center pb-6">
            <motion.div
              className="flex flex-col items-center gap-1.5"
              animate={{ y: [0, 7, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden="true"
            >
              <span
                className="text-[9px] tracking-[0.25em] uppercase"
                style={{ color: "rgba(255,255,255,0.15)" }}
              >
                {COPY.scroll}
              </span>
              <div
                className="w-px h-8"
                style={{ background: `linear-gradient(to bottom, ${TEAL}80, transparent)` }}
              />
            </motion.div>
          </div>
        )}
      </section>
    </>
  );
}
