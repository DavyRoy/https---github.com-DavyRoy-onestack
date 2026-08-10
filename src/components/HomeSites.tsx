"use client";
import { serif } from "@/lib/fonts";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactElement } from "react";
import Link from "next/link";
import Script from "next/script";
import { useEffect, useId, useMemo, useState } from "react";
import { siteName, siteUrl } from "@/app/seo.config";
import { useI18n } from "@/i18n/I18nProvider";


const BG    = "#07100e";
const TEAL  = "#2dd4bf";
const WHITE = "#f4faf8";
const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

type SiteKey = "landing" | "corporate" | "ecommerce";

const TYPES: Record<SiteKey, {
  num: string;
  fig: string;
  title: { ru: string; en: string };
  desc:  { ru: string; en: string };
  href:  string;
}> = {
  landing: {
    num: "01", fig: "01 · LANDING",
    title: { ru: "Лендинги", en: "Landing pages" },
    desc: {
      ru: "Одностраничный сайт с максимальной конверсией. Идеально для запусков, промо-кампаний и сбора заявок.",
      en: "Single-page site with maximum conversion. Perfect for product launches, promo campaigns and lead generation.",
    },
    href: "/sites#landing",
  },
  corporate: {
    num: "02", fig: "02 · CORPORATE",
    title: { ru: "Корпоративные", en: "Corporate" },
    desc: {
      ru: "Многостраничный сайт с CMS, блогом, вакансиями и полным управлением контентом без программиста.",
      en: "Multi-page site with CMS, blog, vacancies and full content management without a developer.",
    },
    href: "/sites#corporate",
  },
  ecommerce: {
    num: "03", fig: "03 · ECOMMERCE",
    title: { ru: "Интернет-магазины", en: "Online stores" },
    desc: {
      ru: "Полноценная e-commerce платформа с каталогом, онлайн-оплатой, личным кабинетом и управлением заказами.",
      en: "Full e-commerce platform with catalog, online payments, user accounts and order management.",
    },
    href: "/sites#ecommerce",
  },
};

const KEYS: SiteKey[] = ["landing", "corporate", "ecommerce"];

type CopyType = { eyebrow: string; details: string };
const COPY: Record<"ru" | "en", CopyType> = {
  ru: { eyebrow: "Создание сайтов", details: "Подробнее" },
  en: { eyebrow: "Website development", details: "Details"  },
};

const SVG_STYLE: React.CSSProperties = {
  position: "absolute", inset: 0, width: "100%", height: "100%",
};

/* ═══════════════════════════════════════════════════════════════════════════
   FLAT WIREFRAME MOCKUPS — статичные, без анимации
═══════════════════════════════════════════════════════════════════════════ */

// Лендинг — телефон с контентом
function LandingVisual(): ReactElement {
  return (
    <svg style={SVG_STYLE} viewBox="0 0 340 295" fill="none" aria-hidden="true">
      {/* Phone frame */}
      <rect x="110" y="18" width="120" height="258" rx="16"
        stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="rgba(255,255,255,0.025)"/>
      {/* Status bar */}
      <line x1="110" y1="50" x2="230" y2="50" stroke="rgba(255,255,255,0.07)" strokeWidth="0.7"/>
      <circle cx="126" cy="34" r="2.5" fill="rgba(255,255,255,0.22)"/>
      <rect x="192" y="31" width="28" height="6" rx="3" fill="rgba(255,255,255,0.12)"/>
      {/* Hero area */}
      <rect x="110" y="50" width="120" height="72" fill="rgba(45,212,191,0.06)"/>
      <rect x="124" y="64" width="72" height="9" rx="2" fill={TEAL} fillOpacity="0.75"/>
      <rect x="124" y="78" width="52" height="6" rx="2" fill={TEAL} fillOpacity="0.45"/>
      <rect x="124" y="92" width="90" height="4" rx="2" fill="rgba(255,255,255,0.18)"/>
      <rect x="124" y="100" width="76" height="4" rx="2" fill="rgba(255,255,255,0.12)"/>
      {/* Divider */}
      <line x1="124" y1="132" x2="216" y2="132" stroke="rgba(255,255,255,0.07)" strokeWidth="0.7"/>
      {/* Content lines */}
      <rect x="124" y="142" width="92" height="4" rx="2" fill="rgba(255,255,255,0.17)"/>
      <rect x="124" y="152" width="82" height="4" rx="2" fill="rgba(255,255,255,0.12)"/>
      <rect x="124" y="162" width="70" height="4" rx="2" fill="rgba(255,255,255,0.09)"/>
      <rect x="124" y="172" width="86" height="4" rx="2" fill="rgba(255,255,255,0.12)"/>
      <rect x="124" y="182" width="64" height="4" rx="2" fill="rgba(255,255,255,0.09)"/>
      {/* CTA button */}
      <rect x="134" y="210" width="72" height="22" rx="11"
        stroke={TEAL} strokeOpacity="0.65" strokeWidth="1" fill={TEAL} fillOpacity="0.1"/>
      <rect x="148" y="219" width="44" height="4" rx="2" fill={TEAL} fillOpacity="0.55"/>
      {/* Home indicator */}
      <rect x="151" y="252" width="38" height="4" rx="2" fill="rgba(255,255,255,0.15)"/>
    </svg>
  );
}

