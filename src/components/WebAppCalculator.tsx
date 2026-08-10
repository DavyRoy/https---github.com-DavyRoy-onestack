// src/components/WebAppCalculator.tsx
// v2
"use client";
import { serif } from "@/lib/fonts";

import { useEffect, useMemo, useState, useId } from "react";
import { motion, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { Sparkles, Server, Percent, MessageCircle, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuote } from "@/app/context/QuoteContext";
import { useI18n } from "@/i18n/I18nProvider";
import Script from "next/script";
import { siteUrl } from "@/app/seo.config";


/* ─── Palette ────────────────────────────────────────────────────────────── */
const BG    = "#07100e";
const TEAL  = "#2dd4bf";
const WHITE = "#f4faf8";

/* ─── Types & Constants ──────────────────────────────────────────────────── */
type AppKind     = "crm" | "portal" | "client" | "analytics" | "b2b" | "saas";
type DesignLevel = "basic" | "pro" | "brand";
type Speed       = "normal" | "fast";
type Hosting     = "none" | "cloud" | "vps";
type Support     = "none" | "basic" | "pro";

const PRICING = {
  base: {
    crm:       780_000,
    portal:    590_000,
    client:    520_000,
    analytics: 700_000,
    b2b:       620_000,
    saas:      940_000,
  },
  scope: { included: 10, perUnit: 25_000 },
  design: { basic: 1.0, pro: 1.22, brand: 1.45 },
  features: {
    rbac: 95_000, sso: 78_000, audit: 65_000, notifications: 52_000, realtime: 88_000,
    queues: 75_000, storage: 48_000, extIntegr: 62_000, payments: 90_000, subscriptions: 82_000,
    reports: 68_000, i18n: 52_000,
  },
  infra: {
    hosting: { none: { monthly: 0, setup: 0 }, cloud: { monthly: 11_000, setup: 22_000 }, vps: { monthly: 9_000, setup: 32_000 } },
    db:    { monthly: 5_000, setup: 7_500 },
    cache: { monthly: 3_000, setup: 5_500 },
    observ:{ monthly: 3_500, setup: 7_000 },
    ci:    { monthly: 3_500, setup: 15_000 },
    domains:{ monthly: 500, setup: 2_500 },
  },
  support: { none: 0, basic: 35_000, pro: 80_000 },
  speedMultiplier: { normal: 1.0, fast: 1.25 },
  discounts: { saasBilling: 0.90, analyticsPack: 0.92 },
} as const;

function clamp(n: number, min: number, max: number) { return Math.max(min, Math.min(max, n)); }
function fmt(n: number) { return n.toLocaleString("ru-RU") + " ₽"; }
function mapKind(k: AppKind, isEn: boolean) {
  if (isEn) return k === "crm" ? "CRM system" : k === "portal" ? "Corp. portal" :
    k === "client" ? "User portal" : k === "analytics" ? "Analytics" :
    k === "b2b" ? "B2B platform" : "SaaS service";
  return k === "crm" ? "CRM система" : k === "portal" ? "Корп. портал" :
    k === "client" ? "Личный кабинет" : k === "analytics" ? "Аналитика" :
    k === "b2b" ? "B2B платформа" : "SaaS сервис";
}
function mapDesign(d: DesignLevel, isEn: boolean) {
  if (isEn) return d === "basic" ? "Basic" : d === "pro" ? "Pro" : "Premium";
  return d === "basic" ? "Базовый" : d === "pro" ? "Pro" : "Премиум";
}

/* ─── Animated counter ───────────────────────────────────────────────────── */
function useCountUp(value: number) {
  const s = useSpring(value, { stiffness: 100, damping: 25, mass: 0.5 });
  useEffect(() => { s.set(value); }, [value, s]);
  return useTransform(s, (v) => Math.round(v));
}
function CountUp({ value }: { value: number }) {
  const a = useCountUp(value);
  const [v, setV] = useState(value);
  useEffect(() => { const u = a.on("change", n => setV(n)); return () => u(); }, [a]);
  return <span style={{ fontVariantNumeric: "tabular-nums" }}>{v.toLocaleString("ru-RU")}</span>;
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════════════════════════════════ */
export default function WebAppCalculator() {
  const { locale } = useI18n();
  const isEn = locale === "en";
  const router = useRouter();
  const { setQuote } = useQuote();
  const reduced = useReducedMotion();
  const titleId = useId();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const [kind,          setKind]          = useState<AppKind>("client");
  const [scope,         setScope]         = useState(10);
  const [design,        setDesign]        = useState<DesignLevel>("pro");
  const [speed,         setSpeed]         = useState<Speed>("normal");
  const [rbac,          setRbac]          = useState(true);
  const [sso,           setSso]           = useState(false);
  const [audit,         setAudit]         = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [realtime,      setRealtime]      = useState(false);
  const [queues,        setQueues]        = useState(true);
  const [storage,       setStorage]       = useState(true);
  const [extIntegr,     setExtIntegr]     = useState(false);
  const [payments,      setPayments]      = useState(false);
  const [subscriptions, setSubscriptions] = useState(false);
  const [reports,       setReports]       = useState(false);
  const [i18n,          setI18n]          = useState(false);
  const [hosting,       setHosting]       = useState<Hosting>("cloud");
  const [useDB,         setUseDB]         = useState(true);
  const [useCache,      setUseCache]      = useState(true);
  const [useObserv,     setUseObserv]     = useState(true);
  const [useCI,         setUseCI]         = useState(true);
  const [support,       setSupport]       = useState<Support>("basic");

  /* prefill from WebAppKinds modal */
  useEffect(() => {
    const handler = (e: Event) => {
      const k = (e as CustomEvent<{ kind: AppKind }>).detail?.kind;
      if (k) setKind(k);
    };
    window.addEventListener("webapp-calc-prefill", handler);
    return () => window.removeEventListener("webapp-calc-prefill", handler);
  }, []);

  /* localStorage */
  useEffect(() => {
    try {
      const raw = localStorage.getItem("webapp_calc_v2");
      if (!raw) return;
      const s = JSON.parse(raw);
      setKind(s.kind ?? "client"); setScope(s.scope ?? 10);
      setDesign(s.design ?? "pro"); setSpeed(s.speed ?? "normal");
      setRbac(!!s.rbac); setSso(!!s.sso); setAudit(!!s.audit);
      setNotifications(!!s.notifications); setRealtime(!!s.realtime);
      setQueues(!!s.queues); setStorage(!!s.storage); setExtIntegr(!!s.extIntegr);
      setPayments(!!s.payments); setSubscriptions(!!s.subscriptions);
      setReports(!!s.reports); setI18n(!!s.i18n);
      setHosting(s.hosting ?? "cloud"); setUseDB(s.useDB ?? true);
      setUseCache(s.useCache ?? true); setUseObserv(s.useObserv ?? true);
      setUseCI(s.useCI ?? true); setSupport(s.support ?? "basic");
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("webapp_calc_v2", JSON.stringify({
        kind, scope, design, speed, rbac, sso, audit, notifications, realtime,
        queues, storage, extIntegr, payments, subscriptions, reports, i18n,
        hosting, useDB, useCache, useObserv, useCI, support,
      }));
    } catch {}
  }, [kind, scope, design, speed, rbac, sso, audit, notifications, realtime,
    queues, storage, extIntegr, payments, subscriptions, reports, i18n,
    hosting, useDB, useCache, useObserv, useCI, support]);

  /* Calculation */
  const result = useMemo(() => {
    const base = PRICING.base[kind];
    const scopeCost = clamp(scope - PRICING.scope.included, 0, 500) * PRICING.scope.perUnit;
    const designK = PRICING.design[design];
    let features = 0;
    features += rbac ? PRICING.features.rbac : 0;
    features += sso ? PRICING.features.sso : 0;
    features += audit ? PRICING.features.audit : 0;
    features += notifications ? PRICING.features.notifications : 0;
    features += realtime ? PRICING.features.realtime : 0;
    features += queues ? PRICING.features.queues : 0;
    features += storage ? PRICING.features.storage : 0;
    features += extIntegr ? PRICING.features.extIntegr : 0;
    features += payments ? PRICING.features.payments : 0;
    features += subscriptions ? PRICING.features.subscriptions : 0;
    features += reports ? PRICING.features.reports : 0;
    features += i18n ? PRICING.features.i18n : 0;
    const infraSetup =
      PRICING.infra.hosting[hosting].setup +
      (useDB ? PRICING.infra.db.setup : 0) +
      (useCache ? PRICING.infra.cache.setup : 0) +
      (useObserv ? PRICING.infra.observ.setup : 0) +
      (useCI ? PRICING.infra.ci.setup : 0) +
      PRICING.infra.domains.setup;
    const infraMonthly =
      PRICING.infra.hosting[hosting].monthly +
      (useDB ? PRICING.infra.db.monthly : 0) +
      (useCache ? PRICING.infra.cache.monthly : 0) +
      (useObserv ? PRICING.infra.observ.monthly : 0) +
      (useCI ? PRICING.infra.ci.monthly : 0) +
      PRICING.infra.domains.monthly +
      PRICING.support[support];
    let discountK = 1;
    if (kind === "saas" && payments && subscriptions) discountK *= PRICING.discounts.saasBilling;
    if (kind === "analytics" && reports && realtime)  discountK *= PRICING.discounts.analyticsPack;
    const speedK = PRICING.speedMultiplier[speed];
    const oneOff = Math.round(((base + scopeCost) * designK + features + infraSetup) * speedK * discountK);
    return { breakdown: { base, scopeCost, designK, features, infraSetup, discountK, speedK }, oneOff, monthly: infraMonthly, discountApplied: discountK !== 1 };
  }, [kind, scope, design, speed, rbac, sso, audit, notifications, realtime, queues, storage, extIntegr, payments, subscriptions, reports, i18n, hosting, useDB, useCache, useObserv, useCI, support]);

  const selectedModules = [
    rbac && (isEn ? "Roles" : "Роли"), sso && "SSO", audit && (isEn ? "Audit" : "Аудит"),
    notifications && (isEn ? "Notify" : "Уведомл."),
    realtime && "Realtime", queues && (isEn ? "Queues" : "Очереди"),
    storage && (isEn ? "Files" : "Файлы"), extIntegr && (isEn ? "Integrations" : "Интеграции"),
    payments && (isEn ? "Payments" : "Платежи"), subscriptions && (isEn ? "Subscriptions" : "Подписки"),
    reports && (isEn ? "Reports" : "Отчёты"), i18n && "i18n",
  ].filter(Boolean) as string[];

  const goToContact = () => {
    setQuote?.({
      source: "webapp-calculator",
      createdAt: new Date().toISOString(),
      kind, scope, design, speed, hosting, support,
      oneOff: result.oneOff, monthly: result.monthly,
      modules: { rbac, sso, audit, notifications, realtime, queues, storage, extIntegr, payments, subscriptions, reports, i18n },
      infra: { useDB, useCache, useObserv, useCI },
      breakdown: {
        base: result.breakdown.base, scopeCost: result.breakdown.scopeCost,
        designK: `x${result.breakdown.designK}`, features: result.breakdown.features,
        infraSetup: result.breakdown.infraSetup, discountK: `x${result.breakdown.discountK}`,
        speedK: `x${result.breakdown.speedK}`,
      },
    });
    router.push("#contact");
  };

  const jsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Калькулятор стоимости разработки ${mapKind(kind, false).toLowerCase()}`,
    provider: { "@type": "Organization", name: "OneStack", url: siteUrl },
    offers: [
      { "@type": "Offer", priceCurrency: "RUB", price: result.oneOff,  category: "Разработка"   },
      { "@type": "Offer", priceCurrency: "RUB", price: result.monthly, category: "Обслуживание" },
    ],
  }), [kind, result.oneOff, result.monthly]);

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
      <Script id="ld-webapp-calc" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section
        id="calculator"
        aria-labelledby={titleId}
        style={{ background: BG, borderTop: "1px solid rgba(255,255,255,0.06)", position: "relative", overflow: "hidden" }}
      >
        {/* Ambient glow */}
        <div aria-hidden style={{
          pointerEvents: "none", position: "absolute", bottom: -160, left: -160,
          width: 500, height: 500, borderRadius: "50%",
          background: TEAL, opacity: 0.06, filter: "blur(160px)",
        }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: isMobile ? "0 20px" : "0 40px", position: "relative", zIndex: 1 }}>

          {/* ── Header ── */}
          <motion.div {...(fadeUp(0) as object)} style={{ padding: isMobile ? "72px 0 48px" : "110px 0 72px" }}>
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
              <span style={{ display: "block", fontSize: "clamp(2.4rem, 6vw, 6rem)", color: "transparent", WebkitTextStroke: `1.5px ${TEAL}` }}>
                {isEn ? "Cost estimate" : "Расчёт стоимости"}
              </span>
              <span style={{ display: "block", fontSize: "clamp(2.4rem, 6vw, 6rem)", color: WHITE }}>
                {isEn ? "for your application" : "вашего приложения"}
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
              style={{ borderRight: isMobile ? "none" : "1px solid rgba(255,255,255,0.06)", paddingRight: isMobile ? 0 : 40 }}
            >

              {/* 01 App type */}
              <div style={{ paddingTop: 36, paddingBottom: 36 }}>
                <FigLabel num="01" label={isEn ? "App type" : "Тип приложения"} />
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)", gap: 8 }}>
                  {(isEn ? [
                    ["client",    "User portal",   "Client service"],
                    ["crm",       "CRM system",    "Sales & clients"],
                    ["portal",    "Corp. portal",  "Employees & HR"],
                    ["analytics", "Analytics",     "BI & dashboards"],
                    ["b2b",       "B2B platform",  "Wholesale sales"],
                    ["saas",      "SaaS service",  "Subscriptions"],
                  ] : [
                    ["client",    "Личный кабинет", "Клиентский сервис"],
                    ["crm",       "CRM система",    "Продажи и клиенты"],
                    ["portal",    "Корп. портал",   "Сотрудники и HR"],
                    ["analytics", "Аналитика",      "BI и дашборды"],
                    ["b2b",       "B2B платформа",  "Оптовые продажи"],
                    ["saas",      "SaaS сервис",    "Подписки и SaaS"],
                  ] as [AppKind, string, string][]).map(([k, t, d]) => (
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
                      {(isEn
                        ? [["basic","Basic","Standard"],["pro","Pro","Custom UX"],["brand","Premium","Exclusive"]]
                        : [["basic","Базовый","Стандартный"],["pro","Pro","Кастомный UX"],["brand","Премиум","Эксклюзивный"]] as [DesignLevel,string,string][]).map(([k,t,d]) => (
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
                  <ToggleSect label={isEn ? "Security & access" : "Безопасность и доступ"}>
                    <CalcToggle label={isEn ? "Roles & access" : "Роли и доступы"}  value={rbac}   onChange={setRbac}   desc="RBAC" />
                    <CalcToggle label={isEn ? "Single sign-on" : "Единый вход SSO"} value={sso}    onChange={setSso}    desc="OAuth/SAML" />
                    <CalcToggle label={isEn ? "Audit log" : "Аудит действий"}        value={audit}  onChange={setAudit}  desc={isEn ? "Event log" : "Журнал"} />
                  </ToggleSect>
                  <ToggleSect label={isEn ? "Communications" : "Коммуникации"}>
                    <CalcToggle label={isEn ? "Notifications" : "Уведомления"}      value={notifications} onChange={setNotifications} desc="Email, Push, SMS" />
                    <CalcToggle label="Realtime"                                     value={realtime}      onChange={setRealtime}      desc="WebSocket" />
                    <CalcToggle label={isEn ? "Task queues" : "Фоновые задачи"}     value={queues}        onChange={setQueues}        desc={isEn ? "Message queues" : "Очереди"} />
                  </ToggleSect>
                  <ToggleSect label={isEn ? "Data & integrations" : "Данные и интеграции"}>
                    <CalcToggle label={isEn ? "File storage" : "Файловое хранилище"} value={storage}       onChange={setStorage}       desc="S3" />
                    <CalcToggle label={isEn ? "Integrations" : "Внешние интеграции"} value={extIntegr}     onChange={setExtIntegr}     desc="API, 1С, CRM" />
                    <CalcToggle label={isEn ? "Reports" : "Аналитика и отчёты"}      value={reports}       onChange={setReports}       desc={isEn ? "Dashboards" : "Дашборды"} />
                    <CalcToggle label={isEn ? "Payments" : "Платёжные системы"}       value={payments}      onChange={setPayments}      desc={isEn ? "YooKassa, Stripe" : "ЮKassa, Stripe"} />
                    <CalcToggle label={isEn ? "Subscriptions" : "Подписки / биллинг"} value={subscriptions} onChange={setSubscriptions} desc={isEn ? "Recurring billing" : "Регулярные платежи"} />
                    <CalcToggle label={isEn ? "Multilanguage" : "Мультиязычность"}    value={i18n}          onChange={setI18n}          desc="EN / RU" />
                  </ToggleSect>
                </div>
              </div>

              {/* 04 Infrastructure */}
              <div style={{ ...sectionRow, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <FigLabel num="04" label={isEn ? "Infrastructure" : "Инфраструктура"} />
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: isMobile ? 16 : 20 }}>
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
                    <SubLabel label={isEn ? "Services" : "Сервисы"} />
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                      <CalcToggle label="Database" value={useDB}     onChange={setUseDB}     desc="PostgreSQL" />
                      <CalcToggle label="Cache"    value={useCache}   onChange={setUseCache}  desc="Redis" />
                      <CalcToggle label={isEn ? "Monitoring" : "Мониторинг"} value={useObserv} onChange={setUseObserv} desc="Sentry/Grafana" />
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
                        ? [["normal","Standard","3–6 months"],["fast","Urgent","×1.25 cost"]]
                        : [["normal","Стандарт","3–6 месяцев"],["fast","Срочно","×1.25 цена"]] as [Speed,string,string][]).map(([v,t,d]) => ( // v3
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
              style={{ position: isMobile ? "static" : "sticky", top: 88, paddingTop: isMobile ? 0 : 36, paddingBottom: 36, borderTop: isMobile ? "1px solid rgba(255,255,255,0.06)" : "none", marginTop: isMobile ? 0 : 0 }}
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
                      ["Hosting", hosting === "cloud" ? "Cloud" : hosting === "vps" ? "VPS" : "Own"],
                      ["Support", support === "none" ? "None" : support === "basic" ? "Basic" : "Pro"],
                    ] : [
                      ["Тип",       mapKind(kind, false)],
                      ["Дизайн",    mapDesign(design, false)],
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
                    [isEn ? "Base" : "База",                     fmt(result.breakdown.base)],
                    [isEn ? "Extra modules" : "Доп. модули",     fmt(result.breakdown.scopeCost)],
                    [isEn ? "Design" : "Дизайн",                 `×${result.breakdown.designK.toFixed(2)}`],
                    [isEn ? "Features" : "Функционал",           fmt(result.breakdown.features)],
                    [isEn ? "Infrastructure" : "Инфраструктура", fmt(result.breakdown.infraSetup)],
                    ...(result.breakdown.discountK !== 1 ? [[isEn ? "Discount" : "Скидка", `-${Math.round((1 - result.breakdown.discountK) * 100)}%`]] : []),
                    ...(result.breakdown.speedK !== 1 ? [[isEn ? "Urgency" : "Срочность", `×${result.breakdown.speedK.toFixed(2)}`]] : []),
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
                      <CountUp value={result.oneOff} /> ₽
                    </div>
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <Server size={12} style={{ color: "rgba(244,250,248,0.35)" }} />
                      <span style={{ fontSize: 12, color: "rgba(244,250,248,0.45)" }}>{isEn ? "Monthly (hosting + support)" : "Ежемесячно (хостинг + поддержка)"}</span>
                    </div>
                    <div className={serif.className} style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)", color: WHITE, lineHeight: 1 }}>
                      <CountUp value={result.monthly} /> ₽
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div style={{ padding: "16px 18px 18px" }}>
                  <button onClick={goToContact}
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

          <div style={{ height: 110 }} />
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
