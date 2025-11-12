// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import Script from "next/script";
import CookieBanner from "@/components/CookieBanner";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://onestack24.ru";
const SITE_NAME = "OneStack";
const SITE_DESC =
  "OneStack — создаём сайты, веб- и мобильные приложения. Спринты 1–2 недели, прозрачная смета, CI/CD и SLA-поддержка.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — сайты, веб- и мобильные приложения`,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESC,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
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
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — продуктовая команда`,
    description: SITE_DESC,
    locale: "ru_RU",
    images: [{ url: "/og/cover.png", width: 1200, height: 630, alt: `${SITE_NAME} — обложка` }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESC,
    images: ["/og/cover.png"],
  },
  // иконки из /public/vercal.png
  icons: {
    icon: "/vercal.png",
    shortcut: "/vercal.png",
    apple: "/vercal.png",
  },
};

// ВАЖНО: themeColor должен быть в viewport, а не в metadata
export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="bg-black text-white">
        {/* Google Analytics (GA4) */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-04E9LPJ43Y" />
        <Script id="ga4" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){ dataLayer.push(arguments); }
            gtag('js', new Date());
            gtag('config', 'G-04E9LPJ43Y');
          `}
        </Script>

        {/* Yandex.Metrika */}
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){
              m[i]=m[i]||function(){ (m[i].a=m[i].a||[]).push(arguments) };
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {
                if (document.scripts[j].src === r) { return; }
              }
              k=e.createElement(t), a=e.getElementsByTagName(t)[0], k.async=1, k.src=r, a.parentNode.insertBefore(k,a)
            })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');

            ym(103909522, 'init', {
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://mc.yandex.ru/watch/103909522" style={{ position: "absolute", left: "-9999px" }} alt="" />
        </noscript>

        {children}
        <CookieBanner />
      </body>
    </html>
  );
}