// Корпоративный — браузер с структурой
function CorporateVisual(): ReactElement {
  return (
    <svg style={SVG_STYLE} viewBox="0 0 340 295" fill="none" aria-hidden="true">
      {/* Browser frame */}
      <rect x="18" y="48" width="304" height="208" rx="10"
        stroke="rgba(255,255,255,0.28)" strokeWidth="1" fill="rgba(255,255,255,0.02)"/>
      {/* Title bar bg */}
      <rect x="18" y="48" width="304" height="32" rx="10" fill="rgba(255,255,255,0.04)"/>
      <rect x="18" y="68" width="304" height="12" fill="rgba(255,255,255,0.04)"/>
      {/* Dots */}
      <circle cx="36" cy="64" r="4.5" fill="rgba(255,255,255,0.18)"/>
      <circle cx="52" cy="64" r="4.5" fill="rgba(255,255,255,0.1)"/>
      <circle cx="68" cy="64" r="4.5" fill="rgba(255,255,255,0.07)"/>
      {/* URL bar */}
      <rect x="88" y="56" width="152" height="16" rx="8"
        fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.6"/>
      {/* Divider */}
      <line x1="18" y1="80" x2="322" y2="80" stroke="rgba(255,255,255,0.07)" strokeWidth="0.7"/>
      {/* Nav row */}
      <rect x="30" y="90" width="42" height="6" rx="2" fill="rgba(255,255,255,0.22)"/>
      <rect x="82" y="90" width="32" height="6" rx="2" fill="rgba(255,255,255,0.1)"/>
      <rect x="124" y="90" width="32" height="6" rx="2" fill="rgba(255,255,255,0.1)"/>
      <rect x="166" y="90" width="32" height="6" rx="2" fill="rgba(255,255,255,0.1)"/>
      {/* Hero banner */}
      <rect x="30" y="106" width="280" height="52" rx="5"
        fill={TEAL} fillOpacity="0.07" stroke={TEAL} strokeOpacity="0.22" strokeWidth="0.8"/>
      <rect x="46" y="120" width="110" height="9" rx="2" fill={TEAL} fillOpacity="0.65"/>
      <rect x="46" y="134" width="74" height="5" rx="2" fill={TEAL} fillOpacity="0.38)"/>
      {/* 3-column content */}
      {[30, 128, 226].map((x, i) => (
        <g key={i}>
          <rect x={x} y="170" width="82" height="36" rx="4"
            fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.7"/>
          <rect x={x+10} y="180" width={i === 1 ? 52 : 44} height="6" rx="2" fill="rgba(255,255,255,0.2)"/>
          <rect x={x+10} y="191" width="36" height="4" rx="2" fill="rgba(255,255,255,0.1)"/>
        </g>
      ))}
      {/* Bottom text rows */}
      <rect x="30" y="220" width="280" height="4" rx="2" fill="rgba(255,255,255,0.1)"/>
      <rect x="30" y="230" width="220" height="4" rx="2" fill="rgba(255,255,255,0.07)"/>
    </svg>
  );
}

