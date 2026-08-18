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

  const FAQ_RU = [
    { q: "Сколько стоит разработка сайта?", a: "Стоимость разработки лендинга — от 150 000 ₽, корпоративного сайта — от 420 000 ₽, интернет-магазина — от 720 000 ₽. Точная стоимость зависит от функциональности и сроков." },
    { q: "Сколько времени займёт разработка?", a: "Лендинг — 1–2 недели, корпоративный сайт — 3–6 недель, веб-приложение — от 6 недель, мобильное приложение — от 8 недель. Работаем спринтами с еженедельными демо." },
    { q: "Вы работаете по NDA?", a: "Да, мы подписываем NDA на этапе первого звонка и обеспечиваем полную конфиденциальность вашего проекта." },
    { q: "Есть ли поддержка после запуска?", a: "Да. Мы предлагаем SLA-планы: Lite (10 ч/мес), Pro (20 ч/мес) и Enterprise (40 ч/мес). Включают мониторинг 24/7, обновления и техническую поддержку." },
  ];
  const FAQ_EN = [
    { q: "How much does website development cost?", a: "A landing page starts from ₽150,000, a corporate website from ₽420,000, and an online store from ₽720,000. The exact price depends on functionality and timeline." },
    { q: "How long does development take?", a: "A landing page takes 1–2 weeks, a corporate website 3–6 weeks, a web app from 6 weeks, and a mobile app from 8 weeks. We work in sprints with weekly demos." },
    { q: "Do you work under NDA?", a: "Yes, we sign an NDA at the first call and keep your project fully confidential." },
    { q: "Is there support after launch?", a: "Yes. We offer SLA plans: Lite (10h/mo), Pro (20h/mo) and Enterprise (40h/mo). They include 24/7 monitoring, updates and technical support." },
  ];
  const faqItems = locale === "ru" ? FAQ_RU : FAQ_EN;

  const ldFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  const ldBreadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: locale === "ru" ? "Главная" : "Home", item: siteUrl },
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
