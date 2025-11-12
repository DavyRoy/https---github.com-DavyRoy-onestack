"use client";

import * as React from "react";
import Link from "next/link";

type Props = {
  title: string;
  subtitle?: string;
  rightSlot?: React.ReactNode; // кнопки/элементы справа
  backHref?: string;
  onBackClick?: () => void; // альтернатива для SPA-навигации
  className?: string;
};

/**
 * Заголовок страницы клиента CRM
 * Используется на страницах профиля, редактирования, просмотра.
 */
export default function ClientHeader({
  title,
  subtitle,
  rightSlot,
  backHref,
  onBackClick,
  className = "",
}: Props) {
  const BackButton = () => {
    const handleClick = (e: React.MouseEvent) => {
      if (onBackClick) {
        e.preventDefault();
        onBackClick();
      }
    };
    if (backHref) {
      return (
        <Link
          href={backHref}
          onClick={handleClick}
          className="rounded-lg border border-white/15 px-2 py-1 text-xs hover:bg-white/[0.06] transition-colors"
          aria-label="Назад"
        >
          ← Назад
        </Link>
      );
    }
    if (onBackClick) {
      return (
        <button
          onClick={handleClick}
          className="rounded-lg border border-white/15 px-2 py-1 text-xs hover:bg-white/[0.06] transition-colors"
          aria-label="Назад"
        >
          ← Назад
        </button>
      );
    }
    return null;
  };

  return (
    <header
      className={`rounded-2xl border border-white/15 bg-white/[0.05] px-4 py-3 md:px-5 md:py-4 ${className}`}
    >
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <BackButton />
            <h1
              className="text-lg md:text-xl font-semibold truncate"
              title={title}
            >
              {title}
            </h1>
          </div>
          {subtitle && (
            <p
              className="mt-1 text-sm text-white/70 line-clamp-2"
              title={subtitle}
            >
              {subtitle}
            </p>
          )}
        </div>

        {rightSlot && (
          <div className="shrink-0 flex flex-wrap gap-2 justify-end">
            {rightSlot}
          </div>
        )}
      </div>
    </header>
  );
}