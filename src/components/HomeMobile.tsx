// src/app/components/HomeMobile.tsx
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

export default function HomeMobile() {
  const reduced = useReducedMotion();
  const titleId = useId();
  const descId = useId();

  /* ----- Parallax by scroll (позиция, без opacity) ----- */
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const yParallax = useTransform(scrollYProgress, [0, 1], [-18, 18]);

  /* ----- 3D tilt by mouse (desktop only) ----- */
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
      rx.set((0.5 - py) * 2 * MAX); // X
      ry.set((px - 0.5) * 2 * MAX); // Y
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
    "Swift / Kotlin",
    "React Native / Expo",
    "Offline-first",
    "Push / In-app",
    "Deeplinks",
    "StoreKit / Play Billing",
    "Firebase / Amplitude",
    "WebSockets / SSE",
    "RBAC / OAuth",
    "Feature Flags",
    "CI/CD (TestFlight/Play)",
    "Sentry / Crashlytics",
  ];

  const SUBTYPES = [
    { name: "Нативные", note: "Swift/Kotlin", url: "/mobile#native" },
    { name: "Кроссплатформа", note: "React Native / Expo", url: "/mobile#cross" },
    { name: "B2C / B2B", note: "Продукты и внутренние решения", url: "/mobile#b2c-b2b" },
  ];

  /* ----- SEO JSON-LD (Service + ItemList + FAQ) ----- */
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://onestack24.ru";
  const jsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Service",
          name: "Разработка мобильных приложений",
          serviceType: "Mobile App Development",
          description:
            "Мобильные приложения для iOS и Android: нативные (Swift/Kotlin) и кроссплатформенные (React Native/Expo). Оффлайн, пуш-уведомления, аналитика, безопасная авторизация и CI/CD.",
          url: `${SITE_URL}/mobile`,
          provider: {
            "@type": "Organization",
            name: "OneStack",
            url: SITE_URL,
            logo: `${SITE_URL}/vercal.png`,
          },
          areaServed: ["RU", "KZ", "BY", "AM"],
          keywords:
            "разработка мобильных приложений, iOS, Android, React Native, Swift, Kotlin, оффлайн, пуш-уведомления, публикация в сторах",
          offers: {
            "@type": "Offer",
            priceCurrency: "RUB",
            priceSpecification: {
              "@type": "PriceSpecification",
              priceCurrency: "RUB",
              minPrice: "180000",
              maxPrice: "1500000",
              priceType: "estimated",
            },
            availability: "https://schema.org/InStock",
            url: `${SITE_URL}/home#contact`,
          },
        },
        {
          "@type": "ItemList",
          name: "Типы мобильных решений",
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
              name: "Какой стек выбрать: нативный или React Native?",
              acceptedAnswer: {
                "@type": "Answer",
                text:
                  "Для максимальной производительности и доступа к специфичным API — нативный (Swift/Kotlin). Для быстрого выхода и общей кодовой базы — React Native/Expo. Подбираем стек под цели и бюджет.",
              },
            },
            {
              "@type": "Question",
              name: "Помогаете с публикацией и поддержкой?",
              acceptedAnswer: {
                "@type": "Answer",
                text:
                  "Да. Готовим билды, подписи, скриншоты, описания, проводим модерацию в App Store и Google Play. Настраиваем аналитику, краш-мониторинг и обновления.",
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
      id="mobile"
      className="relative flex min-h-screen w-full items-center overflow-hidden
                 bg-gradient-to-b from-black via-[#0c0c0c] to-black text-white
                 pt-20 pb-24 md:pt-24 md:pb-28"
      aria-labelledby={titleId}
      aria-describedby={descId}
    >
      {/* JSON-LD */}
      <Script
        id="ld-home-mobile"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* sr-only резюме */}
      <p id={descId} className="sr-only">
        Разработка мобильных приложений для iOS и Android: нативные на Swift/Kotlin и кроссплатформенные на React Native/Expo. Оффлайн, пуш-уведомления, аналитика, безопасная авторизация и публикация в сторах.
      </p>

      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          maskImage:
            "radial-gradient(60% 50% at 50% 40%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
          background:
            "radial-gradient(600px 340px at 50% 22%, rgba(255,255,255,0.06), transparent 72%)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-12 lg:px-20">
        {/* Заголовок */}
        <motion.h2
          id={titleId}
          initial={reduced ? undefined : { opacity: 0, y: 18 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-[clamp(1.9rem,4vw,3.2rem)] font-extrabold leading-tight tracking-tight text-left"
        >
          Мобильные приложения для iOS и Android — быстро, надёжно, масштабируемо
        </motion.h2>

        {/* Контент по центру */}
        <div className="mt-6 flex flex-col items-center text-center">
          {/* Подзаголовок */}
          <motion.p
            initial={reduced ? undefined : { opacity: 0, y: 18 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.05 }}
            className="max-w-2xl text-[1.05rem] text-white/70"
          >
            Мы создаём нативные (Swift, Kotlin) и кроссплатформенные (React Native, Expo) приложения. Поддерживаем оффлайн-режим, пуш-уведомления, аналитику и безопасную авторизацию. Настраиваем CI/CD и берём на себя поддержку и развитие.
          </motion.p>

          {/* Превью */}
          <motion.div
            style={reduced ? undefined : { y: yParallax }}
            initial={{ opacity: 0, scale: 0.975, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.12 }}
            className="relative mt-12 w-full max-w-5xl will-change-transform"
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
              className="relative overflow-hidden rounded-2xl shadow-[0_24px_90px_rgba(0,0,0,0.6)]"
            >
              <div className="relative w-full h-[48vh] sm:h-[60vh] lg:h-[72vh] mx-auto">
                <Image
                  src="/mobile_app2.png"
                  alt="Мобильный интерфейс: экраны профиля, каталог и дашборд — iOS/Android"
                  fill
                  className="object-contain select-none pointer-events-none"
                  sizes="(max-width: 768px) 92vw, (max-width: 1280px) 70vw, 1100px"
                  draggable={false}
                />
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
              </div>
            </motion.div>
          </motion.div>

          {/* Технологии */}
          <div className="mt-8 w-full max-w-5xl" aria-labelledby="mobile-tech-title">
            <div id="mobile-tech-title" className="mb-3 text-sm uppercase tracking-[0.25em] text-white/50">
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

          {/* Мини-категории (семантический ul/li) */}
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
                    aria-label={`Подробнее о типе мобильных решений: ${it.name}`}
                  >
                    {it.name}
                  </Link>
                  <div className="text-sm text-white/60 mt-1">{it.note}</div>
                  <div className="mt-3 h-1.5 w-0 group-hover:w-full transition-all rounded-full bg-white/30" />
                </motion.div>
              </li>
            ))}
          </ul>

          {/* Расширенное описание */}
          <div className="mt-8 w-full max-w-4xl text-white/60 leading-relaxed">
            <p>
              Мы делаем мобильные приложения удобными и безопасными: добавляем оффлайн-режим, пуш-уведомления, оплату и глубокие ссылки (deeplinks). Подключаем аналитику, чтобы понимать, как пользователи взаимодействуют с продуктом.
            </p>
            <p className="mt-3">
              Настраиваем CI/CD, подписи, TestFlight/Play Console, мониторинг стабильности и обновления.
              Помогаем с релизами, метриками и дальнейшим развитием.
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
              href="/home#contact"
              className="inline-flex items-center justify-center rounded-full bg-white px-7 py-4 font-semibold text-black hover:shadow-lg hover:shadow-white/20 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              aria-label="Оставить запрос на разработку мобильного приложения"
            >
              Обсудить мобильное приложение
              <svg className="ml-2 h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14m0 0l-5-5m5 5l-5 5" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </Link>
            <Link
              href="/home#calculator"
              className="inline-flex items-center justify-center rounded-full border border-white/30 px-7 py-4 font-semibold text-white/90 hover:bg-white/10 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              aria-label="Перейти к калькулятору стоимости"
            >
              Прикинуть бюджет
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}