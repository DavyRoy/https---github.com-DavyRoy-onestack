// app/api/demo/events/route.ts
import { NextRequest, NextResponse } from "next/server";
import { listEvents } from "../../../../lib/demo/store"; // 3 уровня вверх

// Отключаем статическое кеширование роут-хэндлера
export const dynamic = "force-dynamic";

// --- CORS ---
const ALLOWED_ORIGIN = (process.env.NEXT_PUBLIC_DEMO_ORIGIN ?? "*").trim();
const COMMON_HEADERS: Record<string, string> = {
  "access-control-allow-origin": ALLOWED_ORIGIN,
  "access-control-allow-methods": "GET,OPTIONS",
  "access-control-allow-headers": "content-type",
  "cache-control": "no-store",
};

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

// GET /api/demo/events?limit=50&offset=0
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const limitParam = url.searchParams.get("limit");
    const offsetParam = url.searchParams.get("offset");

    const parsedLimit = Number(limitParam);
    const parsedOffset = Number(offsetParam);

    // безопасный парсинг и границы
    const limit =
      Number.isFinite(parsedLimit) && parsedLimit > 0
        ? Math.min(200, Math.max(1, parsedLimit))
        : undefined; // undefined => вернём все события (старое поведение)
    const offset =
      Number.isFinite(parsedOffset) && parsedOffset >= 0 ? parsedOffset : 0;

    const all = listEvents() || [];

    const items =
      limit == null ? all : all.slice(offset, offset + limit);

    const page =
      limit == null
        ? undefined
        : {
            total: all.length,
            limit,
            offset,
            hasMore: offset + limit < all.length,
          };

    return ok({ items, page });
  } catch (e) {
    console.error("[DEMO][EVENTS][GET] error:", e);
    return fail(500, "Internal Server Error");
  }
}