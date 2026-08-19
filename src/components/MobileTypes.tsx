// src/components/MobileTypes.tsx
"use client";
import { serif } from "@/lib/fonts";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import NextImage from "next/image";
import { X, ArrowRight, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import Script from "next/script";
import { useI18n } from "@/i18n/I18nProvider";


/* ─── Palette ────────────────────────────────────────────────────────────── */
const BG    = "#07100e";
const TEAL  = "#2dd4bf";
const WHITE = "#f4faf8";

/* ── SVG Wireframes ─────────────────────────────────────────────────────── */
function CrmMobileVisual() {
  return (
    <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <rect x="90" y="8" width="100" height="184" rx="10" stroke={WHITE} strokeOpacity="0.12" strokeWidth="1" fill={WHITE} fillOpacity="0.02"/>
      <rect x="94" y="20" width="92" height="10" rx="4" fill={WHITE} fillOpacity="0.06"/>
      <circle cx="140" cy="40" r="12" fill={TEAL} fillOpacity="0.15" stroke={TEAL} strokeOpacity="0.4" strokeWidth="1"/>
      <rect x="102" y="58" width="76" height="5" rx="2" fill={WHITE} fillOpacity="0.2"/>
      <rect x="110" y="67" width="60" height="3" rx="1.5" fill={WHITE} fillOpacity="0.08"/>
      {[0,1,2,3].map(i => (
        <g key={i}>
          <rect x="94" y={80 + i*22} width="92" height="18" rx="4" fill={WHITE} fillOpacity={i === 0 ? 0.06 : 0.02} stroke={WHITE} strokeOpacity="0.06" strokeWidth="1"/>
          <circle cx="103" cy={89 + i*22} r="4" fill={i === 0 ? TEAL : WHITE} fillOpacity={i === 0 ? 0.5 : 0.1}/>
          <rect x="112" y={86 + i*22} width="36" height="3" rx="1.5" fill={WHITE} fillOpacity={i === 0 ? 0.3 : 0.12}/>
          <rect x="112" y={91 + i*22} width="24" height="2.5" rx="1" fill={WHITE} fillOpacity="0.06"/>
          <rect x="158" y={86 + i*22} width="20" height="6" rx="3" fill={i === 0 ? TEAL : WHITE} fillOpacity={i === 0 ? 0.4 : 0.06}/>
        </g>
      ))}
      <rect x="94" y="172" width="92" height="12" rx="6" fill={TEAL} fillOpacity="0.3"/>
    </svg>
  );
}

function PortalMobileVisual() {
  return (
    <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <rect x="90" y="8" width="100" height="184" rx="10" stroke={WHITE} strokeOpacity="0.12" strokeWidth="1" fill={WHITE} fillOpacity="0.02"/>
      <rect x="94" y="20" width="92" height="10" rx="4" fill={WHITE} fillOpacity="0.06"/>
      <rect x="94" y="35" width="92" height="24" rx="4" fill={TEAL} fillOpacity="0.08" stroke={TEAL} strokeOpacity="0.2" strokeWidth="1"/>
      <rect x="100" y="41" width="50" height="4" rx="2" fill={WHITE} fillOpacity="0.25"/>
      <rect x="100" y="48" width="36" height="3" rx="1.5" fill={WHITE} fillOpacity="0.1"/>
      {[0,1,2,3].map(i => (
        <g key={i}>
          <rect x="94" y={66 + i*26} width="92" height="22" rx="3" fill={WHITE} fillOpacity="0.02" stroke={WHITE} strokeOpacity="0.05" strokeWidth="1"/>
          <rect x="100" y={72 + i*26} width="48" height="3.5" rx="1.5" fill={WHITE} fillOpacity={i === 0 ? 0.22 : 0.1}/>
          <rect x="100" y={78 + i*26} width="60" height="2.5" rx="1" fill={WHITE} fillOpacity="0.06"/>
          <rect x="156" y={70 + i*26} width="24" height="8" rx="2" fill={i === 0 ? TEAL : WHITE} fillOpacity={i === 0 ? 0.35 : 0.05}/>
        </g>
      ))}
      <rect x="94" y="172" width="44" height="10" rx="5" fill={WHITE} fillOpacity="0.06"/>
      <rect x="142" y="172" width="44" height="10" rx="5" fill={TEAL} fillOpacity="0.3"/>
    </svg>
  );
}

function ClientMobileVisual() {
  return (
    <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <rect x="90" y="8" width="100" height="184" rx="10" stroke={WHITE} strokeOpacity="0.12" strokeWidth="1" fill={WHITE} fillOpacity="0.02"/>
      <rect x="94" y="20" width="92" height="10" rx="4" fill={WHITE} fillOpacity="0.06"/>
      <circle cx="140" cy="46" r="16" fill={WHITE} fillOpacity="0.05" stroke={WHITE} strokeOpacity="0.1" strokeWidth="1"/>
      <circle cx="140" cy="46" r="8" fill={TEAL} fillOpacity="0.3"/>
      <rect x="106" y="68" width="68" height="5" rx="2" fill={WHITE} fillOpacity="0.2"/>
      <rect x="114" y="76" width="52" height="3" rx="1.5" fill={TEAL} fillOpacity="0.4"/>
      {[0,1].map(row => [0,1].map(col => (
        <g key={`${row}-${col}`}>
          <rect x={94 + col*48} y={88 + row*36} width="42" height="30" rx="4" fill={WHITE} fillOpacity="0.03" stroke={WHITE} strokeOpacity="0.07" strokeWidth="1"/>
          <rect x={98 + col*48} y={93 + row*36} width="24" height="3" rx="1.5" fill={WHITE} fillOpacity="0.1"/>
          <rect x={98 + col*48} y={99 + row*36} width="30" height="5" rx="2" fill={row === 0 && col === 0 ? TEAL : WHITE} fillOpacity={row === 0 && col === 0 ? 0.4 : 0.15}/>
          <rect x={98 + col*48} y={107 + row*36} width="18" height="2.5" rx="1" fill={WHITE} fillOpacity="0.06"/>
        </g>
      )))}
      <rect x="94" y="162" width="92" height="12" rx="6" fill={TEAL} fillOpacity="0.25"/>
      <rect x="94" y="177" width="92" height="8" rx="4" fill={WHITE} fillOpacity="0.05"/>
    </svg>
  );
}

function AnalyticsMobileVisual() {
  return (
    <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <rect x="90" y="8" width="100" height="184" rx="10" stroke={WHITE} strokeOpacity="0.12" strokeWidth="1" fill={WHITE} fillOpacity="0.02"/>
      <rect x="94" y="20" width="92" height="10" rx="4" fill={WHITE} fillOpacity="0.06"/>
      {[0,1].map(col => (
        <g key={col}>
          <rect x={94 + col*48} y="36" width="42" height="28" rx="4" fill={WHITE} fillOpacity="0.03" stroke={WHITE} strokeOpacity="0.07" strokeWidth="1"/>
          <rect x={98 + col*48} y="40" width="20" height="3" rx="1.5" fill={WHITE} fillOpacity="0.1"/>
          <rect x={98 + col*48} y="46" width="28" height="6" rx="2" fill={col === 0 ? TEAL : WHITE} fillOpacity={col === 0 ? 0.5 : 0.15}/>
          <rect x={98 + col*48} y="55" width="16" height="2.5" rx="1" fill={WHITE} fillOpacity="0.06"/>
        </g>
      ))}
      <rect x="94" y="70" width="92" height="56" rx="4" fill={WHITE} fillOpacity="0.02" stroke={WHITE} strokeOpacity="0.07" strokeWidth="1"/>
      {[0,1,2,3,4,5,6].map(i => {
        const h = [20,35,25,45,30,50,38][i];
        return <rect key={i} x={98+i*12} y={120-h} width="8" height={h} rx="2" fill={i === 5 ? TEAL : WHITE} fillOpacity={i === 5 ? 0.5 : 0.1}/>;
      })}
      <polyline points="98,110 110,95 122,100 134,82 146,90 158,75 170,82 182,70" stroke={TEAL} strokeWidth="1.5" strokeOpacity="0.5" fill="none"/>
      {[0,1,2].map(i => (
        <g key={i}>
          <rect x="94" y={132 + i*14} width="52" height="10" rx="3" fill={WHITE} fillOpacity="0.03" stroke={WHITE} strokeOpacity="0.05" strokeWidth="1"/>
          <rect x="98" y={136 + i*14} width="28" height="3" rx="1.5" fill={WHITE} fillOpacity="0.1"/>
          <rect x="150" y={136 + i*14} width="32" height="3" rx="1.5" fill={i === 0 ? TEAL : WHITE} fillOpacity={i === 0 ? 0.4 : 0.08}/>
        </g>
      ))}
    </svg>
  );
}

function B2bMobileVisual() {
  return (
    <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <rect x="90" y="8" width="100" height="184" rx="10" stroke={WHITE} strokeOpacity="0.12" strokeWidth="1" fill={WHITE} fillOpacity="0.02"/>
      <rect x="94" y="20" width="92" height="10" rx="4" fill={WHITE} fillOpacity="0.06"/>
      <rect x="94" y="35" width="92" height="10" rx="4" fill={WHITE} fillOpacity="0.04" stroke={WHITE} strokeOpacity="0.08" strokeWidth="1"/>
      <rect x="98" y="38" width="50" height="4" rx="2" fill={WHITE} fillOpacity="0.1"/>
      <rect x="178" y="37" width="6" height="6" rx="1" fill={TEAL} fillOpacity="0.4"/>
      {[0,1,2,3].map(i => (
        <g key={i}>
          <rect x="94" y={50 + i*30} width="42" height="26" rx="4" fill={WHITE} fillOpacity="0.03" stroke={WHITE} strokeOpacity="0.06" strokeWidth="1"/>
          <rect x="98" y={54 + i*30} width="34" height="14" rx="2" fill={WHITE} fillOpacity="0.04"/>
          <rect x="98" y={70 + i*30} width="24" height="3" rx="1.5" fill={WHITE} fillOpacity="0.1"/>
          <rect x="140" y={50 + i*30} width="46" height="26" rx="4" fill={WHITE} fillOpacity="0.03" stroke={WHITE} strokeOpacity="0.06" strokeWidth="1"/>
          <rect x="144" y={54 + i*30} width="38" height="3.5" rx="1.5" fill={WHITE} fillOpacity="0.12}"/>
          <rect x="144" y={60 + i*30} width="28" height="3" rx="1.5" fill={WHITE} fillOpacity="0.06"/>
          <rect x="144" y={65 + i*30} width="38" height="8" rx="4" fill={i === 0 ? TEAL : WHITE} fillOpacity={i === 0 ? 0.35 : 0.05}/>
        </g>
      ))}
    </svg>
  );
}

function SaasMobileVisual() {
  return (
    <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <rect x="90" y="8" width="100" height="184" rx="10" stroke={WHITE} strokeOpacity="0.12" strokeWidth="1" fill={WHITE} fillOpacity="0.02"/>
      <rect x="94" y="20" width="92" height="10" rx="4" fill={WHITE} fillOpacity="0.06"/>
      <rect x="94" y="36" width="92" height="40" rx="6" fill={TEAL} fillOpacity="0.08" stroke={TEAL} strokeOpacity="0.3" strokeWidth="1"/>
      <rect x="100" y="42" width="36" height="4" rx="2" fill={WHITE} fillOpacity="0.15"/>
      <rect x="100" y="49" width="52" height="12" rx="4" fill={TEAL} fillOpacity="0.5"/>
      <rect x="100" y="63" width="28" height="3" rx="1.5" fill={WHITE} fillOpacity="0.08"/>
      <rect x="94" y="82" width="92" height="36" rx="4" fill={WHITE} fillOpacity="0.02" stroke={WHITE} strokeOpacity="0.06" strokeWidth="1"/>
      {[0,1,2,3].map(i => (
        <g key={i}>
          <circle cx="101" cy={91 + i*9} r="2.5" fill={i < 2 ? TEAL : WHITE} fillOpacity={i < 2 ? 0.5 : 0.15}/>
          <rect x="108" y={88 + i*9} width="60" height="3" rx="1.5" fill={WHITE} fillOpacity={i < 2 ? 0.15 : 0.06}/>
        </g>
      ))}
      <rect x="94" y="124" width="44" height="22" rx="4" fill={WHITE} fillOpacity="0.03" stroke={WHITE} strokeOpacity="0.07" strokeWidth="1"/>
      <rect x="94" y="124" width="44" height="22" rx="4" fill="none" stroke={WHITE} strokeOpacity="0.07" strokeWidth="1"/>
      <rect x="98" y="129" width="28" height="3.5" rx="1.5" fill={WHITE} fillOpacity="0.1"/>
      <rect x="98" y="135" width="36" height="7" rx="3" fill={WHITE} fillOpacity="0.1"/>
      <rect x="142" y="124" width="44" height="22" rx="4" fill={TEAL} fillOpacity="0.1" stroke={TEAL} strokeOpacity="0.4" strokeWidth="1"/>
      <rect x="146" y="128" width="20" height="3" rx="1.5" fill={WHITE} fillOpacity="0.25"/>
      <rect x="146" y="133" width="36" height="8" rx="4" fill={TEAL} fillOpacity="0.5"/>
      <rect x="94" y="152" width="92" height="12" rx="6" fill={TEAL} fillOpacity="0.25"/>
    </svg>
  );
}

const KIND_KEYS: Kind[] = ["crm", "portal", "client", "analytics", "b2b", "saas"];
const ROWS: [Kind, Kind, Kind][] = [
  ["crm", "portal", "client"],
  ["analytics", "b2b", "saas"],
];
const VISUALS = [CrmMobileVisual, PortalMobileVisual, ClientMobileVisual, AnalyticsMobileVisual, B2bMobileVisual, SaasMobileVisual];

/* ─── Data ────────────────────────────────────────────────────────────────── */
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
    price:    "от 480 000 ₽",
    priceEn:  "from $5 300",
    timeline: "6–10 нед",
  },
  portal: {
    fig:      "02 · ПОРТАЛ",
    title:    "Внутренний портал",
    tag:      "HR / Коммуникации",
    desc:     "Команда всегда в курсе: новости, заявки, тикеты и база знаний в одном приложении. Безопасный вход через корпоративный SSO.",
    href:     "#m-portal",
    image:    "/m_portal.png",
    useFor:   ["HR и внутренние коммуникации", "Сервисы поддержки", "Документооборот и заявки"],
    tech:     ["React Native", "OIDC/SAML", "Push", "Feature Flags"],
    steps:    ["MVP-ядро (лента/заявки)", "Настройка SSO и ролей", "Расширение модулей", "Запуск и обучение"],
    price:    "от 550 000 ₽",
    priceEn:  "from $6 100",
    timeline: "8–12 нед",
  },
  client: {
    fig:      "03 · КАБИНЕТ",
    title:    "Кабинет клиента",
    tag:      "Лояльность",
    desc:     "Клиент видит заказы, платит, получает поддержку — без звонков. Снижает нагрузку на операторов и удерживает через лояльность.",
    href:     "#m-client",
    image:    "/m_client.png",
    useFor:   ["Ритейл и D2C", "Сервисы и подписки", "Лояльность и ретеншен"],
    tech:     ["React Native", "Stripe/ЮKassa", "WebSockets", "Amplitude/Firebase"],
    steps:    ["Флоу онбординга", "Чекаут и оплаты", "Чат и уведомления", "Релиз и маркетинг-ивенты"],
    price:    "от 600 000 ₽",
    priceEn:  "from $6 700",
    timeline: "8–14 нед",
  },
  analytics: {
    fig:      "04 · АНАЛИТИКА",
    title:    "Аналитическая панель",
    tag:      "KPI в кармане",
    desc:     "Бизнес-метрики в кармане: дашборды, алерты и drill-down в любой точке мира. Принимайте решения не дожидаясь офиса.",
    href:     "#m-analytics",
    image:    "/m_analytics.png",
    useFor:   ["Руководители и менеджеры", "Оперативное принятие решений", "Контроль SLA и метрик"],
    tech:     ["RN + Reanimated", "ReCharts/Victory", "SSE/WebSockets", "RBAC/Scopes"],
    steps:    ["Приоритизация KPI", "Проработка дашбордов", "Реалтайм и алерты", "Экспорт и шаринг"],
    price:    "от 420 000 ₽",
    priceEn:  "from $4 700",
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
    price:    "от 650 000 ₽",
    priceEn:  "from $7 200",
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
    price:    "от 700 000 ₽",
    priceEn:  "from $7 800",
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
    price: "от 480 000 ₽", priceEn: "from $5 300", timeline: "6–10 wks",
  },
  portal: {
    fig: "02 · PORTAL", title: "Internal portal", tag: "HR / Comms",
    desc: "Team always informed: news, requests, tickets and knowledge base in one app. Secure login via corporate SSO.",
    href: "#m-portal", image: "/m_portal.png",
    useFor: ["HR and internal communications", "Support services", "Document flow and requests"],
    tech: ["React Native", "OIDC/SAML", "Push", "Feature Flags"],
    steps: ["MVP core (feed/requests)", "SSO & roles setup", "Module expansion", "Launch & training"],
    price: "от 550 000 ₽", priceEn: "from $6 100", timeline: "8–12 wks",
  },
  client: {
    fig: "03 · CLIENT", title: "Customer account", tag: "Loyalty",
    desc: "Clients see orders, pay and get support — without calling. Reduces operator load and retains through loyalty.",
    href: "#m-client", image: "/m_client.png",
    useFor: ["Retail and D2C", "Services and subscriptions", "Loyalty and retention"],
    tech: ["React Native", "Stripe/YooKassa", "WebSockets", "Amplitude/Firebase"],
    steps: ["Onboarding flow", "Checkout & payments", "Chat & notifications", "Release & marketing events"],
    price: "от 600 000 ₽", priceEn: "from $6 700", timeline: "8–14 wks",
  },
  analytics: {
    fig: "04 · ANALYTICS", title: "Analytics dashboard", tag: "KPI on the go",
    desc: "Business metrics in your pocket: dashboards, alerts and drill-down from anywhere. Make decisions without waiting for the office.",
    href: "#m-analytics", image: "/m_analytics.png",
    useFor: ["Executives and managers", "Real-time decision making", "SLA and metrics monitoring"],
    tech: ["RN + Reanimated", "ReCharts/Victory", "SSE/WebSockets", "RBAC/Scopes"],
    steps: ["KPI prioritisation", "Dashboard design", "Real-time & alerts", "Export & sharing"],
    price: "от 420 000 ₽", priceEn: "from $4 700", timeline: "5–9 wks",
  },
  b2b: {
    fig: "05 · B2B", title: "B2B storefront", tag: "Wholesale sales",
    desc: "Partners order themselves: catalog with personal pricing, barcode scanner and ERP integration. Fewer calls to managers.",
    href: "#m-b2b", image: "/m_b2b.png",
    useFor: ["Wholesale sales", "Distributors and partners", "Terms negotiation"],
    tech: ["React Native", "Barcode/Camera", "Elastic/SQL", "ERP/CRM Sync"],
    steps: ["Catalog & search", "Cart & order", "Price & stock integrations", "Launch & A/B optimisation"],
    price: "от 650 000 ₽", priceEn: "from $7 200", timeline: "8–14 wks",
  },
  saas: {
    fig: "06 · SAAS", title: "SaaS service", tag: "Subscriptions",
    desc: "Your SaaS in App Store and Google Play: subscriptions, paywalls and onboarding. Mobile opens a new audience.",
    href: "#m-saas", image: "/m_saas.png",
    useFor: ["LTV extension", "Mobile access to SaaS", "Paywalls and experiments"],
    tech: ["React Native", "StoreKit/Billing", "Remote Config", "Segment/Amplitude"],
    steps: ["Paywalls & pricing tiers", "Subscriptions & grace periods", "Experiments & A/B", "Analytics & retention"],
    price: "от 700 000 ₽", priceEn: "from $7 800", timeline: "10–16 wks",
  },
};

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
export default function MobileTypes() {
  const { locale } = useI18n();
  const isEn = locale === "en";
  const TYPES = isEn ? TYPES_EN : TYPES_RU;
  const [openKey, setOpenKey] = useState<Kind | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const openWithUrl = useCallback((k: Kind) => setOpenKey(k), []);
  const closeAndClean = useCallback(() => setOpenKey(null), []);

  const itemListJsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Типы мобильных приложений",
    itemListElement: (Object.entries(TYPES_RU) as [Kind, Item][]).map(([, v], idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: v.title,
      description: v.desc,
    })),
  }), []);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const label = isEn ? "App types" : "Типы приложений";
  const titleLines = isEn ? ["Choose a type", "for your task"] : ["Выберите тип", "под вашу задачу"];

  return (
    <section
      id="types"
      aria-labelledby="types-title"
      style={{ background: BG, padding: isMobile ? "72px 0 60px" : "100px 0 80px" }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: isMobile ? "0 20px" : "0 40px" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: 64 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <motion.div
              style={{ height: 2, background: TEAL }}
              initial={{ width: 0 }}
              whileInView={{ width: 20 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
            <span style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 500, color: TEAL }}>
              {label}
            </span>
          </div>
          <h2
            id="types-title"
            className={serif.className}
            style={{ margin: 0, fontWeight: 400, lineHeight: 0.92, letterSpacing: "-0.04em" }}
          >
            <span style={{ display: "block", fontSize: "clamp(2.4rem, 6vw, 6rem)", color: TEAL }}>
              {titleLines[0]}
            </span>
            <span style={{ display: "block", fontSize: "clamp(2.4rem, 6vw, 6rem)", color: WHITE }}>
              {titleLines[1]}
            </span>
          </h2>
        </motion.div>

        {/* Two rows of 3 */}
        {ROWS.map((row, rowIdx) => {
          const isLastRow = rowIdx === ROWS.length - 1;
          return (
            <motion.div
              key={rowIdx}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.05 + rowIdx * 0.1 }}
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
                gap: isMobile ? 48 : 0,
                marginBottom: isLastRow ? 0 : (isMobile ? 48 : 64),
                paddingBottom: isLastRow ? 0 : (isMobile ? 48 : 64),
                borderBottom: isLastRow ? "none" : "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {row.map((key, i) => {
                const item = TYPES[key];
                const cardKey = `${rowIdx}-${i}`;
                const isHovered = hovered === cardKey;
                const anyHovered = hovered !== null;
                const isLast = i === row.length - 1;
                const VisualComp = VISUALS[rowIdx * 3 + i];
                return (
                  <div
                    key={key}
                    onMouseEnter={() => setHovered(cardKey)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => openWithUrl(key)}
                    style={{
                      borderRight: (isMobile || isLast) ? "none" : "1px solid rgba(255,255,255,0.08)",
                      paddingLeft: (isMobile || i === 0) ? 0 : 44,
                      paddingRight: (isMobile || isLast) ? 0 : 44,
                      display: "flex",
                      flexDirection: "column",
                      cursor: "pointer",
                      transition: "opacity 0.3s ease",
                      opacity: anyHovered ? (isHovered ? 1 : 0.4) : 1,
                    }}
                  >
                    <div style={{ fontSize: 10, letterSpacing: "0.2em", color: TEAL, fontWeight: 500, marginBottom: 24, fontFamily: "monospace" }}>
                      {item.fig}
                    </div>
                    <div style={{
                      marginBottom: 28, height: 160,
                      background: "rgba(255,255,255,0.02)",
                      border: `1px solid ${isHovered ? TEAL + "40" : "rgba(255,255,255,0.07)"}`,
                      borderRadius: 8, overflow: "hidden", padding: 4,
                      transition: "border-color 0.3s ease",
                    }}>
                      <VisualComp />
                    </div>
                    <h3 style={{
                      margin: "0 0 10px",
                      fontSize: "clamp(1.05rem, 1.6vw, 1.35rem)",
                      fontWeight: 600,
                      color: isHovered ? TEAL : WHITE,
                      letterSpacing: "-0.02em",
                      transition: "color 0.3s ease",
                    }}>
                      {item.title}
                    </h3>
                    <p style={{ margin: "0 0 18px", fontSize: 14, lineHeight: 1.65, color: "rgba(244,250,248,0.45)", flex: 1 }}>
                      {item.desc}
                    </p>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {item.tech.slice(0, 3).map(tag => (
                        <span key={tag} style={{
                          fontSize: 10, padding: "3px 10px", borderRadius: 99,
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: "rgba(244,250,248,0.45)",
                          letterSpacing: "0.05em",
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          );
        })}
      </div>

      {/* Modal */}
      <MobileModal openKey={openKey} onClose={closeAndClean} payload={openKey ? TYPES[openKey] : null} isEn={isEn} />

      <Script
        id="ld-mobile-types-list"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
    </section>
  );
}

/* ── Modal ────────────────────────────────────────────────────────────────── */
function MobileModal({
  openKey, onClose, payload, isEn,
}: {
  openKey: Kind | null;
  onClose: () => void;
  payload: Item | null;
  isEn: boolean;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!openKey) return;
    const el = document.documentElement;
    const prev = el.style.overflow;
    el.style.overflow = "hidden";
    setTimeout(() => panelRef.current?.focus({ preventScroll: true }), 0);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => {
      el.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [openKey, onClose]);

  if (!mounted) return null;

  const figNum = payload ? payload.fig.split("·")[0].trim().replace(/^0/, "") + ".0" : "";

  const kindToCalc: Record<Kind, string> = {
    crm: "client", portal: "client", client: "client",
    analytics: "client", b2b: "marketplace", saas: "saasMobile",
  };
  const kindToContact: Record<Kind, string> = {
    crm: "b2b", portal: "consumer", client: "consumer",
    analytics: "b2b", b2b: "b2b", saas: "superapp",
  };

  const jumpClose = (hash: string) => {
    if (openKey) {
      if (hash === "calculator") {
        window.dispatchEvent(new CustomEvent("mobile-calc-prefill", { detail: { kind: kindToCalc[openKey] } }));
      } else if (hash === "contact") {
        window.dispatchEvent(new CustomEvent("mobile-contact-prefill", { detail: { kind: kindToContact[openKey] } }));
      }
    }
    onClose();
    setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" }), 300);
  };

  return createPortal(
    <AnimatePresence>
      {openKey && payload && (
        <>
          <motion.div
            key="bd"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{ position: "fixed", inset: 0, zIndex: 998, background: "rgba(4,10,9,0.7)", backdropFilter: "blur(6px)" }}
          />
          <motion.div
            key="panel"
            ref={panelRef}
            tabIndex={-1}
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            role="dialog" aria-modal="true" aria-labelledby="mobile-modal-title"
            style={{
              position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 999,
              width: "min(560px, 100vw)",
              background: "#101f1c",
              borderLeft: "1px solid rgba(255,255,255,0.07)",
              display: "flex", flexDirection: "column",
              overflowY: "hidden", outline: "none",
            }}
          >
            {/* Top bar */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "0 24px", height: 52,
              borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0,
              background: "#101f1c",
            }}>
              <span style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(244,250,248,0.35)", fontWeight: 500 }}>
                {isEn ? "Tech Specs" : "Характеристики"}
              </span>
              <button
                onClick={onClose}
                style={{
                  width: 32, height: 32, borderRadius: "50%", border: "none",
                  background: "rgba(255,255,255,0.08)", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "rgba(244,250,248,0.6)",
                }}
              >
                <X size={15} />
              </button>
            </div>

            {/* Scrollable content */}
            <div style={{ overflowY: "auto", flex: 1 }}>
              <div style={{ padding: "32px 32px 48px" }}>

                {/* fig + title */}
                <div style={{ marginBottom: 32 }}>
                  <div style={{ fontSize: 13, color: "rgba(244,250,248,0.3)", marginBottom: 10 }}>{figNum}</div>
                  <h2
                    id="mobile-modal-title"
                    className={serif.className}
                    style={{ margin: 0, fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 400, color: WHITE, letterSpacing: "-0.03em", lineHeight: 1.1 }}
                  >
                    {payload.title}
                  </h2>
                </div>

                {/* Overview */}
                <div style={{ marginBottom: 32 }}>
                  <h3 style={{ margin: "0 0 12px", fontSize: 18, fontWeight: 600, color: WHITE }}>
                    {isEn ? "Overview" : "Обзор"}
                  </h3>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.8, color: "rgba(244,250,248,0.55)" }}>
                    {payload.desc}
                  </p>
                </div>

                {/* Use cases */}
                <div style={{ marginBottom: 36 }}>
                  <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(244,250,248,0.3)", marginBottom: 16, fontWeight: 500 }}>
                    {isEn ? "Use cases" : "Сценарии применения"}
                  </div>
                  <h3 style={{ margin: "0 0 12px", fontSize: 18, fontWeight: 600, color: WHITE }}>
                    {isEn ? "Suitable for" : "Подходит для"}
                  </h3>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: "left", fontSize: 12, color: "rgba(244,250,248,0.35)", fontWeight: 500, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                          {isEn ? "Scenario" : "Сценарий"}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {payload.useFor.map((u, i) => (
                        <tr key={i}>
                          <td style={{ padding: "10px 0", fontSize: 13, color: "rgba(244,250,248,0.7)", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", alignItems: "center", gap: 8 }}>
                            <CheckCircle size={13} style={{ color: TEAL, flexShrink: 0, marginTop: 1 }} /> {u}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Work stages */}
                <div style={{ marginBottom: 36 }}>
                  <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(244,250,248,0.3)", marginBottom: 16, fontWeight: 500 }}>
                    {isEn ? "Process" : "Процесс"}
                  </div>
                  <h3 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 600, color: WHITE }}>
                    {isEn ? "Work stages" : "Этапы работы"}
                  </h3>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: "left", fontSize: 12, color: "rgba(244,250,248,0.35)", fontWeight: 500, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", width: 40 }}>#</th>
                        <th style={{ textAlign: "left", fontSize: 12, color: "rgba(244,250,248,0.35)", fontWeight: 500, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                          {isEn ? "Stage" : "Этап"}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {payload.steps.map((s, i) => (
                        <tr key={i}>
                          <td style={{ padding: "10px 0", fontSize: 11, fontFamily: "monospace", color: TEAL, borderBottom: "1px solid rgba(255,255,255,0.04)", verticalAlign: "top" }}>
                            {String(i + 1).padStart(2, "0")}
                          </td>
                          <td style={{ padding: "10px 0 10px 12px", fontSize: 13, color: "rgba(244,250,248,0.6)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                            {s}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Tech */}
                <div style={{ marginBottom: 36 }}>
                  <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(244,250,248,0.3)", marginBottom: 16, fontWeight: 500 }}>
                    {isEn ? "Tech stack" : "Стек технологий"}
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {payload.tech.map(t => (
                      <span key={t} style={{
                        fontSize: 11, padding: "4px 12px", borderRadius: 99,
                        background: `${TEAL}10`, border: `1px solid ${TEAL}30`, color: TEAL,
                      }}>{t}</span>
                    ))}
                  </div>
                </div>

                {/* Budget */}
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "20px 0", borderTop: "1px solid rgba(255,255,255,0.07)",
                  borderBottom: "1px solid rgba(255,255,255,0.07)", marginBottom: 32,
                }}>
                  <div>
                    <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(244,250,248,0.3)", marginBottom: 6 }}>
                      {isEn ? "Budget" : "Бюджет"}
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 600, color: WHITE }}>{isEn ? payload.priceEn : payload.price}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(244,250,248,0.3)", marginBottom: 6 }}>
                      {isEn ? "Timeline" : "Сроки"}
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 600, color: WHITE }}>{payload.timeline}</div>
                  </div>
                </div>

                {/* CTAs */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <button
                    onClick={() => jumpClose("contact")}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      borderRadius: 10, padding: "14px 20px", border: "none", cursor: "pointer",
                      background: TEAL, color: BG, fontSize: 14, fontWeight: 600,
                    }}
                  >
                    {isEn ? "Discuss the project" : "Обсудить проект"}
                    <ArrowRight size={15} />
                  </button>
                  <button
                    onClick={() => jumpClose("calculator")}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center",
                      borderRadius: 10, padding: "14px 20px", cursor: "pointer",
                      background: "rgba(255,255,255,0.04)", fontSize: 14, fontWeight: 500,
                      border: "1px solid rgba(255,255,255,0.1)", color: "rgba(244,250,248,0.55)",
                    }}
                  >
                    {isEn ? "Calculate cost" : "Рассчитать стоимость"}
                  </button>
                </div>

              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
