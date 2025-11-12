// src/app/components/SiteEcommerce.tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { CheckCircle } from "lucide-react";
import { useMemo } from "react";

const YM_ID = 103909522; // Я.Метрика

const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut", delay: d },
  viewport: { once: true, amount: 0.25 },
});

export default function SiteEcommerce() {
  const reduced = useReducedMotion();

  const features = [
    "Каталог с фильтрами, вариациями и поиском",
    "Корзина, оформление заказа, купоны и промо",
    "Оплата и доставка (ЮKassa/Stripe, СДЭК и др.)",
    "Интеграции: CRM, 1C/МойСклад, маркетплейсы",
    "Отчёты и аналитика конверсий (GA4, Я.Метрика)",
  ];

  /* ===== SEO JSON-LD ===== */
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://onestack24.ru";
  const jsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Service",
          name: "Разработка интернет-магазина",
          serviceType: "E-commerce development",
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
            serviceUrl: `${SITE_URL}/sites#ecommerce`,
          },
          description:
            "Полный цикл e-commerce: каталог с фильтрами и поиском, корзина, оплата и доставка, интеграции с учётными системами и аналитика конверсий.",
          termsOfService: `${SITE_URL}/policy`,
          offers: {
            "@type": "Offer",
            url: `${SITE_URL}/sites#calculator`,
            priceCurrency: "RUB",
            eligibleRegion: "RU",
            availability: "https://schema.org/InStock",
          },
          url: `${SITE_URL}/sites#ecommerce`,
          keywords:
            "интернет-магазин, разработка e-commerce, корзина, оплата, доставка, интеграции CRM, 1C, МойСклад",
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Домашняя", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: "Сайты", item: `${SITE_URL}/sites` },
            { "@type": "ListItem", position: 3, name: "Интернет-магазин", item: `${SITE_URL}/sites#ecommerce` },
          ],
        },
        {
          "@type": "ItemList",
          name: "Преимущества интернет-магазина",
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

  /* ===== аналитика кликов по CTA ===== */
  const track = (id: "ecom_calc" | "ecom_contact") => {
    try {
      // @ts-ignore
      if (typeof window !== "undefined" && typeof window.gtag === "function") {
        // @ts-ignore
        window.gtag("event", "select_content", {
          content_type: "cta",
          item_id: id,
          value: 1,
        });
      }
      // @ts-ignore
      if (typeof window !== "undefined" && typeof window.ym === "function") {
        // @ts-ignore
        window.ym(YM_ID, "reachGoal", `cta_${id}`);
      }
    } catch {}
  };

  return (
    <section
      id="ecommerce"
      aria-labelledby="ecommerce-title"
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
      <Script
        id="schema-service-ecommerce"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* мягкие свечения — как на других секциях */}
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
            интернет-магазин
          </motion.p>

          <motion.h2
            id="ecommerce-title"
            {...(reduced ? {} : fadeUp(0.05))}
            className="mt-2 font-extrabold leading-tight text-[clamp(28px,4.5vw,48px)]"
          >
            Конверсия, масштаб, интеграции
          </motion.h2>

          <motion.p
            {...(reduced ? {} : fadeUp(0.1))}
            className="mt-4 sm:mt-6 text-white/75 text-[clamp(14px,1.8vw,18px)]"
          >
            Полный цикл e-commerce: от карточек и корзины до оплаты, доставки и
            интеграций с учётными системами. Готовим платформу к росту и нагрузке.
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

          {/* CTA-кнопки — общий вид со всеми секциями */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              href="#calculator"
              onClick={() => track("ecom_calc")}
              className="inline-flex items-center justify-center rounded-full bg-white
                         px-6 py-3 font-semibold text-black transition
                         hover:shadow-lg hover:shadow-white/20
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60
                         text-[clamp(13px,1.7vw,16px)]"
              aria-label="Перейти к калькулятору стоимости интернет-магазина"
            >
              Рассчитать стоимость
            </Link>
            <Link
              href="#contact"
              onClick={() => track("ecom_contact")}
              className="inline-flex items-center justify-center rounded-full border border-white/20
                         px-6 py-3 font-semibold text-white transition
                         hover:bg-white/10
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50
                         text-[clamp(13px,1.7vw,16px)]"
              aria-label="Оставить заявку на разработку интернет-магазина"
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
            src="/site_shop.png"
            alt="Интернет-магазин: каталог, корзина, оплата, доставка и интеграции — пример интерфейса"
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