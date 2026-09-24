// src/components/WebAppModules.tsx
"use client";
import { serif } from "@/lib/fonts";

import React, { useMemo, useId } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Users2, ShieldCheck, BarChart3, Bell, Database,
  LockKeyhole, Cloud, PlugZap, Cog, Sparkles,
} from "lucide-react";
import { siteUrl } from "@/app/seo.config";
import { useI18n } from "@/i18n/I18nProvider";



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
  { icon: Sparkles,    title: "AI-ассистент",             subtitle: "Чат-бот, умный поиск, скоринг",  teaser: "Ассистент на базе LLM внутри системы: ответы по базе знаний, умный поиск, автоматическая обработка заявок и скоринг лидов.",           badge: "AI"       },
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
  { icon: Sparkles,    title: "AI assistant",           subtitle: "Chatbot, smart search, scoring", teaser: "An LLM-powered assistant inside your system: answers from the knowledge base, smart search, automated request handling and lead scoring.", badge: "AI"       },
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
      <script id="ld-webapps-modules" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section id="modules" className="site-types" aria-labelledby={titleId}>
        <div className="site-types__inner site-split">
          <motion.div
            initial={reduced ? undefined : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="service-eyebrow">{isEn ? "03 / Ready modules" : "03 / Готовые модули"}</p>
            <h2 id={titleId} className={`${serif.className} site-types__title`}>
              {isEn ? <>Modules<br />for your needs</> : <>Модули<br />под вашу задачу</>}
            </h2>
            <p className="site-types__sub" style={{ marginTop: 24 }}>
              {isEn
                ? "Proven building blocks that speed up development and keep the system secure and scalable."
                : "Проверенные блоки, которые ускоряют разработку и делают систему безопасной и масштабируемой."}
            </p>
          </motion.div>

          <ul className="mod-list">
            {FEATURES.map(f => {
              const Icon = f.icon;
              return (
                <li key={f.title} className="mod-item" title={f.teaser}>
                  <span className="mod-item__name"><Icon size={18} aria-hidden="true" />{f.title}</span>
                  <span className="mod-item__desc">{f.subtitle}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}
