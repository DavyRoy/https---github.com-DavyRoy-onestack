"use client";
import SectionLayers, { type LayerDef } from "@/components/SectionLayers";

import AiTypes from "@/components/AiTypes";
import AiCapabilities from "@/components/AiCapabilities";
import AiProcess from "@/components/AiProcess";

const WHITE = "#f4faf8";

const LAYERS: LayerDef[] = [
  {
    key: "types", bg: "#0c1a17", fg: WHITE,
    ru: { eyebrow: "Направления", title: "AI-решения" },
    en: { eyebrow: "Directions", title: "AI solutions" },
    render: () => <AiTypes />,
    inline: true,
  },
  {
    key: "capabilities", bg: "#103029", fg: WHITE,
    ru: { eyebrow: "Из чего собираем", title: "Возможности" },
    en: { eyebrow: "Building blocks", title: "Capabilities" },
    render: () => <AiCapabilities />,
    inline: true,
  },
  {
    key: "process", bg: "#17493f", fg: WHITE,
    ru: { eyebrow: "Пилот и безопасность", title: "Внедрение" },
    en: { eyebrow: "Pilot and security", title: "Implementation" },
    render: () => <AiProcess />,
    inline: true,
  },
];

export default function AiLayers() {
  return (
    <SectionLayers
      layers={LAYERS}
      service="ai"
      ariaLabelRu="Разделы по AI-решениям"
      ariaLabelEn="AI services"
    />
  );
}
