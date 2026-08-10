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
          "/home",
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
        ],
      },
    ],
    sitemap: canonical("/sitemap.xml"),
    host,
  };
}
