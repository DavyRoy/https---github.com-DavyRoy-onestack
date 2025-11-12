// src/app/demo/user/dashboard/components/Skeletons.tsx
"use client";

/**
 * Универсальные скелетоны для дашборда.
 * - Полная адаптивность от 393px до TV-экранов
 * - Улучшенные анимации с градиентами и свечением
 * - Расширенная система вариантов и конфигураций
 * - Улучшенная семантика и доступность
 */

import type { ElementType, ReactNode, CSSProperties } from "react";
import { cn } from "./_shared";

/* ====================== Атомарные кирпичики ====================== */

export function SkeletonLine({
  className,
  style,
  width = "100%",
  height = 12,
  rounded = true,
  muted = false,
  animated = true,
}: {
  className?: string;
  style?: CSSProperties;
  width?: number | string;
  height?: number | string;
  rounded?: boolean;
  muted?: boolean;
  animated?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden",
        rounded ? "rounded-lg" : "",
        muted ? "bg-white/8" : "bg-white/12",
        animated && "motion-safe:animate-pulse",
        className
      )}
      style={{ width, height, ...style }}
      aria-hidden
    >
      {animated && (
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
            animation: "shimmer 2s infinite",
          }}
        />
      )}
    </div>
  );
}

export function SkeletonCircle({
  size = 36,
  className,
  muted = false,
  animated = true,
}: {
  size?: number;
  className?: string;
  muted?: boolean;
  animated?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-full",
        muted ? "bg-white/8" : "bg-white/12",
        animated && "motion-safe:animate-pulse",
        className
      )}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {animated && (
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
            animation: "shimmer 2s infinite",
          }}
        />
      )}
    </div>
  );
}

export function SkeletonBadge({
  width = 64,
  height = 24,
  className,
  variant = "neutral",
  animated = true,
}: {
  width?: number;
  height?: number;
  className?: string;
  variant?: "neutral" | "brand" | "success" | "warning" | "danger";
  animated?: boolean;
}) {
  const variantStyles = {
    neutral: "border-white/20 bg-white/10",
    brand: "border-blue-500/30 bg-blue-500/15",
    success: "border-emerald-500/30 bg-emerald-500/15",
    warning: "border-amber-500/30 bg-amber-500/15",
    danger: "border-rose-500/30 bg-rose-500/15",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-full border",
        variantStyles[variant],
        animated && "motion-safe:animate-pulse",
        className
      )}
      style={{ width, height }}
      aria-hidden
    >
      {animated && (
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
            animation: "shimmer 2s infinite",
          }}
        />
      )}
    </div>
  );
}

export function SkeletonIcon({
  size = 24,
  className,
  animated = true,
}: {
  size?: number;
  className?: string;
  animated?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg bg-white/12",
        animated && "motion-safe:animate-pulse",
        className
      )}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {animated && (
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
            animation: "shimmer 2s infinite",
          }}
        />
      )}
    </div>
  );
}

/* ====================== Главный CardSkeleton ====================== */

