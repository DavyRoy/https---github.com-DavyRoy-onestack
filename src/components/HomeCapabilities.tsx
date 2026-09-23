"use client";
import { serif } from "@/lib/fonts";

import { useEffect, useId, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Globe, LayoutGrid, Smartphone, Sparkles, type LucideIcon } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

const TEAL  = "#2dd4bf";
const WHITE = "#f4faf8";

type TabKey = "sites" | "webapp" | "mobile" | "ai";
const TAB_KEYS: TabKey[] = ["sites", "webapp", "mobile", "ai"];
const TAB_ICONS: Record<TabKey, LucideIcon> = { sites: Globe, webapp: LayoutGrid, mobile: Smartphone, ai: Sparkles };

type Lang = "ru" | "en";
type TypeItem = { num: string; title: string; desc: string; price?: string; timeline?: string };
type TabCopy = {
  fig: string;
  label: string;
  title: [string, string];
  desc: string;
  moreLabel: string;
  more: string;
  types: TypeItem[];
  href: string;
};

const COPY: Record<Lang, { eyebrow: string; h1: [string, string]; sub: string; tabs: Record<TabKey, TabCopy> }> = {
  ru: {
    eyebrow: "01 / Возможности",
    h1: ["Всё нужное.", "Ничего лишнего."],
    sub: "Выберите задачу — покажем, что входит в решение.",
    tabs: {
      sites: {
        fig: "01 / WEB", label: "Сайты",
        title: ["Сайт с понятной", "задачей."],
        desc: "Представить компанию, получать обращения или продавать онлайн.",
        moreLabel: "Дополнительные возможности",
        more: "CRM, онлайн-оплата, мультиязычность и перенос данных — под вашу задачу.",
        types: [
          { num: "01", title: "Лендинг", desc: "Один экран — одна цель. Конверсия трафика в заявки.", price: "от 120 000 ₽", timeline: "1–2 нед" },
          { num: "02", title: "Корпоративный сайт", desc: "Услуги, команда, кейсы и блог под одной CMS.", price: "от 336 000 ₽", timeline: "3–6 нед" },
          { num: "03", title: "Интернет-магазин", desc: "Каталог, быстрый чекаут, оплаты и склад.", price: "от 576 000 ₽", timeline: "4–8 нед" },
          { num: "04", title: "Сайт-визитка", desc: "Быстрый старт за 1–2 недели, форма заявки.", price: "от 64 000 ₽", timeline: "1–2 нед" },
          { num: "05", title: "Инфо-портал", desc: "SEO-контент, редактор, подписки, рекомендации.", price: "от 224 000 ₽", timeline: "2–4 нед" },
          { num: "06", title: "Портфолио", desc: "Кейсы, галерея работ и отзывы клиентов.", price: "от 96 000 ₽", timeline: "1–3 нед" },
        ],
        href: "/sites",
      },
      webapp: {
        fig: "02 / APPLICATIONS", label: "Веб-приложения",
        title: ["Процессы в одной", "системе."],
        desc: "Объедините данные, клиентов и работу команды.",
        moreLabel: "Дополнительные возможности",
        more: "Интеграции с 1С, платежами и внешними сервисами. Состав согласуем до разработки.",
        types: [
          { num: "01", title: "CRM системы", desc: "Воронки, задачи, клиенты и аналитика в одном месте.", price: "от 560 000 ₽", timeline: "8–16 нед" },
          { num: "02", title: "Корпоративные порталы", desc: "Задачи, документы, коммуникации и права доступа.", price: "от 720 000 ₽", timeline: "10–20 нед" },
          { num: "03", title: "Личные кабинеты", desc: "Клиент сам платит и получает поддержку без звонков.", price: "от 400 000 ₽", timeline: "6–12 нед" },
          { num: "04", title: "Аналитические панели", desc: "KPI, воронки и отчёты в реальном времени.", price: "от 480 000 ₽", timeline: "6–10 нед" },
          { num: "05", title: "B2B платформы", desc: "Каталог с прайсами, заказы, интеграция с ERP.", price: "от 800 000 ₽", timeline: "10–18 нед" },
          { num: "06", title: "SaaS сервисы", desc: "Подписки, мультитенантность, рост без границ.", price: "от 1 200 000 ₽", timeline: "12–24 нед" },
        ],
        href: "/webapp",
      },
      mobile: {
        fig: "03 / MOBILE", label: "Мобильные",
        title: ["Продукт всегда", "рядом."],
        desc: "Приложение для клиентов или сотрудников на iOS и Android.",
        moreLabel: "Дополнительные возможности",
        more: "Push-уведомления, офлайн-режим и публикация в сторах — под вашу задачу.",
        types: [
          { num: "01", title: "CRM / ERP (мобильное)", desc: "Продажи и управление на ходу, работает офлайн.", price: "от 384 000 ₽", timeline: "6–10 нед" },
          { num: "02", title: "Внутренний портал", desc: "Новости, заявки и база знаний в одном приложении.", price: "от 440 000 ₽", timeline: "8–12 нед" },
          { num: "03", title: "Кабинет клиента", desc: "Заказы, оплата и поддержка без звонков в офис.", price: "от 480 000 ₽", timeline: "8–14 нед" },
          { num: "04", title: "Аналитическая панель", desc: "Бизнес-метрики и алерты в любой точке мира.", price: "от 336 000 ₽", timeline: "5–9 нед" },
          { num: "05", title: "B2B-витрина", desc: "Каталог с ценами, сканер, синхронизация с 1С.", price: "от 520 000 ₽", timeline: "8–14 нед" },
          { num: "06", title: "SaaS-сервис", desc: "Подписки, пэйволлы и онбординг в сторах.", price: "от 560 000 ₽", timeline: "10–16 нед" },
        ],
        href: "/mobile",
      },
      ai: {
        fig: "04 / INTELLIGENCE", label: "AI и автоматизация",
        title: ["Интеллект, который", "работает."],
        desc: "Чат-боты, автоматизация процессов и интеграция ИИ в ваши продукты.",
        moreLabel: "Дополнительные возможности",
        more: "Подключение к вашим данным и системам, обучение под задачу — обсуждаем индивидуально.",
        types: [
          { num: "01", title: "AI-чат-боты и ассистенты", desc: "От простых FAQ-ботов до ассистентов на базе LLM.", price: "по запросу" },
          { num: "02", title: "Автоматизация процессов", desc: "Авто-обработка заявок, документы, скоринг лидов.", price: "по запросу" },
          { num: "03", title: "Интеграция ИИ в продукты", desc: "Умный поиск, рекомендации и аналитика в вашем продукте.", price: "по запросу" },
          { num: "04", title: "AI-аналитика и прогнозирование", desc: "Предиктивные модели, скоринг и выявление паттернов в данных.", price: "по запросу" },
        ],
        href: "/ai",
      },
    },
  },
  en: {
    eyebrow: "01 / Capabilities",
    h1: ["Everything you need.", "Nothing you don't."],
    sub: "Pick a task — we'll show what's included.",
    tabs: {
      sites: {
        fig: "01 / WEB", label: "Websites",
        title: ["A website with a", "clear job."],
        desc: "Present your company, capture leads, or sell online.",
        moreLabel: "Additional capabilities",
        more: "CRM, online payments, multi-language and data migration — scoped to your task.",
        types: [
          { num: "01", title: "Landing page", desc: "One page, one goal — conversion of traffic into leads.", price: "from $1,360", timeline: "1–2 wks" },
          { num: "02", title: "Corporate website", desc: "Services, team, cases and blog under one CMS.", price: "from $3,760", timeline: "3–6 wks" },
          { num: "03", title: "Online store", desc: "Catalog, fast checkout, payments and warehouse sync.", price: "from $6,400", timeline: "4–8 wks" },
          { num: "04", title: "Business card site", desc: "Online in 1–2 weeks, with an inquiry form.", price: "from $720", timeline: "1–2 wks" },
          { num: "05", title: "Info portal", desc: "SEO content, easy editor, subscriptions, recommendations.", price: "from $2,480", timeline: "2–4 wks" },
          { num: "06", title: "Portfolio", desc: "Case studies, work gallery and client testimonials.", price: "from $1,040", timeline: "1–3 wks" },
        ],
        href: "/sites",
      },
      webapp: {
        fig: "02 / APPLICATIONS", label: "Web apps",
        title: ["Every process, one", "system."],
        desc: "Bring your data, customers and team workflow together.",
        moreLabel: "Additional capabilities",
        more: "Integrations with 1C, payments and external services. Scope agreed before development.",
        types: [
          { num: "01", title: "CRM systems", desc: "Pipelines, tasks, clients and analytics in one place.", price: "from $6,240", timeline: "8–16 wks" },
          { num: "02", title: "Corporate portals", desc: "Tasks, documents, communication and access rights.", price: "from $8,000", timeline: "10–20 wks" },
          { num: "03", title: "User portals", desc: "Clients pay and get support themselves, no calls needed.", price: "from $4,480", timeline: "6–12 wks" },
          { num: "04", title: "Analytics dashboards", desc: "KPIs, funnels and real-time reports.", price: "from $5,360", timeline: "6–10 wks" },
          { num: "05", title: "B2B platforms", desc: "Catalog with pricing, orders, ERP integration.", price: "from $8,880", timeline: "10–18 wks" },
          { num: "06", title: "SaaS services", desc: "Subscriptions, multi-tenancy, room to grow.", price: "from $13,360", timeline: "12–24 wks" },
        ],
        href: "/webapp",
      },
      mobile: {
        fig: "03 / MOBILE", label: "Mobile",
        title: ["Your product,", "always at hand."],
        desc: "An app for customers or staff, on iOS and Android.",
        moreLabel: "Additional capabilities",
        more: "Push notifications, offline mode and store publishing — scoped to your task.",
        types: [
          { num: "01", title: "CRM / ERP (mobile)", desc: "Sell and manage on the go, works offline.", price: "from $4,240", timeline: "6–10 wks" },
          { num: "02", title: "Internal portal", desc: "News, requests and a knowledge base in one app.", price: "from $4,880", timeline: "8–12 wks" },
          { num: "03", title: "Customer account", desc: "Orders, payment and support without calling in.", price: "from $5,360", timeline: "8–14 wks" },
          { num: "04", title: "Analytics dashboard", desc: "Business metrics and alerts, anywhere in the world.", price: "from $3,760", timeline: "5–9 wks" },
          { num: "05", title: "B2B storefront", desc: "Priced catalog, scanner, sync with 1C.", price: "from $5,760", timeline: "8–14 wks" },
          { num: "06", title: "SaaS mobile app", desc: "Subscriptions, paywalls and onboarding in the stores.", price: "from $6,240", timeline: "10–16 wks" },
        ],
        href: "/mobile",
      },
      ai: {
        fig: "04 / INTELLIGENCE", label: "AI & automation",
        title: ["Intelligence that", "gets to work."],
        desc: "Chatbots, process automation and AI built into your products.",
        moreLabel: "Additional capabilities",
        more: "Connected to your own data and systems, tuned to the task — scoped individually.",
        types: [
          { num: "01", title: "AI chatbots & assistants", desc: "From simple FAQ bots to LLM-based assistants.", price: "on request" },
          { num: "02", title: "Process automation", desc: "Auto-handling requests, documents, lead scoring.", price: "on request" },
          { num: "03", title: "AI in existing products", desc: "Smart search, recommendations and analytics, built in.", price: "on request" },
          { num: "04", title: "AI analytics & forecasting", desc: "Predictive models, scoring and pattern detection in your data.", price: "on request" },
        ],
        href: "/ai",
      },
    },
  },
};

