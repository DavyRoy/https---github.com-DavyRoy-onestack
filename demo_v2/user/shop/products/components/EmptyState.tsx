"use client";

import type { ReactNode } from "react";
import { 
  cn, 
  CARD_SOFT, 
  CARD_BASE, 
  TITLE_SM, 
  SUBTITLE_SM, 
  BTN_PRIMARY, 
  BTN_GHOST,
  CHIP,
  TAPPABLE 
} from "./_shared";

type Tone = "neutral" | "brand" | "info" | "success" | "warning" | "danger" | "premium";
type Size = "sm" | "md" | "lg" | "xl";
type Variant = "default" | "glass" | "minimal" | "card";

type EmptyStateProps = {
  title: string;
  description?: string;
  /** Любая нода. По умолчанию — "•". */
  icon?: ReactNode;
  /** CTA-кнопка или набор экшенов. */
  action?: ReactNode;
  /** Вторичное действие */
  secondaryAction?: ReactNode;
  /** Доп. классы для корня. */
  className?: string;

  /** Визуальный тон оформления. */
  tone?: Tone;
  /** Размер вертикальных отступов и иконки. */
  size?: Size;
  /** Вариант оформления */
  variant?: Variant;
  /** Пунктирная рамка (по умолчанию true для «пусто»). */
  dashed?: boolean;

  /** Включить live-region для озвучивания (false чтобы отключить). */
  ariaLive?: "polite" | "assertive" | false;
  /** id заголовка для aria-labelledby (если нужно явно связать). */
  titleId?: string;
  /** id описания для aria-describedby. */
  descriptionId?: string;

  /** Классы для контейнера иконки. */
  iconClassName?: string;
  /** Фон с градиентом */
  gradient?: boolean;
  /** Анимированная иконка */
  animated?: boolean;
};

