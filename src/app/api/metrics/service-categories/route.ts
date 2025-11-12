// app/api/metrics/service-categories/route.ts
import { NextResponse } from "next/server";
import { mockServiceCategories } from "@/app/demo/admin/dashboard/data/mockAdminDashboard";
import { ServiceCategoryItem } from "@/app/lib/metrics/types";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const period = searchParams.get("period") || "30d";
  const channel = searchParams.get("channel") || "all";

  const items = mockServiceCategories({ period, channel }) as ServiceCategoryItem[];
  return NextResponse.json(items);
}