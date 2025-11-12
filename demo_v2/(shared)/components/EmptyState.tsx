// app/(shared)/components/EmptyState.tsx
"use client";

import * as React from "react";
import Link from "next/link";

type Variant = "default" | "muted" | "warning";
type Size = "sm" | "md" | "lg";

type ActionBase = {
  label: string;
  ariaLabel?: string;
  disabled?: boolean;
  className?: string;
};
type ActionLink = ActionBase & { href: string; onClick?: never };
type ActionButton = ActionBase & { href?: never; onClick: React.MouseEventHandler<HTMLButtonElement> };
type Action = ActionLink | ActionButton;

export type EmptyStateProps = {
  title: string;
  hint?: string;
  className?: string;
  icon?: React.ReactNode;
  variant?: Variant;
  size?: Size;
  primaryAction?: Action;
  secondaryAction?: Action;
  children?: React.ReactNode;
  live?: "off" | "polite" | "assertive";
};

function cls(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

const wrapByVariant: Record<Variant, string> = {
  default: "border-white/15 bg-white/[0.05]",
  muted: "border-white/10 bg-white/[0.035]",
  warning: "border-amber-400/20 bg-amber-500/[0.08]",
};

const titleBySize: Record<Size, string> = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-xl",
};

const padBySize: Record<Size, string> = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

const iconBySize: Record<Size, string> = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

const gapBySize: Record<Size, string> = {
  sm: "gap-2",
  md: "gap-3",
  lg: "gap-4",
};

function ActionView({ action, kind = "primary" }: { action: Action; kind?: "primary" | "secondary" }) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30";
  const primary =
    "bg-white text-black hover:bg-white/90 disabled:opacity-50 disabled:pointer-events-none";
  const secondary =
    "border border-white/15 bg-white/10 hover:bg-white/15 text-white disabled:opacity-50 disabled:pointer-events-none";
  const className = cls(base, kind === "primary" ? primary : secondary, action.className);

  if ("href" in action) {
    return (
      <Link
        prefetch={false}
        href={action.href}
        className={className}
        aria-label={action.ariaLabel ?? action.label}
      >
        {action.label}
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={action.onClick}
      className={className}
      aria-label={action.ariaLabel ?? action.label}
      disabled={action.disabled}
    >
      {action.label}
    </button>
  );
}

export default function EmptyState({
  title,
  hint,
  className = "",
  icon,
  variant = "default",
  size = "md",
  primaryAction,
  secondaryAction,
  children,
  live = "off",
}: EmptyStateProps) {
  return (
    <section
      role="status"
      aria-live={live === "off" ? undefined : live}
      className={cls(
        "rounded-2xl border backdrop-blur-sm text-center",
        wrapByVariant[variant],
        padBySize[size],
        className
      )}
    >
      <div className={cls("mx-auto flex max-w-lg flex-col items-center", gapBySize[size])}>
        {icon ? (
          <div
            className={cls(
              "inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/10",
              iconBySize[size]
            )}
            aria-hidden
          >
            {icon}
          </div>
        ) : null}

        <h3 className={cls("font-medium tracking-tight", titleBySize[size])}>{title}</h3>

        {hint && <p className="text-sm text-white/70">{hint}</p>}

        {children ? <div className="mt-1 text-left">{children}</div> : null}

        {(primaryAction || secondaryAction) && (
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
            {primaryAction && <ActionView action={primaryAction} kind="primary" />}
            {secondaryAction && <ActionView action={secondaryAction} kind="secondary" />}
          </div>
        )}
      </div>
    </section>
  );
}