export function CardSkeleton<T extends ElementType = "div">({
  as,
  className,
  children,
  withHeader = false,
  rows = 0,
  rowWidths,
  tall = false,
  compact = false,
  ariaLabel,
  animated = true,
  live = "polite",
  variant = "default",
}: {
  as?: T;
  className?: string;
  children?: ReactNode;
  withHeader?: boolean;
  rows?: number;
  rowWidths?: Array<string | number>;
  tall?: boolean;
  compact?: boolean;
  ariaLabel?: string;
  animated?: boolean;
  live?: "polite" | "assertive" | "off";
  variant?: "default" | "panel" | "glass" | "minimal";
}) {
  const Tag = (as ?? "div") as ElementType;

  const isRegion = !!ariaLabel;
  const role = isRegion ? "region" : "status";
  const ariaLive = !isRegion && live !== "off" ? live : undefined;

  const regionProps = isRegion ? ({ "aria-label": ariaLabel } as const) : ({} as const);

  const showRows = (rowWidths && rowWidths.length > 0) || rows > 0;
  const widths =
    rowWidths && rowWidths.length > 0
      ? rowWidths
      : Array.from({ length: rows }, (_, i) => (i === rows - 1 ? "70%" : "85%"));

  const variantStyles = {
    default: "border-white/15 bg-white/5",
    panel: "border-white/20 bg-white/10 shadow-lg",
    glass: "border-white/20 bg-white/10 backdrop-blur-md",
    minimal: "border-transparent bg-transparent",
  };

  return (
    <Tag
      {...regionProps}
      className={cn(
        "relative w-full overflow-hidden rounded-2xl border",
        variantStyles[variant],
        tall ? "min-h-[16rem]" : compact ? "min-h-[2rem]" : "min-h-[3rem]",
        typeof children === "undefined" && !showRows ? "p-0" : compact ? "p-3" : "p-4 sm:p-5",
        animated && "motion-safe:animate-pulse",
        "motion-reduce:animate-none",
        className
      )}
      role={role}
      aria-live={ariaLive}
      aria-busy="true"
    >
      {/* Улучшенный shimmer overlay */}
      {animated && (
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0",
            "motion-safe:animate-[shimmer_2s_ease-in-out_infinite]",
            "motion-reduce:animate-none"
          )}
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 45%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.08) 55%, transparent 100%)",
            maskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
          }}
        />
      )}

      {withHeader && (
        <div className="relative z-10 mb-4">
          <SkeletonHeading eyebrow compact={compact} />
          <SkeletonLine className="mt-2" width={compact ? 160 : 192} height={compact ? 20 : 24} animated={animated} />
        </div>
      )}

      {showRows && (
        <div className="relative z-10 space-y-2">
          {widths.map((w, i) => (
            <SkeletonLine key={i} width={w} height={compact ? 14 : 16} animated={animated} />
          ))}
        </div>
      )}

      {children}
      <span className="sr-only">Загрузка…</span>
    </Tag>
  );
}

/* ====================== Составные блоки витрины ====================== */

