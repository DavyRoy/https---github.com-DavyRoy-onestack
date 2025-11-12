// src/components/SiteFAQ.tsx
"use client";

import { useMemo, useState, useCallback } from "react";
import Script from "next/script";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

type QA = { q: string; a: string };
type Topic = { title: string; items: QA[] };

const TOPICS: Topic[] = [
  {
    title: "Стоимость",
    items: [
      {
        q: "Сколько стоит разработка сайта?",
        a: "Лендинг — от 120–180 тыс ₽, визитка — от 160 тыс ₽, корпоративный — от 280–600 тыс ₽, e-commerce — от 600 тыс ₽. Итог зависит от объёма страниц, уровня дизайна, интеграций (CRM, оплаты, 1C), наличия личного кабинета и сроков.",
      },
      {
        q: "Можно ли уложиться в минимальный бюджет?",
        a: "Да. Предложим MVP на готовых модулях и дизайне-системе: запустимся быстро, протестируем гипотезу, а затем аккуратно расширим без переписывания.",
      },
    ],
  },
  {
    title: "Сроки",
    items: [
      {
        q: "Какие сроки разработки?",
        a: "Лендинг — 1–3 недели, визитка — 1–2 недели, корпоративный — 4–8 недель, интернет-магазин — 6–12 недель. На разную сложность закладываем буфер под контент и интеграции.",
      },
      {
        q: "Реально ли ускорить запуск?",
        a: "Да. Используем параллельные потоки (дизайн/верстка/интеграции), готовые блоки и CI/CD. Часто удаётся выпустить MVP раньше медианы.",
      },
    ],
  },
  {
    title: "Дизайн",
    items: [
      {
        q: "Вы делаете дизайн с нуля?",
        a: "Да. Подготовим дизайн-систему и макеты в Figma (состояния, адаптив, сетки), либо аккуратно адаптируем ваш макет под продакшн.",
      },
      {
        q: "Можно работать по нашему макету?",
        a: "Конечно. Переносим дизайн 1:1 с учётом доступности (a11y), типографики, анимаций и производительности.",
      },
    ],
  },
  {
    title: "Технологии",
    items: [
      {
        q: "С какими технологиями вы работаете?",
        a: "Next.js/React, TypeScript, Tailwind, Node.js, PostgreSQL/Redis, Headless CMS (Sanity/Strapi/Contentful), интеграции с ЮKassa/Stripe, CRM и складом.",
      },
      {
        q: "Используете ли современные практики?",
        a: "Да: CI/CD, Docker, облака (Vercel/Render/YC), мониторинг, автотесты. Core Web Vitals держим в зелёной зоне.",
      },
    ],
  },
  {
    title: "Архитектура",
    items: [
      {
        q: "Можно начать с MVP и масштабировать без переписывания?",
        a: "Да. Проекты строим модульно: добавление новых страниц и фич не требует ломать основу. Миграции БД, версии API и документация — в комплекте.",
      },
      {
        q: "Будет ли документация по проекту?",
        a: "Да. Описываем архитектуру, дизайн-систему, запуск, деплой и инструкции для контент-команды/разработчиков.",
      },
    ],
  },
  {
    title: "Поддержка",
    items: [
      {
        q: "Оказываете поддержку после релиза?",
        a: "Есть SLA-пакеты: мелкие правки по спринтам, обновления зависимостей и безопасности, мониторинг, развитие по roadmap.",
      },
      {
        q: "Как быстро реагируете на инциденты?",
        a: "В рамках SLA: критика — от 4 часов, стандарт — 8–24 часа. Отчитываемся по задачам и метрикам.",
      },
    ],
  },
  {
    title: "SEO",
    items: [
      {
        q: "Делаете ли SEO-оптимизацию?",
        a: "Базовое SEO на старте: метаданные, карта сайта, Schema.org, OG-превью, чистые URL и технический чек-лист.",
      },
      {
        q: "Что с производительностью и доступностью?",
        a: "Оптимизация изображений (CDN), lazy-loading, SSR/SSG, кеширование, семантическая разметка и клавиатурная доступность.",
      },
    ],
  },
  {
    title: "Миграция",
    items: [
      {
        q: "Переносите контент/товары с текущего сайта?",
        a: "Да. Экспорт/парсинг, трансформации, маппинг полей в CMS, импорт SKU/остатков/медиа, проверка ссылок.",
      },
      {
        q: "Сохранится ли SEO при переезде?",
        a: "Да. Настраиваем 301-редиректы, проверяем индексацию и линки, чтобы не терять позиции.",
      },
    ],
  },
];

