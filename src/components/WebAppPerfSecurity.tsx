// src/components/WebAppPerfSecurity.tsx
"use client";
import { serif } from "@/lib/fonts";

import React, { memo, useMemo, useId, useState } from "react";
import Script from "next/script";
import { motion, useReducedMotion } from "framer-motion";
import {
  Timer, Activity, Boxes, ShieldCheck, KeyRound, Database,
} from "lucide-react";
import { siteName, siteUrl } from "@/app/seo.config";
import { useI18n } from "@/i18n/I18nProvider";


const TEAL  = "#2dd4bf";
const WHITE = "#f4faf8";

/* ─── Data ───────────────────────────────────────────────────────────────── */
type Metric = {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  teaser: string;
  badge: string;
  benefits: string[];
};

const PERFORMANCE_RU: Metric[] = [
  {
    icon: Timer,
    title: "Время ответа",
    subtitle: "Edge/SSR, кэширование",
    teaser: "Серверный рендер и кэширование для высокой скорости. Оптимизация первого байта и контента для мгновенной загрузки.",
    badge: "Edge/SSR",
    benefits: ["Серверный рендер", "Кэширование", "Оптимизация контента"],
  },
  {
    icon: Activity,
    title: "Пропускная способность",
    subtitle: "Автомасштабирование",
    teaser: "Горизонтальное масштабирование и health-чеки. Стабильная работа под высокой нагрузкой без деградации сервиса.",
    badge: "Autoscale",
    benefits: ["Горизонтальное масштабирование", "Health-чеки", "Стабильность под нагрузкой"],
  },
  {
    icon: Boxes,
    title: "Кэш и очереди",
    subtitle: "Redis, SQS, CQRS",
    teaser: "Кэширование, очереди задач и ретраи для стабильной обработки. Оптимизация сложных операций и гарантия доставки.",
    badge: "CQRS",
    benefits: ["Кэширование", "Очереди задач", "Гарантия доставки"],
  },
];

const PERFORMANCE_EN: Metric[] = [
  { icon: Timer,    title: "Response time",       subtitle: "Edge/SSR, caching",
    teaser: "Server-side rendering and caching for high speed. Optimizing time-to-first-byte and content for instant loading.",
    badge: "Edge/SSR", benefits: ["Server rendering", "Caching", "Content optimization"] },
  { icon: Activity, title: "Throughput",           subtitle: "Auto-scaling",
    teaser: "Horizontal scaling and health checks. Stable performance under high load without service degradation.",
    badge: "Autoscale", benefits: ["Horizontal scaling", "Health checks", "Stability under load"] },
  { icon: Boxes,    title: "Cache & queues",       subtitle: "Redis, SQS, CQRS",
    teaser: "Caching, task queues, and retries for stable processing. Complex operation optimization and delivery guarantee.",
    badge: "CQRS", benefits: ["Caching", "Task queues", "Delivery guarantee"] },
];

const SECURITY_EN: Metric[] = [
  { icon: ShieldCheck, title: "Security",          subtitle: "OWASP, validations, audit",
    teaser: "Validations, rate-limiting, dependency audits, and secrets management. Compliance with modern security standards.",
    badge: "OWASP", benefits: ["Data validation", "Rate limiting", "Dependency audit"] },
  { icon: KeyRound,    title: "Roles & access",    subtitle: "RBAC, SSO, action audit",
    teaser: "Granular permissions, action logs, SSO integration. Access control for your organizational structure.",
    badge: "RBAC", benefits: ["Granular permissions", "SSO integration", "Action audit"] },
  { icon: Database,    title: "Backups",            subtitle: "Encryption, migrations",
    teaser: "Regular backups, data encryption, and migrations with rollbacks. Guaranteed data integrity and recovery.",
    badge: "Backup", benefits: ["Regular backups", "Data encryption", "Migrations with rollbacks"] },
];

