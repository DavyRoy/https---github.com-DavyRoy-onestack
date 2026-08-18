// src/components/SiteBenefits.tsx
"use client";
import { serif } from "@/lib/fonts";

import React, { useEffect, useState, useMemo, useId, useRef } from "react";
import { motion, useReducedMotion, useInView } from "framer-motion";
import { ShieldCheck, Zap, Gauge, Code2, Rocket, LineChart, Cpu, Handshake, Sparkles } from "lucide-react";
import Script from "next/script";
import { useI18n } from "@/i18n/I18nProvider";


const BG    = "#07100e";
const TEAL  = "#2dd4bf";
const WHITE = "#f4faf8";

const BENEFITS_RU = [
  { icon: Rocket,      title: "Быстрый запуск",       desc: "MVP за 2–3 недели: готовые паттерны, дизайн-система и CI/CD-пайплайн с первого дня.",                 chip: "MVP"       },
  { icon: ShieldCheck, title: "Надёжная архитектура",  desc: "Типобезопасность, автотесты и обязательное ревью. Продукт живёт годами без переписываний.",            chip: "QA"        },
  { icon: Gauge,       title: "Производительность",   desc: "SSR/SSG, агрессивный кеш и CDN. Core Web Vitals стабильно в зелёной зоне — Google это любит.",        chip: "CWV"       },
  { icon: Code2,       title: "Прозрачный код",       desc: "Чистые компоненты, Storybook и живая документация — поддержка и доработки без боли.",                  chip: "DX"        },
  { icon: LineChart,   title: "Аналитика и A/B",      desc: "GA4/Метрика, кастомные события, дашборды и эксперименты — все решения на реальных данных.",            chip: "Analytics" },
  { icon: Handshake,   title: "Поддержка и SLA",      desc: "Мониторинг 24/7, алерты и план развития. Не бросаем после релиза — работаем вдолгую.",                 chip: "SLA"       },
  { icon: Cpu,         title: "Интеграции и API",     desc: "CRM, платежи, маркетплейсы, 1С и внутренние сервисы — подключаем любые внешние системы.",             chip: "API"       },
  { icon: Sparkles,    title: "Дизайн и анимации",    desc: "Современный визуал, продуманные микро-анимации и читаемая типографика на всех устройствах.",           chip: "UI/UX"     },
  { icon: Zap,         title: "CI/CD без простоев",   desc: "Автосборки, превью-окружения и безопасные zero-downtime выкаты — релизы когда нужно, не когда можно.", chip: "DevOps"    },
] as const;

const BENEFITS_EN = [
  { icon: Rocket,      title: "Fast launch",            desc: "MVP in 2–3 weeks: ready patterns, design system and CI/CD pipeline from day one.",                    chip: "MVP"       },
  { icon: ShieldCheck, title: "Reliable architecture",  desc: "Type safety, automated tests and mandatory reviews. Product lives for years without rewrites.",        chip: "QA"        },
  { icon: Gauge,       title: "Performance",            desc: "SSR/SSG, aggressive cache and CDN. Core Web Vitals stably in the green — Google loves this.",         chip: "CWV"       },
  { icon: Code2,       title: "Transparent code",       desc: "Clean components, Storybook and live docs — maintenance and improvements without pain.",               chip: "DX"        },
  { icon: LineChart,   title: "Analytics & A/B",        desc: "GA4, custom events, dashboards and experiments — all decisions based on real data.",                  chip: "Analytics" },
  { icon: Handshake,   title: "Support & SLA",          desc: "24/7 monitoring, alerts and a development roadmap. We don't leave after release — we work long-term.", chip: "SLA"       },
  { icon: Cpu,         title: "Integrations & API",     desc: "CRM, payments, marketplaces, ERP and internal services — we connect any external systems.",           chip: "API"       },
  { icon: Sparkles,    title: "Design & animations",    desc: "Modern visuals, thoughtful micro-animations and readable typography on all devices.",                  chip: "UI/UX"     },
  { icon: Zap,         title: "CI/CD without downtime", desc: "Auto-builds, preview environments and safe zero-downtime releases — deploy when needed, not when possible.", chip: "DevOps" },
] as const;

