// src/components/MobileFAQ.tsx
"use client";
import { serif } from "@/lib/fonts";

import { memo, useCallback, useId, useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Script from "next/script";
import { Plus, Minus } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { siteName, siteUrl } from "@/app/seo.config";


const TEAL  = "#2dd4bf";
const WHITE = "#f4faf8";
const BG    = "#07100e";

/* ─── Types ──────────────────────────────────────────────────────────────── */
type QA = { q: string; a: string; tag: string };
type Group = { title: string; items: QA[] };

/* ─── Data ───────────────────────────────────────────────────────────────── */
const GROUPS_RU: Group[] = [
  {
    title: "Стоимость разработки",
    items: [
      {
        tag: "Бюджет",
        q: "Сколько стоит разработка мобильного приложения?",
        a: "Стоимость зависит от платформ, функциональности и сложности. MVP на React Native — от 300 тыс. ₽. Полноценное приложение для iOS и Android — от 700 тыс. ₽. Смету с детализацией по экранам и API подготовим бесплатно после брифа.",
      },
      {
        tag: "Смета",
        q: "Что входит в стоимость и меняется ли цена в процессе?",
        a: "В смету включены: дизайн-система, разработка по спринтам, QA, публикация в App Store и Google Play, документация. Цена фиксируется до старта. Изменения в скоп обсуждаются отдельно через ченч-реквест с обоснованием.",
      },
    ],
  },
  {
    title: "Платформы и сроки",
    items: [
      {
        tag: "Платформы",
        q: "Вы делаете только React Native или нативную разработку?",
        a: "Мы работаем с React Native (единая кодовая база для iOS и Android), Flutter, а также нативным Swift и Kotlin. Выбор стека зависит от требований к производительности, анимациям и платформенным API — рекомендуем после аудита задачи.",
      },
      {
        tag: "Сроки",
        q: "Сколько времени занимает разработка приложения?",
        a: "MVP с базовым функционалом — 4–8 недель. Полноценное приложение с бэкендом, авторизацией и публикацией — 8–16 недель. Работаем спринтами по 2 недели: в конце каждого вы получаете демо и вносите правки.",
      },
    ],
  },
  {
    title: "Публикация и сторы",
    items: [
      {
        tag: "App Store",
        q: "Вы берёте на себя публикацию в App Store и Google Play?",
        a: "Да, публикация входит в работу: подготовка метаданных, скриншотов, описаний на русском и английском, прохождение ревью Apple и Google. Помогаем с регистрацией аккаунтов разработчика и устраняем причины отказов.",
      },
      {
        tag: "Ревью",
        q: "Что делать, если Apple или Google отклонят приложение?",
        a: "Отклонения при первой публикации — норма. Мы анализируем причину, исправляем замечания и повторно отправляем. Поддержка ревью-процесса включена в стоимость. В сложных случаях помогаем с апелляцией и коммуникацией с сапортом платформ.",
      },
    ],
  },
  {
    title: "Бэкенд и интеграции",
    items: [
      {
        tag: "Бэкенд",
        q: "Вы разрабатываете серверную часть или только мобильное приложение?",
        a: "Разрабатываем полный стек: REST/GraphQL API, авторизацию, базы данных, очереди задач, хранилище файлов. Можем также подключиться к уже готовому бэкенду — интегрируем через Swagger/OpenAPI или по вашей документации.",
      },
      {
        tag: "Интеграции",
        q: "Какие интеграции вы умеете подключать?",
        a: "Платёжные системы (ЮKassa, Stripe, CloudPayments), маркетплейсы, CRM, мессенджеры, пуш-уведомления (APNs, FCM), геолокацию, карты (Яндекс, Google, MapKit), аналитику (Amplitude, Firebase, AppMetrica) и нотариальные ЭДО.",
      },
    ],
  },
  {
    title: "Оффлайн и перформанс",
    items: [
      {
        tag: "Оффлайн",
        q: "Можно ли сделать приложение работающим без интернета?",
        a: "Да. Проектируем оффлайн-режим с локальными базами данных (SQLite, Realm, MMKV), фоновой синхронизацией и очередями операций. При восстановлении соединения данные синхронизируются автоматически с разрешением конфликтов.",
      },
      {
        tag: "Перформанс",
        q: "Как вы обеспечиваете быстроту и плавность приложения?",
        a: "Используем нативные анимации (Reanimated 3, Lottie), lazy-loading экранов, оптимизацию списков (FlashList), кэширование изображений и API-ответов. Профилируем через Flipper, Xcode Instruments и Android Profiler — устраняем джанки и утечки памяти.",
      },
    ],
  },
  {
    title: "Аналитика и монетизация",
    items: [
      {
        tag: "Аналитика",
        q: "Как подключить аналитику событий к приложению?",
        a: "Настраиваем ивент-трекинг через Amplitude, Firebase Analytics, AppMetrica или Mixpanel. Покрываем ключевые воронки: регистрацию, онбординг, покупки, ретеншн. Дашборды и кастомные события — по вашему ТЗ или продуктовым гипотезам.",
      },
      {
        tag: "Монетизация",
        q: "Какие модели монетизации вы можете реализовать?",
        a: "Инапп-покупки, подписки, freemium, пейволлы, рекламные сети (AdMob, Яндекс.РСЯ). Интегрируем RevenueCat для управления подписками с аналитикой LTV и churn. Каждая модель требует отдельной проработки — обсудим на старте.",
      },
    ],
  },
  {
    title: "Безопасность и релизы",
    items: [
      {
        tag: "Безопасность",
        q: "Как защищены данные пользователей в приложении?",
        a: "Шифруем данные на устройстве (Keychain, Keystore), используем pinning TLS-сертификатов, OWASP Mobile Top 10 как чеклист. Авторизация через JWT + refresh-токены, биометрия (Face ID, Touch ID). При необходимости проводим пентест перед релизом.",
      },
      {
        tag: "Релизы",
        q: "Как устроен процесс обновлений после запуска?",
        a: "Настраиваем CI/CD (Fastlane, GitHub Actions) для автоматической сборки и публикации. OTA-обновления через Expo Updates или CodePush (для React Native) позволяют обновить JS-бандл без ревью в сторах. Мажорные релизы проходят полное QA.",
      },
    ],
  },
  {
    title: "Процессы и поддержка",
    items: [
      {
        tag: "Процесс",
        q: "Как организована работа и как я буду видеть прогресс?",
        a: "Работаем по Scrum с двухнедельными спринтами. Вы получаете доступ к Jira/Linear, ежедневные стендапы в Telegram, демо в конце спринта на реальном устройстве. NDA подписываем до старта. Документация и исходники — ваша собственность.",
      },
      {
        tag: "Поддержка",
        q: "Что происходит после запуска приложения?",
        a: "Первые 30 дней после запуска — гарантийный период: исправляем баги бесплатно. Далее — опциональная SLA-поддержка: мониторинг крэшей (Sentry, Firebase Crashlytics), обновления зависимостей, совместимость с новыми версиями iOS и Android.",
      },
    ],
  },
];

const GROUPS_EN: Group[] = [
  {
    title: "Development Cost",
    items: [
      {
        tag: "Budget",
        q: "How much does it cost to develop a mobile app?",
        a: "Cost depends on platforms, features and complexity. An MVP in React Native starts from ₽300k. A full iOS and Android app starts from ₽700k. We'll prepare a detailed estimate by screens and API for free after the brief.",
      },
      {
        tag: "Estimate",
        q: "What's included in the price and can it change?",
        a: "The estimate includes: design system, sprint-based development, QA, App Store and Google Play publication, documentation. The price is fixed before the start. Changes to scope are handled via a change request with justification.",
      },
    ],
  },
  {
    title: "Platforms & Timeline",
    items: [
      {
        tag: "Platforms",
        q: "Do you only do React Native or native development too?",
        a: "We work with React Native (shared codebase for iOS and Android), Flutter, and native Swift/Kotlin. Stack choice depends on performance requirements, animations and platform APIs — we recommend after auditing the task.",
      },
      {
        tag: "Timeline",
        q: "How long does it take to develop a mobile app?",
        a: "An MVP with core functionality — 4–8 weeks. A full app with backend, auth and publication — 8–16 weeks. We work in 2-week sprints: at the end of each sprint you get a demo and can provide feedback.",
      },
    ],
  },
  {
    title: "Publication & Stores",
    items: [
      {
        tag: "App Store",
        q: "Do you handle App Store and Google Play submission?",
        a: "Yes, publication is part of our work: preparing metadata, screenshots, descriptions in Russian and English, passing Apple and Google review. We assist with developer account registration and resolve rejection reasons.",
      },
      {
        tag: "Review",
        q: "What if Apple or Google rejects the app?",
        a: "Rejections on first submission are normal. We analyze the reason, fix the issues and resubmit. Review support is included in the cost. For complex cases we help with appeals and communication with platform support.",
      },
    ],
  },
  {
    title: "Backend & Integrations",
    items: [
      {
        tag: "Backend",
        q: "Do you develop the backend or just the mobile app?",
        a: "We build the full stack: REST/GraphQL API, auth, databases, task queues, file storage. We can also connect to an existing backend — integrating via Swagger/OpenAPI or your documentation.",
      },
      {
        tag: "Integrations",
        q: "What integrations can you connect?",
        a: "Payment systems (Stripe, PayPal, CloudPayments), marketplaces, CRM, messengers, push notifications (APNs, FCM), geolocation, maps (Google, Yandex, MapKit), analytics (Amplitude, Firebase, AppMetrica) and document signing.",
      },
    ],
  },
  {
    title: "Offline & Performance",
    items: [
      {
        tag: "Offline",
        q: "Can the app work without an internet connection?",
        a: "Yes. We design offline mode with local databases (SQLite, Realm, MMKV), background sync and operation queues. When connection is restored, data syncs automatically with conflict resolution.",
      },
      {
        tag: "Performance",
        q: "How do you ensure the app is fast and smooth?",
        a: "We use native animations (Reanimated 3, Lottie), lazy-loaded screens, list optimization (FlashList), image and API response caching. We profile with Flipper, Xcode Instruments and Android Profiler — eliminating jank and memory leaks.",
      },
    ],
  },
  {
    title: "Analytics & Monetization",
    items: [
      {
        tag: "Analytics",
        q: "How do you connect event analytics to the app?",
        a: "We set up event tracking via Amplitude, Firebase Analytics, AppMetrica or Mixpanel. Covering key funnels: registration, onboarding, purchases, retention. Dashboards and custom events — per your spec or product hypotheses.",
      },
      {
        tag: "Monetization",
        q: "What monetization models can you implement?",
        a: "In-app purchases, subscriptions, freemium, paywalls, ad networks (AdMob). We integrate RevenueCat for subscription management with LTV and churn analytics. Each model requires separate scoping — we'll discuss at kickoff.",
      },
    ],
  },
  {
    title: "Security & Releases",
    items: [
      {
        tag: "Security",
        q: "How is user data protected in the app?",
        a: "We encrypt on-device data (Keychain, Keystore), use TLS certificate pinning, and follow OWASP Mobile Top 10. Auth via JWT + refresh tokens, biometrics (Face ID, Touch ID). Penetration testing available before release.",
      },
      {
        tag: "Releases",
        q: "How are updates handled after launch?",
        a: "We set up CI/CD (Fastlane, GitHub Actions) for automated builds and publication. OTA updates via Expo Updates or CodePush (React Native) allow JS bundle updates without store review. Major releases go through full QA.",
      },
    ],
  },
  {
    title: "Process & Support",
    items: [
      {
        tag: "Process",
        q: "How is work organized and how will I track progress?",
        a: "We work in Scrum with 2-week sprints. You get access to Jira/Linear, daily standups in Telegram, and end-of-sprint demos on real devices. NDA signed before kickoff. All documentation and source code belong to you.",
      },
      {
        tag: "Support",
        q: "What happens after the app launches?",
        a: "First 30 days after launch — warranty period: we fix bugs for free. Then optional SLA support: crash monitoring (Sentry, Firebase Crashlytics), dependency updates, compatibility with new iOS and Android versions.",
      },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════════════════════════════════ */
export default function MobileFAQ() {
  const { locale } = useI18n();
  const isEn = locale === "en";
  const GROUPS = isEn ? GROUPS_EN : GROUPS_RU;

  const [open,     setOpen]     = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const reduced = useReducedMotion();
  const titleId = useId();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const toggle = useCallback((key: string) => {
    setOpen(s => s === key ? null : key);
  }, []);

  const jsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    name: isEn ? "FAQ — Mobile App Development" : "Частые вопросы — Мобильные приложения",
    url: `${siteUrl}/mobile#faq`,
    mainEntity: GROUPS.flatMap(g => g.items.map(item => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    }))),
  }), [GROUPS, isEn]);

  const ORG_EMAIL = "info@onestack24.ru";
  const ORG_PHONE = "+7 (910) 948 61 06";
  const ORG_PHONE_HREF = "tel:+79109486106";

  return (
    <>
      <Script id="ld-mobile-faq" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section
        id="faq"
        aria-labelledby={titleId}
        style={{ background: BG, borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: isMobile ? "0 20px" : "0 40px" }}>

          {/* ── Header ── */}
          <div style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "flex-start" : "center",
            justifyContent: "space-between",
            gap: 24,
            padding: isMobile ? "72px 0 52px" : "100px 0 72px",
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ height: 2, width: 20, background: TEAL, borderRadius: 2, flexShrink: 0 }} />
                <span style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase" as const, fontWeight: 500, color: TEAL }}>
                  {isEn ? "FAQ" : "Частые вопросы"}
                </span>
              </div>
              <h2 id={titleId} className={serif.className}
                style={{ margin: 0, fontWeight: 400, lineHeight: 0.92, letterSpacing: "-0.04em" }}>
                <span style={{ display: "block", fontSize: "clamp(2.2rem, 5vw, 5rem)", color: TEAL }}>
                  {isEn ? "Frequent" : "Частые"}
                </span>
                <span style={{ display: "block", fontSize: "clamp(2.2rem, 5vw, 5rem)", color: WHITE }}>
                  {isEn ? "questions" : "вопросы"}
                </span>
              </h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, flexShrink: 0 }}>
              <ContactLink href={`mailto:${ORG_EMAIL}`} label={ORG_EMAIL} />
              <ContactLink href={ORG_PHONE_HREF} label={ORG_PHONE} />
            </div>
          </div>

          {/* ── Groups ── */}
          <div style={{ paddingBottom: isMobile ? 72 : 110 }}>
            {GROUPS.map((group, gi) => (
              <div key={group.title}
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 28, paddingBottom: 28 }}>

                {/* Group label */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <span style={{ fontFamily: "monospace", fontSize: 10, color: TEAL, opacity: 0.7 }}>
                    {String(gi + 1).padStart(2, "0")}
                  </span>
                  <span style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "rgba(244,250,248,0.3)", fontWeight: 500 }}>
                    {group.title}
                  </span>
                </div>

                {/* Items */}
                <div>
                  {group.items.map((item, ii) => {
                    const key = `${gi}-${ii}`;
                    const isOpen = open === key;
                    return (
                      <div key={key} style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                        <button
                          onClick={() => toggle(key)}
                          aria-expanded={isOpen}
                          style={{
                            width: "100%", display: "flex", alignItems: "center",
                            gap: isMobile ? 10 : 16, padding: "20px 0",
                            background: "none", border: "none", cursor: "pointer", textAlign: "left",
                          }}
                        >
                          {/* Tag — LEFT */}
                          <span style={{
                            flexShrink: 0,
                            fontSize: 9, fontWeight: 600, letterSpacing: "0.12em",
                            textTransform: "uppercase" as const, borderRadius: 99,
                            padding: "4px 10px",
                            background: isOpen ? `${TEAL}18` : "rgba(255,255,255,0.04)",
                            border: `1px solid ${isOpen ? TEAL + "50" : "rgba(255,255,255,0.07)"}`,
                            color: isOpen ? TEAL : "rgba(244,250,248,0.3)",
                            transition: "all 0.2s",
                            whiteSpace: "nowrap" as const,
                          }}>
                            {item.tag}
                          </span>

                          {/* Question */}
                          <span style={{
                            flex: 1, fontSize: isMobile ? 14 : 15, fontWeight: 500,
                            color: isOpen ? WHITE : "rgba(244,250,248,0.7)",
                            lineHeight: 1.45, transition: "color 0.2s",
                          }}>
                            {item.q}
                          </span>

                          {/* Plus / Minus */}
                          <div style={{
                            flexShrink: 0, width: 28, height: 28, borderRadius: "50%",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            background: isOpen ? `${TEAL}18` : "rgba(255,255,255,0.05)",
                            border: `1px solid ${isOpen ? TEAL + "50" : "rgba(255,255,255,0.08)"}`,
                            transition: "all 0.2s",
                          }}>
                            {isOpen
                              ? <Minus size={13} style={{ color: TEAL }} />
                              : <Plus  size={13} style={{ color: "rgba(244,250,248,0.35)" }} />
                            }
                          </div>
                        </button>

                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={reduced ? undefined : { height: 0, opacity: 0 }}
                              animate={reduced ? undefined : { height: "auto", opacity: 1 }}
                              exit={reduced ? undefined : { height: 0, opacity: 0 }}
                              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                              style={{ overflow: "hidden" }}
                            >
                              <p style={{
                                margin: 0,
                                paddingLeft: isMobile ? 0 : 88,
                                paddingRight: isMobile ? 0 : 48,
                                paddingBottom: 24,
                                fontSize: 14, lineHeight: 1.75,
                                color: "rgba(244,250,248,0.55)",
                              }}>
                                {item.a}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* ── Не нашли ответ? ── */}
          <div style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            paddingTop: 32,
            paddingBottom: isMobile ? 72 : 100,
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "flex-start" : "center",
            gap: 20,
          }}>
            <p style={{ margin: 0, fontSize: 14, color: "rgba(244,250,248,0.4)", flexShrink: 0 }}>
              {isEn ? "Didn't find the answer? Ask directly:" : "Не нашли ответ? Спросите напрямую:"}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <ContactLink href={`mailto:${ORG_EMAIL}`} label={ORG_EMAIL} />
              <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 13 }}>·</span>
              <ContactLink href={ORG_PHONE_HREF} label={ORG_PHONE} />
            </div>
          </div>

        </div>
      </section>
    </>
  );
}

/* ─── ContactLink ────────────────────────────────────────────────────────── */
const ContactLink = memo(function ContactLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href}
      style={{ fontSize: 13, color: "rgba(244,250,248,0.45)", textDecoration: "none", transition: "color 0.2s" }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = TEAL}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "rgba(244,250,248,0.45)"}
    >{label}</a>
  );
});
