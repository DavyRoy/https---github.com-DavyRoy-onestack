// app/api/metrics/access/route.ts
import { NextResponse } from "next/server";
import { mockAccess } from "@/app/demo/admin/dashboard/data/mockAdminDashboard";
import { AccessMetrics } from "@/app/lib/metrics/types";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  void searchParams;
  // const period = searchParams.get("period");
  // const channel = searchParams.get("channel");
  // const location = searchParams.get("location");

  // TODO: replace with real data source
  const m = mockAccess();
  const data: AccessMetrics = {
    users: m.users,
    sessions: m.sessions,
    byRole: m.byRole,
  };
  return NextResponse.json(data);
}
