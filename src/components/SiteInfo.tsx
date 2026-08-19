// src/components/SiteInfo.tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { useMemo } from "react";

const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut", delay: d },
  viewport: { once: true, amount: 0.25 },
});

export default function SiteInfo() {
  const reduced = useReducedMotion();

  const features = [
    "Удобный редактор и медиабиблиотека",
    "Категории, теги и поиск по сайту",
    "Оптимизация под высокий трафик",
    "Поддержка подписок и рассылок",
    "Быстрая публикация статей и новостей",
  ];

  /* ===== SEO JSON-LD ===== */
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://onestack24.ru";
  const jsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Service",
          name: "Разработка информационного сайта",
          serviceType: "Контентная платформа / информационный сайт",
          provider: {
            "@type": "Organization",
            name: "OneStack",
            url: SITE_URL,
            email: "info@onestack24.ru",
            telephone: "+7-910-948-61-06",
          },
          areaServed: ["RU", "KZ", "BY", "AM"],
          availableChannel: {
            "@type": "ServiceChannel",
            serviceUrl: `${SITE_URL}/sites#info`,
          },
          description:
            "Информационные сайты и порталы: рубрики, поиск, медиабиблиотека, подписки и рассылки. Оптимизация под высокий трафик и SEO.",
          url: `${SITE_URL}/sites#info`,
          keywords:
            "информационный сайт, контентная платформа, блог, редактор, поиск, подписки, рассылки, SEO, Core Web Vitals",
          termsOfService: `${SITE_URL}/policy`,
          offers: {
            "@type": "Offer",
            url: `${SITE_URL}/sites#calculator`,
            priceCurrency: "RUB",
            eligibleRegion: "RU",
            availability: "https://schema.org/InStock",
          },
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Домашняя", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: "Сайты", item: `${SITE_URL}/sites` },
            { "@type": "ListItem", position: 3, name: "Информационный сайт", item: `${SITE_URL}/sites#info` },
          ],
        },
        {
          "@type": "ItemList",
          name: "Преимущества информационного сайта",
          itemListElement: features.map((t, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: { "@type": "Thing", name: t },
          })),
        },
      ],
    }),
    [SITE_URL]
  );

  return (
    <section
      id="info"
      aria-labelledby="info-title"
      className="
        relative w-full overflow-x-clip overflow-y-visible
        bg-gradient-to-b from-black via-[#0a0a0a] to-black text-white
        px-6 md:px-12 lg:px-20
        py-[clamp(40px,6vh,96px)]
      "
      itemScope
      itemType="https://schema.org/Service"
    >
      {/* JSON-LD */}
      <script
        id="schema-service-info"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* мягкие свечения — в едином стиле со страницей «Сайты» */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-36 -left-24 h-[420px] w-[420px] rounded-full bg-white/[0.04] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-36 -right-24 h-[420px] w-[420px] rounded-full bg-white/[0.04] blur-3xl"
      />

      <div
        className="
          relative z-10 mx-auto max-w-7xl
          grid grid-cols-1 md:grid-cols-2
          gap-[clamp(20px,3vw,48px)]
          items-center
        "
      >
        {/* Левая колонка — текст */}
        <div>
          <motion.p
            {...(reduced ? {} : fadeUp(0))}
            className="text-[11px] sm:text-xs uppercase tracking-[0.25em] text-white/50"
          >
            информационный сайт
          </motion.p>

          <motion.h2
            id="info-title"
            {...(reduced ? {} : fadeUp(0.05))}
            className="mt-2 font-extrabold leading-tight
                       text-[clamp(28px,4.5vw,48px)]"
          >
            Масштабируемая <br /> контентная платформа
          </motion.h2>

          <motion.p
            {...(reduced ? {} : fadeUp(0.1))}
            className="mt-4 sm:mt-6 text-white/75
                       text-[clamp(14px,1.8vw,18px)]"
          >
            Создаём информационные сайты и порталы для публикации статей, новостей и
            обучающих материалов. Делаем удобную структуру и быстрый поиск.
          </motion.p>

          {/* Список преимуществ */}
          <ul className="mt-5 sm:mt-6 space-y-3">
            {features.map((f, i) => (
              <motion.li
                key={f}
                {...(reduced
                  ? {}
                  : {
                      initial: { opacity: 0, x: -10 },
                      whileInView: { opacity: 1, x: 0 },
                      transition: { duration: 0.4, delay: i * 0.05 },
                      viewport: { once: true, amount: 0.2 },
                    })}
                className="flex items-start gap-3"
              >
                <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-white/85 text-[clamp(13px,1.7vw,16px)]">{f}</span>
              </motion.li>
            ))}
          </ul>

          {/* Под капотом / SEO-примечание */}
          <motion.div
            {...(reduced ? {} : { initial: { opacity: 0, y: 8 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.45, delay: 0.15 }, viewport: { once: true, amount: 0.2 } })}
            className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white/75"
          >
            <div className="text-white/90 font-medium mb-1">Под капотом</div>
            <p>
              SSR/SSG, Schema.org <span className="whitespace-nowrap">Article</span>, OG/Twitter-превью, XML&nbsp;Sitemap,
              robots.txt, чистые URL и внутренняя перелинковка. Готово к интеграции с GA4 и Яндекс.Метрикой.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link href="#faq" className="underline underline-offset-4 hover:no-underline">
                Вопросы по SEO
              </Link>
              <span className="opacity-50">•</span>
              <Link href="#contact" className="underline underline-offset-4 hover:no-underline">
                Запросить аудит/контент-план
              </Link>
            </div>
          </motion.div>

          {/* CTA-кнопки — единый стиль */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              href="#calculator"
              className="inline-flex items-center justify-center rounded-full bg-white
                         px-6 py-3 font-semibold text-black transition
                         hover:shadow-lg hover:shadow-white/20
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60
                         text-[clamp(13px,1.7vw,16px)]"
              aria-label="Перейти к калькулятору стоимости информационного сайта"
            >
              Рассчитать стоимость
            </Link>
            <Link
              href="#contact"
              className="inline-flex items-center justify-center rounded-full border border-white/20
                         px-6 py-3 font-semibold text-white transition
                         hover:bg-white/10
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50
                         text-[clamp(13px,1.7vw,16px)]"
              aria-label="Оставить заявку на информационный сайт"
            >
              Оставить заявку
            </Link>
          </div>
        </div>

        {/* Правая колонка — картинка (адаптивная, не обрезается) */}
        <motion.div
          {...(reduced
            ? {}
            : {
                initial: { opacity: 0, scale: 0.985, y: 8 },
                whileInView: { opacity: 1, scale: 1, y: 0 },
                transition: { duration: 0.6, ease: "easeOut" },
                viewport: { once: true, amount: 0.25 },
              })}
          className="
            relative
            h-[clamp(260px,42vh,560px)]
            rounded-2xl overflow-hidden
            bg-black/60
            shadow-[0_30px_120px_rgba(0,0,0,0.45)]
            flex items-center justify-center
          "
        >
          <Image
            src="/site_info.png"
            alt="Информационный сайт — пример контентной платформы с блогом, разделами и поиском"
            fill
            priority
            className="object-contain"
            sizes="(max-width: 768px) 92vw, (max-width: 1280px) 46vw, 560px"
          />
          <div className="absolute inset-0 bg-black/26 md:bg-black/22 pointer-events-none" aria-hidden />
        </motion.div>
      </div>
    </section>
  );
}