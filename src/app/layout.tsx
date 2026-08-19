// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";

import { getUsdRate } from "@/lib/rate";
import { RateProvider } from "@/app/context/RateContext";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import Script from "next/script";
import { Suspense } from "react";

import CookieBanner from "@/components/CookieBanner";
import ScrollToHash from "@/components/ScrollToHash";
import { I18nProvider } from "@/i18n/I18nProvider";

import {
  buildVerificationMeta,
  canonical,
  siteName,
  siteUrl,
} from "@/app/seo.config";

import {
  buildLanguageAlternates,
  buildOpenGraphLocale,
  getMessages,
  getRequestLocale,
  getPathWithLocaleHeader,
} from "@/i18n/server";

/* =====================================================================================
   METADATA
===================================================================================== */

export async function generateMetadata(): Promise<Metadata> {
  const locale = getRequestLocale();
  const dict = getMessages(locale);

  const description = dict.seo.siteDescription;

  const title =
    locale === "ru"
      ? `${siteName} — digital продукты и веб-разработка`
      : `${siteName} — digital products & web development`;

  return {
    metadataBase: new URL(siteUrl),

    title: {
      default: title,
      template: `%s — ${siteName}`,
    },

    description,
    applicationName: siteName,

    alternates: {
      canonical: canonical("/", locale),
      languages: buildLanguageAlternates("/"),
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },

    openGraph: {
      type: "website",
      url: siteUrl,
      siteName,
      title,
      description,
      locale: buildOpenGraphLocale(locale),
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
    },

    icons: {
      icon: [
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/icon.svg", type: "image/svg+xml" },
      ],
      shortcut: "/favicon-32x32.png",
      apple: "/apple-touch-icon.png",
    },

    verification: buildVerificationMeta(),
  };
}

/* =====================================================================================
   VIEWPORT
===================================================================================== */

export const viewport: Viewport = {
  themeColor: "#07100e",
  colorScheme: "dark",
};

/* =====================================================================================
   ROOT LAYOUT
===================================================================================== */

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);
  const pathWithLocale = await getPathWithLocaleHeader();
  const usdRub = await getUsdRate();

  return (
    <html
      lang={locale}
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body
        className="
          bg-background
          text-foreground
          antialiased
          selection:bg-white/10
          selection:text-white
        "
      >
        {/* =====================================================================================
            BACKGROUND LAYER (foundation for premium UI)
        ====================================================================================== */}
        <div className="fixed inset-0 -z-10 overflow-hidden" style={{ background: "#07100e" }}>
          {/* Subtle teal ambient lights */}
          <div className="absolute left-[-15%] top-[-10%] h-[600px] w-[600px] rounded-full blur-3xl" style={{ background: "rgba(45,212,191,0.06)" }} />
          <div className="absolute right-[-10%] top-[20%] h-[500px] w-[500px] rounded-full blur-3xl" style={{ background: "rgba(45,212,191,0.04)" }} />

          {/* Subtle grid */}
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(to right,rgba(255,255,255,0.07) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,0.07) 1px,transparent 1px)", backgroundSize: "64px 64px" }} />
        </div>

        {/* =====================================================================================
            I18N CONTEXT
        ====================================================================================== */}
        <RateProvider rate={usdRub}>
        <I18nProvider
          locale={locale}
          messages={messages}
          pathWithLocale={pathWithLocale}
        >
          {/* =====================================================================================
              GLOBAL SCRIPTS (analytics separated but still here for performance)
          ====================================================================================== */}

          <script
            id="structured-data-org"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                "@id": `${siteUrl}/#organization`,
                name: siteName,
                url: siteUrl,
                logo: `${siteUrl}/logo.png`,
                email: "info@onestack24.ru",
                telephone: "+79109486106",
                foundingDate: "2021",
                areaServed: ["RU", "KZ", "BY"],
                sameAs: [
                  "https://t.me/onestack_assistant_bot",
                ],
                contactPoint: {
                  "@type": "ContactPoint",
                  contactType: "customer support",
                  email: "info@onestack24.ru",
                  telephone: "+79109486106",
                  availableLanguage: ["Russian", "English"],
                },
              }),
            }}
          />

          {/* Google Analytics */}
          <Script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-B4KV8MKDZL"
          />
          <Script id="ga4" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){ dataLayer.push(arguments); }
              gtag('js', new Date());
              gtag('config', 'G-B4KV8MKDZL');
            `}
          </Script>

          {/* Yandex Metrika */}
          <Script id="yandex-metrika" strategy="afterInteractive">
            {`
              (function(m,e,t,r,i,k,a){
                m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                k=e.createElement(t), a=e.getElementsByTagName(t)[0], k.async=1, k.src=r, a.parentNode.insertBefore(k,a)
              })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js?id=105578590", "ym");

              ym(105578590, "init", {
                clickmap:true,
                trackLinks:true,
                accurateTrackBounce:true,
                webvisor:true
              });
            `}
          </Script>

          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://mc.yandex.ru/watch/105578590"
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </noscript>

          {/* =====================================================================================
              APP CONTENT
          ====================================================================================== */}
          <Suspense fallback={null}>
            <ScrollToHash />
          </Suspense>

          <main className="relative z-10 min-h-screen">
            {children}
          </main>

          <CookieBanner />
        </I18nProvider>
        </RateProvider>
      </body>
    </html>
  );
}