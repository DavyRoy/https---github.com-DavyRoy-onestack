"use client";
import SectionLayers, { type LayerDef } from "@/components/SectionLayers";

import MobileTypes from "@/components/MobileTypes";
import MobileFeatures from "@/components/MobileFeatures";
import MobileCalculator from "@/components/MobileCalculator";
import MobilePerfSecurity from "@/components/MobilePerfSecurity";

const WHITE = "#f4faf8";

const LAYERS: LayerDef[] = [
  {
    key: "types", bg: "#0c1a17", fg: WHITE,
    ru: { eyebrow: "Форматы приложений", title: "Типы приложений" },
    en: { eyebrow: "App formats", title: "App types" },
    render: () => <MobileTypes />,
    inline: true,
  },
  {
    key: "capabilities", bg: "#103029", fg: WHITE,
    ru: { eyebrow: "Что умеет приложение", title: "Возможности" },
    en: { eyebrow: "What the app can do", title: "Capabilities" },
    render: () => <MobileFeatures />,
    inline: true,
  },
  {
    key: "perf-security", bg: "#17493f", fg: WHITE,
    ru: { eyebrow: "Нагрузки и безопасность", title: "Скорость и защита" },
    en: { eyebrow: "Load and security", title: "Speed & safety" },
    render: () => <MobilePerfSecurity />,
    inline: true,
  },
  {
    key: "calculator", bg: "#1f7a69", fg: WHITE,
    ru: { eyebrow: "Оценка бюджета", title: "Калькулятор" },
    en: { eyebrow: "Budget estimate", title: "Calculator" },
    render: () => <MobileCalculator />,
    inline: true,
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
