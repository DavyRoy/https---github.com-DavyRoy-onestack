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

type AppKey = "crm" | "saas" | "portal";

const TYPES: Record<AppKey, {
  num: string;
  fig: string;
  title: { ru: string; en: string };
  desc:  { ru: string; en: string };
  href:  string;
}> = {
  crm: {
    num: "01", fig: "01 · CRM",
    title: { ru: "CRM / ERP системы", en: "CRM / ERP systems" },
    desc: {
      ru: "Автоматизация продаж, управления клиентами и бизнес-процессами с аналитикой в реальном времени.",
      en: "Sales automation, customer management and business processes with real-time analytics.",
    },
    href: "/webapp#crm",
  },
  saas: {
    num: "02", fig: "02 · SAAS",
    title: { ru: "SaaS платформы", en: "SaaS platforms" },
    desc: {
      ru: "Облачные сервисы с мультитенантностью, биллингом и масштабируемой архитектурой под любую нагрузку.",
      en: "Cloud services with multi-tenancy, billing and scalable architecture for any load.",
    },
    href: "/webapp#saas",
  },
  portal: {
    num: "03", fig: "03 · PORTAL",
    title: { ru: "Корпоративные порталы", en: "Corporate portals" },
    desc: {
      ru: "Централизованные платформы для сотрудников с задачами, базой знаний и внутренними коммуникациями.",
      en: "Centralized platforms for employees with tasks, knowledge base and internal communications.",
    },
    href: "/webapp#portal",
  },
};

const KEYS: AppKey[] = ["crm", "saas", "portal"];

type CopyType = { eyebrow: string; details: string };
const COPY: Record<"ru" | "en", CopyType> = {
  ru: { eyebrow: "Веб-приложения", details: "Подробнее" },
  en: { eyebrow: "Web applications", details: "Details"  },
};

const SVG_STYLE: React.CSSProperties = {
  position: "absolute", inset: 0, width: "100%", height: "100%",
};

/* ═══════════════════════════════════════════════════════════════════════════
   FLAT WIREFRAME MOCKUPS — статичные, без анимации
═══════════════════════════════════════════════════════════════════════════ */

