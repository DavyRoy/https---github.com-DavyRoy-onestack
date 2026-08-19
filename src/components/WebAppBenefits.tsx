// src/components/WebAppBenefits.tsx
"use client";
import { serif } from "@/lib/fonts";

import React, { useEffect, useRef, useState, useMemo, useId } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  ShieldCheck, KeyRound, Gauge, ServerCog, PlugZap,
  Rocket, Activity, BugPlay, CloudCog,
} from "lucide-react";
import Script from "next/script";
import { useI18n } from "@/i18n/I18nProvider";
import { siteUrl } from "@/app/seo.config";


const BG    = "#07100e";
const TEAL  = "#2dd4bf";
const WHITE = "#f4faf8";

/* ─── Data ───────────────────────────────────────────────────────────────── */
const BENEFITS_RU = [
  { icon: Rocket,     title: "Быстрый запуск MVP",       desc: "Архитектурные паттерны, дизайн-система и CI/CD с первого дня. Рабочий прототип за 4–8 недель.",            chip: "MVP"      },
  { icon: ShieldCheck,title: "Надёжная архитектура",     desc: "Типобезопасность, автотесты, обязательное ревью. Продукт живёт годами без дорогостоящих переписываний.",    chip: "QA"       },
  { icon: Gauge,      title: "Производительность",       desc: "Кэширование, CDN, очереди задач. Горизонтальное масштабирование при росте нагрузки.",                       chip: "Scale"    },
  { icon: KeyRound,   title: "Роли и безопасность",      desc: "RBAC/ABAC, SSO, 2FA, rate-limit и аудит событий. Соответствие современным стандартам защиты данных.",       chip: "RBAC"     },
  { icon: PlugZap,    title: "Интеграции и API",          desc: "REST/GraphQL, вебхуки, очереди сообщений. CRM, ERP, платежи — подключаем любые внешние системы.",           chip: "API"      },
  { icon: Activity,   title: "Наблюдаемость",             desc: "Логи, метрики и алерты в реальном времени. Быстрый поиск и устранение инцидентов без простоев.",             chip: "Ops"      },
  { icon: BugPlay,    title: "Качество и тестирование",  desc: "Unit, интеграционные и E2E тесты, статический анализ. Стабильность на всех уровнях приложения.",             chip: "Testing"  },
  { icon: ServerCog,  title: "CI/CD и DevOps",            desc: "Автосборки, preview-окружения и безопасные zero-downtime релизы. Деплой когда нужно, не когда можно.",       chip: "CI/CD"    },
  { icon: CloudCog,   title: "Поддержка после релиза",   desc: "Мониторинг 24/7, алерты, патчи и план развития. Не бросаем после запуска — работаем вдолгую.",               chip: "SLA"      },
] as const;

const BENEFITS_EN = [
  { icon: Rocket,      title: "Fast MVP launch",         desc: "Architectural patterns, design system and CI/CD from day one. Working prototype in 4–8 weeks.",             chip: "MVP"      },
  { icon: ShieldCheck, title: "Reliable architecture",   desc: "Type safety, automated tests, mandatory code reviews. Product lives for years without costly rewrites.",      chip: "QA"       },
  { icon: Gauge,       title: "Performance",             desc: "Caching, CDN, task queues. Horizontal scaling as load grows.",                                               chip: "Scale"    },
  { icon: KeyRound,    title: "Roles & security",        desc: "RBAC/ABAC, SSO, 2FA, rate-limit and event audit. Compliance with modern data security standards.",            chip: "RBAC"     },
  { icon: PlugZap,     title: "Integrations & API",      desc: "REST/GraphQL, webhooks, message queues. CRM, ERP, payments — we connect any external systems.",              chip: "API"      },
  { icon: Activity,    title: "Observability",           desc: "Logs, metrics and alerts in real time. Fast incident detection and resolution without downtime.",             chip: "Ops"      },
  { icon: BugPlay,     title: "Quality & testing",       desc: "Unit, integration and E2E tests, static analysis. Stability at every layer of the application.",             chip: "Testing"  },
  { icon: ServerCog,   title: "CI/CD & DevOps",          desc: "Auto-builds, preview environments and safe zero-downtime releases. Deploy when needed, not when possible.",  chip: "CI/CD"    },
  { icon: CloudCog,    title: "Post-launch support",     desc: "24/7 monitoring, alerts, patches and development roadmap. We don't abandon you after launch.",               chip: "SLA"      },
] as const;

