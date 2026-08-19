// src/components/SiteCalculator.tsx
"use client";
import { serif } from "@/lib/fonts";

import React, { useEffect, useMemo, useState, useId } from "react";
import { motion, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { MessageCircle, ArrowRight, Percent, Sparkles, Server } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuote } from "@/app/context/QuoteContext";
import Script from "next/script";
import { useI18n } from "@/i18n/I18nProvider";
import { useMoney } from "@/lib/useMoney";


const BG    = "#07100e";
const TEAL  = "#2dd4bf";
const WHITE = "#f4faf8";

/* ─── Types & Pricing ────────────────────────────────────────────────────── */
type SiteKind    = "landing" | "business" | "corporate" | "ecommerce" | "content" | "portfolio";
type DesignLevel = "basic" | "pro" | "brand";
type Speed       = "normal" | "fast";
type Hosting     = "none" | "cloud" | "vps";
type Support     = "none" | "basic" | "pro";

const PRICING = {
  base:          { landing: 150_000, business: 81_000, corporate: 440_000, ecommerce: 725_000, content: 275_000, portfolio: 105_000 },
  perPage:       { landing: 12_000,  business: 10_000,  corporate: 19_000,  ecommerce: 22_000,  content: 15_000,  portfolio: 10_000  },
  includedPages: { landing: 4,       business: 6,       corporate: 10,      ecommerce: 10,      content: 12,      portfolio: 6       },
  design:        { basic: 1.0, pro: 1.18, brand: 1.38 },
  seo:           { none: 0, lite: 50_000, pro: 120_000 },
  features: {
    blog: 69_000, auth: 75_000, forms: 31_000, catalog: 105_000, payments: 88_000,
    delivery: 69_000, crm: 81_000, search: 50_000, analytics: 25_000,
    animation: 44_000, integrations: 56_000,
  },
  infra: {
    hosting: { none: { monthly: 0, setup: 0 }, cloud: { monthly: 7_500, setup: 15_000 }, vps: { monthly: 5_000, setup: 22_000 } },
    ci:      { monthly: 2_500, setup: 10_000 },
    domains: { monthly: 500,   setup: 2_000  },
  },
  support:         { none: 0, basic: 18_000, pro: 44_000 },
  speedMultiplier: { normal: 1.0, fast: 1.22 },
  discount:        { ecommerceKit: 0.92 },
} as const;

type StateSetters = {
  setKind: (v: SiteKind) => void; setPages: (v: number) => void;
  setDesign: (v: DesignLevel) => void; setSpeed: (v: Speed) => void;
  setForms: (v: boolean) => void; setBlog: (v: boolean) => void; setAuth: (v: boolean) => void;
  setCatalog: (v: boolean) => void; setPayments: (v: boolean) => void; setDelivery: (v: boolean) => void;
  setCrm: (v: boolean) => void; setSearch: (v: boolean) => void; setAnalytics: (v: boolean) => void;
  setAnimation: (v: boolean) => void; setIntegrations: (v: boolean) => void;
  setSeo: (v: "none" | "lite" | "pro") => void; setHosting: (v: Hosting) => void;
  setUseCI: (v: boolean) => void; setSupport: (v: Support) => void;
};

const PRESETS_RU = [
  { key: "landing",   title: "Лендинг",          apply: (s: StateSetters) => { s.setKind("landing");   s.setPages(4);  s.setDesign("pro");   s.setSpeed("normal"); s.setForms(true);  s.setBlog(false); s.setAuth(false); s.setCatalog(false); s.setPayments(false); s.setDelivery(false); s.setCrm(false); s.setSearch(true);  s.setAnalytics(true);  s.setAnimation(true);  s.setIntegrations(false); s.setSeo("lite"); s.setHosting("cloud"); s.setUseCI(true); s.setSupport("basic"); } },
  { key: "business",  title: "Сайт-визитка",     apply: (s: StateSetters) => { s.setKind("business");  s.setPages(6);  s.setDesign("pro");   s.setSpeed("normal"); s.setForms(true);  s.setBlog(false); s.setAuth(false); s.setCatalog(false); s.setPayments(false); s.setDelivery(false); s.setCrm(false); s.setSearch(true);  s.setAnalytics(true);  s.setAnimation(false); s.setIntegrations(false); s.setSeo("lite"); s.setHosting("cloud"); s.setUseCI(true); s.setSupport("basic"); } },
  { key: "corporate", title: "Корпоративный",    apply: (s: StateSetters) => { s.setKind("corporate"); s.setPages(12); s.setDesign("pro");   s.setSpeed("normal"); s.setForms(true);  s.setBlog(true);  s.setAuth(true);  s.setCatalog(false); s.setPayments(false); s.setDelivery(false); s.setCrm(true);  s.setSearch(true);  s.setAnalytics(true);  s.setAnimation(false); s.setIntegrations(true);  s.setSeo("pro");  s.setHosting("cloud"); s.setUseCI(true); s.setSupport("pro");   } },
  { key: "ecommerce", title: "Интернет-магазин", apply: (s: StateSetters) => { s.setKind("ecommerce"); s.setPages(12); s.setDesign("brand");  s.setSpeed("normal"); s.setForms(true);  s.setBlog(false); s.setAuth(true);  s.setCatalog(true);  s.setPayments(true);  s.setDelivery(true);  s.setCrm(true);  s.setSearch(true);  s.setAnalytics(true);  s.setAnimation(false); s.setIntegrations(true);  s.setSeo("pro");  s.setHosting("cloud"); s.setUseCI(true); s.setSupport("pro");   } },
  { key: "content",   title: "Контент-проект",   apply: (s: StateSetters) => { s.setKind("content");   s.setPages(14); s.setDesign("pro");   s.setSpeed("normal"); s.setForms(true);  s.setBlog(true);  s.setAuth(false); s.setCatalog(false); s.setPayments(false); s.setDelivery(false); s.setCrm(false); s.setSearch(true);  s.setAnalytics(true);  s.setAnimation(false); s.setIntegrations(false); s.setSeo("pro");  s.setHosting("cloud"); s.setUseCI(true); s.setSupport("basic"); } },
  { key: "portfolio", title: "Портфолио",        apply: (s: StateSetters) => { s.setKind("portfolio"); s.setPages(6);  s.setDesign("pro");   s.setSpeed("normal"); s.setForms(true);  s.setBlog(false); s.setAuth(false); s.setCatalog(false); s.setPayments(false); s.setDelivery(false); s.setCrm(false); s.setSearch(true);  s.setAnalytics(true);  s.setAnimation(true);  s.setIntegrations(false); s.setSeo("lite"); s.setHosting("cloud"); s.setUseCI(true); s.setSupport("basic"); } },
] as const;

