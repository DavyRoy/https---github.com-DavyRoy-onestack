// src/components/MobileFeatures.tsx
"use client";
import { serif } from "@/lib/fonts";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Smartphone, Bell, WifiOff, MapPin, Camera,
  CreditCard, BarChart3, Link as LinkIcon, RefreshCcw, Sparkles,
} from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

/* ─── Data ─────────────────────────────────────────────────────────────── */
type Feature = { icon: React.ElementType; titleRu: string; titleEn: string; teaserRu: string; teaserEn: string; badge: string; };

const FEATURES: Feature[] = [
  { icon: Smartphone,  badge: "Native",   titleRu: "Нативные модули",    titleEn: "Native modules",      teaserRu: "Камера, биометрия, датчики и файловая система с полным доступом к API устройства.", teaserEn: "Camera, biometrics, sensors and file system with full device API access." },
  { icon: Bell,        badge: "Push",     titleRu: "Push-уведомления",   titleEn: "Push notifications",  teaserRu: "Сегментация, deep-links, шаблоны и ретраи с аналитикой доставки.", teaserEn: "Segmentation, deep-links, templates and retries with delivery analytics." },
  { icon: WifiOff,     badge: "Offline",  titleRu: "Оффлайн-режим",     titleEn: "Offline mode",         teaserRu: "Кэш, очереди, статус соединения и фоновая синхронизация данных.", teaserEn: "Cache, queues, connection status and background data sync." },
  { icon: MapPin,      badge: "Geo",      titleRu: "Гео и карты",        titleEn: "Geo & maps",           teaserRu: "GPS, геофенсы, маршрутизация и offline-карты для полевых команд.", teaserEn: "GPS, geofences, routing and offline maps for field teams." },
  { icon: Camera,      badge: "Scan",     titleRu: "Сканирование",       titleEn: "Scanning",             teaserRu: "QR/штрих-коды, OCR и постобработка с машинным обучением.", teaserEn: "QR/barcodes, OCR and post-processing with machine learning." },
  { icon: CreditCard,  badge: "Payments", titleRu: "Оплата",             titleEn: "Payments",             teaserRu: "Apple/Google Pay, IAP, чеки и интеграция с платёжными системами.", teaserEn: "Apple/Google Pay, IAP, receipts and payment system integrations." },
  { icon: BarChart3,   badge: "Analytics",titleRu: "Аналитика и A/B",    titleEn: "Analytics & A/B",      teaserRu: "Firebase, Amplitude, отчёты и атрибуция с кастомными событиями.", teaserEn: "Firebase, Amplitude, reports and attribution with custom events." },
  { icon: LinkIcon,    badge: "Links",    titleRu: "Deep-links",         titleEn: "Deep-links",           teaserRu: "Универсальные ссылки и навигация с обработкой различных сценариев.", teaserEn: "Universal links and navigation with scenario handling." },
  { icon: RefreshCcw,  badge: "BG Sync",  titleRu: "Синхронизация",      titleEn: "Sync",                 teaserRu: "Tasks API, обновления и уведомления с конфликт-резолюцией.", teaserEn: "Tasks API, updates and notifications with conflict resolution." },
  { icon: Sparkles,    badge: "AI",       titleRu: "AI-ассистент",       titleEn: "AI assistant",         teaserRu: "Чат-бот в приложении, умный поиск, распознавание и персональные рекомендации.", teaserEn: "In-app chatbot, smart search, recognition and personal recommendations." },
];

/* ─── Component ─────────────────────────────────────────────────────────── */
export default function MobileFeatures() {
  const { locale } = useI18n();
  const isEn  = locale === "en";
  const reduced = useReducedMotion();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: isEn ? "Mobile app capabilities" : "Возможности мобильных приложений",
    itemListElement: FEATURES.map((f, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: isEn ? f.titleEn : f.titleRu,
      description: isEn ? f.teaserEn : f.teaserRu,
    })),
  };

  return (
    <section id="capabilities" className="site-types" aria-labelledby="features-title">
      <script id="ld-mobile-features" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="site-types__inner site-split">
        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="service-eyebrow">{isEn ? "03 / Capabilities" : "03 / Возможности"}</p>
          <h2 id="features-title" className={`${serif.className} site-types__title`}>
            {isEn ? <>What your app<br />can do</> : <>Что умеет<br />приложение</>}
          </h2>
          <p className="site-types__sub" style={{ marginTop: 24 }}>
            {isEn
              ? "Native device features, offline work and payments — we pick what your product actually needs."
              : "Функции устройства, работа без сети и оплаты — подключаем то, что действительно нужно продукту."}
          </p>
        </motion.div>

        <ul className="mod-list">
          {FEATURES.map(f => {
            const Icon = f.icon;
            return (
              <li key={f.badge} className="mod-item">
                <span className="mod-item__name"><Icon size={18} aria-hidden="true" />{isEn ? f.titleEn : f.titleRu}</span>
                <span className="mod-item__desc">{isEn ? f.teaserEn : f.teaserRu}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
