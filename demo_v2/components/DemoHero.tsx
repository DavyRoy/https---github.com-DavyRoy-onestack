"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck, Smartphone, UsersRound, Clock3 } from "lucide-react";

/* ----------------------------- UI helpers ----------------------------- */
const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-full h-11 px-5 text-sm font-semibold transition outline-none";
const btnPrimary =
  "bg-[hsl(var(--brand))] text-white hover:opacity-90 active:opacity-80 focus:ring-2 focus:ring-[hsl(var(--brand))]/60 focus:ring-offset-2 focus:ring-offset-[hsl(var(--panel))]";
const btnGhost =
  "border border-[hsl(var(--border))] bg-transparent text-[hsl(var(--fg))] hover:bg-[hsl(var(--panel))]/80 focus:ring-2 focus:ring-[hsl(var(--brand))] focus:ring-offset-2 focus:ring-offset-[hsl(var(--panel))]";

/* ------------------------------ Data ---------------------------------- */
const features = [
  { title: "3 роли", desc: "Пользователь, менеджер и администратор — наглядно показываем, как устроены права и интерфейсы.", icon: UsersRound },
  { title: "Веб + мобайл", desc: "Сценарии адаптированы под разные экраны: от витрины и корзины до CRM и отчётов.", icon: Smartphone },
  { title: "Готовые флоу", desc: "Магазин, услуги, бронирование и CRM — демонстрация ключевых потоков без лишней настройки.", icon: Sparkles },
] as const;

const stats = [
  { label: "Модулей", value: "40+" },
  { label: "Интеграций", value: "15" },
  { label: "Спринт на запуск", value: "2–3 недели" },
] as const;

/* ----------------------------- Component ------------------------------- */
export default function DemoHero() {
  const reduced = useReducedMotion();

  const fadeUp = (delay = 0) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: 0.45, ease: "easeOut" },
        };

  return (
    <section
      id="intro"
      aria-labelledby="demo-hero-title"
      className="relative overflow-hidden bg-[hsl(var(--bg))] text-[hsl(var(--fg))] scroll-mt-20"
    >
      {/* Декоративный фон в духе Linear */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -top-24 right-[-10%] h-[50vh] w-[50vw] rounded-full blur-3xl opacity-20 bg-[radial-gradient(60%_60%_at_50%_50%,hsl(var(--brand))_0%,transparent_60%)]" />
        <div className="absolute bottom-[-20%] left-[-10%] h-[45vh] w-[55vw] rounded-full blur-3xl opacity-10 bg-[radial-gradient(60%_60%_at_50%_50%,white_0%,transparent_60%)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[78vh] w-full max-w-7xl flex-col justify-center px-4 pt-24 pb-16 sm:px-6 md:px-10 md:pt-28 md:pb-24">
        {/* Meta tag */}
        <motion.div
          {...fadeUp(0)}
          className="inline-flex items-center gap-2 self-start rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/80 px-3.5 py-2 text-[10px] uppercase tracking-[0.28em] text-[hsl(var(--muted))] backdrop-blur"
        >
          <ShieldCheck className="h-3 w-3" aria-hidden />
          demo-платформа
        </motion.div>

        {/* Title */}
        <motion.h1
          id="demo-hero-title"
          {...fadeUp(0.05)}
          className="mt-5 max-w-4xl text-balance text-[clamp(1.9rem,6vw,4.2rem)] font-semibold leading-[1.02]"
        >
          Современное демо{" "}
          <span className="text-[hsl(var(--muted))]">веб-приложения и мобильного опыта</span> для бизнеса
        </motion.h1>

        {/* Lead */}
        <motion.p
          {...fadeUp(0.1)}
          className="mt-4 max-w-2xl text-[15px] md:text-[16px] leading-relaxed text-[hsl(var(--muted))]"
        >
          Покажите клиенту готовый продукт вместо прототипа. Переключайте роли, проходите воронку от витрины и
          корзины до CRM и аналитики. Все сценарии собраны в едином минималистичном UI.
        </motion.p>

        {/* CTAs */}
        <motion.div
          {...fadeUp(0.15)}
          className="mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4 sm:items-start"
          role="group"
          aria-label="Действия"
        >
          <Link href="#tour" prefetch={false} className={`${btnBase} ${btnPrimary} w-full sm:w-auto`}>
            <ArrowRight className="h-4 w-4" aria-hidden />
            Смотреть сценарии
          </Link>
          <Link href="/" prefetch={false} className={`${btnBase} ${btnGhost} w-full sm:w-auto`}>
            На основной сайт
          </Link>
        </motion.div>

        {/* Features */}
        <motion.ul
          {...fadeUp(0.2)}
          className="mt-10 grid w-full gap-3.5 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3"
          aria-label="Особенности демо"
          role="list"
        >
          {features.map(({ title, desc, icon: Icon }) => (
            <li
              key={title}
              className="group relative overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/80 p-4 sm:p-5 transition-colors hover:bg-[hsl(var(--panel))]/95 backdrop-blur"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--bg))] text-[hsl(var(--fg))]">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <p className="text-[14px] font-semibold">{title}</p>
              </div>
              <p className="mt-2.5 text-[13.5px] leading-6 text-[hsl(var(--muted))]">{desc}</p>
            </li>
          ))}
        </motion.ul>

        {/* Stats */}
        <motion.ul
          {...fadeUp(0.25)}
          className="mt-8 flex flex-wrap gap-3.5 text-[13.5px] text-[hsl(var(--muted))]"
          aria-label="Ключевые показатели демо"
          role="list"
        >
          {stats.map((stat) => (
            <li
              key={stat.label}
              className="flex items-center gap-3 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/80 px-4 py-2 backdrop-blur"
            >
              <span className="text-base font-semibold text-[hsl(var(--fg))]">{stat.value}</span>
              <span>{stat.label}</span>
            </li>
          ))}
          <li className="flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/80 px-4 py-2 backdrop-blur">
            <Clock3 className="h-4 w-4" aria-hidden />
            Доступно 24/7 без регистрации
          </li>
        </motion.ul>
      </div>
    </section>
  );
}