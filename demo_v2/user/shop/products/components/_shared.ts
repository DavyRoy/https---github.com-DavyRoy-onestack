// src/app/demo/user/dashboard/components/_shared.tsx
import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Утилита для объединения классов с поддержкой Tailwind CSS
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* =========================================================================
   Базовые константы
   ========================================================================= */

export const TRANSITIONS = {
  fast: "duration-200 ease-out",
  normal: "duration-300 ease-out",
  slow: "duration-500 ease-out",
} as const;

export const SHADOWS = {
  soft: "shadow-[0_8px_40px_-12px_rgba(0,0,0,0.25)]",
  medium: "shadow-[0_20px_60px_-40px_rgba(0,0,0,0.3)]",
  large: "shadow-[0_40px_80px_-60px_rgba(0,0,0,0.4)]",
  glow: "shadow-[0_0_60px_-20px_rgba(96,165,250,0.3)]",
} as const;

/* =========================================================================
   Карточки и контейнеры
   ========================================================================= */

/**
 * Базовые стили карточек с градиентными границами и стеклянным эффектом
 */
export const CARD_BASE = [
  "relative",
  "rounded-3xl",
  "border",
  "border-white/12",
  "bg-white/6",
  "backdrop-blur-xl",
  "transition-all",
  TRANSITIONS.normal,
  "overflow-hidden",
  "hover:border-white/18",
  "hover:bg-white/8",
  "focus-within:border-white/20",
  "focus-within:bg-white/10",
].join(" ");

/**
 * Мягкая карточка для второстепенного контента
 */
export const CARD_SOFT = [
  "relative",
  "rounded-2xl",
  "border",
  "border-white/8",
  "bg-white/4",
  "backdrop-blur-lg",
  "transition-colors",
  TRANSITIONS.fast,
  "hover:border-white/12",
  "hover:bg-white/6",
].join(" ");

/**
 * Основная карточка с тенью и градиентом
 */
export const CARD = [
  CARD_BASE,
  SHADOWS.medium,
  "hover:shadow-large",
  "hover:shadow-black/25",
].join(" ");

/**
 * Карточка с акцентом - для важного контента
 */
export const CARD_PROMINENT = [
  CARD_BASE,
  "bg-gradient-to-br from-white/8 to-white/4",
  "border-white/15",
  SHADOWS.large,
  "hover:border-white/20",
  "hover:bg-white/10",
].join(" ");

/* =========================================================================
   Контейнеры / Секции
   ========================================================================= */

/**
 * Обертка для секций с адаптивными отступами
 */
export const SECTION_WRAP = [
  "w-full",
  "max-w-[1920px]",
  "mx-auto",
  "px-4 py-8",
  "sm:px-6 sm:py-12",
  "lg:px-8 lg:py-16",
  "xl:px-10 xl:py-20",
  "2xl:px-12 2xl:py-24",
].join(" ");

/**
 * Контейнер контента с 8K-готовностью
 */
export const SCREEN_CONTAIN = [
  "w-full",
  "mx-auto",
  "max-w-screen-2xl",
  "px-4 sm:px-6 lg:px-8",
  "[@media(min-width:2560px)]:max-w-[2400px]",
  "[@media(min-width:3840px)]:max-w-[3600px]",
].join(" ");

/**
 * Карточка дашборда с улучшенным стеклянным эффектом
 */
export const DASHBOARD_CARD = [
  "admin-surface",
  "rounded-3xl",
  "p-6",
  "sm:p-8",
  "lg:p-10",
  "transition-all",
  TRANSITIONS.normal,
  "hover:admin-surface-hover",
  "backdrop-blur-2xl",
].join(" ");

export const DASHBOARD_CARD_SOFT = [
  "admin-surface-bleed",
  "rounded-3xl",
  "p-5",
  "sm:p-6",
  "lg:p-8",
  "transition-colors",
  TRANSITIONS.fast,
  "backdrop-blur-xl",
].join(" ");

/**
 * Горизонтальный контейнер для выравнивания элементов
 */
export const ROW = [
  "flex",
  "flex-wrap",
  "items-center",
  "gap-3",
  "sm:gap-4",
  "lg:gap-5",
  "xl:gap-6",
].join(" ");

/**
 * Вертикальный стек для контента
 */
export const STACK = [
  "flex",
  "flex-col",
  "gap-4",
  "sm:gap-5",
  "lg:gap-6",
].join(" ");

/* =========================================================================
   Типографика
   ========================================================================= */

