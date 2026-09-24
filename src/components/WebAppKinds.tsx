// src/components/WebAppKinds.tsx
"use client";
import { serif } from "@/lib/fonts";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Building2, ChartColumn, Check, Cloud, Handshake, UserRound, Users, type LucideIcon } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

/* ─── Data ───────────────────────────────────────────────────────────────── */
type Kind = "crm" | "portal" | "cabinet" | "analytics" | "b2b" | "saas";

type Item = {
  fig: string;
  title: string;
  desc: string;
  tech: string[];
  timeline: string;
  contactHint: string;
  useFor: string[];
  steps: string[];
  price: string;
  priceEn: string;
  image: string;
};

const TYPES_RU: Record<Kind, Item> = {
  crm: {
    fig: "01 · CRM", title: "CRM системы",
    desc: "Заменяет таблицы и мессенджеры: воронки, задачи, клиенты и аналитика в одном месте. Команда работает быстрее.",
    tech: ["Node.js","PostgreSQL","Redis","GraphQL/REST","WebSockets"], timeline: "8–16 нед", contactHint: "Обсудить CRM",
    useFor: ["Автоматизация отдела продаж", "Управление клиентской базой", "Аналитика воронок и конверсий"],
    steps: ["Аудит процессов и CJM", "MVP с воронкой и клиентами", "Интеграции с телефонией и почтой", "Аналитика и автоматизация"],
    price: "от 560 000 ₽", priceEn: "from $6 240", image: "/crm.png",
  },
  portal: {
    fig: "02 · PORTAL", title: "Корпоративные порталы",
    desc: "Один инструмент для всей команды: задачи, документы, коммуникации и права доступа. Без переключения между сервисами.",
    tech: ["SSO (OAuth/SAML)","Elasticsearch","Audit Logs","WebSockets"], timeline: "10–20 нед", contactHint: "Обсудить портал",
    useFor: ["Корпоративные коммуникации", "Документооборот и заявки", "Управление задачами команды"],
    steps: ["Ядро: новости и задачи", "SSO и роли доступа", "Интеграции с почтой и HR", "Расширение модулей"],
    price: "от 720 000 ₽", priceEn: "from $8 000", image: "/portal.png",
  },
  cabinet: {
    fig: "03 · CABINET", title: "Личные кабинеты",
    desc: "Клиент видит все свои данные, оплачивает и получает поддержку — без звонков в офис. Снижает нагрузку на команду.",
    tech: ["Next.js App Router","API Gateway","Email/Push","ACL","Redis"], timeline: "6–12 нед", contactHint: "Обсудить кабинет",
    useFor: ["B2C сервисы и подписки", "Личный кабинет клиента", "История заказов и оплаты"],
    steps: ["Авторизация и профиль", "История, оплаты и подписки", "Чат и уведомления", "SEO и производительность"],
    price: "от 400 000 ₽", priceEn: "from $4 480", image: "/client.png",
  },
  analytics: {
    fig: "04 · ANALYTICS", title: "Аналитические панели",
    desc: "Цифры вместо ощущений: KPI, воронки, отчёты в реальном времени. Решения принимаются быстрее и точнее.",
    tech: ["ETL","PostgreSQL/OLAP","ClickHouse","Redis Cache"], timeline: "6–10 нед", contactHint: "Обсудить аналитику",
    useFor: ["Мониторинг KPI и метрик", "Отчётность для руководства", "Продуктовая аналитика"],
    steps: ["Модель данных и ETL", "Дашборды и виджеты", "Фильтры и экспорт", "Расписание и рассылка"],
    price: "от 480 000 ₽", priceEn: "from $5 360", image: "/analitick.png",
  },
  b2b: {
    fig: "05 · B2B", title: "B2B платформы",
    desc: "B2B-продажи онлайн: каталог с прайсами, заказы и интеграция с ERP. Менеджеры тратят время на сделки, не на переписку.",
    tech: ["Server Actions","CDN","RBAC","Payment Gateway","Caching"], timeline: "10–18 нед", contactHint: "Обсудить B2B",
    useFor: ["Оптовые продажи", "Партнёрские кабинеты", "Интеграция с ERP и 1С"],
    steps: ["Каталог и прайсинг", "Корзина и заказ", "Интеграция с ERP", "Кабинет партнёра и аналитика"],
    price: "от 800 000 ₽", priceEn: "from $8 880", image: "/b2b.png",
  },
  saas: {
    fig: "06 · SAAS", title: "SaaS сервисы",
    desc: "Продукт, который растёт с вами: подписки, мультитенантность и архитектура под тысячи пользователей с первого дня.",
    tech: ["Prisma ORM","Feature Flags","Docker/K8s","CI/CD"], timeline: "12–24 нед", contactHint: "Обсудить SaaS",
    useFor: ["Мультитенантность", "Биллинг и подписки", "Self-service онбординг"],
    steps: ["Мультитенант архитектура", "Биллинг и тарифы", "Онбординг и фичефлаги", "Масштабирование и мониторинг"],
    price: "от 1 200 000 ₽", priceEn: "from $13 360", image: "/saas.png",
  },
};

