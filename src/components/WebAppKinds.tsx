// src/components/WebAppKinds.tsx
"use client";
import { serif } from "@/lib/fonts";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { createPortal } from "react-dom";
import { X, ArrowRight, CheckCircle } from "lucide-react";
import NextImage from "next/image";
import { useI18n } from "@/i18n/I18nProvider";


const TEAL  = "#2dd4bf";
const WHITE = "#f4faf8";
const BG    = "#07100e";

/* ── SVG Wireframes ─────────────────────────────────────────────────────── */

function CrmVisual() {
  return (
    <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <rect x="10" y="10" width="260" height="180" rx="8" stroke={WHITE} strokeOpacity="0.12" strokeWidth="1"/>
      <rect x="10" y="10" width="260" height="22" rx="8" fill={WHITE} fillOpacity="0.05"/>
      <circle cx="24" cy="21" r="3" fill={WHITE} fillOpacity="0.2"/>
      <circle cx="34" cy="21" r="3" fill={WHITE} fillOpacity="0.2"/>
      <circle cx="44" cy="21" r="3" fill={WHITE} fillOpacity="0.2"/>
      <rect x="10" y="32" width="50" height="158" fill={WHITE} fillOpacity="0.03" stroke={WHITE} strokeOpacity="0.06" strokeWidth="1"/>
      <rect x="18" y="40" width="34" height="5" rx="2" fill={TEAL} fillOpacity="0.5"/>
      {[0,1,2,3,4].map(i => (
        <rect key={i} x="18" y={52 + i*14} width="28" height="4" rx="2" fill={WHITE} fillOpacity={i === 0 ? 0.2 : 0.08}/>
      ))}
      <rect x="66" y="32" width="204" height="18" fill={WHITE} fillOpacity="0.04"/>
      {[0,1,2,3].map(i => (
        <rect key={i} x={72 + i*48} y="38" width="36" height="4" rx="2" fill={WHITE} fillOpacity="0.15"/>
      ))}
      {[0,1,2,3,4,5,6].map(i => (
        <g key={i}>
          <rect x="66" y={52 + i*20} width="204" height="18" fill={WHITE} fillOpacity={i % 2 === 0 ? 0.02 : 0}/>
          <rect x="72" y={57 + i*20} width="28" height="4" rx="2" fill={i === 0 ? TEAL : WHITE} fillOpacity={i === 0 ? 0.5 : 0.12}/>
          <rect x="120" y={57 + i*20} width="36" height="4" rx="2" fill={WHITE} fillOpacity="0.08"/>
          <rect x="168" y={57 + i*20} width="24" height="4" rx="2" fill={WHITE} fillOpacity="0.08"/>
          <rect x="216" y={55 + i*20} width="36" height="8" rx="4" fill={i === 0 ? TEAL : WHITE} fillOpacity={i === 0 ? 0.3 : 0.05}/>
        </g>
      ))}
    </svg>
  );
}

