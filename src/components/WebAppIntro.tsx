// src/components/WebAppIntro.tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useMemo, useId } from "react";
import { CheckCircle } from "lucide-react";

const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut", delay: d },
});
const line = (d = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { delay: d, duration: 0.5, ease: "easeOut" } },
});

export default function WebAppIntro() {
  const reduced = useReducedMotion();
  const titleId = useId();
  const subtitleId = useId();

  const btnBase =
    "inline-flex items-center justify-center rounded-full font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 transition text-center";
  const btnSize = "h-12 min-w-[220px] px-6";

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://onestack24.ru";
  const PAGE_PATH = "/web-apps";
  const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;

  const jsonLdService = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Разработка веб-приложений",
      serviceType: "Web application development",
      provider: { "@type": "Organization", name: "OneStack", url: SITE_URL },
      areaServed: ["RU", "KZ", "BY", "AM"],
      url: PAGE_URL,
      description:
        "Проектируем роли и доступы, интеграции с CRM и платежами, дашборды, очереди и фоновые задачи. Готовим систему к росту нагрузки и безопасной эксплуатации.",
    }),
    [PAGE_URL, SITE_URL]
  );

  const jsonLdWebPage = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Веб-приложения — разработка под рост и безопасность",
      url: PAGE_URL,
      inLanguage: "ru",
      isPartOf: { "@type": "WebSite", name: "OneStack", url: SITE_URL },
      breadcrumb: { "@id": "#breadcrumbs" },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: `${SITE_URL}/web_app.png`,
      },
      description:
        "Создаём веб-приложения: роли и доступы, интеграции с CRM/оплатами, дашборды и очереди. Производительность, безопасность и масштабируемость.",
    }),
    [PAGE_URL, SITE_URL]
  );

  const jsonLdBreadcrumbs = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": "#breadcrumbs",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Главная", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Веб-приложения", item: PAGE_URL },
      ],
    }),
    [PAGE_URL, SITE_URL]
  );

  const jsonLdFAQ = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Сколько длится запуск веб-приложения?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "Первые релизы — через 2–3 недели спринтового цикла. Полный срок зависит от интеграций, ролей/прав и объёма логики.",
          },
        },
        {
          "@type": "Question",
          name: "Какие интеграции вы делаете?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "CRM (Bitrix24/amoCRM), платёжные шлюзы, склад/учёт, аналитика, очереди/фоны (RabbitMQ/SQS), SSO и RBAC.",
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
      role="region"
    >
      <Script id="ld-webapps-service" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdService) }} />
      <Script id="ld-webapps-webpage" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebPage) }} />
      <Script id="ld-webapps-breadcrumbs" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumbs) }} />
      <Script id="ld-webapps-faq" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFAQ) }} />
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
      
      <div aria-hidden className="pointer-events-none absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full bg-white/[0.045] blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-40 -right-40 h-[480px] w-[480px] rounded-full bg-white/[0.045] blur-3xl" />

      <div className="absolute inset-0 hidden md:block z-0" aria-hidden>
        <Image
          src="/web_app.png"
          alt=""
          fill
          priority
          sizes="100vw"
          fetchPriority="high"
          className="object-contain object-right"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.94) 0%, rgba(0,0,0,0.75) 52%, rgba(0,0,0,0.32) 72%, rgba(0,0,0,0.02) 98%)" }} />
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

      <div className="absolute inset-0 block md:hidden z-0" aria-hidden>
        <Image
          src="/web_app.png"
          alt=""
          fill
          priority
          sizes="100vw"
          fetchPriority="high"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-12 lg:px-20">
        <p className="sr-only">
          Веб-приложения под рост бизнеса: роли и доступы, интеграции с CRM и платежами, дашборды и очереди.
        </p>

        <div className="grid grid-cols-12 gap-x-6">
          <div className="col-span-12 md:col-span-7 lg:col-span-6 text-center md:text-left">
            <motion.p {...(reduced ? {} : fadeUp(0.0))} className="text-[12px] uppercase tracking-[0.25em] text-white/45 mb-2">
              веб-приложения
            </motion.p>

            <motion.h1 id={titleId} aria-label="Веб-приложения, которые упрощают бизнес" className="max-w-[64rem] text-white font-extrabold tracking-tight leading-[0.9]">
              <motion.span {...(reduced ? {} : line(0.00))} className="block text-[clamp(3rem,5vw,5rem)]">
                Веб-приложения,
              </motion.span>
              <motion.span {...(reduced ? {} : line(0.05))} className="block text-[clamp(3rem,4.5vw,4.5rem)] text-white/60">
                которые упрощают
              </motion.span>
              <motion.span {...(reduced ? {} : line(0.10))} className="block text-[clamp(3rem,4.5vw,4.5rem)] text-white/60">
                бизнес
              </motion.span>
            </motion.h1>

            <motion.p id={subtitleId} {...(reduced ? {} : fadeUp(0.1))} className="mt-5 max-w-[36rem] mx-auto md:mx-0 text-white/70 text-[clamp(1rem,2.1vw,1.15rem)] leading-[1.28]">
              Интеграции с CRM, оплатами и складом, дашборды, роли и права доступа. Архитектура под безопасность, производительность и масштабирование.
            </motion.p>

            <motion.ul {...(reduced ? {} : fadeUp(0.15))} className="mt-5 space-y-3 text-white/65 text-base">
              {["Спринты 2–3 недели", "Роли, доступы и дашборды", "Интеграции: CRM, оплаты, склад", "Безопасность и масштабирование"].map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" aria-hidden="true" />
                  <span>{f}</span>
                </li>
              ))}
            </motion.ul>

            <motion.div {...(reduced ? {} : fadeUp(0.2))} className="mt-8 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Link href="#modules" className={`${btnBase} ${btnSize} border border-white/75 text-white hover:bg-white/10`} aria-label="Перейти к разделу «Возможности»">
                Возможности
              </Link>
              <Link href="#calculator" className={`${btnBase} ${btnSize} bg-white text-black hover:shadow-white/20 hover:shadow-lg`} aria-label="Перейти к калькулятору стоимости">
                Стоимость
              </Link>
            </motion.div>

            <noscript>
              <div className="mt-6 text-left">
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">Веб-приложения, которые упрощают бизнес</h1>
                <p className="mt-3 max-w-xl text-white/75">
                  Интеграции с CRM, оплатами и складом, дашборды, роли и права доступа. Архитектура под безопасность, производительность и масштабирование.
                </p>
              </div>
            </noscript>
          </div>
        </div>
      </div>
    </section>
  );
}