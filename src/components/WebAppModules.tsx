// src/components/WebAppModules.tsx
"use client";
import { serif } from "@/lib/fonts";

import React, { memo, useMemo, useId, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Script from "next/script";
import {
  Users2, ShieldCheck, BarChart3, Bell, Database,
  LockKeyhole, Cloud, PlugZap, Cog, Play,
} from "lucide-react";
import { siteUrl } from "@/app/seo.config";
import { useI18n } from "@/i18n/I18nProvider";


const TEAL  = "#2dd4bf";
const WHITE = "#f4faf8";
const BG    = "#07100e";

/* ─── Data ───────────────────────────────────────────────────────────────── */
type Feature = {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  teaser: string;
  badge: string;
};

const FEATURES_RU: Feature[] = [
  { icon: Users2,      title: "Роли и доступы",           subtitle: "RBAC/ABAC, SSO и аудит",        teaser: "Гибкая система прав с группами пользователей, scope-токенами и SSO. Полный контроль доступа для любой структуры.",                    badge: "RBAC"     },
  { icon: BarChart3,   title: "Аналитические дашборды",   subtitle: "Метрики, фильтры и расписания",  teaser: "Виджеты KPI, сегменты данных, экспорт отчётов и рассылка по расписанию. Интерактивные графики и визуализация.",                       badge: "Analytics" },
  { icon: Bell,        title: "Уведомления",               subtitle: "Почта, пуши, мессенджеры",      teaser: "Маршрутизация по каналам, шаблоны сообщений и отслеживание доставки. Персонализированные уведомления.",                               badge: "Notify"   },
  { icon: Database,    title: "Импорт и экспорт данных",  subtitle: "Массовые операции",              teaser: "Обработка CSV/XLSX с валидацией, очередями задач и отслеживанием прогресса. Большие объёмы данных.",                                   badge: "ETL"      },
  { icon: LockKeyhole, title: "Безопасность",              subtitle: "2FA, rate-limit, аудит",         teaser: "Шифрование данных, политики паролей, мониторинг активности и резервные копии. Современные стандарты.",                                 badge: "Security" },
  { icon: Cloud,       title: "Деплой и поддержка",       subtitle: "CI/CD, мониторинг",              teaser: "Preview-окружения, миграции БД, алерты и автоматическое масштабирование. Стабильная работа приложений.",                               badge: "DevOps"   },
  { icon: PlugZap,     title: "Интеграции и API",         subtitle: "CRM, биллинг, ERP",              teaser: "REST/GraphQL API, вебхуки, управление ключами и версионирование. Интеграция с экосистемой бизнес-сервисов.",                            badge: "API"      },
  { icon: Cog,         title: "Флаги функций",            subtitle: "Эксперименты и A/B тесты",       teaser: "Feature flags, A/B тестирование и удалённые конфигурации. Гибкое управление функциональностью без деплоя.",                             badge: "Features" },
  { icon: ShieldCheck, title: "Качество продукта",        subtitle: "Тесты, доступность",             teaser: "E2E и интеграционные тесты, анализ кода и проверка доступности. Гарантия стабильности и качества.",                                    badge: "QA"       },
];

const FEATURES_EN: Feature[] = [
  { icon: Users2,      title: "Roles & access",         subtitle: "RBAC/ABAC, SSO and audit",      teaser: "Flexible permission system with user groups, scope tokens and SSO. Full access control for any organizational structure.",               badge: "RBAC"     },
  { icon: BarChart3,   title: "Analytics dashboards",   subtitle: "Metrics, filters and schedules", teaser: "KPI widgets, data segments, report export and scheduled delivery. Interactive charts and visualizations.",                             badge: "Analytics" },
  { icon: Bell,        title: "Notifications",           subtitle: "Email, push, messengers",        teaser: "Multi-channel routing, message templates and delivery tracking. Personalized notifications for every user.",                           badge: "Notify"   },
  { icon: Database,    title: "Data import & export",   subtitle: "Bulk operations",                teaser: "CSV/XLSX processing with validation, task queues and progress tracking. Handles large data volumes seamlessly.",                         badge: "ETL"      },
  { icon: LockKeyhole, title: "Security",                subtitle: "2FA, rate-limit, audit",         teaser: "Data encryption, password policies, activity monitoring and backups. Modern industry standards for data protection.",                  badge: "Security" },
  { icon: Cloud,       title: "Deploy & support",       subtitle: "CI/CD, monitoring",              teaser: "Preview environments, DB migrations, alerts and auto-scaling. Stable, reliable application operations.",                                badge: "DevOps"   },
  { icon: PlugZap,     title: "Integrations & API",     subtitle: "CRM, billing, ERP",              teaser: "REST/GraphQL API, webhooks, key management and versioning. Integration with your entire business services ecosystem.",                  badge: "API"      },
  { icon: Cog,         title: "Feature flags",          subtitle: "Experiments and A/B tests",      teaser: "Feature flags, A/B testing and remote configurations. Flexible feature management without redeployment.",                               badge: "Features" },
  { icon: ShieldCheck, title: "Product quality",        subtitle: "Tests, accessibility",           teaser: "E2E and integration tests, code analysis and accessibility checks. Guaranteed stability and quality at every layer.",                   badge: "QA"       },
];

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════════════════════════════════ */
export default function WebAppModules() {
  const { locale } = useI18n();
  const isEn = locale === "en";
  const FEATURES = isEn ? FEATURES_EN : FEATURES_RU;
  const reduced = useReducedMotion();
  const titleId = useId();

  const PAGE_URL = `${siteUrl}/webapp#modules`;

  const jsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: isEn ? "Web application modules — OneStack" : "Модули для веб-приложений",
    url: PAGE_URL,
    numberOfItems: FEATURES.length,
    itemListElement: FEATURES.map((f, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: { "@type": "Service", name: f.title, description: f.teaser },
    })),
  }), [PAGE_URL, isEn]);

  return (
    <>
      <Script id="ld-webapps-modules" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section
        id="modules"
        className="relative overflow-hidden"
        style={{ background: BG, padding: "100px 0 80px" }}
        aria-labelledby={titleId}
      >
        {/* Ambient glows */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 -right-40 rounded-full"
          style={{ width: 560, height: 560, background: TEAL, opacity: 0.07, filter: "blur(180px)" }}
          animate={reduced ? undefined : { scale: [1, 1.1, 1], opacity: [0.07, 0.11, 0.07] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 -left-40 rounded-full"
          style={{ width: 400, height: 400, background: TEAL, opacity: 0.05, filter: "blur(140px)" }}
        />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-14">

          {/* ── Header ── */}
          <motion.div
            className="mb-16 sm:mb-20"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div style={{ height: 2, width: 20, background: TEAL, borderRadius: 2, flexShrink: 0 }} />
              <span className="text-[11px] tracking-[0.22em] uppercase font-medium" style={{ color: TEAL }}>
                {isEn ? "Ready-made modules" : "Готовые модули"}
              </span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <h2
                id={titleId}
                className={`${serif.className} font-normal tracking-[-0.04em]`}
                style={{ margin: 0, lineHeight: 0.92 }}
              >
                <span className="block" style={{ fontSize: "clamp(2.6rem, 6vw, 6rem)", WebkitTextStroke: `1.5px ${TEAL}`, color: "transparent" }}>
                  {isEn ? "System modules" : "Модули системы"}
                </span>
                <span className="block" style={{ fontSize: "clamp(2.6rem, 6vw, 6rem)", color: WHITE }}>
                  {isEn ? "for your needs" : "под вашу задачу"}
                </span>
              </h2>

              <div className="flex flex-col lg:items-end gap-4 max-w-sm">
                <p className="text-sm leading-relaxed lg:text-right" style={{ color: "rgba(244,250,248,0.45)", margin: 0 }}>
                  {isEn
                    ? <>Ready-made modules that accelerate development and make your system <span style={{ color: WHITE, fontWeight: 600 }}>flexible, secure and scalable.</span></>
                    : <>Готовые модули, которые ускоряют разработку и делают систему{" "}<span style={{ color: WHITE, fontWeight: 600 }}>гибкой, безопасной и масштабируемой.</span></>}
                </p>
              </div>
            </div>
          </motion.div>

          {/* ── Cards Grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
            {FEATURES.map((feature, i) => (
              <ModuleCard key={feature.title} feature={feature} index={i} reduced={!!reduced} />
            ))}
          </div>

        </div>
      </section>
    </>
  );
}

/* ─── ModuleCard ─────────────────────────────────────────────────────────── */
const ModuleCard = memo(function ModuleCard({
  feature, index, reduced,
}: {
  feature: Feature;
  index: number;
  reduced: boolean;
}) {
  const Icon = feature.icon;
  const [hovered, setHovered] = useState(false);

  return (
    <motion.article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={reduced ? undefined : { opacity: 0, y: 24 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.04 * index }}
      whileHover={reduced ? undefined : { y: -4 }}
      className="group relative flex flex-col rounded-2xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: hovered ? `1px solid ${TEAL}50` : "1px solid rgba(255,255,255,0.07)",
        boxShadow: hovered ? `inset 0 0 24px ${TEAL}08` : "none",
        transition: "border-color 0.3s, box-shadow 0.3s",
      }}
    >
      <div className="relative z-10 flex flex-col h-full p-6">

        {/* Icon + badge */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div
            className="flex items-center justify-center rounded-xl transition-all duration-200 shrink-0"
            style={{
              width: 36, height: 36,
              background: hovered ? `${TEAL}18` : "rgba(255,255,255,0.05)",
              border: `1px solid ${hovered ? TEAL + "40" : "rgba(255,255,255,0.08)"}`,
            }}
          >
            <Icon size={18} style={{ color: hovered ? TEAL : "rgba(244,250,248,0.5)", transition: "color 0.2s" }} />
          </div>
          <span
            className="text-[10px] font-semibold tracking-[0.12em] uppercase rounded-full transition-all duration-200"
            style={{
              padding: "4px 10px",
              background: hovered ? `${TEAL}18` : "rgba(255,255,255,0.04)",
              border: `1px solid ${hovered ? TEAL + "40" : "rgba(255,255,255,0.08)"}`,
              color: hovered ? TEAL : "rgba(244,250,248,0.3)",
            }}
          >
            {feature.badge}
          </span>
        </div>

        {/* Title */}
        <h3
          className="text-[17px] font-semibold mb-1 transition-colors duration-200"
          style={{ color: hovered ? WHITE : "rgba(244,250,248,0.85)", letterSpacing: "-0.01em" }}
        >
          {feature.title}
        </h3>

        {/* Subtitle */}
        <p className="text-xs mb-3" style={{ color: "rgba(244,250,248,0.35)" }}>
          {feature.subtitle}
        </p>

        {/* Teaser */}
        <p className="text-sm leading-relaxed flex-1" style={{ color: "rgba(244,250,248,0.45)" }}>
          {feature.teaser}
        </p>

      </div>
    </motion.article>
  );
});
