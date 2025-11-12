"use client";

export default function SloTiles({
  items,
}: {
  items: { label: string; value: string; hint?: string }[];
}) {
  if (!items || items.length === 0)
    return (
      <div
        className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 text-sm text-white/70 text-center"
        role="status"
        aria-live="polite"
      >
        Нет данных
      </div>
    );

  return (
    <section
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
      aria-labelledby="slo-tiles-title"
      role="list"
    >
      <h2 id="slo-tiles-title" className="sr-only">
        Плитки SLO и метрик
      </h2>

      {items.map((i, idx) => {
        const label = i.label?.trim() || "Показатель";
        return (
          <div
            key={`${label}-${idx}`}
            role="listitem"
            className="
              rounded-2xl border border-white/15 bg-white/[0.05] p-4
              hover:bg-white/[0.08] hover:border-white/20
              focus-within:ring-2 focus-within:ring-white/30
              transition
            "
          >
            <div className="text-xs text-white/60 truncate" title={label}>
              {label}
            </div>
            <div
              className="text-xl font-semibold mt-1 truncate"
              title={i.value}
              aria-label={`${label}: ${i.value}`}
            >
              {i.value}
            </div>
            {i.hint && (
              <div
                className="text-xs text-white/60 mt-1 truncate"
                title={i.hint}
              >
                {i.hint}
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}