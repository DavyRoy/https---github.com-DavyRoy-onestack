// src/components/WebAppPerfSecurity.tsx
"use client";

import React, { memo, useMemo } from "react";
import Script from "next/script";
import { motion, useReducedMotion } from "framer-motion";
import {
  Timer,
  Activity,
  Boxes,
  ShieldCheck,
  KeyRound,
  Database,
} from "lucide-react";
import Link from "next/link";

/* ---------------- Motion helpers ---------------- */
const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: "easeOut", delay: d },
  viewport: { once: true, amount: 0.25 },
});
const pop = (d = 0) => ({
  initial: { opacity: 0, scale: 0.98, y: 10 },
  whileInView: { opacity: 1, scale: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut", delay: d },
  viewport: { once: true, amount: 0.25 },
});

/* ---------------- Types ---------------- */
type Metric = {
  icon: React.ReactNode;
  title: string;
  value?: string;
  badge?: string;
  text: string;
  microcopy?: string;
};

/* ---------------- Data ---------------- */
const PERFORMANCE: Metric[] = [
  {
    icon: <Timer className="h-5 w-5" />,
    title: "TTFB (средний)",
    value: "≤ 120 мс",
    badge: "Edge/SSR",
    text:
      "Серверный рендер и edge-кеширование. Ускоряем первый байт и «первый контент».",
    microcopy: "Результат зависит от региона и бэкенда",
  },
  {
    icon: <Activity className="h-5 w-5" />,
    title: "Пропускаемость",
    value: "до 3–5k RPS*",
    badge: "Autoscale",
    text:
      "Горизонтальное масштабирование, сессия без липкости, health-чеки и авто-скейл.",
    microcopy: "Тесты под профиль нагрузки",
  },
  {
    icon: <Boxes className="h-5 w-5" />,
    title: "Кэш и очереди",
    value: "Redis / SQS",
    badge: "CQRS",
    text:
      "Smart-кэш (TTL/инвалидация), очереди задач и ретраи для стабильной обработки.",
    microcopy: "Idempotency + DLQ",
  },
];

const SECURITY: Metric[] = [
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    title: "Модель угроз",
    badge: "OWASP ASVS",
    text:
      "Харднинг, валидации, rate-limit, аудит зависимостей, секрет-менеджмент.",
    microcopy: "Регулярные security-ревью",
  },
  {
    icon: <KeyRound className="h-5 w-5" />,
    title: "Аудит ролей",
    badge: "RBAC/ABAC",
    text:
      "Гранулярные права, журналы действий, SSO/OIDC/SAML, scoped-tokens и ротация ключей.",
    microcopy: "Принцип наименьших привилегий",
  },
  {
    icon: <Database className="h-5 w-5" />,
    title: "Бэкапы",
    badge: "RPO/RTO",
    text:
      "Ежедневные бэкапы, шифрование «на диске», миграции с откатами и миг-окнами.",
    microcopy: "Тестовые восстановления",
  },
];

/* ---------------- Organization for SEO ---------------- */
const ORG = {
  name: "OneStack",
  url: "https://onestack24.ru",
  email: "info@onestack24.ru",
  telephone: "+7-910-948-61-06",
  logo: "https://onestack24.ru/og-logo.png",
};

