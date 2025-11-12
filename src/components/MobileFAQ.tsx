// app/mobile/components/MobileFAQ.tsx
"use client";

import { useMemo, useState, useId } from "react";
import Script from "next/script";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

type QA = { q: string; a: string };
type Topic = { title: string; items: QA[] };

const TOPICS: Topic[] = [
  {
    title: "Стоимость",
    items: [
      {
        q: "Сколько стоит разработка мобильного приложения и от чего зависит цена?",
        a: "MVP (одна платформа, базовые экраны, авторизация, пуши, аналитика) — от 1.2–1.8 млн ₽. Две платформы (iOS+Android) нативно или кроссплатформа — от 1.8–3.5 млн ₽. Полноформатный продукт с ролями, оффлайном, интеграциями и биллингом — от 3.5 млн ₽. На стоимость влияют платформы, сложность UX, оффлайн/реал-тайм, интеграции (оплата/CRM), требования к безопасности и сроки.",
      },
      {
        q: "Можно ли стартовать с минимального бюджета?",
        a: "Да. Предложим MVP на готовых модулях и единой дизайн-системе: быстрый выход, проверка гипотез, затем расширение без переписывания.",
      },
    ],
  },
  {
    title: "Платформы и сроки",
    items: [
      {
        q: "Нативно или кросс-платформенно (React Native/Flutter)?",
        a: "Для быстрых MVP и общего UI — кроссплатформа даёт 60–70% шеринга кода. Если много нативных фич (BLE, AR, мультимедиа, виджеты/Live Activities) или нужен максимальный перформанс/UX — выбираем натив. Часто комбинируем: RN/Flutter + нативные модули.",
      },
      {
        q: "Какие реальные сроки?",
        a: "Интерактивный MVP — 6–10 недель; пилот с бэкендом и аналитикой — 10–14 недель; релиз с публикацией — 14–20 недель. Параллелим дизайн, мобайл и сервер; используем готовые модули и CI/CD.",
      },
    ],
  },
  {
    title: "Публикация и сторы",
    items: [
      {
        q: "Берёте на себя публикацию в App Store и Google Play?",
        a: "Да. Готовим сборки, скрины, описания, privacy-детали, подписи и deeplink/Universal Links. Ведём коммуникацию с ревью, настраиваем TestFlight/Closed testing.",
      },
      {
        q: "Чьи аккаунты и кому принадлежат ключи?",
        a: "Релиз ведём в ваших Apple/Google-аккаунтах. Код, сертификаты и ключи — на вашей стороне; помогаем с онбордингом и безопасной передачей.",
      },
    ],
  },
  {
    title: "Бэкенд и интеграции",
    items: [
      {
        q: "Нужен ли собственный бэкенд?",
        a: "Если есть существующие API — интегрируемся. Если нет — поднимем лёгкий бэкенд (NestJS/Node) с БД, аутентификацией, пуш-сервисом, оплатой и админ-панелью. Возможны BaaS/Serverless-варианты.",
      },
      {
        q: "Какие интеграции поддерживаете?",
        a: "ЮKassa/Stripe, CRM (amo/Bitrix), почта/уведомления, App Store/Play Billing, аналитика/атрибуция. Для нестандартных API делаем адаптеры и ретраи.",
      },
    ],
  },
  {
    title: "Оффлайн и перформанс",
    items: [
      {
        q: "Поддерживаете ли оффлайн-режим?",
        a: "Да. Локальные базы (SQLite/Room/CoreData), кеш, очереди синхронизации и конфликт-резолверы. Прописываем UX-состояния «оффлайн/в сети».",
      },
      {
        q: "Как обеспечиваете производительность?",
        a: "Оптимизируем рендер и сеть, используем предзагрузку и чанкинг. Цель по cold-start ≤ 2 сек, плавные анимации и стабильный FPS.",
      },
    ],
  },
  {
    title: "Аналитика и монетизация",
    items: [
      {
        q: "Пуш-уведомления, аналитика и краш-репорты — что используете?",
        a: "APNs/FCM, доставка через бэкенд или сторонние сервисы. Аналитика: Firebase/Amplitude/AppMetrica + Crashlytics/Sentry. События/воронки, атрибуция, A/B-тесты — под задачу.",
      },
      {
        q: "Оплаты и подписки (IAP, внешние платёжки) — реально?",
        a: "Да. Интегрируем In-App Purchases/Subscriptions (StoreKit/Billing). Для внесторовых моделей — ЮKassa/Stripe и др., с учётом правил Apple/Google.",
      },
    ],
  },
  {
    title: "Безопасность и релизы",
    items: [
      {
        q: "Безопасность мобильного приложения?",
        a: "Следуем OWASP MASVS: Keychain/Keystore, TLS pinning, защита токенов, device checks, минимизация PII. Шифрование на клиенте при необходимости, ревью прав и скоупов API.",
      },
      {
        q: "Как ускоряете релизы и снижаете регрессии?",
        a: "CI/CD, автосборки, линтеры, unit/UI-тесты, превью-каналы. Для RN/Flutter — OTA/CodePush/EAS-updates (где уместно). Канареечные релизы и фича-флаги.",
      },
    ],
  },
  {
    title: "Процессы и поддержка",
    items: [
      {
        q: "Поддержка после релиза и SLA?",
        a: "Пакеты: мониторинг крашей/перфоманса, мелкие задачи, обновления SDK/OS, сопровождение релизов. Pro-SLA с целями по MTTR/реакции — по договорённости.",
      },
      {
        q: "Можно ли подписать NDA и начать с прототипа?",
        a: "Да. Подписываем NDA до обмена материалами. Часто начинаем с интерактивного прототипа, чтобы подтвердить гипотезы и снизить риски.",
      },
    ],
  },
];

