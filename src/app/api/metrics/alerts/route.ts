// app/api/metrics/alerts/route.ts
import { NextResponse } from "next/server";
import { mockAlerts } from "@/app/demo/admin/dashboard/data/mockAdminDashboard";
import { AlertItem } from "@/app/lib/metrics/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const arr = mockAlerts();
  const data: AlertItem[] = arr.map(a => ({
    id: a.id,
    severity: a.severity,
    title: a.title,
    hint: a.hint,
    href: a.href,
    createdAt: a.createdAt,
  }));
  return NextResponse.json(data);
}