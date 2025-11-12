// src/app/mobile/page.tsx
import { Suspense } from "react";
import type { Metadata } from "next";
import Script from "next/script";

import NavBar from "@/components/NavBar";
import MobileIntro from "@/components/MobileIntro";
import MobileTypes from "@/components/MobileTypes";
import MobileFeatures from "@/components/MobileFeatures";
import MobileBenefits from "@/components/MobileBenefits";
import MobileCalculator from "@/components/MobileCalculator";
import MobilePerfSecurity from "@/components/MobilePerfSecurity";
import MobileContact from "@/components/MobileContact";
import MobileFAQ from "@/components/MobileFAQ";
import HomeFooter from "@/components/HomeFooter";

import { QuoteProvider } from "@/app/context/QuoteContext";

/* ──────────────────────────── constants & SEO ───────────────────────────── */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://onestack24.ru";

const TITLE = "Разработка мобильных приложений — iOS и Android | OneStack";
const DESC =
  "Кроссплатформенная разработка под iOS и Android: оффлайн, пуши, карты, платежи, аналитика. Единый бэкенд и CI/CD. Рассчитайте стоимость онлайн.";
const CANONICAL = `${SITE_URL}/mobile`;
const COVER = "/og/mobile.jpg";

// Контакты
const ORG_NAME = "OneStack";
const ORG_EMAIL = "info@onestack24.ru";
const ORG_PHONE = "+7 (910) 948 61 06";
const ORG_SAME_AS = ["https://onestack24.ru"];

// Метрики
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-04E9LPJ43Y";
const YM_ID = process.env.NEXT_PUBLIC_YM_ID || "103909522";

/* ──────────────────────────── App Router metadata ───────────────────────── */

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: CANONICAL },
  openGraph: {
    type: "website",
    url: CANONICAL,
    title: TITLE,
    description: DESC,
    siteName: ORG_NAME,
    images: [{ url: COVER, width: 1200, height: 630, alt: "OneStack — мобильные приложения" }],
    locale: "ru_RU",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
    images: [COVER],
  },
};

/**
 * Важно: отключаем статическую генерацию этой страницы,
 * чтобы Next не пытался пререндерить дерево с useSearchParams().
 */
export const dynamic = "force-dynamic";
export const revalidate = 0;

/* ───────────────────────── structured data (JSON-LD) ────────────────────── */

function ldService() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Разработка мобильных приложений",
    serviceType: "Mobile application development",
    provider: {
      "@type": "Organization",
      name: ORG_NAME,
      url: SITE_URL,
      email: ORG_EMAIL,
      telephone: ORG_PHONE,
      sameAs: ORG_SAME_AS,
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: ORG_EMAIL,
          telephone: ORG_PHONE,
          areaServed: ["RU", "KZ", "BY", "AM"],
          availableLanguage: ["ru", "en"],
        },
      ],
    },
    areaServed: ["RU", "KZ", "BY", "AM"],
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "RUB",
      lowPrice: 480000,
      highPrice: 1300000,
      offerCount: 2,
      offers: [
        { "@type": "Offer", price: 480000, category: "MVP" },
        { "@type": "Offer", price: 1300000, category: "Full product" },
      ],
    },
  };
}

function ldBreadcrumbs() {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Мобильные приложения", item: CANONICAL },
    ],
  };
}

function ldOrganization() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: ORG_NAME,
    url: SITE_URL,
    email: ORG_EMAIL,
    telephone: ORG_PHONE,
    sameAs: ORG_SAME_AS,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: ORG_EMAIL,
        telephone: ORG_PHONE,
        areaServed: ["RU", "KZ", "BY", "AM"],
        availableLanguage: ["ru", "en"],
      },
    ],
  };
}

/* ────────────────────────────────── page ─────────────────────────────────── */

export default function MobilePage() {
  return (
    <QuoteProvider>
      {/* Оборачиваем клиентское дерево в Suspense,
          чтобы удовлетворить требование useSearchParams() */}
      <Suspense fallback={null}>
        <main className="bg-black text-white">
          {/* Google Analytics */}
          <Script
            id="ga-src"
            src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}
          </Script>

          {/* Yandex.Metrika */}
          <Script id="ym-init" strategy="afterInteractive">
            {`
              (function(m,e,t,r,i,k,a){
                m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {
                  if (document.scripts[j].src === r) { return; }
                }
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
              })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=${YM_ID}', 'ym');

              ym(${YM_ID}, 'init', {
                ssr: true,
                webvisor: true,
                clickmap: true,
                ecommerce: 'dataLayer',
                accurateTrackBounce: true,
                trackLinks: true
              });
            `}
          </Script>
          <noscript>
            <div>
              <img
                src={`https://mc.yandex.ru/watch/${YM_ID}`}
                style={{ position: "absolute", left: "-9999px" }}
                alt=""
              />
            </div>
          </noscript>

          {/* JSON-LD */}
          <Script
            id="ld-service-mobile"
            type="application/ld+json"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(ldService()) }}
          />
          <Script
            id="ld-breadcrumbs-mobile"
            type="application/ld+json"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(ldBreadcrumbs()) }}
          />
          <Script
            id="ld-organization-mobile"
            type="application/ld+json"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(ldOrganization()) }}
          />

          {/* Контент страницы */}
          <NavBar />
          <MobileIntro />
          <MobileTypes />
          <MobileFeatures />
          <MobileBenefits />
          <MobileCalculator />
          <MobilePerfSecurity />
          <MobileContact />
          <MobileFAQ />
          <HomeFooter />
        </main>
      </Suspense>
    </QuoteProvider>
  );
}