// src/components/MobileCalculator.tsx
"use client";
import { serif } from "@/lib/fonts";

import { useEffect, useMemo, useState, useId } from "react";
import { motion, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { Sparkles, Server, Percent, MessageCircle, ArrowRight } from "lucide-react";
import { useQuote } from "@/app/context/QuoteContext";
import Script from "next/script";
import { useI18n } from "@/i18n/I18nProvider";
import { useMoney } from "@/lib/useMoney";


const BG    = "#07100e";
const TEAL  = "#2dd4bf";
const WHITE = "#f4faf8";

/* ─── Types ─────────────────────────────────────────────────────────────── */
type AppKind     = "client" | "loyalty" | "field" | "marketplace" | "fintech" | "saasMobile";
type DesignLevel = "basic" | "pro" | "brand";
type Speed       = "normal" | "fast";
type Hosting     = "none" | "cloud" | "vps";
type Support     = "none" | "basic" | "pro";

/* ─── Pricing ────────────────────────────────────────────────────────────── */
const PRICING = {
  base: { client: 600_000, loyalty: 650_000, field: 810_000, marketplace: 1_375_000, fintech: 1_625_000, saasMobile: 975_000 } as Record<AppKind, number>,
  scope: { included: 8, perUnit: 38_000 },
  design: { basic: 1.0, pro: 1.2, brand: 1.4 } as Record<DesignLevel, number>,
  features: {
    auth: 88_000, push: 56_000, offline: 105_000, payments: 140_000, subscriptions: 110_000,
    maps: 81_000, geofencing: 69_000, chat: 100_000, cameraMedia: 62_000,
    analytics: 31_000, abtests: 44_000, deeplinks: 31_000, extIntegr: 75_000, i18n: 56_000,
  },
  infra: {
    hosting: {
      none:  { monthly: 0,      setup: 0      },
      cloud: { monthly: 12_000, setup: 25_000 },
      vps:   { monthly: 10_000,  setup: 35_000 },
    } as Record<Hosting, { monthly: number; setup: number }>,
    notifications: { monthly: 2_500, setup: 5_000 },
    ota:           { monthly: 2_000, setup: 5_000 },
    crashlytics:   { monthly: 1_000, setup: 2_500 },
    observ:        { monthly: 3_000, setup: 7_500 },
    ci:            { monthly: 4_000, setup: 15_000 },
    domains:       { monthly: 600,   setup: 3_000  },
  },
  support: { none: 0, basic: 38_000, pro: 88_000 } as Record<Support, number>,
  speed:   { normal: 1.0, fast: 1.22 } as Record<Speed, number>,
  discounts: { loyaltyPack: 0.92, marketPack: 0.93 },
};

function clamp(n: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, n)); }

