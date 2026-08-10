import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/requests/[id]/price  body: { action: "accept" | "reject" }
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  let userId: string;
  try {
    ({ userId } = requireAuth(req));
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const { action } = await req.json();
    if (!["accept", "reject"].includes(action)) {
      return NextResponse.json({ error: "action must be accept or reject" }, { status: 400 });
    }

    const existing = await prisma.request.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (existing.priceStatus !== "PROPOSED") {
      return NextResponse.json({ error: "Цена ещё не предложена" }, { status: 400 });
    }

    const priceStatus = action === "accept" ? "ACCEPTED" : "REJECTED";
    // Если принял — переводим заявку в IN_PROGRESS
    const status = action === "accept" ? "IN_PROGRESS" : existing.status;

    const updated = await prisma.request.update({
      where: { id },
      data: { priceStatus, status, ...(action === "accept" && { approvedAt: new Date() }) },
    });

    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
