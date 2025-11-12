"use client";

import { ButtonHTMLAttributes, useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Scale, 
  Heart, 
  XCircle, 
  Download, 
  Share2, 
  Archive,
  Sparkles,
  Trash2,
  Copy,
  Check,
  Keyboard,
  Zap,
  Target,
  ArrowRight,
  Play,
  Command
} from "lucide-react";
import { 
  cn, 
  CARD, 
  BTN_PRIMARY, 
  BTN_GHOST, 
  TAPPABLE,
  CHIP
} from "./_shared";

export type ProductsToolbarProps = {
  selectedCount: number;
  onCompare: () => void;
  onFavorite: () => void;
  onClear: () => void;
  onExport?: () => void;
  onShare?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
  onCopy?: () => void;
  /** включить горячие клавиши: C — сравнить, F — избранное, Esc — очистить */
  hotkeys?: boolean;
  /** Показать подсказки по горячим клавишам */
  showHotkeyHints?: boolean;
  /** Позиция тулбара */
  position?: "sticky" | "static" | "floating";
  /** Дополнительная информация */
  totalCount?: number;
  shownCount?: number;
  searchTime?: number; // миллисекунды
  searchQuery?: string;
  /** Вариант оформления */
  variant?: "default" | "floating" | "minimal" | "glass";
};

function ToolbarButton({
  className,
  children,
  variant = "secondary",
  size = "md",
  disabled = false,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "success";
  size?: "sm" | "md" | "lg";
}) {
  const variantStyles = {
    primary: cn(
      BTN_PRIMARY,
      "rounded-2xl border-white/25 shadow-[0_25px_60px_-35px_rgba(56,189,248,0.65)]"
    ),
    secondary: cn(
      BTN_GHOST,
      "rounded-2xl border-white/16 bg-white/10 text-white/80 hover:border-white/22 hover:bg-white/14 hover:text-white"
    ),
    danger: cn(
      "rounded-2xl border border-rose-500/40 bg-rose-500/20 text-rose-100",
      "hover:border-rose-500/55 hover:bg-rose-500/25 hover:text-rose-50"
    ),
    ghost: cn(
      "rounded-2xl border border-transparent bg-transparent text-white/70",
      "hover:border-white/15 hover:bg-white/10 hover:text-white/90"
    ),
    success: cn(
      "rounded-2xl border border-emerald-500/35 bg-emerald-500/20 text-emerald-100",
      "hover:border-emerald-500/45 hover:bg-emerald-500/25 hover:text-emerald-50"
    )
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs gap-1.5 rounded-xl",
    md: "px-4 py-2 text-sm gap-2 rounded-xl",
    lg: "px-5 py-2.5 text-base gap-2.5 rounded-2xl"
  };

  return (
    <motion.button
      type="button"
      disabled={disabled}
      className={cn(
        "inline-flex items-center font-semibold transition-all duration-300",
        TAPPABLE,
        variantStyles[variant],
        sizeStyles[size],
        disabled && "opacity-50 pointer-events-none grayscale",
        className
      )}
      whileHover={{ scale: disabled ? 1 : 1.02, y: -1 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      {...rest}
    >
      {children}
    </motion.button>
  );
}

function pluralRu(n: number, forms: [string, string, string]) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1];
  return forms[2];
}

