import { NextRequest, NextResponse } from "next/server";
import { requireManager } from "@/lib/manager-auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    requireManager(req);
    const { id } = await params;
    const { status } = await req.json();
    const stage = await prisma.stage.update({
      where: { id },
      data: {
        status,
        completedAt: status === "COMPLETED" ? new Date() : null,
      },
    });

    if (status === "IN_PROGRESS") {
      const project = await prisma.project.findUnique({ where: { id: stage.projectId } });
      if (project) {
        await prisma.request.update({ where: { id: project.requestId }, data: { status: "IN_PROGRESS" } });
      }
    }
    if (status === "COMPLETED") {
      const allStages = await prisma.stage.findMany({ where: { projectId: stage.projectId } });
      if (allStages.every(s => s.id === id || s.status === "COMPLETED")) {
        const project = await prisma.project.findUnique({ where: { id: stage.projectId } });
        if (project) {
          await prisma.request.update({ where: { id: project.requestId }, data: { status: "COMPLETED" } });
        }
      }
    }

    return NextResponse.json(stage);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
