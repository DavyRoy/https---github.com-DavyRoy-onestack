// app/demo/admin/booking/components/Skeletons.tsx
"use client";

export default function Skeletons() {
  const blocks = [
    { h: "h-20", cols: "col-span-1 sm:col-span-2 md:col-span-1" },
    { h: "h-32", cols: "col-span-1 sm:col-span-1 md:col-span-1" },
    { h: "h-64", cols: "col-span-1 sm:col-span-2 md:col-span-2" },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 animate-pulse">
      {blocks.map((b, i) => (
        <div
          key={i}
          className={`${b.h} ${b.cols} rounded-2xl border border-white/10 bg-white/[0.06]`}
        />
      ))}
      <div className="h-20 md:col-span-3 rounded-2xl border border-white/10 bg-white/[0.05]" />
    </section>
  );
}