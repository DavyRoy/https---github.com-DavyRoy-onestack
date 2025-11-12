"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { SlidersHorizontal, ChevronLeft, ChevronRight, Grid3X3 } from "lucide-react";
import ProductCard from "./ProductCard";
import type { ShopProduct } from "../data/mockUserShop";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn, CARD, BTN_GHOST, CHIP, TEXT_BALANCE } from "./_shared";

/* --------------------------- утилиты --------------------------- */

// Юникод-«слаг» для id (поддерживает кириллицу)
function toSafeId(input: string, fallback = "section") {
  const s = (input || "").trim().toLowerCase();
  if (!s) return fallback;
  // оставляем буквы/цифры любых алфавитов, заменяем остальное на «-»
  const id = s.normalize("NFKD").replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "");
  return id || fallback;
}

type Props = {
  title: string;
  products: ShopProduct[];
  onOpenFilters: () => void;
  filtersInline?: boolean;
  stickyToolbar?: boolean;
};

export default function ProductsGrid({
  title,
  products,
  onOpenFilters,
  stickyToolbar,
}: Props) {
  const reduced = useReducedMotion();

  // page state + sync c URL (?page=)
  const [page, setPage] = useState(1);
  const pageSize = 12; // комфортно для 3–4 колонок

  // читаем стартовую страницу из URL один раз
  useEffect(() => {
    const sp = new URLSearchParams(location.search);
    const p = Number(sp.get("page"));
    if (Number.isFinite(p) && p >= 1) setPage(p);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const total = products.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), pages);

  // обновляем URL без перезагрузки при смене страницы
  useEffect(() => {
    const sp = new URLSearchParams(location.search);
    if (safePage === 1) {
      sp.delete("page");
    } else {
      sp.set("page", String(safePage));
    }
    const next = `${location.pathname}${sp.toString() ? `?${sp.toString()}` : ""}${location.hash}`;
    history.replaceState(null, "", next);
  }, [safePage]);

  const from = (safePage - 1) * pageSize;
  const to = Math.min(from + pageSize, total);
  const list = useMemo(() => products.slice(from, to), [products, from, to]);

  // ref для «скролла к началу» при смене страницы
  const topRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!topRef.current) return;
    if (safePage > 1) {
      topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [safePage]);

  // клавиатура: ←/→, Home/End
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // игнор, если фокус в интерактиве
      const tag = (document.activeElement?.tagName || "").toLowerCase();
      if (["input", "textarea", "select", "button", "a"].includes(tag)) return;
      if (e.key === "ArrowRight") {
        setPage((p) => Math.min(pages, p + 1));
      } else if (e.key === "ArrowLeft") {
        setPage((p) => Math.max(1, p - 1));
      } else if (e.key.toLowerCase() === "home") {
        setPage(1);
      } else if (e.key.toLowerCase() === "end") {
        setPage(pages);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [pages]);

  const headingId = `products-grid-${toSafeId(title)}`;
  const listId = `${headingId}-list`;

  // Анимация для карточек (motion-safe)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: reduced ? {} : { staggerChildren: 0.05, delayChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: reduced ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: reduced ? { duration: 0.12 } : { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const goFirst = useCallback(() => setPage(1), []);
  const goPrev = useCallback(() => setPage((p) => Math.max(1, p - 1)), []);
  const goNext = useCallback(() => setPage((p) => Math.min(pages, p + 1)), [pages]);
  const goLast = useCallback(() => setPage(pages), [pages]);

  return (
    <motion.section
      ref={topRef}
      initial={reduced ? undefined : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduced ? 0.12 : 0.4 }}
      className={cn(
        CARD,
        "w-full px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10",
        stickyToolbar && "pb-16"
      )}
      aria-labelledby={headingId}
    >
      {/* Заголовок + фильтры */}
      <motion.div
        initial={reduced ? undefined : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduced ? 0.12 : 0.5 }}
        className={cn(
          "relative mb-8 flex flex-col gap-6 border-b border-white/12 pb-6",
          stickyToolbar &&
            "sticky top-20 z-30 -mx-5 -mt-5 rounded-3xl bg-black/60 px-5 py-5 backdrop-blur-xl sm:-mx-8 sm:-mt-8 sm:px-8 sm:py-6"
        )}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.28em] text-white/60">Каталог</span>
              <div className="h-px w-8 bg-white/30" />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h2
                id={headingId}
                className="text-2xl font-semibold tracking-tight text-white sm:text-3xl"
                title={title}
              >
                {title}
              </h2>

              <div className="flex items-center gap-3">
                <span className={cn(CHIP, "border-white/18 bg-white/10 text-white/70")}>
                  <Grid3X3 className="h-3.5 w-3.5" aria-hidden="true" />
                  {total.toLocaleString("ru-RU")} товаров
                </span>

                {pages > 1 ? (
                  <span className={cn(CHIP, "border-white/15 bg-white/8 text-white/60")}>
                    Страница {safePage} из {pages}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          {/* Кнопка фильтров на мобильных */}
          <motion.button
            whileHover={reduced ? undefined : { scale: 1.05 }}
            whileTap={reduced ? undefined : { scale: 0.95 }}
            type="button"
            onClick={onOpenFilters}
            className={cn(
              BTN_GHOST,
              "inline-flex items-center gap-3 rounded-2xl border-white/18 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur hover:border-white/28 hover:bg-white/14 lg:hidden"
            )}
            aria-label="Открыть фильтры каталога"
            aria-controls={listId}
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            Фильтры
          </motion.button>
        </div>

        {/* Информация о текущей странице */}
        {pages > 1 && (
          <motion.div
            initial={reduced ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduced ? 0 : 0.2 }}
            className="flex items-center gap-4 text-sm text-white/65"
          >
            <span aria-live="polite" aria-atomic="true">
              Показано{" "}
              <span className="font-semibold text-white">
                {total === 0 ? 0 : from + 1}-{to}
              </span>{" "}
              из {total}
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* Список карточек */}
      <AnimatePresence mode="wait">
        {list.length === 0 ? (
          <motion.div
            key="empty-state"
            initial={reduced ? undefined : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, scale: 0.96 }}
            className={cn(CARD, "mt-4 border-white/14 bg-black/55 p-10 text-center")}
            role="status"
            aria-live="polite"
          >
            <div className="mx-auto max-w-md space-y-4">
              <div className="text-6xl opacity-50">🎯</div>
              <h3 className="text-lg font-semibold text-white">Ничего не найдено</h3>
              <p className={cn(TEXT_BALANCE, "text-sm text-white/60")}>
                Попробуйте изменить параметры фильтрации или сбросить фильтры, чтобы увидеть больше результатов.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.ul
            id={listId}
            key={`page-${safePage}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            role="list"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6"
            aria-describedby={`${headingId}-desc`}
          >
            {list.map((p) => (
              <motion.li key={p.id} variants={itemVariants} role="listitem">
                <ProductCard p={p} />
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      {/* Пагинация */}
      {pages > 1 && (
        <motion.nav
          initial={reduced ? undefined : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduced ? 0 : 0.25 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-3"
          aria-label="Пагинация товаров"
        >
          {/* Первая страница */}
          <motion.button
            whileHover={reduced ? undefined : { scale: safePage !== 1 ? 1.05 : 1 }}
            whileTap={reduced ? undefined : { scale: safePage !== 1 ? 0.95 : 1 }}
            type="button"
            onClick={goFirst}
            disabled={safePage === 1}
            className={cn(
              BTN_GHOST,
              "inline-flex items-center gap-2 rounded-2xl border-white/18 bg-white/8 px-4 py-2.5 text-sm font-semibold text-white/80 hover:border-white/25 hover:bg-white/12 disabled:cursor-not-allowed disabled:opacity-30"
            )}
            aria-label="К первой странице"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:block">В начало</span>
          </motion.button>

          {/* Предыдущая страница */}
          <motion.button
            whileHover={reduced ? undefined : { scale: safePage !== 1 ? 1.05 : 1 }}
            whileTap={reduced ? undefined : { scale: safePage !== 1 ? 0.95 : 1 }}
            type="button"
            onClick={goPrev}
            disabled={safePage === 1}
            className={cn(
              BTN_GHOST,
              "inline-flex items-center gap-2 rounded-2xl border-white/18 bg-white/8 px-4 py-2.5 text-sm font-semibold text-white/80 hover:border-white/25 hover:bg-white/12 disabled:cursor-not-allowed disabled:opacity-30"
            )}
            aria-label="Предыдущая страница"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            <span>Назад</span>
          </motion.button>

          {/* Индикатор страницы */}
          <div className={cn(CHIP, "mx-2 border-white/18 bg-white/10 text-white/70")}>
            <span aria-live="polite" className="font-medium">
              {safePage} <span className="opacity-60">/ {pages}</span>
            </span>
          </div>

          {/* Следующая страница */}
          <motion.button
            whileHover={reduced ? undefined : { scale: safePage !== pages ? 1.05 : 1 }}
            whileTap={reduced ? undefined : { scale: safePage !== pages ? 0.95 : 1 }}
            type="button"
            onClick={goNext}
            disabled={safePage === pages}
            className={cn(
              BTN_GHOST,
              "inline-flex items-center gap-2 rounded-2xl border-white/18 bg-white/8 px-4 py-2.5 text-sm font-semibold text-white/80 hover:border-white/25 hover:bg-white/12 disabled:cursor-not-allowed disabled:opacity-30"
            )}
            aria-label="Следующая страница"
          >
            <span>Вперёд</span>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </motion.button>

          {/* Последняя страница */}
          <motion.button
            whileHover={reduced ? undefined : { scale: safePage !== pages ? 1.05 : 1 }}
            whileTap={reduced ? undefined : { scale: safePage !== pages ? 0.95 : 1 }}
            type="button"
            onClick={goLast}
            disabled={safePage === pages}
            className={cn(
              BTN_GHOST,
              "inline-flex items-center gap-2 rounded-2xl border-white/18 bg-white/8 px-4 py-2.5 text-sm font-semibold text-white/80 hover:border-white/25 hover:bg-white/12 disabled:cursor-not-allowed disabled:opacity-30"
            )}
            aria-label="К последней странице"
          >
            <span className="hidden sm:block">В конец</span>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </motion.button>
        </motion.nav>
      )}

      {/* Дополнительная информация для больших экранов */}
      {list.length > 0 && (
        <motion.div
          initial={reduced ? undefined : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduced ? 0 : 0.35 }}
          className="mt-8 text-center"
        >
          <p id={`${headingId}-desc`} className={cn(TEXT_BALANCE, "text-sm text-white/60")}>
            Адаптивная сетка от 1 до 6 колонок
            <span className="mx-3">•</span>
            Плавная навигация
            <span className="mx-3">•</span>
            Оптимизировано для всех устройств
          </p>
        </motion.div>
      )}
    </motion.section>
  );
}