export default function HomeCapabilities() {
  const { locale } = useI18n();
  const lang: Lang = locale === "ru" ? "ru" : "en";
  const c = COPY[lang];
  const reduced = useReducedMotion();
  const titleId = useId();
  const [active, setActive] = useState<TabKey>("sites");
  const [moreOpen, setMoreOpen] = useState(false);
  const tab = c.tabs[active];
  const sectionRef = useRef<HTMLElement>(null);

  const selectTab = (key: TabKey) => {
    if (key === active) return;
    setActive(key);
    setMoreOpen(false);
  };

  // Legacy anchors (#webapp, #mobile, #ai) from other sections only ever had
  // #sites as a real id once the three blocks merged — pick the matching tab
  // and scroll here manually since the browser can't resolve those hashes.
  useEffect(() => {
    const hash = window.location.hash.replace("#", "") as TabKey;
    if (TAB_KEYS.includes(hash)) {
      setActive(hash);
      if (hash !== "sites") sectionRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, []);

  const fadeUp = (d = 0) => reduced ? {} : {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: d },
  };

  return (
    <section id="sites" ref={sectionRef} aria-labelledby={titleId}
      style={{ background: "transparent" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "clamp(72px,10svh,110px) clamp(20px,5vw,56px)" }}>

        {/* Header */}
        <motion.div {...(fadeUp(0) as object)}
          style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap", marginBottom: 48 }}>
          <div>
            <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: TEAL, marginBottom: 16 }}>
              {c.eyebrow}
            </p>
            <h2 id={titleId} className={serif.className}
              style={{ fontSize: "clamp(2rem,4.4vw,3.4rem)", fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.02em", color: WHITE, margin: 0 }}>
              {c.h1[0]}<br />{c.h1[1]}
            </h2>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(244,250,248,0.45)", maxWidth: 280 }}>
            {c.sub}
          </p>
        </motion.div>

        {/* Tab row */}
        <motion.div {...(fadeUp(0.08) as object)}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))", gap: 24, borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 24 }}>
          {TAB_KEYS.map((key) => {
            const t = c.tabs[key];
            const isActive = key === active;
            const Icon = TAB_ICONS[key];
            return (
              <button key={key} onClick={() => selectTab(key)} className="group"
                style={{ textAlign: "left", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                <p style={{ fontSize: 10, letterSpacing: "0.1em", color: "rgba(244,250,248,0.3)", marginBottom: 8 }}>
                  {t.fig}
                </p>
                <p style={{
                  display: "flex", alignItems: "center", gap: 8,
                  fontSize: 15, fontWeight: 600,
                  color: isActive ? WHITE : "rgba(244,250,248,0.5)",
                  marginBottom: 12, transition: "color 0.2s",
                }}>
                  <Icon size={15} className="transition-colors duration-200"
                    style={{ color: isActive ? TEAL : "rgba(244,250,248,0.3)" }} />
                  {t.label}
                </p>
                <div style={{ height: 2, borderRadius: 2, background: isActive ? TEAL : "rgba(255,255,255,0.1)", transition: "background 0.2s" }}
                  className={isActive ? undefined : "group-hover:!bg-white/25"} />
              </button>
            );
          })}
        </motion.div>

        {/* Active tab content */}
        <AnimatePresence mode="wait">
          <motion.div key={active}
            initial={reduced ? undefined : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: "grid", gap: "clamp(32px,6vw,80px)", paddingTop: 48 }}
            className="grid-cols-1 md:[grid-template-columns:minmax(0,1fr)_minmax(0,1fr)]"
          >
            {/* Left: title, desc, more */}
            <div>
              <h3 className={serif.className}
                style={{ fontSize: "clamp(1.5rem,2.6vw,2.1rem)", fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.015em", color: WHITE, margin: "0 0 16px" }}>
                {tab.title[0]}<br />{tab.title[1]}
              </h3>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: "rgba(244,250,248,0.55)", maxWidth: 360, marginBottom: 20 }}>
                {tab.desc}
              </p>
              <button onClick={() => setMoreOpen(v => !v)}
                style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: 13, color: "rgba(244,250,248,0.55)" }}>
                <span style={{ display: "inline-block", transition: "transform 0.2s", transform: moreOpen ? "rotate(0deg)" : "rotate(-90deg)", color: TEAL, fontSize: 10 }}>▾</span>
                {tab.moreLabel}
              </button>
              <AnimatePresence initial={false}>
                {moreOpen && (
                  <motion.div
                    initial={reduced ? undefined : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={reduced ? undefined : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    style={{ overflow: "hidden" }}
                  >
                    <p style={{ fontSize: 13, lineHeight: 1.6, color: "rgba(244,250,248,0.4)", maxWidth: 360, marginTop: 12 }}>
                      {tab.more}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <Link href={tab.href}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 28, fontSize: 13, fontWeight: 600, color: TEAL, textDecoration: "none" }}>
                {lang === "ru" ? "Подробнее о разделе" : "Explore this section"}
                <ArrowUpRight size={14} />
              </Link>
            </div>

            {/* Right: what we build — real types, not a generic process list */}
            <ul style={{
              listStyle: "none", margin: 0, padding: 0,
              display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "4px 20px",
              alignContent: "start",
            }}>
              {tab.types.map((item) => (
                <li key={item.title} className="hover:bg-white/[0.035]"
                  style={{
                    padding: "14px 12px", margin: "0 -12px", borderRadius: 10,
                    borderBottom: "1px solid rgba(255,255,255,0.07)",
                    transition: "background 0.2s",
                  }}>
                  <p style={{ display: "flex", alignItems: "baseline", gap: 8, fontSize: 14, fontWeight: 600, color: WHITE, margin: "0 0 4px" }}>
                    <span style={{ fontFamily: "monospace", fontSize: 10, color: TEAL, opacity: 0.6, flexShrink: 0 }}>
                      {item.num}
                    </span>
                    {item.title}
                  </p>
                  <p style={{ fontSize: 12.5, lineHeight: 1.5, color: "rgba(244,250,248,0.45)", margin: "0 0 8px", paddingLeft: 24 }}>
                    {item.desc}
                  </p>
                  {item.price && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, paddingLeft: 24 }}>
                      <span style={{
                        fontSize: 11, fontWeight: 600, color: TEAL,
                        background: "rgba(45,212,191,0.08)", border: "1px solid rgba(45,212,191,0.2)",
                        borderRadius: 6, padding: "2px 8px",
                      }}>
                        {item.price}
                      </span>
                      {item.timeline && (
                        <span style={{ fontSize: 11, color: "rgba(244,250,248,0.35)" }}>{item.timeline}</span>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