function PortalVisual() {
  return (
    <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <rect x="10" y="10" width="260" height="180" rx="8" stroke={WHITE} strokeOpacity="0.12" strokeWidth="1"/>
      <rect x="10" y="10" width="260" height="24" rx="8" fill={WHITE} fillOpacity="0.05"/>
      <rect x="18" y="16" width="40" height="8" rx="2" fill={TEAL} fillOpacity="0.4"/>
      <rect x="180" y="18" width="24" height="5" rx="2" fill={WHITE} fillOpacity="0.12"/>
      <rect x="212" y="18" width="24" height="5" rx="2" fill={WHITE} fillOpacity="0.12"/>
      <circle cx="248" cy="22" r="7" fill={WHITE} fillOpacity="0.1"/>
      <rect x="10" y="34" width="60" height="156" fill={WHITE} fillOpacity="0.02" stroke={WHITE} strokeOpacity="0.06" strokeWidth="1"/>
      {[0,1,2,3,4,5].map(i => (
        <g key={i}>
          <rect x="18" y={46 + i*22} width="8" height="8" rx="2" fill={i === 0 ? TEAL : WHITE} fillOpacity={i === 0 ? 0.5 : 0.15}/>
          <rect x="30" y={48 + i*22} width="28" height="4" rx="2" fill={WHITE} fillOpacity={i === 0 ? 0.25 : 0.08}/>
        </g>
      ))}
      <rect x="76" y="34" width="194" height="40" fill={WHITE} fillOpacity="0.03"/>
      <rect x="84" y="42" width="70" height="8" rx="3" fill={WHITE} fillOpacity="0.2"/>
      <rect x="84" y="54" width="100" height="4" rx="2" fill={WHITE} fillOpacity="0.08"/>
      {[0,1].map(col => [0,1].map(row => (
        <rect key={`${col}-${row}`} x={76 + col*100} y={82 + row*50} width="90" height="42" rx="4"
          fill={WHITE} fillOpacity="0.03" stroke={WHITE} strokeOpacity="0.07" strokeWidth="1"/>
      )))}
      {[0,1].map(col => [0,1].map(row => (
        <g key={`t-${col}-${row}`}>
          <rect x={82 + col*100} y={90 + row*50} width="40" height="4" rx="2" fill={WHITE} fillOpacity="0.15"/>
          <rect x={82 + col*100} y={98 + row*50} width="60" height="3" rx="1.5" fill={WHITE} fillOpacity="0.07"/>
          <rect x={82 + col*100} y={106 + row*50} width="30" height="6" rx="3" fill={TEAL} fillOpacity="0.3"/>
        </g>
      )))}
    </svg>
  );
}

function CabinetVisual() {
  return (
    <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <rect x="10" y="10" width="260" height="180" rx="8" stroke={WHITE} strokeOpacity="0.12" strokeWidth="1"/>
      <rect x="10" y="10" width="260" height="22" rx="8" fill={WHITE} fillOpacity="0.05"/>
      <circle cx="24" cy="21" r="3" fill={WHITE} fillOpacity="0.2"/>
      <circle cx="34" cy="21" r="3" fill={WHITE} fillOpacity="0.2"/>
      <circle cx="44" cy="21" r="3" fill={WHITE} fillOpacity="0.2"/>
      <rect x="60" y="16" width="120" height="10" rx="3" fill={WHITE} fillOpacity="0.06"/>
      <rect x="232" y="16" width="30" height="10" rx="4" fill={TEAL} fillOpacity="0.4"/>
      <rect x="10" y="32" width="260" height="48" fill={WHITE} fillOpacity="0.03"/>
      <circle cx="42" cy="56" r="16" fill={WHITE} fillOpacity="0.08" stroke={WHITE} strokeOpacity="0.12" strokeWidth="1"/>
      <rect x="66" y="46" width="60" height="8" rx="3" fill={WHITE} fillOpacity="0.2"/>
      <rect x="66" y="58" width="90" height="5" rx="2" fill={WHITE} fillOpacity="0.1"/>
      <rect x="66" y="67" width="40" height="5" rx="2" fill={TEAL} fillOpacity="0.3"/>
      <rect x="10" y="80" width="260" height="14" fill={WHITE} fillOpacity="0.02"/>
      {["Заказы","Оплаты","Профиль","Поддержка"].map((_, i) => (
        <rect key={i} x={18 + i*62} y="84" width="50" height="5" rx="2" fill={i === 0 ? TEAL : WHITE} fillOpacity={i === 0 ? 0.5 : 0.1}/>
      ))}
      {[0,1,2,3].map(i => (
        <g key={i}>
          <rect x="10" y={98 + i*22} width="260" height="20" fill={WHITE} fillOpacity={i % 2 === 0 ? 0.02 : 0}/>
          <rect x="18" y={104 + i*22} width="24" height="4" rx="2" fill={TEAL} fillOpacity="0.3"/>
          <rect x="52" y={104 + i*22} width="70" height="4" rx="2" fill={WHITE} fillOpacity="0.12"/>
          <rect x="160" y={104 + i*22} width="40" height="4" rx="2" fill={WHITE} fillOpacity="0.08"/>
          <rect x="224" y={102 + i*22} width="36" height="8" rx="4" fill={i === 0 ? TEAL : WHITE} fillOpacity={i === 0 ? 0.25 : 0.06}/>
        </g>
      ))}
    </svg>
  );
}

