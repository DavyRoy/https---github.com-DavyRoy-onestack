import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPushToUser } from "@/lib/push";

const STATUS_LABELS: Record<string, string> = {
  NEW:        "Новая",
  IN_REVIEW:  "На рассмотрении",
  IN_WORK:    "В работе",
  DONE:       "Выполнена",
  CANCELLED:  "Отменена",
};

function checkSecret(req: NextRequest) {
  return req.headers.get("x-internal-secret") === (process.env.INTERNAL_SECRET ?? "onestack-internal-2024");
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!checkSecret(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    const { id } = await params;
    const { status } = await req.json();
    if (!status) return NextResponse.json({ error: "status required" }, { status: 400 });

    const updated = await prisma.request.update({ where: { id }, data: { status } });

    const label = STATUS_LABELS[status] ?? status;
    sendPushToUser(updated.userId, {
      title: "Статус заявки изменён",
      body: `Заявка #${id.slice(0, 6).toUpperCase()} — ${label}`,
    }, { type: "status", requestId: id, status }).catch(() => {});

    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
