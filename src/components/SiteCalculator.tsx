// src/components/SiteCalculator.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import {
  Info, Sparkles, ShoppingCart, Layers, Globe, Cpu, Database, ShieldCheck,
  Wrench, GitBranch, Search, Server, CreditCard, Truck, BarChart3,
  PenTool, PlugZap, Percent, BookOpen, User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuote } from "@/app/context/QuoteContext";

/* ================= types ================= */
type SiteKind = "landing" | "business" | "corporate" | "ecommerce" | "content" | "portfolio";
type DesignLevel = "basic" | "pro" | "brand";
type Speed = "normal" | "fast";
type Hosting = "none" | "cloud" | "vps";
type Support = "none" | "basic" | "pro";

const fade = (d = 0) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay: d },
  viewport: { once: true, amount: 0.2 },
});

/** БАЗОВЫЕ ЦЕНЫ (RUB, 2025) */
const PRICING = {
  base: { landing: 160_000, business: 220_000, corporate: 380_000, ecommerce: 520_000, content: 320_000, portfolio: 210_000 },
  perPage: { landing: 12_000, business: 14_000, corporate: 18_000, ecommerce: 20_000, content: 16_000, portfolio: 12_000 },
  includedPages: { landing: 4, business: 6, corporate: 10, ecommerce: 10, content: 12, portfolio: 6 },
  design: { basic: 1.0, pro: 1.18, brand: 1.38 },
  seo: { none: 0, lite: 40_000, pro: 95_000 },
  features: {
    blog: 55_000, auth: 60_000, forms: 25_000, catalog: 85_000, payments: 70_000, delivery: 55_000,
    crm: 65_000, search: 40_000, analytics: 20_000, animation: 35_000, integrations: 45_000,
  },
  infra: {
    hosting: { none: { monthly: 0, setup: 0 }, cloud: { monthly: 6_000, setup: 12_000 }, vps: { monthly: 4_000, setup: 18_000 } },
    ci: { monthly: 2_000, setup: 8_000 },
    domains: { monthly: 400, setup: 1_500 },
  },
  support: { none: 0, basic: 14_000, pro: 35_000 },
  speedMultiplier: { normal: 1.0, fast: 1.22 },
  discount: { ecommerceKit: 0.92 },
} as const;

const PRESETS = [
  { key: "landing", title: "Лендинг", apply: (s: StateSetters) => { s.setKind("landing"); s.setPages(4); s.setDesign("pro"); s.setSpeed("normal"); s.setForms(true); s.setBlog(false); s.setAuth(false); s.setCatalog(false); s.setPayments(false); s.setDelivery(false); s.setCrm(false); s.setSearch(true); s.setAnalytics(true); s.setAnimation(true); s.setIntegrations(false); s.setSeo("lite"); s.setHosting("cloud"); s.setUseCI(true); s.setSupport("basic"); } },
  { key: "business", title: "Сайт-визитка", apply: (s: StateSetters) => { s.setKind("business"); s.setPages(6); s.setDesign("pro"); s.setSpeed("normal"); s.setForms(true); s.setBlog(false); s.setAuth(false); s.setCatalog(false); s.setPayments(false); s.setDelivery(false); s.setCrm(false); s.setSearch(true); s.setAnalytics(true); s.setAnimation(false); s.setIntegrations(false); s.setSeo("lite"); s.setHosting("cloud"); s.setUseCI(true); s.setSupport("basic"); } },
  { key: "corporate", title: "Корпоративный", apply: (s: StateSetters) => { s.setKind("corporate"); s.setPages(12); s.setDesign("pro"); s.setSpeed("normal"); s.setForms(true); s.setBlog(true); s.setAuth(true); s.setCatalog(false); s.setPayments(false); s.setDelivery(false); s.setCrm(true); s.setSearch(true); s.setAnalytics(true); s.setAnimation(false); s.setIntegrations(true); s.setSeo("pro"); s.setHosting("cloud"); s.setUseCI(true); s.setSupport("pro"); } },
  { key: "ecommerce", title: "Интернет-магазин", apply: (s: StateSetters) => { s.setKind("ecommerce"); s.setPages(12); s.setDesign("brand"); s.setSpeed("normal"); s.setForms(true); s.setBlog(false); s.setAuth(true); s.setCatalog(true); s.setPayments(true); s.setDelivery(true); s.setCrm(true); s.setSearch(true); s.setAnalytics(true); s.setAnimation(false); s.setIntegrations(true); s.setSeo("pro"); s.setHosting("cloud"); s.setUseCI(true); s.setSupport("pro"); } },
  { key: "content", title: "Контент-проект", apply: (s: StateSetters) => { s.setKind("content"); s.setPages(14); s.setDesign("pro"); s.setSpeed("normal"); s.setForms(true); s.setBlog(true); s.setAuth(false); s.setCatalog(false); s.setPayments(false); s.setDelivery(false); s.setCrm(false); s.setSearch(true); s.setAnalytics(true); s.setAnimation(false); s.setIntegrations(false); s.setSeo("pro"); s.setHosting("cloud"); s.setUseCI(true); s.setSupport("basic"); } },
  { key: "portfolio", title: "Портфолио", apply: (s: StateSetters) => { s.setKind("portfolio"); s.setPages(6); s.setDesign("pro"); s.setSpeed("normal"); s.setForms(true); s.setBlog(false); s.setAuth(false); s.setCatalog(false); s.setPayments(false); s.setDelivery(false); s.setCrm(false); s.setSearch(true); s.setAnalytics(true); s.setAnimation(true); s.setIntegrations(false); s.setSeo("lite"); s.setHosting("cloud"); s.setUseCI(true); s.setSupport("basic"); } },
] as const;

