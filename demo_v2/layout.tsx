// app/demo/layout.tsx
import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import Link from "next/link";
import Script from "next/script";
import DemoHeader from "./components/DemoHeader";

/**
 * РЕКОМЕНДАЦИЯ: Добавь в app/layout.tsx
 * export const metadataBase = new URL("https://onestack24.ru");
 */

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0f1115" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: {
    default: "Demo CRM",
    template: "%s | Demo CRM",
  },
  description:
    "Интерактивное демо CRM: Магазин, Услуги, Бронирование и CRM-панель в ролях Пользователя, Менеджера и Администратора.",
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
  },
  alternates: {
    canonical: "/demo",
  },
  openGraph: {
    title: "Demo CRM",
    description:
      "Посмотрите ключевые модули: Магазин, Услуги, Бронирование и CRM-панель. Переключение ролей без регистрации.",
    type: "website",
    url: "https://onestack24.ru/demo",
    siteName: "OneStack",
    images: [
      {
        url: "/og/demo.png",
        width: 1200,
        height: 630,
        alt: "OneStack Demo — Магазин, Услуги, Бронирование и CRM",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Demo CRM",
    description:
      "Модули: Магазин, Услуги, Бронирование и CRM-панель. Роли: Пользователь, Менеджер, Администратор.",
    images: ["/og/demo.png"],
  },
  category: "technology",
};

export default function DemoLayout({ children }: { children: ReactNode }) {
  const SITE_NAV_STRUCTURED_DATA = {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    name: ["На сайт", "Демо", "Пользователь", "Менеджер", "Администратор"],
    url: [
      "https://onestack24.ru/",
      "https://onestack24.ru/demo",
      "https://onestack24.ru/demo?role=user",
      "https://onestack24.ru/demo?role=manager",
      "https://onestack24.ru/demo?role=admin",
    ],
  };

  return (
    <div className="flex flex-col min-h-dvh w-full bg-[hsl(var(--bg))] text-[hsl(var(--fg))] selection:bg-[hsl(var(--brand-muted))] selection:text-white">
      {/* Кнопка доступности для скринридеров */}
      <a
        href="#demo-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-[hsl(var(--panel))] focus:px-4 focus:py-2 focus:shadow-md focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand))]"
      >
        Перейти к содержимому
      </a>

      {/* Верхняя навигационная панель */}
      <DemoHeader />

      {/* SEO: Структурированные данные навигации */}
      <Script
        id="ld-site-nav"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(SITE_NAV_STRUCTURED_DATA),
        }}
      />

      {/* Контент, полностью заполняющий оставшуюся область */}
      <main
        id="demo-content"
        role="main"
        className="flex-1 w-full h-full overflow-x-hidden"
      >
        {children}
      </main>
    </div>
  );
}

/* ------------------------- Компонент: FooterLink -------------------------- */

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-[hsl(var(--link))] hover:underline underline-offset-4 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand))] focus:ring-offset-2 rounded-md px-1 transition"
    >
      {children}
    </Link>
  );
}