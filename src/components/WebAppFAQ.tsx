// src/components/WebAppFAQ.tsx
"use client";
import { serif } from "@/lib/fonts";

import { useCallback, useEffect, useId, useMemo, useState, memo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Plus, Minus, Mail, Phone } from "lucide-react";
import { siteUrl } from "@/app/seo.config";
import { useI18n } from "@/i18n/I18nProvider";


const BG    = "#07100e";
const TEAL  = "#2dd4bf";
const WHITE = "#f4faf8";

type QA    = { q: string; a: string; tag: string };
type Group = { title: string; items: QA[] };

const GROUPS_RU: Group[] = [
  {
    title: "Стоимость разработки",
    items: [
      { q: "Сколько стоит разработка веб-приложения и от чего зависит цена?", tag: "Цена",
        a: "Стоимость зависит от сложности проекта, функциональных требований и интеграций. Мы предлагаем индивидуальный расчёт после изучения требований — используйте калькулятор на этой странице для предварительной оценки." },
      { q: "Есть ли фиксированная смета и как устроены платежи?", tag: "Оплата",
        a: "Да, работаем по фиксированной смете. Оплата разбивается на этапы: аванс, MVP и релиз. Все изменения согласовываются дополнительно." },
    ],
  },
  {
    title: "Сроки разработки",
    items: [
      { q: "Какие сроки разработки MVP и полного продукта?", tag: "Время",
        a: "Рабочий MVP — за 4–8 недель. Полнофункциональный продукт с интеграциями — 8–24 недели в зависимости от типа и сложности: личный кабинет 6–12 нед, CRM/аналитика 8–16 нед, корпоративный портал или SaaS 12–24 нед." },
      { q: "Как ускорить запуск без потери качества?", tag: "Ускорение",
        a: "Используем готовые компоненты и дизайн-систему, фокусируемся на ключевых сценариях и применяем итеративный подход с двухнедельными спринтами." },
    ],
  },
  {
    title: "Архитектура",
    items: [
      { q: "Какую архитектуру вы рекомендуете для проекта?", tag: "Структура",
        a: "Стартуем с модульного монолита для быстрого запуска, переходим к микросервисной архитектуре по мере роста проекта и команды." },
      { q: "Когда стоит переходить на микросервисы?", tag: "Масштаб",
        a: "При необходимости независимого масштабирования модулей, разных темпах разработки компонентов или при команде более 6–8 разработчиков." },
    ],
  },
  {
    title: "Безопасность",
    items: [
      { q: "Какие меры безопасности вы применяете?", tag: "Защита",
        a: "Используем RBAC для управления доступом, защищаем API rate-limiting и валидацией, проводим аудит зависимостей и следуем OWASP Top 10." },
      { q: "Проводите ли вы аудит безопасности?", tag: "Аудит",
        a: "Да — внутренний аудит, статический анализ кода и проверка критических функциональных потоков входят в стандартный процесс." },
    ],
  },
  {
    title: "Интеграции",
    items: [
      { q: "С какими системами можно интегрировать приложение?", tag: "API",
        a: "Интегрируем с CRM, платёжными шлюзами (ЮKassa, Stripe), системами учёта, почтовыми сервисами и любыми внешними API через REST/GraphQL." },
      { q: "Как обеспечиваете надёжность интеграций?", tag: "Надёжность",
        a: "Используем очереди сообщений, повторные попытки (retry), мониторинг и изоляцию сбоев — интеграции не роняют основное приложение." },
    ],
  },
  {
    title: "Производительность",
    items: [
      { q: "Как обеспечиваете производительность приложения?", tag: "Оптимизация",
        a: "Кэширование (Redis), оптимизация запросов к БД, пагинация и CDN. Целевой P95 latency — менее 200 мс." },
      { q: "Какие метрики производительности отслеживаете?", tag: "Метрики",
        a: "Время ответа, throughput, потребление CPU/памяти, uptime (SLA 99.9%) и Core Web Vitals — через Grafana/Datadog." },
    ],
  },
  {
    title: "Поддержка и права",
    items: [
      { q: "Предоставляете ли поддержку после запуска?", tag: "Поддержка",
        a: "Да — базовый (патчи и мониторинг) и Pro (SLA, оперативное устранение инцидентов). Подробности в разделе калькулятора." },
      { q: "Кому принадлежат права на код?", tag: "Права",
        a: "Права на исходный код и все артефакты передаются заказчику в полном объёме после завершения проекта." },
    ],
  },
  {
    title: "Конфиденциальность и процесс",
    items: [
      { q: "Можно ли подписать NDA?", tag: "NDA",
        a: "Да, подписываем соглашение о неразглашении до начала обсуждения проекта." },
      { q: "Как организован процесс разработки?", tag: "Процесс",
        a: "Спринты 1–2 недели, демо после каждого, CI/CD с preview-окружениями для проверки функциональности до выхода в прод." },
    ],
  },
];

