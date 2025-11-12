import type { Metadata } from "next";
import Hero from "@/components/Hero";

/* ==================== SEO ==================== */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://onestack24.ru";

export const metadata: Metadata = {
  title: "OneStack — один стек, бесконечные возможности",
  description:
    "Демо-платформа OneStack: сайты, веб-приложение, мобильные клиенты.",
  alternates: { canonical: SITE_URL + "/" },
  openGraph: {
    title: "OneStack — один стек, бесконечные возможности",
    description:
      "Демо-платформа OneStack: сайты, веб-приложение, мобильные клиенты.",
    url: SITE_URL + "/",
    siteName: "OneStack",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "OneStack — демо",
      },
    ],
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OneStack — один стек, бесконечные возможности",
    description:
      "Демо-платформа OneStack: сайты, веб-приложение, мобильные клиенты.",
    images: ["/opengraph-image.png"],
  },
  robots: { index: true, follow: true },
};

/* ==================== PAGE ==================== */

export default function Page() {
  return <Hero />;
}