"use client";
import SectionLayers, { type LayerDef } from "@/components/SectionLayers";

import MobileTypes from "@/components/MobileTypes";
import MobileFeatures from "@/components/MobileFeatures";
import MobileCalculator from "@/components/MobileCalculator";
import MobilePerfSecurity from "@/components/MobilePerfSecurity";

const WHITE = "#f4faf8";

/* Та же серия, что на /sites и /webapp, но разделов пять — палитра растянута
   на один шаг, чтобы переход от тёмного к бирюзовому остался ровным. */
const LAYERS: LayerDef[] = [
  {
    key: "types", bg: "#0c1a17", fg: WHITE,
    ru: { eyebrow: "Форматы приложений", title: "Типы приложений" },
    en: { eyebrow: "App formats", title: "App types" },
    render: () => <MobileTypes />,
  },
  {
    key: "features", bg: "#103029", fg: WHITE,
    ru: { eyebrow: "Что умеет приложение", title: "Возможности" },
    en: { eyebrow: "What the app can do", title: "Capabilities" },
    render: () => <MobileFeatures />,
  },
  {
    key: "calculator", bg: "#17493f", fg: WHITE,
    ru: { eyebrow: "Оценка бюджета", title: "Калькулятор" },
    en: { eyebrow: "Budget estimate", title: "Calculator" },
    render: () => <MobileCalculator />,
  },
  {
    key: "perf", bg: "#1f7a69", fg: WHITE,
    // «Производительность» — 18 букв одним словом, на телефоне не помещалось
    // в строку и наезжало на стрелку. Двусловный заголовок переносится.
    ru: { eyebrow: "Нагрузки и безопасность", title: "Скорость и защита" },
    en: { eyebrow: "Load and security", title: "Speed & safety" },
    render: () => <MobilePerfSecurity />,
  },
];

export default function MobileLayers() {
  return (
    <SectionLayers
      layers={LAYERS}
      service="mobile"
      ariaLabelRu="Разделы по мобильным приложениям"
      ariaLabelEn="Mobile app services"
    />
  );
}
