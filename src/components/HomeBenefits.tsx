// src/app/components/HomeBenefits.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState, useId } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Gauge,
  PlugZap,
  Wrench,
  Layers,
  Clock3,
  Handshake,
} from "lucide-react";
import Link from "next/link";

/* ========= helpers ========= */

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduce(!!mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return reduce;
}

function useAnimatedNumber({
  from = 0,
  to,
  duration = 1200,
  formatter,
  disabled = false,
}: {
  from?: number;
  to: number;
  duration?: number;
  formatter?: (v: number) => string;
  disabled?: boolean;
}) {
  const [val, setVal] = useState(from);
  const raf = useRef<number | null>(null);
  const start = useRef<number | null>(null);

  useEffect(() => {
    if (disabled) {
      setVal(to);
      return;
    }
    start.current = null;

    const tick = (t: number) => {
      if (start.current == null) start.current = t;
      const p = Math.min(1, (t - start.current) / duration);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setVal(from + (to - from) * eased);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [from, to, duration, disabled]);

  const text = useMemo(() => {
    const n = Number(val.toFixed(2));
    return formatter ? formatter(n) : String(n);
  }, [val, formatter]);

  return text;
}

function AnimatedNumber({
  to,
  duration,
  suffix = "",
  prefix = "",
  reduced,
  decimals = 0,
}: {
  to: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  reduced: boolean;
  decimals?: number;
}) {
  const raw = useAnimatedNumber({
    to,
    duration,
    disabled: reduced,
  });
  const shown = reduced ? to.toFixed(decimals) : Number(raw).toFixed(decimals);
  return (
    <span className="tabular-nums">
      {prefix}
      {shown}
      {suffix}
    </span>
  );
}

/* ========= component ========= */

export default function HomeBenefits() {
  const reduceMotion = usePrefersReducedMotion();
  const titleId = useId();
  const descId = useId();

  const fadeUp = (d = 0) => ({
    initial: reduceMotion ? {} : { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    transition: reduceMotion
      ? { duration: 0 }
      : { duration: 0.55, ease: "easeOut", delay: d },
    viewport: { once: true, amount: 0.25 },
  });

  // SEO: ItemList + Breadcrumbs + небольшой FAQ
  const seoJsonLd = useMemo(() => {
    const base =
      (typeof process !== "undefined" && process.env.NEXT_PUBLIC_SITE_URL) ||
      "https://onestack24.ru";

    const items = [
      { name: "Скорость и Core Web Vitals", description: "Мы следим за скоростью и стабильностью: оптимизируем рендеринг, графику и сеть." },
      { name: "Безопасность", description: "Ваши данные под защитой: мы используем шифрование, резервные копии и разграничение доступа." },
      { name: "Интеграции и API", description: "Мы соединяем ваш продукт с нужными сервисами: от CRM и бухгалтерии до аналитики и маркетинга." },
      { name: "Масштабируемость", description: "Мы создаём решения, которые масштабируются вместе с вашим бизнесом." },
      { name: "Поддержка и развитие", description: "Автоматические тесты, предпросмотры и безопасные откаты. Новые функции выходят быстро и без простоев." },
    ];

    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "ItemList",
          name: "Преимущества OneStack",
          url: `${base}/#benefits`,
          itemListElement: items.map((it, idx) => ({
            "@type": "ListItem",
            position: idx + 1,
            item: { "@type": "Thing", name: it.name, description: it.description },
          })),
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Домашняя", item: `${base}/` },
            { "@type": "ListItem", position: 2, name: "Преимущества", item: `${base}/#benefits` },
          ],
        },
        {
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "Помогаете ли с Core Web Vitals?",
              acceptedAnswer: {
                "@type": "Answer",
                text:
                  "Да: оптимизируем изображения/шрифты, критический CSS, бандл и проводим регулярные замеры CWV.",
              },
            },
            {
              "@type": "Question",
              name: "Как обеспечивается безопасность?",
              acceptedAnswer: {
                "@type": "Answer",
                text:
                  "RBAC, валидация, rate limiting, шифрование, логирование и алерты. Следуем OWASP и обновляем зависимости.",
              },
            },
          ],
        },
      ],
    };
  }, []);

  return (
    <section
      id="benefits"
      className="relative w-full overflow-hidden bg-gradient-to-b from-black via-[#0b0b0b] to-black text-white
                 pt-20 pb-24 md:pt-24 md:pb-28"
      aria-labelledby={titleId}
      aria-describedby={descId}
    >
      {/* ambient glow */}
      <div className="absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-white/[0.04] blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 h-[420px] w-[420px] rounded-full bg-white/[0.04] blur-3xl pointer-events-none" />

      {/* Контейнер как в других секциях */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-22 lg:px-20">
        {/* Заголовок — по левой направляющей */}
        <motion.p
          {...fadeUp(0)}
          className="text-sm uppercase tracking-[0.25em] text-white/50 mb-3 text-left"
        >
          преимущества
        </motion.p>

        <motion.h2
          id={titleId}
          {...fadeUp(0.05)}
          className="text-[clamp(1.9rem,4vw,3.2rem)] font-extrabold leading-tight tracking-tight text-left max-w-4xl"
        >
          Почему с <span className="text-white/90">OneStack</span> удобно и надёжно
        </motion.h2>

        {/* Остальной контент — по центру; описание слева */}
        <div className="mt-6 flex flex-col items-center text-center">
          <motion.p
            id={descId}
            {...fadeUp(0.1)}
            className="max-w-2xl text-white/70 text-lg self-start text-left"
          >
            Мы берём на себя весь цикл разработки: от идеи и дизайна до внедрения, интеграций и поддержки. Работаем прозрачно по срокам, бюджету и качеству. В итоге вы получаете быстрый, безопасный и масштабируемый продукт.
          </motion.p>

          {/* Метрики — уменьшенные и «человечные» подписи */}
          <div
            className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 items-stretch w-full max-w-5xl"
            role="list"
            aria-label="Ключевые метрики качества"
          >
            <motion.div
              {...fadeUp(0.12)}
              className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 h-full"
              role="listitem"
              aria-label="Скорость ответа сайта"
            >
              <div className="text-xl font-semibold">
                <AnimatedNumber to={90} suffix=" мс" reduced={reduceMotion} />
              </div>
              <div className="text-xs text-white/60 mt-2">
                Скорость ответа сайта (TTFB)
              </div>
            </motion.div>

            <motion.div
              {...fadeUp(0.17)}
              className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 h-full"
              role="listitem"
              aria-label="Надёжность сервиса"
            >
              <div className="text-xl font-semibold">
                <AnimatedNumber to={99.95} decimals={2} suffix="%" reduced={reduceMotion} />
              </div>
              <div className="text-xs text-white/60 mt-2">
                Надёжность (аптайм)
              </div>
            </motion.div>

            <motion.div
              {...fadeUp(0.22)}
              className="rounded-2xl border border-white/10 bg-white/[0.03] px-8 py-4 h-full"
              role="listitem"
              aria-label="Срок запуска первого релиза"
            >
              <div className="text-xl font-semibold">
                <AnimatedNumber to={1} prefix="от " suffix=" дня" reduced={reduceMotion} />
              </div>
              <div className="text-xs text-white/60 mt-2">
                Старт первого релиза
              </div>
            </motion.div>
          </div>

          {/* Карточки преимуществ — центр, единый ритм отступов */}
          <ul className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch w-full max-w-7xl">
            <li>
              <BenefitCard
                icon={<Gauge className="h-5 w-5" aria-hidden="true" />}
                title="Скорость и Core Web Vitals"
                text="Мы следим за скоростью и стабильностью: оптимизируем рендеринг, графику и сеть."
                badge="CWV"
                delay={0.15}
                rm={reduceMotion}
              />
            </li>
            <li>
              <BenefitCard
                icon={<ShieldCheck className="h-5 w-5" aria-hidden="true" />}
                title="Безопасность"
                text="Ваши данные под защитой: мы используем шифрование, резервные копии и разграничение доступа."
                badge="OWASP"
                delay={0.18}
                rm={reduceMotion}
              />
            </li>
            <li>
              <BenefitCard
                icon={<PlugZap className="h-5 w-5" aria-hidden="true" />}
                title="Интеграции и API"
                text="Мы соединяем ваш продукт с нужными сервисами: от CRM и бухгалтерии до аналитики и маркетинга."
                badge="GraphQL"
                delay={0.21}
                rm={reduceMotion}
              />
            </li>
            <li>
              <BenefitCard
                icon={<Layers className="h-5 w-5" aria-hidden="true" />}
                title="Масштабируемость"
                text="Мы создаём решения, которые масштабируются вместе с вашим бизнесом."
                badge="Cloud"
                delay={0.24}
                rm={reduceMotion}
              />
            </li>
            <li>
              <BenefitCard
                icon={<Wrench className="h-5 w-5" aria-hidden="true" />}
                title="Поддержка и развитие"
                text="С нами ваш продукт всегда в порядке: SLA-поддержка, мониторинг и постоянные улучшения."
                badge="SLA"
                delay={0.27}
                rm={reduceMotion}
              />
            </li>
            <li>
              <BenefitCard
                icon={<Clock3 className="h-5 w-5" aria-hidden="true" />}
                title="Быстрые релизы (CI/CD)"
                text="Автоматические тесты, предпросмотры и безопасные откаты. Новые функции выходят быстро и без простоев."
                badge="CI/CD"
                delay={0.3}
                rm={reduceMotion}
              />
            </li>
          </ul>

          {/* Нижняя плашка — формат работы */}
          <motion.div
            {...fadeUp(0.35)}
            className="mt-12 flex flex-col md:flex-row items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-5 w-full max-w-7xl"
          >
            <div className="flex items-center gap-3 text-left">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
                <Handshake className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <div className="font-semibold">Работаем прозрачно и по шагам</div>
                <div className="text-sm text-white/65">
                  Мы планируем работу по роадмапу, каждые 1–2 недели, показываем демо и согласовываем результаты.
                </div>
              </div>
            </div>

            <div className="md:ml-auto">
              <Link
                href="/home#calculator"
                className="group inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-black font-semibold hover:shadow-white/20 hover:shadow-lg transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                Рассчитать стоимость
                <svg
                  className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path d="M5 12h14m0 0l-5-5m5 5l-5 5" stroke="currentColor" strokeWidth="1.8" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(seoJsonLd) }}
      />
    </section>
  );
}

