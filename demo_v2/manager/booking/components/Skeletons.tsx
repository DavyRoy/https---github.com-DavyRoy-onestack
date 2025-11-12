// src/app/demo/manager/booking/components/Skeletons.tsx
"use client";

export function FiltersSkeleton() {
  return (
    <div className="grid gap-2 md:grid-cols-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-9 rounded-xl bg-white/10 animate-pulse" />
      ))}
    </div>
  );
}

export function TableSkeleton() {
  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.04] p-4">
      <div className="h-6 w-48 rounded bg-white/10 animate-pulse" />
      <div className="mt-3 grid gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-12 rounded-xl bg-white/10 animate-pulse" />
        ))}
      </div>
    </section>
  );
}

// Универсальный экспорт для быстрого рендера обоих скелетонов
export default function Skeletons() {
  return (
    <div className="grid gap-4">
      <FiltersSkeleton />
      <TableSkeleton />
    </div>
  );
}