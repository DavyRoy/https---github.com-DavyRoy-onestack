// src/app/demo/ui/DemoLineChart.tsx
"use client";

import { useId } from "react";
import { useReducedMotion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Area,
} from "recharts";

type Datum = Record<string, any>;

type RefLine = {
  y?: number;
  x?: string | number;
  label?: string;
  color?: string;
  dash?: string;
};

type LineSpec<T extends Datum> = {
  dataKey: keyof T;
  color?: string;
  dots?: boolean;
  strokeWidth?: number;
  type?: "monotone" | "linear";
  area?: boolean;
};

export type DemoLineChartProps<T extends Datum> = {
  data?: T[];
  xKey?: keyof T;
  lines?: LineSpec<T>[];
  dataKey?: keyof T;
  color?: string;

  className?: string;
  height?: number | string;

  grid?: boolean;
  syncId?: string;

  yDomain?: [number | "auto" | "dataMin", number | "auto" | "dataMax"];
  yTickFormatter?: (v: number) => string | number;
  tooltipFormatter?: (value: any, name: string) => any;
  xTickFormatter?: (v: any) => string;

  reference?: RefLine[];

  loading?: boolean;
  emptyText?: string;

  xMinTickGap?: number;
  xTickMargin?: number;

  ariaLabel?: string;
  caption?: string;
};

const defaultData = [
  { name: "Пн", value: 240 },
  { name: "Вт", value: 312 },
  { name: "Ср", value: 280 },
  { name: "Чт", value: 356 },
  { name: "Пт", value: 390 },
  { name: "Сб", value: 220 },
  { name: "Вс", value: 180 },
] as const;

export function DemoLineChart<T extends Datum>({
  data = defaultData as unknown as T[],
  xKey = "name" as keyof T,
  lines,
  dataKey = "value" as keyof T,
  color = "#ffffff",
  className = "",
  height = 224,
  grid = true,
  syncId,
  yDomain = ["auto", "auto"],
  yTickFormatter,
  xTickFormatter,
  tooltipFormatter,
  reference,
  loading = false,
  emptyText = "Нет данных для отображения",
  xMinTickGap = 10,
  xTickMargin = 6,
  ariaLabel = "Линейный график",
  caption,
}: DemoLineChartProps<T>) {
  const gradId = useId();
  const reduceMotion = useReducedMotion();

  const hasData = Array.isArray(data) && data.length > 0;

  if (loading) {
    return (
      <div
        className={`rounded-2xl border border-white/10 bg-white/[0.03] ${className}`}
        style={{ height }}
        role="img"
        aria-label={`${ariaLabel}: загрузка`}
      >
        <div className={`h-full rounded-2xl bg-white/[0.06] ${reduceMotion ? "" : "animate-pulse"}`} />
      </div>
    );
  }

  if (!hasData) {
    return (
      <div
        className={`flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white/60 ${className}`}
        style={{ height }}
        role="img"
        aria-label={`${ariaLabel}: пусто`}
      >
        {emptyText}
      </div>
    );
  }

  const lineSpecs: LineSpec<T>[] =
    lines && lines.length
      ? lines
      : [{ dataKey, color, dots: false, strokeWidth: 2, type: "monotone", area: false }];

  return (
    <figure className={className} style={{ height }} aria-label={ariaLabel}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: 6, right: 6, top: 8, bottom: 0 }} syncId={syncId}>
          <defs>
            <linearGradient id={`lineArea-${gradId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#ffffff" stopOpacity={0.06} />
            </linearGradient>
          </defs>

          {grid && <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />}

          <XAxis
            dataKey={xKey as string}
            interval="preserveStartEnd"
            minTickGap={xMinTickGap}
            tickMargin={xTickMargin}
            tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
            axisLine={{ stroke: "rgba(255,255,255,0.15)" }}
            tickLine={false}
            tickFormatter={xTickFormatter}
          />
          <YAxis
            domain={yDomain as any}
            tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
            axisLine={{ stroke: "rgba(255,255,255,0.15)" }}
            tickLine={false}
            tickFormatter={yTickFormatter}
          />

          <Tooltip
            contentStyle={{
              background: "rgba(0,0,0,0.85)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 12,
              color: "white",
              padding: "6px 8px",
            }}
            labelStyle={{ color: "rgba(255,255,255,0.7)" }}
            wrapperStyle={{ outline: "none" }}
            formatter={tooltipFormatter}
            labelFormatter={xTickFormatter}
          />

          {reference?.map((r, i) => (
            <ReferenceLine
              key={i}
              y={r.y}
              x={r.x as any}
              stroke={r.color ?? "rgba(255,255,255,0.25)"}
              strokeDasharray={r.dash ?? "4 4"}
              isFront={false}
              label={
                r.label
                  ? { value: r.label, fill: "rgba(255,255,255,0.7)", fontSize: 12, position: "top" }
                  : undefined
              }
            />
          ))}

          {lineSpecs.map((ls, i) => {
            const c = ls.color ?? "#ffffff";
            const type = ls.type ?? "monotone";
            return (
              <g key={String(ls.dataKey) + i}>
                {ls.area && (
                  <Area
                    type={type}
                    dataKey={ls.dataKey as string}
                    stroke="transparent"
                    fill={`url(#lineArea-${gradId})`}
                    isAnimationActive={!reduceMotion}
                    dot={false}
                  />
                )}
                <Line
                  type={type}
                  dataKey={ls.dataKey as string}
                  stroke={c}
                  strokeWidth={ls.strokeWidth ?? 2}
                  dot={ls.dots ?? false}
                  activeDot={{ r: 4 }}
                  isAnimationActive={!reduceMotion}
                />
              </g>
            );
          })}
        </LineChart>
      </ResponsiveContainer>
      {caption ? (
        <figcaption className="mt-2 text-xs text-white/60">{caption}</figcaption>
      ) : null}
    </figure>
  );
}