export function DashboardSkeleton({
  animated = true,
  variant = "default",
}: {
  animated?: boolean;
  variant?: "default" | "compact" | "detailed";
}) {
  const isCompact = variant === "compact";
  const isDetailed = variant === "detailed";

  return (
    <div className="space-y-6" role="status" aria-live="polite" aria-busy="true">
      {/* Приветствие */}
      <CardSkeleton
        withHeader
        rowWidths={isCompact ? ["50%", "30%"] : ["60%", "40%"]}
        className={cn(
          isCompact ? "h-28" : isDetailed ? "h-44" : "h-36"
        )}
        ariaLabel="Загрузка приветственного блока"
        animated={animated}
        variant={isDetailed ? "panel" : "default"}
      />

      {/* Быстрые действия */}
      <CardSkeleton 
        className="p-4" 
        ariaLabel="Загрузка быстрых действий" 
        animated={animated}
        variant={isDetailed ? "glass" : "default"}
      >
        <SkeletonHeading eyebrow compact={isCompact} className="mb-3" />
        <div className={cn(
          "grid gap-3",
          isCompact ? 
            "grid-cols-2 xs:grid-cols-3 sm:grid-cols-4" :
            "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
        )}>
          <ActionSkeleton compact={isCompact} animated={animated} />
          <ActionSkeleton compact={isCompact} animated={animated} />
          <ActionSkeleton compact={isCompact} animated={animated} />
          <ActionSkeleton compact={isCompact} animated={animated} />
          {!isCompact && <ActionSkeleton animated={animated} />}
          {!isCompact && <ActionSkeleton animated={animated} />}
        </div>
      </CardSkeleton>

      {/* KPI-индикаторы */}
      <div className={cn(
        "grid gap-4",
        isCompact ? 
          "grid-cols-2 xs:grid-cols-3" :
          "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      )}>
        <KpiSkeleton compact={isCompact} animated={animated} />
        <KpiSkeleton compact={isCompact} animated={animated} />
        <KpiSkeleton compact={isCompact} animated={animated} />
        <KpiSkeleton compact={isCompact} animated={animated} />
        {!isCompact && <KpiSkeleton animated={animated} />}
      </div>

      {/* Основная сетка */}
      <div className={cn(
        "grid gap-6",
        isDetailed ? "grid-cols-1 xl:grid-cols-12" : "grid-cols-1 lg:grid-cols-12"
      )}>
        {/* Ближайшая запись */}
        <CardSkeleton
          withHeader
          rows={isCompact ? 2 : 3}
          className={cn(
            isDetailed ? "xl:col-span-8 min-h-[14rem]" : "lg:col-span-8 min-h-[12rem]"
          )}
          ariaLabel="Загрузка ближайшей записи"
          animated={animated}
          variant={isDetailed ? "panel" : "default"}
        />
        
        {/* Календарь */}
        <CalendarMiniSkeleton 
          className={isDetailed ? "xl:col-span-4" : "lg:col-span-4"} 
          compact={isCompact}
          animated={animated}
        />

        {/* Заказы + Корзина */}
        <ListCardSkeleton 
          count={isCompact ? 2 : 3} 
          className={isDetailed ? "xl:col-span-6" : "lg:col-span-6"} 
          compact={isCompact}
          animated={animated}
        />
        <ListCardSkeleton 
          count={isCompact ? 2 : 3} 
          className={isDetailed ? "xl:col-span-6" : "lg:col-span-6"} 
          compact={isCompact}
          animated={animated}
        />

        {/* Услуги */}
        <CardSkeleton 
          className={cn(
            "p-4",
            isDetailed ? "xl:col-span-12" : "lg:col-span-12"
          )} 
          ariaLabel="Загрузка рекомендаций услуг" 
          animated={animated}
          variant={isDetailed ? "glass" : "default"}
        >
          <SkeletonHeading eyebrow compact={isCompact} className="mb-3" />
          <div className={cn(
            "grid gap-3",
            isCompact ?
              "grid-cols-1 xs:grid-cols-2" :
              "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          )}>
            <ServiceSkeleton compact={isCompact} animated={animated} />
            <ServiceSkeleton compact={isCompact} animated={animated} />
            <ServiceSkeleton compact={isCompact} animated={animated} />
            {!isCompact && <ServiceSkeleton animated={animated} />}
          </div>
        </CardSkeleton>

        {/* Платежи + Лояльность */}
        <PaymentsSkeleton 
          className={isDetailed ? "xl:col-span-6" : "lg:col-span-6"} 
          compact={isCompact}
          animated={animated}
        />
        <LoyaltySkeleton 
          className={isDetailed ? "xl:col-span-6" : "lg:col-span-6"} 
          compact={isCompact}
          animated={animated}
        />

        {/* Поддержка */}
        <CardSkeleton
          withHeader
          rows={isCompact ? 1 : 2}
          className={cn(
            "lg:col-span-12",
            isDetailed && "xl:col-span-12"
          )}
          ariaLabel="Загрузка блока поддержки"
          animated={animated}
          variant={isDetailed ? "panel" : "default"}
        />
      </div>
    </div>
  );
}

/* ====================== Заголовки ====================== */

export function SkeletonHeading({
  eyebrow = false,
  className,
  compact = false,
}: {
  eyebrow?: boolean;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div className={cn("relative z-10", className)}>
      {eyebrow && (
        <SkeletonLine 
          width={compact ? 96 : 112} 
          height={compact ? 10 : 12} 
          muted 
          rounded={false}
        />
      )}
      <SkeletonLine 
        width={compact ? 180 : 224} 
        height={compact ? 18 : 20} 
        rounded={false}
      />
    </div>
  );
}

/* ====================== Специализированные секции ====================== */

/* KPI карточка */
function KpiSkeleton({ 
  compact = false,
  animated = true 
}: {
  compact?: boolean;
  animated?: boolean;
}) {
  return (
    <CardSkeleton 
      className={compact ? "p-3" : "p-4"} 
      ariaLabel="Загрузка KPI"
      compact={compact}
      animated={animated}
    >
      <div className="relative z-10">
        <SkeletonLine 
          width={compact ? 80 : 96} 
          height={compact ? 10 : 12} 
          muted 
          animated={animated}
        />
        <SkeletonLine 
          className="mt-3" 
          width={compact ? 96 : 112} 
          height={compact ? 28 : 32} 
          animated={animated}
        />
        <SkeletonBadge 
          className="mt-2" 
          width={compact ? 140 : 160} 
          height={compact ? 14 : 16} 
          animated={animated}
        />
      </div>
    </CardSkeleton>
  );
}

/* Элемент «быстрое действие» */
function ActionSkeleton({ 
  compact = false,
  animated = true 
}: {
  compact?: boolean;
  animated?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative z-10 flex flex-col justify-between rounded-2xl border border-white/15 bg-white/6",
        compact ? "min-h-[100px] p-3" : "min-h-[118px] p-4"
      )}
      aria-hidden
    >
      <div className="flex items-start justify-between gap-3">
        <SkeletonCircle 
          size={compact ? 32 : 36} 
          className="border border-white/20 bg-white/10" 
          animated={animated}
        />
        <SkeletonBadge 
          width={compact ? 40 : 48} 
          height={compact ? 20 : 24} 
          animated={animated}
        />
      </div>
      <SkeletonLine 
        className="mt-3" 
        width={compact ? 140 : 160} 
        height={compact ? 14 : 16} 
        animated={animated}
      />
      <SkeletonLine 
        className="mt-2" 
        width={"90%"} 
        height={compact ? 10 : 12} 
        muted 
        animated={animated}
      />
      <SkeletonBadge 
        className="mt-4" 
        width={compact ? 80 : 88} 
        height={compact ? 10 : 12} 
        animated={animated}
      />
    </div>
  );
}

/* Календарь-макет */
function CalendarMiniSkeleton({ 
  className,
  compact = false,
  animated = true 
}: {
  className?: string;
  compact?: boolean;
  animated?: boolean;
}) {
  return (
    <CardSkeleton 
      className={cn(compact ? "p-3" : "p-4", className)} 
      ariaLabel="Загрузка мини-календаря"
      compact={compact}
      animated={animated}
    >
      <SkeletonHeading eyebrow compact={compact} />
      <div className="relative z-10 mt-4 grid grid-cols-7 gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div 
            key={i} 
            className={cn(
              "rounded-2xl border border-white/15 bg-white/6",
              compact ? "p-2" : "p-3"
            )} 
            aria-hidden
          >
            <SkeletonLine 
              className="mx-auto" 
              width={compact ? 32 : 40} 
              height={compact ? 10 : 12} 
              muted 
              animated={animated}
            />
            <SkeletonLine 
              className="mx-auto mt-2" 
              width={compact ? 24 : 28} 
              height={compact ? 20 : 24} 
              animated={animated}
            />
            <SkeletonLine 
              className="mx-auto mt-2" 
              width={compact ? 20 : 24} 
              height={compact ? 6 : 8} 
              muted 
              animated={animated}
            />
          </div>
        ))}
      </div>
    </CardSkeleton>
  );
}