const METRICS_RU = [
  { prefix: "≤", num: 200,  suffix: "мс",  label: "Ответ API",    note: "", dec: 0 },
  { prefix: "",  num: 99.9, suffix: "%",   label: "Uptime SLA",   note: "", dec: 1 },
  { prefix: "≤",  num: 8,    suffix: "нед", label: "Первый MVP",   note: "", dec: 0 },
  { prefix: "",  num: 50,   suffix: "+",   label: "Модулей",      note: "", dec: 0 },
] as const;

const METRICS_EN = [
  { prefix: "≤", num: 200,  suffix: "ms",  label: "API response time",  note: "", dec: 0 },
  { prefix: "",  num: 99.9, suffix: "%",   label: "Uptime SLA",          note: "", dec: 1 },
  { prefix: "4–",num: 8,    suffix: "wks", label: "First working MVP",   note: "", dec: 0 },
  { prefix: "",  num: 50,   suffix: "+",   label: "Ready modules",       note: "", dec: 0 },
] as const;

/* ─── CountUp ─────────────────────────────────────────────────────────────── */
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

function useCountUp(target: number, play: boolean, dec = 0) {
  const [val, setVal] = useState(0);
  const startRef = useRef<number | null>(null);
  const raf = useRef<number | null>(null);
  useEffect(() => {
    if (!play) { setVal(target); return; }
    startRef.current = null;
    const step = (ts: number) => {
      if (startRef.current == null) startRef.current = ts;
      const p = Math.min(1, (ts - startRef.current) / 900);
      setVal(parseFloat((target * easeOut(p)).toFixed(dec)));
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [target, play, dec]);
  return val;
}

function MetricCell({ m, reduced, isMobile }: { m: { prefix: string; num: number; suffix: string; label: string; note: string; dec: number }; reduced: boolean | null; isMobile: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const isRange = m.prefix.includes("–");
  const val = useCountUp(m.num, !isRange && !reduced && inView, m.dec);
  const display = isRange ? `${m.prefix}${m.num}${m.suffix}` : `${m.prefix}${val}${m.suffix}`;
  return (
    <div ref={ref} style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: isMobile ? "20px 8px" : "28px 20px", textAlign: "center",
      background: "rgba(255,255,255,0.02)", flex: 1,
    }}>
      <div className={serif.className} style={{ fontSize: isMobile ? "1.3rem" : "clamp(1.8rem, 3vw, 2.8rem)", color: TEAL, lineHeight: 1, marginBottom: 6 }}>
        {display}
      </div>
      <div style={{ fontSize: isMobile ? 9 : 11, color: "rgba(244,250,248,0.45)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%" }}>{m.label}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════════════════════════════════ */
export default function WebAppBenefits() {
  const { locale } = useI18n();
  const isEn = locale === "en";
  const BENEFITS = isEn ? BENEFITS_EN : BENEFITS_RU;
  const METRICS  = isEn ? METRICS_EN  : METRICS_RU;
  const reduced = useReducedMotion();
  const titleId = useId();
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const jsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: isEn ? "Web application development advantages — OneStack" : "Преимущества разработки веб-приложений OneStack",
    itemListElement: BENEFITS.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: { "@type": "Thing", name: b.title, description: b.desc },
    })),
  }), []);

  const fadeUp = (d = 0) => reduced ? {} : {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: d },
  };

  return (
    <section
      id="benefits"
      aria-labelledby={titleId}
      style={{ background: BG, borderTop: "1px solid rgba(255,255,255,0.06)", position: "relative", overflow: "hidden" }}
    >
      <Script id="ld-webapp-benefits" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Ambient glow */}
      <div aria-hidden style={{
        pointerEvents: "none", position: "absolute", top: -160, right: -160,
        width: 520, height: 520, borderRadius: "50%",
        background: TEAL, opacity: 0.04, willChange: "transform", transform: "translateZ(0)", filter: "blur(180px)",
      }} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: isMobile ? "0 20px" : "0 40px", position: "relative", zIndex: 1 }}>

        {/* ── Header ── */}
        <motion.div
          {...(fadeUp(0) as object)}
          style={{ padding: isMobile ? "80px 0 60px" : "110px 0 72px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ height: 2, width: 20, background: TEAL, borderRadius: 2, flexShrink: 0 }} />
            <span style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 500, color: TEAL }}>
              {isEn ? "Advantages" : "Преимущества"}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "flex-end", justifyContent: "space-between", gap: 24 }}>
            <h2
              id={titleId}
              className={serif.className}
              style={{ margin: 0, fontWeight: 400, lineHeight: 0.92, letterSpacing: "-0.04em" }}
            >
              <span style={{ display: "block", fontSize: "clamp(2.4rem, 6vw, 6rem)", color: TEAL }}>
                {isEn ? "Why choose us" : "Почему с нами"}
              </span>
              <span style={{ display: "block", fontSize: "clamp(2.4rem, 6vw, 6rem)", color: WHITE }}>
                {isEn ? "reliable and fast" : "надёжно и быстро"}
              </span>
            </h2>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: "rgba(244,250,248,0.4)", maxWidth: 340, textAlign: isMobile ? "left" : "right" }}>
              {isEn
                ? <>Fixed price, scalable architecture and SLA support — an app that grows with your business.</>
                : <>Фиксированная цена, масштабируемая архитектура и SLA-поддержка — приложение, которое растёт вместе с бизнесом.</>}
            </p>
          </div>
        </motion.div>

        {/* ── Metrics strip ── */}
        <motion.div
          {...(fadeUp(0.08) as object)}
          style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 14, overflow: "hidden", marginBottom: isMobile ? 48 : 64,
          }}
        >
          {METRICS.map((m, i) => (
            <div key={m.label} style={{ borderRight: i < 3 ? "1px solid rgba(255,255,255,0.07)" : "none", display: "flex" }}>
              <MetricCell m={m} isMobile={isMobile} reduced={reduced} />
            </div>
          ))}
        </motion.div>

        {/* ── Benefits rows ── */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {BENEFITS.map((b, i) => (
            <BenefitRow
              key={b.title} icon={b.icon} title={b.title} desc={b.desc}
              chip={b.chip} index={i} delay={Math.min(0.04 * i, 0.2)}
              reduced={!!reduced} isMobile={isMobile}
            />
          ))}
        </div>

        {/* ── Results ── */}
        <WebAppResultsBlock lang={isEn ? "en" : "ru"} reduced={!!reduced} isMobile={isMobile} />

        {/* ── Testimonials ── */}
        <WebAppTestimonialsCarousel lang={isEn ? "en" : "ru"} reduced={!!reduced} isMobile={isMobile} />

        <div style={{ height: isMobile ? 80 : 110 }} />
      </div>
    </section>
  );
}

