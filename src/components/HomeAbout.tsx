"use client";
import { serif } from "@/lib/fonts";

import { useId, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Script from "next/script";
import { siteName, siteUrl } from "@/app/seo.config";
import { useI18n } from "@/i18n/I18nProvider";


const BG    = "#07100e";
const TEAL  = "#2dd4bf";
const WHITE = "#f4faf8";
const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

/* ─── Data ─────────────────────────────────────────────────────────────── */
const STACK = [
  { label: "Frontend",   items: ["Next.js", "React", "TypeScript", "Tailwind"] },
  { label: "Backend",    items: ["Node.js", "Python", "Go", "PostgreSQL"]       },
  { label: "Mobile",     items: ["React Native", "Flutter", "iOS", "Android"]   },
  { label: "DevOps",     items: ["Docker", "CI/CD", "Nginx", "YC / VK Cloud"]  },
] as const;

/* ─── Copy ───────────────────────────────────────────────────────────────── */
const COPY = {
  ru: {
    eyebrow: "О команде",
    titleLine1: "О",
    titleLine2: "команде",
    intro: "OneStack — компактная команда инженеров и дизайнеров полного цикла. Создаём быстрые сайты, надёжные веб-приложения и мобильные приложения. Берём проекты целиком: от идеи до релиза и поддержки.",
    techLabel: "Технологии",
    facts: [
      { val: "150+",   label: "проектов сдано" },
      { val: "5",      label: "лет на рынке" },
      { val: "98%",    label: "сдаём в срок" },
      { val: "NPS 91", label: "индекс лояльности" },
    ],
    values: [
      { num: "01", title: "Партнёрство, не аутсорс", text: "Погружаемся в продукт: метрики, воронки, юнит-экономика. Вместе формируем ценность, а не «делаем по ТЗ»." },
      { num: "02", title: "Скорость без хаоса", text: "Короткие спринты, превью-окружения, тесты и CI/CD. Регулярные демо и предсказуемые релизы без простоев." },
      { num: "03", title: "Надёжность и поддержка", text: "SLA-планы, мониторинг, алерты и бэкапы. Инцидент-менеджмент и постоянное улучшение качества." },
    ],
    seoDescription: `${siteName} — команда инженеров и дизайнеров полного цикла. Сайты, веб-приложения, мобильные приложения, инфраструктура и поддержка по SLA.`,
  },
  en: {
    eyebrow: "About us",
    titleLine1: "About",
    titleLine2: "the team",
    intro: "OneStack is a compact full-cycle team of engineers and designers. We build fast websites, reliable web apps and mobile apps. We own projects end-to-end: from idea to launch and support.",
    techLabel: "Technologies",
    facts: [
      { val: "150+",   label: "projects delivered" },
      { val: "5",      label: "years in market" },
      { val: "98%",    label: "on-time delivery" },
      { val: "NPS 91", label: "loyalty index" },
    ],
    values: [
      { num: "01", title: "Partnership, not outsourcing", text: "We dive into the product: metrics, funnels, unit economics. We shape value together, not just \"deliver a spec\"." },
      { num: "02", title: "Speed without chaos", text: "Short sprints, preview environments, tests and CI/CD. Regular demos and predictable releases with no downtime." },
      { num: "03", title: "Reliability and support", text: "SLA plans, monitoring, alerts and backups. Incident management and continuous quality improvement." },
    ],
    seoDescription: `${siteName} — a full-cycle team of engineers and designers. Websites, web apps, mobile apps, infrastructure and SLA support.`,
  },
} as const;

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════════════════════════════════ */
export default function HomeAbout() {
  const { locale } = useI18n();
  const lang = locale === "ru" ? "ru" : "en";
  const c = COPY[lang];
  const reduced = useReducedMotion();
  const titleId = useId();

  const jsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: siteUrl,
    description: c.seoDescription,
  }), [c.seoDescription]);

  const fadeUp = (d = 0) => reduced ? {} : {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: d },
  };

  return (
    <>
      <Script id="ld-home-about" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section id="about" aria-labelledby={titleId}
        className="relative overflow-hidden" style={{ background: BG }}>

        <div className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: GRAIN, backgroundSize: "180px 180px" }} aria-hidden />
        <div className="pointer-events-none absolute top-[20%] right-[-12%] w-[600px] h-[600px] rounded-full blur-[240px]"
          style={{ background: TEAL, opacity: 0.055 }} aria-hidden />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-14 pt-16 sm:pt-20 pb-20 sm:pb-28">

          {/* Eyebrow */}
          <motion.div className="flex items-center gap-3 mb-8" {...fadeUp(0)}>
            <div style={{ height: 2, width: 20, background: TEAL, borderRadius: 2, flexShrink: 0 }} />
            <span className="text-[11px] tracking-[0.22em] uppercase font-medium" style={{ color: TEAL }}>
              {c.eyebrow}
            </span>
          </motion.div>

          {/* Headline */}
          <div className="mb-14 sm:mb-20">
            {[c.titleLine1, c.titleLine2].map((text, i) => (
              <motion.div key={i}
                className={`${serif.className} block font-normal leading-[1.0] tracking-[-0.04em]`}
                style={i === 0
                  ? { fontSize: "clamp(2.8rem, 7vw, 8rem)", WebkitTextStroke: `1.5px ${TEAL}`, color: "transparent" }
                  : { fontSize: "clamp(2.8rem, 7vw, 8rem)", color: WHITE }}
                initial={reduced ? undefined : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.05 + i * 0.07 }}>
                {text}
              </motion.div>
            ))}
          </div>

          {/* 2-col: intro | stack */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-16 sm:mb-20">

            {/* Left: intro + facts */}
            <div>
              <motion.p className="text-base sm:text-lg leading-relaxed mb-10 max-w-md"
                style={{ color: "rgba(244,250,248,0.55)" }} {...fadeUp(0.1)}>
                {c.intro}
              </motion.p>

              <motion.div className="grid grid-cols-2 gap-4" {...fadeUp(0.15)}>
                {c.facts.map(({ val, label }) => (
                  <div key={label} className="rounded-2xl p-5"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <p className={`${serif.className} text-3xl font-normal mb-1`} style={{ color: TEAL }}>{val}</p>
                    <p className="text-xs" style={{ color: "rgba(244,250,248,0.4)" }}>{label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: tech stack */}
            <motion.div className="space-y-3" {...fadeUp(0.2)}>
              <p className="text-[10px] tracking-[0.2em] uppercase mb-4"
                style={{ color: "rgba(244,250,248,0.3)" }}>{c.techLabel}</p>
              {STACK.map(({ label, items }, i) => (
                <motion.div key={label}
                  className="flex items-center gap-4 py-4 border-b"
                  style={{ borderColor: "rgba(255,255,255,0.06)" }}
                  initial={reduced ? undefined : { opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 + i * 0.07 }}>
                  <span className="text-xs font-medium w-20 shrink-0"
                    style={{ color: "rgba(244,250,248,0.3)" }}>{label}</span>
                  <div className="flex flex-wrap gap-2">
                    {items.map(item => (
                      <span key={item} className="text-xs px-2.5 py-1 rounded-full"
                        style={{ background: "rgba(45,212,191,0.07)", border: "1px solid rgba(45,212,191,0.15)", color: "rgba(244,250,248,0.6)" }}>
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Values */}
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5" {...fadeUp(0.25)}>
            {c.values.map((v, i) => (
              <motion.div key={v.num}
                className="rounded-2xl p-6 transition-all duration-300 cursor-default group"
                style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
                initial={reduced ? undefined : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ background: "rgba(45,212,191,0.04)", borderColor: "rgba(45,212,191,0.2)" }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}>
                <span className="text-[10px] font-mono mb-4 block" style={{ color: TEAL }}>{v.num}</span>
                <h3 className="text-sm font-semibold mb-3 leading-snug" style={{ color: WHITE }}>{v.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(244,250,248,0.45)" }}>{v.text}</p>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>
    </>
  );
}
