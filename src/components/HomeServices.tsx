// src/app/components/HomeServices.tsx
"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Globe, Cpu, Smartphone } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { createPortal } from "react-dom";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Script from "next/script";

/* ------------------------------- DATA -------------------------------- */

type ServiceKey = "sites" | "webapp" | "mobile";

type Svc = {
  title: string;
  href: string;
  desc: string;
  image: string;
  weBuildLabel: string;
  weBuild: string[];
  tech: string[];
  process: string[];
  ctaDetail: string;
  calcHash: string;
  seoKeywords: string[];
};

const SERVICES: Record<ServiceKey, Svc> = {
  sites: {
    title: "Сайты",
    href: "/sites",
    desc:
      "Мы создаём современные сайты — простые, удобные и быстрые. Ваши клиенты легко находят нужное, а страницы загружаются мгновенно на любом устройстве.",
    image: "/site1.png",
    weBuildLabel: "Какие сайты мы делаем",
    weBuild: [
      "Лендинги и промо",
      "Корпоративные сайты",
      "Интернет-магазины",
      "Мультиязычные порталы",
      "Блоги и медиа",
      "Карьера/вакансии",
    ],
    tech: ["Next.js", "Headless CMS", "i18n", "Full-text Search", "Schema.org"],
    process: [
      "Продумываем структуру и сценарии для пользователей",
      "Делаем понятный и красивый дизайн",
      "Подключаем нужные сервисы: CMS, поиск, CRM",
      "Запускаем сайт, настраиваем SEO и аналитику",
    ],
    ctaDetail: "Сайты",
    calcHash: "#calculator",
    seoKeywords: [
      "разработка сайта",
      "создание сайта под ключ",
      "быстрые сайты",
      "SEO оптимизация сайта",
    ],
  },
  webapp: {
    title: "Веб-приложения",
    href: "/webapp",
    desc:
      "Мы разрабатываем веб-приложения для бизнеса: личные кабинеты, CRM, ERP. Подключаем интеграции, делаем удобные отчёты и дашборды. Всё работает быстро и стабильно.",
    image: "/web_app.png",
    weBuildLabel: "Какие веб-приложения делаем",
    weBuild: [
      "ЛК клиентов/партнёров",
      "CRM/ERP/Back-office",
      "Порталы и экосистемы",
      "Аналитика и дашборды",
      "Формы/мастера/флоу",
      "Файлы и очереди",
    ],
    tech: ["Next.js", "Node.js", "PostgreSQL", "Redis", "RBAC", "GraphQL/REST"],
    process: [
      "Анализируем бизнес-процессы и проектируем архитектуру",
      "Делаем интерфейсы удобными для пользователей",
      "Подключаем нужные сервисы и базы данных",
      "Запускаем продукт и развиваем его по roadmap",
    ],
    ctaDetail: "Веб-приложения",
    calcHash: "#calculator",
    seoKeywords: [
      "разработка веб-приложений",
      "личный кабинет",
      "CRM разработка",
      "интеграция API",
    ],
  },
  mobile: {
    title: "Мобильные приложения",
    href: "/mobile",
    desc:
      "Мы разрабатываем мобильные решения, которые помогают бизнесу быть ближе к клиентам. Простое управление, быстрый доступ и стабильная работа на любых устройствах.",
    image: "/mobile_app.png",
    weBuildLabel: "Какие мобильные приложения делаем",
    weBuild: [
      "Коммерция/маркетплейс",
      "Лояльность и карты",
      "Полевая работа/оффлайн",
      "Доставки и курьеры",
      "Сервисы и сообщества",
      "Внутренние инструменты",
    ],
    tech: ["React Native", "Swift/Kotlin", "Deep Links", "App Clips", "Analytics"],
    process: [
      "Проектируем удобный UX и красивый UI",
      "Разрабатываем надёжное приложение для iOS и Android",
      "Интегрируем платежи, CRM и сторонние сервисы",
      "Публикуем в App Store и Google Play, поддерживаем и обновляем",
    ],
    ctaDetail: "Мобильные приложения",
    calcHash: "#calculator",
    seoKeywords: [
      "разработка мобильных приложений",
      "React Native",
      "iOS Android разработка",
      "публикация в сторы",
    ],
  },
};

/* -------------------------- Icons (safe map) -------------------------- */

type IconType = (props: React.SVGProps<SVGSVGElement>) => JSX.Element;

const ICONS: Record<ServiceKey, IconType> = {
  sites: Globe,
  webapp: Cpu,
  mobile: Smartphone,
};

/* ------------------------------ SECTION ------------------------------ */

