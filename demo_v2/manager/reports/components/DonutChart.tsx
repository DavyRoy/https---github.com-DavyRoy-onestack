"use client";

export default function DonutChart({
  title,
  data,
  centerLabel,
  onSliceClick,
}: {
  title: string;
  data: { label: string; value: number }[];
  centerLabel?: string;
  onSliceClick?: (label: string) => void;
}) {
  const total = data.reduce((s, x) => s + x.value, 0) || 1;
  const R = 70; // радиус
  const C = 86; // центр круга (x,y)
  let acc = 0;

  const arcs = data.map((s, i) => {
    const start = acc / total;
    acc += s.value;
    const end = acc / total;
    return { ...s, start, end, idx: i };
  });

  return (
    <section
      className="rounded-xl border border-white/15 bg-white/[0.05] p-3"
      aria-label={title}
    >
      <div className="text-sm font-medium">{title}</div>
      <div className="mt-3 flex items-center justify-center">
        <svg
          viewBox="0 0 172 172"
          className="h-[200px] w-[200px]"
          role="img"
          aria-label={`Диаграмма ${title}`}
        >
          {/* фон-круг */}
          <circle
            cx={C}
            cy={C}
            r={R}
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.15"
            strokeWidth="16"
          />
          {/* Сектора */}
          {arcs.map((a) => {
            const dash = (a.value / total) * (2 * Math.PI * R);
            const gap = 2 * Math.PI * R - dash;
            const hue = (a.idx * 60) % 360; // цветовая палитра
            return (
              <g key={a.idx}>
                <circle
                  cx={C}
                  cy={C}
                  r={R}
                  fill="none"
                  stroke={`hsl(${hue}, 80%, 70%)`}
                  strokeWidth="16"
                  strokeDasharray={`${dash} ${gap}`}
                  strokeDashoffset={-(2 * Math.PI * R) * a.start}
                  className="cursor-pointer transition-opacity hover:opacity-100 opacity-80"
                  onClick={() => onSliceClick?.(a.label)}
                  aria-label={`${a.label}: ${a.value.toLocaleString("ru-RU")}`}
                />
              </g>
            );
          })}
          {/* внутренний круг */}
          <circle cx={C} cy={C} r={R - 20} fill="rgba(255,255,255,0.06)" />
          {/* центральная подпись */}
          {centerLabel && (
            <text
              x={C}
              y={C}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-white text-sm"
            >
              {centerLabel}
            </text>
          )}
        </svg>
      </div>

      {/* легенда */}
      <div className="mt-2 grid grid-cols-2 gap-1 text-xs text-white/80">
        {data.map((s, i) => {
          const hue = (i * 60) % 360;
          return (
            <div
              key={s.label}
              className="flex items-center justify-between gap-1"
            >
              <div className="flex items-center gap-1 truncate">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: `hsl(${hue}, 80%, 70%)` }}
                />
                <span className="truncate">{s.label}</span>
              </div>
              <span className="tabular-nums">{s.value}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}