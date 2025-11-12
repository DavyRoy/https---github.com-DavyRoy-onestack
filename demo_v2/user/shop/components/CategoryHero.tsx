"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  ChevronRight as CaretRight,
  Layers,
  ArrowRight,
} from "lucide-react";
import { getCategoryPathById, getChildrenOf } from "../data/mockUserShopCategories";
import {
  cn,
  CARD,
  CHIP,
  BTN_GHOST,
  BTN_PRIMARY,
  TEXT_BALANCE,
} from "./_shared";

type CategoryHeroProps = {
  categoryId: string;
};

export default function CategoryHero({ categoryId }: CategoryHeroProps) {
  const path = useMemo(() => getCategoryPathById(categoryId) ?? [], [categoryId]);
  const leafs = getChildrenOf(categoryId);
  const current = path.at(-1);
  const reduced = useReducedMotion();

  const fadeVariants: Variants = reduced
    ? {}
    : {
        hidden: { opacity: 0, y: 16 },
        show: (i = 0) => ({
          opacity: 1,
          y: 0,
          transition: {
            delay: i,
            duration: 0.45,
            ease: [0.16, 1, 0.3, 1],
          },
        }),
      };

  const popVariants: Variants = reduced
    ? {}
    : {
        hidden: { opacity: 0, scale: 0.92 },
        show: (i = 0) => ({
          opacity: 1,
          scale: 1,
          transition: { delay: i, duration: 0.35, ease: "easeOut" },
        }),
      };

  const subcatsCount = leafs.length;
  const hasSubcats = subcatsCount > 0;

  const railRef = useRef<HTMLDivElement | null>(null);
  const [canScroll, setCanScroll] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateScrollState = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const { scrollLeft, scrollWidth, clientWidth } = rail;
    setCanScroll(scrollWidth > clientWidth + 4);
    setAtStart(scrollLeft <= 4);
    setAtEnd(scrollLeft + clientWidth >= scrollWidth - 4);
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const onScroll = () => updateScrollState();
    const onResize = () => updateScrollState();

    updateScrollState();
    rail.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(onResize);
    ro.observe(rail);
    window.addEventListener("resize", onResize);

    return () => {
      rail.removeEventListener("scroll", onScroll);
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [leafs, updateScrollState]);

  const scrollByAmount = useCallback(
    (dir: "left" | "right") => {
      const rail = railRef.current;
      if (!rail) return;

      const delta =
        dir === "left"
          ? -Math.ceil(rail.clientWidth * 0.85)
          : Math.ceil(rail.clientWidth * 0.85);
      rail.scrollBy({ left: delta, behavior: reduced ? "auto" : "smooth" });
    },
    [reduced]
  );

  const crumbs = useMemo(
    () => [{ id: "root", name: "Каталог" }, ...path],
    [path]
  );

  if (!current) return null;

  return (
    <motion.header
      variants={fadeVariants}
      initial="hidden"
      animate="show"
      custom={0}
      aria-labelledby="category-title"
      role="banner"
      className={cn(
        CARD,
        "relative overflow-hidden px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10",
        "[@media(min-width:2560px)]:px-16 [@media(min-width:2560px)]:py-16"
      )}
    >
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-80">
        <div className="absolute -left-24 top-5 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.28),transparent_70%)] blur-[120px]" />
        <div className="absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.22),transparent_70%)] blur-[120px]" />
        <div className="absolute left-1/3 top-1/2 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.18),transparent_70%)] blur-[80px]" />
      </div>

      <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-8">
        <motion.nav
          variants={fadeVariants}
          custom={0.05}
          aria-label="Хлебные крошки"
          className="flex flex-wrap items-center gap-1.5 text-xs text-white/60 sm:gap-2 sm:text-sm"
        >
          <ol className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {crumbs.map((crumb, index) => {
              const isLast = index === crumbs.length - 1;
              const href =
                crumb.id === "root"
                  ? "/demo/user/shop"
                  : `/demo/user/shop?category=${crumb.id}`;

              return (
                <li key={crumb.id} className="flex min-w-0 items-center gap-1.5 sm:gap-2">
                  {index > 0 && (
                    <ChevronRight
                      className="h-3.5 w-3.5 flex-shrink-0 opacity-60 sm:h-4 sm:w-4"
                      aria-hidden="true"
                    />
                  )}
                  {isLast ? (
                    <span
                      aria-current="page"
                      className="truncate font-medium text-white/90"
                    >
                      {crumb.name}
                    </span>
                  ) : (
                    <Link
                      href={href}
                      className="truncate transition-colors duration-200 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
                    >
                      {crumb.name}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </motion.nav>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end lg:gap-10">
          <div className="space-y-5">
            <motion.div
              variants={fadeVariants}
              custom={0.1}
              className="flex flex-wrap items-center gap-3"
            >
              <span className={cn(CHIP, "border-white/18 bg-white/10 text-white/70")}>
                <Layers className="h-4 w-4" aria-hidden="true" />
                Категория
              </span>
              {hasSubcats ? (
                <span className={cn(CHIP, "border-white/12 bg-white/8 text-white/60")}>
                  {subcatsCount} подкатегорий
                </span>
              ) : null}
            </motion.div>

            <motion.div
              variants={fadeVariants}
              custom={0.2}
              className="space-y-3"
            >
              <h1
                id="category-title"
                className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl"
              >
                {current.name}
              </h1>
              {current.description ? (
                <p className={cn(TEXT_BALANCE, "max-w-2xl text-sm text-white/65 sm:text-base")}>
                  {current.description}
                </p>
              ) : null}
            </motion.div>

            <motion.div
              variants={fadeVariants}
              custom={0.3}
              className="flex flex-wrap items-center gap-3 text-xs text-white/60 sm:text-sm"
            >
              <span className="inline-flex items-center gap-2">
                <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-400/80" />
                Активный раздел
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-blue-400/80" />
                {path.length} уровень вложенности
              </span>
            </motion.div>
          </div>

          <motion.div
            variants={fadeVariants}
            custom={0.35}
            className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-4"
          >
            <Link
              href="/demo/user/shop"
              className={cn(
                BTN_GHOST,
                "w-full justify-center rounded-2xl border-white/20 bg-white/8 px-5 py-3 text-sm font-semibold text-white/80 hover:border-white/30 hover:bg-white/12 hover:text-white sm:w-auto"
              )}
            >
              Вернуться к каталогу
            </Link>
            <Link
              href="/demo/user/shop/products"
              className={cn(
                BTN_PRIMARY,
                "w-full justify-center rounded-2xl border-white/25 px-6 py-3 text-sm font-semibold sm:w-auto"
              )}
            >
              Смотреть товары
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>

        {hasSubcats ? (
          <motion.section
            variants={fadeVariants}
            custom={0.45}
            className="relative mt-4 border-t border-white/10 pt-5 sm:mt-8 sm:pt-6"
            aria-label="Подкатегории"
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm text-white/65">
              <h2 className="text-base font-semibold text-white/90 sm:text-lg">
                Подкатегории
              </h2>
              <span aria-live="polite">{subcatsCount} элементов</span>
            </div>

            {canScroll ? (
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-black/60 to-transparent sm:hidden" />
            ) : null}
            {canScroll ? (
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-black/60 to-transparent sm:hidden" />
            ) : null}

            {canScroll ? (
              <div className="absolute -top-11 right-0 hidden gap-2 sm:flex">
                <button
                  type="button"
                  onClick={() => scrollByAmount("left")}
                  disabled={atStart}
                  className={cn(
                    BTN_GHOST,
                    "h-10 w-10 rounded-full border-white/20 bg-white/10 text-white/75 hover:border-white/30 hover:bg-white/15 disabled:opacity-40"
                  )}
                  aria-label="Прокрутить влево"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollByAmount("right")}
                  disabled={atEnd}
                  className={cn(
                    BTN_GHOST,
                    "h-10 w-10 rounded-full border-white/20 bg-white/10 text-white/75 hover:border-white/30 hover:bg-white/15 disabled:opacity-40"
                  )}
                  aria-label="Прокрутить вправо"
                >
                  <CaretRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            ) : null}

            <div
              ref={railRef}
              className="scrollbar-hide -mx-1 flex snap-x snap-mandatory gap-2 overflow-x-auto px-1 sm:mx-0 sm:flex-wrap sm:gap-3 sm:overflow-visible [@media(min-width:2560px)]:gap-4"
              role="list"
            >
              <span className="w-2 shrink-0 sm:hidden" aria-hidden="true" />
              {leafs.map((leaf, index) => (
                <motion.li
                  key={leaf.id}
                  variants={popVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.2 }}
                  custom={0.08 + index * 0.04}
                  className="shrink-0 snap-start sm:shrink"
                  role="listitem"
                >
                  <Link
                    href={`/demo/user/shop?category=${leaf.id}`}
                    className="group relative inline-flex min-w-[110px] items-center justify-center rounded-2xl border border-white/18 bg-white/6 px-4 py-2.5 text-xs font-semibold text-white/80 transition-all hover:border-white/30 hover:bg-white/12 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40 sm:min-w-[140px] sm:px-5 sm:py-3 sm:text-sm"
                  >
                    <span className="relative z-10 line-clamp-1 text-center">{leaf.name}</span>
                    <span className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </motion.li>
              ))}
              <span className="w-2 shrink-0 sm:hidden" aria-hidden="true" />
            </div>

            {canScroll ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 text-center text-[11px] text-white/50 sm:hidden"
              >
                Свайпните для просмотра
              </motion.p>
            ) : null}
          </motion.section>
        ) : null}
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }
      `}</style>
    </motion.header>
  );
}
