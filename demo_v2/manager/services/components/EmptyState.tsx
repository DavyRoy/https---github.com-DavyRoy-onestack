"use client";

import Link from "next/link";
import { Sparkles, RotateCcw } from "lucide-react";
import { T } from "@/app/demo/manager/_parts/tokens";

type Action = { label: string; onClick?: () => void; href?: string };

type Props = {
  title?: string;
  subtitle?: string;
  actionLabel?: string;
  href?: string; // первичная кнопка-ссылка
  onAction?: () => void; // первичная кнопка-действие
  secondary?: Action[];
};

export default function EmptyState({
  title = "Услуги не найдены",
  subtitle = "Измените фильтры поиска или сбросьте их, чтобы увидеть доступные услуги.",
  actionLabel,
  href,
  onAction,
  secondary = [],
}: Props) {
  // функция для сброса фильтров (с защитой от SSR)
  const handleReset = () => {
    if (typeof window === "undefined") return;
    const url = window.location.pathname;
    window.history.replaceState({}, "", url);
    window.location.assign(url);
  };

  return (
    <div
      className={`${T.card} text-center grid gap-3 place-items-center`}
      role="status"
      aria-live="polite"
    >
      <div className="mx-auto grid place-items-center h-12 w-12 rounded-2xl border border-white/15 bg-white/10">
        <Sparkles width={18} height={18} className="opacity-80" />
      </div>

      <div className="text-base font-semibold text-white">{title}</div>
      {subtitle && (
        <p className={`text-sm ${T.dim} max-w-[52ch]`}>{subtitle}</p>
      )}

      <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
        {actionLabel && (href || onAction) && (
          href ? (
            <Link
              href={href}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-3.5 py-2 text-sm font-medium text-black hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              {actionLabel}
            </Link>
          ) : (
            <button
              onClick={onAction}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-3.5 py-2 text-sm font-medium text-black hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              {actionLabel}
            </button>
          )
        )}

        <button
          onClick={handleReset}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2 text-sm hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30"
        >
          <RotateCcw width={14} height={14} /> Сбросить фильтры
        </button>

        {secondary.map((s, i) =>
          s.href ? (
            <Link
              key={i}
              href={s.href}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2 text-sm hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              {s.label}
            </Link>
          ) : (
            <button
              key={i}
              onClick={s.onClick}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2 text-sm hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              {s.label}
            </button>
          )
        )}
      </div>
    </div>
  );
}