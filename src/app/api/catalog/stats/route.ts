import { NextResponse } from "next/server";
import { getAllProducts } from "@/app/lib/catalog/db.memory";
import { computeShopStats } from "@/app/lib/catalog/filters";

/** GET /api/catalog/stats  — простой сводный ответ */
export async function GET() {
  const stats = computeShopStats(getAllProducts());
  return NextResponse.json(stats, { status: 200 });
}