// Единый fade helper
const fade = (d = 0) => ({
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut", delay: d },
  viewport: { once: true, amount: 0.25 },
});

// Актуальные контакты (используются в JSON-LD)
const ORG = {
  name: "OneStack",
  url: "https://onestack24.ru",
  email: "info@onestack24.ru",
  telephone: "+7-910-948-61-06",
};

const YM_ID = 103909522; // Яндекс.Метрика

export default function SiteFAQ() {
  const [openId, setOpenId] = useState<string | null>(null);
  const reduced = useReducedMotion();

  const track = useCallback((q: string, action: "open" | "close") => {
    try {
      // GA4
      // @ts-ignore
      if (typeof window !== "undefined" && typeof window.gtag === "function") {
        // @ts-ignore
        window.gtag("event", "faq_toggle", {
          event_category: "engagement",
          event_label: q,
          action,
        });
      }
      // Yandex.Metrika
      // @ts-ignore
      if (typeof window !== "undefined" && typeof window.ym === "function") {
        // @ts-ignore
        window.ym(YM_ID, "reachGoal", `faq_${action}`);
      }
    } catch {}
  }, []);

  const toggle = (id: string, q: string) => {
    setOpenId((s) => {
      const next = s === id ? null : id;
      track(q, next ? "open" : "close");
      return next;
    });
  };

  // slug для возможных deeplink’ов (оставляем для id/aria, но ссылки не выводим)
  const slug = (s: string) =>
    s
      .toLowerCase()
      .replace(/[()-]/g, " ")
      .replace(/[^a-zа-яё0-9\s]/gi, "")
      .trim()
      .replace(/\s+/g, "-");

  // FAQPage JSON-LD
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
      publisher: {
        "@type": "Organization",
        name: ORG.name,
        url: ORG.url,
        email: ORG.email,
        telephone: ORG.telephone,
      },
    };
  }, []);

  const a = (d = 0) => (reduced ? {} : fade(d));

  return (
    <section
      id="faq"
      className="relative w-full overflow-hidden bg-gradient-to-b from-black via-[#0a0a0a] to-black text-white py-24"
      aria-labelledby="faq-title"
      role="region"
    >
      {/* мягкие свечения */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-white/[0.035] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[420px] w-[420px] rounded-full bg-white/[0.035] blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
        <motion.p {...a(0)} className="text-sm uppercase tracking-[0.25em] text-white/50 mb-3">
          FAQ
        </motion.p>
        <motion.h2 id="faq-title" {...a(0.05)} className="text-[clamp(1.9rem,4vw,3.2rem)] font-extrabold leading-tight tracking-tight">
          Частые вопросы
        </motion.h2>
        <motion.p {...a(0.1)} className="mt-4 max-w-3xl text-white/70">
          Собрали короткие ответы на ключевые вопросы. Если чего-то не хватает —{" "}
          <Link href="#contact" className="underline underline-offset-4 hover:no-underline">
            напишите нам
          </Link>
          .
        </motion.p>

        {/* Темы */}
        <div className="mt-10 space-y-8">
          {TOPICS.map((topic, i) => (
            <motion.section key={topic.title} {...a(0.12 + i * 0.05)} aria-labelledby={`faq-topic-${i}`}>
              <h3 id={`faq-topic-${i}`} className="text-xl font-semibold mb-4">
                {topic.title}
              </h3>
              <div className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.03]">
                {topic.items.map((item, j) => {
                  const id = `${i}-${j}`;
                  const panelId = `faq-panel-${id}`;
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
                              {/* Убрали ссылку на конкретный вопрос по требованию */}
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

        {/* Мини-CTA */}
        <motion.div {...a(0.2)} className="mt-10 rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-sm text-white/80">
          Не нашли ответ? Напишите на{" "}
          <a href="mailto:info@onestack24.ru" className="underline underline-offset-4 hover:no-underline">
            info@onestack24.ru
          </a>{" "}
          или позвоните{" "}
          <a href="tel:+79109486106" className="underline underline-offset-4 hover:no-underline">
            +7 (910) 948 61 06
          </a>
          . Быстрее всего ответим через форму{" "}
          <Link href="#contact" className="underline underline-offset-4 hover:no-underline">
            «Оставить заявку»
          </Link>
          .
        </motion.div>
      </div>

      {/* JSON-LD для SEO */}
      <Script id="ld-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </section>
  );
}