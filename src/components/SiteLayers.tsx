"use client";
import SectionLayers, { type LayerDef } from "@/components/SectionLayers";

import SiteTypes from "@/components/SiteTypes";
import SiteConfigurator from "@/components/SiteConfigurator";
import SiteCalculator from "@/components/SiteCalculator";

const WHITE = "#f4faf8";

/* Слои идут от почти чёрного к акцентному бирюзовому — тот же приём
   контрастных плашек, что в образце, но в наших цветах. */
const LAYERS: LayerDef[] = [
  {
    key: "types", bg: "#0c1a17", fg: WHITE,
    ru: { eyebrow: "Форматы и примеры", title: "Типы сайтов" },
    en: { eyebrow: "Formats & examples", title: "Site types" },
    render: () => <SiteTypes />,
  },
  {
    key: "configurator", bg: "#123b33", fg: WHITE,
    ru: { eyebrow: "Подбор под задачу", title: "Конфигуратор" },
    en: { eyebrow: "Match your goals", title: "Configurator" },
    render: () => <SiteConfigurator />,
  },
  {
    key: "calculator", bg: "#1c6b5c", fg: WHITE,
    ru: { eyebrow: "Оценка бюджета", title: "Калькулятор" },
    en: { eyebrow: "Budget estimate", title: "Calculator" },
    render: () => <SiteCalculator />,
  },
];

export default function SiteLayers() {
  return (
    <SectionLayers
      layers={LAYERS}
      service="sites"
      ariaLabelRu="Разделы по сайтам"
      ariaLabelEn="Website services"
    />
  );
}
