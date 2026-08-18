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

type MobileKey = "native" | "cross" | "marketplace";

const TYPES: Record<MobileKey, {
  num: string;
  fig: string;
  title: { ru: string; en: string };
  desc:  { ru: string; en: string };
  href:  string;
}> = {
  native: {
    num: "01", fig: "01 · NATIVE",
    title: { ru: "Нативные приложения", en: "Native apps" },
    desc: {
      ru: "iOS на Swift и Android на Kotlin — максимальная производительность, доступ к нативным API камеры, GPS, биометрии и сторам.",
      en: "iOS on Swift and Android on Kotlin — top performance, access to camera, GPS, biometrics and stores.",
    },
    href: "/mobile#native",
  },
  cross: {
    num: "02", fig: "02 · CROSS",
    title: { ru: "Кроссплатформенные", en: "Cross-platform" },
    desc: {
      ru: "Единая кодовая база для iOS и Android на Flutter или React Native: быстрый выход на рынок и OTA-обновления.",
      en: "One codebase for iOS and Android with Flutter or React Native: fast time-to-market and OTA updates.",
    },
    href: "/mobile#cross",
  },
  marketplace: {
    num: "03", fig: "03 · PRODUCT",
    title: { ru: "Маркетплейсы и сервисы", en: "Marketplaces & services" },
    desc: {
      ru: "Мобильные продукты с онбордингом, in-app платежами, подписками и аналитикой для конечных пользователей.",
      en: "Mobile products with onboarding, in-app payments, subscriptions and analytics for end users.",
    },
    href: "/mobile#product",
  },
};

const KEYS: MobileKey[] = ["native", "cross", "marketplace"];

type CopyType = { eyebrow: string; details: string };
const COPY: Record<"ru" | "en", CopyType> = {
  ru: { eyebrow: "Мобильная разработка", details: "Подробнее" },
  en: { eyebrow: "Mobile development",   details: "Details"   },
};

const SVG_STYLE: React.CSSProperties = {
  position: "absolute", inset: 0, width: "100%", height: "100%",
};

/* ═══════════════════════════════════════════════════════════════════════════
   FLAT PHONE WIREFRAME MOCKUPS — статичные, без анимации
═══════════════════════════════════════════════════════════════════════════ */

