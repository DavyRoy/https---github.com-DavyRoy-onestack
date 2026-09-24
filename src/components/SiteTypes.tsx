// src/components/SiteTypes.tsx
"use client";
import { serif } from "@/lib/fonts";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Building2, Check, IdCard, Images, Newspaper, Rocket, ShoppingCart, type LucideIcon } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

/* ── Data ───────────────────────────────────────────────────────────────── */
type ColData = {
  fig: string;
  title: string;
  desc: string;
  tags: string[];
  price: string;
  priceEn: string;
  timeline: string;
  useFor: string[];
  steps: string[];
  image: string;
};

const ROWS: Record<"ru"|"en", ColData[][]> = {
  ru: [
    [
      {
        fig: "01 · LANDING", title: "Лендинг",
        desc: "Один экран — одна цель. Конвертируем трафик в заявки: сторителлинг, A/B-тесты и интеграция с рекламными кабинетами.",
        tags: ["Конверсия", "A/B", "Реклама"],
        price: "от 120 000 ₽", priceEn: "from $1 360", timeline: "1–2 нед",
        useFor: ["Прелонч и релиз продукта", "Рекламные кампании", "Сбор лидов"],
        steps: ["Сторителлинг", "Анимации секций", "Формы и интеграции", "Запуск и оптимизация"],
        image: "/site_lend.png",
      },
      {
        fig: "02 · CORPORATE", title: "Корпоративный сайт",
        desc: "Полноценный голос компании: услуги, команда, кейсы и блог под одной CMS. Редакторы правят без программиста.",
        tags: ["Б2Б", "CMS", "i18n"],
        price: "от 336 000 ₽", priceEn: "from $3 760", timeline: "3–6 нед",
        useFor: ["Б2Б-компании и холдинги", "Мультиязычные сайты", "Контент-маркетинг и PR"],
        steps: ["Информационная архитектура", "Дизайн-система", "Интеграция CMS/поиска", "Релиз и SEO-тюнинг"],
        image: "/site_corp.png",
      },
      {
        fig: "03 · ECOMMERCE", title: "Интернет-магазин",
        desc: "Магазин, который продаёт: умный каталог, быстрый чекаут, оплаты и склад. Страницы грузятся за ≤1 с.",
        tags: ["D2C", "Оплаты", "CRM"],
        price: "от 576 000 ₽", priceEn: "from $6 400", timeline: "4–8 нед",
        useFor: ["D2C-бренды", "Каталоги с вариациями и фильтрами", "Промо и система скидок"],
        steps: ["Схема каталога и склада", "UX корзины и чекаута", "Интеграции и оплаты", "Запуск и A/B-тесты"],
        image: "/site_shop.png",
      },
    ],
    [
      {
        fig: "04 · CARD", title: "Сайт-визитка",
        desc: "Быстрый старт за 1–2 нед. Понятная структура, форма заявки и аналитика — всё чтобы начать получать клиентов.",
        tags: ["Быстрый старт", "Эксперт"],
        price: "от 64 000 ₽", priceEn: "from $720", timeline: "1–2 нед",
        useFor: ["Быстро «выйти в онлайн»", "Презентация услуг и компетенций", "Контакты и форма заявки"],
        steps: ["Бриф и структура", "Дизайн ключевых экранов", "Верстка и интеграция", "Запуск и аналитика"],
        image: "/site_visio.png",
      },
      {
        fig: "05 · MEDIA", title: "Инфо-портал",
        desc: "Контент работает на вас: SEO-структура, удобный редактор, подписки и рекомендации. Индексируется с первого дня.",
        tags: ["Контент", "CMS", "SEO"],
        price: "от 224 000 ₽", priceEn: "from $2 480", timeline: "2–4 нед",
        useFor: ["Медиа и блоги", "Документации и гайдовые порталы", "Контент-маркетинг"],
        steps: ["Контент-модель", "Редактор и медиатека", "Поиск и рекомендации", "SEO и аналитика"],
        image: "/site_info.png",
      },
      {
        fig: "06 · PORTFOLIO", title: "Портфолио",
        desc: "Продаёт без слов: детальные кейсы, галерея работ и отзывы. Первое впечатление о вас — формируем вместе.",
        tags: ["Агентство", "Кейсы"],
        price: "от 96 000 ₽", priceEn: "from $1 040", timeline: "1–3 нед",
        useFor: ["Эксперты и персональный бренд", "Студии и агентства", "Творческие портфолио"],
        steps: ["Карточки кейсов", "Детальные страницы", "Импорт и интеграции", "Оптимизация скорости"],
        image: "/site_port.png",
      },
    ],
  ],
  en: [
    [
      {
        fig: "01 · LANDING", title: "Landing page",
        desc: "One page, one goal. We turn traffic into leads: storytelling, A/B tests and ad platform integrations.",
        tags: ["Conversion", "A/B", "Ads"],
        price: "от 120 000 ₽", priceEn: "from $1 360", timeline: "1–2 wks",
        useFor: ["Pre-launch and product release", "Ad campaigns", "Lead generation"],
        steps: ["Storytelling", "Section animations", "Forms & integrations", "Launch & optimization"],
        image: "/site_lend.png",
      },
      {
        fig: "02 · CORPORATE", title: "Corporate website",
        desc: "Your company's full voice: services, team, cases and blog under one CMS. Editors update without a developer.",
        tags: ["B2B", "CMS", "i18n"],
        price: "от 336 000 ₽", priceEn: "from $3 760", timeline: "3–6 wks",
        useFor: ["B2B companies and holdings", "Multilingual websites", "Content marketing and PR"],
        steps: ["Information architecture", "Design system", "CMS/search integration", "Release & SEO tuning"],
        image: "/site_corp.png",
      },
      {
        fig: "03 · ECOMMERCE", title: "Online store",
        desc: "A store that sells: smart catalog, fast checkout, payments and warehouse sync. Pages load in ≤1 s.",
        tags: ["D2C", "Payments", "CRM"],
        price: "от 576 000 ₽", priceEn: "from $6 400", timeline: "4–8 wks",
        useFor: ["D2C brands", "Catalogs with variants and filters", "Promos and discount systems"],
        steps: ["Catalog & inventory schema", "Cart & checkout UX", "Integrations & payments", "Launch & A/B tests"],
        image: "/site_shop.png",
      },
    ],
    [
      {
        fig: "04 · CARD", title: "Business card",
        desc: "Online in 1–2 weeks. Clear structure, inquiry form and analytics — everything to start getting clients.",
        tags: ["Quick start", "Expert"],
        price: "от 64 000 ₽", priceEn: "from $720", timeline: "1–2 wks",
        useFor: ["Get online quickly", "Present services and expertise", "Contacts and inquiry form"],
        steps: ["Brief & structure", "Key screen design", "Layout & integration", "Launch & analytics"],
        image: "/site_visio.png",
      },
      {
        fig: "05 · MEDIA", title: "Info portal",
        desc: "Content that works for you: SEO structure, easy editor, subscriptions and recommendations. Indexed from day one.",
        tags: ["Content", "CMS", "SEO"],
        price: "от 224 000 ₽", priceEn: "from $2 480", timeline: "2–4 wks",
        useFor: ["Media and blogs", "Documentation and guide portals", "Content marketing"],
        steps: ["Content model", "Editor & media library", "Search & recommendations", "SEO & analytics"],
        image: "/site_info.png",
      },
      {
        fig: "06 · PORTFOLIO", title: "Portfolio",
        desc: "Sells without words: detailed cases, work gallery and testimonials. Your first impression — crafted together.",
        tags: ["Agency", "Cases"],
        price: "от 96 000 ₽", priceEn: "from $1 040", timeline: "1–3 wks",
        useFor: ["Experts and personal brand", "Studios and agencies", "Creative portfolios"],
        steps: ["Case cards", "Detail pages", "Import & integrations", "Speed optimization"],
        image: "/site_port.png",
      },
    ],
  ],
};