/* ─── CountUp (spring) ───────────────────────────────────────────────────── */
function useCountUp(value: number) {
  const s = useSpring(value, { stiffness: 100, damping: 25, mass: 0.5 });
  useEffect(() => { s.set(value); }, [value, s]);
  return useTransform(s, v => Math.round(v));
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
export default function MobileCalculator() {
  const { setQuote } = useQuote();
  const reduced = useReducedMotion();
  const { locale } = useI18n();
  const isEn = locale === "en";
  const { money, amount } = useMoney(isEn ? "en" : "ru");
  const titleId = useId();

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const [kind, setKind]     = useState<AppKind>("client");
  const [scope, setScope]   = useState(8);
  const [design, setDesign] = useState<DesignLevel>("pro");
  const [speed, setSpeed]   = useState<Speed>("normal");

  const [auth, setAuth]         = useState(true);
  const [push, setPush]         = useState(true);
  const [offline, setOffline]   = useState(false);
  const [payments, setPayments] = useState(false);
  const [subscriptions, setSubscriptions] = useState(false);
  const [maps, setMaps]           = useState(false);
  const [geofencing, setGeofencing] = useState(false);
  const [chat, setChat]           = useState(false);
  const [cameraMedia, setCameraMedia] = useState(true);
  const [analytics, setAnalytics] = useState(true);
  const [abtests, setAbtests]     = useState(false);
  const [deeplinks, setDeeplinks] = useState(true);
  const [extIntegr, setExtIntegr] = useState(false);
  const [i18n, setI18n]           = useState(false);

  const [hosting, setHosting]       = useState<Hosting>("cloud");
  const [useNotif, setUseNotif]     = useState(true);
  const [useOTA, setUseOTA]         = useState(true);
  const [useCrashlytics]            = useState(true);
  const [useObserv, setUseObserv]   = useState(true);
  const [useCI, setUseCI]           = useState(true);
  const [support, setSupport]       = useState<Support>("basic");

  /* restore/save */
  useEffect(() => {
    const handler = (e: Event) => {
      const k = (e as CustomEvent<{ kind: AppKind }>).detail?.kind;
      if (k) setKind(k);
    };
    window.addEventListener("mobile-calc-prefill", handler);
    return () => window.removeEventListener("mobile-calc-prefill", handler);
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("onestack_mobile_calc") ?? localStorage.getItem("mobile_calc_v1");
      if (!raw) return;
      const s = JSON.parse(raw);
      setKind(s.kind ?? "client"); setScope(s.scope ?? 8);
      setDesign(s.design ?? "pro"); setSpeed(s.speed ?? "normal");
      setAuth(!!s.auth); setPush(!!s.push); setOffline(!!s.offline);
      setPayments(!!s.payments); setSubscriptions(!!s.subscriptions);
      setMaps(!!s.maps); setGeofencing(!!s.geofencing); setChat(!!s.chat);
      setCameraMedia(!!s.cameraMedia); setAnalytics(s.analytics ?? true);
      setAbtests(!!s.abtests); setDeeplinks(s.deeplinks ?? true);
      setExtIntegr(!!s.extIntegr); setI18n(!!s.i18n);
      setHosting(s.hosting ?? "cloud"); setUseNotif(s.useNotif ?? true);
      setUseOTA(s.useOTA ?? true); setUseObserv(s.useObserv ?? true);
      setUseCI(s.useCI ?? true); setSupport(s.support ?? "basic");
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("onestack_mobile_calc", JSON.stringify({
        kind, scope, design, speed,
        auth, push, offline, payments, subscriptions, maps, geofencing, chat, cameraMedia,
        analytics, abtests, deeplinks, extIntegr, i18n,
        hosting, useNotif, useOTA, useCrashlytics, useObserv, useCI, support,
      }));
    } catch { /* ignore */ }
  }, [kind, scope, design, speed, auth, push, offline, payments, subscriptions, maps, geofencing, chat, cameraMedia, analytics, abtests, deeplinks, extIntegr, i18n, hosting, useNotif, useOTA, useCrashlytics, useObserv, useCI, support]);

  /* calc */
  const result = useMemo(() => {
    const base     = PRICING.base[kind];
    const scopeAdd = clamp(scope - PRICING.scope.included, 0, 500) * PRICING.scope.perUnit;
    const designK  = PRICING.design[design];
    let features = 0;
    if (auth)          features += PRICING.features.auth;
    if (push)          features += PRICING.features.push;
    if (offline)       features += PRICING.features.offline;
    if (payments)      features += PRICING.features.payments;
    if (subscriptions) features += PRICING.features.subscriptions;
    if (maps)          features += PRICING.features.maps;
    if (geofencing)    features += PRICING.features.geofencing;
    if (chat)          features += PRICING.features.chat;
    if (cameraMedia)   features += PRICING.features.cameraMedia;
    if (analytics)     features += PRICING.features.analytics;
    if (abtests)       features += PRICING.features.abtests;
    if (deeplinks)     features += PRICING.features.deeplinks;
    if (extIntegr)     features += PRICING.features.extIntegr;
    if (i18n)          features += PRICING.features.i18n;
    const infraSetup =
      PRICING.infra.hosting[hosting].setup +
      (useNotif ? PRICING.infra.notifications.setup : 0) +
      (useOTA   ? PRICING.infra.ota.setup           : 0) +
      (useCrashlytics ? PRICING.infra.crashlytics.setup : 0) +
      (useObserv ? PRICING.infra.observ.setup       : 0) +
      (useCI    ? PRICING.infra.ci.setup            : 0) +
      PRICING.infra.domains.setup;
    const monthly =
      PRICING.infra.hosting[hosting].monthly +
      (useNotif ? PRICING.infra.notifications.monthly : 0) +
      (useOTA   ? PRICING.infra.ota.monthly           : 0) +
      (useCrashlytics ? PRICING.infra.crashlytics.monthly : 0) +
      (useObserv ? PRICING.infra.observ.monthly       : 0) +
      (useCI    ? PRICING.infra.ci.monthly            : 0) +
      PRICING.infra.domains.monthly + PRICING.support[support];
    let discountK = 1;
    if (kind === "loyalty"     && push && payments)         discountK *= PRICING.discounts.loyaltyPack;
    if (kind === "marketplace" && payments && chat && maps) discountK *= PRICING.discounts.marketPack;
    const speedK  = PRICING.speed[speed];
    const oneOff  = Math.round((base + scopeAdd) * designK * speedK * discountK + features + infraSetup);
    return { base, scopeAdd, designK, features, infraSetup, discountK, speedK, oneOff, monthly, discountApplied: discountK !== 1 };
  }, [kind, scope, design, speed, auth, push, offline, payments, subscriptions, maps, geofencing, chat, cameraMedia, analytics, abtests, deeplinks, extIntegr, i18n, hosting, useNotif, useOTA, useCrashlytics, useObserv, useCI, support]);

  const mapKind = (k: AppKind) => isEn
    ? ({ client: "Client app", loyalty: "Loyalty", field: "Field app", marketplace: "Marketplace", fintech: "Fintech", saasMobile: "SaaS client" })[k]
    : ({ client: "Клиентское", loyalty: "Лояльность", field: "Полевое", marketplace: "Маркетплейс", fintech: "Финтех", saasMobile: "SaaS" })[k];
  const mapDesign = (d: DesignLevel) => isEn
    ? ({ basic: "Basic", pro: "Pro", brand: "Premium" })[d]
    : ({ basic: "Базовый", pro: "Pro", brand: "Премиум" })[d];

  const selectedModules = [
    auth         && (isEn ? "Auth" : "Auth"),
    push         && "Push",
    offline      && (isEn ? "Offline" : "Оффлайн"),
    payments     && (isEn ? "Payments" : "Платежи"),
    subscriptions && (isEn ? "Subscriptions" : "Подписки"),
    maps         && (isEn ? "Maps" : "Карты"),
    geofencing   && "Geofencing",
    chat         && "Chat",
    cameraMedia  && (isEn ? "Camera" : "Камера"),
    analytics    && (isEn ? "Analytics" : "Аналитика"),
    abtests      && "A/B",
    deeplinks    && "Deep-links",
    extIntegr    && (isEn ? "Integrations" : "Интеграции"),
    i18n         && "i18n",
  ].filter(Boolean) as string[];

  const goToContact = () => {
    setQuote?.({
      source: "other", createdAt: new Date().toISOString(),
      kind, scope, design, speed, hosting, support,
      oneOff: result.oneOff, monthly: result.monthly,
      modules: { auth, push, offline, payments, subscriptions, maps, geofencing, chat, cameraMedia, analytics, abtests, deeplinks, extIntegr, i18n },
      infra: { useObserv, useCI },
      breakdown: { base: result.base, scopeCost: result.scopeAdd, designK: `x${result.designK}`, features: result.features, infraSetup: result.infraSetup, discountK: `x${result.discountK}`, speedK: `x${result.speedK}` },
    });
    const el = document.querySelector<HTMLElement>("#contact");
    if (el) { el.scrollIntoView({ behavior: "smooth" }); history.pushState(null, "", "#contact"); }
    else // Раздел «Обсудить проект» теперь открывается окном (MobileLayers).
    window.dispatchEvent(new CustomEvent("site-open-section", { detail: "contact" }));
  };

  const jsonLd = useMemo(() => ({
    "@context": "https://schema.org", "@type": "Service",
    name: "Калькулятор стоимости мобильного приложения",
    provider: { "@type": "Organization", name: "OneStack24" },
    offers: [
      { "@type": "Offer", priceCurrency: "RUB", price: result.oneOff, category: "Разработка" },
      { "@type": "Offer", priceCurrency: "RUB", price: result.monthly, category: "Обслуживание" },
    ],
  }), [result.oneOff, result.monthly]);

  const fadeUp = (d = 0) => reduced ? {} : {
    initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 },
    viewport: { once: true }, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: d },
  };

  const sectionRow: React.CSSProperties = {
    borderTop: "1px solid rgba(255,255,255,0.06)",
    paddingTop: 36, paddingBottom: 36,
  };

  return (
    <>
      <Script id="ld-mobile-calc" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section
        id="calculator"
        aria-labelledby={titleId}
        style={{ background: BG, borderTop: "1px solid rgba(255,255,255,0.06)", position: "relative", overflow: "hidden" }}
      >
        <div aria-hidden style={{
          pointerEvents: "none", position: "absolute", bottom: -160, right: -160,
          width: 500, height: 500, borderRadius: "50%",
          background: TEAL, opacity: 0.06, willChange: "transform", transform: "translateZ(0)", filter: "blur(160px)",
        }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: isMobile ? "0 20px" : "0 40px", position: "relative", zIndex: 1 }}>

          {/* ── Header ── */}
          <motion.div {...(fadeUp(0) as object)} style={{ padding: isMobile ? "80px 0 48px" : "110px 0 72px" }}>
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
                {isEn ? "Calculate" : "Рассчитайте"}
              </span>
              <span style={{ display: "block", fontSize: "clamp(2.4rem, 6vw, 6rem)", color: WHITE }}>
                {isEn ? "your app" : "ваше приложение"}
              </span>
            </h2>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.7, color: "rgba(244,250,248,0.4)", maxWidth: 520 }}>
              {isEn
                ? "Configure the parameters for your task — get a preliminary estimate. Final cost is determined after a brief."
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
              style={{
                borderRight: isMobile ? "none" : "1px solid rgba(255,255,255,0.06)",
                paddingRight: isMobile ? 0 : 40,
              }}
            >

              {/* 01 App type */}
              <div style={{ paddingTop: 36, paddingBottom: 36 }}>
                <FigLabel num="01" label={isEn ? "App type" : "Тип приложения"} />
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)", gap: 8 }}>
                  {((isEn ? [
                    ["client",      "Client app",    "Customer service"],
                    ["loyalty",     "Loyalty",       "Cards & bonuses"],
                    ["field",       "Field app",     "Staff & routes"],
                    ["marketplace", "Marketplace",   "Catalog & orders"],
                    ["fintech",     "Fintech",       "Payments & wallets"],
                    ["saasMobile",  "SaaS client",   "Mobile SaaS"],
                  ] : [
                    ["client",      "Клиентское",    "Клиентский сервис"],
                    ["loyalty",     "Лояльность",    "Карты и бонусы"],
                    ["field",       "Полевое",       "Персонал и маршруты"],
                    ["marketplace", "Маркетплейс",   "Каталог и заказы"],
                    ["fintech",     "Финтех",        "Платежи и кошельки"],
                    ["saasMobile",  "SaaS клиент",   "Мобильный SaaS"],
                  ]) as [AppKind, string, string][]).map(([k, t, d]) => (
                    <CalcChip key={k} active={kind === k} onClick={() => setKind(k)} title={t} desc={d} />
                  ))}
                </div>
              </div>

              {/* 02 Scope + Design */}
              <div style={sectionRow}>
                <FigLabel num="02" label={isEn ? "Scope & design" : "Объём и дизайн"} />
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 20 : 28 }}>
                  <div>
                    <SubLabel label={isEn ? `Modules: ${scope} (base ${PRICING.scope.included})` : `Модулей: ${scope} (базовых ${PRICING.scope.included})`} />
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10 }}>
                      <RoundBtn onClick={() => setScope(s => Math.max(1, s - 1))}>–</RoundBtn>
                      <input type="range" min={1} max={60} value={scope}
                        onChange={e => setScope(parseInt(e.target.value))}
                        style={{
                          flex: 1, height: 3, cursor: "pointer", borderRadius: 4,
                          accentColor: TEAL, appearance: "none" as const, WebkitAppearance: "none" as const,
                          background: `linear-gradient(to right, ${TEAL} ${(scope / 60) * 100}%, rgba(255,255,255,0.1) 0%)`,
                        }}
                      />
                      <RoundBtn onClick={() => setScope(s => Math.min(60, s + 1))}>+</RoundBtn>
                    </div>
                  </div>
                  <div>
                    <SubLabel label={isEn ? "Design level" : "Уровень дизайна"} />
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10 }}>
                      {((isEn
                        ? [["basic","Basic","Standard"],["pro","Pro","Custom UX"],["brand","Premium","Exclusive"]]
                        : [["basic","Базовый","Стандартный"],["pro","Pro","Кастомный UX"],["brand","Премиум","Эксклюзивный"]]) as [DesignLevel,string,string][]).map(([k, t, d]) => (
                        <CalcChip key={k} active={design === k} onClick={() => setDesign(k)} title={t} desc={d} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 03 Feature modules */}
              <div style={sectionRow}>
                <FigLabel num="03" label={isEn ? "Feature modules" : "Функциональные модули"} />
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <ToggleSect cols={isMobile ? 1 : 2} label={isEn ? "Security & access" : "Безопасность и доступ"}>
                    <CalcToggle label={isEn ? "Auth / biometrics" : "Auth / биометрия"} value={auth}      onChange={setAuth}      desc="OAuth/OIDC, Face/Touch ID" />
                    <CalcToggle label="Deep-links"                                        value={deeplinks}  onChange={setDeeplinks} desc={isEn ? "Universal links" : "Универсальные ссылки"} />
                    <CalcToggle label={isEn ? "Multilanguage" : "Мультиязычность"}       value={i18n}       onChange={setI18n}      desc="EN / RU" />
                  </ToggleSect>
                  <ToggleSect cols={isMobile ? 1 : 2} label={isEn ? "Communication" : "Коммуникации"}>
                    <CalcToggle label={isEn ? "Push notifications" : "Push-уведомления"} value={push}    onChange={setPush}    desc="FCM / APNs" />
                    <CalcToggle label={isEn ? "Offline mode" : "Оффлайн-режим"}          value={offline} onChange={setOffline} desc={isEn ? "Local cache & sync" : "Кэш и синхронизация"} />
                    <CalcToggle label={isEn ? "Chat / support" : "Чат / поддержка"}      value={chat}    onChange={setChat}    desc="WebSocket" />
                  </ToggleSect>
                  <ToggleSect cols={isMobile ? 1 : 2} label={isEn ? "Payments & monetisation" : "Платежи и монетизация"}>
                    <CalcToggle label={isEn ? "Payment systems" : "Платёжные системы"}  value={payments}      onChange={setPayments}      desc={isEn ? "YooKassa, Stripe" : "ЮKassa, Stripe"} />
                    <CalcToggle label={isEn ? "Subscriptions" : "Подписки"}             value={subscriptions} onChange={setSubscriptions} desc={isEn ? "IAP, recurring" : "IAP, биллинг"} />
                  </ToggleSect>
                  <ToggleSect cols={isMobile ? 1 : 2} label={isEn ? "Geo & media" : "Геолокация и медиа"}>
                    <CalcToggle label={isEn ? "Maps & routing" : "Карты и маршруты"} value={maps}        onChange={setMaps}        desc="MapKit / Google Maps" />
                    <CalcToggle label="Geofencing"                                    value={geofencing}  onChange={setGeofencing}  desc={isEn ? "Zone triggers" : "Зоны и триггеры"} />
                    <CalcToggle label={isEn ? "Camera & media" : "Камера и медиа"}   value={cameraMedia} onChange={setCameraMedia} desc={isEn ? "Photo / video" : "Фото / видео"} />
                  </ToggleSect>
                  <ToggleSect cols={isMobile ? 1 : 2} label={isEn ? "Analytics & integrations" : "Аналитика и интеграции"}>
                    <CalcToggle label={isEn ? "Event analytics" : "Аналитика событий"}  value={analytics} onChange={setAnalytics} desc="Firebase / Amplitude" />
                    <CalcToggle label={isEn ? "A/B tests" : "A/B-тесты"}                value={abtests}   onChange={setAbtests}   desc={isEn ? "Experiments" : "Эксперименты"} />
                    <CalcToggle label={isEn ? "Ext. integrations" : "Внешние интеграции"} value={extIntegr} onChange={setExtIntegr} desc="API, CRM, 1С" />
                  </ToggleSect>
                </div>
              </div>

              {/* 04 Infrastructure */}
              <div style={{ ...sectionRow, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <FigLabel num="04" label={isEn ? "Infrastructure" : "Инфраструктура"} />
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: isMobile ? 12 : 20 }}>
                  <div>
                    <SubLabel label={isEn ? "Hosting" : "Хостинг"} />
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                      {((isEn
                        ? [["cloud","Cloud","Auto-scale"],["vps","VPS","Control"],["none","Own",""]]
                        : [["cloud","Облако","Автоскейлинг"],["vps","VPS","Контроль"],["none","Своя",""]]) as [Hosting,string,string][]).map(([v, t, d]) => (
                        <CalcChip key={v} active={hosting === v} onClick={() => setHosting(v)} title={t} desc={d} />
                      ))}
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <CalcToggle label="CI/CD" value={useCI} onChange={setUseCI} desc={isEn ? "Auto-deploy" : "Автодеплой"} />
                    </div>
                  </div>
                  <div>
                    <SubLabel label={isEn ? "Mobile infra" : "Мобильная инфра"} />
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                      <CalcToggle label={isEn ? "Push service" : "Пуш-сервис"}    value={useNotif} onChange={setUseNotif} desc="FCM / APNs" />
                      <CalcToggle label={isEn ? "OTA updates" : "OTA-обновления"} value={useOTA}   onChange={setUseOTA}   desc="CodePush" />
                      <CalcToggle label={isEn ? "Monitoring" : "Мониторинг"}      value={useObserv} onChange={setUseObserv} desc="Sentry / Grafana" />
                    </div>
                  </div>
                  <div>
                    <SubLabel label={isEn ? "Support" : "Поддержка"} />
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                      {((isEn
                        ? [["none","None",""],["basic","Basic","Patches"],["pro","Pro","SLA"]]
                        : [["none","Без поддержки",""],["basic","Базовая","Патчи"],["pro","Pro","SLA"]]) as [Support,string,string][]).map(([v, t, d]) => (
                        <CalcChip key={v} active={support === v} onClick={() => setSupport(v)} title={t} desc={d} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <SubLabel label={isEn ? "Timeline" : "Сроки"} />
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                      {((isEn
                        ? [["normal","Standard","3–6 months"],["fast","Urgent","×1.22 cost"]]
                        : [["normal","Стандарт","3–6 месяцев"],["fast","Срочно","×1.22 цена"]]) as [Speed,string,string][]).map(([v, t, d]) => (
                        <CalcChip key={v} active={speed === v} onClick={() => setSpeed(v)} title={t} desc={d} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>

            {/* Right: result panel */}
            <motion.div
              {...(fadeUp(0.1) as object)}
              style={{
                position: isMobile ? "static" : "sticky",
                top: isMobile ? undefined : 88,
                paddingTop: 36,
                paddingBottom: 36,
                borderTop: isMobile ? "1px solid rgba(255,255,255,0.06)" : "none",
              }}
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
                      ["Type",    mapKind(kind)],
                      ["Design",  mapDesign(design)],
                      ["Hosting", hosting === "cloud" ? "Cloud" : hosting === "vps" ? "VPS" : "Own"],
                      ["Support", support === "none" ? "None" : support === "basic" ? "Basic" : "Pro"],
                    ] : [
                      ["Тип",       mapKind(kind)],
                      ["Дизайн",    mapDesign(design)],
                      ["Хостинг",   hosting === "cloud" ? "Облако" : hosting === "vps" ? "VPS" : "Своя"],
                      ["Поддержка", support === "none" ? "Нет" : support === "basic" ? "Базовая" : "Pro"],
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

                {/* Selected modules */}
                {selectedModules.length > 0 && (
                  <div style={{ padding: "12px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(244,250,248,0.28)", marginBottom: 8 }}>
                      {isEn ? "Modules" : "Модули"}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {selectedModules.map(t => (
                        <span key={t} style={{
                          fontSize: 11, padding: "3px 8px", borderRadius: 99,
                          background: `${TEAL}12`, border: `1px solid ${TEAL}25`, color: TEAL,
                        }}>{t}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Breakdown */}
                <div style={{ padding: "12px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(244,250,248,0.28)", marginBottom: 8 }}>
                    {isEn ? "Breakdown" : "Детализация"}
                  </div>
                  {[
                    [isEn ? "Base" : "База",                     money(result.base)],
                    [isEn ? "Extra modules" : "Доп. модули",     money(result.scopeAdd)],
                    [isEn ? "Design" : "Дизайн",                 `×${result.designK.toFixed(2)}`],
                    [isEn ? "Features" : "Функционал",           money(result.features)],
                    [isEn ? "Infrastructure" : "Инфраструктура", money(result.infraSetup)],
                    ...(result.discountK !== 1 ? [[isEn ? "Discount" : "Скидка", `-${Math.round((1 - result.discountK) * 100)}%`]] : []),
                    ...(result.speedK !== 1 ? [[isEn ? "Urgency" : "Срочность", `×${result.speedK.toFixed(2)}`]] : []),
                  ].map(([l, v]) => (
                    <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <span style={{ fontSize: 13, color: "rgba(244,250,248,0.38)" }}>{l}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: WHITE }}>{v}</span>
                    </div>
                  ))}
                </div>

                {/* Prices */}
                <div style={{ padding: "18px 18px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <Sparkles size={12} style={{ color: TEAL }} />
                      <span style={{ fontSize: 12, color: "rgba(244,250,248,0.45)" }}>{isEn ? "Development (one-time)" : "Разработка (разово)"}</span>
                      {result.discountApplied && (
                        <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, padding: "2px 7px", borderRadius: 99, background: `${TEAL}15`, border: `1px solid ${TEAL}30`, color: TEAL }}>
                          <Percent size={8} /> {isEn ? "discount" : "скидка"}
                        </span>
                      )}
                    </div>
                    <div className={serif.className} style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", color: TEAL, lineHeight: 1 }}>
                      <CountUp value={amount(result.oneOff)} lang={isEn ? "en" : "ru"} />
                    </div>
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <Server size={12} style={{ color: "rgba(244,250,248,0.35)" }} />
                      <span style={{ fontSize: 12, color: "rgba(244,250,248,0.45)" }}>{isEn ? "Monthly (infra + support)" : "Ежемесячно (инфра + поддержка)"}</span>
                    </div>
                    <div className={serif.className} style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)", color: WHITE, lineHeight: 1 }}>
                      <CountUp value={amount(result.monthly)} lang={isEn ? "en" : "ru"} />
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div style={{ padding: "16px 18px 18px" }}>
                  <button onClick={goToContact} type="button"
                    style={{
                      width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
                      gap: 8, borderRadius: 99, padding: "12px 20px", fontSize: 15, fontWeight: 600,
                      cursor: "pointer", border: "none", background: TEAL, color: BG,
                      transition: "opacity 0.15s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                  >
                    <MessageCircle size={14} />
                    {isEn ? "Discuss the project" : "Обсудить проект"}
                    <ArrowRight size={13} />
                  </button>
                  <p style={{ margin: "10px 0 0", fontSize: 11, lineHeight: 1.5, color: "rgba(244,250,248,0.22)", textAlign: "center" }}>
                    * {isEn ? "Estimate is preliminary." : "Расчёт предварительный."}
                  </p>
                </div>
              </div>
            </motion.div>

          </div>

          <div style={{ height: isMobile ? 72 : 110 }} />
        </div>
      </section>
    </>
  );
}

/* ─── UI helpers ─────────────────────────────────────────────────────────── */
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

function ToggleSect({ label, children, cols = 2 }: { label: string; children: React.ReactNode; cols?: number }) {
  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "rgba(244,250,248,0.28)", marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 6 }}>
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
