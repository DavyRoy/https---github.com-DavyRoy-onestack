// src/app/sites/page.tsx
import type { Metadata } from "next";
import Script from "next/script";
import { Suspense } from "react";
import { QuoteProvider } from "@/app/context/QuoteContext";

import NavBar from "@/components/NavBar";
import SiteIntro from "@/components/SiteIntro";
import HomeFooter from "@/components/HomeFooter";
import SiteTypes from "@/components/SiteTypes";
import SiteConfigurator from "@/components/SiteConfigurator";
import SiteBenefits from "@/components/SiteBenefits";
import SiteCalculator from "@/components/SiteCalculator";
import SiteContact from "@/components/SiteContact";
import SiteFAQ from "@/components/SiteFAQ";

/* ───────────────── SEO constants ───────────────── */
const SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL || "https://onestack24.ru").replace(/\/$/, "");
const title =
  "Разработка сайтов — лендинги, корпоративные, e-commerce | OneStack";
const description =
  "Делаем быстрые, адаптивные и SEO-готовые сайты: лендинги, корпоративные порталы и интернет-магазины. Чистая архитектура, Core Web Vitals, доступность и поддержка.";
const url = `${SITE_URL}/sites`;

/* ───────────────── Metadata (App Router) ───────────────── */
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: {
    type: "website",
    url,
    title,
    description,
    siteName: "OneStack",
    images: [
      {
        url: "/og/sites.png",
        width: 1200,
        height: 630,
        alt: "OneStack — сайты",
      },
    ],
    locale: "ru_RU",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og/sites.png"],
  },
};

/* ───────────────── Client subtree (hooks allowed) ───────────────── */
function SitesClientTree() {
  "use client";
  return (
    <QuoteProvider>
      <NavBar />
      <SiteIntro />
      <SiteTypes />
      <SiteConfigurator />
      <SiteBenefits />
      <SiteCalculator /> {/* может вызывать router.push('#contact') */}
      <SiteContact />
      <SiteFAQ />
      <HomeFooter />
    </QuoteProvider>
  );
}

/* ───────────────── Page ───────────────── */
export default function SitesPage() {
  // JSON-LD: Service + BreadcrumbList + Organization (актуальные контакты)
  const LD_SERVICE = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Разработка сайтов",
    serviceType: "Website development",
    description,
    url,
    provider: {
      "@type": "Organization",
      name: "OneStack",
      url: SITE_URL,
      email: "info@onestack24.ru",
      telephone: "+7 (910) 948 61 06",
    },
    areaServed: "RU",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Типы сайтов",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Лендинг" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Корпоративный сайт" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Интернет-магазин" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Инфо-портал / блог" } },
      ],
    },
  };

  const LD_BREADCRUMBS = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Разработка сайтов", item: url },
    ],
  };

  const LD_ORG = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "OneStack",
    url: SITE_URL,
    email: "info@onestack24.ru",
    telephone: "+7 (910) 948 61 06",
    sameAs: [SITE_URL],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "info@onestack24.ru",
        telephone: "+7 (910) 948 61 06",
        availableLanguage: ["ru", "en"],
        areaServed: ["RU", "KZ", "BY", "AM"],
      },
    ],
  };

  return (
    <main className="bg-black text-white">
      {/* JSON-LD для SEO (серверный рендер через Script) */}
      <Script
        id="ld-service-sites"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LD_SERVICE) }}
      />
      <Script
        id="ld-breadcrumbs-sites"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LD_BREADCRUMBS) }}
      />
      <Script
        id="ld-organization-sites"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LD_ORG) }}
      />

      {/* Suspense-граница на уровне страницы */}
      <Suspense fallback={null}>
        <SitesClientTree />
      </Suspense>
    </main>
  );
}