"use client";

import * as React from "react";

type RowProps = {
  className?: string;
  /** ширина строки: "100%" | 240 | "12rem" и т.п. */
  width?: string | number;
  /** высота строки, по умолчанию 1rem (h-4) */
  height?: string | number;
};

export function Row({ className = "", width = "100%", height = "1rem" }: RowProps) {
  return (
    <div
      className={`rounded bg-white/10 animate-pulse ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

export function Lines({
  count = 3,
  className = "",
  min = 60,
  step = 10,
}: {
  /** сколько строк */
  count?: number;
  className?: string;
  /** минимальная ширина последней строки (в %) */
  min?: number;
  /** на сколько процентов укорачивать каждую следующую */
  step?: number;
}) {
  return (
    <div className={`grid gap-2 ${className}`} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => {
        const w = Math.max(min, 100 - i * step);
        return <Row key={i} height="1rem" width={`${w}%`} />;
      })}
    </div>
  );
}

export function Avatar({
  size = 32,
  className = "",
  square = false,
}: {
  size?: number;
  className?: string;
  square?: boolean;
}) {
  return (
    <div
      className={`${square ? "rounded" : "rounded-full"} bg-white/10 animate-pulse ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  );
}

export function Card({
  className = "",
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={`rounded-2xl border border-white/15 bg-white/[0.05] p-4 ${className}`}
      aria-busy="true"
      aria-live="polite"
    >
      {children ?? <Lines count={4} />}
    </div>
  );
}

/** совместимость: можно импортировать как default и доставать поля */
export default {
  Row,
  Lines,
  Avatar,
  Card,
};