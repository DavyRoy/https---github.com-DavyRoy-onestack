"use client";
import { useMemo } from "react";
import { T } from "@/app/demo/manager/_parts/tokens";
import { useLocalStorage } from "@/app/demo/manager/_parts/useLocalStorage";
import type { TrendPoint } from "@/app/demo/manager/dashboard/data/mockManagerDashboard";

export default function SalesTrendChart({
  data7,
  data30,
}: {
  data7: TrendPoint[];
  data30: TrendPoint[];
}) {
  const [range, setRange] = useLocalStorage<"7d" | "30d">("mgr_dash_range", "7d");
  const data = range === "7d" ? data7 : data30;

  const svg = useMemo(() => {
    const w = 560,
      h = 220,
      pad = 24;

    const xs = data.map(
      (_, i) => pad + (i * (w - pad * 2)) / Math.max(1, data.length - 1)
    );

    const revMin = Math.min(...data.map((d) => d.revenue));
    const revMax = Math.max(...data.map((d) => d.revenue));
    const ordMin = Math.min(...data.map((d) => d.orders));
    const ordMax = Math.max(...data.map((d) => d.orders));

    const yScale = (min: number, max: number) => (v: number) =>
      h - pad - ((v - min) / Math.max(1, max - min)) * (h - pad * 2);

    const yRev = yScale(revMin, revMax);
    const yOrd = yScale(ordMin, ordMax);

    const pathRev = data
      .map((p, i) => `${i ? "L" : "M"}${xs[i]},${yRev(p.revenue)}`)
      .join(" ");
    const pathOrd = data
      .map((p, i) => `${i ? "L" : "M"}${xs[i]},${yOrd(p.orders)}`)
      .join(" ");

    return { w, h, pad, xs, yRev, yOrd, pathRev, pathOrd };
  }, [data]);

  return (
    <section className={T.card + " grid gap-3"}>
      <div className="flex items-center justify-between">
        <div className="text-base font-semibold">Заказы / Выручка</div>
        <div className="inline-flex rounded-full border border-white/15 bg-white/10 p-1">
          {(["7d", "30d"] as const).map((k) => (
            <button
              key={k}
              className={`rounded-full px-3 py-1 text-sm ${
                range === k ? "bg-white text-black" : "text-white/80"
              }`}
              onClick={() => setRange(k)}
            >
              {k === "7d" ? "7 дней" : "30 дней"}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto -mx-2 px-2">
        <svg viewBox={`0 0 ${svg.w} ${svg.h}`} className="w-full h-[220px]">
          {/* ось X */}
          <line
            x1={svg.pad}
            y1={svg.h - svg.pad}
            x2={svg.w - svg.pad}
            y2={svg.h - svg.pad}
            stroke="currentColor"
            className="opacity-20"
          />

          {/* revenue — сплошная линия */}
          <path
            d={svg.pathRev}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="opacity-90"
          />

          {/* orders — пунктир */}
          <path
            d={svg.pathOrd}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="opacity-70"
            strokeDasharray="5 4"
          />

          {/* точки для revenue */}
          {data.map((p, i) => (
            <a key={`rev-${p.date}`} href={`/demo/manager/reports?date=${p.date}`}>
              <circle
                cx={svg.xs[i]}
                cy={svg.yRev(p.revenue)}
                r="3"
                className="fill-white/90 cursor-pointer"
              />
            </a>
          ))}

          {/* точки для orders (поменьше) */}
          {data.map((p, i) => (
            <a key={`ord-${p.date}`} href={`/demo/manager/orders?date=${p.date}`}>
              <circle
                cx={svg.xs[i]}
                cy={svg.yOrd(p.orders)}
                r="2.5"
                className="fill-white/70 cursor-pointer"
              />
            </a>
          ))}
        </svg>
      </div>

      <div className="flex gap-4 text-xs">
        <span className="inline-flex items-center gap-2">
          <span className="h-1 w-6 bg-white/90" />
          Выручка
        </span>
        <span className="inline-flex items-center gap-2">
          <span
            className="h-1 w-6 bg-white/70"
            style={{ borderBottom: "1px dashed rgba(255,255,255,.7)" }}
          />
          Кол-во заказов
        </span>
      </div>
    </section>
  );
}