const METRICS_RU = [
  { prefix: "≤",  num: 90,   suffix: "мс",  label: "Ответ сервера",  note: "", dec: 0 },
  { prefix: "",   num: 99.9, suffix: "%",   label: "Uptime SLA",     note: "", dec: 1 },
  { prefix: "1–", num: 2,    suffix: "нед", label: "Первый релиз",   note: "", dec: 0 },
  { prefix: "",   num: 30,   suffix: "+",   label: "Шаблонов",       note: "", dec: 0 },
] as const;

const METRICS_EN = [
  { prefix: "≤",  num: 90,   suffix: "ms",  label: "Server response time",  note: "", dec: 0 },
  { prefix: "",   num: 99.9, suffix: "%",   label: "Uptime SLA",             note: "", dec: 1 },
  { prefix: "1–", num: 2,    suffix: "wks", label: "First working release",  note: "", dec: 0 },
  { prefix: "",   num: 30,   suffix: "+",   label: "Ready templates",        note: "", dec: 0 },
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
function MetricCell({ m, isMobile, reduced }: { m: { prefix: string; num: number; suffix: string; label: string; note: string; dec: number }; isMobile: boolean; reduced: boolean | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  // Не анимируем диапазонные значения (prefix содержит "–")
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

export default function SiteBenefits() {
  const { locale } = useI18n();
  const isEn = locale === "en";
  const BENEFITS = isEn ? BENEFITS_EN : BENEFITS_RU;
  const METRICS  = isEn ? METRICS_EN  : METRICS_RU;
  const reduced  = useReducedMotion();
  const titleId  = useId();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const seoJsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: isEn ? "Website development advantages — OneStack" : "Преимущества разработки сайтов OneStack",
    itemListElement: BENEFITS.map((b, i) => ({
      "@type": "ListItem", position: i + 1,
      item: { "@type": "Thing", name: b.title, description: b.desc },
    })),
  }), [isEn]);

  const fadeUp = (d = 0) => reduced ? {} : {
    initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 },
    viewport: { once: true }, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: d },
  };

  return (
    <section
      id="benefits"
      aria-labelledby={titleId}
      style={{ background: BG, borderTop: "1px solid rgba(255,255,255,0.06)", position: "relative", overflow: "hidden" }}
    >
      <Script id="ld-sitebenefits" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(seoJsonLd) }} />

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
              <span style={{ display: "block", fontSize: "clamp(2.4rem, 6vw, 6rem)", color: "transparent", WebkitTextStroke: `1.5px ${TEAL}` }}>
                {isEn ? "Why us" : "Почему с нами"}
              </span>
              <span style={{ display: "block", fontSize: "clamp(2.4rem, 6vw, 6rem)", color: WHITE }}>
                {isEn ? "calm and fast" : "спокойно и быстро"}
              </span>
            </h2>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: "rgba(244,250,248,0.4)", maxWidth: 340, textAlign: isMobile ? "left" : "right" }}>
              {isEn
                ? <>Fixed quote, clear architecture and post-launch support — a project that runs without surprises.</>
                : <>Фиксированная смета, понятная архитектура и поддержка после релиза — проект, который работает без сюрпризов.</>}
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

        {/* ── Benefit rows ── */}
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
        <SiteResultsBlock lang={isEn ? "en" : "ru"} reduced={!!reduced} isMobile={isMobile} />

        {/* ── Testimonials ── */}
        <SiteTestimonialsCarousel lang={isEn ? "en" : "ru"} reduced={!!reduced} isMobile={isMobile} />

        <div style={{ height: isMobile ? 80 : 110 }} />
      </div>
    </section>
  );
}

/* ── BenefitRow ──────────────────────────────────────────────────────────── */
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

      {/* Description — hidden on mobile in this col, shown below */}
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
          paddingLeft: 0,
        }}>
          {desc}
        </div>
      )}
    </motion.div>
  );
}

/* ── Site Results data ───────────────────────────────────────────────────── */
const SITE_RESULTS = [
  { num: 120, suffix: "+",   label: { ru: "сайтов запущено",    en: "sites launched"    }, sub: { ru: "за 5 лет работы",     en: "over 5 years"           } },
  { num: 2,   suffix: " нед",label: { ru: "средний лендинг",    en: "average landing"   }, sub: { ru: "от брифа до релиза",   en: "from brief to release"  } },
  { num: 98,  suffix: "%",   label: { ru: "сдаём в срок",       en: "on-time delivery"  }, sub: { ru: "по всем проектам",     en: "across all projects"    } },
  { num: 71,  suffix: "%",   label: { ru: "клиентов вернулись", en: "clients returned"  }, sub: { ru: "для повторных заказов",en: "for repeat orders"      } },
];

