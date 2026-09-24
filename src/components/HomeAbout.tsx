"use client";
import { serif } from "@/lib/fonts";

import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useI18n } from "@/i18n/I18nProvider";


const TEAL  = "#2dd4bf";
const WHITE = "#f4faf8";

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
    eyebrow: "05 / О команде",
    titleLine1: "О",
    titleLine2: "команде",
    intro: "OneStack — команда инженеров и дизайнеров, которая берёт проект целиком: от идеи и сметы до запуска и поддержки. Вам не нужно собирать подрядчиков по частям — дизайн, разработка, инфраструктура и ИИ в одних руках.",
    techLabel: "Технологии",
    facts: [
      { val: "150+",   label: "проектов сдано" },
      { val: "6",      label: "лет на рынке" },
      { val: "98%",    label: "сдаём в срок" },
      { val: "1–2 нед", label: "спринт с демо результата" },
    ],
    values: [
      { num: "01", title: "Думаем о результате, а не о ТЗ", text: "Разбираемся в ваших метриках и воронке и предлагаем решения, которые приносят деньги, — даже если их не было в техзадании." },
      { num: "02", title: "Быстро и предсказуемо", text: "Спринты по 1–2 недели с демо в конце каждого. Вы видите прогресс и можете скорректировать курс, пока это дёшево." },
      { num: "03", title: "Отвечаем за продукт и после запуска", text: "Мониторинг, резервные копии и поддержка по SLA. Если что-то случится ночью, мы узнаем об этом раньше ваших клиентов." },
    ],
  },
  en: {
    eyebrow: "05 / About us",
    titleLine1: "About",
    titleLine2: "the team",
    intro: "OneStack is a team of engineers and designers that owns your project end to end — from idea and quote to launch and support. No need to juggle contractors: design, development, infrastructure and AI in one place.",
    techLabel: "Technologies",
    facts: [
      { val: "150+",   label: "projects delivered" },
      { val: "6",      label: "years in market" },
      { val: "98%",    label: "on-time delivery" },
      { val: "1–2 wks", label: "sprint with a demo" },
    ],
    values: [
      { num: "01", title: "Focused on results, not the spec", text: "We dig into your metrics and funnel and suggest what actually makes money — even if it was not in the brief." },
      { num: "02", title: "Fast and predictable", text: "1–2 week sprints with a demo at the end of each. You see progress and can change course while it is still cheap." },
      { num: "03", title: "Accountable after launch", text: "Monitoring, backups and SLA support. If something breaks at night, we know before your customers do." },
    ],
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

  const fadeUp = (d = 0) => reduced ? {} : {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay: d },
  };

  return (
    <>

      <section id="about" aria-labelledby={titleId}
        className="relative overflow-hidden" style={{ background: "transparent" }}>

        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-5 md:px-10 pb-[72px] md:pb-[110px]">

          {/* Header — matches the other blocks' header treatment */}
          <motion.div {...fadeUp(0)} style={{ padding: "clamp(72px,10svh,110px) 0 48px" }}>
            <p style={{ fontSize: 14, letterSpacing: "0.2em", textTransform: "uppercase", color: TEAL, marginBottom: 16 }}>
              {c.eyebrow}
            </p>
            <h2 id={titleId} className={serif.className}
              style={{ fontSize: "clamp(2.3rem, 5.06vw, 3.91rem)", fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.02em", color: WHITE, margin: 0 }}>
              {c.titleLine1} {c.titleLine2}
            </h2>
          </motion.div>

          {/* 2-col: intro | stack */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-16 sm:mb-20">

            {/* Left: intro + facts */}
            <div>
              <motion.p className="text-lg sm:text-xl leading-relaxed mb-10 max-w-md"
                style={{ color: "rgba(244,250,248,0.55)" }} {...fadeUp(0.1)}>
                {c.intro}
              </motion.p>

              <motion.div className="grid grid-cols-2 gap-4" {...fadeUp(0.15)}>
                {c.facts.map(({ val, label }) => (
                  <div key={label} className="rounded-2xl p-5"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <p className={`${serif.className} text-4xl font-normal mb-1`} style={{ color: TEAL }}>{val}</p>
                    <p className="text-base" style={{ color: "rgba(244,250,248,0.4)" }}>{label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: tech stack */}
            <motion.div className="space-y-3" {...fadeUp(0.2)}>
              <p className="text-[13px] tracking-[0.2em] uppercase mb-4"
                style={{ color: "rgba(244,250,248,0.3)" }}>{c.techLabel}</p>
              {STACK.map(({ label, items }, i) => (
                <motion.div key={label}
                  className="flex items-center gap-4 py-4 border-b"
                  style={{ borderColor: "rgba(255,255,255,0.06)" }}
                  initial={reduced ? undefined : { opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 + i * 0.07 }}>
                  <span className="text-base font-medium w-20 shrink-0"
                    style={{ color: "rgba(244,250,248,0.3)" }}>{label}</span>
                  <div className="flex flex-wrap gap-2">
                    {items.map(item => (
                      <span key={item} className="text-base px-2.5 py-1 rounded-full"
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
                <span className="text-[13px] font-mono mb-4 block" style={{ color: TEAL }}>{v.num}</span>
                <h3 className="text-lg font-semibold mb-3 leading-snug" style={{ color: WHITE }}>{v.title}</h3>
                <p className="text-base leading-relaxed" style={{ color: "rgba(244,250,248,0.45)" }}>{v.text}</p>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>
    </>
  );
}
