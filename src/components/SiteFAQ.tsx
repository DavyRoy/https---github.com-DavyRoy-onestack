// src/components/SiteFAQ.tsx
"use client";
import { serif } from "@/lib/fonts";

import { useCallback, useEffect, useId, useMemo, useState, memo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Plus, Minus, Mail, Phone } from "lucide-react";
import Script from "next/script";
import { siteUrl } from "@/app/seo.config";
import { useI18n } from "@/i18n/I18nProvider";


const BG   = "#07100e";
const TEAL = "#2dd4bf";
const WHITE = "#f4faf8";

type QA    = { q: string; a: string; tag: string };
type Group = { title: string; items: QA[] };

const GROUPS_RU: Group[] = [
  {
    title: "Стоимость и оплата",
    items: [
      { q: "Сколько стоит разработка сайта?", tag: "Цена",
        a: "Стоимость зависит от типа, объёма и функциональности: визитка — от 80 000 ₽, лендинг — от 150 000 ₽, портфолио — от 120 000 ₽, информационный — от 280 000 ₽, корпоративный — от 420 000 ₽, интернет-магазин — от 720 000 ₽. Точный расчёт — после брифа." },
      { q: "Есть ли фиксированная смета?", tag: "Оплата",
        a: "Да, работаем по фиксированной смете. Оплата делится на этапы: аванс, сдача дизайна, релиз. Все изменения вне ТЗ согласуются отдельно." },
    ],
  },
  {
    title: "Сроки и процесс",
    items: [
      { q: "Какие сроки разработки?", tag: "Время",
        a: "Лендинг — 1–2 недели, сайт-визитка — 1–3 недели, корпоративный — 3–6 недель, интернет-магазин — 4–8 недель. Работаем итерациями с демо каждые 1–2 недели." },
      { q: "Как ускорить запуск без потери качества?", tag: "MVP",
        a: "Используем готовые паттерны, дизайн-систему и CI/CD-пайплайн с первого дня. Фокусируемся на ключевых сценариях — остальное доделываем в следующих итерациях." },
    ],
  },
  {
    title: "Технологии и архитектура",
    items: [
      { q: "На каком стеке разрабатываете?", tag: "Стек",
        a: "Next.js (React), TypeScript, Tailwind CSS, PostgreSQL или любая headless CMS. Выбираем инструменты под задачу, не навязываем тяжёлое решение там, где оно не нужно." },
      { q: "Будет ли сайт быстро работать?", tag: "Performance",
        a: "SSR/SSG, агрессивный кеш, CDN, оптимизация изображений. Core Web Vitals стабильно в зелёной зоне — это напрямую влияет на позиции в Google." },
    ],
  },
  {
    title: "SEO и продвижение",
    items: [
      { q: "Оптимизируете сайт под поисковики?", tag: "SEO",
        a: "Да: семантическая разметка, мета-теги, Schema.org, sitemap, robots.txt, Core Web Vitals. Опционально — расширенный SEO-аудит и контентные рекомендации." },
      { q: "Подходит ли сайт для продвижения в Яндекс и Google?", tag: "Поиск",
        a: "Технически — да. Быстрая загрузка, правильная структура URL, микроразметка и доступность — всё это учитываем на этапе разработки." },
    ],
  },
  {
    title: "Интеграции и безопасность",
    items: [
      { q: "Можно подключить CRM, оплату, доставку?", tag: "Интеграции",
        a: "Да. Интегрируем с любыми внешними API: ЮKassa, Stripe, СДЭК, 1С, Bitrix24, amoCRM, почтовыми сервисами. Используем очереди и изоляцию сбоев для надёжности." },
      { q: "Как обеспечивается безопасность?", tag: "Защита",
        a: "RBAC, защита API, валидация на сервере, регулярные обновления зависимостей, статический анализ кода. При необходимости — аудит безопасности." },
    ],
  },
  {
    title: "Поддержка и права",
    items: [
      { q: "Что происходит после запуска?", tag: "Поддержка",
        a: "Предлагаем пакеты поддержки: от базового мониторинга до полного технического сопровождения с SLA. Мониторинг 24/7, алерты, патчи и план развития." },
      { q: "Кому принадлежит код и можно ли подписать NDA?", tag: "Права",
        a: "Права на код и все артефакты передаются вам после завершения проекта. NDA подписываем до начала обсуждения." },
    ],
  },
];

