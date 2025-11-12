// src/components/HomeAbout.tsx
"use client";

import { useEffect, useMemo, useRef } from "react";
import Script from "next/script";
import { motion, useReducedMotion, useInView } from "framer-motion";
import { Award, HeartHandshake, Sparkles, Timer, Users2, ShieldCheck } from "lucide-react";

/* ================== animation presets (respect reduced motion) ================== */

const fadeUp = (d = 0, rm = false) => ({
  initial: rm ? {} : { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  transition: rm ? { duration: 0 } : { duration: 0.5, ease: "easeOut", delay: d },
  viewport: { once: true, amount: 0.25 },
});

const staggerParent = (delay = 0, rm = false) => ({
  initial: {},
  whileInView: rm ? {} : { transition: { staggerChildren: 0.06, delayChildren: delay } },
  viewport: { once: true, amount: 0.2 },
});

const staggerItem = (rm = false) => ({
  initial: rm ? {} : { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0, transition: rm ? { duration: 0 } : { duration: 0.4, ease: "easeOut" } },
});

/* ===== дополнительные анимации (loop) ===== */
const floatLoop = (rm = false, delay = 0) =>
  rm
    ? {}
    : {
        animate: { y: [0, -10, 0], x: [0, 8, 0], scale: [1, 1.04, 1] },
        transition: { duration: 10, ease: "easeInOut", repeat: Infinity, delay },
      };

const pulseLoop = (rm = false, delay = 0) =>
  rm
    ? {}
    : {
        animate: { scale: [1, 1.25, 1], opacity: [0.85, 1, 0.85] },
        transition: { duration: 2.4, ease: "easeInOut", repeat: Infinity, delay },
      };

/* ================== static data ================== */

const METRICS = [
  { key: "projects", value: 120, suffix: "+", label: "проектов", sub: "за последние 3 года" },
  { key: "retention", value: 92, suffix: "%", label: "ретеншн", sub: "возвращаются за фичами" },
  { key: "ttm", value: 2, suffix: "–8 нед.", label: "TTM", sub: "до первого релиза" },
  { key: "nps", value: 76, label: "NPS", sub: "по итогам 2024–2025" },
] as const;

const VALUES = [
  {
    icon: <HeartHandshake className="h-5 w-5" aria-hidden="true" />,
    title: "Партнёрство, не аутсорс",
    text:
      "Погружаемся в продукт: метрики, воронки, юнит-экономика. Вместе формируем ценность и гипотезы, а не «делаем по ТЗ».",
  },
  {
    icon: <Timer className="h-5 w-5" aria-hidden="true" />,
    title: "Скорость без хаоса",
    text:
      "Короткие спринты, превью-окружения, тесты и CI/CD. Регулярные демо и предсказуемые релизы без простоев.",
  },
  {
    icon: <ShieldCheck className="h-5 w-5" aria-hidden="true" />,
    title: "Надёжность и поддержка",
    text:
      "SLA-планы, мониторинг, алерты и бэкапы. Инцидент-менеджмент, постмортемы и постоянное улучшение качества.",
  },
] as const;

const TIMELINE = [
  { t: "Бриф и сессия целей", d: "30–60 минут: KPI, метрики успеха, ограничения и риски." },
  { t: "Смета и роадмап", d: "Оценка, план релизов, определение MVP и приоритетов." },
  { t: "Дизайн и архитектура", d: "Дизайн-система, схемы данных, интеграции, инфраструктура и CI/CD." },
  { t: "Разработка и демо", d: "Итерации по 1–2 недели, демо, сбор фидбэка и корректировки." },
  { t: "Запуск и поддержка", d: "Релиз, наблюдаемость, SLA. Рост по данным и обратной связи." },
] as const;

const BADGES = [
  {
    icon: <Award className="h-5 w-5" aria-hidden="true" />,
    title: "Top Rated",
    text: "Клиентский рейтинг 4.9/5 за 2+ года",
  },
  {
    icon: <Users2 className="h-5 w-5" aria-hidden="true" />,
    title: "Команда синьоров",
    text: "Senior-уровень на ключевых ролях",
  },
  {
    icon: <Sparkles className="h-5 w-5" aria-hidden="true" />,
    title: "Design-driven",
    text: "Сильная связка дизайн ↔ разработка",
  },
] as const;

/* ================== helpers ================== */

/**
 * Счётчик «от 0 до to» при появлении контейнера во вьюпорте (один раз).
 * Уважает prefers-reduced-motion.
 */
function useCountUpOnView(
  numberElRef: React.RefObject<HTMLElement>,
  containerRef: React.RefObject<HTMLElement>,
  to: number,
  durationMs = 1000
) {
  const prefersReduced = useReducedMotion();
  const inView = useInView(containerRef, { amount: 0.3, once: true });
  const hasRunRef = useRef(false);

  useEffect(() => {
    const el = numberElRef.current;
    if (!el || hasRunRef.current) return;

    if (prefersReduced) {
      el.textContent = String(to);
      hasRunRef.current = true;
      return;
    }

    if (!inView) return;

    hasRunRef.current = true;
    let raf = 0;
    let start = 0;

    const animate = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / durationMs);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = String(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [numberElRef, containerRef, to, durationMs, inView, prefersReduced]);
}

function Metric({
  value,
  suffix,
  label,
  sub,
  delay = 0,
  rm = false,
}: {
  value: number;
  suffix?: string;
  label: string;
  sub: string;
  delay?: number;
  rm?: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);

  // Запуск счётчика при входе карточки в вьюпорт
  useCountUpOnView(numberRef, cardRef, value, 1100);

  const numberAndSuffix = useMemo(() => {
    const NumberSpan = (
      <motion.span
        ref={numberRef as any}
        aria-hidden
        className="tabular-nums inline-block"
        initial={rm ? {} : { scale: 0.9, opacity: 0, y: 8 }}
        whileInView={{ scale: 1, opacity: 1, y: 0 }}
        transition={rm ? { duration: 0 } : { duration: 0.45, ease: "easeOut", delay: 0.05 }}
      />
    );

    if (suffix?.includes("–")) {
      // «2–8 нед.» — анимируем только левую часть (число), тире и текст статичны
      return (
        <>
          {NumberSpan}
          <span className="tabular-nums"> {suffix}</span>
        </>
      );
    }
    return (
      <>
        {NumberSpan}
        {!!suffix && <span className="tabular-nums">{suffix}</span>}
      </>
    );
  }, [suffix, rm]);

  const id = `metric-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <motion.div
      ref={cardRef}
      {...fadeUp(delay, rm)}
      whileHover={rm ? undefined : { y: -2, boxShadow: "0 10px 30px rgba(255,255,255,0.06)" }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-5
                 focus-within:ring-2 focus-within:ring-white/30
                 flex flex-col items-center text-center"
      role="group"
      aria-labelledby={`${id}-label`}
      aria-describedby={`${id}-sub`}
      tabIndex={-1}
    >
      <div className="text-2xl md:text-3xl font-extrabold leading-none">
        {/* Для скринридеров сразу финал */}
        <span className="sr-only">
          {value}
          {suffix ?? ""}
        </span>
        {/* Визуальная анимированная часть */}
        <span aria-hidden>{numberAndSuffix}</span>
      </div>
      <div id={`${id}-label`} className="mt-1 text-white/85 font-medium">
        {label}
      </div>
      <div id={`${id}-sub`} className="mt-1 text-xs text-white/55">
        {sub}
      </div>
    </motion.div>
  );
}

/* ================== main ================== */

export default function HomeAbout() {
  const rm = useReducedMotion();

  // JSON-LD Organization для SEO
  const orgJsonLd = useMemo(() => {
    const url =
      (typeof process !== "undefined" && (process as any).env?.NEXT_PUBLIC_SITE_URL) ||
      "https://onestack24.ru";
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "OneStack",
      url,
      logo: `${url}/vercal.png`,
      sameAs: ["https://t.me/onestack_team", "https://github.com/", "https://www.linkedin.com/"],
      description:
        "OneStack — разработка сайтов, веб-приложений и мобильных приложений. Архитектура, дизайн-система, интеграции, CI/CD и поддержка по SLA.",
    };
  }, []);

  const descId = "about-desc";

  return (
    <section
      id="about"
      className="relative w-full overflow-hidden bg-gradient-to-b from-black via-[#0a0a0a] to-black text-white
                 pt-20 pb-24 md:pt-24 md:pb-28"
      aria-labelledby="about-title"
      aria-describedby={descId}
    >
      {/* JSON-LD через next/script */}
      <Script
        id="ld-org-about"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />

      {/* мягкие свечения + плавание */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-white/[0.035] blur-3xl"
        {...floatLoop(rm, 0)}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-40 h-[420px] w-[420px] rounded-full bg-white/[0.035] blur-3xl"
        {...floatLoop(rm, 1.2)}
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-12 lg:px-20">
        {/* заголовок и вводный текст */}
        <motion.p {...fadeUp(0, rm)} className="text-sm uppercase tracking-[0.25em] text-white/50">
          О нас
        </motion.p>

        <motion.h2
          {...fadeUp(0.05, rm)}
          id="about-title"
          className="mt-2 text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight"
        >
          Команда, которая доводит продукт от идеи до релиза — и развивает дальше
        </motion.h2>

        {/* sr-only описание для SEO/скринридеров */}
        <p id={descId} className="sr-only">
          Мы — компактная команда инженеров и дизайнеров полного цикла: сайты, веб-приложения, мобильные приложения,
          инфраструктура и поддержка по SLA. Прозрачные сроки и демо каждые 1–2 недели.
        </p>

        <motion.p {...fadeUp(0.1, rm)} className="mt-4 max-w-3xl text-white/70">
          OneStack — компактная команда инженеров и дизайнеров полного цикла. Мы создаём быстрые сайты, надёжные веб-приложения и мобильные приложения, настраиваем инфраструктуру, CI/CD и интеграции (CRM, платежи, аналитика). После релиза берём продукт на поддержку по SLA. Работаем прозрачно: понятная смета, сроки и демо каждые 1–2 недели.
        </motion.p>

        {/* метрики */}
        <motion.div
          {...staggerParent(0.15, rm)}
          className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4"
          aria-label="Ключевые метрики"
        >
          <dl className="contents">
            {METRICS.map((m, i) => (
              <div key={m.key} className="contents">
                <Metric
                  value={m.value}
                  suffix={m.suffix}
                  label={m.label}
                  sub={m.sub}
                  delay={i * 0.03}
                  rm={rm}
                />
              </div>
            ))}
          </dl>
        </motion.div>

        {/* ценности */}
        <motion.div
          {...staggerParent(0.2, rm)}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch"
          aria-label="Наши принципы работы"
        >
          {VALUES.map((v, i) => (
            <motion.article
              key={v.title}
              variants={staggerItem(rm)}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true, amount: 0.25 }}
              whileHover={rm ? undefined : { y: -3, backgroundColor: "rgba(255,255,255,0.08)" }}
              transition={{ type: "spring", stiffness: 260, damping: 22, delay: i * 0.02 }}
              className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-5 focus-within:ring-2 focus-within:ring-white/30"
            >
              <div className="flex items-center gap-2 text-white/90">
                {v.icon}
                <h3 className="text-base font-semibold">{v.title}</h3>
              </div>
              <p className="mt-2 text-sm text-white/70">{v.text}</p>
            </motion.article>
          ))}
        </motion.div>

        {/* мини-таймлайн */}
        <motion.div
          {...fadeUp(0.25, rm)}
          className="mt-14 rounded-2xl border border-white/10 bg-white/[0.03] p-6"
          aria-label="Как мы работаем"
        >
          <div className="text-sm font-semibold text-white/80">Как мы работаем</div>
          <ol className="mt-4 relative">
            <span
              aria-hidden
              className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-white/10 via-white/20 to-white/10"
            />
            {TIMELINE.map((s, idx) => (
              <li key={s.t} className="relative pl-10 pb-6 last:pb-0">
                {/* пульсирующая точка */}
                <motion.span
                  className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-white/80 shadow-[0_0_0_3px_rgba(255,255,255,0.15)]"
                  aria-hidden="true"
                  {...pulseLoop(rm, idx * 0.2)}
                />
                <div className="font-semibold">{s.t}</div>
                <div className="mt-1 text-white/65 text-sm">{s.d}</div>
              </li>
            ))}
          </ol>
        </motion.div>

        {/* бейджи / соц-доказательства */}
        <motion.div
          {...staggerParent(0.3, rm)}
          className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4"
          aria-label="Социальные доказательства"
        >
          {BADGES.map((b, i) => (
            <motion.div
              key={b.title}
              variants={staggerItem(rm)}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true, amount: 0.25 }}
              whileHover={rm ? undefined : { y: -2, boxShadow: "0 10px 30px rgba(255,255,255,0.08)" }}
              transition={{ type: "spring", stiffness: 260, damping: 22, delay: i * 0.02 }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex items-start gap-3 focus-within:ring-2 focus-within:ring-white/30"
              role="article"
            >
              <div className="shrink-0 rounded-xl bg-white/10 p-2">{b.icon}</div>
              <div>
                <div className="font-semibold">{b.title}</div>
                <div className="text-sm text-white/70 mt-0.5">{b.text}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}