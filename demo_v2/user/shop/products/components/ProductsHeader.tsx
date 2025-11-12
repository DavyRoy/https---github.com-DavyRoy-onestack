"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  LayoutGrid,
  List,
  X,
  Filter,
  SlidersHorizontal,
  Sparkles,
  ArrowUpDown,
  TrendingUp,
  Clock,
  Star,
  Zap,
  Target,
  Hash,
} from "lucide-react";
import {
  cn,
  CARD,
  BTN_PRIMARY,
  BTN_GHOST,
  CHIP,
  TAPPABLE,
  BADGE_NEUTRAL,
} from "./_shared";

export type ProductsHeaderProps = {
  search: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  view: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
  sort: string;
  onSortChange: (value: string) => void;
  shown: number;
  total: number;
  onFiltersToggle?: () => void;
  filtersCount?: number;
  loading?: boolean;
  className?: string;
  searchSuggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
  quickTags?: string[];
  onQuickTagClick?: (tag: string) => void;
};

export default function ProductsHeader({
  search,
  onSearchChange,
  onSearchSubmit,
  view,
  onViewChange,
  sort,
  onSortChange,
  shown,
  total,
  onFiltersToggle,
  filtersCount = 0,
  loading = false,
  className,
  searchSuggestions = [],
  onSuggestionClick,
  quickTags = [],
  onQuickTagClick,
}: ProductsHeaderProps) {
  const [localQuery, setLocalQuery] = useState(search);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeIdx, setActiveIdx] = useState<number>(-1);
  const [isAnimating, setIsAnimating] = useState(false);

  const liveRef = useRef<HTMLSpanElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);

  useEffect(() => setLocalQuery(search), [search]);

  const announce = (text: string) => {
    if (!liveRef.current) return;
    liveRef.current.textContent = text;
    setTimeout(() => {
      if (liveRef.current) liveRef.current.textContent = "";
    }, 600);
  };

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      if (isAnimating) return;
      
      setIsAnimating(true);
      const trimmedQuery = localQuery.trim();
      onSearchChange(trimmedQuery);
      onSearchSubmit();

      announce(
        trimmedQuery
          ? `Найдено ${shown} товаров по запросу «${trimmedQuery}»`
          : `Показано ${shown} из ${total} товаров`
      );
      
      await new Promise(resolve => setTimeout(resolve, 300));
      setIsAnimating(false);
    },
    [localQuery, onSearchChange, onSearchSubmit, shown, total, isAnimating]
  );

  const clearSearch = useCallback(() => {
    setLocalQuery("");
    onSearchChange("");
    onSearchSubmit();
    setActiveIdx(-1);
    searchInputRef.current?.focus();
    announce("Поисковый запрос очищен");
  }, [onSearchChange, onSearchSubmit]);

  const commitSuggestion = (value: string) => {
    setLocalQuery(value);
    onSearchChange(value);
    onSearchSubmit();
    setIsSearchFocused(false);
    setActiveIdx(-1);
    onSuggestionClick?.(value);
    announce(`Выбрана подсказка «${value}»`);
  };

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      commitSuggestion(suggestion);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onSearchChange, onSearchSubmit, onSuggestionClick]
  );

  const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isSearchFocused || searchSuggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((prev) =>
        prev < searchSuggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((prev) =>
        prev > 0 ? prev - 1 : searchSuggestions.length - 1
      );
    } else if (e.key === "Enter") {
      if (activeIdx >= 0 && activeIdx < searchSuggestions.length) {
        e.preventDefault();
        commitSuggestion(searchSuggestions[activeIdx]);
      }
    } else if (e.key === "Escape") {
      setIsSearchFocused(false);
      setActiveIdx(-1);
    }
  };

  const sortOptions = [
    { value: "popular", label: "Популярное", icon: TrendingUp },
    { value: "price_asc", label: "Сначала дешевле", icon: ArrowUpDown },
    { value: "price_desc", label: "Сначала дороже", icon: ArrowUpDown },
    { value: "new", label: "Новинки", icon: Sparkles },
    { value: "rating_desc", label: "Высокий рейтинг", icon: Star },
    { value: "name_asc", label: "По названию (А-Я)", icon: ArrowUpDown },
    { value: "name_desc", label: "По названию (Я-А)", icon: ArrowUpDown },
  ];

  const getSortIcon = (sortValue: string) => {
    const option = sortOptions.find((opt) => opt.value === sortValue);
    return option?.icon || ArrowUpDown;
  };

  const SortIcon = getSortIcon(sort);
  const listboxId = "search-suggestions";
  const activeId =
    activeIdx >= 0 ? `search-sugg-${activeIdx}` : undefined;

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        CARD,
        "relative flex flex-col gap-6 overflow-hidden px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10",
        "sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-80">
        <div className="absolute -left-24 top-0 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.28),transparent_65%)] blur-[110px]" />
        <div className="absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.22),transparent_65%)] blur-[110px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_70%)]" />
      </div>

      {/* Левая часть: Поиск и фильтры */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6 flex-1 min-w-0">
        {/* Поисковая форма с автодополнением */}
        <div className="relative flex-1 sm:max-w-md">
          <motion.form
            className="flex w-full items-center gap-2 rounded-2xl border border-white/15 bg-white/8 px-4 py-3 shadow-[0_25px_60px_-35px_rgba(56,189,248,0.45)] transition-all duration-300 focus-within:border-blue-400/40 focus-within:bg-white/12 focus-within:shadow-blue-500/25 backdrop-blur-xl"
            onSubmit={handleSubmit}
            role="search"
            aria-label="Поиск по товарам"
            whileFocus={{ scale: 1.02 }}
          >
            <motion.div
              animate={{ rotate: isSearchFocused ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Search className="h-4 w-4 text-white/60 flex-shrink-0" aria-hidden />
            </motion.div>
            <motion.input
              ref={searchInputRef}
              type="search"
              value={localQuery}
              onChange={(e) => {
                setLocalQuery(e.target.value);
                setActiveIdx(-1);
              }}
              onFocus={() => {
                setIsSearchFocused(true);
              }}
              onBlur={() => {
                setTimeout(() => setIsSearchFocused(false), 150);
              }}
              onKeyDown={onSearchKeyDown}
              placeholder="Искать товары по названию, бренду, артикулу…"
              className="flex-1 bg-transparent text-sm text-white placeholder:text-white/50 focus:outline-none min-w-0"
              aria-label="Искать товары"
              aria-describedby="search-hint"
              aria-controls={
                isSearchFocused && searchSuggestions.length > 0 ? listboxId : undefined
              }
              aria-activedescendant={activeId}
              autoComplete="off"
              spellCheck={false}
            />
            {localQuery && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={clearSearch}
                className={cn(
                  TAPPABLE,
                  "flex h-8 w-8 items-center justify-center rounded-full border border-white/18 bg-white/12 text-white/70",
                  "hover:bg-white/16 hover:text-white transition-all duration-200"
                )}
                aria-label="Очистить поиск"
                title="Очистить"
              >
                <X className="h-3 w-3" aria-hidden />
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className={cn(
                BTN_PRIMARY,
                "flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold",
                loading && "opacity-70 pointer-events-none"
              )}
              disabled={loading}
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="h-3 w-3 rounded-full border-2 border-white/30 border-t-white"
                  />
                  Поиск…
                </>
              ) : (
                <>
                  <Target className="h-4 w-4" />
                  Найти
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Подсказка поиска */}
          <p id="search-hint" className="sr-only">
            Введите название товара, бренд или артикул для поиска. Используйте стрелки для выбора подсказки, Enter — чтобы применить.
          </p>

          {/* Выпадающие подсказки */}
          <AnimatePresence>
            {isSearchFocused && searchSuggestions.length > 0 && (
              <motion.div
                ref={listboxRef}
                id={listboxId}
                role="listbox"
                className="absolute top-full left-0 right-0 z-20 mt-2 overflow-hidden rounded-2xl border border-white/15 bg-black/70 backdrop-blur-xl shadow-[0_30px_70px_-45px_rgba(56,189,248,0.6)]"
                aria-label="Подсказки поиска"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <div className="p-2">
                  {searchSuggestions.map((suggestion, index) => {
                    const selected = index === activeIdx;
                    return (
                      <motion.button
                        key={index}
                        id={`search-sugg-${index}`}
                        role="option"
                        aria-selected={selected}
                        type="button"
                        onMouseEnter={() => setActiveIdx(index)}
                        onMouseLeave={() => setActiveIdx(-1)}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm",
                          selected ? "bg-white/14 text-white" : "text-white/80",
                          "transition-all duration-200 hover:bg-white/12 hover:text-white",
                          "focus:outline-none focus:bg-white/12 focus:text-white"
                        )}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <motion.div
                          animate={{ scale: selected ? 1.1 : 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Clock className="h-4 w-4 text-white/50" aria-hidden />
                        </motion.div>
                        <span className="truncate">{suggestion}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Быстрые теги */}
        {quickTags.length > 0 && (
          <motion.div 
            className="hidden sm:flex flex-wrap gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-xs text-white/60 self-center">Популярное:</span>
            {quickTags.map((tag, index) => (
              <motion.button
                key={tag}
                onClick={() => onQuickTagClick?.(tag)}
                className={cn(
                  CHIP,
                  "rounded-full border-white/12 bg-white/8 px-3 py-1 text-xs text-white/70",
                  "transition-all duration-300 hover:bg-white/12 hover:text-white hover:border-white/18",
                  TAPPABLE
                )}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Hash className="h-3 w-3 mr-1" />
                {tag}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Кнопка фильтров для мобильных */}
        {onFiltersToggle && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onFiltersToggle}
            className={cn(
              BTN_GHOST,
              "sm:hidden rounded-xl border-2 border-white/12 bg-white/8 px-4 py-2.5 text-sm",
              "flex items-center gap-2 transition-all duration-300",
              "hover:bg-white/12 hover:border-white/18",
              filtersCount > 0 && "border-blue-400/40 bg-blue-500/20 text-blue-200 shadow-lg shadow-blue-500/20"
            )}
            aria-label={`Открыть фильтры${filtersCount > 0 ? ` (активно ${filtersCount})` : ""}`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Фильтры
            {filtersCount > 0 && (
              <motion.span 
                className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs font-medium text-white"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                {filtersCount}
              </motion.span>
            )}
          </motion.button>
        )}
      </div>

      {/* Правая часть: Управление видом и сортировка */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        {/* Переключение вида */}
        <motion.div
          role="group"
          aria-label="Режим отображения товаров"
          className="flex items-center gap-1 rounded-2xl border-2 border-white/12 bg-white/8 p-1.5 backdrop-blur-lg"
          whileHover={{ scale: 1.02 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => onViewChange("grid")}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-300",
              TAPPABLE,
              view === "grid"
                ? cn(
                    "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-white shadow-lg shadow-blue-500/20",
                    "border-2 border-blue-400/40 backdrop-blur-lg"
                  )
                : cn(
                    "text-white/70 hover:bg-white/10 hover:text-white/90", 
                    "border-2 border-transparent"
                  )
            )}
            aria-pressed={view === "grid"}
            title="Сетка"
          >
            <LayoutGrid className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Сетка</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => onViewChange("list")}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-300",
              TAPPABLE,
              view === "list"
                ? cn(
                    "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white shadow-lg shadow-purple-500/20",
                    "border-2 border-purple-400/40 backdrop-blur-lg"
                  )
                : cn(
                    "text-white/70 hover:bg-white/10 hover:text-white/90",
                    "border-2 border-transparent"
                  )
            )}
            aria-pressed={view === "list"}
            title="Список"
          >
            <List className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Список</span>
          </motion.button>
        </motion.div>

        {/* Сортировка */}
        <motion.div 
          className="relative"
          whileHover={{ scale: 1.02 }}
        >
          <motion.label
            className={cn(
              CHIP,
              "relative gap-2 rounded-xl border-2 border-white/12 bg-white/8 px-3 py-2.5 text-sm text-white/80",
              "transition-all duration-300 hover:bg-white/12 hover:border-white/18",
              "cursor-pointer backdrop-blur-lg"
            )}
            whileHover={{ scale: 1.02 }}
          >
            <SortIcon className="h-4 w-4 text-white/60" aria-hidden />
            <span className="sr-only" id="sort-label">
              Выберите сортировку товаров
            </span>
            <select
              aria-labelledby="sort-label"
              value={sort}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-transparent text-sm text-white focus:outline-none cursor-pointer appearance-none pr-6"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <motion.div
              animate={{ rotate: isSearchFocused ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ArrowUpDown
                className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-white/40"
                aria-hidden
              />
            </motion.div>
          </motion.label>
        </motion.div>

        {/* Статистика и кнопка фильтров для десктопа */}
        <div className="flex items-center gap-3">
          {/* Счетчик товаров */}
          <motion.div
            className={cn(
              CHIP,
              "rounded-xl border-2 border-white/12 bg-white/8 px-3 py-2.5 text-sm text-white/70",
              "backdrop-blur-lg hidden sm:flex items-center gap-2"
            )}
            whileHover={{ scale: 1.02 }}
          >
            <Zap className="h-3 w-3 text-yellow-400/80" />
            <span className="font-medium text-white/90">{shown}</span>
            <span className="text-white/50">из</span>
            <span className="font-medium text-white/90">
              {total.toLocaleString("ru-RU")}
            </span>
          </motion.div>

          {/* Кнопка фильтров для десктопа */}
          {onFiltersToggle && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onFiltersToggle}
              className={cn(
                BTN_GHOST,
                "hidden sm:flex rounded-xl border-2 border-white/12 bg-white/8 px-4 py-2.5 text-sm",
                "items-center gap-2 transition-all duration-300",
                "hover:bg-white/12 hover:border-white/18",
                filtersCount > 0 &&
                  cn(
                    "border-blue-400/40 bg-blue-500/20 text-blue-200",
                    "shadow-lg shadow-blue-500/20 backdrop-blur-lg"
                  )
              )}
              aria-label={`Открыть фильтры${filtersCount > 0 ? ` (активно ${filtersCount})` : ""}`}
            >
              <Filter className="h-4 w-4" />
              Фильтры
              {filtersCount > 0 && (
                <motion.span 
                  className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-500 text-xs font-medium text-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {filtersCount}
                </motion.span>
              )}
            </motion.button>
          )}
        </div>
      </div>

      {/* Мобильная статистика */}
      <motion.div 
        className="sm:hidden flex items-center justify-between pt-2 border-t border-white/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div
          className={cn(
            CHIP,
            "rounded-xl border-2 border-white/12 bg-white/8 px-3 py-1.5 text-xs text-white/70 flex items-center gap-2"
          )}
        >
          <Zap className="h-3 w-3 text-yellow-400/80" />
          <span className="font-medium text-white/90">{shown}</span>
          <span className="text-white/50 mx-1">из</span>
          <span className="font-medium text-white/90">
            {total.toLocaleString("ru-RU")}
          </span>
        </div>

        {filtersCount > 0 && (
          <motion.div
            className={cn(
              CHIP,
              "rounded-xl border-blue-400/40 bg-blue-500/20 px-3 py-1.5 text-xs text-blue-200"
            )}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            Активно: {filtersCount}
          </motion.div>
        )}
      </motion.div>

      {/* Live region для озвучивания результатов поиска */}
      <span ref={liveRef} className="sr-only" aria-live="polite" aria-atomic="true" />
    </motion.header>
  );
}

/* --------------------- Доп. компоненты --------------------- */

export function QuickSearchTags({
  tags,
  onTagClick,
  className,
}: {
  tags: string[];
  onTagClick: (tag: string) => void;
  className?: string;
}) {
  if (tags.length === 0) return null;

  return (
    <motion.div 
      className={cn("flex flex-wrap gap-2", className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.span 
        className="text-xs text-white/60 self-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Популярное:
      </motion.span>
      {tags.map((tag, index) => (
        <motion.button
          key={tag}
          onClick={() => onTagClick(tag)}
          className={cn(
            CHIP,
            "rounded-full border-2 border-white/12 bg-white/8 px-3 py-1 text-xs text-white/70",
            "transition-all duration-300 hover:bg-white/12 hover:text-white hover:border-white/18",
            TAPPABLE
          )}
          whileHover={{ scale: 1.05, y: -1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0.8, x: -10 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ delay: 0.1 + index * 0.05 }}
        >
          <Hash className="h-3 w-3 mr-1" />
          {tag}
        </motion.button>
      ))}
    </motion.div>
  );
}

export function SearchResultsSummary({
  query,
  resultsCount,
  totalCount,
  searchTime,
  className,
}: {
  query: string;
  resultsCount: number;
  totalCount: number;
  searchTime?: number;
  className?: string;
}) {
  if (!query) return null;

  return (
    <motion.div 
      className={cn("flex flex-wrap items-center gap-3 text-sm text-white/70", className)}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        Найдено{" "}
        <strong className="text-white">
          {resultsCount.toLocaleString("ru-RU")}
        </strong>{" "}
        товаров{query && (
          <>
            {" "}
            по запросу <strong className="text-white">«{query}»</strong>
          </>
        )}
      </motion.p>

      {typeof searchTime === "number" && (
        <motion.div 
          className={cn(CHIP, "border-2 border-white/12 bg-white/8 px-2 py-1 text-xs")}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <Clock className="h-3 w-3 mr-1 inline" />
          {searchTime.toFixed(2)} сек
        </motion.div>
      )}

      {resultsCount < totalCount && (
        <motion.p 
          className="text-xs text-white/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          из {totalCount.toLocaleString("ru-RU")} всего
        </motion.p>
      )}
    </motion.div>
  );
}
