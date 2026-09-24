// src/components/AiProcess.tsx
"use client";
import { serif } from "@/lib/fonts";

import { motion, useReducedMotion } from "framer-motion";
import {
  ClipboardList, FlaskConical, Plug, Rocket, ChartLine, RefreshCcw,
  ShieldCheck, Server, Lock, EyeOff, FileText, UserCheck, type LucideIcon,
} from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

type Point = { icon: LucideIcon; titleRu: string; titleEn: string; descRu: string; descEn: string };

const STAGES: Point[] = [
  { icon: ClipboardList, titleRu: "Аудит задачи",           titleEn: "Task audit",            descRu: "Процессы, данные и метрика успеха",       descEn: "Processes, data and success metric" },
  { icon: FlaskConical,  titleRu: "Короткий пилот",         titleEn: "Short pilot",           descRu: "Проверка на ваших реальных данных",       descEn: "Tested on your real data" },
  { icon: Plug,          titleRu: "Интеграция",             titleEn: "Integration",           descRu: "Каналы, CRM и учётные системы",           descEn: "Channels, CRM and ERP" },
  { icon: Rocket,        titleRu: "Запуск",                 titleEn: "Launch",                descRu: "Поэтапно, с участием команды",            descEn: "Step by step, with your team" },
  { icon: ChartLine,     titleRu: "Замер эффекта",          titleEn: "Impact measurement",    descRu: "Экономия часов и рост конверсии",         descEn: "Hours saved and conversion lift" },
  { icon: RefreshCcw,    titleRu: "Развитие",               titleEn: "Improvement",           descRu: "Дообучение и новые сценарии",             descEn: "Tuning and new scenarios" },
];

const SECURITY: Point[] = [
  { icon: Server,    titleRu: "Размещение по вашим требованиям", titleEn: "Hosted to your requirements", descRu: "Для данных в РФ — YandexGPT, GigaChat или ваш контур", descEn: "Local models or your own infrastructure if data must stay in-country" },
  { icon: Lock,      titleRu: "Шифрование",                 titleEn: "Encryption",              descRu: "Данные защищены при передаче и хранении", descEn: "Data encrypted in transit and at rest" },
  { icon: EyeOff,    titleRu: "Маскирование данных",        titleEn: "Data masking",            descRu: "Персональные данные скрываем до отправки в модель", descEn: "Personal data is masked before it reaches the model" },
  { icon: UserCheck, titleRu: "Роли и доступы",             titleEn: "Roles and access",        descRu: "Каждый видит только своё",           descEn: "Everyone sees only their own data" },
  { icon: FileText,  titleRu: "Логи и аудит",               titleEn: "Logs and audit",          descRu: "История запросов и ответов",         descEn: "Full request and answer history" },
  { icon: ShieldCheck, titleRu: "Договор и NDA",            titleEn: "Contract and NDA",        descRu: "Персональные данные — по 152-ФЗ",    descEn: "Personal data handled under the law" },
];

export default function AiProcess() {
  const { locale } = useI18n();
  const isEn = locale === "en";
  const reduced = useReducedMotion();

  const groups = [
    { key: "stages",   label: isEn ? "How we implement" : "Как внедряем",           items: STAGES },
    { key: "security", label: isEn ? "Data and security" : "Данные и безопасность", items: SECURITY },
  ];

  return (
    <section id="process" className="site-types" aria-labelledby="ai-process-title">
      <div className="site-types__inner">
        <motion.div
          className="site-types__head"
          initial={reduced ? undefined : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <p className="service-eyebrow">{isEn ? "04 / Implementation" : "04 / Внедрение"}</p>
            <h2 id="ai-process-title" className={`${serif.className} site-types__title`}>
              {isEn ? <>From pilot to result<br />— safely</> : <>От пилота к результату<br />— безопасно</>}
            </h2>
          </div>
          <p className="site-types__sub">
            {isEn
              ? "We start with a short pilot on your data, so you see the impact before scaling."
              : "Начинаем с короткого пилота на ваших данных — эффект видно до масштабирования."}
          </p>
        </motion.div>

        <div className="site-types__lists perf-groups">
          {groups.map(g => (
            <div key={g.key}>
              <p className="site-types__list-label">{g.label}</p>
              <ul className="mod-list mod-list--single">
                {g.items.map(p => {
                  const Icon = p.icon;
                  return (
                    <li key={p.titleEn} className="mod-item">
                      <span className="mod-item__name"><Icon size={18} aria-hidden="true" />{isEn ? p.titleEn : p.titleRu}</span>
                      <span className="mod-item__desc">{isEn ? p.descEn : p.descRu}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
