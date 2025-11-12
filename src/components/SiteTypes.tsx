// src/components/SiteTypes.tsx
"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import NextImage from "next/image";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Script from "next/script";

/* ==================== DATA ==================== */
type Kind =
  | "business-card"
  | "corporate"
  | "ecommerce"
  | "landing"
  | "info"
  | "portfolio";

type Item = {
  title: string;
  desc: string;
  href: string; // якорь секции (используем в CTA)
  image: string;
  useFor: string[]; // «Лучше для»
  tech: string[]; // ключевые технологии
  steps: string[]; // этапы работ
};

const TYPES: Record<Kind, Item> = {
  "business-card": {
    title: "Сайт-визитка",
    desc: "Минимальный быстрый старт для небольшого бизнеса, эксперта или студии. Фокус на понятности и конверсии заявки.",
    href: "#business-card",
    image: "/site_visio.png",
    useFor: ["Быстро «выйти в онлайн»", "Презентация услуг/компетенций", "Контакты и форма заявки"],
    tech: ["Next.js", "Tailwind", "Image/CDN"],
    steps: ["Бриф и структура", "Дизайн ключевых экранов", "Верстка и интеграция", "Старт и аналитика"],
  },
  corporate: {
    title: "Корпоративный сайт",
    desc: "Структурированные разделы (услуги, проекты, блог, вакансии) + гибкая админка и роли. Готов к масштабированию и SEO.",
    href: "#corporate",
    image: "/site_corp.png",
    useFor: ["Б2Б-компании", "Мультиязычные сайты", "Контент-маркетинг и PR"],
    tech: ["Next.js", "Headless CMS", "i18n", "Search"],
    steps: ["Информационная архитектура", "Дизайн-система", "Интеграция CMS/поиска", "Релиз и SEO-тюнинг"],
  },
  ecommerce: {
    title: "Интернет-магазин",
    desc: "Каталог, фильтры, корзина, оплаты, интеграции с CRM/складом. Быстрые страницы и внимание к воронке конверсии.",
    href: "#ecommerce",
    image: "/site_shop.png",
    useFor: ["D2C-бренды", "Каталоги с вариациями", "Промо и скидки"],
    tech: ["SSR/SEO", "ЮKassa/Stripe", "CRM/1C"],
    steps: ["Схема каталога/склада", "UX корзины/чекаута", "Интеграции и оплаты", "Запуск и A/B-тесты"],
  },
  landing: {
    title: "Лендинг",
    desc: "Выпуск продукта или кампании. Яркий визуал, быстрая вёрстка секций, формы лидов, эксперименты.",
    href: "#landing",
    image: "/site_lend.png",
    useFor: ["Прелонч/релиз", "Рекламные кампании", "Сбор лидов"],
    tech: ["Animation", "Forms", "A/B", "Tracking"],
    steps: ["Сторителлинг", "Анимации", "Формы и интеграции", "Запуск и оптимизация"],
  },
  info: {
    title: "Информационный сайт",
    desc: "Контентный проект: статьи, рубрики, подписки. Удобная редактура и скорость публикаций.",
    href: "#info",
    image: "/site_info.png",
    useFor: ["Медиа и блоги", "Документации/гайдовые порталы", "Контент-маркетинг"],
    tech: ["Headless CMS", "Search", "CDN"],
    steps: ["Контент-модель", "Редактор/медиатека", "Поиск и рекомендации", "SEO-операции и аналитика"],
  },
  portfolio: {
    title: "Портфолио / персональный",
    desc: "Кейсы, отзывы, галереи, интеграции с соцсетями. Для экспертов, агентств и студий.",
    href: "#portfolio",
    image: "/site_port.png",
    useFor: ["Эксперт/бренд", "Студии и агентства", "Творческие портфолио"],
    tech: ["Next.js", "Images/CDN", "SEO", "Analytics"],
    steps: ["Карточки кейсов", "Детальные страницы", "Импорт/интеграции", "Оптимизация скорости"],
  },
};

