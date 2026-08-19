"use client";
import { serif } from "@/lib/fonts";
import {
  motion,
  useReducedMotion, useScroll, useTransform,
  useMotionValue, useSpring,
} from "framer-motion";
import Link from "next/link";
import Script from "next/script";
import { useRef, useMemo, useId, useEffect, useState, useCallback } from "react";
import { siteName, siteUrl } from "@/app/seo.config";
import { useI18n } from "@/i18n/I18nProvider";
import { useEnterTransition } from "@/lib/useEnterTransition";

/* ─── Font ──────────────────────────────────────────────────────────────── */

/* ─── Palette ────────────────────────────────────────────────────────────── */
const BG    = "#07100e";
const TEAL  = "#2dd4bf";
const WHITE = "#f4faf8";

/* ─── Copy ───────────────────────────────────────────────────────────────── */
const COPY = {
  ru: {
    tag:      "Технологический партнёр · с 2021",
    headline: "Одна экосистема для вашего бизнеса",
    sub:   "Сайты, веб- и мобильные приложения с фиксированной ценой, спринтами 1–2 недели и поддержкой после запуска.",
    cta1:  "Обсудить проект",
    cta2:  "Наши работы",
    more:  "Подробнее",
    stats: [
      { v: "150+", l: "проектов сдано" },
      { v: "98%",  l: "сдаём в срок" },
      { v: "5",    l: "лет на рынке" },
    ],
    scroll: "ПРОКРУТИТЕ",
    what: "Что мы делаем",
    services: [
      { name: "Сайты",          href: "#sites",    num: "01" },
      { name: "Веб-приложения", href: "#webapp",   num: "02" },
      { name: "Мобильные",      href: "#mobile",   num: "03" },
      { name: "Оставить заявку", href: "#contact", num: "04" },
    ],
  },
  en: {
    tag:      "Technology partner · since 2021",
    headline: "One ecosystem for your business",
    sub:   "Websites, web & mobile apps with fixed price, 1–2 week sprints and post-launch support.",
    cta1:  "Discuss project",
    cta2:  "Our works",
    more:  "Learn more",
    scroll: "SCROLL",
    what: "What we do",
    services: [
      { name: "Websites",     href: "#sites",    num: "01" },
      { name: "Web apps",     href: "#webapp",   num: "02" },
      { name: "Mobile",       href: "#mobile",   num: "03" },
      { name: "Get in touch", href: "#contact",  num: "04" },
    ],
  },
} as const;

/* ─── Pre-computed ring dot positions (avoids SSR/client float mismatch) ── */
const RING_DOTS = [0, 60, 120, 180, 240, 300].map((deg) => {
  const r = (deg * Math.PI) / 180;
  return { cx: +(450 + 430 * Math.cos(r)).toFixed(2), cy: +(450 + 430 * Math.sin(r)).toFixed(2) };
});

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

