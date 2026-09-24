// src/components/MobilePerfSecurity.tsx
"use client";
import { serif } from "@/lib/fonts";

import React, { useMemo, useId } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Timer, Activity, Boxes, ShieldCheck, KeyRound, Database,
  GitBranch, Cpu, Smartphone, CloudCog, LockKeyhole,
} from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";



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

  const groups = [
    { key: "perf", label: isEn ? "Performance" : "Производительность", items: PERFORMANCE },
    { key: "sec",  label: isEn ? "Security & reliability" : "Безопасность и надёжность", items: SECURITY },
  ];

  return (
    <>
      <script id="ld-mobile-perf" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section id="perf-security" className="site-types" aria-labelledby={titleId}>
        <div className="site-types__inner">
          <motion.div
            className="site-types__head"
            initial={reduced ? undefined : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div>
              <p className="service-eyebrow">{isEn ? "04 / Speed & safety" : "04 / Скорость и защита"}</p>
              <h2 id={titleId} className={`${serif.className} site-types__title`}>
                {isEn ? <>Fast, stable<br />and protected</> : <>Быстрые, стабильные<br />и защищённые</>}
              </h2>
            </div>
            <p className="site-types__sub">
              {isEn
                ? "Offline-first architecture, fast start-up, MASVS practices and secure secret storage."
                : "Offline-first, быстрый старт, практики MASVS и безопасное хранение секретов."}
            </p>
          </motion.div>

          <div className="site-types__lists perf-groups">
            {groups.map(g => (
              <div key={g.key}>
                <p className="site-types__list-label">{g.label}</p>
                <ul className="mod-list mod-list--single">
                  {g.items.map(m => {
                    const Icon = m.icon;
                    return (
                      <li key={m.title} className="mod-item" title={m.teaser}>
                        <span className="mod-item__name"><Icon size={18} aria-hidden="true" />{m.title}</span>
                        <span className="mod-item__desc">{m.subtitle}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
