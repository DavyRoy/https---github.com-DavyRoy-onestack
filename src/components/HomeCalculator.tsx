// src/app/components/HomeCalculator.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Layers,
  Smartphone,
  Globe,
  Puzzle,
  CreditCard,
  BarChart3,
  Lock,
  Rocket,
  Wrench,
  Bell,
  Search,
  MessageSquare,
  Files,
  Settings2,
  PanelsTopLeft,
  Languages,
  Database,
  Server,
  Sparkles,
  Undo2,
  Info,
} from "lucide-react";
import { useQuote } from "@/app/context/QuoteContext";
import type { QuotePayload } from "@/app/context/QuoteContext";

/* ===================== constants ===================== */

type ProjectType = "site" | "webapp" | "mobile";
type Timeline = "normal" | "rush";
type Deploy = "none" | "cloud" | "onprem";
type HourlyMode = "budget" | "standard" | "premium" | "custom";
type SLAPlan = "none" | "lite" | "pro" | "enterprise";

const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut", delay: d },
  viewport: { once: true, amount: 0.25 },
});

// базовые часы
const BASE_HOURS: Record<ProjectType, number> = {
  site: 80,
  webapp: 160,
  mobile: 180,
};

const PAGE_HOURS: Record<ProjectType, number> = {
  site: 10,
  webapp: 16,
  mobile: 18,
};

const INTEGRATION_HOURS = 20;

const COMPLEXITY_K = { 1: 0.9, 2: 1.0, 3: 1.25 } as const;

const RUSH_MULTIPLIER = 1.35;
const CONTINGENCY = 0.12;

const DEPLOY_HOURS: Record<Deploy, number> = {
  none: 0,
  cloud: 24,
  onprem: 48,
};

const MODULES = [
  { key: "auth", label: "Авторизация / RBAC", hours: 24, icon: Lock },
  { key: "payments", label: "Платежи", hours: 28, icon: CreditCard },
  { key: "analytics", label: "Аналитика", hours: 12, icon: BarChart3 },
  { key: "notifications", label: "Пуш/уведомления", hours: 14, icon: Bell },
  { key: "search", label: "Поиск", hours: 16, icon: Search },
  { key: "chat", label: "Чат / Комм-ции", hours: 20, icon: MessageSquare },
  { key: "files", label: "Файлы/медиа-хранилище", hours: 18, icon: Files },
  { key: "admin", label: "Админ-панель", hours: 26, icon: PanelsTopLeft },
  { key: "i18n", label: "Мультиязык", hours: 12, icon: Languages },
  { key: "cms", label: "CMS/контент", hours: 22, icon: Settings2 },
  { key: "db", label: "Миграции БД", hours: 12, icon: Database },
] as const;

type ModuleKey = (typeof MODULES)[number]["key"];

/* SLA */
const SLA_HOURS: Record<SLAPlan, number> = { none: 0, lite: 10, pro: 20, enterprise: 40 };
const SLA_DISCOUNT: Record<SLAPlan, number> = { none: 1, lite: 0.95, pro: 0.9, enterprise: 0.85 };
const SUPPORT_MIN = 35000;

/* Пресеты */
type PresetKey = "ecommerce" | "saas" | "crm" | "promo";
const PRESETS = {
  ecommerce: {
    title: "E-commerce",
    selected: { site: true, webapp: true },
    pages: { site: 12, webapp: 10 },
    complexity: { site: 2, webapp: 2 },
    integrations: 3,
    deploy: "cloud" as Deploy,
    needDesign: true,
    mods: { payments: true, analytics: true, search: true, files: true, admin: true, cms: true } as Partial<Record<ModuleKey, boolean>>,
  },
  saas: {
    title: "SaaS-платформа",
    selected: { webapp: true },
    pages: { webapp: 16 },
    complexity: { webapp: 3 },
    integrations: 4,
    deploy: "cloud" as Deploy,
    needDesign: true,
    mods: { auth: true, admin: true, analytics: true, notifications: true, db: true, i18n: true } as Partial<Record<ModuleKey, boolean>>,
  },
  crm: {
    title: "Внутренняя CRM",
    selected: { webapp: true, mobile: false },
    pages: { webapp: 14 },
    complexity: { webapp: 2 },
    integrations: 2,
    deploy: "onprem" as Deploy,
    needDesign: true,
    mods: { auth: true, admin: true, files: true, analytics: true, db: true } as Partial<Record<ModuleKey, boolean>>,
  },
  promo: {
    title: "Промо-лендинг",
    selected: { site: true },
    pages: { site: 4 },
    complexity: { site: 1 },
    integrations: 0,
    deploy: "cloud" as Deploy,
    needDesign: true,
    mods: { analytics: true, cms: true } as Partial<Record<ModuleKey, boolean>>,
  },
} satisfies Record<
  PresetKey,
  {
    title: string;
    selected: Partial<Record<ProjectType, boolean>>;
    pages: Partial<Record<ProjectType, number>>;
    complexity: Partial<Record<ProjectType, 1 | 2 | 3>>;
    integrations: number;
    deploy: Deploy;
    needDesign: boolean;
    mods: Partial<Record<ModuleKey, boolean>>;
  }
>;

/* ===================== component (Wizard) ===================== */