// CRM — браузер с воронкой продаж и сайдбаром
function CrmVisual(): ReactElement {
  return (
    <svg style={SVG_STYLE} viewBox="0 0 340 295" fill="none" aria-hidden="true">
      {/* Browser frame */}
      <rect x="18" y="38" width="304" height="230" rx="10"
        stroke="rgba(255,255,255,0.28)" strokeWidth="1" fill="rgba(255,255,255,0.02)"/>
      {/* Title bar */}
      <rect x="18" y="38" width="304" height="30" rx="10" fill="rgba(255,255,255,0.04)"/>
      <rect x="18" y="58" width="304" height="10" fill="rgba(255,255,255,0.04)"/>
      <circle cx="34" cy="53" r="4" fill="rgba(255,255,255,0.18)"/>
      <circle cx="49" cy="53" r="4" fill="rgba(255,255,255,0.1)"/>
      <circle cx="64" cy="53" r="4" fill="rgba(255,255,255,0.07)"/>
      <rect x="82" y="46" width="140" height="14" rx="7"
        fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.6"/>
      <line x1="18" y1="68" x2="322" y2="68" stroke="rgba(255,255,255,0.07)" strokeWidth="0.7"/>

      {/* Sidebar */}
      <rect x="18" y="68" width="68" height="200" fill="rgba(255,255,255,0.015)"/>
      <line x1="86" y1="68" x2="86" y2="268" stroke="rgba(255,255,255,0.07)" strokeWidth="0.7"/>
      <rect x="26" y="80" width="52" height="12" rx="4" fill={TEAL} fillOpacity="0.1" stroke={TEAL} strokeOpacity="0.3" strokeWidth="0.7"/>
      <rect x="30" y="85" width="28" height="3" rx="1.5" fill={TEAL} fillOpacity="0.6"/>
      <rect x="26" y="100" width="52" height="12" rx="4" fill="rgba(255,255,255,0.03)"/>
      <rect x="30" y="105" width="24" height="3" rx="1.5" fill="rgba(255,255,255,0.2)"/>
      <rect x="26" y="119" width="52" height="12" rx="4" fill="rgba(255,255,255,0.03)"/>
      <rect x="30" y="124" width="32" height="3" rx="1.5" fill="rgba(255,255,255,0.15)"/>
      <rect x="26" y="138" width="52" height="12" rx="4" fill="rgba(255,255,255,0.03)"/>
      <rect x="30" y="143" width="20" height="3" rx="1.5" fill="rgba(255,255,255,0.15)"/>

      {/* Pipeline header */}
      <rect x="96" y="76" width="120" height="7" rx="2" fill="rgba(255,255,255,0.22)"/>
      <rect x="250" y="74" width="60" height="11" rx="5"
        fill={TEAL} fillOpacity="0.12" stroke={TEAL} strokeOpacity="0.35" strokeWidth="0.7"/>

      {/* Pipeline stages — 4 columns */}
      {([
        { x: 96,  cards: 3, accent: false },
        { x: 163, cards: 3, accent: false },
        { x: 230, cards: 2, accent: false },
        { x: 280, cards: 1, accent: true  },
      ] as { x: number; cards: number; accent: boolean }[]).map((col, i) => (
        <g key={i}>
          <rect x={col.x} y="93" width={i < 3 ? 58 : 34} height="6" rx="2"
            fill={col.accent ? TEAL : "rgba(255,255,255,0.1)"} fillOpacity={col.accent ? 0.5 : 1}/>
          {Array.from({ length: col.cards }).map((_, j) => (
            <rect key={j} x={col.x} y={106 + j * 32} width={i < 3 ? 58 : 34} height="26" rx="4"
              fill={col.accent && j === 0 ? TEAL : "rgba(255,255,255,0.03)"}
              fillOpacity={col.accent && j === 0 ? 0.08 : 1}
              stroke={col.accent && j === 0 ? TEAL : "rgba(255,255,255,0.08)"}
              strokeOpacity={col.accent && j === 0 ? 0.35 : 1}
              strokeWidth="0.7"/>
          ))}
        </g>
      ))}

      {/* Metrics row */}
      <line x1="96" y1="208" x2="314" y2="208" stroke="rgba(255,255,255,0.06)" strokeWidth="0.7"/>
      {([96, 172, 248] as number[]).map((x, i) => (
        <g key={i}>
          <rect x={x} y="215" width="48" height="3" rx="1.5" fill="rgba(255,255,255,0.1)"/>
          <rect x={x} y="223" width="36" height="3" rx="1.5" fill="rgba(255,255,255,0.06)"/>
        </g>
      ))}
    </svg>
  );
}

