// src/app/webapp/page.tsx
import type { Metadata } from "next";
import Script from "next/script";
import { Suspense } from "react";
import { canonical, siteName, siteUrl } from "@/app/seo.config";
import { QuoteProvider } from "@/app/context/QuoteContext";

import NavBar from "@/components/NavBar";
import WebAppLayers from "@/components/WebAppLayers";
import HomeFooter from "@/components/HomeFooter";

/* ==================== SEO / CONFIG ==================== */


const title = "Разработка веб-приложений: CRM, ERP, личные кабинеты | OneStack";
const description =
  "Проектируем и создаём веб-приложения: личные кабинеты, CRM/ERP, аналитические дашборды. Роли и доступы, безопасные API, интеграции (оплаты, CRM, склад), масштабируемость.";
const url = canonical("/webapp");

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: url,
    languages: {
      "ru": url,
      "en": canonical("/webapp"),
      "x-default": url,
    },
  },
  openGraph: {
    type: "website",
    url,
    title,
    description,
    siteName,
    locale: "ru_RU",
    images: [{ url: `${siteUrl}/og/webapp.svg`, width: 1200, height: 630, alt: title }],
  },
  twitter: { card: "summary_large_image", title, description, images: [`${siteUrl}/og/webapp.svg`] },
};

// Важно: дочерние компоненты могут использовать useSearchParams(). Запрещаем SSG.
export const dynamic = "force-dynamic";

/* ==================== PAGE ==================== */

export default function WebAppPage() {
  const ldJson = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Разработка веб-приложений",
    provider: { "@type": "Organization", name: siteName, url: siteUrl },
    areaServed: "RU",
    serviceType: "Web application development",
    description,
    url,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Направления",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Личные кабинеты" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "CRM/ERP" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Аналитические дашборды" } },
      ],
    },
  };

  const ldBreadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Веб-приложение", item: url },
    ],
  };

  return (
    <main style={{ background: "#07100e", position: "relative" }} className="text-white">
      {/* Единый grain на весь сайт */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
          opacity: 0.027,
        }}
      />
      {/* ==================== JSON-LD ==================== */}
      <Script
        id="ld-service-webapp"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
      />
      <Script
        id="ld-breadcrumbs-webapp"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldBreadcrumbs) }}
      />

      {/* ==================== Content ==================== */}
      <Suspense fallback={null}>
        <QuoteProvider>
          <NavBar />
          {/* Разделы открываются во весь экран из WebAppLayers. Со страницы
              убраны первый блок, «Преимущества», «Производительность и
              безопасность» и «Вопросы и ответы». */}
          <WebAppLayers />
          <HomeFooter />
        </QuoteProvider>
      </Suspense>
    </main>
  );
}
