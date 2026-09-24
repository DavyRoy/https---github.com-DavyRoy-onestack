"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { serif } from "@/lib/fonts";
import { useI18n } from "@/i18n/I18nProvider";
import FullScreenDialog from "@/components/FullScreenDialog";

import ServiceHero, { type ServiceKind } from "@/components/ServiceHero";
import ServiceContact from "@/components/ServiceContact";

export type LayerDef = {
  key: string;
  bg: string;
  fg: string;
  ru: { eyebrow: string; title: string };
  en: { eyebrow: string; title: string };
  render: () => React.ReactNode;
  /** Показывать разделом прямо на странице, а не отдельной вкладкой. */
  inline?: boolean;
};

/**
 * Полноэкранный первый экран, компактная навигация и видимые контакты.
 * Калькуляторы и подробные разделы сохраняют полноэкранные окна.
 */
export default function SectionLayers({
  layers, service, ariaLabelRu, ariaLabelEn, calcKey = "calculator",
}: {
  layers: LayerDef[];
  service: ServiceKind;
  ariaLabelRu: string;
  ariaLabelEn: string;
  /** Ключ слоя с калькулятором — в него ведёт кнопка «Рассчитать стоимость». */
  calcKey?: string;
}) {
  const { locale } = useI18n();
  const isEn = locale === "en";
  const [open, setOpen] = useState<string | null>(null);

  const [contactVisit, setContactVisit] = useState(0);

  useEffect(() => {
    if (!contactVisit) return;
    const frame = requestAnimationFrame(() => {
      const contact = document.getElementById("contact");
      contact?.focus({ preventScroll: true });
      contact?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
      history.replaceState(null, "", "#contact");
    });
    return () => cancelAnimationFrame(frame);
  }, [contactVisit]);

  const close = useCallback(() => setOpen(null), []);

  /* Калькулятор может быть разделом на странице — тогда к нему прокручиваем. */
  const calcInline = layers.some(l => l.key === calcKey && l.inline);
  const openCalc = useCallback(() => {
    if (calcInline) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      document.getElementById(calcKey)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    } else {
      setOpen(calcKey);
    }
  }, [calcInline, calcKey]);

  /* Переходы между разделами.
     Пока блоки лежали на одной странице, кнопки просто прокручивали к нужному
     месту. Теперь разделы в отдельных окнах, и нужный надо открыть — иначе
     событие ловить некому. */
  const pendingPrefill = useRef<unknown>(null);
  const suppress = useRef(false);

  useEffect(() => {
    const onPrefill = (e: Event) => {
      if (suppress.current) return;            // наша же повторная отправка
      if (calcInline) { openCalc(); return; }  // калькулятор на странице сам слушает событие
      pendingPrefill.current = (e as CustomEvent).detail;
      setOpen(calcKey);
    };
    const onGoto = (e: Event) => {
      const key = (e as CustomEvent).detail as string;
      if (key === "contact") {
        setOpen(null);
        setContactVisit(value => value + 1);
        e.preventDefault();
        return;
      }
      const layer = layers.find(l => l.key === key);
      if (!layer) return;
      if (layer.inline) {
        setOpen(null);
        document.getElementById(layer.key)?.scrollIntoView({ behavior: "smooth" });
        e.preventDefault();
        return;
      }
      setOpen(key);
      // Сообщаем отправителю (например, футеру), что раздел открыт здесь
      // и своё окно ему показывать не нужно.
      e.preventDefault();
    };
    window.addEventListener("calc-prefill", onPrefill);
    window.addEventListener("site-open-section", onGoto);
    return () => {
      window.removeEventListener("calc-prefill", onPrefill);
      window.removeEventListener("site-open-section", onGoto);
    };
  }, [layers, calcKey, calcInline, openCalc]);

  /* Калькулятор монтируется уже после отправки события — повторяем его,
     когда слушатель на месте. */
  useEffect(() => {
    if (open !== calcKey || pendingPrefill.current === null) return;
    const detail = pendingPrefill.current;
    pendingPrefill.current = null;
    const t = setTimeout(() => {
      suppress.current = true;
      window.dispatchEvent(new CustomEvent("calc-prefill", { detail }));
      suppress.current = false;
    }, 0);
    return () => clearTimeout(t);
  }, [open, calcKey]);

  const active = layers.find(l => l.key === open);
  const inlineLayers = layers.filter(l => l.inline);
  const tabLayers = layers.filter(l => !l.inline);

  return (
    <>
      <ServiceHero service={service} onCalculate={layers.some(l => l.key === calcKey) ? openCalc : undefined} />
      {inlineLayers.map(l => <div key={l.key}>{l.render()}</div>)}
      {tabLayers.length > 0 && (
      <section id="service-sections" className="service-navigation" aria-label={isEn ? ariaLabelEn : ariaLabelRu}>

        <div className="service-sections" style={{ "--n": tabLayers.length } as React.CSSProperties}>
          {tabLayers.map((l, i) => {
            const copy = isEn ? l.en : l.ru;
            return (
              <button
                key={l.key}
                type="button"
                className="service-section-link"
                style={{ "--i": i, background: l.bg, color: l.fg } as React.CSSProperties}
                onClick={() => setOpen(l.key)}
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
      )}

      <ServiceContact service={service} num={inlineLayers.length ? String(inlineLayers.length + 2).padStart(2, "0") : undefined} />

      {/* Все разделы всегда присутствуют в разметке — иначе поисковый робот
          при обходе видит пустую страницу: он не кликает по слоям. Показан
          только открытый, остальные скрыты, как во вкладках или аккордеоне. */}
      <FullScreenDialog
        open={!!active}
        title={active ? (isEn ? active.en.title : active.ru.title) : ""}
        closeLabel={isEn ? "Close" : "Закрыть"}
        onClose={close}
      >
        {tabLayers.map(l => (
          <div key={l.key} hidden={l.key !== open}>
            {l.render()}
          </div>
        ))}
      </FullScreenDialog>
    </>
  );
}