// SaaS — браузер с дашбордом, графиком и карточками планов
function SaasVisual(): ReactElement {
  return (
    <svg style={SVG_STYLE} viewBox="0 0 340 295" fill="none" aria-hidden="true">
      {/* Browser frame */}
      <rect x="18" y="38" width="304" height="230" rx="10"
        stroke="rgba(255,255,255,0.28)" strokeWidth="1" fill="rgba(255,255,255,0.02)"/>
      <rect x="18" y="38" width="304" height="30" rx="10" fill="rgba(255,255,255,0.04)"/>
      <rect x="18" y="58" width="304" height="10" fill="rgba(255,255,255,0.04)"/>
      <circle cx="34" cy="53" r="4" fill="rgba(255,255,255,0.18)"/>
      <circle cx="49" cy="53" r="4" fill="rgba(255,255,255,0.1)"/>
      <circle cx="64" cy="53" r="4" fill="rgba(255,255,255,0.07)"/>
      <rect x="82" y="46" width="140" height="14" rx="7"
        fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.6"/>
      <line x1="18" y1="68" x2="322" y2="68" stroke="rgba(255,255,255,0.07)" strokeWidth="0.7"/>

      {/* Nav tabs */}
      <rect x="28" y="75" width="46" height="10" rx="3" fill={TEAL} fillOpacity="0.12" stroke={TEAL} strokeOpacity="0.3" strokeWidth="0.7"/>
      <rect x="32" y="79" width="30" height="3" rx="1.5" fill={TEAL} fillOpacity="0.65"/>
      <rect x="84" y="75" width="38" height="10" rx="3" fill="rgba(255,255,255,0.03)"/>
      <rect x="88" y="79" width="24" height="3" rx="1.5" fill="rgba(255,255,255,0.18)"/>
      <rect x="132" y="75" width="38" height="10" rx="3" fill="rgba(255,255,255,0.03)"/>
      <rect x="136" y="79" width="28" height="3" rx="1.5" fill="rgba(255,255,255,0.18)"/>

      {/* KPI cards */}
      {([
        { x: 28,  teal: true  },
        { x: 120, teal: false },
        { x: 212, teal: false },
      ] as { x: number; teal: boolean }[]).map((card, i) => (
        <g key={i}>
          <rect x={card.x} y="94" width="82" height="40" rx="5"
            fill={card.teal ? TEAL : "rgba(255,255,255,0.025)"}
            fillOpacity={card.teal ? 0.06 : 1}
            stroke={card.teal ? TEAL : "rgba(255,255,255,0.09)"}
            strokeOpacity={card.teal ? 0.3 : 1}
            strokeWidth="0.7"/>
          <rect x={card.x+8} y="102" width={card.teal ? 52 : 44} height="8" rx="2"
            fill={card.teal ? TEAL : "rgba(255,255,255,0.22)"} fillOpacity={card.teal ? 0.7 : 1}/>
          <rect x={card.x+8} y="116" width="30" height="4" rx="2"
            fill={card.teal ? TEAL : "rgba(255,255,255,0.1)"} fillOpacity={card.teal ? 0.35 : 1}/>
        </g>
      ))}

      {/* Bar chart */}
      <rect x="28" y="146" width="180" height="72" rx="5"
        fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.7"/>
      {([18, 28, 22, 38, 32, 44, 40] as number[]).map((h, i) => (
        <rect key={i} x={36 + i * 24} y={212 - h} width="16" height={h} rx="2"
          fill={TEAL} fillOpacity={0.15 + i * 0.05}/>
      ))}

      {/* Tenant list */}
      <rect x="220" y="146" width="92" height="72" rx="5"
        fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.7"/>
      {([0, 1, 2] as number[]).map((i) => (
        <g key={i}>
          <rect x="228" y={155 + i * 20} width="76" height="14" rx="3"
            fill={i === 1 ? TEAL : "rgba(255,255,255,0.03)"}
            fillOpacity={i === 1 ? 0.07 : 1}
            stroke={i === 1 ? TEAL : "rgba(255,255,255,0.07)"}
            strokeOpacity={i === 1 ? 0.3 : 1}
            strokeWidth="0.7"/>
          <rect x="234" y={160 + i * 20} width={i === 1 ? 50 : 38} height="3" rx="1.5"
            fill={i === 1 ? TEAL : "rgba(255,255,255,0.2)"} fillOpacity={i === 1 ? 0.6 : 1}/>
        </g>
      ))}

      {/* Subscription plans */}
      <line x1="28" y1="232" x2="314" y2="232" stroke="rgba(255,255,255,0.06)" strokeWidth="0.7"/>
      {([
        { x: 28,  accent: false },
        { x: 124, accent: true  },
        { x: 220, accent: false },
      ] as { x: number; accent: boolean }[]).map((plan, i) => (
        <g key={i}>
          <rect x={plan.x} y="238" width="88" height="22" rx="5"
            fill={plan.accent ? TEAL : "rgba(255,255,255,0.025)"}
            fillOpacity={plan.accent ? 0.1 : 1}
            stroke={plan.accent ? TEAL : "rgba(255,255,255,0.09)"}
            strokeOpacity={plan.accent ? 0.4 : 1}
            strokeWidth="0.7"/>
          <rect x={plan.x+8} y="246" width={i === 0 ? 36 : i === 1 ? 24 : 50} height="4" rx="2"
            fill={plan.accent ? TEAL : "rgba(255,255,255,0.2)"} fillOpacity={plan.accent ? 0.7 : 1}/>
          <rect x={plan.x+8} y="253" width="20" height="3" rx="1.5" fill="rgba(255,255,255,0.1)"/>
        </g>
      ))}
    </svg>
  );
}