/* ==================== MAIN ==================== */
export default function SiteTypes() {
  const [openKey, setOpenKey] = useState<Kind | null>(null);
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();

  // Открытие из query (?modal=...)
  useEffect(() => {
    const m = params.get("modal") as Kind | null;
    if (m && TYPES[m]) setOpenKey(m);
    else setOpenKey(null);
  }, [params]);

  const openWithUrl = useCallback(
    (k: Kind) => {
      router.replace(`${pathname}?modal=${k}`, { scroll: false });
      setOpenKey(k);
    },
    [router, pathname]
  );

  const closeAndClean = useCallback(() => {
    router.replace(pathname, { scroll: false });
    setOpenKey(null);
  }, [router, pathname]);

  // JSON-LD ItemList (клиентская сборка URL с якорями)
  const itemListJsonLd = useMemo(() => {
    const origin =
      typeof window !== "undefined" ? window.location.origin : "https://onestack24.ru";
    const basePath = typeof window !== "undefined" ? window.location.pathname : "/";
    const items = (Object.entries(TYPES) as [Kind, Item][]).map(([_, v], idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      url: `${origin}${basePath}${v.href}`,
      name: v.title,
    }));
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: items,
    };
  }, []);

  // respect reduced motion
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  return (
    <section
      id="types"
      className="relative w-full min-h-screen bg-black text-white flex flex-col justify-center px-6 md:px-12 lg:px-20 pt-8 md:pt-10 pb-16"
      aria-labelledby="types-title"
    >
      {/* ВНУТРЕННИЙ КОНТЕЙНЕР — единый с Home */}
      <div className="mx-auto w-full max-w-7xl px-6 md:px-22 lg:px-20">
        <div className="grid grid-cols-12 gap-x-6 md:gap-x-8">
          {/* Заголовок */}
          <motion.header
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="col-span-12 md:col-span-8 mb-6 md:mb-8"
          >
            <span className="inline-block text-xs tracking-widest text-white/60 uppercase mb-3">
              виды сайтов
            </span>
            <h2 id="types-title" className="text-3xl sm:text-4xl md:text-5xl font-extrabold">
              Подбираем формат под цель и рост
            </h2>
            <p className="mt-3 text-white/60 max-w-2xl">
              Лендинги, корпоративные сайты, магазины, инфопорталы и портфолио — подбираем решение под задачу.
            </p>
          </motion.header>

          {/* Карточки — стили как в HomeServices */}
          <div className="col-span-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-3">
              {(Object.entries(TYPES) as [Kind, Item][]).map(([key, item], i) => (
                <SiteCard
                  key={key}
                  delay={reduced ? 0 : 0.05 * i}
                  title={item.title}
                  desc={item.desc}
                  href={item.href}
                  image={item.image}
                  tech={item.tech}
                  onOpen={() => openWithUrl(key)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Бегущая строка */}
      <TechMarquee className="mt-8 md:mt-10" lineOffset={18} />

      {/* Модалка */}
      <SiteModal openKey={openKey} onClose={closeAndClean} payload={openKey ? TYPES[openKey] : null} />

      {/* JSON-LD */}
      <Script id="ld-itemlist" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
    </section>
  );
}

/* ==================== CARD ==================== */
function SiteCard({
  title,
  desc,
  href,   // для aria
  image,
  tech,
  onOpen,
  delay = 0,
}: {
  title: string;
  desc: string;
  href: string;
  image: string;
  tech: string[];
  onOpen: () => void;
  delay?: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, ease: "easeOut", delay }}
      whileHover={{ scale: 1.02 }}
      className="group relative overflow-hidden rounded-3xl border border-white/10
                 bg-gradient-to-br from-white/[0.04] to-white/[0.02]
                 shadow-md hover:shadow-white/10 transition-all p-7"
      role="listitem"
      aria-describedby={href.replace("#", "")}
    >
      {/* мягкая подсветка при hover */}
      <div className="pointer-events-none absolute -inset-px -z-10 rounded-3xl bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition" />

      {/* Заголовок — кнопка (не ссылка) */}
      <button
        type="button"
        onClick={onOpen}
        className="inline-flex items-center gap-3 text-left text-xl font-semibold text-white
                   underline decoration-transparent group-hover:decoration-white/30 decoration-2 underline-offset-4
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-md"
        aria-label={`${title} — открыть подробности`}
        title={title}
      >
        {title}
      </button>

      <p className="mt-3 text-white/70 text-sm leading-relaxed">{desc}</p>

      {/* Технологии — компактные чипы */}
      {tech?.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {tech.map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/15 bg-white/[0.05] px-2.5 py-1 text-[12px] text-white/75"
              title={t}
            >
              {t}
            </span>
          ))}
        </div>
      ) : null}

      {/* Триггер модалки */}
      <div className="mt-7">
        <button
          type="button"
          onMouseEnter={() => {
            if (typeof window !== "undefined" && image) {
              try {
                const img = new window.Image();
                img.decoding = "async";
                img.loading = "eager";
                img.src = image;
              } catch {}
            }
          }}
          onClick={onOpen}
          className="inline-flex items-center gap-2 rounded-full
                     bg-white/5 border border-white/20
                     px-5 py-2.5 text-sm font-medium text-white/90
                     hover:bg-white/10 hover:border-white/40
                     active:scale-[0.99]
                     transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          aria-haspopup="dialog"
          aria-expanded="false"
        >
          Ближе
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M5 12h14m0 0l-5-5m5 5l-5 5" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        </button>
      </div>
    </motion.article>
  );
}