const PRESETS_EN = [
  { key: "landing",   title: "Landing page",    apply: PRESETS_RU[0].apply },
  { key: "business",  title: "Business card",   apply: PRESETS_RU[1].apply },
  { key: "corporate", title: "Corporate",       apply: PRESETS_RU[2].apply },
  { key: "ecommerce", title: "E-commerce",      apply: PRESETS_RU[3].apply },
  { key: "content",   title: "Content project", apply: PRESETS_RU[4].apply },
  { key: "portfolio", title: "Portfolio",       apply: PRESETS_RU[5].apply },
] as const;

function clamp(n: number, min: number, max: number) { return Math.max(min, Math.min(max, n)); }

const TIMELINES_RU: Record<SiteKind, { normal: string; fast: string }> = {
  landing:   { normal: "1–2 нед",  fast: "3–5 дней" },
  business:  { normal: "1–3 нед",  fast: "1–2 нед"  },
  portfolio: { normal: "1–3 нед",  fast: "1–2 нед"  },
  content:   { normal: "2–4 нед",  fast: "1–3 нед"  },
  corporate: { normal: "3–6 нед",  fast: "2–4 нед"  },
  ecommerce: { normal: "4–8 нед",  fast: "3–5 нед"  },
};
const TIMELINES_EN: Record<SiteKind, { normal: string; fast: string }> = {
  landing:   { normal: "1–2 wks",  fast: "3–5 days" },
  business:  { normal: "1–3 wks",  fast: "1–2 wks"  },
  portfolio: { normal: "1–3 wks",  fast: "1–2 wks"  },
  content:   { normal: "2–4 wks",  fast: "1–3 wks"  },
  corporate: { normal: "3–6 wks",  fast: "2–4 wks"  },
  ecommerce: { normal: "4–8 wks",  fast: "3–5 wks"  },
};

function mapKind(k: SiteKind, isEn = false) {
  if (isEn) return k === "landing" ? "Landing page" : k === "business" ? "Business card" :
    k === "corporate" ? "Corporate" : k === "ecommerce" ? "E-commerce" :
    k === "content" ? "Informational" : "Portfolio";
  return k === "landing" ? "Лендинг" : k === "business" ? "Сайт-визитка" :
    k === "corporate" ? "Корпоративный" : k === "ecommerce" ? "Интернет-магазин" :
    k === "content" ? "Информационный" : "Портфолио";
}
function mapDesign(d: DesignLevel, isEn = false) {
  if (isEn) return d === "basic" ? "Basic" : d === "pro" ? "Pro" : "Premium";
  return d === "basic" ? "Базовый" : d === "pro" ? "Pro" : "Премиум";
}

