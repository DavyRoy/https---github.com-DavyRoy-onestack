// src/app/tg/layout.tsx
// Telegram Mini App layout — no navbar/footer, mobile-first, dark OneStack theme
import type { Metadata, Viewport } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "OneStack — Разработка под ключ",
  description: "Сайты, веб-приложения и мобильные приложения. Оставьте заявку прямо в Telegram.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#07100e",
};

export default function TgLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Telegram Web App SDK */}
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        strategy="beforeInteractive"
      />
      <div
        style={{
          minHeight: "100dvh",
          background: "#07100e",
          color: "#f4faf8",
          fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
          overscrollBehavior: "none",
        }}
      >
        {children}
      </div>
    </>
  );
}