export default function HomeCalculator() {
  const router = useRouter();
  const { setQuote } = useQuote();
  const reduce = useReducedMotion();

  // selected
  const [selected, setSelected] = useState<Record<ProjectType, boolean>>({ site: true, webapp: false, mobile: false });
  const [pages, setPages] = useState<Record<ProjectType, number>>({ site: 6, webapp: 6, mobile: 6 });
  const [complexity, setComplexity] = useState<Record<ProjectType, 1 | 2 | 3>>({ site: 2, webapp: 2, mobile: 2 });

  // common
  const [integrations, setIntegrations] = useState(1);
  const [needDesign, setNeedDesign] = useState(true);
  const [timeline, setTimeline] = useState<Timeline>("normal");
  const [maintenance, setMaintenance] = useState(true);
  const [sla, setSla] = useState<SLAPlan>("pro");
  const [deploy, setDeploy] = useState<Deploy>("cloud");

  // modules
  const [mods, setMods] = useState<Record<ModuleKey, boolean>>({
    auth: true,
    payments: false,
    analytics: true,
    notifications: false,
    search: false,
    chat: false,
    files: false,
    admin: true,
    i18n: false,
    cms: false,
    db: false,
  });

  // rate
  const [hourlyMode, setHourlyMode] = useState<HourlyMode>("premium");
  const [hourlyCustom, setHourlyCustom] = useState<number>(3500);

  // активный пресет (для подсветки)
  const [activePreset, setActivePreset] = useState<PresetKey | null>(null);

  // autosave
  useEffect(() => {
    try {
      const raw = localStorage.getItem("onestack_calc");
      if (raw) {
        const s = JSON.parse(raw);
        setSelected((prev) => ({ ...prev, ...(s.selected ?? {}) }));
        setPages((prev) => ({ ...prev, ...(s.pages ?? {}) }));
        setComplexity((prev) => ({ ...prev, ...(s.complexity ?? {}) }));
        setIntegrations(s.integrations ?? 1);
        setNeedDesign(s.needDesign ?? true);
        setTimeline(s.timeline ?? "normal");
        setMaintenance(s.maintenance ?? true);
        setSla(s.sla ?? "pro");
        setDeploy(s.deploy ?? "cloud");
        setMods((prev) => ({ ...prev, ...(s.mods ?? {}) }));
        setHourlyMode(s.hourlyMode ?? "premium");
        setHourlyCustom(s.hourlyCustom ?? 3500);
        setActivePreset(null);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const state = {
      selected,
      pages,
      complexity,
      integrations,
      needDesign,
      timeline,
      maintenance,
      sla,
      deploy,
      mods,
      hourlyMode,
      hourlyCustom,
    };
    try {
      localStorage.setItem("onestack_calc", JSON.stringify(state));
    } catch {}
  }, [selected, pages, complexity, integrations, needDesign, timeline, maintenance, sla, deploy, mods, hourlyMode, hourlyCustom]);

  const hourly = useMemo(() => {
    switch (hourlyMode) {
      case "budget": return 900;
      case "standard": return 1800;
      case "premium": return 3500;
      case "custom": {
        const safe = Number.isFinite(hourlyCustom) ? hourlyCustom : 3500;
        return Math.max(300, Math.min(20000, safe));
      }
    }
  }, [hourlyMode, hourlyCustom]);

  const enableType = (t: ProjectType) => setSelected((s) => ({ ...s, [t]: !s[t] }));

  const estimate = useMemo(() => {
    const activeTypes = (Object.keys(selected) as ProjectType[]).filter((t) => selected[t]);
    const typesSafe = activeTypes.length ? activeTypes : (["site"] as ProjectType[]);

    let hours = 0;
    for (const t of typesSafe) {
      const base = BASE_HOURS[t] * COMPLEXITY_K[complexity[t]] + pages[t] * PAGE_HOURS[t];
      hours += base;
    }
    hours += integrations * INTEGRATION_HOURS;
    for (const m of MODULES) if (mods[m.key]) hours += m.hours;
    if (needDesign) hours += 40;
    hours += DEPLOY_HOURS[deploy];
    hours *= 1 + CONTINGENCY;

    const rushK = timeline === "rush" ? RUSH_MULTIPLIER : 1;
    const cost = Math.round(hours * hourly * rushK);
    const low = Math.round(cost * 0.88);
    const high = Math.round(cost * 1.12);

    let support = 0;
    if (maintenance) {
      if (sla !== "none") {
        const sHours = SLA_HOURS[sla];
        const price = Math.round(hourly * sHours * SLA_DISCOUNT[sla]);
        support = Math.max(SUPPORT_MIN, price);
      } else {
        support = Math.max(SUPPORT_MIN, Math.round(cost * 0.1));
      }
    }

    return { hours: Math.round(hours), cost, low, high, support, typesSafe };
  }, [selected, pages, complexity, integrations, mods, needDesign, deploy, timeline, hourly, maintenance, sla]);

  /* ========= Пресеты / сброс ========= */
  const applyPreset = (key: PresetKey) => {
    const p = PRESETS[key];
    setSelected((s) => ({ ...s, site: !!p.selected.site, webapp: !!p.selected.webapp, mobile: !!p.selected.mobile }));
    setPages((sp) => ({ ...sp, site: p.pages.site ?? sp.site, webapp: p.pages.webapp ?? sp.webapp, mobile: p.pages.mobile ?? sp.mobile }));
    setComplexity((sc) => ({
      ...sc,
      site: (p.complexity.site ?? sc.site) as 1 | 2 | 3,
      webapp: (p.complexity.webapp ?? sc.webapp) as 1 | 2 | 3,
      mobile: (p.complexity.mobile ?? sc.mobile) as 1 | 2 | 3,
    }));
    setIntegrations(p.integrations);
    setDeploy(p.deploy);
    setNeedDesign(p.needDesign);
    setMods((sm) => {
      const next = { ...sm };
      for (const m of MODULES) if (p.mods[m.key] !== undefined) next[m.key] = !!p.mods[m.key];
      return next;
    });
    setActivePreset(key);
  };

  const resetAll = () => {
    setSelected({ site: true, webapp: false, mobile: false });
    setPages({ site: 6, webapp: 6, mobile: 6 });
    setComplexity({ site: 2, webapp: 2, mobile: 2 });
    setIntegrations(1);
    setNeedDesign(true);
    setTimeline("normal");
    setMaintenance(true);
    setSla("pro");
    setDeploy("cloud");
    setMods({ auth: true, payments: false, analytics: true, notifications: false, search: false, chat: false, files: false, admin: true, i18n: false, cms: false, db: false });
    setHourlyMode("premium");
    setHourlyCustom(3500);
    setActivePreset(null);
  };

  /* ========= Wizard ========= */
  const steps = [
    { key: "types", title: "Услуги" },
    { key: "params", title: "Параметры" },
    { key: "pricing", title: "Тариф & Поддержка" },
  ] as const;

  const [step, setStep] = useStepQuery(1);
  const isFirst = step === 1;
  const isLast = step === steps.length;

  const goNext = () => setStep(Math.min(steps.length, step + 1));
  const goPrev = () => setStep(Math.max(1, step - 1));

  // submit
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<null | { kind: "ok" | "err"; text: string }>(null);

  const submitQuote = async () => {
    if (sending) return;
    setSending(true);
    setToast(null);

    try {
      const totalPages = estimate.typesSafe.reduce((sum, t) => sum + pages[t], 0);
      const modulesCount = Object.values(mods).filter(Boolean).length;

      const payload: QuotePayload = {
        source: "home-calculator",
        createdAt: new Date().toISOString(),
        kind: estimate.typesSafe.map(mapType).join(", "),
        pages: totalPages,
        hosting: mapDeploy(deploy),
        support: maintenance ? (sla === "none" ? "Гибкий 10%" : sla) : "Без поддержки",
        speed: timeline === "rush" ? `Срочно ×${RUSH_MULTIPLIER}` : "Обычные",
        oneOff: estimate.cost,
        monthly: estimate.support,
        breakdown: {
          hours: estimate.hours,
          low: estimate.low,
          high: estimate.high,
          hourly,
          integrations,
          needDesign,
          deploy,
          modulesCount,
          sla,
          timeline,
        },
      };

      setQuote(payload);
      router.push("#contact");
      setToast({ kind: "ok", text: "Расчёт подготовлен. Заполните контакты — мы свяжемся с вами." });
    } catch {
      setToast({ kind: "err", text: "Не удалось подготовить расчёт. Попробуйте ещё раз." });
    } finally {
      setSending(false);
    }
  };

  // ===== springs for counters (уважаем reduce motion) =====
  const sHours = useSpring(estimate.hours, { stiffness: 120, damping: 20, mass: 0.6 });
  const sLow = useSpring(estimate.low, { stiffness: 120, damping: 20, mass: 0.6 });
  const sHigh = useSpring(estimate.high, { stiffness: 120, damping: 20, mass: 0.6 });
  const sSupport = useSpring(estimate.support, { stiffness: 120, damping: 20, mass: 0.6 });

  useEffect(() => {
    if (reduce) {
      sHours.set(estimate.hours);
      sLow.set(estimate.low);
      sHigh.set(estimate.high);
      sSupport.set(estimate.support);
    } else {
      sHours.set(estimate.hours);
      sLow.set(estimate.low);
      sHigh.set(estimate.high);
      sSupport.set(estimate.support);
    }
  }, [estimate.hours, estimate.low, estimate.high, estimate.support, reduce, sHours, sLow, sHigh, sSupport]);

  // JSON-LD HowTo (SEO): три шага мастера калькулятора
  const howToJsonLd = useMemo(() => {
    const url =
      (typeof process !== "undefined" && (process as any).env?.NEXT_PUBLIC_SITE_URL) ||
      "https://onestack24.ru";
    return {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "Как рассчитать бюджет разработки онлайн",
      description:
        "Калькулятор стоимости разработки: выберите услуги, задайте параметры проекта и получите ориентировочную смету и поддержку по SLA.",
      totalTime: "PT1M",
      step: [
        {
          "@type": "HowToStep",
          name: "Выберите услуги",
          url: `${url}/#calculator`,
          itemListElement: [
            { "@type": "HowToDirection", text: "Сайт, веб-приложение и/или мобильное приложение." },
            { "@type": "HowToTip", text: "Можно выбрать сразу несколько видов работ." },
          ],
        },
        {
          "@type": "HowToStep",
          name: "Задайте параметры",
          itemListElement: [
            { "@type": "HowToDirection", text: "Страницы/экраны, сложность, интеграции и развёртывание." },
            { "@type": "HowToDirection", text: "Подключите модули: RBAC, платежи, поиск, аналитика и т. д." },
          ],
        },
        {
          "@type": "HowToStep",
          name: "Выберите тариф и поддержку",
          itemListElement: [
            { "@type": "HowToDirection", text: "Укажите ставку ₽/ч или используйте пресеты." },
            { "@type": "HowToDirection", text: "Выберите план SLA или гибкий вариант 10% от сметы." },
          ],
        },
      ],
    };
  }, []);

  return (
    <section
      id="calculator"
      className="relative w-full overflow-hidden bg-black text-white pt-20 pb-24 md:pt-24 md:pb-28"
      aria-labelledby="calc-title"
    >
      {/* фон */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_80%_20%,rgba(255,255,255,0.06),rgba(0,0,0,0)),radial-gradient(50%_40%_at_20%_80%,rgba(255,255,255,0.05),rgba(0,0,0,0))]"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-22 lg:px-20">
        <motion.p {...fadeUp(0)} className="text-sm uppercase tracking-[0.25em] text-white/60">
          калькулятор
        </motion.p>
        <motion.h2
          id="calc-title"
          {...fadeUp(0.05)}
          className="mt-2 text-[clamp(1.9rem,4vw,3.2rem)] font-extrabold leading-tight tracking-tight text-left max-w-4xl"
        >
          Калькулятор стоимости разработки — прикинем бюджет за 1 минуту
        </motion.h2>
        <motion.p {...fadeUp(0.1)} className="mt-4 max-w-2xl text-white/80 text-left">
          Онлайн-оценка сметы: выберите услуги, параметры, ставку и пострелизную поддержку — получите ориентировочную вилку, трудозатраты в часах и размер абонентки по SLA.
        </motion.p>

        {/* Пресеты */}
        <motion.div {...fadeUp(0.12)} className="mt-8 flex flex-wrap gap-2" aria-label="Готовые пресеты проектов">
          {(Object.entries(PRESETS) as Array<[PresetKey, (typeof PRESETS)[PresetKey]]>).map(([key, p]) => {
            const active = activePreset === key;
            return (
              <button
                key={key}
                onClick={() => applyPreset(key)}
                aria-pressed={active}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition border
                  ${active
                    ? "bg-white text-black border-white shadow"
                    : "bg-white/[0.06] text-white border-white/15 hover:bg-white/[0.12]"}`
                }
              >
                <Sparkles className="h-4 w-4" aria-hidden />
                {p.title}
              </button>
            );
          })}
          <button
            onClick={resetAll}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-sm hover:bg-white/[0.12] transition"
            title="Сбросить все настройки"
          >
            <Undo2 className="h-4 w-4" aria-hidden />
            Сбросить
          </button>
        </motion.div>

        {/* Степпер */}
        <motion.div {...fadeUp(0.12)} className="mt-6" aria-label="Шаги калькулятора">
          <div
            className="relative h-2 rounded-full bg-white/10 overflow-hidden"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={steps.length}
            aria-valuenow={step}
          >
            <div className="absolute inset-y-0 left-0 bg-white" style={{ width: `${(step / steps.length) * 100}%` }} />
          </div>
          <ol className="mt-3 grid grid-cols-3 gap-3 text-sm" aria-label="Навигация по шагам">
            {steps.map((s, i) => {
              const n = i + 1;
              const current = n === step;
              return (
                <li key={s.key} className="flex items-center gap-2">
                  <button
                    onClick={() => setStep(n)}
                    className={`rounded-full px-3 py-1.5 border transition
                      ${current ? "bg-white text-black border-white" : "border-white/20 bg-white/[0.06] hover:bg-white/[0.12]"}`}
                    aria-current={current ? "step" : undefined}
                  >
                    {n}. {s.title}
                  </button>
                </li>
              );
            })}
          </ol>
        </motion.div>

        {/* Контент */}
        <div className="mt-8 grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
          {/* LEFT: шаги + информпанель */}
          <div className="xl:col-span-2 space-y-6">
            {/* Шаг 1 — Услуги */}
            <motion.div
              {...fadeUp(0.14)}
              className={`rounded-3xl border border-white/15 bg-white/[0.06] backdrop-blur p-6 md:p-7 shadow-[0_20px_80px_rgba(0,0,0,0.35)] ${step === 1 ? "" : "hidden"}`}
              aria-labelledby="step-1-title"
            >
              <div id="step-1-title" className="text-sm font-semibold text-white/90 mb-4">Услуги (можно несколько)</div>
              <div className="grid grid-cols-3 gap-3">
                <TypeToggle active={selected.site} onClick={() => enableType("site")} title="Сайт" icon={<Globe className="h-5 w-5" aria-hidden />} />
                <TypeToggle active={selected.webapp} onClick={() => enableType("webapp")} title="Веб-прилож." icon={<Layers className="h-5 w-5" aria-hidden />} />
                <TypeToggle active={selected.mobile} onClick={() => enableType("mobile")} title="Мобильное" icon={<Smartphone className="h-5 w-5" aria-hidden />} />
              </div>

              <div className="mt-6 space-y-5">
                {(Object.keys(selected) as ProjectType[]).filter((t) => selected[t]).map((t) => (
                  <div key={t} className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
                    <div className="mb-3 text-sm font-semibold text-white/90">Настройки: {mapType(t)}</div>

                    <LabelRow label="Страницы / экраны" value={pages[t]} suffix="шт" />
                    <input
                      type="range"
                      min={1}
                      max={30}
                      step={1}
                      value={pages[t]}
                      onChange={(e) => setPages((p) => ({ ...p, [t]: parseInt(e.target.value) }))}
                      className="w-full accent-white"
                      aria-label={`Количество страниц для ${mapType(t)}`}
                    />
                    <p className="mt-1.5 text-xs text-white/65 flex items-center gap-1.5">
                      <Info className="h-3.5 w-3.5" /> Количество уникальных экранов/шаблонов, без вариантов состояний.
                    </p>

                    <div className="mt-5">
                      <label className="text-sm font-semibold text-white/90">Сложность</label>
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        {[1, 2, 3].map((v) => (
                          <button
                            key={v}
                            onClick={() => setComplexity((c) => ({ ...c, [t]: (v as 1 | 2 | 3) }))}
                            className={`rounded-xl px-3 py-2 text-sm border transition ${
                              complexity[t] === v ? "bg-white text-black border-white" : "bg-white/[0.06] border-white/15 hover:bg-white/[0.12]"
                            }`}
                            aria-pressed={complexity[t] === v}
                          >
                            {v === 1 ? (
                              <>
                                <span className="block sm:hidden">Баз.</span>
                                <span className="hidden sm:block">Базовая</span>
                              </>
                            ) : v === 2 ? (
                              <>
                                <span className="block sm:hidden">Станд.</span>
                                <span className="hidden sm:block">Стандартная</span>
                              </>
                            ) : (
                              <>
                                <span className="block sm:hidden">Прод.</span>
                                <span className="hidden sm:block">Продвинутая</span>
                              </>
                            )}
                          </button>
                        ))}
                      </div>
                      <p className="mt-1.5 text-xs text-white/65 flex items-center gap-1.5">
                        <Info className="h-3.5 w-3.5" /> Больше интеграций/сложной логики → выше сложность.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Шаг 2 — Параметры */}
            <motion.div
              {...fadeUp(0.16)}
              className={`rounded-3xl border border-white/15 bg-white/[0.06] backdrop-blur p-6 md:p-7 shadow-[0_20px_80px_rgba(0,0,0,0.35)] ${step === 2 ? "" : "hidden"}`}
              aria-labelledby="step-2-title"
            >
              <div id="step-2-title" className="text-sm font-semibold text-white/90">Параметры</div>

              <div className="mt-5">
                <LabelRow label="Интеграции (CRM, платёжки, API)" value={integrations} suffix="шт" />
                <input
                  type="range"
                  min={0}
                  max={10}
                  step={1}
                  value={integrations}
                  onChange={(e) => setIntegrations(parseInt(e.target.value))}
                  className="w-full accent-white"
                  aria-label="Количество интеграций"
                />
                <p className="mt-1.5 text-xs text-white/65 flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5" /> Одна интеграция ≈ {INTEGRATION_HOURS} ч на подключение, тесты и документацию.
                </p>
              </div>

              <div className="mt-6">
                <label className="text-sm font-semibold text-white/90">Развёртывание</label>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <RadioPill active={deploy === "none"} onClick={() => setDeploy("none")} title={ <> <span className="block sm:hidden">Код</span> <span className="hidden sm:block">Без развёртыв.</span> </> } icon={<Server className="h-4 w-4" aria-hidden />} />
                  <RadioPill active={deploy === "cloud"} onClick={() => setDeploy("cloud")} title={ <> <span className="block sm:hidden">Cloud</span> <span className="hidden sm:block">Облако</span> </> } icon={<Server className="h-4 w-4" aria-hidden />} />
                  <RadioPill active={deploy === "onprem"} onClick={() => setDeploy("onprem")} title={ <> <span className="block sm:hidden">On-prem</span> <span className="hidden sm:block">On-prem (локально)</span> </> } icon={<Server className="h-4 w-4" aria-hidden />} />
                </div>
                <div className="mt-2 text-xs text-white/70">
                  Облако: ~{DEPLOY_HOURS.cloud} ч, On-prem: ~{DEPLOY_HOURS.onprem} ч на окружения и документацию.
                </div>
              </div>

              <div className="mt-6">
                <label className="text-sm font-semibold text-white/90">Подключаемые модули</label>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {MODULES.map((m) => {
                    const Icon = m.icon;
                    const active = mods[m.key];
                    return (
                      <button
                        key={m.key}
                        onClick={() => setMods((s) => ({ ...s, [m.key]: !s[m.key] }))}
                        className={`flex items-center justify-between rounded-xl border px-3 py-2 text-sm transition ${
                          active ? "bg-white text-black border-white" : "bg-white/[0.06] border-white/15 hover:bg-white/[0.12] text-white"
                        }`}
                        type="button"
                        aria-pressed={active}
                        title={m.label}
                      >
                        <span className="flex items-center gap-2">
                          <Icon className="h-4 w-4" aria-hidden />
                          {m.label}
                        </span>
                        <span className={`text-xs ${active ? "text-black/60" : "text-white/60"}`}>+{m.hours} ч</span>
                      </button>
                    );
                  })}
                </div>
                <p className="mt-1.5 text-xs text-white/65 flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5" /> Выбирайте только нужное — часы и смета пересчитываются автоматически.
                </p>
              </div>

              <div className="mt-6">
                <Check checked={needDesign} onChange={setNeedDesign} icon={<Puzzle className="h-4 w-4" aria-hidden />} label="UI-дизайн (минимальный пакет)" />
                <div className="mt-1 text-xs text-white/70">~40 ч на гайдлайны и ключевые экраны.</div>
              </div>

              <div className="mt-6">
                <label className="text-sm font-semibold text-white/90">Сроки</label>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <RadioPill active={timeline === "normal"} onClick={() => setTimeline("normal")} title="Обычные" />
                  <RadioPill active={timeline === "rush"} onClick={() => setTimeline("rush")} title={`Срочно ×${RUSH_MULTIPLIER}`} />
                </div>
                <p className="mt-1.5 text-xs text-white/65 flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5" /> Срочный режим ускоряет поставку и увеличивает бюджет на коэффициент срочности.
                </p>
              </div>
            </motion.div>

            {/* Шаг 3 — Тариф & Поддержка */}
            <motion.div
              {...fadeUp(0.18)}
              className={`rounded-3xl border border-white/15 bg-white/[0.06] backdrop-blur p-6 md:p-7 shadow-[0_20px_80px_rgba(0,0,0,0.35)] ${step === 3 ? "" : "hidden"}`}
              aria-labelledby="step-3-title"
            >
              <div id="step-3-title" className="text-sm font-semibold text-white/90">Тариф (ставка ₽/ч)</div>
              <div className="mt-3 grid grid-cols-4 gap-2">
                <RadioPill active={hourlyMode === "budget"} onClick={() => setHourlyMode("budget")} title={ <> <span className="block sm:hidden">Бюд.</span> <span className="hidden sm:block">Бюджет</span> </> } />
                <RadioPill active={hourlyMode === "standard"} onClick={() => setHourlyMode("standard")} title={ <> <span className="block sm:hidden">Станд.</span> <span className="hidden sm:block">Стандарт</span> </> } />
                <RadioPill active={hourlyMode === "premium"} onClick={() => setHourlyMode("premium")} title={ <> <span className="block sm:hidden">Прем.</span> <span className="hidden sm:block">Премиум</span> </> } />
                <RadioPill active={hourlyMode === "custom"} onClick={() => setHourlyMode("custom")} title={ <> <span className="block sm:hidden">Своя</span> <span className="hidden sm:block">Своя ставка</span> </> } />
              </div>
              <p className="mt-2 text-xs text-white/65 flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5" /> Ставка — стоимость часа работы команды. Выберите ориентир или задайте свою.
              </p>

              {hourlyMode === "custom" && (
                <div className="mt-3">
                  <input
                    type="number"
                    min={300}
                    max={20000}
                    value={hourlyCustom}
                    onChange={(e) => setHourlyCustom(parseInt(e.target.value || "0", 10))}
                    className="w-full rounded-xl bg-white/[0.1] border border-white/20 px-3 py-2 text-sm outline-none focus:border-white/40"
                    placeholder="Введите ставку, ₽/ч"
                    aria-label="Своя ставка"
                  />
                  <div className="mt-1 text-xs text-white/70">Диапазон 300–20000 ₽/ч.</div>
                </div>
              )}

              <div className="mt-3 text-sm text-white/90">
                Текущая ставка: <span className="font-semibold text-white">{money(hourly)} ₽/ч</span>
              </div>

              <div className="mt-6">
                <label className="text-sm font-semibold text-white/90">Поддержка после релиза</label>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <RadioPill active={!maintenance} onClick={() => setMaintenance(false)} title="Без поддержки" icon={<Wrench className="h-4 w-4" aria-hidden />} />
                  <RadioPill active={maintenance} onClick={() => setMaintenance(true)} title="С поддержкой" icon={<Wrench className="h-4 w-4" aria-hidden />} />
                </div>

                {maintenance && (
                  <div className="mt-3">
                    <div className="text-sm font-semibold text-white/90 mb-2">План SLA</div>
                    <div className="grid grid-cols-4 gap-2">
                      <RadioPill active={sla === "none"} onClick={() => setSla("none")} title={ <> <span className="block sm:hidden">10%</span> <span className="hidden sm:block">Гибкий 10%</span> </> } />
                      <RadioPill active={sla === "lite"} onClick={() => setSla("lite")} title={ <> <span className="block sm:hidden">Lite</span> <span className="hidden sm:block">Lite (10ч)</span> </> } />
                      <RadioPill active={sla === "pro"} onClick={() => setSla("pro")} title={ <> <span className="block sm:hidden">Pro</span> <span className="hidden sm:block">Pro (20ч)</span> </> } />
                      <RadioPill active={sla === "enterprise"} onClick={() => setSla("enterprise")} title={ <> <span className="block sm:hidden">Ent</span> <span className="hidden sm:block">Enterprise (40ч)</span> </> } />
                    </div>
                    <div className="mt-2 text-xs text-white/70">
                      Гибкий — ~10% от сметы, минимум {money(SUPPORT_MIN)} ₽. Пакеты: Lite −5%, Pro −10%, Enterprise −15%.
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* === Дополнительная панель: состав работ + план + риски === */}
            <motion.div
              {...fadeUp(0.22)}
              className="rounded-3xl border border-white/15 bg-white/[0.06] backdrop-blur p-6 md:p-7 shadow-[0_20px_80px_rgba(0,0,0,0.35)]"
              aria-label="Состав работ и план"
            >
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="text-sm font-semibold text-white/90">Что войдёт в работу</div>
                <div className="text-xs text-white/60">
                  Оценка черновая, детали уточним на созвоне.
                </div>
              </div>

              {/* Scope коротко */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs uppercase tracking-wide text-white/60 mb-2">Scope</div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 inline-block h-1.5 w-1.5 rounded-full bg-white/70" />
                      <span>
                        <span className="text-white/80">Типы:</span>{" "}
                        {estimate.typesSafe.map(mapType).join(", ")}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 inline-block h-1.5 w-1.5 rounded-full bg-white/70" />
                      <span>
                        <span className="text-white/80">Страницы/экраны:</span>{" "}
                        {estimate.typesSafe.map((t) => `${mapType(t)} — ${pages[t]} шт`).join("; ")}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 inline-block h-1.5 w-1.5 rounded-full bg-white/70" />
                      <span>
                        <span className="text-white/80">Интеграции:</span> {integrations || 0} шт
                        <span className="text-white/60"> — CRM, платежи, маркетплейсы, сторонние API</span>
                      </span>
                    </li>
                    {needDesign && (
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5 inline-block h-1.5 w-1.5 rounded-full bg-white/70" />
                        <span>
                          <span className="text-white/80">UI-дизайн:</span> базовая дизайн-система и ключевые экраны (~40 ч)
                        </span>
                      </li>
                    )}
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 inline-block h-1.5 w-1.5 rounded-full bg-white/70" />
                      <span>
                        <span className="text-white/80">Развёртывание:</span> {mapDeploy(deploy)}
                        <span className="text-white/60">
                          {" "}
                          ({deploy === "cloud" ? "~24 ч" : deploy === "onprem" ? "~48 ч" : "0 ч"})
                        </span>
                      </span>
                    </li>
                    {Object.values(mods).some(Boolean) && (
                      <li className="flex items-start gap-2">
                        <span className="mt-0.5 inline-block h-1.5 w-1.5 rounded-full bg-white/70" />
                        <span className="flex-1">
                          <span className="text-white/80">Модули:</span>{" "}
                          <span className="text-white/90">
                            {MODULES.filter((m) => mods[m.key]).map((m) => m.label).join(", ")}
                          </span>
                          <div className="mt-1 text-[11px] leading-5 text-white/65">
                            Выбраны только нужные — калькулятор учитывает часы и пересчитывает смету.
                          </div>
                        </span>
                      </li>
                    )}
                  </ul>
                </div>

                {/* План работ по фазам */}
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs uppercase tracking-wide text-white/60 mb-2">План</div>
                  {(() => {
                    const total = estimate.hours;
                    const discovery = Math.round(total * 0.05);
                    const design = needDesign ? 40 : 0;
                    const deployH = DEPLOY_HOURS[deploy];
                    const rest = Math.max(total - discovery - design - deployH, 0);
                    const qa = Math.round(rest * 0.1);
                    const dev = Math.max(rest - qa, 0);
                    const weeks = (h: number) => Math.max(1, Math.ceil(h / 60));

                    const rows = [
                      { name: "Discovery / подготовка", h: discovery, w: weeks(discovery) },
                      design ? { name: "UI-дизайн", h: design, w: weeks(design) } : null,
                      { name: "Разработка", h: dev, w: weeks(dev) },
                      { name: "Тесты/полировка", h: qa, w: weeks(qa) },
                      { name: "Запуск / деплой", h: deployH, w: weeks(deployH) },
                    ].filter(Boolean) as { name: string; h: number; w: number }[];

                    return (
                      <ul className="space-y-2 text-sm">
                        {rows.map((r) => (
                          <li key={r.name} className="flex items-center justify-between gap-3">
                            <span className="text-white/85">{r.name}</span>
                            <span className="text-white/70 tabular-nums">{r.h.toLocaleString("ru-RU")} ч · ~{r.w} нед.</span>
                          </li>
                        ))}
                        <li className="mt-2 flex items-center justify-between border-t border-white/10 pt-2 text-sm">
                          <span className="text-white/85">Итого</span>
                          <span className="text-white font-semibold tabular-nums">{total.toLocaleString("ru-RU")} ч</span>
                        </li>
                        <li className="text-[11px] leading-5 text-white/65">
                          Недели посчитаны приблизительно (скорость ~60 ч/нед на команду). Уточняем после брифа.
                        </li>
                      </ul>
                    );
                  })()}
                </div>
              </div>

              {/* Риски и предпосылки */}
              <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-xs uppercase tracking-wide text-white/60 mb-2">Риски и предпосылки</div>
                <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[13px] leading-5 text-white/80">
                  <li className="rounded-xl border border-white/10 bg-white/[0.03] p-3">Стабильные интеграции и доступы к API.</li>
                  <li className="rounded-xl border border-white/10 bg-white/[0.03] p-3">Контент и тексты предоставляются вовремя.</li>
                  <li className="rounded-xl border border-white/10 bg-white/[0.03] p-3">Ревью/демо каждые 1–2 недели для контроля курса.</li>
                </ul>
              </div>
            </motion.div>

            {/* Навигация по шагам */}
            <div className="flex items-center justify-between" aria-label="Навигация по шагам калькулятора">
              <button
                onClick={goPrev}
                disabled={isFirst}
                className="rounded-full border border-white/25 px-5 py-2 text-sm disabled:opacity-40 hover:bg-white/10 transition"
                aria-disabled={isFirst}
              >
                Назад
              </button>
              <div className="text-xs text-white/70" aria-live="polite">Шаг {step} / {steps.length}</div>
              <button
                onClick={isLast ? undefined : goNext}
                className="rounded-full bg-white px-5 py-2 text-sm text-black font-semibold hover:opacity-90 disabled:opacity-40"
                aria-label={isLast ? "Завершить" : "Далее"}
              >
                Далее
              </button>
            </div>
          </div>

          {/* RIGHT: результат / CTA */}
          <motion.div
            {...fadeUp(0.2)}
            className="rounded-3xl border border-white/15 bg-white/[0.06] backdrop-blur p-6 md:p-7 sticky top-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]"
            aria-live="polite"
          >
            <div className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-white" aria-hidden />
              <div className="text-sm font-semibold text-white">Оценка</div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4" role="list">
              <Stat label="Типы" value={estimate.typesSafe.map(mapType).join(", ")} />
              <Stat label="Развёртывание" value={mapDeploy(deploy)} />
              <Stat label="Часы, всего" value={<CountUp spring={sHours} suffix=" ч" />} />
              <Stat label="Ставка" value={`${money(hourly)} ₽/ч`} />
              <Stat label="Сроки" value={timeline === "rush" ? `Срочно ×${RUSH_MULTIPLIER}` : "Обычные"} />
              <Stat label="Модулей" value={String(Object.values(mods).filter(Boolean).length)} />
            </div>

            <div className="mt-6 rounded-2xl border border-white/15 bg-black/20 p-4" aria-label="Ориентировочная стоимость">
              <div className="text-sm text-white/85">Ориентировочная стоимость</div>
              <div className="mt-2 text-2xl font-extrabold">
                <CountUp spring={sLow} /> — <CountUp spring={sHigh} /> <span className="text-white/70 text-base">₽</span>
              </div>
              <div className="mt-1 text-xs text-white/70">
                Риски {Math.round(CONTINGENCY * 100)}%. Срочность: {timeline === "rush" ? `×${RUSH_MULTIPLIER}` : "нет"}.
              </div>
            </div>

            {estimate.support > 0 && (
              <div className="mt-4 rounded-2xl border border-white/15 bg-black/20 p-4" aria-label="Поддержка и SLA">
                <div className="text-sm text-white/85">Поддержка (ежемесячно)</div>
                <div className="mt-2 text-xl font-bold"><CountUp spring={sSupport} /> ₽</div>
                <div className="mt-1 text-xs text-white/70">
                  {sla === "none"
                    ? "Гибкий план — примерно 10% от сметы, минимум 35 000 ₽."
                    : `Пакет ${sla.toUpperCase()}: ${SLA_HOURS[sla]}ч, скидка ${Math.round((1 - SLA_DISCOUNT[sla]) * 100)}%.`}
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-white/10">
              <button
                onClick={submitQuote}
                disabled={sending}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-black font-semibold hover:opacity-90 transition disabled:opacity-60"
              >
                {sending ? "Отправляем…" : "Отправить расчёт"}
                <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </button>
              <div className="mt-3 text-[11px] text-white/70">
                Это предварительная оценка. Точную смету подтвердим после короткого созвона и брифа.
              </div>
            </div>

            {toast && (
              <div
                className="mt-4 rounded-xl px-4 py-3 text-sm border bg-white/[0.06] text-white border-white/25"
                role="status"
              >
                {toast.text}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* JSON-LD: HowTo (SEO) */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
    </section>
  );
}

/* ===================== helpers & small UI ===================== */

function money(n: number) {
  return n.toLocaleString("ru-RU");
}
function mapType(t: ProjectType) {
  return t === "site" ? "Сайт" : t === "webapp" ? "Веб-приложение" : "Мобильное";
}
function mapDeploy(d: Deploy) {
  return d === "none" ? "Без развёртывания" : d === "cloud" ? "Облако" : "On-prem (локально)";
}

function TypeToggle({ active, onClick, title, icon }: { active: boolean; onClick: () => void; title: string; icon: React.ReactNode; }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-2 rounded-2xl border px-3 py-3 transition ${
        active ? "bg-white text-black border-white" : "bg-white/[0.06] text-white border-white/15 hover:bg-white/[0.12]"
      }`}
      type="button"
      aria-pressed={active}
      title={title}
    >
      <span>{icon}</span>
      <span className="text-xs font-semibold">{title}</span>
    </button>
  );
}

function RadioPill({ active, onClick, title, icon }: { active: boolean; onClick: () => void; title: string; title: React.ReactNode; icon?: React.ReactNode; }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm transition ${
        active ? "bg-white text-black border-white" : "bg-white/[0.06] border-white/15 hover:bg-white/[0.12]"
      }`}
      type="button"
      aria-pressed={active}
    >
      {icon}
      {title}
    </button>
  );
}

function LabelRow({ label, value, suffix = "" }: { label: string; value: number; suffix?: string }) {
  return (
    <div className="mb-1 flex items-center justify-between text-sm">
      <span className="text-white/85">{label}</span>
      <span className="text-white font-semibold">
        {value} {suffix}
      </span>
    </div>
  );
}

function Check({ checked, onChange, label, icon }: { checked: boolean; onChange: (v: boolean) => void; label: string; icon?: React.ReactNode; }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition ${
        checked ? "bg-white text-black border-white" : "bg-white/[0.06] border-white/15 hover:bg-white/[0.12]"
      }`}
      type="button"
      aria-pressed={checked}
      title={label}
    >
      {icon && <span>{icon}</span>}
      <span className="font-medium">{label}</span>
    </button>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/15 bg-white/[0.06] p-3" role="listitem">
      <div className="text-xs text-white/70">{label}</div>
      <div className="mt-1 text-base font-semibold text-white">{value}</div>
    </div>
  );
}

/* ===== форматированный счётчик ===== */
function CountUp({ spring, suffix = "" }: { spring: ReturnType<typeof useSpring>; suffix?: string }) {
  const val = useTransform(spring, (v) => Math.round(v));
  const [text, setText] = useState("0");

  useEffect(() => {
    const unsub = val.on("change", (n) => setText(n.toLocaleString("ru-RU")));
    return () => unsub();
  }, [val]);

  return <span className="tabular-nums">{text}{suffix}</span>;
}

/* ===== хук: синхронизируем текущий шаг с ?step= в URL ===== */
function useStepQuery(initial: number) {
  const [val, setVal] = React.useState(initial);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const sp = new URLSearchParams(window.location.search);
    const s = parseInt(sp.get("step") || "", 10);
    if (s >= 1 && s <= 3) setVal(s);
  }, []);

  const set = (n: number) => {
    setVal(n);
    if (typeof window === "undefined") return;
    const u = new URL(window.location.href);
    u.searchParams.set("step", String(n));
    window.history.replaceState(null, "", u.toString());
  };

  return [val, set] as const;
}