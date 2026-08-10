import { NextRequest, NextResponse } from "next/server";
import { requireManager } from "@/lib/manager-auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireManager(req);
    const { id } = await params;
    const body = await req.json();
    const sub = await prisma.subTask.update({ where: { id }, data: body });
    return NextResponse.json(sub);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireManager(_req);
    const { id } = await params;
    await prisma.subTask.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