type StateSetters = {
  setKind: (v: SiteKind) => void; setPages: (v: number) => void; setDesign: (v: DesignLevel) => void; setSpeed: (v: Speed) => void;
  setForms: (v: boolean) => void; setBlog: (v: boolean) => void; setAuth: (v: boolean) => void; setCatalog: (v: boolean) => void;
  setPayments: (v: boolean) => void; setDelivery: (v: boolean) => void; setCrm: (v: boolean) => void; setSearch: (v: boolean) => void;
  setAnalytics: (v: boolean) => void; setAnimation: (v: boolean) => void; setIntegrations: (v: boolean) => void;
  setSeo: (v: "none" | "lite" | "pro") => void; setHosting: (v: Hosting) => void; setUseCI: (v: boolean) => void; setSupport: (v: Support) => void;
};

/* ================= helpers ================= */
function clamp(n: number, min: number, max: number) { return Math.max(min, Math.min(max, n)); }
function fmt(n: number) { return n.toLocaleString("ru-RU") + " ₽"; }
function mapKind(k: SiteKind) { return k === "landing" ? "Лендинг" : k === "business" ? "Сайт-визитка" : k === "corporate" ? "Корпоративный" : k === "ecommerce" ? "Интернет-магазин" : k === "content" ? "Информационный сайт" : "Портфолио"; }
function mapDesign(d: DesignLevel) { return d === "basic" ? "Базовый" : d === "pro" ? "Pro" : "Branded"; }

/* ===== маленькая анимация чисел ===== */
function useCountUp(value: number) {
  const spring = useSpring(value, { stiffness: 120, damping: 20, mass: 0.6 });
  useEffect(() => { spring.set(value); }, [value, spring]);
  const rounded = useTransform(spring, (v) => Math.round(v));
  return rounded;
}
function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const animated = useCountUp(value);
  const [v, setV] = useState(value);
  useEffect(() => { const unsub = animated.on("change", (n) => setV(n)); return () => unsub(); }, [animated]);
  return <span className="tabular-nums">{v.toLocaleString("ru-RU")}{suffix}</span>;
}

