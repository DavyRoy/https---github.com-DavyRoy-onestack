"use client";
import { serif } from "@/lib/fonts";

import React, { useEffect, useRef, useState, useId } from "react";
import { motion, useReducedMotion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";


const BG   = "#07100e";
const TEAL = "#2dd4bf";
const WHITE = "#f4faf8";

/* ─── Data ───────────────────────────────────────────────────────────────── */
const STATS: { target: number; suffix: string; label: { ru: string; en: string } }[] = [
  { target: 150, suffix: "+", label: { ru: "проектов сдано",    en: "projects delivered" } },
  { target: 98,  suffix: "%", label: { ru: "сдаём в срок",      en: "on time"            } },
  { target: 6,   suffix: "",  label: { ru: "лет на рынке",      en: "years in market"    } },
  { target: 98,  suffix: "%", label: { ru: "клиентов довольны", en: "clients satisfied"  } },
];

const BENEFITS = [
  { title: { ru: "Скорость и производительность", en: "Speed & performance"  }, desc: { ru: "Страницы открываются меньше чем за 2,5 секунды даже на мобильном интернете — клиенты не уходят, а поисковики поднимают сайт выше.", en: "Pages load in under 2.5 seconds even on mobile data — visitors stay, and search engines rank you higher." }, tags: ["LCP < 2.5s", "CLS < 0.1", "TTFB < 100ms"] },
  { title: { ru: "Безопасность",                  en: "Security"             }, desc: { ru: "Данные клиентов зашифрованы, доступы разграничены по ролям, резервные копии делаются каждый день. Утечка или потеря данных вам не грозят.", en: "Customer data is encrypted, access is role-based and backups run daily. No leaks, no lost data." }, tags: ["OWASP", "RBAC", "Encryption", "Backups"] },
  { title: { ru: "Масштабируемость",              en: "Scalability"          }, desc: { ru: "Закладываем запас на рост с первого дня: рекламная кампания или сезонный пик не положат сайт, а новые функции не потребуют переписывать всё заново.", en: "Built for growth from day one: an ad campaign or seasonal peak will not take you down, and new features never mean a rewrite." }, tags: ["Microservices", "Redis", "CDN"] },
  { title: { ru: "Интеграции",                    en: "Integrations"         }, desc: { ru: "Подключаем 1С, amoCRM, Битрикс24, оплаты, доставку и аналитику. Заявки и заказы сами попадают куда нужно — без ручного переноса.", en: "We connect your ERP, CRM, payments, delivery and analytics. Leads and orders land where they should, with no manual copying." }, tags: ["REST / GraphQL", "CRM / ERP", "Payments"] },
  { title: { ru: "CI/CD и DevOps",                en: "CI/CD & DevOps"       }, desc: { ru: "Каждое изменение проходит автотесты и сначала проверяется на копии сайта. Обновления выходят без простоев, а при ошибке откатываются за минуты.", en: "Every change passes automated tests and is checked on a staging copy first. Updates ship with no downtime and roll back in minutes." }, tags: ["GitHub Actions", "Docker", "Preview envs"] },
  { title: { ru: "Поддержка и развитие",          en: "Support & growth"     }, desc: { ru: "После запуска не пропадаем: следим за работой 24/7, гарантируем доступность 99,9% по SLA и помогаем развивать продукт дальше.", en: "We stay after launch: 24/7 monitoring, 99.9% uptime under SLA and a roadmap to keep your product growing." }, tags: ["24/7", "SLA 99.9%", "Roadmap"] },
];

const PROCESS_STEPS = [
  { num: "01", ru: "Бриф",         en: "Brief"       },
  { num: "02", ru: "Дизайн",       en: "Design"      },
  { num: "03", ru: "Разработка",   en: "Development" },
  { num: "04", ru: "Тестирование", en: "Testing"     },
  { num: "05", ru: "Релиз",        en: "Release"     },
  { num: "06", ru: "Поддержка",    en: "Support"     },
];

const COPY = {
  ru: { eyebrow: "02 / Принципы", h1: "Правила,", h2: "которые мы не нарушаем", sub: "Фиксированная смета — цена не растёт в процессе. Срок — сдаём по договору. Стек — только проверенные технологии. Поддержка — на связи после запуска.", process: "КАК МЫ РАБОТАЕМ", clients: "НАМ ДОВЕРЯЮТ", cta: "Обсудить проект", promise: { title: "Вы всегда видите, где проект", desc: "Демо каждые 1–2 недели и доступ к задачам в реальном времени — без сюрпризов в конце." } },
  en: { eyebrow: "02 / Principles", h1: "Rules", h2: "we never break", sub: "Fixed price — the quote does not grow mid-project. Deadline — we deliver per contract. Stack — only proven technologies. Support — available after launch.", process: "HOW WE WORK", clients: "TRUSTED BY", cta: "Discuss project", promise: { title: "You always know where things stand", desc: "Demos every 1–2 weeks and live access to tasks — no surprises at the end." } },
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
  const { locale } = useI18n();
  const lang    = locale === "ru" ? "ru" : "en";
  const c       = COPY[lang];
  const reduced = useReducedMotion();
  const titleId = useId();


  const fadeUp = (d = 0) => reduced ? {} : {
    initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 },
    viewport: { once: true }, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: d },
  };

  return (
    <>

      <section
        id="benefits"
        aria-labelledby={titleId}
        style={{ background: "transparent", position: "relative", overflow: "hidden" }}
      >

        <div className="px-5 md:px-10" style={{ maxWidth: 1280, margin: "0 auto", paddingTop: "clamp(72px,10svh,110px)", position: "relative", zIndex: 1 }}>

          {/* ── Header — matches the Capabilities block's header treatment ── */}
          <motion.div
            {...(fadeUp(0) as object)}
            style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24, flexWrap: "wrap", marginBottom: 48 }}
          >
            <div>
              <p style={{ fontSize: 14, letterSpacing: "0.2em", textTransform: "uppercase", color: TEAL, marginBottom: 16 }}>
                {c.eyebrow}
              </p>
              <h2
                id={titleId}
                className={serif.className}
                style={{ fontSize: "clamp(2.3rem, 5.06vw, 3.91rem)", fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.02em", color: WHITE, margin: 0 }}
              >
                {c.h1}<br />{c.h2}
              </h2>
            </div>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: "rgba(244,250,248,0.45)", maxWidth: 300 }}>
              {c.sub}
            </p>
          </motion.div>

          {/* ── Stats strip ── */}
          <motion.div
            {...(fadeUp(0.08) as object)}
            className="stats-strip"
          >
            {STATS.map((s, i) => (
              <StatCell key={i} target={s.target} suffix={s.suffix} label={s.label[lang]} />
            ))}
          </motion.div>

          {/* Client logos intentionally hidden until real clients can be shown */}

          {/* ── Benefit rows ── */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            {BENEFITS.map((b, i) => (
              <BenefitRow key={i} index={i}
                title={b.title[lang]} desc={b.desc[lang]} tags={b.tags}
                delay={Math.min(0.05 * i, 0.2)} reduced={!!reduced}
              />
            ))}
          </div>

          {/* ── Process timeline ── */}
          <ProcessTimeline lang={lang} label={c.process} reduced={!!reduced} />

          {/* ── Bottom CTA ── */}
          <motion.div
            {...(fadeUp(0.1) as object)}
            className="benefits-cta"
          >
            <div>
              <p className={serif.className} style={{ fontSize: "clamp(23px, 2.4vw, 28px)", fontWeight: 400, margin: "0 0 6px", color: WHITE }}>
                {c.promise.title}
              </p>
              <p style={{ margin: 0, fontSize: 17, color: "rgba(244,250,248,0.38)" }}>{c.promise.desc}</p>
            </div>
            <Link href="#contact" className="service-button service-button--primary" style={{ flexShrink: 0 }}>
              {c.cta}<ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </motion.div>

        </div>
      </section>
    </>
  );
}