/* Листовые карточки */
function ListCardSkeleton({
  count = 3,
  chips = false,
  className,
  compact = false,
  animated = true,
}: {
  count?: number;
  chips?: boolean;
  className?: string;
  compact?: boolean;
  animated?: boolean;
}) {
  return (
    <CardSkeleton 
      className={cn(compact ? "p-3" : "p-4", className)} 
      ariaLabel="Загрузка списка"
      compact={compact}
      animated={animated}
    >
      <SkeletonHeading eyebrow compact={compact} />
      <ul className="relative z-10 mt-4 space-y-3" role="list" aria-busy="true">
        {Array.from({ length: count }).map((_, i) => (
          <li 
            key={i} 
            className={cn(
              "rounded-2xl border border-white/15 bg-white/6",
              compact ? "p-3" : "p-4"
            )} 
            aria-hidden
          >
            <div className="flex items-center justify-between gap-3">
              <SkeletonLine 
                width={compact ? 160 : 192} 
                height={compact ? 14 : 16} 
                animated={animated}
              />
              <SkeletonBadge 
                width={compact ? 56 : 64} 
                height={compact ? 18 : 20} 
                animated={animated}
              />
            </div>
            <SkeletonLine 
              className="mt-2" 
              width={"72%"} 
              height={compact ? 10 : 12} 
              muted 
              animated={animated}
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <SkeletonBadge 
                width={compact ? 80 : 96} 
                height={compact ? 28 : 32} 
                animated={animated}
              />
              <SkeletonBadge 
                width={compact ? 80 : 96} 
                height={compact ? 28 : 32} 
                animated={animated}
              />
              {chips && (
                <SkeletonBadge 
                  width={compact ? 72 : 80} 
                  height={compact ? 28 : 32} 
                  animated={animated}
                />
              )}
            </div>
          </li>
        ))}
      </ul>
    </CardSkeleton>
  );
}

