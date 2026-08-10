import { NextRequest, NextResponse } from "next/server";
import { requireManager } from "@/lib/manager-auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    requireManager(req);
    const { searchParams } = new URL(req.url);
    const status   = searchParams.get("status")   ?? undefined;
    const priority = searchParams.get("priority") ?? undefined;
    const type     = searchParams.get("type")     ?? undefined;
    const search   = searchParams.get("search")   ?? undefined;

    const requests = await prisma.request.findMany({
      where: {
        ...(status   ? { status:   status   as any } : {}),
        ...(priority ? { priority: priority as any } : {}),
        ...(type     ? { type:     type     as any } : {}),
        ...(search ? {
          OR: [
            { user: { email:   { contains: search } } },
            { user: { name:    { contains: search } } },
            { user: { company: { contains: search } } },
            { service: { contains: search } },
          ],
        } : {}),
      },
      orderBy: [
        // URGENT first, then by date
        { priority: "desc" },
        { createdAt: "desc" },
      ],
      include: {
        user: { select: { id: true, email: true, name: true, phone: true, company: true } },
        project: {
          include: {
            stages: {
              orderBy: { order: "asc" },
              include: { subtasks: { orderBy: { order: "asc" } } },
            },
          },
        },
        chatMessages: { orderBy: { createdAt: "desc" }, take: 1 },
        files:        { orderBy: { createdAt: "desc" }, take: 3 },
        _count:       { select: { comments: true, files: true } },
      },
    });
    return NextResponse.json(requests);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}