const GROUPS_EN: Group[] = [
  {
    title: "Development cost",
    items: [
      { q: "How much does web app development cost?", tag: "Price",
        a: "Cost depends on project complexity, functional requirements, and integrations. We provide an individual estimate after reviewing your requirements — use the calculator on this page for a preliminary assessment." },
      { q: "Is there a fixed estimate and how do payments work?", tag: "Payment",
        a: "Yes, we work with a fixed estimate. Payment is split into stages: advance, MVP, and release. All changes are agreed upon separately." },
    ],
  },
  {
    title: "Development timeline",
    items: [
      { q: "What are the timelines for MVP and full product?", tag: "Time",
        a: "A working MVP takes 4–8 weeks. A fully functional product with integrations takes 8–24 weeks depending on type and complexity: user portal 6–12 wks, CRM/analytics 8–16 wks, corporate portal or SaaS 12–24 wks." },
      { q: "How to speed up launch without losing quality?", tag: "Speed",
        a: "We use ready-made components and a design system, focus on key scenarios, and apply an iterative approach with two-week sprints." },
    ],
  },
  {
    title: "Architecture",
    items: [
      { q: "What architecture do you recommend?", tag: "Structure",
        a: "We start with a modular monolith for fast launch, then move to microservices as the project and team grow." },
      { q: "When should you switch to microservices?", tag: "Scaling",
        a: "When you need to scale modules independently, have different development paces for components, or have a team of 6+ developers." },
    ],
  },
  {
    title: "Security",
    items: [
      { q: "What security measures do you apply?", tag: "Security",
        a: "We use RBAC for access control, protect APIs with rate-limiting and validation, conduct dependency audits, and follow OWASP Top 10." },
      { q: "Do you conduct security audits?", tag: "Audit",
        a: "Yes — internal audit, static code analysis, and review of critical functional flows are part of the standard process." },
    ],
  },
  {
    title: "Integrations",
    items: [
      { q: "What systems can be integrated?", tag: "API",
        a: "We integrate with CRMs, payment gateways (YooKassa, Stripe), accounting systems, email services, and any external APIs via REST/GraphQL." },
      { q: "How do you ensure integration reliability?", tag: "Reliability",
        a: "We use message queues, retries, monitoring, and fault isolation — integrations won't take down the main application." },
    ],
  },
  {
    title: "Performance",
    items: [
      { q: "How do you ensure app performance?", tag: "Performance",
        a: "Caching (Redis), query optimization, pagination, and CDN. Target P95 latency — under 200 ms." },
      { q: "What performance metrics do you track?", tag: "Metrics",
        a: "Response time, throughput, CPU/memory usage, uptime (99.9% SLA), and Core Web Vitals — via Grafana/Datadog." },
    ],
  },
  {
    title: "Support & IP rights",
    items: [
      { q: "Do you provide post-launch support?", tag: "Support",
        a: "Yes — Basic (patches and monitoring) and Pro (SLA, rapid incident resolution). Details in the calculator section." },
      { q: "Who owns the code?", tag: "IP",
        a: "Full IP rights to the source code and all artifacts are transferred to the client upon project completion." },
    ],
  },
  {
    title: "Confidentiality & process",
    items: [
      { q: "Can we sign an NDA?", tag: "NDA",
        a: "Yes, we sign a non-disclosure agreement before starting project discussions." },
      { q: "How is the development process organized?", tag: "Process",
        a: "1–2 week sprints, demo after each, CI/CD with preview environments to verify functionality before production." },
    ],
  },
];

const ORG = {
  email:     "info@onestack24.ru",
  phone:     "+7 (910) 948 61 06",
  phoneHref: "tel:+79109486106",
};

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════════════════════════════════ */
export default function WebAppFAQ() {
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
    name: "Вопросы о разработке веб-приложений | OneStack",
    url: `${siteUrl}/webapp#faq`,
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
      <script id="ld-webapp-faq" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section
        id="faq"
        aria-labelledby={titleId}
        style={{ background: BG, borderTop: "1px solid rgba(255,255,255,0.06)", position: "relative", overflow: "hidden" }}
        itemScope
        itemType="https://schema.org/FAQPage"
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
                    const key     = `${gi}-${ii}`;
                    const isOpen  = open === key;
                    const btnId   = `${baseId}-q-${key}`;
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
