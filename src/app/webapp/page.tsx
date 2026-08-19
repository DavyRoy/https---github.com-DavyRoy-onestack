// src/app/webapp/page.tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import { canonical, siteName, siteUrl } from "@/app/seo.config";
import { getRequestLocale, buildCanonical, buildLanguageAlternates, buildOpenGraphLocale } from "@/i18n/server";
import { QuoteProvider } from "@/app/context/QuoteContext";

import NavBar from "@/components/NavBar";
import WebAppLayers from "@/components/WebAppLayers";
import HomeFooter from "@/components/HomeFooter";

/* ==================== SEO / CONFIG ==================== */


const title =
  "Разработка веб-приложений: CRM, ERP, кабинеты";
const description =
  "Проектируем и создаём веб-приложения: личные кабинеты, CRM/ERP, аналитические дашборды. Роли и доступы, безопасные API, интеграции (оплаты, CRM, склад), масштабируемость.";

// Английская версия индексируется отдельно, поэтому у неё свои title и description.
const TITLE_EN = "Web application development: CRM, ERP, client portals";
const DESC_EN =
  "We design and build web applications: client portals, CRM/ERP, analytics dashboards. Roles and permissions, security, scalable architecture.";
const url = canonical("/webapp");

export async function generateMetadata(): Promise<Metadata> {
  // Локаль берём из запроса: без этого canonical английской страницы указывал
  // на русскую, и вся /en-версия выпадала из индекса как дубль.
  const locale = await getRequestLocale();
  const pageUrl = buildCanonical("/webapp", locale);

  const isEn = locale === "en";
  const pageTitle = isEn ? TITLE_EN : title;
  const pageDesc = isEn ? DESC_EN : description;

  return {
    title: pageTitle,
    description: pageDesc,
    alternates: {
      canonical: pageUrl,
      languages: {
        ...buildLanguageAlternates("/webapp"),
        "x-default": canonical("/webapp"),
      },
    },
    openGraph: {
      type: "website",
      url: pageUrl,
      title: pageTitle,
      description: pageDesc,
      siteName,
      locale: buildOpenGraphLocale(locale),
      // og:image не задаём: Next возьмёт его из opengraph-image.tsx и отдаст
      // PNG. Прежние SVG соцсети не показывали вовсе.
    },
    twitter: { card: "summary_large_image", title: pageTitle, description: pageDesc },
  };
}

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
      <script
        id="ld-service-webapp"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
      />
      <script
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
