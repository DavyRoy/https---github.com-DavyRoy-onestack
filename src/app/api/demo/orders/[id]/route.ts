// app/api/demo/orders/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { listOrders } from "../../../../lib/demo/store"; // было "../../../../../", должно быть "../../../../"

// чтобы Next не кешировал
export const dynamic = "force-dynamic";

// --- CORS / headers ---
const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_DEMO_ORIGIN?.trim() || "*";
const COMMON_HEADERS = {
  "access-control-allow-origin": ALLOWED_ORIGIN,
  "access-control-allow-methods": "GET,OPTIONS",
  "access-control-allow-headers": "content-type",
  "cache-control": "no-store",
} as const;

function ok(data: unknown, init?: ResponseInit) {
  return NextResponse.json(
    { ok: true, ...data },
    { ...init, headers: { ...(init?.headers || {}), ...COMMON_HEADERS } }
  );
}
function fail(status: number, message = "Bad Request") {
  return NextResponse.json(
    { ok: false, error: message },
    { status, headers: COMMON_HEADERS }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: COMMON_HEADERS });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = (params?.id || "").trim();
    if (!id) return fail(400, "Missing id");

    const order = (listOrders() || []).find((o) => String(o.id) === id);
    if (!order) return fail(404, "Not found");

    return ok({ item: order });
  } catch (e) {
    console.error("[DEMO][orders/:id] GET error:", e);
    return fail(500, "Internal Server Error");
  }
}