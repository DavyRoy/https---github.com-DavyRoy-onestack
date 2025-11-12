// src/app/home/page.tsx
import type { Metadata } from "next";
import Script from "next/script";
import { Suspense } from "react";
import { QuoteProvider } from "@/app/context/QuoteContext";

import NavBar from "@/components/NavBar";
import HomeIntro from "@/components/HomeIntro";
import HomeServices from "@/components/HomeServices";
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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://onestack24.ru";
const title = "OneStack — домашняя страница";
const description =
  "Домашняя страница демо-платформы OneStack: быстрый старт, ключевые возможности, сайты, веб- и мобильные приложения.";
const url = `${SITE_URL}/home`;

// контакты (актуальные)
const CONTACT_EMAIL = "info@onestack24.ru";
const CONTACT_PHONE = "+7 (910) 948 61 06";
const TELEGRAM_TITLE = "OneStack Assistant";
const TELEGRAM_HANDLE = "OneStack Assistant"; // настроим ссылку позже

// метрики
const GA_ID = "G-04E9LPJ43Y";
const YM_ID = 103909522;

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
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "OneStack — домашняя" }],
    locale: "ru_RU",
  },
  twitter: { card: "summary_large_image", title, description, images: ["/og/home.png"] },
};

/* ────────────────────────────────────────────────────────────────────────── */
/* Клиентское дерево (внутри серверного файла — ok)                           */
/* ────────────────────────────────────────────────────────────────────────── */

function HomeClientTree() {
  "use client";
  return (
    <QuoteProvider>
      <NavBar />
      <HomeIntro />
      <HomeServices />
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

export default function HomePage() {
  // JSON-LD: WebSite + Organization (с контактами)
  const ldWebsite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "OneStack",
    url,
    description,
    inLanguage: "ru-RU",
    publisher: { "@type": "Organization", name: "OneStack", url: SITE_URL },
  };

  const ldOrg = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "OneStack",
    url: SITE_URL,
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
      // добавим точный URL Telegram, когда будет готов
      // пример: "https://t.me/onestack_assistant"
    ],
    logo: `${SITE_URL}/vercal.png`,
  };

  return (
    <main className="bg-black text-white">
      {/* ─── Google Analytics (gtag) ─── */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script
        id="ga-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `,
        }}
      />

      {/* ─── Yandex.Metrika ─── */}
      <Script
        id="ym-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(m,e,t,r,i,k,a){
              m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {
                if (document.scripts[j].src === r) { return; }
              }
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
            })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=${YM_ID}', 'ym');
            ym(${YM_ID}, 'init', { ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", accurateTrackBounce:true, trackLinks:true });
          `,
        }}
      />
      {/* noscript-пиксель для Яндекс.Метрики */}
      <noscript>
        <img
          src={`https://mc.yandex.ru/watch/${YM_ID}`}
          style={{ position: "absolute", left: "-9999px" }}
          alt=""
        />
      </noscript>

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

      {/* Контент (клиентские компоненты внутри Suspense) */}
      <Suspense fallback={null}>
        <HomeClientTree />
      </Suspense>
    </main>
  );
}