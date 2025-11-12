"use client";

import Link from "next/link";
import { shopCategories } from "../data/mockUserShopCategories";
import { ArrowUpRight, ChevronRight, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { cn, CARD, CARD_SOFT, BTN_PRIMARY, CHIP, TEXT_BALANCE } from "./_shared";

/* --------------------------- Icon tokens (SVG) --------------------------- */

function CatIcon({
  token,
  className = "h-9 w-9",
}: {
  token?: "set" | "serum" | "candle" | "mask" | "scrub" | "gift" | "oil" | "tea";
  className?: string;
}) {
  const common = { fill: "currentColor", stroke: "currentColor", strokeWidth: 1.5 } as const;

  switch (token) {
    case "serum":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path {...common} fill="none" d="M10 3h4v3h-4z" />
          <path {...common} fill="none" d="M9 6h6v5a6 6 0 1 1-6 0z" />
          <path {...common} fill="none" d="M9 11h6" />
        </svg>
      );
    case "candle":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path {...common} d="M12 3c0 2-2 2.5-2 4a2 2 0 1 0 4 0c0-1.5-2-2-2-4Z" />
          <rect {...common} x="8" y="10" width="8" height="10" rx="2" fill="none" />
          <path {...common} d="M12 10v-2" />
        </svg>
      );
    case "mask":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path {...common} fill="none" d="M4 10c0-4 4-6 8-6s8 2 8 6v2c0 4-4 7-8 7s-8-3-8-7v-2Z" />
          <circle {...common} cx="9" cy="12" r="1" />
          <circle {...common} cx="15" cy="12" r="1" />
          <path {...common} d="M9 16c1.5 1 4.5 1 6 0" />
        </svg>
      );
    case "scrub":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <rect {...common} x="4" y="7" width="16" height="11" rx="2" fill="none" />
          <path {...common} d="M8 7V5a2 2 0 0 1 2-2h4" />
          <circle {...common} cx="9" cy="12" r="0.8" />
          <circle {...common} cx="12" cy="14" r="0.8" />
          <circle {...common} cx="15" cy="12" r="0.8" />
        </svg>
      );
    case "gift":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <rect {...common} x="3" y="8" width="18" height="12" rx="2" fill="none" />
          <path {...common} d="M12 8v12M3 12h18" />
          <path {...common} fill="none" d="M12 8c-2 0-5-.6-5-2.5S9 3 11 5c.7.7 1 3 1 3Z" />
          <path {...common} fill="none" d="M12 8c2 0 5-.6 5-2.5S15 3 13 5c-.7.7-1 3-1 3Z" />
        </svg>
      );
    case "oil":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path {...common} fill="none" d="M10 3h4l1 3-3 4-3-4 1-3Z" />
          <path {...common} fill="none" d="M6 14a6 6 0 1 0 12 0c0-2.5-3-5-6-5s-6 2.5-6 5Z" />
        </svg>
      );
    case "tea":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <rect {...common} x="4" y="7" width="12" height="10" rx="2" fill="none" />
          <path {...common} d="M16 9h2a3 3 0 0 1 0 6h-2" />
          <path {...common} d="M8 4c0 1 .8 1.2.8 2S8 7 8 7M11 4c0 1 .8 1.2.8 2S11 7 11 7" />
        </svg>
      );
    case "set":
    default:
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <rect {...common} x="3" y="7" width="8" height="10" rx="2" fill="none" />
          <rect {...common} x="13" y="4" width="8" height="13" rx="2" fill="none" />
          <path {...common} d="M6 7V5M16 4V2" />
        </svg>
      );
  }
}

/* --------------------------- Motion helpers --------------------------- */

