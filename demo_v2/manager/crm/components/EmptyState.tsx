"use client";

import Link from "next/link";
import { T } from "@/app/demo/manager/_parts/tokens";
import { ReactNode, useId } from "react";

/** CTA: можно передать либо href (Link), либо onClick (button) */
type CtaBase = {
  label: string;
  kind?: "primary" | "ghost";
  /** aria-label для уточнения действия, если текст короткий */
  ariaLabel?: string;
};
type CtaLink = CtaBase & { href: string; onClick?: never };
type CtaButton = CtaBase & { href?: never; onClick: () => void };
type Cta = CtaLink | CtaButton | undefined;

export default function EmptyState({
  title,
  hint,
  icon,
  ctaPrimary,
  ctaSecondary,
  children,
  className,
  align = "center",
  compact = false,
  iconTone = "default",
  iconSize = "md",
  role = "status",
  live = "polite",
}: {
  title: string;
  hint?: string;
  /** Необязательная иконка/иллюстрация сверху */
  icon?: ReactNode;
  /** Основное действие */
  ctaPrimary?: Cta;
  /** Доп. действие (справа от основного) */
  ctaSecondary?: Cta;
  /** Произвольный контент (например, подсказки списком) */
  children?: ReactNode;
  /** Кастомный класс-обёртка */
  className?: string;
  /** Выравнивание контента */
  align?: "center" | "left";
  /** Компактный вертикальный режим */
  compact?: boolean;
  /** Тон иконки/бейджа */
  iconTone?: "default" | "sky" | "amber" | "violet" | "emerald" | "rose";
  /** Размер иконки-капсулы */
  iconSize?: "sm" | "md" | "lg";
  /** ARIA роль контейнера (по умолчанию status) */
  role?: "status" | "region" | "none";
  /** Политика aria-live */
  live?: "off" | "polite" | "assertive";
}) {
  const hintId = useId();
  const tipsId = useId();

  // Свяжем описания с заголовком для скринридеров
  const describedBy =
    [hint ? hintId : null, children ? tipsId : null].filter(Boolean).join(" ") ||
    undefined;

  const wrap = [
    T.card,
    "grid place-items-start sm:place-items-center",
    align === "center" ? "text-center sm:text-center" : "text-left sm:text-left",
    compact ? "py-6 gap-2" : "py-8 sm:py-10 gap-3",
    className || "",
  ].join(" ");

  const badgeTone =
    iconTone === "sky"
      ? "border-sky-300/25 bg-sky-400/10 text-white/85"
      : iconTone === "amber"
      ? "border-amber-300/25 bg-amber-400/10 text-white/85"
      : iconTone === "violet"
      ? "border-violet-300/25 bg-violet-400/10 text-white/85"
      : iconTone === "emerald"
      ? "border-emerald-300/25 bg-emerald-400/10 text-white/85"
      : iconTone === "rose"
      ? "border-rose-300/25 bg-rose-400/10 text-white/85"
      : "border-white/15 bg-white/8 text-white/85";

  const badgeSize =
    iconSize === "sm"
      ? "rounded-xl p-2"
      : iconSize === "lg"
      ? "rounded-2xl p-4"
      : "rounded-2xl p-3";

  return (
    <section className={wrap} role={role} aria-live={live}>
      {icon && (
        <div
          className={[
            "mx-auto inline-flex items-center justify-center",
            "ring-1 ring-inset",
            badgeTone,
            badgeSize,
          ].join(" ")}
        >
          {icon}
        </div>
      )}

      <h3 className="text-base font-semibold" aria-describedby={describedBy}>
        {title}
      </h3>

      {hint && (
        <p
          id={hintId}
          className={
            "mx-auto max-w-prose text-sm " + T.dim + " [text-wrap:balance]"
          }
        >
          {hint}
        </p>
      )}

      {children && (
        <div
          id={tipsId}
          className={[
            "mx-auto max-w-prose",
            align === "center" ? "text-left sm:text-center" : "text-left",
            compact ? "text-sm mt-0.5" : "text-sm mt-1",
          ].join(" ")}
        >
          {children}
        </div>
      )}

      {(ctaPrimary || ctaSecondary) && (
        <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
          {ctaPrimary && <CtaButtonOrLink cta={ctaPrimary} primary />}
          {ctaSecondary && <CtaButtonOrLink cta={ctaSecondary} />}
        </div>
      )}
    </section>
  );
}

/* ---------- Вспомогательный рендер CTA ---------- */

function CtaButtonOrLink({
  cta,
  primary = false,
}: {
  cta: NonNullable<Parameters<typeof EmptyState>[0]["ctaPrimary"]>;
  primary?: boolean;
}) {
  const base =
    (primary && cta?.kind !== "ghost") || cta?.kind === "primary"
      ? "btn btn-primary"
      : "btn";

  if (!cta) return null;

  // Link-ветка
  if ("href" in cta && cta.href) {
    return (
      <Link
        href={cta.href}
        prefetch={false}
        className={base}
        aria-label={cta.ariaLabel || cta.label}
      >
        {cta.label}
      </Link>
    );
  }

  // Button-ветка
  if ("onClick" in cta && typeof cta.onClick === "function") {
    return (
      <button
        type="button"
        onClick={cta.onClick}
        className={base + " focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"}
        aria-label={cta.ariaLabel || cta.label}
      >
        {cta.label}
      </button>
    );
  }

  return null;
}