const GROUPS_EN: Group[] = [
  {
    title: "Cost and payment",
    items: [
      { q: "How much does website development cost?", tag: "Price",
        a: "The cost depends on type, scope and functionality: business card — from ₽80k, landing — from ₽150k, portfolio — from ₽120k, informational — from ₽280k, corporate — from ₽420k, e-commerce — from ₽720k. Exact estimate after the brief." },
      { q: "Is there a fixed estimate?", tag: "Payment",
        a: "Yes, we work with a fixed estimate. Payment is split into stages: advance, design delivery, release. All changes outside the spec are agreed separately." },
    ],
  },
  {
    title: "Timeline and process",
    items: [
      { q: "What are the development timelines?", tag: "Time",
        a: "Landing — 1–2 weeks, business card — 1–3 weeks, corporate — 3–6 weeks, e-commerce — 4–8 weeks. We work in iterations with demos every 1–2 weeks." },
      { q: "How to speed up launch without sacrificing quality?", tag: "MVP",
        a: "We use ready patterns, a design system and a CI/CD pipeline from day one. We focus on core scenarios — the rest is refined in subsequent iterations." },
    ],
  },
  {
    title: "Technologies and architecture",
    items: [
      { q: "What tech stack do you use?", tag: "Stack",
        a: "Next.js (React), TypeScript, Tailwind CSS, PostgreSQL or any headless CMS. We choose tools for the task, we don't impose heavy solutions where they're not needed." },
      { q: "Will the site be fast?", tag: "Performance",
        a: "SSR/SSG, aggressive cache, CDN, image optimisation. Core Web Vitals stably in the green zone — this directly affects Google rankings." },
    ],
  },
  {
    title: "SEO and promotion",
    items: [
      { q: "Do you optimise for search engines?", tag: "SEO",
        a: "Yes: semantic markup, meta tags, Schema.org, sitemap, robots.txt, Core Web Vitals. Optionally — extended SEO audit and content recommendations." },
      { q: "Is the site suitable for Yandex and Google promotion?", tag: "Search",
        a: "Technically — yes. Fast loading, correct URL structure, microdata and accessibility — all taken into account during development." },
    ],
  },
  {
    title: "Integrations and security",
    items: [
      { q: "Can you connect CRM, payments, delivery?", tag: "Integrations",
        a: "Yes. We integrate with any external APIs: Stripe, YooKassa, delivery services, ERP, amoCRM, email services. We use queues and fault isolation for reliability." },
      { q: "How is security ensured?", tag: "Security",
        a: "RBAC, API protection, server-side validation, regular dependency updates, static code analysis. Security audit on request." },
    ],
  },
  {
    title: "Support and rights",
    items: [
      { q: "What happens after launch?", tag: "Support",
        a: "We offer support packages: from basic monitoring to full technical support with SLA. 24/7 monitoring, alerts, patches and a development roadmap." },
      { q: "Who owns the code and can we sign an NDA?", tag: "Rights",
        a: "Rights to the code and all artefacts are transferred to you after project completion. We sign an NDA before any discussion begins." },
    ],
  },
];

