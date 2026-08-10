import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/requests/claim
// Body: { token: string }
// Attaches an anonymous request (identified by claimToken) to the authenticated user
export async function POST(req: NextRequest) {
  try {
    const { userId } = requireAuth(req);
    const { token } = await req.json();
    if (!token) return NextResponse.json({ error: "token required" }, { status: 400 });

    const request = await prisma.request.findUnique({ where: { claimToken: token } });
    if (!request) return NextResponse.json({ error: "Заявка не найдена или уже привязана" }, { status: 404 });

    // Transfer ownership + clear the claim token
    const updated = await prisma.request.update({
      where: { id: request.id },
      data:  { userId, claimToken: null },
    });

    return NextResponse.json(updated);
  } catch (e: any) {
    const status = e.message?.includes("Unauthorized") ? 401 : 500;
    return NextResponse.json({ error: e.message }, { status });
  }
}
