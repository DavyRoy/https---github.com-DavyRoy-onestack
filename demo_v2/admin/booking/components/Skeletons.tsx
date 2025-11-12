// app/demo/admin/booking/components/Skeletons.tsx
"use client";

type Block = { h: string; cols: string };

export default function Skeletons({
  className = "",
  blocks = DEFAULT_BLOCKS,
}: {
  /** Дополнительные классы-обёртки */
  className?: string;
  /** Кастомная раскладка блоков скелетона */
  blocks?: Block[];
}) {
  const safe = Array.isArray(blocks) && blocks.length > 0 ? blocks : DEFAULT_BLOCKS;

  return (
    <section
      className={`admin-section border-white/12 bg-white/8 ${className}`}
      aria-busy="true"
      aria-live="polite"
    >
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 animate-pulse">
        {safe.map((b, i) => (
          <div
            key={`${b.h}-${b.cols}-${i}`}
            className={`${b.h} ${b.cols} rounded-2xl border border-white/10 bg-white/[0.06]`}
            aria-hidden="true"
          />
        ))}
        <div
          className="h-20 md:col-span-3 rounded-2xl border border-white/10 bg-white/[0.05]"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}

const DEFAULT_BLOCKS: Block[] = [
  { h: "h-20", cols: "col-span-1 sm:col-span-2 md:col-span-1" },
  { h: "h-32", cols: "col-span-1 sm:col-span-1 md:col-span-1" },
  { h: "h-64", cols: "col-span-1 sm:col-span-2 md:col-span-2" },
];