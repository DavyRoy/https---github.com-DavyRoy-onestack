import { NextResponse } from "next/server";
import { queryProducts } from "@/app/lib/catalog/db.memory";
import type { Query } from "@/app/lib/catalog/filters";

/** GET /api/catalog/products?q=&status=&category=&has_media=&sort=&offset=&limit= */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q: Query = {
    q: searchParams.get("q") ?? undefined,
    status: (searchParams.get("status") as Query["status"]) ?? "all",
    category: (searchParams.get("category") as Query["category"]) ?? "all",
    has_media: (searchParams.get("has_media") as Query["has_media"]) ?? "all",
    sort: (searchParams.get("sort") as Query["sort"]) ?? "updated_desc",
    offset: searchParams.get("offset") ? Number(searchParams.get("offset")) : 0,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 50,
  };
  const { items, total } = queryProducts(q);
  return NextResponse.json({ items, total }, { status: 200 });
}