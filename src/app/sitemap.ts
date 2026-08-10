export const dynamic = "force-dynamic";

import type { MetadataRoute } from "next";
import { canonical } from "@/app/seo.config";

export default function sitemap(): MetadataRoute.Sitemap {
  // Фиксируем lastmod на актуальную дату, чтобы не уезжать в будущее
  const lastModified = "2026-07-06T00:00:00Z";

  const routes = [
    { path: "/", changeFrequency: "weekly" as const, priority: 1 },
    { path: "/sites", changeFrequency: "monthly" as const, priority: 0.9 },
    { path: "/webapp", changeFrequency: "monthly" as const, priority: 0.9 },
    { path: "/mobile", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/privacy", changeFrequency: "yearly" as const, priority: 0.3 },
    { path: "/terms", changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  return routes.map((route) => ({
    url: canonical(route.path),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