/* ==================== MODAL (FULLSCREEN, lock body scroll) ==================== */
function SiteModal({
  openKey,
  onClose,
  payload,
}: {
  openKey: Kind | null;
  onClose: () => void;
  payload: Item | null;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const lastFocused = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // lock body scroll
  useEffect(() => {
    if (!openKey) return;
    const prev = document.body.style.overflow;
    const prevOB = (document.body.style as any).overscrollBehaviorY;
    document.body.style.overflow = "hidden";
    (document.body.style as any).overscrollBehaviorY = "none";
    return () => {
      document.body.style.overflow = prev;
      (document.body.style as any).overscrollBehaviorY = prevOB || "";
    };
  }, [openKey]);

  // Esc + возврат фокуса + focus trap
  useEffect(() => {
    if (!openKey) return;

    lastFocused.current = document.activeElement as HTMLElement;

    const getFocusable = () => {
      if (!panelRef.current) return [] as HTMLElement[];
      const sel = 'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])';
      return Array.from(panelRef.current.querySelectorAll<HTMLElement>(sel)).filter(
        (el) => !el.hasAttribute("disabled")
      );
    };

    const timer = setTimeout(() => getFocusable()[0]?.focus(), 0);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab") return;
      const items = getFocusable();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey) {
        if (active === first) { e.preventDefault(); last.focus(); }
      } else {
        if (active === last) { e.preventDefault(); first.focus(); }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", onKeyDown);
      lastFocused.current?.focus();
    };
  }, [openKey, onClose]);

  if (!mounted || !openKey || !payload) return null;

  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  const backdropTr = reduced ? { duration: 0 } : { duration: 0.18, ease: "easeOut" };
  const panelTr = reduced
    ? { duration: 0 }
    : { type: "spring", stiffness: 420, damping: 32, mass: 0.7 };

  const modalBtnBase =
    "inline-flex items-center justify-center rounded-full font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 transition text-center whitespace-nowrap";
  const modalBtnSize = "h-12 w-full sm:w-[260px] px-6 text-base";

  // helper: закрыть и проскроллить к блоку
  const jumpAfterClose = (hash: string) => {
    onClose();
    setTimeout(() => {
      const id = hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      else window.location.hash = hash;
    }, 220);
  };

  return createPortal(
    <AnimatePresence>
      {openKey && (
        // backdrop
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={backdropTr}
          className="fixed inset-0 z-[999] bg-black/75 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden
        >
          {/* FULLSCREEN panel container */}
          <div className="fixed inset-0 p-0 sm:p-4 md:p-6 flex items-stretch justify-stretch">
            <motion.div
              ref={panelRef}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: reduced ? 1 : 0, scale: reduced ? 1 : 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: reduced ? 1 : 0, scale: 0.98 }}
              transition={panelTr}
              className="w-full h-[100svh] sm:rounded-2xl bg-transparent
                         overflow-y-auto overscroll-contain [touch-action:pan-y]
                         [--webkit-overflow-scrolling:touch]"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              aria-describedby="modal-desc"
            >
              <div className="mx-auto w-full max-w-7xl px-5 md:px-10 py-6 md:py-10">
                {/* top bar */}
                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full
                               bg-white/20 hover:bg-white/35 text-white transition
                               focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70
                               shadow-[0_0_0_1px_rgba(255,255,255,0.25)_inset]"
                    aria-label="Закрыть"
                    title="Закрыть"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Моб. заголовок */}
                <h3 className="block sm:hidden text-[clamp(1.6rem,6vw,2rem)] font-extrabold tracking-tight mt-2 mb-3 text-center">
                  {payload.title}
                </h3>

                {/* GRID */}
                <div className="mt-2 grid grid-cols-1 lg:grid-cols-[1.05fr_1.35fr] gap-10 items-start">
                  {/* Картинка */}
                  <div className="order-1 lg:order-none relative">
                    <div className="relative w-full h-[46vh] sm:h-[56vh] lg:h-[68vh]">
                      <NextImage
                        src={payload.image}
                        alt={`${payload.title} — визуальный пример`}
                        fill
                        sizes="(max-width: 1024px) 100vw, 52vw"
                        className="object-contain"
                        priority
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/60 via-black/10 to-transparent" />
                    </div>
                  </div>

                  {/* Текст */}
                  <div className="order-2 lg:order-none">
                    <h3 id="modal-title" className="hidden sm:block text-[clamp(1.8rem,4.6vw,3rem)] font-extrabold tracking-tight mb-3">
                      {payload.title}
                    </h3>

                    <p id="modal-desc" className="text-white/85 text-base md:text-lg leading-relaxed max-w-prose">
                      {payload.desc}
                    </p>

                    {/* Лучше для */}
                    {payload.useFor?.length ? (
                      <div className="mt-8">
                        <div className="text-sm font-semibold text-white/90 mb-3 text-center sm:text-left">
                          Лучше для
                        </div>

                        {/* мобайл — чипы */}
                        <div className="grid grid-cols-2 gap-2 sm:hidden">
                          {payload.useFor.map((u) => (
                            <span
                              key={u}
                              className="rounded-xl border border-white/15 bg-white/[0.06] px-3 py-2 text-[12px] text-white/85"
                            >
                              {u}
                            </span>
                          ))}
                        </div>

                        {/* десктоп — список */}
                        <ul className="hidden sm:block space-y-1.5 text-white/80">
                          {payload.useFor.map((u, i) => (
                            <li key={i} className="flex gap-2">
                              <span className="mt-[9px] h-[5px] w-[5px] rounded-full bg-white/60" />
                              <span>{u}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    {/* Технологии */}
                    {payload.tech?.length ? (
                      <div className="mt-8 hidden sm:block">
                        <div className="text-sm font-semibold text-white/90 mb-3">Технологии</div>
                        <div className="flex flex-wrap gap-2">
                          {payload.tech.map((t) => (
                            <span key={t} className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-sm">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {/* Этапы */}
                    {payload.steps?.length ? (
                      <div className="mt-8 hidden sm:block">
                        <div className="text-sm font-semibold text-white/90 mb-3">Этапы работ</div>
                        <ol className="grid grid-cols-1 gap-2 list-decimal pl-6 text-white/85">
                          {payload.steps.map((s, i) => (
                            <li key={s + i}>{s}</li>
                          ))}
                        </ol>
                      </div>
                    ) : null}

                    {/* CTA — одинаковые размеры */}
                    <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-2 justify-center sm:justify-start">
                      <button
                        type="button"
                        onClick={() => jumpAfterClose("#contact")}
                        className={`${modalBtnBase} ${modalBtnSize} bg-white text-black hover:shadow-white/20 hover:shadow-lg active:scale-[0.99]`}
                      >
                        <span className="mx-auto">Оставить заявку</span>
                        <svg className="ml-2 h-5 w-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
                          <path d="M5 12h14m0 0l-5-5m5 5l-5 5" stroke="currentColor" strokeWidth="1.8" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

/* ==================== MARQUEE (с линиями) ==================== */
function TechMarquee({
  className = "",
  lineOffset = 22,
}: {
  className?: string;
  lineOffset?: number;
}) {
  const tech =
    "Next.js · React · TypeScript · Tailwind · Headless CMS · GraphQL · REST API · PostgreSQL · Redis · Elasticsearch · Stripe/ЮKassa · 1C/CRM · Docker · CI/CD · Playwright · Vitest · CDN · Image Optimization";

  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  return (
    <div
      className={`relative overflow-hidden ${className}
                  mx-[calc(50%-50vw)] px-[calc(50vw-50%)]`}
      style={{ paddingTop: lineOffset, paddingBottom: lineOffset }}
      aria-hidden
    >
      {/* тонкие линии */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-px z-10 w-[min(1120px,92vw)] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 bottom-0 -translate-x-1/2 h-px z-10 w-[min(1120px,92vw)] bg-gradient-to-r from-transparent via-white/60 to-transparent" />

      <div className="mask-fade pointer-events-none absolute inset-0 z-0" />
      <div
        className="marquee relative z-0 flex gap-12 whitespace-nowrap will-change-transform text-white/80"
        style={reduced ? { animation: "none" } : undefined}
      >
        <span>{tech}</span>
        <span aria-hidden>{tech}</span>
        <span aria-hidden>{tech}</span>
      </div>

      <style jsx>{`
        .marquee { animation: marquee 22s linear infinite; }
        @media (max-width: 768px) { .marquee { animation-duration: 28s; } }
        .marquee:hover, .marquee:focus-within { animation-play-state: paused; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-33.333%); } }
        .mask-fade {
          background: linear-gradient(
            90deg,
            rgba(0,0,0,1) 0%,
            rgba(0,0,0,0) 12%,
            rgba(0,0,0,0) 88%,
            rgba(0,0,0,1) 100%
          );
        }
      `}</style>
    </div>
  );
}
