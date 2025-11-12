// app/api/metrics/org-kpi/route.ts
import { NextResponse } from "next/server";
import { mockOrgKpi } from "@/app/demo/admin/dashboard/data/mockAdminDashboard";
import { KpiItem } from "@/app/lib/metrics/types";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const period = searchParams.get("period") || "30d";
  const channel = searchParams.get("channel") || "all";
  const location = searchParams.get("location") || "all";
  const currency = searchParams.get("currency") || "RUB";

  const arr = mockOrgKpi({ period, channel, location, currency });
  const data: KpiItem[] = arr.map(k => ({
    id: k.id,
    title: k.title,
    value: k.value,
    delta: k.delta,
    kind: k.kind,
    currency: k.currency,
    caption: k.caption,
    href: k.href,
    trend: k.trend,
  }));
  return NextResponse.json(data);
}