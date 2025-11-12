// components/MobilePerfSecurity.tsx
"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Timer,
  Activity,
  Boxes,
  ShieldCheck,
  KeyRound,
  Database,
  GitBranch,
  Cpu,
  Smartphone,
  CloudCog,
  LockKeyhole,
} from "lucide-react";
import Link from "next/link";

const makeFadeUp = (reduced: boolean) => (d = 0) =>
  reduced
    ? { initial: {}, whileInView: {}, transition: {}, viewport: {} }
    : {
        initial: { opacity: 0, y: 18 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.55, ease: "easeOut", delay: d },
        viewport: { once: true, amount: 0.25 },
      };

type Metric = {
  icon: React.ReactNode;
  title: string;
  value?: string;
  badge?: string;
  text: string;
};

const PERFORMANCE: Metric[] = [
  {
    icon: <Timer className="h-5 w-5" />,
    title: "Время старта",
    value: "≤ 2.0 c",
    badge: "Cold start",
    text:
      "Оптимизируем загрузку модулей, шрифтов и иконок, используем предзапросы. Сплэш/скелетоны для быстрого «первого пикселя».",
  },
  {
    icon: <Activity className="h-5 w-5" />,
    title: "Плавность",
    value: "≤ 1% jank",
    badge: "60 FPS",
    text:
      "Профилируем рендер, снижаем переработки, выносим тяжёлые операции в фон. Контролируем пропуски кадров.",
  },
  {
    icon: <Smartphone className="h-5 w-5" />,
    title: "Crash-free users",
    value: "≥ 99.5%",
    badge: "Stability",
    text:
      "Crashlytics/Sentry, алерты, автособираемые логи. Быстрые хотфиксы и ретроспектива инцидентов.",
  },
  {
    icon: <Boxes className="h-5 w-5" />,
    title: "Оффлайн и кэш",
    value: "RTDB + Cache",
    badge: "Sync",
    text:
      "Кэш данных (TTL/инвалидация), очереди синхронизации, ретраи, разрешение конфликтов и мерж после онлайна.",
  },
  {
    icon: <Cpu className="h-5 w-5" />,
    title: "Размер бандла",
    value: "≤ 25–40 МБ",
    badge: "Slim build",
    text:
      "Разделение по фичам, удаление дебага, оптимизация ассетов, lazy-модули и ProGuard/обфускация.",
  },
  {
    icon: <CloudCog className="h-5 w-5" />,
    title: "Обновления",
    value: "Min. downtime",
    badge: "EAS/CodePush",
    text:
      "Доставка минорных апдейтов «по воздуху», фича-флаги, поэтапный rollout и откаты.",
  },
];

const SECURITY: Metric[] = [
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    title: "OWASP MASVS",
    badge: "MASVS-L1/L2",
    text:
      "Модель угроз для мобилок: защита рантайма, анти-тампер, защита от подмены прокси/сертификата.",
  },
  {
    icon: <LockKeyhole className="h-5 w-5" />,
    title: "Секреты",
    badge: "Keychain/Keystore",
    text:
      "Безопасное хранение токенов (Keychain/Keystore), Secure Enclave, биометрия, PIN/пасскод-гейт.",
  },
  {
    icon: <KeyRound className="h-5 w-5" />,
    title: "Политики",
    badge: "TLS/Pinning",
    text:
      "TLS 1.2+, SSL-pinning, защита от MITM, ограничение небезопасных схем, минимизация телеметрии.",
  },
  {
    icon: <Database className="h-5 w-5" />,
    title: "Данные и бэкапы",
    badge: "RPO/RTO",
    text:
      "Шифрование локального хранилища, безопасные бэкапы, политика авто-очистки, миграции без потерь.",
  },
  {
    icon: <GitBranch className="h-5 w-5" />,
    title: "CI/CD и подпись",
    badge: "Codesign",
    text:
      "Безопасная подпись релизов, изоляция секретов, supply-chain проверки, канарейки, fastlane.",
  },
  {
    icon: <Boxes className="h-5 w-5" />,
    title: "Root/Jailbreak/Debug",
    badge: "Hardening",
    text:
      "Детект рута/джейлбрейка/дебага, защитные хуки, защита от инжекта и модификации APK/IPA.",
  },
];