export const TITLE_XL = [
  "text-4xl",
  "sm:text-5xl",
  "lg:text-6xl",
  "xl:text-7xl",
  "font-bold",
  "tracking-tight",
  "text-white/95",
  "leading-tight",
  "bg-gradient-to-r",
  "from-white",
  "via-white/90",
  "to-white/80",
  "bg-clip-text",
  "text-transparent",
].join(" ");

export const TITLE_LG = [
  "text-3xl",
  "sm:text-4xl",
  "lg:text-5xl",
  "font-bold",
  "tracking-tight",
  "text-white/95",
  "leading-tight",
].join(" ");

export const TITLE = [
  "text-2xl",
  "sm:text-3xl",
  "lg:text-4xl",
  "font-bold",
  "tracking-tight",
  "text-white/95",
  "leading-tight",
].join(" ");

export const TITLE_SM = [
  "text-xl",
  "sm:text-2xl",
  "font-semibold",
  "tracking-tight",
  "text-white/92",
  "leading-tight",
].join(" ");

export const SUBTITLE = [
  "text-lg",
  "sm:text-xl",
  "font-normal",
  "tracking-wide",
  "text-white/70",
  "leading-relaxed",
  "max-w-3xl",
].join(" ");

export const SUBTITLE_SM = [
  "text-base",
  "sm:text-lg",
  "font-normal",
  "tracking-wide",
  "text-white/64",
  "leading-relaxed",
  "max-w-2xl",
].join(" ");

export const BODY = [
  "text-base",
  "leading-relaxed",
  "text-white/80",
  "max-w-prose",
].join(" ");

export const BODY_SM = [
  "text-sm",
  "leading-relaxed",
  "text-white/70",
  "max-w-prose",
].join(" ");

export const EYEBROW = [
  "text-xs",
  "font-medium",
  "tracking-widest",
  "uppercase",
  "text-white/60",
  "[letter-spacing:0.1em]",
].join(" ");

export const CAPTION = [
  "text-xs",
  "font-normal",
  "tracking-wide",
  "text-white/50",
  "leading-relaxed",
].join(" ");

/* =========================================================================
   Метки / Бейджи / Чипы
   ========================================================================= */

export const CHIP_BASE = [
  "inline-flex",
  "items-center",
  "gap-2",
  "rounded-2xl",
  "border",
  "px-3",
  "py-2",
  "text-sm",
  "font-medium",
  "backdrop-blur-lg",
  "transition-all",
  TRANSITIONS.fast,
].join(" ");

export const CHIP = [
  CHIP_BASE,
  "border-white/12",
  "bg-white/8",
  "text-white/80",
  "hover:border-white/18",
  "hover:bg-white/12",
  "hover:text-white",
].join(" ");

export const CHIP_SOLID = [
  CHIP_BASE,
  "border-white/20",
  "bg-white/12",
  "text-white",
  "hover:border-white/25",
  "hover:bg-white/15",
].join(" ");

export const BADGE_BASE = [
  "inline-flex",
  "items-center",
  "rounded-full",
  "px-2.5",
  "py-1",
  "text-xs",
  "font-medium",
  "border",
  "backdrop-blur-md",
  "transition-colors",
  TRANSITIONS.fast,
].join(" ");

export const BADGE = BADGE_BASE;

export const BADGE_NEUTRAL = [
  BADGE_BASE,
  "border-white/12",
  "bg-white/8",
  "text-white/80",
].join(" ");

export const BADGE_SUCCESS = [
  BADGE_BASE,
  "border-emerald-400/30",
  "bg-emerald-500/20",
  "text-emerald-300",
].join(" ");

export const BADGE_WARNING = [
  BADGE_BASE,
  "border-amber-400/30",
  "bg-amber-500/20",
  "text-amber-300",
].join(" ");

export const BADGE_ERROR = [
  BADGE_BASE,
  "border-rose-400/30",
  "bg-rose-500/20",
  "text-rose-300",
].join(" ");

export const BADGE_INFO = [
  BADGE_BASE,
  "border-blue-400/30",
  "bg-blue-500/20",
  "text-blue-300",
].join(" ");

/* =========================================================================
   Кнопки и интерактивные элементы
   ========================================================================= */

