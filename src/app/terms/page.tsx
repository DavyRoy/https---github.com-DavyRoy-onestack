import type { Metadata } from "next";
import Script from "next/script";
import TermsContent from "@/components/TermsContent";
import { canonical, siteName, siteUrl } from "@/app/seo.config";

const CANONICAL = canonical("/terms");

export const metadata: Metadata = {
  title: "Пользовательское соглашение / Terms of Use — OneStack",
  description: "Условия использования сайта, демо-окружений и услуг OneStack. Terms of Use for OneStack website, demo environments and services.",
  alternates: {
    canonical: CANONICAL,
    languages: { "ru": `${siteUrl}/terms`, "en": `${siteUrl}/terms` },
  },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: CANONICAL,
    siteName,
    title: "Пользовательское соглашение — OneStack",
    description: "Условия использования сайта, демо-окружений и услуг OneStack.",
    locale: "ru_RU",
  },
};

const LD_WEBPAGE = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Пользовательское соглашение — OneStack",
  url: CANONICAL,
  inLanguage: ["ru-RU", "en"],
  isPartOf: { "@type": "WebSite", name: siteName, url: siteUrl },
  lastReviewed: "2026-01-01",
};

const LD_BREADCRUMBS = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Главная", item: siteUrl },
    { "@type": "ListItem", position: 2, name: "Пользовательское соглашение", item: CANONICAL },
  ],
};

export default function TermsPage() {
  return (
    <>
      <Script id="ld-webpage-terms" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LD_WEBPAGE) }} />
      <Script id="ld-breadcrumbs-terms" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LD_BREADCRUMBS) }} />
      <TermsContent />
    </>
  );
}
