"use client";

import { useMemo, useRef, useState, useEffect, useCallback, useId } from "react";
import Link from "next/link";
import Script from "next/script";
import { 
  ChevronRight, 
  Home, 
  MoreHorizontal,
  ChevronLeft,
  ChevronRight as ChevronRightIcon
} from "lucide-react";
import { cn, TAPPABLE, CHIP, CHIP_SOLID, FOCUS_RING } from "./_shared";

export type BreadcrumbItem = {
  href: string;
  label: string;
  isCurrent?: boolean;
  icon?: React.ReactNode;
};

type Props = {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  srLabel?: string;
  className?: string;
  jsonLd?: boolean;
  /** после скольких элементов сворачивать */
  collapseAfter?: number;
  variant?: "default" | "glass" | "minimal" | "elevated";
  showHome?: boolean;
  /** базовый домен для абсолютных ссылок в JSON-LD */
  baseUrl?: string;
  /** Размер компонента */
  size?: "sm" | "md" | "lg";
};

export default function Breadcrumbs({
  items,
  separator = <ChevronRight className="h-3.5 w-3.5 text-white/30 flex-shrink-0" />,
  srLabel = "Навигационная цепочка",
  className,
  jsonLd = false,
  collapseAfter = 3,
  variant = "default",
  showHome = true,
  baseUrl = "https://onestack24.ru",
  size = "md",
}: Props) {
  const scriptId = useId();

  /* ---------- Источник + home ---------- */
  const sourceItems = useMemo(() => {
    let processed = items ?? [];
    if (showHome && processed.length > 0 && processed[0]?.href !== "/") {
      processed = [
        {
          href: "/",
          label: "Главная",
          icon: <Home className="h-3.5 w-3.5 flex-shrink-0" />,
        },
        ...processed,
      ];
    }
    return processed;
  }, [items, showHome]);

  /* ---------- Нормализация: помечаем последний как current ---------- */
  const normalized = useMemo(() => {
    const lastIndex = sourceItems.length - 1;
    return sourceItems.map((it, i) => ({
      ...it,
      isCurrent: i === lastIndex ? true : !!it.isCurrent,
    }));
  }, [sourceItems]);

  const hasItems = normalized.length > 0;

  /* ---------- Коллапс длинных троп ---------- */
  const shouldCollapse = normalized.length > collapseAfter;
  const [expanded, setExpanded] = useState(false);

  const visibleItems = useMemo(() => {
    if (!shouldCollapse || expanded) return normalized;
    
    // Умный алгоритм: показываем первый, последний и 1-2 элемента перед последним
    const first = normalized[0];
    const last = normalized[normalized.length - 1];
    const itemsToShow = [first];
    
    // Добавляем элементы перед последним (1 или 2 в зависимости от длины)
    const itemsBeforeLast = Math.min(2, normalized.length - 2);
    for (let i = normalized.length - 1 - itemsBeforeLast; i < normalized.length - 1; i++) {
      if (i > 0) { // Пропускаем первый, он уже добавлен
        itemsToShow.push(normalized[i]);
      }
    }
    
    // Добавляем разделитель если пропущены элементы
    if (normalized.length > itemsToShow.length + 1) {
      itemsToShow.splice(1, 0, { href: "", label: "…", isCurrent: false });
    }
    
    itemsToShow.push(last);
    return itemsToShow;
  }, [normalized, shouldCollapse, expanded, collapseAfter]);

  /* ---------- Горизонтальный скролл ---------- */
  const railRef = useRef<HTMLDivElement | null>(null);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const measureOverflow = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    const overflow = el.scrollWidth > el.clientWidth + 2;
    setHasOverflow(overflow);
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
  }, []);

  useEffect(() => {
    measureOverflow();
    const el = railRef.current;
    if (!el) return;

    const ro = new ResizeObserver(measureOverflow);
    ro.observe(el);

    const onScroll = () => measureOverflow();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measureOverflow);

    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measureOverflow);
    };
  }, [measureOverflow]);

  // Автопрокрутка вправо при первом рендере/изменении
  useEffect(() => {
    const el = railRef.current;
    if (!el || !hasOverflow) return;
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const reduced = media?.matches ?? false;
    const behavior: ScrollBehavior = reduced ? "auto" : "smooth";
    const id = window.setTimeout(() => {
      el.scrollTo({ left: el.scrollWidth, behavior });
    }, 100);
    return () => window.clearTimeout(id);
  }, [hasOverflow, visibleItems.length]);

  const scrollBy = useCallback((dir: "left" | "right") => {
    const el = railRef.current;
    if (!el) return;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    const behavior: ScrollBehavior = reduced ? "auto" : "smooth";
    const delta = Math.max(280, el.clientWidth * 0.8) * (dir === "left" ? -1 : 1);
    el.scrollBy({ left: delta, behavior });
  }, []);

  /* ---------- JSON-LD ---------- */
  const jsonLdData = useMemo(() => {
    if (!jsonLd) return null;
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: normalized.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.label,
        item: item.href.startsWith("http") ? item.href : `${baseUrl}${item.href}`,
      })),
    };
  }, [jsonLd, normalized, baseUrl]);

  /* ---------- Варианты и размеры ---------- */
  const variantStyles = {
    default: cn(
      "bg-white/5 backdrop-blur-xl border border-white/10",
      "hover:bg-white/8 hover:border-white/15 transition-colors duration-300"
    ),
    glass: cn(
      "border border-white/15 bg-white/10 backdrop-blur-2xl",
      "hover:border-white/22 hover:bg-white/12 transition-all duration-300"
    ),
    minimal: cn(
      "bg-transparent border-transparent backdrop-blur-none shadow-none"
    ),
    elevated: cn(
      "bg-gradient-to-r from-white/8 to-white/6 backdrop-blur-2xl",
      "border border-white/15 shadow-lg shadow-black/10",
      "hover:shadow-xl hover:shadow-black/20 transition-all duration-300"
    ),
  };

  const sizeStyles = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-5 py-4 text-lg",
  };

  const itemSizeStyles = {
    sm: "px-2 py-1 text-xs gap-1.5",
    md: "px-3 py-1.5 text-sm gap-2",
    lg: "px-4 py-2 text-base gap-2.5",
  };

  if (!hasItems) {
    return jsonLdData ? (
      <Script 
        id={`ld-breadcrumbs-${scriptId}`} 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }} 
      />
    ) : null;
  }

  return (
    <>
      <div className={cn("relative group", className)}>
        {/* Контейнер навигации */}
        <nav
          aria-label={srLabel}
          ref={railRef}
          tabIndex={0}
          className={cn(
            "no-scrollbar relative max-w-full overflow-x-auto rounded-2xl outline-none transition-all duration-500",
            variantStyles[variant],
            sizeStyles[size],
            hasOverflow && cn(
              "[mask-image:linear-gradient(to_right,transparent,black_20px,black_calc(100%-20px),transparent)]",
              "pr-14 pl-14"
            ),
            "focus-visible:ring-4 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050911]"
          )}
        >
          <ol className="flex items-center gap-2 whitespace-nowrap">
            {visibleItems.map((item, index) => {
              const isFirst = index === 0;
              const isEllipsis = item.label === "…";

              const Separator = !isFirst ? (
                <li 
                  key={`sep-${index}`} 
                  aria-hidden="true" 
                  className="flex items-center text-white/20 transition-colors duration-300 group-hover:text-white/30"
                >
                  {separator}
                </li>
              ) : null;

              if (isEllipsis) {
                return (
                  <li key={`ellipsis-${index}`} className="flex items-center">
                    {Separator}
                    <button
                      type="button"
                      onClick={() => {
                        setExpanded(true);
                        // После разворота даем время на рендер и скроллим
                        setTimeout(() => scrollBy("right"), 50);
                      }}
                      className={cn(
                        CHIP,
                        "hover:bg-white/20 hover:border-white/25 hover:scale-105 transition-all duration-300",
                        itemSizeStyles[size]
                      )}
                      aria-label="Показать все пункты навигации"
                      title="Развернуть навигацию"
                    >
                      <MoreHorizontal className="h-3.5 w-3.5" />
                      <span className="sr-only">Развернуть навигацию</span>
                    </button>
                  </li>
                );
              }

              const ItemContent = (
                <span className="flex items-center gap-2 min-w-0 max-w-[200px] sm:max-w-[280px]">
                  {item.icon && (
                    <span 
                      className={cn(
                        "flex-shrink-0 transition-colors duration-300",
                        item.isCurrent ? "text-white/80" : "text-white/50"
                      )} 
                      aria-hidden="true"
                    >
                      {item.icon}
                    </span>
                  )}
                  <span
                    className={cn(
                      "transition-all duration-300 truncate font-medium",
                      item.isCurrent 
                        ? "text-white" 
                        : "text-white/70 hover:text-white"
                    )}
                    title={item.label}
                  >
                    {item.label}
                  </span>
                </span>
              );

              return (
                <li key={`${item.href}-${index}`} className="flex items-center">
                  {Separator}
                  {item.isCurrent ? (
                    <span
                      aria-current="page"
                      className={cn(
                        "flex items-center gap-2 select-none transition-all duration-300",
                        itemSizeStyles[size],
                        variant !== "minimal" && cn(
                          "bg-white/10 rounded-xl border border-white/10",
                          "hover:bg-white/15 hover:border-white/15"
                        )
                      )}
                      title={item.label}
                    >
                      {ItemContent}
                    </span>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 rounded-xl transition-all duration-300",
                        itemSizeStyles[size],
                        "hover:bg-white/10 hover:scale-105",
                        "focus:outline-none focus-visible:bg-white/10 focus-visible:scale-105",
                        TAPPABLE,
                        FOCUS_RING
                      )}
                      title={item.label}
                    >
                      {ItemContent}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Стрелки прокрутки при переполнении */}
        {hasOverflow && (
          <div className="pointer-events-none absolute inset-y-0 left-0 right-0">
            {/* Левая стрелка */}
            <button
              type="button"
              onClick={() => scrollBy("left")}
              className={cn(
                "pointer-events-auto absolute left-2 top-1/2 -translate-y-1/2",
                "flex items-center justify-center rounded-xl backdrop-blur-2xl transition-all duration-300",
                "border border-white/15 bg-white/10 text-white/70",
                "hover:bg-white/20 hover:text-white hover:border-white/20 hover:scale-110",
                "focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30",
                TAPPABLE,
                FOCUS_RING,
                size === "sm" && "h-7 w-7",
                size === "md" && "h-8 w-8",
                size === "lg" && "h-9 w-9",
                !canScrollLeft && "opacity-0 pointer-events-none"
              )}
              aria-label="Прокрутить влево"
              disabled={!canScrollLeft}
            >
              <ChevronLeft className={cn(
                size === "sm" && "h-3.5 w-3.5",
                size === "md" && "h-4 w-4",
                size === "lg" && "h-4.5 w-4.5"
              )} />
            </button>

            {/* Правая стрелка */}
            <button
              type="button"
              onClick={() => scrollBy("right")}
              className={cn(
                "pointer-events-auto absolute right-2 top-1/2 -translate-y-1/2",
                "flex items-center justify-center rounded-xl backdrop-blur-2xl transition-all duration-300",
                "border border-white/15 bg-white/10 text-white/70",
                "hover:bg-white/20 hover:text-white hover:border-white/20 hover:scale-110",
                "focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30",
                TAPPABLE,
                FOCUS_RING,
                size === "sm" && "h-7 w-7",
                size === "md" && "h-8 w-8",
                size === "lg" && "h-9 w-9",
                !canScrollRight && "opacity-0 pointer-events-none"
              )}
              aria-label="Прокрутить вправо"
              disabled={!canScrollRight}
            >
              <ChevronRightIcon className={cn(
                size === "sm" && "h-3.5 w-3.5",
                size === "md" && "h-4 w-4",
                size === "lg" && "h-4.5 w-4.5"
              )} />
            </button>
          </div>
        )}

        {/* Индикатор переполнения (только для десктопа) */}
        {hasOverflow && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 hidden sm:block">
            <div className="flex gap-1">
              {[1, 2, 3].map((dot) => (
                <div
                  key={dot}
                  className={cn(
                    "h-1 w-1 rounded-full bg-white/30 transition-all duration-500",
                    "group-hover:bg-white/50 animate-pulse"
                  )}
                  style={{ animationDelay: `${dot * 200}ms` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* JSON-LD */}
      {jsonLdData && (
        <Script
          id={`ld-breadcrumbs-${scriptId}`}
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
      )}

      {/* Локальные стили для скрытия скроллбара */}
      <style jsx>{`
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }
      `}</style>
    </>
  );
}

// Дополнительные компоненты для удобства использования

type BreadcrumbsSimpleProps = Omit<Props, 'variant' | 'size'>;

export function BreadcrumbsGlass(props: BreadcrumbsSimpleProps) {
  return <Breadcrumbs {...props} variant="glass" />;
}

export function BreadcrumbsMinimal(props: BreadcrumbsSimpleProps) {
  return <Breadcrumbs {...props} variant="minimal" />;
}

export function BreadcrumbsElevated(props: BreadcrumbsSimpleProps) {
  return <Breadcrumbs {...props} variant="elevated" />;
}

export function BreadcrumbsSmall(props: BreadcrumbsSimpleProps) {
  return <Breadcrumbs {...props} size="sm" />;
}

export function BreadcrumbsLarge(props: BreadcrumbsSimpleProps) {
  return <Breadcrumbs {...props} size="lg" />;
}
