// app/api/metrics/systems-status/route.ts
import { NextResponse } from "next/server";
import { systems as mockSystems } from "@/app/demo/admin/dashboard/data/mockSystems";
import { SystemItem } from "@/app/lib/metrics/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const items = mockSystems as SystemItem[];
  return NextResponse.json(items);
}