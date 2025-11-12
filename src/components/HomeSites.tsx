// src/app/components/HomeSites.tsx
"use client";

import {
  motion,
  useReducedMotion,
  useSpring,
  useTransform,
  useScroll,
} from "framer-motion";
import React, { useEffect, useRef, useId, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";

export default function HomeSites() {
  const reduced = useReducedMotion();
  const titleId = useId();
  const descId = useId();

  /* ----- Parallax by scroll (только позиция) ----- */
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const yParallax = useTransform(scrollYProgress, [0, 1], [-18, 18]);

  /* ----- 3D tilt by mouse (desktop) ----- */
  const frameRef = useRef<HTMLDivElement | null>(null);
  const rx = useSpring(0, { stiffness: 160, damping: 20, mass: 0.6 });
  const ry = useSpring(0, { stiffness: 160, damping: 20, mass: 0.6 });
  const scale = useSpring(1, { stiffness: 180, damping: 18 });

  useEffect(() => {
    const fine = window.matchMedia?.("(pointer: fine)")?.matches;
    if (!fine || reduced) return;
    const el = frameRef.current;
    if (!el) return;

    const MAX = 6;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      rx.set((0.5 - py) * 2 * MAX);
      ry.set((px - 0.5) * 2 * MAX);
    };
    const onEnter = () => scale.set(1.01);
    const onLeave = () => {
      rx.set(0);
      ry.set(0);
      scale.set(1);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [reduced, rx, ry, scale]);

  /* ----- контент ----- */
  const TECH = [
    "Next.js / React",
    "TypeScript",
    "Headless CMS",
    "SSR/SSG / ISR",
    "Tailwind CSS",
    "SEO / Schema.org",
    "i18n",
    "Analytics",
    "CDN / Image Opt",
    "CI/CD",
    "Playwright",
    "Sentry",
  ];

  const SUBTYPES = [
    { name: "Лендинг", note: "Запуски и промо", url: "/sites#landing" },
    { name: "Корпоративный", note: "Разделы, блог, вакансии", url: "/sites#corporate" },
    { name: "E-commerce", note: "Каталог, корзина, оплата", url: "/sites#ecommerce" },
  ];

  /* ----- JSON-LD (расширенный) ----- */
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://onestack24.ru";
  const jsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Service",
          name: "Разработка сайтов под ключ",
          description:
            "Быстрые, адаптивные и SEO-готовые сайты на Next.js: архитектура, дизайн-система, Headless CMS, i18n, Core Web Vitals.",
          serviceType: "Website Development",
          url: `${SITE_URL}/sites`,
          provider: {
            "@type": "Organization",
            name: "OneStack",
            url: SITE_URL,
            logo: `${SITE_URL}/vercal.png`,
          },
          areaServed: ["RU", "KZ", "BY", "AM"],
          termsOfService: `${SITE_URL}/terms`,
          keywords:
            "разработка сайта, быстрая загрузка, Core Web Vitals, Headless CMS, SEO, Schema.org, Next.js",
          offers: {
            "@type": "Offer",
            priceCurrency: "RUB",
            priceSpecification: {
              "@type": "PriceSpecification",
              priceCurrency: "RUB",
              minPrice: "120000",
              maxPrice: "900000",
              priceType: "estimated",
            },
            availability: "https://schema.org/InStock",
            url: `${SITE_URL}/home#contact`,
          },
        },
        {
          "@type": "ItemList",
          name: "Типы сайтов",
          itemListElement: SUBTYPES.map((s, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${SITE_URL}${s.url}`,
            name: s.name,
          })),
        },
        {
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "Сколько времени занимает запуск сайта?",
              acceptedAnswer: {
                "@type": "Answer",
                text:
                  "MVP лендинга — от 1–2 недель, корпоративный сайт — от 3–6 недель в зависимости от сложности и интеграций.",
              },
            },
            {
              "@type": "Question",
              name: "Настраиваете ли вы SEO и аналитику?",
              acceptedAnswer: {
                "@type": "Answer",
                text:
                  "Да: мета-теги, Open Graph, Schema.org, карта сайта, редиректы, счетчики, события и цели. Проверяем Core Web Vitals.",
              },
            },
          ],
        },
      ],
    }),
    [SITE_URL]
  );

  return (
    <section
      ref={sectionRef}
      id="sites"
      className="relative flex min-h-screen w-full items-center overflow-hidden
                 bg-gradient-to-b from-black via-[#0b0b0b] to-black text-white
                 pt-20 pb-24 md:pt-24 md:pb-28"
      aria-labelledby={titleId}
      aria-describedby={descId}
    >
      {/* JSON-LD для сниппетов */}
      <Script
        id="ld-home-sites"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* sr-only краткое резюме (для SEO/доступности) */}
      <p id={descId} className="sr-only">
        Разработка сайтов на Next.js: лендинги, корпоративные разделы и e-commerce. Упор на скорость, SEO и масштабирование.
      </p>

      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          maskImage:
            "radial-gradient(60% 50% at 50% 40%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
          background:
            "radial-gradient(600px 320px at 50% 20%, rgba(255,255,255,0.06), transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-12 lg:px-20">
        {/* Заголовок слева (как на главной) */}
        <motion.h2
          id={titleId}
          initial={reduced ? undefined : { opacity: 0, y: 18 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-[clamp(1.9rem,4vw,3.2rem)] font-extrabold leading-tight tracking-tight text-left"
        >
          Сайты — быстрые, адаптивные, готовые к росту
        </motion.h2>

        {/* Остальное по центру */}
        <div className="mt-6 flex flex-col items-center text-center">
          <motion.p
            initial={reduced ? undefined : { opacity: 0, y: 18 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.05 }}
            className="max-w-2xl text-[1.05rem] text-white/70"
          >
            От лендингов до крупных e-commerce проектов. Мы проектируем удобную структуру, создаём чистый и быстрый код, настраиваем SEO и делаем сайты доступными для всех. После релиза остаёмся рядом: поддерживаем и развиваем.
          </motion.p>

          {/* Картинка (параллакс и tilt) */}
          <motion.div
            style={reduced ? undefined : { y: yParallax }}
            initial={{ opacity: 0, scale: 0.975, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.12 }}
            className="relative mt-1 w-full max-w-5xl will-change-transform"
          >
            <div
              aria-hidden
              className="absolute -inset-12 rounded-[2rem] blur-3xl"
              style={{
                background:
                  "radial-gradient(65% 50% at 60% 50%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%)",
              }}
            />
            <motion.div
              ref={frameRef}
              style={
                reduced
                  ? undefined
                  : { rotateX: rx, rotateY: ry, scale, transformPerspective: 1000 }
              }
              className="relative overflow-hidden rounded-2xl shadow-[0_30px_100px_rgba(0,0,0,0.6)]"
            >
              <div className="relative w-full h-[48vh] sm:h-[60vh] lg:h-[72vh] mx-auto">
                <Image
                  src="/site2.png"
                  alt="Современный сайт: лендинг, каталог и корпоративные разделы — быстрый и адаптивный интерфейс"
                  fill
                  priority={false}
                  className="object-contain select-none pointer-events-none"
                  sizes="(max-width: 768px) 92vw, (max-width: 1280px) 70vw, 1100px"
                  draggable={false}
                />
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
              </div>
            </motion.div>
          </motion.div>

          {/* Технологии — чипы */}
          <div className="mt-1 w-full max-w-5xl" aria-labelledby="sites-tech-title">
            <div id="sites-tech-title" className="mb-3 text-sm uppercase tracking-[0.25em] text-white/50">
              технологии
            </div>
            <ul className="flex flex-wrap justify-center gap-2">
              {TECH.map((t) => (
                <li key={t}>
                  <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[12px] text-white/80">
                    {t}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Мини-категории — теперь реальный ul/li для семантики */}
          <ul className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-5 w-full max-w-4xl">
            {SUBTYPES.map((it, idx) => (
              <li key={it.name}>
                <motion.div
                  initial={reduced ? undefined : { opacity: 0, y: 16 }}
                  whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, ease: "easeOut", delay: 0.06 * idx }}
                  className="rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-5 hover:bg-white/[0.08] transition group"
                >
                  <Link
                    href={it.url}
                    className="inline-block text-base font-semibold underline decoration-transparent group-hover:decoration-white/30 decoration-2 underline-offset-4"
                    aria-label={`Подробнее о типе сайта: ${it.name}`}
                  >
                    {it.name}
                  </Link>
                  <div className="text-sm text-white/60 mt-1">{it.note}</div>
                  <div className="mt-3 h-1.5 w-0 group-hover:w-full transition-all rounded-full bg-white/30" />
                </motion.div>
              </li>
            ))}
          </ul>

          {/* Описание */}
          <div className="mt-8 w-full max-w-4xl text-white/60 leading-relaxed">
            <p>
              Мы делаем сайты удобными и заметными: продумываем структуру, дизайн и доступность для всех пользователей. Подключаем мультиязычность и SEO, чтобы вас легко находили в поиске и соцсетях.
            </p>
            <p className="mt-3 text-white/60">
              Заботимся о скорости: используем CDN, оптимизируем изображения и подключаем аналитику. Сайт проходит сборку и тесты автоматически, работает стабильно, а мы следим за его состоянием и поддерживаем после запуска.
            </p>
          </div>

          {/* CTA */}
          <motion.div
            initial={reduced ? undefined : { opacity: 0, y: 16 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mt-12 flex flex-col sm:flex-row items-center gap-3"
          >
            <Link
              href="/sites"
              className="inline-flex items-center justify-center rounded-full bg-white px-7 py-4 font-semibold text-black hover:shadow-lg hover:shadow-white/20 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              aria-label="Подробнее о разработке сайтов — перейти к разделу «Сайты»"
            >
              О сайтах
              <svg className="ml-2 h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M5 12h14m0 0l-5-5m5 5l-5 5" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </Link>
            <Link
              href="/home#contact"
              className="inline-flex items-center justify-center rounded-full border border-white/30 px-7 py-4 font-semibold text-white/90 hover:bg-white/10 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              aria-label="Открыть форму связи — обсудить проект"
            >
              Обсудить проект
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}