// Portal — браузер с сайдбаром и канбан-доской
function PortalVisual(): ReactElement {
  return (
    <svg style={SVG_STYLE} viewBox="0 0 340 295" fill="none" aria-hidden="true">
      {/* Browser frame */}
      <rect x="18" y="38" width="304" height="230" rx="10"
        stroke="rgba(255,255,255,0.28)" strokeWidth="1" fill="rgba(255,255,255,0.02)"/>
      <rect x="18" y="38" width="304" height="30" rx="10" fill="rgba(255,255,255,0.04)"/>
      <rect x="18" y="58" width="304" height="10" fill="rgba(255,255,255,0.04)"/>
      <circle cx="34" cy="53" r="4" fill="rgba(255,255,255,0.18)"/>
      <circle cx="49" cy="53" r="4" fill="rgba(255,255,255,0.1)"/>
      <circle cx="64" cy="53" r="4" fill="rgba(255,255,255,0.07)"/>
      <rect x="82" y="46" width="140" height="14" rx="7"
        fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.6"/>
      <line x1="18" y1="68" x2="322" y2="68" stroke="rgba(255,255,255,0.07)" strokeWidth="0.7"/>

      {/* Left sidebar */}
      <rect x="18" y="68" width="72" height="200" fill="rgba(255,255,255,0.015)"/>
      <line x1="90" y1="68" x2="90" y2="268" stroke="rgba(255,255,255,0.07)" strokeWidth="0.7"/>
      {/* Avatar */}
      <circle cx="40" cy="84" r="10" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.7"/>
      <rect x="30" y="100" width="40" height="3" rx="1.5" fill="rgba(255,255,255,0.2)"/>
      <rect x="34" y="107" width="30" height="3" rx="1.5" fill="rgba(255,255,255,0.1)"/>
      {/* Nav items */}
      {([
        { y: 120, active: true,  w: 44 },
        { y: 136, active: false, w: 36 },
        { y: 152, active: false, w: 48 },
        { y: 168, active: false, w: 30 },
        { y: 184, active: false, w: 38 },
      ] as { y: number; active: boolean; w: number }[]).map((item, i) => (
        <g key={i}>
          <rect x="26" y={item.y} width="52" height="12" rx="3"
            fill={item.active ? TEAL : "transparent"} fillOpacity={item.active ? 0.1 : 1}/>
          <rect x="30" y={item.y + 4} width={item.w} height="3" rx="1.5"
            fill={item.active ? TEAL : "rgba(255,255,255,0.18)"}
            fillOpacity={item.active ? 0.6 : 1}/>
        </g>
      ))}

      {/* Main area header */}
      <rect x="100" y="75" width="90" height="6" rx="2" fill="rgba(255,255,255,0.22)"/>
      <rect x="248" y="72" width="60" height="12" rx="6"
        fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.6"/>
      <rect x="254" y="76" width="36" height="4" rx="2" fill="rgba(255,255,255,0.2)"/>

      {/* Kanban — 3 columns */}
      {([
        { x: 100, cards: [30, 24, 28], accent: false },
        { x: 172, cards: [24, 30],     accent: true  },
        { x: 244, cards: [24, 24, 24], accent: false },
      ] as { x: number; cards: number[]; accent: boolean }[]).map((col, ci) => (
        <g key={ci}>
          <rect x={col.x} y="92" width="62" height="6" rx="2"
            fill={col.accent ? TEAL : "rgba(255,255,255,0.12)"}
            fillOpacity={col.accent ? 0.5 : 1}/>
          {col.cards.map((h, i) => {
            const y = 104 + col.cards.slice(0, i).reduce((a: number, v: number) => a + v + 4, 0);
            return (
              <g key={i}>
                <rect x={col.x} y={y} width="62" height={h} rx="4"
                  fill={col.accent && i === 0 ? TEAL : "rgba(255,255,255,0.03)"}
                  fillOpacity={col.accent && i === 0 ? 0.08 : 1}
                  stroke={col.accent && i === 0 ? TEAL : "rgba(255,255,255,0.09)"}
                  strokeOpacity={col.accent && i === 0 ? 0.35 : 1}
                  strokeWidth="0.7"/>
                <rect x={col.x + 6} y={y + 6} width={col.accent && i === 0 ? 44 : 36} height="4" rx="2"
                  fill={col.accent && i === 0 ? TEAL : "rgba(255,255,255,0.2)"}
                  fillOpacity={col.accent && i === 0 ? 0.6 : 1}/>
                {h > 26 && (
                  <rect x={col.x + 6} y={y + 14} width="28" height="3" rx="1.5"
                    fill="rgba(255,255,255,0.1)"/>
                )}
              </g>
            );
          })}
        </g>
      ))}

      {/* Bottom stats */}
      <line x1="100" y1="232" x2="314" y2="232" stroke="rgba(255,255,255,0.06)" strokeWidth="0.7"/>
      {([100, 172, 244] as number[]).map((x, i) => (
        <g key={i}>
          <rect x={x} y="238" width="52" height="4" rx="2" fill="rgba(255,255,255,0.14)"/>
          <rect x={x} y="246" width="36" height="3" rx="1.5" fill="rgba(255,255,255,0.07)"/>
        </g>
      ))}

      {/* Sidebar search */}
      <rect x="24" y="236" width="56" height="14" rx="7"
        fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.6"/>
      <rect x="30" y="242" width="32" height="3" rx="1.5" fill="rgba(255,255,255,0.15)"/>
    </svg>
  );
}

