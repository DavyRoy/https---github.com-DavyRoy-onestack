// src/components/MobilePerfSecurity.tsx
"use client";
import { serif } from "@/lib/fonts";

import React, { memo, useMemo, useId, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Timer, Activity, Boxes, ShieldCheck, KeyRound, Database,
  GitBranch, Cpu, Smartphone, CloudCog, LockKeyhole,
} from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";


const BG   = "#07100e";
const TEAL  = "#2dd4bf";
const WHITE = "#f4faf8";

/* ─── Data ───────────────────────────────────────────────────────────────── */
type Metric = {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  teaser: string;
  badge: string;
  benefits: string[];
};

const PERFORMANCE_RU: Metric[] = [
  {
    icon: Timer,
    title: "Время старта",
    subtitle: "Cold start ≤ 2.0 s",
    teaser: "Оптимизируем загрузку модулей, шрифтов и иконок. Сплэш/скелетоны для быстрого «первого пикселя».",
    badge: "Cold Start",
    benefits: ["Lazy-модули", "Splash / скелетоны", "Asset-оптимизация"],
  },
  {
    icon: Activity,
    title: "Плавность",
    subtitle: "Jank ≤ 1%, 60+ fps",
    teaser: "Профилируем рендер, снижаем переработки, выносим тяжёлые операции в фон. Контролируем кадры.",
    badge: "Perf",
    benefits: ["Frame profiling", "Фоновые операции", "Контроль кадров"],
  },
  {
    icon: Smartphone,
    title: "Crash-free users",
    subtitle: "Crashlytics / Sentry",
    teaser: "Crashlytics/Sentry, алерты, автологи. Быстрые хотфиксы и ретроспектива инцидентов.",
    badge: "≥ 99.5%",
    benefits: ["Алерты", "Автологи", "Быстрые хотфиксы"],
  },
  {
    icon: Boxes,
    title: "Offline и кэш",
    subtitle: "RTDB + Cache",
    teaser: "Кэш данных (TTL/инвалидация), очереди синхронизации, ретраи и разрешение конфликтов.",
    badge: "Offline-first",
    benefits: ["TTL/инвалидация", "Sync-очереди", "Разрешение конфликтов"],
  },
  {
    icon: Cpu,
    title: "Размер бандла",
    subtitle: "≤ 25–40 MB",
    teaser: "Разделение по фичам, удаление дебага, оптимизация ассетов, lazy-модули и ProGuard.",
    badge: "Bundle",
    benefits: ["Feature splitting", "ProGuard", "Debug removal"],
  },
  {
    icon: CloudCog,
    title: "Обновления",
    subtitle: "OTA / CodePush",
    teaser: "Доставка апдейтов по OTA, фича-флаги, поэтапный rollout и откаты без публикации в стор.",
    badge: "Min. downtime",
    benefits: ["OTA delivery", "Feature-флаги", "Staged rollout"],
  },
];

const PERFORMANCE_EN: Metric[] = [
  {
    icon: Timer,
    title: "Cold start",
    subtitle: "Cold start ≤ 2.0 s",
    teaser: "Optimise module, font and icon loading. Splash/skeletons for a fast first pixel.",
    badge: "Cold Start",
    benefits: ["Lazy modules", "Splash / skeletons", "Asset optimisation"],
  },
  {
    icon: Activity,
    title: "Smoothness",
    subtitle: "Jank ≤ 1%, 60+ fps",
    teaser: "Profile render, reduce redraws and offload heavy work to background. Frame drop monitoring.",
    badge: "Perf",
    benefits: ["Frame profiling", "Background ops", "Frame control"],
  },
  {
    icon: Smartphone,
    title: "Crash-free users",
    subtitle: "Crashlytics / Sentry",
    teaser: "Crashlytics/Sentry, alerts, auto-logs. Fast hotfixes and incident retrospectives.",
    badge: "≥ 99.5%",
    benefits: ["Alerts", "Auto-logs", "Fast hotfixes"],
  },
  {
    icon: Boxes,
    title: "Offline & cache",
    subtitle: "RTDB + Cache",
    teaser: "Data cache (TTL/invalidation), sync queues, retries and conflict resolution.",
    badge: "Offline-first",
    benefits: ["TTL/invalidation", "Sync queues", "Conflict resolution"],
  },
  {
    icon: Cpu,
    title: "Bundle size",
    subtitle: "≤ 25–40 MB",
    teaser: "Feature splitting, debug removal, asset optimisation, lazy modules and ProGuard.",
    badge: "Bundle",
    benefits: ["Feature splitting", "ProGuard", "Debug removal"],
  },
  {
    icon: CloudCog,
    title: "Updates",
    subtitle: "OTA / CodePush",
    teaser: "OTA update delivery, feature flags, staged rollout and rollbacks without store re-submission.",
    badge: "Min. downtime",
    benefits: ["OTA delivery", "Feature flags", "Staged rollout"],
  },
];