/* ========= subcomponent ========= */

function BenefitCard({
  icon,
  title,
  text,
  badge,
  delay = 0,
  rm = false,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  badge?: string;
  delay?: number;
  rm?: boolean;
}) {
  return (
    <motion.div
      initial={rm ? {} : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={rm ? { duration: 0 } : { duration: 0.5, ease: "easeOut", delay }}
      className="group relative h-full rounded-2xl border border-white/10 bg-white/[0.04] p-6
                 hover:bg-white/[0.07] hover:shadow-[0_20px_60px_rgba(255,255,255,0.08)] transition"
    >
      <div className="flex flex-col items-center text-center h-full">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.08] text-white">
          {icon}
        </span>

        <div className="mt-3 flex items-center justify-center gap-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          {badge ? (
            <span className="rounded-full border border-white/15 bg-white/[0.06] px-2 py-0.5 text-[11px] leading-5 text-white/85">
              {badge}
            </span>
          ) : null}
        </div>

        <p className="mt-3 text-sm text-white/75 leading-relaxed px-3 max-w-[50ch]">
          {text}
        </p>

        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-6 right-6 -bottom-[1px] h-[2px]
                     bg-gradient-to-r from-white/0 via-white/30 to-white/0
                     opacity-0 group-hover:opacity-100 transition"
        />
      </div>
    </motion.div>
  );
}