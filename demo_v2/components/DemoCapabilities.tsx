"use client";

import { useMemo, useState, useId } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ShoppingBag,
  CalendarCheck,
  Briefcase,
  BarChart3,
  Workflow,
  Bot,
  Smartphone,
  MonitorSmartphone,
  Globe,
  Code2,
  ShieldCheck,
  Server,
  Cloud,
  Rocket,
} from "lucide-react";

type Capability = {
  title: string;
  tagline: string;
  bullets: string[];
  icon: React.ElementType;
  badge: string;
  type: "web" | "mobile";
};

const CAPABILITIES: Capability[] = [
  { title: "Коммерция", tagline: "Каталоги, корзины, оплаты и повторные продажи",
    bullets: ["Веб-витрина и мобильные карточки","Промокоды, скидки, персональные прайсы","Оплаты Stripe/ЮKassa, статусы и возвраты"],
    icon: ShoppingBag, badge: "Commerce", type: "mobile" },
  { title: "Услуги и бронирование", tagline: "Запись, графики, ресурсы и мастер-аккаунты",
    bullets: ["Мастера, ресурсы, доступность и перенос","Напоминания по SMS/E-mail, депозитные оплаты","Мобильный календарь и подтверждения в один тап"],
    icon: CalendarCheck, badge: "Scheduling", type: "mobile" },
  { title: "CRM и продажи", tagline: "Лиды, сделки, воронки и автоматизация",
    bullets: ["Канбан и карточки клиента","История коммуникаций и SLA","Автозадачи, чек-листы и webhooks"],
    icon: Briefcase, badge: "CRM", type: "web" },
  { title: "Аналитика", tagline: "Дашборды, когортный анализ, прогнозы",
    bullets: ["Гибкие фильтры и сегменты","Экспорт CSV/XLSX, подписки на отчёты","ClickHouse/BI и мобильные сводки"],
    icon: BarChart3, badge: "Analytics", type: "web" },
  { title: "Операции", tagline: "Флоу, очереди, интеграции",
    bullets: ["Интеграции с CRM/ERP и складом","Очереди, фоновые задачи, ретраи","Роли, аудит событий, централизованные настройки"],
    icon: Workflow, badge: "Ops", type: "web" },
  { title: "AI и персонализация", tagline: "Помощники, рекомендации и мобильные уведомления",
    bullets: ["AI-консьерж в интерфейсе","Подбор контента, товары/услуги","Ubiquitous push: web и мобильные приложения"],
    icon: Bot, badge: "AI", type: "mobile" },
  { title: "Веб-интерфейсы", tagline: "Компоненты и шаблоны для web-приложений",
    bullets: ["UI-компоненты на Tailwind/React","Готовые лэйауты страниц","Светлая/тёмная тема и токены"],
    icon: Globe, badge: "Web UI", type: "web" },
  { title: "Фронтенд", tagline: "Готовая архитектура и сборка",
    bullets: ["Next.js 15 и React 19","Server Actions и оптимизация","CI/CD и линтинг кода"],
    icon: Code2, badge: "Frontend", type: "web" },
  { title: "Безопасность", tagline: "Роли, права и безопасные операции",
    bullets: ["RBAC и JWT-аутентификация","OAuth2/SAML, 2FA","Логи и аудит действий"],
    icon: ShieldCheck, badge: "Security", type: "web" },
  { title: "Бэкенд", tagline: "Надёжный API и модульная структура",
    bullets: ["Node.js + PostgreSQL","Очереди и фоновые задачи","Встроенные webhooks и API Gateway"],
    icon: Server, badge: "Backend", type: "web" },
  { title: "Инфраструктура", tagline: "Готовая DevOps-среда и деплой",
    bullets: ["Docker и контейнеризация","Cloud Run / Kubernetes","Мониторинг и алерты"],
    icon: Cloud, badge: "Infra", type: "web" },
  { title: "Запуск", tagline: "Сборка, предпросмотр, публикация",
    bullets: ["Предпросмотр в staging-среде","CI/CD пайплайны","Быстрый релиз за 2–3 недели"],
    icon: Rocket, badge: "Launch", type: "web" },
];

type Filter = "all" | "web" | "mobile";

