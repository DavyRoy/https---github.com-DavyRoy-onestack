import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPushToUser } from "@/lib/push";

function checkSecret(req: NextRequest) {
  const secret = req.headers.get("x-internal-secret");
  return secret === (process.env.INTERNAL_SECRET ?? "onestack-internal-2024");
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!checkSecret(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const messages = await prisma.chatMessage.findMany({
    where: { requestId: id },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(messages);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!checkSecret(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const { text, authorName } = await req.json();
  if (!text?.trim()) return NextResponse.json({ error: "text required" }, { status: 400 });
  const msg = await prisma.chatMessage.create({
    data: { requestId: id, role: "manager", text: text.trim(), authorName: authorName ?? "Менеджер" },
  });

  // Push to client
  const request = await prisma.request.findUnique({ where: { id } });
  if (request) {
    sendPushToUser(request.userId, {
      title: authorName ?? "Менеджер",
      body: text.trim().slice(0, 120),
    }, { type: "chat", requestId: id }).catch(() => {});
  }

  return NextResponse.json(msg, { status: 201 });
}
