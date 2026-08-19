// src/app/mobile/page.tsx
import { Suspense } from "react";
import type { Metadata } from "next";

import NavBar from "@/components/NavBar";
import MobileLayers from "@/components/MobileLayers";
import HomeFooter from "@/components/HomeFooter";

import { QuoteProvider } from "@/app/context/QuoteContext";
import { canonical, siteName, siteUrl } from "@/app/seo.config";
import { getRequestLocale, buildCanonical, buildLanguageAlternates, buildOpenGraphLocale } from "@/i18n/server";

/* ──────────────────────────── constants & SEO ───────────────────────────── */

const SITE_URL = siteUrl;

const TITLE = "Разработка мобильных приложений: iOS и Android";
const DESC =
  "Кроссплатформенная разработка под iOS и Android: оффлайн, пуши, карты, платежи, аналитика. Единый бэкенд и CI/CD. Рассчитайте стоимость онлайн.";

// Английская версия индексируется отдельно, поэтому у неё свои title и description.
const TITLE_EN = "Mobile app development for iOS and Android";
const DESC_EN =
  "Cross-platform iOS and Android development: offline mode, push, maps, payments, analytics. Shared backend and CI/CD. Estimate the cost online.";
const CANONICAL = canonical("/mobile");
// Контакты
const ORG_NAME = siteName;
const ORG_EMAIL = "info@onestack24.ru";
const ORG_PHONE = "+7 (910) 948 61 06";
const ORG_SAME_AS = [SITE_URL];

/* ──────────────────────────── App Router metadata ───────────────────────── */

export async function generateMetadata(): Promise<Metadata> {
  // Локаль берём из запроса: без этого canonical английской страницы указывал
  // на русскую, и вся /en-версия выпадала из индекса как дубль.
  const locale = await getRequestLocale();
  const pageUrl = buildCanonical("/mobile", locale);

  const isEn = locale === "en";
  const pageTitle = isEn ? TITLE_EN : TITLE;
  const pageDesc = isEn ? DESC_EN : DESC;

  return {
    title: pageTitle,
    description: pageDesc,
    alternates: {
      canonical: pageUrl,
      languages: {
        ...buildLanguageAlternates("/mobile"),
        "x-default": canonical("/mobile"),
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
          <script
            id="ld-service-mobile"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(ldService()) }}
          />
          <script
            id="ld-breadcrumbs-mobile"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(ldBreadcrumbs()) }}
          />
          <script
            id="ld-organization-mobile"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(ldOrganization()) }}
          />

          {/* Контент страницы */}
          <NavBar />
          {/* Разделы открываются во весь экран из MobileLayers. Со страницы
              убраны первый блок, «Преимущества» и «Частые вопросы». */}
          <MobileLayers />
          <HomeFooter />
        </main>
      </Suspense>
    </QuoteProvider>
  );
}
