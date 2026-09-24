import type { MetadataRoute } from "next";
import { canonical, siteUrl } from "@/app/seo.config";

export default function robots(): MetadataRoute.Robots {
  const host = siteUrl;

  // Одни и те же правила для всех: и поисковые роботы, и ИИ-ассистенты
  // видят страницы услуг и не заходят в служебные разделы.
  const allow = ["/", "/sites", "/webapp", "/mobile", "/ai", "/privacy", "/terms", "/llms.txt"];
  const disallow = ["/api/", "/metrics/", "/healthz", "/modal/", "/tg", "/crm"];

  // Роботы ИИ-сервисов (ChatGPT, Claude, Perplexity, Gemini, Apple, Яндекс).
  // Перечисляем явно: часть из них по умолчанию осторожничает, если не
  // видит своего имени, а нам нужно, чтобы компания попадала в их ответы.
  const aiBots = [
    "GPTBot", "OAI-SearchBot", "ChatGPT-User",
    "ClaudeBot", "Claude-SearchBot", "Claude-User",
    "PerplexityBot", "Perplexity-User",
    "Google-Extended", "Applebot-Extended",
    "YandexBot", "YandexAdditional",
  ];

  return {
    rules: [
      { userAgent: "*", allow, disallow },
      { userAgent: aiBots, allow, disallow },
    ],
    sitemap: canonical("/sitemap.xml"),
    host,
  };
}