/* ─── BenefitRow ─────────────────────────────────────────────────────────── */
function BenefitRow({
  icon: Icon, title, desc, chip, index, delay, reduced, isMobile,
}: {
  icon: React.ElementType; title: string; desc: string;
  chip: string; index: number; delay: number; reduced: boolean; isMobile: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={reduced ? undefined : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: isMobile ? "48px 1fr auto" : "64px 260px 1fr auto",
        gap: isMobile ? 12 : 32,
        alignItems: "center",
        padding: isMobile ? "20px 0 20px 16px" : "28px 0 28px 20px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        cursor: "default",
      }}
    >
      {/* Left teal accent bar */}
      <motion.div
        aria-hidden
        style={{ position: "absolute", left: 0, top: 0, width: 2, borderRadius: 99, background: TEAL }}
        animate={{ height: hovered ? "100%" : "0%" }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Number + Icon */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6 }}>
        <span style={{
          fontFamily: "monospace", fontSize: 10, fontWeight: 600,
          color: hovered ? TEAL : "rgba(255,255,255,0.2)",
          transition: "color 0.2s", letterSpacing: "0.04em",
        }}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <div style={{
          width: 32, height: 32, borderRadius: 8, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: hovered ? `${TEAL}18` : "rgba(255,255,255,0.04)",
          border: `1px solid ${hovered ? TEAL + "40" : "rgba(255,255,255,0.08)"}`,
          transition: "background 0.2s, border-color 0.2s",
        }}>
          <Icon size={15} style={{ color: hovered ? TEAL : "rgba(244,250,248,0.45)", transition: "color 0.2s" }} />
        </div>
      </div>

      {/* Title */}
      <div style={{
        fontSize: isMobile ? 14 : 16, fontWeight: 600,
        color: hovered ? WHITE : "rgba(244,250,248,0.75)",
        transition: "color 0.2s",
      }}>
        {title}
      </div>

      {/* Description — desktop column */}
      {!isMobile && (
        <div style={{ fontSize: 13, lineHeight: 1.65, color: "rgba(244,250,248,0.38)" }}>
          {desc}
        </div>
      )}

      {/* Chip */}
      <div>
        <span style={{
          display: "inline-block",
          fontSize: 9, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase",
          padding: "4px 10px", borderRadius: 99, whiteSpace: "nowrap",
          background: hovered ? `${TEAL}18` : "rgba(255,255,255,0.03)",
          border: `1px solid ${hovered ? TEAL + "40" : "rgba(255,255,255,0.07)"}`,
          color: hovered ? TEAL : "rgba(244,250,248,0.28)",
          transition: "all 0.2s",
        }}>
          {chip}
        </span>
      </div>

      {/* Mobile description row */}
      {isMobile && (
        <div style={{
          gridColumn: "1 / -1",
          fontSize: 12, lineHeight: 1.65, color: "rgba(244,250,248,0.55)",
        }}>
          {desc}
        </div>
      )}
    </motion.div>
  );
}

