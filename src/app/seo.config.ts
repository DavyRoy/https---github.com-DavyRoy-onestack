import type { Metadata } from "next";
import { defaultLocale, type Locale } from "@/i18n/config";

const DEFAULT_SITE_URL = "https://onestack24.ru";

const rawSiteUrl = (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).trim();

// Базовый URL сайта без хвостовых слэшей, чтобы избежать дублей в каноникал/OG
export const siteUrl = rawSiteUrl.replace(/\/+$/, "");

export const siteName = "OneStack";

export const siteDescription =
  "OneStack — команда разработки из Тулы: сайты, веб-сервисы, мобильные приложения и внедрение ИИ для бизнеса в России, СНГ и других странах. 30 специалистов, с 2020 года, 150+ проектов.";

/* Факты о компании — единый источник для разметки, llms.txt и текстов. */
export const COMPANY = {
  city: "Тула",
  cityEn: "Tula",
  foundingYear: 2020,
  teamSize: 30,
  // Работаем удалённо по всему миру, основной рынок — Россия и СНГ.
  areaServed: [
    { "@type": "Country", name: "Россия" },
    { "@type": "Place", name: "СНГ" },
    { "@type": "Place", name: "Весь мир" },
  ],
} as const;

export const canonical = (path = "/", locale: Locale = defaultLocale): string => {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const trimmed = normalized === "/" ? "/" : normalized.replace(/\/+$/, "");
  // Главная английской версии — /en, а не "/": иначе она ссылалась на русскую
  // как на основную и выпадала из индекса.
  const withLocale =
    locale === defaultLocale
      ? trimmed
      : `/${locale}${trimmed === "/" ? "" : trimmed}`;

  return `${siteUrl}${withLocale === "/" ? "/" : withLocale.replace(/\/+$/, "")}`;
};

export const buildVerificationMeta = (): Metadata["verification"] | undefined => {
  const google = process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION?.trim();
  const yandex =
    process.env.NEXT_PUBLIC_YANDEX_VERIFICATION?.trim() || "b4cc8b446f6874b6";

  const verification: Metadata["verification"] = {};
  if (google) verification.google = google;
  if (yandex) verification.yandex = yandex;

  return Object.keys(verification).length ? verification : undefined;
};