const SECURITY_RU: Metric[] = [
  {
    icon: ShieldCheck,
    title: "Безопасность",
    subtitle: "OWASP, валидации, аудит",
    teaser: "Валидации, rate-limit, аудит зависимостей и управление секретами. Соответствие современным стандартам защиты данных.",
    badge: "OWASP",
    benefits: ["Валидации данных", "Rate limiting", "Аудит зависимостей"],
  },
  {
    icon: KeyRound,
    title: "Роли и доступы",
    subtitle: "RBAC, SSO, аудит действий",
    teaser: "Гранулярные права, журналы действий, SSO интеграция. Контроль доступа для вашей организационной структуры.",
    badge: "RBAC",
    benefits: ["Гранулярные права", "SSO интеграция", "Аудит действий"],
  },
  {
    icon: Database,
    title: "Резервные копии",
    subtitle: "Шифрование, миграции",
    teaser: "Регулярные бэкапы, шифрование данных и миграции с откатами. Гарантия сохранности и восстановления данных.",
    badge: "Backup",
    benefits: ["Регулярные бэкапы", "Шифрование данных", "Миграции с откатами"],
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════════════════════════════════ */
export default function WebAppPerfSecurity() {
  const { locale } = useI18n();
  const isEn = locale === "en";
  const PERFORMANCE = isEn ? PERFORMANCE_EN : PERFORMANCE_RU;
  const SECURITY    = isEn ? SECURITY_EN    : SECURITY_RU;
  const reduced = useReducedMotion();
  const titleId = useId();

  const PAGE_URL = `${siteUrl}/webapp#perf-security`;

  const jsonLdService = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Производительность и безопасность веб-приложений",
    description: "Оптимизация производительности и безопасности: кэш, масштабирование, защита и резервные копии",
    provider: { "@type": "Organization", name: siteName, url: siteUrl },
    areaServed: ["RU", "KZ", "BY"],
    url: PAGE_URL,
  }), [PAGE_URL]);

  const jsonLdList = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Метрики производительности и безопасности",
    url: PAGE_URL,
    numberOfItems: PERFORMANCE.length + SECURITY.length,
    itemListElement: [
      ...PERFORMANCE.map((m, i) => ({ "@type": "ListItem", position: i + 1,
        item: { "@type": "Service", name: m.title, description: m.teaser, category: "Performance" } })),
      ...SECURITY.map((m, i) => ({ "@type": "ListItem", position: PERFORMANCE.length + i + 1,
        item: { "@type": "Service", name: m.title, description: m.teaser, category: "Security" } })),
    ],
  }), [PAGE_URL]);

  const fadeUp = (d = 0) => reduced ? {} : {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: d },
  };

  return (
    <>
      <Script id="ld-webapp-perf-service" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdService) }} />
      <Script id="ld-webapp-perf-list" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdList) }} />

      <section
        id="perf-security"
        className="relative overflow-hidden pt-16 sm:pt-20 pb-20 sm:pb-28"
        aria-labelledby={titleId}
      >
        {/* Ambient glow */}
        <motion.div
          className="pointer-events-none absolute -top-40 -right-40 rounded-full blur-[180px]"
          style={{ width: 560, height: 560, background: TEAL, opacity: 0.07 }}
          animate={reduced ? undefined : { scale: [1, 1.1, 1], opacity: [0.07, 0.11, 0.07] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-14">

          {/* ── Header ── */}
          <motion.div className="mb-16 sm:mb-20" {...(fadeUp(0) as object)}>
            <div className="flex items-center gap-3 mb-6">
              <div style={{ height: 2, width: 20, background: TEAL, borderRadius: 2, flexShrink: 0 }} />
              <span className="text-[11px] tracking-[0.22em] uppercase font-medium" style={{ color: TEAL }}>
                {isEn ? "Performance & security" : "Производительность и безопасность"}
              </span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <h2
                id={titleId}
                className={`${serif.className} font-normal tracking-[-0.04em]`}
                style={{ lineHeight: 0.9 }}
              >
                <span className="block" style={{ fontSize: "clamp(2.6rem, 6vw, 6rem)", color: TEAL }}>{isEn ? "Speed" : "Скорость"}</span>
                <span className="block" style={{ fontSize: "clamp(2.6rem, 6vw, 6rem)", color: WHITE }}>{isEn ? "and protection" : "и защита"}</span>
              </h2>

              <p className="text-sm sm:text-base leading-relaxed max-w-sm lg:text-right"
                style={{ color: "rgba(244,250,248,0.45)" }}>
                {isEn ? "We configure architecture for growth and stability — from caching and queues to access control and monitoring." : "Настраиваем архитектуру для роста и стабильности — от кэширования и очередей до контроля доступа и мониторинга."}
              </p>
            </div>
          </motion.div>

          {/* ── Производительность ── */}
          <motion.div className="mb-14" {...(fadeUp(0.1) as object)}>
            <SubLabel icon={<Activity className="h-3.5 w-3.5" />} label={isEn ? "Performance" : "Производительность"} />
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
              {PERFORMANCE.map((m, i) => (
                <MetricCard key={m.title} metric={m} index={i} reduced={!!reduced} />
              ))}
            </div>
          </motion.div>

          {/* ── Безопасность ── */}
          <motion.div {...(fadeUp(0.2) as object)}>
            <SubLabel icon={<ShieldCheck className="h-3.5 w-3.5" />} label={isEn ? "Security & reliability" : "Безопасность и надёжность"} />
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
              {SECURITY.map((m, i) => (
                <MetricCard key={m.title} metric={m} index={i} reduced={!!reduced} />
              ))}
            </div>
          </motion.div>

        </div>
      </section>
    </>
  );
}

