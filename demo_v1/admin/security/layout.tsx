import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Безопасность · Админ",
  description: "API-ключи, политики и аудит действий.",
  openGraph: {
    title: "Безопасность · Админ",
    description: "API-ключи, политики и аудит действий.",
    type: "website",
    siteName: "Demo Admin",
  },
  twitter: {
    card: "summary",
    title: "Безопасность · Админ",
    description: "API-ключи, политики и аудит действий.",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: false, // чтобы демо не индексировалось
    follow: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function SecurityLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col bg-black text-white">
      {children}
    </main>
  );
}