const VISUAL_MAP: Record<AppKey, () => ReactElement> = {
  crm:    CrmVisual,
  saas:   SaasVisual,
  portal: PortalVisual,
};

/* ═══════════════════════════════════════════════════════════════════════════
   COLUMN
═══════════════════════════════════════════════════════════════════════════ */
function AppColumn({ appKey, lang, isMobile }: { appKey: AppKey; lang: "ru"|"en"; isMobile: boolean }) {
  const t      = TYPES[appKey];
  const Visual = VISUAL_MAP[appKey];

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
export default function HomeWebApp() {
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
    name: `Разработка веб-приложений | ${siteName}`,
    provider: { "@type": "Organization", "@id": `${siteUrl}/#organization` },
    hasOfferCatalog: {
      "@type": "OfferCatalog", name: "Типы веб-приложений",
      itemListElement: KEYS.map(k => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: TYPES[k].title.ru, description: TYPES[k].desc.ru },
      })),
    },
  }), []);

  return (
    <>
      <Script id="ld-home-webapp" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section
        id="webapp"
        aria-labelledby={titleId}
        style={{ background: BG, position: "relative", overflow: "hidden" }}>

        <div aria-hidden="true" style={{
          pointerEvents: "none", position: "absolute", inset: 0,
          backgroundImage: GRAIN, backgroundSize: "180px 180px", opacity: 0.025,
        }} />
        <div aria-hidden="true" style={{
          pointerEvents: "none", position: "absolute",
          top: "15%", left: "-10%", width: 700, height: 700,
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
                { text: lang === "ru" ? "Веб-"       : "Web",          outline: true  },
                { text: lang === "ru" ? "приложения" : "Applications", outline: false },
              ].map((line, i) => (
                <motion.div key={i}
                  className={serif.className}
                  style={{
                    display: "block", fontWeight: 400,
                    lineHeight: 1, letterSpacing: "-0.04em",
                    fontSize: "clamp(2.8rem,7vw,8rem)",
                    ...(line.outline
                      ? { color: TEAL }
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
                <AppColumn appKey={k} lang={lang} isMobile={isMobile} />
              </div>
            ))}
          </motion.div>

          {/* Подробнее — справа */}
          <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: isMobile ? 16 : 40 }}>
            <Link
              href="/webapp"
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
