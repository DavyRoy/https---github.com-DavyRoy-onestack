"use client";
import SectionLayers, { type LayerDef } from "@/components/SectionLayers";

import WebAppKinds from "@/components/WebAppKinds";
import WebAppModules from "@/components/WebAppModules";
import WebAppCalculator from "@/components/WebAppCalculator";
import WebAppContact from "@/components/WebAppContact";

const BG    = "#07100e";
const TEAL  = "#2dd4bf";
const WHITE = "#f4faf8";

/* Та же палитра слоёв, что на /sites, — страницы должны читаться как одна серия. */
const LAYERS: LayerDef[] = [
  {
    key: "kinds", bg: "#0c1a17", fg: WHITE,
    ru: { eyebrow: "Направления разработки", title: "Типы систем" },
    en: { eyebrow: "What we build", title: "System types" },
    render: () => <WebAppKinds />,
  },
  {
    key: "modules", bg: "#123b33", fg: WHITE,
    ru: { eyebrow: "Из чего собираем", title: "Готовые модули" },
    en: { eyebrow: "Building blocks", title: "Ready modules" },
    render: () => <WebAppModules />,
  },
  {
    key: "calculator", bg: "#1c6b5c", fg: WHITE,
    ru: { eyebrow: "Оценка бюджета", title: "Калькулятор" },
    en: { eyebrow: "Budget estimate", title: "Calculator" },
    render: () => <WebAppCalculator />,
  },
  {
    key: "contact", bg: TEAL, fg: BG,
    ru: { eyebrow: "Бриф и контакты", title: "Обсудить проект" },
    en: { eyebrow: "Brief & contacts", title: "Start a project" },
    render: () => <WebAppContact />,
  },
];

export default function WebAppLayers() {
  return (
    <SectionLayers
      layers={LAYERS}
      h1Ru="Разработка веб-приложений: CRM и ERP, личные кабинеты, SaaS-платформы"
      h1En="Web application development: CRM and ERP, client portals, SaaS platforms"
      ariaLabelRu="Разделы по веб-приложениям"
      ariaLabelEn="Web application services"
    />
  );
}
