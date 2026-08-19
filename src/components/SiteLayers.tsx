"use client";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { X } from "lucide-react";
import { serif } from "@/lib/fonts";
import { useI18n } from "@/i18n/I18nProvider";

import SiteTypes from "@/components/SiteTypes";
import SiteConfigurator from "@/components/SiteConfigurator";
import SiteCalculator from "@/components/SiteCalculator";
import SiteContact from "@/components/SiteContact";

/* ─── Палитра ────────────────────────────────────────────────────────────── */
const BG    = "#07100e";
const TEAL  = "#2dd4bf";
const WHITE = "#f4faf8";

/* Визуально скрыто, но доступно поиску и скринридерам.
   Инлайном, а не утилитой, чтобы не зависеть от настроек Tailwind. */
const srOnly: React.CSSProperties = {
  position: "absolute", width: 1, height: 1, padding: 0, margin: -1,
  overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap", border: 0,
};

/* Слои идут от почти чёрного к акцентному бирюзовому — тот же приём
   контрастных плашек, что в образце, но в наших цветах. */
type LayerKey = "types" | "configurator" | "calculator" | "contact";

const LAYERS: {
  key: LayerKey;
  bg: string;
  fg: string;
  ru: { eyebrow: string; title: string };
  en: { eyebrow: string; title: string };
}[] = [
  {
    key: "types", bg: "#0c1a17", fg: WHITE,
    ru: { eyebrow: "Форматы и примеры", title: "Типы сайтов" },
    en: { eyebrow: "Formats & examples", title: "Site types" },
  },
  {
    key: "configurator", bg: "#123b33", fg: WHITE,
    ru: { eyebrow: "Подбор под задачу", title: "Конфигуратор" },
    en: { eyebrow: "Match your goals", title: "Configurator" },
  },
  {
    key: "calculator", bg: "#1c6b5c", fg: WHITE,
    ru: { eyebrow: "Оценка бюджета", title: "Калькулятор" },
    en: { eyebrow: "Budget estimate", title: "Calculator" },
  },
  {
    key: "contact", bg: TEAL, fg: BG,
    ru: { eyebrow: "Бриф и контакты", title: "Обсудить проект" },
    en: { eyebrow: "Brief & contacts", title: "Start a project" },
  },
];

function LayerBody({ layer }: { layer: LayerKey }) {
  switch (layer) {
    case "types":        return <SiteTypes />;
    case "configurator": return <SiteConfigurator />;
    case "calculator":   return <SiteCalculator />;
    case "contact":      return <SiteContact />;
  }
}

export default function SiteLayers() {
  const { locale } = useI18n();
  const isEn = locale === "en";
  const [open, setOpen] = useState<LayerKey | null>(null);
  const dialogId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const openLayer = useCallback((key: LayerKey) => {
    returnFocusRef.current = document.activeElement as HTMLElement;
    setOpen(key);
  }, []);
  const close = useCallback(() => setOpen(null), []);

  /* Esc закрывает окно */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  /* Блокировка прокрутки страницы под окном (безопасно для iOS) */
  useEffect(() => {
    if (!open) return;
    const y = window.scrollY;
    const { style } = document.body;
    style.position = "fixed";
    style.top = `-${y}px`;
    style.width = "100%";
    style.overflow = "hidden";
    return () => {
      style.position = ""; style.top = ""; style.width = ""; style.overflow = "";
      window.scrollTo(0, y);
    };
  }, [open]);

  /* Фокус — на кнопку закрытия, после закрытия возвращаем откуда пришли */
  useEffect(() => {
    if (open) closeRef.current?.focus();
    else returnFocusRef.current?.focus();
  }, [open]);

  const active = LAYERS.find(l => l.key === open);

  return (
    <>
      <section aria-label={isEn ? "Website services" : "Разделы по сайтам"} style={{ background: BG }}>
        {/* Единственный h1 страницы: заголовки разделов живут внутри окон. */}
        <h1 style={srOnly}>
          {isEn
            ? "Website development: landing pages, corporate sites, e-commerce"
            : "Разработка сайтов под ключ: лендинги, корпоративные сайты, интернет-магазины"}
        </h1>
        <div className="site-layers">
          {LAYERS.map((l, i) => {
            const copy = isEn ? l.en : l.ru;
            return (
              <button
                key={l.key}
                type="button"
                className="site-layer"
                style={{ "--i": i, background: l.bg, color: l.fg } as React.CSSProperties}
                onClick={() => openLayer(l.key)}
                aria-haspopup="dialog"
              >
                <span className="site-layer__row">
                  {/* Распорки: левая тянется всегда, правая — только при наведении.
                      За счёт этого подпись плавно съезжает от правого края к центру. */}
                  <span className="site-layer__grow" aria-hidden="true" />
                  <span className="site-layer__label">
                    <span className="site-layer__eyebrow">{copy.eyebrow}</span>
                    <span className={`${serif.className} site-layer__title`}>{copy.title}</span>
                  </span>
                  <span className="site-layer__grow site-layer__grow--tail" aria-hidden="true" />
                  <span className="site-layer__arrow" aria-hidden="true">↗</span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Полноэкранное окно с содержимым выбранного раздела ── */}
      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={dialogId}
          style={{
            position: "fixed", inset: 0, zIndex: 120,
            background: BG,
            overflowY: "auto",
          }}
        >
          <h2 id={dialogId} style={srOnly}>
            {isEn ? active.en.title : active.ru.title}
          </h2>

          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label={isEn ? "Close" : "Закрыть"}
            style={{
              position: "fixed", top: 18, right: 18, zIndex: 2,
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 16px", borderRadius: 999, cursor: "pointer",
              background: "rgba(7,16,14,0.82)",
              border: "1px solid rgba(255,255,255,0.14)",
              color: WHITE, fontSize: 12, letterSpacing: "0.12em",
              textTransform: "uppercase", fontWeight: 500,
              backdropFilter: "blur(14px)",
            }}
          >
            <X size={15} />
            {isEn ? "Close" : "Закрыть"}
          </button>

          <LayerBody layer={active.key} />
        </div>
      )}
    </>
  );
}