// Native — два телефона (iOS + Android) рядом
function NativeVisual(): ReactElement {
  return (
    <svg style={SVG_STYLE} viewBox="0 0 340 295" fill="none" aria-hidden="true">
      {/* iOS phone — left */}
      <rect x="44" y="18" width="110" height="238" rx="18"
        stroke={TEAL} strokeOpacity="0.35" strokeWidth="1" fill="rgba(45,212,191,0.025)"/>
      {/* Notch */}
      <rect x="83" y="22" width="32" height="8" rx="4" fill="rgba(255,255,255,0.1)"/>
      {/* Status bar */}
      <line x1="44" y1="42" x2="154" y2="42" stroke="rgba(255,255,255,0.07)" strokeWidth="0.7"/>
      {/* Tab bar */}
      <rect x="44" y="220" width="110" height="36" rx="0"
        fill="rgba(255,255,255,0.03)" stroke="none"/>
      <line x1="44" y1="220" x2="154" y2="220" stroke="rgba(255,255,255,0.07)" strokeWidth="0.7"/>
      {/* Tab items */}
      {[62, 99, 136].map((x, i) => (
        <g key={i}>
          <rect x={x-8} y="228" width="16" height="12" rx="3"
            fill={i === 0 ? TEAL : "rgba(255,255,255,0.05)"}
            fillOpacity={i === 0 ? 0.15 : 1}
            stroke={i === 0 ? TEAL : "rgba(255,255,255,0.12)"}
            strokeOpacity={i === 0 ? 0.4 : 1}
            strokeWidth="0.7"/>
        </g>
      ))}
      {/* Hero area */}
      <rect x="56" y="52" width="86" height="40" rx="5"
        fill={TEAL} fillOpacity="0.07" stroke={TEAL} strokeOpacity="0.2" strokeWidth="0.7"/>
      <rect x="64" y="62" width="54" height="7" rx="2" fill={TEAL} fillOpacity="0.65"/>
      <rect x="64" y="74" width="38" height="5" rx="2" fill={TEAL} fillOpacity="0.3"/>
      {/* Content cards */}
      {[100, 140, 176].map((y, i) => (
        <g key={i}>
          <rect x="56" y={y} width="86" height="28" rx="5"
            fill={i === 0 ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)"}
            stroke="rgba(255,255,255,0.08)" strokeWidth="0.7"/>
          <rect x="64" y={y+8} width={i === 0 ? 52 : 38} height="4" rx="2"
            fill="rgba(255,255,255,0.22)"/>
          <rect x="64" y={y+16} width="30" height="3" rx="1.5"
            fill="rgba(255,255,255,0.1)"/>
        </g>
      ))}
      {/* iOS label */}
      <rect x="64" y="210" width="30" height="6" rx="2" fill={TEAL} fillOpacity="0.3"/>

      {/* Android phone — right */}
      <rect x="186" y="28" width="110" height="238" rx="12"
        stroke="rgba(255,255,255,0.22)" strokeWidth="1" fill="rgba(255,255,255,0.015)"/>
      {/* Camera dot */}
      <circle cx="241" cy="36" r="3" fill="rgba(255,255,255,0.15)"/>
      {/* Status bar */}
      <line x1="186" y1="50" x2="296" y2="50" stroke="rgba(255,255,255,0.07)" strokeWidth="0.7"/>
      {/* AppBar */}
      <rect x="186" y="50" width="110" height="28" fill="rgba(255,255,255,0.025)"/>
      <rect x="198" y="60" width="50" height="6" rx="2" fill="rgba(255,255,255,0.22)"/>
      {/* Content */}
      <rect x="198" y="88" width="86" height="44" rx="5"
        fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.7"/>
      <rect x="206" y="96" width="40" height="24" rx="3" fill="rgba(255,255,255,0.04)"/>
      <rect x="252" y="100" width="24" height="5" rx="2" fill="rgba(255,255,255,0.22)"/>
      <rect x="252" y="109" width="18" height="4" rx="2" fill="rgba(255,255,255,0.12)"/>
      {/* List items */}
      {[142, 162, 182, 202].map((y, i) => (
        <g key={i}>
          <rect x="198" y={y} width="86" height="14" rx="3"
            fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.07)" strokeWidth="0.7"/>
          <rect x="206" y={y+4} width={[44, 36, 52, 30][i]} height="4" rx="2"
            fill="rgba(255,255,255,0.18)"/>
        </g>
      ))}
      {/* FAB */}
      <circle cx="276" cy="228" r="14"
        fill={TEAL} fillOpacity="0.15" stroke={TEAL} strokeOpacity="0.4" strokeWidth="0.8"/>
      <rect x="270" y="227" width="12" height="2" rx="1" fill={TEAL} fillOpacity="0.6"/>
      <rect x="275" y="222" width="2" height="12" rx="1" fill={TEAL} fillOpacity="0.6"/>
    </svg>
  );
}

