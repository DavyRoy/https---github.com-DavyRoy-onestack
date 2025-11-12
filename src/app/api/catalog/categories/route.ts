import { NextResponse } from "next/server";
import { getAllCategories } from "@/app/lib/catalog/db.memory";

/** GET /api/catalog/categories?parentId=fruits */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const parentId = searchParams.get("parentId");
  const all = getAllCategories();
  const items = parentId == null
    ? all
    : all.filter((c) => (parentId === "" ? !c.parentId : c.parentId === parentId));
  return NextResponse.json(items, { status: 200 });
}