function AnalyticsVisual() {
  return (
    <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <rect x="10" y="10" width="260" height="180" rx="8" stroke={WHITE} strokeOpacity="0.12" strokeWidth="1"/>
      <rect x="10" y="10" width="260" height="22" rx="8" fill={WHITE} fillOpacity="0.05"/>
      <rect x="18" y="16" width="50" height="10" rx="3" fill={WHITE} fillOpacity="0.15"/>
      <rect x="200" y="16" width="60" height="10" rx="4" fill={WHITE} fillOpacity="0.06" stroke={WHITE} strokeOpacity="0.1" strokeWidth="1"/>
      {[0,1,2,3].map(i => (
        <g key={i}>
          <rect x={18 + i*62} y="40" width="54" height="36" rx="4" fill={WHITE} fillOpacity="0.04" stroke={WHITE} strokeOpacity="0.07" strokeWidth="1"/>
          <rect x={24 + i*62} y="47" width="30" height="4" rx="2" fill={WHITE} fillOpacity="0.12"/>
          <rect x={24 + i*62} y="55" width={i === 0 ? 36 : 22} height="8" rx="2" fill={i === 0 ? TEAL : WHITE} fillOpacity={i === 0 ? 0.5 : 0.2}/>
        </g>
      ))}
      <rect x="18" y="86" width="148" height="94" rx="4" fill={WHITE} fillOpacity="0.02" stroke={WHITE} strokeOpacity="0.06" strokeWidth="1"/>
      <rect x="24" y="92" width="50" height="4" rx="2" fill={WHITE} fillOpacity="0.18"/>
      {[0,1,2,3,4,5].map(i => {
        const h = [60,40,70,50,80,35][i];
        return <rect key={i} x={30 + i*22} y={164-h} width="14" height={h} rx="2" fill={i === 4 ? TEAL : WHITE} fillOpacity={i === 4 ? 0.6 : 0.12}/>;
      })}
      <rect x="172" y="86" width="98" height="94" rx="4" fill={WHITE} fillOpacity="0.02" stroke={WHITE} strokeOpacity="0.06" strokeWidth="1"/>
      <rect x="178" y="92" width="40" height="4" rx="2" fill={WHITE} fillOpacity="0.18"/>
      <polyline points="178,160 192,148 206,155 220,138 234,145 248,125 262,132" stroke={TEAL} strokeOpacity="0.6" strokeWidth="1.5" fill="none"/>
      <polyline points="178,160 192,148 206,155 220,138 234,145 248,125 262,132 262,170 178,170" fill={TEAL} fillOpacity="0.06"/>
    </svg>
  );
}

function B2bVisual() {
  return (
    <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <rect x="10" y="10" width="260" height="180" rx="8" stroke={WHITE} strokeOpacity="0.12" strokeWidth="1"/>
      <rect x="10" y="10" width="260" height="22" rx="8" fill={WHITE} fillOpacity="0.05"/>
      <circle cx="24" cy="21" r="3" fill={WHITE} fillOpacity="0.2"/>
      <circle cx="34" cy="21" r="3" fill={WHITE} fillOpacity="0.2"/>
      <circle cx="44" cy="21" r="3" fill={WHITE} fillOpacity="0.2"/>
      <rect x="80" y="15" width="110" height="12" rx="4" fill={WHITE} fillOpacity="0.06" stroke={WHITE} strokeOpacity="0.08" strokeWidth="1"/>
      <rect x="234" y="15" width="36" height="12" rx="4" fill={TEAL} fillOpacity="0.4"/>
      <rect x="10" y="32" width="260" height="14" fill={WHITE} fillOpacity="0.03"/>
      {["Все","Металл","Химия","Авто"].map((_, i) => (
        <rect key={i} x={18 + i*52} y="36" width="44" height="6" rx="3" fill={i === 0 ? TEAL : WHITE} fillOpacity={i === 0 ? 0.3 : 0.08}/>
      ))}
      {[0,1,2,3,4,5].map(i => {
        const col = i % 3, row = Math.floor(i / 3);
        const x = 18 + col*82, y = 54 + row*72;
        return (
          <g key={i}>
            <rect x={x} y={y} width="74" height="64" rx="4" fill={WHITE} fillOpacity="0.03" stroke={WHITE} strokeOpacity="0.07" strokeWidth="1"/>
            <rect x={x+4} y={y+4} width="66" height="32" rx="3" fill={WHITE} fillOpacity="0.04"/>
            <line x1={x+4} y1={y+4} x2={x+70} y2={y+36} stroke={WHITE} strokeOpacity="0.05" strokeWidth="0.8"/>
            <line x1={x+70} y1={y+4} x2={x+4} y2={y+36} stroke={WHITE} strokeOpacity="0.05" strokeWidth="0.8"/>
            <rect x={x+4} y={y+40} width="36" height="4" rx="2" fill={WHITE} fillOpacity="0.15"/>
            <rect x={x+44} y={y+38} width="26" height="8" rx="4" fill={TEAL} fillOpacity="0.4"/>
          </g>
        );
      })}
    </svg>
  );
}