const ORG = {
  email: "info@onestack24.ru",
  phone: "+7 (910) 948 61 06",
  phoneHref: "tel:+79109486106",
};

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════════════════════════════════ */
export default function SiteFAQ() {
  const { locale } = useI18n();
  const isEn = locale === "en";
  const GROUPS = isEn ? GROUPS_EN : GROUPS_RU;
  const [open,     setOpen]     = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const baseId  = useId();
  const titleId = useId();
  const reduced = useReducedMotion();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const allQAs = useMemo(() => GROUPS.flatMap(g => g.items), [GROUPS]);

  const jsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: `${siteUrl}/sites#faq`,
    mainEntity: allQAs.map(item => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
    publisher: { "@type": "Organization", name: "OneStack", url: siteUrl },
  }), [allQAs]);

  const toggle = useCallback((key: string) => {
    setOpen(s => s === key ? null : key);
  }, []);

  const fadeUp = (d = 0) => reduced ? {} : {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: d },
  };

  return (
    <>
      <Script id="ld-sites-faq" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section
        id="faq"
        aria-labelledby={titleId}
        style={{ background: BG, borderTop: "1px solid rgba(255,255,255,0.06)", position: "relative", overflow: "hidden" }}
      >
        {/* Ambient glow */}
        <div aria-hidden style={{
          pointerEvents: "none", position: "absolute", bottom: -160, left: -160,
          width: 480, height: 480, borderRadius: "50%",
          background: TEAL, opacity: 0.06, willChange: "transform", transform: "translateZ(0)", filter: "blur(160px)",
        }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: isMobile ? "0 20px" : "0 40px", position: "relative", zIndex: 1 }}>

          {/* ── Header ── */}
          <motion.div {...(fadeUp(0) as object)} style={{ padding: isMobile ? "80px 0 60px" : "110px 0 72px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ height: 2, width: 20, background: TEAL, borderRadius: 2, flexShrink: 0 }} />
              <span style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 500, color: TEAL }}>
                {isEn ? "FAQ" : "Вопросы и ответы"}
              </span>
            </div>

            <div style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "flex-start" : "flex-end",
              justifyContent: "space-between",
              gap: 24,
            }}>
              <h2
                id={titleId}
                className={serif.className}
                style={{ margin: 0, fontWeight: 400, lineHeight: 0.92, letterSpacing: "-0.04em" }}
              >
                <span style={{ display: "block", fontSize: "clamp(2.4rem, 6vw, 6rem)", color: TEAL }}>
                  {isEn ? "Frequently" : "Частые"}
                </span>
                <span style={{ display: "block", fontSize: "clamp(2.4rem, 6vw, 6rem)", color: WHITE }}>
                  {isEn ? "asked questions" : "вопросы"}
                </span>
              </h2>

              <div style={{ display: "flex", flexDirection: "column", alignItems: isMobile ? "flex-start" : "flex-end", gap: 12 }}>
                <p style={{ margin: 0, fontSize: 13, color: "rgba(244,250,248,0.4)" }}>
                  {isEn ? "Didn't find an answer? Ask directly:" : "Не нашли ответ? Спросите напрямую:"}
                </p>
                <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 12 }}>
                  <ContactLink icon={<Mail size={13} />} value={ORG.email} href={`mailto:${ORG.email}`} />
                  <ContactLink icon={<Phone size={13} />} value={ORG.phone} href={ORG.phoneHref} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Accordion groups ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {GROUPS.map((group, gi) => (
              <motion.div
                key={group.title}
                {...(fadeUp(0.04 * gi) as object)}
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
              >
                {/* Group label row */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: isMobile ? "20px 0 14px" : "24px 0 16px",
                }}>
                  <span style={{ fontFamily: "monospace", fontSize: 10, color: TEAL, opacity: 0.6 }}>
                    {String(gi + 1).padStart(2, "0")}
                  </span>
                  <span style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(244,250,248,0.3)", fontWeight: 500 }}>
                    {group.title}
                  </span>
                </div>

                {/* Items */}
                <div>
                  {group.items.map((item, ii) => {
                    const key = `${gi}-${ii}`;
                    const isOpen = open === key;
                    const btnId  = `${baseId}-q-${key}`;
                    const panelId = `${baseId}-panel-${key}`;

                    return (
                      <article
                        key={key}
                        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
                        itemScope itemProp="mainEntity" itemType="https://schema.org/Question"
                      >
                        <button
                          id={btnId}
                          onClick={() => toggle(key)}
                          aria-expanded={isOpen}
                          aria-controls={panelId}
                          style={{
                            display: "flex", width: "100%", alignItems: "center",
                            justifyContent: "space-between", gap: 16,
                            padding: isMobile ? "16px 0" : "20px 0",
                            background: "none", border: "none", cursor: "pointer", textAlign: "left",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
                            {/* Tag chip */}
                            <span style={{
                              fontSize: 9, fontWeight: 600, letterSpacing: "0.14em",
                              textTransform: "uppercase", padding: "3px 9px", borderRadius: 99,
                              flexShrink: 0, transition: "all 0.2s",
                              background: isOpen ? `${TEAL}18` : "rgba(255,255,255,0.03)",
                              border: `1px solid ${isOpen ? TEAL + "40" : "rgba(255,255,255,0.08)"}`,
                              color: isOpen ? TEAL : "rgba(244,250,248,0.3)",
                            }}>
                              {item.tag}
                            </span>
                            {/* Question */}
                            <span
                              style={{
                                fontSize: isMobile ? 13 : 14, fontWeight: 500, transition: "color 0.2s",
                                color: isOpen ? WHITE : "rgba(244,250,248,0.7)",
                              }}
                              itemProp="name"
                            >
                              {item.q}
                            </span>
                          </div>

                          {/* Plus/Minus icon */}
                          <span
                            aria-hidden
                            style={{
                              display: "flex", alignItems: "center", justifyContent: "center",
                              width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                              transition: "all 0.2s",
                              background: isOpen ? `${TEAL}18` : "rgba(255,255,255,0.04)",
                              border: `1px solid ${isOpen ? TEAL + "40" : "rgba(255,255,255,0.1)"}`,
                              color: isOpen ? TEAL : "rgba(244,250,248,0.4)",
                            }}
                          >
                            {isOpen ? <Minus size={13} /> : <Plus size={13} />}
                          </span>
                        </button>

                        {/* Answer */}
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              id={panelId}
                              role="region"
                              aria-labelledby={btnId}
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: reduced ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
                              style={{ overflow: "hidden" }}
                              itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer"
                            >
                              <p
                                style={{
                                  margin: 0, paddingBottom: 20,
                                  paddingLeft: isMobile ? 0 : 88,
                                  paddingRight: isMobile ? 0 : 48,
                                  fontSize: isMobile ? 13 : 14, lineHeight: 1.75,
                                  color: "rgba(244,250,248,0.45)",
                                }}
                                itemProp="text"
                              >
                                {item.a}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </article>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>

          <div style={{ height: isMobile ? 80 : 110 }} />
        </div>
      </section>
    </>
  );
}

/* ── ContactLink ──────────────────────────────────────────────────────────── */
const ContactLink = memo(function ContactLink({ icon, value, href }: {
  icon: React.ReactNode; value: string; href: string;
}) {
  return (
    <a
      href={href}
      style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, color: "rgba(244,250,248,0.45)", textDecoration: "none", transition: "color 0.2s" }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = TEAL}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(244,250,248,0.45)"}
    >
      <span style={{ color: "rgba(244,250,248,0.25)" }}>{icon}</span>
      {value}
    </a>
  );
});
