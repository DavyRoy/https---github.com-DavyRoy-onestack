import { headers } from "next/headers";
import { defaultLocale, isLocale, locales, localeCodes } from "./config";
import { messages, type Messages } from "./messages";
import { canonicalLocalePath, stripLocaleFromPath } from "./utils";
import type { Locale } from "./config";
import { canonical, siteUrl } from "@/app/seo.config";

// Next.js 15: headers() is async — use cache() to call it once per request
import { cache } from "react";

const getHeaders = cache(async () => {
  return await headers();
});

export async function getRequestLocale(): Promise<Locale> {
  const h = await getHeaders();
  const locale = h.get("x-locale");
  return isLocale(locale) ? locale : defaultLocale;
}

export async function getPathWithLocaleHeader(): Promise<string> {
  const h = await getHeaders();
  const withLocale = h.get("x-pathname-with-locale");
  if (withLocale) return withLocale;
  const path = h.get("x-invoke-path") || "/";
  return path.startsWith("/") ? path : `/${path}`;
}

export function getMessages(locale: Locale): Messages {
  return messages[locale] ?? messages[defaultLocale];
}

export function buildCanonical(pathname: string, locale: Locale) {
  const normalized = stripLocaleFromPath(pathname);
  return canonical(normalized, locale);
}

export function buildLanguageAlternates(pathname: string) {
  const normalized = stripLocaleFromPath(pathname);
  return Object.fromEntries(
    locales.map((loc) => [localeCodes[loc], canonical(normalized, loc)]),
  );
}

export function buildOpenGraphLocale(locale: Locale) {
  return locale === "ru" ? "ru_RU" : "en_US";
}

export function buildHrefLang(locale: Locale, pathname: string) {
  const path = canonicalLocalePath(pathname, locale);
  return `${siteUrl}${path}`;
}
