// src/app/sites/page.tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import { QuoteProvider } from "@/app/context/QuoteContext";
import { canonical, siteName, siteUrl } from "@/app/seo.config";
import { getRequestLocale, buildCanonical, buildLanguageAlternates, buildOpenGraphLocale } from "@/i18n/server";

import NavBar from "@/components/NavBar";
import SiteLayers from "@/components/SiteLayers";
import HomeFooter from "@/components/HomeFooter";

/* ───────────────── SEO constants ───────────────── */
const title =
  "Разработка сайтов под ключ — лендинги и e-commerce";
const description =
  "Делаем быстрые SEO-готовые сайты: лендинги от 1–2 нед., корпоративные порталы и интернет-магазины. Прозрачная смета, Core Web Vitals, поддержка после запуска. 150+ проектов.";

// Английская версия индексируется отдельно, поэтому у неё свои title и description.
const TITLE_EN = "Website development: landing pages, portals, e-commerce";
const DESC_EN =
  "Fast, SEO-ready websites: landing pages in 1–2 weeks, corporate portals and online stores. Transparent quote, Core Web Vitals, post-launch support.";
const url = canonical("/sites");

/* ───────────────── Metadata (App Router) ───────────────── */
export async function generateMetadata(): Promise<Metadata> {
  // Локаль берём из запроса: без этого canonical английской страницы указывал
  // на русскую, и вся /en-версия выпадала из индекса как дубль.
  const locale = await getRequestLocale();
  const pageUrl = buildCanonical("/sites", locale);

  const isEn = locale === "en";
  const pageTitle = isEn ? TITLE_EN : title;
  const pageDesc = isEn ? DESC_EN : description;

  return {
    title: pageTitle,
    description: pageDesc,
    alternates: {
      canonical: pageUrl,
      languages: {
        ...buildLanguageAlternates("/sites"),
        "x-default": canonical("/sites"),
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

/* ───────────────── Client subtree (hooks allowed) ───────────────── */
function SitesClientTree() {
  "use client";
  return (
    <QuoteProvider>
      <NavBar />
      {/* Разделы открываются во весь экран из SiteLayers.
          «Преимущества» и «Вопросы и ответы» со страницы убраны. */}
      <SiteLayers />
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
      name: siteName,
      url: siteUrl,
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
      { "@type": "ListItem", position: 1, name: "Главная", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Разработка сайтов", item: url },
    ],
  };

  const LD_ORG = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: siteUrl,
    email: "info@onestack24.ru",
    telephone: "+7 (910) 948 61 06",
    sameAs: ["https://t.me/onestack_assistant_bot"],
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
      {/* JSON-LD для SEO (серверный рендер через Script) */}
      <script
        id="ld-service-sites"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LD_SERVICE) }}
      />
      <script
        id="ld-breadcrumbs-sites"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LD_BREADCRUMBS) }}
      />
      <script
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
