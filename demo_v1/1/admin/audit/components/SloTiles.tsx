"use client";

export default function SloTiles({
  items,
}: {
  items: { label: string; value: string; hint?: string }[];
}) {
  if (!items || items.length === 0)
    return (
      <div className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 text-sm text-white/70 text-center">
        Нет данных
      </div>
    );

  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((i, idx) => (
        <div
          key={`${i.label}-${idx}`}
          className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 hover:bg-white/[0.08] transition"
        >
          <div className="text-xs text-white/60 truncate">{i.label}</div>
          <div className="text-xl font-semibold mt-1">{i.value}</div>
          {i.hint && (
            <div className="text-xs text-white/60 mt-1 truncate">{i.hint}</div>
          )}
        </div>
      ))}
    </section>
  );
}