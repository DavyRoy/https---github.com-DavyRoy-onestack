// app/webapp/components/WebAppFAQ.tsx
"use client";

import { useMemo, useState, useId, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import Script from "next/script";

type QA = { q: string; a: string; tag?: string };
type Group = { title: string; items: QA[] };

const fade = (d = 0) => ({
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut", delay: d },
  viewport: { once: true, amount: 0.25 },
});

/** Сгруппированный, компактный FAQ без поиска — по 2 вопроса на тему */
const GROUPS: Group[] = [
  {
    title: "Стоимость",
    items: [
      {
        q: "Сколько стоит разработка веб-приложения и от чего зависит цена?",
        a: "MVP кабинета/портала — от 700–1 200 тыс ₽, CRM/ERP-модуль — от 1.2–2.5 млн ₽, полноформатный продукт с ролями, интеграциями и аналитикой — от 2.5 млн ₽. На стоимость влияют роли и права, число модулей, интеграции (CRM/платежи/1C/почта), требования к отказоустойчивости и безопасности, дизайн-система и сроки.",
      },
      {
        q: "Есть ли фикс-смета и как устроены платежи?",
        a: "После короткого брифа формируем фикс-смету и таймлайн. Оплата по этапам: аванс → MVP → релиз (и/или пострелизная поддержка). При изменении объема работ используем change-request с оценкой по согласованию.",
      },
    ],
  },
  {
    title: "Сроки",
    items: [
      {
        q: "Какие сроки реальны для MVP и релиза?",
        a: "Интерактивный MVP — 4–8 недель при ограниченном наборе сценариев; средний продукт — 8–16 недель. Параллелим потоки (дизайн/бэкенд/фронтенд), используем готовые блоки, чтобы ускорять релиз без ущерба качеству.",
      },
      {
        q: "Как ускорить запуск без потери качества?",
        a: "Фокус на ключевых сценариях, фича-флаги, готовые компоненты UI/авторизации, интеграции через адаптеры. Тяжёлые требования (сложная аналитика, отчеты, биллинг) выносим в последующие спринты.",
      },
    ],
  },
  {
    title: "Архитектура",
    items: [
      {
        q: "Монолит или микросервисы?",
        a: "Стартуем с модульного монолита (быстрее и проще сопровождать), выделяем сервисы по мере роста RPS/команд. Используем очереди/кэш/шину событий, оборачиваем интеграции адаптерами, чтобы менять их без переписываний.",
      },
      {
        q: "Когда пора выделять сервисы?",
        a: "Сигналы: независимые темпы релизов модулей, разные SLO, узкие места БД, команда >6–8 разработчиков на один домен. Начинаем с выноса отчётности, обработки задач/очередей и тяжёлых интеграций.",
      },
    ],
  },
  {
    title: "Безопасность",
    items: [
      {
        q: "Что с безопасностью и доступами?",
        a: "RBAC/ABAC, аудит действий, защита API (rate-limit, CORS, JWT/SSO), шифрование, регулярные обновления зависимостей. Следуем практикам OWASP ASVS. Проводим ревью и проверяем критические потоки.",
      },
      {
        q: "Делаете ли пентест/аудит и как храните секреты?",
        a: "Организуем внутренний и внешний аудит, статический/динамический анализ, dependency review. Секреты — в менеджере секретов, доступ по принципу наименьших привилегий, ротация ключей и журналирование.",
      },
    ],
  },
  {
    title: "Интеграции",
    items: [
      {
        q: "CRM, платёжки, 1С, внешние API — это возможно?",
        a: "Да. Двунаправленные синхронизации с CRM (amo/Bitrix), платежами (ЮKassa/Stripe), 1С/МойСклад, почтой/уведомлениями, маркетинг-инструментами. Для нестандартных API делаем адаптеры и ретраи.",
      },
      {
        q: "Как обеспечиваете надёжность интеграций?",
        a: "Очереди/повторные попытки, idempotency-ключи, DLQ, лимиты и троттлинг, изоляция сбоев. Мониторинг webhook’ов и метрики SLA по внешним системам.",
      },
    ],
  },
  {
    title: "Производительность и масштабирование",
    items: [
      {
        q: "Как обеспечиваете производительность и рост?",
        a: "Кэш (Redis), очереди задач, пагинация и ленивые вычисления, индексы/профилирование БД, CDN для статики. Горизонтальное масштабирование по потребности, канареечные релизы, метрики и алерты.",
      },
      {
        q: "Какие метрики держите под контролем?",
        a: "TTFB/LCP/CLS, p95 latency, error rate, RPS, потребление БД/кэша/очередей, аптайм, бюджеты запросов внешних интеграций. Строим алерты и SLO на ключевые показатели.",
      },
    ],
  },
  {
    title: "Поддержка и права",
    items: [
      {
        q: "Есть ли поддержка после релиза и SLA?",
        a: "Пакеты поддержки: базовый (мониторинг, малые задачи), Pro SLA (приоритет, целевые метрики реакции/восстановления). Отчитываемся по задачам и аптайму.",
      },
      {
        q: "Кому принадлежит код и инфраструктура?",
        a: "Код и артефакты деплоя передаются вам. Репозитории в вашей организации, доступы в облако на вашей стороне. Помогаем с онбордингом команды и документацией.",
      },
    ],
  },
  {
    title: "NDA, прототипы и CI/CD",
    items: [
      {
        q: "Можно ли подписать NDA и начать с прототипа?",
        a: "Да, NDA подписываем до обмена материалами. Часто стартуем с интерактивного прототипа/POC, чтобы быстро утвердить UX и риски.",
      },
      {
        q: "Есть предпросмотры и фиче-флаги?",
        a: "Всегда. CI/CD разворачивает preview/staging, где проверяются фичи до продакшна. Используем фиче-флаги и обратимые миграции БД.",
      },
    ],
  },
];

export default function WebAppFAQ() {
  const [open, setOpen] = useState<string | null>(null);
  const baseId = useId();
  const reduced = useReducedMotion();

  const allQAs = useMemo(() => GROUPS.flatMap((g) => g.items), []);
  const jsonLd = useMemo(() => {
    const list = allQAs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    }));
    return { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: list };
  }, [allQAs]);

  const toggle = useCallback((key: string) => {
    setOpen((s) => (s === key ? null : key));
  }, []);

  const a = (d = 0) => (reduced ? {} : fade(d));
  const slug = (s: string) =>
    s
      .toLowerCase()
      .replace(/[()-]/g, " ")
      .replace(/[^a-zа-яё0-9\s]/gi, "")
      .trim()
      .replace(/\s+/g, "-");

  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="relative w-full overflow-hidden bg-gradient-to-b from-black via-[#0a0a0a] to-black text-white
                 pt-20 pb-24 md:pt-24 md:pb-28"
      role="region"
    >
      {/* мягкие свечения */}
      <div aria-hidden className="pointer-events-none absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-white/[0.035] blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-40 -right-40 h-[420px] w-[420px] rounded-full bg-white/[0.035] blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-12 lg:px-20">
        <motion.p {...a(0)} className="text-sm uppercase tracking-[0.25em] text-white/50 mb-3">
          FAQ
        </motion.p>
        <motion.h2 id="faq-title" {...a(0.05)} className="text-[clamp(1.9rem,4vw,3.2rem)] font-extrabold leading-tight tracking-tight">
          Частые вопросы по веб-приложениям
        </motion.h2>
        <motion.p {...a(0.1)} className="mt-4 max-w-3xl text-white/70">
          Не нашли ответ — напишите нам. Поможем выбрать архитектуру, оценим риски и таймлайн.
        </motion.p>

        {/* группы с аккуратными аккордеонами */}
        <div className="mt-8 space-y-8">
          {GROUPS.map((group, gi) => (
            <motion.section key={group.title} {...a(0.12 + gi * 0.03)} aria-labelledby={`${baseId}-g-${gi}`}>
              <h3 id={`${baseId}-g-${gi}`} className="text-lg font-semibold text-white/85 mb-3">
                {group.title}
              </h3>

              <div className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.03]">
                {group.items.map((item, ii) => {
                  const key = `${gi}-${ii}`;
                  const isOpen = open === key;
                  const btnId = `${baseId}-q-${key}`;
                  const panelId = `${baseId}-panel-${key}`;
                  const hash = slug(item.q);

                  return (
                    <div key={key} className="px-3 sm:px-5">
                      <button
                        id={btnId}
                        onClick={() => toggle(key)}
                        className="flex w-full items-center justify-between gap-4 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-md"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                      >
                        <span className="text-base sm:text-lg font-semibold">
                          {item.q}
                          {item.tag ? (
                            <span className="ml-3 align-middle rounded-full border border-white/10 bg-white/[0.06] px-2 py-0.5 text-[11px] text-white/80">
                              {item.tag}
                            </span>
                          ) : null}
                        </span>
                        <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.06] p-1">
                          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            id={panelId}
                            role="region"
                            aria-labelledby={btnId}
                            key="content"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: reduced ? 0 : 0.25, ease: "easeOut" }}
                            className="overflow-hidden"
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

      {/* JSON-LD для SEO */}
      <Script id="ld-webapp-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </section>
  );
}