"use client";
import { serif } from "@/lib/fonts";

import React, { useRef, useState, useMemo, useId, useCallback, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useQuote } from "@/app/context/QuoteContext";
import { useI18n } from "@/i18n/I18nProvider";
import {
  Globe, Layers, Smartphone, Lock, CreditCard, BarChart3,
  Bell, Search, MessageSquare, Files, Settings2, PanelsTopLeft,
  Languages, Database, Undo2, Shield, Zap, ArrowRight,
} from "lucide-react";

/* ─── Copy ───────────────────────────────────────────────────────────────── */
const COPY = {
  ru: {
    eyebrow: "Калькулятор стоимости",
    titleLine1: "Рассчитай",
    titleLine2: "стоимость проекта",
    description: "Оцените бюджет за 2 минуты. Выберите тип проекта, настройте параметры — получите ориентировочную смету.",
    types: { site: "Сайт", webapp: "Веб-приложение", mobile: "Мобильное" },
    typesShort: { site: "Сайт", webapp: "Веб", mobile: "Моб" },
    step1: "Тип проекта",
    step2: "Количество страниц / экранов",
    step3: "Сложность проекта",
    step4: "Дополнительные модули",
    pagesLabel: "Страницы",
    screensLabel: "Экраны",
    unitPcs: "шт",
    integrationsLabel: "Интеграции с API",
    complexity: { 1: "Базовая", 2: "Стандарт", 3: "Сложная" },
    modules: {
      auth: "Авторизация / RBAC", payments: "Платежи", analytics: "Аналитика",
      notifications: "Пуш-уведомления", search: "Поиск", chat: "Чат / Коммуникации",
      files: "Файлы / Медиа", admin: "Админ-панель", i18n: "Мультиязык",
      cms: "CMS / Контент", db: "Миграции БД",
    },
    budgetLabel: "Ориентировочный бюджет",
    hours: "трудозатраты",
    weeksNormal: "сроки",
    weeksRush: "сроки (срочно)",
    hUnit: "ч",
    wUnit: "нед",
    estLabel: "Сроки реализации",
    timelineNormal: "Стандартные",
    timelineRush: "Срочно",
    devLabel: "Развёртывание",
    deploy: { cloud: "Облачный хостинг", onprem: "On-premise", none: "Только разработка" },
    slaLabel: "Техническая поддержка",
    slaPlans: { lite: "Lite", pro: "Pro", enterprise: "Enterprise" },
    supportCaption: "стоимость поддержки",
    perMonth: "мес",
    ctaDiscuss: "Обсудить проект",
    msg: {
      title: "📋 Результаты калькулятора OneStack",
      type: "Тип проекта",
      complexity: "Сложность",
      pages: "Страниц/экранов",
      integrations: "Интеграции с API",
      modules: "Модули",
      deploy: "Развёртывание",
      timeline: "Сроки",
      budget: "💰 Ориентировочный бюджет",
      hours: "⏱ Трудозатраты",
      support: "🔧 Поддержка",
      pcs: "шт",
      weeks: "нед",
      noSupport: "Без поддержки",
    },
  },
  en: {
    eyebrow: "Cost calculator",
    titleLine1: "Calculate",
    titleLine2: "your project cost",
    description: "Estimate your budget in 2 minutes. Pick a project type, tune the parameters — get a ballpark quote.",
    types: { site: "Website", webapp: "Web app", mobile: "Mobile" },
    typesShort: { site: "Site", webapp: "Web", mobile: "Mob" },
    step1: "Project type",
    step2: "Number of pages / screens",
    step3: "Project complexity",
    step4: "Additional modules",
    pagesLabel: "Pages",
    screensLabel: "Screens",
    unitPcs: "",
    integrationsLabel: "API integrations",
    complexity: { 1: "Basic", 2: "Standard", 3: "Complex" },
    modules: {
      auth: "Auth / RBAC", payments: "Payments", analytics: "Analytics",
      notifications: "Push notifications", search: "Search", chat: "Chat / Messaging",
      files: "Files / Media", admin: "Admin panel", i18n: "Multi-language",
      cms: "CMS / Content", db: "DB migrations",
    },
    budgetLabel: "Estimated budget",
    hours: "effort",
    weeksNormal: "timeline",
    weeksRush: "timeline (rush)",
    hUnit: "h",
    wUnit: "wk",
    estLabel: "Delivery timeline",
    timelineNormal: "Standard",
    timelineRush: "Rush",
    devLabel: "Deployment",
    deploy: { cloud: "Cloud hosting", onprem: "On-premise", none: "Development only" },
    slaLabel: "Technical support",
    slaPlans: { lite: "Lite", pro: "Pro", enterprise: "Enterprise" },
    supportCaption: "support cost",
    perMonth: "mo",
    ctaDiscuss: "Discuss project",
    msg: {
      title: "📋 OneStack calculator results",
      type: "Project type",
      complexity: "Complexity",
      pages: "Pages/screens",
      integrations: "API integrations",
      modules: "Modules",
      deploy: "Deployment",
      timeline: "Timeline",
      budget: "💰 Estimated budget",
      hours: "⏱ Effort",
      support: "🔧 Support",
      pcs: "",
      weeks: "wk",
      noSupport: "No support",
    },
  },
} as const;


