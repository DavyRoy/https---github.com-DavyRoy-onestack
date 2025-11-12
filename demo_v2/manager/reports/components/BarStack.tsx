"use client";

export default function BarStack({
  title,
  categories,
  series,
  onBarClick,
}: {
  title: string;
  categories: string[];
  series: number[]; // одна серия «выручка»
  onBarClick?: (category: string) => void;
}) {
  const max = Math.max(...series, 1);

  return (
    <section
      className="rounded-xl border border-white/15 bg-white/[0.05] p-3"
      aria-label={title}
    >
      <div className="text-sm font-medium">{title}</div>

      <div className="mt-3 grid gap-2">
        {categories.map((c, i) => {
          const val = series[i] ?? 0;
          const pct = Math.round((val / max) * 100);

          return (
            <button
              key={c}
              type="button"
              onClick={() => onBarClick?.(c)}
              className="group text-left"
              aria-label={`${c}: ${val.toLocaleString("ru-RU")} рублей`}
            >
              <div className="flex items-center justify-between text-xs text-white/70">
                <div className="truncate">{c}</div>
                <div className="tabular-nums">
                  {val.toLocaleString("ru-RU")} ₽
                </div>
              </div>
              <div className="mt-1 h-2 rounded bg-white/10" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                <div
                  className="h-full rounded bg-white/80 group-hover:bg-white transition-[width,background-color] duration-200"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}