/* ─── SubLabel ───────────────────────────────────────────────────────────── */
function SubLabel({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-1">
      <span style={{ color: TEAL }}>{icon}</span>
      <span className="text-xs font-semibold uppercase tracking-[0.15em]"
        style={{ color: "rgba(244,250,248,0.4)" }}>{label}</span>
      <div className="flex-1 h-px ml-2" style={{ background: "rgba(255,255,255,0.06)" }} />
    </div>
  );
}

/* ─── MetricCard ─────────────────────────────────────────────────────────── */
const MetricCard = memo(function MetricCard({
  metric, index, reduced,
}: { metric: Metric; index: number; reduced: boolean }) {
  const Icon = metric.icon;
  const [hovered, setHovered] = useState(false);

  const anim = reduced ? {} : {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.04 * index },
    whileHover: { y: -4 },
  };

  return (
    <motion.article
      {...(anim as object)}
      className="group relative flex flex-col rounded-2xl overflow-hidden"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      itemScope
      itemType="https://schema.org/Service"
    >
      {/* Hover border glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ border: `1px solid ${TEAL}50`, boxShadow: `inset 0 0 24px ${TEAL}08` }}
        aria-hidden
      />

      <div className="relative z-10 flex flex-col h-full p-6">
        {/* Icon + badge */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200"
            style={{
              background: hovered ? `${TEAL}18` : "rgba(255,255,255,0.05)",
              border: `1px solid ${hovered ? TEAL + "40" : "rgba(255,255,255,0.08)"}`,
            }}>
            <Icon className="h-[18px] w-[18px] transition-colors duration-200"
              style={{ color: hovered ? TEAL : "rgba(244,250,248,0.5)" }} aria-hidden />
          </div>
          <span className="text-[10px] font-semibold tracking-[0.12em] uppercase px-2.5 py-1 rounded-full transition-all duration-200"
            style={hovered
              ? { background: `${TEAL}18`, border: `1px solid ${TEAL}40`, color: TEAL }
              : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(244,250,248,0.3)" }
            }>
            {metric.badge}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-semibold mb-1 transition-colors duration-200"
          style={{ color: hovered ? WHITE : "rgba(244,250,248,0.85)" }}
          itemProp="name">
          {metric.title}
        </h3>

        {/* Subtitle */}
        <p className="text-xs mb-3" style={{ color: "rgba(244,250,248,0.35)" }}>
          {metric.subtitle}
        </p>

        {/* Teaser */}
        <p className="text-sm leading-relaxed flex-1 mb-4" style={{ color: "rgba(244,250,248,0.45)" }}
          itemProp="description">
          {metric.teaser}
        </p>

        {/* Benefits chips */}
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {metric.benefits.map(b => (
            <span key={b} className="text-[10px] px-2 py-0.5 rounded-full transition-all duration-200"
              style={hovered
                ? { background: `${TEAL}12`, border: `1px solid ${TEAL}25`, color: TEAL }
                : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(244,250,248,0.35)" }
              }>
              {b}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
});