const TYPES_EN: Record<Kind, Item> = {
  crm: {
    fig: "01 · CRM", title: "CRM systems",
    desc: "Replaces spreadsheets and chats: pipelines, tasks, clients and analytics in one place. Your team moves faster.",
    tech: ["Node.js","PostgreSQL","Redis","GraphQL/REST","WebSockets"], timeline: "8–16 wks", contactHint: "Discuss CRM",
    useFor: ["Sales department automation", "Customer base management", "Funnel and conversion analytics"],
    steps: ["Process audit & CJM", "MVP with funnel and contacts", "Phone and email integrations", "Analytics and automation"],
    price: "от 560 000 ₽", priceEn: "from $6 240", image: "/crm.png",
  },
  portal: {
    fig: "02 · PORTAL", title: "Corporate portals",
    desc: "One tool for the whole team: tasks, documents, communication and access rights. No switching between services.",
    tech: ["SSO (OAuth/SAML)","Elasticsearch","Audit Logs","WebSockets"], timeline: "10–20 wks", contactHint: "Discuss portal",
    useFor: ["Corporate communications", "Document flow and requests", "Team task management"],
    steps: ["Core: news and tasks", "SSO and access roles", "Email and HR integrations", "Module expansion"],
    price: "от 720 000 ₽", priceEn: "from $8 000", image: "/portal.png",
  },
  cabinet: {
    fig: "03 · CABINET", title: "User portals",
    desc: "Clients see their data, pay and get support — without calling your office. Reduces load on your team.",
    tech: ["Next.js App Router","API Gateway","Email/Push","ACL","Redis"], timeline: "6–12 wks", contactHint: "Discuss portal",
    useFor: ["B2C services and subscriptions", "Customer personal account", "Order history and payments"],
    steps: ["Auth and profile", "History, payments and subscriptions", "Chat and notifications", "SEO and performance"],
    price: "от 400 000 ₽", priceEn: "from $4 480", image: "/client.png",
  },
  analytics: {
    fig: "04 · ANALYTICS", title: "Analytics dashboards",
    desc: "Numbers instead of gut feelings: KPIs, funnels, real-time reports. Decisions made faster and with confidence.",
    tech: ["ETL","PostgreSQL/OLAP","ClickHouse","Redis Cache"], timeline: "6–10 wks", contactHint: "Discuss analytics",
    useFor: ["KPI and metrics monitoring", "Executive reporting", "Product analytics"],
    steps: ["Data model and ETL", "Dashboards and widgets", "Filters and export", "Scheduling and delivery"],
    price: "от 480 000 ₽", priceEn: "from $5 360", image: "/analitick.png",
  },
  b2b: {
    fig: "05 · B2B", title: "B2B platforms",
    desc: "B2B sales online: catalog with pricing, orders and ERP integration. Sales reps focus on deals, not paperwork.",
    tech: ["Server Actions","CDN","RBAC","Payment Gateway","Caching"], timeline: "10–18 wks", contactHint: "Discuss B2B",
    useFor: ["Wholesale sales", "Partner portals", "ERP integration"],
    steps: ["Catalog and pricing", "Cart and order", "ERP integration", "Partner portal and analytics"],
    price: "от 800 000 ₽", priceEn: "from $8 880", image: "/b2b.png",
  },
  saas: {
    fig: "06 · SAAS", title: "SaaS services",
    desc: "A product that grows with you: subscriptions, multi-tenancy and architecture for thousands of users from day one.",
    tech: ["Prisma ORM","Feature Flags","Docker/K8s","CI/CD"], timeline: "12–24 wks", contactHint: "Discuss SaaS",
    useFor: ["Multi-tenancy", "Billing and subscriptions", "Self-service onboarding"],
    steps: ["Multi-tenant architecture", "Billing and pricing tiers", "Onboarding and feature flags", "Scaling and monitoring"],
    price: "от 1 200 000 ₽", priceEn: "from $13 360", image: "/saas.png",
  },
};

const KIND_KEYS: Kind[] = ["crm", "portal", "cabinet", "analytics", "b2b", "saas"];
const ICONS: Record<Kind, LucideIcon> = { crm: Users, portal: Building2, cabinet: UserRound, analytics: ChartColumn, b2b: Handshake, saas: Cloud };

