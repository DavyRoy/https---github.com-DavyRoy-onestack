"use client";
import Link from "next/link";
import { T } from "@/app/demo/manager/_parts/tokens";
import type { StatusSlice } from "@/app/demo/manager/dashboard/data/mockManagerDashboard";

const PALETTE = [
  "#60A5FA", // синий
  "#34D399", // зелёный
  "#FBBF24", // янтарный
  "#A78BFA", // фиолетовый
  "#F87171", // красный
];

export default function StatusDistribution({ data }: { data: StatusSlice[] }) {
  const total = data.reduce((s, x) => s + x.value, 0);

  // сектора по долям
  let acc = 0;
  const segments = data.map((s, i) => {
    const start = acc / Math.max(1, total);
    acc += s.value;
    const end = acc / Math.max(1, total);
    return { ...s, start, end, color: PALETTE[i % PALETTE.length] };
  });

  const R = 56; // внешний радиус
  const r = 32; // внутренний радиус

  const arc = (start: number, end: number) => {
    const a0 = 2 * Math.PI * (start - 0.25);
    const a1 = 2 * Math.PI * (end - 0.25);
    const x0 = Math.cos(a0) * R,
      y0 = Math.sin(a0) * R;
    const x1 = Math.cos(a1) * R,
      y1 = Math.sin(a1) * R;
    const X0 = Math.cos(a0) * r,
      Y0 = Math.sin(a0) * r;
    const X1 = Math.cos(a1) * r,
      Y1 = Math.sin(a1) * r;
    const large = end - start > 0.5 ? 1 : 0;
    return `M ${X0} ${Y0} L ${x0} ${y0} A ${R} ${R} 0 ${large} 1 ${x1} ${y1} L ${X1} ${Y1} A ${r} ${r} 0 ${large} 0 ${X0} ${Y0} Z`;
  };

  return (
    <section className={T.card + " grid gap-3"}>
      <div className="text-base font-semibold">Статусы заказов</div>
      <div className="flex items-center gap-4">
        <svg viewBox="-64 -64 128 128" className="w-40 h-40">
          {segments.map((s, i) => (
            <Link key={i} href={s.href}>
              <path
                d={arc(s.start, s.end)}
                fill={s.color}
                className="hover:opacity-90 cursor-pointer transition"
              />
            </Link>
          ))}
          <circle r={r - 0.5} className="fill-transparent stroke-white/15" />
          <text
            x="0"
            y="-4"
            textAnchor="middle"
            className="fill-white font-semibold text-[14px]"
          >
            {total}
          </text>
          <text
            x="0"
            y="12"
            textAnchor="middle"
            className="fill-white/70 text-[10px]"
          >
            всего
          </text>
        </svg>

        <ul className="grid gap-1 text-sm">
          {segments.map((s) => (
            <li key={s.label} className="flex items-center justify-between gap-3">
              <Link
                href={s.href}
                className="flex items-center gap-2 underline decoration-white/40 hover:decoration-white"
              >
                <span
                  className="inline-block h-2.5 w-2.5 rounded-[3px]"
                  style={{ background: s.color }}
                  aria-hidden
                />
                {s.label}
              </Link>
              <span className="tabular-nums">{s.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}