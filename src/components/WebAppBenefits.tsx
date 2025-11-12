// src/components/WebAppBenefits.tsx
"use client";

import React, { useEffect, useRef, useState, useMemo, useId } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  ShieldCheck,
  KeyRound,
  Gauge,
  ServerCog,
  PlugZap,
  Rocket,
  Activity,
  BugPlay,
  CloudCog,
} from "lucide-react";
import Script from "next/script";

/* ---------------- Anim helpers ---------------- */
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

function useCountUp(target: number, { duration = 900, play = true } = {}) {
  const [val, setVal] = useState(0);
  const startRef = useRef<number | null>(null);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (!play) {
      setVal(target);
      return;
    }
    const step = (ts: number) => {
      if (startRef.current == null) startRef.current = ts;
      const p = Math.min(1, (ts - startRef.current) / duration);
      setVal(target * easeOutCubic(p));
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      startRef.current = null;
    };
  }, [target, duration, play]);

  return val;
}

function CountUp({
  to,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 900,
  start = true,
  reduce = false,
  ariaLabel,
}: {
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  start?: boolean;
  reduce?: boolean;
  ariaLabel?: string;
}) {
  const v = useCountUp(to, { duration, play: start && !reduce });
  const shown = reduce ? to : v;
  return (
    <span className="tabular-nums" aria-live="polite" aria-label={ariaLabel}>
      {prefix}
      {shown.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/* ---------------- Motion helpers ---------------- */
const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: "easeOut", delay: d },
  viewport: { once: true, amount: 0.25 },
});

/* ---------------- Content ---------------- */
type Benefit = {
  icon: React.ElementType;
  title: string;
  text: string;
  badge?: string;
};

const BENEFITS: Benefit[] = [
  { icon: ShieldCheck, title: "Безопасность", text: "OWASP-практики, шифрование, секрет-менеджмент, аудит событий и бэкапы.", badge: "OWASP/SOC" },
  { icon: KeyRound, title: "Роли и доступы", text: "RBAC/ABAC, SSO (SAML/OIDC). Гранулярные права и аудит действий.", badge: "RBAC" },
  { icon: PlugZap, title: "Интеграции", text: "REST/GraphQL, вебхуки, очереди. CRM, биллинг, ERP, маркетинг.", badge: "API" },
  { icon: ServerCog, title: "Масштабируемость", text: "Кэш/CDN, очереди, шардирование. Горизонтальный рост без простоев.", badge: "Cloud" },
  { icon: Activity, title: "Наблюдаемость", text: "Логи, метрики, трейсы и алерты. Быстрый поиск и устранение инцидентов.", badge: "Observability" },
  { icon: BugPlay, title: "Качество и тесты", text: "Юнит/интеграционные/e2e-тесты, статический анализ, превью окружения.", badge: "QA" },
  { icon: Rocket, title: "CI/CD", text: "Автосборки, превью и безопасные откаты. Регулярные релизы без простоя.", badge: "CI/CD" },
  { icon: Gauge, title: "Производительность", text: "SSR/ISR, оптимизация сети и рендера. Стабильные Core Web Vitals.", badge: "CWV" },
  { icon: CloudCog, title: "Поддержка", text: "SLA-поддержка, мониторинг и пост-релизное развитие.", badge: "SLA" },
];