const SECURITY_RU: Metric[] = [
  {
    icon: ShieldCheck,
    title: "OWASP MASVS",
    subtitle: "Runtime protection",
    teaser: "Модель угроз для мобилок: защита рантайма, анти-тампер, защита от подмены сертификата.",
    badge: "MASVS",
    benefits: ["Anti-tamper", "Runtime protection", "Cert pinning"],
  },
  {
    icon: LockKeyhole,
    title: "Хранение секретов",
    subtitle: "Keychain / Keystore",
    teaser: "Безопасное хранение токенов (Keychain/Keystore), Secure Enclave, биометрия.",
    badge: "Secure Enclave",
    benefits: ["Keychain/Keystore", "Биометрия", "Token protection"],
  },
  {
    icon: KeyRound,
    title: "Сетевые политики",
    subtitle: "TLS 1.2+, SSL-pinning",
    teaser: "TLS 1.2+, SSL-pinning, защита от MITM, ограничение небезопасных схем.",
    badge: "TLS 1.2+",
    benefits: ["SSL-pinning", "MITM protection", "Scheme restrictions"],
  },
  {
    icon: Database,
    title: "Данные и бэкапы",
    subtitle: "Шифрование, политика очистки",
    teaser: "Шифрование локального хранилища, безопасные бэкапы, политика авто-очистки.",
    badge: "Encryption",
    benefits: ["Local encryption", "Secure backups", "Auto-wipe"],
  },
  {
    icon: GitBranch,
    title: "CI/CD и подпись",
    subtitle: "Fastlane, supply-chain",
    teaser: "Безопасная подпись релизов, изоляция секретов, supply-chain проверки, fastlane.",
    badge: "Signing",
    benefits: ["Fastlane", "Secret isolation", "Supply-chain checks"],
  },
  {
    icon: Boxes,
    title: "Root / Jailbreak",
    subtitle: "Детект и защита",
    teaser: "Детект рута/джейлбрейка/дебага, защитные хуки, защита от инжекта и модификации.",
    badge: "Anti-cheat",
    benefits: ["Root detection", "Debug detection", "Injection guard"],
  },
];

