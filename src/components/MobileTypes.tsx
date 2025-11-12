// components/MobileTypes.tsx
"use client";

import React, { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import NextImage from "next/image";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";

/* ==================== TYPES ==================== */
type Kind = "crm" | "portal" | "client" | "analytics" | "b2b" | "saas";

type Item = {
  key: Kind;
  title: string;
  short: string;
  bullets: string[];
  chips: string[];
  href: string;           // якорь секции для CTA
  img?: string;
  useFor?: string[];
  tech?: string[];
  steps?: string[];
};

/* ==================== DATA ==================== */
const KINDS: Item[] = [
  {
    key: "crm",
    title: "CRM / ERP (мобильное)",
    short:
      "Полевые команды, задачи, сделки, отчёты. Оффлайн-запись действий, синк при онлайне, пуш-уведомления.",
    bullets: [
      "Карты/геометки, чек-листы, фото/сканы",
      "Оффлайн-кэш, фоновая синхронизация",
      "Роли/доступы, журнал действий",
    ],
    chips: ["React Native", "Offline first", "Push"],
    href: "#m-crm",
    img: "/m_crm.png",
    useFor: ["Полевые службы, мерчандайзинг", "Сервис/поддержка на выезде", "Внутренние контроллинговые команды"],
    tech: ["React Native", "TypeScript", "Zustand/Redux", "SQLite/WatermelonDB", "REST/GraphQL", "CodePush"],
    steps: ["Бриф и UX-карты", "Прототип и тестирование", "Реализация/интеграции", "Релиз и аналитика"],
  },
  {
    key: "portal",
    title: "Внутренний портал",
    short: "Коммуникации, объявления, базы знаний, заявки. Единая точка для сотрудников.",
    bullets: ["Лента и комментарии", "Заявки/тикеты, согласования", "SSO и политика безопасности"],
    chips: ["SSO", "Docs", "Notifications"],
    href: "#m-portal",
    img: "/m_portal.png",
    useFor: ["HR и внутренние коммуникации", "Сервисы поддержки", "Документооборот/заявки"],
    tech: ["React Native", "OIDC/SAML", "Push", "Markdown/Docs", "Feature Flags"],
    steps: ["MVP-ядро (лента/заявки)", "Настройка SSO и ролей", "Расширение модулей", "Запуск и обучение"],
  },
  {
    key: "client",
    title: "Кабинет клиента",
    short: "Профиль, заказы, статусы, чат c поддержкой, оплата, подписки и бонусы.",
    bullets: ["Оплата/счета, Apple/Google Pay", "Чат/пуши, трекинг статусов", "Лёгкая онбординг-анимация"],
    chips: ["Payments", "Chat", "Loyalty"],
    href: "#m-client",
    img: "/m_client.png",
    useFor: ["Ритейл/D2C", "Сервисы и подписки", "Лояльность и ретеншен"],
    tech: ["React Native", "Stripe/ЮKassa", "WebSockets", "Amplitude/Firebase", "Deeplinks"],
    steps: ["Флоу онбординга", "Чекаут/оплаты", "Чат и уведомления", "Релиз/маркетинг-ивенты"],
  },
  {
    key: "analytics",
    title: "Аналитическая панель",
    short: "Метрики и графики в кармане: KPI, алерты, drill-down и экспорт.",
    bullets: ["Дашборды, фильтры, сегменты", "Алерты/пуши по триггерам", "Экспорт и шаринг"],
    chips: ["Charts", "Alerts", "Export"],
    href: "#m-analytics",
    img: "/m_analytics.png",
    useFor: ["Руководители, менеджеры", "Оперативное принятие решений", "Контроль SLA/метрик"],
    tech: ["RN + Reanimated", "ReCharts/Victory", "SSE/WebSockets", "RBAC/Scopes"],
    steps: ["Приоритизация KPI", "Проработка дашбордов", "Реалтайм и алерты", "Экспорт/шаринг"],
  },
  {
    key: "b2b",
    title: "B2B-витрина",
    short: "Каталог, прайсы, корзины/заявки, контракты. Индивидуальные условия для партнёров.",
    bullets: ["Каталог/поиск/сканер штрихкодов", "Корзина/заявки, прайс-листы", "CRM/склад интеграции"],
    chips: ["Catalog", "Scanner", "Integrations"],
    href: "#m-b2b",
    img: "/m_b2b.png",
    useFor: ["Оптовые продажи", "Дистрибьюторы/партнёры", "Согласование условий"],
    tech: ["React Native", "Barcode/Camera", "Elastic/SQL", "1C/CRM Sync"],
    steps: ["Каталог и поиск", "Корзина/заявка", "Интеграции цен/остатков", "Запуск и A/B-оптимизация"],
  },
  {
    key: "saas",
    title: "SaaS-сервис",
    short: "Мобильный клиент к вашему SaaS: подписки, биллинг, онбординг, уведомления.",
    bullets: ["Подписки/биллинг (StoreKit/Billing)", "Онбординг/пэйволлы/A/B", "Web-backend + mobile client"],
    chips: ["Subscriptions", "A/B", "Backend"],
    href: "#m-saas",
    img: "/m_saas.png",
    useFor: ["Продление LTV", "Мобильный доступ к SaaS", "Пэйволлы и эксперименты"],
    tech: ["React Native", "StoreKit/Billing", "Remote Config", "Segment/Amplitude"],
    steps: ["Пэйволлы/вилки", "Подписки и грейсы", "Эксперименты/AB", "Аналитика и ретеншен"],
  },
];

/* ==================== MAIN ==================== */
export default function MobileTypes() {
  const reduced = useReducedMotion();
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState<Kind | null>(null);
  const active = useMemo(() => KINDS.find((k) => k.key === open) || null, [open]);

  // deep-link ?type=...
  useEffect(() => {
    const t = params.get("type") as Kind | null;
    if (t && KINDS.some((k) => k.key === t)) setOpen(t);
    else setOpen(null);
  }, [params]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const openWithUrl = useCallback(
    (k: Kind) => {
      try {
        (window as any).gtag?.("event", "mobile_type_open", { type: k, page: "mobile" });
        (window as any).ym?.(103909522, "reachGoal", "mobile_type_open");
      } catch {}
      router.replace(`${pathname}?type=${k}`, { scroll: false });
      setOpen(k);
    },
    [pathname, router]
  );

  const closeAndClean = useCallback(() => {
    router.replace(pathname, { scroll: false });
    setOpen(null);
  }, [pathname, router]);

  // JSON-LD ItemList для SEO (якорные URL)
  const itemListJsonLd = useMemo(() => {
    const origin =
      typeof window !== "undefined" ? window.location.origin : "https://onestack24.ru";
    const basePath = typeof window !== "undefined" ? window.location.pathname : "/";
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: KINDS.map((v, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        url: `${origin}${basePath}${v.href}`,
        name: v.title,
      })),
    };
  }, []);

  return (
    <section
      id="mobile-types"
      className="relative w-full min-h-screen overflow-hidden bg-black text-white flex flex-col justify-center px-6 md:px-12 lg:px-20 pt-8 md:pt-10 pb-16"
      aria-labelledby="mobile-types-title"
    >
      {/* внутренний контейнер как в других секциях */}
      <div className="mx-auto w-full max-w-7xl px-6 md:px-22 lg:px-20">
        <div className="grid grid-cols-12 gap-x-6 md:gap-x-8">
          <motion.header
            initial={reduced ? {} : { opacity: 0, y: 14 }}
            whileInView={reduced ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="col-span-12 md:col-span-8 mb-6 md:mb-8"
          >
            <span className="inline-block text-xs tracking-widest text-white/60 uppercase mb-3">
              типы решений
            </span>
            <h2 id="mobile-types-title" className="text-3xl sm:text-4xl md:text-5xl font-extrabold">
              Под задачи бизнеса и пользователей
            </h2>
            <p className="mt-3 text-white/60 max-w-2xl">
              Мобильные клиенты для CRM/ERP и порталов, личные кабинеты, B2B-витрины, аналитика и SaaS — собираем под ваш процесс и масштаб.
            </p>
          </motion.header>

          {/* карточки */}
          <div className="col-span-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-3" role="list" aria-label="Типы мобильных решений">
              {KINDS.map((k, i) => (
                <motion.article
                  key={k.key}
                  role="listitem"
                  initial={reduced ? {} : { opacity: 0, y: 24 }}
                  whileInView={reduced ? {} : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: reduced ? 0 : i * 0.05, ease: "easeOut" }}
                  viewport={{ once: true, amount: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                  className="group relative overflow-hidden rounded-3xl border border-white/10
                             bg-gradient-to-br from-white/[0.04] to-white/[0.02]
                             shadow-md hover:shadow-white/10 transition-all p-7"
                >
                  {/* мягкое свечение */}
                  <div className="pointer-events-none absolute -inset-px -z-10 rounded-3xl bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition" />

                  {/* Заголовок — кнопка (без перехода) */}
                  <button
                    type="button"
                    onClick={() => openWithUrl(k.key)}
                    className="inline-flex items-center gap-3 text-left text-xl font-semibold text-white
                               underline decoration-transparent group-hover:decoration-white/30 decoration-2 underline-offset-4
                               focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-md"
                    aria-label={`${k.title} — открыть подробности`}
                    title={k.title}
                  >
                    {k.title}
                  </button>

                  <p className="mt-3 text-white/70 text-sm leading-relaxed">{k.short}</p>

                  {/* чипы-технологии/фичи на карточке */}
                  {k.chips?.length ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {k.chips.map((c) => (
                        <span
                          key={c}
                          className="rounded-full border border-white/15 bg-white/[0.05] px-2.5 py-1 text-[12px] text-white/75"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  {/* Триггер «Ближе» */}
                  <div className="mt-7">
                    <button
                      onMouseEnter={() => {
                        if (typeof window !== "undefined" && k.img) {
                          try {
                            const img = new window.Image();
                            img.decoding = "async";
                            img.loading = "eager";
                            img.src = k.img;
                          } catch {}
                        }
                      }}
                      onClick={() => openWithUrl(k.key)}
                      className="inline-flex items-center gap-2 rounded-full
                                 bg-white/5 border border-white/20
                                 px-5 py-2.5 text-sm font-medium text-white/90
                                 hover:bg-white/10 hover:border-white/40
                                 active:scale-[0.99]
                                 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                      aria-haspopup="dialog"
                      aria-expanded={open === k.key}
                    >
                      Ближе
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path d="M5 12h14m0 0l-5-5m5 5l-5 5" stroke="currentColor" strokeWidth="1.8" />
                      </svg>
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SEO JSON-LD */}
      <Script id="ld-mobile-itemlist" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      {/* бегущая строка с линиями */}
      <TechMarquee className="mt-8 md:mt-10" lineOffset={18} />

      {/* Модалка */}
      <MobileTypesModal openKey={open} onClose={closeAndClean} payload={active} />
    </section>
  );
}

/* ==================== MODAL (FULLSCREEN) ==================== */
function MobileTypesModal({
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

  // блокируем фон; прокручивается панель
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

  // Esc + focus trap
  useEffect(() => {
    if (!openKey) return;

    lastFocused.current = document.activeElement as HTMLElement;

    const getFocusable = () => {
      if (!panelRef.current) return [] as HTMLElement[];
      const sel = 'a,button,input,textarea,select,[tabindex]:not([tabindex="-1"])';
      return Array.from(panelRef.current.querySelectorAll<HTMLElement>(sel)).filter(
        (el) => !el.hasAttribute("disabled")
      );
    };
    const t = setTimeout(() => getFocusable()[0]?.focus(), 0);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab") return;
      const items = getFocusable();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && active === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      lastFocused.current?.focus();
    };
  }, [openKey, onClose]);

  const jumpAfterClose = useCallback(
    (id: string, cta: "apply" | "calc") => {
      try {
        (window as any).gtag?.("event", "mobile_type_cta", { type: openKey, action: cta, page: "mobile" });
        (window as any).ym?.(103909522, "reachGoal", "mobile_type_cta");
      } catch {}
      onClose();
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        else window.location.hash = `#${id}`;
      }, 220);
    },
    [onClose, openKey]
  );

  if (!mounted || !openKey || !payload) return null;

  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  const backdropTr = reduced ? { duration: 0 } : { duration: 0.18, ease: "easeOut" };
  const panelTr = reduced ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 32, mass: 0.7 };

  const modalBtnBase =
    "inline-flex items-center justify-center rounded-full font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 transition text-center whitespace-nowrap";
  const modalBtnSize = "h-12 w-full sm:w-[260px] px-6 text-base";

  return createPortal(
    <AnimatePresence>
      {openKey && (
        // ФОН — клик закрывает
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
          {/* ПАНЕЛЬ — настоящий fullscreen edge-to-edge */}
          <motion.div
            ref={panelRef}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: reduced ? 1 : 0, scale: reduced ? 1 : 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: reduced ? 1 : 0, scale: 0.98 }}
            transition={panelTr}
            className="fixed inset-0 w-full h-[100svh] bg-black overflow-y-auto overscroll-contain [touch-action:pan-y]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-types-modal-title"
            aria-describedby="mobile-types-modal-desc"
          >
            {/* sticky top-bar с яркой кнопкой закрытия */}
            <div className="sticky top-0 z-20 flex items-center justify-end px-4 py-3 md:px-6 md:py-4 bg-black/60 backdrop-blur supports-[backdrop-filter]:bg-black/40">
              <button
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

            {/* Контент без max-w-ограничителя (удобнее читать на больших — оставим стандартные паддинги) */}
            <div className="px-5 md:px-10 pb-10">
              {/* Заголовок (мобайл) */}
              <h3
                id="mobile-types-modal-title"
                className="block sm:hidden text-[clamp(1.6rem,6vw,2rem)] font-extrabold tracking-tight mb-3 text-center"
              >
                {payload.title}
              </h3>

              {/* GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1.35fr] gap-8 lg:gap-12 items-start">
                {/* Картинка */}
                <div className="relative">
                  <div className="relative w-full h-[44vh] sm:h-[54vh] lg:h-[78vh]">
                    {payload.img ? (
                      <NextImage
                        src={payload.img}
                        alt={`${payload.title} — визуальный пример`}
                        fill
                        sizes="100vw"
                        className="object-contain"
                        priority={false}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-white/[0.04]" />
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/60 via-black/10 to-transparent" />
                  </div>
                </div>

                {/* Текст */}
                <div>
                  <h3 className="hidden sm:block text-[clamp(1.8rem,4.6vw,3rem)] font-extrabold tracking-tight mb-3">
                    {payload.title}
                  </h3>

                  <p id="mobile-types-modal-desc" className="text-white/85 text-base md:text-lg leading-relaxed max-w-prose">
                    {payload.short}
                  </p>

                  {/* Лучше для */}
                  {payload.useFor?.length ? (
                    <div className="mt-8">
                      <div className="text-sm font-semibold text-white/90 mb-3 text-center sm:text-left">Лучше для</div>
                      {/* мобайл — чипы */}
                      <div className="grid grid-cols-2 gap-2 sm:hidden">
                        {payload.useFor.map((u) => (
                          <span key={u} className="rounded-xl border border-white/15 bg-white/[0.06] px-3 py-2 text-[12px] text-white/85">
                            {u}
                          </span>
                        ))}
                      </div>
                      {/* десктоп — список */}
                      <ul className="hidden sm:block space-y-1.5 text-white/80">
                        {payload.useFor.map((u, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="mt-2 h-[5px] w-[5px] rounded-full bg-white/60" />
                            <span>{u}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {/* Возможности */}
                  {payload.bullets?.length ? (
                    <div className="mt-8 hidden sm:block">
                      <div className="text-sm font-semibold text-white/90 mb-3">Возможности</div>
                      <ul className="space-y-1.5 text-white/85">
                        {payload.bullets.map((b, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="mt-2 h-[5px] w-[5px] rounded-full bg-white/60" />
                            <span>{b}</span>
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

                  {/* CTA — одна кнопка */}
                  <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-2 justify-center sm:justify-start">
                    <button
                      type="button"
                      onClick={() => jumpAfterClose("contact", "apply")}
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
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

/* ==================== MARQUEE (с тонкими линиями и регулируемым отступом) ==================== */
function TechMarquee({
  className = "",
  lineOffset = 22,
}: {
  className?: string;
  lineOffset?: number;
}) {
  const text =
    "React Native · TypeScript · Expo/EAS · Reanimated · SQLite/WatermelonDB · Realm · WebSockets · Push (FCM/APNS) · Deeplinks · StoreKit/Google Billing · CodePush/OTA · Feature Flags · Remote Config · Firebase/Amplitude · Detox/E2E";

  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    setReduced(Boolean(mq?.matches));
    const on = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq?.addEventListener?.("change", on);
    return () => mq?.removeEventListener?.("change", on);
  }, []);

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

      {/* маска краёв */}
      <div className="mask-fade pointer-events-none absolute inset-0 z-0" />

      <div
        className="marquee relative z-0 flex gap-12 whitespace-nowrap will-change-transform text-white/80"
        style={reduced ? { animation: "none" } : undefined}
      >
        <span>{text}</span>
        <span aria-hidden>{text}</span>
        <span aria-hidden>{text}</span>
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
