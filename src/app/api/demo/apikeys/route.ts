// app/api/demo/keys/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  listApiKeys,
  createApiKey,
  disableApiKey,
  rotateApiKey,
} from "../../../../lib/demo/store"; // <-- 3 уровня вверх от /api/demo/keys

// Отключаем статическое кеширование роут-хэндлера
export const dynamic = "force-dynamic";

// --- CORS (для демо можно оставить * или ограничить доменом через env) ---
const ALLOWED_ORIGIN = (process.env.NEXT_PUBLIC_DEMO_ORIGIN ?? "*").trim();
const COMMON_HEADERS: Record<string, string> = {
  "access-control-allow-origin": ALLOWED_ORIGIN,
  "access-control-allow-methods": "GET,POST,DELETE,PATCH,OPTIONS",
  "access-control-allow-headers": "content-type",
  "access-control-max-age": "600",
  "cache-control": "no-store",
};

// Небольшие хелперы для ответов
function ok(data: unknown, init?: ResponseInit) {
  return NextResponse.json(
    { ok: true, data },
    { ...init, headers: { ...COMMON_HEADERS, ...(init?.headers || {}) } },
  );
}
function fail(status: number, message = "Bad Request", extra?: Record<string, unknown>) {
  return NextResponse.json(
    { ok: false, error: message, ...(extra || {}) },
    { status, headers: COMMON_HEADERS },
  );
}
async function readJson<T>(req: NextRequest): Promise<T | null> {
  try {
    return (await req.json()) as T;
  } catch {
    return null;
  }
}
const isNonEmptyString = (v: unknown) =>
  typeof v === "string" && v.trim().length > 0;

// Можно ужесточить формат id при желании
const isId = (v: unknown) =>
  typeof v === "string" && /^[A-Za-z0-9_\-]{6,}$/.test(v);

// --- OPTIONS (preflight) ---
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: COMMON_HEADERS });
}

// --- GET: список ключей ---
export async function GET() {
  try {
    const items = listApiKeys();
    return ok({ items });
  } catch (e) {
    console.error("[API_KEYS][GET] error:", e);
    return fail(500, "Internal Server Error");
  }
}

// --- POST: создать ключ ---
// body: { name?: string; active?: boolean }
type CreateBody = { name?: string; active?: boolean };
export async function POST(req: NextRequest) {
  try {
    const body = (await readJson<CreateBody>(req)) || {};
    const name = isNonEmptyString(body.name) ? body.name!.trim() : "key";
    const active = Boolean(body.active);

    const key = createApiKey(name, active);
    return ok({ id: key.id }, { status: 201 });
  } catch (e) {
    console.error("[API_KEYS][POST] error:", e);
    return fail(500, "Internal Server Error");
  }
}

// --- DELETE: отключить ключ ---
// body: { id: string }
type DeleteBody = { id?: string };
export async function DELETE(req: NextRequest) {
  try {
    const body = await readJson<DeleteBody>(req);
    if (!body || !isId(body.id)) {
      return fail(400, "Invalid or missing id");
    }
    const okFlag = disableApiKey(body.id!);
    if (!okFlag) return fail(404, "Key not found");
    return ok({ id: body.id });
  } catch (e) {
    console.error("[API_KEYS][DELETE] error:", e);
    return fail(500, "Internal Server Error");
  }
}

// --- PATCH: операции над ключом (пока только rotate) ---
// body: { id: string; rotate?: boolean }
type PatchBody = { id?: string; rotate?: boolean };
export async function PATCH(req: NextRequest) {
  try {
    const body = await readJson<PatchBody>(req);
    if (!body || !isId(body.id)) {
      return fail(400, "Invalid or missing id");
    }
    if (!body.rotate) {
      return fail(400, "Nothing to do (set rotate: true)");
    }
    const okFlag = rotateApiKey(body.id!);
    if (!okFlag) return fail(404, "Key not found");
    return ok({ id: body.id, rotated: true });
  } catch (e) {
    console.error("[API_KEYS][PATCH] error:", e);
    return fail(500, "Internal Server Error");
  }
}