/* Вид проекта для предзаполнения калькулятора и формы — по порядку вкладок. */
const KINDS = ["landing", "corporate", "ecommerce", "business", "content", "portfolio"] as const;
const ICONS: LucideIcon[] = [Rocket, Building2, ShoppingCart, IdCard, Newspaper, Images];

/* ── Component ──────────────────────────────────────────────────────────── */
export default function SiteTypes() {
  const { locale } = useI18n();
  const isEn = locale === "en";
  const items = ROWS[isEn ? "en" : "ru"].flat();
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);

  const t = isEn
    ? { label: "02 / Site types", title: ["Choose a format", "for your needs"], sub: "Pick a format — we'll show what's included, the stages and the budget.", useFor: "Suitable for", steps: "Work stages", discuss: "Discuss the project", calc: "Estimate the cost" }
    : { label: "02 / Типы сайтов", title: ["Выберите формат", "под вашу задачу"], sub: "Выберите формат — покажем состав, этапы и бюджет.", useFor: "Подходит для", steps: "Этапы работы", discuss: "Обсудить проект", calc: "Рассчитать стоимость" };

  const goContact = () => {
    window.dispatchEvent(new CustomEvent("contact-kind-prefill", { detail: { kind: KINDS[active] } }));
    document.getElementById("contact")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  };
  const goCalc = () => {
    window.dispatchEvent(new CustomEvent("calc-prefill", { detail: { kind: KINDS[active] } }));
  };

  return (
    <section id="types" className="site-types" aria-labelledby="site-types-title">
      <div className="site-types__inner">
        <div className="site-types__head">
          <div>
            <p className="service-eyebrow">{t.label}</p>
            <h2 id="site-types-title" className={`${serif.className} site-types__title`}>
              {t.title[0]}<br />{t.title[1]}
            </h2>
          </div>
          <p className="site-types__sub">{t.sub}</p>
        </div>

        <div className="site-types__tabs" role="tablist" aria-label={isEn ? "Site types" : "Типы сайтов"}>
          {items.map((it, i) => {
            const Icon = ICONS[i];
            return (
            <button
              key={it.fig}
              type="button"
              role="tab"
              id={`site-tab-${i}`}
              aria-selected={i === active}
              aria-controls={`site-type-panel-${i}`}
              className="site-tab"
              onClick={() => setActive(i)}
            >
              <span className="site-tab__fig">{it.fig.replace(" · ", " / ")}</span>
              <span className="site-tab__name"><Icon size={16} aria-hidden="true" />{it.title}</span>
            </button>
            );
          })}
        </div>

        {/* Все шесть панелей в разметке — поисковик видит содержимое каждого типа,
            посетитель — только выбранную вкладку. */}
        {items.map((item, i) => (
          <motion.div
            key={item.fig}
            id={`site-type-panel-${i}`}
            role="tabpanel"
            aria-labelledby={`site-tab-${i}`}
            hidden={i !== active}
            className="site-types__panel"
            initial={false}
            animate={i === active ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: reduced ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div>
              <h3 className={`${serif.className} site-types__name`}>{item.title}</h3>
              <p className="site-types__desc">{item.desc}</p>
              <p className="site-types__budget">
                <span className="site-type__price">{isEn ? item.priceEn : item.price}</span>
                <span className="site-type__time">{item.timeline}</span>
              </p>
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
                  {item.useFor.map(u => (
                    <li key={u}><Check size={16} aria-hidden="true" />{u}</li>
                  ))}
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
        ))}
      </div>
    </section>
  );
}
