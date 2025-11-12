// src/components/MobileIntro.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useEffect, useMemo, useState, useId } from "react";
import { CheckCircle } from "lucide-react";

const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut", delay: d },
});

export default function MobileIntro() {
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

  // CTA стили
  const btnBase =
    "inline-flex items-center justify-center rounded-full font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 transition text-center";
  const btnSize = "h-12 min-w-[220px] px-6";

  const line = (d = 0) => ({
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0, transition: { delay: d, duration: 0.5, ease: "easeOut" } },
  });

  /* ===== SEO JSON-LD ===== */
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://onestack24.ru";
  const PAGE_PATH = "/mobile-apps";
  const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;

  // Service: разработка мобильных приложений
  const jsonLdService = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Разработка мобильных приложений",
      serviceType: "Mobile app development",
      provider: { "@type": "Organization", name: "OneStack", url: SITE_URL },
      areaServed: ["RU", "KZ", "BY", "AM"],
      url: PAGE_URL,
      description:
        "Мобильные приложения с удобным UX и надёжной архитектурой: нативные и кроссплатформенные решения, интеграции с CRM и оплатами, уведомления, аналитика. Готовность к масштабированию и SLA-поддержка.",
    }),
    [PAGE_URL, SITE_URL]
  );

  // WebPage
  const jsonLdWebPage = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Мобильные приложения — разработка под рост и удержание",
      url: PAGE_URL,
      inLanguage: "ru",
      isPartOf: { "@type": "WebSite", name: "OneStack", url: SITE_URL },
      breadcrumb: { "@id": "#breadcrumbs" },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: `${SITE_URL}/mobile1.png`,
      },
      description:
        "Создаём мобильные приложения, которые повышают вовлечённость и удержание: нативные/кроссплатформенные, интеграции с CRM и платежами, аналитика и уведомления.",
    }),
    [PAGE_URL, SITE_URL]
  );

  // Хлебные крошки
  const jsonLdBreadcrumbs = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": "#breadcrumbs",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Главная", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Мобильные приложения", item: PAGE_URL },
      ],
    }),
    [PAGE_URL, SITE_URL]
  );

  // FAQ (по желанию; полезно для расширенных сниппетов)
  const jsonLdFAQ = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Какие сроки первых релизов?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Первые релизы — через 1–2 спринта (обычно 2–4 недели). Зависит от платформ, интеграций и объёма функционала.",
          },
        },
        {
          "@type": "Question",
          name: "Какие интеграции поддерживаете?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Платёжные шлюзы, CRM (Bitrix24/amoCRM), push-уведомления, аналитика, авторизация/SSO, backend API, склад/учёт.",
          },
        },
      ],
    }),
    []
  );

  return (
    <section
      id="intro"
      aria-labelledby={titleId}
      aria-describedby={subtitleId}
      className="relative flex items-center overflow-hidden bg-black text-white min-h-[100dvh] pt-[64px] md:pt-[72px]"
    >
      {/* JSON-LD */}
      <Script id="ld-mobile-service" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdService) }} />
      <Script id="ld-mobile-webpage" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebPage) }} />
      <Script id="ld-mobile-breadcrumbs" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumbs) }} />
      <Script id="ld-mobile-faq" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFAQ) }} />
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
      
      {/* ===== Desktop BG (декоративно) ===== */}
      <div className="absolute inset-0 hidden md:block z-0" aria-hidden>
        <Image
          src="/mobile1.png"
          alt=""           /* декоративный фон */
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-contain object-right"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.82) 54%, rgba(0,0,0,0.40) 72%, rgba(0,0,0,5) 98%)",
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

      {/* ===== Mobile BG (декоративно) ===== */}
      <div className="absolute inset-0 block md:hidden z-0" aria-hidden>
        <Image
          src="/mobile1.png"
          alt=""           /* декоративный фон */
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* ===== TEXT ===== */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-12 lg:px-20">
        <p className="sr-only">
          Разработка мобильных приложений: нативные и кроссплатформенные решения, интеграции с CRM и оплатами, уведомления и аналитика.
        </p>

        <div className="grid grid-cols-2 gap-x-6">
          <div className="col-span-12 md:col-span-6 text-center md:text-left">
            <motion.p
              {...(reduced ? {} : fadeUp(0))}
              className="text-[12px] uppercase tracking-[0.25em] text-white/40 mb-2"
            >
              мобильные приложения
            </motion.p>

            <motion.h1
              id={titleId}
              aria-label="Мобильные приложения, которые повышают вовлечённость"
              className="max-w-[64rem] text-white font-extrabold tracking-tight leading-[0.9]"
            >
              <motion.span {...(reduced ? {} : line(0.00))} className="block text-[clamp(3rem,5vw,5rem)]">
                Мобильные приложения,
              </motion.span>
              <motion.span {...(reduced ? {} : line(0.05))} className="block text-[clamp(3rem,4.5vw,4.5rem)] text-white/60">
                которые работают
              </motion.span>
              <motion.span {...(reduced ? {} : line(0.10))} className="block text-[clamp(3rem,4.5vw,4.5rem)] text-white/60">
                ваш сервис
              </motion.span>
            </motion.h1>

            <motion.p
              id={subtitleId}
              {...(reduced ? {} : fadeUp(0.1))}
              className="mt-5 max-w-[36rem] mx-auto md:mx-0 text-white/70 text-[clamp(1rem,2.1vw,1.15rem)] leading-[1.28]"
            >
              Мобильные приложения с удобным UX и надёжной архитектурой — под рост бизнеса и удержание клиентов.
            </motion.p>

            {/* преимущества */}
            <motion.ul
              {...(reduced ? {} : fadeUp(0.15))}
              className="mt-5 space-y-3 text-white/65 text-base"
            >
              {[
                "Спринты 1–2 недели",
                "Интеграции: оплаты, уведомления",
                "SEO-ready (лендинги и сторожки)",
                "Готовность к масштабированию",
              ].map((f, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" aria-hidden="true" />
                  <span>{f}</span>
                </li>
              ))}
            </motion.ul>

            {/* CTA */}
            <motion.div
              {...(reduced ? {} : fadeUp(0.2))}
              className="mt-8 flex flex-col sm:flex-row gap-3 justify-center md:justify-start"
            >
              <Link
                href="#types"
                className={`${btnBase} ${btnSize} border border-white/75 text-white hover:bg-white/10`}
                aria-label="Перейти к разделу «Типы приложений»"
              >
                Типы приложений
              </Link>
              <Link
                href="#calculator"
                className={`${btnBase} ${btnSize} bg-white text-black hover:shadow-white/20 hover:shadow-lg`}
                aria-label="Перейти к калькулятору стоимости"
              >
                Стоимость приложений
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}