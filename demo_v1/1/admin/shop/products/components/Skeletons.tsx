// app/demo/admin/shop/products/components/Skeletons.tsx
"use client";

type RowProps = {
  /** ширина строки (напр., "100%", "60%", "12rem") */
  width?: string;
  /** высота строки в rem/px (по умолчанию 1rem) */
  height?: string;
  /** скругления */
  rounded?: boolean;
  /** более мягкая пульсация */
  soft?: boolean;
  className?: string;
};

export function Row({
  width = "100%",
  height = "1rem",
  rounded = true,
  soft = false,
  className = "",
}: RowProps) {
  return (
    <div
      aria-hidden
      className={[
        "animate-pulse bg-white",
        soft ? "bg-opacity-5" : "bg-opacity-10",
        rounded ? "rounded" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ width, height }}
    />
  );
}

type DetailProps = {
  /** кол-во строк */
  rows?: number;
  /** промежуток между строками */
  gap?: string;
  /** высота строки */
  rowHeight?: string;
  /** массив ширин для «рваных» строк (если не задан — все 100%) */
  widths?: string[];
  className?: string;
};

export function Detail({
  rows = 3,
  gap = "0.75rem", // 12px
  rowHeight = "1rem",
  widths,
  className = "",
}: DetailProps) {
  const arr = Array.from({ length: rows });
  return (
    <section
      className={
        "rounded-2xl border border-white/15 bg-white/[0.05] p-4 grid " + className
      }
      style={{ rowGap: gap }}
      aria-busy="true"
      aria-live="polite"
    >
      {arr.map((_, i) => (
        <Row
          key={i}
          height={rowHeight}
          width={widths?.[i] ?? "100%"}
          rounded
        />
      ))}
    </section>
  );
}

/** default-объект для удобного импорта: `import Skeletons from "./Skeletons";` + `<Skeletons.Detail />` */
const Skeletons = { Row, Detail };
export default Skeletons;