/* Вид системы для предзаполнения калькулятора и формы. */
const KIND_TO_CALC: Record<Kind, string> = { crm: "crm", portal: "portal", cabinet: "client", analytics: "analytics", b2b: "b2b", saas: "saas" };
const KIND_TO_CONTACT: Record<Kind, string> = { crm: "internal", portal: "portal", cabinet: "portal", analytics: "dashboard", b2b: "marketplace", saas: "saas" };

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════════════════════════════════ */
export default function WebAppKinds() {
  const { locale } = useI18n();
  const isEn = locale === "en";
  const TYPES = isEn ? TYPES_EN : TYPES_RU;
  const reduced = useReducedMotion();
  const [active, setActive] = useState<Kind>("crm");

  const t = isEn
    ? { label: "02 / System types", title: ["Solution formats", "for your needs"], sub: "Pick a system — we'll show what's included, the stages and the budget.", useFor: "Suitable for", steps: "Work stages", discuss: "Discuss the project", calc: "Estimate the cost" }
    : { label: "02 / Типы систем", title: ["Форматы решений", "под вашу задачу"], sub: "Выберите систему — покажем состав, этапы и бюджет.", useFor: "Подходит для", steps: "Этапы работы", discuss: "Обсудить проект", calc: "Рассчитать стоимость" };

  const goContact = () => {
    window.dispatchEvent(new CustomEvent("webapp-contact-prefill", { detail: { kind: KIND_TO_CONTACT[active] } }));
    document.getElementById("contact")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  };
  const goCalc = () => {
    window.dispatchEvent(new CustomEvent("webapp-calc-prefill", { detail: { kind: KIND_TO_CALC[active] } }));
    window.dispatchEvent(new CustomEvent("site-open-section", { detail: "calculator", cancelable: true }));
  };

  return (
    <section id="kinds" className="site-types" aria-labelledby="kinds-title">
      <div className="site-types__inner">
        <div className="site-types__head">
          <div>
            <p className="service-eyebrow">{t.label}</p>
            <h2 id="kinds-title" className={`${serif.className} site-types__title`}>
              {t.title[0]}<br />{t.title[1]}
            </h2>
          </div>
          <p className="site-types__sub">{t.sub}</p>
        </div>

        <div className="site-types__tabs" role="tablist" aria-label={isEn ? "System types" : "Типы систем"}>
          {KIND_KEYS.map(k => {
            const it = TYPES[k];
            const Icon = ICONS[k];
            return (
              <button
                key={k}
                type="button"
                role="tab"
                id={`kind-tab-${k}`}
                aria-selected={k === active}
                aria-controls={`kind-panel-${k}`}
                className="site-tab"
                onClick={() => setActive(k)}
              >
                <span className="site-tab__fig">{it.fig.replace(" · ", " / ")}</span>
                <span className="site-tab__name"><Icon size={16} aria-hidden="true" />{it.title}</span>
              </button>
            );
          })}
        </div>

        {/* Все панели в разметке — поисковик видит каждую систему, посетитель — выбранную. */}
        {KIND_KEYS.map(k => {
          const item = TYPES[k];
          return (
            <motion.div
              key={k}
              id={`kind-panel-${k}`}
              role="tabpanel"
              aria-labelledby={`kind-tab-${k}`}
              hidden={k !== active}
              className="site-types__panel"
              initial={false}
              animate={k === active ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: reduced ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div>
                <h3 className={`${serif.className} site-types__name`}>{item.title}</h3>
                <p className="site-types__desc">{item.desc}</p>
                <p className="site-types__budget">
                  <span className="site-type__price">{isEn ? item.priceEn : item.price}</span>
                  <span className="site-type__time">{item.timeline}</span>
                </p>
                <ul className="site-types__tech" aria-label={isEn ? "Technologies" : "Технологии"}>
                  {item.tech.map(tech => <li key={tech}>{tech}</li>)}
                </ul>
                <div className="site-types__actions">
                  <button type="button" className="service-button service-button--primary" onClick={goContact}>
                    {t.discuss}<ArrowUpRight size={18} aria-hidden="true" />
                  </button>
                  <button type="button" className="service-text-link" onClick={goCalc}>{t.calc}<ArrowUpRight size={18} aria-hidden="true" /></button>
                </div>
              </div>

              <div className="site-types__lists">
                <div>
                  <p className="site-types__list-label">{t.useFor}</p>
                  <ul className="site-types__list">
                    {item.useFor.map(u => <li key={u}><Check size={16} aria-hidden="true" />{u}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="site-types__list-label">{t.steps}</p>
                  <ol className="site-types__list">
                    {item.steps.map((st, i) => (
                      <li key={st}><span className="site-type__num">{String(i + 1).padStart(2, "0")}</span>{st}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