function SaasVisual() {
  return (
    <svg viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <rect x="10" y="10" width="260" height="180" rx="8" stroke={WHITE} strokeOpacity="0.12" strokeWidth="1"/>
      <rect x="10" y="10" width="260" height="22" rx="8" fill={WHITE} fillOpacity="0.05"/>
      <rect x="18" y="16" width="44" height="10" rx="3" fill={WHITE} fillOpacity="0.15"/>
      <rect x="200" y="16" width="26" height="10" rx="4" fill={WHITE} fillOpacity="0.08"/>
      <rect x="234" y="16" width="36" height="10" rx="4" fill={TEAL} fillOpacity="0.5"/>
      {[0,1,2].map(i => (
        <g key={i}>
          <rect x={18 + i*82} y="38" width="74" height="100" rx="6"
            fill={i === 1 ? TEAL : WHITE} fillOpacity={i === 1 ? 0.08 : 0.03}
            stroke={i === 1 ? TEAL : WHITE} strokeOpacity={i === 1 ? 0.4 : 0.07} strokeWidth="1"/>
          {i === 1 && <rect x="36" y="35" width="40" height="8" rx="4" fill={TEAL} fillOpacity="0.7"/>}
          <rect x={24 + i*82} y="48" width="30" height="5" rx="2" fill={WHITE} fillOpacity={i === 1 ? 0.4 : 0.15}/>
          <rect x={24 + i*82} y="58" width="44" height="10" rx="3" fill={i === 1 ? TEAL : WHITE} fillOpacity={i === 1 ? 0.6 : 0.2}/>
          {[0,1,2,3].map(j => (
            <g key={j}>
              <circle cx={28 + i*82} cy={76 + j*14} r="2.5" fill={TEAL} fillOpacity={i === 1 ? 0.7 : 0.3}/>
              <rect x={34 + i*82} y={73 + j*14} width="42" height="4" rx="2" fill={WHITE} fillOpacity={i === 1 ? 0.25 : 0.1}/>
            </g>
          ))}
          <rect x={24 + i*82} y="122" width="58" height="10" rx="5" fill={i === 1 ? TEAL : WHITE} fillOpacity={i === 1 ? 0.6 : 0.08}/>
        </g>
      ))}
      <rect x="18" y="148" width="244" height="32" rx="4" fill={WHITE} fillOpacity="0.02" stroke={WHITE} strokeOpacity="0.06" strokeWidth="1"/>
      {[0,1,2,3].map(i => (
        <g key={i}>
          <rect x={26 + i*60} y="154" width="24" height="4" rx="2" fill={WHITE} fillOpacity="0.1"/>
          <rect x={26 + i*60} y="162" width="36" height="6" rx="2" fill={i === 0 ? TEAL : WHITE} fillOpacity={i === 0 ? 0.5 : 0.18}/>
        </g>
      ))}
    </svg>
  );
}

