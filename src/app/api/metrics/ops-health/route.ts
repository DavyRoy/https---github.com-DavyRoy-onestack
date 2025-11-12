// app/api/metrics/ops-health/route.ts
import { NextResponse } from "next/server";

type OpsHealth = {
  cancellations: number;     // %
  noshow: number;            // %
  firstResponseMin: number;  // минуты
  sla: number;               // %
};

function seededRand(seed: number) {
  let t = seed + 0x6d2b79f5;
  return () => {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function makeOps(period: string, seedBase: number): OpsHealth {
  const seed = (period === "y" ? 999 : period === "q" ? 666 : period === "7d" ? 222 : 444) + seedBase;
  const rnd = seededRand(seed);
  const cancellations = clamp(Math.round(rnd() * 18), 2, 22); // %
  const noshow = clamp(Math.round(rnd() * 12), 1, 15);        // %
  const firstResponseMin = clamp(Math.round(5 + rnd() * 40), 2, 60); // минуты
  // SLA выше 70, колеблется
  const sla = clamp(Math.round(92 - cancellations * 0.6 - noshow * 0.4 + rnd() * 4), 70, 99);

  return { cancellations, noshow, firstResponseMin, sla };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const period = searchParams.get("period") ?? "30d";
  const seed = Number(searchParams.get("seed") ?? 0) || 0;

  const data = makeOps(period, seed);
  return NextResponse.json(data);
}