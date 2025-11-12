import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://onestack24.ru";
  const now = new Date().toISOString();

  const routes = [
    "/",          // главная
    "/home",      // экран intro/детали
    "/sites",     // лендинги/сайты
    "/webapp",    // веб-приложения
    "/mobile",    // мобильные приложения
    "/privacy",   // политика конфиденциальности
    "/terms",     // пользовательское соглашение
  ];

  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1.0 : 0.8,
  }));
}