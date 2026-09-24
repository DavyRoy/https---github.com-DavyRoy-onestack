// src/app/ai/page.tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import { canonical, siteName, siteUrl, COMPANY } from "@/app/seo.config";
import { getRequestLocale, buildCanonical, buildLanguageAlternates, buildOpenGraphLocale } from "@/i18n/server";
import { QuoteProvider } from "@/app/context/QuoteContext";

import NavBar from "@/components/NavBar";
import AiLayers from "@/components/AiLayers";
import HomeFooter from "@/components/HomeFooter";

/* ==================== SEO / CONFIG ==================== */

const title = "Внедрение ИИ в бизнес: ассистенты и автоматизация";
const description =
  "AI-чат-боты, автоматизация заявок и документов, ИИ в ваших продуктах и прогнозная аналитика. Начинаем с пилота на ваших данных, работаем по NDA.";

// Английская версия индексируется отдельно, поэтому у неё свои title и description.
const TITLE_EN = "AI for business: assistants and process automation";
const DESC_EN =
  "AI chatbots, automated request and document handling, AI inside your products and predictive analytics. We start with a pilot on your data, NDA from day one.";
const url = canonical("/ai");

const AI_SERVICES = ["AI-чат-боты и ассистенты", "Автоматизация процессов", "Интеграция ИИ в продукты", "AI-аналитика и прогнозирование"];

export async function generateMetadata(): Promise<Metadata> {
  // Локаль берём из запроса: без этого canonical английской страницы указывал
  // на русскую, и вся /en-версия выпадала из индекса как дубль.
  const locale = await getRequestLocale();
  const pageUrl = buildCanonical("/ai", locale);

  const isEn = locale === "en";
  const pageTitle = isEn ? TITLE_EN : title;
  const pageDesc = isEn ? DESC_EN : description;

  return {
    title: pageTitle,
    description: pageDesc,
    alternates: {
      canonical: pageUrl,
      languages: {
        ...buildLanguageAlternates("/ai"),
        "x-default": canonical("/ai"),
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

export default function AiPage() {
  const ldJson = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Внедрение искусственного интеллекта",
    provider: { "@type": "Organization", "@id": `${siteUrl}/#organization`, name: siteName, url: siteUrl },
    areaServed: COMPANY.areaServed,
    serviceType: "AI implementation and automation",
    description,
    url,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "AI-решения",
      itemListElement: AI_SERVICES.map(name => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
    },
  };

  const ldBreadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "AI и автоматизация", item: url },
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
        id="ld-service-ai"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
      />
      <script
        id="ld-breadcrumbs-ai"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldBreadcrumbs) }}
      />

      {/* ==================== Content ==================== */}
      <Suspense fallback={null}>
        <QuoteProvider>
          <NavBar />
          <AiLayers />
          <HomeFooter />
        </QuoteProvider>
      </Suspense>
    </main>
  );
}
