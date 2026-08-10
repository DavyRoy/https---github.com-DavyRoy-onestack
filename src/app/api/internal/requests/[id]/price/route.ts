import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPushToUser } from "@/lib/push";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const secret = req.headers.get("x-internal-secret");
  if (secret !== (process.env.INTERNAL_SECRET ?? "onestack-internal-2024")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const { id } = await params;
    const { price } = await req.json();
    if (!price || isNaN(Number(price))) {
      return NextResponse.json({ error: "price required" }, { status: 400 });
    }
    const updated = await prisma.request.update({
      where: { id },
      data: { price: Number(price), priceStatus: "PROPOSED" },
    });

    sendPushToUser(updated.userId, {
      title: "Получено коммерческое предложение",
      body: `Менеджер выставил стоимость: ${Number(price).toLocaleString("ru-RU")} ₽`,
    }, { type: "price", requestId: id }).catch(() => {});

    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
