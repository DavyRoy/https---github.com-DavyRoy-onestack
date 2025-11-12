"use client";

type Point = Record<string, number> & { date: string };

export default function TrendLine({
  data,
  y1,
  y2,
  onPointClick,
}: {
  data: Point[];
  y1: keyof Point;
  y2?: keyof Point;
  onPointClick?: (p: Point) => void;
}) {
  // SVG фиксированной виртуальной ширины; скролл — только внутри контейнера
  const width = 640,
    height = 190,
    pad = 24;
  const max = Math.max(
    ...data.map((d) => Number(d[y1]) || 0),
    ...(y2 ? data.map((d) => Number(d[y2!]) || 0) : [0])
  );
  const stepX = (width - pad * 2) / Math.max(1, data.length - 1);
  const sy = (v: number) =>
    height - pad - (v / (max || 1)) * (height - pad * 2);
  const path = (key: keyof Point) =>
    data
      .map((d, i) => `${i ? "L" : "M"}${pad + i * stepX},${sy(Number(d[key]))}`)
      .join(" ");

  return (
    <section className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 min-w-0">
      <div className="text-sm text-white/70 mb-2">Тренд</div>
      <div className="-mx-2 md:mx-0">
        <div className="overflow-x-auto px-2 md:px-0">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="block w-[640px] h-[200px] max-w-none"
          >
            <path d={path(y1)} fill="none" stroke="currentColor" strokeWidth="2" />
            {y2 && (
              <path
                d={path(y2)}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                opacity="0.55"
              />
            )}
            {data.map((d, i) => {
              const cx = pad + i * stepX,
                cy = sy(Number(d[y1]));
              return (
                <circle
                  key={d.date}
                  cx={cx}
                  cy={cy}
                  r="3"
                  className="fill-white/90 cursor-pointer"
                  onClick={() => onPointClick?.(d)}
                />
              );
            })}
          </svg>
        </div>
      </div>
    </section>
  );
}