export const BTN_BASE = [
  "relative",
  "inline-flex",
  "items-center",
  "justify-center",
  "gap-3",
  "rounded-2xl",
  "font-medium",
  "backdrop-blur-xl",
  "transition-all",
  TRANSITIONS.normal,
  "focus:outline-none",
  "focus-visible:ring-4",
  "focus-visible:ring-white/30",
  "focus-visible:ring-offset-2",
  "focus-visible:ring-offset-black/50",
  "disabled:opacity-50",
  "disabled:pointer-events-none",
  "active:scale-95",
].join(" ");

export const BTN_SIZES = {
  sm: "px-4 py-2.5 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
} as const;

export const BTN_PRIMARY = [
  BTN_BASE,
  BTN_SIZES.md,
  "text-white",
  "bg-gradient-to-r from-blue-500 to-purple-600",
  "border border-white/20",
  SHADOWS.glow,
  "hover:from-blue-600 hover:to-purple-700",
  "hover:border-white/30",
  "hover:shadow-xl hover:shadow-blue-500/30",
  "hover:scale-105",
].join(" ");

export const BTN_SECONDARY = [
  BTN_BASE,
  BTN_SIZES.md,
  "text-white/90",
  "border border-white/15",
  "bg-white/10",
  "hover:bg-white/15",
  "hover:border-white/20",
  "hover:text-white",
  "hover:scale-105",
].join(" ");

export const BTN_GHOST = [
  BTN_BASE,
  BTN_SIZES.md,
  "text-white/80",
  "border border-transparent",
  "bg-white/5",
  "hover:bg-white/10",
  "hover:text-white",
  "hover:scale-105",
].join(" ");

export const BTN_DANGER = [
  BTN_BASE,
  BTN_SIZES.md,
  "text-white",
  "bg-gradient-to-r from-rose-500 to-pink-600",
  "border border-rose-400/30",
  "hover:from-rose-600 hover:to-pink-700",
  "hover:border-rose-500/40",
  "hover:scale-105",
].join(" ");

export const TAPPABLE = [
  "cursor-pointer",
  "select-none",
  "touch-manipulation",
  "transition-all",
  TRANSITIONS.fast,
  "active:scale-95",
  "hover:scale-105",
  "focus:outline-none",
  "focus-visible:ring-4",
  "focus-visible:ring-white/30",
  "focus-visible:ring-offset-2",
  "focus-visible:ring-offset-black/50",
].join(" ");

export const FOCUS_RING = [
  "focus:outline-none",
  "focus-visible:ring-4",
  "focus-visible:ring-white/30",
  "focus-visible:ring-offset-2",
  "focus-visible:ring-offset-black/50",
].join(" ");

/* =========================================================================
   Утилиты текста и контента
   ========================================================================= */

export const CLAMP_1 = ["line-clamp-1", "overflow-hidden"].join(" ");
export const CLAMP_2 = ["line-clamp-2", "overflow-hidden"].join(" ");
export const CLAMP_3 = ["line-clamp-3", "overflow-hidden"].join(" ");

export const NO_OVERFLOW_INLINE = [
  "overflow-hidden",
  "text-ellipsis",
  "whitespace-nowrap",
].join(" ");

export const TEXT_BALANCE = ["text-pretty", "balance"].join(" ");

/* =========================================================================
   Гриды и витрина магазина
   ========================================================================= */

export const PRODUCTS_GRID = [
  "grid",
  "grid-cols-1",
  "gap-4",
  "min-[480px]:grid-cols-2",
  "md:grid-cols-3",
  "lg:grid-cols-4",
  "xl:grid-cols-5",
  "2xl:grid-cols-6",
  "3xl:grid-cols-7",
  "4xl:grid-cols-8",
  "[@media(min-width:2560px)]:grid-cols-9",
  "[@media(min-width:3840px)]:grid-cols-12",
].join(" ");

export const FILTERS_CONTAINER = [
  "flex",
  "flex-wrap",
  "items-center",
  "gap-3",
  "p-4",
  "sm:p-6",
  "rounded-3xl",
  "border",
  "border-white/10",
  "bg-white/5",
  "backdrop-blur-2xl",
].join(" ");

export const PRODUCT_CARD = [
  CARD_BASE,
  "aspect-[3/4]",
  "flex",
  "flex-col",
  "overflow-hidden",
  "group",
  "hover:shadow-large",
  "hover:shadow-black/30",
  "hover:border-white/20",
].join(" ");

export const PRODUCT_IMAGE = [
  "flex-1",
  "bg-gradient-to-br from-white/5 to-white/3",
  "overflow-hidden",
  "relative",
  "group-hover:bg-white/8",
  "transition-all",
  TRANSITIONS.slow,
].join(" ");

