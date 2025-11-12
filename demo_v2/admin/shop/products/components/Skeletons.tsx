"use client";

import React, { forwardRef } from "react";

type ElementTag = keyof JSX.IntrinsicElements;

type RowProps = {
  width?: string;
  height?: string;
  rounded?: boolean;              // b/c
  roundedClass?: string;          // предпочтительный путь
  soft?: boolean;
  animate?: boolean;
  className?: string;
  as?: ElementTag;
} & React.ComponentPropsWithoutRef<ElementTag>;

export const Row = ({
  width = "100%",
  height = "1rem",
  rounded = true,
  roundedClass,
  soft = false,
  animate = true,
  className = "",
  as: Tag = "div",
  ...rest
}: RowProps) => {
  const radius = roundedClass ?? (rounded ? "rounded-xl" : "");
  return (
    <Tag
      aria-hidden="true"
      className={[
        animate ? "motion-safe:animate-pulse" : "",
        "bg-white",
        soft ? "bg-opacity-5" : "bg-opacity-10",
        radius,
        className,
      ].filter(Boolean).join(" ")}
      style={{ width, height }}
      {...rest}
    />
  );
};

type DetailProps = {
  rows?: number;
  gap?: string;
  rowHeight?: string;
  widths?: string[];
  className?: string;
  as?: ElementTag;
  animate?: boolean;
  roundedClass?: string;
  /** Дополнительно: отключить фон/рамку контейнера */
  plain?: boolean;
} & React.ComponentPropsWithoutRef<ElementTag>;

export const Detail = forwardRef<HTMLElement, DetailProps>(function Detail(
  {
    rows = 3,
    gap = "0.75rem",
    rowHeight = "1rem",
    widths,
    className = "",
    as: Tag = "section",
    animate = true,
    roundedClass = "rounded-2xl",
    plain = false,
    ...rest
  },
  ref
) {
  const arr = Array.from({ length: rows });
  return (
    <Tag
      ref={ref as any}
      role="status"
      aria-busy="true"
      aria-live="polite"
      className={[
        roundedClass,
        plain ? "" : "border border-white/15 bg-white/[0.05] p-4",
        "grid",
        className,
      ].filter(Boolean).join(" ")}
      style={{ rowGap: gap }}
      {...rest}
    >
      {arr.map((_, i) => (
        <Row
          key={i}
          height={rowHeight}
          width={widths?.[i] ?? "100%"}
          roundedClass="rounded-xl"
          animate={animate}
          soft
        />
      ))}
      <span className="sr-only">Загрузка…</span>
    </Tag>
  );
});

const Skeletons = { Row, Detail };
export default Skeletons;