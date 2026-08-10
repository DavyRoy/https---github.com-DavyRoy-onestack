import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/push/token — register or refresh FCM token
export async function POST(req: NextRequest) {
  try {
    const { userId } = requireAuth(req);
    const { token, platform } = await req.json();
    if (!token || !platform) return NextResponse.json({ error: "token and platform required" }, { status: 400 });

    await prisma.pushToken.upsert({
      where: { userId_token: { userId, token } },
      create: { userId, token, platform },
      update: { updatedAt: new Date() },
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}

// DELETE /api/push/token — unregister on logout
export async function DELETE(req: NextRequest) {
  try {
    const { userId } = requireAuth(req);
    const { token } = await req.json();
    if (token) {
      await prisma.pushToken.deleteMany({ where: { userId, token } });
    } else {
      await prisma.pushToken.deleteMany({ where: { userId } });
    }
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}
