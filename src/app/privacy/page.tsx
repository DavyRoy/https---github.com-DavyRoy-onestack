import type { Metadata } from "next";
import Script from "next/script";
import PrivacyContent from "@/components/PrivacyContent";
import { canonical, siteName, siteUrl } from "@/app/seo.config";

const CANONICAL = canonical("/privacy");

export const metadata: Metadata = {
  title: "Политика конфиденциальности / Privacy Policy — OneStack",
  description: "Политика обработки персональных данных OneStack. Соответствие ФЗ-152 (Россия) и GDPR (ЕС). Personal data processing policy compliant with Russian Law 152-FZ and EU GDPR.",
  alternates: {
    canonical: CANONICAL,
    languages: { "ru": `${siteUrl}/privacy`, "en": `${siteUrl}/privacy` },
  },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: CANONICAL,
    siteName,
    title: "Политика конфиденциальности — OneStack",
    description: "Обработка персональных данных в соответствии с ФЗ-152 и GDPR.",
    locale: "ru_RU",
  },
};

const LD_WEBPAGE = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Политика конфиденциальности — OneStack",
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
    { "@type": "ListItem", position: 2, name: "Политика конфиденциальности", item: CANONICAL },
  ],
};

export default function PrivacyPage() {
  return (
    <>
      <Script id="ld-webpage-privacy" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LD_WEBPAGE) }} />
      <Script id="ld-breadcrumbs-privacy" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LD_BREADCRUMBS) }} />
      <PrivacyContent />
    </>
  );
}