export default function WebAppBenefits() {
  const reduced = useReducedMotion();
  const titleId = useId();
  const descId = useId();

  // SEO JSON-LD (ItemList + Breadcrumbs)
  const jsonLd = useMemo(() => {
    const base =
      (typeof process !== "undefined" && process.env.NEXT_PUBLIC_SITE_URL) ||
      "https://onestack24.ru";
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "ItemList",
          name: "Преимущества веб-приложений OneStack",
          url: `${base}/web#webapp-benefits`,
          itemListElement: BENEFITS.map((b, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: { "@type": "Thing", name: b.title, description: b.text },
          })),
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Домашняя", item: `${base}/` },
            { "@type": "ListItem", position: 2, name: "Веб-приложения", item: `${base}/web` },
            { "@type": "ListItem", position: 3, name: "Преимущества", item: `${base}/web#webapp-benefits` },
          ],
        },
      ],
    };
  }, []);

  return (
    <section
      id="webapp-benefits"
      className="relative w-full overflow-hidden bg-gradient-to-b from-black via-[#0b0b0b] to-black text-white
                 pt-20 pb-24 md:pt-24 md:pb-28"
      aria-labelledby={titleId}
      aria-describedby={descId}
    >
      {/* мягкие подсветки */}
      <div aria-hidden className="pointer-events-none absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-white/[0.04] blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-40 -right-40 h-[420px] w-[420px] rounded-full bg-white/[0.04] blur-3xl" />

      {/* Контейнер в едином ритме с остальными блоками */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-22 lg:px-20">
        {/* Заголовок — по левой направляющей */}
        <motion.p
          {...fadeUp(0)}
          className="text-sm uppercase tracking-[0.25em] text-white/50 mb-3 text-left"
        >
          преимущества веб-приложений
        </motion.p>

        <motion.h2
          id={titleId}
          {...fadeUp(0.05)}
          className="text-[clamp(1.9rem,4vw,3.2rem)] font-extrabold leading-tight tracking-tight text-left max-w-4xl"
        >
          Продуктовый подход, безопасность и масштабирование «из коробки»
        </motion.h2>

        {/* Описание — слева, остальное по центру */}
        <div className="mt-6 flex flex-col items-center text-center">
          <motion.p
            id={descId}
            {...fadeUp(0.1)}
            className="max-w-2xl text-white/70 text-lg self-start text-left"
          >
            Проектируем архитектуру под рост: роли и доступы, интеграции, наблюдаемость,
            автоматизированные релизы и SRE-практики. В итоге вы получаете не просто UI,
            а управляемую платформу.
          </motion.p>

          {/* Метрики — компактные, «человечные» подписи */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-5xl" role="list" aria-label="Ключевые метрики качества">
            <MetricCard
              label="Надёжность (аптайм)"
              value={99.95}
              decimals={2}
              suffix="%"
              delay={0.12}
              reduced={reduced}
              ariaLabel="Надёжность системы, девяносто девять целых девяносто пять сотых процента"
            />
            <MetricCard
              label="Скорость ответа (TTFB)"
              value={120}
              prefix="≤ "
              suffix=" мс"
              delay={0.17}
              reduced={reduced}
              ariaLabel="Скорость ответа сервера, не более ста двадцати миллисекунд"
            />
            <MetricCard
              label="Старт первого релиза"
              value={1}
              prefix="от "
              suffix=" дня"
              delay={0.22}
              reduced={reduced}
              ariaLabel="Старт первого релиза от одного дня"
            />
          </div>

          {/* Карточки преимуществ — центр, одинаковые отступы/ширина текста */}
          <ul className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
            {BENEFITS.map((b, i) => (
              <li key={b.title}>
                <BenefitCard icon={b.icon} title={b.title} text={b.text} badge={b.badge} delay={0.26 + i * 0.05} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* JSON-LD */}
      <Script
        id="ld-webapp-benefits"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}

/* -------- subcomponents -------- */
function MetricCard({
  label,
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  delay = 0,
  reduced = false,
  ariaLabel,
}: {
  label: string;
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  delay?: number;
  reduced?: boolean;
  ariaLabel?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px -20% 0px" });

  return (
    <motion.div
      ref={ref}
      {...fadeUp(delay)}
      className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 h-full"
      role="group"
      aria-label={label}
    >
      <div className="text-xl font-semibold">
        <CountUp
          to={value}
          decimals={decimals}
          prefix={prefix}
          suffix={suffix}
          start={inView}
          reduce={reduced}
          ariaLabel={ariaLabel}
        />
      </div>
      <div className="text-xs text-white/60 mt-2">{label}</div>
    </motion.div>
  );
}

function BenefitCard({
  icon: Icon,
  title,
  text,
  badge,
  delay = 0,
}: {
  icon: React.ElementType;
  title: string;
  text: string;
  badge?: string;
  delay?: number;
}) {
  return (
    <motion.article
      role="listitem"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      className="group relative h-full rounded-2xl border border-white/10 bg-white/[0.04] p-6
                 hover:bg-white/[0.07] hover:shadow-[0_20px_60px_rgba(255,255,255,0.08)] transition"
    >
      <div className="flex flex-col items-center text-center h-full">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.08] text-white">
          <Icon className="h-5 w-5" />
        </span>

        <div className="mt-3 flex items-center justify-center gap-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          {badge && (
            <span className="rounded-full border border-white/15 bg-white/[0.06] px-2 py-0.5 text-[11px] leading-5 text-white/85">
              {badge}
            </span>
          )}
        </div>

        <p className="mt-3 text-sm text-white/75 leading-relaxed px-3 max-w-[50ch]">
          {text}
        </p>

        {/* акцентная линия снизу */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-6 right-6 -bottom-[1px] h-[2px]
                     bg-gradient-to-r from-white/0 via-white/30 to-white/0
                     opacity-0 group-hover:opacity-100 transition"
        />
      </div>
    </motion.article>
  );
}