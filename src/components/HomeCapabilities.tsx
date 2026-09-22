"use client";
import { serif } from "@/lib/fonts";

import { useEffect, useId, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

const BG    = "#07100e";
const TEAL  = "#2dd4bf";
const WHITE = "#f4faf8";

type TabKey = "sites" | "webapp" | "mobile" | "ai";
const TAB_KEYS: TabKey[] = ["sites", "webapp", "mobile", "ai"];

type Lang = "ru" | "en";
type TabCopy = {
  fig: string;
  label: string;
  title: [string, string];
  desc: string;
  moreLabel: string;
  more: string;
  scope: [string, string, string, string];
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
        scope: ["Структура и дизайн", "Разработка и управление контентом", "Формы и базовая аналитика", "Проверка и запуск"],
        href: "/sites",
      },
      webapp: {
        fig: "02 / APPLICATIONS", label: "Веб-приложения",
        title: ["Процессы в одной", "системе."],
        desc: "Объедините данные, клиентов и работу команды.",
        moreLabel: "Дополнительные возможности",
        more: "Интеграции с 1С, платежами и внешними сервисами. Состав согласуем до разработки.",
        scope: ["Сценарии и прототип", "Интерфейс и бизнес-логика", "Роли и права доступа", "Тестирование и развёртывание"],
        href: "/webapp",
      },
      mobile: {
        fig: "03 / MOBILE", label: "Мобильные",
        title: ["Продукт всегда", "рядом."],
        desc: "Приложение для клиентов или сотрудников на iOS и Android.",
        moreLabel: "Дополнительные возможности",
        more: "Push-уведомления, офлайн-режим и публикация в сторах — под вашу задачу.",
        scope: ["Сценарии и дизайн экранов", "Мобильное приложение", "Подключение к серверу", "Подготовка к публикации"],
        href: "/mobile",
      },
      ai: {
        fig: "04 / INTELLIGENCE", label: "AI и автоматизация",
        title: ["Интеллект, который", "работает."],
        desc: "Чат-боты, автоматизация процессов и интеграция ИИ в ваши продукты.",
        moreLabel: "Дополнительные возможности",
        more: "Подключение к вашим данным и системам, обучение под задачу — обсуждаем индивидуально.",
        scope: ["Сценарий и архитектура", "AI-ассистенты и чат-боты", "Автоматизация процессов", "Тестирование и запуск"],
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
        scope: ["Structure and design", "Build and content management", "Forms and basic analytics", "QA and launch"],
        href: "/sites",
      },
      webapp: {
        fig: "02 / APPLICATIONS", label: "Web apps",
        title: ["Every process, one", "system."],
        desc: "Bring your data, customers and team workflow together.",
        moreLabel: "Additional capabilities",
        more: "Integrations with 1C, payments and external services. Scope agreed before development.",
        scope: ["Scenarios and prototype", "Interface and business logic", "Roles and access rights", "Testing and deployment"],
        href: "/webapp",
      },
      mobile: {
        fig: "03 / MOBILE", label: "Mobile",
        title: ["Your product,", "always at hand."],
        desc: "An app for customers or staff, on iOS and Android.",
        moreLabel: "Additional capabilities",
        more: "Push notifications, offline mode and store publishing — scoped to your task.",
        scope: ["Scenarios and screen design", "Mobile app", "Server connection", "Store submission"],
        href: "/mobile",
      },
      ai: {
        fig: "04 / INTELLIGENCE", label: "AI & automation",
        title: ["Intelligence that", "gets to work."],
        desc: "Chatbots, process automation and AI built into your products.",
        moreLabel: "Additional capabilities",
        more: "Connected to your own data and systems, tuned to the task — scoped individually.",
        scope: ["Scenario and architecture", "AI assistants and chatbots", "Process automation", "Testing and launch"],
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
      style={{ background: BG, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
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

            {/* Right: scope checklist */}
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column" }}>
              {tab.scope.map((item, i) => (
                <li key={i} style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "16px 0",
                  borderBottom: i < tab.scope.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none",
                }}>
                  <ArrowUpRight size={15} style={{ color: TEAL, flexShrink: 0 }} />
                  <span style={{ fontSize: 14, color: "rgba(244,250,248,0.75)" }}>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