/* ─── Animated counter ───────────────────────────────────────────────────── */
function useCountUp(value: number) {
  const s = useSpring(value, { stiffness: 100, damping: 25, mass: 0.5 });
  useEffect(() => { s.set(value); }, [value, s]);
  return useTransform(s, (v) => Math.round(v));
}
function CountUp({ value, lang }: { value: number; lang: "ru" | "en" }) {
  const a = useCountUp(value);
  const [v, setV] = useState(value);
  useEffect(() => { const u = a.on("change", n => setV(n)); return () => u(); }, [a]);
  const n = Math.round(v);
  return <span style={{ fontVariantNumeric: "tabular-nums" }}>{
    lang === "en" ? `$${n.toLocaleString("en-US")}` : `${n.toLocaleString("ru-RU")} ₽`
  }</span>;
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════════════════════════════════ */
export default function SiteCalculator() {
  const { locale } = useI18n();
  const isEn = locale === "en";
  const { money, amount } = useMoney(isEn ? "en" : "ru");
  const PRESETS = isEn ? PRESETS_EN : PRESETS_RU;
  const router    = useRouter();
  const { setQuote } = useQuote();
  const reduced   = useReducedMotion();
  const titleId   = useId();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const [kind,         setKind]         = useState<SiteKind>("business");
  const [pages,        setPages]        = useState(8);
  const [design,       setDesign]       = useState<DesignLevel>("pro");
  const [speed,        setSpeed]        = useState<Speed>("normal");
  const [blog,         setBlog]         = useState(false);
  const [auth,         setAuth]         = useState(false);
  const [forms,        setForms]        = useState(true);
  const [catalog,      setCatalog]      = useState(false);
  const [payments,     setPayments]     = useState(false);
  const [delivery,     setDelivery]     = useState(false);
  const [crm,          setCrm]          = useState(false);
  const [search,       setSearch]       = useState(true);
  const [analytics,    setAnalytics]    = useState(true);
  const [animation,    setAnimation]    = useState(false);
  const [integrations, setIntegrations] = useState(false);
  const [seo,          setSeo]          = useState<"none" | "lite" | "pro">("lite");
  const [hosting,      setHosting]      = useState<Hosting>("cloud");
  const [useCI,        setUseCI]        = useState(true);
  const [support,      setSupport]      = useState<Support>("basic");

  /* Autosave */
  useEffect(() => {
    try {
      const raw = localStorage.getItem("site_calc_v1");
      if (!raw) return;
      const s = JSON.parse(raw);
      setKind(s.kind ?? "business"); setPages(s.pages ?? 8);
      setDesign(s.design ?? "pro"); setSpeed(s.speed ?? "normal");
      setBlog(!!s.blog); setAuth(!!s.auth); setForms(s.forms ?? true);
      setCatalog(!!s.catalog); setPayments(!!s.payments); setDelivery(!!s.delivery);
      setCrm(!!s.crm); setSearch(s.search ?? true); setAnalytics(s.analytics ?? true);
      setAnimation(!!s.animation); setIntegrations(!!s.integrations);
      setSeo(s.seo ?? "lite"); setHosting(s.hosting ?? "cloud");
      setUseCI(s.useCI ?? true); setSupport(s.support ?? "basic");
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("site_calc_v1", JSON.stringify({
        kind, pages, design, speed, blog, auth, forms, catalog, payments, delivery,
        crm, search, analytics, animation, integrations, seo, hosting, useCI, support,
      }));
    } catch {}
  }, [kind, pages, design, speed, blog, auth, forms, catalog, payments, delivery,
    crm, search, analytics, animation, integrations, seo, hosting, useCI, support]);

  /* Listen for prefill from configurator */
  useEffect(() => {
    const apply = (s: Record<string, unknown>) => {
      if (s.kind)         setKind(s.kind as SiteKind);
      if (s.pages)        setPages(Number(s.pages));
      if (s.design)       setDesign(s.design as DesignLevel);
      if (s.speed)        setSpeed(s.speed as Speed);
      setBlog(!!s.blog); setAuth(!!s.auth); setForms(s.forms !== false);
      setCatalog(!!s.catalog); setPayments(!!s.payments); setDelivery(!!s.delivery);
      setCrm(!!s.crm); setSearch(s.search !== false); setAnalytics(s.analytics !== false);
      setAnimation(!!s.animation); setIntegrations(!!s.integrations);
      if (s.seo)     setSeo(s.seo as "none" | "lite" | "pro");
      if (s.hosting) setHosting(s.hosting as Hosting);
      setUseCI(s.useCI !== false);
      if (s.support) setSupport(s.support as Support);
    };
    const handler = (e: Event) => apply((e as CustomEvent).detail);
    window.addEventListener("calc-prefill", handler);
    return () => window.removeEventListener("calc-prefill", handler);
  }, []);

  /* Calculation */
  const result = useMemo(() => {
    const base      = PRICING.base[kind];
    const included  = PRICING.includedPages[kind];
    const extraPages = clamp(pages - included, 0, 200);
    const pagesCost = extraPages * PRICING.perPage[kind];
    const designK   = PRICING.design[design];
    let features = 0;
    features += blog ? PRICING.features.blog : 0;
    features += auth ? PRICING.features.auth : 0;
    features += forms ? PRICING.features.forms : 0;
    features += catalog ? PRICING.features.catalog : 0;
    features += payments ? PRICING.features.payments : 0;
    features += delivery ? PRICING.features.delivery : 0;
    features += crm ? PRICING.features.crm : 0;
    features += search ? PRICING.features.search : 0;
    features += analytics ? PRICING.features.analytics : 0;
    features += animation ? PRICING.features.animation : 0;
    features += integrations ? PRICING.features.integrations : 0;
    const seoCost    = PRICING.seo[seo];
    const infraSetup = PRICING.infra.hosting[hosting].setup + (useCI ? PRICING.infra.ci.setup : 0) + PRICING.infra.domains.setup;
    const infraMonthly = PRICING.infra.hosting[hosting].monthly + (useCI ? PRICING.infra.ci.monthly : 0) + PRICING.infra.domains.monthly + PRICING.support[support];
    const discountK  = (kind === "ecommerce" && catalog && payments && delivery) ? PRICING.discount.ecommerceKit : 1;
    const speedK     = PRICING.speedMultiplier[speed];
    const oneOff     = Math.round(((base + pagesCost) * designK + features + seoCost + infraSetup) * speedK * discountK);
    return { oneOff, monthly: infraMonthly, discountApplied: discountK !== 1,
      breakdown: { base, pagesCost, designK, features, seoCost, infraSetup, discountK, speedK } };
  }, [kind, pages, design, speed, blog, auth, forms, catalog, payments, delivery,
    crm, search, analytics, animation, integrations, seo, hosting, useCI, support]);

  const setters: StateSetters = {
    setKind, setPages, setDesign, setSpeed, setForms, setBlog, setAuth, setCatalog,
    setPayments, setDelivery, setCrm, setSearch, setAnalytics, setAnimation, setIntegrations,
    setSeo, setHosting, setUseCI, setSupport,
  };

  const resetAll = () => {
    setKind("business"); setPages(8); setDesign("pro"); setSpeed("normal");
    setBlog(false); setAuth(false); setForms(true); setCatalog(false); setPayments(false);
    setDelivery(false); setCrm(false); setSearch(true); setAnalytics(true);
    setAnimation(false); setIntegrations(false);
    setSeo("lite"); setHosting("cloud"); setUseCI(true); setSupport("basic");
  };

  const selectedFeatures = (isEn ? [
    forms && "Forms", blog && "Blog", auth && "User account", catalog && "Catalog",
    payments && "Payments", delivery && "Delivery", crm && "CRM", search && "Search",
    analytics && "Analytics", animation && "Animations", integrations && "Integrations",
  ] : [
    forms && "Формы", blog && "Блог", auth && "Кабинет", catalog && "Каталог",
    payments && "Оплата", delivery && "Доставка", crm && "CRM", search && "Поиск",
    analytics && "Аналитика", animation && "Анимации", integrations && "Интеграции",
  ]).filter(Boolean) as string[];

  const goToContact = () => {
    setQuote?.({
      source: "sites-calculator",
      createdAt: new Date().toISOString(),
      kind, pages, design, seo, hosting, support, speed,
      oneOff: result.oneOff, monthly: result.monthly,
      breakdown: {
        base: result.breakdown.base, pagesCost: result.breakdown.pagesCost,
        designK: `x${result.breakdown.designK}`, features: result.breakdown.features,
        seoCost: result.breakdown.seoCost, infraSetup: result.breakdown.infraSetup,
        discountK: `x${result.breakdown.discountK}`, speedK: `x${result.breakdown.speedK}`,
      },
    });
    router.push("#contact");
  };

  const structuredData = useMemo(() => ({
    "@context": "https://schema.org", "@type": "Service",
    name: isEn ? `Cost calculator for ${mapKind(kind, true).toLowerCase()} development` : `Калькулятор стоимости разработки ${mapKind(kind).toLowerCase()}`,
    provider: { "@type": "Organization", name: "OneStack", url: "https://onestack24.ru" },
    offers: [
      { "@type": "Offer", priceCurrency: "RUB", price: result.oneOff,  category: "Разработка"   },
      { "@type": "Offer", priceCurrency: "RUB", price: result.monthly, category: "Обслуживание" },
    ],
  }), [kind, result.oneOff, result.monthly, isEn]);

  const fadeUp = (d = 0) => reduced ? {} : {
    initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 },
    viewport: { once: true }, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: d },
  };

  /* Shared section row style */
  const sectionRow: React.CSSProperties = {
    borderTop: "1px solid rgba(255,255,255,0.06)",
    paddingTop: 36, paddingBottom: 36,
  };

  return (
    <>
      <Script id="ld-sites-calc" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <section
        id="calculator"
        aria-labelledby={titleId}
        style={{ background: BG, borderTop: "1px solid rgba(255,255,255,0.06)", position: "relative", overflow: "hidden" }}
      >
        {/* Ambient glow */}
        <div aria-hidden style={{
          pointerEvents: "none", position: "absolute", bottom: -160, left: -160,
          width: 500, height: 500, borderRadius: "50%",
          background: TEAL, opacity: 0.06, willChange: "transform", transform: "translateZ(0)", filter: "blur(160px)",
        }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: isMobile ? "0 20px" : "0 40px", position: "relative", zIndex: 1 }}>

          {/* ── Header ── */}
          <motion.div {...(fadeUp(0) as object)} style={{ padding: isMobile ? "80px 0 60px" : "110px 0 72px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ height: 2, width: 20, background: TEAL, borderRadius: 2, flexShrink: 0 }} />
              <span style={{ fontSize: 13, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 500, color: TEAL }}>
                {isEn ? "Cost calculator" : "Калькулятор стоимости"}
              </span>
            </div>
            <h2
              id={titleId}
              className={serif.className}
              style={{ margin: "0 0 16px", fontWeight: 400, lineHeight: 0.92, letterSpacing: "-0.04em" }}
            >
              <span style={{ display: "block", fontSize: "clamp(2.4rem, 6vw, 6rem)", color: TEAL }}>
                {isEn ? "Cost estimate" : "Расчёт стоимости"}
              </span>
              <span style={{ display: "block", fontSize: "clamp(2.4rem, 6vw, 6rem)", color: WHITE }}>
                {isEn ? "for your website" : "вашего сайта"}
              </span>
            </h2>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.7, color: "rgba(244,250,248,0.4)", maxWidth: 520 }}>
              {isEn
                ? "Configure the parameters for your task — get a preliminary estimate. The exact cost is finalised after the brief."
                : "Настройте параметры под вашу задачу — получите предварительную смету. Точную стоимость финализируем после брифа."}
            </p>
          </motion.div>

          {/* ── Main grid ── */}
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 300px",
            gap: isMobile ? 0 : 40,
            alignItems: "start",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}>

            {/* Left: controls */}
            <motion.div
              {...(fadeUp(0.05) as object)}
              style={{ borderRight: isMobile ? "none" : "1px solid rgba(255,255,255,0.06)", paddingRight: isMobile ? 0 : 40 }}
            >

              {/* 01 Presets */}
              <div style={{ paddingTop: 36, paddingBottom: 36 }}>
                <FigLabel num="01" label={isEn ? "Quick presets" : "Быстрые пресеты"} />
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {PRESETS.map(p => (
                    <button key={p.key} type="button"
                      onClick={() => PRESETS.find(x => x.key === p.key)?.apply(setters)}
                      style={{
                        borderRadius: 99, padding: "8px 16px", fontSize: 14, fontWeight: 500, cursor: "pointer",
                        border: "none", transition: "all 0.15s",
                        background: "rgba(255,255,255,0.03)",
                        outline: "1px solid rgba(255,255,255,0.08)",
                        color: "rgba(244,250,248,0.5)",
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.outlineColor = TEAL; (e.currentTarget as HTMLElement).style.color = TEAL; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.outlineColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.color = "rgba(244,250,248,0.5)"; }}
                    >
                      {p.title}
                    </button>
                  ))}
                  <button type="button" onClick={resetAll} style={{
                    borderRadius: 99, padding: "8px 16px", fontSize: 14, fontWeight: 500, cursor: "pointer",
                    border: "none", background: "transparent",
                    outline: "1px solid rgba(255,255,255,0.06)",
                    color: "rgba(244,250,248,0.25)",
                  }}>
                    {isEn ? "Reset" : "Сброс"}
                  </button>
                </div>
              </div>

              {/* 02 Site type */}
              <div style={sectionRow}>
                <FigLabel num="02" label={isEn ? "Site type" : "Тип сайта"} />
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)", gap: 8 }}>
                  {(isEn ? [
                    ["landing",   "Landing page",  "Single-page"],
                    ["business",  "Business card", "Small business"],
                    ["corporate", "Corporate",     "B2B companies"],
                    ["ecommerce", "E-commerce",    "Catalog + checkout"],
                    ["content",   "Informational", "Content / media"],
                    ["portfolio", "Portfolio",     "Experts / studios"],
                  ] : [
                    ["landing",   "Лендинг",          "Одностраничный"],
                    ["business",  "Сайт-визитка",     "Малый бизнес"],
                    ["corporate", "Корпоративный",    "Б2Б-компании"],
                    ["ecommerce", "Интернет-магазин",  "Каталог + оплата"],
                    ["content",   "Информационный",   "Контент/медиа"],
                    ["portfolio", "Портфолио",        "Эксперты/студии"],
                  ] as [SiteKind, string, string][]).map(([k, t, d]) => (
                    <CalcChip key={k} active={kind === k} onClick={() => setKind(k)} title={t} desc={d} />
                  ))}
                </div>
              </div>

              {/* 03 Pages + Design */}
              <div style={sectionRow}>
                <FigLabel num="03" label={isEn ? "Scope & design" : "Объём и дизайн"} />
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 28 }}>
                  <div>
                    <SubLabel label={isEn ? `Pages: ${pages} (base ${PRICING.includedPages[kind]})` : `Страниц: ${pages} (базовых ${PRICING.includedPages[kind]})`} />
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10 }}>
                      <RoundBtn onClick={() => setPages(p => Math.max(1, p - 1))}>–</RoundBtn>
                      <input type="range" min={1} max={60} value={pages}
                        onChange={e => setPages(parseInt(e.target.value))}
                        style={{
                          flex: 1, height: 3, cursor: "pointer", borderRadius: 4,
                          accentColor: TEAL, appearance: "none" as const, WebkitAppearance: "none" as const,
                          background: `linear-gradient(to right, ${TEAL} ${(pages/60)*100}%, rgba(255,255,255,0.1) 0%)`,
                        }}
                      />
                      <RoundBtn onClick={() => setPages(p => Math.min(60, p + 1))}>+</RoundBtn>
                    </div>
                  </div>
                  <div>
                    <SubLabel label={isEn ? "Design level" : "Уровень дизайна"} />
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10 }}>
                      {(isEn ? [["basic","Basic","Standard"],["pro","Pro","Custom UX"],["brand","Premium","Exclusive"]] : [["basic","Базовый","Стандартный"],["pro","Pro","Кастомный UX"],["brand","Премиум","Эксклюзивный"]] as [DesignLevel,string,string][]).map(([k,t,d]) => (
                        <CalcChip key={k} active={design === k} onClick={() => setDesign(k)} title={t} desc={d} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 04 Features */}
              <div style={sectionRow}>
                <FigLabel num="04" label={isEn ? "Functional modules" : "Функциональные модули"} />
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <ToggleSect label={isEn ? "Core" : "Базовые"}>
                    <CalcToggle label={isEn ? "Complex forms"  : "Сложные формы"}   value={forms}  onChange={setForms}  desc={isEn ? "Multi-step" : "Многошаговые"} />
                    <CalcToggle label={isEn ? "Blog / news"    : "Блог / новости"}  value={blog}   onChange={setBlog}   desc={isEn ? "Publishing" : "Публикации"} />
                    <CalcToggle label={isEn ? "User account"   : "Личный кабинет"}  value={auth}   onChange={setAuth}   desc={isEn ? "Auth + roles" : "Авторизация"} />
                  </ToggleSect>
                  <ToggleSect label="E-commerce">
                    <CalcToggle label={isEn ? "Product catalog" : "Каталог товаров"} value={catalog}   onChange={setCatalog}   desc={isEn ? "Products" : "Товары"} />
                    <CalcToggle label={isEn ? "Online payment"  : "Оплата онлайн"}   value={payments}  onChange={setPayments}  desc={isEn ? "Stripe/YooKassa" : "ЮKassa"} />
                    <CalcToggle label={isEn ? "Delivery calc"   : "Расчёт доставки"} value={delivery}  onChange={setDelivery}  desc={isEn ? "Carrier API" : "Интеграция ТК"} />
                    <CalcToggle label={isEn ? "CRM integration" : "CRM-интеграция"}  value={crm}       onChange={setCrm}       desc={isEn ? "Orders" : "Заказы"} />
                  </ToggleSect>
                  <ToggleSect label={isEn ? "Additional" : "Дополнительно"}>
                    <CalcToggle label={isEn ? "Smart search"  : "Умный поиск"}  value={search}       onChange={setSearch}       desc={isEn ? "Filters" : "Фильтры"} />
                    <CalcToggle label={isEn ? "Analytics"     : "Аналитика"}    value={analytics}    onChange={setAnalytics}    desc="GA4" />
                    <CalcToggle label={isEn ? "Animations"    : "Анимации"}     value={animation}    onChange={setAnimation}    desc="Motion" />
                    <CalcToggle label={isEn ? "Integrations"  : "Интеграции"}   value={integrations} onChange={setIntegrations} desc="API" />
                  </ToggleSect>
                </div>
              </div>

              {/* 05 Infrastructure */}
              <div style={{ ...sectionRow, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <FigLabel num="05" label={isEn ? "Infrastructure" : "Инфраструктура"} />
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 20 }}>
                  <div>
                    <SubLabel label={isEn ? "Hosting" : "Хостинг"} />
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                      {(isEn ? [["cloud","Cloud","Auto-scale"],["vps","VPS","Control"],["none","Own",""]] : [["cloud","Облако","Автоскейлинг"],["vps","VPS","Контроль"],["none","Своя",""]] as [Hosting,string,string][]).map(([v,t,d]) => (
                        <CalcChip key={v} active={hosting===v} onClick={() => setHosting(v)} title={t} desc={d} />
                      ))}
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <CalcToggle label="CI/CD" value={useCI} onChange={setUseCI} desc={isEn ? "Auto-deploy" : "Автодеплой"} />
                    </div>
                  </div>
                  <div>
                    <SubLabel label="SEO" />
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                      {(isEn ? [["none","No SEO",""],["lite","Basic","Checklist"],["pro","Pro","Extended"]] : [["none","Без SEO",""],["lite","Базовое","Чек-лист"],["pro","Pro","Расширенный"]] as ["none"|"lite"|"pro",string,string][]).map(([v,t,d]) => (
                        <CalcChip key={v} active={seo===v} onClick={() => setSeo(v)} title={t} desc={d} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <SubLabel label={isEn ? "Support" : "Поддержка"} />
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                      {(isEn ? [["none","None",""],["basic","Basic","Patches"],["pro","Pro","SLA"]] : [["none","Без поддержки",""],["basic","Базовая","Патчи"],["pro","Pro","SLA"]] as [Support,string,string][]).map(([v,t,d]) => (
                        <CalcChip key={v} active={support===v} onClick={() => setSupport(v)} title={t} desc={d} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <SubLabel label={isEn ? "Timeline" : "Сроки"} />
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                      {(isEn
                        ? ([["normal","Standard",TIMELINES_EN[kind].normal],["fast","Rush",TIMELINES_EN[kind].fast]] as [Speed,string,string][])
                        : ([["normal","Стандарт",TIMELINES_RU[kind].normal],["fast","Срочно",TIMELINES_RU[kind].fast]] as [Speed,string,string][])
                      ).map(([v,t,d]) => (
                        <CalcChip key={v} active={speed===v} onClick={() => setSpeed(v)} title={t} desc={d} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>

            {/* Right: result panel */}
            <motion.div
              {...(fadeUp(0.1) as object)}
              style={{ position: isMobile ? "static" : "sticky", top: 88, paddingTop: isMobile ? 24 : 36, paddingBottom: 36 }}
            >
              <FigLabel num="EST" label={isEn ? "Estimate" : "Смета"} />

              <div style={{
                background: `${TEAL}06`, border: `1px solid ${TEAL}20`,
                borderRadius: 12, overflow: "hidden",
              }}>
                {/* Summary chips */}
                <div style={{ padding: "18px 18px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                    {(isEn ? [
                      ["Type",    mapKind(kind, true)],
                      ["Design",  mapDesign(design, true)],
                      ["SEO",     seo === "none" ? "No" : seo === "lite" ? "Basic" : "Pro"],
                      ["Hosting", hosting === "cloud" ? "Cloud" : hosting === "vps" ? "VPS" : "Own"],
                    ] : [
                      ["Тип",     mapKind(kind)],
                      ["Дизайн",  mapDesign(design)],
                      ["SEO",     seo === "none" ? "Нет" : seo === "lite" ? "Базовое" : "Pro"],
                      ["Хостинг", hosting === "cloud" ? "Облако" : hosting === "vps" ? "VPS" : "Своя"],
                    ]).map(([l, v]) => (
                      <div key={l} style={{
                        borderRadius: 8, padding: "8px 10px",
                        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                      }}>
                        <div style={{ fontSize: 11, color: "rgba(244,250,248,0.3)", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.08em" }}>{l}</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: WHITE }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Modules */}
                {selectedFeatures.length > 0 && (
                  <div style={{ padding: "12px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(244,250,248,0.28)", marginBottom: 8 }}>
                      {isEn ? "Modules" : "Модули"}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {selectedFeatures.map(t => (
                        <span key={t} style={{
                          fontSize: 12, padding: "2px 8px", borderRadius: 99,
                          background: `${TEAL}12`, border: `1px solid ${TEAL}25`, color: TEAL,
                        }}>{t}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Breakdown */}
                <div style={{ padding: "12px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(244,250,248,0.28)", marginBottom: 10 }}>
                    {isEn ? "Breakdown" : "Детализация"}
                  </div>
                  {(isEn ? [
                    ["Base",           money(result.breakdown.base)],
                    ["Extra pages",    money(result.breakdown.pagesCost)],
                    ["Design",         `×${result.breakdown.designK.toFixed(2)}`],
                    ["Features",       money(result.breakdown.features)],
                    ["SEO",            money(result.breakdown.seoCost)],
                    ["Infrastructure", money(result.breakdown.infraSetup)],
                    ...(result.breakdown.discountK !== 1 ? [["Discount", `-${Math.round((1 - result.breakdown.discountK) * 100)}%`]] : []),
                    ...(result.breakdown.speedK !== 1 ? [["Rush", `×${result.breakdown.speedK.toFixed(2)}`]] : []),
                  ] : [
                    ["База",           money(result.breakdown.base)],
                    ["Доп. страницы",  money(result.breakdown.pagesCost)],
                    ["Дизайн",         `×${result.breakdown.designK.toFixed(2)}`],
                    ["Функционал",     money(result.breakdown.features)],
                    ["SEO",            money(result.breakdown.seoCost)],
                    ["Инфраструктура", money(result.breakdown.infraSetup)],
                    ...(result.breakdown.discountK !== 1 ? [["Скидка", `-${Math.round((1 - result.breakdown.discountK) * 100)}%`]] : []),
                    ...(result.breakdown.speedK !== 1 ? [["Срочность", `×${result.breakdown.speedK.toFixed(2)}`]] : []),
                  ]).map(([l, v]) => (
                    <div key={l} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "5px 0", borderBottom: "1px solid rgba(255,255,255,0.04)",
                      fontSize: 13,
                    }}>
                      <span style={{ color: "rgba(244,250,248,0.38)" }}>{l}</span>
                      <span style={{ color: WHITE, fontWeight: 500 }}>{v}</span>
                    </div>
                  ))}
                </div>

                {/* Prices */}
                <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {result.discountApplied && (
                    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 4,
                        fontSize: 12, padding: "2px 8px", borderRadius: 99,
                        background: `${TEAL}15`, border: `1px solid ${TEAL}30`, color: TEAL,
                      }}>
                        <Percent size={10} /> {isEn ? "discount" : "скидка"}
                      </span>
                    </div>
                  )}
                  <div style={{
                    borderRadius: 10, padding: "14px 16px", marginBottom: 8,
                    background: `${TEAL}08`, border: `1px solid ${TEAL}20`,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <Sparkles size={12} style={{ color: TEAL }} />
                      <span style={{ fontSize: 13, color: "rgba(244,250,248,0.5)" }}>
                        {isEn ? "Development (one-off)" : "Разработка (разово)"}
                      </span>
                    </div>
                    <div className={serif.className} style={{ fontSize: 34, color: TEAL, lineHeight: 1 }}>
                      <CountUp value={amount(result.oneOff)} lang={isEn ? "en" : "ru"} />
                    </div>
                  </div>
                  <div style={{ borderRadius: 10, padding: "12px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <Server size={12} style={{ color: "rgba(244,250,248,0.35)" }} />
                      <span style={{ fontSize: 13, color: "rgba(244,250,248,0.5)" }}>
                        {isEn ? "Monthly" : "Ежемесячно"}
                      </span>
                    </div>
                    <div className={serif.className} style={{ fontSize: 26, color: WHITE, lineHeight: 1 }}>
                      <CountUp value={amount(result.monthly)} lang={isEn ? "en" : "ru"} />
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div style={{ padding: "14px 18px" }}>
                  <button onClick={goToContact}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      borderRadius: 99, padding: "12px 20px", border: "none", cursor: "pointer",
                      background: TEAL, color: BG, fontSize: 15, fontWeight: 600, transition: "opacity 0.15s",
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = "0.88"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "1"}
                  >
                    <MessageCircle size={14} />
                    {isEn ? "Discuss the project" : "Обсудить проект"}
                    <ArrowRight size={13} />
                  </button>
                  <p style={{ margin: "10px 0 0", fontSize: 12, color: "rgba(244,250,248,0.2)", textAlign: "center", lineHeight: 1.5 }}>
                    {isEn ? "* Preliminary estimate" : "* Расчёт предварительный"}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <div style={{ height: isMobile ? 80 : 110 }} />
        </div>
      </section>
    </>
  );
}

/* ── UI helpers ──────────────────────────────────────────────────────────── */
function FigLabel({ num, label }: { num: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
      <span style={{ fontFamily: "monospace", fontSize: 12, color: TEAL, opacity: 0.7, letterSpacing: "0.06em" }}>{num}</span>
      <span style={{ fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "rgba(244,250,248,0.32)", fontWeight: 500 }}>{label}</span>
    </div>
  );
}

function SubLabel({ label }: { label: string }) {
  return (
    <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "rgba(244,250,248,0.3)" }}>
      {label}
    </div>
  );
}

function CalcChip({ active, onClick, title, desc }: { active: boolean; onClick: () => void; title: string; desc: string }) {
  return (
    <button onClick={onClick} type="button"
      style={{
        textAlign: "left", borderRadius: 8, padding: "9px 11px", cursor: "pointer",
        border: "none", transition: "all 0.15s", width: "100%",
        background: active ? `${TEAL}15` : "rgba(255,255,255,0.02)",
        outline: active ? `1px solid ${TEAL}` : "1px solid rgba(255,255,255,0.07)",
        color: active ? WHITE : "rgba(244,250,248,0.55)",
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 600 }}>{title}</div>
      {desc && <div style={{ fontSize: 12, opacity: 0.5, marginTop: 1 }}>{desc}</div>}
    </button>
  );
}

function ToggleSect({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "rgba(244,250,248,0.28)", marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 6 }}>
        {children}
      </div>
    </div>
  );
}

function CalcToggle({ label, value, onChange, desc }: { label: string; value: boolean; onChange: (v: boolean) => void; desc?: string }) {
  return (
    <button onClick={() => onChange(!value)} type="button"
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderRadius: 8, padding: "9px 11px", cursor: "pointer",
        border: "none", transition: "all 0.15s",
        background: value ? `${TEAL}12` : "rgba(255,255,255,0.02)",
        outline: value ? `1px solid ${TEAL}45` : "1px solid rgba(255,255,255,0.07)",
        color: value ? TEAL : "rgba(244,250,248,0.45)",
      }}
    >
      <div style={{ textAlign: "left" }}>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{label}</div>
        {desc && <div style={{ fontSize: 12, opacity: 0.5, marginTop: 1 }}>{desc}</div>}
      </div>
      <span style={{
        display: "inline-flex", alignItems: "center",
        width: 30, height: 17, borderRadius: 9, marginLeft: 8, flexShrink: 0,
        background: value ? TEAL : "rgba(255,255,255,0.1)", transition: "background 0.2s",
      }}>
        <span style={{
          width: 11, height: 11, borderRadius: "50%", background: WHITE,
          marginLeft: 3, transition: "transform 0.2s",
          transform: value ? "translateX(13px)" : "translateX(0)",
        }} />
      </span>
    </button>
  );
}

function RoundBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      style={{
        width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
        border: "1px solid rgba(255,255,255,0.1)",
        background: "transparent", color: "rgba(244,250,248,0.5)",
        cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      {children}
    </button>
  );
}