export default function ProductsToolbar({
  selectedCount,
  onCompare,
  onFavorite,
  onClear,
  onExport,
  onShare,
  onArchive,
  onDelete,
  onCopy,
  hotkeys = true,
  showHotkeyHints = true,
  position = "sticky",
  totalCount,
  shownCount,
  searchTime,
  searchQuery,
  variant = "default",
}: ProductsToolbarProps) {
  const [copied, setCopied] = useState(false);
  const [showHotkeys, setShowHotkeys] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const hasSelection = selectedCount > 0;

  // Анимация появления
  useEffect(() => {
    if (hasSelection && !isVisible) {
      setIsVisible(true);
    } else if (!hasSelection && isVisible) {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [hasSelection, isVisible]);

  // Горячие клавиши
  useEffect(() => {
    if (!hotkeys || !hasSelection) return;
    
    const onKey = (e: KeyboardEvent) => {
      if (e.target && (e.target as HTMLElement).tagName.match(/INPUT|TEXTAREA|SELECT/)) return;
      
      const k = e.key.toLowerCase();
      if (k === "c" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        onCompare();
      } else if (k === "f" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        onFavorite();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClear();
      } else if (k === "e" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        onExport?.();
      } else if (k === "d" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        onDelete?.();
      } else if (e.key === "?" || k === "/") {
        e.preventDefault();
        setShowHotkeys(prev => !prev);
      }
    };
    
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [hotkeys, hasSelection, onCompare, onFavorite, onClear, onExport, onDelete]);

  // Закрытие окна горячих клавиш по Esc
  useEffect(() => {
    if (!showHotkeys) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowHotkeys(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [showHotkeys]);

  const handleCopy = useCallback(() => {
    onCopy?.();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [onCopy]);

  const itemsLabel = `${selectedCount} ${pluralRu(selectedCount, ["товар", "товара", "товаров"])}`;

  const containerStyles = cn(
    CARD,
    "relative p-5 transition-all duration-500 shadow-[0_35px_80px_-55px_rgba(56,189,248,0.6)]",
    variant === "floating" && "rounded-3xl",
    variant === "glass" && "rounded-3xl",
    variant === "minimal" && "bg-transparent border-transparent shadow-none backdrop-blur-none",
    position === "sticky" && "sticky top-[4.5rem] z-40",
    position === "floating" && "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-2xl",
    "animate-in fade-in-0 zoom-in-95 duration-500"
  );

  if (!hasSelection && variant !== "minimal") return null;

  const hasTotals =
    typeof totalCount === "number" &&
    typeof shownCount === "number";

  return (
    <>
      {/* Основной тулбар */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            role="region"
            aria-label={`Панель действий: выбрано ${itemsLabel}`}
            className={containerStyles}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            {/* Анимированный фон */}
            <div className="pointer-events-none absolute inset-0 -z-10 rounded-3xl opacity-70">
              <div className="absolute -left-14 top-0 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.25),transparent_65%)] blur-[90px]" />
              <div className="absolute -right-18 bottom-0 h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.22),transparent_65%)] blur-[90px]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_70%)]" />
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Левая часть: информация о выборе */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <motion.div 
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <motion.div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-2xl",
                      "bg-gradient-to-br from-blue-500/20 to-purple-500/20",
                      "border-2 border-blue-400/30 text-blue-300 backdrop-blur-lg"
                    )}
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Sparkles className="h-5 w-5" />
                  </motion.div>
                  <div>
                    <p className="text-sm font-semibold text-white flex items-center gap-2">
                      <Target className="h-4 w-4 text-blue-400" />
                      Выбрано: <span className="text-blue-300">{itemsLabel}</span>
                    </p>
                    {hasTotals && (
                      <p className="text-xs text-white/60 flex items-center gap-2 mt-1">
                        <Zap className="h-3 w-3 text-yellow-400/80" />
                        Показано {shownCount!.toLocaleString('ru-RU')} из {totalCount!.toLocaleString('ru-RU')}
                        {typeof searchTime === "number" && (
                          <motion.span 
                            className={cn(CHIP, "bg-white/10 border-white/15 text-white/70")}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            {searchTime} мс
                          </motion.span>
                        )}
                      </p>
                    )}
                  </div>
                </motion.div>

                {/* Дополнительная информация */}
                {searchQuery && (
                  <motion.div 
                    className={cn(CHIP, "bg-white/10 border-2 border-white/15 text-white/70 text-xs backdrop-blur-lg")}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Поиск: "{searchQuery}"
                  </motion.div>
                )}
              </div>

              {/* Правая часть: действия */}
              <motion.div 
                className="flex flex-wrap gap-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                {/* Основные действия */}
                <div className="flex flex-wrap gap-2">
                  <ToolbarButton
                    onClick={onCompare}
                    aria-label={`Сравнить выбранные товары${showHotkeyHints ? " (C)" : ""}`}
                    title={`Сравнить${showHotkeyHints ? " (C)" : ""}`}
                    variant="primary"
                    size="md"
                  >
                    <Scale className="h-4 w-4" aria-hidden />
                    Сравнить
                    {showHotkeyHints && (
                      <motion.kbd 
                        className="ml-1 rounded bg-white/20 px-1.5 py-0.5 text-xs font-mono border border-white/10"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        C
                      </motion.kbd>
                    )}
                  </ToolbarButton>

                  <ToolbarButton
                    onClick={onFavorite}
                    aria-label={`Добавить в избранное${showHotkeyHints ? " (F)" : ""}`}
                    title={`В избранное${showHotkeyHints ? " (F)" : ""}`}
                    variant="secondary"
                    size="md"
                  >
                    <Heart className="h-4 w-4" aria-hidden />
                    В избранное
                    {showHotkeyHints && (
                      <motion.kbd 
                        className="ml-1 rounded bg-white/20 px-1.5 py-0.5 text-xs font-mono border border-white/10"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      >
                        F
                      </motion.kbd>
                    )}
                  </ToolbarButton>
                </div>

                {/* Дополнительные действия */}
                <div className="flex flex-wrap gap-2 border-l border-white/10 pl-2">
                  {onExport && (
                    <ToolbarButton
                      onClick={onExport}
                      aria-label={`Экспорт выбранных товаров${showHotkeyHints ? " (Ctrl+E)" : ""}`}
                      title={`Экспорт${showHotkeyHints ? " (Ctrl+E)" : ""}`}
                      variant="ghost"
                      size="sm"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Экспорт
                    </ToolbarButton>
                  )}

                  {onShare && (
                    <ToolbarButton
                      onClick={onShare}
                      aria-label="Поделиться выбранными товарами"
                      title="Поделиться"
                      variant="ghost"
                      size="sm"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                      Поделиться
                    </ToolbarButton>
                  )}

                  {onCopy && (
                    <ToolbarButton
                      onClick={handleCopy}
                      aria-label="Копировать информацию о товарах"
                      title="Копировать"
                      variant={copied ? "success" : "ghost"}
                      size="sm"
                    >
                      {copied ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      {copied ? "Скопировано" : "Копировать"}
                    </ToolbarButton>
                  )}

                  {onArchive && (
                    <ToolbarButton
                      onClick={onArchive}
                      aria-label="Архивировать выбранные товары"
                      title="Архивировать"
                      variant="ghost"
                      size="sm"
                    >
                      <Archive className="h-3.5 w-3.5" />
                      Архивировать
                    </ToolbarButton>
                  )}

                  {onDelete && (
                    <ToolbarButton
                      onClick={onDelete}
                      aria-label={`Удалить выбранные товары${showHotkeyHints ? " (Ctrl+D)" : ""}`}
                      title={`Удалить${showHotkeyHints ? " (Ctrl+D)" : ""}`}
                      variant="danger"
                      size="sm"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Удалить
                    </ToolbarButton>
                  )}
                </div>

                {/* Очистка выбора */}
                <ToolbarButton
                  onClick={onClear}
                  aria-label={`Очистить выбор${showHotkeyHints ? " (Esc)" : ""}`}
                  title={`Очистить выбор${showHotkeyHints ? " (Esc)" : ""}`}
                  variant="danger"
                  size="sm"
                >
                  <XCircle className="h-3.5 w-3.5" aria-hidden />
                  Очистить
                  {showHotkeyHints && (
                    <motion.kbd 
                      className="ml-1 rounded bg-white/20 px-1.5 py-0.5 text-xs font-mono border border-white/10"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      Esc
                    </motion.kbd>
                  )}
                </ToolbarButton>

                {/* Кнопка помощи по горячим клавишам */}
                {showHotkeyHints && (
                  <ToolbarButton
                    onClick={() => setShowHotkeys(true)}
                    variant="ghost"
                    size="sm"
                    className="text-white/50 hover:text-white/80"
                    aria-label="Показать горячие клавиши"
                    title="Горячие клавиши (?)"
                  >
                    <Keyboard className="h-3.5 w-3.5" />
                    <span className="sr-only">Горячие клавиши</span>
                  </ToolbarButton>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Диалог горячих клавиш */}
      <AnimatePresence>
        {showHotkeys && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xl p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Справка: горячие клавиши"
            onClick={() => setShowHotkeys(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={cn(CARD, "w-full max-w-md rounded-3xl border-white/18 bg-white/10 p-6 backdrop-blur-xl")}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Command className="h-5 w-5 text-blue-400" />
                  Горячие клавиши
                </h3>
                <motion.button
                  onClick={() => setShowHotkeys(false)}
                  className={cn(
                    BTN_GHOST,
                    "flex h-8 w-8 items-center justify-center rounded-xl border-white/15 bg-white/10 text-white/70 hover:border-white/22 hover:bg-white/14 hover:text-white"
                  )}
                  aria-label="Закрыть"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <XCircle className="h-4 w-4" />
                </motion.button>
              </div>
              
              <div className="space-y-3 text-sm">
                <motion.div 
                  className="flex justify-between items-center py-3 border-b border-white/10"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <span className="text-white/80 flex items-center gap-2">
                    <Scale className="h-4 w-4 text-blue-400" />
                    Сравнить товары
                  </span>
                  <kbd className="rounded bg-white/20 px-2 py-1.5 font-mono text-xs border border-white/10">C</kbd>
                </motion.div>
                <motion.div 
                  className="flex justify-between items-center py-3 border-b border-white/10"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <span className="text-white/80 flex items-center gap-2">
                    <Heart className="h-4 w-4 text-rose-400" />
                    В избранное
                  </span>
                  <kbd className="rounded bg-white/20 px-2 py-1.5 font-mono text-xs border border-white/10">F</kbd>
                </motion.div>
                <motion.div 
                  className="flex justify-between items-center py-3 border-b border-white/10"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="text-white/80 flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-rose-400" />
                    Очистить выбор
                  </span>
                  <kbd className="rounded bg-white/20 px-2 py-1.5 font-mono text-xs border border-white/10">Esc</kbd>
                </motion.div>
                {onExport && (
                  <motion.div 
                    className="flex justify-between items-center py-3 border-b border-white/10"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <span className="text-white/80 flex items-center gap-2">
                      <Download className="h-4 w-4 text-green-400" />
                      Экспорт
                    </span>
                    <kbd className="rounded bg-white/20 px-2 py-1.5 font-mono text-xs border border-white/10">Ctrl+E</kbd>
                  </motion.div>
                )}
                {onDelete && (
                  <motion.div 
                    className="flex justify-between items-center py-3 border-b border-white/10"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <span className="text-white/80 flex items-center gap-2">
                      <Trash2 className="h-4 w-4 text-rose-400" />
                      Удалить
                    </span>
                    <kbd className="rounded bg-white/20 px-2 py-1.5 font-mono text-xs border border-white/10">Ctrl+D</kbd>
                  </motion.div>
                )}
                <motion.div 
                  className="flex justify-between items-center py-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <span className="text-white/80 flex items-center gap-2">
                    <Keyboard className="h-4 w-4 text-purple-400" />
                    Показать справку
                  </span>
                  <kbd className="rounded bg-white/20 px-2 py-1.5 font-mono text-xs border border-white/10">?</kbd>
                </motion.div>
              </div>
              
              <motion.div 
                className="mt-6 p-4 rounded-2xl bg-white/5 border-2 border-white/10 backdrop-blur-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-xs text-white/60 text-center flex items-center justify-center gap-2">
                  <Sparkles className="h-3 w-3" />
                  Горячие клавиши работают, когда товары выбраны
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Дополнительный компонент для минимального тулбара
export function MinimalToolbar({
  selectedCount,
  onCompare,
  onFavorite,
  onClear,
  className
}: Pick<ProductsToolbarProps, 'selectedCount' | 'onCompare' | 'onFavorite' | 'onClear'> & {
  className?: string;
}) {
  const hasSelection = selectedCount > 0;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (hasSelection && !isVisible) {
      setIsVisible(true);
    } else if (!hasSelection && isVisible) {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [hasSelection, isVisible]);
  
  if (!isVisible) return null;

  return (
    <motion.div 
      className={cn(
        CARD_SOFT,
        "flex items-center gap-2 rounded-2xl border-white/15 bg-white/10 p-3 backdrop-blur-xl",
        className
      )}
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 10 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      <span className="text-xs font-medium text-white/80 px-2 flex items-center gap-2">
        <Target className="h-3 w-3 text-blue-400" />
        Выбрано: {selectedCount}
      </span>
      
      <div className="flex gap-1">
        <ToolbarButton
          onClick={onCompare}
          variant="ghost"
          size="sm"
          className="!px-2 !py-1"
          title="Сравнить"
        >
          <Scale className="h-3 w-3" />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={onFavorite}
          variant="ghost"
          size="sm"
          className="!px-2 !py-1"
          title="В избранное"
        >
          <Heart className="h-3 w-3" />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={onClear}
          variant="ghost"
          size="sm"
          className="!px-2 !py-1 text-white/50 hover:text-white/80"
          title="Очистить"
        >
          <XCircle className="h-3 w-3" />
        </ToolbarButton>
      </div>
    </motion.div>
  );
}