const VISUALS = [CrmVisual, PortalVisual, CabinetVisual, AnalyticsVisual, B2bVisual, SaasVisual];

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
    price: "от 700 000 ₽", priceEn: "from $7 800", image: "/crm.png",
  },
  portal: {
    fig: "02 · ПОРТАЛ", title: "Корпоративные порталы",
    desc: "Один инструмент для всей команды: задачи, документы, коммуникации и права доступа. Без переключения между сервисами.",
    tech: ["SSO (OAuth/SAML)","Elasticsearch","Audit Logs","WebSockets"], timeline: "10–20 нед", contactHint: "Обсудить портал",
    useFor: ["Корпоративные коммуникации", "Документооборот и заявки", "Управление задачами команды"],
    steps: ["Ядро: новости и задачи", "SSO и роли доступа", "Интеграции с почтой и HR", "Расширение модулей"],
    price: "от 900 000 ₽", priceEn: "from $10 000", image: "/portal.png",
  },
  cabinet: {
    fig: "03 · КАБИНЕТ", title: "Личные кабинеты",
    desc: "Клиент видит все свои данные, оплачивает и получает поддержку — без звонков в офис. Снижает нагрузку на команду.",
    tech: ["Next.js App Router","API Gateway","Email/Push","ACL","Redis"], timeline: "6–12 нед", contactHint: "Обсудить кабинет",
    useFor: ["B2C сервисы и подписки", "Личный кабинет клиента", "История заказов и оплаты"],
    steps: ["Авторизация и профиль", "История, оплаты и подписки", "Чат и уведомления", "SEO и производительность"],
    price: "от 500 000 ₽", priceEn: "from $5 600", image: "/client.png",
  },
  analytics: {
    fig: "04 · АНАЛИТИКА", title: "Аналитические панели",
    desc: "Цифры вместо ощущений: KPI, воронки, отчёты в реальном времени. Решения принимаются быстрее и точнее.",
    tech: ["ETL","PostgreSQL/OLAP","ClickHouse","Redis Cache"], timeline: "6–10 нед", contactHint: "Обсудить аналитику",
    useFor: ["Мониторинг KPI и метрик", "Отчётность для руководства", "Продуктовая аналитика"],
    steps: ["Модель данных и ETL", "Дашборды и виджеты", "Фильтры и экспорт", "Расписание и рассылка"],
    price: "от 600 000 ₽", priceEn: "from $6 700", image: "/analitick.png",
  },
  b2b: {
    fig: "05 · B2B", title: "B2B платформы",
    desc: "B2B-продажи онлайн: каталог с прайсами, заказы и интеграция с ERP. Менеджеры тратят время на сделки, не на переписку.",
    tech: ["Server Actions","CDN","RBAC","Payment Gateway","Caching"], timeline: "10–18 нед", contactHint: "Обсудить B2B",
    useFor: ["Оптовые продажи", "Партнёрские кабинеты", "Интеграция с ERP и 1С"],
    steps: ["Каталог и прайсинг", "Корзина и заказ", "Интеграция с ERP", "Кабинет партнёра и аналитика"],
    price: "от 1 000 000 ₽", priceEn: "from $11 100", image: "/b2b.png",
  },
  saas: {
    fig: "06 · SAAS", title: "SaaS сервисы",
    desc: "Продукт, который растёт с вами: подписки, мультитенантность и архитектура под тысячи пользователей с первого дня.",
    tech: ["Prisma ORM","Feature Flags","Docker/K8s","CI/CD"], timeline: "12–24 нед", contactHint: "Обсудить SaaS",
    useFor: ["Мультитенантность", "Биллинг и подписки", "Self-service онбординг"],
    steps: ["Мультитенант архитектура", "Биллинг и тарифы", "Онбординг и фичефлаги", "Масштабирование и мониторинг"],
    price: "от 1 500 000 ₽", priceEn: "from $16 700", image: "/saas.png",
  },
};

