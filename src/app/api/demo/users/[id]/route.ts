// app/api/demo/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { updateUser, removeUser, listUsers } from "../../../../../lib/demo/store";

export const dynamic = "force-dynamic";

// --- CORS / headers ---
const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_DEMO_ORIGIN?.trim() || "*";
const COMMON_HEADERS = {
  "access-control-allow-origin": ALLOWED_ORIGIN,
  "access-control-allow-methods": "GET,PATCH,DELETE,OPTIONS",
  "access-control-allow-headers": "content-type",
  "cache-control": "no-store",
} as const;

function ok(payload: unknown, init?: ResponseInit) {
  return NextResponse.json(
    { ok: true, ...payload },
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

// Email и роли (подправьте под своё демо при необходимости)
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
const ROLES = new Set(["user", "manager", "admin"]);

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id?.trim();
    if (!id) return fail(400, "Missing id");

    const raw = await req.json().catch(() => ({} as any));

    // Разрешаем частичное обновление, валидируем только переданные поля
    const patch: Record<string, unknown> = {};

    if (raw.email !== undefined) {
      const email = String(raw.email).trim().toLowerCase();
      if (!email || !EMAIL_RE.test(email)) return fail(400, "Invalid email");

      // если email меняется — проверим, что не занят другим пользователем
      const exists = listUsers().some((u) => u.email.toLowerCase() === email && u.id !== id);
      if (exists) return fail(409, "User with this email already exists");

      patch.email = email;
    }
    if (raw.name !== undefined) {
      const name = String(raw.name).trim();
      if (!name) return fail(400, "Name cannot be empty");
      patch.name = name;
    }
    if (raw.role !== undefined) {
      const role = String(raw.role).trim();
      if (!ROLES.has(role)) return fail(400, "Invalid role");
      patch.role = role;
    }
    if (raw.active !== undefined) {
      patch.active = Boolean(raw.active);
    }

    if (Object.keys(patch).length === 0) {
      return fail(400, "Nothing to update");
    }

    const updated = updateUser(id, patch as any);
    if (!updated) return fail(404, "Not found");

    return ok({ item: updated });
  } catch (e) {
    console.error("[DEMO][users/:id] PATCH error:", e);
    return fail(500, "Internal Server Error");
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id?.trim();
    if (!id) return fail(400, "Missing id");
    const okFlag = removeUser(id);
    if (!okFlag) return fail(404, "Not found");
    return new NextResponse(null, { status: 204, headers: COMMON_HEADERS });
  } catch (e) {
    console.error("[DEMO][users/:id] DELETE error:", e);
    return fail(500, "Internal Server Error");
  }
}

// (опционально) GET одного пользователя
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id?.trim();
    if (!id) return fail(400, "Missing id");
    const u = listUsers().find((x) => x.id === id);
    if (!u) return fail(404, "Not found");
    return ok({ item: u });
  } catch (e) {
    console.error("[DEMO][users/:id] GET error:", e);
    return fail(500, "Internal Server Error");
  }
}