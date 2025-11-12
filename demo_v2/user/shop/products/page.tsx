import type { Metadata, Viewport } from "next";
import Link from "next/link";
import Script from "next/script";
import { Suspense } from "react";
import ProductsPageClient from "./components/ProductsPageClient";
import { cn, EYEBROW } from "./components/_shared";

export const revalidate = 300;

const BASE_URL = "https://onestack24.ru";
const PAGE_PATH = "/demo/user/shop/products";
const PAGE_URL = `${BASE_URL}${PAGE_PATH}`;
const OG_IMAGE = `${BASE_URL}/og/shop-products.png`;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: { default: "Товары | OneStack", template: "%s | OneStack" },
  description:
    "Каталог товаров с интеллектуальными фильтрами, быстрым просмотром, сравнением и добавлением в корзину. Полная адаптивность от 393px до 8K дисплеев.",
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Товары — OneStack Demo",
    description: "Каталог с фильтрами, сравнением и добавлением в корзину.",
    type: "website",
    url: PAGE_URL,
    siteName: "OneStack",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "OneStack Demo — Товары" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Товары — OneStack Demo",
    description: "Адаптивная витрина с фильтрами, сравнением и корзиной.",
    images: [OG_IMAGE],
  },
};

const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Товары OneStack",
  url: PAGE_URL,
  isPartOf: {
    "@type": "WebSite",
    name: "OneStack",
    url: BASE_URL,
  },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Демо", item: `${BASE_URL}/demo` },
      { "@type": "ListItem", position: 2, name: "Пользователь", item: `${BASE_URL}/demo/user` },
      { "@type": "ListItem", position: 3, name: "Магазин", item: `${BASE_URL}/demo/user/shop` },
      { "@type": "ListItem", position: 4, name: "Товары", item: PAGE_URL },
    ],
  },
};

export default function ShopProductsPage() {
  return (
    <>
      {/* SEO Structured Data */}
      <Script
        id="ld-products-collection"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
      />

      {/* Main Section */}
      <section
        id="products"
        aria-labelledby="products-title"
        className="relative min-h-screen bg-gradient-to-br from-[#050911] via-[#0a1425] to-[#0b1a35] overflow-x-hidden"
        role="main"
      >
        {/* Background Layers */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#050911]/90 via-[#0a1425]/85 to-[#0b1a35]/80" />
          <div
            className="absolute inset-0 opacity-60"
            style={{
              background: `
                radial-gradient(80% 80% at 10% 10%, rgba(84,112,255,0.25), transparent 60%),
                radial-gradient(70% 70% at 90% 30%, rgba(15,218,255,0.2), transparent 60%)
              `,
            }}
          />
        </div>

        {/* Skip link */}
        <a
          href="#products-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-50 focus:rounded-2xl focus:bg-white focus:px-6 focus:py-3 focus:text-gray-900 focus:shadow-2xl focus:outline-none focus:ring-4 focus:ring-white/30"
        >
          Перейти к списку товаров
        </a>

        <div className="relative mx-auto w-full max-w-[2560px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16 [@media(min-width:3840px)]:max-w-[3200px]">
          {/* Breadcrumbs */}
          <nav aria-label="Навигация" className="mb-8 sm:mb-12">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-white/70 sm:text-base sm:gap-3">
              {[
                { href: "/demo", label: "Демо" },
                { href: "/demo/user", label: "Пользователь" },
                { href: "/demo/user/shop", label: "Магазин" },
              ].map((item, i) => (
                <li key={item.href} className="flex items-center gap-2 sm:gap-3">
                  {i > 0 && <span aria-hidden="true" className="text-white/30">›</span>}
                  <Link
                    href={item.href}
                    className="rounded-xl px-3 py-1.5 hover:bg-white/10 hover:text-white focus-visible:bg-white/10 focus-visible:text-white focus-visible:ring-4 focus-visible:ring-white/30"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="flex items-center gap-2 sm:gap-3" aria-current="page">
                <span aria-hidden="true" className="text-white/30">›</span>
                <span className="rounded-xl bg-white/10 px-3 py-1.5 font-medium text-white">Товары</span>
              </li>
            </ol>
          </nav>

          {/* Page Header */}
          <div className="mb-12 lg:mb-16">
            <div className="mx-auto max-w-4xl space-y-10">
              <div className="space-y-4">
                <p className={cn(EYEBROW, "inline-flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-2 text-white/70 backdrop-blur-sm")}>
                  <span className="h-2 w-2 animate-pulse rounded-full bg-green-400/80" />
                  Каталог товаров
                </p>
                <h1
                  id="products-title"
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-white"
                >
                  Витрина товаров{" "}
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    OneStack
                  </span>
                </h1>
              </div>
              <p className="max-w-3xl text-lg sm:text-xl text-white/80 leading-relaxed">
                Полноценный каталог с фильтрами, сравнением, избранным и быстрым добавлением в корзину.
                Работает на всех экранах — от мобильных до 8K.
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div id="products-content" className="relative">
            <Suspense fallback={<div role="status" aria-busy="true">Загрузка товаров...</div>}>
              <ProductsPageClient />
            </Suspense>
          </div>
        </div>

        {/* Доп. семантика */}
        <div className="sr-only">
          <h2>Навигация по товарам</h2>
          <p>Используйте фильтры и сортировку для поиска товаров. Можно добавлять в корзину, сравнивать и сохранять в избранное.</p>
        </div>
      </section>
    </>
  );
}