/* ── WebApp Results data ─────────────────────────────────────────────────── */
const WEBAPP_RESULTS = [
  { num: 30,  suffix: "+",    label: { ru: "веб-приложений сдано",  en: "web apps delivered"  }, sub: { ru: "за 5 лет работы",        en: "over 5 years"           } },
  { num: 6,   suffix: " нед", label: { ru: "средний MVP",           en: "average MVP"         }, sub: { ru: "с нуля до продакшна",    en: "from zero to production" } },
  { num: 99,  suffix: "%",    label: { ru: "сдаём в срок",          en: "on-time delivery"    }, sub: { ru: "по всем проектам",        en: "across all projects"    } },
  { num: 78,  suffix: "%",    label: { ru: "клиентов вернулись",    en: "clients returned"    }, sub: { ru: "для повторных проектов",  en: "for repeat projects"    } },
];

/* ── WebApp Testimonials data ────────────────────────────────────────────── */
/* ── WEBAPP: чисто веб-приложения ────────────────────────────────────────── */
const WEBAPP_TESTIMONIALS: { ru: { text: string; author: string; role: string }; en: { text: string; author: string; role: string } }[] = [
  {
    ru: { text: "ERP для производства: план выпуска, склад, закупки, отгрузки. Раньше всё в Excel — теперь единая система. Ошибки при планировании сократились на 60%.", author: "Станислав Г.", role: "CTO, FactoryOS" },
    en: { text: "ERP for manufacturing: production planning, stock, procurement, shipping. Everything was in Excel — now one system. Planning errors down 60%.", author: "Stanislav G.", role: "CTO, FactoryOS" },
  },
  {
    ru: { text: "Тендерная платформа с электронной подписью, журналом событий и ролевым доступом. Прошли проверку службы безопасности заказчика без единого замечания.", author: "Наталья В.", role: "Head of Digital, GovTech" },
    en: { text: "Tender platform with e-signature, event log and role-based access. Passed the client's security audit without a single remark.", author: "Natalia V.", role: "Head of Digital, GovTech" },
  },
  {
    ru: { text: "SaaS для управления персоналом строительных объектов: табели, наряды, акты. За 3 месяца после запуска подключили 120 прорабов.", author: "Артём Б.", role: "Founder, SiteForce" },
    en: { text: "HR SaaS for construction sites — timesheets, work orders, acceptance acts. 120 site managers onboarded within 3 months of launch.", author: "Artem B.", role: "Founder, SiteForce" },
  },
  {
    ru: { text: "Личный кабинет арендатора для сети торговых центров. Договоры, счета, обращения — всё онлайн. Нагрузка на управляющих снизилась на 40%.", author: "Светлана К.", role: "Operations Director, MallGroup" },
    en: { text: "Tenant portal for a shopping mall chain. Contracts, invoices, requests — all online. Property manager workload down 40%.", author: "Svetlana K.", role: "Operations Director, MallGroup" },
  },
  {
    ru: { text: "Платформа для управления автопарком — телематика, ТО, путевые листы, топливо. Интеграция с GPS-трекерами с первого дня. Всё стабильно работает.", author: "Денис Р.", role: "Fleet Manager, TransAuto" },
    en: { text: "Fleet management platform — telematics, maintenance, waybills, fuel. GPS tracker integration from day one. Rock solid.", author: "Denis R.", role: "Fleet Manager, TransAuto" },
  },
  {
    ru: { text: "CRM для страховых агентов: воронка, задачи, КП, пролонгации. Конверсия из лида в договор выросла с 12% до 21% за первый квартал.", author: "Ирина М.", role: "Sales Director, InsureMax" },
    en: { text: "CRM for insurance agents — pipeline, tasks, quotes, renewals. Lead-to-contract conversion up from 12% to 21% in Q1.", author: "Irina M.", role: "Sales Director, InsureMax" },
  },
  {
    ru: { text: "Рекрутинговая платформа с AI-ранжированием резюме, видеоинтервью и онбордингом. MVP за 7 недель. Инвесторы оценили скорость выхода.", author: "Фёдор Л.", role: "CEO, HireFlow" },
    en: { text: "Recruiting platform with AI resume ranking, video interviews and onboarding. MVP in 7 weeks. Investors noted the speed to market.", author: "Fyodor L.", role: "CEO, HireFlow" },
  },
  {
    ru: { text: "Портал для дистанционного мониторинга пациентов: кардиограммы, показатели, алерты врачам. Прошли сертификацию Минздрава без доработок.", author: "Ксения О.", role: "Product Lead, MedMonitor" },
    en: { text: "Remote patient monitoring portal — ECGs, vitals, doctor alerts. Passed Ministry of Health certification without revisions.", author: "Ksenia O.", role: "Product Lead, MedMonitor" },
  },
  {
    ru: { text: "B2B-кабинет для дистрибьюторов: заказы, остатки, история, бонусная программа. 200 дистрибьюторов перешли за 2 недели без единого звонка в поддержку.", author: "Андрей Ш.", role: "Commercial Director, DistCo" },
    en: { text: "B2B portal for distributors — orders, stock, history, loyalty programme. 200 distributors migrated in 2 weeks with zero support calls.", author: "Andrey Sh.", role: "Commercial Director, DistCo" },
  },
  {
    ru: { text: "Внутренняя система управления проектами для 400 сотрудников агентства. Перешли с Jira — удобнее, быстрее и без лишнего. Разворачивать не пришлось.", author: "Полина В.", role: "COO, CreativeHub" },
    en: { text: "Internal PM system for 400 agency staff. Migrated from Jira — simpler, faster, no bloat. Zero-downtime rollout.", author: "Polina V.", role: "COO, CreativeHub" },
  },
];

