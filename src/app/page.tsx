import type { Metadata } from "next";
import Script from "next/script";

import Hero from "@/components/Hero";
import { canonical, siteName } from "@/app/seo.config";
import {
  buildLanguageAlternates,
  buildOpenGraphLocale,
  getMessages,
  getRequestLocale,
} from "@/i18n/server";

/* =====================================================================================
   SEO METADATA
===================================================================================== */

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

    robots: {
      index: true,
      follow: true,
    },
  };
}

/* =====================================================================================
   STRUCTURED DATA
===================================================================================== */

function BreadcrumbsJsonLd() {
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Главная",
        item: canonical("/"),
      },
    ],
  };

  return (
    <Script
      id="ld-breadcrumbs-home"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(breadcrumbs),
      }}
    />
  );
}

/* =====================================================================================
   PAGE
===================================================================================== */

export default function Page() {
  return (
    <>
      <BreadcrumbsJsonLd />
      <Hero />
    </>
  );
}