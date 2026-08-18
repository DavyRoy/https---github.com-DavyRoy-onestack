"use client";
import { serif } from "@/lib/fonts";

import React, { useEffect, useRef, useState, useMemo, useId } from "react";
import { motion, useReducedMotion, useInView } from "framer-motion";
import Link from "next/link";
import Script from "next/script";
import { siteName, siteUrl } from "@/app/seo.config";
import { useI18n } from "@/i18n/I18nProvider";


const BG   = "#07100e";
const TEAL = "#2dd4bf";
const WHITE = "#f4faf8";

/* ─── Data ───────────────────────────────────────────────────────────────── */
const STATS: { target: number; suffix: string; label: { ru: string; en: string } }[] = [
  { target: 150, suffix: "+", label: { ru: "проектов сдано",    en: "projects delivered" } },
  { target: 98,  suffix: "%", label: { ru: "сдаём в срок",      en: "on time"            } },
  { target: 5,   suffix: "",  label: { ru: "лет на рынке",      en: "years in market"    } },
  { target: 98,  suffix: "%", label: { ru: "клиентов довольны", en: "clients satisfied"  } },
];

const BENEFITS = [
  { title: { ru: "Скорость и производительность", en: "Speed & performance"  }, desc: { ru: "Оптимизируем LCP, CLS и INP — сайт грузится быстро на любых устройствах и соединениях.", en: "We optimize LCP, CLS and INP — fast loading on any device and connection." }, tags: ["LCP < 2.5s", "CLS < 0.1", "TTFB < 100ms"] },
  { title: { ru: "Безопасность",                  en: "Security"             }, desc: { ru: "OWASP-практики, RBAC, шифрование, аудит и регулярные бэкапы — защита на каждом уровне.", en: "OWASP practices, RBAC, encryption, audit logs and backups — protection at every layer." }, tags: ["OWASP", "RBAC", "Encryption", "Backups"] },
  { title: { ru: "Масштабируемость",              en: "Scalability"          }, desc: { ru: "Микросервисная архитектура, кэш и CDN — продукт выдержит любой рост нагрузки.", en: "Microservice architecture, caching and CDN — your product scales to any load." }, tags: ["Microservices", "Redis", "CDN"] },
  { title: { ru: "Интеграции",                    en: "Integrations"         }, desc: { ru: "CRM, ERP, платёжные системы, аналитика и любые сторонние сервисы через REST / GraphQL.", en: "CRM, ERP, payment systems, analytics and any third-party services via REST / GraphQL." }, tags: ["REST / GraphQL", "CRM / ERP", "Payments"] },
  { title: { ru: "CI/CD и DevOps",                en: "CI/CD & DevOps"       }, desc: { ru: "Автотесты, preview-окружения и безопасные откаты — быстрые надёжные релизы без рисков.", en: "Auto-tests, preview environments and safe rollbacks — fast, reliable releases." }, tags: ["GitHub Actions", "Docker", "Preview envs"] },
  { title: { ru: "Поддержка и развитие",          en: "Support & growth"     }, desc: { ru: "Мониторинг 24/7, SLA 99.9%, обновления и дорожная карта развития продукта.", en: "24/7 monitoring, SLA 99.9%, updates and product roadmap for continuous growth." }, tags: ["24/7", "SLA 99.9%", "Roadmap"] },
];

const PROCESS_STEPS = [
  { num: "01", ru: "Бриф",         en: "Brief"       },
  { num: "02", ru: "Дизайн",       en: "Design"      },
  { num: "03", ru: "Разработка",   en: "Development" },
  { num: "04", ru: "Тестирование", en: "Testing"     },
  { num: "05", ru: "Релиз",        en: "Release"     },
  { num: "06", ru: "Поддержка",    en: "Support"     },
];

const CLIENTS = ["MedPoint", "FleetPro", "RetailHub", "BuildFlow", "FinCore", "LogiTrack"];

