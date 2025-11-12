// app/demo/user/shop/page.tsx
import type { Metadata, Viewport } from "next";
import Link from "next/link";
import Script from "next/script";
import { Suspense } from "react";
import ShopClient from "./components/ShopClient";
import { mockUserShop } from "./data/mockUserShop";

export const revalidate = 300;

/** Улучшенная mobile/TV адаптация + системные цвета браузера */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

/** Абсолютные URL для SEO */
const BASE_URL = "https://onestack24.ru";
const PAGE_PATH = "/demo/user/shop";
const PAGE_URL = `${BASE_URL}${PAGE_PATH}`;
const OG_IMAGE = `${BASE_URL}/og/shop.png`;

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: { default: "Магазин", template: "%s | User Portal" },
  description:
    "Каталог товаров OneStack: ритуалы, уход, подарки. Категории, подкатегории, фильтры и быстрый чекаут.",
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Магазин — OneStack Demo",
    description:
      "Категории с описаниями и удобная витрина. Добавляйте в корзину и оформляйте в один клик.",
    type: "website",
    url: PAGE_URL,
    siteName: "OneStack",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "OneStack Demo — Магазин",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Магазин — OneStack Demo",
    description:
      "Адаптивная витрина с категориями и фильтрами. Попробуйте работу корзины и оплаты.",
    images: [OG_IMAGE],
  },
};

/** JSON-LD: страница коллекции + хлебные крошки */
const ITEMLIST_STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Магазин OneStack",
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
      { "@type": "ListItem", position: 3, name: "Магазин", item: PAGE_URL },
    ],
  },
};

