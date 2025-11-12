// src/components/SiteShowcase.tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import Script from "next/script";

const fade = (d = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut", delay: d },
  viewport: { once: true, amount: 0.3 },
});

// СЕО-дружественные ключевые фразы (фиксированные строки)
const SLOGANS = [
  "Сайты, которые выглядят дорого и профессионально",
  "Сайты, которые работают быстро и без сбоев",
  "Сайты, готовые к росту и масштабированию",
  "Сайты, понятные и удобные для бизнеса",
] as const;

export default function SiteShowcase() {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();

  // остановка автопрокрутки при скрытии вкладки/ховере/фокусе
  const pausedRef = useRef(false);
  const hoverRef = useRef(false);
  const focusRef = useRef(false);

  // авто-смена лозунгов (без R-M)
  useEffect(() => {
    if (reduced) return; // пользователю с reduced-motion показываем статично

    const tick = () => {
      if (!pausedRef.current && !hoverRef.current && !focusRef.current) {
        setIndex((prev) => (prev + 1) % SLOGANS.length);
      }
    };

    const id = setInterval(tick, 3200);

    const onVisibility = () => {
      pausedRef.current = document.visibilityState !== "visible";
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced]);

  const onMouseEnter = () => (hoverRef.current = true);
  const onMouseLeave = () => (hoverRef.current = false);
  const onFocus = () => (focusRef.current = true);
  const onBlur = () => (focusRef.current = false);

  /* ===== JSON-LD: WebSite + ItemList (метрики/преимущества) ===== */
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://onestack24.ru";
  const jsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          name: "OneStack — разработка сайтов",
          url: `${SITE_URL}/sites`,
          inLanguage: "ru-RU",
          description:
            "Разработка быстрых и масштабируемых сайтов: лендинги, корпоративные сайты, интернет-магазины и контент-проекты. Core Web Vitals в зелёной зоне, SLA-поддержка.",
        },
        {
          "@type": "ItemList",
          name: "Ключевые преимущества OneStack",
          itemListElement: [
            { "@type": "ListItem", position: 1, item: { "@type": "Thing", name: SLOGANS[0] } },
            { "@type": "ListItem", position: 2, item: { "@type": "Thing", name: SLOGANS[1] } },
            { "@type": "ListItem", position: 3, item: { "@type": "Thing", name: SLOGANS[2] } },
            { "@type": "ListItem", position: 4, item: { "@type": "Thing", name: SLOGANS[3] } },
          ],
        },
      ],
    }),
    [SITE_URL]
  );

  return (
    <section
      id="showcase"
      aria-labelledby="showcase-title"
      className="relative min-h-[92vh] w-full overflow-hidden bg-black text-white"
      role="region"
    >
      {/* JSON-LD */}
      <Script
        id="schema-showcase"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* фоновые эффекты */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-white/[0.05] blur-3xl" />
        <div className="absolute -bottom-48 -right-28 h-[520px] w-[520px] rounded-full bg-white/[0.05] blur-3xl" />
      </div>

      {/* контент */}
      <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-6 md:px-12 lg:px-20 py-16">
        <motion.p {...fade(0)} className="text-sm uppercase tracking-[0.25em] text-white/55">
          готовность к росту
        </motion.p>

        {/* Авто-сменяемый лозунг (пауза при hover/focus, без R-M) */}
        <div
          className="relative mt-3 h-[3.2em] overflow-hidden"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onFocus={onFocus}
          onBlur={onBlur}
        >
          {SLOGANS.map((s, i) => (
            <motion.h2
              key={s}
              id={i === index ? "showcase-title" : undefined}
              initial={{ opacity: 0, y: 20 }}
              animate={
                reduced
                  ? { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : -20 }
                  : { opacity: index === i ? 1 : 0, y: index === i ? 0 : -20 }
              }
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute left-0 top-0 text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight"
            >
              {s}
            </motion.h2>
          ))}

          {/* Носкрипт/ассист для SEO/JS-off: показываем первый лозунг статично */}
          <noscript>
            <h2 id="showcase-title" className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight">
              {SLOGANS[0]}
            </h2>
          </noscript>
        </div>

        <motion.p {...fade(0.1)} className="mt-6 max-w-2xl text-lg text-white/75">
          Чистая архитектура, измеримая производительность и понятная поддержка.
          От MVP до масштабных корпоративных порталов — без переписываний и потерь качества.
        </motion.p>

        {/* метрики */}
        <div className="relative mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Core Web Vitals", value: "90+", note: "зелёная зона" },
            { title: "Средний TTFB", value: "≤ 90 мс", note: "производительность" },
            { title: "Аптайм прод", value: "99.95%", note: "надёжность" },
            { title: "Время релиза", value: "1–2 нед.", note: "итерация" },
            { title: "SLA-поддержка", value: "24/7", note: "оперативность" },
            { title: "SEO ready", value: "100%", note: "технический аудит" },
          ].map((c, i) => (
            <motion.div
              key={c.title}
              {...fade(0.2 + i * 0.05)}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-8 opacity-60 blur-2xl"
                style={{
                  background:
                    "radial-gradient(60% 60% at 60% 30%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%)",
                }}
              />
              <div className="text-sm text-white/60">{c.title}</div>
              <div className="mt-1 text-3xl font-extrabold tabular-nums">{c.value}</div>
              <div className="text-sm text-white/60">{c.note}</div>
              <span className="pointer-events-none absolute left-5 right-5 -bottom-[1px] h-[2px] bg-gradient-to-r from-white/0 via-white/40 to-white/0" />
            </motion.div>
          ))}
        </div>

        {/* примечание */}
        <motion.div {...fade(0.35)} className="mt-10 text-sm text-white/50">
          * Показатели усреднены по реальным продакшн-проектам OneStack. Финальные результаты зависят от контента,
          интеграций и нагрузки.
        </motion.div>
      </div>
    </section>
  );
}