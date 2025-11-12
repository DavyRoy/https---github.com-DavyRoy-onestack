"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useEffect, useMemo, useState, useId } from "react";
import { CheckCircle } from "lucide-react";

/* ===== Motion helpers (взяты из HomeIntro) ===== */
const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: "easeOut", delay: d },
});
const line = (d = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { delay: d, duration: 0.5, ease: "easeOut" },
  },
});

export default function SiteIntro() {
  const [reduced, setReduced] = useState(false);
  const titleId = useId();
  const subtitleId = useId();

  useEffect(() => {
    const q = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(q.matches);
    const on = (e: MediaQueryListEvent) => setReduced(e.matches);
    q.addEventListener?.("change", on);
    return () => q.removeEventListener?.("change", on);
  }, []);

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://onestack24.ru";

  const jsonLdService = useMemo(
    () => ({
      "@context": "https://onestack24.ru",
      "@type": "Service",
      name: "Разработка сайтов",
      serviceType: "Website development",
      provider: { "@type": "Organization", name: "OneStack", url: SITE_URL },
      areaServed: ["RU", "KZ", "BY", "AM"],
      url: `${SITE_URL}/sites`,
      description:
        "Создаём быстрые, адаптивные и SEO-готовые сайты: лендинги, корпоративные порталы и интернет-магазины. Чистая архитектура, Core Web Vitals и поддержка.",
    }),
    [SITE_URL]
  );

  const jsonLdBreadcrumbs = useMemo(
    () => ({
      "@context": "https://onestack24.ru",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Главная", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Сайты", item: `${SITE_URL}/sites` },
      ],
    }),
    [SITE_URL]
  );

  const jsonLdWebPage = useMemo(
    () => ({
      "@context": "https://onestack24.ru",
      "@type": "WebPage",
      name: "Сайты — разработка быстрых и SEO-готовых сайтов | OneStack",
      url: `${SITE_URL}/sites`,
      description:
        "Сайты под ключ: лендинги, корпоративные сайты и магазины на современной архитектуре. Скорость, SEO, i18n, интеграции и поддержка.",
      inLanguage: "ru-RU",
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: `${SITE_URL}/sitehello1.png`,
      },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Главная", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Сайты", item: `${SITE_URL}/sites` },
        ],
      },
      about: {
        "@type": "Thing",
        name: "Разработка сайтов",
      },
      isPartOf: { "@type": "WebSite", url: SITE_URL, name: "OneStack" },
    }),
    [SITE_URL]
  );

  const btnBase =
    "inline-flex items-center justify-center rounded-full font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 transition text-center";
  const btnSize = "h-12 min-w-[200px] px-6";

  return (
    <section
      id="intro"
      aria-labelledby={titleId}
      aria-describedby={subtitleId}
      className="relative flex items-center overflow-hidden bg-black text-white min-h-[100dvh] pt-[64px] md:pt-[72px]"
    >
      {/* JSON-LD */}
      <Script id="ld-service-sites" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdService) }} />
      <Script id="ld-breadcrumbs-sites" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumbs) }} />
      <Script id="ld-webpage-sites" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebPage) }} />
      <Script id="favicon" strategy="afterInteractive">
        {`
          const link = document.createElement('link');
          link.rel = 'icon';
          link.type = 'image/png';
          link.sizes = '32x32';
          link.href = '/vercal.png';
          document.head.appendChild(link);
        `}
      </Script>
      {/* BG desktop */}
      <div className="absolute inset-0 hidden md:block z-0">
        <Image src="/sitehello1.png" alt="" fill priority sizes="100vw" className="object-contain object-right scale-90" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.72) 54%, rgba(0,0,0,0.28) 72%, rgba(0,0,0,0.5) 96%)",
          }}
        />
        {!reduced && (
          <motion.div
            aria-hidden="true"
            className="absolute inset-0"
            initial={{ opacity: 0.04 }}
            animate={{ opacity: [0.04, 0.08, 0.04] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            style={{ background: "radial-gradient(60% 40% at 62% 48%, rgba(255,255,255,0.08), transparent 70%)" }}
          />
        )}
      </div>

      {/* BG mobile */}
      <div className="absolute inset-0 md:hidden z-0">
        <Image src="/sitehello1.png" alt="" fill priority sizes="150vw" className="object-cover" />
        <div className="absolute inset-0 bg-black/75" />
      </div>

      {/* TEXT */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-12 lg:px-20">
        <p className="sr-only">
          Создаём быстрые, адаптивные, SEO-готовые сайты — от лендингов до магазинов.
        </p>

        <div className="grid grid-cols-12 gap-x-6">
          <div className="col-span-12 md:col-span-7 text-center md:text-left">
            <motion.p
              {...(reduced ? {} : fadeUp(0))}
              className="uppercase text-[12px] tracking-[0.25em] text-white/45 mb-2"
            >
              сайты
            </motion.p>

            <motion.h1
              id={titleId}
              aria-label="Сайты, которые приводят клиентов"
              className="max-w-[64rem] font-extrabold tracking-tight leading-[0.9]"
            >
              <motion.span {...(reduced ? {} : line(0.0))} className="block text-[clamp(2.6rem,5vw,5rem)] text-white">
                Сайты,
              </motion.span>
              <motion.span {...(reduced ? {} : line(0.05))} className="block text-[clamp(2.6rem,4.6vw,4.5rem)] text-white/80">
                которые приводят
              </motion.span>
              <motion.span {...(reduced ? {} : line(0.1))} className="block text-[clamp(2.6rem,4.6vw,4.5rem)] text-white/80">
                клиентов
              </motion.span>
            </motion.h1>

            <motion.p
              id={subtitleId}
              {...(reduced ? {} : fadeUp(0.12))}
              className="mt-5 max-w-[34rem] mx-auto md:mx-0 text-[17px] text-white/75 leading-[1.25]"
            >
              Быстрые, адаптивные и надёжные сайты с архитектурой, готовой к развитию. Мы делаем их удобными для пользователей и заметными для поисковиков.
            </motion.p>

            {/* bullets */}
            <motion.ul
              {...(reduced ? {} : fadeUp(0.18))}
              className="mt-5 space-y-3 text-white/60 text-[15px]"
              aria-label="Ключевые преимущества"
            >
              {[
                "Первые результаты уже через 1–2 недели",
                "Подключаем оплаты, CRM и склад",
                "Сайт оптимизирован для поисковиков и всегда быстрый",
                "Продолжаем поддержку и развитие после запуска",
              ].map((f, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" aria-hidden="true" />
                  <span>{f}</span>
                </li>
              ))}
            </motion.ul>

            {/* CTAs */}
            <motion.div
              {...(reduced ? {} : fadeUp(0.24))}
              className="mt-6 flex flex-col sm:flex-row gap-3 justify-center md:justify-start"
            >
              <Link
                href="#types"
                className={`${btnBase} ${btnSize} border border-white/70 text-white hover:bg-white/10`}
                aria-label="Перейти к разделу «Виды сайтов»"
              >
                Виды сайтов
              </Link>
              <Link
                href="#calculator"
                className={`${btnBase} ${btnSize} bg-white text-black hover:shadow-white/20`}
                aria-label="Перейти к калькулятору стоимости"
              >
                Стоимость сайтов
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}