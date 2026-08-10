import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { userId } = requireAuth(req);
    const payments = await prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true, amount: true, status: true,
        description: true, createdAt: true, provider: true,
      },
    });
    return NextResponse.json(payments);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

// Dev-only: mark stub payment as succeeded
export async function PATCH(req: NextRequest) {
  try {
    const { userId } = requireAuth(req);
    const { paymentId } = await req.json();

    const payment = await prisma.payment.findFirst({
      where: { id: paymentId, userId, provider: "stub" },
    });
    if (!payment) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.$transaction([
      prisma.payment.update({ where: { id: payment.id }, data: { status: "SUCCEEDED" } }),
      prisma.user.update({ where: { id: userId }, data: { balance: { increment: payment.amount } } }),
    ]);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