/* ── Site Testimonials data ──────────────────────────────────────────────── */
const SITE_TESTIMONIALS: { ru: { text: string; author: string; role: string }; en: { text: string; author: string; role: string } }[] = [
  {
    ru: { text: "Лендинг для запуска нового продукта — сдали за 10 дней. Дизайн с нуля, анимации, адаптив. Конверсия 8% с первой же недели. Рекомендую.", author: "Дмитрий К.", role: "Founder, LaunchHub" },
    en: { text: "Landing page for a new product launch — delivered in 10 days. Custom design, animations, full responsive. 8% conversion from week one. Highly recommend.", author: "Dmitry K.", role: "Founder, LaunchHub" },
  },
  {
    ru: { text: "Корпоративный сайт на новом домене — SEO-структура, блог, вакансии, CMS для редактора. Через 3 месяца вышли в топ-5 по ключевым запросам.", author: "Ирина С.", role: "Marketing Director, BuildGroup" },
    en: { text: "Corporate website on a new domain — SEO structure, blog, vacancies, editor CMS. Within 3 months we ranked top-5 for our main keywords.", author: "Irina S.", role: "Marketing Director, BuildGroup" },
  },
  {
    ru: { text: "Переделали старый сайт полностью. Скорость загрузки выросла с 42 до 94 баллов PageSpeed. Заявки через форму выросли на 35% в первый же месяц.", author: "Алексей В.", role: "CEO, ServicePro" },
    en: { text: "Full website redesign. PageSpeed score went from 42 to 94. Contact form leads grew 35% in the very first month.", author: "Alexey V.", role: "CEO, ServicePro" },
  },
  {
    ru: { text: "Интернет-магазин на 2000 SKU с корзиной, оплатой и личным кабинетом. Запустили за 6 недель. Команда всегда на связи, правки вносили быстро.", author: "Наталья Б.", role: "Owner, HomeDecor" },
    en: { text: "E-commerce store with 2000 SKUs, cart, payments and account area. Launched in 6 weeks. Team was always reachable, edits were fast.", author: "Natalia B.", role: "Owner, HomeDecor" },
  },
  {
    ru: { text: "Сайт под франшизу — 12 региональных копий с единым CMS и локальным контентом. Отличное решение, сэкономили значительный бюджет.", author: "Павел Р.", role: "Franchise Director, FitZone" },
    en: { text: "Franchise website — 12 regional copies with one CMS and local content. Great solution, saved us significant budget.", author: "Pavel R.", role: "Franchise Director, FitZone" },
  },
  {
    ru: { text: "Мультиязычный портал для выхода на европейский рынок. RU/EN/DE. Сложная SEO-структура под каждый регион. Результатом очень довольны.", author: "Марина Е.", role: "Head of Growth, ExportPro" },
    en: { text: "Multilingual portal for European market entry — RU/EN/DE. Complex per-region SEO structure. Very happy with the outcome.", author: "Marina E.", role: "Head of Growth, ExportPro" },
  },
  {
    ru: { text: "Лендинг для онлайн-курса. Секции с преподавателями, программой, отзывами и оплатой. За первую неделю после запуска — 140 регистраций.", author: "Сергей Т.", role: "Founder, EduOnline" },
    en: { text: "Landing page for an online course — instructor bios, curriculum, reviews, payment. 140 sign-ups in the first week after launch.", author: "Sergey T.", role: "Founder, EduOnline" },
  },
  {
    ru: { text: "Редизайн сайта застройщика. Новый визуал, квиз-калькулятор, карта объектов. Время на сайте выросло в 2.4 раза, звонков стало больше.", author: "Антон М.", role: "CMO, CityRealt" },
    en: { text: "Real-estate developer redesign — new visuals, quiz calculator, object map. Time on site up 2.4×, more calls coming in.", author: "Anton M.", role: "CMO, CityRealt" },
  },
  {
    ru: { text: "Сайт юридической компании с фильтрацией кейсов, формой первичной консультации и блогом. Вывели в ТОП по 18 профессиональным запросам.", author: "Виктория Л.", role: "Managing Partner, LexGroup" },
    en: { text: "Law firm website with case filtering, consultation form and blog. Ranked in TOP for 18 professional search queries.", author: "Victoria L.", role: "Managing Partner, LexGroup" },
  },
  {
    ru: { text: "Агрегатор услуг с каталогом подрядчиков, рейтингами и заявками. Полная адаптация, PWA. Запустили за 7 недель, уже 400 зарегистрированных компаний.", author: "Роман Ш.", role: "CTO, ServiceHub" },
    en: { text: "Service aggregator with contractor catalogue, ratings and requests. Full responsive, PWA. Launched in 7 weeks, 400 registered companies already.", author: "Roman Sh.", role: "CTO, ServiceHub" },
  },
];