export default function CategoryTiles() {
  const reduced = useReducedMotion();

  const fade = (i = 0) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.2 },
          transition: { delay: 0.05 + i * 0.045, duration: 0.45, ease: [0.16, 1, 0.3, 1] },
        };

  const pop = (i = 0) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, scale: 0.92, y: 12 },
          whileInView: { opacity: 1, scale: 1, y: 0 },
          viewport: { once: true, amount: 0.3 },
          transition: { delay: 0.1 + i * 0.05, duration: 0.35, ease: "easeOut" },
        };

  // Русская множественная форма: 1/2-4/5+
  const pluralRu = new Intl.PluralRules("ru-RU");
  const subcatWord = (n: number) => {
    const form = pluralRu.select(n);
    if (n === 0) return "Раздел";
    if (form === "one") return `${n} подкатегория`;
    if (form === "few") return `${n} подкатегории`;
    return `${n} подкатегорий`;
  };

  return (
    <section
      aria-labelledby="cats-title"
      className={cn(
        CARD,
        "relative w-full overflow-hidden px-5 py-6 sm:px-8 sm:py-10",
        "[@media(min-width:2560px)]:px-14 [@media(min-width:2560px)]:py-14"
      )}
    >
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-70">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.25),transparent_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.2),transparent_60%)]" />
      </div>
      {/* Заголовок секции */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
      >
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.28em] text-white/60">
              Каталог
            </span>
            <div className="h-px w-8 bg-white/30" aria-hidden="true" />
          </div>

          <div className="space-y-3">
            <h2 id="cats-title" className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Выберите раздел
            </h2>
            <p className={cn(TEXT_BALANCE, "max-w-2xl text-sm text-white/70 sm:text-base")}>
              Подборки для ключевых сценариев: от подарочных коллекций до ежедневного ухода.
              Интерфейс адаптирован от мобильных до ультрашироких экранов.
            </p>
          </div>
        </div>

        <motion.div
          whileHover={reduced ? undefined : { scale: 1.03 }}
          whileTap={reduced ? undefined : { scale: 0.97 }}
          transition={{ type: "spring", stiffness: 420, damping: 28 }}
        >
          <Link
            href="/demo/user/shop/products"
            prefetch={false}
            className={cn(
              BTN_PRIMARY,
              "group rounded-2xl border-white/25 bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-[0_25px_45px_-40px_rgba(94,234,212,0.8)] hover:bg-white/90"
            )}
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Все товары
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </motion.div>
      </motion.div>

      {/* Разделитель */}
      <div className="my-8 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      {/* Плитки категорий */}
      <ul
        role="list"
        aria-describedby="cats-hint"
        className="
          grid gap-6 sm:gap-8
          [grid-template-columns:repeat(auto-fit,minmax(min(340px,100%),1fr))]
          lg:grid-cols-2 xl:grid-cols-3
          [@media(min-width:2560px)]:grid-cols-4
          [@media(min-width:3840px)]:grid-cols-5
        "
      >
        {shopCategories.map((cat, i) => {
          const children = cat.children ?? [];
          const count = children.length;
          const countLabel = subcatWord(count);
          const topSubcats = children.slice(0, 4); // Первые 4 подкатегории для строки
          const allSubcats = children; // Все подкатегории для списка

          const cardId = `cat-${cat.id}-title`;
          const descId = `cat-${cat.id}-desc`;
          const srText = `${cat.name}. ${cat.description ?? ""} ${count ? `Подкатегорий: ${count}.` : ""}`.trim();

          return (
            <motion.li key={cat.id} {...fade(i)} role="listitem">
              <motion.article
                aria-labelledby={cardId}
                aria-describedby={cat.description ? descId : undefined}
                className={cn(
                  CARD_SOFT,
                  "group relative flex h-full cursor-pointer flex-col overflow-hidden border-white/14 bg-white/8 p-6 transition-all hover:border-white/25 hover:bg-white/12"
                )}
                whileHover={reduced ? undefined : { y: -4, scale: 1.02 }}
                whileTap={reduced ? undefined : { scale: 0.98 }}
              >
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
                  aria-hidden="true"
                />

                {/* 1. Иконка + название в одной строке */}
                <div className="relative z-10 mb-4 flex items-center gap-4">
                  <motion.span
                    aria-hidden="true"
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-white/20 bg-white/12 backdrop-blur"
                    whileHover={reduced ? undefined : { scale: 1.08, rotate: 4 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <CatIcon token={cat.icon} className="h-6 w-6 text-white" />
                  </motion.span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3
                        id={cardId}
                        className="text-lg font-semibold text-white transition-colors group-hover:text-white/90"
                        title={cat.name}
                      >
                        {cat.name}
                      </h3>
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + i * 0.05 }}
                        className="opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                        aria-hidden="true"
                      >
                        <ChevronRight className="h-5 w-5 text-white/60" />
                      </motion.div>
                    </div>
                    
                    {/* Счётчик подкатегорий */}
                    <div className="mt-1">
                      <span className={cn(CHIP, "border-white/14 bg-white/10 text-[11px] text-white/65")}>
                        {countLabel}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. 4 подкатегории в строку (только если есть подкатегории) */}
                {topSubcats.length > 0 && (
                  <motion.div 
                    {...pop(i + 0.3)}
                    className="relative z-10 mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4"
                  >
                    {topSubcats.map((ch, chipIndex) => (
                      <motion.span
                        key={ch.id}
                        initial={reduced ? undefined : { opacity: 0, scale: 0.9 }}
                        whileInView={reduced ? undefined : { opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.25 + i * 0.05 + chipIndex * 0.1 }}
                        className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/8 px-2 py-1.5 text-xs text-white/70 transition-colors hover:border-white/25 hover:bg-white/12 hover:text-white/90 text-center leading-tight"
                        title={ch.name}
                        aria-label={`Подкатегория: ${ch.name}`}
                      >
                        {ch.name}
                      </motion.span>
                    ))}
                  </motion.div>
                )}

                {/* 3. Описание категории */}
                {cat.description && (
                  <motion.p 
                    {...pop(i + 0.5)}
                    id={descId}
                    className="relative z-10 mb-4 text-sm leading-relaxed text-white/70 line-clamp-3"
                  >
                    {cat.description}
                  </motion.p>
                )}

                {/* 4. Список всех подкатегорий (если есть) */}
                {allSubcats.length > 0 && (
                  <motion.div 
                    {...pop(i + 0.7)}
                    className="relative z-10 mt-auto space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-white/60">Все подкатегории:</span>
                      {count > 4 && (
                        <span className="text-xs text-white/40">+{count - 4} еще</span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-1">
                      {allSubcats.slice(0, 6).map((ch, subIndex) => (
                        <motion.div
                          key={ch.id}
                          initial={reduced ? undefined : { opacity: 0, x: -5 }}
                          whileInView={reduced ? undefined : { opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + i * 0.05 + subIndex * 0.08 }}
                        className="flex items-center gap-2 text-xs text-white/60 transition-colors hover:text-white/80"
                        >
                          <div className="h-1 w-1 rounded-full bg-white/40" aria-hidden="true" />
                          <span className="truncate">{ch.name}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Ссылка на всю карточку (доступный фокус) */}
                <Link
                  href={`/demo/user/shop?category=${cat.id}`}
                  prefetch={false}
                  aria-label={srText}
                  className="absolute inset-0 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--bg))]"
                />
              </motion.article>
            </motion.li>
          );
        })}
      </ul>

      {/* Подсказка для читателей экрана и подпись под сеткой */}
      <p id="cats-hint" className="sr-only">
        Нажмите, чтобы открыть категорию и посмотреть товары и подкатегории.
      </p>

      {/* Дополнительная информация для больших экранов */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        viewport={{ once: true }}
        className="mt-8 text-center [@media(min-width:2560px)]:mt-10"
      >
        <p className="text-sm text-white/60">
          {shopCategories.length} основных категорий
          <span className="mx-3">•</span>
          Полная адаптивность
          <span className="mx-3">•</span>
          Быстрая навигация
        </p>
      </motion.div>
    </section>
  );
}