export default function EmptyState({
  title,
  description,
  icon = "•",
  action,
  secondaryAction,
  className,

  tone = "neutral",
  size = "lg",
  variant = "default",
  dashed = true,

  ariaLive = "polite",
  titleId,
  descriptionId,

  iconClassName,
  gradient = false,
  animated = false,
}: EmptyStateProps) {
  const toneCls: Record<Tone, { 
    wrap: string; 
    text: string; 
    icon: string;
    gradient: string;
  }> = {
    neutral: {
      wrap: "border-white/12 bg-white/8",
      text: "text-white/70",
      icon: "border-white/14 bg-white/10 text-white/70",
      gradient: "from-white/10 to-white/5",
    },
    brand: {
      wrap: "border-blue-500/30 bg-blue-500/8",
      text: "text-blue-200",
      icon: "border-blue-500/40 bg-blue-500/12 text-blue-300",
      gradient: "from-blue-500/15 to-purple-500/10",
    },
    info: {
      wrap: "border-sky-500/30 bg-sky-500/10",
      text: "text-sky-200",
      icon: "border-sky-500/40 bg-sky-500/15 text-sky-300",
      gradient: "from-sky-500/15 to-blue-500/10",
    },
    success: {
      wrap: "border-emerald-500/30 bg-emerald-500/10",
      text: "text-emerald-200",
      icon: "border-emerald-500/40 bg-emerald-500/15 text-emerald-300",
      gradient: "from-emerald-500/15 to-green-500/10",
    },
    warning: {
      wrap: "border-amber-500/30 bg-amber-500/10",
      text: "text-amber-200",
      icon: "border-amber-500/40 bg-amber-500/15 text-amber-300",
      gradient: "from-amber-500/15 to-orange-500/10",
    },
    danger: {
      wrap: "border-rose-500/30 bg-rose-500/10",
      text: "text-rose-200",
      icon: "border-rose-500/40 bg-rose-500/15 text-rose-300",
      gradient: "from-rose-500/15 to-red-500/10",
    },
    premium: {
      wrap: "border-purple-500/30 bg-purple-500/10",
      text: "text-purple-200",
      icon: "border-purple-500/40 bg-purple-500/15 text-purple-300",
      gradient: "from-purple-500/15 to-pink-500/10",
    },
  };

  const sizeCls: Record<Size, { 
    pad: string; 
    iconBox: string; 
    title: string;
    gap: string;
  }> = {
    sm: { 
      pad: "px-4 py-6", 
      iconBox: "h-8 w-8 text-sm", 
      title: "text-sm",
      gap: "gap-2"
    },
    md: { 
      pad: "px-5 py-10", 
      iconBox: "h-10 w-10 text-base", 
      title: "text-base",
      gap: "gap-3"
    },
    lg: { 
      pad: "px-6 py-16", 
      iconBox: "h-12 w-12 text-lg", 
      title: "text-lg",
      gap: "gap-4"
    },
    xl: { 
      pad: "px-8 py-20", 
      iconBox: "h-16 w-16 text-xl", 
      title: "text-xl",
      gap: "gap-5"
    },
  };

  const variantCls: Record<Variant, string> = {
    default: "rounded-2xl border backdrop-blur-md",
    glass: "admin-glass rounded-2xl border border-white/18 backdrop-blur-xl",
    minimal: "bg-transparent border-transparent backdrop-blur-none",
    card: cn(CARD_SOFT, "backdrop-blur-lg"),
  };

  const RootTag = ariaLive ? ("section" as const) : ("div" as const);

  const renderIcon = () => {
    const iconContent = (
      <div
        className={cn(
          "flex items-center justify-center rounded-full border backdrop-blur-sm transition-all duration-300",
          sizeCls[size].iconBox,
          toneCls[tone].icon,
          animated && "animate-pulse",
          iconClassName
        )}
        aria-hidden
      >
        {icon}
      </div>
    );

    if (gradient) {
      return (
        <div className="relative">
          <div 
            className={cn(
              "absolute inset-0 rounded-full blur-md opacity-60 transition-opacity duration-500",
              `bg-gradient-to-r ${toneCls[tone].gradient}`
            )}
          />
          {iconContent}
        </div>
      );
    }

    return iconContent;
  };

  const renderActions = () => {
    if (!action && !secondaryAction) return null;

    return (
      <div className={cn(
        "flex flex-col sm:flex-row gap-3 justify-center items-center mt-4",
        size === "sm" && "mt-3",
        size === "xl" && "mt-6"
      )}>
        {action && (
          <div className={cn(TAPPABLE, "shrink-0")}>
            {action}
          </div>
        )}
        {secondaryAction && (
          <div className={cn(TAPPABLE, "shrink-0")}>
            {secondaryAction}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <RootTag
        className={cn(
          "flex flex-col items-center justify-center text-center transition-all duration-500",
          variantCls[variant],
          dashed ? "border-dashed" : "border-solid",
          gradient && `bg-gradient-to-br ${toneCls[tone].gradient}`,
          sizeCls[size].pad,
          sizeCls[size].gap,
          className
        )}
        role={ariaLive ? "status" : undefined}
        aria-live={ariaLive || undefined}
        aria-atomic={ariaLive ? true : undefined}
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
      >
        {/* Иконка/бейдж */}
        {renderIcon()}

        {/* Текст */}
        <div className={cn("space-y-2 max-w-md", size === "xl" && "space-y-3 max-w-lg")}>
          <h3
            id={titleId}
            className={cn(
              "font-semibold text-white/95 leading-tight",
              sizeCls[size].title,
              size === "xl" && "text-2xl"
            )}
          >
            {title}
          </h3>

          {description && (
            <p 
              id={descriptionId} 
              className={cn(
                "leading-relaxed text-white/70",
                size === "sm" ? "text-xs" : "text-sm",
                size === "xl" && "text-base",
                toneCls[tone].text
              )}
            >
              {description}
            </p>
          )}
        </div>

        {/* Действия */}
        {renderActions()}
      </RootTag>

      {/* Глобальный high-contrast стиль для forced-colors */}
      <style jsx global>{`
        @media (forced-colors: active) {
          .forced-border {
            border-color: CanvasText;
          }
        }
      `}</style>
    </>
  );
}

// Дополнительные компоненты для удобства

type EmptyStateActionProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function EmptyStateAction({ 
  children, 
  variant = "primary", 
  size = "md",
  className 
}: EmptyStateActionProps) {
  const variantStyles = {
    primary: BTN_PRIMARY,
    secondary: BTN_GHOST,
    ghost: cn(BTN_GHOST, "border-transparent bg-transparent hover:bg-white/5")
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-2.5 text-base"
  };

  return (
    <button className={cn(
      variantStyles[variant],
      sizeStyles[size],
      className
    )}>
      {children}
    </button>
  );
}

// Предопределенные пустые состояния

type CommonEmptyStateProps = Omit<EmptyStateProps, 'icon' | 'title' | 'description'> & {
  title?: string;
  description?: string;
};

export function EmptySearch(props: CommonEmptyStateProps) {
  return (
    <EmptyState
      icon="🔍"
      title={props.title || "Ничего не найдено"}
      description={props.description || "Попробуйте изменить параметры поиска или фильтры"}
      tone="neutral"
      {...props}
    />
  );
}

export function EmptyCart(props: CommonEmptyStateProps) {
  return (
    <EmptyState
      icon="🛒"
      title={props.title || "Корзина пуста"}
      description={props.description || "Добавьте товары, чтобы сделать заказ"}
      tone="brand"
      action={props.action || <EmptyStateAction>Начать покупки</EmptyStateAction>}
      {...props}
    />
  );
}

export function EmptyProducts(props: CommonEmptyStateProps) {
  return (
    <EmptyState
      icon="📦"
      title={props.title || "Товары не найдены"}
      description={props.description || "В этой категории пока нет товаров"}
      tone="info"
      {...props}
    />
  );
}

export function EmptyFavorites(props: CommonEmptyStateProps) {
  return (
    <EmptyState
      icon="❤️"
      title={props.title || "Нет избранных товаров"}
      description={props.description || "Добавляйте товары в избранное, чтобы вернуться к ним позже"}
      tone="danger"
      action={props.action || <EmptyStateAction>Перейти к товарам</EmptyStateAction>}
      {...props}
    />
  );
}

export function EmptyOrders(props: CommonEmptyStateProps) {
  return (
    <EmptyState
      icon="📋"
      title={props.title || "Заказов пока нет"}
      description={props.description || "После оформления заказа он появится в этом разделе"}
      tone="warning"
      action={props.action || <EmptyStateAction>Сделать первый заказ</EmptyStateAction>}
      {...props}
    />
  );
}

export function EmptyNotifications(props: CommonEmptyStateProps) {
  return (
    <EmptyState
      icon="🔔"
      title={props.title || "Уведомлений нет"}
      description={props.description || "Здесь будут появляться важные уведомления и обновления"}
      tone="neutral"
      {...props}
    />
  );
}

export function EmptyMessages(props: CommonEmptyStateProps) {
  return (
    <EmptyState
      icon="💬"
      title={props.title || "Сообщений нет"}
      description={props.description || "Начните общение, и сообщения появятся здесь"}
      tone="info"
      action={props.action || <EmptyStateAction>Написать сообщение</EmptyStateAction>}
      {...props}
    />
  );
}