const TYPES_EN: Record<Kind, Item> = {
  crm: {
    fig: "01 · CRM", title: "CRM systems",
    desc: "Replaces spreadsheets and chats: pipelines, tasks, clients and analytics in one place. Your team moves faster.",
    tech: ["Node.js","PostgreSQL","Redis","GraphQL/REST","WebSockets"], timeline: "8–16 wks", contactHint: "Discuss CRM",
    useFor: ["Sales department automation", "Customer base management", "Funnel and conversion analytics"],
    steps: ["Process audit & CJM", "MVP with funnel and contacts", "Phone and email integrations", "Analytics and automation"],
    price: "от 700 000 ₽", priceEn: "from $7 800", image: "/crm.png",
  },
  portal: {
    fig: "02 · PORTAL", title: "Corporate portals",
    desc: "One tool for the whole team: tasks, documents, communication and access rights. No switching between services.",
    tech: ["SSO (OAuth/SAML)","Elasticsearch","Audit Logs","WebSockets"], timeline: "10–20 wks", contactHint: "Discuss portal",
    useFor: ["Corporate communications", "Document flow and requests", "Team task management"],
    steps: ["Core: news and tasks", "SSO and access roles", "Email and HR integrations", "Module expansion"],
    price: "от 900 000 ₽", priceEn: "from $10 000", image: "/portal.png",
  },
  cabinet: {
    fig: "03 · CABINET", title: "User portals",
    desc: "Clients see their data, pay and get support — without calling your office. Reduces load on your team.",
    tech: ["Next.js App Router","API Gateway","Email/Push","ACL","Redis"], timeline: "6–12 wks", contactHint: "Discuss portal",
    useFor: ["B2C services and subscriptions", "Customer personal account", "Order history and payments"],
    steps: ["Auth and profile", "History, payments and subscriptions", "Chat and notifications", "SEO and performance"],
    price: "от 500 000 ₽", priceEn: "from $5 600", image: "/client.png",
  },
  analytics: {
    fig: "04 · ANALYTICS", title: "Analytics dashboards",
    desc: "Numbers instead of gut feelings: KPIs, funnels, real-time reports. Decisions made faster and with confidence.",
    tech: ["ETL","PostgreSQL/OLAP","ClickHouse","Redis Cache"], timeline: "6–10 wks", contactHint: "Discuss analytics",
    useFor: ["KPI and metrics monitoring", "Executive reporting", "Product analytics"],
    steps: ["Data model and ETL", "Dashboards and widgets", "Filters and export", "Scheduling and delivery"],
    price: "от 600 000 ₽", priceEn: "from $6 700", image: "/analitick.png",
  },
  b2b: {
    fig: "05 · B2B", title: "B2B platforms",
    desc: "B2B sales online: catalog with pricing, orders and ERP integration. Sales reps focus on deals, not paperwork.",
    tech: ["Server Actions","CDN","RBAC","Payment Gateway","Caching"], timeline: "10–18 wks", contactHint: "Discuss B2B",
    useFor: ["Wholesale sales", "Partner portals", "ERP integration"],
    steps: ["Catalog and pricing", "Cart and order", "ERP integration", "Partner portal and analytics"],
    price: "от 1 000 000 ₽", priceEn: "from $11 100", image: "/b2b.png",
  },
  saas: {
    fig: "06 · SAAS", title: "SaaS services",
    desc: "A product that grows with you: subscriptions, multi-tenancy and architecture for thousands of users from day one.",
    tech: ["Prisma ORM","Feature Flags","Docker/K8s","CI/CD"], timeline: "12–24 wks", contactHint: "Discuss SaaS",
    useFor: ["Multi-tenancy", "Billing and subscriptions", "Self-service onboarding"],
    steps: ["Multi-tenant architecture", "Billing and pricing tiers", "Onboarding and feature flags", "Scaling and monitoring"],
    price: "от 1 500 000 ₽", priceEn: "from $16 700", image: "/saas.png",
  },
};

