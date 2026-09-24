// src/components/AiTypes.tsx
"use client";
import { serif } from "@/lib/fonts";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Bot, ChartLine, Check, Puzzle, Workflow, type LucideIcon } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

type Kind = "assistants" | "automation" | "product" | "analytics";

type Item = {
  fig: string;
  title: string;
  desc: string;
  tech: string[];
  timeline: string;
  useFor: string[];
  steps: string[];
};

const KIND_KEYS: Kind[] = ["assistants", "automation", "product", "analytics"];
const ICONS: Record<Kind, LucideIcon> = { assistants: Bot, automation: Workflow, product: Puzzle, analytics: ChartLine };

const TYPES_RU: Record<Kind, Item> = {
  assistants: {
    fig: "01 · ASSISTANTS", title: "AI-чат-боты и ассистенты",
    desc: "Отвечают клиентам и сотрудникам 24/7 по вашей базе знаний: на сайте, в Telegram и внутри CRM. Сложные вопросы передают менеджеру.",
    tech: ["LLM (YandexGPT, GigaChat, GPT, Claude)", "RAG", "Векторный поиск", "Telegram / Web"],
    timeline: "3–6 нед",
    useFor: ["Поддержка клиентов и FAQ", "Внутренний помощник по регламентам", "Квалификация заявок с сайта"],
    steps: ["Сбор базы знаний и сценариев", "Прототип и проверка качества ответов", "Интеграция в каналы и CRM", "Запуск, аналитика и дообучение"],
  },
  automation: {
    fig: "02 · AUTOMATION", title: "Автоматизация процессов",
    desc: "ИИ разбирает входящие заявки, письма и документы: извлекает данные, классифицирует и раскладывает по системам без ручной работы.",
    tech: ["LLM", "OCR", "n8n / очереди", "API CRM и 1С"],
    timeline: "4–8 нед",
    useFor: ["Обработка заявок и писем", "Распознавание счетов и договоров", "Скоринг и маршрутизация лидов"],
    steps: ["Аудит процесса и метрик", "Пилот на реальных данных", "Интеграции с CRM и учётными системами", "Масштабирование и контроль качества"],
  },
  product: {
    fig: "03 · PRODUCT", title: "Интеграция ИИ в продукты",
    desc: "Добавляем интеллект в ваш сайт или приложение: умный поиск, рекомендации, генерация контента и помощник внутри интерфейса.",
    tech: ["LLM API", "Embeddings", "Next.js / React Native", "Кэш и лимиты"],
    timeline: "6–12 нед",
    useFor: ["Умный поиск по каталогу", "Персональные рекомендации", "Помощник внутри личного кабинета"],
    steps: ["Сценарии и ожидаемый эффект", "Прототип функции", "Встраивание в продукт и A/B-тест", "Оптимизация стоимости и скорости"],
  },
  analytics: {
    fig: "04 · ANALYTICS", title: "AI-аналитика и прогнозирование",
    desc: "Предиктивные модели на ваших данных: прогноз спроса и оттока, скоринг клиентов, поиск аномалий и понятные отчёты для руководства.",
    tech: ["Python", "ML-модели", "ClickHouse / PostgreSQL", "Дашборды"],
    timeline: "6–10 нед",
    useFor: ["Прогноз продаж и спроса", "Предсказание оттока клиентов", "Выявление аномалий и мошенничества"],
    steps: ["Аудит данных", "Модель и проверка точности", "Дашборды и интеграция", "Мониторинг и переобучение"],
  },
};

