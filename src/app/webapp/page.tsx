// src/app/webapp/page.tsx
import type { Metadata } from "next";
import Script from "next/script";
import { Suspense } from "react";

import NavBar from "@/components/NavBar";
import WebAppIntro from "@/components/WebAppIntro";
import WebAppKinds from "@/components/WebAppKinds";
import WebAppModules from "@/components/WebAppModules";
import WebAppBenefits from "@/components/WebAppBenefits";
import WebAppCalculator from "@/components/WebAppCalculator";
import WebAppPerfSecurity from "@/components/WebAppPerfSecurity";
import WebAppContact from "@/components/WebAppContact";
import WebAppFAQ from "@/components/WebAppFAQ";
import HomeFooter from "@/components/HomeFooter";

/* ==================== SEO / CONFIG ==================== */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://onestack24.ru";
const GTAG_ID = "G-04E9LPJ43Y";
const YM_ID = 103909522;

const title =
  "Веб-приложения: личные кабинеты, CRM/ERP, дашборды — разработка под рост | OneStack";
const description =
  "Проектируем и создаём веб-приложения: личные кабинеты, CRM/ERP, аналитические дашборды. Роли и доступы, безопасные API, интеграции (оплаты, CRM, склад), масштабируемость и наблюдаемость.";
const url = `${SITE_URL}/webapp`;

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
        url: "/og/webapp.png",
        width: 1200,
        height: 630,
        alt: "OneStack — веб-приложения",
      },
    ],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/og/webapp.png"] },
};

// Важно: дочерние компоненты могут использовать useSearchParams(). Запрещаем SSG.
export const dynamic = "force-dynamic";

/* ==================== PAGE ==================== */

export default function WebAppPage() {
  const ldJson = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Разработка веб-приложений",
    provider: { "@type": "Organization", name: "OneStack", url: SITE_URL },
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

  return (
    <main className="bg-black text-white">
      {/* ==================== Analytics ==================== */}
      {/* Google Analytics */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){ dataLayer.push(arguments); }
          gtag('js', new Date());
          gtag('config', '${GTAG_ID}');
        `}
      </Script>

      {/* Yandex.Metrika */}
      <Script id="ym-init" strategy="afterInteractive">
        {`
          (function(m,e,t,r,i,k,a){
            m[i]=m[i]||function(){ (m[i].a=m[i].a||[]).push(arguments) };
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {
              if (document.scripts[j].src === r) { return; }
            }
            k=e.createElement(t), a=e.getElementsByTagName(t)[0], k.async=1, k.src=r, a.parentNode.insertBefore(k,a)
          })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=${YM_ID}', 'ym');

          ym(${YM_ID}, 'init', {
            ssr: true,
            webvisor: true,
            clickmap: true,
            ecommerce: 'dataLayer',
            accurateTrackBounce: true,
            trackLinks: true
          });
        `}
      </Script>
      <noscript>
        <div>
          <img
            src={`https://mc.yandex.ru/watch/${YM_ID}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>

      {/* ==================== JSON-LD ==================== */}
      <Script
        id="ld-service-webapp"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
      />

      {/* ==================== Content ==================== */}
      <Suspense fallback={null}>
        <NavBar />
        <WebAppIntro />
        <WebAppKinds />
        <WebAppModules />
        <WebAppBenefits />
        <WebAppCalculator />
        <WebAppPerfSecurity />
        <WebAppContact />
        <WebAppFAQ />
        <HomeFooter />
      </Suspense>
    </main>
  );
}