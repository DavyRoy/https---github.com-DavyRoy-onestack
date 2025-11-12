// app/api/metrics/channel-mix/route.ts
import { NextResponse } from "next/server";
import { mockChannelMix } from "@/app/demo/admin/dashboard/data/mockAdminDashboard";
import { ChannelMixItem } from "@/app/lib/metrics/types";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const period = searchParams.get("period") || "30d";
  const channel = searchParams.get("channel") || "all";
  const location = searchParams.get("location") || "all";

  const items = mockChannelMix({ period, channel, location });
  const data: ChannelMixItem[] = items;
  return NextResponse.json(data);
}