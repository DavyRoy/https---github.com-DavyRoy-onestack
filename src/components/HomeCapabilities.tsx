"use client";
import { serif } from "@/lib/fonts";

import { useEffect, useId, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

const TEAL  = "#2dd4bf";
const WHITE = "#f4faf8";

type TabKey = "sites" | "webapp" | "mobile" | "ai";
const TAB_KEYS: TabKey[] = ["sites", "webapp", "mobile", "ai"];

type Lang = "ru" | "en";
type TypeItem = { num: string; title: string; desc: string; href: string };
type TabCopy = {
  fig: string;
  label: string;
  title: [string, string];
  desc: string;
  moreLabel: string;
  more: string;
  types: [TypeItem, TypeItem, TypeItem];
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
          { num: "01", title: "Лендинги", desc: "Одностраничный сайт с максимальной конверсией — для запусков, промо-кампаний и сбора заявок.", href: "/sites#landing" },
          { num: "02", title: "Корпоративные", desc: "Многостраничный сайт с CMS, блогом, вакансиями и полным управлением контентом без программиста.", href: "/sites#corporate" },
          { num: "03", title: "Интернет-магазины", desc: "Полноценная e-commerce платформа: каталог, онлайн-оплата, личный кабинет, управление заказами.", href: "/sites#ecommerce" },
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
          { num: "01", title: "CRM / ERP системы", desc: "Автоматизация продаж, управления клиентами и бизнес-процессами с аналитикой в реальном времени.", href: "/webapp#crm" },
          { num: "02", title: "SaaS платформы", desc: "Облачные сервисы с мультитенантностью, биллингом и масштабируемой архитектурой под любую нагрузку.", href: "/webapp#saas" },
          { num: "03", title: "Корпоративные порталы", desc: "Централизованные платформы для сотрудников: задачи, база знаний, внутренние коммуникации.", href: "/webapp#portal" },
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
          { num: "01", title: "Нативные приложения", desc: "iOS на Swift и Android на Kotlin — максимальная производительность и доступ к нативным API.", href: "/mobile#native" },
          { num: "02", title: "Кроссплатформенные", desc: "Единая кодовая база для iOS и Android на Flutter или React Native: быстрый выход на рынок.", href: "/mobile#cross" },
          { num: "03", title: "Маркетплейсы и сервисы", desc: "Мобильные продукты с онбордингом, in-app платежами, подписками и аналитикой.", href: "/mobile#product" },
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
          { num: "01", title: "AI-чат-боты и ассистенты", desc: "Диалоговые боты на сайт, в Telegram или мессенджеры — от простых FAQ до ассистентов на базе LLM.", href: "/ai#chatbots" },
          { num: "02", title: "Автоматизация процессов", desc: "Связка с CRM/ERP: авто-обработка заявок, генерация документов, скоринг лидов без ручной рутины.", href: "/ai#automation" },
          { num: "03", title: "Интеграция ИИ в продукты", desc: "Встраивание AI-функций в уже разработанные сайты и приложения: умный поиск, рекомендации, аналитика.", href: "/ai#integration" },
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
          { num: "01", title: "Landing pages", desc: "Single-page site with maximum conversion — for launches, promo campaigns and lead generation.", href: "/sites#landing" },
          { num: "02", title: "Corporate", desc: "Multi-page site with CMS, blog, vacancies and full content management without a developer.", href: "/sites#corporate" },
          { num: "03", title: "Online stores", desc: "Full e-commerce platform: catalog, online payments, user accounts, order management.", href: "/sites#ecommerce" },
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
          { num: "01", title: "CRM / ERP systems", desc: "Sales automation, customer management and business processes with real-time analytics.", href: "/webapp#crm" },
          { num: "02", title: "SaaS platforms", desc: "Cloud services with multi-tenancy, billing and scalable architecture for any load.", href: "/webapp#saas" },
          { num: "03", title: "Corporate portals", desc: "Centralized platforms for employees: tasks, knowledge base, internal communications.", href: "/webapp#portal" },
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
          { num: "01", title: "Native apps", desc: "iOS on Swift and Android on Kotlin — top performance and full access to native APIs.", href: "/mobile#native" },
          { num: "02", title: "Cross-platform", desc: "One codebase for iOS and Android with Flutter or React Native: fast time-to-market.", href: "/mobile#cross" },
          { num: "03", title: "Marketplaces & services", desc: "Mobile products with onboarding, in-app payments, subscriptions and analytics.", href: "/mobile#product" },
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
          { num: "01", title: "AI chatbots & assistants", desc: "Conversational bots for your site, Telegram or messengers — from simple FAQ to LLM-based assistants.", href: "/ai#chatbots" },
          { num: "02", title: "Process automation", desc: "Connected to CRM/ERP: auto-handling requests, generating documents, scoring leads without manual work.", href: "/ai#automation" },
          { num: "03", title: "AI in existing products", desc: "Adding AI features to websites and apps you already have: smart search, recommendations, analytics.", href: "/ai#integration" },
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
            return (
              <button key={key} onClick={() => selectTab(key)}
                style={{ textAlign: "left", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                <p style={{ fontSize: 10, letterSpacing: "0.1em", color: "rgba(244,250,248,0.3)", marginBottom: 8 }}>
                  {t.fig}
                </p>
                <p style={{
                  fontSize: 15, fontWeight: 600,
                  color: isActive ? WHITE : "rgba(244,250,248,0.5)",
                  marginBottom: 12, transition: "color 0.2s",
                }}>
                  {t.label}
                </p>
                <div style={{ height: 2, borderRadius: 2, background: isActive ? TEAL : "rgba(255,255,255,0.1)", transition: "background 0.2s" }} />
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
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column" }}>
              {tab.types.map((item, i) => (
                <li key={item.title} style={{
                  borderBottom: i < tab.types.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none",
                }}>
                  <Link href={item.href} className="group"
                    style={{
                      display: "flex", alignItems: "flex-start", gap: 16, padding: "18px 4px",
                      textDecoration: "none", borderRadius: 10, transition: "background 0.2s",
                    }}>
                    <span style={{ fontFamily: "monospace", fontSize: 11, color: TEAL, opacity: 0.6, paddingTop: 3, flexShrink: 0 }}>
                      {item.num}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 15, fontWeight: 600, color: WHITE, margin: "0 0 4px" }}>
                        {item.title}
                        <ArrowUpRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          style={{ color: TEAL, flexShrink: 0 }} />
                      </p>
                      <p style={{ fontSize: 13, lineHeight: 1.55, color: "rgba(244,250,248,0.45)", margin: 0 }}>
                        {item.desc}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
