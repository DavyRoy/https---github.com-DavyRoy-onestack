import { NextRequest, NextResponse } from "next/server";
import { requireManager } from "@/lib/manager-auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireManager(req);
    const { id } = await params;
    const { title, startDate, endDate, stages } = await req.json();

    if (!title) return NextResponse.json({ error: "title required" }, { status: 400 });

    const existing = await prisma.project.findUnique({ where: { requestId: id } });
    if (existing) {
      await prisma.stage.deleteMany({ where: { projectId: existing.id } });
      await prisma.project.delete({ where: { id: existing.id } });
    }

    const project = await prisma.project.create({
      data: {
        requestId: id,
        title,
        startDate: startDate ? new Date(startDate) : null,
        endDate:   endDate   ? new Date(endDate)   : null,
        stages: {
          create: (stages ?? []).map((s: any, i: number) => ({
            title: s.title,
            description: s.description ?? null,
            order: i,
            status: "PENDING",
          })),
        },
      },
      include: { stages: { orderBy: { order: "asc" } } },
    });

    const request = await prisma.request.findUnique({ where: { id } });
    if (request && ["NEW", "IN_REVIEW"].includes(request.status)) {
      await prisma.request.update({ where: { id }, data: { status: "APPROVED" } });
    }

    return NextResponse.json(project, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
