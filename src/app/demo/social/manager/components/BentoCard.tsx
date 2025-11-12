"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils"; // optional: shadcn/ui helper; replace with your own cn if needed

/**
 * BentoCard – универсальная карточка для «бенто»-сетки
 *
 * Особенности:
 * - Градиентная рамка с мягким свечением
 * - Анимация наведения/нажатия (framer-motion)
 * - Поддержка href (оборачивается в <Link/>) или как обычный <div>
 * - Иконка, заголовок, описание и произвольные children
 * - Полностью управляемые className и gradientClass для кастомизации
 */

export type BentoCardProps = React.PropsWithChildren<{
  /** Заголовок карточки */
  title: string;
  /** Краткое описание карточки */
  description?: string;
  /** Иконка или любой React-элемент слева сверху */
  icon?: React.ReactNode;
  /** Ссылка: если задана, карточка становится кликабельной */
  href?: string;
  /** Внешняя ссылка? */
  external?: boolean;
  /** Кастомные классы контейнера */
  className?: string;
  /** Классы градиента рамки */
  gradientClass?: string;
  /** Управляет «интерактивностью» (ховер/тап эффекты) */
  interactive?: boolean;
}>;

const DefaultGradient =
  "from-indigo-500/25 via-purple-500/25 to-fuchsia-500/25 dark:from-indigo-500/20 dark:via-purple-500/20 dark:to-fuchsia-500/20";

export const BentoCard = React.forwardRef<HTMLDivElement, BentoCardProps>(
  (
    {
      title,
      description,
      icon,
      href,
      external,
      className,
      gradientClass = DefaultGradient,
      interactive = true,
      children,
    },
    ref
  ) => {
    const Content = (
      <motion.div
        initial={{ y: 0, scale: 1, boxShadow: "none" }}
        whileHover={interactive ? { y: -2 } : undefined}
        whileTap={interactive ? { scale: 0.98 } : undefined}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={cn(
          "relative h-full w-full rounded-2xl p-4 md:p-5",
          "bg-white/70 backdrop-blur dark:bg-zinc-900/60",
          "ring-1 ring-zinc-200/60 dark:ring-zinc-800/80",
          // градиентная рамка через before
          "before:absolute before:inset-[1px] before:rounded-[calc(theme(borderRadius.2xl)-1px)]",
          "before:p-[1px] before:bg-gradient-to-br",
          gradientClass,
          "before:content-[''] before:-z-10",
          // мягкое свечение при ховере
          interactive &&
            "hover:shadow-lg hover:shadow-purple-500/10 dark:hover:shadow-purple-900/20",
          className
        )}
        ref={ref}
      >
        {/* Внутренний контент */}
        <div className="flex items-start gap-3">
          {icon && (
            <div className="shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-inset ring-zinc-200/70 dark:ring-zinc-800/70">
              {icon}
            </div>
          )}
          <div className="min-w-0">
            <h3 className="text-base md:text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              {title}
            </h3>
            {description && (
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">
                {description}
              </p>
            )}
          </div>
        </div>

        {children && <div className="mt-4">{children}</div>}

        {/* стрелка справа снизу */}
        {href && (
          <div className="pointer-events-none absolute bottom-3 right-3 text-zinc-400 dark:text-zinc-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
              aria-hidden
            >
              <path d="M13 5h6a1 1 0 0 1 1 1v6h-2V8.414l-9.293 9.293-1.414-1.414L16.586 7H13V5Z" />
            </svg>
          </div>
        )}
      </motion.div>
    );

    // Если есть href – оборачиваем в Link/anchor, иначе обычный div
    if (href) {
      const Anchor = (
        <Link
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className={cn(
            "block focus:outline-none",
            // focus-visible стиль на обёртке
            "focus-visible:ring-2 focus-visible:ring-purple-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-900 rounded-2xl"
          )}
        >
          {Content}
        </Link>
      );

      return Anchor as unknown as JSX.Element;
    }

    return Content;
  }
);
BentoCard.displayName = "BentoCard";

/**
 * Утилита-сетка под «бенто»-карточки
 * Пример:
 * <BentoGrid>
 *   <BentoCard ... />
 *   <BentoCard className="md:col-span-2" ... />
 * </BentoGrid>
 */
export function BentoGrid({
  className,
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5",
        className
      )}
    >
      {children}
    </div>
  );
}

export default BentoCard;
