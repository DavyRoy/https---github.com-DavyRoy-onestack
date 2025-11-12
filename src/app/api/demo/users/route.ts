// app/api/demo/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { listUsers, addUser } from "../../../../lib/demo/store";
import type { Role } from "../../../../lib/demo/types";

export const dynamic = "force-dynamic";

// --- CORS / headers ---
const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_DEMO_ORIGIN?.trim() || "*";
const COMMON_HEADERS = {
  "access-control-allow-origin": ALLOWED_ORIGIN,
  "access-control-allow-methods": "GET,POST,OPTIONS",
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

// Простой email-проверитель
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: COMMON_HEADERS });
}

export async function GET() {
  try {
    const items = listUsers();
    return ok({ items });
  } catch (e) {
    console.error("[DEMO][users] GET error:", e);
    return fail(500, "Internal Server Error");
  }
}

type PostBody = {
  email?: string;
  name?: string;
  role?: Role | string;
  active?: boolean;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as PostBody;

    const email = String(body?.email ?? "").trim().toLowerCase();
    const name = String(body?.name ?? "").trim();
    const roleStr = String(body?.role ?? "user").trim().toLowerCase();
    const active = Boolean(body?.active);

    if (!email || !EMAIL_RE.test(email)) {
      return fail(400, "Invalid email");
    }
    if (!name) {
      return fail(400, "Name is required");
    }

    // допустимые роли из демо
    const allowedRoles: Role[] = ["user", "manager", "admin"];
    const role = allowedRoles.includes(roleStr as Role)
      ? (roleStr as Role)
      : null;
    if (!role) {
      return fail(400, "Invalid role");
    }

    // простая защита от дубликатов по email (для демо)
    const exists = listUsers().some((u) => u.email.toLowerCase() === email);
    if (exists) {
      return fail(409, "User with this email already exists");
    }

    const u = addUser({ email, name, role, active });
    return ok({ id: u.id }, { status: 201 });
  } catch (e) {
    console.error("[DEMO][users] POST error:", e);
    return fail(500, "Internal Server Error");
  }
}