export default function DemoCapabilities() {
  const reduced = useReducedMotion();
  const [filter, setFilter] = useState<Filter>("all");
  const listId = useId();
  const countId = useId();

  const items = useMemo(
    () => (filter === "all" ? CAPABILITIES : CAPABILITIES.filter((c) => c.type === filter)),
    [filter]
  );

  const fade = (delay = 0) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.2 },
          transition: { delay, duration: 0.35, ease: "easeOut" },
        };

  return (
    <section
      id="capabilities"
      aria-labelledby="demo-capabilities-title"
      className="relative overflow-hidden bg-[hsl(var(--bg))] text-[hsl(var(--fg))]"
    >
      {/* мягкий градиентный фон в духе Linear */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_100%_0%,hsl(var(--brand))/7%,transparent_55%)]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 md:py-24 lg:px-8">
        <motion.p {...fade(0)} className="text-[11px] uppercase tracking-[0.24em] text-[hsl(var(--muted))]">
          модули
        </motion.p>

        <motion.h2
          id="demo-capabilities-title"
          {...fade(0.05)}
          className="mt-3 text-balance text-[clamp(1.9rem,4vw,3.1rem)] font-semibold"
        >
          Подключаем модули под веб и мобильные сценарии
        </motion.h2>

        <motion.p
          {...fade(0.1)}
          className="mt-3 max-w-3xl text-[15px] md:text-[17px] leading-relaxed text-[hsl(var(--muted))]"
        >
          Конструктор OneStack покрывает ядро продукта: от UI и коммерции до аналитики, AI и DevOps. Соберите
          свой стек для веб и мобильных приложений.
        </motion.p>

        {/* сегменты-фильтры */}
        <motion.div
          {...fade(0.12)}
          role="tablist"
          aria-label="Фильтр типов модулей"
          className="mt-6 inline-flex rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]/70 p-1 backdrop-blur"
        >
          <SegTab active={filter === "all"} onClick={() => setFilter("all")} id="seg-all">Все</SegTab>
          <SegTab active={filter === "web"} onClick={() => setFilter("web")} id="seg-web" icon={<MonitorSmartphone className="h-4 w-4" aria-hidden />}>Web</SegTab>
          <SegTab active={filter === "mobile"} onClick={() => setFilter("mobile")} id="seg-mobile" icon={<Smartphone className="h-4 w-4" aria-hidden />}>Mobile</SegTab>
        </motion.div>

        {/* кол-во найденных */}
        <div id={countId} className="mt-2 text-xs text-[hsl(var(--muted))]" aria-live="polite">
          Показано модулей: {items.length}
        </div>

        {/* список с микроразметкой ItemList */}
        <motion.ul
          {...fade(0.15)}
          role="list"
          aria-describedby={countId}
          className="mt-8 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3"
          itemScope
          itemType="https://schema.org/ItemList"
          id={listId}
        >
          {items.map((item, index) => {
            const Icon = item.icon;
            const DeviceIcon = item.type === "mobile" ? Smartphone : MonitorSmartphone;
            return (
              <motion.li
                key={`${item.title}-${item.type}`}
                {...fade(0.16 + index * 0.03)}
                className="flex h-full flex-col rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))] p-5 sm:p-6 transition-all hover:-translate-y-[2px] hover:border-[hsl(var(--border-strong))] hover:shadow-md"
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
              >
                <meta itemProp="position" content={String(index + 1)} />
                <article className="flex h-full flex-col" itemScope itemType="https://schema.org/Offer">
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--bg))] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[hsl(var(--muted))]">
                      <Icon className="h-4 w-4" aria-hidden />
                      <span itemProp="category">{item.badge}</span>
                    </span>
                    <DeviceIcon className="h-4 w-4 text-[hsl(var(--muted))]" aria-hidden />
                  </div>

                  <h3 className="mt-4 text-[18px] md:text-[20px] font-semibold" itemProp="name">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[14px] md:text-[15px] leading-6 text-[hsl(var(--muted))]" itemProp="description">
                    {item.tagline}
                  </p>

                  <ul className="mt-5 space-y-2.5 text-[13.5px] md:text-[14px] leading-6 text-[hsl(var(--muted))]">
                    {item.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-2.5">
                        <span className="mt-[9px] h-1.5 w-1.5 rounded-full bg-[hsl(var(--muted))]" aria-hidden />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}

/* ─────────────────────────── UI: Segmented Tab ─────────────────────────── */
function SegTab({
  active,
  onClick,
  id,
  children,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  id: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <button
      id={id}
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={[
        "relative inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm transition",
        active
          ? "bg-[hsl(var(--control-bg))] text-white shadow-sm"
          : "text-[hsl(var(--muted))] hover:text-[hsl(var(--fg))]"
      ].join(" ")}
    >
      {icon}
      {children}
    </button>
  );
}