/* Улучшенный shimmer-скелетон (motion-safe) */
function ShopSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="space-y-8"
    >
      {/* Заголовки */}
      <div className="space-y-4">
        <div className="h-6 w-48 rounded-lg bg-white/10 motion-safe:animate-pulse" />
        <div className="h-10 w-64 rounded-lg bg-white/10 motion-safe:animate-pulse" />
        <div className="h-4 w-96 max-w-full rounded-lg bg-white/10 motion-safe:animate-pulse" />
      </div>

      {/* Сетка карточек */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 [@media(min-width:2560px)]:grid-cols-6 [@media(min-width:3840px)]:grid-cols-8">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="admin-surface relative h-80 overflow-hidden rounded-2xl"
            aria-hidden="true"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10" />
            <div className="relative h-full p-6">
              <div className="mb-4 h-6 w-3/4 rounded-lg bg-white/20 motion-safe:animate-pulse" />
              <div className="mb-2 h-4 w-full rounded-lg bg-white/15 motion-safe:animate-pulse" />
              <div className="mb-2 h-4 w-2/3 rounded-lg bg-white/15 motion-safe:animate-pulse" />
              <div className="mt-auto pt-4">
                <div className="h-9 w-28 rounded-full bg-white/20 motion-safe:animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function UserShopPage() {
  const today = new Date(); // серверная дата — безопасно выводим <time suppressHydrationWarning>

  return (
    <div className="admin-page">
      {/* Skip-link для клавиатуры */}
      <a
        href="#shop-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-gray-900"
      >
        Перейти к каталогу
      </a>

      {/* JSON-LD */}
      <Script
        id="ld-shop"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ITEMLIST_STRUCTURED_DATA) }}
      />

      {/* Хлебные крошки для screen reader и SEO */}
      <nav aria-label="Хлебные крошки" className="px-6 pt-4 sm:px-8">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-white/70">
          <li>
            <Link href="/demo" className="hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40">
              Демо
            </Link>
          </li>
          <li aria-hidden="true" className="px-1">/</li>
          <li>
            <Link href="/demo/user" className="hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40">
              Пользователь
            </Link>
          </li>
          <li aria-hidden="true" className="px-1">/</li>
          <li aria-current="page" className="text-white">Магазин</li>
        </ol>
      </nav>

      {/* Hero с мягкими градиентами и адаптацией под большие экраны */}
      <header
        className="admin-glass relative overflow-hidden p-6 sm:p-8 lg:p-12 [@media(min-width:2560px)]:p-16"
        role="banner"
      >
        {/* Фоновые градиенты (уменьшаем движение при reduced-motion) */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.3),transparent_70%)] blur-3xl motion-reduce:hidden" />
          <div className="absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(167,139,250,0.25),transparent_70%)] blur-3xl motion-reduce:hidden" />
          <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(11,208,255,0.2),transparent_70%)] blur-3xl motion-reduce:hidden" />
        </div>

        <div className="relative z-10 mx-auto max-w-screen-2xl [@media(min-width:2560px)]:max-w-[2200px] [@media(min-width:3840px)]:max-w-[3200px]">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
            {/* Текстовый блок */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2">
                <span className="admin-chip bg-white/10 text-white/80">Магазин</span>
                <span className="text-xs uppercase tracking-widest text-white/60">OneStack Demo</span>
              </div>

              <div className="space-y-4">
                <h1 className="admin-heading leading-tight">
                  Новая витрина
                  <span className="block bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                    OneStack
                  </span>
                </h1>

                <p className="admin-subheading max-w-2xl leading-relaxed">
                  Адаптивная витрина: категории, фильтры, карточки, сравнение и быстрый просмотр.
                  Оптимизация под мобильные (393×852) и ТВ/8K. Поддержка клавиатуры и screen-reader.
                </p>
              </div>

              {/* CTA — Link вместо <a>, предзагрузка внутр. маршрутов */}
              <div className="flex flex-wrap gap-4">
                <Link
                  href="#shop-content"
                  className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition-all hover:bg-white/90 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                >
                  <span>Перейти к каталогу</span>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>

                <Link
                  href="/demo/user/dashboard"
                  className="inline-flex items-center gap-3 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-all hover:bg-white/15 hover:border-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>В кабинет пользователя</span>
                </Link>
              </div>
            </div>

            {/* Статистика (живые данные) */}
            <dl className="grid grid-cols-2 gap-4 sm:gap-6">
              {[
                { label: "Товаров", value: mockUserShop.products.length, icon: "📦" },
                { label: "Брендов", value: mockUserShop.brands.length, icon: "🏷️" },
                { label: "Тегов", value: mockUserShop.tags.length, icon: "🔖" },
                {
                  label: "Цена от",
                  value: `${mockUserShop.priceRange.min.toLocaleString("ru-RU")} ₽`,
                  icon: "💰",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="admin-surface-bleed group relative overflow-hidden p-4 transition-transform hover:scale-[1.02] focus-within:scale-[1.02]"
                  tabIndex={0}
                  role="button"
                  aria-label={`${stat.label}: ${stat.value}`}
                >
                  <div className="relative z-10">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-lg" aria-hidden="true">{stat.icon}</span>
                      <dt className="text-xs font-medium uppercase tracking-wider text-white/60">{stat.label}</dt>
                    </div>
                    <dd className="text-2xl font-bold text-white">{stat.value}</dd>
                  </div>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              ))}
            </dl>
          </div>
        </div>
      </header>

      {/* Основной контент */}
      <main id="shop-content" aria-labelledby="shop-title" className="admin-surface w-full p-6 sm:p-8 [@media(min-width:2560px)]:p-12">
        {/* Заголовок витрины */}
        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="admin-text-muted text-xs uppercase tracking-widest">Каталог</span>
              <div className="h-px w-8 bg-white/30" aria-hidden="true" />
            </div>

            <div className="space-y-2">
              <h2 id="shop-title" className="admin-heading">Магазин OneStack</h2>
              <p className="admin-text-soft max-w-2xl text-sm leading-relaxed">
                Выбирайте из ассортимента товаров: уход, подарки, ритуалы. Удобный поиск и быстрый чекаут.
                Полная адаптивность от мобильных устройств до телевизоров.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="admin-chip bg-white/5">
              <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-green-400/80" aria-hidden="true" />
              Обновление каждые 5 мин
            </span>
            <time
              className="admin-text-soft hidden text-xs sm:block"
              dateTime={today.toISOString()}
              suppressHydrationWarning
              aria-label="Текущая дата"
            >
              {today.toLocaleDateString("ru-RU")}
            </time>
          </div>
        </div>

        {/* Разделитель */}
        <div className="admin-divider my-8" />

        {/* Контент с Suspense (скелетон — motion-safe) */}
        <Suspense fallback={<ShopSkeleton />}>
          <ShopClient />
        </Suspense>
      </main>

      {/* Доп. информация для XL+ экранов (включая ТВ) */}
      <footer className="hidden xl:block" role="contentinfo">
        <div className="admin-surface-bleed p-6 text-center [@media(min-width:2560px)]:p-10">
          <p className="admin-text-soft text-sm">
            Оптимизировано для экранов от 393px до 8K
            <span className="mx-2">•</span>
            Полная поддержка клавиатурной навигации
            <span className="mx-2">•</span>
            Соответствие WCAG 2.1 AA
          </p>
        </div>
      </footer>

      {/* Небольшой помощник: клавиша '/' — перейти к поиску внутри ShopClient (если он слушает customEvent) */}
      <Script id="shop-hotkeys" strategy="afterInteractive">
        {`
          (function () {
            const onKey = (e) => {
              if (e.key === '/' && !e.altKey && !e.ctrlKey && !e.metaKey) {
                const ev = new CustomEvent('shop:focus-search');
                window.dispatchEvent(ev);
                e.preventDefault();
              }
            };
            window.addEventListener('keydown', onKey);
          })();
        `}
      </Script>
    </div>
  );
}