const KIND_KEYS: Kind[] = ["crm", "portal", "cabinet", "analytics", "b2b", "saas"];
const ROWS: [Kind, Kind, Kind][] = [
  ["crm", "portal", "cabinet"],
  ["analytics", "b2b", "saas"],
];

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════════════════════════════════ */
export default function WebAppKinds() {
  const { locale } = useI18n();
  const isEn = locale === "en";
  const TYPES = isEn ? TYPES_EN : TYPES_RU;
  const reduced = useReducedMotion();
  const [hovered,  setHovered]  = useState<string | null>(null);
  const [openKey,  setOpenKey]  = useState<Kind | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const itemListJsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Типы веб-приложений для бизнеса",
    itemListElement: KIND_KEYS.map((k, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: TYPES[k].title,
      description: TYPES[k].desc,
    })),
  }), []);

  return (
    <section
      id="kinds"
      style={{ background: BG, padding: isMobile ? "72px 0 60px" : "100px 0 80px", borderTop: "1px solid rgba(255,255,255,0.06)" }}
      aria-labelledby="kinds-title"
      itemScope
      itemType="https://schema.org/ItemList"
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: isMobile ? "0 20px" : "0 56px" }}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: 64 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ height: 2, width: 20, background: TEAL, borderRadius: 2, flexShrink: 0 }} />
            <span style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 500, color: TEAL }}>
              {isEn ? "Development directions" : "Направления разработки"}
            </span>
          </div>
          <h2
            id="kinds-title"
            className={serif.className}
            style={{ margin: 0, fontWeight: 400, lineHeight: 0.92, letterSpacing: "-0.04em" }}
          >
            <span style={{ display: "block", fontSize: "clamp(2.6rem, 6vw, 6rem)", color: TEAL }}>
              {isEn ? "Solution formats" : "Форматы решений"}
            </span>
            <span style={{ display: "block", fontSize: "clamp(2.6rem, 6vw, 6rem)", color: WHITE }}>
              {isEn ? "for your needs" : "под вашу задачу"}
            </span>
          </h2>
        </motion.div>

        {/* ── Two rows of 3 ── */}
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
                    onClick={() => setOpenKey(key as Kind)}
                    itemScope
                    itemType="https://schema.org/Service"
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
                    {/* FIG label */}
                    <div style={{ fontSize: 10, letterSpacing: "0.2em", color: TEAL, fontWeight: 500, marginBottom: 24, fontFamily: "monospace" }}>
                      {item.fig}
                    </div>

                    {/* SVG Wireframe */}
                    <div style={{
                      marginBottom: 28,
                      height: 160,
                      background: "rgba(255,255,255,0.02)",
                      border: `1px solid ${isHovered ? TEAL + "40" : "rgba(255,255,255,0.07)"}`,
                      borderRadius: 8,
                      overflow: "hidden",
                      padding: 4,
                      transition: "border-color 0.3s ease",
                    }}>
                      <VisualComp />
                    </div>

                    {/* Title */}
                    <h3
                      itemProp="name"
                      style={{
                        margin: "0 0 10px",
                        fontSize: "clamp(1.05rem, 1.6vw, 1.35rem)",
                        fontWeight: 600,
                        color: isHovered ? TEAL : WHITE,
                        letterSpacing: "-0.02em",
                        transition: "color 0.3s ease",
                      }}
                    >
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p
                      itemProp="description"
                      style={{ margin: "0 0 18px", fontSize: 14, lineHeight: 1.65, color: "rgba(244,250,248,0.45)", flex: 1 }}
                    >
                      {item.desc}
                    </p>

                    {/* Tech tags */}
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
                      {item.tech.map(t => (
                        <span key={t} style={{
                          fontSize: 10, padding: "3px 10px", borderRadius: 99,
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: "rgba(244,250,248,0.45)",
                          letterSpacing: "0.05em",
                        }}>
                          {t}
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

      <script
        id="ld-webappkinds-list"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      <WebAppModal
        openKey={openKey}
        onClose={() => setOpenKey(null)}
        payload={openKey ? TYPES[openKey] : null}
        isEn={isEn}
      />
    </section>
  );
}

/* ── Modal ────────────────────────────────────────────────────────────────── */
function WebAppModal({
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

  const kindToCalc: Record<Kind, string> = {
    crm: "crm", portal: "portal", cabinet: "client",
    analytics: "analytics", b2b: "b2b", saas: "saas",
  };
  const kindToContact: Record<Kind, string> = {
    crm: "internal", portal: "portal", cabinet: "portal",
    analytics: "dashboard", b2b: "marketplace", saas: "saas",
  };

  const jumpClose = useCallback((hash: string) => {
    if (openKey) {
      if (hash === "calculator") {
        window.dispatchEvent(new CustomEvent("webapp-calc-prefill", { detail: { kind: kindToCalc[openKey] } }));
      } else if (hash === "contact") {
        window.dispatchEvent(new CustomEvent("webapp-contact-prefill", { detail: { kind: kindToContact[openKey] } }));
      }
    }
    onClose();
    setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" }), 300);
  }, [onClose, openKey]);

  if (!mounted) return null;

  const figNum = payload ? payload.fig.split("·")[0].trim().replace(/^0/, "") + ".0" : "";

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
            role="dialog" aria-modal="true" aria-labelledby="webapp-modal-title"
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
                    id="webapp-modal-title"
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

                {/* Tech tags */}
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

                {/* Budget row */}
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