/* Услуга */
function ServiceSkeleton({ 
  compact = false,
  animated = true 
}: {
  compact?: boolean;
  animated?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative z-10 flex h-full flex-col justify-between rounded-2xl border border-white/15 bg-white/6",
        compact ? "min-h-[100px] p-3" : "min-h-[112px] p-4"
      )}
      aria-hidden
    >
      <SkeletonBadge 
        className="absolute right-3 top-3" 
        width={compact ? 80 : 96} 
        height={compact ? 20 : 24} 
        animated={animated}
      />
      <SkeletonLine 
        width={compact ? 140 : 160} 
        height={compact ? 14 : 16} 
        animated={animated}
      />
      <SkeletonLine 
        className="mt-2" 
        width={"85%"} 
        height={compact ? 10 : 12} 
        muted 
        animated={animated}
      />
      <div className="mt-4 flex items-center justify-between gap-3">
        <SkeletonLine 
          width={compact ? 56 : 64} 
          height={compact ? 14 : 16} 
          animated={animated}
        />
        <div className="flex gap-2">
          <SkeletonBadge 
            width={compact ? 80 : 96} 
            height={compact ? 32 : 36} 
            animated={animated}
          />
          <SkeletonBadge 
            width={compact ? 80 : 96} 
            height={compact ? 32 : 36} 
            animated={animated}
          />
        </div>
      </div>
    </div>
  );
}

/* Платежи */
function PaymentsSkeleton({ 
  className,
  compact = false,
  animated = true 
}: {
  className?: string;
  compact?: boolean;
  animated?: boolean;
}) {
  return (
    <CardSkeleton 
      className={cn(compact ? "p-3" : "p-4", className)} 
      ariaLabel="Загрузка платежей"
      compact={compact}
      animated={animated}
    >
      <SkeletonHeading eyebrow compact={compact} />
      <div className="relative z-10 mt-3 flex flex-wrap items-center gap-2">
        <SkeletonBadge 
          width={compact ? 112 : 128} 
          height={compact ? 28 : 32} 
          variant="brand"
          animated={animated}
        />
        <SkeletonBadge 
          width={compact ? 140 : 160} 
          height={compact ? 20 : 24} 
          animated={animated}
        />
      </div>
      <ul className="mt-3 space-y-3" role="list" aria-busy="true">
        <li 
          className={cn(
            "rounded-2xl border border-white/15 bg-white/6",
            compact ? "p-3" : "p-4"
          )} 
          aria-hidden
        >
          <div className="flex items-center justify-between gap-3">
            <SkeletonLine 
              width={"80%"} 
              height={compact ? 14 : 16} 
              animated={animated}
            />
            <SkeletonLine 
              width={compact ? 72 : 80} 
              height={compact ? 18 : 20} 
              animated={animated}
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <SkeletonBadge 
              width={compact ? 96 : 112} 
              height={compact ? 32 : 36} 
              variant="success"
              animated={animated}
            />
            <SkeletonBadge 
              width={compact ? 80 : 96} 
              height={compact ? 32 : 36} 
              animated={animated}
            />
          </div>
        </li>
        <li 
          className={cn(
            "rounded-2xl border border-white/15 bg-white/6",
            compact ? "p-3" : "p-4"
          )} 
          aria-hidden
        >
          <div className="flex items-center justify-between gap-3">
            <SkeletonLine 
              width={compact ? 180 : 200} 
              height={compact ? 14 : 16} 
              animated={animated}
            />
            <SkeletonLine 
              width={compact ? 56 : 64} 
              height={compact ? 18 : 20} 
              animated={animated}
            />
          </div>
          <SkeletonLine 
            className="mt-3" 
            width={compact ? 140 : 160} 
            height={compact ? 10 : 12} 
            muted 
            animated={animated}
          />
        </li>
      </ul>
      <SkeletonBadge 
        className="mt-3 w-full" 
        height={compact ? 32 : 36} 
        animated={animated}
      />
    </CardSkeleton>
  );
}