/* ── ResultCell for sites ────────────────────────────────────────────────── */
function SiteResultCell({ r, lang, isMobile }: { r: typeof SITE_RESULTS[number]; lang: "ru" | "en"; isMobile: boolean }) {
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
    <div ref={ref} style={{ background: BG, padding: isMobile ? "28px 20px" : "36px 28px", display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ fontSize: isMobile ? "1.8rem" : "2.6rem", lineHeight: 1, color: TEAL, display: "flex", alignItems: "baseline", gap: 4 }}>
        <span className={serif.className} style={{ fontWeight: 400, letterSpacing: "-0.03em" }}>{val}</span>
        <span style={{ fontWeight: 500, fontSize: isMobile ? "1.2rem" : "1.8rem" }}>{r.suffix}</span>
      </div>
      <p style={{ margin: 0, fontSize: isMobile ? 12 : 13, fontWeight: 600, color: WHITE }}>{r.label[lang]}</p>
      <p style={{ margin: 0, fontSize: 11, color: "rgba(244,250,248,0.5)" }}>{r.sub[lang]}</p>
    </div>
  );
}

/* ── SiteResultsBlock ────────────────────────────────────────────────────── */
function SiteResultsBlock({ lang, reduced, isMobile }: { lang: "ru" | "en"; reduced: boolean; isMobile: boolean }) {
  return (
    <motion.div
      initial={reduced ? undefined : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      style={{ marginTop: 56 }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
        <div style={{ height: 2, width: 20, background: TEAL, borderRadius: 2, flexShrink: 0 }} />
        <span style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 500, color: TEAL }}>
          {lang === "ru" ? "Результаты в цифрах" : "Results in numbers"}
        </span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 1, background: "rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)" }}>
        {SITE_RESULTS.map((r, i) => <SiteResultCell key={i} r={r} lang={lang} isMobile={isMobile} />)}
      </div>
    </motion.div>
  );
}

/* ── SiteTestimonialsCarousel ────────────────────────────────────────────── */
function SiteTestimonialsCarousel({ lang, reduced, isMobile }: { lang: "ru" | "en"; reduced: boolean; isMobile: boolean }) {
  const [active, setActive] = useState(0);
  const total = SITE_TESTIMONIALS.length;
  const prev = () => setActive(i => (i - 1 + total) % total);
  const next = () => setActive(i => (i + 1) % total);
  const cols = isMobile ? 1 : 3;
  const visible = Array.from({ length: cols }, (_, k) => SITE_TESTIMONIALS[(active + k) % total]);

  return (
    <motion.div
      initial={reduced ? undefined : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      style={{ marginTop: 56 }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ height: 2, width: 20, background: TEAL, borderRadius: 2, flexShrink: 0 }} />
          <span style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 500, color: TEAL }}>
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
              <div className={serif.className} aria-hidden style={{ position: "absolute", top: 4, left: 20, fontSize: "5rem", lineHeight: 1, pointerEvents: "none", userSelect: "none", color: i === 0 ? `${TEAL}18` : "rgba(255,255,255,0.05)" }}>"</div>
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
        {SITE_TESTIMONIALS.map((_, i) => (
          <button key={i} onClick={() => setActive(i)} aria-label={`Отзыв ${i + 1}`}
            style={{ width: i === active ? 20 : 6, height: 6, borderRadius: 99, border: "none", cursor: "pointer", background: i === active ? TEAL : "rgba(255,255,255,0.15)", transition: "all 0.3s", padding: 0 }}
          />
        ))}
      </div>
    </motion.div>
  );
}