const BG    = "#07100e";
const TEAL  = "#2dd4bf";
const WHITE = "#f4faf8";
const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

/* ─── Types & Constants ─────────────────────────────────────────────────── */
type ProjectType = "site" | "webapp" | "mobile";
type Timeline    = "normal" | "rush";
type Deploy      = "none" | "cloud" | "onprem";
type HourlyMode  = "budget" | "standard" | "premium" | "custom";
type SLAPlan     = "none" | "lite" | "pro" | "enterprise";

const BASE_HOURS: Record<ProjectType, number> = { site: 80, webapp: 160, mobile: 180 };
const PAGE_HOURS: Record<ProjectType, number> = { site: 10, webapp: 16,  mobile: 18  };
const INTEGRATION_HOURS = 20;
const COMPLEXITY_K = { 1: 0.9, 2: 1.0, 3: 1.25 } as const;
const RUSH_MULTIPLIER = 1.35;
const CONTINGENCY = 0.12;
const DEPLOY_HOURS: Record<Deploy, number> = { none: 0, cloud: 24, onprem: 48 };

const MODULES = [
  { key: "auth",          hours: 24, icon: Lock          },
  { key: "payments",      hours: 28, icon: CreditCard     },
  { key: "analytics",     hours: 12, icon: BarChart3      },
  { key: "notifications", hours: 14, icon: Bell           },
  { key: "search",        hours: 16, icon: Search         },
  { key: "chat",          hours: 20, icon: MessageSquare  },
  { key: "files",         hours: 18, icon: Files          },
  { key: "admin",         hours: 26, icon: PanelsTopLeft  },
  { key: "i18n",          hours: 12, icon: Languages      },
  { key: "cms",           hours: 22, icon: Settings2      },
  { key: "db",            hours: 12, icon: Database       },
] as const;

type ModuleKey = (typeof MODULES)[number]["key"];

const SLA_HOURS: Record<SLAPlan, number>    = { none: 0,    lite: 10,   pro: 20,  enterprise: 40  };
const SLA_DISCOUNT: Record<SLAPlan, number> = { none: 1,    lite: 0.95, pro: 0.9, enterprise: 0.85 };
const SUPPORT_MIN = 50000;

