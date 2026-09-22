"use client";

import { ArrowDown, ArrowUpRight } from "lucide-react";
import { serif } from "@/lib/fonts";
import { useI18n } from "@/i18n/I18nProvider";

export type ServiceKind = "sites" | "webapp" | "mobile";

const COPY = {
  sites: {
    ru: { tag: "01 / Разработка сайтов", title: "Сайты для", accent: "вашего бизнеса", description: "От первого знакомства до заявки и покупки. Создаём лендинги, корпоративные сайты и интернет-магазины — с удобным управлением и поддержкой после запуска.", types: ["Лендинги", "Корпоративные сайты", "Интернет-магазины"] },
    en: { tag: "01 / Website development", title: "Websites for", accent: "your business", description: "From a first impression to an enquiry or purchase. We build landing pages, corporate websites and online stores, with content management and post-launch support.", types: ["Landing pages", "Corporate websites", "Online stores"] },
  },
  webapp: {
    ru: { tag: "02 / Веб-приложения", title: "Ваши процессы.", accent: "Одна система.", description: "Объединяем клиентов, данные и рабочие процессы. Разрабатываем CRM, личные кабинеты и SaaS-продукты, которые помогают команде работать проще.", types: ["CRM и ERP", "Личные кабинеты", "SaaS-платформы"] },
    en: { tag: "02 / Web applications", title: "Your workflows.", accent: "One system.", description: "Bring customers, data and workflows together. We build CRM systems, client portals and SaaS products that make everyday work easier.", types: ["CRM & ERP", "Client portals", "SaaS platforms"] },
  },
  mobile: {
    ru: { tag: "03 / Мобильные приложения", title: "Ваш продукт.", accent: "Всегда рядом.", description: "Создаём приложения для iOS и Android: от сценариев и дизайна до разработки, публикации и развития. Для ваших клиентов и вашей команды.", types: ["iOS и Android", "Клиентские сервисы", "Приложения для команды"] },
    en: { tag: "03 / Mobile applications", title: "Your product.", accent: "Within reach.", description: "Apps for iOS and Android, from user journeys and design to development, publishing and ongoing improvements. For your customers and your team.", types: ["iOS & Android", "Customer services", "Team applications"] },
  },
};

export default function ServiceHero({ service, onCalculate }: { service: ServiceKind; onCalculate: () => void }) {
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
        <div className="service-hero__bottom">
          <div>
            <p className="service-hero__description">{copy.description}</p>
            <div className="service-actions">
              <a className="service-button service-button--primary" href="#contact">
                {isEn ? "Discuss your project" : "Обсудить проект"}<ArrowUpRight size={18} aria-hidden="true" />
              </a>
              <button className="service-button service-button--secondary" onClick={onCalculate} type="button" aria-haspopup="dialog">
                {isEn ? "Estimate the cost" : "Рассчитать стоимость"}
              </button>
            </div>
          </div>
          <ul className="service-hero__types">
            {copy.types.map((type, index) => <li key={type}><span>0{index + 1}</span>{type}</li>)}
          </ul>
        </div>
        <a className="service-hero__explore" href="#service-sections">
          {isEn ? "Explore the possibilities" : "Посмотреть возможности"}<ArrowDown size={16} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