// Cross-platform — один телефон с общим кодом и двумя платформами
function CrossVisual(): ReactElement {
  return (
    <svg style={SVG_STYLE} viewBox="0 0 340 295" fill="none" aria-hidden="true">
      {/* Center phone */}
      <rect x="110" y="18" width="120" height="258" rx="16"
        stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="rgba(255,255,255,0.02)"/>
      {/* Notch */}
      <rect x="148" y="22" width="44" height="6" rx="3" fill="rgba(255,255,255,0.1)"/>
      <line x1="110" y1="40" x2="230" y2="40" stroke="rgba(255,255,255,0.07)" strokeWidth="0.7"/>

      {/* OTA badge top */}
      <rect x="118" y="48" width="104" height="14" rx="7"
        fill={TEAL} fillOpacity="0.1" stroke={TEAL} strokeOpacity="0.35" strokeWidth="0.7"/>
      <rect x="126" y="53" width="56" height="3" rx="1.5" fill={TEAL} fillOpacity="0.55"/>

      {/* Shared codebase label */}
      <rect x="118" y="70" width="104" height="8" rx="2"
        fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.6"/>
      <rect x="124" y="73" width="50" height="3" rx="1.5" fill="rgba(255,255,255,0.2)"/>

      {/* Screen content — cards */}
      {[88, 122, 156].map((y, i) => (
        <g key={i}>
          <rect x="118" y={y} width="104" height="28" rx="5"
            fill={i === 0 ? TEAL : "rgba(255,255,255,0.025)"}
            fillOpacity={i === 0 ? 0.07 : 1}
            stroke={i === 0 ? TEAL : "rgba(255,255,255,0.08)"}
            strokeOpacity={i === 0 ? 0.3 : 1}
            strokeWidth="0.7"/>
          <rect x="126" y={y+8} width={i === 0 ? 64 : 48} height="5" rx="2"
            fill={i === 0 ? TEAL : "rgba(255,255,255,0.2)"}
            fillOpacity={i === 0 ? 0.65 : 1}/>
          <rect x="126" y={y+17} width="36" height="3" rx="1.5"
            fill="rgba(255,255,255,0.1)"/>
        </g>
      ))}

      {/* Navigation */}
      <rect x="110" y="194" width="120" height="40" rx="0"
        fill="rgba(255,255,255,0.025)"/>
      <line x1="110" y1="194" x2="230" y2="194" stroke="rgba(255,255,255,0.07)" strokeWidth="0.7"/>
      {[131, 170, 209].map((x, i) => (
        <g key={i}>
          <rect x={x-8} y="204" width="16" height="10" rx="2"
            fill={i === 1 ? TEAL : "rgba(255,255,255,0.04)"}
            fillOpacity={i === 1 ? 0.15 : 1}
            stroke={i === 1 ? TEAL : "rgba(255,255,255,0.1)"}
            strokeOpacity={i === 1 ? 0.4 : 1}
            strokeWidth="0.6"/>
        </g>
      ))}
      {/* Home indicator */}
      <rect x="151" y="248" width="38" height="4" rx="2" fill="rgba(255,255,255,0.15)"/>

      {/* Left badge — iOS */}
      <rect x="14" y="110" width="76" height="36" rx="8"
        fill={TEAL} fillOpacity="0.06" stroke={TEAL} strokeOpacity="0.28" strokeWidth="0.8"/>
      <rect x="22" y="120" width="28" height="5" rx="2" fill={TEAL} fillOpacity="0.55"/>
      <rect x="22" y="130" width="50" height="3" rx="1.5" fill="rgba(255,255,255,0.18)"/>
      {/* Arrow right → phone */}
      <line x1="90" y1="128" x2="108" y2="128" stroke={TEAL} strokeOpacity="0.35" strokeWidth="0.8" strokeDasharray="3 2"/>

      {/* Right badge — Android */}
      <rect x="250" y="110" width="76" height="36" rx="8"
        fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8"/>
      <rect x="258" y="120" width="34" height="5" rx="2" fill="rgba(255,255,255,0.25)"/>
      <rect x="258" y="130" width="48" height="3" rx="1.5" fill="rgba(255,255,255,0.12)"/>
      {/* Arrow left ← phone */}
      <line x1="232" y1="128" x2="250" y2="128" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" strokeDasharray="3 2"/>
    </svg>
  );
}

