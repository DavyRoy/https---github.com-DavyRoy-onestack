import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, object } = body;

    if (event !== "payment.succeeded") {
      return NextResponse.json({ ok: true });
    }

    const payment = await prisma.payment.findFirst({
      where: { providerId: object.id },
    });

    if (!payment || payment.status === "SUCCEEDED") {
      return NextResponse.json({ ok: true });
    }

    await prisma.$transaction([
      prisma.payment.update({
        where: { id: payment.id },
        data: { status: "SUCCEEDED" },
      }),
      prisma.user.update({
        where: { id: payment.userId },
        data: { balance: { increment: payment.amount } },
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[payments/webhook]", err);
    return NextResponse.json({ error: "error" }, { status: 500 });
  }
}