const SECURITY_EN: Metric[] = [
  {
    icon: ShieldCheck,
    title: "OWASP MASVS",
    subtitle: "Runtime protection",
    teaser: "Mobile threat model: runtime protection, anti-tamper, certificate pinning.",
    badge: "MASVS",
    benefits: ["Anti-tamper", "Runtime protection", "Cert pinning"],
  },
  {
    icon: LockKeyhole,
    title: "Secrets storage",
    subtitle: "Keychain / Keystore",
    teaser: "Secure token storage (Keychain/Keystore), Secure Enclave, biometrics.",
    badge: "Secure Enclave",
    benefits: ["Keychain/Keystore", "Biometrics", "Token protection"],
  },
  {
    icon: KeyRound,
    title: "Network policies",
    subtitle: "TLS 1.2+, SSL pinning",
    teaser: "TLS 1.2+, SSL pinning, MITM protection, insecure scheme restrictions.",
    badge: "TLS 1.2+",
    benefits: ["SSL pinning", "MITM protection", "Scheme restrictions"],
  },
  {
    icon: Database,
    title: "Data & backups",
    subtitle: "Encryption, auto-wipe",
    teaser: "Local storage encryption, secure backups and auto-wipe policy.",
    badge: "Encryption",
    benefits: ["Local encryption", "Secure backups", "Auto-wipe"],
  },
  {
    icon: GitBranch,
    title: "CI/CD & signing",
    subtitle: "Fastlane, supply-chain",
    teaser: "Secure release signing, secret isolation, supply-chain checks, fastlane.",
    badge: "Signing",
    benefits: ["Fastlane", "Secret isolation", "Supply-chain checks"],
  },
  {
    icon: Boxes,
    title: "Root / Jailbreak",
    subtitle: "Detection & hooks",
    teaser: "Root/jailbreak/debug detection, protection hooks, injection and APK/IPA modification guards.",
    badge: "Anti-cheat",
    benefits: ["Root detection", "Debug detection", "Injection guard"],
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════════════════════════════════ */
export default function MobilePerfSecurity() {
  const { locale } = useI18n();
  const isEn = locale === "en";
  const PERFORMANCE = isEn ? PERFORMANCE_EN : PERFORMANCE_RU;
  const SECURITY    = isEn ? SECURITY_EN    : SECURITY_RU;
  const reduced = useReducedMotion();
  const titleId = useId();

  const jsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: isEn ? "Mobile app performance & security — OneStack" : "Производительность и безопасность мобильных приложений — OneStack",
    numberOfItems: PERFORMANCE.length + SECURITY.length,
    itemListElement: [
      ...PERFORMANCE.map((m, i) => ({ "@type": "ListItem", position: i + 1,
        item: { "@type": "Service", name: m.title, description: m.teaser, category: "Performance" } })),
      ...SECURITY.map((m, i) => ({ "@type": "ListItem", position: PERFORMANCE.length + i + 1,
        item: { "@type": "Service", name: m.title, description: m.teaser, category: "Security" } })),
    ],
  }), [isEn]);

  const fadeUp = (d = 0) => reduced ? {} : {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: d },
  };

  return (
    <>
      <script id="ld-mobile-perf" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section
        id="perf-security"
        className="relative overflow-hidden pt-16 sm:pt-20 pb-20 sm:pb-28"
        aria-labelledby={titleId}
        style={{ background: BG }}
      >
        {/* Ambient glow */}
        <motion.div
          className="pointer-events-none absolute -top-40 -right-40 rounded-full blur-[180px]"
          style={{ width: 560, height: 560, background: TEAL, opacity: 0.07 }}
          animate={reduced ? undefined : { scale: [1, 1.1, 1], opacity: [0.07, 0.11, 0.07] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-14">

          {/* ── Header ── */}
          <motion.div className="mb-16 sm:mb-20" {...(fadeUp(0) as object)}>
            <div className="flex items-center gap-3 mb-6">
              <div style={{ height: 2, width: 20, background: TEAL, borderRadius: 2, flexShrink: 0 }} />
              <span className="text-[11px] tracking-[0.22em] uppercase font-medium" style={{ color: TEAL }}>
                {isEn ? "Performance & security" : "Производительность и безопасность"}
              </span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <h2
                id={titleId}
                className={`${serif.className} font-normal tracking-[-0.04em]`}
                style={{ lineHeight: 0.9 }}
              >
                <span className="block" style={{ fontSize: "clamp(2.6rem, 6vw, 6rem)", color: TEAL }}>
                  {isEn ? "Fast, stable" : "Быстрые, стабильные"}
                </span>
                <span className="block" style={{ fontSize: "clamp(2.6rem, 6vw, 6rem)", color: WHITE }}>
                  {isEn ? "and protected" : "и защищённые"}
                </span>
              </h2>

              <p className="text-sm sm:text-base leading-relaxed max-w-sm lg:text-right"
                style={{ color: "rgba(244,250,248,0.45)" }}>
                {isEn
                  ? "Offline-first architecture, startup and smoothness optimisation, MASVS practices, secure secret storage and network policies."
                  : "Проектируем offline-first, оптимизируем старт и плавность, внедряем MASVS-практики, безопасное хранение секретов и сетевые политики."}
              </p>
            </div>
          </motion.div>

          {/* ── Performance ── */}
          <motion.div className="mb-14" {...(fadeUp(0.1) as object)}>
            <SubLabel icon={<Activity className="h-3.5 w-3.5" />} label={isEn ? "Performance" : "Производительность"} />
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
              {PERFORMANCE.map((m, i) => (
                <MetricCard key={m.title} metric={m} index={i} reduced={!!reduced} />
              ))}
            </div>
          </motion.div>

          {/* ── Security ── */}
          <motion.div {...(fadeUp(0.2) as object)}>
            <SubLabel icon={<ShieldCheck className="h-3.5 w-3.5" />} label={isEn ? "Security & reliability" : "Безопасность и надёжность"} />
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
              {SECURITY.map((m, i) => (
                <MetricCard key={m.title} metric={m} index={i} reduced={!!reduced} />
              ))}
            </div>
          </motion.div>

        </div>
      </section>
    </>
  );
}

/* ─── SubLabel ───────────────────────────────────────────────────────────── */
function SubLabel({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-1">
      <span style={{ color: TEAL }}>{icon}</span>
      <span className="text-xs font-semibold uppercase tracking-[0.15em]"
        style={{ color: "rgba(244,250,248,0.4)" }}>{label}</span>
      <div className="flex-1 h-px ml-2" style={{ background: "rgba(255,255,255,0.06)" }} />
    </div>
  );
}

/* ─── MetricCard ─────────────────────────────────────────────────────────── */
const MetricCard = memo(function MetricCard({
  metric, index, reduced,
}: { metric: Metric; index: number; reduced: boolean }) {
  const Icon = metric.icon;
  const [hovered, setHovered] = useState(false);

  const anim = reduced ? {} : {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.04 * index },
    whileHover: { y: -4 },
  };

  return (
    <motion.article
      {...(anim as object)}
      className="group relative flex flex-col rounded-2xl overflow-hidden"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Hover border glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ border: `1px solid ${TEAL}50`, boxShadow: `inset 0 0 24px ${TEAL}08` }}
        aria-hidden
      />

      <div className="relative z-10 flex flex-col h-full p-6">
        {/* Icon + badge */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200"
            style={{
              background: hovered ? `${TEAL}18` : "rgba(255,255,255,0.05)",
              border: `1px solid ${hovered ? TEAL + "40" : "rgba(255,255,255,0.08)"}`,
            }}>
            <Icon className="h-[18px] w-[18px] transition-colors duration-200"
              style={{ color: hovered ? TEAL : "rgba(244,250,248,0.5)" }} aria-hidden />
          </div>
          <span className="text-[10px] font-semibold tracking-[0.12em] uppercase px-2.5 py-1 rounded-full transition-all duration-200"
            style={hovered
              ? { background: `${TEAL}18`, border: `1px solid ${TEAL}40`, color: TEAL }
              : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(244,250,248,0.3)" }
            }>
            {metric.badge}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-semibold mb-1 transition-colors duration-200"
          style={{ color: hovered ? WHITE : "rgba(244,250,248,0.85)" }}>
          {metric.title}
        </h3>

        {/* Subtitle */}
        <p className="text-xs mb-3" style={{ color: "rgba(244,250,248,0.35)" }}>
          {metric.subtitle}
        </p>

        {/* Teaser */}
        <p className="text-sm leading-relaxed flex-1 mb-4" style={{ color: "rgba(244,250,248,0.45)" }}>
          {metric.teaser}
        </p>

        {/* Benefits chips */}
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {metric.benefits.map(b => (
            <span key={b} className="text-[10px] px-2 py-0.5 rounded-full transition-all duration-200"
              style={hovered
                ? { background: `${TEAL}12`, border: `1px solid ${TEAL}25`, color: TEAL }
                : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(244,250,248,0.35)" }
              }>
              {b}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
});
