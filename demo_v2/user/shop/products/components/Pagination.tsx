"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, MoreHorizontal, Sparkles } from "lucide-react";
import { cn, BTN_GHOST, BTN_PRIMARY, TAPPABLE, CHIP } from "./_shared";

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange: (page: number) => void;
  variant?: "default" | "compact" | "minimal" | "cards";
  showInfo?: boolean;
  showEdgeButtons?: boolean;
  maxVisiblePages?: number;
  className?: string;
  loading?: boolean;
};

function getPaginationPages(current: number, total: number, rawMaxVisible: number = 5) {
  const maxVisible = Math.max(5, rawMaxVisible | 0);
  const cur = Math.min(Math.max(current, 1), total || 1);

  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | string)[] = [];
  const delta = Math.floor(maxVisible / 2);

  let start = Math.max(2, cur - delta);
  let end = Math.min(total - 1, cur + delta);

  if (cur - delta < 2) end = Math.min(total - 1, maxVisible - 1);
  if (cur + delta > total - 1) start = Math.max(2, total - maxVisible + 2);

  pages.push(1);
  if (start > 2) pages.push("…");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push("…");
  if (total > 1) pages.push(total);

  return pages;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage = 20,
  onPageChange,
  variant = "default",
  showInfo = true,
  showEdgeButtons = true,
  maxVisiblePages = 7,
  className,
  loading = false,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = useMemo(
    () => getPaginationPages(currentPage, totalPages, maxVisiblePages),
    [currentPage, totalPages, maxVisiblePages]
  );

  const [isAnimating, setIsAnimating] = useState(false);

  const go = useCallback(
    async (p: number) => {
      if (isAnimating) return;
      
      const next = Math.min(Math.max(p, 1), totalPages);
      if (next !== currentPage) {
        setIsAnimating(true);
        await new Promise(resolve => setTimeout(resolve, 150));
        onPageChange(next);
        setIsAnimating(false);
      }
    },
    [currentPage, totalPages, onPageChange, isAnimating]
  );

  const getPageInfo = () => {
    if (!totalItems) return null;
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    return `Показано ${startItem}-${endItem} из ${totalItems.toLocaleString("ru-RU")}`;
  };

  const baseBtnClass = cn(
    "inline-flex items-center justify-center font-medium transition-all duration-300",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black/60",
    "disabled:pointer-events-none disabled:opacity-30",
    "backdrop-blur-sm"
  );

  const btnGhost = cn(
    baseBtnClass,
    BTN_GHOST,
    "h-10 w-10 rounded-2xl border-white/15 bg-white/8 text-white/70",
    "hover:bg-white/15 hover:text-white hover:border-white/25 hover:shadow-lg hover:shadow-black/20",
    "active:scale-95",
    TAPPABLE
  );

  const btnSolid = cn(
    baseBtnClass, 
    BTN_PRIMARY, 
    "h-10 w-10 rounded-2xl font-semibold shadow-lg",
    "bg-gradient-to-r from-blue-500 to-cyan-500 border-blue-400/30",
    "hover:from-blue-600 hover:to-cyan-600 hover:shadow-blue-500/25",
    "active:scale-95"
  );

  const btnCompact = cn(
    baseBtnClass,
    BTN_GHOST,
    "h-8 w-8 rounded-xl border-white/12 bg-white/6 text-white/60 text-xs",
    "hover:bg-white/12 hover:text-white hover:border-white/18",
    "active:scale-95"
  );

  const btnCards = cn(
    baseBtnClass,
    "h-12 px-4 rounded-2xl border border-white/15 bg-white/8 text-white/70 font-medium",
    "hover:bg-white/15 hover:text-white hover:border-white/25 hover:shadow-xl",
    "active:scale-95 transition-all duration-300",
    "backdrop-blur-md"
  );

  const isCompact = variant === "compact";
  const isMinimal = variant === "minimal";
  const isCards = variant === "cards";

  const onKeyNav = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.defaultPrevented || isAnimating) return;
    switch (e.key) {
      case "ArrowLeft":
      case "PageUp":
        e.preventDefault();
        go(currentPage - 1);
        break;
      case "ArrowRight":
      case "PageDown":
        e.preventDefault();
        go(currentPage + 1);
        break;
      case "Home":
        e.preventDefault();
        go(1);
        break;
      case "End":
        e.preventDefault();
        go(totalPages);
        break;
    }
  };

  // Cards вариант - для карточных интерфейсов
  if (isCards) {
    return (
      <motion.nav
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("flex items-center justify-between gap-4", className)}
        aria-label="Навигация по страницам"
        onKeyDown={onKeyNav}
      >
        <motion.button
          whileHover={{ scale: 1.02, x: -2 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => go(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className={cn(btnCards, "flex items-center gap-2")}
          aria-label="Предыдущая страница"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
          Назад
        </motion.button>

        <div className="flex items-center gap-3">
          <div
            className={cn(
              CHIP,
              "border-white/15 bg-white/10 px-3 py-2 text-sm font-medium text-white/70 backdrop-blur-md"
            )}
          >
            Страница <span className="text-white/90 font-semibold">{currentPage}</span> из {totalPages}
          </div>
          
          {showInfo && getPageInfo() && (
            <div className="hidden sm:block text-sm text-white/60">
              {getPageInfo()}
            </div>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.02, x: 2 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => go(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className={cn(btnCards, "flex items-center gap-2")}
          aria-label="Следующая страница"
        >
          Далее
          <ChevronRight className="h-4 w-4" aria-hidden />
        </motion.button>
      </motion.nav>
    );
  }

  // Минимальный вариант - только стрелки
  if (isMinimal) {
    return (
      <motion.nav
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn("flex items-center gap-2", className)}
        aria-label="Навигация по страницам"
        onKeyDown={onKeyNav}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={() => go(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className={cn(btnGhost, "h-9 w-9")}
          aria-label="Предыдущая страница"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
        </motion.button>

        <div className={cn(
          CHIP, 
          "h-9 min-w-[64px] bg-white/10 border-white/15 text-white/70 text-sm",
          "flex items-center justify-center backdrop-blur-md font-medium"
        )}>
          {currentPage}<span className="text-white/40 mx-0.5">/</span>{totalPages}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={() => go(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className={cn(btnGhost, "h-9 w-9")}
          aria-label="Следующая страница"
        >
          <ChevronRight className="h-4 w-4" aria-hidden />
        </motion.button>
      </motion.nav>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("space-y-4", className)}
    >
      {/* Анимированный фон */}
      <div className="absolute inset-0 -z-10 opacity-20">
        <div className="absolute -top-10 left-1/4 h-20 w-20 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 blur-2xl" />
        <div className="absolute -bottom-10 right-1/4 h-20 w-20 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-2xl" />
      </div>

      {/* Информация о странице */}
      {showInfo && (getPageInfo() || totalPages > 1) && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left"
        >
          {getPageInfo() && (
            <p className="text-sm text-white/60 font-medium flex items-center gap-2">
              <Sparkles className="h-3 w-3 text-blue-400/60" />
              {getPageInfo()}
            </p>
          )}

          {totalPages > 1 && (
            <div className={cn(
              CHIP, 
              "h-8 bg-white/10 border-white/15 text-white/70 text-xs",
              "flex items-center backdrop-blur-md px-3"
            )}>
              Страница {currentPage} из {totalPages}
            </div>
          )}
        </motion.div>
      )}

      {/* Навигация */}
      <motion.nav
        className={cn("flex flex-col items-center gap-4", isCompact && "gap-3")}
        aria-label="Навигация по страницам"
        onKeyDown={onKeyNav}
      >
        {/* Основные кнопки */}
        <motion.ul
          className={cn("flex flex-wrap items-center justify-center gap-2", isCompact && "gap-1")}
          role="list"
          layout
        >
          <AnimatePresence mode="popLayout">
            {/* Кнопки перехода в начало/конец */}
            {showEdgeButtons && !isCompact && (
              <>
                <motion.li layout key="first-page">
                  <motion.button
                    whileHover={{ scale: 1.05, x: -1 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => go(1)}
                    disabled={currentPage === 1 || loading}
                    className={btnGhost}
                    aria-label="Первая страница"
                    title="В начало"
                  >
                    <ChevronsLeft className="h-4 w-4" aria-hidden />
                  </motion.button>
                </motion.li>

                <motion.li layout key="prev-page">
                  <motion.button
                    whileHover={{ scale: 1.05, x: -1 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => go(currentPage - 1)}
                    disabled={currentPage === 1 || loading}
                    className={btnGhost}
                    aria-label="Предыдущая страница"
                    title="Назад"
                  >
                    <ChevronLeft className="h-4 w-4" aria-hidden />
                  </motion.button>
                </motion.li>
              </>
            )}

            {/* Страницы */}
            {pages.map((page, index) => {
              if (typeof page === "string") {
                return (
                  <motion.li 
                    key={`ellipsis-${index}`} 
                    layout
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    <span
                      className={cn(
                        "inline-flex items-center justify-center text-white/30 select-none",
                        isCompact ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm"
                      )}
                      role="separator"
                      aria-label="Пропущенные страницы"
                    >
                      <MoreHorizontal className={cn(isCompact ? "h-3 w-3" : "h-4 w-4")} />
                    </span>
                  </motion.li>
                );
              }

              const isCurrent = page === currentPage;
              return (
                <motion.li 
                  key={page} 
                  layout
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <motion.button
                    whileHover={!isCurrent ? { scale: 1.08, y: -1 } : {}}
                    whileTap={{ scale: 0.92 }}
                    type="button"
                    onClick={() => go(page)}
                    disabled={loading}
                    className={cn(
                      isCompact ? btnCompact : isCurrent ? btnSolid : btnGhost,
                      "transition-all duration-300 relative",
                      isCurrent && !isCompact && "shadow-blue-500/25",
                      loading && "pointer-events-none"
                    )}
                    aria-current={isCurrent ? "page" : undefined}
                    aria-label={isCurrent ? `Текущая страница ${page}` : `Страница ${page}`}
                    title={`Страница ${page}`}
                  >
                    {page}
                    {isCurrent && (
                      <motion.div
                        layoutId="paginationHighlight"
                        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 -z-10"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </motion.button>
                </motion.li>
              );
            })}

            {/* Кнопки перехода вперед/в конец */}
            {showEdgeButtons && !isCompact && (
              <>
                <motion.li layout key="next-page">
                  <motion.button
                    whileHover={{ scale: 1.05, x: 1 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => go(currentPage + 1)}
                    disabled={currentPage === totalPages || loading}
                    className={btnGhost}
                    aria-label="Следующая страница"
                    title="Вперёд"
                  >
                    <ChevronRight className="h-4 w-4" aria-hidden />
                  </motion.button>
                </motion.li>

                <motion.li layout key="last-page">
                  <motion.button
                    whileHover={{ scale: 1.05, x: 1 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => go(totalPages)}
                    disabled={currentPage === totalPages || loading}
                    className={btnGhost}
                    aria-label="Последняя страница"
                    title="В конец"
                  >
                    <ChevronsRight className="h-4 w-4" aria-hidden />
                  </motion.button>
                </motion.li>
              </>
            )}
          </AnimatePresence>
        </motion.ul>

        {/* Мобильный режим: "Показать ещё" для компактного варианта */}
        {isCompact && totalPages > 1 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 sm:hidden"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => go(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className={cn(
                BTN_GHOST,
                "h-8 px-3 rounded-xl text-xs font-medium",
                "border-white/12 bg-white/8 text-white/70",
                "hover:bg-white/12 hover:text-white",
                TAPPABLE
              )}
              aria-label="Предыдущая страница"
            >
              Назад
            </motion.button>

            <div
              className={cn(
                CHIP,
                "h-8 bg-white/10 border-white/15 text-white/70 text-xs flex items-center justify-center px-3"
              )}
            >
              {currentPage}/{totalPages}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => go(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              className={cn(
                BTN_GHOST,
                "h-8 px-3 rounded-xl text-xs font-medium",
                "border-white/12 bg-white/8 text-white/70",
                "hover:bg-white/12 hover:text-white",
                TAPPABLE
              )}
              aria-label="Следующая страница"
            >
              Вперёд
            </motion.button>
          </motion.div>
        )}

        {/* Десктопный компактный вариант с расширенной навигацией */}
        {isCompact && totalPages > 1 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="hidden sm:flex items-center gap-1"
          >
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button" 
              onClick={() => go(1)} 
              disabled={currentPage === 1 || loading} 
              className={btnCompact} 
              aria-label="Первая страница"
            >
              <ChevronsLeft className="h-3 w-3" aria-hidden />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button" 
              onClick={() => go(currentPage - 1)} 
              disabled={currentPage === 1 || loading} 
              className={btnCompact} 
              aria-label="Предыдущая страница"
            >
              <ChevronLeft className="h-3 w-3" aria-hidden />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button" 
              onClick={() => go(currentPage + 1)} 
              disabled={currentPage === totalPages || loading} 
              className={btnCompact} 
              aria-label="Следующая страница"
            >
              <ChevronRight className="h-3 w-3" aria-hidden />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button" 
              onClick={() => go(totalPages)} 
              disabled={currentPage === totalPages || loading} 
              className={btnCompact} 
              aria-label="Последняя страница"
            >
              <ChevronsRight className="h-3 w-3" aria-hidden />
            </motion.button>
          </motion.div>
        )}
      </motion.nav>

      {/* Live region для скринридеров */}
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {`Страница ${currentPage} из ${totalPages}`}
        {getPageInfo() && `, ${getPageInfo()}`}
      </span>

      {/* Индикатор загрузки */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center"
        >
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
              animate={{
                x: [-100, 100],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut"
              }}
            />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

/* -------------------- Hook -------------------- */

export function usePagination({
  totalItems,
  itemsPerPage = 20,
  initialPage = 1,
}: {
  totalItems: number;
  itemsPerPage?: number;
  initialPage?: number;
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const [currentPage, setCurrentPage] = useState(Math.min(initialPage, totalPages));

  const goToPage = useCallback((page: number) => {
    const validPage = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(validPage);
  }, [totalPages]);

  const nextPage = useCallback(() => goToPage(currentPage + 1), [currentPage, goToPage]);
  const prevPage = useCallback(() => goToPage(currentPage - 1), [currentPage, goToPage]);
  const firstPage = useCallback(() => goToPage(1), [goToPage]);
  const lastPage = useCallback(() => goToPage(totalPages), [totalPages, goToPage]);

  const range = useMemo(() => ({
    start: (currentPage - 1) * itemsPerPage,
    end: Math.min(currentPage * itemsPerPage, totalItems),
  }), [currentPage, itemsPerPage, totalItems]);

  return {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    range,
    actions: { goToPage, nextPage, prevPage, firstPage, lastPage },
  };
}