// Marketplace — телефон с онбордингом, товарами и оплатой
function MarketplaceVisual(): ReactElement {
  return (
    <svg style={SVG_STYLE} viewBox="0 0 340 295" fill="none" aria-hidden="true">
      {/* Phone frame */}
      <rect x="110" y="18" width="120" height="258" rx="16"
        stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="rgba(255,255,255,0.025)"/>
      {/* Status bar */}
      <line x1="110" y1="50" x2="230" y2="50" stroke="rgba(255,255,255,0.07)" strokeWidth="0.7"/>
      <circle cx="126" cy="34" r="2.5" fill="rgba(255,255,255,0.22)"/>
      <rect x="192" y="31" width="28" height="6" rx="3" fill="rgba(255,255,255,0.12)"/>

      {/* Search bar */}
      <rect x="118" y="56" width="96" height="16" rx="8"
        fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.6"/>
      <rect x="126" y="62" width="50" height="4" rx="2" fill="rgba(255,255,255,0.15)"/>
      {/* Cart icon */}
      <path d="M206,60 L203,60 L201,66 L211,66 L213,62 L205,62"
        stroke={TEAL} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="203" cy="67" r="1.5" fill={TEAL} fillOpacity="0.8"/>
      <circle cx="209" cy="67" r="1.5" fill={TEAL} fillOpacity="0.8"/>

      {/* Category pills */}
      <rect x="118" y="78" width="30" height="10" rx="5"
        fill={TEAL} fillOpacity="0.15" stroke={TEAL} strokeOpacity="0.4" strokeWidth="0.6"/>
      <rect x="154" y="78" width="26" height="10" rx="5" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.6"/>
      <rect x="186" y="78" width="30" height="10" rx="5" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.6"/>

      {/* Product grid 2x2 */}
      {/* Featured top-left */}
      <rect x="118" y="96" width="52" height="56" rx="5"
        fill={TEAL} fillOpacity="0.06" stroke={TEAL} strokeOpacity="0.28" strokeWidth="0.7"/>
      <rect x="126" y="104" width="36" height="28" rx="3" fill={TEAL} fillOpacity="0.1"/>
      <rect x="126" y="136" width="28" height="4" rx="2" fill="rgba(255,255,255,0.22)"/>
      <rect x="126" y="143" width="20" height="4" rx="2" fill={TEAL} fillOpacity="0.55"/>
      {/* Top-right */}
      <rect x="176" y="96" width="52" height="56" rx="5"
        fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.7"/>
      <rect x="184" y="104" width="36" height="28" rx="3" fill="rgba(255,255,255,0.04)"/>
      <rect x="184" y="136" width="28" height="4" rx="2" fill="rgba(255,255,255,0.18)"/>
      <rect x="184" y="143" width="20" height="4" rx="2" fill="rgba(255,255,255,0.12)"/>
      {/* Bottom-left */}
      <rect x="118" y="158" width="52" height="44" rx="5"
        fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.7"/>
      <rect x="126" y="164" width="36" height="22" rx="3" fill="rgba(255,255,255,0.04)"/>
      <rect x="126" y="190" width="28" height="4" rx="2" fill="rgba(255,255,255,0.18)"/>
      {/* Bottom-right */}
      <rect x="176" y="158" width="52" height="44" rx="5"
        fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.7"/>
      <rect x="184" y="164" width="36" height="22" rx="3" fill="rgba(255,255,255,0.04)"/>
      <rect x="184" y="190" width="28" height="4" rx="2" fill="rgba(255,255,255,0.18)"/>

      {/* CTA / Payment button */}
      <rect x="118" y="210" width="104" height="24" rx="12"
        fill={TEAL} fillOpacity="0.15" stroke={TEAL} strokeOpacity="0.5" strokeWidth="0.8"/>
      <rect x="140" y="219" width="60" height="5" rx="2" fill={TEAL} fillOpacity="0.6"/>

      {/* Home indicator */}
      <rect x="151" y="252" width="38" height="4" rx="2" fill="rgba(255,255,255,0.15)"/>
    </svg>
  );
}

const VISUAL_MAP: Record<MobileKey, () => ReactElement> = {
  native:      NativeVisual,
  cross:       CrossVisual,
  marketplace: MarketplaceVisual,
};