/* ── WebAppResultCell ────────────────────────────────────────────────────── */
function WebAppResultCell({ r, lang, isMobile }: { r: typeof WEBAPP_RESULTS[number]; lang: "ru" | "en"; isMobile: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();
  const [val, setVal] = useState(0);
  const startRef = useRef<number | null>(null);
  const raf = useRef<number | null>(null);
  useEffect(() => {
    if (!inView || reduced) { setVal(r.num); return; }
    startRef.current = null;
    const step = (ts: number) => {
      if (startRef.current == null) startRef.current = ts;
      const p = Math.min(1, (ts - startRef.current) / 1400);
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * r.num));
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [inView, r.num, reduced]);

  return (
    <div ref={ref} style={{ background: "#07100e", padding: isMobile ? "28px 20px" : "36px 28px", display: "flex", flexDirection: "column", gap: 6 }}>
      <div className={serif.className} style={{ fontSize: isMobile ? "1.8rem" : "2.6rem", fontWeight: 400, lineHeight: 1, letterSpacing: "-0.03em", color: TEAL }}>
        {val}{r.suffix}
      </div>
      <p style={{ margin: 0, fontSize: isMobile ? 12 : 13, fontWeight: 600, color: WHITE }}>{r.label[lang]}</p>
      <p style={{ margin: 0, fontSize: 11, color: "rgba(244,250,248,0.3)" }}>{r.sub[lang]}</p>
    </div>
  );
}

/* ── WebAppResultsBlock ──────────────────────────────────────────────────── */
function WebAppResultsBlock({ lang, reduced, isMobile }: { lang: "ru" | "en"; reduced: boolean; isMobile: boolean }) {
  return (
    <motion.div
      initial={reduced ? undefined : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      style={{ marginTop: 56 }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
        <div style={{ height: 2, width: 20, background: TEAL, borderRadius: 2, flexShrink: 0 }} />
        <span style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase" as const, fontWeight: 500, color: TEAL }}>
          {lang === "ru" ? "Результаты в цифрах" : "Results in numbers"}
        </span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 1, background: "rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)" }}>
        {WEBAPP_RESULTS.map((r, i) => <WebAppResultCell key={i} r={r} lang={lang} isMobile={isMobile} />)}
      </div>
    </motion.div>
  );
}

/* ── WebAppTestimonialsCarousel ──────────────────────────────────────────── */
function WebAppTestimonialsCarousel({ lang, reduced, isMobile }: { lang: "ru" | "en"; reduced: boolean; isMobile: boolean }) {
  const [active, setActive] = useState(0);
  const total = WEBAPP_TESTIMONIALS.length;
  const prev = () => setActive(i => (i - 1 + total) % total);
  const next = () => setActive(i => (i + 1) % total);
  const cols = isMobile ? 1 : 3;
  const visible = Array.from({ length: cols }, (_, k) => WEBAPP_TESTIMONIALS[(active + k) % total]);

  return (
    <motion.div
      initial={reduced ? undefined : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      style={{ marginTop: 56 }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ height: 2, width: 20, background: TEAL, borderRadius: 2 }} />
          <span style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase" as const, fontWeight: 500, color: TEAL }}>
            {lang === "ru" ? "Отзывы клиентов" : "Client reviews"}
          </span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[prev, next].map((fn, i) => (
            <button key={i} onClick={fn} aria-label={i === 0 ? "Назад" : "Вперёд"}
              style={{ width: 36, height: 36, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(244,250,248,0.6)", fontSize: 16, transition: "all 0.2s" }}
              onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = `${TEAL}18`; b.style.borderColor = `${TEAL}40`; b.style.color = TEAL; }}
              onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "rgba(255,255,255,0.04)"; b.style.borderColor = "rgba(255,255,255,0.1)"; b.style.color = "rgba(244,250,248,0.6)"; }}
            >
              {i === 0 ? "←" : "→"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 16, height: isMobile ? 280 : 240 }}>
        {visible.map((t, i) => {
          const q = t[lang];
          return (
            <div key={`${active}-${i}`} style={{ position: "relative", overflow: "hidden", padding: isMobile ? "32px 24px" : "40px 32px", borderRadius: 16, border: `1px solid ${i === 0 ? TEAL + "25" : "rgba(255,255,255,0.07)"}`, background: i === 0 ? `linear-gradient(135deg, ${TEAL}0a 0%, transparent 60%)` : "rgba(255,255,255,0.02)", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div className={serif.className} aria-hidden style={{ position: "absolute", top: 4, left: 20, fontSize: "5rem", lineHeight: 1, pointerEvents: "none", userSelect: "none" as const, color: i === 0 ? `${TEAL}18` : "rgba(255,255,255,0.05)" }}>"</div>
              <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
                <p className={serif.className} style={{ margin: "0 0 24px", fontSize: isMobile ? 16 : 15, fontWeight: 400, lineHeight: 1.55, letterSpacing: "-0.01em", color: i === 0 ? "rgba(244,250,248,0.9)" : "rgba(244,250,248,0.65)", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical" }}>
                  {q.text}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 20, height: 2, background: i === 0 ? TEAL : "rgba(255,255,255,0.2)", borderRadius: 2 }} />
                  <div>
                    <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: i === 0 ? WHITE : "rgba(244,250,248,0.55)" }}>{q.author}</p>
                    <p style={{ margin: 0, fontSize: 10, color: "rgba(244,250,248,0.3)" }}>{q.role}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 24 }}>
        {WEBAPP_TESTIMONIALS.map((_, i) => (
          <button key={i} onClick={() => setActive(i)} aria-label={`Отзыв ${i + 1}`}
            style={{ width: i === active ? 20 : 6, height: 6, borderRadius: 99, border: "none", cursor: "pointer", background: i === active ? TEAL : "rgba(255,255,255,0.15)", transition: "all 0.3s", padding: 0 }}
          />
        ))}
      </div>
    </motion.div>
  );
}
