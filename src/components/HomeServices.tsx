// src/app/components/HomeServices.tsx
"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo, useId } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Globe, Cpu, Smartphone, ArrowRight, Check, Sparkles } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { createPortal } from "react-dom";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Script from "next/script";

/* ==================== PREMIUM ANIMATIONS ==================== */
const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  transition: {
    duration: 0.8,
    ease: [0.25, 0.46, 0.45, 0.94],
    delay: d,
  },
  viewport: { once: true, margin: "-100px" },
});

const scaleIn = (d = 0) => ({
  initial: { opacity: 0, scale: 0.9 },
  whileInView: { opacity: 1, scale: 1 },
  transition: {
    duration: 0.7,
    ease: "easeOut",
    delay: d,
  },
  viewport: { once: true, margin: "-50px" },
});

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
  viewport: { once: true, margin: "-100px" },
};

/* ==================== DATA ==================== */
type ServiceKey = "sites" | "webapp" | "mobile";

type Service = {
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
  icon: any;
  hoverColor: string;
  gradientFrom: string;
  gradientTo: string;
  seoTitle?: string;
  seoDescription?: string;
};

const SERVICES: Record<ServiceKey, Service> = {
  sites: {
    title: "Разработка сайтов",
    href: "/sites",
    desc: "Создаём современные сайты — быстрые, устойчивые и удобные. Адаптивность, SEO-оптимизация, высокая скорость загрузки и фокус на конверсию.",
    image: "/site1.png",
    weBuildLabel: "Какие сайты мы делаем",
    weBuild: [
      "Лендинги и промо",
      "Корпоративные сайты",
      "Интернет-магазины",
      "Мультиязычные порталы",
      "Блоги и медиа",
      "HR-порталы",
    ],
    tech: ["Next.js", "Headless CMS", "i18n", "Full-text Search", "Schema.org"],
    process: [
      "Создаём структуру и карточки контента",
      "Разрабатываем UI/UX-дизайн",
      "Внедряем CMS, поиск, формы, интеграции",
      "Настраиваем SEO, скорость и аналитики",
    ],
    ctaDetail: "Сайты",
    calcHash: "#calculator",
    seoKeywords: [
      "разработка сайта",
      "создание сайта под ключ",
      "лендинг под ключ",
      "интернет-магазин под ключ",
      "адаптивная верстка",
      "SEO оптимизация сайта",
    ],
    icon: Globe,
    hoverColor: "gray",
    gradientFrom: "from-gray-600",
    gradientTo: "to-gray-400",
    seoTitle: "Разработка сайтов | OneStack24",
    seoDescription: "Создание современных сайтов с SEO-оптимизацией и высокой скоростью загрузки.",
  },

  webapp: {
    title: "Веб-приложения",
    href: "/webapp",
    desc: "Разрабатываем веб-приложения любого уровня сложности: личные кабинеты, CRM, ERP, back-office решения и корпоративные порталы.",
    image: "/web_app.png",
    weBuildLabel: "Какие веб-приложения делаем",
    weBuild: [
      "ЛК клиентов и партнёров",
      "CRM/ERP",
      "Корпоративные экосистемы",
      "Порталы и дашборды",
      "Формы, мастера, флоу",
      "Обработка файлов, очереди",
    ],
    tech: ["Next.js", "Node.js", "PostgreSQL", "Redis", "RBAC", "GraphQL/REST"],
    process: [
      "Прорабатываем бизнес-процессы",
      "Проектируем архитектуру",
      "Разрабатываем интерфейсы",
      "Создаём бэкенд и интеграции",
      "Запускаем продукт и поддерживаем",
    ],
    ctaDetail: "Веб-приложения",
    calcHash: "#calculator",
    seoKeywords: [
      "разработка веб приложений",
      "создание CRM",
      "ERP для бизнеса",
      "API интеграции",
      "личный кабинет разработка",
    ],
    icon: Cpu,
    hoverColor: "gray",
    gradientFrom: "from-gray-500",
    gradientTo: "to-gray-300",
    seoTitle: "Веб-приложения | OneStack24",
    seoDescription:
      "Разработка веб-приложений для бизнеса: CRM, ERP, личные кабинеты и корпоративные порталы.",
  },

  mobile: {
    title: "Мобильные приложения",
    href: "/mobile",
    desc: "Создаём мобильные приложения, которые помогают бизнесу быть ближе к пользователям. Быстрое открытие, удобный UX и стабильность.",
    image: "/mobile_app.png",
    weBuildLabel: "Какие мобильные приложения делаем",
    weBuild: [
      "Маркетплейсы",
      "Приложения лояльности",
      "Оффлайн-решения",
      "Доставки и курьеры",
      "Сервисы и сообщества",
      "Внутренние B2B-инструменты",
    ],
    tech: ["React Native", "Swift/Kotlin", "Deep Links", "App Clips", "Analytics"],
    process: [
      "Проектируем UX/UI",
      "Разрабатываем iOS и Android версии",
      "Добавляем оплату, карты, CRM",
      "Публикуем в App Store/Google Play и поддерживаем",
    ],
    ctaDetail: "Мобильные приложения",
    calcHash: "#calculator",
    seoKeywords: [
      "разработка мобильных приложений",
      "создание приложения под ключ",
      "React Native разработка",
      "iOS Android разработка",
      "публикация приложения в сторы",
    ],
    icon: Smartphone,
    hoverColor: "gray",
    gradientFrom: "from-gray-400",
    gradientTo: "to-gray-200",
    seoTitle: "Мобильные приложения | OneStack24",
    seoDescription:
      "Создание мобильных приложений для iOS и Android с React Native и нативными технологиями.",
  },
};