/* ═══════════════════════════════════════════════════════════════════════════
   COLUMN
═══════════════════════════════════════════════════════════════════════════ */
function MobileColumn({ mobKey, lang, isMobile }: { mobKey: MobileKey; lang: "ru"|"en"; isMobile: boolean }) {
  const t      = TYPES[mobKey];
  const Visual = VISUAL_MAP[mobKey];

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
      <div style={{
        fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase" as const,
        color: "rgba(255,255,255,0.28)", fontFamily: "monospace", marginBottom: 28,
      }}>
        {t.fig}
      </div>

      <div style={{ position: "relative", height: 295, overflow: "hidden" }}>
        <Visual />
      </div>

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
export default function HomeMobile() {
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
    name: `Разработка мобильных приложений | ${siteName}`,
    provider: { "@type": "Organization", "@id": `${siteUrl}/#organization` },
    hasOfferCatalog: {
      "@type": "OfferCatalog", name: "Типы мобильных приложений",
      itemListElement: KEYS.map(k => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: TYPES[k].title.ru, description: TYPES[k].desc.ru },
      })),
    },
  }), []);

  return (
    <>
      <Script id="ld-home-mobile" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section
        id="mobile"
        aria-labelledby={titleId}
        style={{ background: BG, position: "relative", overflow: "hidden" }}>

        <div aria-hidden="true" style={{
          pointerEvents: "none", position: "absolute", inset: 0,
          backgroundImage: GRAIN, backgroundSize: "180px 180px", opacity: 0.025,
        }} />
        <div aria-hidden="true" style={{
          pointerEvents: "none", position: "absolute",
          top: "10%", left: "-10%", width: 700, height: 700,
          borderRadius: "50%", willChange: "transform", transform: "translateZ(0)", filter: "blur(260px)",
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
                { text: lang === "ru" ? "Мобильные"  : "Mobile",       outline: true  },
                { text: lang === "ru" ? "приложения" : "Applications",  outline: false },
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

          {/* Three columns */}
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
                borderRight:   !isMobile && i < 2 ? "1px solid rgba(255,255,255,0.08)" : "none",
                borderBottom:   isMobile && i < 2 ? "1px solid rgba(255,255,255,0.08)" : "none",
                paddingRight:  !isMobile && i < 2 ? 44 : 0,
                paddingLeft:   !isMobile && i > 0 ? 44 : 0,
                paddingBottom:  isMobile && i < 2 ? 40 : 0,
                paddingTop:     isMobile && i > 0 ? 40 : 0,
              }}>
                <MobileColumn mobKey={k} lang={lang} isMobile={isMobile} />
              </div>
            ))}
          </motion.div>

          {/* App coming soon banner */}
          <div style={{
            marginTop: isMobile ? 40 : 56,
            padding: isMobile ? "20px 24px" : "24px 32px",
            borderRadius: 14,
            background: "rgba(45,212,191,0.05)",
            border: "1px solid rgba(45,212,191,0.15)",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "flex-start" : "center",
            justifyContent: "space-between",
            gap: 16,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                background: "rgba(45,212,191,0.1)",
                border: "1px solid rgba(45,212,191,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect x="4" y="1" width="10" height="16" rx="2.5" stroke={TEAL} strokeWidth="1.2" strokeOpacity="0.8"/>
                  <rect x="7" y="13.5" width="4" height="1.5" rx="0.75" fill={TEAL} fillOpacity="0.6"/>
                  <rect x="6" y="4" width="6" height="1" rx="0.5" fill={TEAL} fillOpacity="0.4"/>
                  <rect x="6" y="6.5" width="4" height="1" rx="0.5" fill={TEAL} fillOpacity="0.25"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: WHITE, marginBottom: 4 }}>
                  {lang === "ru" ? "Мобильное приложение OneStack" : "OneStack Mobile App"}
                </div>
                <div style={{ fontSize: 12, color: "rgba(244,250,248,0.45)", lineHeight: 1.5 }}>
                  {lang === "ru"
                    ? "iOS и Android — управляйте проектами и задачами прямо с телефона"
                    : "iOS & Android — manage your projects and tasks right from your phone"}
                </div>
              </div>
            </div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "8px 18px", borderRadius: 99, flexShrink: 0,
              background: "rgba(45,212,191,0.1)",
              border: "1px solid rgba(45,212,191,0.3)",
              fontSize: 11, fontWeight: 600, letterSpacing: "0.12em",
              textTransform: "uppercase" as const, color: TEAL,
            }}>
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <circle cx="4" cy="4" r="3" stroke={TEAL} strokeWidth="1"/>
                <circle cx="4" cy="4" r="1.5" fill={TEAL}/>
              </svg>
              {lang === "ru" ? "Скоро" : "Coming soon"}
            </div>
          </div>

          {/* Подробнее — справа */}
          <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: isMobile ? 16 : 24 }}>
            <Link
              href="/mobile"
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
