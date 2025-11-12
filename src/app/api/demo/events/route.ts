// app/api/demo/events/route.ts
import { NextRequest, NextResponse } from "next/server";
import { listEvents } from "../../../../lib/demo/store"; // ⟵ было "../../../../", нужно три ../

// чтобы Next не пытался статически кешировать этот route handler
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
    { ...init, headers: { ...COMMON_HEADERS, ...(init?.headers || {}) } }
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

// Allowed demo types
const TYPES = new Set(["auth", "key", "role", "policy", "user", "all"]);

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);

    // filters
    const type = (url.searchParams.get("type") || "all").trim();
    if (!TYPES.has(type)) return fail(400, "Unknown type");

    // range (для совместимости с демо API; не применяем фильтрацию по времени)
    const _range = url.searchParams.get("range") || null;

    // pagination (optional)
    const limitParam = url.searchParams.get("limit");
    const offsetParam = url.searchParams.get("offset");
    const limit =
      limitParam == null
        ? undefined
        : Math.min(200, Math.max(1, Number.parseInt(limitParam, 10) || 0));
    const offset = Math.max(0, Number.parseInt(offsetParam || "0", 10) || 0);

    // fetch
    let items = listEvents() || [];
    if (type !== "all") items = items.filter((e) => e.type === type);

    const total = items.length;
    const paged = limit == null ? items : items.slice(offset, offset + limit);

    const page =
      limit == null
        ? undefined
        : {
            total,
            limit,
            offset,
            hasMore: offset + (limit || 0) < total,
          };

    return ok({ items: paged, page });
  } catch (e) {
    console.error("[DEMO][events] GET error:", e);
    return fail(500, "Internal Server Error");
  }
}