export const PRODUCT_CONTENT = [
  "p-4",
  "sm:p-6",
  "flex",
  "flex-col",
  "gap-3",
  "backdrop-blur-lg",
].join(" ");

export const PRODUCT_PRICE = [
  "text-xl",
  "font-bold",
  "text-white/95",
  "tracking-tight",
].join(" ");

export const PRODUCT_OLD_PRICE = [
  "text-base",
  "text-white/48",
  "line-through",
  "font-medium",
].join(" ");

export const PRODUCT_DISCOUNT = [
  CHIP_BASE,
  "bg-gradient-to-r from-emerald-500/20 to-green-500/20",
  "border-emerald-400/30",
  "text-emerald-300",
  "text-xs",
  "px-2",
  "py-1",
].join(" ");

/* =========================================================================
   Состояния
   ========================================================================= */

export const LOADING_SKELETON = [
  "animate-pulse",
  "bg-gradient-to-r from-white/8 via-white/12 to-white/8",
  "rounded-2xl",
  "border",
  "border-white/6",
].join(" ");

export const ERROR_MESSAGE = [
  "text-center",
  "p-8",
  "rounded-3xl",
  "border",
  "border-rose-400/20",
  "bg-gradient-to-br from-rose-500/10 to-pink-500/10",
  "backdrop-blur-xl",
  "text-rose-200",
].join(" ");

export const EMPTY_STATE = [
  "text-center",
  "p-12",
  "rounded-3xl",
  "border",
  "border-white/10",
  "bg-gradient-to-br from-white/5 to-white/3",
  "backdrop-blur-2xl",
  "text-white/64",
].join(" ");

export const SUCCESS_MESSAGE = [
  "text-center",
  "p-8",
  "rounded-3xl",
  "border",
  "border-emerald-400/20",
  "bg-gradient-to-br from-emerald-500/10 to-green-500/10",
  "backdrop-blur-xl",
  "text-emerald-200",
].join(" ");

/* =========================================================================
   Анимации и эффекты
   ========================================================================= */

export const FADE_IN = [
  "animate-in",
  "fade-in-0",
  "duration-500",
].join(" ");

export const SLIDE_UP = [
  "animate-in",
  "slide-in-from-bottom-4",
  "fade-in-0",
  "duration-500",
].join(" ");

export const SCALE_IN = [
  "animate-in",
  "zoom-in-95",
  "fade-in-0",
  "duration-300",
].join(" ");

/* =========================================================================
   Экспорт по умолчанию (совместимость)
   ========================================================================= */

export default {
  cn,
  
  // Константы
  TRANSITIONS,
  SHADOWS,
  
  // Карточки и контейнеры
  CARD_BASE,
  CARD_SOFT,
  CARD,
  CARD_PROMINENT,
  SECTION_WRAP,
  SCREEN_CONTAIN,
  DASHBOARD_CARD,
  DASHBOARD_CARD_SOFT,
  ROW,
  STACK,
  
  // Типографика
  TITLE_XL,
  TITLE_LG,
  TITLE,
  TITLE_SM,
  SUBTITLE,
  SUBTITLE_SM,
  BODY,
  BODY_SM,
  EYEBROW,
  CAPTION,
  
  // Метки и бейджи
  CHIP,
  CHIP_SOLID,
  BADGE,
  BADGE_NEUTRAL,
  BADGE_SUCCESS,
  BADGE_WARNING,
  BADGE_ERROR,
  BADGE_INFO,
  
  // Кнопки
  BTN_SIZES,
  BTN_PRIMARY,
  BTN_SECONDARY,
  BTN_GHOST,
  BTN_DANGER,
  TAPPABLE,
  FOCUS_RING,
  
  // Утилиты
  CLAMP_1,
  CLAMP_2,
  CLAMP_3,
  NO_OVERFLOW_INLINE,
  TEXT_BALANCE,
  
  // Витрина магазина
  PRODUCTS_GRID,
  FILTERS_CONTAINER,
  PRODUCT_CARD,
  PRODUCT_IMAGE,
  PRODUCT_CONTENT,
  PRODUCT_PRICE,
  PRODUCT_OLD_PRICE,
  PRODUCT_DISCOUNT,
  
  // Состояния
  LOADING_SKELETON,
  ERROR_MESSAGE,
  EMPTY_STATE,
  SUCCESS_MESSAGE,
  
  // Анимации
  FADE_IN,
  SLIDE_UP,
  SCALE_IN,
};