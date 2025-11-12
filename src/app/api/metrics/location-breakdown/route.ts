// app/api/metrics/location-breakdown/route.ts
import { NextResponse } from "next/server";

type Item = { id: string; label: string; value: number };

function seededRand(seed: number) {
  let t = seed + 0x6d2b79f5;
  return () => {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeData(period: string, channel: string, seedBase: number): Item[] {
  const seed =
    (period === "y" ? 101 : period === "q" ? 77 : period === "7d" ? 33 : 55) +
    (channel === "online" ? 9 : channel === "manager" ? 5 : 1) +
    seedBase;
  const rnd = seededRand(seed);

  const raw = [
    { id: "center", label: "Центр" },
    { id: "south", label: "Юг" },
    { id: "north", label: "Север" },
  ];

  return raw.map((r) => ({
    ...r,
    value: Math.round(50000 + rnd() * 150000),
  }));
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const period = searchParams.get("period") ?? "30d";
  const channel = searchParams.get("channel") ?? "all";
  const seed = Number(searchParams.get("seed") ?? 0) || 0;

  const data = makeData(period, channel, seed);
  return NextResponse.json(data);
}