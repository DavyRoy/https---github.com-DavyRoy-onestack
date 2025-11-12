// app/demo/user/shop/product/[slug]/page.tsx
import type { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { notFound, Suspense } from "next/navigation";
import ProductPageClient from "@/app/demo/user/shop/products/components/ProductsPageClient";
import { mockUserShop } from "../../data/mockUserShop";

export const revalidate = 300;

/* === SEO helpers (абсолютные URL) === */
const BASE_URL = "https://onestack24.ru";
const pageUrl = (slug: string) => `${BASE_URL}/demo/user/shop/product/${slug}`;
const ogFallback = `${BASE_URL}/og/product.png`;

export async function generateMetadata(
  { params }: { params: { slug: string } },
  _parent?: ResolvingMetadata
): Promise<Metadata> {
  const product = mockUserShop.products.find((p) => p.slug === params.slug);

  if (!product) {
    return {
      metadataBase: new URL(BASE_URL),
      title: "Товар не найден",
      description: "Страница товара",
      alternates: { canonical: `${BASE_URL}/demo/user/shop/product/${params.slug}` },
      robots: { index: false, follow: true },
    };
  }

  const title = product.title;
  const description = (product.description || "").slice(0, 160) || "Страница товара OneStack";
  const canonical = pageUrl(product.slug);
  const firstImage =
    (product.images?.length ? product.images[0] : product.image) || ogFallback;
  const ogImage = firstImage.startsWith("http") ? firstImage : `${BASE_URL}${firstImage}`;

  return {
    metadataBase: new URL(BASE_URL),
    title: { default: title, template: "%s | User Portal" },
    description,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      title: `${title} — OneStack Demo`,
      description,
      type: "product",
      url: canonical,
      siteName: "OneStack",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — OneStack Demo`,
      description,
      images: [ogImage],
    },
  };
}

/* Скелетон для загрузки страницы товара (motion-safe) */
function ProductSkeleton() {
  return (
    <div role="status" aria-live="polite" aria-busy="true" className="space-y-8">
      {/* Хлебные крошки */}
      <div className="flex items-center gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-4 w-16 rounded bg-white/10 motion-safe:animate-pulse" />
            {i < 3 && <div className="h-4 w-2 rounded bg-white/5" aria-hidden="true" />}
          </div>
        ))}
      </div>

      {/* Основной контент */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Галерея */}
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl bg-white/10 motion-safe:animate-pulse" />
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-xl bg-white/10 motion-safe:animate-pulse" />
            ))}
          </div>
        </div>

        {/* Информация */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="h-8 w-3/4 rounded-lg bg-white/10 motion-safe:animate-pulse" />
            <div className="h-6 w-1/4 rounded-lg bg-white/10 motion-safe:animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-white/10 motion-safe:animate-pulse" />
              <div className="h-4 w-2/3 rounded bg-white/10 motion-safe:animate-pulse" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="h-10 w-full rounded-full bg-white/10 motion-safe:animate-pulse" />
            <div className="h-12 w-full rounded-xl bg-white/10 motion-safe:animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = mockUserShop.products.find((p) => p.slug === params.slug);
  if (!product) return notFound();

  const related = mockUserShop.products
    .filter((item) => product.related?.includes(item.id))
    .slice(0, 4);

  const suggestions = mockUserShop.products
    .filter((item) => product.suggestions?.includes(item.id))
    .slice(0, 4);

  const reviews = mockUserShop.reviews[product.id] ?? [];

  /* ---------- JSON-LD ---------- */
  const imagesArray = (product.images?.length ? product.images : [product.image]).filter(Boolean) as string[];
  const absoluteImages = imagesArray.map((src) => (src.startsWith("http") ? src : `${BASE_URL}${src}`));

  // Попробуем собрать агрегированный рейтинг, если структура отзывов поддерживает rating
  const numericRatings = Array.isArray(reviews)
    ? reviews.map((r: any) => Number(r?.rating)).filter((v) => Number.isFinite(v))
    : [];
  const ratingCount = numericRatings.length;
  const ratingValue = ratingCount ? (numericRatings.reduce((a, b) => a + b, 0) / ratingCount).toFixed(2) : undefined;

  const ldProduct: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    sku: product.id,
    url: pageUrl(product.slug),
    image: absoluteImages,
    brand: { "@type": "Brand", name: "OneStack" },
  };

  if (typeof product.price === "number") {
    ldProduct.offers = {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.currency || "RUB",
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: pageUrl(product.slug),
    };
  }
  if (ratingValue) {
    ldProduct.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue,
      reviewCount: ratingCount,
    };
  }

  const ldBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Демо", item: `${BASE_URL}/demo` },
      { "@type": "ListItem", position: 2, name: "Пользователь", item: `${BASE_URL}/demo/user` },
      { "@type": "ListItem", position: 3, name: "Магазин", item: `${BASE_URL}/demo/user/shop` },
      {
        "@type": "ListItem",
        position: 4,
        name: product.title,
        item: pageUrl(product.slug),
      },
    ],
  };

  return (
    <div className="admin-page">
      {/* Skip-link для клавиатуры */}
      <a
        href="#product-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-gray-900"
      >
        Перейти к описанию товара
      </a>

      {/* SEO-структурированные данные */}
      <Script
        id="ld-product"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldProduct) }}
      />
      <Script
        id="ld-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldBreadcrumb) }}
      />

      {/* Хлебные крошки */}
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
          <li>
            <Link href="/demo/user/shop" className="hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40">
              Магазин
            </Link>
          </li>
          <li aria-hidden="true" className="px-1">/</li>
          <li aria-current="page" className="text-white line-clamp-1">
            {product.title}
          </li>
        </ol>
      </nav>

      {/* Hero секция товара */}
      <section className="admin-glass relative overflow-hidden p-6 sm:p-8 [@media(min-width:2560px)]:p-12">
        {/* Фоновые градиенты (motion-reduce скрывает) */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 top-1/4 h-60 w-60 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.2),transparent_70%)] blur-3xl motion-reduce:hidden" />
          <div className="absolute -right-20 bottom-1/4 h-60 w-60 rounded-full bg-[radial-gradient(circle,rgba(167,139,250,0.15),transparent_70%)] blur-3xl motion-reduce:hidden" />
        </div>

        <div className="relative z-10 mx-auto max-w-screen-2xl [@media(min-width:2560px)]:max-w-[2200px] [@media(min-width:3840px)]:max-w-[3200px]">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <span className="admin-chip bg-white/10 text-white/80">Товар</span>
                <span className="text-xs uppercase tracking-widest text-white/60">
                  {product.category || "Без категории"}
                </span>
              </div>

              <div className="space-y-3">
                <h1 className="admin-heading leading-tight">{product.title}</h1>

                {product.description && (
                  <p className="admin-subheading leading-relaxed">
                    {product.description}
                  </p>
                )}
              </div>

              {/* Бейджи товара */}
              <div className="flex flex-wrap gap-2">
                {product.tags?.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="admin-chip border-white/20 bg-white/5 text-white/70"
                  >
                    {tag}
                  </span>
                ))}
                {product.inStock ? (
                  <span className="admin-chip border-green-400/30 bg-green-400/10 text-green-300">
                    ✓ В наличии
                  </span>
                ) : (
                  <span className="admin-chip border-red-400/30 bg-red-400/10 text-red-300">
                    Нет в наличии
                  </span>
                )}
                {product.isNew && (
                  <span className="admin-chip border-blue-400/30 bg-blue-400/10 text-blue-300">
                    Новинка
                  </span>
                )}
              </div>
            </div>

            {/* Действия на мобильных (стикер) */}
            <div className="sm:hidden">
              <div className="flex items-center gap-3">
                {typeof product.price === "number" && (
                  <div className="text-2xl font-bold text-white">
                    {product.price.toLocaleString("ru-RU")} ₽
                  </div>
                )}
                <button
                  className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-900"
                  aria-label="Добавить товар в корзину"
                  onClick={() => {
                    // опционально: сообщаем клиентской части
                    window.dispatchEvent(new CustomEvent("shop:add-to-cart", { detail: { id: product.id } }));
                  }}
                >
                  Купить
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Основной контент товара */}
      <section id="product-content" className="admin-surface w-full p-6 sm:p-8 [@media(min-width:2560px)]:p-12">
        {/* Заголовок секции */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="admin-text-muted text-xs uppercase tracking-widest">Детали товара</span>
              <div className="h-px w-8 bg-white/30" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-semibold text-white sm:text-2xl">
              Описание и характеристики
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="admin-chip bg-white/5">
              <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-green-400/80" aria-hidden="true" />
              ID: {product.id.slice(0, 8)}
            </span>
            {typeof product.price === "number" && (
              <span className="admin-chip bg-white/10 text-white/90">
                {product.price.toLocaleString("ru-RU")} ₽
              </span>
            )}
          </div>
        </div>

        {/* Разделитель */}
        <div className="admin-divider my-6" />

        {/* Контент с Suspense */}
        <Suspense fallback={<ProductSkeleton />}>
          <ProductPageClient
            product={product}
            related={related}
            suggestions={suggestions}
            reviews={reviews}
          />
        </Suspense>
      </section>

      {/* Дополнительные секции */}
      {(related.length > 0 || suggestions.length > 0) && (
        <section className="admin-surface-bleed p-6 sm:p-8 [@media(min-width:2560px)]:p-12">
          <div className="space-y-10">
            {related.length > 0 && (
              <div>
                <h3 className="mb-4 text-lg font-semibold text-white">Связанные товары</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 [@media(min-width:2560px)]:grid-cols-5 [@media(min-width:3840px)]:grid-cols-6">
                  {related.map((item) => (
                    <Link
                      href={`/demo/user/shop/product/${item.slug}`}
                      key={item.id}
                      className="admin-surface group block p-4 transition-transform hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                      aria-label={`Перейти к товару ${item.title}`}
                    >
                      <div className="mb-3 aspect-square rounded-xl bg-white/5" />
                      <h4 className="line-clamp-2 font-medium text-white group-hover:text-white/80">
                        {item.title}
                      </h4>
                      {typeof item.price === "number" && (
                        <p className="text-sm text-white/60">{item.price.toLocaleString("ru-RU")} ₽</p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {suggestions.length > 0 && (
              <div>
                <h3 className="mb-4 text-lg font-semibold text-white">Рекомендуем посмотреть</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 [@media(min-width:2560px)]:grid-cols-5 [@media(min-width:3840px)]:grid-cols-6">
                  {suggestions.map((item) => (
                    <Link
                      href={`/demo/user/shop/product/${item.slug}`}
                      key={item.id}
                      className="admin-surface group block p-4 transition-transform hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                      aria-label={`Перейти к товару ${item.title}`}
                    >
                      <div className="mb-3 aspect-square rounded-xl bg-white/5" />
                      <h4 className="line-clamp-2 font-medium text-white group-hover:text-white/80">
                        {item.title}
                      </h4>
                      {typeof item.price === "number" && (
                        <p className="text-sm text-white/60">{item.price.toLocaleString("ru-RU")} ₽</p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Информация для больших экранов */}
      <footer className="hidden xl:block" role="contentinfo">
        <div className="admin-surface-bleed p-6 text-center [@media(min-width:2560px)]:p-10">
          <p className="admin-text-soft text-sm">
            Страница оптимизирована для всех устройств
            <span className="mx-2">•</span>
            Поддержка жестов и тач-навигации
            <span className="mx-2">•</span>
            Быстрое добавление в корзину
          </p>
        </div>
      </footer>

      {/* Хоткей '/': сфокусировать поиск/CTA в клиентском компоненте, если он слушает события */}
      <Script id="product-hotkeys" strategy="afterInteractive">
        {`
          (function () {
            const onKey = (e) => {
              if (e.key === '/' && !e.altKey && !e.ctrlKey && !e.metaKey) {
                window.dispatchEvent(new CustomEvent('shop:focus-search'));
                e.preventDefault();
              }
              if ((e.key === 'a' || e.key === 'A') && (e.metaKey || e.ctrlKey)) {
                window.dispatchEvent(new CustomEvent('shop:add-to-cart', { detail: { id: ${JSON.stringify(
                  product.id
                )} } }));
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

// опционально — для SSG (если потребуется)
// export async function generateStaticParams() {
//   return mockUserShop.products.map((p) => ({ slug: p.slug }));
// }