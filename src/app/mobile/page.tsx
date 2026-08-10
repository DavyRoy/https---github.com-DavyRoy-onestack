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
import { canonical, siteName, siteUrl } from "@/app/seo.config";

/* ──────────────────────────── constants & SEO ───────────────────────────── */

const SITE_URL = siteUrl;

const TITLE = "Разработка мобильных приложений — iOS и Android | OneStack";
const DESC =
  "Кроссплатформенная разработка под iOS и Android: оффлайн, пуши, карты, платежи, аналитика. Единый бэкенд и CI/CD. Рассчитайте стоимость онлайн.";
const CANONICAL = canonical("/mobile");
// Контакты
const ORG_NAME = siteName;
const ORG_EMAIL = "info@onestack24.ru";
const ORG_PHONE = "+7 (910) 948 61 06";
const ORG_SAME_AS = [SITE_URL];

/* ──────────────────────────── App Router metadata ───────────────────────── */

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: {
    canonical: CANONICAL,
    languages: {
      "ru": CANONICAL,
      "en": canonical("/mobile"),
      "x-default": CANONICAL,
    },
  },
  openGraph: {
    type: "website",
    url: CANONICAL,
    title: TITLE,
    description: DESC,
    siteName: ORG_NAME,
    locale: "ru_RU",
    images: [{ url: `${SITE_URL}/og/mobile.svg`, width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
    images: [`${SITE_URL}/og/mobile.svg`],
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
        <main style={{ background: "#07100e" }} className="text-white">
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
