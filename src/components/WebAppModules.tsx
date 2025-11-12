// src/components/WebAppModules.tsx
"use client";

import React, { memo, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Script from "next/script";
import {
  Users2,
  ShieldCheck,
  BarChart3,
  Bell,
  Database,
  LockKeyhole,
  Cloud,
  PlugZap,
  Cog,
} from "lucide-react";

/* ================================== Types ================================== */
type Feature = {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  teaser: string;
  badge?: string;
};

/* ================================== Data =================================== */
const FEATURES: Feature[] = [
  {
    icon: Users2,
    title: "Роли и доступы",
    subtitle: "RBAC/ABAC, SSO и аудит действий",
    teaser:
      "Гранулярные права, группы, scope-токены и подключение SSO (SAML/OIDC).",
    badge: "RBAC",
  },
  {
    icon: BarChart3,
    title: "Дашборды",
    subtitle: "Метрики, фильтры и расписания",
    teaser:
      "Готовые виджеты KPI, сегменты, экспорт CSV/XLSX и рассылка отчётов по расписанию.",
    badge: "Analytics",
  },
  {
    icon: Bell,
    title: "Нотификации",
    subtitle: "Почта, пуши, мессенджеры и вебхуки",
    teaser:
      "Маршрутизация по каналам, шаблоны, ретраи и дедупликация, трекинг доставки.",
    badge: "Notify",
  },
  {
    icon: Database,
    title: "Импорт / Экспорт",
    subtitle: "Массовые операции без простоя",
    teaser:
      "CSV/XLSX, валидаторы, очереди, прогресс-бар, логи ошибок и откаты.",
    badge: "ETL",
  },
  {
    icon: LockKeyhole,
    title: "Безопасность",
    subtitle: "OWASP, 2FA, rate-limit и бэкапы",
    teaser:
      "Шифрование секретов, политики сложности паролей, мониторинг и резервные копии.",
    badge: "OWASP",
  },
  {
    icon: Cloud,
    title: "Деплой и поддержка",
    subtitle: "CI/CD, наблюдаемость и SLA",
    teaser:
      "Preview-окружения, миграции с откатами, алерты и регламенты реакции.",
    badge: "SLA",
  },
  {
    icon: PlugZap,
    title: "Интеграции и API",
    subtitle: "CRM, биллинг, ERP, маркетинг",
    teaser:
      "REST/GraphQL, вебхуки, ключи, лимиты и версияция контрактов.",
    badge: "API",
  },
  {
    icon: Cog,
    title: "Фича-флаги",
    subtitle: "Эксперименты и локализация",
    teaser:
      "Remote-config, включение фич для сегментов, A/B и дизайн-система.",
    badge: "Ops",
  },
  {
    icon: ShieldCheck,
    title: "Качество продукта",
    subtitle: "Тесты, a11y и превью для PR",
    teaser:
      "E2E/интеграционные тесты, статанализ, smoke-наборы и отчёты.",
    badge: "QA",
  },
];

/* =============================== Component =============================== */
export default function WebAppModules() {
  const reduce = useReducedMotion();

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://onestack24.ru";
  const jsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Модули веб-приложений OneStack",
      url: `${SITE_URL}/web-apps#modules`,
      itemListElement: FEATURES.map((f, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Service",
          name: f.title,
          description: f.teaser,
          provider: { "@type": "Organization", name: "OneStack", url: SITE_URL },
        },
      })),
    }),
    [SITE_URL]
  );

  const fade = (d = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          whileInView: { opacity: 1, y: 0 },
          transition: { duration: 0.5, ease: "easeOut", delay: d },
          viewport: { once: true, amount: 0.2 },
        };

  return (
    <section
      id="modules"
      className="relative flex items-center overflow-hidden bg-black text-white min-h-[100dvh] pt-[64px] md:pt-[72px]"
      aria-labelledby="webapp-modules-title"
      role="region"
    >
      {/* JSON-LD */}
      <Script
        id="ld-webapps-modules"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* мягкие подсветки */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-white/[0.035] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-40 h-[420px] w-[420px] rounded-full bg-white/[0.035] blur-3xl"
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-12 md:pt-16">
        <motion.p {...fade(0)} className="text-sm uppercase tracking-[0.25em] text-white/50">
          возможности
        </motion.p>

        <motion.h2
          id="webapp-modules-title"
          {...fade(0.05)}
          className="mt-2 text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight"
        >
          Из коробки — всё, что нужно продукту
        </motion.h2>

        <motion.p {...fade(0.1)} className="mt-3 text-lg text-white/70 max-w-3xl">
          Модули для старта и роста: роли и доступы, дашборды, интеграции,
          безопасность и SLA-поддержка. Прозрачно и без лишних сложностей.
        </motion.p>

        {/* Сетка карточек */}
        <ul
          className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          aria-label="Модули и их описание"
        >
          {FEATURES.map((f, i) => (
            <ModuleCard key={f.title} feature={f} index={i} fade={fade} />
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ============================= ModuleCard ============================= */
const ModuleCard = memo(function ModuleCard({
  feature,
  index,
  fade,
}: {
  feature: Feature;
  index: number;
  fade: (d?: number) => any;
}) {
  const Icon = feature.icon;

  return (
    <motion.li
      {...fade(0.06 + index * 0.04)}
      className="group relative overflow-hidden rounded-2xl border border-white/10
                 bg-gradient-to-br from-white/[0.05] to-white/[0.02]
                 hover:bg-white/[0.06] hover:shadow-[0_14px_40px_rgba(255,255,255,0.06)]
                 transition"
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          <span
            aria-hidden
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.08] text-white"
          >
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              {feature.badge && (
                <span className="rounded-full border border-white/15 bg-white/[0.06] px-2 py-0.5 text-[11px] leading-5 text-white/85">
                  {feature.badge}
                </span>
              )}
            </div>
            {feature.subtitle && (
              <div className="mt-1 text-[13px] text-white/60">
                {feature.subtitle}
              </div>
            )}
            <p className="mt-2 text-sm text-white/75">{feature.teaser}</p>
          </div>
        </div>
      </div>

      {/* нижняя световая линия */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-6 right-6 -bottom-[1px] h-[2px] bg-gradient-to-r from-white/0 via-white/35 to-white/0"
      />
    </motion.li>
  );
});