"use client";

import React, { createContext, useContext, useMemo, useState, useCallback } from "react";
import { defaultLocale, type Locale } from "./config";
import type { Messages } from "./messages";
import { messages as allMessages } from "./messages";
import { buildPathWithLocale, cookieName, ensureLeadingSlash, stripLocaleFromPath } from "./utils";

// Recursive type that produces all dot-notation leaf paths from a Messages object.
// Array leaves are excluded — access them directly via `messages`.
type Leaves<T, P extends string = ""> = T extends string
  ? P
  : T extends ReadonlyArray<infer _> | Array<infer _>
  ? never
  : {
      [K in keyof T & string]: Leaves<T[K], P extends "" ? K : `${P}.${K}`>;
    }[keyof T & string];

export type MessageKey = Leaves<Messages>;

type I18nContextValue = {
  locale: Locale;
  defaultLocale: Locale;
  messages: Messages;
  pathWithLocale: string;
  /** Type-safe translator. Supports {variable} interpolation via params. */
  t: (key: MessageKey, params?: Record<string, string | number>) => string;
  localizePath: (path: string, localeOverride?: Locale) => string;
  switchLocalePath: (target: Locale) => string;
  /** Switch locale without page reload. Saves & restores scroll position. */
  changeLocale: (target: Locale) => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function getFromObject(obj: Record<string, unknown>, key: string): string | null {
  const parts = key.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current && typeof current === "object" && part in (current as object)) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return null;
    }
  }
  return typeof current === "string" ? current : null;
}

export function I18nProvider({
  locale: initialLocale,
  messages: _initialMessages,
  pathWithLocale,
  children,
}: {
  locale: Locale;
  messages: Messages;
  pathWithLocale: string;
  children: React.ReactNode;
}) {
  // Client-side locale state — starts from server-detected locale
  const [locale, setLocale] = useState<Locale>(initialLocale);

  const changeLocale = useCallback((target: Locale) => {
    if (target === locale) return;
    // Persist choice
    document.cookie = `${cookieName}=${target}; path=/; max-age=31536000; SameSite=Lax`;
    // Switch without scroll jump
    setLocale(target);
  }, [locale]);

  const value = useMemo<I18nContextValue>(() => {
    const msgs = allMessages[locale] ?? allMessages[defaultLocale];

    const t = (key: MessageKey, params?: Record<string, string | number>): string => {
      const raw = getFromObject(msgs as unknown as Record<string, unknown>, key as string) ?? (key as string);
      if (!params) return raw;
      return raw.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? `{${k}}`));
    };

    const localizePath = (path: string, localeOverride?: Locale) => {
      const targetLocale = localeOverride ?? locale;
      const stripped = stripLocaleFromPath(ensureLeadingSlash(path));
      return buildPathWithLocale(stripped, targetLocale);
    };

    const switchLocalePath = (target: Locale) => {
      const withoutLocale = stripLocaleFromPath(pathWithLocale || "/");
      return buildPathWithLocale(withoutLocale, target);
    };

    return { locale, defaultLocale, messages: msgs, pathWithLocale, t, localizePath, switchLocalePath, changeLocale };
  }, [locale, pathWithLocale, changeLocale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = (): I18nContextValue => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
};

export const useTranslations = () => useI18n().t;
export const useLocale = () => {
  const ctx = useI18n();
  return { locale: ctx.locale, defaultLocale: ctx.defaultLocale };
};