/* ── HOME: смешанные отзывы (сайт + веб-приложение + мобильное) ─────────── */
const TESTIMONIALS: { ru: { text: string; author: string; role: string }; en: { text: string; author: string; role: string } }[] = [
  {
    ru: { text: "Сделали корпоративный сайт и личный кабинет партнёра в одном проекте. Две команды работали параллельно, сдали всё вместе и без задержек.", author: "Евгений П.", role: "CEO, AlphaGroup" },
    en: { text: "Corporate website and partner portal in one project. Two streams ran in parallel, delivered everything together on schedule.", author: "Evgeny P.", role: "CEO, AlphaGroup" },
  },
  {
    ru: { text: "Лендинг + мобильное приложение для запуска сервиса доставки еды. За первый месяц — 4 200 установок и 18% конверсия с сайта в скачивание.", author: "Ольга Н.", role: "Co-founder, FoodRun" },
    en: { text: "Landing page + mobile app for a food delivery launch. First month: 4 200 installs and 18% site-to-download conversion.", author: "Olga N.", role: "Co-founder, FoodRun" },
  },
  {
    ru: { text: "Весь цифровой продукт под ключ: публичный сайт, веб-кабинет для клиентов и iOS-приложение. OneStack выступили единственным подрядчиком — это ценно.", author: "Кирилл Б.", role: "CTO, InsureTech" },
    en: { text: "Full digital product: public website, client web portal and iOS app. OneStack was our sole contractor — that consistency matters.", author: "Kirill B.", role: "CTO, InsureTech" },
  },
  {
    ru: { text: "Редизайн сайта + новая CRM в одном спринте. Обычно такое растягивается на год — у нас заняло 14 недель. Качество на уровне крупных студий.", author: "Татьяна В.", role: "CMO, ProCredit" },
    en: { text: "Website redesign + new CRM in one sprint. This usually takes a year — it took us 14 weeks. Quality on par with large agencies.", author: "Tatiana V.", role: "CMO, ProCredit" },
  },
  {
    ru: { text: "Маркетплейс с веб-версией и мобильным приложением одновременно. Единый бэкенд, одна команда. Запустились раньше срока на 2 недели.", author: "Максим Д.", role: "Founder, BuyDirect" },
    en: { text: "Marketplace with web and mobile simultaneously. Single backend, one team. Launched 2 weeks ahead of schedule.", author: "Maxim D.", role: "Founder, BuyDirect" },
  },
  {
    ru: { text: "Сайт + приложение для сети фитнес-клубов. Онлайн-запись, абонементы, push-напоминания. Посещаемость выросла на 31% уже через месяц после запуска.", author: "Анастасия К.", role: "Digital Director, FitLife" },
    en: { text: "Website + app for a fitness club chain. Online booking, memberships, push reminders. Attendance up 31% within a month of launch.", author: "Anastasia K.", role: "Digital Director, FitLife" },
  },
  {
    ru: { text: "Перевели офлайн-бизнес в онлайн полностью: новый сайт, ERP-система и мобильный склад для кладовщиков. Всё за 4 месяца. Очень сильная команда.", author: "Роман С.", role: "COO, StorePro" },
    en: { text: "Took our offline business fully online: new website, ERP and mobile warehouse app. All in 4 months. Very strong team.", author: "Roman S.", role: "COO, StorePro" },
  },
  {
    ru: { text: "Агрегатор услуг с отдельным приложением для мастеров. Веб-версия уже дала первые сделки на третий день после запуска.", author: "Людмила Ф.", role: "CEO, HomeHelp" },
    en: { text: "Service aggregator with a separate app for contractors. The web version closed its first deals on day three after launch.", author: "Lyudmila F.", role: "CEO, HomeHelp" },
  },
  {
    ru: { text: "Запускали образовательную платформу с нуля: лендинг, LMS и мобильное приложение для учеников. Команда предложила архитектуру, которая сэкономила нам месяц работы.", author: "Илья О.", role: "Product Manager, EduBase" },
    en: { text: "Built an ed-tech platform from scratch: landing, LMS and student mobile app. The team proposed an architecture that saved us a month of work.", author: "Ilya O.", role: "Product Manager, EduBase" },
  },
  {
    ru: { text: "Работаем с OneStack уже третий проект подряд — сайт, потом CRM, теперь мобильное приложение. Каждый раз результат выше ожиданий.", author: "Вячеслав Т.", role: "Director, NovaTech" },
    en: { text: "Working with OneStack on our third project in a row — website, then CRM, now mobile app. Each time the result exceeds expectations.", author: "Vyacheslav T.", role: "Director, NovaTech" },
  },
];