// Интернет-магазин — браузер с товарной сеткой
function EcommerceVisual(): ReactElement {
  return (
    <svg style={SVG_STYLE} viewBox="0 0 340 295" fill="none" aria-hidden="true">
      {/* Browser frame */}
      <rect x="18" y="48" width="304" height="208" rx="10"
        stroke="rgba(255,255,255,0.28)" strokeWidth="1" fill="rgba(255,255,255,0.02)"/>
      {/* Title bar */}
      <rect x="18" y="48" width="304" height="32" rx="10" fill="rgba(255,255,255,0.04)"/>
      <rect x="18" y="68" width="304" height="12" fill="rgba(255,255,255,0.04)"/>
      <circle cx="36" cy="64" r="4.5" fill="rgba(255,255,255,0.18)"/>
      <circle cx="52" cy="64" r="4.5" fill="rgba(255,255,255,0.1)"/>
      {/* Cart icon top-right */}
      <path d="M297,56 L293,56 L291,62 L301,62 L303,58 L295,58"
        stroke={TEAL} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="293" cy="64" r="1.5" fill={TEAL} fillOpacity="0.8"/>
      <circle cx="299" cy="64" r="1.5" fill={TEAL} fillOpacity="0.8"/>
      {/* Divider */}
      <line x1="18" y1="80" x2="322" y2="80" stroke="rgba(255,255,255,0.07)" strokeWidth="0.7"/>
      {/* Category nav */}
      <rect x="30" y="90" width="38" height="5" rx="2" fill={TEAL} fillOpacity="0.7)"/>
      <rect x="78" y="90" width="30" height="5" rx="2" fill="rgba(255,255,255,0.14)"/>
      <rect x="118" y="90" width="30" height="5" rx="2" fill="rgba(255,255,255,0.1)"/>
      <rect x="158" y="90" width="30" height="5" rx="2" fill="rgba(255,255,255,0.1)"/>
      {/* Product grid — 4 cards (2×2) */}
      {/* Card top-left (featured, teal) */}
      <rect x="30" y="104" width="128" height="72" rx="5"
        fill={TEAL} fillOpacity="0.06" stroke={TEAL} strokeOpacity="0.28" strokeWidth="0.8"/>
      <rect x="44" y="116" width="74" height="32" rx="3" fill={TEAL} fillOpacity="0.1"/>
      <rect x="44" y="153" width="52" height="5" rx="2" fill="rgba(255,255,255,0.22)"/>
      <rect x="44" y="163" width="36" height="5" rx="2" fill={TEAL} fillOpacity="0.6"/>
      {/* Card top-right */}
      <rect x="172" y="104" width="128" height="72" rx="5"
        fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.7"/>
      <rect x="186" y="116" width="74" height="32" rx="3" fill="rgba(255,255,255,0.04)"/>
      <rect x="186" y="153" width="52" height="5" rx="2" fill="rgba(255,255,255,0.18)"/>
      <rect x="186" y="163" width="36" height="5" rx="2" fill="rgba(255,255,255,0.12)"/>
      {/* Card bottom-left */}
      <rect x="30" y="186" width="128" height="58" rx="5"
        fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.7"/>
      <rect x="44" y="196" width="74" height="22" rx="3" fill="rgba(255,255,255,0.04)"/>
      <rect x="44" y="223" width="52" height="5" rx="2" fill="rgba(255,255,255,0.18)"/>
      <rect x="44" y="232" width="36" height="5" rx="2" fill="rgba(255,255,255,0.12)"/>
      {/* Card bottom-right */}
      <rect x="172" y="186" width="128" height="58" rx="5"
        fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.7"/>
      <rect x="186" y="196" width="74" height="22" rx="3" fill="rgba(255,255,255,0.04)"/>
      <rect x="186" y="223" width="52" height="5" rx="2" fill="rgba(255,255,255,0.18)"/>
      <rect x="186" y="232" width="36" height="5" rx="2" fill="rgba(255,255,255,0.12)"/>
    </svg>
  );
}

const VISUAL_MAP: Record<SiteKey, () => ReactElement> = {
  landing:   LandingVisual,
  corporate: CorporateVisual,
  ecommerce: EcommerceVisual,
};

/* ═══════════════════════════════════════════════════════════════════════════
   COLUMN — без рамки, иллюстрация на весь блок
═══════════════════════════════════════════════════════════════════════════ */
function SiteColumn({ siteKey, lang, isMobile }: { siteKey: SiteKey; lang: "ru"|"en"; isMobile: boolean }) {
  const t      = TYPES[siteKey];
  const Visual = VISUAL_MAP[siteKey];

  if (isMobile) {
    return (
      <div style={{ paddingBottom: 48 }}>
        <div style={{
          fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase" as const,
          color: "rgba(255,255,255,0.28)", fontFamily: "monospace", marginBottom: 20,
        }}>
          {t.fig}
        </div>
        <div style={{ position: "relative", height: 200, overflow: "hidden", marginBottom: 24 }}>
          <Visual />
        </div>
        <div style={{ fontSize: 16, fontWeight: 600, color: WHITE, fontFamily: serif.style.fontFamily, marginBottom: 8 }}>
          {t.title[lang]}
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.42)", lineHeight: 1.7 }}>
          {t.desc[lang]}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* FIG label */}
      <div style={{
        fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase" as const,
        color: "rgba(255,255,255,0.28)", fontFamily: "monospace", marginBottom: 28,
      }}>
        {t.fig}
      </div>

      {/* Иллюстрация — крупная, без рамки */}
      <div style={{ position: "relative", height: 295, overflow: "hidden" }}>
        <Visual />
      </div>

      {/* Текст */}
      <div style={{ paddingTop: 32 }}>
        <div style={{
          fontSize: 20, fontWeight: 600, color: WHITE,
          fontFamily: serif.style.fontFamily, letterSpacing: "-0.01em", marginBottom: 10,
        }}>
          {t.title[lang]}
        </div>
        <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.42)", lineHeight: 1.75 }}>
          {t.desc[lang]}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════════════════════════════════ */
