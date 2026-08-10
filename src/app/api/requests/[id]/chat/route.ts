import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = requireAuth(req);
    const { id } = await params;
    const request = await prisma.request.findFirst({ where: { id, userId } });
    if (!request) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const messages = await prisma.chatMessage.findMany({
      where: { requestId: id },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(messages);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = requireAuth(req);
    const { id } = await params;
    const request = await prisma.request.findFirst({ where: { id, userId } });
    if (!request) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const { text } = await req.json();
    if (!text?.trim()) return NextResponse.json({ error: "text required" }, { status: 400 });
    const msg = await prisma.chatMessage.create({
      data: { requestId: id, role: "client", text: text.trim() },
    });
    return NextResponse.json(msg, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}
