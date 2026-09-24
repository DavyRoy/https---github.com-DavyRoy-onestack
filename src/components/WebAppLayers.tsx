"use client";
import SectionLayers, { type LayerDef } from "@/components/SectionLayers";

import WebAppKinds from "@/components/WebAppKinds";
import WebAppModules from "@/components/WebAppModules";
import WebAppCalculator from "@/components/WebAppCalculator";

const WHITE = "#f4faf8";

/* Та же палитра слоёв, что на /sites, — страницы должны читаться как одна серия. */
const LAYERS: LayerDef[] = [
  {
    key: "kinds", bg: "#0c1a17", fg: WHITE,
    ru: { eyebrow: "Направления разработки", title: "Типы систем" },
    en: { eyebrow: "What we build", title: "System types" },
    render: () => <WebAppKinds />,
    inline: true,
  },
  {
    key: "modules", bg: "#123b33", fg: WHITE,
    ru: { eyebrow: "Из чего собираем", title: "Готовые модули" },
    en: { eyebrow: "Building blocks", title: "Ready modules" },
    render: () => <WebAppModules />,
    inline: true,
  },
  {
    key: "calculator", bg: "#1c6b5c", fg: WHITE,
    ru: { eyebrow: "Оценка бюджета", title: "Калькулятор" },
    en: { eyebrow: "Budget estimate", title: "Calculator" },
    render: () => <WebAppCalculator />,
    inline: true,
  },
];

export default function WebAppLayers() {
  return (
    <SectionLayers
      layers={LAYERS}
      service="webapp"
      ariaLabelRu="Разделы по веб-приложениям"
      ariaLabelEn="Web application services"
    />
  );
}
