// app/api/metrics/revenue-trend/route.ts
import { NextResponse } from "next/server";
import { mockRevenueTrend } from "@/app/demo/admin/dashboard/data/mockAdminDashboard";
import { RevenueTrend } from "@/app/lib/metrics/types";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const period = searchParams.get("period") || "30d";
  const channel = searchParams.get("channel") || "all";
  const location = searchParams.get("location") || "all";

  const { points, min, max } = mockRevenueTrend({ period, channel, location });
  const data: RevenueTrend = { points, min, max };
  return NextResponse.json(data);
}