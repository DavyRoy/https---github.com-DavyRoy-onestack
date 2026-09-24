// src/components/AiCapabilities.tsx
"use client";
import { serif } from "@/lib/fonts";

import { motion, useReducedMotion } from "framer-motion";
import {
  Brain, FileSearch, ScanText, MessagesSquare, Route, Mic,
  Languages, Plug, ChartLine, Gauge, type LucideIcon,
} from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

type Capability = { icon: LucideIcon; titleRu: string; titleEn: string; descRu: string; descEn: string };

const CAPABILITIES: Capability[] = [
  { icon: Brain,          titleRu: "Выбор модели под задачу",   titleEn: "Right model for the job",  descRu: "GPT, Claude, YandexGPT или open-source",       descEn: "GPT, Claude or open-source" },
  { icon: FileSearch,     titleRu: "Поиск по базе знаний",      titleEn: "Knowledge-base search",    descRu: "RAG по документам, вики и CRM",                 descEn: "RAG over docs, wiki and CRM" },
  { icon: ScanText,       titleRu: "Распознавание документов",  titleEn: "Document recognition",     descRu: "OCR счетов, договоров и сканов",                descEn: "OCR for invoices, contracts, scans" },
  { icon: MessagesSquare, titleRu: "Диалоги в каналах",         titleEn: "Conversations in channels", descRu: "Сайт, Telegram, WhatsApp, почта",              descEn: "Website, Telegram, WhatsApp, email" },
  { icon: Route,          titleRu: "Маршрутизация заявок",      titleEn: "Request routing",          descRu: "Классификация и передача ответственным",        descEn: "Classify and hand off to the right owner" },
  { icon: Mic,            titleRu: "Голос и звонки",            titleEn: "Voice and calls",          descRu: "Расшифровка и анализ разговоров",               descEn: "Call transcription and analysis" },
  { icon: Languages,      titleRu: "Мультиязычность",           titleEn: "Multilingual",             descRu: "Ответы и перевод на разных языках",             descEn: "Answers and translation in many languages" },
  { icon: Plug,           titleRu: "Интеграции",                titleEn: "Integrations",             descRu: "CRM, 1С, amoCRM, Битрикс24, API",               descEn: "CRM, ERP and any API" },
  { icon: ChartLine,      titleRu: "Прогнозы и скоринг",        titleEn: "Forecasts and scoring",    descRu: "Спрос, отток, качество лидов",                  descEn: "Demand, churn, lead quality" },
  { icon: Gauge,          titleRu: "Контроль качества",         titleEn: "Quality control",          descRu: "Метрики ответов, логи, дообучение",             descEn: "Answer metrics, logs, tuning" },
];

export default function AiCapabilities() {
  const { locale } = useI18n();
  const isEn = locale === "en";
  const reduced = useReducedMotion();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: isEn ? "AI solution capabilities" : "Возможности AI-решений",
    itemListElement: CAPABILITIES.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: isEn ? c.titleEn : c.titleRu,
      description: isEn ? c.descEn : c.descRu,
    })),
  };

  return (
    <section id="capabilities" className="site-types" aria-labelledby="ai-capabilities-title">
      <script id="ld-ai-capabilities" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="site-types__inner site-split">
        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="service-eyebrow">{isEn ? "03 / Capabilities" : "03 / Возможности"}</p>
          <h2 id="ai-capabilities-title" className={`${serif.className} site-types__title`}>
            {isEn ? <>What AI<br />can do for you</> : <>Что умеет<br />ИИ для вас</>}
          </h2>
          <p className="site-types__sub" style={{ marginTop: 24 }}>
            {isEn
              ? "We assemble the solution from proven building blocks and connect it to your data and systems."
              : "Собираем решение из проверенных блоков и подключаем к вашим данным и системам."}
          </p>
        </motion.div>

        <ul className="mod-list">
          {CAPABILITIES.map(c => {
            const Icon = c.icon;
            return (
              <li key={c.titleEn} className="mod-item">
                <span className="mod-item__name"><Icon size={18} aria-hidden="true" />{isEn ? c.titleEn : c.titleRu}</span>
                <span className="mod-item__desc">{isEn ? c.descEn : c.descRu}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
