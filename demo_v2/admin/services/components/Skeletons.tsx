"use client";

import * as React from "react";

/* =================== utils =================== */

function cls(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

/* =================== Row =================== */

export type RowProps = {
  className?: string;
  /** ширина строки: "100%" | 240 | "12rem" и т.п. */
  width?: string | number;
  /** высота строки, по умолчанию 1rem (h-4) */
  height?: string | number;
  /** скругление: "rounded" | "rounded-md" | ... (по умолчанию rounded) */
  radiusClassName?: string;
};

/** Базовая «полоска» скелетона */
export function Row({
  className = "",
  width = "100%",
  height = "1rem",
  radiusClassName = "rounded",
}: RowProps) {
  return (
    <div
      className={cls(radiusClassName, "bg-white/10 animate-pulse", className)}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

/* =================== Lines =================== */

export type LinesProps = {
  /** сколько строк */
  count?: number;
  className?: string;
  /** минимальная ширина последней строки (в %) */
  min?: number;
  /** на сколько процентов укорачивать каждую следующую */
  step?: number;
  /** высота каждой строки */
  lineHeight?: string | number;
};

export function Lines({
  count = 3,
  className = "",
  min = 60,
  step = 10,
  lineHeight = "1rem",
}: LinesProps) {
  const safeCount = Math.max(0, Math.trunc(count));
  const rows = React.useMemo(() => {
    const xs: number[] = [];
    for (let i = 0; i < safeCount; i++) {
      xs.push(Math.max(min, 100 - i * step));
    }
    return xs;
  }, [safeCount, min, step]);

  return (
    <div className={cls("grid gap-2", className)} aria-hidden="true">
      {rows.map((w, i) => (
        <Row key={i} height={lineHeight} width={`${w}%`} />
      ))}
    </div>
  );
}

/* =================== Avatar =================== */

export type AvatarProps = {
  size?: number;
  className?: string;
  square?: boolean;
};

export function Avatar({ size = 32, className = "", square = false }: AvatarProps) {
  return (
    <div
      className={cls(square ? "rounded" : "rounded-full", "bg-white/10 animate-pulse", className)}
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  );
}

/* =================== Card =================== */

export type CardProps = React.PropsWithChildren<{
  className?: string;
  /** Показывать ли встроенный контент «Загрузка…» для скринридеров */
  srText?: string;
  /** Кол-во строк по умолчанию, если children не переданы */
  fallbackLines?: number;
}>;

/** Контейнер-скелетон (с aria-атрибутами) */
export function Card({ className = "", children, srText = "Загрузка…", fallbackLines = 4 }: CardProps) {
  const showFallback = children == null;

  return (
    <div
      className={cls("rounded-2xl border border-white/15 bg-white/[0.05] p-4", className)}
      aria-busy="true"
      role="status"
      aria-live="polite"
    >
      {showFallback ? <Lines count={fallbackLines} /> : children}
      <span className="sr-only">{srText}</span>
    </div>
  );
}

/* =================== default aggregate export =================== */
/** совместимость: можно импортировать как default и доставать поля */
export default {
  Row,
  Lines,
  Avatar,
  Card,
};