const fade = (d = 0) => ({
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut", delay: d },
  viewport: { once: true, amount: 0.25 },
});

export default function MobileFAQ() {
  const [openId, setOpenId] = useState<string | null>(null);
  const sectionTitleId = useId();
  const reduced = useReducedMotion();

  const toggle = (id: string, q: string) => {
    setOpenId((s) => (s === id ? null : id));
    try {
      (window as any).gtag?.("event", "faq_open", { question: q, page: "mobile" });
      (window as any).ym?.(103909522, "reachGoal", "faq_open");
    } catch {}
  };

  const slug = (s: string) =>
    s
      .toLowerCase()
      .replace(/[()-]/g, " ")
      .replace(/[^a-zа-яё0-9\s]/gi, "")
      .trim()
      .replace(/\s+/g, "-");

  const jsonLd = useMemo(() => {
    const mainEntity = TOPICS.flatMap((t) =>
      t.items.map((i) => ({
        "@type": "Question",
        name: i.q,
        acceptedAnswer: { "@type": "Answer", text: i.a },
      }))
    );
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity,
    };
  }, []);

  const a = (d = 0) => (reduced ? {} : fade(d));

  return (
    <section
      id="faq"
      className="relative w-full overflow-hidden bg-gradient-to-b from-black via-[#0a0a0a] to-black text-white
                 pt-20 pb-24 md:pt-24 md:pb-28"
      aria-labelledby={sectionTitleId}
      role="region"
    >
      <div className="pointer-events-none absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-white/[0.035] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[420px] w-[420px] rounded-full bg-white/[0.035] blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-12 lg:px-20">
        <motion.p {...a(0)} className="text-sm uppercase tracking-[0.25em] text-white/50 mb-3">
          FAQ
        </motion.p>
        <motion.h2
          {...a(0.05)}
          id={sectionTitleId}
          className="text-[clamp(1.9rem,4vw,3.2rem)] font-extrabold leading-tight tracking-tight"
        >
          Частые вопросы по мобильным приложениям
        </motion.h2>
        <motion.p {...a(0.1)} className="mt-4 max-w-3xl text-white/70">
          Если не нашли ответ — напишите нам. Поможем с выбором архитектуры, релизом в сторах и оценкой таймлайна.
        </motion.p>

        <div className="mt-10 space-y-8">
          {TOPICS.map((topic, i) => (
            <motion.section
              key={topic.title}
              {...a(0.16 + i * 0.05)}
              aria-labelledby={`mfaq-topic-${i}`}
              role="region"
            >
              <h3 id={`mfaq-topic-${i}`} className="text-xl font-semibold mb-4">
                {topic.title}
              </h3>
              <div className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.03]">
                {topic.items.map((item, j) => {
                  const id = `${i}-${j}`;
                  const panelId = `mfaq-panel-${id}`;
                  const isOpen = openId === id;
                  const hash = slug(item.q);

                  return (
                    <div key={panelId} className="px-4 sm:px-6">
                      <button
                        onClick={() => toggle(id, item.q)}
                        className="flex w-full items-center justify-between gap-4 py-4 text-left"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        id={`q-${hash}`}
                      >
                        <span className="text-base font-medium">{item.q}</span>
                        <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.06] p-1">
                          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            id={panelId}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: reduced ? 0 : 0.25, ease: "easeOut" }}
                            className="overflow-hidden"
                            aria-labelledby={`q-${hash}`}
                            role="region"
                          >
                            <div className="pb-5 text-white/80">
                              <p className="leading-relaxed">{item.a}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.section>
          ))}
        </div>
      </div>

      <Script
        id="ld-mobile-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}