/* ── StatCell ─────────────────────────────────────────────────────────────── */
function StatCell({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const { ref, value } = useCounter(target);
  return (
    <div ref={ref} className="stat-cell">
      <div className={serif.className} style={{ fontSize: "clamp(1.84rem, 3.45vw, 3.22rem)", color: TEAL, lineHeight: 1, marginBottom: 6 }}>
        {value}{suffix}
      </div>
      <div style={{ fontSize: "clamp(13px, 1.2vw, 16px)", color: "rgba(244,250,248,0.45)" }}>
        {label}
      </div>
    </div>
  );
}

/* ── BenefitRow ──────────────────────────────────────────────────────────── */
function BenefitRow({ index, title, desc, tags, delay, reduced }: {
  index: number; title: string; desc: string; tags: string[];
  delay: number; reduced: boolean;
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
      className="benefit-row"
      style={{
        position: "relative",
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
        fontFamily: "var(--font-geist-mono), monospace", fontSize: 13, fontWeight: 600, letterSpacing: "0.04em",
        color: hovered ? TEAL : "rgba(255,255,255,0.2)", transition: "color 0.2s",
        alignSelf: "start", paddingTop: 4,
      }}>
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Title */}
      <div className={serif.className} style={{
        fontSize: "clamp(21px, 2vw, 25px)", fontWeight: 400, lineHeight: 1.15,
        letterSpacing: "-0.02em",
        color: hovered ? WHITE : "rgba(244,250,248,0.82)",
        transition: "color 0.2s",
      }}>
        {title}
      </div>

      {/* Desc + tags — on mobile spans full width */}
      <div className="benefit-row__desc">
        <p style={{ margin: "0 0 10px", fontSize: 17, lineHeight: 1.65, color: "rgba(244,250,248,0.38)" }}>
          {desc}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {tags.map(tag => (
            <span key={tag} style={{
              fontSize: 13, fontWeight: 500, letterSpacing: "0.04em",
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
function ProcessTimeline({ lang, label, reduced }: { lang: "ru" | "en"; label: string; reduced: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div style={{ padding: "clamp(56px, 6vw, 72px) 0", borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 0 }}>
      <p style={{ fontSize: 13, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(244,250,248,0.2)", marginBottom: "clamp(36px, 4vw, 48px)" }}>
        {label}
      </p>
      <div ref={ref} style={{ position: "relative" }}>
        {/* Connecting line */}
        {/* На телефоне шаги идут в две строки — соединительная линия там не нужна. */}
        <div className="hidden md:block">
            <div style={{ position: "absolute", top: 22, left: 0, right: 0, height: 1, background: "rgba(255,255,255,0.06)" }} />
            {!reduced && (
              <motion.div style={{ position: "absolute", top: 22, left: 0, height: 1, background: `linear-gradient(to right, ${TEAL}, ${TEAL}80)` }}
                initial={{ width: "0%" }}
                animate={inView ? { width: "100%" } : { width: "0%" }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              />
            )}
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-x-4 gap-y-6 md:gap-y-0">
          {PROCESS_STEPS.map((step, i) => (
            <motion.div key={step.num}
              className="flex flex-col items-center text-center md:items-start md:text-left"
              style={{ gap: 12 }}
              initial={reduced ? undefined : { opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ delay: 0.15 + i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div style={{
                position: "relative", zIndex: 1, width: 44, height: 44, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                background: BG, border: `1px solid ${TEAL}40`,
              }}>
                <span style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 13, color: TEAL }}>{step.num}</span>
              </div>
              <span style={{ fontSize: 17, fontWeight: 500, color: "rgba(244,250,248,0.55)" }}>
                {lang === "ru" ? step.ru : step.en}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
