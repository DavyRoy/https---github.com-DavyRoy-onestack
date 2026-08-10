// app/api/demo/roles/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getRoleMatrix, setRoleMatrix } from "../../../../lib/demo/store";
import type { RoleMatrix } from "../../../../lib/demo/types";

// чтобы Next не кешировал результаты этого роута
export const dynamic = "force-dynamic";

// --- CORS / headers ---
const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_DEMO_ORIGIN?.trim() || "*";
const COMMON_HEADERS = {
  "access-control-allow-origin": ALLOWED_ORIGIN,
  "access-control-allow-methods": "GET,POST,OPTIONS",
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

export async function GET() {
  try {
    const matrix = getRoleMatrix();
    return ok({ matrix });
  } catch (e) {
    console.error("[DEMO][roles] GET error:", e);
    return fail(500, "Internal Server Error");
  }
}

/** Рантайм-проверка: объект вида Record<Role, Record<Permission, boolean>> */
function isRoleMatrixOrNull(v: unknown): v is RoleMatrix | null {
  if (v === null) return true;
  if (typeof v !== "object" || v == null) return false;
  // Очень мягкая проверка: хотя бы верхнеуровневые ключи и boolean внутри
  for (const [, perms] of Object.entries(v as Record<string, any>)) {
    if (typeof perms !== "object" || perms == null) return false;
    for (const [, val] of Object.entries(perms)) {
      if (typeof val !== "boolean") return false;
    }
    // роль может быть любой строкой в демо, строгая проверка не обязательна
  }
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const matrix = body?.matrix as unknown;

    if (!isRoleMatrixOrNull(matrix)) {
      return fail(400, "Invalid payload: matrix must be RoleMatrix or null");
    }

    setRoleMatrix(matrix ?? null);
    return ok({}, { status: 201 });
  } catch (e) {
    console.error("[DEMO][roles] POST error:", e);
    return fail(500, "Internal Server Error");
  }
}