/* ─── Shared styles ─────────────────────────────────────────────────────── */
const card = { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" };
const cardActive = { background: "rgba(45,212,191,0.08)", border: `1px solid ${TEAL}` };
const btnTeal = { background: TEAL, color: BG };

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
export default function HomeCalculator() {
  const { locale } = useI18n();
  const lang = locale === "ru" ? "ru" : "en";
  const c = COPY[lang];
  const reduced  = useReducedMotion();
  const titleId  = useId();
  const _ref     = useRef<HTMLElement | null>(null);

  /* state */
  const [selected, setSelected]       = useState<Record<ProjectType, boolean>>({ site: true, webapp: false, mobile: false });
  const [pages, setPages]             = useState<Record<ProjectType, number>>({ site: 6, webapp: 6, mobile: 6 });
  const [complexity, setComplexity]   = useState<Record<ProjectType, 1|2|3>>({ site: 2, webapp: 2, mobile: 2 });
  const [integrations, setIntegrations] = useState(1);
  const [timeline, setTimeline]       = useState<Timeline>("normal");
  const [maintenance, setMaintenance] = useState(true);
  const [sla, setSla]                 = useState<SLAPlan>("pro");
  const [deploy, setDeploy]           = useState<Deploy>("cloud");
  const [mods, setMods]               = useState<Record<ModuleKey, boolean>>({
    auth: true, payments: false, analytics: true, notifications: false,
    search: false, chat: false, files: false, admin: true,
    i18n: false, cms: false, db: false,
  });
  const [hourlyMode]                  = useState<HourlyMode>("premium");
  const [hourlyCustom]                = useState<number>(4500);

  /* calc */
  const hourly = useMemo(() => {
    switch (hourlyMode) {
      case "budget":   return 1200;
      case "standard": return 2500;
      case "premium":  return 4500;
      case "custom":   return Math.max(500, Math.min(30000, Number.isFinite(hourlyCustom) ? hourlyCustom : 4500));
    }
  }, [hourlyMode, hourlyCustom]);

  const estimate = useMemo(() => {
    const activeTypes = (Object.keys(selected) as ProjectType[]).filter(t => selected[t]);
    const safe = activeTypes.length ? activeTypes : (["site"] as ProjectType[]);
    let hours = 0;
    for (const t of safe) hours += BASE_HOURS[t] * COMPLEXITY_K[complexity[t]] + pages[t] * PAGE_HOURS[t];
    hours += integrations * INTEGRATION_HOURS;
    for (const m of MODULES) if (mods[m.key]) hours += m.hours;
    hours += 40; // design
    hours += DEPLOY_HOURS[deploy];
    hours *= 1 + CONTINGENCY;
    const rushK = timeline === "rush" ? RUSH_MULTIPLIER : 1;
    const cost  = Math.round(hours * hourly * rushK);
    const low   = Math.round(cost * 0.88);
    const high  = Math.round(cost * 1.12);
    let support = 0;
    if (maintenance) {
      support = sla !== "none"
        ? Math.max(SUPPORT_MIN, Math.round(hourly * SLA_HOURS[sla] * SLA_DISCOUNT[sla]))
        : Math.max(SUPPORT_MIN, Math.round(cost * 0.1));
    }
    return { hours: Math.round(hours), cost, low, high, support, typesSafe: safe };
  }, [selected, pages, complexity, integrations, mods, deploy, timeline, hourly, maintenance, sla]);

  const { setQuote } = useQuote();

  const handleCTA = useCallback(() => {
    const activeTypes = (Object.keys(selected) as ProjectType[]).filter(t => selected[t]);
    const deployLabel = c.deploy[deploy];
    const timelineLabel = timeline === "rush" ? `${c.timelineRush} (×${RUSH_MULTIPLIER})` : `${c.timelineNormal}`;
    const weeks = Math.ceil(estimate.hours / 40 / (timeline === "rush" ? RUSH_MULTIPLIER : 1));
    const activeModuleLabels = MODULES.filter(m => mods[m.key]).map(m => c.modules[m.key]);
    const slaLabel = sla !== "none" ? c.slaPlans[sla] : c.msg.noSupport;

    const typeNames = activeTypes.map(t => c.types[t]).join(", ");
    const complexityNames = [...new Set(activeTypes.map(t => c.complexity[complexity[t]]))].join(", ");
    const numLocale = lang === "ru" ? "ru-RU" : "en-US";

    const msgLines = [
      c.msg.title,
      ``,
      `${c.msg.type}: ${typeNames}`,
      `${c.msg.complexity}: ${complexityNames}`,
      activeTypes.map(t => `${c.msg.pages} (${c.typesShort[t]}): ${pages[t]}`).join(", "),
      integrations > 0 ? `${c.msg.integrations}: ${integrations}` : null,
      activeModuleLabels.length ? `${c.msg.modules}: ${activeModuleLabels.join(", ")}` : null,
      `${c.msg.deploy}: ${deployLabel}`,
      `${c.msg.timeline}: ${timelineLabel} (~${weeks} ${c.msg.weeks})`,
      ``,
      `${c.msg.budget}: ${estimate.low.toLocaleString(numLocale)} — ${estimate.high.toLocaleString(numLocale)} ₽`,
      `${c.msg.hours}: ~${estimate.hours} ${c.hUnit}`,
      maintenance ? `${c.msg.support} (${slaLabel}): ~${estimate.support.toLocaleString(numLocale)} ₽/${c.perMonth}` : null,
    ].filter(Boolean).join("\n");

    // Map to budget chip
    const budgetChip =
      estimate.low < 300_000  ? "100-300"  :
      estimate.low < 700_000  ? "300-700"  :
      estimate.low < 1_500_000 ? "700-1500" : "1500+";

    // Map to timeline chip
    const timelineChip =
      weeks <= 4  ? "2-4"  :
      weeks <= 8  ? "4-8"  :
      weeks <= 12 ? "8-12" : "12+";

    // Map kinds
    const kinds = activeTypes.map(t =>
      t === "site" ? "site" : t === "webapp" ? "webapp" : "mobile"
    );

    setQuote({
      source: "home-calculator",
      createdAt: new Date().toISOString(),
      selectedTypes: activeTypes,
      complexityMap: complexity,
      pagesMap: pages,
      integrations,
      activeModules: activeModuleLabels,
      deploy,
      timeline,
      maintenance,
      sla,
      oneOff: estimate.cost,
      monthly: maintenance ? estimate.support : 0,
      breakdown: { low: estimate.low, high: estimate.high, hours: estimate.hours },
      // Pre-fill hints for contact form
      _contactKinds: kinds,
      _contactBudget: budgetChip,
      _contactTimeline: timelineChip,
      _contactMessage: msgLines,
    });

    // Navigate to contact section
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  }, [selected, pages, complexity, integrations, mods, deploy, timeline, maintenance, sla, estimate, setQuote]);

  const fadeUp = (d = 0) => reduced ? {} : {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: [0.22,1,0.36,1], delay: d },
  };

  const reset = () => {
    setSelected({ site: true, webapp: false, mobile: false });
    setPages({ site: 6, webapp: 6, mobile: 6 });
    setComplexity({ site: 2, webapp: 2, mobile: 2 });
    setIntegrations(1);
    setMaintenance(true);
    setSla("pro");
    setDeploy("cloud");
    setMods({ auth: true, payments: false, analytics: true, notifications: false,
      search: false, chat: false, files: false, admin: true, i18n: false, cms: false, db: false });
  };

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section ref={_ref} id="calculator" aria-labelledby={titleId}
      style={{ background: BG, borderTop: "1px solid rgba(255,255,255,0.06)", position: "relative", overflow: "hidden" }}>

      {/* Grain */}
      <div aria-hidden style={{ pointerEvents: "none", position: "absolute", inset: 0, opacity: 0.025, backgroundImage: GRAIN, backgroundSize: "180px 180px" }} />
      {/* Glow */}
      <div aria-hidden style={{ pointerEvents: "none", position: "absolute", bottom: 0, right: "-15%", width: 600, height: 600, borderRadius: "50%", willChange: "transform", transform: "translateZ(0)", filter: "blur(240px)", background: TEAL, opacity: 0.06 }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto", padding: isMobile ? "0 20px" : "0 40px" }}>

        {/* Header */}
        <motion.div {...(fadeUp(0) as object)} style={{ padding: isMobile ? "72px 0 48px" : "110px 0 72px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ height: 2, width: 20, background: TEAL, borderRadius: 2, flexShrink: 0 }} />
            <span style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 500, color: TEAL }}>
              {c.eyebrow}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
            <h2 id={titleId} className={serif.className} style={{ margin: 0, fontWeight: 400, lineHeight: 0.92, letterSpacing: "-0.04em" }}>
              <span style={{ display: "block", fontSize: "clamp(2.4rem, 6vw, 6rem)", color: "transparent", WebkitTextStroke: `1.5px ${TEAL}` }}>
                {c.titleLine1}
              </span>
              <span style={{ display: "block", fontSize: "clamp(2.4rem, 6vw, 6rem)", color: WHITE }}>
                {c.titleLine2}
              </span>
            </h2>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: "rgba(244,250,248,0.4)", maxWidth: 340, textAlign: "right" }}>
              {c.description}
            </p>
          </div>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "5fr 4fr", gap: isMobile ? 32 : 56, alignItems: "start", paddingBottom: isMobile ? 72 : 110 }}>

          {/* ── LEFT: controls ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>

            {/* Project type */}
            <motion.div {...(fadeUp(0.1) as object)} style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 32, paddingBottom: 32 }}>
              <FigLabel num="01" label={c.step1} />
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr 1fr" : "repeat(3,1fr)", gap: 10, marginTop: 10 }}>
                {([
                  { key: "site",    icon: Globe       },
                  { key: "webapp",  icon: Layers      },
                  { key: "mobile",  icon: Smartphone  },
                ] as const).map(({ key, icon: Icon }) => (
                  <button key={key}
                    onClick={() => setSelected(p => ({ ...p, [key]: !p[key] }))}
                    style={{ ...selected[key] ? cardActive : card, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8, padding: 16, borderRadius: 12, cursor: "pointer", textAlign: "left", transition: "all 0.2s", background: selected[key] ? "rgba(45,212,191,0.08)" : "rgba(255,255,255,0.03)" }}>
                    <Icon size={15} style={{ color: selected[key] ? TEAL : "rgba(244,250,248,0.3)" }} />
                    <span style={{ fontSize: 12, fontWeight: 500, color: selected[key] ? WHITE : "rgba(244,250,248,0.45)" }}>
                      {c.types[key]}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Pages sliders */}
            <motion.div {...(fadeUp(0.15) as object)} style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 32, paddingBottom: 32 }}>
              <FigLabel num="02" label={c.step2} />
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 20 }}>
                {(Object.keys(selected) as ProjectType[]).filter(t => selected[t]).map(type => (
                  <div key={type}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 12, color: "rgba(244,250,248,0.4)" }}>
                        {type === "site" ? c.pagesLabel : c.screensLabel} — {c.types[type]}
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 500, color: TEAL }}>{pages[type]} {c.unitPcs}</span>
                    </div>
                    <input type="range" min={1} max={30} value={pages[type]}
                      onChange={e => setPages(p => ({ ...p, [type]: +e.target.value }))}
                      style={{ width: "100%", height: 2, appearance: "none", borderRadius: 99, cursor: "pointer", accentColor: TEAL, background: `linear-gradient(to right, ${TEAL} ${(pages[type]/30)*100}%, rgba(255,255,255,0.1) 0%)` }} />
                  </div>
                ))}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: "rgba(244,250,248,0.4)" }}>{c.integrationsLabel}</span>
                    <span style={{ fontSize: 12, fontWeight: 500, color: TEAL }}>{integrations} {c.unitPcs}</span>
                  </div>
                  <input type="range" min={0} max={10} value={integrations}
                    onChange={e => setIntegrations(+e.target.value)}
                    style={{ width: "100%", height: 2, appearance: "none", borderRadius: 99, cursor: "pointer", accentColor: TEAL, background: `linear-gradient(to right, ${TEAL} ${(integrations/10)*100}%, rgba(255,255,255,0.1) 0%)` }} />
                </div>
              </div>
            </motion.div>

            {/* Complexity */}
            <motion.div {...(fadeUp(0.2) as object)} style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 32, paddingBottom: 32 }}>
              <FigLabel num="03" label={c.step3} />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginTop: 10 }}>
                {([1,2,3] as const).map(level => {
                  const activeTypes = (Object.keys(selected) as ProjectType[]).filter(t => selected[t]);
                  const isActive = activeTypes.length > 0 ? activeTypes.every(t => complexity[t] === level) : false;
                  return (
                    <button key={level}
                      onClick={() => {
                        const next = { ...complexity };
                        activeTypes.forEach(t => { next[t] = level; });
                        setComplexity(next);
                      }}
                      style={{ ...isActive ? cardActive : card, padding: "10px 12px", borderRadius: 10, cursor: "pointer", fontSize: 12, fontWeight: 500, transition: "all 0.2s", color: isActive ? TEAL : "rgba(244,250,248,0.45)" }}>
                      {c.complexity[level]}
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Modules */}
            <motion.div {...(fadeUp(0.25) as object)} style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 32, paddingBottom: 32 }}>
              <FigLabel num="04" label={c.step4} />
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(3,1fr)", gap: 8 }}>
                {MODULES.map(m => (
                  <button key={m.key}
                    onClick={() => setMods(p => ({ ...p, [m.key]: !p[m.key] }))}
                    style={{ ...mods[m.key] ? cardActive : card, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6, padding: isMobile ? "10px 10px" : 12, borderRadius: 10, cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
                      <m.icon size={13} style={{ color: mods[m.key] ? TEAL : "rgba(244,250,248,0.25)", flexShrink: 0 }} />
                      <span style={{ fontSize: isMobile ? 10 : 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: mods[m.key] ? WHITE : "rgba(244,250,248,0.4)" }}>
                        {c.modules[m.key]}
                      </span>
                    </div>
                    <span style={{ fontSize: 9, flexShrink: 0, color: "rgba(244,250,248,0.2)" }}>+{m.hours}{c.hUnit}</span>
                  </button>
                ))}
              </div>
            </motion.div>

          </div>

          {/* ── RIGHT: result panel ── */}
          <motion.div {...(fadeUp(0.15) as object)} style={{ position: isMobile ? "static" : "sticky", top: 32, display: "flex", flexDirection: "column", gap: 12, borderTop: isMobile ? "1px solid rgba(255,255,255,0.06)" : "none", paddingTop: isMobile ? 32 : 0 }}>

            {/* Main result */}
            <div style={{ borderRadius: 14, padding: "24px 28px", background: "rgba(45,212,191,0.06)", border: `1px solid rgba(45,212,191,0.18)` }}>
              <p style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16, color: "rgba(244,250,248,0.3)" }}>
                {c.budgetLabel}
              </p>
              <p className={serif.className} style={{ fontSize: "clamp(1.6rem,4vw,2.4rem)", fontWeight: 400, lineHeight: 1.1, letterSpacing: "-0.02em", color: WHITE, marginBottom: 4 }}>
                {estimate.low.toLocaleString(lang === "ru" ? "ru-RU" : "en-US")} —<br />
                {estimate.high.toLocaleString(lang === "ru" ? "ru-RU" : "en-US")} ₽
              </p>
              <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { val: `${estimate.hours} ${c.hUnit}`, label: c.hours },
                  { val: `${Math.ceil(estimate.hours / 40 / (timeline === "rush" ? RUSH_MULTIPLIER : 1))} ${c.wUnit}`, label: timeline === "rush" ? c.weeksRush : c.weeksNormal },
                ].map(item => (
                  <div key={item.label} style={{ borderRadius: 10, padding: "12px", textAlign: "center", background: "rgba(255,255,255,0.04)" }}>
                    <p className={serif.className} style={{ fontSize: "1.2rem", color: WHITE }}>{item.val}</p>
                    <p style={{ fontSize: 10, marginTop: 2, color: "rgba(244,250,248,0.35)" }}>{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div style={{ borderRadius: 14, padding: 20, ...card }}>
              <FigLabel num="EST" label={c.estLabel} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
                {([
                  { val: "normal", label: c.timelineNormal },
                  { val: "rush",   label: `${c.timelineRush} ×${RUSH_MULTIPLIER}` },
                ] as const).map(opt => (
                  <button key={opt.val} onClick={() => setTimeline(opt.val)}
                    style={{ ...timeline === opt.val ? cardActive : card, padding: "10px 12px", borderRadius: 10, cursor: "pointer", fontSize: 12, fontWeight: 500, transition: "all 0.2s", color: timeline === opt.val ? TEAL : "rgba(244,250,248,0.45)" }}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Deployment */}
            <div style={{ borderRadius: 14, padding: 20, ...card }}>
              <FigLabel num="DEV" label={c.devLabel} />
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
                {(["cloud", "onprem", "none"] as const).map(opt => (
                  <button key={opt} onClick={() => setDeploy(opt)}
                    style={{ ...deploy === opt ? cardActive : card, width: "100%", padding: "10px 16px", borderRadius: 10, cursor: "pointer", fontSize: 12, fontWeight: 500, textAlign: "left", transition: "all 0.2s", color: deploy === opt ? TEAL : "rgba(244,250,248,0.45)" }}>
                    {c.deploy[opt]}
                  </button>
                ))}
              </div>
            </div>

            {/* Support */}
            <div style={{ borderRadius: 14, padding: 20, ...card }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <FigLabel num="SLA" label={c.slaLabel} />
                <button onClick={() => setMaintenance(m => !m)}
                  style={{ position: "relative", display: "inline-flex", width: 36, height: 20, alignItems: "center", borderRadius: 99, border: "none", cursor: "pointer", transition: "background 0.3s", background: maintenance ? TEAL : "rgba(255,255,255,0.1)" }}>
                  <span style={{ display: "inline-block", width: 14, height: 14, borderRadius: "50%", background: BG, transition: "transform 0.3s", transform: maintenance ? "translateX(18px)" : "translateX(2px)" }} />
                </button>
              </div>
              {maintenance && (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                    {(["lite","pro","enterprise"] as const).map(plan => (
                      <button key={plan} onClick={() => setSla(plan)}
                        style={{ ...sla === plan ? cardActive : card, padding: "8px", borderRadius: 10, cursor: "pointer", fontSize: 11, fontWeight: 500, textAlign: "center", transition: "all 0.2s", color: sla === plan ? TEAL : "rgba(244,250,248,0.45)" }}>
                        {c.slaPlans[plan]}
                      </button>
                    ))}
                  </div>
                  <div style={{ marginTop: 12, textAlign: "center", borderRadius: 10, padding: "12px", background: "rgba(255,255,255,0.03)" }}>
                    <p className={serif.className} style={{ fontSize: "1.2rem", color: TEAL }}>
                      {estimate.support.toLocaleString(lang === "ru" ? "ru-RU" : "en-US")} ₽/{c.perMonth}
                    </p>
                    <p style={{ fontSize: 10, marginTop: 2, color: "rgba(244,250,248,0.3)" }}>{c.supportCaption}</p>
                  </div>
                </>
              )}
            </div>

            {/* CTA */}
            <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
              <button onClick={handleCTA}
                style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px 20px", borderRadius: 99, fontSize: 14, fontWeight: 600, cursor: "pointer", border: "none", transition: "opacity 0.2s", ...btnTeal }}>
                {c.ctaDiscuss}
                <ArrowRight size={15} />
              </button>
              <button onClick={reset}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "14px 16px", borderRadius: 99, cursor: "pointer", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "rgba(244,250,248,0.4)", transition: "all 0.2s" }}>
                <Undo2 size={15} />
              </button>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── Sub-components ─────────────────────────────────────────────────────── */
function FigLabel({ num, label }: { num: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <span style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(244,250,248,0.25)", letterSpacing: "0.05em", flexShrink: 0 }}>{num}</span>
      <span style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 500, color: "rgba(244,250,248,0.35)" }}>{label}</span>
    </div>
  );
}

function SectionLabel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <p style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 500, marginBottom: 8, color: "rgba(244,250,248,0.28)", ...style }}>
      {children}
    </p>
  );
}
