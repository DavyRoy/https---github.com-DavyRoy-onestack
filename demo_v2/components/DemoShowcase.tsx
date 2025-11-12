"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ShoppingCart,
  Wrench,
  CalendarCheck,
  LayoutDashboard,
  ArrowUpRight,
  User,
  Briefcase,
  Shield,
} from "lucide-react";

type ShowcaseItem = {
  title: string;
  description: string;
  bullets: string[];
  href: string;
  cta: string;
  icon: React.ElementType;
  role: { label: string; icon: React.ElementType };
};

const ITEMS: ShowcaseItem[] = [
  {
    title: "Shop",
    description:
      "Полноценная витрина, корзина и оплата. Показываем, как работает каталог, фильтры, промокоды и статусы заказов.",
    bullets: ["Категории, подборки, поиск", "Корзина с модификаторами и чекаут", "Уведомления, статусы и история оплаты"],
    href: "/demo/user/shop",
    cta: "Открыть витрину",
    icon: ShoppingCart,
    role: { label: "User", icon: User },
  },
  {
    title: "Service",
    description:
      "Клиентский и менеджерский обзор услуг: заявки, статусы и коммуникации. Удобно для салонов, медцентров и b2b-сервисов.",
    bullets: ["Онлайн-заявка и опросник", "Статусы, комментарии, файлы", "Быстрые шаблоны ответов и чат"],
    href: "/demo/manager/services",
    cta: "Панель менеджера",
    icon: Wrench,
    role: { label: "Manager", icon: Briefcase }, // было Brief → исправил
  },
  {
    title: "Booking",
    description:
      "Календарь, ресурсы и расписания с переносами и исключениями. Демонстрируем, как управлять доступностью в пару кликов.",
    bullets: ["Сетки, ресурсы, мастер-слоты", "Подтверждение и перенос", "Наглядный календарь для команды"],
    href: "/demo/manager/booking",
    cta: "К календарю",
    icon: CalendarCheck,
    role: { label: "Manager", icon: Briefcase }, // было Brief → исправил
  },
  {
    title: "CRM",
    description:
      "Дашборды, отчёты и управление ролями. Администратор видит ключевые метрики, тарифы и настройки интеграций.",
    bullets: ["Дашборды по продажам", "Управление ролями, тарифами", "Настройка SSO, аудит действий"],
    href: "/demo/admin",
    cta: "Панель администратора",
    icon: LayoutDashboard,
    role: { label: "Admin", icon: Shield },
  },
];

export default function DemoShowcase() {
  const reduced = useReducedMotion();
  const fade = (delay = 0) =>
    reduced ? {} : {
      initial: { opacity: 0, y: 18 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, amount: 0.2 },
      transition: { delay, duration: 0.45, ease: "easeOut" },
    };

  return (
    <section id="tour" aria-labelledby="demo-showcase-title" className="relative overflow-hidden bg-[hsl(var(--bg))] text-[hsl(var(--fg))]">
      {/* Лёгкий фон как в остальных секциях */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_0%_0%,hsl(var(--brand))/7%,transparent_55%)]" />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <motion.p {...fade(0)} className="text-[11px] uppercase tracking-[0.24em] text-[hsl(var(--muted))]">
          сценарии демо
        </motion.p>

        <motion.h2 id="demo-showcase-title" {...fade(0.05)} className="mt-3 text-balance text-[clamp(1.8rem,4.2vw,3rem)] font-semibold">
          Магазин, услуги, бронирование и CRM в одном продукте
        </motion.h2>

        <motion.p {...fade(0.1)} className="mt-3 max-w-3xl text-[15px] md:text-[17px] leading-relaxed text-[hsl(var(--muted))]">
          От клиентского пути до операционного управления. Запускайте каждый сценарий с готовой структурой
          данных, доступами и UI-компонентами.
        </motion.p>

        {/* Карточки */}
        <motion.div {...fade(0.15)} className="mt-10 grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2">
          {ITEMS.map((item, index) => {
            const Icon = item.icon;
            const RoleIcon = item.role.icon;
            const titleId = `card-title-${index}`;
            const descId = `showcase-desc-${index}`;

            return (
              <motion.article
                key={item.title}
                {...fade(0.16 + index * 0.03)}
                aria-labelledby={titleId}
                aria-describedby={descId}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))] p-5 sm:p-6 transition-all hover:-translate-y-[2px] hover:border-[hsl(var(--border-strong))] hover:shadow-md focus-within:-translate-y-[2px] focus-within:shadow-md"
              >
                {/* Стретч-ссылка — вся карточка кликабельна и доступна с клавиатуры */}
                <Link
                  href={item.href}
                  prefetch={false}
                  className="absolute inset-0"
                  aria-labelledby={titleId}
                  aria-describedby={descId}
                >
                  <span className="sr-only">{item.cta}</span>
                </Link>

                {/* Шапка */}
                <div className="relative z-10 flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--bg))] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[hsl(var(--muted))]">
                    <Icon className="h-4 w-4" aria-hidden />
                    {item.title}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[hsl(var(--muted))]">
                    <RoleIcon className="h-3.5 w-3.5" aria-hidden />
                    {item.role.label}
                  </span>
                </div>

                {/* Описание */}
                <h3 id={titleId} className="sr-only">
                  {item.title}
                </h3>
                <p id={descId} className="relative z-10 mt-4 text-[14px] md:text-[15px] leading-6 text-[hsl(var(--muted))]">
                  {item.description}
                </p>

                {/* Буллеты */}
                <ul className="relative z-10 mt-5 space-y-2.5 text-[13px] md:text-[14px] leading-6 text-[hsl(var(--muted))]">
                  {item.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-2.5">
                      <span className="mt-[10px] h-1.5 w-1.5 rounded-full bg-[hsl(var(--muted))]" aria-hidden />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA (видимая вторичная кнопка, но основной клик — по карточке) */}
                <div className="relative z-10 mt-6">
                  <Link
                    href={item.href}
                    prefetch={false}
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-5 h-11 text-[14px] font-semibold
                               focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand))] focus:ring-offset-2 focus:ring-offset-[hsl(var(--panel))]
                               hover:bg-[hsl(var(--panel))]/90 active:bg-[hsl(var(--panel))]/85 transition-colors"
                  >
                    {item.cta}
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}