// src/components/MobileTypes.tsx
"use client";
import { serif } from "@/lib/fonts";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Building2, ChartColumn, Check, Cloud, Handshake, UserRound, Users, type LucideIcon } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

/* ─── Data ─────────────────────────────────────────────────────────────── */
type Kind = "crm" | "portal" | "client" | "analytics" | "b2b" | "saas";

type Item = {
  fig: string;
  title: string;
  tag: string;
  desc: string;
  href: string;
  image: string;
  useFor: string[];
  tech: string[];
  steps: string[];
  price: string;
  priceEn: string;
  timeline: string;
};

const TYPES_RU: Record<Kind, Item> = {
  crm: {
    fig:      "01 · CRM",
    title:    "CRM / ERP (мобильное)",
    tag:      "Полевые команды",
    desc:     "Продавайте и управляйте на ходу: сделки, задачи, геометки. Работает без сети — данные синхронизируются при подключении.",
    href:     "#m-crm",
    image:    "/m_crm.png",
    useFor:   ["Полевые службы, мерчандайзинг", "Сервис и поддержка на выезде", "Внутренние контроллинговые команды"],
    tech:     ["React Native", "SQLite/WatermelonDB", "CodePush", "REST/GraphQL"],
    steps:    ["Бриф и UX-карты", "Прототип и тестирование", "Реализация и интеграции", "Релиз и аналитика"],
    price:    "от 384 000 ₽",
    priceEn:  "from $4 240",
    timeline: "6–10 нед",
  },
  portal: {
    fig:      "02 · PORTAL",
    title:    "Внутренний портал",
    tag:      "HR / Коммуникации",
    desc:     "Команда всегда в курсе: новости, заявки, тикеты и база знаний в одном приложении. Безопасный вход через корпоративный SSO.",
    href:     "#m-portal",
    image:    "/m_portal.png",
    useFor:   ["HR и внутренние коммуникации", "Сервисы поддержки", "Документооборот и заявки"],
    tech:     ["React Native", "OIDC/SAML", "Push", "Feature Flags"],
    steps:    ["MVP-ядро (лента/заявки)", "Настройка SSO и ролей", "Расширение модулей", "Запуск и обучение"],
    price:    "от 440 000 ₽",
    priceEn:  "from $4 880",
    timeline: "8–12 нед",
  },
  client: {
    fig:      "03 · CLIENT",
    title:    "Кабинет клиента",
    tag:      "Лояльность",
    desc:     "Клиент видит заказы, платит, получает поддержку — без звонков. Снижает нагрузку на операторов и удерживает через лояльность.",
    href:     "#m-client",
    image:    "/m_client.png",
    useFor:   ["Ритейл и D2C", "Сервисы и подписки", "Лояльность и ретеншен"],
    tech:     ["React Native", "Stripe/ЮKassa", "WebSockets", "Amplitude/Firebase"],
    steps:    ["Флоу онбординга", "Чекаут и оплаты", "Чат и уведомления", "Релиз и маркетинг-ивенты"],
    price:    "от 480 000 ₽",
    priceEn:  "from $5 360",
    timeline: "8–14 нед",
  },
  analytics: {
    fig:      "04 · ANALYTICS",
    title:    "Аналитическая панель",
    tag:      "KPI в кармане",
    desc:     "Бизнес-метрики в кармане: дашборды, алерты и drill-down в любой точке мира. Принимайте решения не дожидаясь офиса.",
    href:     "#m-analytics",
    image:    "/m_analytics.png",
    useFor:   ["Руководители и менеджеры", "Оперативное принятие решений", "Контроль SLA и метрик"],
    tech:     ["RN + Reanimated", "ReCharts/Victory", "SSE/WebSockets", "RBAC/Scopes"],
    steps:    ["Приоритизация KPI", "Проработка дашбордов", "Реалтайм и алерты", "Экспорт и шаринг"],
    price:    "от 336 000 ₽",
    priceEn:  "from $3 760",
    timeline: "5–9 нед",
  },
  b2b: {
    fig:      "05 · B2B",
    title:    "B2B-витрина",
    tag:      "Оптовые продажи",
    desc:     "Дилеры и партнёры заказывают сами: каталог с персональными ценами, сканер и интеграция с 1С. Меньше звонков менеджерам.",
    href:     "#m-b2b",
    image:    "/m_b2b.png",
    useFor:   ["Оптовые продажи", "Дистрибьюторы и партнёры", "Согласование условий"],
    tech:     ["React Native", "Barcode/Camera", "Elastic/SQL", "1C/CRM Sync"],
    steps:    ["Каталог и поиск", "Корзина и заявка", "Интеграции цен и остатков", "Запуск и A/B-оптимизация"],
    price:    "от 520 000 ₽",
    priceEn:  "from $5 760",
    timeline: "8–14 нед",
  },
  saas: {
    fig:      "06 · SAAS",
    title:    "SaaS-сервис",
    tag:      "Подписки",
    desc:     "Ваш SaaS в App Store и Google Play: подписки, пэйволлы и онбординг. Мобильный канал открывает новую аудиторию.",
    href:     "#m-saas",
    image:    "/m_saas.png",
    useFor:   ["Продление LTV", "Мобильный доступ к SaaS", "Пэйволлы и эксперименты"],
    tech:     ["React Native", "StoreKit/Billing", "Remote Config", "Segment/Amplitude"],
    steps:    ["Пэйволлы и вилки тарифов", "Подписки и грейс-периоды", "Эксперименты и A/B", "Аналитика и ретеншен"],
    price:    "от 560 000 ₽",
    priceEn:  "from $6 240",
    timeline: "10–16 нед",
  },
};

