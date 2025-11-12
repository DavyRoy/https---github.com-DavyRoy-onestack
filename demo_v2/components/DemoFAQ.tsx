"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Script from "next/script";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";

type QA = { question: string; answer: string };

const QUESTIONS: QA[] = [
  { question: "Нужно ли регистрироваться, чтобы посмотреть демо?", answer: "Нет. Демо открыто 24/7, состояние очищается при возвращении на главную страницу. Вы можете свободно переключаться между ролями и сценариями." },
  { question: "Какие данные используются внутри демо?", answer: "Только вымышленные имена, заказы и транзакции. Все платежные операции работают через тестовые провайдеры, списаний не происходит." },
  { question: "Будет ли всё работать на мобильных устройствах?", answer: "Да. Интерфейсы адаптированы под смартфоны: навигация, карточки, таблицы и формы перестраиваются под вертикальный сценарий." },
  { question: "Можно ли настроить демо под свою нишу?", answer: "Расскажите нам о процессах — адаптируем модули, тексты и интеграции под конкретную сферу. Демо служит базовым шаблоном для кастомизации." },
  { question: "Какие технологии лежат в основе?", answer: "Frontend — Next.js 15 и Tailwind, backend — модульный Node.js с PostgreSQL/ClickHouse. Используем очереди, фича-флаги, аудиты и CI/CD." },
  { question: "Как быстро можно стартовать реальный проект?", answer: "Первые релизы — через 2–3 недели, если использовать готовые модули. Параллелим дизайн, фронт и интеграции, чтобы ускорить запуск." },
];

export default function DemoFAQ() {
  const baseId = useId();
  const reduced = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const liRefs = useRef<(HTMLLIElement | null)[]>([]);

  // JSON-LD
  const jsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: QUESTIONS.map((q) => ({
        "@type": "Question",
        name: q.question,
        acceptedAnswer: { "@type": "Answer", text: q.answer },
      })),
    }),
    []
  );

  const fade = (delay = 0) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.2 },
          transition: { delay, duration: 0.45, ease: "easeOut" },
        };

  // Инициализация из hash (#faq-0)
  useEffect(() => {
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    if (hash?.startsWith("#faq-")) {
      const idx = Number(hash.replace("#faq-", ""));
      if (!Number.isNaN(idx) && QUESTIONS[idx]) setOpenIndex(idx);
    }
  }, []);

  // Синхронизация hash + автоскролл
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (openIndex === null) url.hash = "";
    else url.hash = `faq-${openIndex}`;
    window.history.replaceState(null, "", url.toString());

    if (openIndex !== null) {
      const el = liRefs.current[openIndex];
      if (el) {
        const opts: ScrollIntoViewOptions = reduced
          ? { behavior: "auto", block: "start", inline: "nearest" }
          : { behavior: "smooth", block: "start", inline: "nearest" };
        requestAnimationFrame(() => {
          el.scrollIntoView(opts);
          window.scrollBy({ top: -12, behavior: reduced ? "auto" : "smooth" });
        });
      }
    }
  }, [openIndex, reduced]);

  const onToggle = (index: number) => setOpenIndex((prev) => (prev === index ? null : index));

  return (
    <section id="faq" aria-labelledby="demo-faq-title" className="relative overflow-hidden bg-[hsl(var(--bg))] text-[hsl(var(--fg))]">
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 md:py-24 lg:px-8">
        <motion.p {...fade(0)} className="text-xs uppercase tracking-[0.24em] text-[hsl(var(--muted))]">
          faq
        </motion.p>

        <motion.h2 id="demo-faq-title" {...fade(0.05)} className="mt-4 text-balance text-[clamp(2rem,4vw,3.2rem)] font-semibold">
          Ответы на популярные вопросы про демо и запуск проекта
        </motion.h2>

        <motion.p {...fade(0.1)} className="mt-4 max-w-3xl text-base md:text-lg text-[hsl(var(--muted))]">
          Обсудим ваш сценарий, если нужны дополнительные интеграции или кастомизация. Напишите нам — пришлём
          гайд и чек-листы подготовки.
        </motion.p>

        <motion.ul {...fade(0.15)} role="list" className="mt-12 space-y-4" aria-label="Частые вопросы">
          {QUESTIONS.map((item, index) => {
            const isOpen = openIndex === index;
            const btnId = `${baseId}-btn-${index}`;
            const panelId = `${baseId}-panel-${index}`;
            return (
              <li
                key={item.question}
                ref={(el) => (liRefs.current[index] = el)}
                id={`faq-${index}`}
                className="overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))]"
              >
                <button
                  id={btnId}
                  aria-controls={panelId}
                  aria-expanded={isOpen}
                  onClick={() => onToggle(index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left rounded-md
                             focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--brand))]
                             focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--panel))]"
                >
                  <span className="text-base font-medium leading-6">{item.question}</span>
                  <motion.span
                    aria-hidden
                    initial={false}
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: reduced ? 0 : 0.18, ease: "easeOut" }}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--bg))]"
                  >
                    <ChevronDown className="h-4 w-4 text-[hsl(var(--muted))]" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={btnId}
                      initial={reduced ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
                      animate={reduced ? { opacity: 1, height: "auto" } : { opacity: 1, height: "auto" }}
                      exit={reduced ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
                      transition={{ duration: reduced ? 0 : 0.28, ease: "easeOut" }}
                      className="px-5 pb-5 text-sm leading-6 text-[hsl(var(--muted))]"
                    >
                      {item.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </motion.ul>
      </div>

      {/* SEO: FAQPage */}
      <Script id="ld-demo-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </section>
  );
}