/* ================= component ================= */
export default function SiteCalculator() {
  const router = useRouter();
  const { setQuote } = useQuote();

  // base state
  const [kind, setKind] = useState<SiteKind>("business");
  const [pages, setPages] = useState(8);
  const [design, setDesign] = useState<DesignLevel>("pro");
  const [speed, setSpeed] = useState<Speed>("normal");

  // features
  const [blog, setBlog] = useState(false);
  const [auth, setAuth] = useState(false);
  const [forms, setForms] = useState(true);
  const [catalog, setCatalog] = useState(false);
  const [payments, setPayments] = useState(false);
  const [delivery, setDelivery] = useState(false);
  const [crm, setCrm] = useState(false);
  const [search, setSearch] = useState(true);
  const [analytics, setAnalytics] = useState(true);
  const [animation, setAnimation] = useState(false);
  const [integrations, setIntegrations] = useState(false);

  // infra
  const [seo, setSeo] = useState<"none" | "lite" | "pro">("lite");
  const [hosting, setHosting] = useState<Hosting>("cloud");
  const [useCI, setUseCI] = useState(true);
  const [support, setSupport] = useState<Support>("basic");

  /* ===== autosave/load ===== */
  useEffect(() => {
    try {
      const raw = localStorage.getItem("site_calc_v1");
      if (!raw) return;
      const s = JSON.parse(raw);
      setKind(s.kind ?? "business");
      setPages(s.pages ?? 8);
      setDesign(s.design ?? "pro");
      setSpeed(s.speed ?? "normal");

      setBlog(!!s.blog); setAuth(!!s.auth); setForms(!!s.forms);
      setCatalog(!!s.catalog); setPayments(!!s.payments); setDelivery(!!s.delivery);
      setCrm(!!s.crm); setSearch(s.search ?? true); setAnalytics(s.analytics ?? true);
      setAnimation(!!s.animation); setIntegrations(!!s.integrations);

      setSeo(s.seo ?? "lite"); setHosting(s.hosting ?? "cloud");
      setUseCI(s.useCI ?? true); setSupport(s.support ?? "basic");
    } catch {}
  }, []);
  useEffect(() => {
    const s = { kind, pages, design, speed, blog, auth, forms, catalog, payments, delivery, crm, search, analytics, animation, integrations, seo, hosting, useCI, support };
    const save = () => { try { localStorage.setItem("site_calc_v1", JSON.stringify(s)); } catch {} };
    const win = typeof window !== "undefined" ? (window as any) : undefined;
    let id: number | ReturnType<typeof setTimeout> | undefined;
    if (win?.requestIdleCallback) {
      id = win.requestIdleCallback(save, { timeout: 800 });
      return () => { if (id) win.cancelIdleCallback?.(id as number); };
    } else {
      id = setTimeout(save, 200);
      return () => clearTimeout(id as ReturnType<typeof setTimeout>);
    }
  }, [kind, pages, design, speed, blog, auth, forms, catalog, payments, delivery, crm, search, analytics, animation, integrations, seo, hosting, useCI, support]);

  /* ===== calculation ===== */
  const result = useMemo(() => {
    const base = PRICING.base[kind];
    const included = PRICING.includedPages[kind];
    const perPage = PRICING.perPage[kind];
    const extraPages = clamp(pages - included, 0, 200);
    const pagesCost = extraPages * perPage;

    const designK = PRICING.design[design];

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

    const seoCost = PRICING.seo[seo];

    const infraSetup =
      PRICING.infra.hosting[hosting].setup +
      (useCI ? PRICING.infra.ci.setup : 0) +
      PRICING.infra.domains.setup;

    const infraMonthly =
      PRICING.infra.hosting[hosting].monthly +
      (useCI ? PRICING.infra.ci.monthly : 0) +
      PRICING.infra.domains.monthly +
      PRICING.support[support];

    let discountK = 1;
    if (kind === "ecommerce" && catalog && payments && delivery) {
      discountK = PRICING.discount.ecommerceKit;
    }
    const speedK = PRICING.speedMultiplier[speed];

    const oneOffRaw = (base + pagesCost) * designK + features + seoCost + infraSetup;
    const oneOff = Math.round(oneOffRaw * speedK * discountK);

    return {
      breakdown: { base, pagesCost, designK, features, seoCost, infraSetup, discountK, speedK },
      oneOff,
      monthly: infraMonthly,
      discountApplied: discountK !== 1,
    };
  }, [
    kind, pages, design, speed,
    blog, auth, forms, catalog, payments, delivery, crm, search, analytics, animation, integrations,
    seo, hosting, useCI, support,
  ]);

  const setters: StateSetters = {
    setKind, setPages, setDesign, setSpeed,
    setForms, setBlog, setAuth, setCatalog, setPayments, setDelivery, setCrm, setSearch, setAnalytics, setAnimation, setIntegrations,
    setSeo, setHosting, setUseCI, setSupport,
  };

  const applyPreset = (key: typeof PRESETS[number]["key"]) => {
    PRESETS.find(p => p.key === key)?.apply(setters);
  };

  const resetAll = () => {
    setKind("business"); setPages(8); setDesign("pro"); setSpeed("normal");
    setBlog(false); setAuth(false); setForms(true); setCatalog(false); setPayments(false);
    setDelivery(false); setCrm(false); setSearch(true); setAnalytics(true);
    setAnimation(false); setIntegrations(false);
    setSeo("lite"); setHosting("cloud"); setUseCI(true); setSupport("basic");
  };

  // итог → контакт
  const goToContactWithQuote = () => {
    setQuote({
      source: "sites-calculator",
      createdAt: new Date().toISOString(),
      kind, pages, design, seo, hosting, support, speed,
      oneOff: result.oneOff,
      monthly: result.monthly,
      breakdown: {
        base: result.breakdown.base,
        pagesCost: result.breakdown.pagesCost,
        designK: `x${result.breakdown.designK}`,
        features: result.breakdown.features,
        seoCost: result.breakdown.seoCost,
        infraSetup: result.breakdown.infraSetup,
        discountK: `x${result.breakdown.discountK}`,
        speedK: `x${result.breakdown.speedK}`,
      },
    });
    router.push("#contact");
  };

  /* ===== selected features list for chips ===== */
  const selectedFeatures: string[] = [
    forms && "Сложные формы",
    blog && "Блог/новости",
    auth && "Личный кабинет",
    catalog && "Каталог",
    payments && "Оплата",
    delivery && "Доставка",
    crm && "CRM",
    search && "Поиск",
    analytics && "Аналитика",
    animation && "Анимации",
    integrations && "Интеграции",
  ].filter(Boolean) as string[];

  return (
    <section
      id="calculator"
      className="relative w-full overflow-hidden bg-gradient-to-b from-black via-[#0b0b0b] to-black text-white
                 pt-20 pb-24 md:pt-24 md:pb-28"
      aria-labelledby="sites-calc-title"
    >
      {/* мягкие свечения */}
      <div className="absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-white/[0.035] blur-3xl" />
      <div className="absolute -bottom-40 -right-40 h-[420px] w-[420px] rounded-full bg-white/[0.035] blur-3xl" />

      {/* контейнер */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
        {/* Заголовок */}
        <motion.p {...fade(0)} className="text-sm uppercase tracking-[0.25em] text-white/60 mb-3 text-left">
          калькулятор
        </motion.p>
        <motion.h2
          id="sites-calc-title"
          {...fade(0.05)}
          className="text-[clamp(1.9rem,4vw,3.2rem)] font-extrabold leading-tight tracking-tight text-left max-w-4xl"
        >
          Калькулятор стоимости — сайты
        </motion.h2>
        <motion.p {...fade(0.1)} className="mt-4 text-white/80 max-w-3xl text-left">
          Выберите параметры. Под каждым пунктом короткое описание — чтобы быстрее понять, нужно ли это именно вам.
          Финальную стоимость подтвердим после короткого брифа.
        </motion.p>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1.12fr_0.88fr] gap-6 items-start">
          {/* ПАНЕЛИ ВЫБОРА */}
          <motion.div
            {...fade(0.12)}
            className="rounded-3xl border border-white/15 bg-white/[0.06] backdrop-blur p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]"
          >
            {/* Пресеты — быстрый старт */}
            <div className="mb-4 flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => applyPreset(p.key)}
                  className="rounded-full border border-white/25 px-3 py-1.5 text-xs text-white/85 hover:bg-white/10"
                >
                  {p.title}
                </button>
              ))}
              <button
                type="button"
                onClick={resetAll}
                className="rounded-full border border-white/25 px-3 py-1.5 text-xs text-white/70 hover:bg-white/10"
                title="Сбросить настройки"
              >
                Сброс
              </button>
            </div>

            {/* Тип сайта */}
            <SectionTitle icon={<Layers className="h-4 w-4" />} title="Тип сайта" />
            <p className="mt-1.5 text-xs text-white/65">
              Влияет на базовую стоимость и состав модулей. Если сомневаетесь — выберите «Сайт-визитка».
            </p>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {([
                ["landing", "Ленд.", "Лендинг"],
                ["business", "Визитка", "Сайт-визитка"],
                ["corporate", "Корп.", "Корпоративный"],
                ["ecommerce", "Магазин", "Интернет-магазин"],
                ["content", "Контент", "Информационный"],
                ["portfolio", "Портф.", "Портфолио"],
              ] as [SiteKind, string, string][]).map(([key, mobile, desktop]) => (
                <Chip
                  key={key}
                  active={kind === key}
                  onClick={() => setKind(key)}
                  mobile={mobile}
                  desktop={desktop}
                  ariaLabel={`Тип сайта: ${desktop}${kind === key ? ". Выбрано" : ""}`}
                />
              ))}
            </div>

            {/* Объём и дизайн */}
            <div className="mt-8 grid sm:grid-cols-2 gap-6">
              <div>
                <SectionTitle icon={<Globe className="h-4 w-4" />} title="Объём контента" />
                <p className="mt-1.5 text-xs text-white/65">
                  Примерное число страниц/разделов. Можно менять позже — калькулятор просто считает прикидку.
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <button
                    type="button"
                    className="rounded-full border border-white/25 px-2.5 py-1.5 hover:bg-white/10"
                    aria-label="Уменьшить количество страниц"
                    onClick={() => setPages(p => Math.max(1, p - 1))}
                  >–</button>

                  <input
                    type="range" min={1} max={60} value={pages}
                    onChange={e => {
                      const v = Number(e.target.value) || 1;
                      const clamped = Math.min(60, Math.max(1, v));
                      setPages(clamped);
                    }}
                    className="w-full accent-white"
                    aria-label="Количество страниц"
                    aria-valuemin={1}
                    aria-valuemax={60}
                    aria-valuenow={pages}
                    aria-valuetext={`${pages} страниц`}
                  />

                  <button
                    type="button"
                    className="rounded-full border border-white/25 px-2.5 py-1.5 hover:bg-white/10"
                    aria-label="Увеличить количество страниц"
                    onClick={() => setPages(p => Math.min(60, p + 1))}
                  >+</button>

                  <div className="w-16 text-right tabular-nums text-base font-semibold">
                    <CountUp value={pages} />
                  </div>
                </div>
              </div>
              <div>
                <SectionTitle icon={<Sparkles className="h-4 w-4" />} title="Уровень дизайна" />
                <p className="mt-1.5 text-xs text-white/65">
                  <strong>Базовый</strong> — аккуратно и быстро; <strong>Pro</strong> — больше состояний и сценариев;
                  <strong> Branded</strong> — индивидуальные паттерны.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {([["basic", "База", "Базовый"], ["pro", "Pro", "Pro"], ["brand", "Brand", "Branded"]] as [DesignLevel, string, string][])
                    .map(([k, mobile, desktop]) => (
                      <Chip
                        key={k}
                        active={design === k}
                        onClick={() => setDesign(k)}
                        mobile={mobile}
                        desktop={desktop}
                        ariaLabel={`Уровень дизайна: ${desktop}${design === k ? ". Выбрано" : ""}`}
                      />
                    ))}
                </div>
              </div>
            </div>

            {/* Функциональность */}
            <div className="mt-8">
              <SectionTitle icon={<Cpu className="h-4 w-4" />} title="Функциональность" />
              <p className="mt-1.5 text-xs text-white/65">
                Включайте только то, что точно пригодится: так оценка будет реалистичнее.
              </p>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                <Toggle label="Pro формы" value={forms} onChange={setForms} icon={<PenTool className="h-4 w-4 mr-2" />} />
                <Toggle label="Блог" value={blog} onChange={setBlog} icon={<BookOpen className="h-4 w-4 mr-2" />} />
                <Toggle label="Кабинет" value={auth} onChange={setAuth} icon={<User className="h-4 w-4 mr-2" />} />
                <Toggle label="Каталог" value={catalog} onChange={setCatalog} icon={<ShoppingCart className="h-4 w-4 mr-2" />} />
                <Toggle label="Оплата" value={payments} onChange={setPayments} icon={<CreditCard className="h-4 w-4 mr-2" />} />
                <Toggle label="Доставка" value={delivery} onChange={setDelivery} icon={<Truck className="h-4 w-4 mr-2" />} />
                <Toggle label="CRM" value={crm} onChange={setCrm} icon={<Database className="h-4 w-4 mr-2" />} />
                <Toggle label="Поиск" value={search} onChange={setSearch} icon={<Search className="h-4 w-4 mr-2" />} />
                <Toggle label="Аналитика" value={analytics} onChange={setAnalytics} icon={<BarChart3 className="h-4 w-4 mr-2" />} />
                <Toggle label="Анимации" value={animation} onChange={setAnimation} icon={<Sparkles className="h-4 w-4 mr-2" />} />
                <Toggle label="Интеграции" value={integrations} onChange={setIntegrations} icon={<PlugZap className="h-4 w-4 mr-2" />} />
              </div>
            </div>

            {/* SEO / Инфраструктура / Срочность */}
            <div className="mt-8 grid md:grid-cols-3 gap-6">
              <div>
                <SectionTitle icon={<Search className="h-4 w-4" />} title="SEO" />
                <p className="mt-1.5 text-xs text-white/65">
                  <strong>Нет</strong> — базовые метатеги; <strong>Базовое</strong> — чек-лист + карта ключей; <strong>Pro</strong> — расширенный пакет и контент-гайд.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {([
                    ["none", "Нет", "Нет"],
                    ["lite", "База", "Базовое"],
                    ["pro", "Pro", "Pro"],
                  ] as ["none" | "lite" | "pro", string, string][])
                    .map(([v, mobile, desktop]) => (
                      <Chip
                        key={v}
                        active={seo === v}
                        onClick={() => setSeo(v)}
                        mobile={mobile}
                        desktop={desktop}
                        ariaLabel={`SEO: ${desktop}${seo === v ? ". Выбрано" : ""}`}
                      />
                    ))}
                </div>
              </div>
              <div>
                <SectionTitle icon={<Server className="h-4 w-4" />} title="Развёртывание/хостинг" />
                <p className="mt-1.5 text-xs text-white/65">
                  <strong>Облако</strong> — быстрый старт; <strong>VPS</strong> — больше контроля; <strong>Без</strong> — если уже есть инфраструктура.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {([
                    ["cloud", "Cloud", "Облако"],
                    ["vps", "VPS", "VPS/сервер"],
                    ["none", "Без", "Без развёртывания"],
                  ] as [Hosting, string, string][])
                    .map(([v, mobile, desktop]) => (
                      <Chip
                        key={v}
                        active={hosting === v}
                        onClick={() => setHosting(v)}
                        mobile={mobile}
                        desktop={desktop}
                        ariaLabel={`Хостинг: ${desktop}${hosting === v ? ". Выбрано" : ""}`}
                      />
                    ))}
                </div>
                <div className="mt-3">
                  <Toggle value={useCI} onChange={setUseCI} label="CI/CD" icon={<GitBranch className="h-4 w-4 mr-2" />} />
                  <p className="mt-1 text-[11px] text-white/60">
                    Предпросмотры и автоматические выкаты. Полезно для регулярных релизов и командной работы.
                  </p>
                </div>
              </div>
              <div>
                <SectionTitle icon={<Wrench className="h-4 w-4" />} title="Поддержка и срочность" />
                <p className="mt-1.5 text-xs text-white/65">
                  Поддержка — на инциденты и мелкие улучшения. Срочность повышает скорость команды.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {([
                    ["none", "Нет", "Без поддержки"],
                    ["basic", "Base", "Базовая"],
                    ["pro", "Pro", "Pro SLA"],
                  ] as [Support, string, string][])
                    .map(([v, mobile, desktop]) => (
                      <Chip
                        key={v}
                        active={support === v}
                        onClick={() => setSupport(v)}
                        mobile={mobile}
                        desktop={desktop}
                        ariaLabel={`Поддержка: ${desktop}${support === v ? ". Выбрано" : ""}`}
                      />
                    ))}
                </div>
                <div className="mt-3">
                  <div className="flex gap-2">
                    {([
                      ["normal", "Обычн.", "Basic"],
                      ["fast", "Срочно", "Basic+"],
                    ] as [Speed, string, string][])
                      .map(([v, mobile, desktop]) => (
                        <Chip
                          key={v}
                          active={speed === v}
                          onClick={() => setSpeed(v)}
                          mobile={mobile}
                          desktop={desktop}
                          ariaLabel={`Срочность: ${desktop}${speed === v ? ". Выбрано" : ""}`}
                        />
                      ))}
                  </div>
                  <p className="mt-1 text-[11px] text-white/60">
                    «Basic+» даёт ×{PRICING.speedMultiplier.fast} к темпу команды и влияет на смету.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* РЕЗЮМЕ / СМЕТА */}
          <motion.aside
            {...fade(0.16)}
            className="rounded-3xl border border-white/15 bg-white/[0.06] backdrop-blur p-6 sticky top-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]"
            aria-live="polite"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              <h3 className="text-xl font-semibold">Предварительная смета</h3>
              {result.discountApplied && (
                <span
                  className="ml-auto inline-flex items-center gap-1 rounded-full border border-emerald-300/30 bg-emerald-400/10 px-2 py-0.5 text-xs text-emerald-200"
                  title="Комбо-скидка активна (Каталог + Оплата + Доставка)"
                >
                  <Percent className="h-3.5 w-3.5" /> скидка комбо
                </span>
              )}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <Stat label="Тип" value={mapKind(kind)} />
              <Stat label="Страниц" value={<CountUp value={pages} />} />
              <Stat label="Дизайн" value={mapDesign(design)} />
              <Stat label="SEO" value={seo === "none" ? "нет" : seo === "lite" ? "базовое" : "Pro"} />
              <Stat label="Хостинг" value={hosting === "cloud" ? "облако" : hosting === "vps" ? "VPS" : "нет"} />
              <Stat label="Поддержка" value={support === "none" ? "нет" : support === "basic" ? "базовая" : "Pro SLA"} />
            </div>

            {/* выбранные модули как чипы */}
            {selectedFeatures.length > 0 && (
              <div className="mt-3">
                <div className="text-xs text-white/70 mb-1">Модули</div>
                <div className="flex flex-wrap gap-2">
                  {selectedFeatures.slice(0, 6).map((t) => (
                    <span key={t} className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.08] px-2.5 py-1 text-[11px] text-white/85">
                      {t}
                    </span>
                  ))}
                  {selectedFeatures.length > 6 && (
                    <span className="text-xs text-white/60">+{selectedFeatures.length - 6}</span>
                  )}
                </div>
              </div>
            )}

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <h4 className="font-semibold mb-3">Разбивка</h4>
              <Row label="База по типу" value={fmt(result.breakdown.base)} />
              <Row label="Доп. страницы" value={fmt(result.breakdown.pagesCost)} />
              <Row label="Дизайн-коэфф." value={`×${result.breakdown.designK.toFixed(2)}`} />
              <Row label="Модули/функции" value={fmt(result.breakdown.features)} />
              <Row label="SEO пакет" value={fmt(result.breakdown.seoCost)} />
              <Row label="Инфра (setup)" value={fmt(result.breakdown.infraSetup)} />
              {result.breakdown.discountK !== 1 && (
                <Row label="Скидка (комбо)" value={`${Math.round((1 - result.breakdown.discountK) * 100)}%`} />
              )}
              {result.breakdown.speedK !== 1 && (
                <Row label="Срочность" value={`×${result.breakdown.speedK.toFixed(2)}`} />
              )}
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white text-black p-5">
                <div className="text-sm text-black/70">Единовременно</div>
                <div className="mt-1 text-3xl font-extrabold tabular-nums">
                  <CountUp value={result.oneOff} /> ₽
                </div>
                <div className="mt-2 text-xs text-black/70 flex items-center gap-1">
                  <Info className="h-3.5 w-3.5" /> Дизайн, разработка, интеграции, стартовое SEO, инфраструктура.
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <div className="text-sm text-white/70">Ежемесячно</div>
                <div className="mt-1 text-3xl font-extrabold tabular-nums">
                  <CountUp value={result.monthly} /> ₽
                </div>
                <div className="mt-2 text-xs text-white/60 flex items-center gap-1">
                  <Database className="h-3.5 w-3.5" /> Хостинг/CI/CD/домены + поддержка.
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={goToContactWithQuote}
                className="group w-full inline-flex items-center justify-center rounded-full bg-white px-6 py-3 font-semibold text-black hover:shadow-lg hover:shadow-white/20 transition"
              >
                Оставить заявку
                <Percent className="sr-only" />
              </button>
            </div>

            <p className="mt-4 text-[12px] text-white/45">
              * Итог зависит от дизайна, контента, интеграций и сроков. После брифинга сформируем фикс-смету и таймлайн; возможны этапы (MVP → релиз → развитие).
            </p>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}

