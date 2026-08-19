// src/components/MobileFeatures.tsx
"use client";
import { serif } from "@/lib/fonts";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Smartphone, Bell, WifiOff, MapPin, Camera,
  CreditCard, BarChart3, Link as LinkIcon, RefreshCcw,
} from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";


const BG   = "#07100e";
const TEAL = "#2dd4bf";
const WHITE = "#f4faf8";

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
];

/* ─── Component ─────────────────────────────────────────────────────────── */
export default function MobileFeatures() {
  const { locale } = useI18n();
  const isEn  = locale === "en";
  const reduced = useReducedMotion();

  const fadeUp = (d = 0) => reduced ? {} : {
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: d },
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Возможности мобильных приложений",
    itemListElement: FEATURES.map((f, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: f.titleRu,
      description: f.teaserRu,
    })),
  };

  return (
    <section
      id="capabilities"
      className="relative overflow-hidden pt-16 sm:pt-20 pb-20 sm:pb-28"
      aria-labelledby="features-title"
      style={{ background: BG }}
    >
      {/* Ambient glow bottom-left */}
      <div
        className="pointer-events-none absolute -bottom-40 -left-40 rounded-full blur-[160px]"
        style={{ width: 500, height: 500, background: TEAL, opacity: 0.06 }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-14">

        {/* Header */}
        <motion.div className="mb-16 sm:mb-20" {...(fadeUp(0) as object)}>
          <div className="flex items-center gap-3 mb-6">
            <div style={{ height: 2, width: 20, background: TEAL, borderRadius: 2, flexShrink: 0 }} />
            <span className="text-[11px] tracking-[0.22em] uppercase font-medium" style={{ color: TEAL }}>
              {isEn ? "Capabilities" : "Возможности"}
            </span>
          </div>

          <h2
            id="features-title"
            className={`${serif.className} font-normal tracking-[-0.04em] mb-5`}
            style={{ lineHeight: 0.9 }}
          >
            <span className="block" style={{ fontSize: "clamp(2.6rem, 6vw, 6rem)", color: TEAL }}>
              {isEn ? "Everything" : "Всё, что нужно"}
            </span>
            <span className="block" style={{ fontSize: "clamp(2.6rem, 6vw, 6rem)", color: WHITE }}>
              {isEn ? "your app needs" : "приложению"}
            </span>
          </h2>

          <p className="text-sm sm:text-base leading-relaxed max-w-xl" style={{ color: "rgba(244,250,248,0.45)" }}>
            {isEn
              ? "Native modules, offline mode, maps, analytics and sync — all out of the box, without unnecessary complexity."
              : "Нативные модули, оффлайн-режим, карты, аналитика и синхронизация — всё из коробки, без лишней сложности."}
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.badge} feature={f} delay={0.05 * i} reduced={!!reduced} isEn={isEn} />
          ))}
        </div>
      </div>

      <script
        id="ld-mobile-features"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}

/* ─── Card ──────────────────────────────────────────────────────────────── */
function FeatureCard({ feature, delay, reduced, isEn }: { feature: Feature; delay: number; reduced: boolean; isEn: boolean; }) {
  const Icon = feature.icon;
  const anim = reduced ? {} : {
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
  };

  return (
    <motion.div
      {...(anim as object)}
      className="group relative flex items-start gap-4 rounded-2xl p-5 sm:p-6"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
      whileHover={reduced ? undefined : { y: -3 }}
      transition={{ duration: 0.22 }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ border: `1px solid ${TEAL}40`, boxShadow: `inset 0 0 20px ${TEAL}06` }}
        aria-hidden
      />

      {/* Icon */}
      <div
        className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-300"
        style={{ background: `${TEAL}12`, border: `1px solid ${TEAL}25` }}
      >
        <Icon className="h-5 w-5 transition-colors duration-300 group-hover:text-[#2dd4bf]" style={{ color: "rgba(244,250,248,0.5)" }} aria-hidden />
      </div>

      {/* Text */}
      <div className="relative z-10 min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="text-base font-semibold transition-colors duration-200 group-hover:text-[#2dd4bf]" style={{ color: WHITE }}>
            {isEn ? feature.titleEn : feature.titleRu}
          </h3>
          <span
            className="shrink-0 text-[10px] font-semibold tracking-[0.12em] uppercase px-2 py-0.5 rounded-full"
            style={{ background: `${TEAL}15`, color: TEAL, border: `1px solid ${TEAL}28` }}
          >
            {feature.badge}
          </span>
        </div>
        <p className="text-xs sm:text-sm leading-relaxed" style={{ color: "rgba(244,250,248,0.4)" }}>
          {isEn ? feature.teaserEn : feature.teaserRu}
        </p>
      </div>
    </motion.div>
  );
}
