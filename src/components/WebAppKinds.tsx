// src/components/WebAppKinds.tsx
"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import NextImage from "next/image";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

/* ==================== DATA ==================== */
type Kind = "crm" | "portal" | "cabinet" | "analytics" | "b2b" | "saas";

type Item = {
  title: string;
  desc: string;
  href: string;    // якорь секции (используем в CTA, не на заголовке)
  image: string;
  chips: string[];
  useFor: string[];
  tech: string[];
  steps: string[];
};

const TYPES: Record<Kind, Item> = {
  crm: {
    title: "CRM / ERP",
    desc: "Контакты, сделки, финансы, склад, роли и отчёты. Интеграции с 1C/МойСклад, платёжками и почтой.",
    href: "#crm",
    image: "/crm.png",
    chips: ["RBAC", "Integrations", "Reports"],
    useFor: ["Отдел продаж/закупок", "Операционный учёт", "Автоматизация рутины"],
    tech: ["Next.js", "Node.js", "PostgreSQL", "Redis/Queues", "GraphQL/REST", "1C/CRM API", "RBAC"],
    steps: ["Бриф/процессы", "Схема данных/ролей", "Модули: сделки/склад", "Интеграции и отчёты", "Запуск, обучение"],
  },
  portal: {
    title: "Внутренний портал",
    desc: "Доступ для сотрудников/партнёров: документы, заявки, процессы, анонсы и обучение.",
    href: "#portal",
    image: "/portal.png",
    chips: ["SSO", "Workflows", "Docs"],
    useFor: ["HR/IT-заявки", "Онбординг", "Документы/регламенты"],
    tech: ["SSO (OAuth/SAML)", "Next.js", "Node.js", "PostgreSQL", "Search", "Audit logs"],
    steps: ["Карта ролей/прав", "Процессы и формы", "База знаний и поиск", "Единый вход", "Запуск и обучение"],
  },
  cabinet: {
    title: "Кабинет клиента",
    desc: "Профиль, заказы, счета, поддержка, уведомления. Удобная self-service зона для клиентов.",
    href: "#cabinet",
    image: "/client.png",
    chips: ["Self-service", "Support", "Billing"],
    useFor: ["Сокращение нагрузки саппорта", "Онлайн-оплаты и счета", "Статусы и уведомления"],
    tech: ["Next.js App Router", "API Gateway", "Payments (Stripe/ЮKassa)", "Webhooks", "Emails/Push", "ACL"],
    steps: ["Юзкейсы и метрики", "UX-потоки: заказы/счета", "Поддержка/чат", "Платежи/уведомления", "Запуск и SLA"],
  },
  analytics: {
    title: "Аналитическая панель",
    desc: "Дашборды, метрики, фильтры и экспорт. Источники данных и расписания отчётов.",
    href: "#analytics",
    image: "/analitick.png",
    chips: ["Dashboards", "ETL", "Exports"],
    useFor: ["Операционная аналитика", "Отчётность руководству", "Сводки по отделам"],
    tech: ["ETL/Jobs", "PostgreSQL/OLAP", "ClickHouse (по необходимости)", "Charts", "Caching"],
    steps: ["Метрики/источники", "Модель данных", "Виджеты и фильтры", "Экспорт/планировщик", "Запуск и обучение"],
  },
  b2b: {
    title: "B2B-витрина",
    desc: "Каталоги, персональные цены, корзина и заказы по договорам. Интеграции с ERP.",
    href: "#b2b",
    image: "/b2b.png",
    chips: ["Catalog", "Pricing", "ERP"],
    useFor: ["Оптовые продажи", "Персональные прайсы", "Согласование заказов"],
    tech: ["Next.js", "Server Actions", "ERP API", "Caching/CDN", "RBAC", "Payments"],
    steps: ["Каталог/прайсы", "Карточка/корзина", "Согласование/статусы", "ERP-синхронизация", "Запуск и KPI"],
  },
  saas: {
    title: "SaaS-сервис",
    desc: "Подписки, биллинг, пробные периоды, роли и мультитенантность. Облачный деплой.",
    href: "#saas",
    image: "/saas.png",
    chips: ["Billing", "Multi-tenant", "Cloud"],
    useFor: ["Подписочная модель", "Мульти-аккаунты", "Быстрый глобальный деплой"],
    tech: ["Next.js", "Prisma + PostgreSQL", "Row-Level Security", "Stripe Billing", "Feature Flags", "CI/CD"],
    steps: ["MVP и тарифы", "Онбординг/триалы", "Биллинг/инвойсы", "Мультитенантность", "Наблюдаемость и рост"],
  },
};

