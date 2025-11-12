// components/MobileBenefits.tsx
"use client";

import React, { useEffect, useRef, useState, useMemo, useId } from "react";
import { motion, useReducedMotion, useInView } from "framer-motion";
import Script from "next/script";
import {
  Smartphone,
  Bell,
  WifiOff,
  ShieldCheck,
  Fingerprint,
  ShoppingBag,
  BarChart3,
  Rocket,
  CloudCog,
} from "lucide-react";

/* ============== Motion helpers ============== */
const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: "easeOut", delay: d },
  viewport: { once: true, amount: 0.25 },
});

/* ============== CountUp (micro-animation) ============== */
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

function useCountUp(target: number, opts?: { duration?: number; disabled?: boolean }) {
  const { duration = 900, disabled = false } = opts || {};
  const [val, setVal] = useState(0);
  const startRef = useRef<number | null>(null);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (disabled) {
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
  }, [target, duration, disabled]);

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
  const v = useCountUp(to, { duration, disabled: reduce || !start });
  const shown = reduce ? to : v;
  return (
    <span className="tabular-nums" aria-live="polite" aria-label={ariaLabel}>
      {prefix}
      {shown.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/* ============== Content ============== */
type Benefit = {
  icon: React.ElementType;
  title: string;
  desc: string;
  chip?: string;
};

const BENEFITS: Benefit[] = [
  { icon: Rocket,       title: "Быстрый MVP",             desc: "Первые релизы за 3–6 недель: дизайн-система, готовые модули и отлаженный пайплайн.", chip: "MVP" },
  { icon: Smartphone,   title: "Нативный UX и скорость",  desc: "Жесты, анимации и привычные паттерны iOS/Android. Плавные переходы и отзывчивый интерфейс.", chip: "UX/Perf" },
  { icon: WifiOff,      title: "Offline-first",           desc: "Сценарии работают без сети: локальный кэш и очереди синхронизации.", chip: "Offline" },
  { icon: Bell,         title: "Вовлечённость",           desc: "Пуш-кампании, сегменты и deep-links для персональных сценариев.", chip: "Engagement" },
  { icon: Fingerprint,  title: "Безопасная авторизация",  desc: "OAuth/OIDC, 2FA, Face/Touch ID, secure storage и защита токенов.", chip: "Auth" },
  { icon: ShieldCheck,  title: "Защита данных",           desc: "OWASP MASVS, TLS pinning, anti-tamper, шифрование и журналирование.", chip: "MASVS" },
  { icon: ShoppingBag,  title: "Монетизация",             desc: "IAP/подписки, промокоды, восстановление покупок, биллинг и чеки.", chip: "IAP" },
  { icon: BarChart3,    title: "Аналитика и A/B",         desc: "Firebase/Amplitude/AppMetrica, атрибуция, эксперименты и отчётность.", chip: "Analytics" },
  { icon: CloudCog,     title: "Релизы и поддержка",      desc: "CI/CD, TestFlight/Play Console, OTA/CodePush, мониторинг и SLA.", chip: "Ops" },
];

export default function MobileBenefits() {
  const reduced = useReducedMotion();
  const titleId = useId();
  const descId = useId();

  // JSON-LD для сниппетов (Service + FAQ)
  const jsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Service",
          name: "Разработка мобильных приложений (iOS/Android)",
          serviceType: "Mobile App Development",
          provider: { "@type": "Organization", name: "OneStack", url: "https://onestack24.ru" },
          areaServed: "RU",
          url: "https://onestack24.ru/mobile",
          description:
            "Нативные и кроссплатформенные приложения: offline-first, пуш-уведомления, безопасная авторизация, интеграции и аналитика. CI/CD, TestFlight/Play Console и SLA-поддержка.",
          keywords:
            "разработка мобильных приложений, iOS, Android, React Native, Swift, Kotlin, offline, пуш, аналитика, авторизация, безопасность, CI/CD",
        },
        {
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "Сколько занимает запуск MVP?",
              acceptedAnswer: {
                "@type": "Answer",
                text:
                  "Обычно 3–6 недель в зависимости от фич, интеграций и дизайна. Первые демо — через 1–2 недели.",
              },
            },
            {
              "@type": "Question",
              name: "Работает ли приложение офлайн?",
              acceptedAnswer: {
                "@type": "Answer",
                text:
                  "Да. Реализуем локальный кэш, очереди синхронизации и индикаторы статуса с безопасной обработкой конфликтов.",
              },
            },
            {
              "@type": "Question",
              name: "Есть ли поддержка и мониторинг?",
              acceptedAnswer: {
                "@type": "Answer",
                text:
                  "Да. Настраиваем CI/CD, краш-репорты и алерты. Доступны SLA-пакеты с оговорённым временем реакции.",
              },
            },
          ],
        },
      ],
    }),
    []
  );

  return (
    <section
      id="mobile-benefits"
      className="relative w-full overflow-hidden bg-gradient-to-b from-black via-[#0b0b0b] to-black text-white
                 pt-20 pb-24 md:pt-24 md:pb-28"
      aria-labelledby={titleId}
      aria-describedby={descId}
    >
      {/* JSON-LD через Next Script */}
      <Script
        id="ld-mobile-benefits"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* мягкие подсветки */}
      <div aria-hidden className="pointer-events-none absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-white/[0.04] blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-40 -right-40 h-[420px] w-[420px] rounded-full bg-white/[0.04] blur-3xl" />

      {/* Контейнер в общем ритме */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-12 lg:px-20">
        {/* Заголовок — по левой направляющей */}
        <motion.p {...fadeUp(0)} className="text-sm uppercase tracking-[0.25em] text-white/50 mb-3 text-left">
          преимущества мобильных приложений
        </motion.p>

        <motion.h2
          id={titleId}
          {...fadeUp(0.05)}
          className="text-[clamp(1.9rem,4vw,3.2rem)] font-extrabold leading-tight tracking-tight text-left max-w-4xl"
        >
          Нативный опыт, вовлечённость и рост LTV
        </motion.h2>

        {/* Описание слева, всё остальное по центру */}
        <div className="mt-6 flex flex-col items-center text-center">
          <motion.p
            id={descId}
            {...fadeUp(0.1)}
            className="max-w-2xl text-white/70 text-lg self-start text-left"
          >
            Запускаем приложения под iOS и Android с оффлайном, пушами, аналитикой и безопасной
            авторизацией. Быстрые релизы и масштабируемая архитектура — с первого дня.
          </motion.p>

          {/* Метрики */}
          <div
            className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-5xl"
            role="list"
            aria-label="Ключевые показатели качества"
          >
            <MetricCard
              label="Стабильность (crash-free)"
              value={99.8}
              decimals={1}
              suffix="%"
              delay={0.12}
              reduced={reduced}
              ariaLabel="Стабильность, девяносто девять и восемь десятых процента сессий без падений"
            />
            <MetricCard
              label="Согласие на пуши"
              value={60}
              suffix="%"
              delay={0.17}
              reduced={reduced}
              ariaLabel="Доля пользователей, согласившихся на пуш-уведомления, шестьдесят процентов"
            />
            <MetricCard
              label="Частота релизов"
              value={2}
              prefix="каждые "
              suffix=" недели"
              delay={0.22}
              reduced={reduced}
              ariaLabel="Частота релизов: каждые две недели"
            />
          </div>

          {/* Карточки преимуществ */}
          <ul className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl" role="list">
            {BENEFITS.map((b, i) => (
              <li key={b.title}>
                <BenefitCard icon={b.icon} title={b.title} text={b.desc} badge={b.chip} delay={0.26 + i * 0.05} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ======== subcomponents ======== */
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
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>

        <div className="mt-3 flex items-center justify-center gap-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          {badge && (
            <span className="rounded-full border border-white/15 bg-white/[0.06] px-2 py-0.5 text-[11px] leading-5 text-white/85">
              {badge}
            </span>
          )}
        </div>

        <p className="mt-3 text-sm text-white/75 leading-relaxed px-3 max-w-[50ch]">{text}</p>

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