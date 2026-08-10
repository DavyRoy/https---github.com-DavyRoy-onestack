import type { Metadata } from "next";
import { defaultLocale, type Locale } from "@/i18n/config";

const DEFAULT_SITE_URL = "https://onestack24.ru";

const rawSiteUrl = (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).trim();

// Базовый URL сайта без хвостовых слэшей, чтобы избежать дублей в каноникал/OG
export const siteUrl = rawSiteUrl.replace(/\/+$/, "");

export const siteName = "OneStack";

export const siteDescription =
  "OneStack — технологический партнёр для бизнеса любого масштаба. Разрабатываем сайты, веб-сервисы и мобильные приложения. 150+ проектов, 5 лет на рынке, фиксированные сроки.";

export const canonical = (path = "/", locale: Locale = defaultLocale): string => {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const trimmed = normalized === "/" ? "/" : normalized.replace(/\/+$/, "");
  const withLocale =
    locale === defaultLocale || trimmed === "/"
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
