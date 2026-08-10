import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = requireAuth(req);
    const { id } = await params;
    const request = await prisma.request.findFirst({
      where: { id, userId },
      include: { project: { include: { stages: { orderBy: { order: "asc" } } } } },
    });
    if (!request) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(request);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
