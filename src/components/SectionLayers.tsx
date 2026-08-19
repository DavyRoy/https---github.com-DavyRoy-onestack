"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { serif } from "@/lib/fonts";
import { useI18n } from "@/i18n/I18nProvider";
import FullScreenDialog from "@/components/FullScreenDialog";

const BG = "#07100e";

/** Скрыто визуально, но доступно поиску и скринридерам. */
const srOnly: React.CSSProperties = {
  position: "absolute", width: 1, height: 1, padding: 0, margin: -1,
  overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap", border: 0,
};

export type LayerDef = {
  key: string;
  bg: string;
  fg: string;
  ru: { eyebrow: string; title: string };
  en: { eyebrow: string; title: string };
  render: () => React.ReactNode;
};

/**
 * Разделы страницы в виде вложенных цветных слоёв; по клику раздел
 * раскрывается на весь экран.
 *
 * Геометрия слоёв — в globals.css (.site-layers/.site-layer): на чистом CSS,
 * чтобы раскладка была верной ещё до гидратации.
 */
export default function SectionLayers({
  layers, h1Ru, h1En, ariaLabelRu, ariaLabelEn, calcKey = "calculator",
}: {
  layers: LayerDef[];
  h1Ru: string;
  h1En: string;
  ariaLabelRu: string;
  ariaLabelEn: string;
  /** Ключ слоя с калькулятором — в него ведёт кнопка «Рассчитать стоимость». */
  calcKey?: string;
}) {
  const { locale } = useI18n();
  const isEn = locale === "en";
  const [open, setOpen] = useState<string | null>(null);

  const close = useCallback(() => setOpen(null), []);

  /* Переходы между разделами.
     Пока блоки лежали на одной странице, кнопки просто прокручивали к нужному
     месту. Теперь разделы в отдельных окнах, и нужный надо открыть — иначе
     событие ловить некому. */
  const pendingPrefill = useRef<unknown>(null);
  const suppress = useRef(false);

  useEffect(() => {
    const onPrefill = (e: Event) => {
      if (suppress.current) return;            // наша же повторная отправка
      pendingPrefill.current = (e as CustomEvent).detail;
      setOpen(calcKey);
    };
    const onGoto = (e: Event) => {
      const key = (e as CustomEvent).detail as string;
      if (!layers.some(l => l.key === key)) return;
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
  }, [layers, calcKey]);

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

  return (
    <>
      <section aria-label={isEn ? ariaLabelEn : ariaLabelRu} style={{ background: BG }}>
        {/* Единственный h1 страницы: заголовки разделов живут внутри окон. */}
        <h1 style={srOnly}>{isEn ? h1En : h1Ru}</h1>

        <div className="site-layers">
          {layers.map((l, i) => {
            const copy = isEn ? l.en : l.ru;
            return (
              <button
                key={l.key}
                type="button"
                className="site-layer"
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

      {active && (
        <FullScreenDialog
          title={isEn ? active.en.title : active.ru.title}
          closeLabel={isEn ? "Close" : "Закрыть"}
          onClose={close}
        >
          {active.render()}
        </FullScreenDialog>
      )}
    </>
  );
}