/* --- UI helpers --- */
function SectionTitle({ icon, title }: { icon: React.ReactNode, title: string }) {
  return (
    <div className="flex items-center gap-2 text-white/80">
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-white/[0.07]">{icon}</span>
      <span className="text-sm font-semibold uppercase tracking-[0.18em]">{title}</span>
    </div>
  );
}

function Chip({
  active, onClick, mobile, desktop, ariaLabel,
}: {
  active: boolean; onClick: () => void; mobile: string; desktop: string; ariaLabel?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-start text-left rounded-full px-4 py-2 text-sm border transition
      ${active ? "bg-white text-black border-white" : "border-white/30 text-white/85 hover:bg-white/10"}`}
      type="button"
      aria-pressed={active}
      aria-label={ariaLabel ?? `${desktop}${active ? ". Выбрано" : ""}`}
    >
      <span className="block sm:hidden">{mobile}</span>
      <span className="hidden sm:block">{desktop}</span>
    </button>
  );
}

function Toggle({ label, value, onChange, icon }: { label: string, value: boolean, onChange: (v: boolean) => void, icon?: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`group flex w-full items-center justify-between rounded-xl border p-3 transition
        ${value ? "bg-white text-black border-white" : "border-white/25 bg-white/[0.03] text-white"}`}
      aria-pressed={value}
      aria-label={`${label}${value ? ". Включено" : ". Выключено"}`}
    >
      <span className="text-sm flex items-center">{icon}{label}</span>
      <span className={`inline-flex h-6 w-10 items-center rounded-full ${value ? "bg-black/80" : "bg-white/15"}`}>
        <span className={`h-5 w-5 rounded-full bg-white transition-transform ${value ? "translate-x-4" : "translate-x-1"}`} />
      </span>
    </button>
  );
}

function Row({ label, value }: { label: string, value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-white/10 last:border-0 text-sm">
      <span className="text-white/60">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/15 bg-white/[0.06] p-3">
      <div className="text-xs text-white/70">{label}</div>
      <div className="mt-1 text-base font-semibold text-white">{value}</div>
    </div>
  );
}