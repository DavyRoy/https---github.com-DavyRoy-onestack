import type { MetadataRoute } from "next";
import { canonical, siteUrl } from "@/app/seo.config";

export default function robots(): MetadataRoute.Robots {
  const host = siteUrl;

  return {
    rules: [
      {
        userAgent: "*",
        // Разрешаем только SEO-страницы
        allow: [
          "/",
          "/sites",
          "/webapp",
          "/mobile",
          "/privacy",
          "/terms",
        ],
        // Полностью запрещаем всё служебное
        disallow: [
          "/demo/",
          "/api/",
          "/metrics/",
          "/healthz",
          "/modal/",
          "/tg",
          "/test",   // тестовая страница, в выдаче ей не место
          "/crm",    // вход во внутреннюю CRM
        ],
      },
    ],
    sitemap: canonical("/sitemap.xml"),
    host,
  };
}
