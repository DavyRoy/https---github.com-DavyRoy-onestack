// src/app/demo/user/dashboard/components/EmptyState.tsx
"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ShoppingBag, Sparkles, ArrowRight, Plus } from "lucide-react";
import {
  type ElementType,
  type ReactNode,
  type MouseEvent,
  type PropsWithChildren,
} from "react";
import { cn, FOCUS_RING, useStableId } from "./_shared";

/**
 * Универсальный EmptyState для карточек и страниц.
 * — Грамотная адаптивность (ничего не «выпирает» на 320–390px)
 * — SSR-safe id (без hydration mismatch)
 * — Упрощённые стили без инлайновых max-width, но с защитой от переполнений
 * — Корректные роли/ARIA и уважение prefers-reduced-motion
 */

type Tone = "muted" | "brand" | "success" | "warning" | "danger" | "premium";
type Size = "sm" | "md" | "lg" | "xl";
type Align = "center" | "start" | "end";
type Border = "dashed" | "solid" | "none" | "glow";
type Variant = "panel" | "embedded" | "glass" | "minimal";

export interface EmptyStateProps {
  title: string;
  description: string;

  ctaLabel?: string;
  ctaHref?: string;
  onPrimaryClick?: (e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  ctaIcon?: LucideIcon;

  Icon?: LucideIcon;
  showIcon?: boolean;
  iconSize?: number;
  iconClassName?: string;
  iconContainerClassName?: string;
  iconAriaLabel?: string;
  iconVariant?: "default" | "circle" | "square" | "gradient";

  tone?: Tone;

  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  onSecondaryClick?: (e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  secondaryCtaIcon?: LucideIcon;

  tertiaryCtaLabel?: string;
  tertiaryCtaHref?: string;
  onTertiaryClick?: (e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;

  hint?: string | ReactNode;
  badge?: string;

  size?: Size;
  align?: Align;

  variant?: Variant;
  borderStyle?: Border;

  extra?: ReactNode;

  live?: "polite" | "assertive" | "off";
  as?: ElementType;
  role?: "region" | "status" | "alert" | "complementary";

  withBackground?: boolean;
  withShadow?: boolean;
  interactive?: boolean;

  className?: string;
}

export default function EmptyState({
  title,
  description,
  ctaLabel = "Перейти",
  ctaHref,
  onPrimaryClick,
  ctaIcon = ArrowRight,
  Icon = ShoppingBag,
  showIcon = true,
  iconSize = 24,
  iconClassName,
  iconContainerClassName,
  iconAriaLabel,
  iconVariant = "circle",
  tone = "muted",
  secondaryCtaLabel,
  secondaryCtaHref,
  onSecondaryClick,
  secondaryCtaIcon = Plus,
  tertiaryCtaLabel,
  tertiaryCtaHref,
  onTertiaryClick,
  hint,
  badge,
  size = "md",
  align = "center",
  variant = "panel",
  borderStyle = "dashed",
  extra,
  live = "off",
  as,
  role,
  withBackground = true,
  withShadow = true,
  interactive = false,
  className,
  children,
}: PropsWithChildren<EmptyStateProps>) {
  const reduced = useReducedMotion();

  // ✅ SSR-safe ids
  const uid = useStableId("empty");
  const titleId = `${uid}-title`;
  const descId = `${uid}-desc`;
  const hintId = `${uid}-hint`;
  const extraId = `${uid}-extra`;

  // Анимация с уважением к prefers-reduced-motion
  const fade = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 16, scale: 0.98 },
        whileInView: { opacity: 1, y: 0, scale: 1 },
        viewport: { once: true, amount: 0.12 },
        transition: {
          duration: 0.45,
          ease: [0.25, 0.46, 0.45, 0.94],
        },
      };

  // Тоны
  const toneConfig: Record<
    Tone,
    {
      icon: string;
      iconBg: string;
      iconRing?: string;
      primaryBtn: string;
      secondaryBtn: string;
      badge: string;
      gradient?: string;
    }
  > = {
    muted: {
      icon: "text-white/70",
      iconBg: "bg-white/10",
      iconRing: "ring-white/15",
      primaryBtn:
        "border border-white/20 bg-white/10 text-white hover:bg-white/15 hover:border-white/25",
      secondaryBtn:
        "border border-white/10 bg-transparent text-white/80 hover:bg-white/5 hover:text-white",
      badge: "bg-white/10 text-white/70 border border-white/10",
    },
    brand: {
      icon: "text-[hsl(var(--brand))]",
      iconBg: "bg-[hsl(var(--brand))]/20",
      iconRing: "ring-[hsl(var(--brand))]/30",
      primaryBtn:
        "border border-[hsl(var(--brand))] bg-[hsl(var(--brand))] text-white hover:bg-[hsl(var(--brand))]/90",
      secondaryBtn:
        "border border-[hsl(var(--brand))]/30 bg-transparent text-[hsl(var(--brand))] hover:bg-[hsl(var(--brand))]/10",
      badge:
        "bg-[hsl(var(--brand))]/20 text-[hsl(var(--brand))] border border-[hsl(var(--brand))]/30",
    },
    success: {
      icon: "text-emerald-300",
      iconBg: "bg-emerald-500/15",
      iconRing: "ring-emerald-400/25",
      primaryBtn:
        "border border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-500/90",
      secondaryBtn:
        "border border-emerald-500/30 bg-transparent text-emerald-300 hover:bg-emerald-500/10",
      badge: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/25",
    },
    warning: {
      icon: "text-amber-300",
      iconBg: "bg-amber-500/15",
      iconRing: "ring-amber-400/25",
      primaryBtn:
        "border border-amber-500 bg-amber-500 text-white hover:bg-amber-500/90",
      secondaryBtn:
        "border border-amber-500/30 bg-transparent text-amber-300 hover:bg-amber-500/10",
      badge: "bg-amber-500/15 text-amber-300 border border-amber-500/25",
    },
    danger: {
      icon: "text-rose-300",
      iconBg: "bg-rose-500/15",
      iconRing: "ring-rose-400/25",
      primaryBtn:
        "border border-rose-500 bg-rose-500 text-white hover:bg-rose-500/90",
      secondaryBtn:
        "border border-rose-500/30 bg-transparent text-rose-300 hover:bg-rose-500/10",
      badge: "bg-rose-500/15 text-rose-300 border border-rose-500/25",
    },
    premium: {
      icon: "text-white",
      iconBg: "bg-gradient-to-br from-purple-500/20 to-pink-500/20",
      iconRing: "ring-purple-400/40",
      primaryBtn:
        "border-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500",
      secondaryBtn:
        "border border-purple-400/30 bg-transparent text-purple-300 hover:bg-purple-500/10",
      badge:
        "bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-white border border-purple-400/30",
      gradient: "from-purple-500/10 via-transparent to-pink-500/10",
    },
  };

  const config = toneConfig[tone];

  // Размеры
  const sizeConfig = {
    sm: {
      padding: "p-4 sm:p-5",
      gap: "gap-3 sm:gap-4",
      iconSize: "h-10 w-10",
      title: "text-base sm:text-lg",
      description: "text-xs sm:text-sm",
      button: "min-h-[40px] sm:min-h-[44px] text-xs sm:text-sm px-4 sm:px-5",
    },
    md: {
      padding: "p-5 sm:p-7",
      gap: "gap-4 sm:gap-5",
      iconSize: "h-12 w-12 sm:h-14 sm:w-14",
      title: "text-lg sm:text-2xl",
      description: "text-sm sm:text-base",
      button: "min-h-[44px] sm:min-h-[48px] text-sm sm:text-base px-5 sm:px-6",
    },
    lg: {
      padding: "p-6 sm:p-9",
      gap: "gap-5 sm:gap-7",
      iconSize: "h-16 w-16",
      title: "text-xl sm:text-3xl",
      description: "text-base sm:text-lg",
      button: "min-h-[48px] sm:min-h-[56px] text-base px-6 sm:px-8",
    },
    xl: {
      padding: "p-8 sm:p-12",
      gap: "gap-6 sm:gap-10",
      iconSize: "h-20 w-20 sm:h-24 sm:w-24",
      title: "text-2xl sm:text-4xl",
      description: "text-lg sm:text-2xl",
      button: "min-h-[52px] sm:min-h-[60px] text-lg px-8 sm:px-10",
    },
  } as const;

  const currentSize = sizeConfig[size];

  // Выравнивание
  const alignConfig = {
    center: "items-center text-center",
    start: "items-start text-left",
    end: "items-end text-right",
  } as const;

  // Варианты контейнера
  const variantConfig: Record<Variant, string> = {
    panel: "rounded-2xl border border-white/12 bg-white/8",
    embedded: "bg-transparent border-0 shadow-none",
    glass: "rounded-2xl border border-white/10 bg-white/6 backdrop-blur-md",
    minimal: "bg-transparent border-0 shadow-none backdrop-blur-none",
  };

  // Границы
  const borderConfig: Record<Border, string> = {
    dashed: "border-dashed",
    solid: "border-solid",
    none: "border-0",
    glow:
      "border-0 shadow-[0_0_40px_-12px_rgba(255,255,255,0.28)] " +
      (tone === "brand"
        ? "shadow-[0_0_40px_-12px_hsl(var(--brand))]"
        : tone === "premium"
        ? "shadow-[0_0_46px_-14px_rgba(168,85,247,0.45)]"
        : ""),
  };

  // Варианты иконок
  const iconVariantConfig: Record<NonNullable<EmptyStateProps["iconVariant"]>, string> = {
    default: "",
    circle: "rounded-full",
    square: "rounded-2xl",
    gradient:
      "rounded-full bg-gradient-to-br " +
      (tone === "premium" ? "from-purple-500/20 to-pink-500/20" : "from-white/10 to-white/5"),
  };

  // Accessibility
  const describedBy = [descId, hint ? hintId : undefined, extra ? extraId : undefined]
    .filter(Boolean)
    .join(" ") || undefined;

  // Если просят alert — делаем по правилам ARIA: live всегда assertive
  const finalRole = role ?? (live === "off" ? "region" : "status");
  const ariaLive = role === "alert" ? "assertive" : live === "off" ? undefined : live;

  const MotionContainer = (as ? motion(as) : motion.div) as any;

  const PrimaryCtaIcon = ctaIcon;
  const SecondaryCtaIcon = secondaryCtaIcon;

  return (
    <MotionContainer
      {...fade}
      role={finalRole}
      aria-labelledby={titleId}
      aria-describedby={describedBy}
      aria-live={ariaLive}
      className={cn(
        // Базовая сетка/ограничители
        "relative flex w-full min-w-0 max-w-full flex-col justify-center",
        "overflow-hidden break-words", // защита от переполнений
        "touch-manipulation select-none",
        alignConfig[align],
        variantConfig[variant],
        borderConfig[borderStyle],
        currentSize.padding,
        currentSize.gap,
        withBackground && variant !== "embedded" && "bg-[hsl(var(--panel))]/70",
        withShadow && "shadow-soft",
        interactive && "cursor-pointer transition-transform duration-300 hover:scale-[0.99]",
        tone === "premium" && config.gradient && `bg-gradient-to-br ${config.gradient}`,
        className
      )}
    >
      {/* Бейдж (опционально) */}
      {badge && (
        <div
          className={cn(
            "inline-flex items-center gap-1.5 self-center sm:self-start rounded-full px-3 py-1.5 text-xs sm:text-sm font-medium",
            "backdrop-blur-sm",
            config.badge
          )}
        >
          {tone === "premium" && (
            <Sparkles className="h-4 w-4" aria-hidden />
          )}
          {badge}
        </div>
      )}

      {/* Иконка */}
      {showIcon && (
        <div
          className={cn(
            "relative flex items-center justify-center",
            currentSize.iconSize,
            iconVariantConfig[iconVariant],
            config.iconBg,
            iconVariant !== "gradient" && config.iconRing,
            iconVariant !== "gradient" && "ring-1",
            "shrink-0",
            iconContainerClassName
          )}
          aria-hidden={!iconAriaLabel}
          aria-label={iconAriaLabel}
          role={iconAriaLabel ? "img" : undefined}
        >
          <Icon
            className={cn("transition-transform duration-300", config.icon, iconClassName)}
            style={{ width: iconSize, height: iconSize }}
          />
          {tone === "premium" && (
            <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-sm" />
          )}
        </div>
      )}

      {/* Текстовый контент */}
      <div
        className={cn(
          "max-w-full space-y-3 sm:space-y-4",
          size === "xl" ? "sm:max-w-4xl" : size === "lg" ? "sm:max-w-2xl" : "sm:max-w-md"
        )}
      >
        <h3
          id={titleId}
          className={cn(
            currentSize.title,
            "font-semibold leading-tight tracking-tight text-white",
            "bg-gradient-to-br from-white to-white/80 bg-clip-text text-transparent"
          )}
          title={title}
        >
          {title}
        </h3>

        <p
          id={descId}
          className={cn(
            currentSize.description,
            "leading-relaxed text-white/70",
            "max-w-prose"
          )}
        >
          {description}
        </p>

        {hint && (
          <div
            id={hintId}
            className={cn(
              "rounded-lg bg-white/5 p-3 sm:p-4 text-xs sm:text-sm leading-relaxed text-white/60",
              "backdrop-blur-sm"
            )}
          >
            {hint}
          </div>
        )}
      </div>

      {/* Дополнительный контент */}
      {extra && (
        <div
          id={extraId}
          className={cn(
            "w-full max-w-full",
            size === "xl" ? "sm:max-w-4xl" : size === "lg" ? "sm:max-w-2xl" : "sm:max-w-md"
          )}
        >
          {extra}
        </div>
      )}

      {/* Дочерний контент */}
      {children && (
        <div
          className={cn(
            "w-full max-w-full",
            size === "xl" ? "sm:max-w-4xl" : size === "lg" ? "sm:max-w-2xl" : "sm:max-w-md"
          )}
        >
          {children}
        </div>
      )}

      {/* Кнопки */}
      {(ctaLabel || secondaryCtaLabel || tertiaryCtaLabel) && (
        <div
          className={cn(
            "w-full max-w-full pt-2 sm:pt-3",
            size === "xl" ? "sm:max-w-4xl" : size === "lg" ? "sm:max-w-2xl" : "sm:max-w-md",
            align === "center" && "self-center",
            align === "end" && "self-end"
          )}
        >
          {/* Основная */}
          {ctaLabel && (
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              {ctaHref ? (
                <Link
                  href={ctaHref}
                  prefetch={false}
                  onClick={onPrimaryClick}
                  className={cn(
                    "inline-flex w-full items-center justify-center gap-2 sm:w-auto sm:flex-none",
                    "rounded-full font-semibold outline-none transition-transform duration-300 hover:scale-[1.02] active:scale-95",
                    currentSize.button,
                    config.primaryBtn,
                    FOCUS_RING
                  )}
                >
                  {ctaLabel}
                  <PrimaryCtaIcon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={onPrimaryClick}
                  className={cn(
                    "inline-flex w-full items-center justify-center gap-2 sm:w-auto sm:flex-none",
                    "rounded-full font-semibold outline-none transition-transform duration-300 hover:scale-[1.02] active:scale-95",
                    currentSize.button,
                    config.primaryBtn,
                    FOCUS_RING
                  )}
                >
                  {ctaLabel}
                  <PrimaryCtaIcon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
                </button>
              )}

              {/* Вторичная / Третичная */}
              {(secondaryCtaLabel || tertiaryCtaLabel) && (
                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
                  {secondaryCtaLabel &&
                    (secondaryCtaHref ? (
                      <Link
                        href={secondaryCtaHref}
                        prefetch={false}
                        onClick={onSecondaryClick}
                        className={cn(
                          "inline-flex w-full items-center justify-center gap-2 sm:w-auto",
                          "rounded-full font-medium outline-none transition-transform duration-300 hover:scale-[1.02] active:scale-95",
                          currentSize.button,
                          config.secondaryBtn,
                          FOCUS_RING
                        )}
                      >
                        {secondaryCtaLabel}
                        {secondaryCtaIcon && (
                          <SecondaryCtaIcon className="h-4 w-4" aria-hidden />
                        )}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={onSecondaryClick}
                        className={cn(
                          "inline-flex w-full items-center justify-center gap-2 sm:w-auto",
                          "rounded-full font-medium outline-none transition-transform duration-300 hover:scale-[1.02] active:scale-95",
                          currentSize.button,
                          config.secondaryBtn,
                          FOCUS_RING
                        )}
                      >
                        {secondaryCtaLabel}
                        {secondaryCtaIcon && (
                          <SecondaryCtaIcon className="h-4 w-4" aria-hidden />
                        )}
                      </button>
                    ))}

                  {tertiaryCtaLabel &&
                    (tertiaryCtaHref ? (
                      <Link
                        href={tertiaryCtaHref}
                        prefetch={false}
                        onClick={onTertiaryClick}
                        className={cn(
                          "inline-flex w-full items-center justify-center sm:w-auto",
                          "rounded-full border border-white/5 bg-white/5 text-white/70 outline-none transition-colors hover:bg-white/10 hover:text-white/90",
                          currentSize.button,
                          FOCUS_RING
                        )}
                      >
                        {tertiaryCtaLabel}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={onTertiaryClick}
                        className={cn(
                          "inline-flex w-full items-center justify-center sm:w-auto",
                          "rounded-full border border-white/5 bg-white/5 text-white/70 outline-none transition-colors hover:bg-white/10 hover:text-white/90",
                          currentSize.button,
                          FOCUS_RING
                        )}
                      >
                        {tertiaryCtaLabel}
                      </button>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </MotionContainer>
  );
}