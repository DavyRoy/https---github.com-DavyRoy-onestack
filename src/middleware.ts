import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale } from "./i18n/config";
import {
  buildPathWithLocale,
  canonicalLocalePath,
  cookieName,
  detectLocaleFromHeader,
  isPublicAsset,
  setLocaleCookieOptions,
  stripLocaleFromPath,
} from "./i18n/utils";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicAsset(pathname)) return NextResponse.next();

  const segments = pathname.split("/").filter(Boolean);
  const prefix = segments[0];
  const hasLocalePrefix = isLocale(prefix);

  const cookieLocale = request.cookies.get(cookieName)?.value;
  const headerLocale = detectLocaleFromHeader(request.headers.get("accept-language"));

  const locale = (hasLocalePrefix && prefix) || cookieLocale || headerLocale || defaultLocale;
  const safeLocale = isLocale(locale) ? locale : defaultLocale;

  // Requests with explicit locale prefix: rewrite to locale-less path but keep markers.
  if (hasLocalePrefix) {
    const localePath = stripLocaleFromPath(pathname);
    const url = new URL(localePath, request.url);

    const response = NextResponse.rewrite(url);
    response.headers.set("x-locale", safeLocale);
    response.headers.set(
      "x-pathname-with-locale",
      canonicalLocalePath(localePath, safeLocale),
    );
    response.cookies.set(cookieName, safeLocale, setLocaleCookieOptions);
    return response;
  }

  // No locale in path — keep default locale as-is, redirect others to /{locale}/path.
  const wantsLocale = safeLocale !== defaultLocale;
  const localizedPath = buildPathWithLocale(pathname, safeLocale);

  const response = wantsLocale
    ? NextResponse.redirect(new URL(localizedPath, request.url))
    : NextResponse.next();

  response.headers.set("x-locale", safeLocale);
  response.headers.set(
    "x-pathname-with-locale",
    wantsLocale ? canonicalLocalePath(pathname, safeLocale) : pathname || "/",
  );
  response.cookies.set(cookieName, safeLocale, setLocaleCookieOptions);

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|opengraph-image.png|public/|api/).*)",
  ],
};
