"use client";

import { useEffect, useRef, useState } from "react";

const CONSENT_COOKIE = "cookie_consent"; // "accepted" | "rejected"

function getCookie(name: string) {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : "";
}

function setCookie(name: string, value: string, days = 180) {
  if (typeof document === "undefined") return;
  const d = new Date();
  d.setDate(d.getDate() + days);

  const isHttps = typeof location !== "undefined" && location.protocol === "https:";
  const secure = isHttps ? "; secure" : "";

  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; samesite=lax; expires=${d.toUTCString()}${secure}`;
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const acceptBtnRef = useRef<HTMLButtonElement | null>(null);

  // показываем только на клиенте, если согласия ещё нет
  useEffect(() => {
    setMounted(true);
    const v = getCookie(CONSENT_COOKIE);
    if (!v) setVisible(true);
  }, []);

  // автофокус на первой CTA-кнопке
  useEffect(() => {
    if (visible) acceptBtnRef.current?.focus();
  }, [visible]);

  if (!mounted || !visible) return null;

  const accept = () => {
    setCookie(CONSENT_COOKIE, "accepted");
    setVisible(false);
    try {
      window.dispatchEvent(new CustomEvent("cookie-consent", { detail: { value: "accepted" } }));
    } catch {}
  };

  const essentialOnly = () => {
    setCookie(CONSENT_COOKIE, "rejected");
    setVisible(false);
    try {
      // минимальная «чистка» локального состояния
      localStorage.removeItem("onestack_calc");
      window.dispatchEvent(new CustomEvent("cookie-consent", { detail: { value: "rejected" } }));
    } catch {}
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-live="polite"
      aria-label="Настройки файлов cookie"
      className="fixed inset-x-4 bottom-4 z-[1000] rounded-2xl border border-white/15 bg-black/85 backdrop-blur px-5 py-4 text-white shadow-[0_10px_40px_rgba(0,0,0,0.6)] animate-[fadeInUp_.2s_ease-out] will-change-transform"
    >
      <div id="cookie-desc" className="sr-only">
        Этот сайт использует технические cookie и локальное хранилище. Выберите действие ниже.
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <p className="text-sm text-white/85">
          Мы используем технические cookies и локальное хранилище для работы сайта и сохранения
          настроек (например, параметров калькулятора). Подробнее —{" "}
          <a href="/privacy" className="underline underline-offset-4 hover:text-white">Политика конфиденциальности</a>.
        </p>

        <div className="sm:ml-auto flex gap-2">
          <button
            ref={acceptBtnRef}
            onClick={accept}
            className="rounded-full bg-white text-black px-4 py-2 text-sm font-semibold hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            Принять
          </button>
          <button
            onClick={essentialOnly}
            className="rounded-full border border-white/25 px-4 py-2 text-sm hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            Только необходимые
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}