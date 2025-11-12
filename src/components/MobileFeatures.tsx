"use client";

import React from "react";
import Script from "next/script";
import { motion, useReducedMotion } from "framer-motion";
import {
  Smartphone,
  Bell,
  WifiOff,
  MapPin,
  Camera,
  CreditCard,
  BarChart3,
  Link as LinkIcon,
  RefreshCcw,
} from "lucide-react";

/* ============================ Types & Data ============================ */
type Feature = {
  icon: React.ElementType;
  title: string;
  teaser: string;
  badge?: string;
};

const FEATURES: Feature[] = [
  { icon: Smartphone, title: "Нативные модули", teaser: "Камера, биометрия, датчики и файловая система.", badge: "Native" },
  { icon: Bell, title: "Push-уведомления", teaser: "Сегментация, deep-links, шаблоны и ретраи.", badge: "Push" },
  { icon: WifiOff, title: "Оффлайн-режим", teaser: "Кэш, очереди, статус соединения.", badge: "Offline" },
  { icon: MapPin, title: "Гео и карты", teaser: "GPS, геофенсы, маршрутизация.", badge: "Geo" },
  { icon: Camera, title: "Сканирование", teaser: "QR/штрих-коды, OCR и постобработка.", badge: "Scan" },
  { icon: CreditCard, title: "Оплата", teaser: "Apple/Google Pay, IAP, чеки.", badge: "Payments" },
  { icon: BarChart3, title: "Аналитика и A/B", teaser: "Firebase, Amplitude, отчёты и атрибуция.", badge: "Analytics" },
  { icon: LinkIcon, title: "Deep-links", teaser: "Универсальные ссылки и навигация.", badge: "Links" },
  { icon: RefreshCcw, title: "Синхронизация", teaser: "Tasks API, обновления и уведомления.", badge: "BG Sync" },
];

/* ============================ Main Block ============================ */
export default function MobileFeatures() {
  const reduce = useReducedMotion();

  const fade = (d = 0) =>
    reduce ? {} : {
      initial: { opacity: 0, y: 16 },
      whileInView: { opacity: 1, y: 0 },
      transition: { duration: 0.5, ease: "easeOut", delay: d },
      viewport: { once: true, amount: 0.2 },
    };

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://onestack24.ru";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Мобильные возможности OneStack",
    url: `${SITE_URL}/mobile#capabilities`,
    itemListElement: FEATURES.map((f, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: f.title,
        description: f.teaser,
        provider: { "@type": "Organization", name: "OneStack", url: SITE_URL },
      },
    })),
  };

  return (
    <section
      id="capabilities"
      className="relative flex items-center overflow-hidden bg-black text-white min-h-[100dvh] pt-[64px] md:pt-[72px]"
      aria-labelledby="mobile-features-title"
      role="region"
    >
      <Script id="ld-mobile-features" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* glow */}
      <div aria-hidden className="pointer-events-none absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-white/[0.035] blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-40 -right-40 h-[420px] w-[420px] rounded-full bg-white/[0.035] blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-12 lg:px-20">
        <motion.p {...fade(0)} className="text-sm uppercase tracking-[0.25em] text-white/50">
          возможности
        </motion.p>

        <motion.h2
          id="mobile-features-title"
          {...fade(0.05)}
          className="mt-2 text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight"
        >
          Всё, что нужно мобильному продукту
        </motion.h2>

        <motion.p {...fade(0.1)} className="mt-3 text-lg text-white/70 max-w-3xl">
          Нативные модули, оффлайн, карты, аналитика и синхронизация — всё из коробки, без лишней сложности.
        </motion.p>

        <ul
          className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          aria-label="Функции мобильных приложений"
        >
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.title} feature={f} index={i} fade={fade} />
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ============================ Card ============================ */
function FeatureCard({ feature, index, fade }: { feature: Feature; index: number; fade: (d?: number) => any }) {
  const Icon = feature.icon;
  return (
    <motion.li
      {...fade(0.06 + index * 0.04)}
      className="group relative overflow-hidden rounded-2xl border border-white/10
                 bg-gradient-to-br from-white/[0.05] to-white/[0.02]
                 hover:bg-white/[0.06] hover:shadow-[0_14px_40px_rgba(255,255,255,0.06)]
                 transition"
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.08] text-white">
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              {feature.badge && (
                <span className="rounded-full border border-white/15 bg-white/[0.06] px-2 py-0.5 text-[11px] leading-5 text-white/85">
                  {feature.badge}
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-white/75">{feature.teaser}</p>
          </div>
        </div>
      </div>
      <span
        aria-hidden
        className="pointer-events-none absolute left-6 right-6 -bottom-[1px] h-[2px] bg-gradient-to-r from-white/0 via-white/35 to-white/0"
      />
    </motion.li>
  );
}