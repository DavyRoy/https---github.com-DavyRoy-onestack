// src/app/page.tsx
import type { Metadata } from "next";
import Script from "next/script";
import { Suspense } from "react";
import { QuoteProvider } from "@/app/context/QuoteContext";
import { canonical, siteName, siteUrl } from "@/app/seo.config";
import {
  buildLanguageAlternates,
  buildOpenGraphLocale,
  getMessages,
  getRequestLocale,
} from "@/i18n/server";

import NavBar from "@/components/NavBar";
import HomeIntro from "@/components/HomeIntro";
import HomeSites from "@/components/HomeSites";
import HomeWebApp from "@/components/HomeWebApp";
import HomeMobile from "@/components/HomeMobile";
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
      images: [{ url: `${siteUrl}/og/cover.svg`, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [`${siteUrl}/og/cover.svg`] },
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
      <HomeSites />
      <HomeWebApp />
      <HomeMobile />
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
    name: siteName,
    url: siteUrl,
    email: CONTACT_EMAIL,
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: CONTACT_PHONE,
        contactType: "customer support",
        areaServed: "RU",
        availableLanguage: ["ru", "en"],
      },
    ],
    sameAs: [
      "https://t.me/onestack_assistant_bot",
    ],
    logo: `${siteUrl}/logo.png`,
  };

  const ldFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Сколько стоит разработка сайта?",
        acceptedAnswer: { "@type": "Answer", text: "Стоимость разработки лендинга — от 150 000 ₽, корпоративного сайта — от 420 000 ₽, интернет-магазина — от 720 000 ₽. Точная стоимость зависит от функциональности и сроков." },
      },
      {
        "@type": "Question",
        name: "Сколько времени займёт разработка?",
        acceptedAnswer: { "@type": "Answer", text: "Лендинг — 1–2 недели, корпоративный сайт — 3–6 недель, веб-приложение — от 6 недель, мобильное приложение — от 8 недель. Работаем спринтами с еженедельными демо." },
      },
      {
        "@type": "Question",
        name: "Вы работаете по NDA?",
        acceptedAnswer: { "@type": "Answer", text: "Да, мы подписываем NDA на этапе первого звонка и обеспечиваем полную конфиденциальность вашего проекта." },
      },
      {
        "@type": "Question",
        name: "Есть ли поддержка после запуска?",
        acceptedAnswer: { "@type": "Answer", text: "Да. Мы предлагаем SLA-планы: Lite (10 ч/мес), Pro (20 ч/мес) и Enterprise (40 ч/мес). Включают мониторинг 24/7, обновления и техническую поддержку." },
      },
    ],
  };

  const ldBreadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: siteUrl },
    ],
  };

  return (
    <main style={{ background: "#07100e" }} className="text-white">
      {/* ─── JSON-LD для SEO ─── */}
      <Script
        id="ld-website-home"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldWebsite) }}
      />
      <Script
        id="ld-org-home"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldOrg) }}
      />
      <Script
        id="ld-breadcrumbs-home"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldBreadcrumbs) }}
      />
      <Script
        id="ld-faq-home"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldFaq) }}
      />

      {/* Контент (клиентские компоненты внутри Suspense) */}
      <Suspense fallback={null}>
        <HomeClientTree />
      </Suspense>
    </main>
  );
}
