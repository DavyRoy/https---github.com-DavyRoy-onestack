// src/components/HomeIntro.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useEffect, useId, useState, useMemo } from "react";
import { CheckCircle } from "lucide-react";

/* ===== Motion helpers ===== */
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

export default function HomeIntro() {
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

  /* ===== SEO JSON-LD ===== */
  const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL || "https://onestack24.ru";

  const jsonLdOrg = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "OneStack",
      url: SITE_URL,
      logo: `${SITE_URL}/fav/apple-touch-icon.png`,
      contactPoint: [
        {
          "@type": "ContactPoint",
          email: "info@onestack24.ru",
          telephone: "+7-910-948-61-06",
          contactType: "sales",
          areaServed: "RU",
          availableLanguage: ["ru"],
        },
      ],
    }),
    [SITE_URL]
  );

  const jsonLdWebsite = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "OneStack",
      url: SITE_URL,
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/search?q={query}`,
        "query-input": "required name=query",
      },
    }),
    [SITE_URL]
  );

  const jsonLdService = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Разработка сайтов и приложений",
      serviceType: "Software development",
      provider: { "@type": "Organization", name: "OneStack", url: SITE_URL },
      areaServed: ["RU", "KZ", "BY", "AM"],
      url: SITE_URL,
      description:
        "Создаём сайты, веб- и мобильные приложения под ключ: дизайн, разработка, интеграции и поддержка.",
    }),
    [SITE_URL]
  );

  const jsonLdBreadcrumbs = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Главная", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Домашняя",
          item: `${SITE_URL}/home`,
        },
      ],
    }),
    [SITE_URL]
  );

  /* ===== UI consts ===== */
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
      <Script
        id="ld-org-home"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
      />
      <Script
        id="ld-website-home"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
      />
      <Script
        id="ld-service-home"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdService) }}
      />
      <Script
        id="ld-breadcrumbs-home"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumbs) }}
      />
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
        <Image
          src="/hello_web1.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-contain object-right scale-90"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.95) 20%, rgba(0,0,0,0.75) 48%, rgba(0,0,0,0.45) 70%, rgba(0,0,0,1) 95%)",
          }}
        />
        {!reduced && (
          <motion.div
            aria-hidden="true"
            className="absolute inset-0"
            initial={{ opacity: 0.04 }}
            animate={{ opacity: [0.04, 0.08, 0.04] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            style={{
              background:
                "radial-gradient(60% 40% at 60% 50%, rgba(255,255,255,0.08), transparent 70%)",
            }}
          />
        )}
      </div>

      {/* BG mobile */}
      <div className="absolute inset-0 md:hidden z-0">
        <Image
          src="/hello_web1.png"
          alt=""
          fill
          priority
          sizes="150vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/65" />
      </div>

      {/* TEXT */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-12 lg:px-20">
        <p className="sr-only">
          Мы создаём сайты и приложения под ключ: дизайн, разработка, интеграции
          и поддержка. Быстро и надёжно.
        </p>

        <div className="grid grid-cols-12 gap-x-6">
          <div className="col-span-12 md:col-span-7 text-center md:text-left">
            <motion.p
              {...(reduced ? {} : fadeUp(0))}
              className="uppercase text-[12px] tracking-[0.25em] text-white/45 mb-2"
            >
              onestack
            </motion.p>

            <motion.h1
              id={titleId}
              aria-label="Мы строим платформы, которые работают за вас"
              className="max-w-[64rem] font-extrabold tracking-tight leading-[0.9]"
            >
              <motion.span
                {...(reduced ? {} : line(0.0))}
                className="block text-[clamp(2.6rem,5vw,5rem)] text-white"
              >
                Мы строим платформы,
              </motion.span>
              <motion.span
                {...(reduced ? {} : line(0.05))}
                className="block text-[clamp(2.6rem,4.6vw,4.5rem)] text-white/80"
              >
                которые работают
              </motion.span>
              <motion.span
                {...(reduced ? {} : line(0.1))}
                className="block text-[clamp(2.6rem,4.6vw,4.5rem)] text-white/80"
              >
                за вас
              </motion.span>
            </motion.h1>

            <motion.p
              id={subtitleId}
              {...(reduced ? {} : fadeUp(0.12))}
              className="mt-5 max-w-[34rem] mx-auto md:mx-0 text-[17px] text-white/75 leading-[1.25]"
            >
              Делаем сайты, веб- и мобильные приложения, которые растут вместе с вашим бизнесом. Дизайн, разработка, интеграции и поддержка — всё в одном месте. Быстрый старт, плавное развитие, без остановок.
            </motion.p>

            {/* bullets */}
            <motion.ul
              {...(reduced ? {} : fadeUp(0.18))}
              className="mt-5 space-y-3 text-white/60 text-[15px]"
              aria-label="Ключевые преимущества"
            >
              {[
                "Запускаем первые версии проектов всего за 1–2 недели",
                "Всё под ключ: приём платежей, каталог товаров, рассылки, статистика",
                "Следим за скоростью и стабильностью, чтобы всё работало без сбоев",
                "Мы всегда рядом: обновляем, следим и решаем любые проблемы",
              ].map((f, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle
                    className="h-5 w-5 text-emerald-400 shrink-0"
                    aria-hidden="true"
                  />
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
                href="#services"
                className={`${btnBase} ${btnSize} border border-white/70 text-white hover:bg-white/10`}
                aria-label="Перейти к разделу сервисов"
              >
                Больше деталей
              </Link>
              <Link
                href="#contact"
                className={`${btnBase} ${btnSize} bg-white text-black hover:shadow-white/20`}
                aria-label="Перейти к форме обратной связи"
              >
                Связаться с нами
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}