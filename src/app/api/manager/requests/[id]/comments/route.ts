import { NextRequest, NextResponse } from "next/server";
import { requireManager } from "@/lib/manager-auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireManager(_req);
    const { id } = await params;
    const comments = await prisma.requestComment.findMany({
      where: { requestId: id },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(comments);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireManager(req);
    const { id } = await params;
    const { text, isSystem } = await req.json();
    const comment = await prisma.requestComment.create({
      data: { requestId: id, author: "manager", text, isSystem: isSystem ?? false },
    });
    return NextResponse.json(comment, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
