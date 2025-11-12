// app/demo/page.tsx
import type { Metadata } from "next";
import Script from "next/script";
import dynamic from "next/dynamic";
import DemoHero from "./components/DemoHero"; // Hero грузим сразу для лучшего LCP/SEO

// 🔹 Ленивая подгрузка секций ниже фолда (SSR включён, чтобы не терять SEO)
const DemoCapabilities = dynamic(() => import("./components/DemoCapabilities"), {
  loading: () => (
    <div className="h-40 w-full animate-pulse rounded-2xl bg-white/5" aria-hidden="true" />
  ),
  ssr: true,
});
const DemoShowcase = dynamic(() => import("./components/DemoShowcase"), {
  loading: () => (
    <div className="h-64 w-full animate-pulse rounded-2xl bg-white/5" aria-hidden="true" />
  ),
  ssr: true,
});
const DemoFAQ = dynamic(() => import("./components/DemoFAQ"), {
  loading: () => (
    <div className="h-32 w-full animate-pulse rounded-2xl bg-white/5" aria-hidden="true" />
  ),
  ssr: true,
});

// ✅ РЕКОМЕНДАЦИЯ: укажи в корневом layout `metadataBase = new URL("https://onestack24.ru")`
export const metadata: Metadata = {
  title: "Demo Platform | OneStack",
  description:
    "Интерактивное демо OneStack: магазин, услуги, бронирование и CRM. Веб и мобильные сценарии для ролей пользователя, менеджера и администратора.",
  alternates: { canonical: "/demo" },
  openGraph: {
    title: "Demo Platform | OneStack",
    description:
      "Проверенные модули: магазин, услуги, бронирование и CRM. Переключайте роли, изучайте сценарии и архитектуру.",
    url: "/demo",
    type: "website",
    siteName: "OneStack",
    images: [
      {
        url: "/og/demo.png", // положи файл 1200x630 в /public/og/demo.png
        width: 1200,
        height: 630,
        alt: "OneStack Demo — магазин, услуги, бронирование и CRM",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Demo Platform | OneStack",
    description:
      "Живое демо OneStack: витрина, услуги, бронирование и CRM с адаптивным UI и готовыми интеграциями.",
    images: ["/og/demo.png"],
  },
};

const PAGE_STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "OneStack Demo Platform",
  url: "https://onestack24.ru/demo",
  description:
    "Демонстрация модулей OneStack: магазин, услуги, бронирование и CRM. Три роли, адаптивный интерфейс и готовые интеграции.",
  isPartOf: {
    "@type": "WebSite",
    name: "OneStack",
    url: "https://onestack24.ru",
  },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: "https://onestack24.ru" },
      { "@type": "ListItem", position: 2, name: "Демо", item: "https://onestack24.ru/demo" },
    ],
  },
};

export const revalidate = 300;

export default function DemoPage() {
  return (
    // ⬇️ Единый однородный тёмный фон. Цвет берём из токена --bg (см. globals.css).
    // Если токены ещё не подключены, временно можно заменить класс на bg-[#0f1115].
    <main id="main" role="main" className="min-h-screen bg-[hsl(var(--bg))] text-[hsl(var(--fg))]">
      {/* Структурированные данные для поисковиков */}
      <Script
        id="ld-demo-page"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PAGE_STRUCTURED_DATA) }}
      />

      {/* Визуально скрытый h1 формирует корректный outline для скринридеров */}
      <h1 className="sr-only">Онлайн демо платформы OneStack</h1>

      {/* HERO (критический контент) */}
      <DemoHero />

      {/* Секции ниже фолда: ровная сетка и отступы в духе Linear */}
      <section
        aria-labelledby="capabilities-heading"
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
      >
        <h2 id="capabilities-heading" className="sr-only">
          Возможности и интеграции
        </h2>
        <DemoCapabilities />
      </section>

      <section
        aria-labelledby="showcase-heading"
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
      >
        <h2 id="showcase-heading" className="sr-only">
          Демо сценарии и модули
        </h2>
        <DemoShowcase />
      </section>

      <section
        aria-labelledby="faq-heading"
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
      >
        <h2 id="faq-heading" className="sr-only">
          Частые вопросы
        </h2>
        <DemoFAQ />
      </section>
    </main>
  );
}