export default function HomeServices() {
  const [openKey, setOpenKey] = useState<ServiceKey | null>(null);
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();
  const reduced = useReducedMotion();

  // deep-link ?modal=...
  useEffect(() => {
    const m = params.get("modal") as ServiceKey | null;
    if (m && SERVICES[m]) setOpenKey(m);
    else setOpenKey(null);
  }, [params]);

  const openWithUrl = useCallback(
    (k: ServiceKey) => {
      router.replace(`${pathname}?modal=${k}`, { scroll: false });
      setOpenKey(k);
    },
    [router, pathname]
  );

  const closeAndClean = useCallback(() => {
    router.replace(pathname, { scroll: false });
    setOpenKey(null);
  }, [router, pathname]);

  // JSON-LD (ItemList с Service)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: (Object.entries(SERVICES) as [ServiceKey, Svc][])
      .map(([_, s], index) => ({
        "@type": "Service",
        name: s.title,
        description: s.desc,
        position: index + 1,
        url: s.href,
        areaServed: "RU",
        provider: { "@type": "Organization", name: "OneStack" },
        keywords: s.seoKeywords.join(", "),
      })),
  };

  return (
    <section
      id="services"
      className="relative w-full bg-black text-white px-6 md:px-12 lg:px-20 pt-16 pb-20"
      aria-labelledby="services-title"
    >
      {/* JSON-LD для списка услуг */}
      <Script
        id="ld-services"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ВНУТРЕННИЙ КОНТЕЙНЕР — как в HomeIntro */}
      <div className="mx-auto w-full max-w-7xl px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-12 gap-x-6 md:gap-x-8">
          {/* Заголовок */}
          <motion.header
            initial={reduced ? undefined : { opacity: 0, y: 14 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="col-span-12 md:col-span-8 mb-6 md:mb-8"
          >
            <span className="inline-block text-xs tracking-[0.25em] text-white/60 uppercase mb-3">
              услуги
            </span>
            <h2
              id="services-title"
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold"
            >
              Что мы делаем
            </h2>
            <p className="mt-3 text-white/65 max-w-2xl">
              Полный цикл разработки: мы превращаем идеи в готовые решения и остаёмся рядом после запуска, чтобы проект развивался и рос.
            </p>
          </motion.header>

          {/* Карточки */}
          <div className="col-span-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
              {(Object.entries(SERVICES) as [ServiceKey, Svc][]).map(
                ([key, svc], i) => (
                  <ServiceCard
                    key={key}
                    delay={reduced ? 0 : 0.05 * i}
                    title={svc.title}
                    desc={svc.desc}
                    href={svc.href}
                    image={svc.image}
                    onOpen={() => openWithUrl(key)}
                    icon={ICONS[key]}
                  />
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Бегущая строка */}
      <TechMarquee className="mt-10" lineOffset={18} />

      {/* FULLSCREEN модалка */}
      <ServiceModal
        openKey={openKey}
        onClose={closeAndClean}
        payload={openKey ? SERVICES[openKey] : null}
      />
    </section>
  );
}

/* ------------------------------ CARD ------------------------------ */

function ServiceCard({
  title,
  desc,
  href,
  image,
  onOpen,
  delay = 0,
  icon: Icon,
}: {
  title: string;
  desc: string;
  href: string;
  image: string;
  onOpen: () => void;
  delay?: number;
  icon?: IconType;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.article
      initial={reduced ? undefined : { opacity: 0, y: 24 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, ease: "easeOut", delay }}
      whileHover={reduced ? undefined : { scale: 1.02 }}
      className="group relative overflow-hidden rounded-3xl border border-white/10
                 bg-gradient-to-br from-white/[0.04] to-white/[0.02]
                 shadow-md hover:shadow-white/10 transition-all p-7"
    >
      {/* мягкая подсветка на hover */}
      <div className="pointer-events-none absolute -inset-px -z-10 rounded-3xl bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition" />

      <Link
        href={href}
        prefetch
        className="inline-flex items-center gap-3 text-xl font-semibold text-white"
        aria-label={`Подробнее: ${title}`}
        title={title}
      >
        {Icon ? (
          <Icon
            className="h-6 w-6 text-white/70 group-hover:text-white transition"
            aria-hidden
          />
        ) : null}
        <span className="underline decoration-transparent group-hover:decoration-white/30 decoration-2 underline-offset-4 transition">
          {title}
        </span>
      </Link>

      <p className="mt-3 text-white/70 text-sm leading-relaxed">{desc}</p>

      {/* Триггер модалки */}
      <div className="mt-7">
        <button
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
        >
          Ближе
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M5 12h14m0 0l-5-5m5 5l-5 5"
              stroke="currentColor"
              strokeWidth="1.8"
            />
          </svg>
        </button>
      </div>
    </motion.article>
  );
}

/* ------------------------------ MARQUEE ------------------------------ */

function TechMarquee({
  className = "",
  lineOffset = 22,
}: {
  className?: string;
  lineOffset?: number;
}) {
  const tech =
    "HTML · CSS · JavaScript · TypeScript · React · Next.js · Swift · Kotlin · Docker · Kubernetes · Node.js · GraphQL · REST API · PostgreSQL · Redis · Tailwind · CI/CD · Playwright · Vitest";

  const reduced = useReducedMotion();

  return (
    <div
      className={`relative overflow-hidden ${className}
                  mx-[calc(50%-50vw)] px-[calc(50vw-50%)]`}
      style={{ paddingTop: lineOffset, paddingBottom: lineOffset }}
      aria-hidden="true"
    >
      {/* верхняя тонкая линия */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-px z-10 w-[min(1120px,92vw)] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      {/* нижняя тонкая линия */}
      <div className="pointer-events-none absolute left-1/2 bottom-0 -translate-x-1/2 h-px z-10 w-[min(1120px,92vw)] bg-gradient-to-r from-transparent via-white/60 to-transparent" />

      {/* затемняющая маска по краям */}
      <div className="mask-fade pointer-events-none absolute inset-0 z-0" />

      <div
        className="marquee relative z-0 flex gap-12 whitespace-nowrap will-change-transform"
        style={reduced ? { animation: "none" } : undefined}
      >
        <span className="opacity-90">{tech}</span>
        <span className="opacity-90" aria-hidden>
          {tech}
        </span>
        <span className="opacity-90" aria-hidden>
          {tech}
        </span>
      </div>

      <style jsx>{`
        .marquee {
          animation: marquee 26s linear infinite;
        }
        @media (max-width: 768px) {
          .marquee {
            animation-duration: 32s;
          }
        }
        .marquee:hover,
        .marquee:focus-within {
          animation-play-state: paused;
        }
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        .mask-fade {
          background: linear-gradient(
            90deg,
            rgba(0, 0, 0, 1) 0%,
            rgba(0, 0, 0, 0) 12%,
            rgba(0, 0, 0, 0) 88%,
            rgba(0, 0, 0, 1) 100%
          );
        }
      `}</style>
    </div>
  );
}

/* ------------------------------ MODAL (FULLSCREEN, NO SCROLL) ------------------------------ */

function ServiceModal({
  openKey,
  onClose,
  payload,
}: {
  openKey: ServiceKey | null;
  onClose: () => void;
  payload: Svc | null;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const lastFocused = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => setMounted(true), []);

  // Жёсткая блокировка прокрутки под модалкой (страница) + отмена колесика/тач-свайпов
  useEffect(() => {
    if (!openKey) return;

    const b = document.body.style;
    const h = document.documentElement.style;

    const prevBodyOverflow = b.overflow;
    const prevHtmlOverflow = h.overflow;
    const prevOBY = (document.body.style as any).overscrollBehaviorY;

    b.overflow = "hidden";
    (document.body.style as any).overscrollBehaviorY = "none";
    h.overflow = "hidden";

    const stop = (e: Event) => e.preventDefault();
    window.addEventListener("wheel", stop, { passive: false });
    window.addEventListener("touchmove", stop, { passive: false });

    return () => {
      b.overflow = prevBodyOverflow;
      (document.body.style as any).overscrollBehaviorY = prevOBY || "";
      h.overflow = prevHtmlOverflow || "";
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchmove", stop);
    };
  }, [openKey]);

  // focus trap + Esc
  useEffect(() => {
    if (!openKey) return;
    lastFocused.current = document.activeElement as HTMLElement;

    const getFocusable = () => {
      if (!panelRef.current) return [] as HTMLElement[];
      const sel = 'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])';
      return Array.from(panelRef.current.querySelectorAll<HTMLElement>(sel))
        .filter((el) => !el.hasAttribute("disabled"));
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
        if (active === first) {
          e.preventDefault();
          last.focus();
        }
      } else if (active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      lastFocused.current?.focus();
    };
  }, [openKey, onClose]);

  if (!mounted || !openKey || !payload) return null;

  const backdropTr = reduced ? { duration: 0 } : { duration: 0.18, ease: "easeOut" };
  const panelTr = reduced ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 32, mass: 0.7 };

  const modalBtnBase =
    "inline-flex items-center justify-center rounded-full font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 transition text-center whitespace-nowrap";
  const modalBtnSize = "h-12 w-full sm:w-[260px] px-6 text-base";

  //

  return createPortal(
    <AnimatePresence>
      {openKey && (
        <>
          {/* Бэкдроп */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={backdropTr}
            className="fixed inset-0 z-[999] bg-black/75 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          {/* Полноэкранная панель без внутреннего скролла */}
          <motion.div
            key="panel"
            ref={panelRef}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: reduced ? 1 : 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: reduced ? 1 : 0, scale: 1 }}
            transition={panelTr}
            className="
              fixed inset-0 z-[1000]
              w-screen h-[100svh]
              bg-black/92 backdrop-blur-sm
              overflow-hidden touch-none
            "
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-desc"
          >
            {/* Внутренний слой (без прокрутки) */}
            <div className="relative h-full w-full px-5 md:px-10 py-6 md:py-8">
              {/* Top bar */}
              <div className="flex items-center justify-end">
                <button
                  onClick={onClose}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full
                             bg-white/20 hover:bg-white/35 text-white transition
                             focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70
                             shadow-[0_0_0_1px_rgba(255,255,255,0.25)_inset]"
                  aria-label="Закрыть модальное окно"
                  title="Закрыть"
                >
                  <X className="h-5 w-5" aria-hidden />
                </button>
              </div>

              {/* Контент: чтобы не было прокрутки — ограничиваем высоту блоков и используем обрезку */}
              <h3 className="block sm:hidden text-[clamp(1.6rem,6vw,2rem)] font-extrabold tracking-tight mt-2 mb-3">
                {payload.title}
              </h3>

              <div className="mt-1 grid grid-cols-1 lg:grid-cols-[1.05fr_1.35fr] gap-6 lg:gap-10 items-start h-[calc(100%-84px)]">
                {/* Картинка */}
                <div className="order-1 lg:order-none relative h-[40vh] sm:h-[48vh] lg:h-full">
                  <div className="relative w-full h-full">
                    <Image
                      src={payload.image}
                      alt={`${payload.title}: примеры интерфейсов и экранов`}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 52vw"
                      className="object-contain"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/60 via-black/10 to-transparent" />
                  </div>
                </div>

                {/* Текстовая часть */}
                <div className="order-2 lg:order-none flex flex-col h-full">
                  <h3
                    id="modal-title"
                    className="hidden sm:block text-[clamp(1.8rem,4.6vw,3rem)] font-extrabold tracking-tight mb-3"
                  >
                    {payload.title}
                  </h3>

                  <p
                    id="modal-desc"
                    className="text-white/85 text-base md:text-lg leading-relaxed max-w-prose"
                  >
                    {payload.desc}
                  </p>

                  {/* Какие делаем */}
                  <div className="mt-6 lg:mt-8">
                    <div className="text-sm font-semibold text-white/90 mb-3">
                      {payload.weBuildLabel}
                    </div>
                    <ul className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-1 gap-y-2 gap-x-4 text-white/85">
                      {payload.weBuild.map((item) => (
                        <li key={item} className="pl-5 relative">
                          <span className="absolute left-0 top-2 h-1.5 w-1.5 rounded-full bg-white/70" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Технологии */}
                  {payload.tech?.length > 0 && (
                    <div className="mt-6 lg:mt-8 hidden sm:block">
                      <div className="text-sm font-semibold text-white/90 mb-3">
                        Технологии
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {payload.tech.map((t) => (
                          <span
                            key={t}
                            className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-sm"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Как мы работаем */}
                  <div className="mt-6 lg:mt-8 hidden sm:block">
                    <div className="text-sm font-semibold text-white/90 mb-3">
                      Как мы работаем
                    </div>
                    <ol className="grid grid-cols-1 gap-2 list-decimal pl-6 text-white/85">
                      {payload.process.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ol>
                  </div>

                  {/* CTA */}
                  <div className="mt-auto pt-6 lg:pt-8 flex flex-col sm:flex-row gap-3 sm:gap-2 justify-center sm:justify-start">
                    <Link
                      href={payload.href}
                      onClick={() => setTimeout(onClose, 0)}
                      className={`${modalBtnBase} ${modalBtnSize} bg-white text-black hover:shadow-white/20 hover:shadow-lg active:scale-[0.99]`}
                    >
                      <span className="mx-auto">{payload.ctaDetail}</span>
                      <svg
                        className="ml-2 h-5 w-5 flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden
                      >
                        <path
                          d="M5 12h14m0 0l-5-5m5 5l-5 5"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
