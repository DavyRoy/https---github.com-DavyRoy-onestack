"use client";

import { useEffect, useRef, useState } from "react";
import { siteUrl } from "@/app/seo.config";
import { useI18n } from "@/i18n/I18nProvider";

const CONSENT_COOKIE = "cookie_consent"; // "accepted" | "rejected"

/* =====================================================================================
   COOKIE HELPERS (SEO-safe)
===================================================================================== */

function getCookie(name: string) {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : "";
}

function setCookie(name: string, value: string, days = 180) {
  if (typeof document === "undefined") return;

  const d = new Date();
  d.setDate(d.getDate() + days);

  const isHttps =
    typeof location !== "undefined" && location.protocol === "https:";
  const secure = isHttps ? "; Secure" : "";

  // SEO best practice: SameSite=Lax (у тебя уже было) + корректный формат
  document.cookie = `${name}=${encodeURIComponent(
    value,
  )}; Path=/; SameSite=Lax; Expires=${d.toUTCString()}${secure}`;
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const acceptBtnRef = useRef<HTMLButtonElement | null>(null);
  const { t, localizePath, locale } = useI18n();

  /* =====================================================================================
       MOUNT — показываем только на клиенте
  ====================================================================================== */
  useEffect(() => {
    setMounted(true);
    const v = getCookie(CONSENT_COOKIE);
    if (!v) setVisible(true);
  }, []);

  /* =====================================================================================
       AUTOFOCUS
  ====================================================================================== */
  useEffect(() => {
    if (visible) acceptBtnRef.current?.focus();
  }, [visible]);

  if (!mounted || !visible) return null;

  /* =====================================================================================
      ACTIONS
  ====================================================================================== */

  const accept = () => {
    setCookie(CONSENT_COOKIE, "accepted");
    setVisible(false);

    // Inform analytics tools if present
    try {
      window.dispatchEvent(
        new CustomEvent("cookie-consent", { detail: { value: "accepted" } }),
      );

      // Google Consent Mode v2 (safe, optional)
      // Will only run if gtag exists
      // Does not break site
      (window as any).gtag?.("consent", "update", {
        ad_storage: "granted",
        analytics_storage: "granted",
      });
    } catch {}
  };

  const essentialOnly = () => {
    setCookie(CONSENT_COOKIE, "rejected");
    setVisible(false);

    try {
      localStorage.removeItem("onestack_calc");
      window.dispatchEvent(
        new CustomEvent("cookie-consent", { detail: { value: "rejected" } }),
      );

      // Google Consent Mode v2
      (window as any).gtag?.("consent", "update", {
        ad_storage: "denied",
        analytics_storage: "denied",
      });
    } catch {}
  };

  /* =====================================================================================
      RENDER
  ====================================================================================== */

  return (
    <>
      {/* ======================================================================
           SEO: Cookie Consent Schema.org
      ====================================================================== */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "PrivacyPolicy",
            name: "Cookie policy",
            url: `${siteUrl}/privacy`,
            description: t("cookie.description"),
          }),
        }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-live="polite"
        aria-labelledby="cookie-title"
        aria-describedby="cookie-desc"
        className="fixed inset-x-4 bottom-4 z-[1000] rounded-2xl border border-white/15 bg-black/85 backdrop-blur px-5 py-4 text-white shadow-[0_10px_40px_rgba(0,0,0,0.6)] animate-[fadeInUp_.2s_ease-out] will-change-transform"
      >
        <div id="cookie-title" className="sr-only">
          {t("cookie.title")}
        </div>

        <div id="cookie-desc" className="sr-only">
          {t("cookie.description")}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <p className="text-sm text-white/85">
            {t("cookie.description")} {locale === "ru" ? "Подробнее —" : "More details —"}{" "}
            <a
              href={localizePath("/privacy")}
              className="underline underline-offset-4 hover:text-white"
            >
              {t("cookie.privacy")}
            </a>
            .
          </p>

          <div className="sm:ml-auto flex gap-2">
            <button
              ref={acceptBtnRef}
              type="button"
            onClick={accept}
            className="rounded-full bg-white text-black px-4 py-2 text-sm font-semibold hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            {t("cookie.accept")}
          </button>

          <button
            type="button"
            onClick={essentialOnly}
            className="rounded-full border border-white/25 px-4 py-2 text-sm hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            {t("cookie.onlyNecessary")}
          </button>
        </div>
      </div>

        {/* Animation */}
        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(6px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </>
  );
}
