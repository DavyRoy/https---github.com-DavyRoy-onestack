"use client";
import { serif } from "@/lib/fonts";

import React, { useRef, useState, useMemo, useId, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useQuote } from "@/app/context/QuoteContext";
import { useI18n } from "@/i18n/I18nProvider";
import { useMoney } from "@/lib/useMoney";
import {
  Globe, Layers, Smartphone, Lock, CreditCard, BarChart3,
  Bell, Search, MessageSquare, Files, Settings2, PanelsTopLeft,
  Languages, Database, Undo2, ArrowUpRight,
} from "lucide-react";

/* ─── Copy ───────────────────────────────────────────────────────────────── */
const COPY = {
  ru: {
    eyebrow: "03 / Калькулятор",
    titleLine1: "Рассчитайте",
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
    eyebrow: "03 / Calculator",
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

/* ─── Types & Constants ─────────────────────────────────────────────────── */
type ProjectType = "site" | "webapp" | "mobile";
type Timeline    = "normal" | "rush";
type Deploy      = "none" | "cloud" | "onprem";
type HourlyMode  = "budget" | "standard" | "premium" | "custom";
type SLAPlan     = "none" | "lite" | "pro" | "enterprise";

/* Трудозатраты калиброваны по калькулятору на /sites: раньше эта модель
   давала за ту же задачу в 2.6–4.4 раза больше, потому что у неё был высокий
   «пол» — лендинг из одной страницы получал 164 часа за счёт базы, фикса на
   дизайн и развёртывания. */
const BASE_HOURS: Record<ProjectType, number> = { site: 28, webapp: 70, mobile: 85 };
const PAGE_HOURS: Record<ProjectType, number> = { site: 5,  webapp: 9,  mobile: 11 };
const INTEGRATION_HOURS = 10;
const COMPLEXITY_K = { 1: 0.9, 2: 1.0, 3: 1.25 } as const;
const RUSH_MULTIPLIER = 1.35;
const CONTINGENCY = 0.12;
const DEPLOY_HOURS: Record<Deploy, number> = { none: 0, cloud: 8, onprem: 16 };
/* Часы на дизайн, добавляются к любому проекту. */
const DESIGN_HOURS = 14;

const MODULES = [
  { key: "auth",          hours: 12, icon: Lock          },
  { key: "payments",      hours: 14, icon: CreditCard     },
  { key: "analytics",     hours: 6, icon: BarChart3      },
  { key: "notifications", hours: 7, icon: Bell           },
  { key: "search",        hours: 8, icon: Search         },
  { key: "chat",          hours: 10, icon: MessageSquare  },
  { key: "files",         hours: 9, icon: Files          },
  { key: "admin",         hours: 13, icon: PanelsTopLeft  },
  { key: "i18n",          hours: 6, icon: Languages      },
  { key: "cms",           hours: 11, icon: Settings2      },
  { key: "db",            hours: 6, icon: Database       },
] as const;

type ModuleKey = (typeof MODULES)[number]["key"];

/* Часы поддержки в месяц. Тоже выровнены по /sites: там Basic стоит 18 тыс,
   Pro — 44 тыс, а здесь те же планы выходили в 52 и 99 тыс. */
const SLA_HOURS: Record<SLAPlan, number>    = { none: 0,    lite: 4,    pro: 9,   enterprise: 16  };
const SLA_DISCOUNT: Record<SLAPlan, number> = { none: 1,    lite: 0.95, pro: 0.9, enterprise: 0.85 };
const SUPPORT_MIN = 12000;

/* ─── Shared styles ─────────────────────────────────────────────────────── */
const card = { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" };
const cardActive = { background: "rgba(45,212,191,0.08)", border: `1px solid ${TEAL}` };

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
export default function HomeCalculator() {
  const { locale } = useI18n();
  const lang = locale === "ru" ? "ru" : "en";
  const c = COPY[lang];
  const { money, moneyPerMonth } = useMoney(lang);
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
  const [hourlyCustom]                = useState<number>(4400);

  /* calc — 2026 rates, -20% to bring pricing current and lower the bar to inquire */
  const hourly = useMemo(() => {
    switch (hourlyMode) {
      case "budget":   return 1440;
      case "standard": return 2560;
      case "premium":  return 4400;
      case "custom":   return Math.max(800, Math.min(30000, Number.isFinite(hourlyCustom) ? hourlyCustom : 4400));
    }
  }, [hourlyMode, hourlyCustom]);

  const estimate = useMemo(() => {
    const activeTypes = (Object.keys(selected) as ProjectType[]).filter(t => selected[t]);
    const safe = activeTypes.length ? activeTypes : (["site"] as ProjectType[]);
    let hours = 0;
    for (const t of safe) hours += BASE_HOURS[t] * COMPLEXITY_K[complexity[t]] + pages[t] * PAGE_HOURS[t];
    hours += integrations * INTEGRATION_HOURS;
    for (const m of MODULES) if (mods[m.key]) hours += m.hours;
    hours += DESIGN_HOURS;
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
      `${c.msg.budget}: ${money(estimate.low)} — ${money(estimate.high)}`,
      `${c.msg.hours}: ~${estimate.hours} ${c.hUnit}`,
      maintenance ? `${c.msg.support} (${slaLabel}): ~${moneyPerMonth(estimate.support)}` : null,
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
  }, [selected, pages, complexity, integrations, mods, deploy, timeline, maintenance, sla, estimate, setQuote, money, moneyPerMonth]);

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


  return (
    <section ref={_ref} id="calculator" aria-labelledby={titleId}
      style={{ background: "transparent", position: "relative", overflow: "hidden" }}>

      <div className="px-5 md:px-10" style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto" }}>

        {/* Header — matches the Capabilities/Benefits header treatment */}
        <motion.div {...(fadeUp(0) as object)}
          style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap", padding: "clamp(72px,10svh,110px) 0 48px" }}>
          <div>
            <p style={{ fontSize: 14, letterSpacing: "0.2em", textTransform: "uppercase", color: TEAL, marginBottom: 16 }}>
              {c.eyebrow}
            </p>
            <h2 id={titleId} className={serif.className}
              style={{ fontSize: "clamp(2.3rem, 5.06vw, 3.91rem)", fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.02em", color: WHITE, margin: 0 }}>
              {c.titleLine1} {c.titleLine2}
            </h2>
          </div>
          <p style={{ fontSize: 18, lineHeight: 1.6, color: "rgba(244,250,248,0.45)", maxWidth: 300 }}>
            {c.description}
          </p>
        </motion.div>

        <div className="home-calc-grid" style={{ display: "grid", alignItems: "start" }}>

          {/* ── LEFT: controls ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>

            {/* Project type */}
            <motion.div {...(fadeUp(0.1) as object)} style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 32, paddingBottom: 32 }}>
              <FigLabel num="01" label={c.step1} />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 8, marginTop: 10 }}>
                {([
                  { key: "site",    icon: Globe       },
                  { key: "webapp",  icon: Layers      },
                  { key: "mobile",  icon: Smartphone  },
                ] as const).map(({ key, icon: Icon }) => (
                  <button key={key}
                    onClick={() => setSelected(p => ({ ...p, [key]: !p[key] }))}
                    style={{ ...selected[key] ? cardActive : card, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8, padding: "clamp(12px, 2vw, 16px)", minWidth: 0, borderRadius: 12, cursor: "pointer", textAlign: "left", transition: "all 0.2s", background: selected[key] ? "rgba(45,212,191,0.08)" : "rgba(255,255,255,0.03)" }}>
                    <Icon size={15} style={{ color: selected[key] ? TEAL : "rgba(244,250,248,0.3)" }} />
                    <span style={{ fontSize: 16, fontWeight: 500, overflowWrap: "anywhere", hyphens: "auto", color: selected[key] ? WHITE : "rgba(244,250,248,0.45)" }}>
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
                      <span style={{ fontSize: 16, color: "rgba(244,250,248,0.4)" }}>
                        {type === "site" ? c.pagesLabel : c.screensLabel} — {c.types[type]}
                      </span>
                      <span style={{ fontSize: 16, fontWeight: 500, color: TEAL }}>{pages[type]} {c.unitPcs}</span>
                    </div>
                    <input type="range" min={1} max={30} value={pages[type]}
                      onChange={e => setPages(p => ({ ...p, [type]: +e.target.value }))}
                      style={{ width: "100%", height: 2, appearance: "none", borderRadius: 99, cursor: "pointer", accentColor: TEAL, background: `linear-gradient(to right, ${TEAL} ${(pages[type]/30)*100}%, rgba(255,255,255,0.1) 0%)` }} />
                  </div>
                ))}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 16, color: "rgba(244,250,248,0.4)" }}>{c.integrationsLabel}</span>
                    <span style={{ fontSize: 16, fontWeight: 500, color: TEAL }}>{integrations} {c.unitPcs}</span>
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
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 8, marginTop: 10 }}>
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
                      style={{ ...isActive ? cardActive : card, padding: "10px 12px", borderRadius: 10, cursor: "pointer", fontSize: 16, fontWeight: 500, transition: "all 0.2s", color: isActive ? TEAL : "rgba(244,250,248,0.45)" }}>
                      {c.complexity[level]}
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Modules */}
            <motion.div {...(fadeUp(0.25) as object)} style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 32, paddingBottom: 32 }}>
              <FigLabel num="04" label={c.step4} />
              <div className="grid grid-cols-2 md:grid-cols-3" style={{ gap: 8 }}>
                {MODULES.map(m => (
                  <button key={m.key}
                    onClick={() => setMods(p => ({ ...p, [m.key]: !p[m.key] }))}
                    style={{ ...mods[m.key] ? cardActive : card, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6, padding: "clamp(10px, 1.5vw, 12px)", borderRadius: 10, cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
                      <m.icon size={13} style={{ color: mods[m.key] ? TEAL : "rgba(244,250,248,0.25)", flexShrink: 0 }} />
                      <span style={{ fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: mods[m.key] ? WHITE : "rgba(244,250,248,0.4)" }}>
                        {c.modules[m.key]}
                      </span>
                    </div>
                    <span style={{ fontSize: 13, flexShrink: 0, color: "rgba(244,250,248,0.2)" }}>+{m.hours}{c.hUnit}</span>
                  </button>
                ))}
              </div>
            </motion.div>

          </div>

          {/* ── RIGHT: result panel ── */}
          <motion.div {...(fadeUp(0.15) as object)} className="home-calc-panel" style={{ top: 32, display: "flex", flexDirection: "column", gap: 12 }}>

            {/* Main result */}
            <div style={{ borderRadius: 14, padding: "24px 28px", background: "rgba(45,212,191,0.06)", border: `1px solid rgba(45,212,191,0.18)` }}>
              <p style={{ fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16, color: "rgba(244,250,248,0.3)" }}>
                {c.budgetLabel}
              </p>
              <p className={serif.className} style={{ fontSize: "clamp(1.84rem, 4.6vw, 2.76rem)", fontWeight: 400, lineHeight: 1.1, letterSpacing: "-0.02em", color: WHITE, marginBottom: 4 }}>
                {money(estimate.low)} —<br />
                {money(estimate.high)}
              </p>
              <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { val: `${estimate.hours} ${c.hUnit}`, label: c.hours },
                  { val: `${Math.ceil(estimate.hours / 40 / (timeline === "rush" ? RUSH_MULTIPLIER : 1))} ${c.wUnit}`, label: timeline === "rush" ? c.weeksRush : c.weeksNormal },
                ].map(item => (
                  <div key={item.label} style={{ borderRadius: 10, padding: "12px", textAlign: "center", background: "rgba(255,255,255,0.04)" }}>
                    <p className={serif.className} style={{ fontSize: "1.38rem", color: WHITE }}>{item.val}</p>
                    <p style={{ fontSize: 13, marginTop: 2, color: "rgba(244,250,248,0.35)" }}>{item.label}</p>
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
                    style={{ ...timeline === opt.val ? cardActive : card, padding: "10px 12px", borderRadius: 10, cursor: "pointer", fontSize: 16, fontWeight: 500, transition: "all 0.2s", color: timeline === opt.val ? TEAL : "rgba(244,250,248,0.45)" }}>
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
                    style={{ ...deploy === opt ? cardActive : card, width: "100%", padding: "10px 16px", borderRadius: 10, cursor: "pointer", fontSize: 16, fontWeight: 500, textAlign: "left", transition: "all 0.2s", color: deploy === opt ? TEAL : "rgba(244,250,248,0.45)" }}>
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
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 8 }}>
                    {(["lite","pro","enterprise"] as const).map(plan => (
                      <button key={plan} onClick={() => setSla(plan)}
                        style={{ ...sla === plan ? cardActive : card, padding: "8px", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 500, textAlign: "center", transition: "all 0.2s", color: sla === plan ? TEAL : "rgba(244,250,248,0.45)" }}>
                        {c.slaPlans[plan]}
                      </button>
                    ))}
                  </div>
                  <div style={{ marginTop: 12, textAlign: "center", borderRadius: 10, padding: "12px", background: "rgba(255,255,255,0.03)" }}>
                    <p className={serif.className} style={{ fontSize: "1.38rem", color: TEAL }}>
                      {moneyPerMonth(estimate.support)}
                    </p>
                    <p style={{ fontSize: 13, marginTop: 2, color: "rgba(244,250,248,0.3)" }}>{c.supportCaption}</p>
                  </div>
                </>
              )}
            </div>

            {/* CTA */}
            <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
              <button type="button" onClick={handleCTA} className="service-button service-button--primary" style={{ flex: 1 }}>
                {c.ctaDiscuss}
                <ArrowUpRight size={18} aria-hidden="true" />
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
      <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 13, color: "rgba(244,250,248,0.25)", letterSpacing: "0.05em", flexShrink: 0 }}>{num}</span>
      <span style={{ fontSize: 13, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 500, color: "rgba(244,250,248,0.35)" }}>{label}</span>
    </div>
  );
}

