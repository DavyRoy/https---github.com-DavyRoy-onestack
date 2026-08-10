// SEO хелперы для всех компонентов
// Исправлены критические проблемы: убран keyword stuffing, правильные типы

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://onestack24.ru";

/**
 * Создает базовую Schema.org Organization структуру
 */
export const getOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "OneStack24",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/og-logo.png`,
    width: 512,
    height: 512,
  },
  description:
    "Профессиональная разработка веб-приложений с использованием современных технологий.",
  email: "info@onestack24.ru",
  telephone: "+7-910-948-61-06",
  address: {
    "@type": "PostalAddress",
    addressCountry: "RU",
    addressLocality: "Москва",
  },
});

/**
 * Создает Service schema для конкретного сервиса
 */
export const getServiceSchema = (params: {
  name: string;
  description: string;
  url: string;
  offers?: Array<{
    name: string;
    description: string;
    price?: number;
  }>;
}) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: params.name,
  description: params.description,
  url: params.url,
  provider: {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "OneStack24",
    url: SITE_URL,
  },
  areaServed: [
    { "@type": "Country", name: "Россия" },
    { "@type": "Country", name: "Казахстан" },
    { "@type": "Country", name: "Беларусь" },
  ],
  ...(params.offers && {
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Услуги разработки",
      itemListElement: params.offers.map((offer) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: offer.name,
          description: offer.description,
          ...(offer.price && {
            offers: {
              "@type": "Offer",
              price: offer.price,
              priceCurrency: "RUB",
            },
          }),
        },
      })),
    },
  }),
});

/**
 * Создает FAQPage schema
 */
export const getFAQSchema = (
  questions: Array<{ question: string; answer: string }>
) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: questions.map((q) => ({
    "@type": "Question",
    name: q.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: q.answer,
    },
  })),
});

/**
 * Создает BreadcrumbList schema
 */
export const getBreadcrumbSchema = (
  items: Array<{ name: string; url: string }>
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

/**
 * Валидирует и очищает title (макс 60 символов)
 */
export const sanitizeTitle = (title: string, maxLength = 60): string => {
  if (title.length <= maxLength) return title;
  return title.substring(0, maxLength - 3) + "...";
};

/**
 * Валидирует и очищает description (макс 160 символов)
 */
export const sanitizeDescription = (
  description: string,
  maxLength = 160
): string => {
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength - 3) + "...";
};

/**
 * Удаляет keyword stuffing из текста
 */
export const removeKeywordStuffing = (text: string): string => {
  // Удаляет повторяющиеся buzzwords
  const buzzwords = [
    "№1",
    "лидер",
    "премиум",
    "premium",
    "enterprise",
    "топ-",
    "лучший",
  ];

  let cleaned = text;
  buzzwords.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    const matches = text.match(regex);
    if (matches && matches.length > 1) {
      // Оставляем только первое упоминание
      let count = 0;
      cleaned = cleaned.replace(regex, (match) => {
        count++;
        return count === 1 ? match : "";
      });
    }
  });

  return cleaned.replace(/\s+/g, " ").trim();
};

export { SITE_URL };