const RESULTS: { num: number; suffix: { ru: string; en: string }; label: { ru: string; en: string }; sub: { ru: string; en: string } }[] = [
  { num: 150, suffix: { ru: "+",    en: "+"   }, label: { ru: "проектов сдано",   en: "projects delivered" }, sub: { ru: "за 5 лет работы",        en: "over 5 years"            } },
  { num: 6,   suffix: { ru: " нед", en: " wk" }, label: { ru: "средний MVP",      en: "average MVP"        }, sub: { ru: "с нуля до продакшна",    en: "from zero to production" } },
  { num: 98,  suffix: { ru: "%",    en: "%"   }, label: { ru: "сдаём в срок",     en: "on-time delivery"   }, sub: { ru: "по всем проектам",       en: "across all projects"     } },
  { num: 74,  suffix: { ru: "%",    en: "%"   }, label: { ru: "клиентов вернулись", en: "clients returned" }, sub: { ru: "для повторных проектов", en: "for repeat projects"     } },
];

const COPY = {
  ru: { eyebrow: "Четыре принципа", h1: "Правила,", h2: "которые мы не нарушаем", sub: "Фиксированная смета — цена не растёт в процессе. Срок — сдаём по договору. Стек — только проверенные технологии. Поддержка — на связи после запуска.", process: "КАК МЫ РАБОТАЕМ", clients: "НАМ ДОВЕРЯЮТ", cta: "Обсудить проект", promise: { title: "Прозрачный процесс", desc: "Демо каждые 1–2 недели, доступ к задачам в реальном времени." } },
  en: { eyebrow: "Four principles", h1: "Rules", h2: "we never break", sub: "Fixed price — the quote does not grow mid-project. Deadline — we deliver per contract. Stack — only proven technologies. Support — available after launch.", process: "HOW WE WORK", clients: "TRUSTED BY", cta: "Discuss project", promise: { title: "Transparent process", desc: "Demos every 1–2 weeks, real-time task access." } },
} as const;

