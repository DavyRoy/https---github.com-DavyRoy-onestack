export const locales = ["ru", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ru";

export const localeTitles: Record<Locale, string> = {
  ru: "Русский",
  en: "English",
};

export const localeCodes: Record<Locale, string> = {
  ru: "ru-RU",
  en: "en-US",
};

export function isLocale(value: string | null | undefined): value is Locale {
  return Boolean(value && (locales as readonly string[]).includes(value));
}
