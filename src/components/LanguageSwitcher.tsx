// src/components/LanguageSwitcher.tsx
"use client";

import { locales, localeTitles } from "@/i18n/config";
import { useI18n } from "@/i18n/I18nProvider";

type Props = {
  compact?: boolean;
  className?: string;
};

export default function LanguageSwitcher({ compact = false, className }: Props) {
  const { locale, changeLocale } = useI18n();
  const ariaLabel = locale === "ru" ? "Сменить язык" : "Language switcher";

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-1 py-1 text-sm text-white/80 ${
        className ?? ""
      }`}
      aria-label={ariaLabel}
    >
      {locales.map((loc) => {
        const active = loc === locale;
        return (
          <button
            key={loc}
            type="button"
            onClick={() => changeLocale(loc)}
            className={`rounded-full px-3 py-1 transition text-xs sm:text-sm ${
              active ? "bg-white text-black font-semibold shadow-sm" : "hover:bg-white/10"
            }`}
            aria-pressed={active}
          >
            {compact ? loc.toUpperCase() : localeTitles[loc]}
          </button>
        );
      })}
    </div>
  );
}