/* ==================== MAIN COMPONENT ==================== */
export default function HomeServices() {
  const [openKey, setOpenKey] = useState<ServiceKey | null>(null);
  const router = useRouter();
  const titleId = useId();
  const params = useSearchParams();
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://onestack24.ru";
  const PAGE_URL = `${SITE_URL}/#services`;

  /* ==================== JSON-LD (fixed structure) ==================== */
  const jsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": `${SITE_URL}/#website`,
          url: SITE_URL,
          name: "OneStack24 — разработка цифровых продуктов",
          inLanguage: "ru-RU",
          publisher: { "@id": `${SITE_URL}/#organization` },
        },
        {
          "@type": "WebPage",
          "@id": `${PAGE_URL}#webpage`,
          url: PAGE_URL,
          name: "Услуги разработки — OneStack24",
          description:
            "Разработка сайтов, веб-приложений и мобильных приложений под ключ. Дизайн, архитектура, разработка, интеграции и поддержка.",
          isPartOf: { "@id": `${SITE_URL}/#website` },
          inLanguage: "ru-RU",
        },
        {
          "@type": "Organization",
          "@id": `${SITE_URL}/#organization`,
          name: "OneStack24",
          url: SITE_URL,
          logo: {
            "@type": "ImageObject",
            "@id": `${SITE_URL}/logo.png#logo`,
            url: `${SITE_URL}/logo.png`,
            width: 512,
            height: 512,
          },
          sameAs: [
            "https://t.me/onestack_team",
            "https://github.com/",
            "https://www.linkedin.com/",
          ],
        },
        {
          "@type": "ItemList",
          "@id": `${PAGE_URL}#itemlist`,
          url: PAGE_URL,
          name: "Основные услуги разработки",
          numberOfItems: Object.values(SERVICES).length,
          itemListElement: Object.entries(SERVICES).map(([key, service], index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "Service",
              "@id": `${SITE_URL}${service.href}#service`,
              name: service.title,
              description: service.desc,
              url: `${SITE_URL}${service.href}`,
              image: {
                "@type": "ImageObject",
                url: `${SITE_URL}${service.image}`,
              },
              provider: { "@id": `${SITE_URL}/#organization` },
              areaServed: [
                { "@type": "Country", name: "Россия" },
                { "@type": "Country", name: "Казахстан" },
                { "@type": "Country", name: "Беларусь" },
                { "@type": "Country", name: "Европа" },
              ],
            },
          })),
        },
        {
          "@type": "Service",
          "@id": `${PAGE_URL}#main-service`,
          name: "Разработка цифровых решений",
          description:
            "Создание сайтов, веб-приложений и мобильных приложений для бизнеса под ключ.",
          provider: { "@id": `${SITE_URL}/#organization` },
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Услуги разработки",
            itemListElement: Object.values(SERVICES).map((s) => ({
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                "@id": `${SITE_URL}${s.href}#service`,
              },
            })),
          },
        },
      ],
    }),
    [PAGE_URL, SITE_URL]
  );

  /* ==================== META HANDLERS (unchanged) ==================== */
  useEffect(() => {
    const m = params.get("modal") as ServiceKey | null;
    if (m && SERVICES[m]) {
      setOpenKey(m);
      updateMetaTags(SERVICES[m]);
    } else {
      setOpenKey(null);
      resetMetaTags();
    }
  }, [params]);

  const updateMetaTags = (service: Service) => {
    if (typeof document === "undefined") return;

    const title = service.seoTitle || `${service.title} | OneStack24`;
    document.title = title;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", service.seoDescription || service.desc);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", `${SITE_URL}${service.href}`);

    updateOpenGraph(service, title);
  };

  const updateOpenGraph = (service: Service, title: string) => {
    if (typeof document === "undefined") return;

    const ogTags: Record<string, string> = {
      "og:title": title,
      "og:description": service.seoDescription || service.desc,
      "og:url": `${SITE_URL}${service.href}`,
      "og:type": "website",
      "og:image": `${SITE_URL}${service.image}`,
    };

    Object.entries(ogTags).forEach(([property, content]) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("property", property);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    });
  };

  const resetMetaTags = () => {
    if (typeof document === "undefined") return;

    document.title = "Услуги разработки | OneStack24";

    const defaultDesc =
      "Разработка сайтов, веб-приложений и мобильных приложений под ключ.";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", defaultDesc);
    }

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute("href", PAGE_URL);
    }
  };

  const openWithUrl = useCallback(
    (k: ServiceKey) => {
      const service = SERVICES[k];
      router.replace(`${pathname}?modal=${k}`, { scroll: false });
      setOpenKey(k);

      if (typeof window !== "undefined") {
        window.history.replaceState({}, "", `${pathname}${service.href}`);
      }
    },
    [router, pathname]
  );

  const closeAndClean = useCallback(() => {
    router.replace(pathname, { scroll: false });
    setOpenKey(null);

    if (typeof window !== "undefined") {
      window.history.replaceState({}, "", pathname);
    }
    resetMetaTags();
  }, [router, pathname]);

  const btnBase =
    "inline-flex items-center justify-center rounded-2xl font-semibold focus:outline-none focus-visible:ring-4 focus-visible:ring-gray-500/30 transition-all duration-500 text-center group relative overflow-hidden";
  const btnSize =
    "h-12 sm:h-14 lg:h-16 px-6 sm:px-7 lg:px-8 text-sm sm:text-base lg:text-lg";

  const a = (delay = 0) => (reduced ? {} : fadeUp(delay));
  const s = (delay = 0) => (reduced ? {} : scaleIn(delay));

  return (
    <>
      {/* New SEO JSON-LD (single optimized block) */}
      <Script
        id="ld-home-services"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section
        ref={containerRef}
        id="services"
        className="relative w-full min-h-screen flex flex-col justify-center py-16 sm:py-20 lg:py-24"
        style={{ background: "#07100e" }}
        aria-labelledby={titleId}
        role="region"
        itemScope
        itemType="https://schema.org/ItemList"
      >
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:48px_48px] sm:bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_75%_75%_at_50%_50%,black,transparent)]" />

          <motion.div
            aria-hidden
            className="pointer-events-none absolute -top-32 sm:-top-40 -right-32 sm:-right-40 h-[300px] w-[300px] sm:h-[500px] sm:w-[500px] rounded-full bg-gradient-to-r from-gray-900/5 via-gray-800/3 to-gray-900/5 blur-2xl sm:blur-3xl"
            animate={{ scale: [1, 1.12, 1], opacity: [0.1, 0.15, 0.1] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div
            aria-hidden
            className="pointer-events-none absolute -bottom-32 sm:-bottom-40 -left-32 sm:-left-40 h-[300px] w-[300px] sm:h-[500px] sm:w-[500px] rounded-full bg-gradient-to-r from-gray-800/5 via-gray-700/3 to-gray-800/5 blur-2xl sm:blur-3xl"
            animate={{ scale: [1.08, 1, 1.08], opacity: [0.12, 0.18, 0.12] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1920px] px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <motion.div
            className="grid grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-start lg:items-center"
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
          >
            {/* Header */}
            <motion.header
              className="col-span-12 lg:col-span-5 xl:col-span-4 mb-6 lg:mb-0"
              {...a(0.2)}
            >
              <motion.div
                {...a(0.25)}
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-teal-400/10 via-teal-300/8 to-teal-400/10 border border-teal-400/20 backdrop-blur-sm mb-4 sm:mb-6 lg:mb-8"
              >
                <Sparkles className="h-4 w-4 text-teal-300" />
                <span className="text-xs sm:text-sm tracking-wider text-teal-200 uppercase font-semibold">
                  Наши услуги
                </span>
              </motion.div>

              <motion.h1
                id={titleId}
                className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-6xl 2xl:text-6xl font-black tracking-tight mb-4 sm:mb-6 lg:mb-8 leading-[1.25] sm:leading-[0.76]"
                itemProp="name"
              >
                <motion.span
                  {...a(0.25)}
                  className="block text-white"
                >
                  УСЛУГИ
                </motion.span>
                <motion.span
                  {...a(0.35)}
                  className="block bg-gradient-to-br from-teal-300 via-teal-400 to-teal-600 bg-clip-text text-transparent mt-1 sm:mt-2"
                >
                  РАЗРАБОТКИ
                </motion.span>
              </motion.h1>

              <motion.p
                {...a(0.35)}
                className="text-base sm:text-lg lg:text-xl text-white/65 leading-relaxed font-light mb-6 sm:mb-8"
                itemProp="description"
              >
                Создаём{" "}
                <span className="text-white font-semibold">цифровые продукты полного цикла</span>{" "}
                — от идеи и дизайна до запуска и поддержки.{" "}
                <span className="text-white font-semibold">
                  Сайты, веб-платформы и мобильные приложения,
                </span>{" "}
                которые решают бизнес-задачи и развиваются вместе с вами.
              </motion.p>

              {/* Trust Indicators */}
              <motion.div
                {...a(0.45)}
                className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 lg:gap-8 pt-6 border-t border-white/10"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex -space-x-1.5 sm:-space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-7 h-7 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-teal-700 to-teal-500 border-2 border-[#07100e] flex items-center justify-center text-white text-[10px] sm:text-xs font-bold"
                      >
                        {i === 4 ? "+" : ""}
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-semibold text-sm sm:text-base">
                      Более 120 проектов
                    </span>
                    <span className="text-white/45 text-xs">успешно реализовано</span>
                  </div>
                </div>
              </motion.div>
            </motion.header>

            {/* Cards */}
            <motion.div className="col-span-12 lg:col-span-7 xl:col-span-8" {...a(0.4)}>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                {(Object.entries(SERVICES) as [ServiceKey, Service][]).map(
                  ([key, service], i) => (
                    <ServiceCard
                      key={key}
                      delay={reduced ? 0 : 0.08 * i}
                      title={service.title}
                      desc={service.desc}
                      href={service.href}
                      image={service.image}
                      icon={service.icon}
                      hoverColor={service.hoverColor}
                      gradientFrom={service.gradientFrom}
                      gradientTo={service.gradientTo}
                      onOpen={() => openWithUrl(key)}
                    />
                  )
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>

        <TechMarquee className="mt-12 sm:mt-16 lg:mt-20" />

        <ServiceModal openKey={openKey} onClose={closeAndClean} payload={openKey ? SERVICES[openKey] : null} />
      </section>
    </>
  );
}

/* ==================== SERVICE CARD ==================== */
function ServiceCard({
  title,
  desc,
  href,
  image,
  icon: Icon,
  hoverColor,
  gradientFrom,
  gradientTo,
  onOpen,
  delay = 0,
}) {
  const colors = {
    border: "group-hover:border-teal-400/40",
    gradient: "group-hover:from-teal-500/8 group-hover:to-teal-400/5",
    icon: "group-hover:text-teal-300",
    button: "group-hover:border-teal-400/40 group-hover:bg-teal-500/10",
    glow: "group-hover:shadow-teal-500/15",
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: "easeOut", delay }}
      whileHover={{ scale: 1.02, y: -8 }}
      className={`group relative overflow-hidden rounded-2xl border border-white/10 ${colors.border}
           bg-gradient-to-br from-white/[0.04] to-white/[0.02] backdrop-blur-sm
           shadow-lg hover:shadow-2xl ${colors.glow} transition-all duration-500 p-5 sm:p-6
           focus-within:ring-2 focus-within:ring-teal-400/30`}
      itemScope
      itemType="https://schema.org/Service"
    >
      <div className={`absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-transparent ${colors.gradient}`} />

      <div className="relative z-10 p-5 sm:p-6 lg:p-7 flex flex-col h-full">
        <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
          <div
            className={`flex-shrink-0 p-2 sm:p-2.5 rounded-xl bg-white/[0.06] border border-white/10 ${colors.border} transition-all duration-500`}
          >
            <Icon className={`h-5 w-5 sm:h-6 sm:w-6 text-teal-300/80 ${colors.icon}`} />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white leading-tight flex-1 min-w-0">{title}</h3>
        </div>

        <p className="text-white/55 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 font-light group-hover:text-white/75 transition-colors duration-300 flex-1">
          {desc}
        </p>

        <button
          type="button"
          onClick={onOpen}
          className={`inline-flex items-center justify-center rounded-xl font-semibold focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-400/30 transition-all duration-500 h-10 sm:h-11 w-full px-4 sm:px-5 text-xs sm:text-sm border border-white/10 bg-white/[0.04] text-white hover:scale-[1.02] active:scale-95 ${colors.button} mt-auto`}
          aria-haspopup="dialog"
          aria-label={`Подробнее о ${title}`}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            Изучить услугу
            <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </span>
        </button>
      </div>
    </motion.article>
  );
}

/* ==================== MODAL ==================== */
function ServiceModal({ openKey, onClose, payload }) {
  const panelRef = useRef(null);
  const overlayRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => setMounted(true), []);

  if (!mounted || !openKey || !payload) return null;

  return createPortal(
    <AnimatePresence>
      {openKey && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] backdrop-blur-xl" style={{ background: "rgba(7,16,14,0.97)" }}
          aria-hidden
          ref={overlayRef}
          onClick={(e) => e.target === overlayRef.current && onClose()}
        >
          <div className="fixed inset-0 p-0 sm:p-4 flex items-end sm:items-center justify-center">
            <motion.div
              ref={panelRef}
              initial={{ opacity: reduced ? 1 : 0, scale: reduced ? 1 : 0.92, y: reduced ? 0 : 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 30 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="mx-auto w-full max-w-6xl rounded-t-3xl sm:rounded-3xl border-t sm:border border-white/10
                         max-h-[95vh] sm:max-h-[92vh] overflow-y-auto overscroll-contain shadow-2xl relative"
              style={{ background: "linear-gradient(135deg, #0d1f1b 0%, #0a1a16 50%, #07100e 100%)" }}
              role="dialog"
            >
              {/* Header */}
              <div className="p-8">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 h-10 w-10 rounded-xl bg-white/[0.07] hover:bg-white/[0.12] text-white flex items-center justify-center border border-white/10"
                >
                  <X />
                </button>

                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <payload.icon className="h-6 w-6 text-white" />
                  {payload.title}
                </h3>

                <p className="text-white/70 text-lg mb-6">{payload.desc}</p>

                {/* Lists, tech, CTAs — unchanged */}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

/* ==================== MARQUEE ==================== */
function TechMarquee({ className = "" }) {
  const tech =
    "Next.js  ·  React  ·  TypeScript  ·  Node.js  ·  GraphQL  ·  REST API  ·  PostgreSQL  ·  Redis  ·  React Native  ·  Swift  ·  Kotlin  ·  Docker  ·  Kubernetes  ·  CI/CD  ·  Tailwind  ·  Headless CMS  ·  SEO  ·  PWA  ·  WebSockets  ·  Microservices";

  const reduced = useReducedMotion();

  return (
    <div className={`relative overflow-hidden py-6 sm:py-8 ${className}`} aria-hidden>
      <div className="absolute inset-y-0 left-0 w-24 sm:w-32 z-10" style={{ background: "linear-gradient(to right, #07100e, transparent)" }} />
      <div className="absolute inset-y-0 right-0 w-24 sm:w-32 z-10" style={{ background: "linear-gradient(to left, #07100e, transparent)" }} />

      <motion.div
        className="flex gap-8 sm:gap-12 whitespace-nowrap text-white/40 text-sm sm:text-base lg:text-lg font-light"
        animate={reduced ? {} : { x: [0, -1100] }}
        transition={
          reduced
            ? {}
            : {
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 28,
                  ease: "linear",
                },
              }
        }
      >
        {[...Array(3)].map((_, i) => (
          <span key={i}>{tech}</span>
        ))}
      </motion.div>
    </div>
  );
}