const TYPES_EN: Record<Kind, Item> = {
  assistants: {
    fig: "01 · ASSISTANTS", title: "AI chatbots & assistants",
    desc: "Answer customers and staff 24/7 from your knowledge base — on your website, in Telegram and inside your CRM. Hard questions go to a manager.",
    tech: ["LLM (GPT, Claude)", "RAG", "Vector search", "Telegram / Web"],
    timeline: "3–6 wks",
    useFor: ["Customer support and FAQ", "Internal policy assistant", "Qualifying website leads"],
    steps: ["Knowledge base and scenarios", "Prototype and answer-quality checks", "Channel and CRM integration", "Launch, analytics and tuning"],
  },
  automation: {
    fig: "02 · AUTOMATION", title: "Process automation",
    desc: "AI reads incoming requests, emails and documents: extracts data, classifies it and routes it into your systems with no manual work.",
    tech: ["LLM", "OCR", "n8n / queues", "CRM and ERP APIs"],
    timeline: "4–8 wks",
    useFor: ["Handling requests and emails", "Reading invoices and contracts", "Lead scoring and routing"],
    steps: ["Process and metrics audit", "Pilot on real data", "CRM and ERP integrations", "Scaling and quality control"],
  },
  product: {
    fig: "03 · PRODUCT", title: "AI in existing products",
    desc: "We add intelligence to your website or app: smart search, recommendations, content generation and an in-app assistant.",
    tech: ["LLM API", "Embeddings", "Next.js / React Native", "Caching and limits"],
    timeline: "6–12 wks",
    useFor: ["Smart catalog search", "Personal recommendations", "Assistant inside the customer account"],
    steps: ["Scenarios and expected impact", "Feature prototype", "Product integration and A/B test", "Cost and speed optimisation"],
  },
  analytics: {
    fig: "04 · ANALYTICS", title: "AI analytics & forecasting",
    desc: "Predictive models on your data: demand and churn forecasts, customer scoring, anomaly detection and clear reports for management.",
    tech: ["Python", "ML models", "ClickHouse / PostgreSQL", "Dashboards"],
    timeline: "6–10 wks",
    useFor: ["Sales and demand forecasting", "Churn prediction", "Anomaly and fraud detection"],
    steps: ["Data audit", "Model and accuracy check", "Dashboards and integration", "Monitoring and retraining"],
  },
};

export default function AiTypes() {
  const { locale } = useI18n();
  const isEn = locale === "en";
  const TYPES = isEn ? TYPES_EN : TYPES_RU;
  const reduced = useReducedMotion();
  const [active, setActive] = useState<Kind>("assistants");

  const t = isEn
    ? { label: "02 / Solutions", title: ["AI solutions", "for your tasks"], sub: "Pick a direction — we'll show what's included, the stages and the timeline.", useFor: "Suitable for", steps: "Work stages", price: "Priced on request", discuss: "Discuss the project" }
    : { label: "02 / Решения", title: ["AI-решения", "под ваши задачи"], sub: "Выберите направление — покажем состав, этапы и сроки.", useFor: "Подходит для", steps: "Этапы работы", price: "Стоимость по запросу", discuss: "Обсудить проект" };

  const goContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <section id="types" className="site-types" aria-labelledby="ai-types-title">
      <div className="site-types__inner">
        <div className="site-types__head">
          <div>
            <p className="service-eyebrow">{t.label}</p>
            <h2 id="ai-types-title" className={`${serif.className} site-types__title`}>
              {t.title[0]}<br />{t.title[1]}
            </h2>
          </div>
          <p className="site-types__sub">{t.sub}</p>
        </div>

        <div className="site-types__tabs" role="tablist" aria-label={isEn ? "AI solutions" : "AI-решения"}>
          {KIND_KEYS.map(k => {
            const it = TYPES[k];
            const Icon = ICONS[k];
            return (
              <button
                key={k}
                type="button"
                role="tab"
                id={`ai-tab-${k}`}
                aria-selected={k === active}
                aria-controls={`ai-panel-${k}`}
                className="site-tab"
                onClick={() => setActive(k)}
              >
                <span className="site-tab__fig">{it.fig.replace(" · ", " / ")}</span>
                <span className="site-tab__name"><Icon size={16} aria-hidden="true" />{it.title}</span>
              </button>
            );
          })}
        </div>

        {/* Все панели в разметке — поисковик видит каждое направление, посетитель — выбранное. */}
        {KIND_KEYS.map(k => {
          const item = TYPES[k];
          return (
            <motion.div
              key={k}
              id={`ai-panel-${k}`}
              role="tabpanel"
              aria-labelledby={`ai-tab-${k}`}
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
                  <span className="site-type__price">{t.price}</span>
                  <span className="site-type__time">{item.timeline}</span>
                </p>
                <ul className="site-types__tech" aria-label={isEn ? "Technologies" : "Технологии"}>
                  {item.tech.map(tech => <li key={tech}>{tech}</li>)}
                </ul>
                <div className="site-types__actions">
                  <button type="button" className="service-button service-button--primary" onClick={goContact}>
                    {t.discuss}<ArrowUpRight size={18} aria-hidden="true" />
                  </button>
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