/* ─── Counter hook ───────────────────────────────────────────────────────── */
function useCounter(target: number, duration = 1600) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!inView || reduced) { setValue(target); return; }
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setValue(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(step); else setValue(target);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration, reduced]);
  return { ref, value };
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════════════════════════════════ */
export default function HomeBenefits() {
  const { locale, localizePath } = useI18n();
  const lang    = locale === "ru" ? "ru" : "en";
  const c       = COPY[lang];
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
    "@context": "https://schema.org", "@type": "Organization",
    name: siteName, url: siteUrl,
    knowsAbout: BENEFITS.map(b => b.title.ru),
  }), []);

  const fadeUp = (d = 0) => reduced ? {} : {
    initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 },
    viewport: { once: true }, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: d },
  };

  return (
    <>
      <Script id="ld-home-benefits" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section
        id="benefits"
        aria-labelledby={titleId}
        style={{ background: BG, borderTop: "1px solid rgba(255,255,255,0.06)", position: "relative", overflow: "hidden" }}
      >
        {/* Ambient glow */}
        <div aria-hidden style={{
          pointerEvents: "none", position: "absolute", top: "20%", right: "-8%",
          width: 560, height: 560, borderRadius: "50%",
          background: TEAL, opacity: 0.05, filter: "blur(200px)",
        }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: isMobile ? "0 20px" : "0 40px", position: "relative", zIndex: 1 }}>

          {/* ── Header ── */}
          <motion.div
            {...(fadeUp(0) as object)}
            style={{ padding: isMobile ? "80px 0 56px" : "110px 0 72px" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ height: 2, width: 20, background: TEAL, borderRadius: 2, flexShrink: 0 }} />
              <span style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 500, color: TEAL }}>
                {c.eyebrow}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "flex-end", justifyContent: "space-between", gap: 24 }}>
              <h2
                id={titleId}
                className={serif.className}
                style={{ margin: 0, fontWeight: 400, lineHeight: 0.92, letterSpacing: "-0.04em" }}
              >
                <span style={{ display: "block", fontSize: "clamp(2.4rem, 6vw, 6rem)", color: "transparent", WebkitTextStroke: `1.5px ${TEAL}` }}>
                  {c.h1}
                </span>
                <span style={{ display: "block", fontSize: "clamp(2.4rem, 6vw, 6rem)", color: WHITE }}>
                  {c.h2}
                </span>
              </h2>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: "rgba(244,250,248,0.4)", maxWidth: 340, textAlign: isMobile ? "left" : "right" }}>
                {c.sub}
              </p>
            </div>
          </motion.div>

          {/* ── Stats strip ── */}
          <motion.div
            {...(fadeUp(0.08) as object)}
            style={{
              display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 14, overflow: "hidden", marginBottom: isMobile ? 48 : 64,
            }}
          >
            {STATS.map((s, i) => {
              const { ref, value } = useCounter(s.target);
              return (
                <div key={i} ref={ref} style={{
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  padding: isMobile ? "20px 8px" : "28px 20px", textAlign: "center",
                  background: "rgba(255,255,255,0.02)",
                  borderRight: i < 3 ? "1px solid rgba(255,255,255,0.07)" : "none",
                }}>
                  <div className={serif.className} style={{ fontSize: isMobile ? "1.6rem" : "clamp(1.8rem, 3vw, 2.8rem)", color: TEAL, lineHeight: 1, marginBottom: 6 }}>
                    {value}{s.suffix}
                  </div>
                  <div style={{ fontSize: isMobile ? 10 : 12, color: "rgba(244,250,248,0.45)" }}>
                    {s.label[lang]}
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* Client logos intentionally hidden until real clients can be shown */}

          {/* ── Benefit rows ── */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            {BENEFITS.map((b, i) => (
              <BenefitRow key={i} index={i}
                title={b.title[lang]} desc={b.desc[lang]} tags={b.tags}
                delay={Math.min(0.05 * i, 0.2)} reduced={!!reduced} isMobile={isMobile}
              />
            ))}
          </div>

          {/* ── Process timeline ── */}
          <ProcessTimeline lang={lang} label={c.process} reduced={!!reduced} isMobile={isMobile} />

          {/* ── Results ── */}
          <ResultsBlock lang={lang} reduced={!!reduced} isMobile={isMobile} />

          {/* ── Testimonials carousel ── */}
          <TestimonialsCarousel lang={lang} reduced={!!reduced} isMobile={isMobile} />

          {/* ── Bottom CTA ── */}
          <motion.div
            {...(fadeUp(0.1) as object)}
            style={{
              display: "flex", flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "flex-start" : "center",
              justifyContent: "space-between", gap: 24,
              marginTop: 56, paddingTop: 36,
              borderTop: "1px solid rgba(255,255,255,0.07)",
              marginBottom: isMobile ? 80 : 110,
            }}
          >
            <div>
              <p className={serif.className} style={{ fontSize: isMobile ? 20 : 24, fontWeight: 400, margin: "0 0 6px", color: WHITE }}>
                {c.promise.title}
              </p>
              <p style={{ margin: 0, fontSize: 13, color: "rgba(244,250,248,0.38)" }}>{c.promise.desc}</p>
            </div>
            <Link
              href={localizePath("/home#contact")}
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                borderRadius: 99, padding: "14px 28px",
                background: TEAL, color: BG, fontSize: 14, fontWeight: 600,
                textDecoration: "none", flexShrink: 0, transition: "opacity 0.15s",
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.opacity = "0.88")}
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.opacity = "1")}
            >
              {c.cta}
            </Link>
          </motion.div>

        </div>
      </section>
    </>
  );
}