/* ==================== MAIN ==================== */
export default function WebAppKinds() {
  const [openKey, setOpenKey] = useState<Kind | null>(null);
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();

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

  // respect reduced motion
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  return (
    <section
      id="kinds"
      className="relative w-full min-h-screen bg-black text-white flex flex-col justify-center pt-8 md:pt-10 pb-16"
      aria-labelledby="kinds-title"
    >
      {/* внутренний контейнер — как в HomeServices/SiteTypes */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
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
              типы решений
            </span>
            <h2 id="kinds-title" className="text-3xl sm:text-4xl md:text-5xl font-extrabold">
              Подбираем формат под цель и рост
            </h2>
            <p className="mt-3 text-white/60 max-w-2xl">
              CRM/ERP, порталы и личные кабинеты, B2B-витрины, аналитика и SaaS — собираем под ваш процесс и масштабы.
            </p>
          </motion.header>

          {/* Карточки */}
          <div className="col-span-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-3">
              {(Object.entries(TYPES) as [Kind, Item][]).map(([key, item], i) => (
                <KindCard
                  key={key}
                  delay={reduced ? 0 : 0.05 * i}
                  title={item.title}
                  desc={item.desc}
                  href={item.href}
                  image={item.image}
                  chips={item.chips}
                  onOpen={() => openWithUrl(key)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Бегущая строка — с линиями и регулируемым отступом */}
      <TechMarquee className="mt-8 md:mt-10" lineOffset={18} />

      {/* Модалка */}
      <KindModal openKey={openKey} onClose={closeAndClean} payload={openKey ? TYPES[openKey] : null} />
    </section>
  );
}

/* ==================== CARD (как ServiceCard/SiteCard) ==================== */
function KindCard({
  title,
  desc,
  href,   // оставляем для aria/подсказок, не используем как ссылку на заголовке
  image,
  chips,
  onOpen,
  delay = 0,
}: {
  title: string;
  desc: string;
  href: string;
  image: string;
  chips: string[];
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
    >
      {/* мягкая подсветка при ховере */}
      <div className="pointer-events-none absolute -inset-px -z-10 rounded-3xl bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition" />

      {/* Заголовок — БЕЗ перехода, просто кнопка открытия модалки */}
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

      {/* Chips */}
      <div className="mt-4 flex flex-wrap gap-2">
        {chips.map((c) => (
          <span
            key={c}
            className="rounded-full border border-white/15 bg-white/[0.05] px-2.5 py-1 text-[12px] text-white/75"
          >
            {c}
          </span>
        ))}
      </div>

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

/* ==================== MODAL (закрытие по фону, одинаковые CTA) ==================== */
function KindModal({
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

  // lock body scroll + мобильная прокрутка панели
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
      const sel =
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])';
      return Array.from(panelRef.current.querySelectorAll<HTMLElement>(sel)).filter(
        (el) => !el.hasAttribute("disabled")
      );
    };
    setTimeout(() => getFocusable()[0]?.focus(), 0);

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
      const el = document.getElementById(hash.replace("#", ""));
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      else window.location.hash = hash;
    }, 220);
  };

  return createPortal(
    <AnimatePresence>
      {openKey && (
        // фон — клик закрывает
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
          {/* центрирование панели; клики внутри не закрывают */}
          <div className="fixed inset-0 p-4 md:p-6 flex items-start md:items-center justify-center">
            <motion.div
              ref={panelRef}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: reduced ? 1 : 0, scale: reduced ? 1 : 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: reduced ? 1 : 0, scale: 0.98 }}
              transition={panelTr}
              className="mx-auto w-full max-w-7xl rounded-2xl bg-transparent
                         max-h-[100svh] md:max-h-[92vh]
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
                        priority={false}
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
                              <span className="mt-2 h-[5px] w-[5px] rounded-full bg-white/60" />
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

/* ==================== MARQUEE (с тонкими линиями) ==================== */
function TechMarquee({
  className = "",
  lineOffset = 22,
}: {
  className?: string;
  lineOffset?: number;
}) {
  const tech =
    "Next.js · React · TypeScript · Node.js · GraphQL · REST API · PostgreSQL · Redis · Kafka · Elasticsearch · WebSockets · RBAC · OAuth/SSO · Stripe/ЮKassa · 1C/CRM · Docker · CI/CD · Prometheus/Grafana · Sentry";

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
