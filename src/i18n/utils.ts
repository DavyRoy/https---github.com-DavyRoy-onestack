import type { Locale } from "./config";
import { defaultLocale, isLocale, locales } from "./config";

const PUBLIC_FILE = /\.(.*)$/;

export const isPublicAsset = (pathname: string) =>
  PUBLIC_FILE.test(pathname) ||
  pathname.startsWith("/_next") ||
  pathname.startsWith("/api") ||
  pathname.startsWith("/opengraph-image") ||
  pathname.startsWith("/sitemap") ||
  pathname.startsWith("/robots");

export function detectLocaleFromHeader(header: string | null): Locale | null {
  if (!header) return null;

  const languages = header.split(",").map((l) => l.trim().toLowerCase());
  for (const lang of languages) {
    if (isLocale(lang.slice(0, 2))) return lang.slice(0, 2) as Locale;
  }
  return null;
}

export const stripLocaleFromPath = (pathname: string): string => {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length && isLocale(segments[0])) {
    const rest = segments.slice(1).join("/");
    return rest ? `/${rest}` : "/";
  }
  return pathname || "/";
};

export const buildPathWithLocale = (pathname: string, locale: Locale): string => {
  const cleanPath = pathname ? `/${pathname.replace(/^\/+/, "")}` : "/";
  if (locale === defaultLocale) return cleanPath === "/" ? "/" : cleanPath.replace(/\/+$/, "");
  const normalized = cleanPath === "/" ? "" : cleanPath.replace(/\/+$/, "");
  return `/${locale}${normalized || "/"}`.replace(/\/+$/, "");
};

export const ensureLeadingSlash = (path: string): string =>
  path.startsWith("/") ? path : `/${path}`;

export const canonicalLocalePath = (pathname: string, locale: Locale): string => {
  const withoutLocale = stripLocaleFromPath(pathname);
  return buildPathWithLocale(withoutLocale, locale);
};

export const cookieName = "NEXT_LOCALE";

export const setLocaleCookieOptions = {
  path: "/",
  maxAge: 60 * 60 * 24 * 180, // 180 days
} as const;