/* ═══════════════════════════════════════════════════════════════════════════
   HOME INTRO
═══════════════════════════════════════════════════════════════════════════ */
export default function HomeIntro() {
  const { locale, localizePath } = useI18n();
  const lang = locale === "ru" ? "ru" : "en";
  const c    = COPY[lang];
  const reduced    = useReducedMotion();
  const titleId    = useId();
  const sectionRef = useRef<HTMLElement>(null);
  const [hoverSvc, setHoverSvc] = useState<number | null>(null);

  const headlineIn = useEnterTransition();

  /* parallax */
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
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

  /* JSON-LD */
  const jsonLdOrg = useMemo(() => ({
    "@context": "https://schema.org", "@type": "Organization",
    "@id": `${siteUrl}/#organization`, name: siteName, url: siteUrl,
    logo: { "@type": "ImageObject", url: `${siteUrl}/logo.png`, width: 512, height: 512 },
    contactPoint: [{ "@type": "ContactPoint", telephone: "+7-910-948-61-06",
      contactType: "customer service", email: "info@onestack24.ru" }],
  }), []);
  const jsonLdSvc = useMemo(() => ({
    "@context": "https://schema.org", "@type": "Service",
    name: `Разработка сайтов и приложений | ${siteName}`,
    provider: { "@type": "Organization", "@id": `${siteUrl}/#organization` },
    offers: { "@type": "AggregateOffer", priceCurrency: "RUB", lowPrice: 20000, highPrice: 5000000 },
  }), []);

  return (
    <>
      <Script id="ld-hi-org" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }} />
      <Script id="ld-hi-svc" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSvc) }} />

      <section
        ref={sectionRef}
        id="intro"
        aria-labelledby={titleId}
        className="relative flex min-h-[100svh] flex-col overflow-hidden"
        style={{ background: BG }}
      >
        {/* ── Decorative rotating ring ── */}
        <motion.div
          className="pointer-events-none absolute top-[5%] right-[-15%] w-[700px] h-[700px] xl:w-[900px] xl:h-[900px]"
          style={reduced ? undefined : { y: bgY }}
          animate={reduced ? undefined : { rotate: 360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          aria-hidden="true"
        >
          <svg viewBox="0 0 900 900" fill="none" className="w-full h-full">
            {/* Outer ring */}
            <circle cx="450" cy="450" r="430" stroke={TEAL} strokeWidth="0.5" opacity="0.12" strokeDasharray="6 14"/>
            {/* Middle ring */}
            <circle cx="450" cy="450" r="300" stroke={TEAL} strokeWidth="0.5" opacity="0.07"/>
            {/* Inner ring */}
            <circle cx="450" cy="450" r="160" stroke={TEAL} strokeWidth="0.5" opacity="0.05" strokeDasharray="3 8"/>
            {/* Cross hairs */}
            <line x1="450" y1="20" x2="450" y2="880" stroke={TEAL} strokeWidth="0.3" opacity="0.04"/>
            <line x1="20"  y1="450" x2="880" y2="450" stroke={TEAL} strokeWidth="0.3" opacity="0.04"/>
            {/* Dots on outer ring — pre-computed to avoid hydration mismatch */}
            {RING_DOTS.map((d, i) => (
              <circle key={i} cx={d.cx} cy={d.cy} r="3" fill={TEAL} opacity="0.25"/>
            ))}
          </svg>
        </motion.div>

        {/* Grain */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.028]"
          style={{ backgroundImage: GRAIN, backgroundSize: "180px 180px" }} aria-hidden="true" />

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
        <div className="pointer-events-none absolute -bottom-20 -left-20 rounded-full blur-[160px]"
          style={{ width: 500, height: 500, background: TEAL, opacity: 0.05 }} aria-hidden="true" />

        {/* ── Content ── */}
        <motion.div
          style={reduced ? undefined : { y: contentY }}
          className="relative z-10 flex flex-1 flex-col justify-between mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-14 pt-24 sm:pt-28 lg:pt-16 pb-0"
        >
          {/* ── Top tag ── */}
          <motion.div
            className="flex items-center justify-center gap-3 mb-10 sm:mb-14"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.55, ease: [0.22,1,0.36,1] }}
          >
            <motion.div style={{ height: 2, width: 20, background: "#2dd4bf", borderRadius: 2, flexShrink: 0 }}
              initial={{ width: 0 }} animate={{ width: 20 }}
              transition={{ delay: 0.4, duration: 0.4, ease: [0.22,1,0.36,1] }} />
            <span className="text-[11px] tracking-[0.22em] uppercase font-medium" style={{ color: TEAL }}>
              {c.tag}
            </span>
          </motion.div>

          {/* ── Headline block ── */}
          <div className="flex-1 flex flex-col justify-center">
            <h1 id={titleId} className="mb-10 sm:mb-14 max-w-4xl">
              <span className="block overflow-hidden leading-[1.12] py-1">
                <span
                  className={`${serif.className} block font-bold tracking-[-0.02em] transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]`}
                  style={{
                    fontSize: "clamp(2.2rem, 8vw, 7.5rem)",
                    color: WHITE,
                    transform: reduced || headlineIn ? "translateY(0)" : "translateY(120px)",
                    transitionDelay: "150ms",
                  }}
                >
                  {c.headline}
                </span>
              </span>
            </h1>

            {/* ── Bottom row: description + CTA | services ── */}
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8 lg:gap-16 items-end pb-10 border-t pt-8"
              style={{ borderColor: "rgba(255,255,255,0.06)" }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.7, ease: [0.22,1,0.36,1] }}
            >
              {/* Description + CTAs */}
              <div className="flex flex-col gap-6">
                <p className="text-sm sm:text-base leading-relaxed max-w-sm"
                  style={{ color: "rgba(244,250,248,0.45)" }}>
                  {c.sub}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href={localizePath("/#contact")}
                    className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full px-7 py-3 text-sm font-semibold transition-transform duration-300 hover:scale-[1.03] focus:outline-none"
                    style={{ background: TEAL, color: BG }}>
                    <motion.span
                      className="pointer-events-none absolute inset-0"
                      style={{ background: "linear-gradient(105deg,transparent 38%,rgba(255,255,255,0.28) 50%,transparent 62%)" }}
                      initial={{ x: "-100%" }} whileHover={{ x: "100%" }}
                      transition={{ duration: 0.45 }} aria-hidden="true" />
                    <span className="relative z-10">{c.cta1}</span>
                    <motion.svg width="13" height="13" viewBox="0 0 13 13" fill="none"
                      className="relative z-10"
                      animate={reduced ? undefined : { x: [0,3,0] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
                      <path d="M1.5 6.5h10M7.5 2.5l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </motion.svg>
                  </Link>
                </div>
              </div>

              {/* Services — scroll to section on home page */}
              <div className="flex flex-col gap-0">
                <p className="text-[10px] uppercase tracking-[0.2em] mb-4"
                  style={{ color: "rgba(244,250,248,0.2)" }}>
                  {c.what}
                </p>
                {c.services.map((svc, i) => (
                  <a key={i} href={svc.href}
                    className="group flex items-center gap-4 py-3 border-b focus:outline-none"
                    style={{ borderColor: "rgba(255,255,255,0.05)" }}
                    onMouseEnter={() => setHoverSvc(i)}
                    onMouseLeave={() => setHoverSvc(null)}>
                    {/* number */}
                    <span className="text-[11px] font-mono tabular-nums w-6 shrink-0 transition-colors duration-200"
                      style={{ color: hoverSvc === i ? TEAL : "rgba(255,255,255,0.2)" }}>
                      {svc.num}
                    </span>
                    {/* name */}
                    <span className="flex-1 text-sm transition-colors duration-200"
                      style={{ color: hoverSvc === i ? WHITE : "rgba(244,250,248,0.4)" }}>
                      {svc.name}
                    </span>
                    {/* arrow — scroll down */}
                    <motion.span
                      className="text-sm shrink-0 transition-opacity duration-200"
                      style={{ color: TEAL, opacity: hoverSvc === i ? 1 : 0 }}
                      animate={hoverSvc === i ? { y: [0, 3, 0] } : { y: 0 }}
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
              <span className="text-[9px] tracking-[0.25em] uppercase" style={{ color: "rgba(255,255,255,0.15)" }}>
                {c.scroll}
              </span>
              <div className="w-px h-8" style={{ background: `linear-gradient(to bottom, ${TEAL}80, transparent)` }} />
            </motion.div>
          </div>
        )}

      </section>
    </>
  );
}