export default function HomeSites() {
  const { locale } = useI18n();
  const lang    = locale === "ru" ? "ru" : "en";
  const c       = COPY[lang];
  const reduced = useReducedMotion();
  const titleId = useId();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const jsonLd = useMemo(() => ({
    "@context": "https://schema.org", "@type": "Service",
    name: `Разработка сайтов | ${siteName}`,
    provider: { "@type": "Organization", "@id": `${siteUrl}/#organization` },
    hasOfferCatalog: {
      "@type": "OfferCatalog", name: "Типы сайтов",
      itemListElement: KEYS.map(k => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: TYPES[k].title.ru, description: TYPES[k].desc.ru },
      })),
    },
  }), []);

  return (
    <>
      <Script id="ld-home-sites" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section
        id="sites"
        aria-labelledby={titleId}
        style={{ background: BG, position: "relative", overflow: "hidden", borderTop: "1px solid rgba(255,255,255,0.06)" }}>

        <div aria-hidden="true" style={{
          pointerEvents: "none", position: "absolute", inset: 0,
          backgroundImage: GRAIN, backgroundSize: "180px 180px", opacity: 0.025,
        }} />
        <div aria-hidden="true" style={{
          pointerEvents: "none", position: "absolute",
          top: "5%", right: "-8%", width: 800, height: 800,
          borderRadius: "50%", filter: "blur(280px)",
          background: TEAL, opacity: 0.05,
        }} />

        <div style={{
          position: "relative", zIndex: 10,
          maxWidth: 1280, margin: "0 auto",
          padding: isMobile ? "48px 20px 64px" : "80px 56px 96px",
        }}>

          {/* Eyebrow + headline */}
          <div style={{ marginBottom: isMobile ? 52 : 80 }}>
            <motion.div
              style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}
              initial={reduced ? undefined : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}>
              <div style={{ height: 2, width: 20, background: TEAL, borderRadius: 2, flexShrink: 0 }} />
              <span style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 500, color: TEAL }}>
                {c.eyebrow}
              </span>
            </motion.div>

            <div>
              {[
                { text: lang === "ru" ? "Разработка" : "Website",    outline: true  },
                { text: lang === "ru" ? "сайтов"     : "Development", outline: false },
              ].map((line, i) => (
                <motion.div key={i}
                  className={serif.className}
                  style={{
                    display: "block", fontWeight: 400,
                    lineHeight: 1, letterSpacing: "-0.04em",
                    fontSize: "clamp(2.8rem,7vw,8rem)",
                    ...(line.outline
                      ? { WebkitTextStroke: `1.5px ${TEAL}`, color: "transparent" }
                      : { color: WHITE }),
                  }}
                  initial={reduced ? undefined : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.05 + i * 0.07 }}>
                  {line.text}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Три колонки — без рамок, как у Linear */}
          <motion.div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            }}
            initial={reduced ? undefined : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
            {KEYS.map((k, i) => (
              <div key={k} style={{
                borderRight:  !isMobile && i < 2 ? "1px solid rgba(255,255,255,0.08)" : "none",
                borderBottom:  isMobile && i < 2 ? "1px solid rgba(255,255,255,0.08)" : "none",
                paddingRight: !isMobile && i < 2 ? 44 : 0,
                paddingLeft:  !isMobile && i > 0 ? 44 : 0,
                paddingBottom: isMobile && i < 2 ? 40 : 0,
                paddingTop:    isMobile && i > 0 ? 40 : 0,
              }}>
                <SiteColumn siteKey={k} lang={lang} isMobile={isMobile} />
              </div>
            ))}
          </motion.div>

          {/* Подробнее — справа */}
          <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: isMobile ? 16 : 40 }}>
            <Link
              href="/sites"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                fontSize: 13, fontWeight: 500,
                color: "rgba(255,255,255,0.52)",
                letterSpacing: "0.02em", textDecoration: "none",
                borderBottom: "1px solid rgba(255,255,255,0.15)",
                paddingBottom: 2,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.color = WHITE;
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.45)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.52)";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.15)";
              }}
            >
              {c.details}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2.5 7h9m0 0L8 3.5M11.5 7L8 10.5"
                  stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>

        </div>
      </section>
    </>
  );
}