export default function MobilePerfSecurity() {
  const reduced = useReducedMotion();
  const fadeUp = makeFadeUp(reduced);

  // аналитика: просмотр секции
  useEffect(() => {
    try {
      (window as any).gtag?.("event", "section_view", {
        section: "perf_security",
        page: "mobile",
      });
      (window as any).ym?.(103909522, "reachGoal", "section_view_perf_security");
    } catch {}
  }, []);

  const onCta = () => {
    try {
      (window as any).gtag?.("event", "cta_click", {
        section: "perf_security",
        cta_id: "discuss_slo_sla",
        page: "mobile",
      });
      (window as any).ym?.(103909522, "reachGoal", "cta_click");
    } catch {}
  };

  return (
    <section
      id="perf-security"
      className="relative w-full overflow-hidden bg-gradient-to-b from-black via-[#0a0a0a] to-black text-white
                 pt-20 pb-24 md:pt-24 md:pb-28"
      aria-labelledby="perf-security-title"
    >
      {/* мягкие подсветки */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-white/[0.04] blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[420px] w-[420px] rounded-full bg-white/[0.04] blur-3xl" aria-hidden />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-12 lg:px-20">
        {/* Заголовок секции */}
        <motion.p {...fadeUp(0)} className="text-sm uppercase tracking-[0.25em] text-white/50 mb-3">
          производительность и безопасность
        </motion.p>

        <motion.h2
          id="perf-security-title"
          {...fadeUp(0.05)}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight max-w-3xl"
        >
          Быстрые, стабильные и защищённые мобильные приложения
        </motion.h2>

        <motion.p
          {...fadeUp(0.1)}
          className="mt-6 max-w-2xl text-white/70 text-lg"
        >
          Проектируем offline-first, оптимизируем старт и плавность, внедряем MASVS-практики,
          безопасное хранение секретов и защищённые сетевые политики. Обновления — по OTA.
        </motion.p>

        {/* Грид карточек: производительность */}
        <motion.h3
          {...fadeUp(0.15)}
          className="mt-10 text-xl font-semibold text-white/85"
        >
          Перформанс
        </motion.h3>
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
          {PERFORMANCE.map((m, i) => (
            <MetricCard key={m.title} {...m} delay={0.18 + i * 0.05} />
          ))}
        </div>

        {/* Грид карточек: безопасность */}
        <motion.h3
          {...fadeUp(0.25)}
          className="mt-10 text-xl font-semibold text-white/85"
        >
          Безопасность и надёжность
        </motion.h3>
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
          {SECURITY.map((m, i) => (
            <MetricCard key={m.title} {...m} delay={0.28 + i * 0.05} />
          ))}
        </div>

        {/* Примечание и CTA */}
        <motion.div
          {...fadeUp(0.4)}
          className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-white/70"
        >
          <div className="text-white/85 font-medium mb-2">Примечание</div>
          <p>
            Показатели зависят от платформы (iOS/Android), устройств и профиля нагрузки.
            Для вашего кейса определим SLO (cold/warm start, crash-free users, jank) и настроим алерты.
          </p>
          <div className="mt-4">
            <Link
              href="#contact"
              onClick={onCta}
              className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-black font-semibold hover:shadow-white/20 hover:shadow-lg transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              aria-label="Обсудить метрики SLO/SLA"
            >
              Обсудить SLO/SLA
              <svg className="ml-2 h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M5 12h14m0 0l-5-5m5 5l-5 5" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function MetricCard({
  icon,
  title,
  value,
  badge,
  text,
  delay = 0,
}: Metric & { delay?: number }) {
  return (
    <motion.div
      role="listitem"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      className="group relative rounded-2xl border border-white/10 bg-white/[0.04] p-6 hover:bg-white/[0.07] hover:shadow-[0_20px_60px_rgba(255,255,255,0.08)] transition"
    >
      {/* мягкая подсветка на hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 blur-2xl transition group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(60% 50% at 20% 0%, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 70%)",
        }}
      />
      <div className="relative z-10">
        <div className="flex items-start gap-4">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.08] text-white">
            {icon}
          </span>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="text-lg font-semibold">{title}</h4>
              {badge ? (
                <span className="rounded-full border border-white/15 bg-white/[0.06] px-2 py-0.5 text-[11px] leading-5 text-white/85">
                  {badge}
                </span>
              ) : null}
            </div>
            {value ? (
              <div className="mt-1 text-2xl font-extrabold tracking-tight">{value}</div>
            ) : null}
            <p className="mt-2 text-sm text-white/70">{text}</p>
          </div>
        </div>

        {/* акцентная линия снизу */}
        <span className="pointer-events-none absolute left-6 right-6 -bottom-[1px] h-[2px] bg-gradient-to-r from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 transition" />
      </div>
    </motion.div>
  );
}