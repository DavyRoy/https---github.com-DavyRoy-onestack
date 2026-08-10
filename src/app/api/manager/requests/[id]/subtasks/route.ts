import { NextRequest, NextResponse } from "next/server";
import { requireManager } from "@/lib/manager-auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireManager(req);
    const { id } = await params;
    const { stageId, title, order } = await req.json();
    const stage = await prisma.stage.findFirst({
      where: { id: stageId, project: { requestId: id } },
    });
    if (!stage) return NextResponse.json({ error: "Stage not found" }, { status: 404 });
    const sub = await prisma.subTask.create({ data: { stageId, title, order: order ?? 0 } });
    return NextResponse.json(sub, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}
