"use client";

export default function BarStack({
  data,
  labelKey = "label",
  valueKey = "value",
  onBarClick,
}: {
  data: any[];
  labelKey?: string;
  valueKey?: string;
  onBarClick?: (row: any) => void;
}) {
  const max = Math.max(...data.map((r) => Number(r[valueKey] || 0)), 1);
  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 min-w-0">
      <div className="text-sm text-white/70 mb-2">Разрез</div>
      <div className="grid gap-2 min-w-0">
        {data.map((r, i) => {
          const w = `${(Number(r[valueKey]) / max) * 100}%`;
          return (
            <div key={i} className="grid gap-1 min-w-0">
              <div className="text-xs text-white/60 min-w-0 break-words">
                {r[labelKey]}
              </div>
              <div className="h-6 rounded-lg bg-white/[0.06] overflow-hidden">
                <button
                  type="button"
                  onClick={() => onBarClick?.(r)}
                  className="h-full block bg-white/80"
                  style={{ width: w }}
                  aria-label={`Выбрать ${String(r[labelKey])}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}