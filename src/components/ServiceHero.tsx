"use client";

import { ArrowUpRight } from "lucide-react";
import { serif } from "@/lib/fonts";
import { useI18n } from "@/i18n/I18nProvider";

export type ServiceKind = "sites" | "webapp" | "mobile" | "ai";

const COPY = {
  sites: {
    ru: { tag: "Разработка сайтов", title: "Сайты для", accent: "вашего бизнеса", description: "Сайты, которые приводят заявки: лендинги, корпоративные сайты и интернет-магазины под ключ — от 1 недели." },
    en: { tag: "Website development", title: "Websites for", accent: "your business", description: "Websites that bring in leads: landing pages, corporate sites and online stores, turnkey — from 1 week." },
  },
  webapp: {
    ru: { tag: "Веб-приложения", title: "Ваши процессы.", accent: "Одна система.", description: "CRM, личные кабинеты и SaaS, которые убирают рутину и собирают данные бизнеса в одном месте." },
    en: { tag: "Web applications", title: "Your workflows.", accent: "One system.", description: "CRM, client portals and SaaS that remove routine work and keep your business data in one place." },
  },
  ai: {
    ru: { tag: "AI и автоматизация", title: "Интеллект,", accent: "который работает.", description: "AI-ассистенты, автоматизация процессов и ИИ внутри ваших продуктов — на ваших данных и с понятным результатом." },
    en: { tag: "AI & automation", title: "Intelligence", accent: "that gets to work.", description: "AI assistants, process automation and AI inside your products — built on your data, with measurable results." },
  },
  mobile: {
    ru: { tag: "Мобильные приложения", title: "Ваш продукт.", accent: "Всегда рядом.", description: "Приложения для iOS и Android, которыми пользуются каждый день, — от идеи до публикации в App Store и Google Play." },
    en: { tag: "Mobile applications", title: "Your product.", accent: "Within reach.", description: "iOS and Android apps people use every day — from idea to launch in the App Store and Google Play." },
  },
};

export default function ServiceHero({ service, onCalculate }: { service: ServiceKind; onCalculate?: () => void }) {
  const { locale } = useI18n();
  const isEn = locale === "en";
  const copy = COPY[service][isEn ? "en" : "ru"];

  return (
    <section className="service-hero" aria-labelledby="service-title">
      <div className="service-hero__inner">
        <p className="service-eyebrow">OneStack <span aria-hidden="true">—</span> {copy.tag}</p>
        <h1 id="service-title" className={`${serif.className} service-hero__title`}>
          {copy.title}<br /><span>{copy.accent}</span>
        </h1>
        <p className="service-hero__description">{copy.description}</p>
        <div className="service-actions">
          <a className="service-button service-button--primary" href="#contact">
            {isEn ? "Discuss your project" : "Обсудить проект"}<ArrowUpRight size={18} aria-hidden="true" />
          </a>
          {onCalculate && <button className="service-text-link" onClick={onCalculate} type="button">
            {isEn ? "Estimate the cost" : "Рассчитать стоимость"}<ArrowUpRight size={18} aria-hidden="true" />
          </button>}
        </div>
      </div>
    </section>
  );
}