/* Лояльность */
function LoyaltySkeleton({ 
  className,
  compact = false,
  animated = true 
}: {
  className?: string;
  compact?: boolean;
  animated?: boolean;
}) {
  return (
    <CardSkeleton 
      className={cn(compact ? "p-3" : "p-4", className)} 
      ariaLabel="Загрузка лояльности"
      compact={compact}
      animated={animated}
    >
      <SkeletonHeading eyebrow compact={compact} />
      <div className="relative z-10 mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div 
          className={cn(
            "rounded-2xl border border-white/15 bg-white/6",
            compact ? "p-3" : "p-4"
          )} 
          aria-hidden
        >
          <SkeletonLine 
            width={compact ? 72 : 80} 
            height={compact ? 10 : 12} 
            muted 
            animated={animated}
          />
          <SkeletonLine 
            className="mt-2" 
            width={compact ? 80 : 96} 
            height={compact ? 28 : 32} 
            animated={animated}
          />
          <SkeletonLine 
            className="mt-2" 
            width={compact ? 160 : 180} 
            height={compact ? 10 : 12} 
            muted 
            animated={animated}
          />
          <SkeletonBadge 
            className="mt-3" 
            width={compact ? 96 : 112} 
            height={compact ? 32 : 36} 
            variant="brand"
            animated={animated}
          />
        </div>
        <div 
          className={cn(
            "rounded-2xl border border-white/15 bg-white/6",
            compact ? "p-3" : "p-4"
          )} 
          aria-hidden
        >
          <SkeletonLine 
            width={compact ? 80 : 96} 
            height={compact ? 10 : 12} 
            muted 
            animated={animated}
          />
          <SkeletonLine 
            className="mt-2" 
            width={compact ? 96 : 112} 
            height={compact ? 28 : 32} 
            animated={animated}
          />
          <SkeletonLine 
            className="mt-2" 
            width={"100%"} 
            height={compact ? 6 : 8} 
            muted 
            animated={animated}
          />
          <SkeletonBadge 
            className="mt-3" 
            width={compact ? 96 : 112} 
            height={compact ? 32 : 36} 
            animated={animated}
          />
        </div>
      </div>
      <SkeletonLine 
        className="mt-4" 
        width={"100%"} 
        height={compact ? 48 : 64} 
        muted 
        animated={animated}
      />
    </CardSkeleton>
  );
}

/* ====================== Глобальные keyframes ====================== */
export function ShimmerStyles() {
  return (
    <style jsx global>{`
      @keyframes shimmer {
        0% {
          transform: translateX(-100%);
        }
        100% {
          transform: translateX(100%);
        }
      }
      
      @keyframes pulse {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0.7;
        }
      }
      
      @media (prefers-reduced-motion: reduce) {
        [class*="animate-"], [style*="animation"] {
          animation: none !important;
        }
      }
    `}</style>
  );
}