const TYPES_EN: Record<Kind, Item> = {
  crm: {
    fig: "01 · CRM", title: "CRM / ERP (mobile)", tag: "Field teams",
    desc: "Sell and manage on the go: deals, tasks, geo-tags. Works without internet — data syncs when connection returns.",
    href: "#m-crm", image: "/m_crm.png",
    useFor: ["Field services, merchandising", "On-site service and support", "Internal controlling teams"],
    tech: ["React Native", "SQLite/WatermelonDB", "CodePush", "REST/GraphQL"],
    steps: ["Brief & UX maps", "Prototype & testing", "Implementation & integrations", "Release & analytics"],
    price: "от 384 000 ₽", priceEn: "from $4 240", timeline: "6–10 wks",
  },
  portal: {
    fig: "02 · PORTAL", title: "Internal portal", tag: "HR / Comms",
    desc: "Team always informed: news, requests, tickets and knowledge base in one app. Secure login via corporate SSO.",
    href: "#m-portal", image: "/m_portal.png",
    useFor: ["HR and internal communications", "Support services", "Document flow and requests"],
    tech: ["React Native", "OIDC/SAML", "Push", "Feature Flags"],
    steps: ["MVP core (feed/requests)", "SSO & roles setup", "Module expansion", "Launch & training"],
    price: "от 440 000 ₽", priceEn: "from $4 880", timeline: "8–12 wks",
  },
  client: {
    fig: "03 · CLIENT", title: "Customer account", tag: "Loyalty",
    desc: "Clients see orders, pay and get support — without calling. Reduces operator load and retains through loyalty.",
    href: "#m-client", image: "/m_client.png",
    useFor: ["Retail and D2C", "Services and subscriptions", "Loyalty and retention"],
    tech: ["React Native", "Stripe/YooKassa", "WebSockets", "Amplitude/Firebase"],
    steps: ["Onboarding flow", "Checkout & payments", "Chat & notifications", "Release & marketing events"],
    price: "от 480 000 ₽", priceEn: "from $5 360", timeline: "8–14 wks",
  },
  analytics: {
    fig: "04 · ANALYTICS", title: "Analytics dashboard", tag: "KPI on the go",
    desc: "Business metrics in your pocket: dashboards, alerts and drill-down from anywhere. Make decisions without waiting for the office.",
    href: "#m-analytics", image: "/m_analytics.png",
    useFor: ["Executives and managers", "Real-time decision making", "SLA and metrics monitoring"],
    tech: ["RN + Reanimated", "ReCharts/Victory", "SSE/WebSockets", "RBAC/Scopes"],
    steps: ["KPI prioritisation", "Dashboard design", "Real-time & alerts", "Export & sharing"],
    price: "от 336 000 ₽", priceEn: "from $3 760", timeline: "5–9 wks",
  },
  b2b: {
    fig: "05 · B2B", title: "B2B storefront", tag: "Wholesale sales",
    desc: "Partners order themselves: catalog with personal pricing, barcode scanner and ERP integration. Fewer calls to managers.",
    href: "#m-b2b", image: "/m_b2b.png",
    useFor: ["Wholesale sales", "Distributors and partners", "Terms negotiation"],
    tech: ["React Native", "Barcode/Camera", "Elastic/SQL", "ERP/CRM Sync"],
    steps: ["Catalog & search", "Cart & order", "Price & stock integrations", "Launch & A/B optimisation"],
    price: "от 520 000 ₽", priceEn: "from $5 760", timeline: "8–14 wks",
  },
  saas: {
    fig: "06 · SAAS", title: "SaaS service", tag: "Subscriptions",
    desc: "Your SaaS in App Store and Google Play: subscriptions, paywalls and onboarding. Mobile opens a new audience.",
    href: "#m-saas", image: "/m_saas.png",
    useFor: ["LTV extension", "Mobile access to SaaS", "Paywalls and experiments"],
    tech: ["React Native", "StoreKit/Billing", "Remote Config", "Segment/Amplitude"],
    steps: ["Paywalls & pricing tiers", "Subscriptions & grace periods", "Experiments & A/B", "Analytics & retention"],
    price: "от 560 000 ₽", priceEn: "from $6 240", timeline: "10–16 wks",
  },
};

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════════ */

