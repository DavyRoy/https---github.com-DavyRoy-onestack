// src/app/demo/user/layout.tsx
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Кабинет клиента · Демо",
  description: "Пользовательский дашборд: баланс, заказы, платежи и анализ.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function DemoUserLayout({ children }: { children: React.ReactNode }) {
  // ВАЖНО: не оборачиваем в DemoShell — он уже есть на уровне /demo/layout.tsx
  return children;
}