/* ── BenefitRow ──────────────────────────────────────────────────────────── */
function BenefitRow({ index, title, desc, tags, delay, reduced, isMobile }: {
  index: number; title: string; desc: string; tags: string[];
  delay: number; reduced: boolean; isMobile: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={reduced ? undefined : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: isMobile ? "40px 1fr" : "64px 280px 1fr",
        gap: isMobile ? "12px 16px" : "0 32px",
        alignItems: "center",
        padding: isMobile ? "22px 0 22px 16px" : "30px 0 30px 20px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        cursor: "default",
        background: hovered ? "rgba(45,212,191,0.02)" : "transparent",
        transition: "background 0.25s",
      }}
    >
      {/* Teal left accent bar */}
      <motion.div
        aria-hidden
        style={{ position: "absolute", left: 0, top: 0, width: 2, borderRadius: 99, background: TEAL }}
        animate={{ height: hovered ? "100%" : "0%" }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Index */}
      <span style={{
        fontFamily: "monospace", fontSize: 10, fontWeight: 600, letterSpacing: "0.04em",
        color: hovered ? TEAL : "rgba(255,255,255,0.2)", transition: "color 0.2s",
        alignSelf: "start", paddingTop: 4,
      }}>
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Title */}
      <div className={serif.className} style={{
        fontSize: isMobile ? 18 : 22, fontWeight: 400, lineHeight: 1.15,
        letterSpacing: "-0.02em",
        color: hovered ? WHITE : "rgba(244,250,248,0.82)",
        transition: "color 0.2s",
      }}>
        {title}
      </div>

      {/* Desc + tags — on mobile spans full width */}
      <div style={{ gridColumn: isMobile ? "1 / -1" : "auto" }}>
        <p style={{ margin: "0 0 10px", fontSize: 13, lineHeight: 1.65, color: "rgba(244,250,248,0.38)" }}>
          {desc}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {tags.map(tag => (
            <span key={tag} style={{
              fontSize: 10, fontWeight: 500, letterSpacing: "0.04em",
              padding: "4px 10px", borderRadius: 99,
              background: hovered ? `${TEAL}15` : `${TEAL}0a`,
              color: hovered ? TEAL : `${TEAL}99`,
              border: `1px solid ${hovered ? TEAL + "40" : TEAL + "20"}`,
              transition: "all 0.2s",
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Process timeline ─────────────────────────────────────────────────────── */
function ProcessTimeline({ lang, label, reduced, isMobile }: { lang: "ru" | "en"; label: string; reduced: boolean; isMobile: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div style={{ padding: isMobile ? "56px 0" : "72px 0", borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 0 }}>
      <p style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(244,250,248,0.2)", marginBottom: isMobile ? 36 : 48 }}>
        {label}
      </p>
      <div ref={ref} style={{ position: "relative" }}>
        {/* Connecting line */}
        {!isMobile && (
          <>
            <div style={{ position: "absolute", top: 22, left: 0, right: 0, height: 1, background: "rgba(255,255,255,0.06)" }} />
            {!reduced && (
              <motion.div style={{ position: "absolute", top: 22, left: 0, height: 1, background: `linear-gradient(to right, ${TEAL}, ${TEAL}80)` }}
                initial={{ width: "0%" }}
                animate={inView ? { width: "100%" } : { width: "0%" }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              />
            )}
          </>
        )}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(3, 1fr)" : "repeat(6, 1fr)", gap: isMobile ? "24px 16px" : "0 16px" }}>
          {PROCESS_STEPS.map((step, i) => (
            <motion.div key={step.num}
              style={{ display: "flex", flexDirection: "column", alignItems: isMobile ? "center" : "flex-start", gap: 12, textAlign: isMobile ? "center" : "left" }}
              initial={reduced ? undefined : { opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ delay: 0.15 + i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div style={{
                position: "relative", zIndex: 1, width: 44, height: 44, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                background: BG, border: `1px solid ${TEAL}40`,
              }}>
                <span style={{ fontFamily: "monospace", fontSize: 10, color: TEAL }}>{step.num}</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(244,250,248,0.55)" }}>
                {lang === "ru" ? step.ru : step.en}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Results block ───────────────────────────────────────────────────────── */
function ResultCell({ r, lang, isMobile }: { r: typeof RESULTS[number]; lang: "ru" | "en"; isMobile: boolean }) {
  const { ref, value } = useCounter(r.num, 1400);
  return (
    <div ref={ref} style={{
      background: BG,
      padding: isMobile ? "28px 20px" : "36px 28px",
      display: "flex", flexDirection: "column", gap: 6,
    }}>
      <div className={serif.className} style={{
        fontSize: isMobile ? "1.8rem" : "2.6rem",
        fontWeight: 400, lineHeight: 1, letterSpacing: "-0.03em", color: TEAL,
      }}>
        {value}{r.suffix[lang]}
      </div>
      <p style={{ margin: 0, fontSize: isMobile ? 12 : 13, fontWeight: 600, color: WHITE }}>{r.label[lang]}</p>
      <p style={{ margin: 0, fontSize: 11, color: "rgba(244,250,248,0.3)" }}>{r.sub[lang]}</p>
    </div>
  );
}

function ResultsBlock({ lang, reduced, isMobile }: { lang: "ru" | "en"; reduced: boolean; isMobile: boolean }) {
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
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
        gap: 1,
        background: "rgba(255,255,255,0.06)",
        borderRadius: 16,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.06)",
      }}>
        {RESULTS.map((r, i) => (
          <ResultCell key={i} r={r} lang={lang} isMobile={isMobile} />
        ))}
      </div>
    </motion.div>
  );
}

/* ── Testimonials carousel ───────────────────────────────────────────────── */
function TestimonialsCarousel({ lang, reduced, isMobile }: { lang: "ru" | "en"; reduced: boolean; isMobile: boolean }) {
  const [active, setActive] = useState(0);
  const total = TESTIMONIALS.length;

  const prev = () => setActive(i => (i - 1 + total) % total);
  const next = () => setActive(i => (i + 1) % total);

  const cols = isMobile ? 1 : 3;
  const visible = Array.from({ length: cols }, (_, k) => TESTIMONIALS[(active + k) % total]);

  return (
    <motion.div
      initial={reduced ? undefined : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      style={{ marginTop: 56 }}
    >
      {/* Header */}
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
              style={{
                width: 36, height: 36, borderRadius: "50%", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(244,250,248,0.6)", fontSize: 16, transition: "all 0.2s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = `${TEAL}18`; (e.currentTarget as HTMLButtonElement).style.borderColor = `${TEAL}40`; (e.currentTarget as HTMLButtonElement).style.color = TEAL; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(244,250,248,0.6)"; }}
            >
              {i === 0 ? "←" : "→"}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 16, alignItems: "stretch", height: isMobile ? 220 : 260 }}>
        {visible.map((t, i) => {
          const q = t[lang];
          return (
            <div key={`${active}-${i}`} style={{
              position: "relative", overflow: "hidden",
              padding: isMobile ? "28px 24px" : "36px 32px",
              borderRadius: 16,
              border: `1px solid ${i === 0 ? TEAL + "25" : "rgba(255,255,255,0.07)"}`,
              background: i === 0
                ? `linear-gradient(135deg, ${TEAL}0a 0%, transparent 60%)`
                : "rgba(255,255,255,0.02)",
              transition: "all 0.35s",
              height: "100%",
              display: "flex", flexDirection: "column", justifyContent: "space-between",
              boxSizing: "border-box",
            }}>
              <div className={serif.className} aria-hidden style={{
                position: "absolute", top: 4, left: 20, fontSize: "5rem", lineHeight: 1,
                pointerEvents: "none", userSelect: "none",
                color: i === 0 ? `${TEAL}18` : "rgba(255,255,255,0.05)",
              }}>"</div>
              <div style={{ position: "relative", zIndex: 1 }}>
                <p className={serif.className} style={{
                  margin: "0 0 16px",
                  fontSize: isMobile ? 15 : 14,
                  fontWeight: 400, lineHeight: 1.5, letterSpacing: "-0.01em",
                  color: i === 0 ? "rgba(244,250,248,0.9)" : "rgba(244,250,248,0.65)",
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: "vertical",
                }}>
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

      {/* Dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 24 }}>
        {TESTIMONIALS.map((_, i) => (
          <button key={i} onClick={() => setActive(i)} aria-label={`Отзыв ${i + 1}`}
            style={{
              width: i === active ? 20 : 6, height: 6,
              borderRadius: 99, border: "none", cursor: "pointer",
              background: i === active ? TEAL : "rgba(255,255,255,0.15)",
              transition: "all 0.3s", padding: 0,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