const KIND_KEYS: Kind[] = ["crm", "portal", "client", "analytics", "b2b", "saas"];

const ICONS: Record<Kind, LucideIcon> = { crm: Users, portal: Building2, client: UserRound, analytics: ChartColumn, b2b: Handshake, saas: Cloud };

/* Вид системы для предзаполнения калькулятора и формы. */
const KIND_TO_CALC: Record<Kind, string> = { crm: "field", portal: "client", client: "client", analytics: "client", b2b: "marketplace", saas: "saasMobile" };
const KIND_TO_CONTACT: Record<Kind, string> = { crm: "b2b", portal: "consumer", client: "consumer", analytics: "b2b", b2b: "b2b", saas: "superapp" };

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════════════════════════════════ */
export default function MobileTypes() {
  const { locale } = useI18n();
  const isEn = locale === "en";
  const TYPES = isEn ? TYPES_EN : TYPES_RU;
  const reduced = useReducedMotion();
  const [active, setActive] = useState<Kind>("crm");

  const t = isEn
    ? { label: "02 / App types", title: ["App formats", "for your needs"], sub: "Pick a format — we'll show what's included, the stages and the budget.", useFor: "Suitable for", steps: "Work stages", discuss: "Discuss the project", calc: "Estimate the cost" }
    : { label: "02 / Типы приложений", title: ["Форматы приложений", "под вашу задачу"], sub: "Выберите формат — покажем состав, этапы и бюджет.", useFor: "Подходит для", steps: "Этапы работы", discuss: "Обсудить проект", calc: "Рассчитать стоимость" };

  const goContact = () => {
    window.dispatchEvent(new CustomEvent("mobile-contact-prefill", { detail: { kind: KIND_TO_CONTACT[active] } }));
    document.getElementById("contact")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  };
  const goCalc = () => {
    window.dispatchEvent(new CustomEvent("mobile-calc-prefill", { detail: { kind: KIND_TO_CALC[active] } }));
    window.dispatchEvent(new CustomEvent("site-open-section", { detail: "calculator", cancelable: true }));
  };

  return (
    <section id="types" className="site-types" aria-labelledby="mobile-types-title">
      <div className="site-types__inner">
        <div className="site-types__head">
          <div>
            <p className="service-eyebrow">{t.label}</p>
            <h2 id="mobile-types-title" className={`${serif.className} site-types__title`}>
              {t.title[0]}<br />{t.title[1]}
            </h2>
          </div>
          <p className="site-types__sub">{t.sub}</p>
        </div>

        <div className="site-types__tabs" role="tablist" aria-label={isEn ? "App types" : "Типы приложений"}>
          {KIND_KEYS.map(k => {
            const it = TYPES[k];
            const Icon = ICONS[k];
            return (
              <button
                key={k}
                type="button"
                role="tab"
                id={`mtype-tab-${k}`}
                aria-selected={k === active}
                aria-controls={`mtype-panel-${k}`}
                className="site-tab"
                onClick={() => setActive(k)}
              >
                <span className="site-tab__fig">{it.fig.replace(" · ", " / ")}</span>
                <span className="site-tab__name"><Icon size={16} aria-hidden="true" />{it.title}</span>
              </button>
            );
          })}
        </div>

        {/* Все панели в разметке — поисковик видит каждый тип, посетитель — выбранный. */}
        {KIND_KEYS.map(k => {
          const item = TYPES[k];
          return (
            <motion.div
              key={k}
              id={`mtype-panel-${k}`}
              role="tabpanel"
              aria-labelledby={`mtype-tab-${k}`}
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
