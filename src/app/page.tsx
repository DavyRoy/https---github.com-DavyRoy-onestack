// src/app/page.tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import { QuoteProvider } from "@/app/context/QuoteContext";
import { canonical, siteName, siteUrl, COMPANY } from "@/app/seo.config";
import {
  buildLanguageAlternates,
  buildOpenGraphLocale,
  getMessages,
  getRequestLocale,
} from "@/i18n/server";

import NavBar from "@/components/NavBar";
import HomeIntro from "@/components/HomeIntro";
import HomeCapabilities from "@/components/HomeCapabilities";
import HomeBenefits from "@/components/HomeBenefits";
import HomeCalculator from "@/components/HomeCalculator";
import HomeContact from "@/components/HomeContact";
import HomeAbout from "@/components/HomeAbout";
import HomeFooter from "@/components/HomeFooter";

/* ────────────────────────────────────────────────────────────────────────── */
/* SEO/константы                                                              */
/* ────────────────────────────────────────────────────────────────────────── */

const CONTACT_EMAIL = "info@onestack24.ru";
const CONTACT_PHONE = "+7 (910) 948 61 06";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const dict = getMessages(locale);

  const title = dict.seo.homeTitle;
  const description = dict.seo.homeDescription;
  const url = canonical("/", locale);

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: buildLanguageAlternates("/"),
    },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName,
      locale: buildOpenGraphLocale(locale),
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Клиентское дерево (внутри серверного файла — ok)                           */
/* ────────────────────────────────────────────────────────────────────────── */

function HomeClientTree() {
  "use client";
  return (
    <QuoteProvider>
      <NavBar />
      <HomeIntro />
      <HomeCapabilities />
      <HomeBenefits />
      <HomeCalculator />
      <HomeContact />
      <HomeAbout />
      <HomeFooter />
    </QuoteProvider>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* Страница                                                                   */
/* ────────────────────────────────────────────────────────────────────────── */

export default async function HomePage() {
  const locale = await getRequestLocale();
  const dict = getMessages(locale);
  const url = canonical("/", locale);

  // JSON-LD: WebSite + Organization (с контактами)
  const ldWebsite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url,
    description: dict.seo.homeDescription,
    inLanguage: locale === "ru" ? "ru-RU" : "en-US",
    publisher: { "@type": "Organization", name: siteName, url: siteUrl },
  };

  const ldOrg = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: siteName,
    url: siteUrl,
    email: CONTACT_EMAIL,
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: CONTACT_PHONE,
        contactType: "customer support",
        areaServed: COMPANY.areaServed,
        availableLanguage: ["ru", "en"],
      },
    ],
    sameAs: [
      "https://t.me/onestack_assistant_bot",
    ],
    logo: `${siteUrl}/logo.png`,
  };

  const ldBreadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: locale === "ru" ? "Главная" : "Home", item: siteUrl },
    ],
  };

  return (
    <main style={{ backgroundColor: "#07100e" }} className="text-white home-seamless">
      {/* ─── JSON-LD для SEO ─── */}
      <script
        id="ld-website-home"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldWebsite) }}
      />
      <script
        id="ld-org-home"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldOrg) }}
      />
      <script
        id="ld-breadcrumbs-home"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldBreadcrumbs) }}
      />

      {/* Контент (клиентские компоненты внутри Suspense) */}
      <Suspense fallback={null}>
        <HomeClientTree />
      </Suspense>
    </main>
  );
}