/* ---------------- Component ---------------- */
export default function WebAppPerfSecurity() {
  const reduced = useReducedMotion();

  // JSON-LD: Service + BreadcrumbList (микроразметка для поисковиков)
  const jsonLdService = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Оптимизация производительности и безопасность веб-приложений",
      description:
        "Edge-кеш, SSR, очереди, мониторинг, RBAC/ABAC, OWASP ASVS, бэкапы и миграции БД. Настройка SLO/SLA и алертов.",
      areaServed: "RU",
      provider: {
        "@type": "Organization",
        name: ORG.name,
        url: ORG.url,
        email: ORG.email,
        telephone: ORG.telephone,
        logo: ORG.logo,
      },
      serviceType: "Web application performance & security",
      termsOfService: `${ORG.url}/terms`,
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Пакеты SLO/SLA",
        itemListElement: [
          {
            "@type": "Offer",
            name: "SLO-настройка и мониторинг",
          },
          {
            "@type": "Offer",
            name: "Security-аудит по OWASP ASVS",
          },
        ],
      },
      url: `${ORG.url}/#perf-security`,
    };
  }, []);

  const jsonLdBreadcrumbs = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Главная",
          item: ORG.url,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Веб-приложения",
          item: `${ORG.url}/webapp`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Производительность и безопасность",
          item: `${ORG.url}/#perf-security`,
        },
      ],
    }),
    []
  );

  // Анимации для фоновых бликов — без движения при reduced motion
  const glowStyleTop = reduced
    ? {}
    : { transform: "translate3d(0,0,0)", animation: "floatY 10s ease-in-out infinite" };
  const glowStyleBottom = reduced
    ? {}
    : { transform: "translate3d(0,0,0)", animation: "floatX 12s ease-in-out infinite" };

  return (
    <section
      id="perf-security"
      className="relative w-full overflow-hidden bg-gradient-to-b from-black via-[#0a0a0a] to-black text-white
                 pt-20 pb-24 md:pt-24 md:pb-28"
      aria-labelledby="perfsec-title"
      role="region"
    >
      {/* мягкие подсветки */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-white/[0.04] blur-3xl"
        style={glowStyleTop as React.CSSProperties}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-40 h-[420px] w-[420px] rounded-full bg-white/[0.04] blur-3xl"
        style={glowStyleBottom as React.CSSProperties}
      />

      {/* tiny keyframes (scoped) */}
      {!reduced && (
        <style jsx>{`
          @keyframes floatY {
            0% { transform: translateY(0px); }
            50% { transform: translateY(14px); }
            100% { transform: translateY(0px); }
          }
          @keyframes floatX {
            0% { transform: translateX(0px); }
            50% { transform: translateX(-16px); }
            100% { transform: translateX(0px); }
          }
        `}</style>
      )}

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-12 lg:px-20">
        {/* Заголовок секции */}
        <motion.p
          {...(reduced ? {} : fadeUp(0))}
          className="text-sm uppercase tracking-[0.25em] text-white/50 mb-3"
        >
          производительность и безопасность
        </motion.p>

        <motion.h2
          id="perfsec-title"
          {...(reduced ? {} : fadeUp(0.05))}
          className="text-[clamp(1.9rem,4vw,3.2rem)] font-extrabold leading-tight tracking-tight max-w-3xl"
        >
          Быстро, устойчиво, безопасно
        </motion.h2>

        <motion.p
          {...(reduced ? {} : fadeUp(0.1))}
          className="mt-6 max-w-2xl text-white/70 text-lg"
        >
          Настраиваем архитектуру под рост и отказоустойчивость — от edge-кеша и очередей
          до RBAC и журналирования. Метрики и алерты всегда под рукой.
        </motion.p>

        {/* Перформанс */}
        <motion.div {...(reduced ? {} : pop(0.15))} className="mt-10">
          <SectionTitle
            icon={<Activity className="h-4 w-4" />}
            title="Перформанс"
            as="h3"
          />
          <ul
            className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            role="list"
            aria-label="Карточки метрик производительности"
          >
            {PERFORMANCE.map((m, i) => (
              <MetricCard key={m.title} {...m} delay={reduced ? 0 : 0.18 + i * 0.05} />
            ))}
          </ul>
        </motion.div>

        {/* Безопасность */}
        <motion.div {...(reduced ? {} : pop(0.25))} className="mt-10">
          <SectionTitle
            icon={<ShieldCheck className="h-4 w-4" />}
            title="Безопасность и надёжность"
            as="h3"
          />
          <ul
            className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            role="list"
            aria-label="Карточки практик безопасности"
          >
            {SECURITY.map((m, i) => (
              <MetricCard key={m.title} {...m} delay={reduced ? 0 : 0.28 + i * 0.05} />
            ))}
          </ul>
        </motion.div>

        {/* Примечание и CTA */}
        <motion.div
          {...(reduced ? {} : fadeUp(0.4))}
          className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-white/70"
        >
          <div className="text-white/85 font-medium mb-2">Примечание</div>
          <p>
            Значения зависят от выбранного хостинга, региона, нагрузки и профиля
            приложения. Для вашего кейса настроим SLO/SLA, алерты и тестовые планки
            по метрикам (TTFB, p95, ошибка/мин и др.).
          </p>
          <div className="mt-4">
            <Link
              href="#contact"
              className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-black font-semibold hover:shadow-white/20 hover:shadow-lg transition"
            >
              Обсудить SLO/SLA
              <svg className="ml-2 h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M5 12h14m0 0l-5-5m5 5l-5 5" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* JSON-LD для SEO */}
      <Script id="ld-perfsec-service" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdService) }} />
      <Script id="ld-perfsec-breadcrumbs" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumbs) }} />
    </section>
  );
}

/* ---------------- MetricCard ---------------- */
const MetricCard = memo(function MetricCard({
  icon,
  title,
  value,
  badge,
  text,
  microcopy,
  delay = 0,
}: Metric & { delay?: number }) {
  return (
    <motion.li
      role="listitem"
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      className="group relative rounded-2xl border border-white/10 bg-white/[0.04] p-6 hover:bg-white/[0.07] hover:shadow-[0_20px_60px_rgba(255,255,255,0.08)] transition"
    >
      {/* мягкая подсветка на hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 blur-2xl transition group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(60% 50% at 20% 0%, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 70%)",
        }}
      />
      <div className="relative z-10">
        <div className="flex items-start gap-4">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.08] text-white">
            {icon}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-lg font-semibold">{title}</h4>
              {badge ? (
                <span className="rounded-full border border-white/15 bg-white/[0.06] px-2 py-0.5 text-[11px] leading-5 text-white/85">
                  {badge}
                </span>
              ) : null}
            </div>
            {value ? (
              <div
                className="mt-1 text-2xl font-extrabold tracking-tight tabular-nums"
                aria-label={`${title}: ${value}`}
              >
                {value}
              </div>
            ) : null}
            <p className="mt-2 text-sm text-white/70">{text}</p>
            {microcopy && (
              <div className="mt-2 text-[11px] text-white/45">{microcopy}</div>
            )}
          </div>
        </div>

        {/* акцентная линия снизу */}
        <span className="pointer-events-none absolute left-6 right-6 -bottom-[1px] h-[2px] bg-gradient-to-r from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 transition" />
      </div>
    </motion.li>
  );
});

/* ---------------- UI helper ---------------- */
function SectionTitle({
  icon,
  title,
  as: Tag = "h3",
}: {
  icon: React.ReactNode;
  title: string;
  as?: "h3" | "h4" | "div";
}) {
  return (
    <Tag className="flex items-center gap-2 text-white/85 text-xl font-semibold">
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-white/[0.07]">
        {icon}
      </span>
      <span>{title}</span>
    </Tag>
  );
}